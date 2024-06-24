export function formatUrl(url, params = {}, isSubPackage = false) {
	let formattedUrl = isSubPackage ? `/pages-doctor/pages/${url}/index` : `/pages/${url}/index`
	if (Object.keys(params).length > 0) {
		formattedUrl = `${formattedUrl}?params=${encodeURIComponent(JSON.stringify(params))}`
	}
	return formattedUrl
}

/**
 *
 * @param url 页面路径
 * @param {object} params 页面参数
 * @param {boolean} isSubPackage 是否是分包
 * @return {WechatMiniprogram.PromisifySuccessResult<{url: string}, WechatMiniprogram.NavigateToOption>}
 */
export function navigateTo(url, params = {}, isSubPackage = false) {
	return wx.navigateTo({
		url: formatUrl(url, params, isSubPackage),
		fail: res => console.log(res)
	})
}

export function relaunch(url, params = {}, isSubPackage = false) {
	const newUrl = formatUrl(url, params, isSubPackage)
	return wx.reLaunch({
		url: formatUrl(url, params, isSubPackage),
		fail: res => console.log(res)
	})
}

export function redirect(url, params = {}, isSubPackage = false) {
	return wx.redirectTo({
		url: formatUrl(url, params, isSubPackage),
		fail: res => console.log(res)
	})
}

export function switchTab(url) {
	return wx.switchTab({
		url: formatUrl(url),
		fail: res => console.log(res)
	})
}

export function returnToHome() {
	return wx.switchTab({
		url: '/pages/index/home/index',
		fail: res => console.log(res)
	})
}

export function getPageParams(options) {
	const {params} = options
	if (params) {
		return JSON.parse(decodeURIComponent(options.params))
	} else {
		return false
	}
}