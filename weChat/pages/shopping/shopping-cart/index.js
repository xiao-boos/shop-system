import {createStoreBindings} from 'mobx-miniprogram-bindings'
import Decimal from "decimal.js";

import {shopStore} from '../../../store/index'
import constants from "../../../common/constants"
import {getPageParams, navigateTo} from "../../../utils/wxUtils"
import utils from "../../../utils/index"
import {getTodayAndTomorrow} from "../../../utils/date"
import {getFormattedToday} from "../../../utils/shopping-cart-utils"

const computedBehavior = require('miniprogram-computed').behavior

Page({
	behaviors: [computedBehavior],
	distance: 0,
	data: {
		picUrl: constants.CONST_API,
		isShop: false,
		remainingHeight: '', // 剩余高度
		linePos: null,
		deviceHeight: null,
		animation: null,
		bux_x: '',
		bux_y: '',
		selectedIndex: 0, // 当前选择左侧菜单索引
		selectedId: 'item0', // 当前显示元素的 id
		scrollTop: 0, // 到顶部的距离
		heightArr: [], // 右侧分类的高度累加数组
		scrollVal: 0,
		currentIndex: 0,
		platformIdIndex: '',
		cartList: [], // 已选中的商品
		totalPrice: '0',
		popupShow: false,
		animationData: null, //动画效果
		markShow: false,
		serviceTypes: [], // 渲染商品数据
		selectedMealTime: {}, // 选择早中晚餐的对应时间
		currSelectedDate: getFormattedToday(), // 当前选择时间
		leftHeight: 0,
		stopPopupShow: false, // 商家暂停营业弹窗控制
		suspendDate: '', // 暂停营业弹窗的恢复时间
    haveMultiCanteens: false, // 是否有多个店铺
    searchVale:''//搜索内容
	},
	computed: {
		getPic() {
			return {
				bannerPic: `${constants.imageBaseUrl}/shopping/st_bg@2x.png`,
				shopPic: `${constants.imageBaseUrl}/shopping/shoplogo_pic@2x.png`,
				cartPic: `${constants.imageBaseUrl}/shopping/shopping_icon.png`,
				plusPic: `${constants.imageBaseUrl}/shopping/plus_icon.png`,
				minusPic: `${constants.imageBaseUrl}/shopping/minus_icon.png`,
			}
		},
  },
  onSearch() {
    wx.showToast({
      title: this.data.scrollVal,
      icon: 'none'
    })
  },
	/**
	 * 选择左边菜单栏
	 * @param {Event} e
	 */
	chooseType(e) {
		const {pos, id} = e.currentTarget.dataset
		this.setData({
			selectedIndex: pos,
			selectedId: id,
		})
	},
	/**
	 * 选择日期
	 * @param {Event} event
	 */
	chooseDate(event) {
		const {index, item} = event.currentTarget.dataset
		this.setData({
			tabIndex: index,
			currSelectedDate: item.dateString
		})
	},
	/**
	 * 点击隐藏遮罩，同时隐藏购物车弹窗
	 */
	hideMask({isManualHide}) {
		this.setData({
			markShow: false
		})
		this.showCartList({isManualHide})
	},
	preventTouchMove(e) {
		e.preventDefault()
	},
	
	/**
	 * 点击显示购物车弹窗
	 * @param {Boolean} isManualHide 是否在代码中手动触发收起购物车（当购物车内删除全部商品时）
	 */
	showCartList({isManualHide}) {
		let that = this
		if (this.data.cartList.length === 0) {
			wx.showToast({
				title: '购物车内没有商品哦~',
				icon: 'none',
				duration: 1500
			})
			if (!isManualHide) return
		}
		let popupShow = that.data.popupShow
		popupShow = !popupShow
		
		this.animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease',
		})
		if (popupShow) {
			this.setData({
				popupShow: popupShow,
				markShow: true
			})
			that.fadeIn()//显示动画
		} else {
			that.fadeDown()//隐藏动画
			let time = setTimeout(function () {
				this.setData({
					popupShow: popupShow,
					markShow: false
				})
				clearTimeout(time)
			}.bind(this), 500)//先执行下滑动画，再隐藏模块
		}
	},
	/**
	 * 弹出
	 */
	fadeIn() {
		this.animation.translateY(0).opacity(1).step()
		this.setData({
			animationData: this.animation.export()
		})
	},
	/**
	 * 隐藏
	 */
	fadeDown() {
		this.animation.translateY(300).opacity(0).step()
		this.setData({
			animationData: this.animation.export(),
		})
	},
	onClose() {
		this.setData({
			popupShow: false
		})
	},
	/**
	 * 添加至购物车
	 * @param e {Event}
	 */
	calcShoppingCart(e) {
		const {pid, type} = e.currentTarget.dataset
		const {serviceTypes, cartList} = this.data
		outerLoop: for (const item of serviceTypes) {
			for (const product of item.services) {
				const cartIndex = cartList.findIndex(cartItem => cartItem.productId === pid)
				const cartItem = cartList[cartIndex]
				if (cartIndex !== -1  && type === 'add' && (product.productId === pid) && (cartItem.count >= product.inventory)) {
					wx.showToast({
						title: '购买商品数量已大于库存',
						icon: 'none',
					})
					break outerLoop
				}
				if (product.productId === pid) {
					if (type === 'minus' && product.count > 0) {
						product.count--
						if (product.count === 0 && cartIndex !== -1) {
							cartList.splice(cartIndex, 1)
						}
					} else if (type === 'add') {
						product.count++
						if (cartIndex === -1) cartList.push(product)
					}
					break outerLoop
				}
			}
		}
		const totalPrice = this._getCurrTotalPrice(cartList)
		
		this.setData({
			serviceTypes,
			cartList,
			totalPrice
		})
		// 当购物车弹窗内没有商品时隐藏购物车
		if (this.data.popupShow === true && cartList.length === 0) {
			this.hideMask({isManualHide: true})
		}
	},
	/**
	 * 点击立即下单
	 */
	confirmOrder() {
		if (this.data.cartList.length === 0) {
			wx.showToast({
				title: '当前购物车内没有商品!',
				icon: 'none',
				duration: 1500
			})
			return
		}
		this._setTime()
		this.setTempCartList([...this.data.cartList])
		this.setTotalPrice(this.data.totalPrice)
		navigateTo('shopping/confirm-order', {
			from: '购物',
			shopText: '送货'
		})
	},
	/**
	 * 设置结算页面显示日期时间(sendTime)和接口所需参数(beginTime-endTime)
	 * @private
	 */
	_setTime() {
		const now = new Date()
		const {maxSendTimeLimit, minSendTimeLimit} = this.data.shopInfo
		const maxSendTime = Number(maxSendTimeLimit)
		const minSendTime = Number(minSendTimeLimit)
		const predictMinTime = new Date(now.getTime() + minSendTime * 60 * 1000)
		const predictMaxTime = new Date(now.getTime() + maxSendTime * 60 * 1000)
		const formatDate = (time) => {
			const month = time.getMonth() + 1
			// 获取日期
			const date = time.getDate()
			return time.getFullYear() + '-'
				+ (month < 10 ? '0' + month : month) + '-'
				+ (date < 10 ? '0' + date : date) + ' '
				+ (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':'
				+ (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':'
				+ (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
		}
		const formatTime = (time) => {
			const hours = time.getHours()
			const minutes = time.getMinutes()
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
		}
		const sendTime = formatTime(predictMinTime) + '-' + formatTime(predictMaxTime)
		this.setTimeGroup({
			beginTime: formatDate(predictMinTime),
			endTime: formatDate(predictMaxTime)
		})
		this.setSendTime(sendTime)
	},
	/**
	 * 获取当前购物车的总价
	 * @param cartList 购物车列表
	 */
	_getCurrTotalPrice(cartList) {
		return cartList.reduce((prev, curr) => {
			prev = new Decimal(curr.price).mul(curr.count).add(prev).toNumber()
			return prev
		}, 0).toFixed(2)
	},
	/**
	 * 计算分类商品的高度
	 */
	calcTypeHeight() {
		const that = this
		const deviceInfo = wx.getSystemInfoSync()
		const screenHeight = deviceInfo.windowHeight
		wx.createSelectorQuery().selectAll('#mark').boundingClientRect((rect) => {
			const contentHeight = rect.reduce((pre, cur) => {
				pre += cur.height
				return pre
			}, 0)
			const remainingHeight = screenHeight - contentHeight - 23
			that.setData({
				remainingHeight: remainingHeight + 'px',
			})
		}).exec()
	},
	/**
	 * 滚动处理，实现左右联动
	 * @param e {Event}
	 */
	onScroll(e) {
		if (this.data.heightArr.length === 0) return
		const scrollTop = e.detail.scrollTop
		const current = this.data.selectedIndex
		if (scrollTop + this.data.winHeight + 1 >= this.data.heightArr[this.data.heightArr.length - 1]) {
			this.setData({
				selectedIndex: this.data.heightArr.length - 1
			})
			return
		}
		if (scrollTop >= this.distance) {
			if (current + 1 < this.data.heightArr.length && scrollTop >= this.data.heightArr[current]) {
				this.setData({
					selectedIndex: current + 1
				})
			}
		} else {
			if (current - 1 >= 0 && scrollTop < this.data.heightArr[current - 1]) {
				this.setData({
					selectedIndex: current - 1
				})
			}
		}
		this.distance = scrollTop
	},
	navigateBack() {
		wx.navigateBack({delta: 1})
	},
	/**
	 * 初始化页面信息
	 * @param params 页面传参
	 */
	initPageInfo(params) {
		const {address, pic, isInBusiness, cspName} = params
		this.setData({
			currShop: {
				address,
				pic,
				serveTime: this.data.shopInfo.beginTime + '-' + this.data.shopInfo.endTime,
				cspName
			}
		})
	},
	/**
	 * 获取屏幕剩余高度
	 */
	getRemainingHeight() {
		const that = this
		const deviceInfo = wx.getSystemInfoSync()
		const screenHeight = deviceInfo.windowHeight
		const query = wx.createSelectorQuery()
		query.selectAll('.submit-bar').boundingClientRect()
		query.exec((res) => {
			that.setData({
				leftHeight: screenHeight - res[0][0].height - 100
			})
		})
	},
	/**
	 * 处理接口返回商品数据
	 * @param productList 接口返回商品列表
	 * @return {*[]}
	 */
	filteredType(productList) {
		const map = []
		const result = []
		
		productList.forEach((item) => {
			if (!map.includes(item.productType)) {
				map.push(item.productType)
				result.push({id: item.productType, type: item.typeName, services: [{...item, count: 0}]})
			} else {
				result.forEach(product => {
					if (product.id === item.productType) {
						product.services.push({...item, count: 0})
					}
				})
			}
		})
		return result
	},
	/**
	 * 查询商品
	 * @return {Promise<void>}
	 */
	async queryProductList() {
		try {
      var res  = '{"totalRecords":10,"recordList":[{"productId":"7","productName":"乐视薯片","pictureFileId":"/clound-file-server/api/raw/10404/ls5.png","price":"0.10","deposit":"0.00","introduction":"100g","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"乐视薯片","inventory":5,"address":"门诊楼一楼便民服务点","cspId":"mark001"},{"productId":"8","productName":"草莓果冻","pictureFileId":"/clound-file-server/api/raw/10404/ls2.png","price":"2.00","deposit":"0.00","introduction":"260g","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"草莓果冻","inventory":9,"address":"门诊楼一楼便民服务点","cspId":"mark001"},{"productId":"9","productName":"饼干","pictureFileId":"/clound-file-server/api/raw/10404/ls3.png","price":"20.00","deposit":"0.00","introduction":"500g","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"饼干","inventory":12,"address":"门诊楼一楼便民服务点","cspId":"mark001"},{"productId":"10","productName":"薯片乐事","pictureFileId":"/clound-file-server/api/raw/10404/ls1.png","price":"20.00","deposit":"0.00","introduction":"150g","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"薯片乐事","inventory":10,"address":"门诊楼一楼便民服务点","cspId":"mark001"},{"productId":"43103ca7d3cf46bd8ef1e4483f8f3484","productName":"恒大冰泉","pictureFileId":"/clound-file-server/api/raw/10404/s2.png","price":"5.00","deposit":"0.00","introduction":"250ml","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"","inventory":100,"address":"","cspId":"mark001"},{"productId":"2983438a569e46bf8bd669c29df18c1f","productName":"乐事薯片1","pictureFileId":"/clound-file-server/api/raw/10404/ls5.png","price":"8.00","deposit":"0.00","introduction":"200g","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"","inventory":50,"address":"","cspId":"mark001"},{"productId":"f4f7795b8fde48e4b3e5a043c45090af","productName":"农夫山泉矿泉水","pictureFileId":"/clound-file-server/api/raw/10404/s1.png","price":"5.00","deposit":"0.00","introduction":"250ml","category":2,"productType":201,"categoryName":"便利店购物","typeName":"饮用水","serveTime":"","inventory":100,"address":"","cspId":"mark001"},{"productId":"b47fa9a5945d43e2b9fd4e0c4c7f810a","productName":"番茄味薯片","pictureFileId":"/clound-file-server/api/raw/10404/ls2.png","price":"0.01","deposit":"0.00","introduction":"5g","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"","inventory":0,"address":"","cspId":"mark001"},{"productId":"d0831544f0a840ddb743c1b94a791a62","productName":"大瓶ad钙奶","pictureFileId":"/clound-file-server/api/raw/10404/微信图片_20240315131132.png","price":"4.90","deposit":"0.00","introduction":"500ml","category":2,"productType":200,"categoryName":"便利店购物","typeName":"零食","serveTime":"","inventory":10,"address":"","cspId":"mark001"},{"productId":"ddf291572dfd4781825df2eeb57d7bca","productName":"好辣好辣的辣条","pictureFileId":"/clound-file-server/api/raw/10404/lat.png","price":"0.01","deposit":"0.00","introduction":"5g","category":2,"productType":208,"categoryName":"便利店购物","typeName":"好吃上火","serveTime":"","inventory":0,"address":"","cspId":"mark001"}]}'
      res = JSON.parse(res)
    
			const list = this.filteredType(res.recordList)
			this.setData({
				serviceTypes: list
			})
		} catch (e) {
			console.log(e)
		}
	},
	updateCount() {
		const serviceTypes = this.data.serviceTypes
		serviceTypes.forEach((item) => {
			item.services.forEach(product => {
				const existedIndex = this.data.cartList.findIndex(ele => ele.productId === product.productId)
				if (existedIndex !== -1) {
					product.count = this.data.cartList[existedIndex].count
				}
			})
		})
		this.setData({
			serviceTypes
		})
	},
	onReady() {
		this.calcTypeHeight()
	},
	onLoad(options) {
		this.shopStoreInstance = createStoreBindings(this, {
			store: shopStore,
			fields: ['shoppingType', 'shopInfo', 'address', 'serveTerm', 'initCanteenDateInfo'],
			actions: ['setTempCartList', 'setTotalPrice', 'setSendTime', 'setTimeGroup']
    })
		const params = getPageParams(options)
			this.getRemainingHeight()
			// this.initPageInfo(params)
	},
	onShow() {
    this.queryProductList().then(() => {
			if (this.data.cartList.length !== 0) {
				this.updateCount()
			}
		})
	},
	onUnload() {
	}
})