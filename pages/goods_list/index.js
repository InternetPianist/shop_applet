/*
onReachBottom
1 用户向上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件
  2 判断还有没有下一页数据
    1 获取到总页数
      总页数 = Math.ceil(总条数 / 页容量)
            = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码 pagenum
    3 判断一下 当前的页码是否大于等于总页数
      表示没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行拼接 而不是全部替换
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页码 设置为 1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果
*/ 
import { request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "综合",
        isActive: true
      },
      {
        id: 1,
        name: "销量",
        isActive: false
      },
      {
        id: 2,
        name: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 请求接口的参数
  queryPrams: {
    queyr: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  // 标题点击事件 从子组件传递来的
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {index} = e.detail
    // 2 修改源数组
    let {tabs} = this.data
    tabs.forEach((item,i) =>i===index?item.isActive=true:item.isActive=false)
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.queryPrams.cid = options.cid||""
    this.queryPrams.queyr = options.queyr||""
    this.getGoodsList()
  },
  // 获取商品列表数据
  async getGoodsList () {
    const res = await request({url: '/goods/search',data: this.queryPrams})
    console.log(res)
    // 获取总条数
    const {total} = res
    // 计算总页数
    this.totalPages = Math.ceil(total / this.queryPrams.pagesize)
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh()
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
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.queryPrams.pagenum = 1
    // 重新发送请求
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 1 判断还有没有下一页数据
    if(this.queryPrams.pagenum>=this.totalPages){ // 当前页码大于或等于总页码
      // 没有下一页数据
      // console.log("%c"+"没有下一页数据","font-size:100px;background: linear-gradient(to right,#34c2aa,#6cd557);")
      wx.showToast({ title: '没有下一页数据' })
    }else {
      this.queryPrams.pagenum++
      this.getGoodsList()
      // console.log('%c'+"有下一页数据","font-size:100px;background: linear-gradient(to right,#34c2aa,#6cd557);")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})