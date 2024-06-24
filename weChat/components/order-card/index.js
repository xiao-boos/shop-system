import {storeBindingsBehavior} from "mobx-miniprogram-bindings"

import {orderStore, shopStore} from '../../store/index'
import constants from "../../common/constants"
import { navigateTo, redirect, relaunch, returnToHome, switchTab } from "../../utils/wxUtils"
import utils from "../../utils/index"
import {orderPageFilter} from "../../utils/order-utils";
import {shopInfoHandler, queryOrderDetail, queryConvenienceShopList} from "./utils";

const computedBehavior = require('miniprogram-computed').behavior

const app = getApp()

Component({
	behaviors: [storeBindingsBehavior, computedBehavior],
	storeBindings: {
		store: shopStore,
		actions: {
			setAddress: 'setAddress',
			setCurrRecordId	: 'setCurrRecordId',
			setCanteenInfo: 'setCanteenInfo',
			setServeTerm: 'setServeTerm',
			setInitCanteenDateInfo: 'setInitCanteenDateInfo',
			setShopInfo: 'setShopInfo'
		},
	},
	properties: {
		category: {
			type: Object,
			value: {}
		},
		status: {
			type: String,
			value: '',
		},
	},
	data: {
		btnText: {
			secondaryBtn: '',
			primaryBtn: '',
		},
		remainingList: [], // 展开剩余数组项
		filteredProductList: [],
		originalList: [],
		showExpand: false,
		morePic: `${constants.imageBaseUrl}/order/zk_icon.png`,
		picUrl: constants.imageBaseUrl,
		showCancelPopup: false,
		btnArr: [],
	},
	watch: {
		'status': function (status) {
		},
		'category': function (category) {
			const btnArr = []
			const extraBtn = [{text: '申请退款', className: 'red-btn', methodName: 'applyRefund'}, {text: '确认完成', className: 'primary-btn', methodName: 'merchantConfirmFinish'}]
			if (this.data.status === '1' && category.orderStatus === 10) {
				btnArr.push(...extraBtn)
			} else {
				btnArr.push(...category.btnArr)
			}
			if (category.productList.length > 3) {
				const firstShowArr = category.productList.slice(0, 3)
				this.setData({
					filteredProductList: firstShowArr,
					originalList: category.productList,
					showExpand: true,
					btnArr
				})
			} else {
				this.setData({
					filteredProductList: category.productList,
					btnArr
				})
			}
		}
	},
	methods: {
		/**
		 * 再来一单
		 */
		async sameOrder() {
			if (this.data.category.category === 1) {
				const { address, receiverId } = await queryOrderDetail(this.data.category.category, this.data.category.outTradeNo)
				const { canteenInfo, initCanteenDateInfo, serveTerm, isInBusiness } = await shopInfoHandler(this.data.category.cspId)
				this.setAddress(address)
				this.setCurrRecordId(receiverId)
				this.setCanteenInfo(canteenInfo)
				this.setInitCanteenDateInfo(initCanteenDateInfo)
				this.setServeTerm(serveTerm)
				navigateTo('shopping/canteen-type-selection', {
					isInBusiness
				})
			}else if (this.data.category.category === 2) {
				const { address, receiverId } = await queryOrderDetail(this.data.category.category, this.data.category.outTradeNo)
				const shop = await queryConvenienceShopList(this.data.category.cspId)
				const {servBeginTime: beginTime, servEndTime: endTime, sendTimeLimit, isInBusiness} = shop.serveTerm
				this.setShopInfo({
					cspId: this.data.category.cspId,
					category: 2,
					beginTime,
					endTime,
					minSendTimeLimit: sendTimeLimit.split(',')[0],
					maxSendTimeLimit: sendTimeLimit.split(',')[1]
				})
				navigateTo('shopping/shopping-cart', {
					address,
					pic: constants.CONST_API + shop.pictureFileId,
					isInBusiness,
					cspName: shop.cspName
				})
			}
		},
		/**
		 * 点击展开全部
		 */
		expandAllProduct() {
			const {originalList} = this.data
			this.setData({
				filteredProductList: [...originalList],
				showExpand: false
			})
		},
		/**
		 * 撤回申请退款
		 * @param e
		 */
		revokeRefund(e) {
			this.triggerEvent('setpopupshow', {
				popupShow: true,
				outTradeNo: this.data.category.outTradeNo,
				popupName: 'controlRevokePopupShow'
			})
		},
		/**
		 * 评价
		 */
		comment() {
			this.navigateToDetail('true')
		},
		/**
		 * 申请退款
		 */
		applyRefund() {
			app.globalData.currToRefundcategory = this.data.category.category
			this.triggerEvent('setpopupshow', {
				popupShow: true,
				outTradeNo: this.data.category.outTradeNo,
				popupName: 'controlCancelPopupShow'
			})
		},
		merchantConfirmFinish() {
			this.triggerEvent('merchantFinish', {
				outTradeNo: this.data.category.outTradeNo,
				showToast: true
			})
		},
		/**
		 * 确认完成订单
		 * @return {Promise<void>}
		 */
		confirmFinish() {
			this.triggerEvent('setpopupshow', {
				popupShow: true,
				outTradeNo: this.data.category.outTradeNo,
				popupName: 'controlFinishPopupShow'
			})
		},
		/**
		 * 继续支付
		 */
		continueToPay() {
			const {totalAmount, outTradeNo, category} = this.data.category
			this.triggerEvent('continuetopay', {totalAmount, outTradeNo, category})
		},
		/**
		 * 取消订单
		 * @return {Promise<void>}
		 */
		async cancelOrder() {
			if (this.data.status === '1' && this.data.category === 3) {
				this.triggerEvent('setpopupshow', {
					popupShow: true,
					outTradeNo: this.data.category.outTradeNo,
					popupName: 'controlCancelPopupShow'
				})
				return
			}
			const res = await utils.post('/convenience-server/wxapp/custom/my-order/001/cancel', {
				outTradeNo: this.data.category.outTradeNo
			}, {type: 'FORM'}).catch(err => console.log(err))
			this.triggerEvent('refreshquery', {tip: 'cancel'})
		},
		async renewOrder() {
			const urlMap = {
				3: 'serve/peihu/appoint-info',
				4: 'serve/peizhen/appoint-info'
			}
			const path = urlMap[String(this.data.category.category)]
			const workerId = this.data.category.productList[0].productId
			const res = await utils.get('/convenience-server/wxapp/custom/serve-worker/001/detail', {
				workerId,
				cspId: this.data.category.cspId
			}).catch(e => console.log(e))
			redirect(path, {
				workerDetail: res
			})
		},
		filterNavigate(fromComment) {
			this.triggerEvent('navigatedetail', {
				params: {
					orderInfo: this.data.category,
					fromComment,
				}
			})
		},
		navigateToDetail(fromComment) {
			app.globalData.currOrderInfo = this.data.category
			this.filterNavigate(fromComment)
		}
	}
})
