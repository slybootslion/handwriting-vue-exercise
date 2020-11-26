import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0

class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    this.vm = vm
    this.cb = cb
    this.options = options
    this.id = id++
    this.getter = exprOrFn
    this.deps = [] // 存放对应的deps
    this.depsId = new Set()
    this.get()// 让updateComponent执行 render()方法
  }

  // 对属性进行取值操作
  // 属性取值时，需要记住对应的watcher
  get () {
    pushTarget(this)
    this.getter()
    popTarget()
  }

  addDep (dep) {
    const id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  run () {
    this.get()
  }

  update () {
    queueWatcher(this)
  }
}

/*let has = {}
let queue = []

function flushSchedulerQueue () {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i]
    watcher.run()
  }
  has = {}
  queue = []
}

function queueWatcher (watcher) {
  let id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    setTimeout(flushSchedulerQueue)
  }
}*/

export default Watcher
