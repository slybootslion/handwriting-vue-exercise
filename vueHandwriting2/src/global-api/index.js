import Vue from "../index";
import { mergeOptions } from "../utils";

export function initGlobalAPI (Vue) {
  Vue.options = {}
  // 静态方法mixin
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this // 链式调用
  }

  // 组件方法
  Vue.options._base = Vue // Vue的构造函数
  Vue.options.components = {} // 存放组件的定义
  Vue.component = function (id, definition) {
    definition.name = definition.name || id
    definition = this.options._base.extend(definition)
    this.options.components[id] = definition
  }
  let cid = 0
  Vue.extend = function (options) {
    const Super = this
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.cid = cid++
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.component = Super.component
    Sub.options = mergeOptions(Super.options, options)
    // 传入对象，返回一个构造函数
    return Sub
  }
}
