// 引入封装好的获取收货地址的js文件
import { getSetting,openSetting,chooseAddress,showModel } from '../../utils/asyncWX';
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
    this.setData({ cart,ischeckAll,totalPrice,totalNum })
    // 把数据重新设置到本地存储中
    wx.setStorageSync('cart', cart)
  },
  // 点击商品切换选中状态
  handleCartChange(e) {
    console.log(e)
    // 获取当前点击的id
    const {id} = e.currentTarget.dataset;
    // 获取购物车对象
    const {cart} = this.data;
    // 把购物车对应id的数据的选中状态取反
    cart[id].checked = !cart[id].checked;
    // 把数据重新设置回data中
    
    // 重新计算全选状态
    this.setCart( cart );
  },
  // 实现全选反选
  handleCheckedAll() {
    // 获取全选按钮状态和购物车数据
    let {ischeckAll,cart} = this.data;
    // 把全选按钮的状态取反
    ischeckAll = !ischeckAll;
    // 循环购物车对象
    for (const key in cart) {
      // 判断该属性是不是对象自己
      if (cart.hasOwnProperty(key)) {
        // 将购物车列表的单选按钮状态设置为全选按钮的状态
        cart[key].checked = ischeckAll;
      }
    }
    // 把数据传入setCart函数中
    this.setCart(cart);
  },
  // 编辑商品数量
  async handleEditNumber(e) {
    console.log(e)
    // 获取当前点击元素身上的自定义属性
    const {id,opeation} = e.currentTarget.dataset;
    // 获取购物车对象
    const {cart} = this.data;
    // 判断当前操作元素的数量是否为1和当前操作是减少,进行商品删除操作 
    if (cart[id].num === 1 && opeation === -1) {
      // console.log("删除商品")
      // 弹出提示框询问是否要删除商品
      const res = await showModel({content: '您确定要删除该商品吗?'});
      if (res.confirm) {
        // console.log('用户点击确定')
        // 使用delete方式删除
        delete cart[id];
        // 把数据设置回setCart中
        this.setCart(cart);
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
    else {
      // 修改购物车商品的数量，对应id的商品进行对应的数量操作
      cart[id].num += opeation;
    }
    // 把数据重新传入seCart函数中
    this.setCart(cart);
  }
})