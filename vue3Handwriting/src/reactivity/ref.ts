import { hasChange, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive } from "./reacive";

class RefImpl {
  public readonly __v_isRef = true
  public _value;
  constructor(public rawVal) {
    this._value = convert(rawVal)
  }

  get value() {
    track(this, 'value')
    return this._value
  }

  set value(nVal) {
    if (hasChange(this.rawVal, nVal)) {
      this.rawVal = nVal
      this._value = convert(nVal)
      trigger(this, 'set', 'value')
    }
  }
}

function ref(rawVal) {
  return new RefImpl(rawVal)
}

function convert(val) {
  return isObject(val) ? reactive(val) : val
}

class ObjectRefImpl {
  constructor(public object, public key) { }

  get value() {
    return this.object[this.key]
  }

  set value(nVal) {
    this.object[this.key] = nVal
  }
}

function toRefs(object) {
  const result = Array.isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    result[key] = new ObjectRefImpl(object, key)
  }
  return result
}

export {
  ref,
  toRefs
}
