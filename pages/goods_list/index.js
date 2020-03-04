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
    pagenum: 1, //页码
    pagesize: 10, //页容量
    loading: false, // 是否在请求/加载中
    showToTop: false, // 是否显示回到顶部
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
      query: query,
      pagenum: this.data.pagenum,
      pagesize: this.data.pagesize
    })
    
  },

  /**
   * 监听用户上拉触底
  */
  onReachBottom() {
    // 判断是否在加载中
    if (this.data.loading) {
      return;
    }
    // 如果商品数据长度 >= total ，表示已经是全部数据，不再请求
    if (this.data.goodsList.length >= this.data.total) {
      return;
    }

    // 加载下一页数据
    this.setData({
      pagenum: this.data.pagenum + 1
    })

    // 请求数据
    this.getGoodsList({
      query: this.data.query,
      pagenum: this.data.pagenum,
      pagesize: this.data.pagesize
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
    // 修改请求状态：加载中
    this.setData({
      loading: true
    })

    get({
      url: '/goods/search',
      data: options
    }).then(res => {

      // 获取商品数组，总数
      let { goods, total } = res.data.message

      // 修改价格, 保留2位小数
      goods = goods.map(v => {
        v.goods_price = Number(v.goods_price).toFixed(2)
        return v;
      }) 

      // 保存
      this.setData({
        goodsList: [...this.data.goodsList, ...goods], // 数据追加
        total: total
      })

      // 修改请求状态：请求完成
      this.setData({
        loading: false
      })
    })
  },

  // 回到顶部
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
  
})