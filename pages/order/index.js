/*
1 页面打不开的时候 onShow
  0 onShow 不同于onLoad 无法在形参上接受options 参数
  0.5 判断缓存中有没有token
    1 没有 直接跳转到授权页面
    2 有 直接往下进行
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪一个被激活选中
  2 根据type 去发送请求数据获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
*/ 
import {request} from '../../request/index'
Page({
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        name: "全部",
        isActive: true
      },
      {
        id: 1,
        name: "待付款",
        isActive: false
      },
      {
        id: 2,
        name: "待发货",
        isActive: false
      },
      {
        id: 3,
        name: "退货/换货",
        isActive: false
      }
    ],
  },
  onShow(options) {
    const token = wx.getStorageSync('token')
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      // 没有token 不在执行下面的代码 先去授权
      return
    }

  //  1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages()
    // 2 数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1]
    // 3 获取url上的type参数
    const {type} = currentPage.options
    this.changeTitleByIndex(type-1)
    this.getOrders(type)
  },
  // 获取订单列表的方法
  async getOrders(type){
    const res = await request({url:'/my/orders/all',data: {type}})
    this.setData({
      // (new Date(item.create_time*1000).toLocaleString)
      // 扩展运算符 进行对象扩展 一个属性: create_time_cn 值为格式化后的时间
      orders: res.orders.map(item=> ({...item,create_time_cn:(new Date(item.create_time*1000).toLocaleString())}))
    })
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
     // 2 修改源数组
     let {tabs} = this.data
     // 当前点击的索引isActive 设置为true 其他为false
     tabs.forEach((item,i) =>i===index?item.isActive=true:item.isActive=false)
     // 3 赋值到data中
     this.setData({
       tabs
     })
  },
    // 标题点击事件 从子组件传递来的
  handleTabsItemChange(e) {
      // 1 获取被点击的标题索引
      const {index} = e.detail
      this.changeTitleByIndex(index)
      // 2 重新发送请求 type=1 index=0
      this.getOrders(index+1)
  },
})