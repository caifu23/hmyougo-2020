// pages/search/index.js
import {
  get,
  post
} from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    cid: '',
    pagenum: 1, //页码
    pagesize: 10, //页容量: 每页数据条数
    total: 0,
    productList: [],
    currentCondition: 0,
    priceUpDown: 0, // 0 代表降序 1 代表升序
    queryArr: [],
    status: 'start', // 'start'初始状态/ 'search'搜索中 / 'end'搜索完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取历史搜索
    this.getHistory()
    // 获取当前跳转页面是否携带 查询参数
    // console.log(options)
    let cid = options.cid // 分类id
    let query = options.query // 查询关键词
    if (query) {
      this.setData({
        query: query
      })
      // 搜索
      this.searchProductKey({
        query: this.data.query,
        pagenum: this.data.pagenum,
        pagesize: this.data.pagesize
      })
    }
  },

  /**
   * 生命周期函数--监听用户上拉触底事件
   */
  onReachBottom() {
    // 判断 产品数据 productList 是否已经达到最大长度
    if (this.data.productList.length === this.data.total && this.data.total) {
      return;
    }
    // 如果有请求中的状态, 则不可以发起请求, 等待请求结束
    if (this.data.status === 'search') {
      return;
    }
    console.log('触底了')
    // 页码加一
    this.setData({
      pagenum: this.data.pagenum + 1
    })
    // 加载下一页数据
    this.searchProductKey({
      query: this.data.query,
      pagenum: this.data.pagenum,
      pagesize: this.data.pagesize
    })
  },

  // 搜索框输入时
  handlerSearch(e) {
    // console.log(e)
    let { value } = e.detail
    this.setData({
      query: value
    })
    // 输入为空, 不在继续
    if (!value) return;
    // 当前状态开启 搜索中
    this.setData({
      status: 'search'
    })
    // 重置 商品数据,页码,total
    this.setData({
      pagenum: 1,
      productList: [],
      total: 0
    })
    this.searchProductKey({
      query: this.data.query,
      pagenum: this.data.pagenum,
      pagesize: this.data.pagesize
    })
  },

  // 搜索框确认时, 存储 搜索历史
  handlerConfirm(e) {
    // console.log(e)
    let { value } = e.detail
    let orgArr = this.data.queryArr
    orgArr.unshift(value)
    this.setData({
      queryArr: orgArr
    })
    // 存储到本地
    wx.setStorage({
      key: "searchHistory",
      data: JSON.stringify(orgArr)
    })
  },

  // 根据关键词 搜索商品
  searchProductKey(options) {
    // 当前状态开启 搜索中
    this.setData({
      status: 'search'
    })
    // 定时器模拟网络请求延迟
    setTimeout(() => {
      get({
        url: "/goods/search",
        data: options

      }).then(res => {
        // console.log(res)
        let { goods, total } = res.data.message
        // 保存商品总数
        this.setData({
          total: total
        })
        // console.log(goods)
        // 追加下一页商品数据到 productList 中
        // 修改goods里数据 -- 价格保留2位小数
        goods = goods.map( v => {
          v.goods_price = Number(v.goods_price).toFixed(2)
          return v
        } )
        this.data.productList.push(...goods)
        // 赋值
        this.setData({
            productList: this.data.productList
          }),
        // 当前状态修改 完成搜索
        this.setData({
          status: 'end'
        })
      })
    }, 2000)
  },

  // 点击筛选条件时
  handlerCondition(e) {
    let { condition } = e.currentTarget.dataset
    this.setData({
      currentCondition: condition
    })
  },

  // 点击 切换价格升降序
  handlerPrice() {
    let rate = this.data.priceUpDown === 0 ? 1 : 0
    this.setData({
      priceUpDown: rate
    })
  },

  // 获取搜索历史
  getHistory() {
    wx.getStorage({
      key: 'searchHistory',
      success: (res) => {
        // console.log(res.data)
        let history = JSON.parse(res.data)
        // console.log(history)
        this.setData({
          queryArr: history
        })
      }
    })
  },

  // 删除搜索历史
  delHistory() {
    wx.removeStorage({
      key: 'searchHistory',
      success: (res) => {
        console.log(res)
      }
    })
    this.setData({
      queryArr: []
    })
  },

  // 点击搜索历史
  changeQuery(e) {
    // 点击搜索词,更改到搜索框
    let {
      index
    } = e.currentTarget.dataset
    let queryArr = this.data.queryArr
    // 手机端预览出现 点击之后2次闪现,最后搜索词没覆盖?
    // 所以用来延时
    // setTimeout(() => {
    this.setData({
      query: queryArr[index]
    })
    // 并手动触发一次搜索
    this.searchProductKey({
      query: this.data.query,
      pagenum: this.data.pagenum,
      pagesize: this.data.pagesize
    })
    // }, 100)
  }


})