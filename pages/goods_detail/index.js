// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 商品详情数组
    goodsDetail: []
  },
  // 定义一个全局的商品对象
  GoodObj: {},
  onLoad: function (options) {
    // console.log(options)
    this.getGoodsDetail(options.goods_id)
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({url: '/goods/detail',data: {goods_id}})
    // console.log(res)
    // 设置全局商品对象信息
    this.GoodObj = res
    this.setData({
      goodsDetail: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        goods_introduce: res.goods_introduce,
        pics: res.pics
      }
    })
  },
  // 实现点击图片全屏预览
  handlePreviewImage(e) {
    const {index} = e.currentTarget.dataset;
    // 筛选出所有图片数组中的大图
    const urls = this.data.goodsDetail.pics.map(v => v.pics_big) 
    // 设置当前点击图片的大图
    const current = urls[index];
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 点击加入购物车
  handleCartAdd() {
    // console.log('点击了加入购物车')
    // 获取本地存储中的购物车对象
    let cart = wx.getStorageSync('cart') || {};
    // 判断当前商品是否存中
    if (cart[this.GoodObj.goods_id]) {
      // 如果数据已经存中在数量++
      cart[this.GoodObj.goods_id].num++;
    }
    else {
      // 添加当前商品到对象中
      cart[this.GoodObj.goods_id] = this.GoodObj;
      // 设置当前商品数据为1
      cart[this.GoodObj.goods_id].num = 1;
    }
    // 把数据存储到内存中
    wx.setStorageSync('cart',cart) 
    // 加入购物车成功弹出提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
  }
})