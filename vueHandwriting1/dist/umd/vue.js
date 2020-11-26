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

  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }
  function isReservedTag(tagName) {
    var obj = {};
    var arr = ['p', 'div', 'span', 'input', 'button'];
    arr.forEach(function (tag) {
      return obj[tag] = true;
    });
    return obj[tagName];
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'deatroyed'];
  var strats = {};

  function mergeHook(parentVal, childVal) {
    return childVal ? parentVal ? parentVal.concat(childVal) : [childVal] : parentVal;
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    return strats[hook] = mergeHook;
  });

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      Object.keys(childVal).forEach(function (key) {
        return res[key] = childVal[key];
      });
    }

    return res;
  }

  strats.components = mergeAssets;
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      // 如果已经合并过了，就不需要再次合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observerArray(inserted); // 继续观测新增属性

      ob.dep.notify(); // 数组的发布订阅

      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } // 观察者模式

    }, {
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this); // this是Dep的实例
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

  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // 专门给数组用的依赖收集
      // 给监测过的数据添加__ob__属性，挂载observer实例
      // value.__ob__ = this 这样写会引起递归

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 对数组进行监控（排除索引）
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        // 对对象进行观测
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(data) {
        var len = data.length;

        for (var i = 0; i < len; i++) {
          var item = data[i];
          observe(item);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
        /*    for (let i = 0; i < keys.length; i++) {
              let key = keys[i]
              let value = data[key]
              defineReactive(data, key, value)
            }*/
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    var len = value.length;

    for (var i = 0; i < len; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    var dep = new Dep(); // 递归实现深度检测
    // 可能是对象，也可能是数组，返回的是实例observer

    var childOb = observe(value);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        // 依赖收集
        if (Dep.target) {
          dep.depend(Dep.target);

          if (childOb) {
            childOb.dep.depend(); // 处理数组

            if (Array.isArray(value)) dependArray(value);
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return false;
        observe(newValue); // 劫持设置的值，如果传入的是对象，递归深度检测

        value = newValue; // 发布订阅

        dep.notify();
      }
    });
  }

  function observe(data) {
    if (!isObject(data)) return false;
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    Object.keys(data).forEach(function (key) {
      proxy(vm, '_data', key);
    }); // 对象劫持

    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 标签开头的正则 捕获的内容是标签名

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配标签结尾的标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  /* 匹配属性的 */

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  /*  匹配标签结束的 > */

  var startTagClose = /^\s*(\/?)>/;
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var root = null;
    var currentPraent;
    var stack = [];

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);
      if (!root) root = element;
      currentPraent = element;
      stack.push(element);
    }

    function chars(text) {
      text = text.trim();

      if (text) {
        currentPraent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      var element = stack.pop();
      currentPraent = stack[stack.length - 1];

      if (currentPraent) {
        element.parent = currentPraent;
        currentPraent.children.push(element);
      }
    }

    while (html) {
      var textEnd = html.indexOf('<'); // 标签

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 匹配开始标签之后，继续下一次循环，跳过之后的判断
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } // 文本内容


      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    } // 删除解析后的模板字符串


    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // 开始的标签

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end, attr; // 解析属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        } // 结尾的标签


        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
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

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      var text = node.text;
      var token = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          token.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        token.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        token.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(token.join('+'), ")");
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    var root = parseHTML(template);
    var code = generate(root);
    var renderFn = new Function("with(this){ return ".concat(code, "}"));
    return renderFn;
  }
  /* 组件渲染的过程 */
  // 组件渲染的时候，会调用当前组件对应的构造函数，产生一个实例 new Ctor({ _isComponent: true })
  // 每个组件在使用时都会调用Vue.extend方法创建一个构造函数
  // 实例化子组件时，会将当前选项和用户定义选项合并（mergeOptions方法)
  // 通过创建实例，调用子类的_init() 内部会再创建一个渲染watcher，将渲染后的结果放在vm.$el上

  var callback = [];
  var waiting = false;

  function flushCallback() {
    callback.forEach(function (cb) {
      return cb();
    }); // 刷新后更新waiting

    waiting = false;
  }

  function nextTick(cb) {
    // 多次调用，没有刷新，先放在数组中
    callback.push(cb);

    if (!waiting) {
      setTimeout(flushCallback);
      waiting = true;
    }
  }

  var queue = [];
  var has = {};

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = [];
    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true;
      nextTick(flushSchedularQueue);
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn;
      this.depsId = new Set();
      this.deps = [];
      this.get();
    } // 防止放如重复的dep dep也不能放重复的watcher


    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this); // this是Wathcher实例
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); // 收集watcher

        this.getter(); // 渲染watcher

        popTarget(); // 移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        // 更新队列（性能提升）
        queueWatcher(this); // this.get()
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      // 第一次渲染，oldVnode没有，说明是组件挂载
      return createElm(vnode);
    } else {
      var isRealElement = oldVnode.nodeType;

      if (isRealElement) {
        var oldElm = oldVnode;
        var parentElm = oldElm.parentNode;

        var _el = createElm(vnode);

        parentElm.insertBefore(_el, oldElm.nextSibling);
        parentElm.removeChild(oldElm);
        return _el;
      } else {
        // 对比两个虚拟节点 操作真实dom

        /* diff算法特点 平级比对*/
        // 1. 标签不一致，直接替换
        if (oldVnode.tag !== vnode.tag) {
          oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
        } // 2. 没有tag就是文本


        if (!oldVnode.tag) {
          if (oldVnode.text !== vnode.text) {
            oldVnode.el.textContent = vnode.text;
          }
        } // 3. 标签一致，且不是文本，比对属性是否一致


        vnode.el = oldVnode.el;
        updateProperties(vnode, oldVnode.data); // 4. 比对子节点

        var oldChildren = oldVnode.children || [];
        var newChildren = vnode.children || [];

        if (oldChildren.length > 0 && newChildren.length > 0) {
          // 真正的diff算法在这里
          updateChildren(vnode.el, oldChildren, newChildren);
        } else if (newChildren.length > 0) {
          for (var i = 0; i < newChildren.length; i++) {
            var child = newChildren[i];
            el.appendChild(createElm(child));
          }
        } else if (oldChildren.length > 0) {
          el.innerHTML = '';
        }
      }
    }
  }

  function createComponent(vnode) {
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    }

    if (vnode.componentInstance) {
      return true;
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 组件实例化
      if (createComponent(vnode)) {
        return vnode.componentInstance.$el;
      } // 非组件就是标签


      vnode.el = document.createElement(tag); // 更新节点

      updateProperties(vnode); // 递归创建子节点，将子节点放到父节点中

      children.forEach(function (child) {
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 文本
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  } // 更新子节点 diff算法


  function updateChildren(parent, oldChildren, newChildren) {
    // 头尾双指针
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[oldStartIndex];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newStartVnode = newChildren[newStartIndex];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex]; // 根据旧节点key创建的映射表 乱序比对的时候使用

    var makeIndexByKey = function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        if (item.key) {
          map[item.key] = index;
        }
      });
      return map;
    };

    var map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 移动的过程中，没有老的节点，跳过
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } // 如果相同，就复用
      // 头头
      else if (isSameVnode(oldStartVnode, newStartVnode)) {
          patch(oldStartVnode, newStartVnode);
          oldStartVnode = oldChildren[++oldStartIndex];
          newStartVnode = newChildren[++newStartIndex];
        } // 尾尾 
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
          } // 头移尾
          else if (isSameVnode(oldStartVnode, newEndVnode)) {
              patch(oldStartVnode, newEndVnode);
              parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
              oldStartVnode = oldChildren[++oldStartIndex];
              newEndVnode = newChildren[--newEndIndex];
            } // 尾移头
            else if (isSameVnode(oldEndVnode, newStartVnode)) {
                patch(oldEndVnode, newStartVnode);
                parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
                oldEndVnode = oldChildren[--oldEndIndex];
                newStartVnode = newChildren[++newStartIndex];
              } // 乱序 暴力比对
              else {
                  var moveIndex = map[newStartVnode.key];

                  if (!moveIndex) {
                    // 没有复用
                    parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
                  } else {
                    // 有复用，移动到指针前，并将元素置空防止索引塌陷
                    var moveVnode = oldChildren[moveIndex];
                    patch(moveVnode, newStartVnode);
                    parent.insertBefore(moveVnode.el, oldStartVnode.el);
                    oldChildren[moveIndex] = null;
                  }

                  newStartVnode = newChildren[++newStartIndex];
                }
    }

    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var _el2 = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;

        parent.insertBefore(createElm(newChildren[i]), _el2);
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != null) {
          parent.removeChild(child.el);
        }
      }
    }
  } // 更新标签属性


  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el;

    for (var key in oldProps) {
      if (!newProps[key]) el.removeAttribute(key);
    } // 新旧节点的属性替换


    var newStyle = newProps.style || {};
    var oldStyle = newProps.style || {};

    for (var _key in oldStyle) {
      if (!newStyle[_key]) el.style[_key] = '';
    } // 新节点的属性赋值


    console.log(vnode);

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 虚拟节点对应的内容 保存上一次渲染的虚拟系欸但

      var prevVnode = vm._vnode;
      vm._vnode = vnode; // 第一次不需要diff算法

      if (!prevVnode) {
        // 用虚拟节点vnode，创建真实节点
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVnode, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options;
    vm.$el = el; // 调用beforeMount生命周期函数

    callHook(vm, 'beforeMount');

    var updateComponent = function updateComponent() {
      // _update() 创建真实dom的方法 _render() 通过解析的render方法 渲染虚拟dom
      vm._update(vm._render());
    }; // 调用mounted生命周期函数


    callHook(vm, 'mounted'); // 用来渲染的类

    new Watcher(vm, updateComponent, function () {}, true);
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // vue实例
      // 实例上拿到用户配置
      // 将全局的与用户传入的合并

      vm.$options = mergeOptions(vm.constructor.options, options); // 调用beforeCreate生命周期钩子函数

      callHook(vm, 'beforeCreate'); // 初始化状态

      initState(vm); // 调用created生命周期钩子函数

      callHook(vm, 'created'); // 渲染页面
      // 如果传入了el

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = typeof el === 'string' ? document.querySelector(el) : el;

      if (!options.render) {
        // 先判断没有render 没有template的情况
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        options.render = compileToFunction(template);
      }

      mountComponent(vm, el);
    };

    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var key = data.key;
    if (key) delete data.key;

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      // 标签
      return vnode(tag, data, key, children, undefined);
    } else {
      // 组件
      var Ctor = vm.$options.components[tag]; // console.log(Ctor)

      return createComponent$1(vm, tag, data, key, children, Ctor);
    }
  }
  function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }

  function createComponent$1(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hook = {
      init: function init(vnode) {
        // 当前组件的实例 就是componentInstance
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        });
        child.$mount();
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function renderMixin(Vue) {
    /* 
    _c 创建元素的虚拟节点
    _v 创建文本的虚拟节点
    _s JSON.stringify
    */
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextNode(this, text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      return render.call(vm);
    };
  }

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  var ASSETS_TYPE = ['component', 'directive', 'filter'];

  function initAssetRegisters(Vue) {
    ASSETS_TYPE.forEach(function (type) {
      Vue[type] = function (id, definition) {
        // 注册全局组件
        if (type === 'component') {
          // 使用extend方法，将对象变成构造函数
          definition = this.options._base.extend(definition);
        }


        this.options["".concat(type, "s")][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    var cid = 0;

    Vue.extend = function (extendOptions) {
      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.cid = cid++;
      Sub.prototype = Object.create(this.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(this.options, extendOptions);
      Sub.mixin = this.mixin;
      Sub.component = this.component;
      return Sub;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了全局相关的内容
    Vue.options = {};
    initMixin$1(Vue); // 初始化全局过滤器，指令，组件

    ASSETS_TYPE.forEach(function (type) {
      Vue.options["".concat(type, "s")] = {};
    }); // _base是Vue的构造函数

    Vue.options._base = Vue; // 注册extend方法

    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  function Vue(options) {
    // 初始化配置
    this._init(options);
  }

  initMixin(Vue); // 初始化方法

  renderMixin(Vue); // 渲染方法，调用render方法

  lifecycleMixin(Vue); // 添加update方法，虚拟dom渲染成真实dom
  // 初始化全局api

  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
