(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var oldArrayProtoMethods = Array.prototype; // 继承Array的原型方法

  var arrayMethods = Object.create(Array.prototype);
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args));

      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observeArray(inserted);
      ob.dep.notify();
      return result;
    };
  });

  function pushTarget(watcher) {
    Dep.target = watcher;
  }
  function popTarget() {
    Dep.target = null;
  }
  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++; // 属性对应的watcher

      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // water记录dep
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // value.__ob__ = this 不能这么写

      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false,
        // 不可枚举
        configurable: false // 不可删除

      });

      if (Array.isArray(value)) {
        // value.__proto__ = arrayMethods
        Object.setPrototypeOf(value, arrayMethods);
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          // 遍历数组，如果数组中有对象，将对象变为响应式
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        // 将对象中的数据全部重新定义成响应式数据
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function dependArray(arr) {
    for (var i = 0; i < arr.length; i++) {
      var current = arr[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    // value值也可能是一个对象，对数据进行递归拦截
    var childOb = observe(value);
    var dep = new Dep(); // 给属性添加dep

    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          // 让 属性 自己的dep记住当前的watcher，也让watcher记住这个dep 依赖收集
          dep.depend();

          if (childOb) {
            // 如果对数组取值 会将watcher和数组进行关联
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (value === newValue) return false; // 如果设置的值是对象，继续将新设置的值变成响应式

        observe(newValue);
        value = newValue; // 发布订阅

        dep.notify();
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) return false;
    if (data.__ob__) return false;
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 数据初始化

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 通过vm._data获取劫持后的数据

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配结尾的标签 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性

  var startTagClose = /^\s*(\/?)>/; // 匹配结束的标签 >

  function parseHTML(html) {
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root = null;
    var currentParent;
    var stack = []; // 根据开始标签、结束标签，文本内容生成 AST 语法树

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);
      if (!root) root = element;
      currentParent = element;
      stack.push(element);
    }

    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;
      if (textEnd > 0) text = html.substring(0, textEnd);

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';
    var len = attrs.length;

    for (var i = 0; i < len; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{ ".concat(str.slice(0, -1), " }");
  }

  function gen(node) {
    if (node.type === 1) {
      // 标签
      return generate(node);
    } else {
      // 文本
      var text = node.text;

      if (defaultTagRE.test(text)) {
        // 插值表达式文本
        var tokens = [];
        var match;
        var index = 0;
        var lastIndex = defaultTagRE.lastIndex = 0; // 重置正则索引

        while (match = defaultTagRE.exec(text)) {
          index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      } else {
        // 普通文本
        return "_v(".concat(JSON.stringify(text), ")");
      }
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ',' + children : '', ")");
    return code;
  }

  function compileToFunction(template) {
    var ast = parseHTML(template);
    var code = generate(ast);
    var render = "with(this){return ".concat(code, "}");
    var fn = new Function(render);
    return fn;
  }

  var cbs = [];
  var waiting = false;

  function flushCallbacks() {
    for (var i = 0; i < cbs.length; i++) {
      var cb = cbs[i];
      cb();
    }

    waiting = false;
    cbs = [];
  }

  function nextTick(cb) {
    cbs.push(cb);

    if (!waiting) {
      waiting = true;
      Promise.resolve().then(flushCallbacks);
    }
  }
  function isObject(obj) {
    return _typeof(obj) === 'object' && obj != null;
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted'];

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    return strats[hook] = mergeHook;
  });

  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      Object.keys(childVal).forEach(function (key) {
        return res[key] = childVal[key];
      });
    }

    return res;
  };

  function mergeOptions(parent, child) {
    var options = {}; // 第一种情况
    // {a: 1} {a: 2} -> {a:2}
    // 第二种
    // undefined {a: 2} -> {a: 2}
    // 第三种
    // {a: 1} undefined -> {a: 1}

    function mergeField(key) {
      // 策略模式 用来判断生命周期，data，components等
      if (strats[key]) return options[key] = strats[key](parent[key], child[key]);

      if (isObject(parent[key]) && isObject(child[key])) {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else {
        if (child[key]) {
          options[key] = child[key];
        } else {
          options[key] = parent[key];
        }
      }
    }

    Object.keys(parent).forEach(function (key) {
      return mergeField(key);
    });
    Object.keys(child).forEach(function (key) {
      if (!parent.hasOwnProperty(key)) {
        mergeField(key);
      }
    });
    return options;
  }

  function makeUp(tagStr) {
    var map = {};
    tagStr.split(',').forEach(function (tag) {
      return map[tag] = true;
    });
    return function (tag) {
      return !!map[tag];
    };
  }

  var isReservedTag = makeUp('a,p,div,ul,li,span,input,button,b');

  var has = {};
  var queue = [];
  var pending = false;

  function flushSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      var watcher = queue[i];
      watcher.run();
    }

    has = {};
    queue = [];
    pending = false;
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        pending = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.cb = cb;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn;
      this.deps = []; // 存放对应的deps

      this.depsId = new Set();
      this.get(); // 让updateComponent执行 render()方法
    } // 对属性进行取值操作
    // 属性取值时，需要记住对应的watcher


    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        this.getter();
        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this);
      }
    }]);

    return Watcher;
  }();

  function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      // 如果Ctor是对象，转成函数
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hook = {
      // 初始化组件钩子函数
      init: function init(vNode) {
        var child = vNode.componentOptions = new vNode.componentOptions.Ctor({});
        child.$mount();
      }
    }; // 组件的虚拟节点与一般标签的区别：
    // 虚拟节点拥有hook和当前组件的componentOptions（存放了组件的构造函数）

    return vnode(vm, "vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor
    });
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    // 对标签名做过滤
    if (isReservedTag(tag)) {
      // html标签
      return vnode(vm, tag, data, data.key, children, undefined);
    } else {
      // 组件
      var Ctor = vm.$options.components[tag];
      return createComponent(vm, tag, data, data.key, children, Ctor);
    }
  }
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function isSameVNode(oldVNode, newVNode) {
    return oldVNode.tag === newVNode.tag && oldVNode.key === newVNode.key;
  }

  function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
      vm: vm,
      tag: tag,
      children: children,
      data: data,
      key: key,
      text: text,
      componentOptions: componentOptions
    };
  }

  function createComponent$1(vNode) {
    var i = vNode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vNode); // 调用组件的初始化
    }

    return !!vNode.componentOptions;
  }

  function createElm(vNode) {
    var tag = vNode.tag,
        children = vNode.children,
        key = vNode.key,
        data = vNode.data,
        text = vNode.text,
        vm = vNode.vm;

    if (typeof tag === 'string') {
      // 可能是组件
      if (createComponent$1(vNode)) {
        return vNode.componentOptions.$el;
      }

      vNode.el = document.createElement(tag);
      updateProperties(vNode);
      children.forEach(function (child) {
        vNode.el.appendChild(createElm(child));
      });
    } else {
      vNode.el = document.createTextNode(text);
    }

    return vNode.el;
  } // 添加标签属性

  function updateProperties(vNode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vNode.data || {};
    var el = vNode.el; // 老的属性新的没有，移除新节点上的属性（diff）

    for (var key in oldProps) {
      if (!newProps[key]) el.removeAttribute(key);
    } // 比对样式


    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var _key in oldStyle) {
      if (!newStyle[_key]) el.style[_key] = '';
    } // 新的属性老的没有，直接覆盖


    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        var styles = newProps.style;

        for (var styleName in styles) {
          el.style[styleName] = styles[styleName].trim();
        }
      } else {
        console.log(el);
        el && el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function updateChildren(parent, oldChildren, newChildren) {
    var oldStartIndex = 0; // 老的头索引

    var oldEndIndex = oldChildren.length - 1; // 老的尾索引

    var oldStartVNode = oldChildren[0]; // 老的开始节点

    var oldEndVNode = oldChildren[oldEndIndex]; // 老的结束节点

    var newStartIndex = 0; // 新的头索引

    var newEndIndex = newChildren.length - 1; // 新的尾索引

    var newStartVNode = newChildren[0]; // 新的开始节点

    var newEndVNode = newChildren[newEndIndex]; // 新的结束节点

    function makeIndexByKey(oldChildren) {
      var map = {};
      oldChildren.forEach(function (item, index) {
        map[item.key] = index;
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVNode) {
        oldStartVNode = oldChildren[++oldStartIndex];
        continue;
      }

      if (!oldEndVNode) {
        oldEndVNode = oldChildren[--oldEndIndex];
        continue;
      } // 可进行优化策略的4种情况
      // 1. 尾部插入


      if (isSameVNode(oldStartVNode, newStartVNode)) {
        patch(oldStartVNode, newStartVNode);
        oldStartVNode = oldChildren[++oldStartIndex];
        newStartVNode = newChildren[++newStartIndex];
      } // 2. 头部插入
      else if (isSameVNode(oldEndVNode, newEndVNode)) {
          patch(oldEndVNode, newEndVNode);
          oldEndVNode = oldChildren[--oldEndIndex];
          newEndVNode = newChildren[--newEndIndex];
        } // 3. 头移动到尾部
        else if (isSameVNode(oldStartVNode, newEndVNode)) {
            patch(oldStartVNode, newEndVNode);
            parent.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling);
            oldStartVNode = oldChildren[++oldStartIndex];
            newEndVNode = newChildren[--newEndIndex];
          } // 4. 尾移动到头部
          else if (isSameVNode(oldEndVNode, newStartVNode)) {
              patch(oldEndVNode, newStartVNode);
              parent.insertBefore(oldEndVNode.el, oldStartVNode.el);
              oldEndVNode = oldChildren[--oldEndIndex];
              newStartVNode = newChildren[++newStartIndex];
            } // 暴力比对
            else {
                // 1. 查找当前老节点索引和key的关系
                // 移动端的时候通过新的key，去找对应的老节点索引，获取老的节点，移动老的节点
                var moveIndex = map[newStartVNode.key];

                if (moveIndex == null) {
                  parent.insertBefore(createElm(newStartVNode), oldStartVNode.el);
                } else {
                  var moveVNode = oldChildren[moveIndex];
                  oldChildren[moveIndex] = null;
                  patch(moveVNode, newStartVNode);
                  if (!moveVNode.el) return;
                  parent.insertBefore(moveVNode.el, oldStartVNode.el);
                }

                newStartVNode = newChildren[++newStartIndex];
              }
    } // 新的比老的多，插入新的节点


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var nextEle = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el; // insertBefore第二个参数如果是null，等价于appendChild

        parent.insertBefore(createElm(newChildren[i]), nextEle); // parent.appendChild(createElm(newChildren[i]))
      }
    } // 老的比新的多，删除多余的老节点


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != null) {
          parent.removeChild(child.el);
        }
      }
    }
  }

  function patch(oldVNode, vNode) {
    // 1. 组件
    if (!oldVNode) {
      // 虚拟节点创建元素
      return createElm(vNode);
    } // 2. 是一个真实dom 初次渲染


    var isRealElement = oldVNode.nodeType;

    if (isRealElement) {
      var oldElm = oldVNode;
      var parentElm = oldElm.parentNode;
      var el = createElm(vNode); // 根据虚拟节点创建真实节点

      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
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
        oldVNode.el && oldVNode.el.parentNode.replaceChild(createElm(vNode), oldVNode.el);
        return;
      } // 2)


      if (!oldVNode.tag && oldVNode.text !== vNode.text) {
        oldVNode.el.textContent = vNode.text;
        return;
      } // 3）


      var _el = vNode.el = oldVNode.el; // 老的节点属性与新的属性进行比对


      updateProperties(vNode, oldVNode.data); // 4）

      /*
      * 子节点比对，三种情况
      * 4.1）旧的有子节点，新的没有子节点 --> 删除旧的子节点
      * 4.2）新的有子节点，旧的没有子节点 --> 在旧节点上增加子节点
      * 4.3）旧的有子节点，新的也有子节点 --> 真·diff算法
      * */

      var oldChildren = oldVNode.children || [];
      var newChildren = vNode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 4.3） 真的diff算法
        updateChildren(_el, oldChildren, newChildren);
      } else if (oldChildren.length > 0) {
        // 4.1）
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        // 4.2）
        newChildren.forEach(function (child) {
          return _el.appendChild(createElm(child));
        });
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vNode) {
      var vm = this; // vm.$el = patch(vm.$options.el, vNode)
      // 第一次初始化替换真实元素，第二次走diff算法

      var prevVNode = vm._vnode;
      vm._vnode = vNode;

      if (!prevVNode) {
        vm.$el = patch(vm.$el, vNode);
      } else {
        vm.$el = patch(prevVNode, vNode);
      }
    };
  }
  function mountComponent(vm) {
    var updateComponent = function updateComponent() {
      var vNode = vm._render(); // 返回虚拟节点


      vm._update(vNode); // 渲染成真实节点

    };

    var w = new Watcher(vm, updateComponent, function () {}, true); // updateComponent()
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers && handlers.length) handlers.forEach(function (handler) {
      return handler.call(vm);
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options); // 初始化状态

      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created'); // 数据可以挂载到页面上

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$nextTick = nextTick;

    Vue.prototype.$mount = function (el) {
      el = typeof el === 'string' ? document.querySelector(el) : el;
      var vm = this;
      var options = vm.$options;
      vm.$el = el;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render;
      }

      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    // 创建元素的虚拟节点
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return createElement.apply(void 0, [this].concat(args));
    }; // 创建文本的虚拟节点


    Vue.prototype._v = function (text) {
      return createTextVnode(this, text);
    }; // 转化字符串


    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vNode = render.call(vm); // 生成虚拟节点，调用时会自动将变量进行取值，将实例结果进行渲染

      return vNode;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {}; // 静态方法mixin

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this; // 链式调用
    }; // 组件方法


    Vue.options._base = Vue; // Vue的构造函数

    Vue.options.components = {}; // 存放组件的定义

    Vue.component = function (id, definition) {
      definition.name = definition.name || id;
      definition = this.options._base.extend(definition);
      this.options.components[id] = definition;
    };

    var cid = 0;

    Vue.extend = function (options) {
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.cid = cid++;
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.component = Super.component;
      Sub.options = mergeOptions(Super.options, options); // 传入对象，返回一个构造函数

      return Sub;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 扩展初始化

  lifecycleMixin(Vue); // 扩展更新方法（真实dom渲染） _update()

  renderMixin(Vue); // 扩展渲染的方法（调用自定义render方法） _render()

  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
