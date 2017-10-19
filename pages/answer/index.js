// pages/answer/index.js
var userInfo = require("../comm/user.js")
const app = getApp();
var qid;
var s=5;
var flag=false;
var freshtime=new Date().getTime();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    que:{},
    anslist:[],
    commshow:false,
    sound:false,
    record:false,
    end:false,
    admin:false,
    title: '朗读练习'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!userInfo.getuserinfo(this, app))
    return
    var that = this;
    qid = options.id;
    this.setData({ 
      admin: app.globalData.userInfo != null && (app.globalData.userInfo.type == 1 || app.globalData.userInfo.type == 2),
      userid: app.globalData.userInfo != null ? app.globalData.userInfo.id:0
      });
  wx.request({
    url: app.globalData.serverurl +'/question/next',
    data: { id: qid},
    success: function (res) {
      qid=res.data.id;
      that.data.que = res.data;
      that.loadans();
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
    var that = this;
    wx.onBackgroundAudioStop(function () {
      for (var i = 0, len = that.data.anslist.length; i < len; ++i) {
        that.data.anslist[i].play = false;
        for (var j = 0, clen = that.data.anslist[i].comments.length; j < clen; j++) {
          that.data.anslist[i].comments[j].play = false;
        }
      }
      that.setData({
        anslist: that.data.anslist,
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
  upper:function(){
    if (new Date().getTime()-freshtime>3000)
    {
      freshtime = new Date().getTime();
      this.loadans();
    }
  },
  lower:function(){
    if (new Date().getTime() - freshtime > 3000) {
      freshtime = new Date().getTime();
      this.loadans_end();
    } 
  },
  loadans: function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this; var f = 0;
    if(that.data.anslist.length>0)
      f = that.data.anslist[0].id;
    var data_opt = { "qid": qid, "s":s, "f": f, 'code': app.globalData.code};
    wx.request({
      url: app.globalData.serverurl +'/answer/pagelist',
      data: data_opt,
      success:function(req){
        if (req.data.error != undefined)
        {
          if (req.data.error.code=='401')
          {
            app.globalData.userInfo==null;
            app.globalData.code == null;
            wx.switchTab({
              url: '../index/index',
            })
          }
          return;
        }
        that.data.anslist = req.data.concat(that.data.anslist);
        that.setData({
          anslist: that.data.anslist,
          que: that.data.que
        });
      },complete:function(){
        wx.hideLoading();
      }
    })
  },
  top: function (e) {
    var that = this; var list = this.data.anslist;
    var id = e.currentTarget.dataset.id;
    // console.log("code-------------" + app.globalData.code)
    wx.request({
      url: app.globalData.serverurl + '/answer/top',
      data: { 'code': app.globalData.code, 'id': id},
      success: function (res) {
        if (res.data != null && res.data.id != undefined)
        {
          for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
              list[i] = res.data;
              list[i].open = false;
              break;
            }
          }
          that.setData({
            anslist: list
          });
        }
      }
    })
  },
  delete_ans:function(e){
    var that = this; var list = this.data.anslist;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确认删除该朗读',
      success: function (res) {
        if (res.confirm) {
    wx.request({
      url: app.globalData.serverurl + '/answer/del',
      data: { 'code': app.globalData.code, 'ids': id },
      success: function (res) {
        for (var i = 0,len = list.length; i < len; ++i) {
          if (list[i].id == id) {
            list.splice(i, 1);
            break;
          }
        }
          that.setData({
            anslist: list
          });
      }
    })
        }}});
  },
  loadans_end: function () {
    if(!this.data.end)
    {
      var that = this;var e=0;
      if (that.data.anslist.length > 0)
        e = that.data.anslist[that.data.anslist.length-1].id;
      else
        return;
      var data_opt = { "qid": qid, "e": e, "s": s, 'code': app.globalData.code };

      wx.request({
        url: app.globalData.serverurl + '/answer/pagelist',
        data: data_opt,
        success: function (req) {
          that.data.anslist = that.data.anslist.concat(req.data);
          that.setData({
            anslist: that.data.anslist,
            end: req.data.length < s
          });
        }
      })
    }
  },
  showicon: function(e){
    var id = e.currentTarget.dataset.id;
    var list = this.data.anslist;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      anslist: list
    });
  },
  delete_comm: function (e) {
    var that = this; var list = this.data.anslist;
    var aidx = e.currentTarget.dataset.aidx;
    var cidx = e.currentTarget.dataset.cidx;
    var id = list[aidx].comments[cidx].id;
    wx.showModal({
      title: '提示',
      content: '是否确认删除该评论',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.serverurl + '/comment/del',
            data: { 'code': app.globalData.code, 'ids': id },
            success: function (res) {
              list[aidx].comments.splice(cidx, 1);
              that.setData({
                anslist: list
              });
            }
          })
        }
      }
    });
  },
  viewuser:function(e){
    var userid = e.currentTarget.dataset.userid
    wx.navigateTo({
        url: '../me/answer?id='+userid,
    })
  },
  good: function(e){
    var id = e.currentTarget.dataset.id, list = this.data.anslist;
    var that = this;
    // console.log("code-------------" + app.globalData.code)
    wx.request({
      url: app.globalData.serverurl + '/answer/like',
      data: { 'code': app.globalData.code,'id':id},
      success:function(res){
        
        for (var i = 0, len = list.length; i < len; ++i) {
          if (list[i].id == id) {
            list[i] = res.data;
            list[i].open = false;
            break;
          }
        }
        that.setData({
          anslist: list
        });
      }
    })
  },
  commmsg:function(e){
    flag=false;
    this.setData({
      commshow:true
    });

  },
  play:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    for (var i = 0, len = that.data.anslist.length; i < len; ++i) {
      for (var j = 0; j < that.data.anslist[i].comments.length; j++) {
        that.data.anslist[i].comments[j].play = false;
      }
      if (that.data.anslist[i].id==id)
      {
        that.data.anslist[i].play = !that.data.anslist[i].play;
        if (that.data.anslist[i].play)
        {
          wx.playBackgroundAudio({
            dataUrl: app.globalData.audiourl + that.data.anslist[i].vurl,
            title: this.data.que.title,
            coverImgUrl: '',
            success:function(e){
              wx.request({
                url: app.globalData.serverurl + '/answer/paly',
                data: { 'code': app.globalData.code, 'id': id },
                success: function (res) {
                  console.log('add read.........')
                }
              })
            }
          })
        }else
          wx.stopBackgroundAudio()
      }else
        that.data.anslist[i].play = false;
    }
    this.setData({
      anslist: that.data.anslist
    })
  }, playcom: function (e) {
    var that = this;
    var aidx = e.currentTarget.dataset.aidx;
    var cidx = e.currentTarget.dataset.cidx;
    for (var i = 0, len = that.data.anslist.length; i < len; ++i) {
      that.data.anslist[i].play=false;
      for (var j = 0; j< that.data.anslist[i].comments.length;j++)
      {
        that.data.anslist[i].comments[j].play = false;
      }
    }
    that.data.anslist[aidx].comments[cidx].play = true;
    wx.playBackgroundAudio({
      dataUrl: app.globalData.audiourl + that.data.anslist[aidx].comments[cidx].vurl,
      title: this.data.que.title,
      coverImgUrl: ''
    })
    this.setData({
      anslist: that.data.anslist
    })
  },
  hidecomm:function(e){
    var that=this;
    setTimeout(function(){
    if (!flag)
      that.setData({
      commshow: false
        })
    },100);
  },
  changeinput:function(){
    flag=true;
    this.setData({
      sound: !this.data.sound
    });
  },
  record:function(){
    var index,that = this;
    for (var i = 0, len = that.data.anslist.length; i < len; ++i) {
      if (that.data.anslist[i].open) {
        index =i;
        break;
      }
    }
    this.setData({
      record: true
    });
    var aid = that.data.anslist[index].id;
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath ;
        wx.showModal({
          title: '确认',
          content: '是否提交语音回复',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
              });
              var serverid = new Date().getTime().toString(16) + "_a" + aid;
              wx.uploadFile({
                url: app.globalData.serverurl + '/comment/sound',
                filePath: tempFilePath,
                header: { "Content-Type": "multipart/form-data" },
                name: 'file',
                formData: {
                  'code': app.globalData.code,
                  'serverid': serverid,
                  'aid': aid
                },
                success: function (res) {
                  wx.hideLoading();
                  that.data.anslist[index].comments.unshift(JSON.parse(res.data));
                  that.setData({
                    anslist: that.data.anslist
                  })
                }, fail: function (e) {
                  wx.hideLoading();
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
  endrecord:function(e){
    this.setData({
      record: false
    });
    wx.stopRecord();
  },
  subcomm:function(e){
    this.setData({
      commshow: false
    });
    var txt=e.detail.value;
    var that=this;
    var id;
    var index;
    for (var i = 0, len = that.data.anslist.length; i < len; ++i) {
      if (that.data.anslist[i].open)
      {
        id = that.data.anslist[i].id;
        index=i;
        break;
      }
    }
    wx.request({
      url: app.globalData.serverurl + '/comment/save',
      method: 'POST', 
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { answerid: id, content: txt, code: app.globalData.code},
      success: function(res){
        if(res.data.error==0)
        {
          that.data.anslist[index].open = false;
        that.data.anslist[index].comments = res.data.data.concat(that.data.anslist[index].comments);
          that.setData({
            anslist: that.data.anslist
          });
        }
      }
    })
  },delete:function()
  {
    wx.showModal({
      title: '提示',
      content: '是否确认删除该作品',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.serverurl + '/question/del',
            data: { ids: qid},
            success: function (res) {
              console.log(res.data);
              wx.showToast({
                title: '删除成功'
              });
              setTimeout(function(){
                wx.navigateBack({
                  
                })
              },1000);
              }
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})