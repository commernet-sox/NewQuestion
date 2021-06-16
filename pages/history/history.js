// pages/history/history.js
const app = getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    total:0,
    score:0,
    average:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    var objectId = options.id
    console.log(objectId)
    //获取历史记录
    //发起网络请求
    wx.request({
      method: 'get',
      url: app._server + '/BSite/GetHistory',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        Id:objectId,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        let single=0;
        let multiple=0;
        let judge=0;
        res.data.QuestionListObj.forEach(function(item,index)
        {
          if(item.Type=="1")
          {
            single+=1;
          }
          else if(item.Type=="2")
          {
            multiple+=1;
          }
          else
          {
            judge+=1;
          }
        });
        _this.setData({
          objectId:objectId,
          loading: false,
          total: single+judge+multiple*2,
          score: res.data.Score,
          questions: res.data.QuestionListObj,
          beatNum: res.data.BeatNum,
          average: res.data.AverageScore
        })
      }
    })
  },

  back(){
    wx.reLaunch({
      url: '/pages/question/question',
    })
  },
  analysis(){
    wx.navigateTo({
      url: '/pages/analysis/analysis?objectId='+ this.data.objectId,
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