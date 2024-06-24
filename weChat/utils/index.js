import constants from "../common/constants"
import cache from './cache.js'
import {getMenuId} from "./track";


Date.prototype.format = function (format) {
	if (!format) format = 'yyyy-MM-dd'
	var o = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds(),
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
	}
	return format
}
String.prototype.toMoney = function (options = {}) {
	const {unit = true} = options
	var result = null
	var value = Math.round(parseFloat(this) * 100) / 100
	var xsd = value.toString().split('.')
	if (xsd.length === 1) {
		result = value.toString() + '.00'
	} else if (xsd.length > 1) {
		if (xsd[1].length < 2) {
			result = value.toString() + '0'
		} else {
			result = value.toString()
		}
	}
	if (!result) result = '0.00'
	return unit ? '￥' + result : result
}
Promise.prototype.finally = function (callback) {
	let P = this.constructor
	return this.then(
		(value) => P.resolve(callback()).then(() => value),
		(reason) =>
			P.resolve(callback()).then(() => {
				throw reason
			})
	)
}
Promise.prototype.end = function (callback) {
	let error = null
	Promise.resolve()
		.then(() => {
			return this
		})
		.catch((err) => {
			callback(err)
			throw err
		})
		.then((result) => {
			callback(error || result)
			return result
		})
	return this
}
const utils = {
	tools: {
		formatNum(num, length) {
			num = `${num}`
			const l = num.length
			for (let i = 0; i < length - l; i++) {
				num = `0${num}`
			}
			return num
		},
		strip(num, precision = 12) {
			return +parseFloat(num.toPrecision(precision))
		},
		search(data = [], key, value) {
			const index = -1
			for (let i = 0; i < data.length; i += 1) {
				if (key) {
					if (data[i][key] == value) return i
				} else {
					if (data[i] == value) return i
				}
			}
			return index
		},
		getMap(list, key = 'id', value = null) {
			const map = {}
			for (let i = 0; i < list.length; i += 1) {
				if (key) {
					map[list[i][key]] = value ? list[i][value] : list[i]
				} else {
					map[list[i]] = list[i]
				}
			}
			return map
		},
		uniqueList(arr) {
			var hash = []
			for (var i = 0; i < arr.length; i++) {
				for (var j = i + 1; j < arr.length; j++) {
					if (arr[i] === arr[j]) {
						++i
					}
				}
				hash.push(arr[i])
			}
			return hash
		},
		getWidth(item) {
			return item ? item.length * 15 + 20 : 50
		},
	},
	token: '',
	currentMenuId: '15001',
	device: '',
	authorLogin: false, // 用户登陆状态
	menu_list: [],
	notWhitePage: ['register/to-register', 'payment/to-pay', 'report/index', 'patient-manage/add'], // 不使用vant-cell路由跳转的非白名单页面 等待改造在覆写的page方法中
	Promise: Promise,
	wxPromise: function (fn) {
		return function (obj = {}) {
			return new Promise((resolve, reject) => {
				obj.success = function (res) {
					// console.log('wx->success', res);
					resolve(res)
				}
				obj.fail = function (res) {
					// console.log('wx->fail', res);
					reject(res)
				}
				fn(obj)
			})
		}
	},
	post: (url, data = {}, option = {}) => {
		option.method = 'POST'
		return utils.request(url, data, option)
	},
	get: (url, data = {}, option = {}) => {
		option.method = 'GET'
		return utils.request(url, data, option)
	},
	put: (url, data = {}, option = {}) => {
		option.method = 'PUT'
		return utils.request(url, data, option)
	},
	del: (url, data = {}, option = {}) => {
		option.method = 'DELETE'
		return utils.request(url, data, option)
	},
	form: (url, data = {}, option = {}) => {
		option.method = 'POST'
		option.type = 'FORM'
		return utils.request(url, data, option)
	},
	api: (fuc, obj, {showLoad, showFail, before, after}) => {
		if (showLoad)
			wx.showLoading({
				mask: true,
				zIndex: 10,
			})
		if (before) before()
		return utils
			.wxPromise(fuc)(obj)
			.then((res) => {
				if (obj.interfUri !== '/clound-sysmgr-server/wxapp/001/queryBindStatus') {
					utils.trackRequest({obj, res})
				}
				
				if (typeof res.data == 'string') res.data = JSON.parse(res.data)
				if (res.data.code == 0) {
					return res.data.data
				}
				// token失效
				if (res.data.code === 999) {
					const list = getCurrentPages()
					if (list[0].route !== 'pages/index/home/index') {
						// 原代码是redirectTo，但是首页属于自定义tabbar页面，重定向失效
						wx.switchTab({
							url: '/pages/index/home/index',
						})
					}
					showFail = false
					throw error
				}
				// 路由没找到
				if (res.data.status == 404) {
					console.log(res.data.path + '-------' + res.data.message)
				}
				const error = new Error(res.data.message)
				error.code = res.data.code
				throw error
			})
			.catch((err) => {
				if (showFail) {
					let message = ''
					if (err.code) {
						message = err.message.split('[').length > 1 ? err.message.substring(8) : err.message
					} else {
						message = '网络异常'
						if (err.errMsg) {
							message += '：' + err.errMsg
						}
					}
					wx.showModal({
						title: '',
						content: message,
						showCancel: false,
					})
				}
				console.log('无code状态网络异常', err)
				throw err
			})
			.finally((result) => {
				if (showLoad) wx.hideLoading()
				if (after) after()
			})
			.end((result) => {
				// console.log('end',obj,result);
			})
	},
	trackRequest({obj, res}) {
		wx.request({
			url: constants.BASE_API + '/clound-sysmgr-server/wxapp/systemLog/001/tracking',
			method: 'POST',
			data: {
				currentMenuId: utils.currentMenuId,
				interfUri: obj.interfUri,
				retCode: res.data.code,
				errMsg: res.data.message,
				inputParam: JSON.stringify(obj.data),
				response: JSON.stringify(res.data.data),
				environInfo: {
					OSType: utils.device,
				}
			},
			header: {
				token: utils.token,
				'Content-Type': 'application/json',
			}
		})
	},
	manualTrack({interfUri, retCode, errMsg, operateEntity}) {
		wx.request({
			url: constants.BASE_API + '/clound-sysmgr-server/wxapp/systemLog/001/tracking',
			method: 'POST',
			data: {
				currentMenuId: getMenuId(),
				operateEntity: operateEntity,
				interfUri: operateEntity,
				retCode: retCode,
				errMsg: errMsg,
				inputParam: "{}",
				response: "{}",
				environInfo: {
					OSType: utils.device,
				}
			},
			header: {
				token: utils.token,
				'Content-Type': 'application/json',
			}
		})
	},
	request: (url, data = {}, {
		key = '',
		cacheTime = -1,
		force = false,
		local = false,
		method,
		path,
		type,
		showLoad = true,
		showFail = true,
		before,
		after
	}) => {
		const _data = {}
		for (let k in data) {
			if (data[k] || data[k] === 0 || data[k] === '') _data[k] = data[k]
		}
		const cacheKey = `${url}_${key}_${_data.projectId || ''}data`
		if (!force) {
			const _cacheData = cache.getItem(cacheKey, local)
			if (_cacheData) {
				return Promise.resolve(_cacheData)
			}
		}
		return utils
			.api(
				wx.request,
				{
					url: (path || constants.BASE_API) + url,
					interfUri: url,
					data: _data,
					method,
					header: {
						token: utils.token,
						// token: utils.getToken() || '',
						'content-type': type === 'FORM' ? 'application/x-www-form-urlencoded' : '',
					},
				},
				{
					showLoad,
					showFail,
					before,
					after,
				}
			)
			.then((result) => {
				if (cacheTime > -1) {
					Cache.setItem(cacheKey, result, cacheTime, local)
				}
				return result
			})
	},
	setToken: (token) => {
		// wx.setStorageSync('token', token)
		console.log(token)
		utils.token = token
	},
	setCurrentMenuId: (currentMenuId) => {
		utils.currentMenuId = currentMenuId
	},
	setDevice: () => {
		utils.device = wx.getSystemInfoSync().platform
	},
	/*  getToken() {
		return wx.getStorageSync('token')
	}, */
	// 用户登陆状态
	setAuthorLogin(value) {
		utils.authorLogin = value
	},
	setMenus: (menus) => {
		if (menus != null) {
			// console.log('loading route...',menus.length)
			utils.menu_list.splice(0, utils.menu_list.length)
			for (var i = 0; i < menus.length; i++) {
				let menu_clound = menus[i]
				if (menu_clound.menuType == 10) {
					//导航菜单
					var menu_local = {
						menuId: menu_clound.menuId,
						uri: menu_clound.uri,
					}
					utils.menu_list.push(menu_local)
				}
			}
		}
	},
	upload: (path, url, data = {}, {showLoad = true, showFail = true} = {}) => {
		return utils
			.api(
				wx.uploadFile,
				{
					url: constants.BASE_API + url,
					filePath: path,
					name: 'file',
					header: {
						token: utils.token,
					},
					formData: data,
				},
				{
					showLoad,
					showFail,
				}
			)
			.then((res) => {
				return res
			})
	},
	getPolicyBase64: () => {
		let date = new Date()
		date.setHours(date.getHours() + 1)
		let expiration = date.toISOString()
		const policyText = {
			expiration: expiration,
			conditions: [['content-length-range', 0, 5 * 1024 * 1024]],
		}
		return Base64.encode(JSON.stringify(policyText))
	},
	getSignature: (policyBase64) => {
		const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, ALIYUN_SECRET, {
			asBytes: true,
		})
		return Crypto.util.bytesToBase64(bytes)
	},
	aliyunUpload: (path) => {
		wx.showLoading()
		const aliyunFileKey = UPLOAD_DIR + path.replace('http://', '').replace('wxfile://', '')
		const policyBase64 = utils.getPolicyBase64()
		const signature = utils.getSignature(policyBase64)
		return utils
			.wxPromise(wx.uploadFile)({
				url: ALIYUN_HOST,
				filePath: path,
				name: 'file',
				formData: {
					key: aliyunFileKey,
					policy: policyBase64,
					OSSAccessKeyId: ALIYUN_KEY,
					signature: signature,
					success_action_status: '200',
				},
			})
			.then((res) => {
				return ALIYUN_HOST + '/' + aliyunFileKey
			})
			.finally((result) => {
				wx.hideLoading()
			})
			.end((result) => {
				// console.log(result);
			})
	},
	wxChooseImage: (
		params = {
			count: 1,
		}
	) => {
		return utils.wxPromise(wx.chooseImage)(params)
	},
	wxGetScope: (scope) => {
		return utils
			.wxPromise(wx.getSetting)()
			.then((res) => {
				if (!res.authSetting[scope]) {
					if (res.authSetting[scope] === false) {
						wx.openSetting()
						return Promise.reject('需要授权')
					} else {
						return utils
							.wxPromise(wx.authorize)({
								scope,
							})
							.then(() => {
								return Promise.resolve()
							})
							.catch((err) => {
								return Promise.reject('授权失败')
							})
					}
				} else {
					return Promise.resolve()
				}
			})
	},
	/* getLocation: () => {
		return utils
			.wxPromise(wx.getLocation)()
			.then(res => {
				return utils
					.wxPromise(wx.request)({
						url:
							'https://api.map.baidu.com/geocoder/v2/?ak=您的ak&location=' +
							res.latitude +
							',' +
							res.longitude +
							'&output=json',
						data: {},
						header: {
							'Content-Type': 'application/json',
						},
					})
					.then(res => {
						return res.data.result.addressComponent
					})
			})
    }, */
	initComponent: function (app, component) {
		if (!component.methods) component.methods = {}
		component.methods = Object.assign(component.methods, utils.extended)
		return Object.assign(component, utils.wxComponent, {
			app,
		})
	},
	initPage: function (app, page) {
		return Object.assign(page, utils.wxPage, utils.extended, {
			app,
		})
	},
	extended: {
		initData: {},
		callBack: null,
		needRefresh: true,
		change(d) {
			function changeData(data, {type, key, value}, _data) {
				if (type && _data[type]) {
					if (!data[type]) data[type] = _data[type]
					data[type][key] = value
					if (this.watch && this.watch[type])
						this.watch[type].bind(this)({
							key,
							value,
						})
				} else {
					data[key] = value
					if (this.watch && this.watch[key]) this.watch[key].bind(this)(value)
				}
				return data
			}
			
			let data = {}
			changeData = changeData.bind(this)
			if (d instanceof Array) {
				d.forEach((v) => {
					data = changeData(data, v, this.data)
				})
			} else if (!d.key && !d.value) {
				Object.keys(d).forEach((k) => {
					data = changeData(
						data,
						{
							key: k,
							value: d[k],
						},
						this.data
					)
				})
			} else {
				data = changeData(data, d, this.data)
			}
			// console.log(data)
			this.setData(data)
		},
		changeShow(event) {
			const data = this.getEventData(event)
			data.value = !this.data[data.key]
			if (data.disabled) return
			const _data = {
				[data.key]: data.show != undefined ? !data.show : data.value,
			}
			if (data.id) _data.id = data.id
			this.change(_data)
		},
		onChange(event) {
			const data = this.getEventData(event)
			data.value = event.detail.value
			data.event = 'onChange'
			// console.log('onChange', data.action, data, event);
			if (data.disabled) return
			if (data.action && this[data.action]) {
				this[data.action](data)
			}
		},
		onClick(event) {
			const data = this.getEventData(event)
			data.event = 'onClick'
			// console.log('onClick', data.action, data, event);
			if (data.disabled) return
			if (data.action && this[data.action]) {
				this[data.action](data)
			}
		},
		onLongClick(event) {
			const data = this.getEventData(event)
			data.event = 'onLongClick'
			// console.log('onLongClick', data.action, data, event);
			if (data.action && this[data.action]) {
				this[data.action](data)
			}
		},
		getEventData(event) {
			if (!event) return {}
			return Object.assign({}, event.detail || {}, event.currentTarget.dataset || {})
		},
		toast(title, callBack) {
			wx.showToast({
				title,
				icon: 'none',
			})
			if (callBack) setTimeout(callBack, 1500)
			return
		},
		ok(title, callBack) {
			wx.showToast({
				title,
			})
			if (callBack) setTimeout(callBack, 1500)
			return
		},
		goToInput(data) {
			this.needRefresh = false
			this.linkTo(
				{
					page: 'input',
				},
				(data) => {
					if (data.callback && this[data.callback]) {
						this[data.callback](data)
					}
				},
				data
			)
		},
		linkTo({page, options = {}, cb}, callBack, initData) {
			if (!page) return
			if (!utils.authorLogin && utils.notWhitePage.some((item) => item == page)) {
				// 未登录 且 跳转非白名单页面 阻止
				wx.showToast({
					title: '请先登录',
					icon: 'error',
					duration: 500,
				})
				const timeID = setTimeout(() => {
					wx.navigateTo({
						url: '/pages/auth-login/index/index',
					})
					clearTimeout(timeID)
				}, 1000)
				return
			}
			//
			this.callBack = callBack || cb || null
			if (initData) wx.setStorageSync('init_data', initData)
			wx.navigateTo({
				url: this.formatLink(page, options),
			})
		},
		replaceLink({page, options = {}}, initData, isSwitchTab) {
			if (!page) return
			if (initData) wx.setStorageSync('init_data', initData)
			wx.redirectTo({
				url: this.formatLink(page, options, isSwitchTab),
			})
		},
		goTo({page, options = {}}, initData, isSwitchTab) {
			if (!page) return
			if (initData) wx.setStorageSync('init_data', initData)
			wx.reLaunch({
				url: this.formatLink(page, options, isSwitchTab),
			})
		},
		formatLink(page, options, isSwitchTab) {
			let params = ''
			if (options instanceof Array) {
				params = options.map((item) => `${item.key.toString()}=${item.value.toString()}`).join('&')
			} else {
				params = Object.keys(options)
					.map((item) => (options[item] ? `${item}=${options[item].toString()}` : ''))
					.join('&')
			}
			
			let pos = page.indexOf('/')
			if (pos === 0) {
				let substr = page.substring(1)
				if (!isNaN(Number(substr, 10))) {
					//数字表示用服务器定义的路由
					let menuId = parseInt(substr)
					for (var i = 0; i < utils.menu_list.length; i++) {
						let menu = utils.menu_list[i]
						if (menuId == menu.menuId) {
							let url = menu.uri + '?' + params
							return url
						}
					}
					console.error('formatLink can not find route', page)
					return ''
				}
			}
			
			if (isSwitchTab) {
				return `/pages/${page}/index`
			}
			return `/pages/${page}/index?` + params
		},
		goBack(data) {
			if (data) wx.setStorageSync('callBack_data', data)
			wx.navigateBack({})
		},
		showTabBar() {
			wx.showTabBar({})
		},
		hideTabBar() {
			wx.hideTabBar({})
		},
		preview({url, urls = []}) {
			if (urls.length == 0) urls.push(url)
			// console.log(urls, url)
			wx.previewImage({
				current: url, // 当前显示图片的http链接
				urls, // 需要预览的图片http链接列表
			})
		},
		getUserInfo() {
			this.app.userLogin().then(() => {
				this.change({
					needAuth: false,
				})
			})
		},
		getPhoneNumber(e) {
			if (e.detail.errMsg != 'getPhoneNumber:ok') {
				wx.showToast({
					title: '未获取到手机号',
					icon: 'none',
				})
			} else {
				this.app.getPhoneNumber(e.detail).then(() => {
					//this.change({ needAuth: false })
				})
			}
		},
		// 判断值是否为空，如果为空则提示指定内容
		ifEmptyToast(val, toastContent) {
			if (!val || val.trim() == '') {
				wx.showToast({
					title: toastContent,
					icon: 'none',
				})
				return true
			}
			return false
		},
		// 校验手机号
		checkPhoneNumber(phoneNumber) {
			const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
			if (!reg.test(phoneNumber.trim())) {
				wx.showToast({
					title: '请正确填写手机号！',
					icon: 'none',
					duration: 1500,
				})
				return true
			}
			return false
		},
	},
	wxComponent: {
		created() {
		},
		pageLifetimes: {
			show: function () {
				if (this.callBack) {
					const data = wx.getStorageSync('callBack_data')
					if (data) {
						wx.removeStorageSync('callBack_data')
						if (typeof this.callBack === 'string' && this[this.callBack]) {
							this[this.callBack](data)
						} else {
							this.callBack(data)
						}
					}
					this.callBack = null
				}
			},
		},
	},
	wxPage: {
		loaded: false,
		firstShow: false,
		onLoad(option) {
			//
			if (this.nativeOnLoad) {
				this.nativeOnLoad(option)
			}
			const initData = wx.getStorageSync('init_data') || {}
			wx.removeStorageSync('init_data')
			if (this.app.globalData.wxLogin) {
				this.init(initData)
				this.loaded = true
			} else {
				this.app.globalData.wxLoginedCallBack = (token) => {
					this.init(initData)
					this.loaded = true
				}
				/*
				this.app.globalData.loginedCallBack = (token,menus) => {
					utils.token = token;
					this.init(initData);
					this.loaded = true;
					if( menus != null){
						utils.menu_list.splice(0,utils.menu_list.length);
						for( var i=0; i < menus.length; i++){
							let menu_clound = menus[i];
							if (menu_clound.menuType==10){
								//导航菜单
								var menu_local = {menuId:menu_clound.menuId,uri:menu_clound.uri}
								utils.menu_list.push(menu_local)
							}
						}
					}
				 
				};
*/
			}
			if (this.app.globalData.authError) {
				this.change({
					needAuth: true,
				})
			} else {
				this.app.globalData.authErrorCallBack = () => {
					this.change({
						needAuth: true,
					})
				}
			}
		},
		onShow() {
			if (this.nativeOnShow) {
				this.nativeOnShow()
			}
			if (this.loaded && this.firstShow) {
				if (this.needRefresh) {
					this.refresh()
				} else {
					this.needRefresh = true
				}
				if (this.callBack) {
					const data = wx.getStorageSync('callBack_data')
					if (data) {
						wx.removeStorageSync('callBack_data')
						if (typeof this.callBack === 'string' && this[this.callBack]) {
							this[this.callBack](data)
						} else {
							this.callBack(data)
						}
					}
					this.callBack = null
				}
			}
			if (!this.firstShow) this.firstShow = true
		},
		resetLoginedCallBack() {
			// 主要用于初始页面init被其他页面覆盖的问题
			const initData = wx.getStorageSync('init_data') || {}
			wx.removeStorageSync('init_data')
			this.app.globalData.wxLoginedCallBack = (token) => {
				this.init({
					initData,
				})
				this.loaded = true
			}
		},
	},
}

export default utils
