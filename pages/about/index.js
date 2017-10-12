// pages/about/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // teacher: [{ 'name': '方强', 'pos': '主持表演老师；制片人/主持人', 'info': '培养儿童早期的艺术素养，充分激发儿童的想象力和创造力！提供儿童早期视觉艺术教育课程...', 'img': '../img/tf.jpg' },
    // { 'name': '李筱婉', 'pos': '主持老师；惠州电视台当家花旦', 'info': '具有先进的教学理念，为孩子提供多种多样的主持指导..', 'img': '../img/tl.jpg' },
    // { 'name': '舒雅', 'pos': '主持表演老师　演员/主持人', 'info': '有丰富的主持和表演经验，非常具有亲和力，给学生专业指导...', 'img': '../img/ts.jpg' },
    // { 'name': '朱芳', 'pos': '深圳主持人；童言艺术创始人', 'info': '具有丰富的舞台和授课经验，因材施教，注重孩子兴趣和引导；深受学生喜欢的女神老师...', 'img': '../img/tz.jpg' }],
    imgs: ['https://mmbiz.qpic.cn/mmbiz_jpg/9ozSA9lZC5jZUf5Mhqm2LqOaGB8ZUAShGFtsTnmicdU4EibtvC3ziadj7hwLruw3y56alaQ87g6qyzv60a8vWq09g/0?wx_fmt=jpeg',
      'https://mmbiz.qpic.cn/mmbiz_jpg/9ozSA9lZC5jZUf5Mhqm2LqOaGB8ZUAShlicFlNYTNU12dd5ibbSciazuA9ZpUInj07r5mcZlHAGDOWlhjeeYibQQeA/0?wx_fmt=jpeg',
      'https://mmbiz.qpic.cn/mmbiz_jpg/9ozSA9lZC5iaEzTVw72U5l6WmBf35ab91Z1FCf0SCuxLehSJ7dhgnQYiaWvtlyL49XceAdmLaRdf5wzybDshTX3w/0?wx_fmt=jpeg',
      'https://mmbiz.qpic.cn/mmbiz_jpg/9ozSA9lZC5iaEzTVw72U5l6WmBf35ab91UWnk71WMh5ylNsOInzz5mP7DQxMC1jspBkgcHZs5dUyanrSRx9uWGg/0?wx_fmt=jpeg',
      'https://mmbiz.qpic.cn/mmbiz_jpg/9ozSA9lZC5hHYQL2PeTQc4VZRXNCYECsoViaa7Hdz6ibiaa9Lkib1544jLcZ5blovlQSMia6j4NfjPHMb38oUAXR2Eg/0?wx_fmt=jpeg','https://mmbiz.qpic.cn/mmbiz_jpg/9ozSA9lZC5iaEzTVw72U5l6WmBf35ab91UwL70ctFQxZ0ZfwR7icdfFC63JBnB5CKqDchltLOc0wJn194HIIYEmA/0?wx_fmt=jpeg'],
    audiourl: app.globalData.audiourl,
    focusidx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: app.globalData.serverurl + '/teacher/all',
      success: function (req) {
        that.setData({
          teacher: req.data
        })
      }
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
  changenav:function(e){
    this.setData({
      focusidx: e.target.dataset.idx
    })
  },
  calltel:function(e){
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  openLocation: function (e) {
    wx.openLocation({
      latitude: 22.535465,
      longitude: 113.913615,
      name: '童言艺术',
      address: '深圳市南山区星海名城一组图4栋2B'
    })
  },
  showimg: function (event) {
    wx.previewImage({
      urls: this.data.imgs,
      current: this.data.imgs[event.target.dataset.index]
    })
  },
  show: function (e) {
    var index = e.currentTarget.dataset.idx;;
    this.data.teacher[index].show = true;
    this.setData({
      teacher: this.data.teacher
    })
  },
  hideinfo: function (e) {
    for (var i = 0; i < this.data.teacher.length; i++) {
      this.data.teacher[i].show = false;
    }
    this.setData({
      teacher: this.data.teacher
    })
  },
})