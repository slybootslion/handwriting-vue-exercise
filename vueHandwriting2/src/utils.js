let cbs = []
let waiting = false

function flushCallbacks () {
  for (let i = 0; i < cbs.length; i++) {
    const cb = cbs[i]
    cb()
  }
  waiting = false
  cbs = []
}


export function nextTick (cb) {
  cbs.push(cb)
  if (!waiting) {
    waiting = true
    Promise.resolve().then(flushCallbacks)
  }
}

export function isObject (obj) {
  return typeof obj === 'object' && obj != null
}

const LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted']

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

const strats = {}

LIFECYCLE_HOOKS.forEach(hook => strats[hook] = mergeHook)

strats.components = function (parentVal, childVal) {
  const res = Object.create(parentVal)
  if (childVal) {
    Object.keys(childVal).forEach(key => res[key] = childVal[key])
  }
  return res
}

export function mergeOptions (parent, child) {
  const options = {}

  // 第一种情况
  // {a: 1} {a: 2} -> {a:2}
  // 第二种
  // undefined {a: 2} -> {a: 2}
  // 第三种
  // {a: 1} undefined -> {a: 1}
  function mergeField (key) {
    // 策略模式 用来判断生命周期，data，components等
    if (strats[key]) return options[key] = strats[key](parent[key], child[key])

    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = { ...parent[key], ...child[key] }
    } else {
      if (child[key]) {
        options[key] = child[key]
      } else {
        options[key] = parent[key]
      }
    }
  }


  Object.keys(parent).forEach(key => mergeField(key))

  Object.keys(child).forEach(key => {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  })

  return options
}

function makeUp (tagStr) {
  const map = {}
  tagStr.split(',').forEach(tag => map[tag] = true)
  return (tag) => !!map[tag]
}

export const isReservedTag = makeUp('a,p,div,ul,li,span,input,button,b')
