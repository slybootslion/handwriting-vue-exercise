import { isObject, isReservedTag } from './../util/index';
export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key
  if (key) delete data.key
  if (isReservedTag(tag)) {
    // 标签
    return vnode(tag, data, key, children, undefined)
  } else {
    // 组件
    let Ctor = vm.$options.components[tag]
    // console.log(Ctor)
    return createComponent(vm, tag, data, key, children, Ctor)
  }
}

export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text, componentOptions) {
  return { tag, data, key, children, text, componentOptions }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }

  data.hook = {
    init(vnode) {
      // 当前组件的实例 就是componentInstance
      let child = vnode.componentInstance = new Ctor({ _isComponent: true })
      child.$mount()
    }

  }

  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, { Ctor, children })
}
