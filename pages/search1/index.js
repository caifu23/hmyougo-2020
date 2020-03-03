// pages/search1/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRecommand: true,  // 是否隐藏搜索建议
    inputValue: '',  // 输入框的值
    lastValue: '',  // 被请求的输入框的值(上一次)
    recommendList: [], //输入建议
    searching: false,  // 是否正在查询请求中
    historyList: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取搜索历史记录
    this.getHistory()
  },

  // 监听键盘输入
  handlerInput(e) {

    let { value } = e.detail

    // 输入值为空,不继续
    // 清空输入建议,并隐藏
    // 输入框的值为空, 包括上一次的值
    if(!value.trim()) {
      this.setData({
        recommendList: [],
        showRecommand: true,
        inputValue: '',
        lastValue: ''
      })
      return;
    }

    // 将输入值 保存
    // 并显示 输入建议
    this.setData({
      inputValue: value,
      showRecommand: false
    })

    // 请求 输入建议
    this.getRecommendKey()
  },

  // 监听点击完成按钮(输入的确认)
  handlerConfirm(e) {
    // 获取用户确认时, 输入框的值
    let { value } = e.detail

    // 获取当前搜索历史
    let history = this.data.historyList
    history.unshift(value)

    // 数组去重
    history = [...new Set(history)]

    // 存储到搜索历史记录
    this.setData({
      historyList: history
    })
    // 存储到本地
    wx.setStorageSync('ygSearchHistory', history)

    // 跳转到商品列表页
    wx.redirectTo({
      url: '/pages/search/index?query=' + value
    })

  },

  // 请求关键词 输入建议
  getRecommendKey() {
    // 如果当前还在请求中,则不继续
    if (this.data.searching) return;

    // 请求开始, 修改请求状态为 true
    // 并且记录 当前请求的值
    this.setData({
      searching: true,
      lastValue: this.data.inputValue
    })

    get({
      url: '/goods/qsearch',
      data: {
        query: this.data.inputValue
      }
    }).then(res => {

      let { message } = res.data
      // if(message.length === 0) return;

      // 如果数组长度多余15,截取后半部分
      if(message.length > 15) {
        message.length = 15
      }
      // 保存 输入建议
      // 将请求状态改为 false
      this.setData({
        recommendList: message,
        searching: false
      })

      // 如果当前请求的值 与 输入框最新值不同, 则发起请求(可视为最后一次输入)
      if(this.data.lastValue !== this.data.inputValue) {
        this.getRecommendKey()
      }

    })
  },

  // 获取历史搜索记录
  getHistory() {

    // 从本地存储中获取
    let history = wx.getStorageSync('ygSearchHistory')
    // console.log(history)

    // 如果当前没有本地存储,则初始化
    if(!history) {
      history = [],
      wx.setStorageSync('ygSearchHistory', history)
    }

    // 保存到data中
    this.setData({
      historyList: history
    })
  },

  // 清除搜索历史
  clearHistory() {
    // 清除data中的数据
    this.setData({
      historyList: []
    })
    // 清除本地存储
    wx.setStorageSync('ygSearchHistory', [])
  },

  // 取消按钮：清除输入框的值
  cancelInput() {
    // 清空输入框的值 和上一次的值
    // 隐藏搜索建议
    // 搜索建议清空
    this.setData({
      inputValue: '',
      lastValue: '',
      showRecommand: true,
      recommendList: []
    })
  }
  
})