import History from "./base"

class BrowserHistory extends History {
  constructor (router) {
    super(router)
  }

  getCurrentLocation () {
    return window.location.pathname
  }

  setupListener () {
    window.addEventListener('popstate', () => {
      // 监听路径变化（浏览器的前进后退）进行跳转
      this.transitionTo(this.getCurrentLocation())
    })
  }

  push (location) {
    this.transitionTo(location, () => {
      window.history.pushState({}, null, location)
    })
  }

}

export default BrowserHistory
