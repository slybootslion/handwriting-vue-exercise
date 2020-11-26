import createRouteMap from "./create-route-map";
import { createRoute } from "./history/base";

export default function createMatcher (routes) {

  const { pathMap } = createRouteMap(routes)


  // 动态添加映射关系，动态路由方法
  function addRoutes (routes) {
    createRouteMap(routes, pathMap)
  }

  function match (path) {
    let record = pathMap[path]
    if (record) {
      return createRoute(record, { path })
    }
  }

  return { addRoutes, match }
}
