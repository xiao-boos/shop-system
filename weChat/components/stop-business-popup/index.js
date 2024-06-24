Component({
	properties: {
		show: {
			type: Boolean,
			value: false
		},
		serveTerm: Object,
		suspendDate: String,
		haveMultiCanteens: Boolean
	},
	data: {},
	methods: {
		navigateBack() {
			wx.navigateBack({
				delta: 1
			})
		}
	}
});
