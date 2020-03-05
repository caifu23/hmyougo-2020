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

  },

  /**
   * 生命周期函数--监听页面显示
  */
  onShow: function () {

    // 获取购物车数据
    this.getCartData()
  },

  // 获取购物车数据
  getCartData() {
    let cartList = wx.getStorageSync('cartList')
    console.log(cartList)
    // 如果此时没有，初始化
    if (!cartList) {
      cartList = []
    }
    // 修改购物车数据，价格
    // 计算总价格，总件数
    // 勾选状态
    let totalNum = 0;
    let totalPrice = 0;

    cartList = cartList.map(v => {
      v.goods_price = Number(v.goods_price).toFixed(2)
      totalNum += v.num 
      totalPrice += v.num * v.goods_price
      // 添加勾选状态，默认false
      v.selectStatus = false
      return v;
    })
    // 保存
    this.setData({
      cartData: cartList,
      totalNum: totalNum,
      totalPrice: Number(totalPrice).toFixed(2)
    })
  },

  // 商品减一
  reduceGoods(e) {
    let { index } = e.currentTarget.dataset
    let cartData = [...this.data.cartData]

    if (cartData[index].num <= 1) {
      // 减一则是删除，按钮不可点

    }else {
      cartData[index].num--
    }
    // 保存
    this.setData({
      cartData: cartData
    })
    wx.setStorageSync('cartList', cartData)
  },

  // 商品加一
  addGoods(e) {
    let { index } = e.currentTarget.dataset
    let cartData = [...this.data.cartData]
    // 商品加一
    cartData[index].num ++
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
    // 保存
    this.setData({
      cartData: cartData
    })

  }






  
})