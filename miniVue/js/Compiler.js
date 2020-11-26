class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compile(this.el)
  }

  // 编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      if (node.childNodes && childNodes.length) this.compile(node)
    })
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        const key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  update(node, key, attrName) {
    let updateFn = this[`_${attrName}Updater`]
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  // 处理 v-text 指令
  _textUpdater(node, val, key) {
    node.textContent = val
    new Watcher(this.vm, key, (newValue) => node.textContent = newValue)
  }

  // 处理 v-model 指令
  _modelUpdater(node, val, key) {
    node.value = val
    new Watcher(this.vm, key, (newValue) => node.value = newValue)

    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 编译文本节点，处理插值表达式
  compileText(node) {
    const reg = /\{\{(.+?)\}\}/
    const val = node.textContent
    if (reg.test(val)) {
      const key = RegExp.$1.trim()
      node.textContent = val.replace(val, this.vm[key])

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => node.textContent = newValue)
    }
  }

  // 判断属性是Vue指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }

  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
