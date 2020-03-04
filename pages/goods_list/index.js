// pages/goods_list/index.js
import { get, post } from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCondition: 0,
    upDown: true, // 价格的升降
    query: '', //查询关键字
    goodsList: [], //商品列表
    total: 0,  //商品总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取查询关键字
    let { query } = options
    // 保存
    this.setData({
      query: query
    })

    // 获取商品列表数据
    this.getGoodsList({
      query: query
    })
  },

  // 切换条件
  changeCondition(e) {
    let { index } = e.currentTarget.dataset
    // 判断点击是否当前的
    if (this.data.currentCondition !== index) {
      // 修改当前筛选条件
      this.setData({
        currentCondition: index
      })
    }
    // 点击为价格时，切换升降
    if (index === 2) {
      this.setData({
        upDown: !this.data.upDown
      })
    }
  },

  // 获取商品列表数据
  getGoodsList(options) {
    get({
      url: '/goods/search',
      data: options
    }).then(res => {
      console.log(res)
      // 获取商品数组，总数
      let { goods, total } = res.data.message

      // 修改价格, 保留2位小数
      goods = goods.map(v => {
        v.goods_price = Number(v.goods_price).toFixed(2)
        return v;
      }) 

      // 保存
      this.setData({
        goodsList: goods,
        total: total
      })
    })
  }

  
})