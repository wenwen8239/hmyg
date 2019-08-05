import {setStorageUserInfo} from '../../utils/storage'
Page({
  // 点击授权获取用户信息
  handleGetUserInfo(e) {
    console.log(e.detail.userInfo)
    // 把用户信息存储到本地存储中
    setStorageUserInfo(e.detail.userInfo);
    // 跳转回上一个页面
    wx.navigateBack({
      delta: 1
    });
  }
})