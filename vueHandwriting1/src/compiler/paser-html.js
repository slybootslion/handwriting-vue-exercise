const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 标签开头的正则 捕获的内容是标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配标签结尾的标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
/* 匹配属性的 */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
/*  匹配标签结束的 > */
const startTagClose = /^\s*(\/?)>/

export function parseHTML(html) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  let root = null
  let currentPraent
  const stack = []

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }


  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) root = element
    currentPraent = element
    stack.push(element)
  }

  function chars(text) {
    text = text.trim()
    if (text) {
      currentPraent.children.push({
        text,
        type: TEXT_TYPE
      })
    }
  }

  function end(tagName) {
    const element = stack.pop()
    currentPraent = stack[stack.length - 1]
    if (currentPraent) {
      element.parent = currentPraent
      currentPraent.children.push(element)
    }
  }

  while (html) {
    let textEnd = html.indexOf('<')
    // 标签
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue // 匹配开始标签之后，继续下一次循环，跳过之后的判断
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    // 文本内容
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  // 删除解析后的模板字符串
  function advance(n) {
    html = html.substring(n)
  }


  function parseStartTag() {
    let start = html.match(startTagOpen)
    // 开始的标签
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr
      // 解析属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
      }
      // 结尾的标签
      if (end) {
        advance(end[0].length)
        return match
      }
    }

  }

  return root
}
