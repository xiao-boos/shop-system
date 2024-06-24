import { observable, action } from 'mobx-miniprogram'

const orderStore = observable({
	orderStatus: 0,
	currOrderInfo: {},
	templateName: '',
	controlCancelPopupShow: false,
	currOrderOutTradeNo: '',
	hospitalName: '',
	selectedOrderStatus: 0,
	
	setOrderStatus: action(function (value) {
		this.orderStatus = value
	}),
	
	setCurrOrderInfo: action(function (value) {
		this.currOrderInfo = value
	}),
	
	setTemplateName: action(function (value) {
		this.templateName = value
	}),
	
	setControlCancelPopupShow: action(function (value) {
		this.controlCancelPopupShow = value
	}),
	
	setHospitalName: action(function (value) {
		this.hospitalName = value
	}),
	
	setCurrOrderOutTradeNo: action(function (value) {
		this.currOrderOutTradeNo = value
	}),

	setSelectedOrderStatus: action(function (value) {
		this.selectedOrderStatus = value
	})
})

export default orderStore