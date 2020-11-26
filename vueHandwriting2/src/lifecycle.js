import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vNode) {
    const vm = this
    // vm.$el = patch(vm.$options.el, vNode)
    // 第一次初始化替换真实元素，第二次走diff算法
    const prevVNode = vm._vnode
    vm._vnode = vNode
    if (!prevVNode) {
      vm.$el = patch(vm.$el, vNode)
    } else {
      vm.$el = patch(prevVNode, vNode)
    }
  }
}

export function mountComponent (vm) {
  let updateComponent = () => {
    const vNode = vm._render() // 返回虚拟节点
    vm._update(vNode) // 渲染成真实节点
  }

  const w = new Watcher(vm, updateComponent, () => {
  }, true) // updateComponent()
}

export function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers && handlers.length) handlers.forEach(handler => handler.call(vm))
}
