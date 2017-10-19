var getuserinfo = function (page,that){
  if (that.globalData.code==null)
  {
    if (!page.data.ishome)
    {
      wx.switchTab({
        url: '../index/index',
      })
      return false;
    }
    // 登录
    page.setData({ "isload": true });
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code;
        updateuserinfo(page, that);
        page.setData({ "isload": false });
      },
      fail:res =>{
        console.log("login fail...........");
        page.setData({ "isload": false });
      }
    })
  }else{
    updateuserinfo(page, that);
  }
  return true;
}
var loadtype = function (app,that){
  if (app.globalData.types == null) {
    wx.request({
      url: app.globalData.serverurl + '/question/types',
      success: function (req) {
        console.log(req.data)
        app.globalData.types = req.data;
        that.setData({
          types: req.data
        });
      }
    })
  } else {
    that.setData({
      types: app.globalData.types
    });
  }
}
var updateuserinfo = function (page, that){
  if (that.globalData.userInfo != null)
  {
    page.setData({ hasname: that.globalData.userInfo.name != null, "isload": false})
    return;
  }
  if (!page.ishome) {
    wx.switchTab({
      url: '../index/index',
    })
  }
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo;
            wx.request({
              url: that.globalData.serverurl + '/wx/updateuser',
              data: { 'code': that.globalData.code, 'nick': res.userInfo.nickName, 'headurl': res.userInfo.avatarUrl },
              success: function (res) {
                console.log("............update user info")
                if (res.data.error!=undefined)
                {
                  if(res.data.error.code=='401')
                  {
                    that.globalData.userInfo=null;
                    that.globalData.code=null;
                    getuserinfo();
                  }
                  return;
                }
                that.globalData.userInfo.id = res.data.id;
                that.globalData.userInfo.name = res.data.name;
                that.globalData.userInfo.type = res.data.type;
                page.setData({ hasname: that.globalData.userInfo.name != null, "isload": false })
              }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            // if (page.userInfoReadyCallback) {
            //   page.userInfoReadyCallback(res)
            // }
          }, fail: function () {
            // 调用微信弹窗接口
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权，将无法正常获取您的用户信息。请10分钟后再次点击授权，或者删除小程序重新进入。',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }, complete:function(){
            page.setData({ "isload": false });
          }
        })
      } else {
        wx.authorize({
          scope: 'scope.userInfo',
          success() {
          }
        })
      }
    }
  })
}
module.exports = {
  getuserinfo: getuserinfo,
  loadtype: loadtype
};