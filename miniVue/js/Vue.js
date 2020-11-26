class Vue {
  constructor(options) {
    // 处理配置项 找到挂载的Dom元素
    this.$options = options
    this.$data = options.data
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    // 把data中的成员转换成getter和setter，注入到Vue实例中
    this._proxyData(this.$data)

    // 调用observer对象，监听数据的变化
    new Observer(this.$data)

    // 调用compiler对象，解析页面中的指令和插值表达式
    new Compiler(this)
  }

  // 私有方法，遍历data中的属性，并注入到Vue实例中
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      // this是Vue的实例
      Object.defineProperty(this, key, {
        enumerable: true, // 添加可枚举
        configurable: true, // 添加可修改可删除
        get() {
          return data[key]
        },
        set(newVal) {
          if (newVal === data[key]) return false
          data[key] = newVal
        }
      })
    })
  }
}
