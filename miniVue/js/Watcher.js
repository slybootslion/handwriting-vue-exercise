class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 改变视图的回调
    this.cb = cb

    // 把Watcher对象记录到Dep类的静态属性target
    Dep.target = this
    // 保存旧的值 触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key]
    // 防止重复添加
    Dep.target = null
  }
  // 当数据变化的时候，更新视图
  update() {
    const newValue = this.vm[this.key]
    if (this.oldValue === newValue) return false

    this.cb(newValue)
  }
}
