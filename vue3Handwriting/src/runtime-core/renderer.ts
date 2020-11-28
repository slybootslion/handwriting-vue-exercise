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

  function isSameNode(node1, node2) {
    return node1.type === node2.type && node1.key === node2.key
  }

  const patch = (prevNode, vNode, container, anchor = null) => {
    // 组件更新：同级比对，同Vue2
    // 1.类型不一样 key不一样，不复用
    // 2.复用节点后，比对属性
    // 3.比对子节点，1方有子节点，直接替换或者直接删除
    // 4.两方都有子节点（真正的diff算法）
    if (prevNode && !isSameNode(prevNode, vNode)) {
      hostRemove(prevNode.el)
      prevNode = null
    }

    const { shapeFlag } = vNode

    const mountElement = (vNode, container, anchor) => {
      const { shapeFlag, props, type, children } = vNode
      // 创建
      const el = (vNode.el = hostCreateElement(type))
      // 子节点
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, children)
      } else {
        mountChildren(children, el)
      }
      // 属性
      if (props) {
        for (const key in props) {
          hostPatchProps(el, key, null, props[key])
        }
      }
      // 插入节点
      hostInset(el, container, anchor)
    }

    function mountChildren(children, container) {
      for (let i = 0; i < children.length; i++) {
        patch(null, children[i], container)
      }
    }

    function patchProps(oldProps, newProps, el) {
      if (oldProps !== newProps) {
        for (const key in newProps) {
          const oldOne = oldProps[key]
          const newOne = newProps[key]
          if (oldOne !== newProps) hostPatchProps(el, key, oldOne, newOne)
        }
        // 旧的属性有，新的没有，删除旧属性
        for (const key in oldProps) {
          const oldOne = oldProps[key]
          if (!(key in newProps)) hostPatchProps(el, key, oldOne, null)
        }
      }
    }

    function patchKeyedChildren(c1, c2, el) {
      let i = 0
      let e1 = c1.length - 1
      let e2 = c2.length - 1

      while (i <= e1 && i <= e2) {
        // 头相同
        const n1 = c1[i]
        const n2 = c2[i]
        if (isSameNode(n1, n2)) {
          patch(n1, n2, el)
        } else {
          break
        }
        i++
      }

      while (i <= e1 && i <= e2) {
        // 尾相同
        const n1 = c1[e1]
        const n2 = c2[e2]
        if (isSameNode(n1, n2)) {
          patch(n1, n2, el)
        } else {
          break
        }
        e1--
        e2--
      }

      if (i > e1) {
        // 旧的节点都比较完了
        if (i <= e2) {
          // 新增节点
          const nextPos = e2 + 1
          const anchor = nextPos < c2.length ? c2[nextPos].el : null

          while (i <= e2) {
            patch(null, c2[i], el, anchor)
            i++
          }
        }
      } else if (i > e2) {
        // 新的节点都比较完了 删除旧的节点
        while (i <= e1) {
          hostRemove(c1[i].el)
          i++
        }
      } else {
        // 乱序比对 最长递增子序列
      }
    }

    function patchChildren(oldNode, newNode, el) {
      const oldChildren = oldNode.children
      const newChildren = newNode.children

      // 4种情况（仅考虑文本和标签，其他元素不考虑）
      const oldShapeFlag = oldNode.shapeFlag
      const newShapeFlag = newNode.shapeFlag
      // 1旧的是文本，新的是文本
      // 2旧的是数组，新的是文本 如果新的是文本，直接覆盖
      if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (newChildren !== oldChildren) hostSetElementText(el, newChildren)
      } else {
        // 3旧的是数组，新的是数组
        if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 真·diff算法
          patchKeyedChildren(oldChildren, newChildren, el)
        } else {
          // 4旧的是文本，新的是数组
          hostSetElementText(el, '')
          mountChildren(newChildren, el)
        }
      }
    }

    const patchElement = (prevNode, vNode, container) => {
      // 比较两个元素，并复用
      const el = (vNode.el = prevNode.el)
      const oldProps = prevNode.props
      const newProps = vNode.props

      // 比对属性
      patchProps(oldProps, newProps, el)
      // 比对子节点
      patchChildren(prevNode, vNode, el)
    }

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
          const prevTree = instance.subtree
          const nextTree = instance.render()
          patch(prevTree, nextTree, container)
        }
      })
    }

    const patchComponent = (prevNode, vNode, container) => {}

    const processElement = (prevNode, vNode, container, anchor) => {
      if (prevNode == null) {
        // 元素挂载
        mountElement(vNode, container, anchor)
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
      processElement(prevNode, vNode, container, anchor)
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
