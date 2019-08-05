// 引入封装好的获取存储信息到本地存储的js文件
import { getStorageToken } from '../../utils/storage';
// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
Page({
  data: {
    tabs: [
      {id: 0, title: '全部', isActive: true},
      {id: 1, title: '待付款', isActive: false},
      {id: 2, title: '待发货', isActive: false},
      {id: 3, title: '退款/退货', isActive: false},
    ],
    // 定义一个订单列表数组
    orderList: []
  },
  // 点击tab栏切换
  handleTabsChange(e) {
    // console.log(e)
    // 获取子组件传递的id值
    const {index} = e.detail;
    // 获取tabs栏数据
    const {tabs} = this.data;
    // 把当前点击的tabs的isActive属性修改为true
    tabs.forEach((e,i) => i === index ? e.isActive = true : e.isActive = false);
    // 把数据重新修改会data中
    this.setData({
      tabs
    })
  },
  onLoad: function (options) {

  },
  onShow() {
    // 从本地存储中获取token 
    const token = getStorageToken();
    // 判断有没有token
    if (!token) {
      // 没有token的话跳转回授权页面
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    let pageList = getCurrentPages();
    console.log(pageList)
    let currentPage = pageList[pageList.length - 1];
    // 获取传递过来的type属性
    const {type} = currentPage.options;
    console.log(type)
  },
  // 获取历史订单数组
  getOrderList() {

  }
})