// pages/analysis/analysis.js
const app = getApp()
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    questionInfo:{},
    loading: true,
    result:{},
    disabled:true,
    actionVisible:false,
    index:0,
    chose:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    var objectId = options.objectId

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
        var right = res.data.Score
        var wrong = res.data.QuestionListObj.length - right
        var persent = parseFloat(right/res.data.QuestionListObj.length * 100).toFixed(2)
        console.log(persent)
        _this.setData({
          loading:false,
          result:res.data,
          right: right,
          wrong: wrong,
          persent: persent,
          total: res.data.QuestionListObj.length
        })
      _this.setThisData(_this.data.index)
      }
    })
  },
  setThisData(i){
    console.log(i)
    const r = this.data.result.QuestionListObj
    const answer = []
    var current = "";
    var currentD = [];
    console.log(r)
    for(var j=0;j<r[i].ChoseListObj.length;j++){
      if(r[i].ChoseListObj[j].isChose){
        answer.push(this.data.s[j] + r[i].ChoseListObj[j].item)
      }
    }
    this.setData({
      current: current,
      currentD: currentD,
      questionInfo: r[i],
      answer: answer,
    })
    console.log(this.data.current)
  },
  handlePageChange({ detail }){
    const action = detail.type;
    const r = this.data.result.QuestionListObj
    
    
    if (action === 'next') {
      if(this.data.index >= (r.length-1)){
        console.log(this.data.index)
        return;
      }
      this.setThisData((this.data.index +1));
      this.setData({
        index: (this.data.index + 1),
      })
    } else {
      this.setThisData((this.data.index - 1));
      this.setData({
        index: (this.data.index - 1),
      })
    }
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
  dump(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setThisData(index)
    this.setData({
      index:index,
      actionVisible: false
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