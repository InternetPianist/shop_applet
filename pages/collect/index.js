// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        name: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        name: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        name: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        name: "浏览器足迹",
        isActive: false
      }
    ],
  },
  onShow(){
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      collect
    })
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {index} = e.detail
    // 2 修改源数组
    let {tabs} = this.data
    tabs.forEach((item,i) => i===index?item.isActive=true:item.isActive=false)
    // 3 赋值到data中 
    this.setData({
      tabs
    })
  }
})