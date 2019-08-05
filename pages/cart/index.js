// 引入封装好的获取收货地址的js文件
import { getSetting,openSetting,chooseAddress,showModel,showToast } from '../../utils/asyncWX';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入封装好的获取存储信息到本地存储的js文件
import { setStorageAddress,getStorageAddress,getStorageCart,setStorageCart } from '../../utils/storage';
/* 购物车逻辑
  1、实现收货地址按钮
    a、调用微信小程序自带的获取用户权限 wx-getSetting，判断用户进行的操作
    b、获取用户全选有scrop返回值，通过判断scrop的返回值来进行相应的操作
    c、如果scrop为true或者undefined直接获取用户的收货地址 wx-chooseAddress
    d、如果scrop为false则先打开用户权限 wx-openSetting 再打开用户收货地址 wx-chooseAddress
       把获取到的用户数据存储到本地存储中
    e、重新返回购物车页面的时候先获取本地存储中的用户收货地址信息，在页面上判断是否有收货地址
    f、如果有则将按钮替换为收货地址文字信息，如果没有则继续显示收货地址按钮
  2、实现购物车数据列表的显示
    a、在商品详情页的时候点击加入购物车的时候已经把当前购物车数据存储到内存中，并手动添加了商品数量 num 属性和选中状态 checked 属性
    b、定义一个函数来设置购物车信息 setCart
    c、获取本地存储中的购物车信息，在data中定义一个变量用来存储购物车信息，在页面上进行数据的动态渲染
    d、在data中定义一个总价格 totalPrice 和总数量 totalNum变量
    e、计算出总价格和总数量
    f、重新数据设置回setCart函数中
    e、把数据重新存储到本地存储中替换旧的数据
  3、实现购物车商品的总价格和总数量的选中变化
    a、获取商品的选中状态
    b、遍历商品数组，判断如果为选中则商品价格++和数量++
    c、重新数据设置回setCart函数中
  4、实现购物车商品的选中状态切换
    a、给复选按钮添加点击事件，添加一个自定义属性id
    b、获取商品数据数组和复选框的id
    c、给对应的商品数组身上的checked属性取反
    d、重新把数据设置回setCart函数中
  5、实现购物车商品的全选和反选
    a、获取全选状态和购物车数据数组
    b、遍历购物车数据数组，把每条数据的选中状态设置为全选按钮的选中状态
    c、把数据重新设置回setCart函数中
  6、实现购物车商品数量的增加减少和商品的删除
    a、给 + 和 - 添加点击事件，在其身上添加自定义属性opeation，+ 为 1，- 为 -1
    b、获取购物车数据数组和opeation属性
    c、进行数量的添加减少操作 cart[id].num += opration;
    d、判断当进行的操作是减少并且数量为1的时候，进行商品的删除操作
    f、使用delete将对应的商品删除
    g、把数据重新设置回setCart函数中
*/


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
    ischeckAll: false,
    // 购物车有没有商品
    hasGoods: false
  },
  // 页面显示的时候触发
  onShow(){
    // 从本地存储中获取详细地址信息
    // const address = wx.getStorageSync("address") || {};
    const address = getStorageAddress() || {};
    // 从本地存储中获取所有商品信息
    // const cart = wx.getStorageSync("cart") || {};
    const cart = getStorageCart() || {};
    // 把数据重新设置回data中
    this.setData({ address,cart });
    // 调用商品信息函数
    this.setCart(cart)
  },
  // 点击添加收货地址
  async handleChooseAddress() {
    console.log(1)
    // 先获取用户对应用的授权信息
    const res1 = await getSetting();
    console.log(res1,'res1')
    // 获取用户授权状态
    const scopeAddress = res1.authSetting['scope.address'];
    // 判断用户授权状态
    if (scopeAddress === true || scopeAddress === undefined) {
      // 直接调用获取用户的收货地址
    } else {
      // 如果用户点击了取消
      // 先打开授权页面
      await openSetting();
    }
    // 打开地址信息
    const res2 = await chooseAddress();
    // 给地址信息增加一条完整的地址信息
    res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo;
    // 把地址信息存储到本地存储中
    // wx.setStorageSync('address', res2);
    setStorageAddress(res2);
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
    // 判断当购物车中没有数据的时候全选按钮为不选中
    ischeckAll = cartArr.length === 0 ? false: ischeckAll;
    // 判断当购物车中没有数据 
    const hasGoods = cartArr.length ? true : false;
    this.setData({ cart,ischeckAll,totalPrice,totalNum,hasGoods })
    // 把数据重新设置到本地存储中
    // wx.setStorageSync('cart', cart)
    setStorageCart(cart);
  },
  // 点击商品切换选中状态
  handleCartChange(e) {
    // console.log(e)
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
    // console.log(e)
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
  },
  // 点击结算按钮
  async handlePay() {
    // 方法一：获取地址信息数据和购物车数据
    // const {address,cart} = this.data;
    // 方法二：获取地址信息数据和商品数量
    const {address,totalNum} = this.data;
    // 把购物车对象转换为数组
    // let cartArr = Object.values(cart);
    // 判断购物车中是否有选中的商品
    // let hasChecked = cartArr.some(v => v.checked);
    // if (!hasChecked) {
    if (totalNum <= 0) {
      // 弹出消息提示框
      await showToast({title: '您没有要结算的商品'});
    }
    // 判断是否有收货地址
    else if (!address.all) {
      // 弹出消息提示框
      await showToast({title: '您没有填写收货地址'});
    }
    else {
      // 结算跳转支付页面
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    }    
  }
})