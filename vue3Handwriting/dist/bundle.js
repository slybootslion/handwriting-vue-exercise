(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  var isObject = function (obj) {
      return typeof obj === 'object' && obj != null;
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = function (target, key) { return hasOwnProperty.call(target, key); };
  var isArray = function (obj) { return Array.isArray(obj); };
  var isFunction = function (fn) { return typeof fn === 'function'; };
  var isString = function (val) { return typeof val === 'string'; };
  var hasChange = function (oldVal, newVal) { return oldVal !== newVal; };

  // 依赖收集
  var effect = function (fn, options) {
      if (options === void 0) { options = {}; }
      var effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  };
  var effectStack = [];
  var activeEffect = null;
  function createReactiveEffect(fn, options) {
      // reactiveEffect只是提示看源码的人的（没有实际用处）
      var effect = function reactiveEffect() {
          if (!effectStack.includes(effect)) {
              try {
                  effectStack.push(effect);
                  activeEffect = effect;
                  return fn();
              }
              finally {
                  effectStack.pop();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.options = options;
      return effect;
  }
  var targetMap = new WeakMap();
  function track(target, key) {
      if (activeEffect == null)
          return;
      var depsMap = targetMap.get(target);
      if (!depsMap)
          targetMap.set(target, (depsMap = new Map()));
      var dep = depsMap.get(key);
      if (!dep)
          depsMap.set(key, (dep = new Set()));
      if (!dep.has(activeEffect))
          dep.add(activeEffect);
  }
  function run(effects) {
      if (effects)
          effects.forEach(function (effect) {
              if (effect.options.scheduler) {
                  effect.options.scheduler(effect);
                  return;
              }
              effect();
          });
  }
  function trigger(target, type, key, value) {
      var depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      if (key === 'length' && isArray(target)) {
          depsMap.forEach(function (dep, key) {
              // 如果改变数组长度，触发更新，如果更改的数组长度小于取值长度，触发更新
              if (key === 'length' || key >= value) {
                  run(dep);
              }
          });
          return;
      }
      if (key != null) {
          var effects = depsMap.get(key);
          run(effects);
      }
      switch (type) {
          case 'add':
              if (isArray(target)) {
                  if (parseInt(key) === key) {
                      run(depsMap.get('length'));
                  }
              }
              break;
      }
  }

  var mutableHandlers = {
      // 取值时将effect存储 recevier是代理后的对象
      get: function (target, key, recevier) {
          var res = Reflect.get(target, key, recevier);
          // 如果是内置Symbol，排除依赖收集
          if (typeof key === 'symbol')
              return res;
          track(target, key);
          // if (res.__v_isRef) return res.value
          // 取值时，是对象再代理
          return isObject(res) ? reactive(res) : res;
      },
      // 更新值的时候将effect更新
      set: function (target, key, value, recevier) {
          var oldVal = target[key];
          // 是否是原有的属性（数组根据索引长度判断）
          var hadKey = isArray(target) && (parseInt(key, 10) + '' === key) ?
              Number(key) < target.length :
              hasOwn(target, key);
          var result = Reflect.set(target, key, value, recevier);
          if (!hadKey) {
              // 没有该属性，触发新增操作
              trigger(target, 'add', key, value);
          }
          else if (hasChange(oldVal, value)) {
              //  值改变，修改属性
              trigger(target, 'set', key, value);
          }
          else ;
          effectStack.forEach(function (effect) { return effect(); });
          return result;
      }
  };

  var reactive = function (target) {
      return createReactiveObject(target, mutableHandlers);
  };
  // 映射表中的key必须是对象
  var reactiveMap = new WeakMap();
  function createReactiveObject(target, baseHandle) {
      if (!isObject(target))
          return target;
      // 如果已经代理过了，不需要再次代理
      var existProxy = reactiveMap.get(target);
      if (existProxy)
          return existProxy;
      // 代理 放到映射表中 返回代理
      var proxy = new Proxy(target, baseHandle);
      reactiveMap.set(target, proxy);
      return proxy;
  }

  var ComputedRefImpl = /** @class */ (function () {
      function ComputedRefImpl(getter, setter) {
          var _this = this;
          this.setter = setter;
          this.__v_isReadonly = true;
          this.__V_isRef = true;
          this._dirty = true;
          // 默认getter执行的时候，依赖一个内置的effect
          this.effect = effect(getter, {
              lazy: true,
              scheduler: function (effect) {
                  _this._dirty = true; // 依赖数据变化，需要重新缓存
                  trigger(_this, 'set', 'value');
              }
          });
      }
      Object.defineProperty(ComputedRefImpl.prototype, "value", {
          // 类属性描述器
          get: function () {
              if (this._dirty) { // 缓存
                  this._value = this.effect();
                  track(this, 'value');
                  this._dirty = false;
              }
              return this._value;
          },
          set: function (nVal) {
              this.setter(nVal);
          },
          enumerable: false,
          configurable: true
      });
      return ComputedRefImpl;
  }());
  function computed(getterOrOptions) {
      var getter;
      var setter;
      if (isFunction(getterOrOptions)) {
          getter = getterOrOptions;
          setter = function () { console.log('computed not set value'); };
      }
      else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
      }
      return new ComputedRefImpl(getter, setter);
  }

  var RefImpl = /** @class */ (function () {
      function RefImpl(rawVal) {
          this.rawVal = rawVal;
          this.__v_isRef = true;
          this._value = convert(rawVal);
      }
      Object.defineProperty(RefImpl.prototype, "value", {
          get: function () {
              track(this, 'value');
              return this._value;
          },
          set: function (nVal) {
              if (hasChange(this.rawVal, nVal)) {
                  this.rawVal = nVal;
                  this._value = convert(nVal);
                  trigger(this, 'set', 'value');
              }
          },
          enumerable: false,
          configurable: true
      });
      return RefImpl;
  }());
  function ref(rawVal) {
      return new RefImpl(rawVal);
  }
  function convert(val) {
      return isObject(val) ? reactive(val) : val;
  }
  var ObjectRefImpl = /** @class */ (function () {
      function ObjectRefImpl(object, key) {
          this.object = object;
          this.key = key;
      }
      Object.defineProperty(ObjectRefImpl.prototype, "value", {
          get: function () {
              return this.object[this.key];
          },
          set: function (nVal) {
              this.object[this.key] = nVal;
          },
          enumerable: false,
          configurable: true
      });
      return ObjectRefImpl;
  }());
  function toRefs(object) {
      var result = Array.isArray(object) ? new Array(object.length) : {};
      for (var key in object) {
          result[key] = new ObjectRefImpl(object, key);
      }
      return result;
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function createVNode(type, props, children) {
      if (props === void 0) { props = {}; }
      if (children === void 0) { children = null; }
      // 判断type是元素还是组件
      var shapeFlag = isString(type)
          ? 1 /* ELEMENT */
          : isObject(type)
              ? 4 /* STATEFUL_COMPONENT */
              : 0;
      var vnode = {
          type: type,
          props: props,
          children: children,
          component: null,
          el: null,
          key: props.key,
          shapeFlag: shapeFlag,
      };
      if (isArray(children)) {
          vnode.shapeFlag |= 16 /* ARRAY_CHILDREN */;
      }
      else {
          vnode.shapeFlag |= 8 /* TEXT_CHILDREN */;
      }
      return vnode;
  }

  function createAppApi(render) {
      return function (component) {
          var app = {
              mount: function (container) {
                  var vNode = createVNode(component);
                  render(vNode, container);
              },
          };
          return app;
      };
  }

  function createComponentInstance(vNode) {
      var instance = {
          type: vNode.type,
          props: {},
          vNode: vNode,
          render: null,
          setupState: null,
          isMounted: false,
          subtree: null,
      };
      return instance;
  }
  function finishComponentSetup(instance) {
      var Component = instance.type;
      // 如果有render函数，以render函数中的内容为准
      if (Component.render && !instance.render) {
          instance.render = Component.render;
      }
      else if (!instance.render) ;
  }
  function handleSetupResult(instance, result) {
      if (isFunction(result)) {
          instance.render = result;
      }
      else {
          instance.setupState = result;
      }
      // 兼容vue2处理方法
      finishComponentSetup(instance);
  }
  function setupStatefulComponent(instance) {
      var Component = instance.type;
      var setup = Component.setup;
      if (setup) {
          var setupResult = setup(instance.props);
          // setup返回状态，或者render函数
          handleSetupResult(instance, setupResult);
      }
  }
  function setupComponent(instance) {
      // 属性处理
      setupStatefulComponent(instance);
  }

  function createRenderer(options) {
      var hostCreateElement = options.createElement, hostInset = options.inset, hostRemove = options.remove, hostSetElementText = options.setElementText, hostCreateTextNode = options.createTextNode, hostPatchProps = options.patchProps;
      var patch = function (prevNode, vNode, container) {
          var shapeFlag = vNode.shapeFlag;
          var mountElement = function (vNode, container) {
              var shapeFlag = vNode.shapeFlag, props = vNode.props, type = vNode.type, children = vNode.children;
              // 创建
              var el = (vNode.el = hostCreateElement(type));
              // 子节点
              if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                  hostSetElementText(el, children);
              }
              else {
                  moutChildren(children);
              }
              // 属性
              if (props) {
                  for (var key in props) {
                      hostPatchProps(el, key, null, props[key]);
                  }
              }
              // 插入节点
              hostInset(el, container);
          };
          function moutChildren(children, el) {
              for (var i = 0; i < children.length; i++) {
                  patch(null, children[i], container);
              }
          }
          var mountComponent = function (vNode, container) {
              // 每个组件有一个effect，达到组件级更新的效果
              // 组件的创建
              var instance = (vNode.component = createComponentInstance(vNode));
              // 组件的setup方法
              setupComponent(instance);
              // 渲染effect
              setupRenderEffect(instance, container);
          };
          function setupRenderEffect(instance, container) {
              effect(function () {
                  if (!instance.isMounted) {
                      // 组件的创建渲染
                      var subtree = (instance.subtree = instance.render());
                      patch(null, subtree, container);
                      instance.isMounted = true;
                  }
                  else {
                      // 组件的更新渲染
                      console.log('更新');
                  }
              });
          }
          var processElement = function (prevNode, vNode, container) {
              if (prevNode == null) {
                  // 元素挂载
                  mountElement(vNode, container);
              }
          };
          var processComponent = function (prevNode, vNode, container) {
              if (prevNode == null) {
                  // 组件挂载
                  mountComponent(vNode, container);
              }
          };
          // & 包含类型
          // 1100 & 0001
          if (shapeFlag & 1 /* ELEMENT */) {
              // 元素
              processElement(prevNode, vNode, container);
          }
          else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
              //1100 0100
              // 组件
              processComponent(prevNode, vNode, container);
          }
      };
      var render = function (vNode, container) {
          // 初次渲染 没有prevNode
          patch(null, vNode, container);
      };
      return {
          createApp: createAppApi(render),
      };
  }

  function h(type, props, children) {
      if (props === void 0) { props = {}; }
      if (children === void 0) { children = null; }
      return createVNode(type, props, children);
  }

  var nodeOpts = {
      createElement: function (type) {
          return document.createElement(type);
      },
      inset: function (child, parent, anchor) {
          if (anchor === void 0) { anchor = null; }
          parent.insertBefore(child, anchor);
      },
      remove: function (child) {
          var parent = child.parentNode;
          if (parent)
              parent.removeChild(child);
      },
      setElementText: function (el, content) {
          el.textContent = content;
      },
      createTextNode: function (content) {
          return document.createTextNode(content);
      },
  };

  function patchStyle(el, prev, next) {
      var style = el.style;
      if (!next) {
          el.removeAttribute("style");
      }
      else {
          for (var key in next) {
              style[key] = next[key];
          }
          if (prev) {
              for (var key in prev) {
                  if (!next[key]) {
                      style[key] = "";
                  }
              }
          }
      }
  }
  function patchClass(el, next) {
      if (!next)
          next = "";
      el.className = next;
  }
  function pathAttr(el, key, next) {
      if (!next) {
          el.removeAttribute(key);
      }
      else {
          el.setAttribute(key, next);
      }
  }
  function patchProps(el, key, prevVal, nextVal) {
      switch (key) {
          case "style":
              patchStyle(el, prevVal, nextVal);
              break;
          case "className":
              patchClass(el, nextVal);
          default:
              pathAttr(el, key, nextVal);
      }
  }

  function ensureRenderer() {
      return createRenderer(__assign(__assign({}, nodeOpts), { patchProps: patchProps }));
  }
  function createApp(rootComponent) {
      var app = ensureRenderer().createApp(rootComponent);
      var mount = app.mount;
      app.mount = function (container) {
          container = document.querySelector(container);
          container.innerHTML = "";
          mount(container);
      };
      return app;
  }

  exports.computed = computed;
  exports.createApp = createApp;
  exports.createRenderer = createRenderer;
  exports.effect = effect;
  exports.h = h;
  exports.reactive = reactive;
  exports.ref = ref;
  exports.toRefs = toRefs;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
