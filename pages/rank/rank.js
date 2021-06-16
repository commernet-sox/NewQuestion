// pages/rank/rank.js
const app=getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    selectQuestionMenu: '请选择',
    objectQuestionMenu: {},
    questionMenu: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
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
  changeMenu(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      selectQuestionMenu: this.data.questionMenu[e.detail.value]
    })
    var objectQuestionMenu = this.data.objectQuestionMenu
    var menu = objectQuestionMenu[e.detail.value].Id
    //发起网络请求
    wx.request({
      method: 'get',
      url: app._server + '/BSite/GetRank',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        MenuId:menu,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        if(res.data.length!=0)
        {
          wx.navigateTo({
            url: '/pages/rankList/rankList?menu=' + menu,
          })
        }
        else
        {
          wx.showToast({
            title: '无排名记录',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
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