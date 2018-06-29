//index.js  
//获取应用实例  
var app = getApp();

Page({
  data: {
    tempFilePaths: '',
    disabled:false,
  },
  onLoad: function (options) {
    console.log(options.plateNumber);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {

  },
  //选择图片
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths,
        })
      }
    })
  },


  //点击图片计数按钮
  toCount:function(){
    var that = this;
    that.setData({
      disabled:true
    })

    wx.showLoading({
      title: '正在计数',
    })

    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        disabled: false
      })
      wx.navigateTo({
        url: '/pages/counts/counts?tempFilePath=' + that.data.tempFilePaths,
      })
    }, 3500);
  }
  
})