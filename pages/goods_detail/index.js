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
    picUrls: [],  // 预览图url数组
    currentTab: 0, // 当前tab
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
      // console.log(res)
      let { message } = res.data
      // 保存商品数据
      this.setData({
        goods_data: message
      })
      // 处理预览图片数据
      this.modPreviewData()
    })
  },

  // 处理图片预览图数据
  modPreviewData() {
    let { pics } = this.data.goods_data
    // 将图片url作为数组
    let newPics = pics.map(v => {
      return v.pics_big_url
    })
    // 保存
    this.setData({
      picUrls: newPics
    })
  },

  // 点击轮播图，实现全屏预览
  previewImg(e) {
    // 获取当前点击的 图片索引
    let { index } = e.currentTarget.dataset
    // 全屏预览图片
    wx.previewImage({
      current: this.data.picUrls[index], // 当前显示图片的http链接
      urls: this.data.picUrls // 需要预览的图片http链接列表
    })
    
  },

  // 切换tab栏
  changeTab(e) {
    let { index } = e.currentTarget.dataset
    // 改变当前tab index
    this.setData({
      currentTab: index
    })
  },

  // 打开客服会话
  handleContact(e) {
    console.log(e)
  },

  // 跳转购物车页
  toCart() {
    wx.switchTab({
      url: '/pages/cart/index?goods_id=' + this.data.goods_id,
    })
  }

})