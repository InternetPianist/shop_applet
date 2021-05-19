/*
1 获取用户收获地址
  1 绑定点击事件
  2 调用小程序内置 api 获取用户收获地址

  // 2 获取 用户 对小程序 所授予 获取地址的 权限 状态 scope
  // 1 假设 用户 点击获取收货地址的提示 确定 authSetting scope.address
        scope 值 true 直接调用 获取收获地址
      2 假设 用户 从来没有调用过 收货地址api
        scope undefined 直接调用 获取收货地址
      3 假设 用户 点击获取收货地址的提示框 取消
        scope 值 false
        1 诱导用户 自己打开 授权设置页面(wx.openSetting) 当用户重新给 与 获取收货地址的时候
        2 获取收货地址
      4 把获取到的收获地址 存入到 本地存储中
  2 页面加载完毕
    0 onLoad onShow
    1 获取本地存储中的数据
    2 把数据 设置给data中的一个变量
  3 onShow
    0 回到商品详情页面 第一次添加商品的时候 手动添加属性
      1 num=1
      2 checked=true
    1 获取缓存中的购物车数组
    2 把购物车数据 填充到data中
  4 全选的实现 数据的展示
    1 onShow 获取缓存中的购物车数组
    2 根据购物车中的商品数据 所有的商品都被选择中 checked=true 全选就被选中
  5 总价格和数量
    1 都需要商品被选中 我们才拿它来计算
    2 获取购物车数组
    3 遍历
    4 判断商品是否被选中
    5 总价格 += 商品单价 * 商品的数量
    6 把计算后的价格和数量 设置会data即可
  6 商品选中 
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态取反
    4 重新填充回data中和缓存中
    5 重新计算全选 总价格 总数量
  7 全选和反选
    1 全选复选框绑定事件 change
    2 获取data中的全选变量 allChecked
    3 直接取反 allChacked=!allChecked
    4 遍历购物车数组 让里面的 商品 选中状态跟随 allChecked 改变而改变
    5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
  8 商品数量的编辑
    1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
      1 "+" "+1"
      2 "-" "-1"
      3 获取data中的购物车数组 来获取需要被修改的商品对象
        4 当购物车的数量 =1 同时用户点击 "-"
          弹出询问 用户 是否要删除
          1 确定 执行删除
          2 取消 什么都不做
      4 直接修改购物车对象的数量 num
      5 把 cart数组 重新设置回 缓存中 和data 中 this.setCart
  9 点击结算 
    1 判断有没有收货地址信息
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付页面！
*/ 
import { getSetting,chooseAddress,openSetting,showModal, showToast } from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart')||[]
    // 1 计算全选
    // 和some 一真即真
    // every 一假即假 数组方法 遍历 接收一个回调函数 每一个回调函数都返回true 那么 every方法的返回值为true
    // 只要 有一个回调函数返回了false 那么就不在执行循环，直接返回false
    // 空数组 调用every，返回值就是true
    // const allChecked = cart.every(item => item.checked)&&cart.length>0
    // const allChecked = cart.length?cart.every(item => item.checked):false
    this.setData({address})
    this.setCart(cart)
  },
  // 点击 收获地址
  async handleChooseAddress() {
    try {
        // 1 获取权限状态
      const res1 = await getSetting()
      // 2 判断权限状态
      const scopeAddress = res1.authSetting["scope.address"]
      if (scopeAddress === false) {
        await openSetting()
      }
      // 4 调用获取收获地址的 api
      let address = await chooseAddress()
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
      // 5 存入到缓存中
      wx.setStorageSync('address', address)
    }catch(err) {
      console.log(err)
    }
 

    //  版本1 没有封装
    // 1 获取 权限状态
    // wx.getSetting({
    //   success: (result) =>{
    //     console.log(result)
    //     // 2 获取权限状态 只要发现一些 属性名很怪异的时候 都要使用 []形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"]
    //     console.log(scopeAddress)
    //     if(scopeAddress===true || scopeAddress===undefined){
    //       console.log('直接打开')
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         },
    //       })
    //     }else{
    //       // 3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //         wx.openSetting({
    //           // 4 可以调用 收货地址代码 
    //           success: (result2) => {
    //             console.log('拒绝过在打开')
    //             wx.chooseAddress({
    //               success: (result3) => {
    //                 console.log(result3)
    //               },
    //             })
    //           }
    //         })
    //     }
    //   }
    // })

      
  },
  // 商品的选中
  handleItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    // 2 获取购物车数组
    let {cart} = this.data
    // 3 找到被修改的商品对象
    let index = cart.findIndex(item => item.goods_id===goods_id)
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked
    
    this.setCart(cart)
   },
  //  商品全选功能
   handleItemAllChecked() {
    //  1 获取data中的数据
     let {cart,allChecked} = this.data
    //  2 修改值
    allChecked = !allChecked
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(item => item.checked=allChecked)
    // 4 把修改后的值 填充回data中或者缓存中
    this.setCart(cart)
   },
  //  商品数量的编辑功能
   async handleItemNumEdit(e) {
     console.log(e)
    //  1 获取传递过来的参数
     const {id,operation} = e.currentTarget.dataset
    //  2 获取购物车数组
     let {cart} = this.data
    //  3 找到需要修改的商品
     const index = cart.findIndex(item => item.goods_id===id)
    //  4 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      const res = await showModal({content: "您是否要删除?"})
      if(res.confirm){
        cart.splice(index,1)
        this.setCart(cart)
      }
    }else {
        //  4 进行数量修改
    cart[index].num+=operation
    //  设置回缓存 和  data 中
     this.setCart(cart)
    }
  
   },
  //  点击结算
   async handlePay() {
     const {address,totalNum} = this.data
    //  1 判断收货地址
     if(!address.userName) {
       await showToast({title: '您还没有选择收货地址'}) 
       return
     }
    //  2 判断用户有没有选购商品
     if(totalNum===0){
       await showToast({title: '您还没有选购商品'})
       return
     }
    //  3 跳转到 支付页面
     wx.navigateTo({
       url: '/pages/pay/index', 
     })
    },
  //  设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allChecked = true
    //  1 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      if(item.checked){
        totalPrice += item.num * item.goods_price
        totalNum += item.num
      }else {
        allChecked = false
      }
    }) 
    // 判断数组是否为空
    allChecked = cart.length!=0?allChecked:false
    // 2给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 5 6 把数据重新设置回缓存中
    wx.setStorageSync('cart', cart)
  }
})