import { isSameVNode } from "./index";

function createComponent (vNode) {
  let i = vNode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vNode) // 调用组件的初始化
  }
  return !!vNode.componentOptions;

}

export function createElm (vNode) {
  const { tag, children, key, data, text, vm } = vNode
  if (typeof tag === 'string') {
    // 可能是组件
    if (createComponent(vNode)) {
      return vNode.componentOptions.$el
    }

    vNode.el = document.createElement(tag)
    updateProperties(vNode)
    children.forEach(child => {
      vNode.el.appendChild(createElm(child))
    })
  } else {
    vNode.el = document.createTextNode(text)
  }
  return vNode.el
}

// 添加标签属性
function updateProperties (vNode, oldProps = {}) {
  const newProps = vNode.data || {}
  const el = vNode.el

  // 老的属性新的没有，移除新节点上的属性（diff）
  for (const key in oldProps) {
    if (!newProps[key]) el.removeAttribute(key)
  }

  // 比对样式
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}
  for (const key in oldStyle) {
    if (!newStyle[key]) el.style[key] = ''
  }

  // 新的属性老的没有，直接覆盖
  for (const key in newProps) {
    if (key === 'style') {
      const styles = newProps.style
      for (const styleName in styles) {
        el.style[styleName] = styles[styleName].trim()
      }
    } else {
      console.log(el)
      el && el.setAttribute(key, newProps[key])
    }
  }
}

function updateChildren (parent, oldChildren, newChildren) {

  let oldStartIndex = 0 // 老的头索引
  let oldEndIndex = oldChildren.length - 1 // 老的尾索引
  let oldStartVNode = oldChildren[0] // 老的开始节点
  let oldEndVNode = oldChildren[oldEndIndex] // 老的结束节点

  let newStartIndex = 0 // 新的头索引
  let newEndIndex = newChildren.length - 1 // 新的尾索引
  let newStartVNode = newChildren[0] // 新的开始节点
  let newEndVNode = newChildren[newEndIndex] // 新的结束节点

  function makeIndexByKey (oldChildren) {
    let map = {}
    oldChildren.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }

  const map = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIndex]
      continue
    }
    if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIndex]
      continue
    }
    // 可进行优化策略的4种情况
    // 1. 尾部插入
    if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)
      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
    }
    // 2. 头部插入
    else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)
      oldEndVNode = oldChildren[--oldEndIndex]
      newEndVNode = newChildren[--newEndIndex]
    }
    // 3. 头移动到尾部
    else if (isSameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)
      parent.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)
      oldStartVNode = oldChildren[++oldStartIndex]
      newEndVNode = newChildren[--newEndIndex]
    }
    // 4. 尾移动到头部
    else if (isSameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)
      parent.insertBefore(oldEndVNode.el, oldStartVNode.el)
      oldEndVNode = oldChildren[--oldEndIndex]
      newStartVNode = newChildren[++newStartIndex]
    }
    // 暴力比对
    else {
      // 1. 查找当前老节点索引和key的关系
      // 移动端的时候通过新的key，去找对应的老节点索引，获取老的节点，移动老的节点
      let moveIndex = map[newStartVNode.key]
      if (moveIndex == null) {
        parent.insertBefore(createElm(newStartVNode), oldStartVNode.el)
      } else {
        let moveVNode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null
        patch(moveVNode, newStartVNode)
        if (!moveVNode.el) return
        parent.insertBefore(moveVNode.el, oldStartVNode.el)
      }
      newStartVNode = newChildren[++newStartIndex]
    }
  }

  // 新的比老的多，插入新的节点
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let nextEle = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      // insertBefore第二个参数如果是null，等价于appendChild
      parent.insertBefore(createElm(newChildren[i]), nextEle)
      // parent.appendChild(createElm(newChildren[i]))
    }
  }

  // 老的比新的多，删除多余的老节点
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (child != null) {
        parent.removeChild(child.el)
      }
    }
  }

}

export function patch (oldVNode, vNode) {
  // 1. 组件
  if (!oldVNode) {
    // 虚拟节点创建元素
    return createElm(vNode)
  }

  // 2. 是一个真实dom 初次渲染
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    const oldElm = oldVNode
    const parentElm = oldElm.parentNode
    const el = createElm(vNode) // 根据虚拟节点创建真实节点
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return el
  } else {
    // 3. 两个虚拟节点的比对 diff算法
    /*
    * 四种情况
    * 1） 两个虚拟节点的标签不一样，直接替换
    * 2） 两个文本元素（{tag：undefined}）
    * 3） 元素相同，复用老节点，更新属性
    * 4） 更新子节点
    * */

    // 1）
    if (oldVNode.tag !== vNode.tag) {
      oldVNode.el && oldVNode.el.parentNode.replaceChild(createElm(vNode), oldVNode.el)
      return
    }

    // 2)
    if (!oldVNode.tag && oldVNode.text !== vNode.text) {
      oldVNode.el.textContent = vNode.text
      return
    }

    // 3）
    let el = vNode.el = oldVNode.el
    // 老的节点属性与新的属性进行比对
    updateProperties(vNode, oldVNode.data)

    // 4）
    /*
    * 子节点比对，三种情况
    * 4.1）旧的有子节点，新的没有子节点 --> 删除旧的子节点
    * 4.2）新的有子节点，旧的没有子节点 --> 在旧节点上增加子节点
    * 4.3）旧的有子节点，新的也有子节点 --> 真·diff算法
    * */
    const oldChildren = oldVNode.children || []
    const newChildren = vNode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 4.3） 真的diff算法
      updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
      // 4.1）
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      // 4.2）
      newChildren.forEach(child => el.appendChild(createElm(child)))
    }

  }
}
