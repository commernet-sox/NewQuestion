// pages/answer/answer.js
const app = getApp()
import {
  $wuxCountDown
} from '../../wux/index'
const { $Message } = require('../../dist/base/index');
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    questionMenu: '',
    time: '',
    Countdown: '', //倒计时
    modalName: '', //自动交卷对话框
    total: 0, //题目总数
    question: {}, //当前题目
    result: [], //套题
    questionInfo: {}, //当前题目
    answer: [], //当前题的答案
    type: '', //当前题的类型，1单选 2多选 3判断
    current: '', //单选选中的答案
    currentD: [], //多选选中的答案
    disabled: false, //单选选中不可选
    disabled1: false, //多选选中不可选
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    index: 1, //第几题
    actionVisible: false, //弹出层
    questionErr: 0,//错题个数
    questionOk: 0,// 单选正确个数
    questionMulOk:0,//多选正确个数
    percentage: 0,
    visible1:false,
    visible2:false,
    action1:[
      {
        name: '取消'
      },
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
    action2:[
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options)
    var id = options.id
    var questionMenu = options.questionMenu
    var time = options.time * 100
    //发起网络请求
    wx.request({
      method: 'get',
      url: app._server + '/BSite/GetQuestionsByMenu',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          _this.result = res.data
          _this.total = res.data.length
          _this.question = res.data[0]
        }
        _this.setData({
          id: id,
          questionMenu: questionMenu,
          time: time,
          result: _this.result,
          total: _this.total,
          question: _this.question
        })
        console.log(_this.result)
        console.log(_this.total)
        console.log(_this.question)
        //获取第一题
        _this.setThisData(0)
      }
    })
    //倒计时
    var Countdown = new $wuxCountDown({
      date: +(new Date) + 60000 * parseInt(time),
      render(date) {
        if (date.hours != 0) {
          date.min += date.hours * 60;
          date.hours = 0;
        }
        const min = this.leadingZeros(date.min, 2) + ':'
        const sec = this.leadingZeros(date.sec, 2) + ''
        if (date.hours === 0 && date.min === 0 && date.sec === 0) {
          console.log("时间结束")
          _this.handleClick1();
        }
        this.setData({
          Countdown: min + sec,
        })
      }
    })
  },
  //设置当前题目
  setThisData(i) {
    const r = this.data.result
    const that = this;
    console.log(r.length + 'setThisData...')
    if (r.length == 0) {
      wx.redirectTo({
        url: '/pages/answerErr/index',
      })
      return
    }
    //const current = r[i].choseList[0].item
    const answer = []; //正确答案集合
    //获取正确答案
    for (var j = 0; j < r[i].ChoseListObj.length; j++) {
      if (r[i].ChoseListObj[j].isChose) {
        answer.push(r[i].ChoseListObj[j].item);
      }
    }
    console.log(answer);
    this.setData({
      questionInfo: r[i],
      answer: answer,
      type: r[i].Type
    })
  },
  //翻页
  handlePageChange({
    detail
  }) {
    const action = detail.type;
    const r = this.data.result;
    console.log(r);

    //上下一题
    if (action === 'next') {
      const i = this.data.index;
      const type = this.data.type;
      if (i == r.length) {
        this.statistical()
        $Message({
          content: '题目已答完,请交卷',
          duration: 3,
          type: 'warning'
        });
        return;
      }
      if (r[i].Type == '1') {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      } else {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      }
      //单选
      if (type == '1' || type == '3') {
        const current = this.data.current;
        if (current == "") {
          wx.showToast({
            title: '请选择答案',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
        }
      } else if (type == '2') {
        const length = this.data.currentD.length;
        if (length == 0) {
          wx.showToast({
            title: '请选择答案',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
        }
      } else {

      }
      if (choose == undefined && (this.data.disabled == false || this.data.disabled1 == false)) {
        this.statistical()
      }
      this.setThisData(this.data.index);

      this.setData({
        index: this.data.index + 1,
        current: choose == undefined ? '' : choose,
        currentD: choose == undefined ? [] : choose,
        disabled: choose == undefined ? false : true,
        disabled1: choose == undefined ? false : true
      });
    } else if (action === 'prev') {
      var i = this.data.index - 2;
      if (r[i].Type == '1') {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      } else {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      }
      this.setThisData(this.data.index - 2);
      this.setData({
        index: this.data.index - 1,
        current: choose,
        currentD: choose,
        disabled: true,
        disabled1: true
      });
    }
  },
  //统计答题
  statistical() {
    if ((this.data.questionErr + this.data.questionOk) == this.data.result.length) {
      return
    }
    //记录选择的答案
    if (this.data.type == 1) {
      //单选
      var choose = this.data.current;
      this.data.result[this.data.index - 1].choose = [choose];
    } else if (this.data.type == 2) {
      //多选
      var choose = this.data.currentD;
      this.data.result[this.data.index - 1].choose = [choose];
    } else {
      //判断
      var choose = this.data.current;
      this.data.result[this.data.index - 1].choose = [choose];
    }
    let questionErr = this.data.questionErr //错题个数
    let questionOk = this.data.questionOk //错题个数
    let questionMulOk = this.data.questionMulOk
    let questionInfo = this.data.questionInfo
    let result = this.data.result
    let index = this.data.index

    if (questionInfo.isOk === 1) {
      if (this.data.type == 2) {
        questionMulOk = questionMulOk + 1
        result[index - 1].judge = 1
      } else {
        questionOk = questionOk + 1
        result[index - 1].judge = 1
      }
    } else {
      questionErr = questionErr + 1
      result[index - 1].judge = 0
    }
    //计算百分比
    let percentage = questionOk / (index) * 100
    percentage = percentage.toFixed(2)

    //进度条
    let percent = this.data.index / this.data.total
    percent = (percent * 100).toFixed(2);
    percent = percent < 1 ? 1 : percent

    this.setData({
      result: result,
      questionOk: questionOk,
      questionMulOk: questionMulOk,
      questionErr: questionErr,
      percentage: percentage,
      percent: percent
    })
  },
  //单选
  handleChange({
    detail = {},
    target = {}
  }) {
    let questionInfo = this.data.questionInfo
    console.log(target)
    //判断答案
    if (target.dataset.id) {
      console.log('ok')
      questionInfo.isOk = 1
    } else {
      console.log('no')
      questionInfo.isOk = 0
    }
    this.setData({
      questionInfo: questionInfo,
      current: detail.value
    });
  },
  //多选
  handleChangeD({
    detail = {},
    target = {}
  }) {
    let questionInfo = this.data.questionInfo
    const index = this.data.currentD.indexOf(detail.value);
    index === -1 ? this.data.currentD.push(detail.value) : this.data.currentD.splice(index, 1);
    console.log(this.data.currentD)
    this.setData({
      currentD: this.data.currentD,
    });
    var answer = this.data.answer;
    var currentD = this.data.currentD;
    var rightNum = 0;
    for (var i = 0; i < currentD.length; i++) {
      var indexs = currentD[i].indexOf(" ");
      console.log(indexs)
      var indexOf = answer.indexOf(currentD[i].substring(indexs + 1));
      console.log(indexOf)
      if (indexOf >= 0) {
        rightNum += 1;
      }
    }
    console.log(answer)
    console.log(rightNum)
    console.log(currentD)
    //判断答案
    if (rightNum == answer.length && currentD.length == answer.length) {
      questionInfo.isOk = 1
    } else {
      questionInfo.isOk = 0
    }
    this.setData({
      questionInfo: questionInfo
    })

  },
  //交卷处理
  submit() {
    this.setData({
      loading: true,
      visible1: false
    })
    var result = this.data.result
    var score = this.data.questionOk + this.data.questionMulOk * 2
    console.log("单选判断答对" + this.data.questionOk);
    console.log("多选答对" + this.data.questionMulOk);
    var menu = this.data.id
    var questionMenu = this.data.questionMenu
    //保存历史记录
    //发起网络请求
    wx.request({
      method: 'post',
      url: app._server + '/BSite/SaveHistory',
      header: {
        'content-type': 'application/json'
      },
      data: {
        QuestionListObj: result,
        QuestionMenu:questionMenu,
        MenuId:menu,
        Score:score,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
        wx.reLaunch({
          url: '../history/history?id=' + res.data.Data
        })
      }
    })

    // wx.u.addHistory(menu, score, result, questionMenu).then(res => {
    //   console.log(res);
    //   this.setData({
    //     loading: false,
    //   })
    //   if (res.result) {
    //     wx.reLaunch({
    //       url: '../history/index?id=' + res.result
    //     })
    //   }
    // })
    var err = [];
    for (let object of result) {
      if (object.judge == 0 || object.judge == undefined) {
        err.push(object)
      }
    }
    //添加错题
    //发起网络请求
    wx.request({
      method: 'post',
      url: app._server + '/BSite/SaveError',
      header: {
        'content-type': 'application/json'
      },
      data: {
        QuestionListObj: err,
        QuestionMenu:questionMenu,
        MenuId:menu,
        sessionId:app.globalData.sessionId
      },
      async: true,
      success: function (res) {
        console.log(res.data)
      }
    })
    // wx.u.addError(menu, err, questionMenu).then(res => {})
    //统计分数
    // wx.u.getStatistics(menu).then(res => {
    //   wx.u.statistics(res.result.objectId, this.data.questionOk).then(res1 => {})
    // })
  },
  //交卷对话框
  handleSubmitOpen() {
    this.setData({
      visible1: true
    })
  },
  //交卷按钮
  checkSubmit({
    detail
  }) {
    //取消
    if (detail.index === 0) {
      this.setData({
        visible1: false
      });
    } else {
      //交卷
      this.submit();
    }
  },
  handleSubmit() {
    this.submit();
  },
  //时间到对话框
  handleClick1() {
    this.setData({
      visible2: true
    });
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
  hideModal() {
    this.setData({
      modalName: ''
    });
    console.log('隐藏对话框.')
    //执行计分操作
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