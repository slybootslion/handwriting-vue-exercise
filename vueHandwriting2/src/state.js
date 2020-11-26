import { observe } from "./observer/index";

export function initState (vm) {
  const opts = vm.$options
  // 数据初始化
  if (opts.data) {
    initData(vm)
  }
}

function proxy (vm, source, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[source][key]
    },
    set (newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData (vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 通过vm._data获取劫持后的数据
  for (const key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}
