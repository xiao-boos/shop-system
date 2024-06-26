import constants from "../common/constants"

Component({
	properties: {},
	data: {
		tabBarList: [
			{
				text: '首页',
				pagePath: 'pages/index/home/index',
				active: 0,
				icon: `/pages/image/index/home_nor_icon@2x.png`,
				activeIcon: `/pages/image/index/home_sel_icon@2x.png`,
			},
			{
				text: '订单',
				pagePath: 'pages/index/order/index/index',
				active: 1,
				icon: `/pages/image/index/order_nor_icon@2x.png`,
				activeIcon: `/pages/image/index/order_sel_icon@2x.png`,
			},
			{
				text: '我的',
				pagePath: 'pages/index/mine/index',
				active: 2,
				icon: `/pages/image/index/infor_nor_icon@2x.png`,
				activeIcon: `/pages/image/index/infor_sel_icon@2x.png`,
			}
		],
		active: 0,
	},
	methods: {
		onChange(event) {
			this.setData({ active: event.detail })
			wx.switchTab({
				url: '/' + this.data.tabBarList[event.detail].pagePath
			})
		},
	}
})
