import { observe } from './observer/index'
import { proxy } from './util/index';

export function initState(vm) {
  const opts = vm.$options

  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethod(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps(vm) {

}

function initMethod(vm) {

}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  Object.keys(data).forEach(key => {
    proxy(vm, '_data', key)
  })

  // 对象劫持
  observe(data)

}

function initComputed(vm) {

}

function initWatch(vm) {

}
