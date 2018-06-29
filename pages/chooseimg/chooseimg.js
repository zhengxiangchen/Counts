// pages/chooseimg/chooseimg.js
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    img:{}
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
    var filesList = this.data.files;
    for (var i = 0; i < filesList.length; i++){
      var img = filesList[i];
      if (img.src == this.data.img.src){
        img.circularList = this.data.img.circularList;
        //只有当图片信息中存在区域圆的时候编辑标记才改为true
        if (img.circularList.length > 0){
          img.isEditor = true;
        }
      }
    }
    this.setData({
      files: filesList
    })
  
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var srcList = res.tempFilePaths;
        for (var i = 0; i < srcList.length; i++){
          var imgObj = {};
          imgObj.src = srcList[i];
          imgObj.isEditor = false;
          that.data.files.push(imgObj);
        }
        var images = that.data.files;
        if (images.length > 9) {
          wx.showToast({
            title: '最多选取9张图片',
            icon:'none'
          })
          images = images.slice(0, 9)
        }
        that.setData({
          files: images,
        });
      }
    })
  },
  previewImage: function (e) {
    var urls = [];
    var files = this.data.files;
    for (var i = 0; i < files.length; i++){
      urls.push(files[i].src);
    }
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //点击上传图片按钮
  uploadimgs:function(){
    var that = this;
    var listLength = that.data.files.length;
    if (listLength <= 0){
      $Message({
        content: '请选择图片',
        type: 'warning',
        duration: 3
      });
    }
  },

  deleteOrEditor:function(e){
    var that = this;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        if(res.tapIndex == 0){
          var index = e.currentTarget.dataset.index;
          var img = that.data.files[index];
          let imgToStr = JSON.stringify(img);
          wx.navigateTo({
            url: '/pages/editorimg/editorimg?imgToStr=' + imgToStr,
          })
        }
        if (res.tapIndex == 1) {
          wx.showModal({
            title: '删除操作',
            content:'是否删除图片',
            confirmText: "删除",
            cancelText: "取消",
            success: function (res) {
              if (res.confirm) {
                var imgs = that.data.files;
                var index = e.currentTarget.dataset.index;
                imgs.splice(index, 1);
                that.setData({
                  files: imgs
                });
              }
            }
          });
        }
      }
    });

  }
})