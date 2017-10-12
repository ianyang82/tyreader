var s = 10;
var f = 0;
const app = getApp()
var freshtime=new Date().getTime();
var userInfo = require("../comm/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusidx: 0,
    anslist: [],
    title: '朗读点评'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo.getuserinfo(this, app);
    this.loadans(0);
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
    this.loadans(0);
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
  lower:function(e){
    if(this.data.end)
      return;
    if (new Date().getTime()-freshtime>3000)
    {
      freshtime = new Date().getTime();
      this.loadansend();
    }
  },
  loadans: function (o) {
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.userInfo == null || app.globalData.userInfo.id == null)
      return;
    var that = this; var f = 0;
    if (that.data.anslist.length > 0)
      f = that.data.anslist[0].id;
    var data_opt = { s: s, f: o, c: 1 };
    console.log(data_opt);
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
        // console.log(req.data);
        that.setData({
          anslist: req.data,
          end:false
        });
      }, complete: function () {
        wx.hideLoading();
      }
    })
  },
  loadansend: function () {
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.userInfo == null || app.globalData.userInfo.id == null)
      return;
    var that = this; var e = 0;
    if (that.data.anslist.length > 0)
      e = that.data.anslist[that.data.anslist.length-1].id;
    var data_opt = { s: s, e: e, c: 1 };
    // console.log(data_opt);
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
          anslist: that.data.anslist.concat(req.data),
          end:req.data.length<s
        });
      },complete:function(){
        wx.hideLoading();
      }
    })
  },
  paly: function (e) {
    var index = e.currentTarget.dataset.idx;
    var that = this;
    // console.log("play url:::" + app.globalData.audiourl + that.data.anslist[index].vurl);
    if (that.data.anslist[index].play) {
      wx.stopBackgroundAudio();
      that.data.anslist[index].play = false;
      that.setData({
        anslist: that.data.anslist
      });
    }
    else
      wx.playBackgroundAudio({
        dataUrl: app.globalData.audiourl + that.data.anslist[index].vurl,
        success: function () {
          // console.log("paly success")
          for (var i = 0; i < that.data.anslist.length; i++) {
            if (i == index)
              that.data.anslist[i].play = true;
            else
              that.data.anslist[i].play = false;
          };
          that.setData({ anslist: that.data.anslist });
          wx.request({
            url: app.globalData.serverurl + '/answer/paly',
            data: { 'code': app.globalData.code, 'id': that.data.answer.id },
            success: function (res) {
              console.log('add read.........')
            }
          });
        }, fail: function () {
          console.log("paly fail")
        }
      })

  }
})