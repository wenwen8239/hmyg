// 封装请求数据接口代码
// 设置请求的条数
let times = 0;
export const request = (params) => {
    // 定义公共接口前缀
    const baseUrl = "https://api.zbztb.cn/api/public/v1";
    // 每请求一次加一次
    times++;
    console.log(times)
    // 发送请求前设置加载中文字
    wx.showLoading({
        title: '加载中',
    })
    return new Promise((resolve,resject) => {
        wx.request({
            ...params,
            // 重新定义url路径
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                resject(err)
            },
            
            complete: () => {
                times--;
                if (times === 0) {
                    wx.hideLoading()
                }
            }
        });
          
    })
}