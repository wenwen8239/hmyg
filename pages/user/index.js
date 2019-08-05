
import {getStorageUserInfo} from '../../utils/storage'
Page({
  data: {
    userInfo: {}
  },
  onShow() {
    // 获取本地存储中的用户信息
    const userInfo = getStorageUserInfo('userInfo');
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index'
      });
      return;
    }
    this.setData({
      userInfo
    })
  }
})