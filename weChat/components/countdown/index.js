const computedBehavior = require('miniprogram-computed').behavior

Component({
	behaviors: [computedBehavior],
	interval: null,
	properties: {
		time: {
			type: String,
			value: ''
		},
	},
	data: {
		remainingTime: '',
	},
	watch: {
		'time, date': function (time) {
			this.reset(time)
		}
	},
	methods: {
		startCountdown() {
			if (this.data.remainingTime === '') {
				wx.showLoading()
			}
			const endTime = new Date(this.data.time).getTime()
			this.interval = setInterval(() => {
				const now = new Date().getTime()
				const diff = endTime - now
				if (diff <= 0) {
					clearInterval(this.interval)
					this.interval = null
					this.triggerEvent('endcountdown', {isEnd: true})
					return
				}
				
				const hours = Math.floor((diff % (24 * 3600 * 1000)) / 3600 / 1000);
				const minutes = Math.floor((diff % (3600 * 1000)) / 60 / 1000);
				const seconds = Math.floor((diff % (60 * 1000)) / 1000);
				
				this.setData({
					remainingTime: this.formatTime(hours, minutes, seconds)
				})
				if (this.data.remainingTime !== '') {
					wx.hideLoading()
				}
			}, 1000)
		},
		/**
		 * 重置倒计时
		 * @param time
		 */
		reset(time) {
			clearInterval(this.interval)
			this.interval = null
			this.startCountdown()
		},
		/**
		 * 格式化时间为 HH:mm:ss
		 * @param hours
		 * @param minutes
		 * @param seconds
		 * @return {string}
		 */
		formatTime(hours, minutes, seconds) {
			return `${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`;
		},
	},
	lifetimes: {
		ready() {
		}
	}
})
