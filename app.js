//app.js
import req from '/utils/request.js'
App({
  onLaunch: function () {
    // 设置基准路径
    req.request.defaults.baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'
    console.log('小程序初始化')
  }
})