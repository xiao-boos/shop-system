//app.js
import constants from './common/constants'
import httpUtils from "./utils/httpUtils"
// 导入store
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { authStore, orderStore } from './store/index'
import utils from "./utils/index"
import { relaunch } from "./utils/wxUtils";

const tools = require('./utils/tools.js')

App({
	async onLaunch(options) {
		var that = this
		that.loadCustomFont()
		// 绑定store
		that.authStoreInstance = createStoreBindings(that, {
			store: authStore,
			actions: ['setAuthLogined', 'setUserInfo', 'setTokenStore', 'setMenus'],
		})
		that.orderStoreInstance = createStoreBindings(that, {
			store: orderStore,
			actions: ['setHospitalName'],
		})
		
		await this.userAuth(this).then(async () => {
			if (that.globalData.homeQueryCallBack) {
				await that.globalData.homeQueryCallBack()
				that.globalData.homeQueryCallBack = null
			}
			this.globalData.loginStatus = wx.getStorageSync('convenience-login')
			await that.queryUserProfile()
		})
		
		that.globalData.isIpx = tools.isIPhoneX()
		if (that.globalData.isIpx) {
			that.globalData.safetyArea = 220
		}

		// ios端音频不能在静音下播放处理
		wx.setInnerAudioOption({
			obeyMuteSwitch: false,

			success: function (res) {
				console.log("开启静音模式下播放音乐的功能");
			},

			fail: function (err) {
				console.log("静音设置失败");
			},
		});
	},
	globalData: {
		isIpx: false, //是否为iPhone x
		devId: 'wxapp', // 接口的devId统一标识
		openid: '',
		sessionKey: '',
		menus: [], // 菜单
		safetyArea: 150, // 底部tabbar的安全距离
		
		hospitalId: '',// 医院id
		hospitalName: '',// 医院名称
		
		//用户信息及登录授权状态
		userId: '',
		mobile: '', // 手机号
		needAuthPhone: true, // 是否需要授权手机号
		wxLogin: false, // wx.login是否已成功
		wxLoginCode: '', // 保存用于后续调用的wx.login返回的code
		shopTempInfo: null, // 临时存储的购物商家信息
		authLogin: false, // 用户授权登录是否已成功
		authError: false,
		refreshBindInfo: null,
		status: null, // 账户状态
		category: null, // 选择切换的服务大类
		cspId: null, // 选择切换的商家id
		profile: [], // 保存的用户切换角色信息
		faultRepairCspId: null,// 故障报修商家id
		
		wxLoginedCallBack: null,
		authLoginedCallBack: null,
		authErrorCallBack: null,
		queryPatientCallBack: null,
		authCallback: null,
		tokenInitedCallBack: null,
		getPhoneNumberSuccessCallback: null, // 成功获取到手机号后的回调
		userLoginAndAddPatientCallBack: null, // 阻止用户未登录直接创建电子健康卡
		homeQueryCallBack: null
	},
	/**
	 * 检查小程序版本更新
	 */
	checkForUpdate() {
		const updateManager = wx.getUpdateManager()
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
	},
	/**
	 * 初次启动时检查网络情况
	 */
	checkNetwork() {
		wx.getNetworkType({
			success(res) {
				const networkType = res.networkType
				if (networkType === 'none') {
					wx.showToast({
						title: '当前无网络',
						icon: 'loading',
						duration: 2000
					})
				}
			}
		})
	},
	/**
	 * 加载自定义字体
	 */
	loadCustomFont() {
		const url = `url("${ constants.CONST_API }/wxh5-resources/font/DingTalk_JinBuTi.ttf")`
		wx.loadFontFace({
			family: "JinBu-Ti",
			source: url,
			global: true,
			success: (res) => console.log('字体加载：', res.status),
			fail: (res) => console.log('字体加载：', res.status)
		})
	},
	async queryUserProfile(needNavigate = true, isInitQuery = true) {
		const profile = wx.getStorageSync(`convenience-${ this.globalData.openId }-${ this.globalData.mobile }`)
		if (profile?.category) {
			this.globalData.profile = profile
			this.globalData.cspId = profile.cspId
			this.globalData.category = profile.category
			if (isInitQuery) await this.userAuth(this, '1001')
			this.globalData.loginStatus === 'true' && needNavigate && relaunch(profile.path, {}, true)
			return true
		}
		
		return false
	},
	/**
	 * 请求登录和授权信息
	 * @returns {Promise<void>}
	 */
	async userAuth(that, appType = '1000', options = undefined) {
		try {
			const loginRes = await httpUtils.login()
			const wxAppId = wx.getAccountInfoSync().miniProgram.appId
			that.globalData.wxLoginCode = loginRes
			// 查询微信绑定状态，如果已绑定手机，则无需再弹出授权
			const res = await httpUtils.get(
				{
					url: '/clound-sysmgr-server/wxapp/001/queryBindStatus',
					data: {
						code: loginRes,
						wxAppId: wxAppId,
						appType,
						// inviteCode: options?.query?.inviteCode || '',
					}
				}
			)
			const data = res.data
			// 已绑定
			if (data.status !== -1) {
				that.globalData.authLogin = true
				that.setAuthLogined(true)
				that.setUserInfo({ nickName: data.nickName, avatarUrl: data.avatarUrl })
				that.globalData.mobile = data.mobile // 手机号
				that.globalData.userId = data.userId // 系统用户标识
				that.globalData.cspList = data.cspList
				that.globalData.needAuthPhone = false // 已授权
			}
			
			if (that.globalData.authCallback) {
				that.globalData.authCallback()
				that.globalData.authCallback = null
			}
			
			that.globalData.menus = data.menus
			that.globalData.wxLogin = true
			that.globalData.openId = data.openId
			that.globalData.sessionKey = data.sessionKey
			that.globalData.hospitalId = data.hospitalId
			that.globalData.hospitalName = data.hospitalName
			that.globalData.status = data.status
			that.setHospitalName(data.hospitalName)
			that.setTokenStore(data.token) // 有token了
			wx.setStorageSync('token', data.token)
			// 有用户登录信息
			if (that.globalData.tokenInitedCallBack) {
				that.globalData.tokenInitedCallBack()
				that.globalData.tokenInitedCallBack = null
			}
			wx.hideLoading()
			return new Promise(resolve => resolve())
		} catch (err) {
			wx.hideLoading()
			console.error(err)
			wx.showToast({
				title: '查询授权状态失败',
				icon: 'none',
				duration: 3000,
			})
		}
	},
	/**
	 * 获取用户手机号
	 * @param detail
	 * @return {Promise<void>}
	 */
	async getPhoneNumber(detail) {
		const that = this
		const wxAppId = wx.getAccountInfoSync().miniProgram.appId
		const wxLoginCode = await httpUtils.login()
		
		let data = {
			wxAppId,
			openId: that.globalData.openid,
			// userId: that.globalData.userid,
			iv: detail.iv,
			encryptedData: detail.encryptedData,
			// code: that.globalData.wxLoginCode,
			sessionKey: that.globalData.sessionKey,
			code: wxLoginCode
		}
		// 先检查当前session是否仍有效
		const res = await utils.wxPromise(wx.checkSession)()
		if (res.errMsg === "checkSession:ok") {
			const phoneRes = await utils.form('/clound-sysmgr-server/wxapp/userManage/001/getPhoneNumber', {
				wxAppId: data.wxAppId,
				iv: data.iv,
				encryptedData: data.encryptedData,
				sessionKey: data.sessionKey,
			}).catch(e => console.log('手机号获取失败'))
			return {
				mobile: phoneRes.purePhoneNumber,
				wxAppInfo: data
			}
		}
	},
	// 检查是否已授权语音录制
	checkVoiceRecordAuth() {
		return new Promise((resolve, reject) => {
			wx.getSetting({
				success(res) {
					// 未授权
					if ( !res.authSetting['scope.record']) {
						wx.authorize({
							scope: 'scope.record',
							success() {
								resolve(200)
							},
							fail(err) {
								wx.showModal({
									title: '温馨提示',
									content: '请确认授权麦克风',
									showCancel: true,
									confirmText: "授权",
									success: function (res) {
										if (res.confirm) {
											wx.openSetting({
												success: (res) => {
													if ( !res.authSetting['scope.record']) {
														wx.showModal({
															title: '提示',
															content: '您未授权录音，功能将无法使用',
															showCancel: false,
															success: function () {
															}
														})
													} else {
														resolve(200)
													}
												},
												fail: function () {
													console.log("授权设置录音失败");
												}
											})
										}
									},
									fail: function (err) {
										console.log("打开录音弹框失败 => ", err);
									}
								})
							}
						})
					} else {
						resolve(200)
					}
				}
			})
		})
	},
	onShow: function () {
		this.checkForUpdate()
		this.checkNetwork()
	},
})