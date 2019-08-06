
import {getStorageUserInfo} from '../../utils/storage'
Page({
  data: {
    // 用户信息
    userInfo: {},
    // 收藏商品数量
    collectNum: 0
  },
  onShow() {
    // 获取本地存储中的用户信息
    const userInfo = getStorageUserInfo('userInfo');
    // 如果没有用户信息则跳转到登录授权页面
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index'
      });
      return;
    }
    // 获取本地存储中的收藏收藏商品
    const collectNum = wx.getStorageSync('collect').length;
    this.setData({
      userInfo,
      collectNum
    })
  }
})