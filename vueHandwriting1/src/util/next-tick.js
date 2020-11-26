const callback = []

let waiting = false

function flushCallback() {
  callback.forEach(cb => cb())
  // 刷新后更新waiting
  waiting = false
}

export function nextTick(cb) {
  // 多次调用，没有刷新，先放在数组中
  callback.push(cb)
  if (!waiting) {
    setTimeout(flushCallback)
    waiting = true
  }
}
