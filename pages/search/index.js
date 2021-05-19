/*
1 输入框绑定 值改变时间 input 事件
  1 获取到输入框的值
  2 合法性判断
  3 验证通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖： 
  0 防抖 一般输入框中 防止重复输入 重复发送请求
    效果：如果短时间内大量触发同一事件，只会执行一次函数。
  1 节流：一般用户 短信验证倒计时 防止重复输入 重复发送请求
    效果：如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。
  1 定义全局的定时器 id
*/
import {request} from "../../request/index"
Page({
  data: {
    goods: [],
    // 取消 按钮 是否显示
    isFouce: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,
  // 输入框的值改变 就会触发事件
  handleInput(e) {
    // 1 获取输入框的值
    const {value} = e.detail
    // 2 检验合法性
    // console.log(!value.trim()) // 去除前后两端的空白字符后 文本为空 返回false
    if(!value.trim()){ // 没有文字为false 取反后 为true
      this.setData({
        isFouce: false,
        goods: []
      })
      return 
    }
    // 去除前后两端的空白字符后 有字符存在 执行
    this.setData({
      isFouce: true
    })
    // 3 准备发送请求获取数据
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    },1000)
  },
  // 发送请求获取搜索建议 数据
 async qsearch(query){
   const res = await request({url: "/goods/qsearch",data: {query}})
   console.log(res)
   this.setData({
     goods: res
   })
  },
  // 点击取消按钮
  handleCancel() {
    console.log(this.data.inpValue) // 没有设置他的值在data中 但是input绑定了它的值
    this.setData({
      inpValue: "",
      isFouce: "false",
      goods: []
    })
  }
})
