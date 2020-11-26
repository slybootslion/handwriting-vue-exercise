export function createRoute (record, location) {
  const res = []
  if (record) {
    while (record) {
      res.unshift(record)
      record = record.parent
    }
  }
  return {
    ...location,
    matched: res
  }
}

function runQueue (queue, iterator, cb) {
  function next (idx) {
    if (idx >= queue.length) {
      return cb()
    } else {
      const hook = queue[idx]
      iterator(hook, () => {
        next(idx + 1)
      })
    }
  }

  next(0)
}

class History {
  constructor (router) {
    this.router = router
    // 初始化对应的路由数据
    this.current = createRoute(null, {
      path: '/'
    })
  }

  transitionTo (location, onComplete) {
    // 根据跳转的路径，获取匹配的记录
    const route = this.router.match(location)
    // 合并路由
    const queue = [].concat(this.router.beforeEachHook)

    const iterator = (hook, cb) => {
      hook(route, this.current, cb)
    }

    runQueue(queue, iterator, () => {
      this.current = route
      this.cb && this.cb(route)
      onComplete && onComplete()
    })
  }

  listen (cb) {
    this.cb = cb
  }

  push () {

  }
}

export default History
