import { popTarget, pushTarget } from './dep';
import { queueWatcher } from './schedular';

let id = 0

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.id = id++
    this.getter = exprOrFn
    this.depsId = new Set()
    this.deps = []
    this.get()
  }

  // 防止放如重复的dep dep也不能放重复的watcher
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this) // this是Wathcher实例
    }
  }

  get() {
    pushTarget(this) // 收集watcher
    this.getter() // 渲染watcher
    popTarget() // 移除watcher
  }

  update() {
    // 更新队列（性能提升）
    queueWatcher(this)
    // this.get()
  }

  run() {
    this.get()
  }
}


export default Watcher
