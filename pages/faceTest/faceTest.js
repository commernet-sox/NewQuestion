// pages/faceTest/faceTest.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: '/images/uploadImg.png',
    uploadImg: '',
    face: {},
    showRes: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      uploadImg: _this.data.defaultImg
    })
  },
  choseImg() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(res.tempFiles)
        _this.setData({
          uploadImg: tempFilePaths
        })
      }
    })
  },

  submit() {
    var _this = this;
    console.log(_this.data.uploadImg)
    _this.upload(_this.data.uploadImg);
  },
  upload(path) {
    var _this = this;
    wx.showToast({
        icon: "loading",
        title: "正在上传"
      }),
      wx.uploadFile({
        url: app._server + '/BSite/FaceTest',
        filePath: path[0],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        // formData: {
        //   //和服务器约定的token, 一般也可以放在header中
        //   'session_token': wx.getStorageSync('session_token')
        // },
        success: function (res) {
          console.log(res.data);
          var res1 = JSON.parse(res.data)
          if (res1.Data.msg != '1') {
            wx.showModal({
              title: '提示',
              content: '检测失败',
              showCancel: false
            })
            _this.setData({
              showRes: 'none'
            })
            return;
          }
          wx.showModal({
            title: '提示',
            content: '检测成功',
            showCancel: false
          })
          
          console.log(res1)
          _this.setData({
            face: res1,
            showRes: ''
          })
          //var data = res.data
          // page.setData({  //上传成功修改显示头像
          //   src: path[0]
          // })
        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '检测失败',
            showCancel: false
          })
        },
        complete: function () {
          wx.hideToast(); //隐藏Toast
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

  }
})