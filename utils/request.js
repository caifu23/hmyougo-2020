// 封装request请求
/**
 * @params
 * 
 * 
*/
const request = (config = {}) => {
  
  if (config.url.indexOf('/goods/detail') > -1) {
    // 如果是详情页，出现加载效果，防止数据没加载完，用户点击了加入购物车
    wx.showLoading({
      title: '加载中',
      mask: true
    })
   }

  // 判断url 是否需要加上基准路径
  if (config.url.search(/^http/) === -1) {
    config.url =  request.defaults.baseURL + config.url 
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      },
      complete(res) {
        request.errors(res)
        // 关闭加载动画
        if (config.url.indexOf('/goods/detail') > -1) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
        
      }
    })
  })
}

const get = (config) => {
  return request({
    method: 'GET',
    ...config
  })
}

const post = (config) => {
  return request({
    method: 'POST',
    ...config
  })
}

// 基准路径
request.defaults = {
  baseURL: ''
}

// 存储错误的回调函数， 默认空函数
request.errors = () => {}

// 错误拦截
request.onError = (callback) => {
  if(typeof callback === 'function') {
    request.errors = callback
  }
}


// 暴露request
// 对应 import引入
// export default request
// 对应 require 引入
// module.exports = request

// 对应  导入名.方法
// export default {
//   request,
//   get
// }
// 对应 可解构 方法名
// 也可 导入名.方法
module.exports = {
  request,
  get,
  post
}