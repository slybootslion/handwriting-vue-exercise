import { hasChange, hasOwn, isArray, isObject } from "../shared"
import { activeEffect, effectStack, track, trigger } from "./effect"
import { reactive } from "./reacive"

const mutableHandlers = {
  // 取值时将effect存储 recevier是代理后的对象
  get(target, key, recevier) {
    const res = Reflect.get(target, key, recevier)

    // 如果是内置Symbol，排除依赖收集
    if (typeof key === 'symbol') return res

    track(target, key)

    // if (res.__v_isRef) return res.value

    // 取值时，是对象再代理
    return isObject(res) ? reactive(res) : res
  },
  // 更新值的时候将effect更新
  set(target, key, value, recevier) {
    const oldVal = target[key]

    // 是否是原有的属性（数组根据索引长度判断）
    const hadKey = isArray(target) && (parseInt(key, 10) + '' === key) ?
      Number(key) < target.length :
      hasOwn(target, key)

    const result = Reflect.set(target, key, value, recevier)

    if (!hadKey) {
      // 没有该属性，触发新增操作
      trigger(target, 'add', key, value)
    } else if (hasChange(oldVal, value)) {
      //  值改变，修改属性
      trigger(target, 'set', key, value)
    } else {


    }

    effectStack.forEach(effect => effect())
    return result
  }
}

export {
  mutableHandlers
}
