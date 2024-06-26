// pages/index/mine/address-msg/address-edit/index.js
import utils from "../../../../../utils/index"
import { ifEmptyToast,checkPhoneNumber } from '../../../../../utils/common-method'
import {getPageParams}  from "../../../../../utils/wxUtils"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    id:'',
    contactPhone:'',
    contactPerson:'',
    homeAddr:'',
    district:''
  },
  defaultAddr({ detail }){
    this.setData({ checked: detail });
  },
  	/**
  	 * 获取地区信息
  	 * @param {Event} e
  	 */
  	getArea(e) {
  	    this.setData({
            district: e.detail,
  	    })
  	},
  submit() {
    if (ifEmptyToast(this.data.contactPerson, '收货人不能为空')) return false
    if (ifEmptyToast(this.data.contactPhone, '手机号不能为空')) return false
    if (checkPhoneNumber(this.data.contactPhone)) return false
    if (ifEmptyToast(this.data.district, '地址不能为空')) return false
    if (ifEmptyToast(this.data.homeAddr, '详细地址不能为空')) return false
    wx.showLoading({title: '提交中'})
    const data = {
        receiverId: this.data.receiverId,
        contactPhone: this.data.contactPhone,
        contactPerson: this.data.contactPerson,
        homeAddr: this.data.homeAddr,
        district:this.data.district,
        receiverType: this.data.checked ? '11' : '10'
    }
    wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000,
      })
      setTimeout(() => {
        var pages = getCurrentPages();//获取页面数据
        var prevPage = pages[pages.length - 2]; //上一个页面
        wx.navigateBack({
            delta: 1,//上一个页面
            success: () => {
                //调用前一个页面的方法takePhoto()。
                prevPage.getData()
            }
          })
      },1000)
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      //修改地址
    if(options && options.params){
        const obj =  getPageParams(options)
        wx.setNavigationBarTitle({
            title: "修改地址"
        })
        this.setData({
            receiverId:obj.receiverId,
            contactPhone:obj.contactPhone,
            contactPerson:obj.contactPerson,
            homeAddr:obj.homeAddr,
            district:obj.district,
            checked:obj.receiverType == 11?true:false
        })
    }else{
        this.setData({
            contactPhone:app.globalData.mobile
        })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})