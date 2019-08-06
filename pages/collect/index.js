// pages/collect/index.js
Page({
  data: {
    tabs: [
      {id: 0, title: '商品收藏', isActive: true},
      {id: 1, title: '品牌收藏', isActive: false},
      {id: 2, title: '店铺收藏', isActive: false},
      {id: 3, title: '浏览足迹', isActive: false},
    ],
    // 收藏商品数组
    collectList: []
  },
  onLoad: function (options) {
    // 获取本地存储中的收藏的商品数组
    const collectList = wx.getStorageSync('collect');
    // 把数据设置到data中
    this.setData({
      collectList
    })
  },
  // 点击tap栏切换
  TabsChange(e) {
    // 获取当前点击的index
    const {index} = e.detail;
    // 获取tabs
    const {tabs} = this.data;
    // 遍历循环tabs 
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    // 把数据重新设置回data
    this.setData({
      tabs
    })
  }
})