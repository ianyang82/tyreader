//app.js
var util = require("pages/comm/util.js")
App({
  onLaunch: function () {
    // 展示本地存储能力
  },
  globalData: {
    userInfo: null,
    code:null,
    serverurl: "https://kkhaitao.com/ty",
    audiourl: "https://kkhaitao.com"
    // serverurl: "http://uc.huantest.com:8080/ty"
  }
//  scope: 'scope.userInfo',   // 用户信息 wx.getUserInfo
//  scope: 'scope.userLocation',   // 地理位置 wx.getLocation, wx.chooseLocation
// scope: 'scope.address',    // 通讯地址 wx.chooseAddress
//  scope: 'scope.record',   // 录音功能 wx.startRecord
})
