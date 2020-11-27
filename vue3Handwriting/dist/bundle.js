(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  var isObject = function (obj) { return typeof obj === 'object' && obj != null; };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = function (target, key) { return hasOwnProperty.call(target, key); };
  var isArray = function (obj) { return Array.isArray(obj); };
  var isFunction = function (fn) { return typeof fn === 'function'; };
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

  function createAppApi() {
      return function (component) {
          var app = {
              mount: function (container) { }
          };
          return app;
      };
  }

  function createRenderer(options) {
      return {
          createApp: createAppApi()
      };
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
  exports.reactive = reactive;
  exports.ref = ref;
  exports.toRefs = toRefs;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
