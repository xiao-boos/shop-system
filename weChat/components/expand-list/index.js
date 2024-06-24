import constants from "../../common/constants"
const computedBehavior = require('miniprogram-computed').behavior

Component({
	behaviors: [computedBehavior],
	properties: {
		productList: {
			type: Array,
			value: []
		},
	},
	data: {
		filteredProductList: [],
		originalList: [],
		showExpand: false,
		morePic: `${constants.imageBaseUrl}/order/zk_icon.png`,
		picUrl: constants.imageBaseUrl
	},
	watch: {
		'productList': function (productList) {
			if (productList.length > 3) {
				const firstShowArr = productList.slice(0, 3)
				this.setData({
					filteredProductList: firstShowArr,
					originalList: productList,
					showExpand: true
				})
			} else {
				this.setData({
					filteredProductList: productList,
				})
			}
		}
	},
	methods: {
		expandAllProduct() {
			const {originalList} = this.data
			this.setData({
				filteredProductList: [...originalList],
				showExpand: false
			})
		}
	}
})
