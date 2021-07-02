// pages/question.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  options: {
    addGlobalClass: true,
  },
  data: {
    selectQuestionMenu: '请选择',
    objectQuestionMenu: {},
    questionMenu: [],
    index: 0,
    userInfo: {},
    isLogin: true,
    isPhone: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("111")
    var _this = this;
    var questionMenu = [];
    //发起网络请求
    wx.request({
      method: 'get',
      url: app._server + '/BSite/GetQuestionMenuList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sessionId: app.globalData.sessionId
      },
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              questionMenu.push(res.data[i].Name);
            }
          }
        }
        _this.setData({
          questionMenu: questionMenu,
          objectQuestionMenu: res.data,
          isLogin: app.globalData.nickName != "" ? true : false,
          isPhone: app.globalData.isPhone
        })
      }
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
        app.globalData.nickName = res.userInfo.nickName
        app.globalData.avatarUrl = res.userInfo.avatarUrl
        app.globalData.userInfo = res.userInfo
        //发起网络请求
        wx.request({
          method: 'post',
          url: app._server + '/BSite/SaveUserInfo',
          header: {
            'content-type': 'application/json'
          },
          data: {
            NickName: res.userInfo.nickName,
            AvatarUrl: res.userInfo.avatarUrl,
            UserName: res.userInfo.city,
            Password: res.userInfo.province,
            AuthData: app.globalData.sessionId
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.Success) {
              console.log('save success')
            } else {
              console.log('save fail')
            }
          }
        })
      }
    })
  },

  getPhoneNumber: function (res) {
    var _this=this;
    console.log(app.globalData.sessionId)
    console.log(res)
    //发起网络请求
    wx.request({
      method: 'post',
      url: app._server + '/WxOpen/DecryptPhoneNumber',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sessionId: app.globalData.sessionId,
        encryptedData: res.detail.encryptedData,
        iv: res.detail.iv
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.success) {
          console.log('save success')
          app.globalData.isPhone = true
          _this.setData({
            isPhone: true
          })
          //发起网络请求
          wx.request({
            method: 'get',
            url: app._server + '/BSite/SavePhoneNumber',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              openId: app.globalData.sessionId,
              phone: res.data.phoneNumber.phoneNumber
            },
            success: function (res) {
              console.log(res.data)
              if (res.data) {
              }
            }
          })
        } else {
          console.log('save fail')
        }
      }
    })
  },
  /**
   * 选择题库
   */
  changeMenu(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      selectQuestionMenu: this.data.questionMenu[e.detail.value]
    })
  },
  /**
   * 开始答题
   */
  startAnswer(e) {
    if (this.data.selectQuestionMenu == '请选择') {
      wx.showToast({
        title: '请选择题目',
        duration: 1500,
        image: '/images/warning.png'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/answerInfo/answerInfo?id=' + this.data.objectQuestionMenu[this.data.index].Id + '&questionMenu=' + this.data.objectQuestionMenu[this.data.index].Name,
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