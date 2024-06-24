let isShowLoading = false
export const showToast = function(content, duration = 2000, callback) {
	wx.showToast({
		title: content,
		icon: 'none',
		duration
	})

	// toast展示完消失的时候执行回调
	if(callback) {
		setTimeout(() => {
			callback();
		}, duration)
	}
}

export const showLoading = function (title) {
	if (isShowLoading) return
	wx.showLoading({
		title: title || '',
		mask: true,
		success() {
			isShowLoading = true
		}
	})
}

export const hideLoading = function () {
	if (!isShowLoading) return
	isShowLoading = false
	wx.hideLoading()
}