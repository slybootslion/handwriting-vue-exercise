import Watcher from './observer/watcher'
import { patch } from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    // 虚拟节点对应的内容 保存上一次渲染的虚拟系欸但
    const prevVnode = vm._vnode
    vm._vnode = vnode
    // 第一次不需要diff算法
    if (!prevVnode) {
      // 用虚拟节点vnode，创建真实节点
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el

  // 调用beforeMount生命周期函数
  callHook(vm, 'beforeMount')

  const updateComponent = () => {
    // _update() 创建真实dom的方法 _render() 通过解析的render方法 渲染虚拟dom
    vm._update(vm._render())
  }

  // 调用mounted生命周期函数
  callHook(vm, 'mounted')

  // 用来渲染的类
  new Watcher(vm, updateComponent, () => { }, true)
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
