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
    address: {},  //收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取收货地址
    this.getDelivery()
  },

  /**
   * 生命周期函数--监听页面显示
  */
  onShow: function () {

    // 获取购物车数据
    this.getCartData()
    // 进入购物车页时，显示tabbar右上角 数量
    let cartList = wx.getStorageSync('cartList') || []
    wx.setTabBarBadge({ index: 2, text: '' + cartList.length })
  },


  // 页面切换时, 获取 购物车数据
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
    wx.setStorageSync('cartList', cartList)

    // 初始化，总价格，总件数
    this.computePrice()
    // 判断是否全选状态
    this.isSelectAll()
  },

  // 商品减一，弃用
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

  // 商品加一，弃用
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

  // 改变商品数量
  changeNumber(e) {
    // index 被点击的索引  ，num是加减号的 对应数字(-1, 1)
    let { index, num } = e.currentTarget.dataset
    let cartData =this.data.cartData
    // 判断当前数量为1，并且是减号时，
    // 提示用户是否删除该商品
    if (num === -1 && cartData[index].num === 1) {
      // 对话框
      wx.showModal({
        title: '提示',
        content: '确认将该商品删除吗？',
        success: (res) => {
          if (res.confirm) {
            // 用户点击了确定，则直接删除该商品
            cartData.splice(index, 1)
            // 保存
            this.setData({
              cartData: cartData
            })
            // 重新结算总价格
            this.computePrice()
          }
        }
      })
    }else {
      
      // 给该商品数量加减一
      cartData[index].num += num
      // 保存
      this.setData({
        cartData: cartData
      })
      // 重新结算总价格
      this.computePrice()
    }

    
  },

  // 商品数量，直接输入
  inputNum(e) {
    // 购物车商品 第几项：index
    let { index } = e.currentTarget.dataset
    // 购物车
    let cartData = this.data.cartData
    // 输入框的值
    let { value } = e.detail  

    // 判断输入值为空，则不继续修改
    // 并恢复原先的值 
    // setData可以触发 页面数据重新渲染
    if (value === '') {
      this.setData({
        cartData: cartData
      })
      return ;
    }

    // 如果输入值为0，则询问用户是否删除
    if(+value === 0) {
      wx.showModal({
        title: '提示',
        content: '确认将该商品删除吗？',
        success: (res) => {
          if (res.confirm) {
            // 确认：删除该商品
            cartData.splice(index, 1)
          } else if (res.cancel) {
            // 取消：数量改为 1
            cartData[index].num = 1
          }
          // 保存
          this.setData({
            cartData: cartData
          })
          // 计算总数
          this.computePrice()
        }
      })
      return ;
    }

    value = +value  // 转number类型
    
    // 商品数量改变
    cartData[index].num = value

    // 保存， 触发页面数据  重新渲染
    this.setData({
      cartData: cartData
    })
    wx.setStorageSync('cartList', cartData)

    // 如果该商品是 勾选的,则计算总价格;  反之,不用
    // 计算总价格\总件数
    if (cartData[index].selectStatus) {
      this.computePrice()
    }
    
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
    let cartData = this.data.cartData
    let price = 0
    let number = 0
    // 遍历  累加选中状态的商品
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
    // 本地存储
    wx.setStorageSync('cartList', cartData)

    // 设置tabbar右上角数量
    wx.setTabBarBadge({ index: 2, text: '' + cartData.length })
  },

  // 添加收货地址
  addDelivery() {
    // 获取用户收货地址
    wx.chooseAddress({
      success: (res) => {
        let address =  {
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
      },
      fail: (res) => {
        console.log(res)
        // 1、errMsg: "chooseAddress:fail auth deny"  
        // -->  这个说明用户第一次拒绝授权

        // 2、errMsg: "chooseAddress:fail authorize no response"  
        // --> 这个说明用户在第一次拒绝授权之后，再次点击直接 走fail
      },
      complete: (res) => {
        console.log(res.errMsg)
        // 请求失败，权限拒绝
        // 也就是用户第一次看到授权窗口时，拒绝了
        if (res.errMsg.indexOf('authorize no response') > -1) {
          // 可调起询问窗口
          // 获取用户当前 位置权限是否打开
          wx.getSetting({
            success: (res) => {
              console.log(res)
              if (!res.authSetting['scope.address']) {
                // 对话框，询问是否打开定位权限
                this.openConfirm()
              }

            }
          })
        }
      }
    })

  },
  // 询问是否打开定位权限
  openConfirm() {
    wx.showModal({
      content: '品优购没有定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { 
              console.log(res)
             }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 获取收货地址
  getDelivery() {
    let address = wx.getStorageSync('address') || {}
    // 保存
    this.setData({
      address: address
    })
  },

  // 结算
  confirmPage() {

    // 判断是否有收货地址
    if (!this.data.address.addr) {
      wx.showToast({
        title: '请先添加收货地址！',
        icon: 'none',
      })
      return;
    }
    
    let cartData = this.data.cartData
    console.log(cartData)
    // 保存订单商品的数组
    let selectedGoods = []
    // 将勾选的商品，单独保存为订单商品数组，可用filter方法
    selectedGoods = cartData.filter(v => v.selectStatus)
    // 遍历取出
    // cartData.forEach(v => {
    //   // 如果是选中状态
    //   if (v.selectStatus) {
    //     selectedGoods.push({
    //       goods_id: +v.goods_id, 
    //       goods_price: +v.goods_price, 
    //       goods_number: +v.num
    //     })
    //   }
    // })

    // 此处没有选中商品，提示
    if (selectedGoods.length === 0) {
      wx.showToast({
        title: '你还没有勾选商品',
        icon: 'none',
      })
      return;
    }
    console.log(selectedGoods)
    // 将选中的商品数据，保存到本地
    wx.setStorageSync('buyGoodsList', selectedGoods)

    // 跳转订单确认页
    wx.navigateTo({
      url: '/pages/order_enter/index'
    })
  }






  
})