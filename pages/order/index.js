// 引入封装好的获取存储信息到本地存储的js文件
import { getStorageToken } from '../../utils/storage';
// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
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
    // 调用根据索引切换标题函数
    this.changeTitleByIndex(index);
    // 获取当前点击标题的type
    let type = index + 1;
    // 重新发送请求
    this.getOrderList(type);
  },
  // 根据索引切换标题
  changeTitleByIndex(index) {
    // 获取tabs栏数据
    const {tabs} = this.data;
    // 把当前点击的tabs的isActive属性修改为true
    tabs.forEach((e,i) => i === index ? e.isActive = true : e.isActive = false);
    // 把数据重新修改回data中
    this.setData({
      tabs
    })
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
    // 获取当前页面栈数组
    let pageList = getCurrentPages();
    // 获取当前页面的参数
    let currentPage = pageList[pageList.length - 1];
    // 获取传递过来的type属性
    const {type} = currentPage.options;
    // 调用获取所有订单数组函数
    this.getOrderList(type)
    // 定义要激活的索引
    let index = type - 1;
    // 调用根据索引切换标题函数
    this.changeTitleByIndex(index)
  },
  // 封装获取历史订单数组函数
  async getOrderList(type) {
    // 获取用户token
    let header = {
      Authorization: getStorageToken()
    }
    // 获取所有订单信息
    let {orders} = await request({url: '/my/orders/all', data: {type}, header: header})
    // console.log(orders)
    // 修改时间格式
    orders.forEach(v => {
      v.create_time_cn = (new Date(v.create_time * 1000)).toLocaleString();
    })
    // 把获取到的orders设置到data中
    this.setData({
      orderList: orders
    })
  }
})