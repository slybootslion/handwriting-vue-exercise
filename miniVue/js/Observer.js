class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    // 判断data是否是对象
    if (typeof data !== 'object' || !data) return false
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, val) {
    // 收集依赖
    const dep = new Dep()
    // 如果val是对象，把val中的每一个属性转换成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set: (newVal) => {
        if (newVal === val) return false
        val = newVal
        // 如果新的值是一个对象，需要把这个新的值中的每个属性转换成响应式数据
        this.walk(newVal)
        // 发送通知
        dep.notify()
      }
    })
  }
}
