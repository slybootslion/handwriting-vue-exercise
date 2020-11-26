import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
import { mountComponent, callHook } from './lifycycle';
import { mergeOptions } from "./util/index";
import { nextTick } from './util/next-tick';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {

    // 数据的劫持
    const vm = this // vue实例

    // 实例上拿到用户配置
    // 将全局的与用户传入的合并
    vm.$options = mergeOptions(vm.constructor.options, options)

    // 调用beforeCreate生命周期钩子函数
    callHook(vm, 'beforeCreate')

    // 初始化状态
    initState(vm)

    // 调用created生命周期钩子函数
    callHook(vm, 'created')

    // 渲染页面
    // 如果传入了el
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = typeof el === 'string' ? document.querySelector(el) : el

    if (!options.render) {
      // 先判断没有render 没有template的情况
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      options.render = compileToFunction(template)
    }

    mountComponent(vm, el)
  }

  Vue.prototype.$nextTick = nextTick
}
