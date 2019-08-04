// 引入封装好的获取收货地址的js文件
import { getSetting,openSetting,chooseAddress,showModel,showToast } from '../../utils/asyncWX';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    // 定义一个空对象存储地址信息
    address: {},
    // 定义购物车列表数据
    cart: {},
    // 定义一个总价
    totalPrice: 0,
    // 定义商品总量
    totalNum: 0
  },
  // 页面显示的时候触发
  onShow(){
    // 从本地存储中获取详细地址信息
    const address = wx.getStorageSync("address") || {};
    // 从本地存储中获取所有商品信息
    const cart = wx.getStorageSync("cart") || {};
    // 把商品信息对象转换成数组
    let cartArr = Object.values(cart);
    // 计算总价格
    let totalPrice = 0;
    // 计算总数量
    let totalNum = 0;
    // 遍历商品数组
    cartArr.forEach(v => {
      if (v.checked) {
        // 设置总价格
        totalPrice += v.num * v.goods_price;
        // 设置总数量
        totalNum += v.num;
      }
      else {
        // 如果没有商品
        // 全选按钮不要选中
        ischeckAll = false;
      }
    });
    // 把数据重新设置回data中
    this.setData({ address,cart,totalPrice,totalNum });
  }
})