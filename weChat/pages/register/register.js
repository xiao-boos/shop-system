// pages/login/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  phone:'',
  password:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  code(e){
    this.setData({
      password:e.detail.value
    })
  },

  goadmin(){
    if(this.data.phone==''){
      wx.showToast({
        title: '手机号不能为空呀',
        icon:'none'
      })
    }else if(this.data.password == ''){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      })
    }else{
      //查询是否重复注册的
      var userList =  wx.getStorageSync('register-user-list')
      if(userList){
        let arr = Array.from(userList);
        for (let i = 0; i < arr.length; i++) {
          const obj = arr[i]
          if(obj.phone === this.data.phone){
           return wx.showToast({
              title: '手机号已注册',
              icon:'none'
            })
          }
        }
        arr.push({ 
           phone:this.data.phone,
          password:this.data.password
        })
        wx.setStorageSync('register-user-list',arr)
      }else{
        let arr = [{
          phone:this.data.phone,
          password:this.data.password
        }]
        wx.setStorageSync('register-user-list',arr)
      }
        wx.showToast({
          title: '注册成功',
          icon:'none'
        })
      setTimeout(function() {
        wx.navigateTo({
          url: '../login/login',
        })
      }, 1000);
        
 
    }
  },
})