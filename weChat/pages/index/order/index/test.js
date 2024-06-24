import {createStoreBindings} from 'mobx-miniprogram-bindings'
const computedBehavior = require('miniprogram-computed').behavior

import {orderStore, authStore} from '../../../../store/index'
import utils from "../../../../utils/index"
import constants from "../../../../common/constants"
import {relaunch} from "../../../../utils/wxUtils"

const app = getApp()

Page({
	behaviors: [computedBehavior],
	data: {
		activeIndex: 0, // 当前选择的订单状态
		selectedCategory: 0, // 当前选择的商品分类
		currCategory: '0', // 接口所需的商品分类，默认全部
		orderStatus: '待支付',
		pageIndex: 1,
		pageSize: 10,
		totalRecords: 0, // 总记录数
		scrollHeight: 0, // 列表滚动区高度
		showPaymentPopup: false, // 支付方式弹窗
		currToPayTotalAmount: '', // 当前选择订单的总金额
		currToPayOutTradeNo: '', // 当前选择订单的订单号
		currToPayCategory: null, // 当前选择订单的服务大类
		tabBarList: [
			{
				index: 0,
				text: '待支付',
			},
			{
				index: 1,
				text: '执行中',
			},
			{
				index: 2,
				text: '已完成',
			},
			{
				index: 3,
				text: '已取消',
			}
		],
		categoryList: [
			{
				index: 0,
				category: '0',
				text: '全部',
			},
			{
				index: 1,
				category: '1,2',
				text: '点餐购物',
			},
			{
				index: 2,
				category: '3',
				text: '陪护服务',
			},
			{
				index: 3,
				category: '4',
				text: '陪诊服务',
			},
			{
				index: 4,
				category: '5',
				text: '陪护床租借',
			},
			{
				index: 5,
				category: '6',
				text: '物品寄存',
			},
			{
				index: 6,
				category: '8',
				text: '轮椅租借',
			},
		],
		currCategoryList: [] // 当前订单列表
	},
	computed: {
		getPic() {
			return `${constants.imageBaseUrl}/order/empty_order.png`
		}
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
			selectedCategory: 0,
			currCategory: '0'
		})
		this.queryOrderList()
	},
	/**
	 * 选择订单类别
	 * @param {Event} e
	 */
	chooseCategory(e) {
		const {type, category} = e.currentTarget.dataset
		this.setData({
			selectedCategory: type,
			currCategory: category,
			pageIndex: 1,
			totalRecords: 0,
			currCategoryList: []
		})
		this.queryOrderList()
	},
	/**
	 * 卡片组件触发继续支付事件
	 */
	OnContinueToPay(e) {
		this.setData({
			showPaymentPopup: true,
			currToPayTotalAmount: e.detail.totalAmount,
			currToPayOutTradeNo: e.detail.outTradeNo,
			currToPayCategory: e.detail.category
		})
	},
	/**
	 * 组件回调触发刷新列表
	 */
	refreshQuery() {
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
		let templateName = ''
		switch (category) {
			case 1:
				templateName = 'shopping'
				break
			case 2:
				templateName = 'shopping'
				break
			case 3:
				templateName = 'peihu'
				break
			case 4:
				templateName = 'peizhen'
				break
			case 5:
				templateName = 'bedAndWheel'
				break
			case 6:
				templateName = 'jicun'
				break
			case 8:
				templateName = 'bedAndWheel'
				break
			default:
				break
		}
		return templateName
	},
	/**
	 * 设置模板名字
	 * @param recordList 请求返回列表
	 * @return {*}
	 */
	setTemplate(recordList) {
		recordList.forEach(record => {
			record.templateName = this.getTemplateName(record.category)
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
	},
	/**
	 * 查询订单相关信息
	 * @param scrollPageFlag 是否由滚动触发
	 * @param manualTrigger 是否是组件回调触发
	 * @return {Promise<void>}
	 */
	async queryOrderList(scrollPageFlag, manualTrigger = false) {
		try {
			if (!manualTrigger && this.data.totalRecords > 0 && this.data.currCategoryList.length === this.data.totalRecords) {
				return wx.showToast({
					title: '没有更多数据了~',
					icon: 'none'
				})
			}
			const res = await utils.get('/convenience-server/wxapp/custom/my-order/001/list', {
				pageIndex: this.data.pageIndex,
				pageSize: this.data.pageSize,
				status: this.data.activeIndex,
				category: this.data.currCategory
			})
			const {recordList, totalRecords} = res
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
					const contentHeight = rect.reduce((pre, cur) => {
						pre += cur.height
						return pre
					}, 0)
					const remainingHeight = screenHeight - contentHeight
					that.setData({
						scrollHeight: remainingHeight + 'px'
					})
				}).exec()
			}
		})
	},
	onHide() {
		this.setControlCancelPopupShow(false)
		this.setData({
			pageIndex: 1
		})
	},
	onReady() {
	},
	onLoad(options) {
		if (wx.getStorageSync('convenience-login') !== 'true') {
			relaunch('auth', {
				from: 'index/order'
			})
			return
		}
		this.orderStoreInstance = createStoreBindings(this, {
			store: orderStore,
			actions: ['setOrderStatus', 'setControlCancelPopupShow'],
		})
		this.authStoreInstance = createStoreBindings(this, {
			store: authStore,
			fields: ['token']
		})
		this.orderStoreInstance.updateStoreBindings()
		this.authStoreInstance.updateStoreBindings()
		this.getScrollHeight()
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
		this.orderStoreInstance.destroyStoreBindings()
		this.authStoreInstance.destroyStoreBindings()
	}
})