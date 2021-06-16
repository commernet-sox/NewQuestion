// app.js
App({
  //保存缓存
  saveCache: function (key, value) {
    if (!key || !value) {
      return;
    }
    var _this = this;
    _this.cache[key] = value;
    wx.setStorage({
      key: key,
      data: value
    });
  },
  onLaunch() {
    var _this=this;
    // 获取顶部高度
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //发起网络请求
        wx.request({
          method:'POST',
          url: _this._server+'/WxOpen/onLogin',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            code: res.code
          },
          success:function(res){
            console.log(res.data)
            if(res.data.success)
            {
              _this.saveCache("sessionId", res.data.sessionId);
              _this.saveCache("status", res.data.operation);
              _this.saveCache("expireTime", res.data.expireTime);
              _this.globalData.sessionId = res.data.sessionId; 
              _this.globalData.status = res.data.operation;
              _this.globalData.expireTime = res.data.expireTime;
            }
          }
        })
      }
    })
  },
  getLoginInfo(e){
    console.log('现在换取session...')
    var _this = this;
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          console.log(_this)
          //发起网络请求
          wx.request({
            method:'POST',
            url: _this._server+'/WxOpen/onLogin',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              code: res.code
            },
            success:function(res){
              console.log(res.data)
              if(res.data.success)
              {
                _this.saveCache("sessionId", res.data.sessionId);
                _this.saveCache("status", res.data.operation);
                _this.saveCache("expireTime", res.data.expireTime);
                _this.globalData.sessionId = res.data.sessionId; 
                _this.globalData.status = res.data.operation;
                _this.globalData.expireTime = res.data.expireTime;
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  cache: {},
  _server: "http://10.27.9.154:5000",

  //应用全局数据
  globalData: {
    //微信数据
    userInfo: null,
    sessionId: null,
    //员工工号
    employeeId:null,
    //状态
    status:null,
    //账号集合
    employeeList:[],
    //过期时间
    expireTime:null,
    //是否是组长
    isMaster:null
  },
})
