import { initState } from "./state";
import { compileToFunction } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions, nextTick } from "./utils";

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    // 初始化状态
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')

    // 数据可以挂载到页面上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$nextTick = nextTick

  Vue.prototype.$mount = function (el) {
    el = typeof el === 'string' ? document.querySelector(el) : el
    const vm = this
    const options = vm.$options
    vm.$el = el

    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunction(template)
      options.render = render
    }

    mountComponent(vm)
  }
}

