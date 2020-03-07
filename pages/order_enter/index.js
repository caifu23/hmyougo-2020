// pages/order_enter/index.js
import { get, post} from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: [],  // 购物车商品
    address: {},  //收货地址
    totalPrice: 0,  //商品总价格
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    voucherData: {}, //存储凭证数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取收货地址
    this.getDelivery()
    // 获取购物车数据
    this.getCartData()
    // // 获取登录信息
    // this.toLogin()
    
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
  },

  // 点击微信支付
  toPay() {
    console.log('支付点击')
    this.toLogin()
  },

  // 获取用户token
  getToken() {
    post({
      url: '/users/wxlogin',
      data: this.data.voucherData
    }).then(res => {
      console.log(res)
      let { token } = res.data.message
      console.log(token)
      // 保存用户token
      wx.setStorageSync('userToken', token)
      // 创建订单
      this.createOrder()
    })
  },

  // 创建订单
  createOrder() {
    // 获取订单数据
    // Authorization
    // order_price consignee_addr goods{goods_id,goods_number,goods_price}
    let token = wx.getStorageSync('userToken')
    let goods = wx.getStorageSync('buyGoodsList')
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
    console.log(token)
    console.log(order_number)
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
      console.log(message)
      // 保存预付订单数据
      wx.setStorageSync('payWait', message)

      // 发起微信支付
      wx.requestPayment({
        // 微信支付所需参数
        ...message.pay,
        success(res) { 
          console.log(res)
          console.log(res.errMsg.indexOf('ok'))
          if (res.errMsg.indexOf('ok') > -1) {
            console.log('支付成功')
          }
         },
        fail(res) { 
          console.log(res)
        }
      })
    })
  },



  // 查看是否授权
  isSetting() {
    console.log('isSetting')
    // 查看是否授权
    wx.getSetting({
      success: (res)  => {
        console.log(res)
        console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          this.getUserInfo()
        }else {
          console.log('authorize')
          wx.showToast({
            title: '没有登录，点击下方 授权登录',
            icon: 'none',
            duration: 1000
          })

          // 没有授权，则发起授权请求
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success(res) {
          //     // 用户已经同意小程序，
          //     console.log('已经同意获取信息')
          //   },
          //   fail(err) {
          //     console.log('发起授权失败')
          //     console.log(err)
          //   }
          // })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },

  // 获取用户信息
  getUserInfo() {
    console.log('getUserInfo')
    wx.getUserInfo({
      success: (res) => {
        // console.log(res.userInfo)
        console.log(res)
        let { encryptedData, iv, rawData, signature } = res
        // 保存凭证信息
        this.setData({
          voucherData: {
            encryptedData,
            iv,
            rawData,
            signature,
            code: this.data.voucherData.code
          }
        })
        // 判断是否有 凭证信息
        console.log(this.data.voucherData.code)
        console.log(res)
        if (this.data.voucherData.code && res.iv) {
          // 获取用户token
          this.getToken()
        }
      }
    })
  },

  // 登录
  toLogin() {
    console.log('toLogin')
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log(res.code)
          this.data.voucherData.code = res.code 
          // console.log(this.data.voucherData)

          // 查看是否授权
          this.isSetting()

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  
})