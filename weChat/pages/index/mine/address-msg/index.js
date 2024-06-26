// pages/index/mine/address-msg/index.js
import utils from "../../../../utils/index"
import {navigateTo}  from "../../../../utils/wxUtils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomStatus:'暂无地址信息',
    recordList:[],
    delShow:false
  },
  getData() {
    this.data.recordList = ''
    this.setData({
        recordList:  this.data.recordList,
        bottomStatus: this.data.recordList.length > 0?'':"暂无地址信息"
    })
},
    toPage(event){
        navigateTo(event.currentTarget.dataset.url, event.currentTarget.dataset.data)
    },
  //删除地址
  delAddr(event){
    var that = this
    wx.showModal({
        title: '删除确认',
        content: '是否删除所选地址？',
        confirmColor:'#3D61FB',
        cancelColor:'#666666',
        success: function (res) {
            if (res.confirm) {
                that.getData()
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000,
                    })
            }
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
        this.getData()
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