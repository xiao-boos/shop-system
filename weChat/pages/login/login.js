//index.js
//获取应用实例
const app = getApp()
 let username=''
 let password=''
Page({
  data: {
    username: '',
    password: '',
    clientHeight:''
  },
  onLoad(){
    var that=this
    wx.getSystemInfo({ 
      success: function (res) { 
        console.log(res.windowHeight)
          that.setData({ 
              clientHeight:res.windowHeight
        }); 
      } 
    }) 
  },
  //获取输入款内容
  phone(e){
    this.setData({
      username:e.detail.value
    })
   
  },
  password(e){
    this.setData({
      password:e.detail.value
    })
 
  },
  register(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  //登录事件
  goadmin(){
    let flag = false  //表示账户是否存在,false为初始值
    if(this.data.username=='')
    {
      wx.showToast({
        icon:'none',
        title: '账号不能为空',
      })
    }else if(this.data.password==''){
      wx.showToast({
        icon:'none',
        title: '密码不能为空',
      })
    }else{
      var userList =  wx.getStorageSync('register-user-list')
      if(userList){
        let admin = Array.from(userList);
          for (let i = 0; i < admin.length; i++) {  //遍历数据库对象集合
            if (this.data.username === admin[i].phone) { //账户已存在
              flag=true;
              if (this.data.password !== admin[i].password) {  //判断密码正确与否
                wx.showToast({  //显示密码错误信息
                  title: '密码错误！！',
                  icon: 'error',
                  duration: 2500
                });
               break;
              } else {
                break;
              }
            }
          };
          if(flag==false)//遍历完数据后发现没有该账户
          {
            wx.showToast({
              title: '该用户不存在,请先进行注册！',
              icon: 'error',
              duration: 2500
            })
          }else{
            wx.showToast({  //显示登录成功信息
                title: '登陆成功！！',
                icon: 'success',
                duration: 2500
              })
              flag=true;
              wx.setStorageSync('convenience-login','true')
              wx.setStorageSync('username', this.data.username)
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/index/home/index',
                })
            },1000)
          }
      }else{
        wx.showToast({
          title: '该用户不存在,请先进行注册！',
          icon: 'error',
          duration: 2500
        })
      }
    }
  },
})
 
