import constants from "../../../common/constants"
import { getPageParams, returnToHome, switchTab } from "../../../utils/wxUtils"

Page({
	data: {
		pic: `${ constants.imageBaseUrl }/shopping/suc_pic.png`,
		pageText: {}
	},
	
	navigateToPage(e) {
		const { route } = e.currentTarget.dataset
		if (route === 'home') {
			returnToHome()
		} else {
			switchTab('index/order/index')
		}
	},
	initPageInfo(orderType) {
		const map = {
			'送货': {
				navigateTitle: '即时购物',
				text: '下单成功',
				tip: '将按时送达，请耐心等待'
			}
		}
		this.setData({
			pageText: map[orderType]
		})
		wx.setNavigationBarTitle({
			title: map[orderType].navigateTitle
		})
	},
	onLoad: function (options) {
		const { orderType } = getPageParams(options)
		this.initPageInfo(orderType)
	}
});