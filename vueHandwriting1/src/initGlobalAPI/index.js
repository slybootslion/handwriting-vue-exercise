import initMixin from "./mixin"
import initAssetRegisters from './assets';
import { ASSETS_TYPE } from './const';
import initExtend from './extend';

export function initGlobalAPI(Vue) {
  // 整合了全局相关的内容
  Vue.options = {}
  initMixin(Vue)

  // 初始化全局过滤器，指令，组件
  ASSETS_TYPE.forEach(type => {
    Vue.options[`${type}s`] = {}
  })


  // _base是Vue的构造函数
  Vue.options._base = Vue

  // 注册extend方法
  initExtend(Vue)
  initAssetRegisters(Vue)

}
