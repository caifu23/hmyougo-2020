//index.js
//获取应用实例
const app = getApp()
import { request } from '../../utils/request.js'
Page({
  onLoad() {
    // 测试request
    request({
      url: '/home/swiperdata'
    }).then( res => {
      console.log(res)
    })
  }
})
