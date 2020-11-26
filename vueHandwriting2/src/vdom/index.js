import { isObject, isReservedTag } from "../utils";

function createComponent (vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    // 如果Ctor是对象，转成函数
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    // 初始化组件钩子函数
    init (vNode) {
      let child = vNode.componentOptions = new vNode.componentOptions.Ctor({})
      child.$mount()
    }
  }
  // 组件的虚拟节点与一般标签的区别：
  // 虚拟节点拥有hook和当前组件的componentOptions（存放了组件的构造函数）
  return vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor })
}

export function createElement (vm, tag, data = {}, ...children) {
  // 对标签名做过滤
  if (isReservedTag(tag)) {
    // html标签
    return vnode(vm, tag, data, data.key, children, undefined)
  } else {
    // 组件
    const Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }

}

export function createTextVnode (vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

export function isSameVNode(oldVNode, newVNode) {
  return (oldVNode.tag === newVNode.tag) && (oldVNode.key === newVNode.key)
}

function vnode (vm, tag, data, key, children, text, componentOptions) {
  return {
    vm, tag, children, data, key, text, componentOptions
  }
}
