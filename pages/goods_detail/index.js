// pages/goods_detail/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: 0, // 商品id
    goods_data: {}, // 商品数据
    indicatorDots: true, // 是否显示面板指示点
    autoplay: false, // 是否自动切换
    interval: 2000, // 切换时间间隔
    duration: 500,  // 滑动动画时长
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品id
    let id = options.goods_id
    this.setData({
      goods_id: id
    })

    // 获取商品详情
    this.getGoodDetail()
  },

  // 获取商品详情
  getGoodDetail() {

    get({
      url: '/goods/detail',
      data: {
        goods_id: this.data.goods_id
      }
    }).then(res => {
      console.log(res)
      let { message } = res.data
      // 保存商品数据
      this.setData({
        goods_data: message
      })
    })
  }

})