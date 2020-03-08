// pages/authorize/index.js
import { post,get } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucherData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户信息
  handlerUserInfo(e) {
    console.log(e)
    // 获取信息成功
    if(e.detail && e.detail.iv) {
      // 用户信息
      let { encryptedData, iv, rawData, signature } = e.detail
      let options = { encryptedData, iv, rawData, signature }
       // 获取登录信息
      this.toLogin(options)
      
    }
  },

  // 获取用户token
  getToken() {
    post({
      url: '/users/wxlogin',
      data: this.data.voucherData
    }).then(res => {
      console.log(res)
      if (!res.data.message) {
        console.log('获取token出错', res)
        return;
      }
      let { token } = res.data.message
      // 保存用户token
      wx.setStorageSync('userToken', token)
      
      // 返回上一个页面
      wx.navigateBack()
    })
  },

  // 登录
  toLogin(options) {
    console.log('toLogin')
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log(res.code)
          this.setData({
            voucherData: {
              code: res.code,
              ...options
            }
          })

          // 获取用户token
          this.getToken()

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

})