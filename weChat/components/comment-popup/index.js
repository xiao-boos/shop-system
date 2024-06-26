import { storeBindingsBehavior } from "mobx-miniprogram-bindings"
import constants from "../../common/constants"
import utils from "../../utils/index"
import httpUtils from "../../utils/httpUtils"

const computedBehavior = require('miniprogram-computed').behavior

Component({
	behaviors: [storeBindingsBehavior, computedBehavior],
	properties: {
		popupShow: {
			type: Boolean,
			value: false,
			observer: function(popupShow) {
				if (!popupShow) {
					this.reset()
				}
			}
		},
		outTradeNo: {
			type: String,
			value: ''
		},
		currOrderDetail: {
			type: Object,
			value: {}
		},
		isTabbarPage: {
			type: Boolean,
			value: false
		},
		isDetailPage: {
			type: Boolean,
			value: false
		}
	},
	data: {
		autoSizeData: {
			maxHeight: 60,
		},
		photoIcon: constants.imageBaseUrl + '/swdj/photo_icon.png',
		fileList: [],
		comment: '',
		score: 0,
		pictureFileId: '',
		picUrl: constants.CONST_API,
	},
	watch: {
		'currOrderDetail': function (currOrderDetail) {
			if (Object.keys(currOrderDetail).length > 0) {
				let files = []
				if (currOrderDetail.pictureFileId) {
					currOrderDetail.pictureFileId.forEach(item => {
						files.push({
							status: "success",
							message: "成功",
							url: this.data.picUrl + item
						});
					})
				}
				this.setData({
					outTradeNo: currOrderDetail.outTradeNo,
					score: currOrderDetail.score,
					comment: currOrderDetail.comment,
					pictureFileId: currOrderDetail.pictureFileId,
					fileList: files,
				})
			} else {
				this.setData({
					outTradeNo: '',
					score: '',
					comment: '',
					pictureFileId: [],
					fileList: [],
				})
			}
		}
	},
	methods: {
		customUploadEvent() {
			this.triggerEvent('commentpopupmark')
		},
		//上传前判断图片类型和大小
		beforeRead(event) {
			const {file, callback} = event.detail
			callback(file.type === 'image')
		},
		afterRead(event) {
			const {file} = event.detail;
			const {fileList = []} = this.data;
			if (file.size > 1024 * 1024 * 2) {
				wx.showToast({
					title: '图片大小不能超过2M',
					icon: 'none'
				})
				return
			}
			fileList.push({
				...file,
				url: file.url
			})
			this.setData({
				fileList: fileList
			})
		},
		//移除图片
		deleteImg(event) {
			let index = event.detail.index
			this.data.fileList.splice(index, 1)
			this.setData({
				fileList: this.data.fileList
			})
		},
		onChange(e) {
			this.setData({
				score: e.detail
			})
		},
		//上传图片
		async fileUpload() {
			const picArr = []
			const newFileList = []
			const {fileList} = this.data
			fileList.forEach(item => {
				if (item.url.indexOf(this.data.picUrl) == 0) {
					picArr.push(item.url.replaceAll(this.data.picUrl, ""));
				} else {
					newFileList.push(item);
				}
			})
			if (newFileList.length == 0) {
				return picArr
			}
			await Promise.all(
				newFileList.map(async (item) => {
					await 	picArr.push(JSON.parse(res.data).data.fileId)
				})
			)
			return picArr
		},
		async submitComment() {
			if (!this.validate()) {
				return wx.showToast({
					title: '请先打分并输入描述',
					icon: 'none'
				})
			}
			const picUploadRes = await this.fileUpload()
			const imagePaths = picUploadRes.join(',')
			this.triggerEvent('refreshCommenQuery')
			if (this.data.isDetailPage) {
				this.refreshPage()
				this.reset()
			} else {
				this.onClose()
				this.reset()
			}
		},
		validate() {
			if (this.data.score === 0) return false
			if (this.data.comment === '' || this.data.comment.trim() === '') return false

			return true
		},
		reset() {
			this.setData({
				fileList: [],
				comment: '',
				score: 0,
				pictureFileId: '',
			})
		},
		refreshPage() {
			this.triggerEvent('setpopupshow', {
				popupShow: false,
				popupName: 'refreshPage'
			})
			wx.showToast({
				title: '评价成功',
				icon: 'none'
			})
		},
		onClose() {
			this.triggerEvent('setpopupshow', {
				popupShow: false,
				popupName: 'controlCommentPopupShow'
			})
			wx.showToast({
				title: '已取消',
				icon: 'none'
			})
		}
	}
})
