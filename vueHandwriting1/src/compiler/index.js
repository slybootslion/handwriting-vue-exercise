import { parseHTML } from './paser-html';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  let children = el.children
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    let text = node.text
    let token = []
    let match, index
    let lastIndex = defaultTagRE.lastIndex = 0
    while (match = defaultTagRE.exec(text)) {
      index = match.index
      if (index > lastIndex) {
        token.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      token.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      token.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${token.join('+')})`
  }
}

function generate(el) {
  const children = genChildren(el)
  let code = `_c("${el.tag}",${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `,${children}` : ''})`
  return code
}

export function compileToFunction(template) {
  const root = parseHTML(template)
  const code = generate(root)
  let renderFn = new Function(`with(this){ return ${code}}`)
  return renderFn
}

/* 组件渲染的过程 */
// 组件渲染的时候，会调用当前组件对应的构造函数，产生一个实例 new Ctor({ _isComponent: true })
// 每个组件在使用时都会调用Vue.extend方法创建一个构造函数
// 实例化子组件时，会将当前选项和用户定义选项合并（mergeOptions方法)
// 通过创建实例，调用子类的_init() 内部会再创建一个渲染watcher，将渲染后的结果放在vm.$el上
