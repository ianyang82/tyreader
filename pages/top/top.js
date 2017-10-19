// pages/top/top.js
var s=10;
var f=0;
const app = getApp()
var userInfo = require("../comm/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusidx:0,
    anslist:[],
    title:'排行榜 TOP10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo.getuserinfo(this, app);
    this.loadans(0);
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

    var that = this;
    wx.onBackgroundAudioStop(function () {
      for (var i = 0, len = that.data.anslist.length; i < len; ++i) {
        that.data.anslist[i].play = false;
      }
      that.setData({
        anslist: that.data.anslist
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.stopBackgroundAudio();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.stopBackgroundAudio();
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
  changenav: function (e) {
    if (e.target.dataset.idx != this.data.focusidx)
    {
      this.setData({
        focusidx: e.target.dataset.idx
      })
      this.loadans(e.target.dataset.idx);
    }
  },
  loadans:function (o) {
    var that = this; var f = 0;
    if (that.data.anslist.length > 0)
      f = that.data.anslist[0].id;
    var data_opt = {"t":o};
    wx.request({
      url: app.globalData.serverurl + '/answer/toplist',
      data: data_opt,
      success: function (req) {
        if (req.data.error != undefined) {
          if (req.data.error.code == '401') {
            app.globalData.userInfo == null;
            app.globalData.code = null;
            wx.reLaunch({
              url: 'index',
            })
          }
          return;
        }
        // console.log(req.data);
        that.setData({
          anslist: req.data
        });
      }
    })
  },
  paly:function (e){
    var index = e.currentTarget.dataset.idx;
    var that=this;
    if(that.data.anslist[index].play)
    {
      that.data.anslist[index].play = false;
      that.setData({
        anslist: that.data.anslist
      })
      wx.stopBackgroundAudio();
    }
    else
    wx.playBackgroundAudio({
      dataUrl: app.globalData.audiourl + that.data.anslist[index].vurl,
      success:function(){
        console.log("paly success")
        for (var i = 0; i < that.data.anslist.length; i++) {
          if (i == index)
            that.data.anslist[i].play=true;
          else
            that.data.anslist[i].play = false;
        };
        that.setData({ anslist: that.data.anslist});
        wx.request({
          url: app.globalData.serverurl + '/answer/paly',
          data: { 'code': app.globalData.code, 'id': that.data.anslist[index].id },
          success: function (res) {
            console.log('add read.........')
          }
        })
      },fail:function(){
        console.log("paly fail")
      }
    })
    
  }
})