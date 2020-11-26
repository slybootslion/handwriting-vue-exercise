export default {
  functional: true,
  name: 'router-view',
  render (h, { data, parent }) {
    const route = parent.$route
    let depth = 0
    const records = route.matched
    data.routerView = true // 下面循环里判断时用到，router-view渲染时的标记

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$route
    }

    const record = records[depth]
    if (!record) return h()

    return h(record.component, data)
  }
}
