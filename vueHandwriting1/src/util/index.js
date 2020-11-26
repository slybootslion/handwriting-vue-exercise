export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export function isReservedTag(tagName) {
  const obj = {}
  const arr = ['p', 'div', 'span', 'input', 'button']
  arr.forEach(tag => obj[tag] = true)
  return obj[tagName]
}

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value
  })
}

export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

const LIFECYCLE_HOOKS = [
  'beforeCreate', 'created', 'beforeMount',
  'mounted', 'beforeUpdate', 'updated',
  'beforeDestroy', 'deatroyed'
]

const strats = {}

function mergeHook(parentVal, childVal) {
  return childVal ? (parentVal ? parentVal.concat(childVal) : [childVal]) : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => strats[hook] = mergeHook)

function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal)
  if (childVal) {
    Object.keys(childVal).forEach(key => res[key] = childVal[key])
  }
  return res
}

strats.components = mergeAssets

export function mergeOptions(parent, child) {
  const options = {}
  for (const key in parent) {
    mergeField(key)
  }
  for (const key in child) {
    // 如果已经合并过了，就不需要再次合并了
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }

    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    } else if (child[key] == null) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }

  return options
}
