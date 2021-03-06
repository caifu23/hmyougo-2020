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
    showToTop: false, // 是否显示回到顶部
    cartList: [], // 购物车商品列表
    totalCart: 0,  // 购物车商品数量
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

    // 获取购物车数据
    this.getCart()

    // 获取购物车数量
    this.getCartTotal()
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

  // 获取购物车商品
  getCart() {
    let cartList = wx.getStorageSync('cartList')

    if (!cartList) {
      // 初始化购物车数据
      cartList = []
    }
    // 保存
    this.setData({
      cartList: cartList
    })
  },

  // 获取购物车商品数量
  getCartTotal() {
    let cartList = this.data.cartList
    let total = 0
    cartList.forEach(v => {
      total += v.num
    })
    // 保存
    this.setData({
      totalCart: total
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
  },
  // 添加到购物车
  addCart() {
    // 将当前的商品信息，本地存储
    let currentGoods = {
      goods_id: this.data.goods_id,
      goods_name: this.data.goods_data.goods_name,
      goods_price: Number(this.data.goods_data.goods_price).toFixed(2),
      goods_small_logo: this.data.goods_data.goods_small_logo,
      num: 1,  // 商品件数
      selectStatus: true, //默认选中状态
    }
    let isNull = false; // 记录是否有空值

    // 遍历商品信息里是否非空
    Object.keys(currentGoods).forEach(v => {

      if (isNull === true) return;  //只要有空值则不再继续
      // 如果当前属性值为空
      if (!currentGoods[v]) {
        isNull = true
        console.log('数据不齐全')
      }
      
    })
    //只要有空值则不再继续
    if (isNull === true) return;  
    console.log('跳转购物车')

    // 判断当前商品是否 购物车已经有
    let cartList = [...this.data.cartList]
    let isIndex = cartList.findIndex(ele => {
      return +ele.goods_id === +this.data.goods_id
    })
    if (isIndex > -1) {
       // 已经存在该商品，则数量加一
       cartList[isIndex].num ++
       // 默认选中状态
       cartList[isIndex].selectStatus = true
       //  然后将该商品的位置提前
       let currentItem = cartList[isIndex]
       //  删除
       cartList.splice(isIndex, 1)
       //  头部添加
       cartList.unshift(currentItem)
    }else {
        // 否则，添加该商品
        // 这是尾部添加, 
        // cartList[cartList.length] = currentGoods
        // 改为头部添加
        cartList = [currentGoods, ...cartList]
    }
    
    // 加入成功提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 500
    }),

    // 保存到data
    this.setData({
      cartList: cartList
    })
    // 保存到本地
    wx.setStorageSync('cartList', cartList)
    // 修改购物车数量
    this.getCartTotal()
  },

  // 回到顶部
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  /**
   * 生命周期函数--监听用户滑动页面事件
  */
  onPageScroll(obj) {
    // 页面在垂直方向已滚动的距离(px)
    let scrollTop = obj.scrollTop
    // 滚动超过500时,并且 showToTop是false(回到顶部是隐藏),让其显示
    // 可以减少 setData的频繁操作
    if (scrollTop > 500 && !this.data.showToTop) { 
      this.setData({
        showToTop: true
      })
    } else if (this.data.showToTop && scrollTop < 500) {
      this.setData({
        showToTop: false
      })
    }

  },

})