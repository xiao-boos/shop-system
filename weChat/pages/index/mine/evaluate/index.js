import {createStoreBindings} from 'mobx-miniprogram-bindings'
const computedBehavior = require('miniprogram-computed').behavior

import {orderStore} from '../../../../store/index'
import utils from "../../../../utils/index"
import constants from "../../../../common/constants"
import { orderPageFilter } from "../../../../utils/order-utils"
import { navigateTo } from "../../../../utils/wxUtils"
const app = getApp()

Page({
	behaviors: [computedBehavior],
	data: {
		activeIndex: 0, // 当前选择的订单状态
		currCategory: '0', // 接口所需的商品分类，默认全部
		orderStatus: '待评价',
		pageIndex: 1,
		pageSize: 10,
		totalRecords: 0, // 总记录数
		scrollHeight: 0, // 列表滚动区高度
		currToPayTotalAmount: '', // 当前选择订单的总金额
		currToPayOutTradeNo: '', // 当前选择订单的订单号
		triggered: false,
		tabBarList: [
			{
				index: 0,
				text: '待评价',
			},
			{
				index: 1,
				text: '已评价',
			}
		],
		categoryList: [],
        currCategoryList: [], // 当前订单列表
        popupShow:false,
        score:'',
        comment:'',
        outTradeNo:'',
        photoIcon: `${constants.imageBaseUrl}/swdj/photo_icon.png`,
        fileList: [],
        picUrl: constants.CONST_API,
        showCommentPopup:false,
        currOrderDetail: {},
	},
	computed: {
		getPic() {
			return `${constants.imageBaseUrl}/order/empty_order.png`
		}
    },
     /**
     * 点击评价按钮
     */
    OnshowCommentPopup(e) {
        this.setData({
            showCommentPopup: true,
            currOrderDetail:{
                score:e.detail.score?e.detail.score:0,
                outTradeNo:e.detail.outTradeNo,
                comment:e.detail.comment?e.detail.comment:'',
                pictureFileId:e.detail.pictureFileId?e.detail.pictureFileId:[],
            }
        })
    },
    closeShowCommentPopup(e) {
        if(e.detail){
            wx.showToast({
                title: '提交成功，感谢您的评价',
                icon: 'none',
                duration: 2000,
            })
        }
        this.setData({
            showCommentPopup: false,
            currOrderDetail:{
                score:'',
                outTradeNo:'',
                comment:'',
                pictureFileId:[],
            }
        })
    },
	/**
	 * 切换订单状态
	 * @param {Event} e
	 */
	selectTab(e) {
		const {index, text} = e.currentTarget.dataset
		this.setOrderStatus(index)
		this.setData({
			activeIndex: index,
			orderStatus: text,
			pageIndex: 1,
			totalRecords: 0,
			currCategoryList: [],
			currCategory: '0'
		})
		this.queryOrderList()
	},

	async onScrollRefresh() {
		const that = this
		this.setData({
			pageIndex: 1
		})
		await this.queryOrderList(false, true)

		setTimeout(() => {
			that.setData({
				triggered: false,
			})
			wx.showToast({
				title: '已刷新',
				icon: 'none'
			})
		}, 1000)
    },
    navigateToDetailPage(e) {
		const {orderType, orderInfo} = e.detail
			const url = orderPageFilter('2', orderInfo)
			app.globalData.currOrderInfo = orderInfo
			navigateTo(url, {
				orderType: '2',
				orderInfo: orderInfo,
				outTradeNo: orderInfo.outTradeNo
			})
	},
	/**
	 * 组件回调触发刷新列表
	 */
	refreshCommenQuery() {
		this.setData({
			pageIndex: 1
		})
		this.queryOrderList(false, true)
	},
	/**
	 * 滚动加载列表
	 */
	loadMore() {
		this.queryOrderList(true)
	},
	refreshOrder() {
		this.setData({
			pageIndex: 1
		})
		this.queryOrderList(false)
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
        let newrecordList = []
        if(this.data.activeIndex === 0){
            recordList.forEach(record => {
                record.templateName = this.getTemplateName(record.category)
                if(record.hasCommented == this.data.activeIndex){
                    newrecordList.push(record)
                }
            })
        }else if(this.data.activeIndex === 1){
            recordList.forEach(record => {
                if(record.pictureFileId){
                    record.pictureFileId =  record.pictureFileId.split(',')
                }else{
                    record.pictureFileId = []
                }
            })
            newrecordList = recordList
        }
		return newrecordList
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
            //查询已完成的订单
			const {recordList, totalRecords} = ''
			this.handleRequestOrderRes({recordList, totalRecords, scrollPageFlag})
		} catch (e) {
			console.log(e)
		}
	},
	/**
	 * 获取屏幕剩余高度
	 */
	getScrollHeight() {
		const that = this
		wx.getSystemInfo({
			success: (res) => {
				const screenHeight = res.windowHeight
				wx.createSelectorQuery().selectAll('#mark').boundingClientRect((rect) => {
					const contentHeight = rect[0].height
					const remainingHeight = screenHeight - contentHeight - 20
					that.setData({
						scrollHeight: `${remainingHeight}px`
					})
				}).exec()
			}
		})
    },
    //关闭评价弹框
    setpopupshow(e){
        this.setData({
            showCommentPopup:false
        })
    },
	onHide() {
		this.setData({
			pageIndex: 1
		})
	},
	onReady() {
	},
	onLoad(options) {
        this.orderStoreInstance = createStoreBindings(this, {
            store: orderStore,
            fields: ['selectedOrderStatus'],
			actions: ['setOrderStatus', 'setSelectedOrderStatus'],
        })
        this.orderStoreInstance.updateStoreBindings()
	},
	onShow() {
		if (this.data.showCommentPopup === false) {
			this.queryOrderList(false)
		}
	},
	onUnload() {
        this.orderStoreInstance.destroyStoreBindings()
	}
})