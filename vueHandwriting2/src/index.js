import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "../render";
import { initGlobalAPI } from "./global-api/index";
// 测试用
import { compileToFunction } from "./compiler/index";
import { createElm, patch } from "./vdom/patch";

function Vue (options) {
  this._init(options)
}

initMixin(Vue) // 扩展初始化
lifecycleMixin(Vue) // 扩展更新方法（真实dom渲染） _update()
renderMixin(Vue) // 扩展渲染的方法（调用自定义render方法） _render()

initGlobalAPI(Vue)

/*
* diff算法测试内容
* */
// 构建两个虚拟dom，方便对比
/*const vm1 = new Vue({
  data () {
    return {
      name: 'lu'
    }
  }
})

// 模板变成render函数
const render1 = compileToFunction(`<ul id="a" a="1" style="color: red;">
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
  <li key="D">D</li>
  <li key="F">F</li>
</ul>`)
const oldVNode = render1.call(vm1)

const el = createElm(oldVNode)
document.body.appendChild(el)

const vm2 = new Vue({
  data () {
    return { name: 'lug' }
  }
})

const render2 = compileToFunction(`<ul id="b" b="2" style="background:yellow;">
  <li key="N">N</li>
  <li key="A">A</li>
  <li key="C">C</li>
  <li key="B">B</li>
  <li key="E">E</li>
</ul>`)
const newVNode = render2.call(vm2)

setTimeout(() => {
  patch(oldVNode, newVNode)
}, 1000)*/

export default Vue
