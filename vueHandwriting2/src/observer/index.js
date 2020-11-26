import { arrayMethods } from "./array";
import { Dep } from "./dep";

class Observer {
  constructor (value) {
    this.dep = new Dep()
    // value.__ob__ = this 不能这么写
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举
      configurable: false // 不可删除
    })

    if (Array.isArray(value)) {
      // value.__proto__ = arrayMethods
      Object.setPrototypeOf(value, arrayMethods)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  observeArray (value) {
    for (let i = 0; i < value.length; i++) {
      // 遍历数组，如果数组中有对象，将对象变为响应式
      observe(value[i])
    }
  }

  walk (data) {
    // 将对象中的数据全部重新定义成响应式数据
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function dependArray (arr) {
  for (let i = 0; i < arr.length; i++) {
    let current = arr[i]
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

export function defineReactive (data, key, value) {
  // value值也可能是一个对象，对数据进行递归拦截
  const childOb = observe(value)
  const dep = new Dep() // 给属性添加dep
  Object.defineProperty(data, key, {
    get () {
      if (Dep.target) {
        // 让 属性 自己的dep记住当前的watcher，也让watcher记住这个dep 依赖收集
        dep.depend()

        if (childOb) { // 如果对数组取值 会将watcher和数组进行关联
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set (newValue) {
      if (value === newValue) return false
      // 如果设置的值是对象，继续将新设置的值变成响应式
      observe(newValue)
      value = newValue
      // 发布订阅
      dep.notify()
    }
  })
}

export function observe (data) {
  if (typeof data !== 'object' || data == null) return false
  if (data.__ob__) return false
  return new Observer(data)
}
