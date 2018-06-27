// pages/counts/counts.js
var imageUtil = require('../../utils/util.js');
var context;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath : '',
    befwidth: 0,//原始图片的宽
    befheight: 0,//原始图片的高
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高
    allTempList:[]//存放所有的步骤图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tempFilePath : options.tempFilePath
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getImageInfo({
      src: that.data.tempFilePath,
      success: function (res) {
        that.setData({
          befwidth: res.width,
          befheight: res.height
        })
        var imageSize = imageUtil.imageUtil(that.data.befwidth, that.data.befheight);
        that.setData({
          imagewidth: imageSize.imageWidth,
          imageheight: imageSize.imageHeight
        })
        context = wx.createCanvasContext('firstCanvas')
        context.drawImage(that.data.tempFilePath, 0, 0, that.data.imagewidth, that.data.imageheight);
        context.draw();
        that.data.allTempList.push(that.data.tempFilePath);
      }
    })
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

  //手指触摸动作开始
  touch:function(e){
    var that = this;
    context.arc(e.changedTouches[0].x, e.changedTouches[0].y, 6, 0, 2 * Math.PI);
    context.setStrokeStyle('red');
    context.stroke();
    context.draw(true);

    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        that.data.allTempList.push(res.tempFilePath);
      }
    })
  },

  back:function(){
    var that = this;
    var allTempList = that.data.allTempList;
    if (allTempList.length <= 1){
      return;
    }else{
      allTempList.pop();
      var endTempPath = allTempList[allTempList.length - 1];
      that.setData({
        allTempList: allTempList
      })
      context.drawImage(endTempPath, 0, 0, that.data.imagewidth, that.data.imageheight);
      context.draw();
    }
  }
})