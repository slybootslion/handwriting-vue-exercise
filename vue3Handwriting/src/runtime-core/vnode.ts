import { isArray, isObject, isString, ShapeFlags } from '../shared'

function createVNode(type, props = {} as any, children = null) {
  // 判断type是元素还是组件
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  const vnode = {
    type,
    props,
    children,
    component: null, // 用于保存组件对应的实例
    el: null,
    key: props.key,
    shapeFlag,
  }

  if (isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }else {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  return vnode
}

export { createVNode }
