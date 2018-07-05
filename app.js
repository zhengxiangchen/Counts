//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.login();
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

  globalData: {
    staticUrl:'http://192.168.1.205:8080/api_v1/mini',
    userInfo:null,
    plateNumber:''//批次号或者车牌号
  },

  login:function(){
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("没有过期");
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        console.log("已经过期");
        wx.redirectTo({
          url: '/pages/authorize/authorize',
        })
      }
    })
  }
})
