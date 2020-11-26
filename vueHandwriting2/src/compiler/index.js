import { parseHTML } from "./parse";
import { generate } from "./generate";


export function compileToFunction (template) {
  const ast = parseHTML(template)
  const code = generate(ast)
  const render = `with(this){return ${code}}`
  const fn = new Function(render)
  return fn
}
