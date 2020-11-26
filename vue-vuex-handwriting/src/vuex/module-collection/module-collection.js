import { forEachValue } from "@/vuex/utils";
import Module from "@/vuex/module-collection/module";

class ModuleCollection {
  constructor (options) {
    this.root = null
    this.register([], options)
  }

  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }

  register (path, rootModule) {
    let newModule = new Module(rootModule)
    if (path.length === 0) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current)
      }, this.root)
      // parent._children[path[path.length - 1]] = newModule
      parent.addChild(path[path.length - 1], newModule)
    }

    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

export default ModuleCollection
