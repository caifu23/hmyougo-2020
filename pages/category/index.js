// pages/category/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCate: 0,
    categories: [],
    scrollTopLeft: 0, 
    scrollTopRight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取分类
    this.getCategories()
  },

  // 获取分类数据
  getCategories() {
    get({
      url: '/categories'
    }).then(res => {
      console.log(res)
      let { message } = res.data
      if(!message) return;
      this.setData({
        categories: message
      })
    })
  },

  // 改变当前分类(索引)
  changeCurrentCate(e) {
    let currentIndex = e.currentTarget.dataset.currentindex
    this.setData({
      currentCate: currentIndex
    })
    // 并且 右侧小分类 滚动顶部
    this.setData({
      scrollTopRight: 0
    })
    // 并且滚动顶部 这在scroll-view不可使用
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
  },

  // 左侧大分类滚动到顶部
  upperLeft(e) {
    // console.log(e)
  },
  // 右侧小分类滚动到顶部
  upperRight(e) {
    // console.log(e)
  },

  // 左侧大分类滚动到底部
  lowerLeft(e) {
    // console.log(e)
  },
  // 右侧小分类滚动到底部
  lowerRight(e) {
    // console.log(e)
  },

  // 左侧大分类滚动
  leftScroll(e) {
    // console.log('left')
    // console.log(e)
  },
  // 右侧小分类滚动
  rightScroll(e) {
    // console.log('right')
    // console.log(e)
    // console.log(this.data.scrollTopRight)
  }
})