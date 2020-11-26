import { applyMixin } from "@/vuex/mixin";

let _Vue

const forEachValue = (obj, cb) => {
  Object.keys(obj).forEach(key => cb(obj[key], key))
}

class Store {
  constructor (options) {
    let computed = {}
    this.getters = {}
    forEachValue(options.getters, (value, key) => {
      computed[key] = () => value.call(this, this.state)
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key]
      })
    })
    this._vm = new _Vue({
      data: {
        $$state: options.state
      },
      computed
    })

    this.mutations = {}
    this.actions = {}
    forEachValue(options.mutations, (fn, key) => {
      this.mutations[key] = payload => fn.call(this, this.state, payload)
    })
    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = payload => fn.call(this, this, payload)
    })

  }

  get state () {
    return this._vm._data.$$state
  }

  commit = (type, payload) => {
    this.mutations[type](payload)
  }

  dispatch = (type, payload) => {
    this.actions[type](payload)
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
