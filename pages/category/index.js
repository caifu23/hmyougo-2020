// pages/category/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCate: 0,
    categories: []
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
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  }
})