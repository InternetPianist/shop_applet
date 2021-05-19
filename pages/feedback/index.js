
/*
1 点击 “+” 触发tab点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到图的路径 数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
    3 自己在维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台
  5 清空当前页面
  6 返回上一页
*/ 
Page({
  data: {
    tabs: [
      {
        id: 0,
        name: '体验问题',
        isActive: true
      },
      {
        id: 1,
        name: '商品、商家投诉',
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: ""
  },
  // 外网的图片的路径数组
  UploadImgs: [],
  handleTabsItemChange(e) {
    // 1获取被点击的索引
    const {index} = e.detail
    // 2 修改源数组
    let {tabs} = this.data
    tabs.forEach((item,i) => i===index? item.isActive=true:item.isActive=false)
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击 “+” 选择图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片 api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
      

  },
  handlePreviewImage(e) {
    // 1 获取被点击的src
    const {src} = e.currentTarget.dataset
    // 2 获取data中的d图片数组
   let {chooseImgs} = this.data
    wx.previewImage({
      urls: chooseImgs,
      current: src
    })
  },
  // // 预览大图
  // handlePreviewImage(e) {
  // // 2 获取被点击的组件索引
  // const {index} = e.currentTarget.dataset 
  //  // 3 获取data中的d图片数组
  //  let {chooseImgs} = this.data
  //  wx.previewImage({
  //    urls: chooseImgs,
  //    current: chooseImgs[index]
  //  })
  // },
  // 点击 自定义图片 组件
  handleRemoveImg(e) {
    console.log(e)
    // 2 获取被点击的组件索引
    const {index} = e.currentTarget.dataset
    // 3 获取data中的d图片数组
    let {chooseImgs} = this.data
    // 4 删除元素
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮点击
  handleFormSubmit() {
    // 1 获取文本域的内容 图片数组
    const {textVal,chooseImgs} = this.data
    // 2 合法性验证
    if(!textVal.trim()) { // 取出两端空格后 字符串为空 执行
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return
    }
    // 3 准备上传图片到专门的图片服务器
    // 上传文件的api不支持 多个文件同时上传 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    });

    // 判断有没有上传的图片数组
    if(chooseImgs.length!=0) {
      chooseImgs.forEach((item,i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          filePath: item,
          // 上传文件的名称 后台来获取文件的 file
          name: 'image',
          // 图片要上传到哪里
          // url: 'https:/ /images.ac.cn/Home/Index/UploadAction',
          url: 'https://img.coolcr.cn/api/upload',
          header: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
          },
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result)
            let url = JSON.parse(result.data)
            this.UploadImgs.push(url)
            console.log(this.UploadImgs)
            // 所有图片上传完毕才触发
            if(i===chooseImgs.length-1) {
              wx.hideLoading();
              // console.log("把文本内容和外网的图片数组，提交到后台中")
              // 提交都成功了
              // 重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              })
                // 返回上一个页面
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      })
    }else {
      wx.hideLoading()
      console.log('只提交了文本')
      wx.navigateBack({
        delta: 1
      })
    }
  }
})