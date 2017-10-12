// pages/read/read.js
const app = getApp();
var userInfo = require("../comm/user.js")
var ctime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  read:false,
  play:false,
  title: '朗读录音',
  time:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo.getuserinfo(this, app);
    var that = this;
    wx.request({
      url: app.globalData.serverurl + '/question/next',
      data: { id: options.id},
      success: function (res) {
        console.log(res.data)
        that.setData({
          que: res.data
        })
      }
    });
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
  dotime:function(){
    var that=this
    setTimeout(function () {
      // console.log("do time......." + that.data.time);
      that.setData({
        time: that.data.time + 1
      })
      if (that.data.play || that.data.read)
        if (ctime==0 || ctime >= that.data.time)
        {
          that.dotime();
          if (ctime== that.data.time)
            that.setData({
              play: false
            })
        }
    },1000)
  },
  read:function(){
    var that=this;
    if (this.data.tempfilepath==null)
    {
      this.data.read = !this.data.read;
      this.setData({
        read: this.data.read
      })
    if (this.data.read){
      ctime=0;
      wx.showToast({
        title: '开始录音..',
      })
      wx.startRecord({
        success: function (res) {
          wx.showToast({
            title: '录音结束..',
          })
          var tempFilePath = res.tempFilePath
          console.log(tempFilePath)
          ctime = that.data.time;
          that.setData({
            tempfilepath: tempFilePath,
            read:false
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法正常录音。请10分钟后再次点击授权，或者删除小程序重新进入。',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      });
      this.data.time = 0;
      this.dotime();
    }else{
      wx.stopRecord();
    }
    }else{
      console.log(".......paly")
      if (!this.data.play)
      {
        console.log(".......paly1")
        var tempfilepath=this.data.tempfilepath;
        this.setData({
          play: true
        });
        wx.playVoice({
          filePath: tempfilepath,
          complete: function () {
          }, success: function () {
            console.log("start play.......");
          },fail:function(){
            console.log("play error.......");
          }
        });
        this.data.time=0;
        this.dotime();
      } else {
        console.log(".......paly2")
        wx.stopVoice();
        that.setData({
          play: false
        });
      }
    }
  },
  replay:function(){
    this.setData({
      tempfilepath: null,
      read:false,
      play: false,
      time:0
    })
  },
  save:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
    console.log("path:::::::"+that.data.tempfilepath)
    var serverid = new Date().getTime().toString(16) + "_q" + this.data.que.id;
    wx.uploadFile({
      url: app.globalData.serverurl + '/answer/answer',
      filePath: that.data.tempfilepath,
      header: { "Content-Type": "multipart/form-data" },
      name: 'file',
      formData: {
        'code': app.globalData.code,
        'serverid': serverid,
        'qid': that.data.que.id
      },
      success: function (res) {
        wx.hideLoading();
        wx.redirectTo({
          url: '../answer/index?id='+that.data.que.id,
        })
        //do something
      }, fail: function (e) {
        console.log(e);
      }
    })
    
  }
})