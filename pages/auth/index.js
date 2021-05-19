import {request} from '../../request/index'
import {login} from '../../utils/asyncWx'

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try{
      // 1 获取用户信息
      const {encryptedData,iv,rawData,signature} = e.detail
      // 2 获取小程序登录成功后的data
      const {code} = await login()
      const loginParams =  {encryptedData,iv,rawData,signature,code}
      // 3 发送请求 获取用户token
      // const {token} = request({url:'/users/wxlogin',data: loginParams,method: 'post'})
      let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1,
      })
    } catch(err){
      console.log(err)
    }

  }
})