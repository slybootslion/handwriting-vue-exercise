import { install, _Vue } from "./install";
import createMatcher from "./create-matcher";
import BrowserHistory from "./history/history";
import HashHistory from "./history/hash";

class VueRouter {
  constructor (options) {
    // 根据用户的配置生成一个映射表，稍后跳转时，根据路径找到对应的组件渲染
    this.matcher = createMatcher(options.routes || [])
    this.beforeEachHook = []
    switch (options.mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break
      case 'history':
        this.history = new BrowserHistory(this)
        break
      default:
        break
    }
  }

  match (location) {
    return this.matcher.match(location)
  }

  // 钩子函数
  beforeEach (fn) {
    this.beforeEachHook.push(fn)
  }

  // 路由初始化
  init (app) {
    const history = this.history

    const setupHashListener = () => {
      history.setupListener()
    }

    history.transitionTo(history.getCurrentLocation(), setupHashListener)

    history.listen((route) => {
      app._route = route
    })
  }

  push (location) {
    this.history.push(location)
  }
}

VueRouter.install = install

export default VueRouter
