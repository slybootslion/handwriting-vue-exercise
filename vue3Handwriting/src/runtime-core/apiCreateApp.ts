import { createVNode } from './vnode'

function createAppApi(render) {
  return component => {
    const app = {
      mount(container) {
        const vNode = createVNode(component)
        render(vNode, container)
      },
    }
    return app
  }
}

export { createAppApi }
