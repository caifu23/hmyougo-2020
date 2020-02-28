//index.js
//获取应用实例
const app = getApp()
import {
  request,
  get
} from '../../utils/request.js'
Page({
  data: {
    // 轮播图
    banners: [],
    // 导航菜单
    menus: [],
    products: []
  },
  onLoad() {
    //  获取轮播图
    this.getBanners()
    // 获取导航菜单
    this.getMeun()
    // 获取楼层产品
    this.getProducts()
  },
  // 获取轮播图
  getBanners() {
    get({
      url: '/home/swiperdata'
    }).then(res => {
      // console.log(res)
      const {
        message
      } = res.data
      if (!message) return;
      this.setData({
        banners: message
      })
    })
  },
  // 获取导航菜单
  getMeun() {
    get({
      url: '/home/catitems'
    }).then(res => {
      // console.log(res)
      let {
        message
      } = res.data
      if (!message) return;
      // 改变跳转链接
      message = message.map(val => {
        if (val.name === '分类') {
          val.url = '/pages/category/index'
        } else {
          val.open_type = "navigate"
        }
        return val
      })
      // 赋值给 menus
      this.setData({
        menus: message
      })
    })
  },
  // 获取产品图
  getProducts() {
    get({
      url: '/home/floordata'
    }).then(res => {
      console.log(res)
      let { message }  = res.data
      if(!message)  return;
      this.setData({
        products: message
      })
    })
  }
})