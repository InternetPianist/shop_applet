import { request } from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口返回的数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    0 web中的本地存储 和 小程序的本地存储的区别
      1 写代码的方式不一样
        web：localStorage.setItem("key","value") localStorage.getItem("key")
      小程序中： wx.setStorageSync("key", "value"); wx.getStorageSync("key")
      2 存的时候 有没有做类型转换
        web：不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 在存入进去
        小程序： 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
      1 先判断一下本地存储中有没有旧的数据
        {time:new Date.now(),data:[...]}
      2 没有旧的数据 直接发送新请求
      3 有旧的数据 同时 旧的数据没有过期 就使用 本地存储中的旧数据即可
    */ 
   const Cates = wx.getStorageSync("cates")
   if(!Cates) {
    //  不存在 发送请求获取数据
    console.log('不存在发送请求') 
    this.getCates() 
   }else { 
    // 有旧的数据 定义过期时间 10s 改成5分钟
     if(Date.now() - Cates.time > 1000 * 10){
      // 过期 发送请求
       this.getCates()
     }else {
      // 可以使用旧的数据
      console.log('使用旧数据') 
       this.Cates = Cates.data
       let leftMenuList = this.Cates.map(item => item.cat_name)
       let rightContent = this.Cates[0].children
       this.setData({
         leftMenuList,
         rightContent
       })
     }
   }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    // .then(res => {
    //   this.Cates = res.data.message
    //   // 把接口中的数据存入到本地存储
    //   wx.setStorageSync('cates', {time: Date.now(),data: this.Cates})
    //   // 获取左侧大菜单数据
    //   let leftMenuList = this.Cates.map(item => item.cat_name)
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })  
    // 1 使用es7的 async await 来发送请求
    const res = await request({url: "/categories"})
      this.Cates = res
      // 把接口中的数据存入到本地存储
      wx.setStorageSync('cates', {time: Date.now(),data: this.Cates})
      // 获取左侧大菜单数据
      let leftMenuList = this.Cates.map(item => item.cat_name)
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
},
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex复制就可以了
    3 根据不同的索引来渲染右侧的商品内容
    */
   const {index} = e.currentTarget.dataset
      // 获取右侧的商品数据 
      let rightContent = this.Cates[index].children
      this.setData({
        currentIndex: index,
        rightContent,
        // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
        scrollTop: 0
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