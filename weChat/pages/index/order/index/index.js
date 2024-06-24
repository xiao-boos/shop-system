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
        
	},
	computed: {
		getPic() {
			return `${constants.imageBaseUrl}/order/empty_order.png`
		}
	},
	onReady() {
		this.getScrollHeight()
	},
	onLoad(options) {
		this.orderStoreInstance = createStoreBindings(this, {
			store: orderStore
		})
	},
	onShow() {
		if (wx.getStorageSync('convenience-login') !== 'true') {
			relaunch('auth', {
				from: 'index/order/index'
			})
			return
		}
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