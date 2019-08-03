// 引入封装好的获取收货地址的js文件
import { getSetting,openSetting,chooseAddress } from '../../utils/asyncWX';
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
    totalNum: 0,
    // 定义全选
    ischeckAll: false
  },
  // 页面显示的时候触发
  onShow(){
    // 从本地存储中获取详细地址信息
    const address = wx.getStorageSync("address") || {};
    // 从本地存储中获取所有商品信息
    const cart = wx.getStorageSync("cart") || {};
    // 把数据重新设置回data中
    this.setData({ address,cart });
    // 调用商品信息函数
    this.setCart(cart)
  },
  // 点击添加收货地址
  async handleChooseAddress() {
    // 先获取用户对应用的授权信息
    const res1 = await getSetting();
    // 获取用户授权状态
    const scopeAddress = res1.authSetting['scope.address'];
    // 判断用户授权状态
    if (scopeAddress === true || scopeAddress === undefined) {
      
    }
    else {
      // 如果用户点击了取消
      // 先打开授权页面
      await openSetting();
    }
    // 打开地址信息
    const res2 = await chooseAddress();
    // 给地址信息增加一条完整的地址信息
    res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo;
    // 把地址信息存储到本地存储中
    wx.setStorageSync('address', res2);
  },
  // 设置商品信息
  setCart(cart) {
    // 把商品信息对象转换成数组
    let cartArr = Object.values(cart);
    // 1、计算全选
    // every接收一个回调函数，这个回调函数都返回true的时候every的返回值才是true，否则是false
    // let ischeckAll = cartArr.every(v => v.checked);

    // 一开始全选按钮为被选中
    let ischeckAll = true;
    // 计算总价格
    let totalPrice = 0;
    // 计算总数量
    let totalNum = 0;
    // 遍历商品数组
    cartArr.forEach(v => {
      if (v.checked) {
        // 设置总价格
        totalPrice = v.num * v.goods_price;
        // 设置总数量
        totalNum += v.num;
      }
      else {
        // 如果没有商品
        // 全选按钮不要选中
        ischeckAll = false;
      }
    });
    this.setData({ ischeckAll,totalPrice,totalNum })
  }
})