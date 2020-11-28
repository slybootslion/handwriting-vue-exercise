import { isFunction } from '../shared'

function createComponentInstance(vNode) {
  const instance = {
    type: vNode.type,
    props: {},
    vNode,
    render: null, // 渲染函数 setup(){ return () =>{} }
    setupState: null, // setup返回的状态
    isMounted: false, // 判断组件是否被挂载
    subtree: null, // 子元素虚拟节点
  }

  return instance
}

function finishComponentSetup(instance) {
  const Component = instance.type
  // 如果有render函数，以render函数中的内容为准
  if (Component.render && !instance.render) {
    instance.render = Component.render
  } else if (!instance.render) {
    // 没有render方法 就走vue2.x的写法（略...）
    // template -> ast -> codegen render
  }
}

function handleSetupResult(instance, result) {
  if (isFunction(result)) {
    instance.render = result
  } else {
    instance.setupState = result
  }
  // 兼容vue2处理方法
  finishComponentSetup(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type
  const { setup } = Component
  if (setup) {
    const setupResult = setup(instance.props)
    // setup返回状态，或者render函数
    handleSetupResult(instance, setupResult)
  }
}

function setupComponent(instance) {
  // 属性处理
  setupStatefulComponent(instance)
}

export { createComponentInstance, setupComponent }
