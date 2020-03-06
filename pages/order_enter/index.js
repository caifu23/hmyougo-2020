// pages/order_enter/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: [],  // 购物车商品
    address: {},  //收货地址
    totalPrice: 0,  //商品总价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取收货地址
    this.getDelivery()
    // 获取购物车数据
    this.getCartData()
  },

  // 获取收货地址
  getDelivery() {
    let address = wx.getStorageSync('address') || {}

    // 保存
    this.setData({
      address: address,
      tel1: address.tel.substr(0, 3),
      tel2: address.tel.substr(8)
    })
  },

  // 编辑收货地址
  addDelivery() {
    // 获取用户收货地址
    wx.chooseAddress({
      success: (res) => {
        let address = {
          name: res.userName,
          tel: res.telNumber,
          addr: res.provinceName + res.cityName + res.countyName + res.detailInfo
        }
        // 保存
        this.setData({
          address: address
        })
        // 保存本地
        wx.setStorageSync('address', address)
      }
    })
  },

  // 获取购物车商品
  getCartData() {
    let cartList = wx.getStorageSync('cartList')

    // 如果此时没有，初始化
    if (!cartList) {
      cartList = []
    }
    // 保存
    this.setData({
      cartData: cartList
    })
    // wx.setStorageSync('cartList', cartList)

    // 计算总金额
    this.calcPrice()
  },

  // 计算总金额
  calcPrice() {
    let cartData = this.data.cartData
    let totalPrice = 0;

    // reduce 累加器，第一个参数回调，
    // 第二个参数是初始值--如果没有给则默认第一项
    totalPrice = cartData.reduce((acc, cur) =>  acc + cur.goods_price * cur.num , 0)
    // 保存
    this.setData({
      totalPrice: totalPrice
    })
  }

  
})