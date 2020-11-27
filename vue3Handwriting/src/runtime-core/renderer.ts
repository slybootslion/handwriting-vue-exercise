import { createAppApi } from './apiCreateApp'

function createRenderer(options) {
  const render = (vNode, container) => {
    console.log(vNode, container)
  }
  return {
    createApp: createAppApi(render),
  }
}

export { createRenderer }
