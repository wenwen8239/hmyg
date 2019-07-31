// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
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
    currentIndex: 0
  },
  // 定义一个变量用来存储数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取分类页面数据
    this.getCategoryList()
  },
  // 获取分类页面数据
  getCategoryList() {
    request({url: '/categories'})
      .then(res => {
        // console.log(res)
        this.Cates = res
        // 设置左边菜单数据
        const leftMenuList = this.Cates.map(v => ({cat_id: v.cat_id,cat_name: v.cat_name}))
        // 设置右边商品数据
        const rightGoodsList = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      })
  },
  // 点击左边菜单栏
  handleMenuChange(e) {
    // console.log(e)
    // 获取当前点击的菜单项的索引
    const {index} = e.currentTarget.dataset;
    const rightGoodsList = this.Cates[index].children 
    // 把当前索引设置为点击的索引
    this.setData({
      currentIndex: index,
      rightGoodsList
    })
    
  }
})