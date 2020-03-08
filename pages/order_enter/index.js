// pages/order_enter/index.js
import { get, post} from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],  // 购物车商品
    address: {},  //收货地址
    totalPrice: 0,  //商品总价格
    voucherData: {}, //存储凭证数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取收货地址
    this.getDelivery()
    // 获取购物车数据
    this.getOrderData()
    
  },

  // 获取收货地址
  getDelivery() {
    let address = wx.getStorageSync('address') || {}

    // 保存
    this.setData({
      address: address,
      tel1: address.tel && address.tel.substr(0, 3),
      tel2: address.tel && address.tel.substr(8)
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
  getOrderData() {
    let orderList = wx.getStorageSync('buyGoodsList')

    // 如果此时没有，初始化
    if (!orderList) {
      orderList = []
    }
    // 保存
    this.setData({
      orderData: orderList
    })

    // 计算总金额
    this.calcPrice()
  },

  // 计算总金额
  calcPrice() {
    let orderData = this.data.orderData
    let totalPrice = 0;

    // reduce 累加器，第一个参数回调，
    // 第二个参数是初始值--如果没有给则默认第一项
    totalPrice = orderData.reduce((acc, cur) =>  acc + cur.goods_price * cur.num , 0)
    // 保存
    this.setData({
      totalPrice: totalPrice
    })
  },

  // 点击微信支付
  toPay() {
    console.log('支付点击')

    // 判断是否有token，如果有直接 创建订单
    if (!wx.getStorageSync('userToken')) {
      wx.showToast({
        title: '你还没有授权！',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/authorize/index',
        })
      }, 500)
      return;
    }

    // 创建订单
    this.createOrder()
  },

  
  // 创建订单
  createOrder() {
    // 获取订单数据
    // Authorization
    // order_price consignee_addr goods{goods_id,goods_number,goods_price}
    let token = wx.getStorageSync('userToken')
    let goods = wx.getStorageSync('buyGoodsList')
    goods = goods.map(v => {
      v.goods_number = v.num
      return v
    })
    // 数据非空判断，地址是否获取、是否登录失效token

    let data = {
      order_price: this.data.totalPrice,
      consignee_addr: this.data.address.addr,
      goods
    }
    // 发起创建订单请求
    post({
      url: '/my/orders/create',
      header: {
        'Authorization': token 
      },
      data
    }).then(res => {
      console.log(res)
      let { message } = res.data
      if (message && message.order_id) {
        // 订单创建成功
        // 保存订单信息
        wx.setStorageSync('createOrder', message)
        // 获取支付参数
        this.getPayParams()
      }
    })
  },

  // 获取支付参数
  getPayParams() {
    // Authorization
    // order_number  订单编号
    let token = wx.getStorageSync('userToken')
    let order_number = wx.getStorageSync('createOrder').order_number
    // 非空判断。。。。

    // 发起 获取支付参数 请求
    post({
      url: '/my/orders/req_unifiedorder',
      header: {
        'Authorization': token 
      },
      data: {
        order_number
      }
    }).then(res => {
      console.log(res)
      let { message } = res.data

      // 保存预付订单数据
      wx.setStorageSync('payWait', message)

      // 发起微信支付
      wx.requestPayment({
        // 微信支付所需参数
        ...message.pay,
        success(res) { 
          console.log(res)
          
          if (res.errMsg.indexOf('ok') > -1) {
            console.log('支付成功')
            // 将已购买商品删除、订单数据
            wx.setStorageSync('createOrder', {})
            wx.setStorageSync('payWait', {})
            wx.setStorageSync('buyGoodsList', [])
            let cartList = wx.getStorageSync('cartList')
            cartList = cartList.filter(v => !v.selectStatus)
            console.log(cartList)
            wx.setStorageSync('cartList', cartList)
          }
         },
        fail(res) { 
          console.log(res)
          // errMsg: "requestPayment:fail cancel"  -> 用户取消支付
        }
      })
    })
  },


  

  
})