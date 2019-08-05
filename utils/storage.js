// 封装项目中使用到的本地存储代码

// 获取本地存储中的分类商品数据
export const getStorageCates = () => {
    return wx.getStorageSync('cates');
}

// 把分类商品数据存储到本地存储中
export const setStorageCates = (obj) => {
    return wx.setStorageSync('cates',obj)
}

// 获取本地存储中的购物车数据
export const getStorageCart = () => {
    return wx.getStorageSync('cart')
}

// 把购物车数据存储到本地存储中
export const setStorageCart = (obj) => {
    return wx.setStorageSync('cart', obj)
}

// 获取缓存中的地址信息
export const getStorageAddress = () => {
    return wx.getStorageSync('address')
}

// 把地址信息存入到本地存储中
export const setStorageAddress = (address) => {
    return wx.setStorageSync('address',address)
}

// 获取缓存中的token
export const getStorageToken = () => {
    return wx.getStorageSync('token')
}

// 把token存入到本地存储中
export const setStorageToken = (token) => {
    return wx.setStorageSync('token',token)
}
