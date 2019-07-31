// 封装请求数据接口代码
export const request = (params) => {
    // 定义公共接口前缀
    const baseUrl = "https://api.zbztb.cn/api/public/v1";
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
            }
        });
          
    })
}