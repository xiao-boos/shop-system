import constants from "../common/constants";

let currentTrack = {
	parentCategory: '',
	category: '',
	cspId: ''
}
let menuId = ''

function addTrack({menuName, cspId}, categoryText = '') {
	if (!currentTrack.category && !currentTrack.parentCategory) {
		const {category, parentCategory} = filterTrackCategory(menuName)
		currentTrack.category = category
		currentTrack.parentCategory = parentCategory
	}
	if (categoryText) {
		currentTrack.category = categoryText
	}
	if (cspId) {
		currentTrack.cspId = cspId
	}
}

function getTrackList() {
	return Object.values(currentTrack).join(".")
}

function getCurrentTrack() {
	return currentTrack
}

function clearTrackList() {
	currentTrack = {}
}

function setMenuId(menu) {
	menuId = menu
}

function getMenuId() {
	return menuId
}

function filterTrackCategory(menuName) {
	return {
		category: menuName === '点餐购物' ? constants.CATEGORY_MAP[menuName].category : menuName,
		parentCategory: constants.CATEGORY_MAP[menuName].parentCategory
	}
}

export {addTrack, getTrackList, clearTrackList, setMenuId, getMenuId, getCurrentTrack, filterTrackCategory}