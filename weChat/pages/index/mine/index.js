import constants from "../../../common/constants"

const QR = require('../../../utils/weapp-qrcode.js'); // 引入 weapp-qrcode.js
// 导入store
import {createStoreBindings} from 'mobx-miniprogram-bindings'
import {authStore, userStore} from '../../../store/index'
import utils from "../../../utils/index"
import {navigateTo, redirect, relaunch} from "../../../utils/wxUtils"
import {showToast} from "../../../utils/ui";

const app = getApp()
Page({
	data: {
		locationInf: `${constants.imageBaseUrl}/mine/location_inf.png`,
		showPice: true,
		showQrcode: false,
		qrcodeImgData: '',
		nickName: '',
		avatarUrl: '',
		cardBalance: '0.00',
		cardQRCode: '',
		yuanNeiAddre: '',
		yuanNeiAddreId: '',
		convenienceLogin: false,
		mobile: '',
		_hiddenCount: 0,
	},
	onClose() {
		this.setData({
			showQrcode: false
		})
	},
	//跳转界面
	toPage(event) {
		if (wx.getStorageSync('convenience-login') !== 'true') {
			relaunch('auth', {
				from: 'index/mine'
			})
			return
		}
		
		navigateTo(event.currentTarget.dataset.id, {
			currentRole: 'user'
		})
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				// 当前页面的 tabBar 索引
				active: 2
			})
		}
		if (wx.getStorageSync('convenience-login') == 'true') {
			this.queryCardInfo()
			this.queryReceiver()
			this.setData({
				convenienceLogin: wx.getStorageSync('convenience-login') === 'true'
			})
		}
	},
	//退出登录
	unLogin() {
		const that = this
		wx.showModal({
			title: '退出登录',
			content: '确定退出吗？',
			confirmColor: '#3D61FB',
			cancelColor: '#666666',
			success: function (res) {
				if (res.confirm) {
					wx.setStorageSync('convenience-login', 'false')
					that.setData({
						nickName: '',
						convenienceLogin: false
					})
					wx.showToast({
						title: '退出登录成功！',
						icon: 'success',
						duration: 1000,
					})
				}
			}
		})
	},
	//登录
	login() {
		if (wx.getStorageSync('convenience-login') !== 'true') {
			relaunch('auth', {
				from: 'index/mine'
			})
		}
	},
	onLoad: function (options) {
		this.authStoreInstance = createStoreBindings(this, {
			store: authStore,
			fields: ['userInfo', 'authLogined', 'token'],
			actions: ['setAuthLogined', 'setUserInfo', 'setTokenStore']
		})
		this.authStoreInstance.updateStoreBindings()
		this.setData({
			mobile: app.globalData.mobile
		})
	},
	onUnload() {
		this.authStoreInstance.destroyStoreBindings()
	}
})