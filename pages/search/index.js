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
    queryArr: [],
    status: 'start', // 'start'初始状态/ 'search'搜索中 / 'end'搜索完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取历史搜索
    this.getHistory()
  },

  // 搜索框输入时
  handlerSearch(e) {
    // console.log(e)
    let { value } = e.detail
    this.setData({
      query: value
    })
    // 输入为空, 不在继续
    if (!value) return;
    // 当前状态开启 搜索中
    this.setData({
      status: 'search'
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
      // console.log(goods)
      this.setData({
        productList: goods
      }),
      // 当前状态修改 完成搜索
      this.setData({
        status: 'end'
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
      success: (res) => {
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
  },

  // 点击搜索历史
  changeQuery(e) {
    // 点击搜索词,更改到搜索框
    let { index } = e.currentTarget.dataset
    let queryArr = this.data.queryArr
    // 手机端预览出现 点击之后2次闪现,最后搜索词没覆盖?
    // 所以用来延时
    // setTimeout(() => {
      this.setData({
        query: queryArr[index]
      })
      // 并手动触发一次搜索
      this.searchProductKey()
    // }, 100)
  }


})