// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入封装好的获取存储本地数据js文件
import { getStorageCart,setStorageCart } from '../../utils/storage';
Page({
  data: {
    // 商品详情数组
    goodsDetail: [],
    // 是否收藏
    isCollect: false
  },
  // 定义一个全局的商品对象
  GoodObj: {},
  onLoad: function (options) {
    // console.log(options)
    this.getGoodsDetail(options.goods_id)
    
    const collect = wx.getStorageSync('collect') || [];
    
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({url: '/goods/detail',data: {goods_id}})
    // console.log(res)
    // 设置全局商品对象信息
    this.GoodObj = res
    // 获取本地存储中是否有收藏的商品
    const collect = wx.getStorageSync('collect') || []
    // 判断此商品是否收藏过
    const isCollect = collect.some(v => v.goods_id === this.GoodObj.goods_id);
    this.setData({
      goodsDetail: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // goods_introduce: res.goods_introduce,
        // 全部替换 .webp ->  .jpg
        goods_introduce: res.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: res.pics
      },
      isCollect
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
    // 获取本地存储中的购物车对象
    let cart = getStorageCart() || {};
    // 判断当前商品是否存中
    if (cart[this.GoodObj.goods_id]) {
      // 如果数据已经存中在数量++
      cart[this.GoodObj.goods_id].num++;
    }
    else {
      // 添加当前商品到对象中
      cart[this.GoodObj.goods_id] = this.GoodObj;
      // 给当前商品设置数量为1
      cart[this.GoodObj.goods_id].num = 1;
      // 给当前商品设置选中状态为true
      cart[this.GoodObj.goods_id].checked = true;
    }
    // 把数据存储到内存中
    setStorageCart(cart);
    // 加入购物车成功弹出提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击收藏图标
  handleCollect() {
    // 获取本地存储中的收藏商品数组
    const collect = wx.getStorageSync('collect') || [];
    // 判断内存中是否有当前点击收藏的商品对象
    const index = collect.findIndex(v => v.goods_id === this.GoodObj.goods_id);
    if (index === -1) {
      // 如果不存在给数组赋值
      collect.push(this.GoodObj);
      // 弹出提示框
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
      // 已收藏
      this.setData({
        isCollect: true
      })
    }
    else {
      // 如果存在执行删除
      collect.splice(index,1);
      // 弹出提示框
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
      // 取消收藏
      this.setData({
        isCollect: false
      })
    }
    // 把数组存入到缓存中
    wx.setStorageSync('collect', collect);
  },
  // 上拉触底事件
  onReachBottom(e) {
    console.log(e)
    console.log('滚动条触底了')
  }
})