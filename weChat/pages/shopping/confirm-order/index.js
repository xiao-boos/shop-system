import {createStoreBindings} from "mobx-miniprogram-bindings"
import {shopStore} from "../../../store/index"
import constants from "../../../common/constants"
import utils from "../../../utils/index"
import {getPageParams, navigateTo, redirect, relaunch} from "../../../utils/wxUtils";
import {checkPhoneNumber} from "../../../utils/common-method";

const app = getApp()

Page({
	data: {
		imageBaseUrl: constants.CONST_API,
		shopText: '', // "送餐"/"送货" (常量)
		contactPhone: '', // 手机号
		picList: {
			addressIcon: `${constants.imageBaseUrl}/shopping/blue_address_icon.png`,
			timeIcon: `${constants.imageBaseUrl}/shopping/time_icon.png`,
			wechatIcon: `${constants.imageBaseUrl}/shopping/weChat_pay_icon.png`,
			zhangHaoIcon: `${constants.imageBaseUrl}/shopping/zhangh_icon@2x.png`,
			confirmIcon: `${constants.imageBaseUrl}/shopping/fwtksel_icon.png`,
			cancelIcon: `${constants.imageBaseUrl}/shopping/fwtknor_icon.png`
		},
		agreementPopup: false, // 是否显示服务条款弹窗
		agreeProtocol: 'no', // 是否同意条款
		payType: '0', // 支付方式，默认微信支付
	},
	/**
	 * 展示服务条款
	 */
	showServiceAgreement() {
		this.setData({
			agreementPopup: true
		})
	},
	/**
	 * 修改地址
	 */
	modifyAddress() {
		navigateTo('shopping/index', {
			backUrl: 'shopping/confirm-order',
			receiverId: this.data.currRecordId
		})
	},
	/**
	 * 验证提交信息
	 * @return {boolean}
	 */
	validateForm() {
		if (this.data.agreeProtocol === 'no') {
			wx.showToast({
				title: '请先勾选服务条款同意书!',
				icon: 'none'
			})
			return false
		}
		if (!this.data.contactPhone) {
			wx.showToast({
				title: '请输入手机号!',
				icon: 'none'
			})
			return false
		}
		if (checkPhoneNumber(this.data.contactPhone)) return false
		
		return true
	},
	/**
	 * 点击提交订单
	 */
	submitOrder() {
		if (!this.validateForm()) return
			const shopInfo = this._filterCartList()
			this.postOrder(shopInfo)
	},
	/**
	 * 提交订单
	 * @param shopInfo 商家和商品相关的信息
	 * @return {Promise<void>}
	 */
	async postOrder(shopInfo) {
		try {
      const data = {
				sessionId: Date.now() + '',
				beginTime: this.data.timeGroup.beginTime,
				endTime: this.data.timeGroup.endTime,
				pattern: this.data.payType,
				receiverId: this.data.currRecordId,
				contactPhone: this.data.contactPhone,
				cspId: shopInfo.cspId,
				category: shopInfo.category,
				productInfo: shopInfo.productInfo
			}
			relaunch('shopping/payment-success', {
        orderType: this.data.shopText
      })
		} catch (e) {
			console.log(e)
		}
	},
	/**
	 * 确认是否同意条款
	 * @param e
	 */
	changeAgreement(e) {
		const {type} = e.currentTarget.dataset
		if (e.detail.agree) {
			this.setData({
				agreeProtocol: e.detail.agree === 'true' ? 'yes' : 'no',
				agreementPopup: false
			})
		} else {
			this.setData({
				agreeProtocol: type === 'false' ? 'yes' : 'no'
			})
		}
	},
	/**
	 * 根据接口入参筛选购物车数组中多余的属性，并区分点餐/购物请求路径和参数
	 * @return {{productId: String, productCount: String, productType: int}[], menuId?: String}}
	 */
	_filterCartList() {
		const shopInfo = {}
			Object.assign(shopInfo, {
				cspId: this.data.shopInfo.cspId,
				category: this.data.shopInfo.category,
				url: '/convenience-server/wxapp/custom/product-order/001/create',
				productInfo: this.data.tempCartList.map(item => ({
					productId: item.productId,
					productType: item.productType,
					productCount: item.count,
				}))
			})
			return shopInfo
	},
	onShow() {
		if (!this.data.shopText) {
			this.setData({
				shopText: app.globalData.shopTempInfo.shopText,
				contactPhone: app.globalData.mobile
			})
		}
	},
	onLoad(options) {
		this.shopStoreInstance = createStoreBindings(this, {
			store: shopStore,
			fields: ['tempCartList', 'address', 'totalPrice', 'currRecordId', 'shopInfo', 'canteenInfo', 'sendTime', 'timeGroup'],
			actions: ['setTempCartList']
		})
		this.shopStoreInstance.updateStoreBindings()
		const {from, shopText} = getPageParams(options)
		app.globalData.shopTempInfo = {from, shopText}
		wx.setNavigationBarTitle({
			title: from
		})
		this.setData({
			shopText: shopText,
			contactPhone: app.globalData.mobile
		})
	},
	onUnload() {
		this.shopStoreInstance.destroyStoreBindings()
	}
})