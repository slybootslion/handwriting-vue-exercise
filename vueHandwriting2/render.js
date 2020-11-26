import { createElement, createTextVnode } from "./src/vdom/index";

export function renderMixin (Vue) {
  // 创建元素的虚拟节点
  Vue.prototype._c = function (...args) {
    return createElement(this, ...args)
  }
  // 创建文本的虚拟节点
  Vue.prototype._v = function (text) {
    return createTextVnode(this, text)
  }
  // 转化字符串
  Vue.prototype._s = function (val) {
    return val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : val
  }

  Vue.prototype._render = function () {
    const vm = this
    let render = vm.$options.render
    let vNode = render.call(vm) // 生成虚拟节点，调用时会自动将变量进行取值，将实例结果进行渲染
    return vNode
  }
}
