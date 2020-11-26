import { isArray } from "../shared/index"

// 依赖收集
const effect = (fn: Function, options: any = {}) => {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}

const effectStack: Function[] = []
let activeEffect: null | Function = null
function createReactiveEffect(fn: Function, options) {
  // reactiveEffect只是提示看源码的人的（没有实际用处）
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.options = options
  return effect
}

const targetMap = new WeakMap()
function track(target, key) {
  if (activeEffect == null) return

  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))

  if (!dep.has(activeEffect)) dep.add(activeEffect)
}

function run(effects) {
  if (effects) effects.forEach(effect => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
      return
    }
    effect()
  })
}

function trigger(target, type, key, value?) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      // 如果改变数组长度，触发更新，如果更改的数组长度小于取值长度，触发更新
      if (key === 'length' || key >= value) {
        run(dep)
      }
    })
    return
  }

  if (key != null) {
    const effects = depsMap.get(key)
    run(effects)
  }

  switch (type) {
    case 'add':
      if (isArray(target)) {
        if (parseInt(key) === key) {
          run(depsMap.get('length'))
        }
      }
      break
    case 'set':
      break
    default:
      break
  }
}

export {
  effect,
  effectStack,
  activeEffect,
  track,
  trigger
}
