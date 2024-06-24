import { storeBindingsBehavior } from "mobx-miniprogram-bindings"

import { orderStore } from '../../store/index'
import utils from "../../utils/index"
import { switchTab } from "../../utils/wxUtils"
import { behavior as computedBehavior } from "miniprogram-computed";
import constants from "../../common/constants";

const app = getApp()

Component({
	behaviors: [storeBindingsBehavior, computedBehavior],
	storeBindings: {
		store: orderStore,
		fields: {},
		actions: {
			setControlCancelPopupShow: "setControlCancelPopupShow",
		},
	},
	properties: {
		popupShow: {
			type: Boolean,
			value: false
		},
		outTradeNo: {
			type: String,
			value: ''
		},
		// 是否在 tabbar 页面
		isTabbarPage: {
			type: Boolean,
			value: false
		},
		isDetailPage: {
			type: Boolean,
			value: false
		},
		category: {
			type: Number,
			value: null,
			observer: function(newVal) {
				this.setData({
					commentList: constants.reasonMap[newVal]
				})
			}
		}
	},
	data: {
		selectedIndex: null, // 选择的索引
		selectedReason: '', // 选择的原因
		commentList: []
	},
	methods: {
		selectReason(e) {
			let {index, text} = e.currentTarget.dataset
			if (this.data.selectedIndex === index) index = null
			this.setData({
				selectedIndex: index,
				selectedReason: text
			})
		},
		/**
		 * 取消订单
		 */
		async cancelUnPaidOrder() {
			if (!this.data.selectedReason) {
				return wx.showToast({
					title: '请选择取消订单的原因（必选）',
					icon: 'none'
				})
			}
			const res = await utils.post('/convenience-server/wxapp/custom/my-order/001/apply-refund', {
				outTradeNo: this.data.outTradeNo,
				cause: this.data.selectedReason
			}, {
				type: 'FORM'
			}).catch(e => console.log(e))
			wx.showToast({
				title: '已申请退款！',
				icon: 'none'
			})
			this.clearInput()
			if (this.data.isDetailPage) {
				this.refreshPage()
			} else {
				this.onClose()
			}
		},
		refreshPage() {
			this.triggerEvent('setpopupshow', {
				popupShow: false,
				popupName: 'refreshPage'
			})
		},
		onClose() {
			this.clearInput()
			this.triggerEvent('setpopupshow', {
				popupShow: false,
				popupName: 'controlCancelPopupShow'
			})
		},
		clearInput() {
			this.setData({
				selectedIndex: null,
				selectedReason: ''
			})
			app.globalData.currToRefundcategory = null
		}
	}
})
