import {storeBindingsBehavior} from "mobx-miniprogram-bindings"

import {orderStore, shopStore} from '../../store/index'
import constants from "../../common/constants"
import { navigateTo, redirect, relaunch, returnToHome, switchTab } from "../../utils/wxUtils"
import utils from "../../utils/index"
import {orderPageFilter} from "../../utils/order-utils";
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
				btnArr.push(...category.btnArr)
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
		 * 取消订单
		 * @return {Promise<void>}
		 */
		async cancelOrder() {
      
		},
  }
})
