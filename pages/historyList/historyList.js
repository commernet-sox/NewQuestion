// pages/historyList/historyList.js
const app=getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{},
    nodata:false,
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    //发起网络请求
    wx.request({
      method: 'get',
      url: app._server + '/BSite/GetHistoryList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        UserId:0,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        if(res.data.length!=0)
        {
          _this.setData({
            dataInfo:res.data,
            nodata: false,
            loading:false
          })
        }
        else
        {
          _this.setData({
            nodata:true,
            loading:false
          })
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