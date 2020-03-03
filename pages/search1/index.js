// pages/search1/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRecommand: false,  // 是否隐藏搜索建议
    inputValue: '',  // 输入框的值
    recommendList: [], //输入建议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 监听键盘输入
  handlerInput(e) {

    let { value } = e.detail
    // 将输入值 保存
    this.setData({
      inputValue: value
    })

    // 请求 输入建议
    this.getRecommendKey()
  },

  // 请求关键词 输入建议
  getRecommendKey() {
    get({
      url: '/goods/qsearch',
      data: {
        query: this.data.inputValue
      }
    }).then(res => {

      let { message } = res.data
      if(message.length === 0) return;
      
      // 如果数组长度多余15,截取后半部分
      if(message.length > 15) {
        message.length = 15
      }
      // 保存 输入建议
      this.setData({
        recommendList: message
      })

    })
  }
  
})