// components/Upimg/Upimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapImg(e) {
      // 1 获取被点击的src
      const {src} = e.currentTarget.dataset
      // 2 触发 父组件中的事件 自定义
      // 第一个参数是 事件名 第二个参数是一个对象，键值对
      this.triggerEvent("tapItemChange",{src})
    },
  //   handleRemoveImg(e) {
  //     // 1 获取被点击的src
  //     const {src} = e.currentTarget.dataset
  //     // 2 触发 父组件中的事件 自定义
  //  // 第一个参数是 事件名 第二个参数是一个对象，键值对
  //     this.triggerEvent("tapRemoveImg",{src})
  //   }
  }
})
