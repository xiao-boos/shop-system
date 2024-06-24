/**
 * 根据服务大类选择接口url
 * @param category 服务大类
 * @return {string} 请求路径
 */
export function categoryFilter(category) {
	let url = ''
	if (category === 1) {
		url = '/convenience-server/wxapp/custom/restaurant-order/001/detail'
	} else if (category === 2) {
		url = '/convenience-server/wxapp/custom/product-order/001/detail'
	} else if (category === 3 || category === 4) {
		url = '/convenience-server/wxapp/custom/serve-order/001/detail'
	} else if (category === 5 || category === 8 || category === 6) {
		url = '/convenience-server/wxapp/custom/rent-order/001/detail'
	}
	return url
}

/**
 * 根据服务大类选择页面路径
 * @param orderType
 * @param category
 * @param backPayStatus
 * @return {string} 页面路径
 */
export function orderPageFilter(orderType, {category, backPayStatus}) {
	let url = ''
	if (orderType === '1' && backPayStatus === 1) {
		const backPayUrlMap = {
			5: 'index/order/payback/rent-payback',
			8: 'index/order/payback/rent-payback',
			6: 'index/order/payback/deposit-payback'
		}
		return backPayUrlMap[String(category)]
	}
	if (category === 1 || category === 2) {
		url = 'index/order/detail-page/restaurant-shop'
	} else if (category === 3 || category === 4) {
		url = 'index/order/detail-page/accompany-escort'
	} else if (category === 5 || category === 8) {
		url = 'index/order/detail-page/bed-wheelchair'
	} else if (category === 6) {
		url = 'index/order/detail-page/deposit'
	}
	return url
}

// 按钮文本映射
const buttonTextMap = {
	continue: '继续支付',
	confirm: '确认完成',
	cancel: '取消订单',
	refund: '申请退款',
	withdraw: '撤回申请',
	more: '再来一单',
	renew: '一键续订',
	revoke: '撤回申请'
};

// 按钮样式映射
const buttonClassMap = {
	primary: 'primary-btn',
	gray: 'gray-btn',
	red: 'red-btn',
	blue: 'blue-btn'
};

// 按钮方法名映射
const buttonMethodMap = {
	continue: 'continueToPay',
	confirm: 'confirmFinish',
	cancel: 'cancelOrder',
	refund: 'applyRefund',
	withdraw: 'withdrawRefund',
	more: 'sameOrder',
	renew: 'renewOrder',
	revoke: 'revokeRefund'
};

// status和category为空说明不用筛选订单状态，直接返回
const stateOperationsMap = {
	0: [
		{name: 'cancel', status: [], category: [], class: 'gray'},
		{name: 'continue', status: [], category: [], class: 'primary'}
	],
	1: [
		{name: 'confirm', status: [2], category: [1, 2], class: 'primary'},
		{name: 'cancel', status: [2], category: [3, 4, 5, 6, 8], class: 'gray'},
		{name: 'confirm', status: [9], category: [1, 2, 3, 4], class: 'primary'},
		{name: 'revoke', status: [4], category: [1, 2, 3, 4], class: 'blue'},
		{name: 'renew', status: [2], category: [3, 4],class: 'primary'}
		// {name: 'refund', status: [10], category: [], class: 'red'},
		// {name: 'confirm', status: [10], category: [], class: 'primary'},
		// {name: 'withdraw', status: [4], category: [], class: 'blue'}
	],
	2: [
		{name: 'refund', status: [6], category: [], class: 'gray'},
		{name: 'revoke', status: [11], category: [], class: 'blue'},
		{name: 'more', status: [6, 12, 7], category: [1, 2],class: 'primary'},
		{name: 'renew', status: [6, 12, 7], category: [3, 4],class: 'primary'},
	]
};

/**
 * 筛选不同订单和状态的按钮（因为订单卡片和订单详情的按钮要保持一致）
 * @param {number} orderType 订单类型，待支付/执行中/已完成/已取消
 * @param {number} orderStatus 订单状态，参考如下：
 * 		0:待支付;
 * 		2:已支付完成并且执行中;
 * 		3:未支付已撤销;
 * 		4:已支付申请撤销;
 * 		5:已支付完成撤销;
 * 		6:用户确认订单完成;
 * 		7:用户撤销退款转完成
 * 		9:已接单/领取/寄存
 * 		10:商家已经完成
 * 		11: 用户撤销退款申请
 * 		12: 完成订单中已申请过退款并完成的订单（不可再次申请退款）
 * @param {number} category 订单业务类型
 * @return {Object[] || []}
 */
export function btnFilter({orderType, orderStatus, category}) {
	const buttons = [];
	if (orderType === 3) return buttons
	const operations = stateOperationsMap[orderType];
	
	const matchedOps = operations.filter(op => {
		if (op.status.length === 0 && op.category.length === 0) return true;
		return (op.status.length === 0 || op.status.includes(orderStatus)) &&
			(op.category.length === 0 || op.category.includes(category));
	});
	
	matchedOps.forEach(op => {
		const button = {
			text: buttonTextMap[op.name],
			className: buttonClassMap[op.class],
			methodName: buttonMethodMap[op.name]
		};
		buttons.push(button);
	});
	
	return buttons;
}