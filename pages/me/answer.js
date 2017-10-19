var s = 10;
var f = 0;
var uid=null;
var freshtime=new Date().getTime();
const app = getApp()
var userInfo = require("../comm/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusidx: 0,
    anslist: [],
    title: '我的朗读',
    end:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!userInfo.getuserinfo(this, app))
      return;
    if (options.id)
    {
      uid = options.id;
      if (uid != app.globalData.userInfo.id)
        this.setData({ title: 'TA的朗读'})
    }
    else
      uid = app.globalData.userInfo.id;
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
    this.loadans(0);
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
  loadans: function (o) {
    var that = this; var f = 0;
    if (that.data.anslist.length > 0)
      f = that.data.anslist[0].id;
    var data_opt = { s: s, f: o, uid: uid};
    wx.request({
      url: app.globalData.serverurl + '/answer/pagelist',
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
        console.log(req.data);
        that.setData({
          anslist: req.data
        });
      }
    })
  },
  lower:function(e){
    if (this.data.end||new Date().getTime() - freshtime<3000)
      return;
    freshtime = new Date().getTime();
    var that = this; var e = that.data.anslist[that.data.anslist.length-1].id;
    var data_opt = { s: s, e: e, uid: uid };
    wx.request({
      url: app.globalData.serverurl + '/answer/pagelist',
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
        that.setData({
          end: req.data.length < s,
          anslist: that.data.anslist.concat(req.data)
        });
      }
    })
  },
  paly: function (e) {
    var index = e.currentTarget.dataset.idx;
    var that = this;
    console.log("play url:::" + app.globalData.audiourl + that.data.anslist[index].vurl);
    if (that.data.anslist[index].play)
    {
      wx.stopBackgroundAudio();
      that.data.anslist[index].play = false;
      that.setData({
        anslist: that.data.anslist
      })
    }
    else
      wx.playBackgroundAudio({
        dataUrl: app.globalData.audiourl + that.data.anslist[index].vurl,
        success: function () {
          console.log("paly success")
          for (var i = 0; i < that.data.anslist.length; i++) {
            if (i == index)
              that.data.anslist[i].play = true;
            else
              that.data.anslist[i].play = false;
          };
          that.setData({ anslist: that.data.anslist });
          wx.request({
            url: app.globalData.serverurl + '/answer/paly',
            data: { 'code': app.globalData.code, 'id': that.data.anslist[index].id },
            success: function (res) {
              console.log('add read.........')
            }
          })
        }, fail: function () {
          console.log("paly fail")
        }
      })

  }
})