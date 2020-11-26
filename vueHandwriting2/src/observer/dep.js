export function pushTarget (watcher) {
  Dep.target = watcher
}

export function popTarget () {
  Dep.target = null
}

let id = 0

class Dep {
  constructor () {
    this.id = id++
    // 属性对应的watcher
    this.subs = []
  }

  depend () {
    // water记录dep
    Dep.target.addDep(this)
  }

  addSub (watcher) {
    this.subs.push(watcher)
  }

  notify () {
    this.subs.forEach(watcher =>watcher.update())
  }
}

Dep.target = null

export {
  Dep
}
