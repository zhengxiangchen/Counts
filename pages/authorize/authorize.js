// pages/superindex/superindex.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  //弹出提示框--用户点击进行授权
  openAlert: function () {
    
  },

  //获取用户信息
  getuserinfo: function (e) {
    var msg = e.detail.errMsg;
    if(msg.indexOf("ok") != -1 ){
      console.log("用户点击了同意,程序执行登录操作");
      wx.showLoading({
        title: '正在登陆',
      })
      app.globalData.userInfo = e.detail.userInfo;
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'http://127.0.0.1:8080/api_v1/mini/user/receiveCode',
              data: {
                loginCode: res.code
              },
              success: function (e) {
                wx.setStorage({
                  key: 'openId',
                  data: e.data,
                })
                wx.request({
                  url: "http://127.0.0.1:8080/api_v1/mini/user/login",
                  data: {
                    userString: app.globalData.userInfo,
                    openId: e.data
                  }
                })

                wx.redirectTo({
                  url: '/pages/plateNumber/plateNumber',
                })
              },
              fail: function(){
                console.log("登录失败");
                wx.showToast({
                  icon:'none',
                  title: '登录失败',
                })
              }
            })
          }
        }
      })

    }else{
      console.log("用户点击了拒绝");
    }
  },
})