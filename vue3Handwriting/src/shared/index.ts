const isObject = (obj: unknown): boolean => typeof obj === 'object' && obj != null

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key): boolean => hasOwnProperty.call(target, key)

const isArray = (obj): boolean => Array.isArray(obj)

const isFunction = (fn): boolean => typeof fn === 'function'

const hasChange = (oldVal, newVal): boolean => oldVal !== newVal

// test commit

export {
  isObject,
  hasOwn,
  isArray,
  isFunction,
  hasChange
}
