import constants from "../../../common/constants"
import utils from "../../../utils/index"
import {MENU_HOME} from '../../../utils/menu'
import {navigateTo, relaunch} from "../../../utils/wxUtils"
import {siteMessageList} from "../../../utils/service-api"
import {authStore} from '../../../store/index'

const computedBehavior = require('miniprogram-computed').behavior
import {createStoreBindings} from 'mobx-miniprogram-bindings'
import {addTrack, setMenuId} from "../../../utils/track";
import {showToast} from "../../../utils/ui";

const app = getApp()

Page({
	behaviors: [computedBehavior],
	data: {
		bannerText: MENU_HOME.bannerText,
		serviceList: MENU_HOME.serviceList,
		statusBarHeight: 0, // 标题文字和胶囊的距离
		msgList: [],
		msgList2: [],
		currentIndex: 0,//防止滚动区域出现空白
		imageBaseUrl: constants.imageBaseUrl,
		mainMenuList: [], // 主菜单
		homeServiceMenuList: [], // 到家服务菜单
		isFirst: true,
	},
	computed: {
		getPic() {
			return {
				bannerPic: `${constants.imageBaseUrl}/index/bg@2x.png`,
				messagePic: `${constants.imageBaseUrl}/index/xxtz_pic@2x.png`,
				titlePic: `${constants.imageBaseUrl}/index/dj_bg@2x.png`
			}
		},
	},
	toHomeService() {
		wx.showToast({
			title: '功能暂未开放，敬请期待!',
			icon: 'none'
		})
	},
	navigateToPage(e) {
		if (app.globalData.status === -1 || wx.getStorageSync('convenience-login') !== 'true') {
			relaunch('auth', {
				from: 'index/home'
			})
			return
		}
		const {url, id: menuId, status} = e.currentTarget.dataset
		if (status === 0) {
			if (!constants.NO_TRACK_MENU.includes(url)) {
				addTrack({menuName: e.currentTarget.dataset.track})
				setMenuId(menuId)
			}
			wx.navigateTo({url})
			return
		}
		showToast('服务暂未开通，敬请期待')
	},
	toNotice() {
		if (app.globalData.status === -1 || wx.getStorageSync('convenience-login') !== 'true') {
			relaunch('auth', {
				from: 'index/home'
			})
			return
		}
		navigateTo('notice/index')
	},
	getNotice() {
		this.data.isFirst = false;
		siteMessageList({
			pageIndex: 1,
			pageSize: 20
		}, (data) => {
			let recordList = [], recordList2 = []
			data.recordList.forEach(function (item, index) {
				if (item.msgType == 0) {
					item.msgTypeName = '公告消息';
				} else if (item.msgType == 1) {
					item.msgTypeName = '失物招领';
				} else if (item.msgType == 2) {
					item.msgTypeName = '到期提醒';
				} else if (item.msgType == 300) {
					item.msgTypeName = '系统通知';
				}
				if (index % 2 == 0) {
					recordList.push(item)
				} else {
					recordList2.push(item)
				}
			})
			this.setData({
				currentIndex: 0,
				msgList: recordList,
				msgList2: recordList2
			})
		})
	},
	initPageInfo() {
		const menuButtonObject = wx.getMenuButtonBoundingClientRect()
		const systemInfo = wx.getSystemInfoSync()
		//导航高度
		const statusBarHeight = systemInfo.statusBarHeight
		const navTop = menuButtonObject.top //胶囊距离顶部距离
		//胶囊宽度(包括右边距离)
		const navObjWid = systemInfo.windowWidth - menuButtonObject.right + menuButtonObject.width // 胶囊按钮与右侧的距离 = windowWidth - right+胶囊宽度
		//导航栏总体高度
		const navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2
		const navObj = menuButtonObject.height //胶囊高度
		this.setData({
			statusBarHeight: navTop + navObj + 10
		})
	},
	initMenus() {
		const menus = app.globalData.menus.map(item => ({...item, iconUri: constants.imageBaseUrl + item.iconUri}))
		const homeServiceMenuList = menus.slice(-3)
		const mainMenuList = menus.slice(0, -3)
		this.setData({
			mainMenuList,
			homeServiceMenuList
		})
	},
	async initQueryInfo() {
		this.initMenus()
		this.getNotice()
	},
	async onLoad(options) {
		this.authStoreInstance = createStoreBindings(this, {
			store: authStore,
			fields: ['token']
		})
		this.authStoreInstance.updateStoreBindings()
		this.initPageInfo()
		app.globalData.homeQueryCallBack = () => {
			this.initQueryInfo()
		}
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				// 当前页面的 tabBar 索引
				active: 0
			})
		}
		if (wx.getStorageSync('convenience-login') === 'true' && app.globalData.profile.profile) {
			relaunch(app.globalData.profile.profile.path, {}, true)
		}
		this.data.token && this.initQueryInfo()
	},
	onUnload() {
		this.authStoreInstance.destroyStoreBindings()
	},
	onPullDownRefresh() {
	},
})