/**
 * 根据接口返回数据生成食堂购物车页面的可选日期和服务时间
 * @param {Object} serveTerm
 * @return {{selectedDates: *[], orderTips: string}}
 */
export function handleServeTerm(serveTerm) {
	const selectedDates = _getDateList(serveTerm.restaurantMenuDisplayDays)
	const orderTips = _getOrderTips(serveTerm)
	return {
		selectedDates,
		orderTips
	}
}

/**
 * 获取倒计时
 * @return {number}
 * @param selectedDate
 * @param offSetDays
 */
export function getCountdown(selectedDate, offSetDays) {
	const res = wx.getSystemInfoSync()
	if (res.platform === 'ios') {
		selectedDate = selectedDate.replace(/-/g, '/')
	}
	return getTimeDiff(selectedDate, offSetDays)
}

/**
 * 生成uuid
 * @param length 控制生成uuid的长度 (并非总长度)
 * @return {string}
 */
export function generateUuid(length) {
	return Number(Math.random().toString().slice(3, length) + Date.now()).toString(36);
}

/**
 * 计算日期偏差天数
 * @return {number}
 * @param targetDate
 */
export function getDaysDiff(targetDate) {
	const now = new Date()
	const diffMs = Math.abs(targetDate - now)
	return Math.round(diffMs / 1000 / 60 / 60 / 24)
}

// setDay映射
const setDayMap = {
	0: '当天',
	1: '前一天',
	2: '前两天',
}

/**
 * 根据接口返回的天数生成可选日期
 * @param totalDays
 * @return {*[]}
 * @private
 */
function _getDateList(totalDays) {
	const today = getToday()
	const dates = []
	
	for (let i = 0; i < totalDays; i++) {
		const date = new Date(today)
		date.setDate(date.getDate() + i)
		
		const yyyy = date.getFullYear()
		const MM = (date.getMonth() + 1).toString().padStart(2, '0')
		const dd = date.getDate().toString().padStart(2, '0')
		if (i === 0) {
			dates.push({
				text: '定今天',
				date: `${yyyy}.${MM}.${dd}`,
				dateString: `${yyyy}-${MM}-${dd}`,
				index: i
			})
		} else if (i === 1) {
			dates.push({
				text: '定明天',
				date: `${yyyy}.${MM}.${dd}`,
				dateString: `${yyyy}-${MM}-${dd}`,
				calcDate: date,
				index: i
			})
		} else if (i === 2) {
			dates.push({
				text: '定后天',
				date: `${yyyy}.${MM}.${dd}`,
				dateString: `${yyyy}-${MM}-${dd}`,
				calcDate: date,
				index: i
			})
		} else {
			dates.push({
				date: `${yyyy}.${MM}.${dd}`,
				calcDate: date,
				dateString: `${yyyy}-${MM}-${dd}`,
				index: i
			})
		}
	}
	return dates
}

/**
 * 根据接口返回的服务时间生成食堂购物车的订餐时间提醒
 * @param serveTerm
 * @return {string}
 * @private
 */
function _getOrderTips(serveTerm) {
	const {restaurantOrderTimes} = serveTerm
	let morningTips = '', noonTips = '', afternoonTips = ''
	restaurantOrderTimes.forEach((item, index) => {
		if (index === 0) {
			morningTips = `早餐最迟${setDayMap[item.daysBefore.toString()]}${item.timesBefore}`
		} else if (index === 1) {
			noonTips = `午餐最迟${setDayMap[item.daysBefore.toString()]}${item.timesBefore}`
		} else {
			afternoonTips = `晚餐最迟${setDayMap[item.daysBefore.toString()]}${item.timesBefore}`
		}
	})
	return `订餐时间：${morningTips}；${noonTips}；${afternoonTips}`
}

/**
 * 获取今天的日期
 * @return {string}
 */
function getToday() {
	const today = new Date()
	const res = wx.getSystemInfoSync()
	if (res.platform === 'ios') {
		return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
	}
	return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
}

export function getFormattedToday() {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

/**
 * 获取时间差
 * @return {number}
 * @param selectedDate
 * @param offSetDays
 */
function getTimeDiff(selectedDate, offSetDays) {
	const timeCompatible = selectedDate.replace(/-/g, '/')
	// 获取当前时间
	const now = new Date()
	const target = new Date(timeCompatible)
	

// 计算时间差
	let diff = target.getTime() - now.getTime()
// 目标时间 - 现在的时间  0
	if (diff < 0) {
		return 0
	}
	
	diff -= (offSetDays * 86400000)
	return diff

// 格式化时间差
// 	const hh = Math.floor(diff / 1000 / 60 / 60)
// 	const mm = Math.floor((diff / 1000 / 60) % 60)
// 	const ss = Math.floor((diff / 1000) % 60)
//
// 	return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`
}

function splitTime(timeStr) {
	const date = new Date("1970-01-01 " + timeStr);
	
	const hours = date.getHours()
	const minutes = date.getMinutes()
	const seconds = date.getSeconds()
	return {
		hours,
		minutes,
		seconds
	}
}