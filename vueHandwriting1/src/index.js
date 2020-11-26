import { initMixin } from './init';
import { lifecycleMixin } from './lifycycle';
import { renderMixin } from './render';
import { initGlobalAPI } from './initGlobalAPI/index';

function Vue(options) {
  // 初始化配置
  this._init(options)
}

initMixin(Vue) // 初始化方法
renderMixin(Vue) // 渲染方法，调用render方法
lifecycleMixin(Vue) // 添加update方法，虚拟dom渲染成真实dom


// 初始化全局api
initGlobalAPI(Vue)

export default Vue
