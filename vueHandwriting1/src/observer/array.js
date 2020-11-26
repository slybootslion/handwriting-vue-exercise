let oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

const methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice']

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayMethods[method].apply(this, args)
    let inserted
    const ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) ob.observerArray(inserted) // 继续观测新增属性
    ob.dep.notify() // 数组的发布订阅
    return result
  }
})
