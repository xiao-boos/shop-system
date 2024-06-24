import utils from "./index";

const ui = require('./ui')
import constants from "../common/constants"

/**
 * 网络请求
 * @param obj
 *  obj.data 请求接口需要传递的数据
 *  obj.showLoading 控制是否显示加载 Loading 默认为 false 不显示
 *  obj.contentType 默认为 application/json
 *  obj.method 请求的方法  默认为GET
 *  obj.url 请求的接口路径
 *  obj.message 加载数据提示语
 * @return {Promise<unknown>}
 */
function request(obj) {
	return new Promise((resolve, reject) => {
		if (obj.showLoading) ui.showLoading(obj.message || '加载中')
		
		let contentType = 'application/json'
		let method = 'GET'
		const data = {}
		if (obj.data) {
			Object.assign(data, obj.data)
		}
		if (obj.contentType) {
			const contentTypeMap = {
				json: 'application/json',
				form: 'application/x-www-form-urlencoded',
			}
			contentType = contentTypeMap[obj.contentType]
		}
		if (obj.method) {
			method = obj.method
		}
		
		wx.request({
			url: constants.CONST_API + obj.url,
			data,
			method,
			header: {
				'Content-Type': contentType,
				'token': wx.getStorageSync('token') || utils.token
			},
			success(res) {
				ui.hideLoading()
				if (res.data.code === 0) {
					resolve(res.data)
				} else {
					reject(res.data)
				}
			},
			fail(err) {
				ui.hideLoading()
				console.log('===============================================================================================')
				console.log('==    接口地址：' + obj.url)
				console.log('==    接口参数：' + JSON.stringify(data))
				console.log('==    请求类型：' + method)
				console.log("==    服务器异常")
				console.log('===============================================================================================')
				reject('请求失败，请检查服务或网络')
			},
			complete() {
				ui.hideLoading()
			}
		})
	})
}

function login() {
	return new Promise((resolve, reject) => {
		wx.login({
			success(res) {
				if (res.code) {
					resolve(res.code)
				} else {
					reject('微信登录失败' + res.errMsg)
				}
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

function apiPost(obj) {
	return request({
		...obj,
		method: 'POST',
		contentType: 'form'
	})
}

function get(obj) {
	return request({
		...obj,
		method: 'GET'
	})
}

/**
 * 上传图片
 * uploadImage(url, params = {}, file)
 *   .then((res) => {
 *     console.log('图片上传成功，返回结果:', res);
 *   })
 *   .catch((err) => {
 *     console.error('图片上传失败:', err);
 *   });
 * @param url 请求路径
 * @param params 请求参数
 * @param file 图片路径
 */
function uploadImage(url, params = {}, file) {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: constants.CONST_API + url,
			filePath: file,
			header: {
				'token': wx.getStorageSync('token')
			},
			name: 'file',
			formData: params,
			success(res) {
				if (res.statusCode === 200) {
					resolve(res)
				}
			},
			fail(res) {
				reject(res)
			}
		})
	})
}

/**
 * 批量上传，因小程序本身不支持批量上传所以单独处理
 * 	uploadImageByBatch(url, {fileBizType}, files = [])
 *   .then(() => {
 *     console.log('所有图片上传成功');
 *   })
 *   .catch((err) => {
 *     console.error('图片上传失败:', err);
 *   })
 * @param url {String}
 * @param params {Object}
 * @param files {Array}
 * @return {Promise<unknown>}
 */
function uploadImageByBatch(url, {fileBizType}, files = []) {
	return new Promise((resolve, reject) => {
		const uploadTasks = []
		for (let i = 0; i < files.length; i++) {
			const uploadTask = wx.uploadFile({
				url: constants.CONST_API + url,
				filePath: files[i],
				header: {
					'token': wx.getStorageSync('token')
				},
				name: 'file',
				formData: {
					'remoteUrl': constants.CONST_API,
					'fileBizType': fileBizType,
					'platFileName': files[i].url.split('/').pop(),
				},
				success(res) {
					if (res.statusCode === 200) {
						resolve(res)
					}
				},
				fail(res) {
					reject(res)
				}
			})
			uploadTasks.push(uploadTask)
		}
		Promise.all(uploadTasks).then(() => {
			resolve()
		}).catch((err) => {
			reject(err)
		})
	})
}

export default {
	apiPost,
	get,
	login,
	uploadImage,
	uploadImageByBatch
}