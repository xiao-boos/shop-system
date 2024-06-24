import utils from "../../utils/index";
import {handleServeTerm} from "../../utils/shopping-cart-utils";

const queryOrderDetail = async (category, outTradeNo) => {
	const urlMap = new Map([
		[1, '/convenience-server/wxapp/custom/restaurant-order/001/detail'],
		[2, '/convenience-server/wxapp/custom/product-order/001/detail'],
	])
	const url = urlMap.get(category)
	const res = await utils.get(url, {
		outTradeNo: outTradeNo
	}).catch(e => console.log(e))
	
	const result = {
		...res,
		address: res.receiverInfo.building + '  ' + res.receiverInfo.buildFloor + '  ' + res.receiverInfo.room
	}
	return result
}

const queryShopList = async (cspId) => {
	const res = await utils.get('/convenience-server/wxapp/custom/service-provider/001/list', {
		pageIndex: 1,
		pageSize: 10,
		category: 1
	}).catch(e => console.log(e))
	const shop = res.recordList.find(shop => shop.cspId === cspId)
	return shop
}

const queryConvenienceShopList = async (cspId) => {
	const res = await utils.get('/convenience-server/wxapp/custom/service-provider/001/list', {
		pageIndex: 1,
		pageSize: 10,
		category: 2
	}).catch(e => console.log(e))
	const shop = res.recordList.find(shop => shop.cspId === cspId)
	return shop
}

const shopInfoHandler = async (cspId) => {
	const shop = await queryShopList(cspId)
	return setCanteenShopInfo(shop)
}

const convenienceShopInfoHandler = async (cspId) => {
	const shop = await queryConvenienceShopList(cspId)
	
}

function setCanteenShopInfo(canteen) {
	const {selectedDates, orderTips} = handleServeTerm(canteen.serveTerm)
	return {
		canteenInfo: {
			cspId: canteen.cspId,
			category: canteen.category,
		},
		serveTerm: canteen.serveTerm,
		initCanteenDateInfo: {
			selectedDates,
			orderTips
		},
		isInBusiness: canteen.serveTerm.isInBusiness
	}
}

export {
	shopInfoHandler,
	queryOrderDetail,
	queryConvenienceShopList
}