import constants from "../common/constants"

export const MENU_HOME = {
	bannerText: {
		title: '欢迎使用',
		subTitle: '商城系统',
		content: '为您提供全面的购物服务, 下单更舒心'
	},
	serviceList: [
		{
			uri: '',
			menuName: '中药代煎',
			iconUri: `${constants.imageBaseUrl}/index/zydj_icon@2x.png`,
		},
		{
			uri: '',
			menuName: '病例邮寄',
			iconUri: `${constants.imageBaseUrl}/index/blyj_icon@2x.png`,
		},
		{
			uri: '',
			menuName: '上门护理',
			iconUri: `${constants.imageBaseUrl}/index/smhl_icon@2x.png`,
		}
	]
}