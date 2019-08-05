// 封装使用async的方式获取收货地址
  
// 封装使用promist的方式获取用户权限
export const getSetting = () => {
    return new Promise((resolve,reject) => {
        wx.getSetting({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        }); 
    })
}

// 封装使用promise的方式打开用户权限
export const openSetting = () => {
    return new Promise((resolve,reject) => {
        wx.openSetting({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        }); 
    })
}

// 封装使用promise的方式获取用户收货地址
export const chooseAddress = () => {
    return new Promise((resolve,reject) => {
        wx.chooseAddress({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    })
}

// 封装使用promist的方式弹出模态框
export const showModel = ({content}) => {
    return new Promise((reslove,reject) => {
        wx.showModal({
            title: '提示',
            content,
            success (res) {
                reslove(res)
            }
        })
    })
} 

// 封装使用promise的方式弹出消息提示框
export const showToast = ({title}) => {
    return new Promise((resolve,reject) => {
        wx.showToast({
            title,
            icon: 'none',
            success: (res) => {
                resolve(res);
              }
          })
    })
}

// 封装使用promise的方式调用接口获取登录凭证
export const login = () => {
    return new Promise((resolve,reject) => {
        wx.login({
            timeout:10000,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}