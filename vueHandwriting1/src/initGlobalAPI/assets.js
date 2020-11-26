import { ASSETS_TYPE } from './const';

export default function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function (id, definition) {
      // 注册全局组件
      if (type === 'component') {
        // 使用extend方法，将对象变成构造函数
        definition = this.options._base.extend(definition)
      }

      if (type === 'filter') {

      }

      if (type === 'directive') {

      }

      // 这里的this是Vue
      this.options[`${type}s`][id] = definition

    }
  })
}
