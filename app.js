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
        console.log(res.code)
        setTimeout(function () {
          wx.request({
            method:'POST',
            url: _this._server+'/WxOpen/onLogin',
            async:false,
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
                _this.globalData.userId=res.data.UserId;
                _this.globalData.isPhone=res.data.IsPhone;
                _this.globalData.nickName=res.data.NickName;
                _this.globalData.avatarUrl=res.data.AvatarUrl
              }
            }
          })
        },2000)
        
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
  //_server: "http://10.27.9.154:5000",
  _server: "https://zjshow.cn:8003",
  //_server: "http://47.98.229.13:8003",
  //应用全局数据
  globalData: {
    //微信数据
    userInfo: null,
    sessionId: null,
    //用户id
    userId:'',
    //状态
    status:null,
    //账号集合
    employeeList:[],
    //过期时间
    expireTime:null,
    //是否存在手机号
    isPhone:'',
    //昵称
    nickName:'',
    //用户头像
    avatarUrl:''

  },
})
