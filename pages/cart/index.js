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
    this.setData({
      address: wx.getStorageSync("address") || {},
      cart: wx.getStorageSync("cart") || {}
    });
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
  }
})