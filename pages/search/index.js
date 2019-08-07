import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 搜索列表
    serverList: [],
    // 输入框的值
    inputValue: '',
    // 先设置按钮不显示
    isFocus: false
  },
  // 定义一个定时器id
  TimeId: -1,
  // 搜索框搜索商品
  handleServerInput(e) {
    const {value} = e.detail;
    // 判断输入框中是否有值
    if (!value.trim()) {
      this.setData({
        serverList: [],
        inputValue: '',
        isFocus: false
      })
      return;
    }
    // 将按钮显示
    this.setData({
      isFocus: true
    })
    // 先清除定时器
    clearTimeout(this.TimeId);
    // 设置定时器
    this.TimeId = setTimeout(() => {
      // 根据搜索的内容请求数据
      request({url: '/goods/qsearch',data: {query: value}})
      .then(res => {
        // console.log(res) 
        this.setData({
          serverList: res
        })
      })
    },1000)
  },
  // 点击取消
  handleCancel() {
    // 清空输入框的值
    this.setData({
      serverList: [],
      inputValue: '',
      isFocus: true
    })
  }
})