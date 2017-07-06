//logs.js

// 引入配置
var config = require('../../config');

var roomArray = new Array();

var nearRoomArr = new Array();

var selectedRoom = { id: 0 };

var roomIndex = 0;



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



    var that = this
    wx.getSystemInfo({
      success: function (res) {
        //更新数据
        that.setData({
          swiperWidth: res.windowWidth
        })
      }
    })



    if (options.nearRoomArr!=undefined) {

      nearRoomArr = JSON.parse(options.nearRoomArr)
      roomIndex = options.roomIndex
      selectedRoom = nearRoomArr[roomIndex]
      roomIndex++

      var furnitureArr = getFurnitureArr(selectedRoom)
      var imageUrls = getImageUrl(selectedRoom)
      
      that.setData({
        furnitureArr: furnitureArr,
        imgUrls: imageUrls,
        price: selectedRoom.price,
        roomNo: selectedRoom.roomNo,
        address: selectedRoom.address,
        room: selectedRoom.room,
        phone: selectedRoom.phone
      })
      return;
    }

    var selectedHouse = JSON.parse(options.selectedHouse)

    this.setData({
      address: selectedHouse.address,
      room:selectedHouse.room,
      phone: selectedHouse.phone,
      latitude: selectedHouse.latitude,
      longitude: selectedHouse.longitude
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
        selectedRoom = roomArray[0]

        var furnitureArr = getFurnitureArr(selectedRoom)
        var imageUrls = getImageUrl(selectedRoom)

        that.setData({
          furnitureArr: furnitureArr,
          imgUrls: imageUrls,
          roomArray: res.data,
          price: selectedRoom.price,
          roomNo: selectedRoom.roomNo
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
      phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    })
  },
  getNextRoom: function(e) {


    if (nearRoomArr.length > 0) {
      if(nearRoomArr.length > roomIndex) {
        wx.navigateTo({
          url: '../house/house?roomIndex=' + roomIndex + '&nearRoomArr=' + JSON.stringify(nearRoomArr)
        })
      }
    } else {
      wx.request({
        url: config.service.getRoomsOrderByDistance, //仅为示例，并非真实的接口地址
        data: {
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          houseId: selectedRoom.id
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          wx.navigateTo({
            url: '../house/house?roomIndex=' + roomIndex + '&nearRoomArr=' + JSON.stringify(res.data)
          })
        }
      })
    }
  }
})


/**
 * 生成房子的ids
 */
function mergeRoomIds(selectedHouse) {
  var roomArr = new Array()
  if (selectedHouse.room0 > 0) {
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
  if (selectedHouse.room5 > 0) {
    roomArr.push(selectedHouse.room5)
  }
  if (selectedHouse.room6 > 0) {
    roomArr.push(selectedHouse.room6)
  }
  if (selectedHouse.room7 > 0) {
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

function getImageUrl(selectedRoom) {
  var images = selectedRoom.attribute0.split("|")
  var imageUrls = new Array()
  for (var i = 0; i < images.length; i++) {
    imageUrls.push(config.service.imageUrl + '/' + images[i])
  }
  return imageUrls
}

function getFurnitureArr(selectedRoom) {
  var furnitureArr = new Array();

  if (selectedRoom.desk > 0) {
    furnitureArr.push('桌子')
  }

  if (selectedRoom.bed > 0) {
    furnitureArr.push('床子')
  }

  if (selectedRoom.chair > 0) {
    furnitureArr.push('椅子')
  }

  if (selectedRoom.toilet > 0) {
    furnitureArr.push('卫生间')
  }

  return furnitureArr
}
