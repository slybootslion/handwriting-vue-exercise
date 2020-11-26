import { forEachValue } from "@/vuex/utils";

class Module {
  constructor (rawModule) {
    this._raw = rawModule
    this._children = {}
    this.state = rawModule.state
  }

  get namespaced () {
    return this._raw.namespaced
  }

  getChild (key) {
    return this._children[key]
  }

  addChild (key, module) {
    this._children[key] = module
  }

  forEachMutation (fn) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, fn)
    }
  }

  forEachAction (fn) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, fn)
    }
  }

  forEachGetter (fn) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, fn)
    }
  }

  forEachChildren (fn) {
    forEachValue(this._children, fn)
  }
}

export default Module
