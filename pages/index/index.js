//index.js
//获取应用实例
const app = getApp()
var freshtime=new Date().getTime();
var userInfo = require("../comm/user.js")
Page({
  data: {
    title:'童言朗读课堂',
    userInfo: {},
    hasUserInfo: false,
    audiourl: app.globalData.audiourl,
    // teacher: [
    //   {
    //     'name': '朱芳', 'info': '深圳主持人；\n童言艺术创始人;\n从事少儿语言教育近十年\n主持各种大型活动逾千场\n参与广告拍摄、电影电视拍摄上百次\n具有丰富的舞台和授课经验', 'img': '../img/tz.jpg'
    //   }, {
    //     'name': '方强', 'info': '广州电视台CityTv制片人/主持人\n栏目《新鲜天气》《新鲜亚运》\n广州电视台亚运特别节目《一起来更精彩》\nCCTV-12暖春行动《圆你一个梦想》\n广州亚运最美花城宣传片\n主演 《生生不息》《我的父亲》', 'img': '../img/tf.jpg' },
    //     {
    //       'name': '李筱婉', 'info': '惠州广电综艺节目当家主持\n少儿综艺节目《非常3Q》\n户外闯关节目《快乐大挑战》\n知识竞答节目《谁是赢家》\n 各界精英pk节目《技艺超群》', 'img': '../img/tl.jpg' },
    //     {
    //       'name': '舒雅', 'info': '深圳广电集团主持人\n青年影视演员\n中央戏剧学院表演系\n参演过上百部电影电视：\n《美人鱼》《一代宗师》《暗黑者》\n《日光宝盒》《整形那些事》', 'img': '../img/ts.jpg' }],
    page:0,
    end:false,
    ishome:true,
    hasname:true,
    quetype:-1
  }, onPullDownRefresh:function(){
    this.load();
  },
  load: function (e) {
    var that = this;
    if(e!=undefined)
    {
      if (that.data.quetype!=e.currentTarget.dataset.type)
      {
        that.setData({ quetype: e.currentTarget.dataset.type })
        console.log("change .........");
      }
    }
    wx.request({
      url: app.globalData.serverurl + '/question/pagelist', //仅为示例，并非真实的接口地址
      data: {
        f: '0',
        t: that.data.quetype == -1 ? '' : that.data.quetype
      },
      success: function (res) {
        that.setData({
          quelist: res.data
        })
        wx.hideLoading();
      }
    });
  },
  onShow:function(){
    this.load();
    // console.log("show...........");
  },onHide:function(){
    // console.log("hide...............")
  },onReady:function(){
    // console.log("ready............")
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this; 
    userInfo.loadtype(app, that);
   userInfo.getuserinfo(this, app);
    wx.request({
      url: app.globalData.serverurl + '/teacher/all',
      success:function(req){
        that.setData({
          teacher: req.data
        })
      }
    })
  },
  onShareAppMessage: function () {

  },
  show:function(e){
    var index = e.currentTarget.dataset.idx;;
    this.data.teacher[index].show=true;
    this.setData({
      teacher: this.data.teacher
    })
  },
  hideinfo:function(e){
    for (var i = 0; i < this.data.teacher.length;i++)
    {
      this.data.teacher[i].show = false;
    }
    this.setData({
      teacher: this.data.teacher
    })
  },
  upper:function(){
    if (new Date().getTime()-freshtime>3000)
    {
      freshtime = new Date().getTime();
      wx.showLoading({
        title: '加载中....',
      })
      var that=this;
      wx.request({
        url: app.globalData.serverurl + '/question/pagelist', //仅为示例，并非真实的接口地址
        data: {
          f: this.data.quelist[0].id,
          t: that.data.quetype == -1 ? '' : that.data.quetype
        },
        success: function (res) {
          that.setData({
            quelist: res.data.concat(that.data.quelist)
          })
        },complete:function(){
          wx.hideLoading();
        }
      });
    }
  },
  lower: function () {
    if (new Date().getTime() - freshtime > 3000) {
        freshtime = new Date().getTime();
        wx.showLoading({
          title: '加载中....',
        })
      var that = this;
      wx.request({
        url: app.globalData.serverurl + '/question/pagelist', //仅为示例，并非真实的接口地址
        data: {
          e: this.data.quelist[this.data.quelist.length-1].id,
          t: that.data.quetype == -1 ? '' : that.data.quetype
        },
        success: function (res) {
          that.setData({
            quelist: that.data.quelist.concat(res.data),
            end: res.data.length<10
          })
        }, complete: function () {
          wx.hideLoading();
        }
      });
    }
  },
  subname : function (e) {
    var t = this;
    var name = e.detail.value.name;
    wx.request({
      url: app.globalData.serverurl + '/wx/updateuser',
      data: { 'code': app.globalData.code, 'name': name },
      success: function (res) {
        if(res.data.error!=undefined)
        {
          if(res.data.error.code=='401')
          {
            app.globalData.userInfo==null;
            app.globalData.code=null;
            wx.reLaunch({
              url: 'index',
            })
          }
          return;
        }
        app.globalData.userInfo.id = res.data.id;
        app.globalData.userInfo.name = res.data.name;
        app.globalData.userInfo.type = res.data.type;
        t.setData({
          hasname: true
        })
      }
    })
  }
})
