// 同时发送异步代码的次数
let ajaxTimes = 0
export const request = (params) => {
    // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header = {...params.header} // 扩展手动传入的 header值
    if(params.url.includes('/my/')) {
        // 拼接上 header 带上token
        header['Authorization'] = wx.getStorageSync('token')
    }
    ajaxTimes++
    // 显示正在加载效果
    wx.showLoading({
        title: '加载中',
        mask: true
    }) 
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject) => {
        wx.request({
            ...params,
            header,
            url: baseUrl + params.url,
            success: result => { 
                resolve(result.data.message)
            },
            fail: err => {
                reject(err)
            },
            complete: () =>{
                ajaxTimes--
                if(ajaxTimes === 0){
                    // 关闭等待的图标
                    wx.hideLoading()
                }
            }
        })
    })
}