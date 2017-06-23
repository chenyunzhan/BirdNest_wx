// 引入配置
var config = require('../../config');

var selectedHouse = {id:0};

var houseArray = new Array();

/**
 * 生成房子的位置
 */
function createMarker(markerObject) {
  return { name: markerObject.name, iconPath: '/resources/images/timg.jpg', id: markerObject.id, latitude: markerObject.latitude, longitude: markerObject.longitude, width: '50', height: '50'};
}


Page({
  data: {
    currentLongitude: "113.324520",
    currentLatitude: "23.099994",
    markers: [{
      name: "测试位置",
      iconPath: "/resources/images/timg.jpg",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 100,
      iconPath: '/resources/images/location.png',
      position: {
        left: 0,
        top: 6,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        //更新数据
        that.setData({
          controls: [{
            id: 1,
            iconPath: '/resources/images/location.png',
            position: {
              left: 0,
              top: res.windowHeight-80,
              width: 50,
              height: 50
            },
            clickable: true
          }, {
            id: 2,
            iconPath: '/resources/images/i_want_enter_house.png',
            position: {
              left: (res.windowWidth-150)/2,
              top: res.windowHeight - 80,
              width: 150,
              height: 50
            },
            clickable: true
          }]
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
        houseArray = res.data;
        var markers = that.data.markers;
        for (var i = 0; i < res.data.length; i++) {
          markers.push(createMarker(res.data[i]));
          that.setData({ markers});
        }

      }
    }),
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var currentLatitude = res.latitude
        var currentLongitude = res.longitude
        that.setData({ currentLatitude });
        that.setData({ currentLongitude });
      }
    })
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {

    for (var i = 0; i < houseArray.length; i++) {
      if (e.markerId==houseArray[i].id){
          selectedHouse = houseArray[i];
      }
    }
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
    if(selectedHouse.id<1){
      wx.showModal({
        title: '提示',
        content: '请选择您想入住的房子',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../house/house?selectedHouse=' + JSON.stringify(selectedHouse)
      })
    }
  }
})