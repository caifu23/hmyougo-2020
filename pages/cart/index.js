// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: [],  // 购物车商品
    totalPrice: 0,  //商品总价格
    totalNum: 0, //总件数
    selectData: [], // 选购的商品
    selectAllStatus: false,  //全选状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载')
    // 页面加载,初始化  购物车数据
    this.initCartData()
  },

  /**
   * 生命周期函数--监听页面显示
  */
  onShow: function () {

    // 获取购物车数据
    this.getCartData()
    
  },


  // 首次获取,初始化 购物车数据
  initCartData() {
    let cartList = wx.getStorageSync('cartList')
    // console.log(cartList)
    // 如果此时没有，初始化
    if (!cartList) {
      cartList = []
    }
    // 不用 修改购物车数据，价格
    // 首次进入, 需要初始化勾选状态
    cartList = cartList.map(v => {

      // 判断是否有勾选状态属性,  没有则-- 价格保留2位小数
      if (!v.hasOwnProperty('selectStatus')) {
        v.goods_price = Number(v.goods_price).toFixed(2)
        // console.log(v.goods_price)
      }
      // 无论有无勾选状态属性,  都设置勾选状态，为false
      v.selectStatus = false

      return v;
    })
    // 保存
    this.setData({
      cartData: cartList
    })
    wx.setStorageSync('cartList', cartList)
  },

  // 页面切换时, 获取 购物车数据
  getCartData() {
    let cartList = wx.getStorageSync('cartList')

    cartList = cartList.map(v => {

      // 判断是否有勾选状态属性,  没有则-- 价格保留2位小数
      if (!v.hasOwnProperty('selectStatus')) {
        v.goods_price = Number(v.goods_price).toFixed(2)
        console.log(v.goods_price)
      }

      return v;
    })
    // 保存
    this.setData({
      cartData: cartList
    })
  },

  // 商品减一
  reduceGoods(e) {
    let { index } = e.currentTarget.dataset
    let cartData = [...this.data.cartData]

    if (cartData[index].num <= 1) {
      // 减一则是删除，按钮不可点
      // 删除该商品
      cartData.splice(index, 1)
    }else {
      cartData[index].num--
    }

    // 保存
    this.setData({
      cartData: cartData
    })
    wx.setStorageSync('cartList', cartData)

    // 如果该商品是 勾选的,则计算总价格;  反之,不用
    // 计算总价格\总件数
    if (cartData[index] && cartData[index].selectStatus) {
      this.computePrice()
    }
  },

  // 商品加一
  addGoods(e) {
    let { index } = e.currentTarget.dataset
    let cartData = [...this.data.cartData]
    // 商品加一
    cartData[index].num ++

    // 如果该商品是 勾选的,则计算总价格;  反之,不用
    // 计算总价格\总件数
    if (cartData[index].selectStatus) {
      this.computePrice()
    }

    // 保存
    this.setData({
      cartData: cartData
    })
    wx.setStorageSync('cartList', cartData)
  },

  // 切换勾选状态
  changeSelect(e) {
    let { index } = e.currentTarget.dataset
    let cartData = [...this.data.cartData]
    // 切换是否勾选
    cartData[index].selectStatus = !cartData[index].selectStatus
    // 判断是否全选状态
    this.isSelectAll()

    // 计算总价格\总件数
    this.computePrice()

    // 保存
    this.setData({
      cartData: cartData
    })
    // 是否勾选，可不保存到本地
    wx.setStorageSync('cartList', cartData)
  },

  // 判断全选是否勾选
  isSelectAll() {
    let cartData = this.data.cartData
    // 全选状态
    let flags  = cartData.some(v => {
      // 只要有一个是false则不是全选
      return v.selectStatus === false
    })
    
    // 保存全选状态
    this.setData({
      selectAllStatus: !flags
    })
   
  },

  // 切换全选状态
  toggleAll() {
    let cartData = [...this.data.cartData]

    // 保存
    this.setData({
      selectAllStatus: !this.data.selectAllStatus
    })

    // 将单选按钮勾选状态  跟全选按钮 保持一致
    cartData.forEach(v => {
      v.selectStatus = this.data.selectAllStatus
    })

    // 计算总价格\总件数
    this.computePrice()

    // 保存
    this.setData({
      cartData: cartData
    })
    // 是否勾选，可不保存到本地
    wx.setStorageSync('cartList', cartData)
  },

  // 计算合计金额、结算件数
  computePrice() {
    let cartData = [...this.data.cartData]
    let price = 0
    let number = 0
    // 遍历  累加
    cartData.forEach(v => {
      if (v.selectStatus) {
        price += v.goods_price * v.num
        number += v.num
      }
    })

    // 保存
    this.setData({
      totalPrice: price,
      totalNum: number
    })
  }






  
})