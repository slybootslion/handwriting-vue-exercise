import RouterLink from './components/router-link'
import RouterView from './components/router-view'

export let _Vue = undefined

export function install (Vue, options) {
  _Vue = Vue

  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        // 根实例（app）挂载到_routerRoot上
        this._routerRoot = this
        // 实例化的路由挂载到_router
        this._router = this.$options.router
        this._router.init(this)
        // router变成响应式数据
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot
        // this._routerRoot._router
      }
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () {
      return this._routerRoot._route // 属性 current
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () {
      return this._routerRoot._router // 方法 addRoute match
    }
  })

  Vue.component('router-link', RouterLink)
  Vue.component('router-view', RouterView)
}
