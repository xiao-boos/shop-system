import { observable, action } from 'mobx-miniprogram'

const shopStore = observable({
	shoppingType: '', // 当前选择是食堂/即时购物
	address: '', // 当前选择地址
	tempCartList: [], // 购物车列表
	totalPrice: 0, // 购物车总价
	currRecordId: '', // 当前地址 id
	shopInfo: {}, // 商家信息，用于后续订单提交
	canteenInfo: {}, // 食堂信息，用于后续订单提交
	serveTerm: {}, // 食堂的服务条款（时间等）
	initCanteenDateInfo: {}, // 食堂页面显示时间等信息
	sendTime: '', // 页面显示配送时间
	timeGroup: {}, // 提交订单时的beginTime 和 endTime 信息
	selectAMPM: '', // 选择的时间段
	
	setShoppingType: action(function (value) {
		this.shoppingType = value
	}),
	setAddress: action(function (value) {
		this.address = value
	}),
	setTempCartList: action(function (value) {
		this.tempCartList = value
	}),
	setTotalPrice: action(function (value) {
		this.totalPrice = value
	}),
	setCurrRecordId: action(function (value) {
		this.currRecordId = value
	}),
	setShopInfo: action(function (value) {
		this.shopInfo = value
	}),
	setServeTerm: action(function (value) {
		this.serveTerm = value
	}),
	setInitCanteenDateInfo: action(function (value) {
		this.initCanteenDateInfo = value
	}),
	setCanteenInfo: action(function (value) {
		this.canteenInfo = value
	}),
	setSendTime: action(function (value) {
		this.sendTime = value
	}),
	setTimeGroup: action(function (value) {
		this.timeGroup = value
	}),
	setSelectAMPM: action(function (value) {
		this.selectAMPM = value
	})
})

export default shopStore