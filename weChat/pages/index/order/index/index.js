import {createStoreBindings} from 'mobx-miniprogram-bindings'
import Toast from '@vant/weapp/toast/toast'

const computedBehavior = require('miniprogram-computed').behavior

import {orderStore, authStore} from '../../../../store/index'
import utils from "../../../../utils/index"
import constants from "../../../../common/constants"
import { navigateTo, relaunch } from "../../../../utils/wxUtils"

import { btnFilter, orderPageFilter } from "../../../../utils/order-utils"

const app = getApp()

const priceTypeMap = {
	1: '上午',
	2: '下午',
	3: '全天'
}

Page({
	behaviors: [computedBehavior],
	listLoading: false,
	data: {
    currCategoryList:[],
    activeIndex: 1, // 当前选择的订单状态
    tabBarList:  [
      {
        index: 1,
        text: '待收货',
      },
      {
        index: 2,
        text: '已完成',
      },
      {
        index: 3,
        text: '已退货',
      }
    ],
    orderStatus: 0,
		pageIndex: 1,
		pageSize: 10,
		totalRecords: 0, // 总记录数
		scrollHeight: 0, // 列表滚动区高度
		currToPayOutTradeNo: '', // 当前选择订单的订单号
		triggered: false, // 下拉刷新控制
		currToRefundcategory: null,
  },
  	/**
	 * 切换订单状态
	 * @param {Event} e
	 */
	selectTab(e) {
		const {index, text} = e.currentTarget.dataset
		this.setData({
			activeIndex: index,
			orderStatus: index,
			pageIndex: 1,
			totalRecords: 0,
		})
		this.queryOrderList()
  },
  
	/**
	 * 查询订单相关信息
	 * @param scrollPageFlag 是否由滚动触发
	 * @param manualTrigger 是否是组件回调触发
	 * @return {Promise<void>}
	 */
	async queryOrderList(scrollPageFlag, manualTrigger = false) {
		try {
			if (scrollPageFlag && !manualTrigger && this.data.totalRecords > 0 && this.data.currCategoryList.length === this.data.totalRecords) {
				return wx.showToast({
					title: '没有更多数据了~',
					icon: 'none'
				})
			}
			if (scrollPageFlag && this.listLoading) return
      var res = '{"totalRecords":59,"recordList":[{"outTradeNo":"01002024032816340099391164","category":2,"cspId":"mark001","cspName":"生活百货","totalAmount":"0.10","beginDate":"2024-03-28 16:53:55","endDate":"2024-03-28 17:03:55","hasCommented":1,"orderStatus":7,"productList":[{"productId":"7","productName":"乐视薯片","workerPhone":"","pictureFileId":"ls5.png","price":"0.10","priceType":"","count":1,"sendTime":"","address":"","cspId":"","introduction":"100g","inventory":5,"outTradeNo":"01002024032816340099391165"}],"backPayStatus":0,"refundReason":"商品质量有问题","refundTime":"2024-05-15 14:41:56","refundRevokeTime":"2024-05-15 14:42:41","refundFinishTime":"","refundId":"","refundAmt":"","ampm":"","receiveStatus":0},{"outTradeNo":"01002024032816340099391164","category":2,"cspId":"mark001","cspName":"生活百货","totalAmount":"0.10","beginDate":"2024-03-28 16:53:55","endDate":"2024-03-28 17:03:55","hasCommented":1,"orderStatus":7,"productList":[{"productId":"7","productName":"乐视薯片","workerPhone":"","pictureFileId":"ls5.png","price":"0.10","priceType":"","count":1,"sendTime":"","address":"","cspId":"","introduction":"100g","inventory":5,"outTradeNo":"01002024032816340099391164"}],"backPayStatus":0,"refundReason":"商品质量有问题","refundTime":"2024-05-15 14:41:56","refundRevokeTime":"2024-05-15 14:42:41","refundFinishTime":"","refundId":"","refundAmt":"","ampm":"","receiveStatus":0},{"outTradeNo":"01002024032816340099391164","category":2,"cspId":"mark001","cspName":"生活百货","totalAmount":"0.10","beginDate":"2024-03-28 16:53:55","endDate":"2024-03-28 17:03:55","hasCommented":1,"orderStatus":7,"productList":[{"productId":"7","productName":"乐视薯片","workerPhone":"","pictureFileId":"ls5.png","price":"0.10","priceType":"","count":1,"sendTime":"","address":"","cspId":"","introduction":"100g","inventory":5,"outTradeNo":"01002024032816340099391164"}],"backPayStatus":0,"refundReason":"商品质量有问题","refundTime":"2024-05-15 14:41:56","refundRevokeTime":"2024-05-15 14:42:41","refundFinishTime":"","refundId":"","refundAmt":"","ampm":"","receiveStatus":0},{"outTradeNo":"01002024032816340099391164","category":2,"cspId":"mark001","cspName":"生活百货","totalAmount":"0.10","beginDate":"2024-03-28 16:53:55","endDate":"2024-03-28 17:03:55","hasCommented":1,"orderStatus":7,"productList":[{"productId":"7","productName":"乐视薯片","workerPhone":"","pictureFileId":"ls5.png","price":"0.10","priceType":"","count":1,"sendTime":"","address":"","cspId":"","introduction":"100g","inventory":5,"outTradeNo":"01002024032816340099391164"}],"backPayStatus":0,"refundReason":"商品质量有问题","refundTime":"2024-05-15 14:41:56","refundRevokeTime":"2024-05-15 14:42:41","refundFinishTime":"","refundId":"","refundAmt":"","ampm":"","receiveStatus":0}]}'
			const {recordList, totalRecords} = JSON.parse(res)
			this.handleRequestOrderRes({recordList, totalRecords, scrollPageFlag})
		} catch (e) {
			console.log(e)
		}
  },
  /**
	 * 根据大类获取模板
	 * @param category 服务大类
	 * @return {string} 模板名字
	 */
	getTemplateName(category) {
		const categoryTemplateMap = {
			'1': 'shopping',
			'2': 'shopping',
			'3': 'peihu',
			'4': 'peizhen',
			'5': 'bedAndWheel',
			'6': 'jicun',
			'8': 'bedAndWheel'
		}
		return categoryTemplateMap[category.toString()]
	},
  	/**
	 * 设置模板名字
	 * @param recordList 请求返回列表
	 * @return {*}
	 */
	setTemplate(recordList) {
		recordList.forEach(record => {
			record.templateName = this.getTemplateName(record.category)
      let btnArr = []
      if(this.data.activeIndex == 1){
        btnArr.push({
          text: '退货',
          className: 'gray-btn',
          methodName: 'cancelOrder'
        },{
          text: '确认完成',
          className: 'primary-btn',
          methodName: 'confirmFinish'
        })
      }else if(this.data.activeIndex == 2 || this.data.activeIndex == 3){
        btnArr.push({
          text: '删除',
          className: 'gray-btn',
          methodName: 'delete'
        })
      }
     
			record.btnArr = btnArr
		})
		return recordList
	},
  	/**
	 * 处理请求结果
	 * @param recordList 订单数组
	 * @param totalRecords 总记录数
	 * @param scrollPageFlag 是否滚动触发
	 */
	handleRequestOrderRes({recordList, totalRecords, scrollPageFlag}) {
		const filteredRecordList = this.setTemplate(recordList)
		if (scrollPageFlag) {
			const existList = this.data.currCategoryList
			const newRecordList = existList.concat(filteredRecordList)
			this.setData({
				pageIndex: this.data.pageIndex + 1,
				totalRecords,
				currCategoryList: newRecordList
			})
		} else {
			this.setData({
				pageIndex: this.data.pageIndex + 1,
				currCategoryList: filteredRecordList,
				totalRecords
			})
		}
		this.getScrollHeight()
	},	/**
  * 获取屏幕剩余高度，用于滚动
  */
 getScrollHeight() {
   const that = this
   wx.getSystemInfo({
     success: (res) => {
       const screenHeight = res.windowHeight
       wx.createSelectorQuery().selectAll('#mark').boundingClientRect((rect) => {
         const contentHeight = rect[0].height
         const ratio = 750 / screenHeight
         const bottomTabBarHeight = 220 * ratio
         const remainingHeight = screenHeight - contentHeight - bottomTabBarHeight
         that.setData({
           scrollHeight: `${remainingHeight+200}px`
         })
       }).exec()
     }
   })
 },
	onReady() {
		this.getScrollHeight()
	},
	onLoad(options) {
		this.orderStoreInstance = createStoreBindings(this, {
			store: orderStore
		})
  },
  /**
  * 由组件触发，订单操作之后刷新列表
  */
 refreshOrder() {
   this.setData({
     pageIndex: 1
   })
   this.queryOrderList(false)
 },
	onShow() {
    this.queryOrderList(false)
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				// 当前页面的 tabBar 索引
				active: 1
			})
		}
	},
	onUnload() {
	},
})