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
    products: [],
    // 是否显示回到顶部
    isShowTop: false
  },
  onLoad() {
    //  获取轮播图
    this.getBanners()
    // 获取导航菜单
    this.getMeun()
    // 获取楼层产品
    this.getProducts()
  },
  // 页面滚动
  onPageScroll({scrollTop}) {
    let isShow;
    // 如果页面滚动超过一屏
    if (scrollTop > 90) {
      isShow = true
    } else {
      isShow = false
    }
    // 如果当前值没变,则不继续执行
    // setData不可以频繁操作
    if (isShow === this.data.isShowTop) {
      return;
    }
    this.setData({
      isShowTop: isShow
    })
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
      // console.log(res)
      let { message }  = res.data
      if(!message)  return;
      this.setData({
        products: message
      })
    })
  },
  // 回到顶部
  handlerToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})