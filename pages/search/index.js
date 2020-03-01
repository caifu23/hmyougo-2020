// pages/search/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    productList: [],
    currentCondition: 0,
    priceUpDown: 0,  // 0 代表降序 1 代表升序
    queryArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取历史搜索
    this.getHistory()
    console.log(11)
  },

  // 搜索框输入时
  handlerSearch(e) {
    // console.log(e)
    let { value } = e.detail
    // console.log(value)
    this.setData({
      query: value
    })
    this.searchProductKey()
  },

  // 搜索框确认时, 存储 搜索历史
  handlerConfirm(e) {
    // console.log(e)
    let { value } = e.detail
    let orgArr = this.data.queryArr
    orgArr.unshift(value)
    this.setData({
      queryArr: orgArr
    })
    // 存储到本地
    wx.setStorage({
      key: "searchHistory",
      data: JSON.stringify(orgArr)
    })
  },

  // 根据关键词 搜索商品
  searchProductKey() {
    get({
      url: "/goods/search",
      data: {
        query: this.data.query
      }
    }).then(res => {
      // console.log(res)
      let { goods } = res.data.message
      this.setData({
        productList: goods
      })
    })
  },

  // 点击筛选条件时
  handlerCondition(e) {
    let { condition } = e.currentTarget.dataset
    this.setData({
      currentCondition: condition
    })    
  },

  // 点击 切换价格升降序
  handlerPrice() {
    let rate = this.data.priceUpDown === 0 ? 1 : 0
    this.setData({
      priceUpDown: rate
    })
  },

  // 获取搜索历史
  getHistory() {
    wx.getStorage({
      key: 'searchHistory',
      success: (res)=> {
        // console.log(res.data)
        let history = JSON.parse(res.data)
        // console.log(history)
        this.setData({
          queryArr: history
        })
      }
    })
  },

  // 删除搜索历史
  delHistory() {
    wx.removeStorage({
      key: 'searchHistory',
      success: (res) => {
        console.log(res)
      }
    })
    this.setData({
      queryArr: []
    })
  }

  
})