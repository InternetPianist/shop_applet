/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据 checked=true
2 微信支付
  1 那些人 哪些账号 可以实现微信支付
  2 企业账户的小程序后台中 必须 给 开发者 添加上白名单
    1 一个 appid 可以同时绑定多个开发者
    2 这些开发者就可以公用这个appid 和 它的开发权限
3 支付按钮
  1 先判断缓存中有没有 token
  2 没有 跳转到授权页面 进行获取token
  3 有token
  4 创建订单 获取订单编号
  5 已经完成了微信支付 （没有权限 需要自己搭建后台服务）
  6 手动删除缓存中 已经被选中了的商品
  7 删除后的购物车数据 填充回缓存
  8 在跳转页面
*/ 

import { getSetting,chooseAddress,openSetting,showModal, showToast, requestPayment } from '../../utils/asyncWx'
import{request} from '../../request/index'
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart')||[]
    // 获取选中的商品
    cart = cart.filter(item => item.checked)
    this.setData({address})

     //  1 总价格 总数量
     let totalPrice = 0
     let totalNum = 0
     cart.forEach(item => {
         totalPrice += item.num * item.goods_price
         totalNum += item.num
     }) 
     // 2给data赋值
     this.setData({
       cart,
       totalPrice,
       totalNum,
       address
     })
  },
 async handleOrderPay() {
   try {
      // 1 判断缓存中有没有token
    const token = wx.getStorageSync('token')
    // 2 判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
    console.log('已经存在token')
    // 3 创建订单
    // 3.1 准备 请求头参数
    // const header = {Authorization: token}
    // 3.2 准备请求体参数
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    const cart = this.data.cart
    let goods = []
    cart.forEach(item => {
      goods.push({
        goods_id: item.goods_id,
        goods_number: item.num,
        goods_price: item.goods_price
      })
    })
    const orderParams = { order_price,consignee_addr,goods }
    // 4 准备发送请求 创建订单 获取订单编号
    const {order_number} = await request({url: '/my/orders/create', method: 'post' ,data: orderParams})
    console.log(order_number)
    // 5 发起 预支付接口 （从服务器中获取微信支付参数）
    const {pay} = await(request({url: '/my/orders/req_unifiedorder',method: 'post',data: {order_number}}))
    console.log(pay)
    // 6 发起微信支付 (小程序没有权限)
    await requestPayment(pay)
    // 7   查询后台 订单状态
    const res = await request({url: '/my/orders/chkOrder',data: {order_number}}) 
    await showToast({title: '支付成功'})
    let newCart = wx.getStorageSync('cart')
    newCart = newCart.filter(item => !item.checked)
    wx.setStorageSync('cart', newCart)
    // 8 支付成功了 跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index',
    })
   } catch (err){
     await showToast({title: '支付失败'})
     console.log(err)
   }
  }
})