// pages/me/teacher.js
const app = getApp()
var userInfo = require("../comm/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  chooseImage: function(){
    var that=this;
    wx.chooseImage({
      sizeType: ['compressed'],
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(res.width)
            console.log(res.height)
          }
        })
        console.log(res.tempFilePaths)
        that.data.imageurl = res.tempFilePaths[0];
        that.setData({ imageurl: that.data.imageurl})
      },count:1
    })
  },submitinfo:function(e){
    wx.showLoading({
      title: '提交中...',
    })
    var serverid = "photo/"+new Date().getTime().toString(16);
    wx.uploadFile({
      url: app.globalData.serverurl + '/teacher/apply',
      filePath: this.data.imageurl,
      header: { "Content-Type": "multipart/form-data" },
      name: 'file',
      formData: {
        'code': app.globalData.code,
        'serverid': serverid,
        'name': e.detail.value.name,
        'detail': e.detail.value.detail,
        'title': e.detail.value.title,
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '提交成功，等待管理员审核，取消继续编辑',
          icon: 'success',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }, fail: function (e) {
        console.log( e);
      },complete:function(){
        wx.hideLoading();
      }
    })
  }
})