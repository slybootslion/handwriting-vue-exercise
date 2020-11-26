import { isObject } from '../shared/index'

import { mutableHandlers } from './baseHandle'

const reactive = (target: object) => {
  return createReactiveObject(target, mutableHandlers)
}

// 映射表中的key必须是对象
const reactiveMap = new WeakMap()

function createReactiveObject(target, baseHandle) {
  if (!isObject(target)) return target

  // 如果已经代理过了，不需要再次代理
  const existProxy = reactiveMap.get(target)
  if (existProxy) return existProxy
  // 代理 放到映射表中 返回代理
  const proxy = new Proxy(target, baseHandle)
  reactiveMap.set(target, proxy)
  return proxy
}

export {
  reactive
}
