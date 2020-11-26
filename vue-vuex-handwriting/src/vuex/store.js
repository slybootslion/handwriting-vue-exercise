import { applyMixin } from "@/vuex/mixin";
import ModuleCollection from "@/vuex/module-collection/module-collection";
import { forEachValue } from "@/vuex/utils";

let _Vue

function installModule (store, path, module, rootState) {

  const namespaced = store._modules.getNamespace(path)

  // 是子模块，定义在父模块之上
  if (path.length > 0) {
    const parent = path.slice(0, -1).reduce((memo, current) => memo[current], rootState)
    // parent[path[path.length - 1]] = module.state
    _Vue.set(parent, path[path.length - 1], module.state)
  }

  module.forEachMutation((mutation, key) => {
    store.mutations[namespaced + key] = store.mutations[namespaced + key] || []
    store.mutations[namespaced + key].push((payload) => mutation.call(store, module.state, payload))
  })

  module.forEachAction((action, key) => {
    store.actions[namespaced + key] = store.actions[namespaced + key] || []
    store.actions[namespaced + key].push((payload) => action.call(store, store, payload))
  })

  module.forEachGetter((getterFn, key) => {
    store.wrapGetters[namespaced + key] = () => {
      return getterFn.call(store, module.state)
    }
  })

  module.forEachChildren((childModel, key) => {
    installModule(store, path.concat(key), childModel, rootState)
  })
}

function resetStoreVM (store, state) {
  const computed = {}

  forEachValue(store.wrapGetters, (fn, key) => {
    computed[key] = fn
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })

  store._vm = new _Vue({
    data: {
      $$state: state
    },
    computed
  })
}

class Store {
  constructor (options) {

    this._modules = new ModuleCollection(options)
    this.mutations = {}
    this.actions = {}
    this.getters = {}
    this.wrapGetters = {}

    let state = options.state
    installModule(this, [], this._modules.root, state)
    resetStoreVM(this, state)
  }

  get state () {
    return this._vm._data.$$state
  }

  commit = (type, payload) => {
    if (this.mutations[type]) {
      this.mutations[type].forEach(fn => fn(payload))
    }
  }

  dispatch = (type, payload) => {
    if (this.actions[type]) {
      this.actions[type].forEach(fn => fn(payload))
    }
  }
}

const install = (Vue) => {
  _Vue = Vue
  applyMixin(Vue)
}

export {
  Store,
  install,
  _Vue
}
