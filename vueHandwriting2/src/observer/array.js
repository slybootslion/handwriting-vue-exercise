const oldArrayProtoMethods = Array.prototype

// 继承Array的原型方法
export const arrayMethods = Object.create(Array.prototype)

let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayProtoMethods[method].call(this, ...args)
    const ob = this.__ob__
    let inserted
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
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
    return result
  }
})
