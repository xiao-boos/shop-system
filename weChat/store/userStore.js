import {observable, action} from 'mobx-miniprogram'

const userStore = observable({
	userId: null,
	currPatient: null,
	patientList: null,
	registerDetail: null,
	userInfo: null,
	
	setCurrPatient: action(function (value) {
		this.currPatient = value
	}),
	setPatientList: action(function (value) {
		this.patientList = value
	}),
	setUserId: action(function (value) {
		this.userId = value
	}),
	setUserInfo: action(function (value) {
		this.userInfo = value
	}),
	setRegisterDetail: action(function (value) {
		this.registerDetail = value
	})
})

export default userStore