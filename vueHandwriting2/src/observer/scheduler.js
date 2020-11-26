import { nextTick } from "../utils";

let has = {}
let queue = []
let pending = false

function flushSchedulerQueue () {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i]
    watcher.run()
  }
  has = {}
  queue = []
  pending = false
}

export function queueWatcher (watcher) {
  let id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      pending = true
      nextTick(flushSchedulerQueue)
    }
  }
}
