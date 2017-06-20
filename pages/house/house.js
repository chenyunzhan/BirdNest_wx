//logs.js

// 引入配置
var config = require('../../config');

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    swiperWidth:355
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        //更新数据
        that.setData({
          swiperWidth: res.windowWidth
        })
      }
    })

    wx.request({
      url: config.service.houseUrl, //仅为示例，并非真实的接口地址
      data: {
        x: '11',
        y: '22'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

      }
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})
