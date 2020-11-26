import History from "./base"

function ensureSlash () {
  if (window.location.hash) return
  window.location.hash = '/'
}

function getHash () {
  return window.location.hash.slice(1)
}

class HashHistory extends History {
  constructor (router) {
    super(router)
    ensureSlash()
  }

  // 添加监听
  setupListener () {
    window.addEventListener('hashchange', () => {
      this.transitionTo(getHash())
    })
  }

  // 获取当前路径
  getCurrentLocation () {
    return getHash()
  }

  push (location) {
    window.location.hash = location
  }
}

export default HashHistory
