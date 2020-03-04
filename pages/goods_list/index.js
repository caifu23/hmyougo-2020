// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCondition: 0,
    upDown: true, // 价格的升降
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  }

  
})