// pages/editorimg/editorimg.js
var imageUtil = require('../../utils/util.js');
var context;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    befwidth: 0,//原始图片的宽
    befheight: 0,//原始图片的高
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高
    defaultRadius:50,//默认半径大小
    show:false,//是否显示调节大小的控件
    isEraser:false,//是否启用橡皮擦

    circularList:[],//所有圆圈的集合
    circular:{},//圆的对象(圆心X坐标,圆心Y坐标,对应半径)
    img:{},//存选完区域后整个图片对象(包含属性:src,圆对象的集合)

    backActionList:[],//用于记录点击回退按钮后应该执行的操作对象
    backAction:{},//回退操作对象(包含属性:action[添加0|删除1],圆对象)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var img = JSON.parse(options.imgToStr);
    console.log(img)
    this.setData({
      tempFilePath: img.src,
      img:img
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
        //画原始图片
        context = wx.createCanvasContext('firstCanvas')
        context.drawImage(that.data.tempFilePath, 0, 0, that.data.imagewidth, that.data.imageheight);
        //如果img中含有圆对象,再画圆
        var img = that.data.img;
        var list = img.circularList;
        if (list != undefined && list.length > 0){
          context.setStrokeStyle('red');
          for (var i = 0; i < list.length; i++){
            var circular = list[i];
            that.data.circularList.push(circular);
            context.beginPath();
            context.arc(circular.x, circular.y, circular.radius, 0, 2 * Math.PI);
            context.stroke();
          }
        }
        context.draw();
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

  //根据传过来的圆的列表画出所有的圆
  drawCircular:function(list){
    var that = this;
    context.clearRect(0, 0, that.data.imagewidth, that.data.imageheight);
    context.drawImage(that.data.tempFilePath, 0, 0, that.data.imagewidth, that.data.imageheight);
    context.setStrokeStyle('red');
    for (var i = 0; i < list.length; i++){
      var circular = list[i];
      context.beginPath();
      context.arc(circular.x, circular.y, circular.radius, 0, 2 * Math.PI);
      context.stroke();
    }
    context.draw();
  },

  //手指触摸动作开始
  touch: function (e) {
    var that = this;
    var isEraser = that.data.isEraser;
    if (isEraser){
      //已经启用橡皮擦,点击--去除圆心相近的已有圆
      console.log("已经启用橡皮擦");
      console.log(that.data.circularList);
      var circularList = that.data.circularList;
      var pointX = e.changedTouches[0].x;
      var pointY = e.changedTouches[0].y;
      if (circularList.length <= 0){
        console.log("啥都不用做");
        return;
      }else{
        for (var i = 0; i < circularList.length; i++){
          var circular = circularList[i];
          var circularX = circular.x;
          var circularY = circular.y;
          var radius = circular.radius;
          //计算圆心与橡皮擦点的距离
          var distance = Math.sqrt(Math.pow((pointX - circularX), 2) + Math.pow((pointY - circularY),2));
          if (distance <= radius){
            //橡皮擦的点在某个圆内,去掉这个圆,重新调用画图函数
            console.log("橡皮擦的点在某个圆内,去掉这个圆");
            that.data.circularList.splice(i, 1);
            that.drawCircular(that.data.circularList);

            //记录回退操作
            var backAction = {};
            backAction.action = 0;
            backAction.circular = circular;
            that.data.backActionList.push(backAction);
          }
        }
      }
    }else{
      //未启用橡皮擦,点击--画区域
      var radius = that.data.defaultRadius;
      //组装一个圆对象
      var circular = {};
      circular.x = e.changedTouches[0].x;
      circular.y = e.changedTouches[0].y;
      circular.radius = radius;
      //把圆对象放入集合中
      that.data.circularList.push(circular);

      that.drawCircular(that.data.circularList);

      //记录回退操作
      var backAction = {};
      backAction.action = 1;
      backAction.circular = circular;
      that.data.backActionList.push(backAction);
    }
  },

  //点击大小按钮,展示滑块控件
  showRadius:function(){
    var that = this;
    var isShow = that.data.show;
    if(isShow){
      that.setData({
        show: false
      })
    }else{
      that.setData({
        show: true
      })
    }
  },

  //滑动滑块得到当前的半径
  changeRadius:function(e){
    var that = this;
    var newRadius = e.detail.value;
    that.setData({
      defaultRadius: newRadius
    })
  },

  //点击回退按钮
  back:function(){
    var that = this;
    var circularList = that.data.circularList;
    if (circularList.length <= 0) {
      return;
    } else {
      circularList.pop();
      that.setData({
        circularList: circularList
      })
      that.drawCircular(that.data.circularList);
    }
  },

  //点击回退按钮
  back1: function () {
    var that = this;
    var backActionList = that.data.backActionList;
    if (backActionList.length <= 0) {
      return;
    } else {
      var backAction = backActionList.pop();
      var action = backAction.action;
      var circular = backAction.circular;
      //如果action为0添加一个圆
      if (action == 0){
        that.data.circularList.push(circular);
      }
      //如果action为1删除一个圆
      if (action == 1) {
        var circularList = that.data.circularList;
        for (var i = 0; i < circularList.length; i++) {
          var circularobj = circularList[i];
          var circularX = circularobj.x;
          var circularY = circularobj.y;
          if (circular.x == circularX && circular.y == circularY){
            that.data.circularList.splice(i, 1);
          }
        }
      }
      that.drawCircular(that.data.circularList);
    }
  },

  //点击保存按钮
  save:function(){
    var that = this;
    that.data.img.src = that.data.tempFilePath;
    that.data.img.circularList = that.data.circularList;
    console.log(that.data.img);

    let pages = getCurrentPages();//获取pages（pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      img: that.data.img,
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  //点击橡皮擦按钮
  changeEraser:function(){
    var that = this;
    var isEraser = that.data.isEraser;
    if (isEraser){
      that.setData({
        isEraser:false
      })
    }else{
      that.setData({
        isEraser: true
      })
    }
  }
})