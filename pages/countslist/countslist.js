// pages/countslist/countslist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictures: [],
    allCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openId = wx.getStorageSync("openId");
    var plateNumber = app.globalData.plateNumber;
    wx.request({
      url: 'http://127.0.0.1:8080/api_v1/mini/picture/getPictures',
      data: {
        openId: openId,
        plateNumber: plateNumber
      },
      success: function (res) {
        that.setData({
          pictures:res.data
        })

        var count = 0;
        var list = that.data.pictures;
        for (var i = 0; i < list.length; i++) {
          count = count + list[i].signCount;
        }
        that.setData({
          allCount: count
        })
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '加载计数后图片失败',
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

  //点击返回按钮
  back:function(){
    wx.reLaunch({
      url: '/pages/plateNumber/plateNumber',
    })
  }

})