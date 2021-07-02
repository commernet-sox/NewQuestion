// pages/wrongAnswer/wrongAnswer.js
const app=getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    id:'',//错题id
    loading:true,
    questionInfo:{},
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    showAnswer:false,
    index:0,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    var menu = options.menu
    //发起网络请求
    wx.request({
      method: 'get',
      url: app._server + '/BSite/GetErrorList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        MenuId:menu,
        UserId:app.globalData.userId,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        _this.setData({
          id:res.data.Id,
          result: res.data,
          loading:false,
          total: res.data.QuestionListObj.length,
        })

      _this.setThisData(_this.data.index)
      }
    })
  },
  showAnswer(){
    this.setData({
      showAnswer:true
    })
  },
  //翻页
  handlePageChange({ detail }){
    const action = detail.type;
    const r = this.data.result.QuestionListObj

    if (action === 'next') {
      if (this.data.index >= (r.length - 1)) {
        console.log(this.data.index)
        return;
      }
      this.setThisData((this.data.index + 1));
      this.setData({
        showAnswer: false,
        index: (this.data.index + 1),
      })
    } else {
      this.setThisData((this.data.index - 1));
      this.setData({
        showAnswer: false,
        index: (this.data.index - 1),
      })
    }
  },
  setThisData(i) {
    const r = this.data.result.QuestionListObj
    var current = "";
    var currentD = [];
    console.log(r)
    this.setData({
      current: current,
      currentD: currentD,
      questionInfo: r[i],
    })
  },
  //弹出统计下拉层
  handleOpen() {
    this.setData({
      actionVisible: true
    })
  },
  //关闭统计下拉层
  actionCancel() {
    this.setData({
      actionVisible: false
    })
  },
  dump(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setThisData(index)
    this.setData({
      index: index,
      actionVisible: false
    })
  },
  deleteError(){
    this.data.result.QuestionListObj.splice(this.data.index, 1);
    wx.u.deleteError(this.data.id,this.data.result.QuestionListObj)
    this.setData({
      result: this.data.result,
      total: this.data.result.QuestionListObj.length,
      actionVisible: false
    })
    this.setThisData(this.data.index)
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