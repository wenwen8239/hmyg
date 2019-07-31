// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 分类导航数组
    castList: [],
    // 首页楼层数组
    floorList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取轮播图数据
    this.getSwiperList()
    // 获取分类导航数据
    this.getCastList()
    // 获取首页楼层数据
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    // 调用轮播图数据
    request({url: '/home/swiperdata'})
      .then(res => {
        console.log(res)
        this.setData({
          swiperList: res
        })
      })
  },
  // 获取分类导航数据
  getCastList() {
    // 调用轮播图数据
    request({url: '/home/catitems'})
      .then(res => {
        console.log(res)
        this.setData({
          castList: res
        })
      })
  },
  // 获取首页楼层数据
  getFloorList() {
    // 调用轮播图数据
    request({url: '/home/floordata'})
      .then(res => {
        console.log(res)
        this.setData({
          floorList: res
        })
      })
  }
})