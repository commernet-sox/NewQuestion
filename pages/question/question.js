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
    selectQuestionMenu:'请选择',
    objectQuestionMenu:{},
    questionMenu:[],
    index: 0,
    userInfo: {},
    isLogin:true,
    isPhone:true,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("111")
    var _this = this;
    var questionMenu=[];
    //发起网络请求
    wx.request({
      method:'get',
      url: app._server+'/BSite/GetQuestionMenuList',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        sessionId:app.globalData.sessionId
      },
      success:function(res){
        console.log(res.data)
        if(res.data)
        {
          if( res.data.length>0 ){
            for( var i =0;i<res.data.length;i++ ){
              questionMenu.push(res.data[i].Name);
            }
          }
        }
        _this.setData({
          questionMenu:questionMenu,
          objectQuestionMenu:res.data
        })
      }
    })
  },

  /**
   * 选择题库
   */
  changeMenu (e){
    console.log(e);
    this.setData({
      index:e.detail.value,
      selectQuestionMenu: this.data.questionMenu[e.detail.value]
    })
  },
  /**
   * 开始答题
   */
  startAnswer (e){
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