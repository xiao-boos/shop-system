import {storeBindingsBehavior} from "mobx-miniprogram-bindings"

import {orderStore} from '../../store/index'
import constants from "../../common/constants"
import utils from "../../utils/index"
import {navigateTo, relaunch, returnToHome, switchTab} from "../../utils/wxUtils"

const computedBehavior = require('miniprogram-computed').behavior

Component({
	behaviors: [storeBindingsBehavior, computedBehavior],
	storeBindings: {
		store: orderStore,
		fields: {
			orderStatus: 'orderStatus',
			controlCancelPopupShow: 'controlCancelPopupShow',
		},
		actions: {
			setCurrOrderInfo: "setCurrOrderInfo",
			setTemplateName: "setTemplateName",
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
			primaryBtn: ''
		},
		remainingList: [], // 展开剩余数组项
		filteredProductList: [],
		originalList: [],
        showExpand: false,
		morePic: `${constants.imageBaseUrl}/order/zk_icon.png`,
		picUrl: constants.CONST_API,
	},
	watch: {
		'status': function (status) {
		},
		'category': function (category) {
			if (category.productList && category.productList.length > 3) {
				const firstShowArr = category.productList.slice(0, 3)
				this.setData({
					filteredProductList: firstShowArr,
					originalList: category.productList,
					showExpand: true
				})
			} else {
				this.setData({
					filteredProductList: category.productList? category.productList:[],
				})
			}
		}
	},
	methods: {
        /**
         * 点击评价按钮
         */
        showCommentPopup() {
            const {score, outTradeNo, comment, pictureFileId} = this.data.category
            this.triggerEvent('showCommentPopup', {score, outTradeNo,comment,  pictureFileId})
        },
        showEvaluateDelPopup(){
            const { outTradeNo} = this.data.category
            const that = this
            wx.showModal({
                title: '删除确认',
                content: '是否删除评价？',
                confirmColor:'#3D61FB',
                cancelColor:'#666666',
                success: function (res) {
                    if (res.confirm) {
                        utils.form('/convenience-server/wxapp/custom/my-order/001/remove-comment', {
                            outTradeNo: outTradeNo,
                        },{type:'from'}).then(res => {
                            that.triggerEvent('refreshCommenQuery')
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none',
                                duration: 2000,
                            })
                        }).catch(err => {
                            console.error(err)
                        }).finally(() => {
                            wx.hideLoading()
                        })
                    }
                }
            })
           },
        imagesPerview(event) {
            let currentUrl = event.currentTarget.dataset.url;
            let pictureFileids = event.currentTarget.dataset.picturefileids.map(item =>  this.data.picUrl + item);
            wx.previewImage({
              current: currentUrl, // 当前显示图片的http链接
              urls:pictureFileids // 需要预览的图片http链接列表
            })
          },
		expandAllProduct() {
			const {originalList} = this.data
			this.setData({
				filteredProductList: [...originalList],
				showExpand: false
			})
		},
        filterNavigate() {
			this.triggerEvent('navigatedetail', {
				orderType: this.data.status,
				orderInfo: this.data.category
			})
		},
		navigateToDetail() {
			this.setTemplateName(this.data.category.templateName)
			this.setCurrOrderInfo(this.data.category)
			this.filterNavigate()
		}
	}
})
