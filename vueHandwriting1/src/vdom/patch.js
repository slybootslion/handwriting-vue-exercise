export function patch(oldVnode, vnode) {

  if (!oldVnode) {
    // 第一次渲染，oldVnode没有，说明是组件挂载
    return createElm(vnode)
  } else {
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
      const oldElm = oldVnode
      const parentElm = oldElm.parentNode

      let el = createElm(vnode)
      parentElm.insertBefore(el, oldElm.nextSibling)
      parentElm.removeChild(oldElm)
      return el
    } else {
      // 对比两个虚拟节点 操作真实dom
      /* diff算法特点 平级比对*/
      // 1. 标签不一致，直接替换
      if (oldVnode.tag !== vnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
      }
      // 2. 没有tag就是文本
      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text
        }
      }
      // 3. 标签一致，且不是文本，比对属性是否一致
      vnode.el = oldVnode.el
      updateProperties(vnode, oldVnode.data)
      // 4. 比对子节点
      const oldChildren = oldVnode.children || []
      const newChildren = vnode.children || []
      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 真正的diff算法在这里
        updateChildren(vnode.el, oldChildren, newChildren)
      } else if (newChildren.length > 0) {
        for (let i = 0; i < newChildren.length; i++) {
          let child = newChildren[i]
          el.appendChild(createElm(child))
        }
      } else if (oldChildren.length > 0) {
        el.innerHTML = ''
      }
    }
  }
}

function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }

  if (vnode.componentInstance) {
    return true
  }
}

function createElm(vnode) {
  let { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') {
    // 组件实例化
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }

    // 非组件就是标签
    vnode.el = document.createElement(tag)
    // 更新节点
    updateProperties(vnode)
    // 递归创建子节点，将子节点放到父节点中
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

// 更新子节点 diff算法
function updateChildren(parent, oldChildren, newChildren) {
  // 头尾双指针
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[oldStartIndex]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[newStartIndex]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  // 根据旧节点key创建的映射表 乱序比对的时候使用
  const makeIndexByKey = (children) => {
    let map = {}
    children.forEach((item, index) => {
      if (item.key) {
        map[item.key] = index
      }
    })
    return map
  }
  const map = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 移动的过程中，没有老的节点，跳过
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    }
    // 如果相同，就复用
    // 头头
    else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    }
    // 尾尾 
    else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
    // 头移尾
    else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
    // 尾移头
    else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    }
    // 乱序 暴力比对
    else {
      const moveIndex = map[newStartVnode.key]
      if (!moveIndex) {
        // 没有复用
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        // 有复用，移动到指针前，并将元素置空防止索引塌陷
        const moveVnode = oldChildren[moveIndex]
        patch(moveVnode, newStartVnode)
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        oldChildren[moveIndex] = null
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const el = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createElm(newChildren[i]), el)
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      if (child != null) {
        parent.removeChild(child.el)
      }
    }
  }
}


// 更新标签属性
function updateProperties(vnode, oldProps = {}) {
  const newProps = vnode.data || {}
  const el = vnode.el

  for (const key in oldProps) {
    if (!newProps[key]) el.removeAttribute(key)
  }

  // 新旧节点的属性替换
  let newStyle = newProps.style || {}
  let oldStyle = newProps.style || {}
  for (const key in oldStyle) {
    if (!newStyle[key]) el.style[key] = ''
  }



  // 新节点的属性赋值
  console.log(vnode)
  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }

}
