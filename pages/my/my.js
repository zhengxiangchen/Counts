// pages/my/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDot:false,
    plateList:[],//批次号列表
    showLeft:false,//是否打开左侧抽屉
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var staticUrl = app.globalData.staticUrl;
    var openId = wx.getStorageSync("openId");

    wx.request({
      url: staticUrl + '/user/getPlateList',
      data: {
        openId: openId
      },
      success: function (res) {
        var plateList = res.data;
        wx.setStorage({
          key: 'plate_count',
          data: plateList.length,
        })
      }
    })
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
    var that = this;
    var staticUrl = app.globalData.staticUrl;
    var openId = wx.getStorageSync("openId");
    var plate_count = wx.getStorageSync("plate_count");
    wx.request({
      url: staticUrl + '/user/getPlateList',
      data:{
        openId: openId
      },
      success:function(res){
        var plateList = res.data;
        that.setData({
          plateList: plateList
        })
        if (plateList.length > plate_count){
          console.log("之前有进行图片计数操作");
          that.setData({
            showDot: true
          })
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showLeft: false
    })
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
    return {
      imageUrl: '/images/share_pic.png',
      title: '图片计数小程序',
      path: '/pages/index/index'
    }
  },


  //点击历史记录
  toHistory:function(){
    var that = this;
    wx.setStorage({
      key: 'plate_count',
      data: that.data.plateList.length,
    })
    that.setData({
      showDot:false,
      showLeft: !that.data.showLeft
    })
  },



  //点击某批次号,显示该批次的计数图片
  showCounts:function(e){
    var plateNumber = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/historyList/historyList?plateNumber=' + plateNumber,
    })
  }

})