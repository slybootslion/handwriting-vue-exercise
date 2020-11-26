const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


function genProps (attrs) {
  let str = ''
  const len = attrs.length
  for (let i = 0; i < len; i++) {
    const attr = attrs[i]
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
  return `{ ${str.slice(0, -1)} }`
}

function gen (node) {
  if (node.type === 1) {
    // 标签
    return generate(node)
  } else {
    // 文本
    let text = node.text
    if (defaultTagRE.test(text)) {
      // 插值表达式文本
      let tokens = []
      let match
      let index = 0
      let lastIndex = defaultTagRE.lastIndex = 0 // 重置正则索引
      while (match = defaultTagRE.exec(text)) {
        index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    } else {
      // 普通文本
      return `_v(${JSON.stringify(text)})`
    }
  }
}

function genChildren (el) {
  const children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

export function generate (el) {
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
  }${
    children ? ',' + children : ''
  })`
  return code
}
