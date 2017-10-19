// pages/answer/view.js
var userInfo = require("../comm/user.js")
const app = getApp();
var s=5;
var flag=false;
var freshtime=new Date().getTime();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:null,
    play:false,
    end:false,
    title: '学习点评',
    admin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!userInfo.getuserinfo(this, app))
    return;
    var that = this;
    wx.request({
      url: app.globalData.serverurl + '/answer/find',
      data: { id: options.id, code: app.globalData.code  },
      success: function (res) {
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
        // console.log(res.data)
        that.setData({
          answer: res.data
        });
        // that.play();
      }
    });
    this.setData({
      admin: app.globalData.userInfo.type == 1 || app.globalData.userInfo.type == 2,
      userid: app.globalData.userInfo != null ? app.globalData.userInfo.id : 0
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
    var that = this;
    wx.onBackgroundAudioStop(function () {
      console.log("play over")
      that.data.play = false;
      for (var i = 0; i < that.data.answer.comments.length; i++)
        that.data.answer.comments[i].play = false;
      that.setData({
        play: that.data.play,
        answer: that.data.answer
      })
    })
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
  play: function (e) {
    var that = this;
    console.log("play url:::" + app.globalData.audiourl + that.data.answer.vurl);
    if (that.data.play)
    {
      that.setData({
        play: false
      })
      wx.stopBackgroundAudio();
    }
    else
      wx.playBackgroundAudio({
        dataUrl: app.globalData.audiourl + that.data.answer.vurl,
        success: function () {
          console.log("play success")
          that.data.play = true;
          for (var i = 0; i < that.data.answer.comments.length; i++)
            that.data.answer.comments[i].play = false;
          that.setData({
            play: that.data.play,
            answer: that.data.answer});
          wx.request({
            url: app.globalData.serverurl + '/answer/paly',
            data: { 'code': app.globalData.code, 'id': that.data.answer.id },
            success: function (res) {
              console.log('add read.........')
            }
          })
        }, fail: function () {
          console.log("play fail")
        }
      })
  }, changeinput: function () {
    flag = true;
    console.log("::::::" + flag)
    this.setData({
      sound: !this.data.sound
    });
  },
  record: function () {
    var index, that = this;
    this.setData({
      record: true
    });
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        wx.showModal({
          title: '确认',
          content: '是否提交语音回复',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
              });
              var serverid = new Date().getTime().toString(16) + "_a" + that.data.answer.id;
              wx.uploadFile({
                url: app.globalData.serverurl + '/comment/sound',
                filePath: tempFilePath,
                header: { "Content-Type": "multipart/form-data" },
                name: 'file',
                formData: {
                  'code': app.globalData.code,
                  'serverid': serverid,
                  'aid': that.data.answer.id
                },
                success: function (res) {
                  wx.hideLoading();
                  var coms = new Array();
                  that.data.answer.comments = coms.concat(JSON.parse(res.data),that.data.answer.comments);
                  console.log(that.data.answer)
                  that.setData({
                    answer: that.data.answer
                  })
                }, fail: function (e) {
                  wx.hideLoading();
                  console.log("errr........" + e);
                }
              })

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: function (res) {
        //录音失败
        this.setData({
          record: false
        });
        wx.stopRecord();
      }
    })
  },
  endrecord: function (e) {
    console.log(e.touches);
    this.setData({
      record: false
    });
    wx.stopRecord();
  },
  subcomm: function (e) {
    var txt = e.detail.value;
    var that = this;
    wx.request({
      url: app.globalData.serverurl + '/comment/save',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { answerid: that.data.answer.id, content: txt, code: app.globalData.code },
      success: function (res) {
        if (res.data.error == 0)
          that.data.answer.comments = res.data.data.concat(that.data.answer.comments);
          that.setData({
            answer: that.data.answer
          });
      }
    })
  }, good: function (e) {
    var that = this;
    // console.log("code-------------" + app.globalData.code)
    wx.request({
      url: app.globalData.serverurl + '/answer/like',
      data: { 'code': app.globalData.code, 'id': that.data.answer.id },
      success: function (res) {
        that.setData({
          answer: res.data
        });
      }
    })
  },
  top:function(e){
    var that = this;
    // console.log("code-------------" + app.globalData.code)
    wx.request({
      url: app.globalData.serverurl + '/answer/top',
      data: { 'code': app.globalData.code, 'id': that.data.answer.id },
      success: function (res) {
        if (res.data!=null&&res.data.id != undefined)
        that.setData({
          answer: res.data
        });
      }
    })
  },
  commmsg:function (e) {
    flag = false;
    this.setData({
      commshow: true
    });

  }, hidecomm: function (e) {
    var that = this;
    setTimeout(function () {
      console.log("::::::" + flag)
      if (!flag)
        that.setData({
          commshow: false
        })
    }, 100);
  }, playcom: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.cidx;
    this.data.play=false;
    if (that.data.answer.comments[index].play)
    {

      for (var i = 0; i < that.data.answer.comments.length; i++)
        that.data.answer.comments[i].play = false;
      wx.stopBackgroundAudio();
    }
    else
    {
      for (var i = 0; i < that.data.answer.comments.length; i++)
        that.data.answer.comments[i].play = false;
      that.data.answer.comments[index].play = true;
      wx.playBackgroundAudio({
        dataUrl: app.globalData.audiourl + this.data.answer.comments[index].vurl,
      })
    }
    this.setData({
      answer: this.data.answer,
      play:false
    })
  }, lower:function(){
    if(!this.data.end)
    {
      if (new Date().getTime()-freshtime>3000)
      {
        freshtime = new Date().getTime();
      var that=this;
      wx.request({
        url: app.globalData.serverurl + '/comment/pagelist',
        data: { qid: this.data.answer.id, s: s, e: this.data.answer.comments[this.data.answer.comments.length-1].id},
        success: function (res) {
          // console.log(res.data)
          that.data.answer.comments= that.data.answer.comments.concat(res.data)
          that.setData({
            answer: that.data.answer,
            end: res.data.length<s
          });
          // that.play();
        }
      });
      }
    }
    
  }, delete_comm: function (e) {
    var that = this; var answer = this.data.answer;
    var cidx = e.currentTarget.dataset.cidx;
    var id = answer.comments[cidx].id;
    wx.showModal({
      title: '提示',
      content: '是否确认该评论删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.serverurl + '/comment/del',
            data: { 'code': app.globalData.code, 'ids': id },
            success: function (res) {
              answer.comments.splice(cidx, 1);
              that.setData({
                answer: answer
              });
            }
          })
        }
      }
    });
  },
  delete: function (e) {
    var that = this; 
    wx.showModal({
      title: '提示',
      content: '是否确认删除该朗读',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.serverurl + '/answer/del',
            data: { 'code': app.globalData.code, 'ids': that.data.answer.id },
            success: function (res) {
              wx.navigateBack({
                fail:function(){
                  wx.switchTab({
                    url: '/index',
                  })
                }
              })
            }
          })
        }
      }
    });
  }
})