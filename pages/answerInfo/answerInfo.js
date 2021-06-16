// pages/answerInfo/answerInfo.js
const app=getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    time:'',
    questionMenu:'',
    questionNum:'',
    tips:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options)
    var id=options.id
    var questionMenu=options.questionMenu
    var time,questionNum,tips
    //发起网络请求
    wx.request({
      method:'get',
      url: app._server+'/BSite/GetQuestionMenuById',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        id:id,
        sessionId:app.globalData.sessionId
      },
      success:function(res){
        console.log(res.data)
        if(res.data)
        {
          time=res.data.Time,
          questionNum=res.data.Number,
          tips=res.data.Tips
        }
        _this.setData({
          id:id,
          questionMenu:questionMenu,
          time:time,
          questionNum:questionNum,
          tips:tips
        })
      }
    })
  },
  start(){
    wx.redirectTo({
      url: '/pages/answer/answer?id=' + this.data.id + '&questionMenu=' + this.data.questionMenu+ '&time=' + this.data.time
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