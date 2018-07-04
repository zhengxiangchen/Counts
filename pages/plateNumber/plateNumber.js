// pages/plateNumber/plateNumber.js
var app = getApp();
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber: '',
    visible: false,
    actions: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ]
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

  //监听输入情况
  inputValue: function(e){
    this.setData({
      plateNumber: e.detail.value
    })
  },

  //点击确定按钮
  sureClick: function(e){
    var that = this;
    app.globalData.plateNumber = that.data.plateNumber;
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: 'http://127.0.0.1:8080/api_v1/mini/plateNumber/checkPlateNumber',
      data:{
        openId: openId,
        plateNumber: app.globalData.plateNumber
      },
      success:function(res){
        //如果该批次号不存在
        if(!res.data){
          wx.navigateTo({
            url: '/pages/chooseimg/chooseimg'
          })
        }else{
          that.setData({
            visible: true
          });
        }
      }
    })
  },

  //用户选择删除之前上传的批次
  handleClick({ detail }) {
    var that = this;
    if (detail.index === 0) {
      that.setData({
        visible: false
      });
      wx.showToast({
        icon:'none',
        title: '请重新输入批次号',
      })
    } else {
      var openId = wx.getStorageSync("openId");
      var plateNumber = app.globalData.plateNumber;
      const action = [...that.data.actions];
      action[1].loading = true;

      that.setData({
        actions: action
      });

      wx.request({
        url: 'http://127.0.0.1:8080/api_v1/mini/plateNumber/deletePlate',
        data:{
          openId: openId,
          plateNumber: plateNumber
        },
        success: function (res) {
          if (res.data == 'success') {
            action[1].loading = false;
            that.setData({
              visible: false,
              actions: action
            });
            $Message({
              content: '删除成功！',
              type: 'success'
            });
          } else {
            action[1].loading = false;
            that.setData({
              visible: false,
              actions: action
            });
            wx.showToast({
              icon: 'none',
              title: '删除重复批次异常',
            })
          }
        }
      })

      // setTimeout(() => {
      //   action[1].loading = false;
      //   this.setData({
      //     visible: false,
      //     actions: action
      //   });
      //   $Message({
      //     content: '删除成功！',
      //     type: 'success'
      //   });
      // }, 2000);
    }
  }
})