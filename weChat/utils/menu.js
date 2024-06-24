import constants from "../common/constants"

export const MENU_HOME = {
	bannerText: {
		title: '欢迎使用',
		subTitle: '医院便民服务',
		content: '为您提供全面的便民服务, 就诊更舒心'
	},
	menuList: [
		{
			uri: '/pages/shopping/index/index',
			menuName: '点餐购物',
			iconUri: `${constants.imageBaseUrl}/index/dcgw_icon@2x.png`,
		},
		{
			uri: '/pages/serve/peihu/index/index',
			menuName: '陪护服务',
			iconUri: `${constants.imageBaseUrl}/index/phfw_icon@2x.png`,
		},
		{
			uri: '/pages/serve/peizhen/index/index',
			menuName: '陪诊服务',
			iconUri: `${constants.imageBaseUrl}/index/pzfw_icon@2x.png`,
		},
		{
			uri: '/pages/renting-beds/index/index',
			menuName: '陪护床租借',
			iconUri: `${constants.imageBaseUrl}/index/phczj_icon@2x.png`,
		},
		{
			uri: '/pages/article-reserves/index/index',
			menuName: '物品寄存',
			iconUri: `${constants.imageBaseUrl}/index/wpjc_icon@2x.png`,
		},
		{
			uri: '/pages/wheelchair-rental/index/index',
			menuName: '轮椅租借',
			iconUri: `${constants.imageBaseUrl}/index/lyzj_icon@2x.png`,
		},
		{
			uri: '/pages/phone-charge/index',
			menuName: '手机充电',
			iconUri: `${constants.imageBaseUrl}/index/sjcd_icon@2x.png`,
		},
		{
			uri: '/pages/convenient-facilities/index/index',
			menuName: '便民设施',
			iconUri: `${constants.imageBaseUrl}/index/bmss_icon@2x.png`,
		},
		{
			uri: '/pages/registration-property/index/index',
			menuName: '失物登记',
			iconUri: `${constants.imageBaseUrl}/index/swdj_icon@2x.png`,
		},
		{
			uri: '/pages/opinion/index/index',
			menuName: '建议意见',
			iconUri: `${constants.imageBaseUrl}/index/jyyj_icon@2x.png`,
		},
	],
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