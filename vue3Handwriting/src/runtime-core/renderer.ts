import { createAppApi } from './apiCreateApp'
import { ShapeFlags } from '../shared'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '../reactivity'

function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    inset: hostInset,
    remove: hostRemove,
    setElementText: hostSetElementText,
    createTextNode: hostCreateTextNode,
    patchProps: hostPatchProps,
  } = options

  const patch = (prevNode, vNode, container) => {
    const { shapeFlag } = vNode

    const mountElement = (vNode, container) => {
      const { shapeFlag, props, type, children } = vNode
      // 创建
      const el = (vNode.el = hostCreateElement(type))
      // 子节点
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, children)
      } else {
        moutChildren(children, el)
      }
      // 属性
      if (props) {
        for (const key in props) {
          hostPatchProps(el, key, null, props[key])
        }
      }
      // 插入节点
      hostInset(el, container)
    }

    function moutChildren(children, el) {
      for (let i = 0; i < children.length; i++) {
        patch(null, children[i], container)
      }
    }

    const patchElement = (prevNode, vNode, container) => {}
    const mountComponent = (vNode, container) => {
      // 每个组件有一个effect，达到组件级更新的效果
      // 组件的创建
      const instance = (vNode.component = createComponentInstance(vNode))
      // 组件的setup方法
      setupComponent(instance)
      // 渲染effect
      setupRenderEffect(instance, container)
    }

    function setupRenderEffect(instance, container) {
      effect(() => {
        if (!instance.isMounted) {
          // 组件的创建渲染
          const subtree = (instance.subtree = instance.render())
          patch(null, subtree, container)
          instance.isMounted = true
        } else {
          // 组件的更新渲染
          console.log('更新')
        }
      })
    }

    const patchComponent = (prevNode, vNode, container) => {}

    const processElement = (prevNode, vNode, container) => {
      if (prevNode == null) {
        // 元素挂载
        mountElement(vNode, container)
      } else {
        patchElement(prevNode, vNode, container)
      }
    }

    const processComponent = (prevNode, vNode, container) => {
      if (prevNode == null) {
        // 组件挂载
        mountComponent(vNode, container)
      } else {
        patchComponent(prevNode, vNode, container)
      }
    }

    // & 包含类型
    // 1100 & 0001
    if (shapeFlag & ShapeFlags.ELEMENT) {
      // 元素
      processElement(prevNode, vNode, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      //1100 0100
      // 组件
      processComponent(prevNode, vNode, container)
    }
  }

  const render = (vNode, container) => {
    // 初次渲染 没有prevNode
    patch(null, vNode, container)
  }
  return {
    createApp: createAppApi(render),
  }
}

export { createRenderer }
