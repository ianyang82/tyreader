// pages/me/about.js
const app = getApp()
var userInfo = require("../comm/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    hasUserInfo:false,
    title: '个人信息'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo.getuserinfo(this, app);
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
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
  back:function(){
    wx.navigateBack();
  },
  submitinfo:function(e){
    var that=this;
    wx.request({
      url: app.globalData.serverurl + '/wx/updateuser',
      data: { name: e.detail.value.name, tel: e.detail.value.tel, code: app.globalData.code}
      ,success:function(res){
        if (res.data.error != undefined) {
          if (res.data.error.code == '401') {
            app.globalData.userInfo == null;
            app.globalData.code = null;
            wx.reLaunch({
              url: 'index',
            })
          }
          return;
        }
        app.globalData.userInfo.name=res.data.name;
        app.globalData.userInfo.tel = res.data.tel;
        that.setData({
          userInfo: app.globalData.userInfo
        })
      }
    })
  }
})