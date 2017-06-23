//logs.js

// 引入配置
var config = require('../../config');

var roomArray = new Array();

var selectedRoom = { id: 0 };

/**
 * 生成房子的ids
 */
function mergeRoomIds(selectedHouse) {
  var roomArr = new Array()
  if (selectedHouse.room0>0) {
    roomArr.push(selectedHouse.room0)
  }
  if (selectedHouse.room1 > 0) {
    roomArr.push(selectedHouse.room1)
  }
  if (selectedHouse.room2 > 0) {
    roomArr.push(selectedHouse.room2)
  }
  if (selectedHouse.room3 > 0) {
    roomArr.push(selectedHouse.room3)
  }
  if (selectedHouse.room4 > 0) {
    roomArr.push(selectedHouse.room4)
  }
  if (selectedHouse.room5>0) {
    roomArr.push(selectedHouse.room5)
  }
  if (selectedHouse.room6 > 0) {
    roomArr.push(selectedHouse.room6)
  }
  if (selectedHouse.room7>0) {
    roomArr.push(selectedHouse.room7)
  }
  if (selectedHouse.room8 > 0) {
    roomArr.push(selectedHouse.room8)
  }
  if (selectedHouse.room9 > 0) {
    roomArr.push(selectedHouse.room9)
  }


  return roomArr.join("-");
}

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    swiperWidth:355,
    roomNo: '请选择房间类型',
    price: '请选择房间类型'
  },
  onLoad: function (options) {
    console.log('onLoad')

    var selectedHouse = JSON.parse(options.selectedHouse)
    var images = selectedHouse.images.split("|")
    var imageUrls = new Array()
    for(var i=0; i<images.length; i++) {
      imageUrls.push(config.service.imageUrl + '/'+images[i])
    }

    this.setData({
      imgUrls: imageUrls,
      address: selectedHouse.address,
      room:selectedHouse.room,
      selectedHouse: selectedHouse
    })


    var that = this
    wx.getSystemInfo({
      success: function (res) {
        //更新数据
        that.setData({
          swiperWidth: res.windowWidth
        })
      }
    })

    var roomIds = mergeRoomIds(selectedHouse)

    wx.request({
      url: config.service.getRoomsUrl, //仅为示例，并非真实的接口地址
      data: {
        roomsId: roomIds
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        roomArray = res.data
        that.setData({
          roomArray: res.data
        })
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
  },
  chooseRoomType: function (e) {
    console.log(e.target.id)
    selectedRoom = roomArray[e.target.id]
    this.setData({
      price: selectedRoom.price,
      roomNo: selectedRoom.roomNo,
      selectedRoomIndex:e.target.id
    })
  },
  callLandlord: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.selectedHouse.phone //仅为示例，并非真实的电话号码
    })
  }
})
