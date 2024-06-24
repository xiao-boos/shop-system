import { observable, action } from 'mobx-miniprogram'
import utils from "../utils/index"

const authStore = observable({
  token: '',
  authLogined: false,
  userInfo: null,
  currPatient: null,
  menus: null,

  setTokenStore: action(function (value) {
    utils.setToken(value)
    this.token = value
  }),
  setAuthLogined: action(function (value) {
    this.authLogined = value
  }),
  setCurrPatient: action(function (value) {
    this.currPatient = value
  }),
  setUserInfo: action(function (value) {
    this.userInfo = value
  }),
  setMenus: action(function (value) {
    this.menus = value
  })
})

export default authStore