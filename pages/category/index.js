// pages/category/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCate: 0,
    categories: [],
    scrollTop: 0, 
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
    // 并且滚动顶部
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
  },

  // 左侧大分类向上滑动
  upper(e) {
    // console.log(e)
  },

  // 左侧大分类向下滑动
  lower(e) {
    // console.log(e)
  },

  // 左侧大分类滚动
  scroll(e) {
    // console.log(e)
  }
})