let id = 0

class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 观察者模式
  depend() {
    Dep.target.addDep(this) // this是Dep的实例
  }

  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

const stack = []

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
