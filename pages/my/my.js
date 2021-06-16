// pages/my/my.js
const app = getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      // app.getLoginInfo(function (data) {
      //   console.log('login')
      // })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        //发起网络请求
        wx.request({
          method: 'post',
          url: app._server + '/BSite/SaveUserInfo',
          header: {
            'content-type': 'application/json'
          },
          data: {
            NickName:res.userInfo.nickName,
            AvatarUrl:res.userInfo.avatarUrl,
            UserName:res.userInfo.city,
            Password:res.userInfo.province,
            AuthData:app.globalData.sessionId
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.Success) {
              console.log('save success')
            }
            else
            {
              console.log('save fail')
            }
          }
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getTestInfo(e) {
    wx.request({
      url: app._server + "/Test/GetCodeMaster",
      data: {
        sessionId: app.globalData.sessionId,
        _: Date.now(),
        key: 'b083d9eabad077c4a9d655591c5a1de2'
      },
      method: 'GET',
      header: {
        'content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res.data)

        }
      }
    })
  },
  getLoginInfo(e) {
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          wx.request({
            method: 'POST',
            url: app._server + '/WxOpen/onLogin',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.success) {
                app.saveCache("sessionId", res.data.sessionId);
                app.saveCache("status", res.data.operation);
                app.saveCache("expireTime", res.data.expireTime);
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '答题酷',
      path: '/pages/my/my',
      imageUrl: '/images/logo.png'
    }
  },
  about() {
    wx.showModal({
      title: '关于',
      content: '本程序仅供学习使用，请勿使用于非法环境，如有问题，请联系QQ：1510595785，并备注来源小程序，我们将解答您的问题。',
      showCancel: false
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

  }
})