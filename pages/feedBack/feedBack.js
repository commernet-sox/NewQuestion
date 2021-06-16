// pages/feedBack/feedBack.js
const app=getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    value1:'',
    value2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleChange(field, value) {
    console.log(value);
    this.setData({
      [field]: value
    })
  },
  handleChange1({ detail }) {
    this.handleChange('value1', detail.detail.value)
  },
  handleChange2({ detail }) {
    this.handleChange('value2', detail.detail.value)
  },
  formSubmit(e) {
    var phoneNum = this.data.value1;
    var content = this.data.value2;
    var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(phoneNum) === false) {
      wx.showToast({
        title: '号码不合法',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    if(content == ''){
      wx.showToast({
        title: '内容不为空',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    //发起网络请求
    wx.request({
      method: 'post',
      url: app._server + '/BSite/SaveFeedBack',
      header: {
        'content-type': 'application/json'
      },
      data: {
        Content:content,
        Phone:phoneNum
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        if(res.data.Success)
        {
          wx.showToast({
            title: '提交成功',
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.switchTab({
                  url: '../my/my'
                })
              }, 1500)
            }
          });
        }
        else
        {
          wx.showToast({
            title: '提交失败',
            icon: 'loading',
            duration: 1500
          });
          return false;
        }
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