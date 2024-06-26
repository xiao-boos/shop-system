Component({
	properties: {
		style: {
			type: String,
			value: ''
		},
		pageIndex: {
			type: Number,
			value: 0
		},
		pageSize: {
			type: Number,
			value: 10
		}
	},
	data: {
		triggered: false, // 下拉刷新中
		isLoadingMore: false, // 上拉加载中
		isNoMore: false, // 是否没有更多数据
	},
	methods: {
		// 下拉刷新
		onPullDown(e) {
			if (this._freshing) return
			// console.log("onPullDown", e);
			this._freshing = true
			this.setData({
				isNoMore: false,
				pageIndex: 0
			})
			
			this.triggerEvent('PullDown', {
				pageIndex: this.data.pageIndex,
				pageSize: this.data.pageSize,
				callback: (res = []) => { // 请传数组
					// console.log("onPullDown.callback", res);
					this.setData({
						triggered: false,
						pageIndex: res.length === 0 ? this.data.pageIndex : this.data.pageIndex + 1
					})
					this._freshing = false
				}
			})
		},
		
		// 上拉加载
		
		onPullUp(e) {
			if (this._loadingMore || this.data.isNoMore) return
			// console.log("onPullUp", e);
			this._loadingMore = true
			this.setData({
				isLoadingMore: true,
				pageIndex: this.data.pageIndex === 0 ? 1 : this.data.pageIndex
			})
			
			this.triggerEvent('PullUp', {
				pageIndex: this.data.pageIndex,
				pageSize: this.data.pageSize,
				callback: (res = []) => { // 请传数组
					// console.log("onPullUp.callback", res);
					this.setData({
						isLoadingMore: false,
						isNoMore: res.length === 0,
						pageIndex: res.length === 0 ? this.data.pageIndex : this.data.pageIndex + 1
					})
					this._loadingMore = false
				}
			})
		},
	}
})
