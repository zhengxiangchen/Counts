//util.js  
function imageUtil(imgWidth,imgHeight) {
  var imageSize = {};
  var originalWidth = imgWidth;//图片原始宽  
  var originalHeight = imgHeight;//图片原始高  
  var originalScale = originalHeight / originalWidth;//图片高宽比 
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      // var windowscale = windowHeight / windowWidth;//屏幕高宽比
      // console.log("屏幕高宽比：" + windowscale);
      // if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比
      //   //图片缩放后的宽为屏幕宽  
      //   imageSize.imageWidth = windowWidth;
      //   imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      // } else {//图片高宽比大于屏幕高宽比  
      //   //图片缩放后的高为屏幕高  
      //   imageSize.imageHeight = windowHeight;
      //   imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      // }

    }
  })
  return imageSize;
}

module.exports = {
  imageUtil: imageUtil
}  