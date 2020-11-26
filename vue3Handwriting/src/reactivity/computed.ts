import { isFunction } from '../shared/index'
import { effect, track, trigger } from './effect';

class ComputedRefImpl {
  public effect
  public __v_isReadonly = true
  public __V_isRef = true
  public _dirty = true
  public _value

  constructor(getter, public setter) {
    // 默认getter执行的时候，依赖一个内置的effect
    this.effect = effect(getter, {
      lazy: true,
      scheduler: (effect) => {
        this._dirty = true // 依赖数据变化，需要重新缓存
        trigger(this, 'set', 'value')
      }
    })
  }

  // 类属性描述器
  get value() {
    if (this._dirty) { // 缓存
      this._value = this.effect()
      track(this, 'value')
      this._dirty = false
    }
    return this._value
  }

  set value(nVal) {
    this.setter(nVal)
  }
}

function computed(getterOrOptions) {
  let getter;
  let setter;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => { console.log('computed not set value') }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}

export {
  computed
}
