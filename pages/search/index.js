// pages/search/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    productList: [],
    currentCondition: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  
})