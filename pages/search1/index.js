// pages/search1/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRecommand: false,  // 是否隐藏搜索建议
    inputValue: '',  // 输入框的值
    lastValue: '',  // 被请求的输入框的值(上一次)
    recommendList: [], //输入建议
    searching: false,  // 是否正在查询请求中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 监听键盘输入
  handlerInput(e) {

    let { value } = e.detail

    // 输入值为空,不继续
    if(!value.trim()) return;

    // 将输入值 保存
    this.setData({
      inputValue: value
    })

    // 请求 输入建议
    this.getRecommendKey()
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
  }
  
})