import { createVNode } from './vnode'

function h(type, props = {}, children = null) {
  return createVNode(type, props, children)
}

export { h }
