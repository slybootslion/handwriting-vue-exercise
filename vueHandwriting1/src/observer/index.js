import { def, isObject } from "../util/index";
import { arrayMethods } from "./array";
import Dep from './dep';

class Observer {
  constructor(value) {
    this.dep = new Dep // 专门给数组用的依赖收集
    // 给监测过的数据添加__ob__属性，挂载observer实例
    // value.__ob__ = this 这样写会引起递归
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 对数组进行监控（排除索引）
      value.__proto__ = arrayMethods
      this.observerArray(value)
    } else {
      // 对对象进行观测
      this.walk(value)
    }
  }

  observerArray(data) {
    const len = data.length
    for (let i = 0; i < len; i++) {
      const item = data[i]
      observe(item)
    }
  }

  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => defineReactive(data, key, data[key]))
    /*    for (let i = 0; i < keys.length; i++) {
          let key = keys[i]
          let value = data[key]
          defineReactive(data, key, value)
        }*/
  }
}

function dependArray(value) {
  const len = value.length
  for (let i = 0; i < len; i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

function defineReactive(data, key, value) {
  let dep = new Dep
  // 递归实现深度检测
  // 可能是对象，也可能是数组，返回的是实例observer
  const childOb = observe(value)
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      // 依赖收集
      if (Dep.target) {
        dep.depend(Dep.target)
        if (childOb) {
          childOb.dep.depend() // 处理数组

          if (Array.isArray(value)) dependArray(value)
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return false
      observe(newValue) // 劫持设置的值，如果传入的是对象，递归深度检测
      value = newValue
      // 发布订阅
      dep.notify()
    }
  })
}

export function observe(data) {
  if (!isObject(data)) return false
  return new Observer(data)
}
