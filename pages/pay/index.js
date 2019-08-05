// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入封装好的获取存储信息到本地存储的js文件
import { getStorageToken,getStorageCart,getStorageAddress } from '../../utils/storage';
// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 引入封装好的获取收货地址的js文件
import { requestPayment,showToast } from '../../utils/asyncWX';
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
    // const address = wx.getStorageSync("address") || {};
    const address = getStorageAddress() || {};
    // 从本地存储中获取所有商品信息
    // const cart = wx.getStorageSync("cart") || {};
    const cart = getStorageCart() || {};
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
    });
    // 把数据重新设置回data中
    this.setData({ address,cart,totalPrice,totalNum });
  },
  // 点击支付按钮
  async handleOrderPay() {
    // 获取本地存储中的token
    // const token = wx.getStorageSync('token');
    const token = getStorageToken();
    // 判断本地存储中有没有token
    if (!token) {
      // 跳转得到授权页面
      wx.navigateTo({
        url: '/pages/auth/index',
      }); 
    }
    else {
      try {
        // 设置请求头信息
        let header = {Authorization: token};
        // 订单总价格
        let order_price = this.data.totalPrice;
        // 收货地址
        let consignee_addr = this.data.address.all;
        // 订单数组
        let goods = [];
        // 把订单需要传递的数据组合成一个对象
        let orderParams = {order_price,consignee_addr,goods};
        // 获取data中的购物车数组
        const { cart } = this.data;
        // 遍历购物车数组
        for (const key in cart) {
          if (cart.hasOwnProperty(key)) {
            // 判断是否是选中的商品
            if (cart[key].checked) {
              goods.push({
                goods_id: cart[key].goods_id,
                goods_number: cart[key].goods_number,
                goods_price: cart[key].goods_price
              })
            }
          }
        }
        // 调用获取订单数据接口
        const {order_number} = await request({url: '/my/orders/create',method: 'post',data: orderParams,header: header});
        // 获取订单编号
        const {pay} = await request({url: '/my/orders/req_unifiedorder',method: 'post',data: {order_number}, header: header})
        console.log(pay)
        // 调用微信自带的支付接口，把拿到的pay数据传递进去
        const res = await requestPayment(pay);
        console.log(res);
        // 查询订单状态
        const res2 = await request({url: '/my/orders/chkOrder',method: 'post',data: {order_number}, header: header})
        console.log(res2,'res2')
        await showToast({title: '支付成功'});
        // 支付成功跳转到订单页面
        wx.navigateTo({
          url: '/pages/order/index'
        });
          
      }catch(err) {
        console.log(err)
        await showToast({title: '支付失败！'});
      }
    }
  }
})