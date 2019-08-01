// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单
    leftMenuList: [],
    // 右侧商品数组
    rightGoodsList: [],
    // 设置被选中的菜单
    currentIndex: 0,
    // 设置滚动位置
    scrollTop: 0
  },
  // 定义一个变量用来存储数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取本地缓存的数据
    const cates = wx.getStorageSync('cates');
    // 判断是否有缓存数据
    if (!cates) {
      // 如果没有缓存数据 发送请求 缓存数据
      // 获取分类页面数据
      this.getCategoryList()
    }
    else {
      // 如果有缓存数据
      // 判断数据是否过期
      if (Date.now() - cates.time > 1000 * 20) {
        // 数据已经过期
        // 重新发送请求获取分类页面数据
        this.getCategoryList()
      }
      else {
        // 数据没有过期
        // 给全局的Cates参数赋值
        this.Cates = cates.data
        // 设置左边菜单数据
        const leftMenuList = this.Cates.map(v => ({cat_id: v.cat_id,cat_name: v.cat_name}))
        // 设置右边商品数据
        const rightGoodsList = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      }
    } 
  },
  // 获取分类页面数据
  async getCategoryList() {
    const res =  await request({url: '/categories'})
    // 关闭下拉刷新
    wx.stopPullDownRefresh()
    // 给全局的Cates参数赋值
    this.Cates = res
    // 把数据存储到本地中
    wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});
    // 设置左边菜单数据
    const leftMenuList = this.Cates.map(v => ({cat_id: v.cat_id,cat_name: v.cat_name}))
    // 设置右边商品数据
    const rightGoodsList = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightGoodsList
    })
  },
  // 点击左边菜单栏
  handleMenuChange(e) {
    // 获取当前点击的菜单项的索引
    const {index} = e.currentTarget.dataset;
    // 根据当前点击的索引修改右边菜单显示的索引对象
    const rightGoodsList = this.Cates[index].children 
    // 把当前索引设置为点击的索引
    this.setData({
      currentIndex: index,
      rightGoodsList,
      // 切换左边菜单的时候重新设置滚动位置
      scrollTop: 0
    })
    
  }
})