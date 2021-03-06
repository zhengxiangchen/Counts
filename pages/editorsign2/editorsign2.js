// pages/editorimg/editorimg.js
var imageUtil = require('../../utils/util.js');
var context;
var app = getApp();
var staticUrl = app.globalData.staticUrl;
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
    show: true,

    defaultRadius: 50,//默认半径大小
    RadiusShow: false,//是否显示调节大小的控件
    isEraser: false,//是否启用橡皮擦
    isMove: false,//手指触摸以后是否移动(移动则不画圈)

    transList: [],
    circularList: [],//所有圆圈的集合
    circular: {},//圆的对象(圆心X坐标,圆心Y坐标,对应半径)
    img: {},//存选完区域后整个图片对象(包含属性:src,圆对象的集合)

    backActionList: [],//用于记录点击回退按钮后应该执行的操作对象
    backAction: {},//回退操作对象(包含属性:action[添加0|删除1],圆对象)

    x: 0,
    y: 0,
    scale: 1,
    pictureId:'',

    counts: 0,//图片中标记的数量

    isHistory: false,//是否从历史页面跳转过来(是则隐藏那些修改按钮)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isHistory = wx.getStorageSync("isHistory");
    if (isHistory) {
      that.setData({
        isHistory: isHistory
      })
    }
    wx.showLoading({
      title: '图片加载中',
    })
    // var img = JSON.parse(options.imgToStr);
    // that.setData({
    //   tempFilePath: img.src,
    //   img: img
    // })
    context = wx.createCanvasContext('firstCanvas')
    var pictureId = options.id;
    that.data.pictureId = pictureId;
    wx.request({
      url: staticUrl + '/picture/getPicture',
      data: {
        id: pictureId
      },
      success: function (res) { 
        var img = res.data;
        that.setData({
          tempFilePath: img.src,
          img: img
        })
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
            context.drawImage(res.path, 0, 0, that.data.imagewidth, that.data.imageheight);
            //如果img中含有圆对象,再画圆
            var img = that.data.img;
            var list = img.circularList;
            that.setData({
              counts: list.length
            })
            if (list != undefined && list.length > 0) {
              context.setStrokeStyle('green');
              for (var i = 0; i < list.length; i++) {
                var circular = list[i];
                that.data.circularList.push(circular);
                context.beginPath();
                context.arc(circular.x, circular.y, circular.radius, 0, 2 * Math.PI);
                context.stroke();
              }
            }
            context.draw();
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'firstCanvas',
                success: function (res) {
                  console.log(res.tempFilePath);
                  wx.hideLoading();
                  var tempFilePath = res.tempFilePath;
                  that.setData({
                    show: false,
                    tempFilePath: tempFilePath
                  });
                },
                fail: function (res) {
                  console.log(res);
                }
              });
            }, 1000); 
          },
          fail: function () {
            console.log("失败");
          }
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

  onChange: function (event) {
    this.setData({
      x: event.detail.x,
      y: event.detail.y
    })

  },

  onScale: function (event) {
    this.setData({
      x: event.detail.x,
      y: event.detail.y,
      scale: event.detail.scale
    })

  },

  update: function () {
    var that = this;
    that.setData({
      show: true
    })

    setTimeout(function () {
      that.draw();
    }, 500);

  },

  draw: function () {
    var that = this;
    context = wx.createCanvasContext('firstCanvas');

    context.scale(that.data.scale, that.data.scale);

    var transX = that.data.x / that.data.scale;
    var transY = that.data.y / that.data.scale;

    context.translate(transX, transY);
    context.drawImage(that.data.tempFilePath, 0, 0, that.data.imagewidth, that.data.imageheight);

    context.draw();

    that.setData({
      transList: [],
      circularList: []
    })

  },

  //根据传过来的圆的列表画出所有的圆
  drawCircular: function (list) {
    var that = this;
    context = wx.createCanvasContext('firstCanvas');
    context.clearRect(0, 0, that.data.imagewidth, that.data.imageheight);

    context.save();

    context.scale(that.data.scale, that.data.scale);

    var transX = that.data.x / that.data.scale;
    var transY = that.data.y / that.data.scale;

    context.translate(transX, transY);
    context.drawImage(that.data.tempFilePath, 0, 0, that.data.imagewidth, that.data.imageheight);

    context.restore();

    context.setStrokeStyle('green');
    for (var i = 0; i < list.length; i++) {
      var circular = list[i];
      context.beginPath();
      context.arc(circular.x, circular.y, circular.radius, 0, 2 * Math.PI);
      context.stroke();
    }

    context.draw();
  },


  //手指触摸后移动
  move: function () {
    this.setData({
      isMove: true
    })
  },


  //手指触摸动作结束
  touch: function (e) {
    var that = this;
    var isMove = that.data.isMove;
    if (isMove) {
      that.setData({
        isMove: false
      })
      return;
    } else {
      var isEraser = that.data.isEraser;
      if (isEraser) {
        //已经启用橡皮擦,点击--去除圆心相近的已有圆
        console.log("已经启用橡皮擦");
        var circularList = that.data.circularList;
        var pointX = e.changedTouches[0].x;
        var pointY = e.changedTouches[0].y;
        if (circularList.length <= 0) {
          console.log("啥都不用做");
          return;
        } else {
          for (var i = 0; i < circularList.length; i++) {
            var circular = circularList[i];
            var circularX = circular.x;
            var circularY = circular.y;
            var radius = circular.radius;
            //计算圆心与橡皮擦点的距离
            var distance = Math.sqrt(Math.pow((pointX - circularX), 2) + Math.pow((pointY - circularY), 2));
            if (distance <= radius) {
              //橡皮擦的点在某个圆内,去掉这个圆,重新调用画图函数
              console.log("橡皮擦的点在某个圆内,去掉这个圆");
              that.data.circularList.splice(i, 1);
              that.drawCircular(that.data.circularList);

              that.setData({
                counts: that.data.counts - 1
              })

              //记录回退操作
              var backAction = {};
              backAction.action = 0;
              backAction.circular = circular;
              that.data.backActionList.push(backAction);
            }
          }
        }
      } else {
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

        that.setData({
          counts: that.data.counts + 1
        })

        //记录回退操作
        var backAction = {};
        backAction.action = 1;
        backAction.circular = circular;
        that.data.backActionList.push(backAction);
      }

    }
  },

  //点击大小按钮,展示滑块控件
  showRadius: function () {
    var that = this;
    var isShow = that.data.RadiusShow;
    if (isShow) {
      that.setData({
        RadiusShow: false
      })
    } else {
      that.setData({
        RadiusShow: true
      })
    }
  },

  //滑动滑块得到当前的半径
  changeRadius: function (e) {
    var that = this;
    var newRadius = e.detail.value;
    that.setData({
      defaultRadius: newRadius
    })
  },

  //点击回退按钮
  back: function () {
    var that = this;
    var backActionList = that.data.backActionList;
    if (backActionList.length <= 0) {
      return;
    } else {
      var backAction = backActionList.pop();
      var action = backAction.action;
      var circular = backAction.circular;
      //如果action为0添加一个圆
      if (action == 0) {
        that.data.circularList.push(circular);
      }
      //如果action为1删除一个圆
      if (action == 1) {
        var circularList = that.data.circularList;
        for (var i = 0; i < circularList.length; i++) {
          var circularobj = circularList[i];
          var circularX = circularobj.x;
          var circularY = circularobj.y;
          if (circular.x == circularX && circular.y == circularY) {
            that.data.circularList.splice(i, 1);
          }
        }
      }
      that.drawCircular(that.data.circularList);
    }
  },

  //点击保存按钮
  save: function () {
    var that = this;

    var list = that.data.circularList;

    var transList = that.data.transList;

    var transX = that.data.x / that.data.scale;
    var transY = that.data.y / that.data.scale;

    if (list != undefined && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        var circular = list[i];
        circular.x = circular.x / that.data.scale - transX;
        circular.y = circular.y / that.data.scale - transY;
        circular.radius = circular.radius / that.data.scale;
        transList.push(circular);
      }

      that.setData({
        transList: transList
      })
    }
    that.data.img.circularList = that.data.transList;

    wx.request({
      url: staticUrl + '/picture/updatePicture',
      data: {
        pictureInfo: JSON.stringify(that.data.img)
      },
      success: function () {
        wx.redirectTo({
          url: '/pages/editorsign2/editorsign2?id=' + that.data.pictureId,
        })
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '修正标记失败',
        })
      }
    })


  },

  //点击橡皮擦按钮
  changeEraser: function () {
    var that = this;
    var isEraser = that.data.isEraser;
    if (isEraser) {
      that.setData({
        isEraser: false
      })
    } else {
      that.setData({
        isEraser: true
      })
    }
  },



  //点击计数正确，返回列表页
  goList:function(){
    wx.reLaunch({
      url: '/pages/countslist/countslist',
    })
  }

})