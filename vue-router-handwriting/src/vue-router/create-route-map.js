function addRouteRecord (route, pathMap, parent = null) {
  const record = {
    path: route.path,
    component: route.component,
    name: route.name,
    props: route.props,
    params: route.params || {},
    meta: route.meta,
    parent
  }

  let path = ''
  if (route.path.startsWith('/')) {
    path = route.path
  } else {
    path = parent ? parent.path + '/' + route.path : route.path
  }


  if (!pathMap[path]) {
    pathMap[path] = record
  }

  if (route.children) {
    route.children.forEach((childRoute) => {
      addRouteRecord(childRoute, pathMap, record)
    })
  }
}

export default function createRouteMap (routes, oldPathMap) {
  // 1. 一个参数初始化
  // 2. 两个参数动态添加路由
  const pathMap = oldPathMap || {}

  routes.forEach(route => {
    addRouteRecord(route, pathMap)
  })

  return { pathMap }
}
