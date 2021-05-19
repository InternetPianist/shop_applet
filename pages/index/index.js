// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */ 
  data: { 
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数组
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据 优化的手段可以通过es6的 promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => { 
    //     console.log(result)
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });

    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  getSwiperList() {
    request({
      url: '/home/swiperdata' 
    })
// /pages/goos_detail/index?goods_id=47868
// /pages/goods_detail/index?goods_id=129
// /pages/goods_detail/main?goods_id=129
    .then(res => {
      res.forEach(item => {
        item.navigator_url = item.navigator_url.replace('goods_detail/main',"goos_detail/index")
      })
      this.setData({
        swiperList: res
      })
    })
  },
  async getCateList() {
    request({
      url: '/home/catitems'
    })
    .then(res => {
      this.setData({
        catesList: res
      })
    })
  },
  getFloorList() {
    request({
      url: '/home/floordata'
    })
    .then(res => {
      res.forEach(item1 => {
        item1.product_list.forEach(item2 => {
          item2.navigator_url = item2.navigator_url.replace('goods_list','goods_list/index')
        })
      })
      this.setData({
        floorList: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})