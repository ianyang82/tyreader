// pages/question/index.js
const app = getApp()
var userInfo = require("../comm/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: null,
    que:null,
    'title': '添加作品'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    userInfo.loadtype(app,that);

    that.loadque(options.id);
  },
  loadque:function(id){
    var that = this;
    if (id)
    {
    that.setData({'title':'修改作品'})
    wx.request({
      url: app.globalData.serverurl + '/question/next',
      data: { id: id },
      success: function (res) {
        var index = 0; var len = that.data.types.length; 
        for (var i = 0;i < len; i++) {
          if (that.data.types[i].id == res.data.type) {
            index = i;
            break;
          }
        }
        that.setData({ que: res.data, index: index });
      }
    });
    }
  },
  bindPickerChange: function (e) {
    this.setData({index:e.detail.value});
  },
  submitinfo:function(e){
    var that=this;
    if (that.data.index==undefined)
    {
      wx.showToast({
        title: '请选择分类',
      });return;
    }
    if (e.detail.value.title == '') {
      wx.showToast({
        title: '标题不能为空',
      }); return;
    }
    if (e.detail.value.content == '') {
      wx.showToast({
        title: '内容不能为空',
      }); return;
    }
    console.log("type::::" + e.detail.value.type);
    wx.request({
      url: app.globalData.serverurl + '/question/save',
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { 'title': e.detail.value.title, 'content': e.detail.value.content, 'note': e.detail.value.note, 'type': that.data.types[e.detail.value.type].id, 'id': that.data.que==null?'':that.data.que.id},
      success: function (req) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          mask: true,
        });
        setTimeout(function(){
          wx.navigateBack({
          })
        },1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("ready........")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("show........")
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
  
  }
})