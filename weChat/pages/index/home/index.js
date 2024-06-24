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
		 //导航静态数据
     navData: [{
      text: "榜单",
      icon: "http://jkw.life:8020/icon/榜单.png"
    },
    {
      text: "百亿补贴",
      icon: "http://jkw.life:8020/icon/百亿补贴.png",
      badge: "低价"
    },
    {
      text: "商品秒杀",
      icon: "http://jkw.life:8020/icon/商品秒杀.png",
      badge: "5:00"
    },
    {
      text: "新人红包",
      icon: "http://jkw.life:8020/icon/新人红包.png",
      badge: "￥99"
    },
    {
      text: "充值中心",
      icon: "http://jkw.life:8020/icon/充值中心.png",
      badge: "优惠"
    },
    {
      text: "新人福利",
      icon: "http://jkw.life:8020/icon/新人福利.png",
      badge: "福利"
    },
    {
      text: "包邮",
      icon: "http://jkw.life:8020/icon/包邮.png"
    },
    {
      text: "全部频道",
      icon: "http://jkw.life:8020/icon/全部频道.png"
    },], // 到家服务菜单
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
	navigateToPage(e) {
		const {url, id: menuId, status} = e.currentTarget.dataset
    wx.navigateTo( { url:'/pages/shopping/shopping-cart/index'})
	},
	async initQueryInfo() {
	},
	async onLoad(options) {
    this.initPageInfo()
	},
	onShow() {
	},
	onUnload() {
    
	},
	onPullDownRefresh() {
	},
})