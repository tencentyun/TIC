(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TIC"] = factory();
	else
		root["TIC"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/TIC.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/core-js/modules/_a-function.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_a-function.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (it) {\n  if (typeof it != 'function') throw TypeError(it + ' is not a function!');\n  return it;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_a-function.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_add-to-unscopables.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/_add-to-unscopables.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 22.1.3.31 Array.prototype[@@unscopables]\nvar UNSCOPABLES = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('unscopables');\nvar ArrayProto = Array.prototype;\nif (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\")(ArrayProto, UNSCOPABLES, {});\nmodule.exports = function (key) {\n  ArrayProto[UNSCOPABLES][key] = true;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_add-to-unscopables.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_an-instance.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_an-instance.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (it, Constructor, name, forbiddenField) {\n  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {\n    throw TypeError(name + ': incorrect invocation!');\n  } return it;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_an-instance.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_an-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_an-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nmodule.exports = function (it) {\n  if (!isObject(it)) throw TypeError(it + ' is not an object!');\n  return it;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_an-object.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_array-includes.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_array-includes.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// false -> Array#indexOf\n// true  -> Array#includes\nvar toIObject = __webpack_require__(/*! ./_to-iobject */ \"./node_modules/core-js/modules/_to-iobject.js\");\nvar toLength = __webpack_require__(/*! ./_to-length */ \"./node_modules/core-js/modules/_to-length.js\");\nvar toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ \"./node_modules/core-js/modules/_to-absolute-index.js\");\nmodule.exports = function (IS_INCLUDES) {\n  return function ($this, el, fromIndex) {\n    var O = toIObject($this);\n    var length = toLength(O.length);\n    var index = toAbsoluteIndex(fromIndex, length);\n    var value;\n    // Array#includes uses SameValueZero equality algorithm\n    // eslint-disable-next-line no-self-compare\n    if (IS_INCLUDES && el != el) while (length > index) {\n      value = O[index++];\n      // eslint-disable-next-line no-self-compare\n      if (value != value) return true;\n    // Array#indexOf ignores holes, Array#includes - not\n    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {\n      if (O[index] === el) return IS_INCLUDES || index || 0;\n    } return !IS_INCLUDES && -1;\n  };\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_array-includes.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_classof.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_classof.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// getting tag from 19.1.3.6 Object.prototype.toString()\nvar cof = __webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\");\nvar TAG = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('toStringTag');\n// ES3 wrong here\nvar ARG = cof(function () { return arguments; }()) == 'Arguments';\n\n// fallback for IE11 Script Access Denied error\nvar tryGet = function (it, key) {\n  try {\n    return it[key];\n  } catch (e) { /* empty */ }\n};\n\nmodule.exports = function (it) {\n  var O, T, B;\n  return it === undefined ? 'Undefined' : it === null ? 'Null'\n    // @@toStringTag case\n    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T\n    // builtinTag case\n    : ARG ? cof(O)\n    // ES3 arguments fallback\n    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_classof.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_cof.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_cof.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var toString = {}.toString;\n\nmodule.exports = function (it) {\n  return toString.call(it).slice(8, -1);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_cof.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_core.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_core.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var core = module.exports = { version: '2.6.1' };\nif (typeof __e == 'number') __e = core; // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_core.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_ctx.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_ctx.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// optional / simple context binding\nvar aFunction = __webpack_require__(/*! ./_a-function */ \"./node_modules/core-js/modules/_a-function.js\");\nmodule.exports = function (fn, that, length) {\n  aFunction(fn);\n  if (that === undefined) return fn;\n  switch (length) {\n    case 1: return function (a) {\n      return fn.call(that, a);\n    };\n    case 2: return function (a, b) {\n      return fn.call(that, a, b);\n    };\n    case 3: return function (a, b, c) {\n      return fn.call(that, a, b, c);\n    };\n  }\n  return function (/* ...args */) {\n    return fn.apply(that, arguments);\n  };\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_ctx.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_defined.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_defined.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// 7.2.1 RequireObjectCoercible(argument)\nmodule.exports = function (it) {\n  if (it == undefined) throw TypeError(\"Can't call method on  \" + it);\n  return it;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_defined.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_descriptors.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_descriptors.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Thank's IE8 for his funny defineProperty\nmodule.exports = !__webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\")(function () {\n  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;\n});\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_descriptors.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_dom-create.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_dom-create.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar document = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\").document;\n// typeof document.createElement is 'object' in old IE\nvar is = isObject(document) && isObject(document.createElement);\nmodule.exports = function (it) {\n  return is ? document.createElement(it) : {};\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_dom-create.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_enum-bug-keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_enum-bug-keys.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// IE 8- don't enum bug keys\nmodule.exports = (\n  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'\n).split(',');\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_enum-bug-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_enum-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_enum-keys.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// all enumerable object keys, includes symbols\nvar getKeys = __webpack_require__(/*! ./_object-keys */ \"./node_modules/core-js/modules/_object-keys.js\");\nvar gOPS = __webpack_require__(/*! ./_object-gops */ \"./node_modules/core-js/modules/_object-gops.js\");\nvar pIE = __webpack_require__(/*! ./_object-pie */ \"./node_modules/core-js/modules/_object-pie.js\");\nmodule.exports = function (it) {\n  var result = getKeys(it);\n  var getSymbols = gOPS.f;\n  if (getSymbols) {\n    var symbols = getSymbols(it);\n    var isEnum = pIE.f;\n    var i = 0;\n    var key;\n    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);\n  } return result;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_enum-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_export.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_export.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar core = __webpack_require__(/*! ./_core */ \"./node_modules/core-js/modules/_core.js\");\nvar hide = __webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\");\nvar redefine = __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\");\nvar ctx = __webpack_require__(/*! ./_ctx */ \"./node_modules/core-js/modules/_ctx.js\");\nvar PROTOTYPE = 'prototype';\n\nvar $export = function (type, name, source) {\n  var IS_FORCED = type & $export.F;\n  var IS_GLOBAL = type & $export.G;\n  var IS_STATIC = type & $export.S;\n  var IS_PROTO = type & $export.P;\n  var IS_BIND = type & $export.B;\n  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];\n  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});\n  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});\n  var key, own, out, exp;\n  if (IS_GLOBAL) source = name;\n  for (key in source) {\n    // contains in native\n    own = !IS_FORCED && target && target[key] !== undefined;\n    // export native or passed\n    out = (own ? target : source)[key];\n    // bind timers to global for call from export context\n    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;\n    // extend global\n    if (target) redefine(target, key, out, type & $export.U);\n    // export\n    if (exports[key] != out) hide(exports, key, exp);\n    if (IS_PROTO && expProto[key] != out) expProto[key] = out;\n  }\n};\nglobal.core = core;\n// type bitmap\n$export.F = 1;   // forced\n$export.G = 2;   // global\n$export.S = 4;   // static\n$export.P = 8;   // proto\n$export.B = 16;  // bind\n$export.W = 32;  // wrap\n$export.U = 64;  // safe\n$export.R = 128; // real proto method for `library`\nmodule.exports = $export;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_export.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_fails.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_fails.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (exec) {\n  try {\n    return !!exec();\n  } catch (e) {\n    return true;\n  }\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_fails.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_flags.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_flags.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// 21.2.5.3 get RegExp.prototype.flags\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nmodule.exports = function () {\n  var that = anObject(this);\n  var result = '';\n  if (that.global) result += 'g';\n  if (that.ignoreCase) result += 'i';\n  if (that.multiline) result += 'm';\n  if (that.unicode) result += 'u';\n  if (that.sticky) result += 'y';\n  return result;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_flags.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_for-of.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_for-of.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ctx = __webpack_require__(/*! ./_ctx */ \"./node_modules/core-js/modules/_ctx.js\");\nvar call = __webpack_require__(/*! ./_iter-call */ \"./node_modules/core-js/modules/_iter-call.js\");\nvar isArrayIter = __webpack_require__(/*! ./_is-array-iter */ \"./node_modules/core-js/modules/_is-array-iter.js\");\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar toLength = __webpack_require__(/*! ./_to-length */ \"./node_modules/core-js/modules/_to-length.js\");\nvar getIterFn = __webpack_require__(/*! ./core.get-iterator-method */ \"./node_modules/core-js/modules/core.get-iterator-method.js\");\nvar BREAK = {};\nvar RETURN = {};\nvar exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {\n  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);\n  var f = ctx(fn, that, entries ? 2 : 1);\n  var index = 0;\n  var length, step, iterator, result;\n  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');\n  // fast case for arrays with default iterator\n  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {\n    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);\n    if (result === BREAK || result === RETURN) return result;\n  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {\n    result = call(iterator, f, step.value, entries);\n    if (result === BREAK || result === RETURN) return result;\n  }\n};\nexports.BREAK = BREAK;\nexports.RETURN = RETURN;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_for-of.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_global.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028\nvar global = module.exports = typeof window != 'undefined' && window.Math == Math\n  ? window : typeof self != 'undefined' && self.Math == Math ? self\n  // eslint-disable-next-line no-new-func\n  : Function('return this')();\nif (typeof __g == 'number') __g = global; // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_global.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_has.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_has.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var hasOwnProperty = {}.hasOwnProperty;\nmodule.exports = function (it, key) {\n  return hasOwnProperty.call(it, key);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_has.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_hide.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_hide.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var dP = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\");\nvar createDesc = __webpack_require__(/*! ./_property-desc */ \"./node_modules/core-js/modules/_property-desc.js\");\nmodule.exports = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") ? function (object, key, value) {\n  return dP.f(object, key, createDesc(1, value));\n} : function (object, key, value) {\n  object[key] = value;\n  return object;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_hide.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_html.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_html.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var document = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\").document;\nmodule.exports = document && document.documentElement;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_html.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_ie8-dom-define.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_ie8-dom-define.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = !__webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") && !__webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\")(function () {\n  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ \"./node_modules/core-js/modules/_dom-create.js\")('div'), 'a', { get: function () { return 7; } }).a != 7;\n});\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_ie8-dom-define.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_inherit-if-required.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_inherit-if-required.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar setPrototypeOf = __webpack_require__(/*! ./_set-proto */ \"./node_modules/core-js/modules/_set-proto.js\").set;\nmodule.exports = function (that, target, C) {\n  var S = target.constructor;\n  var P;\n  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {\n    setPrototypeOf(that, P);\n  } return that;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_inherit-if-required.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_invoke.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_invoke.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// fast apply, http://jsperf.lnkit.com/fast-apply/5\nmodule.exports = function (fn, args, that) {\n  var un = that === undefined;\n  switch (args.length) {\n    case 0: return un ? fn()\n                      : fn.call(that);\n    case 1: return un ? fn(args[0])\n                      : fn.call(that, args[0]);\n    case 2: return un ? fn(args[0], args[1])\n                      : fn.call(that, args[0], args[1]);\n    case 3: return un ? fn(args[0], args[1], args[2])\n                      : fn.call(that, args[0], args[1], args[2]);\n    case 4: return un ? fn(args[0], args[1], args[2], args[3])\n                      : fn.call(that, args[0], args[1], args[2], args[3]);\n  } return fn.apply(that, args);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_invoke.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iobject.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_iobject.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// fallback for non-array-like ES3 and non-enumerable old V8 strings\nvar cof = __webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\");\n// eslint-disable-next-line no-prototype-builtins\nmodule.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {\n  return cof(it) == 'String' ? it.split('') : Object(it);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iobject.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_is-array-iter.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_is-array-iter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// check on default Array iterator\nvar Iterators = __webpack_require__(/*! ./_iterators */ \"./node_modules/core-js/modules/_iterators.js\");\nvar ITERATOR = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('iterator');\nvar ArrayProto = Array.prototype;\n\nmodule.exports = function (it) {\n  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_is-array-iter.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_is-array.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/_is-array.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 7.2.2 IsArray(argument)\nvar cof = __webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\");\nmodule.exports = Array.isArray || function isArray(arg) {\n  return cof(arg) == 'Array';\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_is-array.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_is-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_is-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (it) {\n  return typeof it === 'object' ? it !== null : typeof it === 'function';\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_is-object.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iter-call.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-call.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// call something on iterator step with safe closing on error\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nmodule.exports = function (iterator, fn, value, entries) {\n  try {\n    return entries ? fn(anObject(value)[0], value[1]) : fn(value);\n  // 7.4.6 IteratorClose(iterator, completion)\n  } catch (e) {\n    var ret = iterator['return'];\n    if (ret !== undefined) anObject(ret.call(iterator));\n    throw e;\n  }\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iter-call.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iter-create.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-create.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar create = __webpack_require__(/*! ./_object-create */ \"./node_modules/core-js/modules/_object-create.js\");\nvar descriptor = __webpack_require__(/*! ./_property-desc */ \"./node_modules/core-js/modules/_property-desc.js\");\nvar setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ \"./node_modules/core-js/modules/_set-to-string-tag.js\");\nvar IteratorPrototype = {};\n\n// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()\n__webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\")(IteratorPrototype, __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('iterator'), function () { return this; });\n\nmodule.exports = function (Constructor, NAME, next) {\n  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });\n  setToStringTag(Constructor, NAME + ' Iterator');\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iter-create.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iter-define.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-define.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar LIBRARY = __webpack_require__(/*! ./_library */ \"./node_modules/core-js/modules/_library.js\");\nvar $export = __webpack_require__(/*! ./_export */ \"./node_modules/core-js/modules/_export.js\");\nvar redefine = __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\");\nvar hide = __webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\");\nvar Iterators = __webpack_require__(/*! ./_iterators */ \"./node_modules/core-js/modules/_iterators.js\");\nvar $iterCreate = __webpack_require__(/*! ./_iter-create */ \"./node_modules/core-js/modules/_iter-create.js\");\nvar setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ \"./node_modules/core-js/modules/_set-to-string-tag.js\");\nvar getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ \"./node_modules/core-js/modules/_object-gpo.js\");\nvar ITERATOR = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('iterator');\nvar BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`\nvar FF_ITERATOR = '@@iterator';\nvar KEYS = 'keys';\nvar VALUES = 'values';\n\nvar returnThis = function () { return this; };\n\nmodule.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {\n  $iterCreate(Constructor, NAME, next);\n  var getMethod = function (kind) {\n    if (!BUGGY && kind in proto) return proto[kind];\n    switch (kind) {\n      case KEYS: return function keys() { return new Constructor(this, kind); };\n      case VALUES: return function values() { return new Constructor(this, kind); };\n    } return function entries() { return new Constructor(this, kind); };\n  };\n  var TAG = NAME + ' Iterator';\n  var DEF_VALUES = DEFAULT == VALUES;\n  var VALUES_BUG = false;\n  var proto = Base.prototype;\n  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];\n  var $default = $native || getMethod(DEFAULT);\n  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;\n  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;\n  var methods, key, IteratorPrototype;\n  // Fix native\n  if ($anyNative) {\n    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));\n    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {\n      // Set @@toStringTag to native iterators\n      setToStringTag(IteratorPrototype, TAG, true);\n      // fix for some old engines\n      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);\n    }\n  }\n  // fix Array#{values, @@iterator}.name in V8 / FF\n  if (DEF_VALUES && $native && $native.name !== VALUES) {\n    VALUES_BUG = true;\n    $default = function values() { return $native.call(this); };\n  }\n  // Define iterator\n  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {\n    hide(proto, ITERATOR, $default);\n  }\n  // Plug for library\n  Iterators[NAME] = $default;\n  Iterators[TAG] = returnThis;\n  if (DEFAULT) {\n    methods = {\n      values: DEF_VALUES ? $default : getMethod(VALUES),\n      keys: IS_SET ? $default : getMethod(KEYS),\n      entries: $entries\n    };\n    if (FORCED) for (key in methods) {\n      if (!(key in proto)) redefine(proto, key, methods[key]);\n    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);\n  }\n  return methods;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iter-define.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iter-detect.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-detect.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ITERATOR = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('iterator');\nvar SAFE_CLOSING = false;\n\ntry {\n  var riter = [7][ITERATOR]();\n  riter['return'] = function () { SAFE_CLOSING = true; };\n  // eslint-disable-next-line no-throw-literal\n  Array.from(riter, function () { throw 2; });\n} catch (e) { /* empty */ }\n\nmodule.exports = function (exec, skipClosing) {\n  if (!skipClosing && !SAFE_CLOSING) return false;\n  var safe = false;\n  try {\n    var arr = [7];\n    var iter = arr[ITERATOR]();\n    iter.next = function () { return { done: safe = true }; };\n    arr[ITERATOR] = function () { return iter; };\n    exec(arr);\n  } catch (e) { /* empty */ }\n  return safe;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iter-detect.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iter-step.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-step.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (done, value) {\n  return { value: value, done: !!done };\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iter-step.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_iterators.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iterators.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_iterators.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_library.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_library.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = false;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_library.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_meta.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_meta.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var META = __webpack_require__(/*! ./_uid */ \"./node_modules/core-js/modules/_uid.js\")('meta');\nvar isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar setDesc = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\").f;\nvar id = 0;\nvar isExtensible = Object.isExtensible || function () {\n  return true;\n};\nvar FREEZE = !__webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\")(function () {\n  return isExtensible(Object.preventExtensions({}));\n});\nvar setMeta = function (it) {\n  setDesc(it, META, { value: {\n    i: 'O' + ++id, // object ID\n    w: {}          // weak collections IDs\n  } });\n};\nvar fastKey = function (it, create) {\n  // return primitive with prefix\n  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;\n  if (!has(it, META)) {\n    // can't set metadata to uncaught frozen object\n    if (!isExtensible(it)) return 'F';\n    // not necessary to add metadata\n    if (!create) return 'E';\n    // add missing metadata\n    setMeta(it);\n  // return object ID\n  } return it[META].i;\n};\nvar getWeak = function (it, create) {\n  if (!has(it, META)) {\n    // can't set metadata to uncaught frozen object\n    if (!isExtensible(it)) return true;\n    // not necessary to add metadata\n    if (!create) return false;\n    // add missing metadata\n    setMeta(it);\n  // return hash weak collections IDs\n  } return it[META].w;\n};\n// add metadata on freeze-family methods calling\nvar onFreeze = function (it) {\n  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);\n  return it;\n};\nvar meta = module.exports = {\n  KEY: META,\n  NEED: false,\n  fastKey: fastKey,\n  getWeak: getWeak,\n  onFreeze: onFreeze\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_meta.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_microtask.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_microtask.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar macrotask = __webpack_require__(/*! ./_task */ \"./node_modules/core-js/modules/_task.js\").set;\nvar Observer = global.MutationObserver || global.WebKitMutationObserver;\nvar process = global.process;\nvar Promise = global.Promise;\nvar isNode = __webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\")(process) == 'process';\n\nmodule.exports = function () {\n  var head, last, notify;\n\n  var flush = function () {\n    var parent, fn;\n    if (isNode && (parent = process.domain)) parent.exit();\n    while (head) {\n      fn = head.fn;\n      head = head.next;\n      try {\n        fn();\n      } catch (e) {\n        if (head) notify();\n        else last = undefined;\n        throw e;\n      }\n    } last = undefined;\n    if (parent) parent.enter();\n  };\n\n  // Node.js\n  if (isNode) {\n    notify = function () {\n      process.nextTick(flush);\n    };\n  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339\n  } else if (Observer && !(global.navigator && global.navigator.standalone)) {\n    var toggle = true;\n    var node = document.createTextNode('');\n    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new\n    notify = function () {\n      node.data = toggle = !toggle;\n    };\n  // environments with maybe non-completely correct, but existent Promise\n  } else if (Promise && Promise.resolve) {\n    // Promise.resolve without an argument throws an error in LG WebOS 2\n    var promise = Promise.resolve(undefined);\n    notify = function () {\n      promise.then(flush);\n    };\n  // for other environments - macrotask based on:\n  // - setImmediate\n  // - MessageChannel\n  // - window.postMessag\n  // - onreadystatechange\n  // - setTimeout\n  } else {\n    notify = function () {\n      // strange IE + webpack dev server bug - use .call(global)\n      macrotask.call(global, flush);\n    };\n  }\n\n  return function (fn) {\n    var task = { fn: fn, next: undefined };\n    if (last) last.next = task;\n    if (!head) {\n      head = task;\n      notify();\n    } last = task;\n  };\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_microtask.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_new-promise-capability.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/_new-promise-capability.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// 25.4.1.5 NewPromiseCapability(C)\nvar aFunction = __webpack_require__(/*! ./_a-function */ \"./node_modules/core-js/modules/_a-function.js\");\n\nfunction PromiseCapability(C) {\n  var resolve, reject;\n  this.promise = new C(function ($$resolve, $$reject) {\n    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');\n    resolve = $$resolve;\n    reject = $$reject;\n  });\n  this.resolve = aFunction(resolve);\n  this.reject = aFunction(reject);\n}\n\nmodule.exports.f = function (C) {\n  return new PromiseCapability(C);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_new-promise-capability.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-assign.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_object-assign.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// 19.1.2.1 Object.assign(target, source, ...)\nvar getKeys = __webpack_require__(/*! ./_object-keys */ \"./node_modules/core-js/modules/_object-keys.js\");\nvar gOPS = __webpack_require__(/*! ./_object-gops */ \"./node_modules/core-js/modules/_object-gops.js\");\nvar pIE = __webpack_require__(/*! ./_object-pie */ \"./node_modules/core-js/modules/_object-pie.js\");\nvar toObject = __webpack_require__(/*! ./_to-object */ \"./node_modules/core-js/modules/_to-object.js\");\nvar IObject = __webpack_require__(/*! ./_iobject */ \"./node_modules/core-js/modules/_iobject.js\");\nvar $assign = Object.assign;\n\n// should work with symbols and should have deterministic property order (V8 bug)\nmodule.exports = !$assign || __webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\")(function () {\n  var A = {};\n  var B = {};\n  // eslint-disable-next-line no-undef\n  var S = Symbol();\n  var K = 'abcdefghijklmnopqrst';\n  A[S] = 7;\n  K.split('').forEach(function (k) { B[k] = k; });\n  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;\n}) ? function assign(target, source) { // eslint-disable-line no-unused-vars\n  var T = toObject(target);\n  var aLen = arguments.length;\n  var index = 1;\n  var getSymbols = gOPS.f;\n  var isEnum = pIE.f;\n  while (aLen > index) {\n    var S = IObject(arguments[index++]);\n    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);\n    var length = keys.length;\n    var j = 0;\n    var key;\n    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];\n  } return T;\n} : $assign;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-assign.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-create.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_object-create.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar dPs = __webpack_require__(/*! ./_object-dps */ \"./node_modules/core-js/modules/_object-dps.js\");\nvar enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ \"./node_modules/core-js/modules/_enum-bug-keys.js\");\nvar IE_PROTO = __webpack_require__(/*! ./_shared-key */ \"./node_modules/core-js/modules/_shared-key.js\")('IE_PROTO');\nvar Empty = function () { /* empty */ };\nvar PROTOTYPE = 'prototype';\n\n// Create object with fake `null` prototype: use iframe Object with cleared prototype\nvar createDict = function () {\n  // Thrash, waste and sodomy: IE GC bug\n  var iframe = __webpack_require__(/*! ./_dom-create */ \"./node_modules/core-js/modules/_dom-create.js\")('iframe');\n  var i = enumBugKeys.length;\n  var lt = '<';\n  var gt = '>';\n  var iframeDocument;\n  iframe.style.display = 'none';\n  __webpack_require__(/*! ./_html */ \"./node_modules/core-js/modules/_html.js\").appendChild(iframe);\n  iframe.src = 'javascript:'; // eslint-disable-line no-script-url\n  // createDict = iframe.contentWindow.Object;\n  // html.removeChild(iframe);\n  iframeDocument = iframe.contentWindow.document;\n  iframeDocument.open();\n  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);\n  iframeDocument.close();\n  createDict = iframeDocument.F;\n  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];\n  return createDict();\n};\n\nmodule.exports = Object.create || function create(O, Properties) {\n  var result;\n  if (O !== null) {\n    Empty[PROTOTYPE] = anObject(O);\n    result = new Empty();\n    Empty[PROTOTYPE] = null;\n    // add \"__proto__\" for Object.getPrototypeOf polyfill\n    result[IE_PROTO] = O;\n  } else result = createDict();\n  return Properties === undefined ? result : dPs(result, Properties);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-create.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-dp.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dp.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ \"./node_modules/core-js/modules/_ie8-dom-define.js\");\nvar toPrimitive = __webpack_require__(/*! ./_to-primitive */ \"./node_modules/core-js/modules/_to-primitive.js\");\nvar dP = Object.defineProperty;\n\nexports.f = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") ? Object.defineProperty : function defineProperty(O, P, Attributes) {\n  anObject(O);\n  P = toPrimitive(P, true);\n  anObject(Attributes);\n  if (IE8_DOM_DEFINE) try {\n    return dP(O, P, Attributes);\n  } catch (e) { /* empty */ }\n  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');\n  if ('value' in Attributes) O[P] = Attributes.value;\n  return O;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-dp.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-dps.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dps.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var dP = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\");\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar getKeys = __webpack_require__(/*! ./_object-keys */ \"./node_modules/core-js/modules/_object-keys.js\");\n\nmodule.exports = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") ? Object.defineProperties : function defineProperties(O, Properties) {\n  anObject(O);\n  var keys = getKeys(Properties);\n  var length = keys.length;\n  var i = 0;\n  var P;\n  while (length > i) dP.f(O, P = keys[i++], Properties[P]);\n  return O;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-dps.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopd.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopd.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pIE = __webpack_require__(/*! ./_object-pie */ \"./node_modules/core-js/modules/_object-pie.js\");\nvar createDesc = __webpack_require__(/*! ./_property-desc */ \"./node_modules/core-js/modules/_property-desc.js\");\nvar toIObject = __webpack_require__(/*! ./_to-iobject */ \"./node_modules/core-js/modules/_to-iobject.js\");\nvar toPrimitive = __webpack_require__(/*! ./_to-primitive */ \"./node_modules/core-js/modules/_to-primitive.js\");\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ \"./node_modules/core-js/modules/_ie8-dom-define.js\");\nvar gOPD = Object.getOwnPropertyDescriptor;\n\nexports.f = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") ? gOPD : function getOwnPropertyDescriptor(O, P) {\n  O = toIObject(O);\n  P = toPrimitive(P, true);\n  if (IE8_DOM_DEFINE) try {\n    return gOPD(O, P);\n  } catch (e) { /* empty */ }\n  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-gopd.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopn-ext.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopn-ext.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window\nvar toIObject = __webpack_require__(/*! ./_to-iobject */ \"./node_modules/core-js/modules/_to-iobject.js\");\nvar gOPN = __webpack_require__(/*! ./_object-gopn */ \"./node_modules/core-js/modules/_object-gopn.js\").f;\nvar toString = {}.toString;\n\nvar windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames\n  ? Object.getOwnPropertyNames(window) : [];\n\nvar getWindowNames = function (it) {\n  try {\n    return gOPN(it);\n  } catch (e) {\n    return windowNames.slice();\n  }\n};\n\nmodule.exports.f = function getOwnPropertyNames(it) {\n  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-gopn-ext.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopn.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopn.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)\nvar $keys = __webpack_require__(/*! ./_object-keys-internal */ \"./node_modules/core-js/modules/_object-keys-internal.js\");\nvar hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ \"./node_modules/core-js/modules/_enum-bug-keys.js\").concat('length', 'prototype');\n\nexports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {\n  return $keys(O, hiddenKeys);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-gopn.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-gops.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gops.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("exports.f = Object.getOwnPropertySymbols;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-gops.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-gpo.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gpo.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar toObject = __webpack_require__(/*! ./_to-object */ \"./node_modules/core-js/modules/_to-object.js\");\nvar IE_PROTO = __webpack_require__(/*! ./_shared-key */ \"./node_modules/core-js/modules/_shared-key.js\")('IE_PROTO');\nvar ObjectProto = Object.prototype;\n\nmodule.exports = Object.getPrototypeOf || function (O) {\n  O = toObject(O);\n  if (has(O, IE_PROTO)) return O[IE_PROTO];\n  if (typeof O.constructor == 'function' && O instanceof O.constructor) {\n    return O.constructor.prototype;\n  } return O instanceof Object ? ObjectProto : null;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-gpo.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-keys-internal.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_object-keys-internal.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar toIObject = __webpack_require__(/*! ./_to-iobject */ \"./node_modules/core-js/modules/_to-iobject.js\");\nvar arrayIndexOf = __webpack_require__(/*! ./_array-includes */ \"./node_modules/core-js/modules/_array-includes.js\")(false);\nvar IE_PROTO = __webpack_require__(/*! ./_shared-key */ \"./node_modules/core-js/modules/_shared-key.js\")('IE_PROTO');\n\nmodule.exports = function (object, names) {\n  var O = toIObject(object);\n  var i = 0;\n  var result = [];\n  var key;\n  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);\n  // Don't enum bug & hidden keys\n  while (names.length > i) if (has(O, key = names[i++])) {\n    ~arrayIndexOf(result, key) || result.push(key);\n  }\n  return result;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-keys-internal.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-keys.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-keys.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 19.1.2.14 / 15.2.3.14 Object.keys(O)\nvar $keys = __webpack_require__(/*! ./_object-keys-internal */ \"./node_modules/core-js/modules/_object-keys-internal.js\");\nvar enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ \"./node_modules/core-js/modules/_enum-bug-keys.js\");\n\nmodule.exports = Object.keys || function keys(O) {\n  return $keys(O, enumBugKeys);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_object-pie.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-pie.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("exports.f = {}.propertyIsEnumerable;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_object-pie.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_perform.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_perform.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (exec) {\n  try {\n    return { e: false, v: exec() };\n  } catch (e) {\n    return { e: true, v: e };\n  }\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_perform.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_promise-resolve.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/_promise-resolve.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ \"./node_modules/core-js/modules/_new-promise-capability.js\");\n\nmodule.exports = function (C, x) {\n  anObject(C);\n  if (isObject(x) && x.constructor === C) return x;\n  var promiseCapability = newPromiseCapability.f(C);\n  var resolve = promiseCapability.resolve;\n  resolve(x);\n  return promiseCapability.promise;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_promise-resolve.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_property-desc.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_property-desc.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (bitmap, value) {\n  return {\n    enumerable: !(bitmap & 1),\n    configurable: !(bitmap & 2),\n    writable: !(bitmap & 4),\n    value: value\n  };\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_property-desc.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_redefine-all.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine-all.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var redefine = __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\");\nmodule.exports = function (target, src, safe) {\n  for (var key in src) redefine(target, key, src[key], safe);\n  return target;\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_redefine-all.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_redefine.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar hide = __webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\");\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar SRC = __webpack_require__(/*! ./_uid */ \"./node_modules/core-js/modules/_uid.js\")('src');\nvar TO_STRING = 'toString';\nvar $toString = Function[TO_STRING];\nvar TPL = ('' + $toString).split(TO_STRING);\n\n__webpack_require__(/*! ./_core */ \"./node_modules/core-js/modules/_core.js\").inspectSource = function (it) {\n  return $toString.call(it);\n};\n\n(module.exports = function (O, key, val, safe) {\n  var isFunction = typeof val == 'function';\n  if (isFunction) has(val, 'name') || hide(val, 'name', key);\n  if (O[key] === val) return;\n  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));\n  if (O === global) {\n    O[key] = val;\n  } else if (!safe) {\n    delete O[key];\n    hide(O, key, val);\n  } else if (O[key]) {\n    O[key] = val;\n  } else {\n    hide(O, key, val);\n  }\n// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative\n})(Function.prototype, TO_STRING, function toString() {\n  return typeof this == 'function' && this[SRC] || $toString.call(this);\n});\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_redefine.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_set-proto.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_set-proto.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Works with __proto__ only. Old v8 can't work with null proto objects.\n/* eslint-disable no-proto */\nvar isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar check = function (O, proto) {\n  anObject(O);\n  if (!isObject(proto) && proto !== null) throw TypeError(proto + \": can't set as prototype!\");\n};\nmodule.exports = {\n  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line\n    function (test, buggy, set) {\n      try {\n        set = __webpack_require__(/*! ./_ctx */ \"./node_modules/core-js/modules/_ctx.js\")(Function.call, __webpack_require__(/*! ./_object-gopd */ \"./node_modules/core-js/modules/_object-gopd.js\").f(Object.prototype, '__proto__').set, 2);\n        set(test, []);\n        buggy = !(test instanceof Array);\n      } catch (e) { buggy = true; }\n      return function setPrototypeOf(O, proto) {\n        check(O, proto);\n        if (buggy) O.__proto__ = proto;\n        else set(O, proto);\n        return O;\n      };\n    }({}, false) : undefined),\n  check: check\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_set-proto.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_set-species.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_set-species.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar dP = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\");\nvar DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\");\nvar SPECIES = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('species');\n\nmodule.exports = function (KEY) {\n  var C = global[KEY];\n  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {\n    configurable: true,\n    get: function () { return this; }\n  });\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_set-species.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_set-to-string-tag.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_set-to-string-tag.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var def = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\").f;\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar TAG = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('toStringTag');\n\nmodule.exports = function (it, tag, stat) {\n  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_set-to-string-tag.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_shared-key.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_shared-key.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var shared = __webpack_require__(/*! ./_shared */ \"./node_modules/core-js/modules/_shared.js\")('keys');\nvar uid = __webpack_require__(/*! ./_uid */ \"./node_modules/core-js/modules/_uid.js\");\nmodule.exports = function (key) {\n  return shared[key] || (shared[key] = uid(key));\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_shared-key.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_shared.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_shared.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var core = __webpack_require__(/*! ./_core */ \"./node_modules/core-js/modules/_core.js\");\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar SHARED = '__core-js_shared__';\nvar store = global[SHARED] || (global[SHARED] = {});\n\n(module.exports = function (key, value) {\n  return store[key] || (store[key] = value !== undefined ? value : {});\n})('versions', []).push({\n  version: core.version,\n  mode: __webpack_require__(/*! ./_library */ \"./node_modules/core-js/modules/_library.js\") ? 'pure' : 'global',\n  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'\n});\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_shared.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_species-constructor.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_species-constructor.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 7.3.20 SpeciesConstructor(O, defaultConstructor)\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar aFunction = __webpack_require__(/*! ./_a-function */ \"./node_modules/core-js/modules/_a-function.js\");\nvar SPECIES = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('species');\nmodule.exports = function (O, D) {\n  var C = anObject(O).constructor;\n  var S;\n  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_species-constructor.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_string-trim.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_string-trim.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var $export = __webpack_require__(/*! ./_export */ \"./node_modules/core-js/modules/_export.js\");\nvar defined = __webpack_require__(/*! ./_defined */ \"./node_modules/core-js/modules/_defined.js\");\nvar fails = __webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\");\nvar spaces = __webpack_require__(/*! ./_string-ws */ \"./node_modules/core-js/modules/_string-ws.js\");\nvar space = '[' + spaces + ']';\nvar non = '\\u200b\\u0085';\nvar ltrim = RegExp('^' + space + space + '*');\nvar rtrim = RegExp(space + space + '*$');\n\nvar exporter = function (KEY, exec, ALIAS) {\n  var exp = {};\n  var FORCE = fails(function () {\n    return !!spaces[KEY]() || non[KEY]() != non;\n  });\n  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];\n  if (ALIAS) exp[ALIAS] = fn;\n  $export($export.P + $export.F * FORCE, 'String', exp);\n};\n\n// 1 -> String#trimLeft\n// 2 -> String#trimRight\n// 3 -> String#trim\nvar trim = exporter.trim = function (string, TYPE) {\n  string = String(defined(string));\n  if (TYPE & 1) string = string.replace(ltrim, '');\n  if (TYPE & 2) string = string.replace(rtrim, '');\n  return string;\n};\n\nmodule.exports = exporter;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_string-trim.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_string-ws.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_string-ws.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = '\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003' +\n  '\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF';\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_string-ws.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_task.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_task.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ctx = __webpack_require__(/*! ./_ctx */ \"./node_modules/core-js/modules/_ctx.js\");\nvar invoke = __webpack_require__(/*! ./_invoke */ \"./node_modules/core-js/modules/_invoke.js\");\nvar html = __webpack_require__(/*! ./_html */ \"./node_modules/core-js/modules/_html.js\");\nvar cel = __webpack_require__(/*! ./_dom-create */ \"./node_modules/core-js/modules/_dom-create.js\");\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar process = global.process;\nvar setTask = global.setImmediate;\nvar clearTask = global.clearImmediate;\nvar MessageChannel = global.MessageChannel;\nvar Dispatch = global.Dispatch;\nvar counter = 0;\nvar queue = {};\nvar ONREADYSTATECHANGE = 'onreadystatechange';\nvar defer, channel, port;\nvar run = function () {\n  var id = +this;\n  // eslint-disable-next-line no-prototype-builtins\n  if (queue.hasOwnProperty(id)) {\n    var fn = queue[id];\n    delete queue[id];\n    fn();\n  }\n};\nvar listener = function (event) {\n  run.call(event.data);\n};\n// Node.js 0.9+ & IE10+ has setImmediate, otherwise:\nif (!setTask || !clearTask) {\n  setTask = function setImmediate(fn) {\n    var args = [];\n    var i = 1;\n    while (arguments.length > i) args.push(arguments[i++]);\n    queue[++counter] = function () {\n      // eslint-disable-next-line no-new-func\n      invoke(typeof fn == 'function' ? fn : Function(fn), args);\n    };\n    defer(counter);\n    return counter;\n  };\n  clearTask = function clearImmediate(id) {\n    delete queue[id];\n  };\n  // Node.js 0.8-\n  if (__webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\")(process) == 'process') {\n    defer = function (id) {\n      process.nextTick(ctx(run, id, 1));\n    };\n  // Sphere (JS game engine) Dispatch API\n  } else if (Dispatch && Dispatch.now) {\n    defer = function (id) {\n      Dispatch.now(ctx(run, id, 1));\n    };\n  // Browsers with MessageChannel, includes WebWorkers\n  } else if (MessageChannel) {\n    channel = new MessageChannel();\n    port = channel.port2;\n    channel.port1.onmessage = listener;\n    defer = ctx(port.postMessage, port, 1);\n  // Browsers with postMessage, skip WebWorkers\n  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'\n  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {\n    defer = function (id) {\n      global.postMessage(id + '', '*');\n    };\n    global.addEventListener('message', listener, false);\n  // IE8-\n  } else if (ONREADYSTATECHANGE in cel('script')) {\n    defer = function (id) {\n      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {\n        html.removeChild(this);\n        run.call(id);\n      };\n    };\n  // Rest old browsers\n  } else {\n    defer = function (id) {\n      setTimeout(ctx(run, id, 1), 0);\n    };\n  }\n}\nmodule.exports = {\n  set: setTask,\n  clear: clearTask\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_task.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_to-absolute-index.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_to-absolute-index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var toInteger = __webpack_require__(/*! ./_to-integer */ \"./node_modules/core-js/modules/_to-integer.js\");\nvar max = Math.max;\nvar min = Math.min;\nmodule.exports = function (index, length) {\n  index = toInteger(index);\n  return index < 0 ? max(index + length, 0) : min(index, length);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_to-absolute-index.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_to-integer.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-integer.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// 7.1.4 ToInteger\nvar ceil = Math.ceil;\nvar floor = Math.floor;\nmodule.exports = function (it) {\n  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_to-integer.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_to-iobject.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-iobject.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// to indexed object, toObject with fallback for non-array-like ES3 strings\nvar IObject = __webpack_require__(/*! ./_iobject */ \"./node_modules/core-js/modules/_iobject.js\");\nvar defined = __webpack_require__(/*! ./_defined */ \"./node_modules/core-js/modules/_defined.js\");\nmodule.exports = function (it) {\n  return IObject(defined(it));\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_to-iobject.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_to-length.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-length.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 7.1.15 ToLength\nvar toInteger = __webpack_require__(/*! ./_to-integer */ \"./node_modules/core-js/modules/_to-integer.js\");\nvar min = Math.min;\nmodule.exports = function (it) {\n  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_to-length.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_to-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 7.1.13 ToObject(argument)\nvar defined = __webpack_require__(/*! ./_defined */ \"./node_modules/core-js/modules/_defined.js\");\nmodule.exports = function (it) {\n  return Object(defined(it));\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_to-object.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_to-primitive.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_to-primitive.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 7.1.1 ToPrimitive(input [, PreferredType])\nvar isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\n// instead of the ES6 spec version, we didn't implement @@toPrimitive case\n// and the second argument - flag - preferred type is a string\nmodule.exports = function (it, S) {\n  if (!isObject(it)) return it;\n  var fn, val;\n  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;\n  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;\n  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;\n  throw TypeError(\"Can't convert object to primitive value\");\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_to-primitive.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_uid.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_uid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var id = 0;\nvar px = Math.random();\nmodule.exports = function (key) {\n  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_uid.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_user-agent.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_user-agent.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar navigator = global.navigator;\n\nmodule.exports = navigator && navigator.userAgent || '';\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_user-agent.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_wks-define.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_wks-define.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar core = __webpack_require__(/*! ./_core */ \"./node_modules/core-js/modules/_core.js\");\nvar LIBRARY = __webpack_require__(/*! ./_library */ \"./node_modules/core-js/modules/_library.js\");\nvar wksExt = __webpack_require__(/*! ./_wks-ext */ \"./node_modules/core-js/modules/_wks-ext.js\");\nvar defineProperty = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\").f;\nmodule.exports = function (name) {\n  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});\n  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_wks-define.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_wks-ext.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_wks-ext.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports.f = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\");\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_wks-ext.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/_wks.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_wks.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var store = __webpack_require__(/*! ./_shared */ \"./node_modules/core-js/modules/_shared.js\")('wks');\nvar uid = __webpack_require__(/*! ./_uid */ \"./node_modules/core-js/modules/_uid.js\");\nvar Symbol = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\").Symbol;\nvar USE_SYMBOL = typeof Symbol == 'function';\n\nvar $exports = module.exports = function (name) {\n  return store[name] || (store[name] =\n    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));\n};\n\n$exports.store = store;\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/_wks.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/core.get-iterator-method.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/core.get-iterator-method.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var classof = __webpack_require__(/*! ./_classof */ \"./node_modules/core-js/modules/_classof.js\");\nvar ITERATOR = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('iterator');\nvar Iterators = __webpack_require__(/*! ./_iterators */ \"./node_modules/core-js/modules/_iterators.js\");\nmodule.exports = __webpack_require__(/*! ./_core */ \"./node_modules/core-js/modules/_core.js\").getIteratorMethod = function (it) {\n  if (it != undefined) return it[ITERATOR]\n    || it['@@iterator']\n    || Iterators[classof(it)];\n};\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/core.get-iterator-method.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ \"./node_modules/core-js/modules/_add-to-unscopables.js\");\nvar step = __webpack_require__(/*! ./_iter-step */ \"./node_modules/core-js/modules/_iter-step.js\");\nvar Iterators = __webpack_require__(/*! ./_iterators */ \"./node_modules/core-js/modules/_iterators.js\");\nvar toIObject = __webpack_require__(/*! ./_to-iobject */ \"./node_modules/core-js/modules/_to-iobject.js\");\n\n// 22.1.3.4 Array.prototype.entries()\n// 22.1.3.13 Array.prototype.keys()\n// 22.1.3.29 Array.prototype.values()\n// 22.1.3.30 Array.prototype[@@iterator]()\nmodule.exports = __webpack_require__(/*! ./_iter-define */ \"./node_modules/core-js/modules/_iter-define.js\")(Array, 'Array', function (iterated, kind) {\n  this._t = toIObject(iterated); // target\n  this._i = 0;                   // next index\n  this._k = kind;                // kind\n// 22.1.5.2.1 %ArrayIteratorPrototype%.next()\n}, function () {\n  var O = this._t;\n  var kind = this._k;\n  var index = this._i++;\n  if (!O || index >= O.length) {\n    this._t = undefined;\n    return step(1);\n  }\n  if (kind == 'keys') return step(0, index);\n  if (kind == 'values') return step(0, O[index]);\n  return step(0, [index, O[index]]);\n}, 'values');\n\n// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)\nIterators.Arguments = Iterators.Array;\n\naddToUnscopables('keys');\naddToUnscopables('values');\naddToUnscopables('entries');\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.array.iterator.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.date.to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.date.to-string.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var DateProto = Date.prototype;\nvar INVALID_DATE = 'Invalid Date';\nvar TO_STRING = 'toString';\nvar $toString = DateProto[TO_STRING];\nvar getTime = DateProto.getTime;\nif (new Date(NaN) + '' != INVALID_DATE) {\n  __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\")(DateProto, TO_STRING, function toString() {\n    var value = getTime.call(this);\n    // eslint-disable-next-line no-self-compare\n    return value === value ? $toString.call(this) : INVALID_DATE;\n  });\n}\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.date.to-string.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.constructor.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.constructor.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar cof = __webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\");\nvar inheritIfRequired = __webpack_require__(/*! ./_inherit-if-required */ \"./node_modules/core-js/modules/_inherit-if-required.js\");\nvar toPrimitive = __webpack_require__(/*! ./_to-primitive */ \"./node_modules/core-js/modules/_to-primitive.js\");\nvar fails = __webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\");\nvar gOPN = __webpack_require__(/*! ./_object-gopn */ \"./node_modules/core-js/modules/_object-gopn.js\").f;\nvar gOPD = __webpack_require__(/*! ./_object-gopd */ \"./node_modules/core-js/modules/_object-gopd.js\").f;\nvar dP = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\").f;\nvar $trim = __webpack_require__(/*! ./_string-trim */ \"./node_modules/core-js/modules/_string-trim.js\").trim;\nvar NUMBER = 'Number';\nvar $Number = global[NUMBER];\nvar Base = $Number;\nvar proto = $Number.prototype;\n// Opera ~12 has broken Object#toString\nvar BROKEN_COF = cof(__webpack_require__(/*! ./_object-create */ \"./node_modules/core-js/modules/_object-create.js\")(proto)) == NUMBER;\nvar TRIM = 'trim' in String.prototype;\n\n// 7.1.3 ToNumber(argument)\nvar toNumber = function (argument) {\n  var it = toPrimitive(argument, false);\n  if (typeof it == 'string' && it.length > 2) {\n    it = TRIM ? it.trim() : $trim(it, 3);\n    var first = it.charCodeAt(0);\n    var third, radix, maxCode;\n    if (first === 43 || first === 45) {\n      third = it.charCodeAt(2);\n      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix\n    } else if (first === 48) {\n      switch (it.charCodeAt(1)) {\n        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i\n        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i\n        default: return +it;\n      }\n      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {\n        code = digits.charCodeAt(i);\n        // parseInt parses a string to a first unavailable symbol\n        // but ToNumber should return NaN if a string contains unavailable symbols\n        if (code < 48 || code > maxCode) return NaN;\n      } return parseInt(digits, radix);\n    }\n  } return +it;\n};\n\nif (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {\n  $Number = function Number(value) {\n    var it = arguments.length < 1 ? 0 : value;\n    var that = this;\n    return that instanceof $Number\n      // check on 1..constructor(foo) case\n      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)\n        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);\n  };\n  for (var keys = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") ? gOPN(Base) : (\n    // ES3:\n    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +\n    // ES6 (in case, if modules with ES6 Number statics required before):\n    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +\n    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'\n  ).split(','), j = 0, key; keys.length > j; j++) {\n    if (has(Base, key = keys[j]) && !has($Number, key)) {\n      dP($Number, key, gOPD(Base, key));\n    }\n  }\n  $Number.prototype = proto;\n  proto.constructor = $Number;\n  __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\")(global, NUMBER, $Number);\n}\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.number.constructor.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.object.assign.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.object.assign.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 19.1.3.1 Object.assign(target, source)\nvar $export = __webpack_require__(/*! ./_export */ \"./node_modules/core-js/modules/_export.js\");\n\n$export($export.S + $export.F, 'Object', { assign: __webpack_require__(/*! ./_object-assign */ \"./node_modules/core-js/modules/_object-assign.js\") });\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.object.assign.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.promise.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/es6.promise.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar LIBRARY = __webpack_require__(/*! ./_library */ \"./node_modules/core-js/modules/_library.js\");\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar ctx = __webpack_require__(/*! ./_ctx */ \"./node_modules/core-js/modules/_ctx.js\");\nvar classof = __webpack_require__(/*! ./_classof */ \"./node_modules/core-js/modules/_classof.js\");\nvar $export = __webpack_require__(/*! ./_export */ \"./node_modules/core-js/modules/_export.js\");\nvar isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar aFunction = __webpack_require__(/*! ./_a-function */ \"./node_modules/core-js/modules/_a-function.js\");\nvar anInstance = __webpack_require__(/*! ./_an-instance */ \"./node_modules/core-js/modules/_an-instance.js\");\nvar forOf = __webpack_require__(/*! ./_for-of */ \"./node_modules/core-js/modules/_for-of.js\");\nvar speciesConstructor = __webpack_require__(/*! ./_species-constructor */ \"./node_modules/core-js/modules/_species-constructor.js\");\nvar task = __webpack_require__(/*! ./_task */ \"./node_modules/core-js/modules/_task.js\").set;\nvar microtask = __webpack_require__(/*! ./_microtask */ \"./node_modules/core-js/modules/_microtask.js\")();\nvar newPromiseCapabilityModule = __webpack_require__(/*! ./_new-promise-capability */ \"./node_modules/core-js/modules/_new-promise-capability.js\");\nvar perform = __webpack_require__(/*! ./_perform */ \"./node_modules/core-js/modules/_perform.js\");\nvar userAgent = __webpack_require__(/*! ./_user-agent */ \"./node_modules/core-js/modules/_user-agent.js\");\nvar promiseResolve = __webpack_require__(/*! ./_promise-resolve */ \"./node_modules/core-js/modules/_promise-resolve.js\");\nvar PROMISE = 'Promise';\nvar TypeError = global.TypeError;\nvar process = global.process;\nvar versions = process && process.versions;\nvar v8 = versions && versions.v8 || '';\nvar $Promise = global[PROMISE];\nvar isNode = classof(process) == 'process';\nvar empty = function () { /* empty */ };\nvar Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;\nvar newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;\n\nvar USE_NATIVE = !!function () {\n  try {\n    // correct subclassing with @@species support\n    var promise = $Promise.resolve(1);\n    var FakePromise = (promise.constructor = {})[__webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\")('species')] = function (exec) {\n      exec(empty, empty);\n    };\n    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test\n    return (isNode || typeof PromiseRejectionEvent == 'function')\n      && promise.then(empty) instanceof FakePromise\n      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables\n      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565\n      // we can't detect it synchronously, so just check versions\n      && v8.indexOf('6.6') !== 0\n      && userAgent.indexOf('Chrome/66') === -1;\n  } catch (e) { /* empty */ }\n}();\n\n// helpers\nvar isThenable = function (it) {\n  var then;\n  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;\n};\nvar notify = function (promise, isReject) {\n  if (promise._n) return;\n  promise._n = true;\n  var chain = promise._c;\n  microtask(function () {\n    var value = promise._v;\n    var ok = promise._s == 1;\n    var i = 0;\n    var run = function (reaction) {\n      var handler = ok ? reaction.ok : reaction.fail;\n      var resolve = reaction.resolve;\n      var reject = reaction.reject;\n      var domain = reaction.domain;\n      var result, then, exited;\n      try {\n        if (handler) {\n          if (!ok) {\n            if (promise._h == 2) onHandleUnhandled(promise);\n            promise._h = 1;\n          }\n          if (handler === true) result = value;\n          else {\n            if (domain) domain.enter();\n            result = handler(value); // may throw\n            if (domain) {\n              domain.exit();\n              exited = true;\n            }\n          }\n          if (result === reaction.promise) {\n            reject(TypeError('Promise-chain cycle'));\n          } else if (then = isThenable(result)) {\n            then.call(result, resolve, reject);\n          } else resolve(result);\n        } else reject(value);\n      } catch (e) {\n        if (domain && !exited) domain.exit();\n        reject(e);\n      }\n    };\n    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach\n    promise._c = [];\n    promise._n = false;\n    if (isReject && !promise._h) onUnhandled(promise);\n  });\n};\nvar onUnhandled = function (promise) {\n  task.call(global, function () {\n    var value = promise._v;\n    var unhandled = isUnhandled(promise);\n    var result, handler, console;\n    if (unhandled) {\n      result = perform(function () {\n        if (isNode) {\n          process.emit('unhandledRejection', value, promise);\n        } else if (handler = global.onunhandledrejection) {\n          handler({ promise: promise, reason: value });\n        } else if ((console = global.console) && console.error) {\n          console.error('Unhandled promise rejection', value);\n        }\n      });\n      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should\n      promise._h = isNode || isUnhandled(promise) ? 2 : 1;\n    } promise._a = undefined;\n    if (unhandled && result.e) throw result.v;\n  });\n};\nvar isUnhandled = function (promise) {\n  return promise._h !== 1 && (promise._a || promise._c).length === 0;\n};\nvar onHandleUnhandled = function (promise) {\n  task.call(global, function () {\n    var handler;\n    if (isNode) {\n      process.emit('rejectionHandled', promise);\n    } else if (handler = global.onrejectionhandled) {\n      handler({ promise: promise, reason: promise._v });\n    }\n  });\n};\nvar $reject = function (value) {\n  var promise = this;\n  if (promise._d) return;\n  promise._d = true;\n  promise = promise._w || promise; // unwrap\n  promise._v = value;\n  promise._s = 2;\n  if (!promise._a) promise._a = promise._c.slice();\n  notify(promise, true);\n};\nvar $resolve = function (value) {\n  var promise = this;\n  var then;\n  if (promise._d) return;\n  promise._d = true;\n  promise = promise._w || promise; // unwrap\n  try {\n    if (promise === value) throw TypeError(\"Promise can't be resolved itself\");\n    if (then = isThenable(value)) {\n      microtask(function () {\n        var wrapper = { _w: promise, _d: false }; // wrap\n        try {\n          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));\n        } catch (e) {\n          $reject.call(wrapper, e);\n        }\n      });\n    } else {\n      promise._v = value;\n      promise._s = 1;\n      notify(promise, false);\n    }\n  } catch (e) {\n    $reject.call({ _w: promise, _d: false }, e); // wrap\n  }\n};\n\n// constructor polyfill\nif (!USE_NATIVE) {\n  // 25.4.3.1 Promise(executor)\n  $Promise = function Promise(executor) {\n    anInstance(this, $Promise, PROMISE, '_h');\n    aFunction(executor);\n    Internal.call(this);\n    try {\n      executor(ctx($resolve, this, 1), ctx($reject, this, 1));\n    } catch (err) {\n      $reject.call(this, err);\n    }\n  };\n  // eslint-disable-next-line no-unused-vars\n  Internal = function Promise(executor) {\n    this._c = [];             // <- awaiting reactions\n    this._a = undefined;      // <- checked in isUnhandled reactions\n    this._s = 0;              // <- state\n    this._d = false;          // <- done\n    this._v = undefined;      // <- value\n    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled\n    this._n = false;          // <- notify\n  };\n  Internal.prototype = __webpack_require__(/*! ./_redefine-all */ \"./node_modules/core-js/modules/_redefine-all.js\")($Promise.prototype, {\n    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)\n    then: function then(onFulfilled, onRejected) {\n      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));\n      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;\n      reaction.fail = typeof onRejected == 'function' && onRejected;\n      reaction.domain = isNode ? process.domain : undefined;\n      this._c.push(reaction);\n      if (this._a) this._a.push(reaction);\n      if (this._s) notify(this, false);\n      return reaction.promise;\n    },\n    // 25.4.5.1 Promise.prototype.catch(onRejected)\n    'catch': function (onRejected) {\n      return this.then(undefined, onRejected);\n    }\n  });\n  OwnPromiseCapability = function () {\n    var promise = new Internal();\n    this.promise = promise;\n    this.resolve = ctx($resolve, promise, 1);\n    this.reject = ctx($reject, promise, 1);\n  };\n  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {\n    return C === $Promise || C === Wrapper\n      ? new OwnPromiseCapability(C)\n      : newGenericPromiseCapability(C);\n  };\n}\n\n$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });\n__webpack_require__(/*! ./_set-to-string-tag */ \"./node_modules/core-js/modules/_set-to-string-tag.js\")($Promise, PROMISE);\n__webpack_require__(/*! ./_set-species */ \"./node_modules/core-js/modules/_set-species.js\")(PROMISE);\nWrapper = __webpack_require__(/*! ./_core */ \"./node_modules/core-js/modules/_core.js\")[PROMISE];\n\n// statics\n$export($export.S + $export.F * !USE_NATIVE, PROMISE, {\n  // 25.4.4.5 Promise.reject(r)\n  reject: function reject(r) {\n    var capability = newPromiseCapability(this);\n    var $$reject = capability.reject;\n    $$reject(r);\n    return capability.promise;\n  }\n});\n$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {\n  // 25.4.4.6 Promise.resolve(x)\n  resolve: function resolve(x) {\n    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);\n  }\n});\n$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(/*! ./_iter-detect */ \"./node_modules/core-js/modules/_iter-detect.js\")(function (iter) {\n  $Promise.all(iter)['catch'](empty);\n})), PROMISE, {\n  // 25.4.4.1 Promise.all(iterable)\n  all: function all(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var resolve = capability.resolve;\n    var reject = capability.reject;\n    var result = perform(function () {\n      var values = [];\n      var index = 0;\n      var remaining = 1;\n      forOf(iterable, false, function (promise) {\n        var $index = index++;\n        var alreadyCalled = false;\n        values.push(undefined);\n        remaining++;\n        C.resolve(promise).then(function (value) {\n          if (alreadyCalled) return;\n          alreadyCalled = true;\n          values[$index] = value;\n          --remaining || resolve(values);\n        }, reject);\n      });\n      --remaining || resolve(values);\n    });\n    if (result.e) reject(result.v);\n    return capability.promise;\n  },\n  // 25.4.4.4 Promise.race(iterable)\n  race: function race(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var reject = capability.reject;\n    var result = perform(function () {\n      forOf(iterable, false, function (promise) {\n        C.resolve(promise).then(capability.resolve, reject);\n      });\n    });\n    if (result.e) reject(result.v);\n    return capability.promise;\n  }\n});\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.promise.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.flags.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.flags.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 21.2.5.3 get RegExp.prototype.flags()\nif (__webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\") && /./g.flags != 'g') __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\").f(RegExp.prototype, 'flags', {\n  configurable: true,\n  get: __webpack_require__(/*! ./_flags */ \"./node_modules/core-js/modules/_flags.js\")\n});\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.regexp.flags.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.to-string.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n__webpack_require__(/*! ./es6.regexp.flags */ \"./node_modules/core-js/modules/es6.regexp.flags.js\");\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar $flags = __webpack_require__(/*! ./_flags */ \"./node_modules/core-js/modules/_flags.js\");\nvar DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\");\nvar TO_STRING = 'toString';\nvar $toString = /./[TO_STRING];\n\nvar define = function (fn) {\n  __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\")(RegExp.prototype, TO_STRING, fn, true);\n};\n\n// 21.2.5.14 RegExp.prototype.toString()\nif (__webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {\n  define(function toString() {\n    var R = anObject(this);\n    return '/'.concat(R.source, '/',\n      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);\n  });\n// FF44- RegExp#toString has a wrong name\n} else if ($toString.name != TO_STRING) {\n  define(function toString() {\n    return $toString.call(this);\n  });\n}\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.regexp.to-string.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es6.symbol.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/es6.symbol.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// ECMAScript 6 symbols shim\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar has = __webpack_require__(/*! ./_has */ \"./node_modules/core-js/modules/_has.js\");\nvar DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ \"./node_modules/core-js/modules/_descriptors.js\");\nvar $export = __webpack_require__(/*! ./_export */ \"./node_modules/core-js/modules/_export.js\");\nvar redefine = __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\");\nvar META = __webpack_require__(/*! ./_meta */ \"./node_modules/core-js/modules/_meta.js\").KEY;\nvar $fails = __webpack_require__(/*! ./_fails */ \"./node_modules/core-js/modules/_fails.js\");\nvar shared = __webpack_require__(/*! ./_shared */ \"./node_modules/core-js/modules/_shared.js\");\nvar setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ \"./node_modules/core-js/modules/_set-to-string-tag.js\");\nvar uid = __webpack_require__(/*! ./_uid */ \"./node_modules/core-js/modules/_uid.js\");\nvar wks = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\");\nvar wksExt = __webpack_require__(/*! ./_wks-ext */ \"./node_modules/core-js/modules/_wks-ext.js\");\nvar wksDefine = __webpack_require__(/*! ./_wks-define */ \"./node_modules/core-js/modules/_wks-define.js\");\nvar enumKeys = __webpack_require__(/*! ./_enum-keys */ \"./node_modules/core-js/modules/_enum-keys.js\");\nvar isArray = __webpack_require__(/*! ./_is-array */ \"./node_modules/core-js/modules/_is-array.js\");\nvar anObject = __webpack_require__(/*! ./_an-object */ \"./node_modules/core-js/modules/_an-object.js\");\nvar isObject = __webpack_require__(/*! ./_is-object */ \"./node_modules/core-js/modules/_is-object.js\");\nvar toIObject = __webpack_require__(/*! ./_to-iobject */ \"./node_modules/core-js/modules/_to-iobject.js\");\nvar toPrimitive = __webpack_require__(/*! ./_to-primitive */ \"./node_modules/core-js/modules/_to-primitive.js\");\nvar createDesc = __webpack_require__(/*! ./_property-desc */ \"./node_modules/core-js/modules/_property-desc.js\");\nvar _create = __webpack_require__(/*! ./_object-create */ \"./node_modules/core-js/modules/_object-create.js\");\nvar gOPNExt = __webpack_require__(/*! ./_object-gopn-ext */ \"./node_modules/core-js/modules/_object-gopn-ext.js\");\nvar $GOPD = __webpack_require__(/*! ./_object-gopd */ \"./node_modules/core-js/modules/_object-gopd.js\");\nvar $DP = __webpack_require__(/*! ./_object-dp */ \"./node_modules/core-js/modules/_object-dp.js\");\nvar $keys = __webpack_require__(/*! ./_object-keys */ \"./node_modules/core-js/modules/_object-keys.js\");\nvar gOPD = $GOPD.f;\nvar dP = $DP.f;\nvar gOPN = gOPNExt.f;\nvar $Symbol = global.Symbol;\nvar $JSON = global.JSON;\nvar _stringify = $JSON && $JSON.stringify;\nvar PROTOTYPE = 'prototype';\nvar HIDDEN = wks('_hidden');\nvar TO_PRIMITIVE = wks('toPrimitive');\nvar isEnum = {}.propertyIsEnumerable;\nvar SymbolRegistry = shared('symbol-registry');\nvar AllSymbols = shared('symbols');\nvar OPSymbols = shared('op-symbols');\nvar ObjectProto = Object[PROTOTYPE];\nvar USE_NATIVE = typeof $Symbol == 'function';\nvar QObject = global.QObject;\n// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173\nvar setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;\n\n// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687\nvar setSymbolDesc = DESCRIPTORS && $fails(function () {\n  return _create(dP({}, 'a', {\n    get: function () { return dP(this, 'a', { value: 7 }).a; }\n  })).a != 7;\n}) ? function (it, key, D) {\n  var protoDesc = gOPD(ObjectProto, key);\n  if (protoDesc) delete ObjectProto[key];\n  dP(it, key, D);\n  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);\n} : dP;\n\nvar wrap = function (tag) {\n  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);\n  sym._k = tag;\n  return sym;\n};\n\nvar isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {\n  return typeof it == 'symbol';\n} : function (it) {\n  return it instanceof $Symbol;\n};\n\nvar $defineProperty = function defineProperty(it, key, D) {\n  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);\n  anObject(it);\n  key = toPrimitive(key, true);\n  anObject(D);\n  if (has(AllSymbols, key)) {\n    if (!D.enumerable) {\n      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));\n      it[HIDDEN][key] = true;\n    } else {\n      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;\n      D = _create(D, { enumerable: createDesc(0, false) });\n    } return setSymbolDesc(it, key, D);\n  } return dP(it, key, D);\n};\nvar $defineProperties = function defineProperties(it, P) {\n  anObject(it);\n  var keys = enumKeys(P = toIObject(P));\n  var i = 0;\n  var l = keys.length;\n  var key;\n  while (l > i) $defineProperty(it, key = keys[i++], P[key]);\n  return it;\n};\nvar $create = function create(it, P) {\n  return P === undefined ? _create(it) : $defineProperties(_create(it), P);\n};\nvar $propertyIsEnumerable = function propertyIsEnumerable(key) {\n  var E = isEnum.call(this, key = toPrimitive(key, true));\n  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;\n  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;\n};\nvar $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {\n  it = toIObject(it);\n  key = toPrimitive(key, true);\n  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;\n  var D = gOPD(it, key);\n  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;\n  return D;\n};\nvar $getOwnPropertyNames = function getOwnPropertyNames(it) {\n  var names = gOPN(toIObject(it));\n  var result = [];\n  var i = 0;\n  var key;\n  while (names.length > i) {\n    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);\n  } return result;\n};\nvar $getOwnPropertySymbols = function getOwnPropertySymbols(it) {\n  var IS_OP = it === ObjectProto;\n  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));\n  var result = [];\n  var i = 0;\n  var key;\n  while (names.length > i) {\n    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);\n  } return result;\n};\n\n// 19.4.1.1 Symbol([description])\nif (!USE_NATIVE) {\n  $Symbol = function Symbol() {\n    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');\n    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);\n    var $set = function (value) {\n      if (this === ObjectProto) $set.call(OPSymbols, value);\n      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;\n      setSymbolDesc(this, tag, createDesc(1, value));\n    };\n    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });\n    return wrap(tag);\n  };\n  redefine($Symbol[PROTOTYPE], 'toString', function toString() {\n    return this._k;\n  });\n\n  $GOPD.f = $getOwnPropertyDescriptor;\n  $DP.f = $defineProperty;\n  __webpack_require__(/*! ./_object-gopn */ \"./node_modules/core-js/modules/_object-gopn.js\").f = gOPNExt.f = $getOwnPropertyNames;\n  __webpack_require__(/*! ./_object-pie */ \"./node_modules/core-js/modules/_object-pie.js\").f = $propertyIsEnumerable;\n  __webpack_require__(/*! ./_object-gops */ \"./node_modules/core-js/modules/_object-gops.js\").f = $getOwnPropertySymbols;\n\n  if (DESCRIPTORS && !__webpack_require__(/*! ./_library */ \"./node_modules/core-js/modules/_library.js\")) {\n    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);\n  }\n\n  wksExt.f = function (name) {\n    return wrap(wks(name));\n  };\n}\n\n$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });\n\nfor (var es6Symbols = (\n  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14\n  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'\n).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);\n\nfor (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);\n\n$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {\n  // 19.4.2.1 Symbol.for(key)\n  'for': function (key) {\n    return has(SymbolRegistry, key += '')\n      ? SymbolRegistry[key]\n      : SymbolRegistry[key] = $Symbol(key);\n  },\n  // 19.4.2.5 Symbol.keyFor(sym)\n  keyFor: function keyFor(sym) {\n    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');\n    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;\n  },\n  useSetter: function () { setter = true; },\n  useSimple: function () { setter = false; }\n});\n\n$export($export.S + $export.F * !USE_NATIVE, 'Object', {\n  // 19.1.2.2 Object.create(O [, Properties])\n  create: $create,\n  // 19.1.2.4 Object.defineProperty(O, P, Attributes)\n  defineProperty: $defineProperty,\n  // 19.1.2.3 Object.defineProperties(O, Properties)\n  defineProperties: $defineProperties,\n  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)\n  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,\n  // 19.1.2.7 Object.getOwnPropertyNames(O)\n  getOwnPropertyNames: $getOwnPropertyNames,\n  // 19.1.2.8 Object.getOwnPropertySymbols(O)\n  getOwnPropertySymbols: $getOwnPropertySymbols\n});\n\n// 24.3.2 JSON.stringify(value [, replacer [, space]])\n$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {\n  var S = $Symbol();\n  // MS Edge converts symbol values to JSON as {}\n  // WebKit converts symbol values to JSON as null\n  // V8 throws on boxed symbols\n  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';\n})), 'JSON', {\n  stringify: function stringify(it) {\n    var args = [it];\n    var i = 1;\n    var replacer, $replacer;\n    while (arguments.length > i) args.push(arguments[i++]);\n    $replacer = replacer = args[1];\n    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined\n    if (!isArray(replacer)) replacer = function (key, value) {\n      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);\n      if (!isSymbol(value)) return value;\n    };\n    args[1] = replacer;\n    return _stringify.apply($JSON, args);\n  }\n});\n\n// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)\n$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);\n// 19.4.3.5 Symbol.prototype[@@toStringTag]\nsetToStringTag($Symbol, 'Symbol');\n// 20.2.1.9 Math[@@toStringTag]\nsetToStringTag(Math, 'Math', true);\n// 24.3.3 JSON[@@toStringTag]\nsetToStringTag(global.JSON, 'JSON', true);\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es6.symbol.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es7.symbol.async-iterator.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/es7.symbol.async-iterator.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./_wks-define */ \"./node_modules/core-js/modules/_wks-define.js\")('asyncIterator');\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/es7.symbol.async-iterator.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/web.dom.iterable.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom.iterable.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var $iterators = __webpack_require__(/*! ./es6.array.iterator */ \"./node_modules/core-js/modules/es6.array.iterator.js\");\nvar getKeys = __webpack_require__(/*! ./_object-keys */ \"./node_modules/core-js/modules/_object-keys.js\");\nvar redefine = __webpack_require__(/*! ./_redefine */ \"./node_modules/core-js/modules/_redefine.js\");\nvar global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar hide = __webpack_require__(/*! ./_hide */ \"./node_modules/core-js/modules/_hide.js\");\nvar Iterators = __webpack_require__(/*! ./_iterators */ \"./node_modules/core-js/modules/_iterators.js\");\nvar wks = __webpack_require__(/*! ./_wks */ \"./node_modules/core-js/modules/_wks.js\");\nvar ITERATOR = wks('iterator');\nvar TO_STRING_TAG = wks('toStringTag');\nvar ArrayValues = Iterators.Array;\n\nvar DOMIterables = {\n  CSSRuleList: true, // TODO: Not spec compliant, should be false.\n  CSSStyleDeclaration: false,\n  CSSValueList: false,\n  ClientRectList: false,\n  DOMRectList: false,\n  DOMStringList: false,\n  DOMTokenList: true,\n  DataTransferItemList: false,\n  FileList: false,\n  HTMLAllCollection: false,\n  HTMLCollection: false,\n  HTMLFormElement: false,\n  HTMLSelectElement: false,\n  MediaList: true, // TODO: Not spec compliant, should be false.\n  MimeTypeArray: false,\n  NamedNodeMap: false,\n  NodeList: true,\n  PaintRequestList: false,\n  Plugin: false,\n  PluginArray: false,\n  SVGLengthList: false,\n  SVGNumberList: false,\n  SVGPathSegList: false,\n  SVGPointList: false,\n  SVGStringList: false,\n  SVGTransformList: false,\n  SourceBufferList: false,\n  StyleSheetList: true, // TODO: Not spec compliant, should be false.\n  TextTrackCueList: false,\n  TextTrackList: false,\n  TouchList: false\n};\n\nfor (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {\n  var NAME = collections[i];\n  var explicit = DOMIterables[NAME];\n  var Collection = global[NAME];\n  var proto = Collection && Collection.prototype;\n  var key;\n  if (proto) {\n    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);\n    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);\n    Iterators[NAME] = ArrayValues;\n    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);\n  }\n}\n\n\n//# sourceURL=webpack://TIC/./node_modules/core-js/modules/web.dom.iterable.js?");

/***/ }),

/***/ "./node_modules/js-md5/src/md5.js":
/*!****************************************!*\
  !*** ./node_modules/js-md5/src/md5.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/**\n * [js-md5]{@link https://github.com/emn178/js-md5}\n *\n * @namespace md5\n * @version 0.7.3\n * @author Chen, Yi-Cyuan [emn178@gmail.com]\n * @copyright Chen, Yi-Cyuan 2014-2017\n * @license MIT\n */\n(function () {\n  'use strict';\n\n  var ERROR = 'input is invalid type';\n  var WINDOW = typeof window === 'object';\n  var root = WINDOW ? window : {};\n  if (root.JS_MD5_NO_WINDOW) {\n    WINDOW = false;\n  }\n  var WEB_WORKER = !WINDOW && typeof self === 'object';\n  var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;\n  if (NODE_JS) {\n    root = global;\n  } else if (WEB_WORKER) {\n    root = self;\n  }\n  var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;\n  var AMD =  true && __webpack_require__(/*! !webpack amd options */ \"./node_modules/webpack/buildin/amd-options.js\");\n  var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';\n  var HEX_CHARS = '0123456789abcdef'.split('');\n  var EXTRA = [128, 32768, 8388608, -2147483648];\n  var SHIFT = [0, 8, 16, 24];\n  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];\n  var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');\n\n  var blocks = [], buffer8;\n  if (ARRAY_BUFFER) {\n    var buffer = new ArrayBuffer(68);\n    buffer8 = new Uint8Array(buffer);\n    blocks = new Uint32Array(buffer);\n  }\n\n  if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {\n    Array.isArray = function (obj) {\n      return Object.prototype.toString.call(obj) === '[object Array]';\n    };\n  }\n\n  if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {\n    ArrayBuffer.isView = function (obj) {\n      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;\n    };\n  }\n\n  /**\n   * @method hex\n   * @memberof md5\n   * @description Output hash as hex string\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {String} Hex string\n   * @example\n   * md5.hex('The quick brown fox jumps over the lazy dog');\n   * // equal to\n   * md5('The quick brown fox jumps over the lazy dog');\n   */\n  /**\n   * @method digest\n   * @memberof md5\n   * @description Output hash as bytes array\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {Array} Bytes array\n   * @example\n   * md5.digest('The quick brown fox jumps over the lazy dog');\n   */\n  /**\n   * @method array\n   * @memberof md5\n   * @description Output hash as bytes array\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {Array} Bytes array\n   * @example\n   * md5.array('The quick brown fox jumps over the lazy dog');\n   */\n  /**\n   * @method arrayBuffer\n   * @memberof md5\n   * @description Output hash as ArrayBuffer\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {ArrayBuffer} ArrayBuffer\n   * @example\n   * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');\n   */\n  /**\n   * @method buffer\n   * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.\n   * @memberof md5\n   * @description Output hash as ArrayBuffer\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {ArrayBuffer} ArrayBuffer\n   * @example\n   * md5.buffer('The quick brown fox jumps over the lazy dog');\n   */\n  /**\n   * @method base64\n   * @memberof md5\n   * @description Output hash as base64 string\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {String} base64 string\n   * @example\n   * md5.base64('The quick brown fox jumps over the lazy dog');\n   */\n  var createOutputMethod = function (outputType) {\n    return function (message) {\n      return new Md5(true).update(message)[outputType]();\n    };\n  };\n\n  /**\n   * @method create\n   * @memberof md5\n   * @description Create Md5 object\n   * @returns {Md5} Md5 object.\n   * @example\n   * var hash = md5.create();\n   */\n  /**\n   * @method update\n   * @memberof md5\n   * @description Create and update Md5 object\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {Md5} Md5 object.\n   * @example\n   * var hash = md5.update('The quick brown fox jumps over the lazy dog');\n   * // equal to\n   * var hash = md5.create();\n   * hash.update('The quick brown fox jumps over the lazy dog');\n   */\n  var createMethod = function () {\n    var method = createOutputMethod('hex');\n    if (NODE_JS) {\n      method = nodeWrap(method);\n    }\n    method.create = function () {\n      return new Md5();\n    };\n    method.update = function (message) {\n      return method.create().update(message);\n    };\n    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {\n      var type = OUTPUT_TYPES[i];\n      method[type] = createOutputMethod(type);\n    }\n    return method;\n  };\n\n  var nodeWrap = function (method) {\n    var crypto = eval(\"require('crypto')\");\n    var Buffer = eval(\"require('buffer').Buffer\");\n    var nodeMethod = function (message) {\n      if (typeof message === 'string') {\n        return crypto.createHash('md5').update(message, 'utf8').digest('hex');\n      } else {\n        if (message === null || message === undefined) {\n          throw ERROR;\n        } else if (message.constructor === ArrayBuffer) {\n          message = new Uint8Array(message);\n        }\n      }\n      if (Array.isArray(message) || ArrayBuffer.isView(message) ||\n        message.constructor === Buffer) {\n        return crypto.createHash('md5').update(new Buffer(message)).digest('hex');\n      } else {\n        return method(message);\n      }\n    };\n    return nodeMethod;\n  };\n\n  /**\n   * Md5 class\n   * @class Md5\n   * @description This is internal class.\n   * @see {@link md5.create}\n   */\n  function Md5(sharedMemory) {\n    if (sharedMemory) {\n      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =\n      blocks[4] = blocks[5] = blocks[6] = blocks[7] =\n      blocks[8] = blocks[9] = blocks[10] = blocks[11] =\n      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;\n      this.blocks = blocks;\n      this.buffer8 = buffer8;\n    } else {\n      if (ARRAY_BUFFER) {\n        var buffer = new ArrayBuffer(68);\n        this.buffer8 = new Uint8Array(buffer);\n        this.blocks = new Uint32Array(buffer);\n      } else {\n        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];\n      }\n    }\n    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;\n    this.finalized = this.hashed = false;\n    this.first = true;\n  }\n\n  /**\n   * @method update\n   * @memberof Md5\n   * @instance\n   * @description Update hash\n   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n   * @returns {Md5} Md5 object.\n   * @see {@link md5.update}\n   */\n  Md5.prototype.update = function (message) {\n    if (this.finalized) {\n      return;\n    }\n\n    var notString, type = typeof message;\n    if (type !== 'string') {\n      if (type === 'object') {\n        if (message === null) {\n          throw ERROR;\n        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {\n          message = new Uint8Array(message);\n        } else if (!Array.isArray(message)) {\n          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {\n            throw ERROR;\n          }\n        }\n      } else {\n        throw ERROR;\n      }\n      notString = true;\n    }\n    var code, index = 0, i, length = message.length, blocks = this.blocks;\n    var buffer8 = this.buffer8;\n\n    while (index < length) {\n      if (this.hashed) {\n        this.hashed = false;\n        blocks[0] = blocks[16];\n        blocks[16] = blocks[1] = blocks[2] = blocks[3] =\n        blocks[4] = blocks[5] = blocks[6] = blocks[7] =\n        blocks[8] = blocks[9] = blocks[10] = blocks[11] =\n        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;\n      }\n\n      if (notString) {\n        if (ARRAY_BUFFER) {\n          for (i = this.start; index < length && i < 64; ++index) {\n            buffer8[i++] = message[index];\n          }\n        } else {\n          for (i = this.start; index < length && i < 64; ++index) {\n            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];\n          }\n        }\n      } else {\n        if (ARRAY_BUFFER) {\n          for (i = this.start; index < length && i < 64; ++index) {\n            code = message.charCodeAt(index);\n            if (code < 0x80) {\n              buffer8[i++] = code;\n            } else if (code < 0x800) {\n              buffer8[i++] = 0xc0 | (code >> 6);\n              buffer8[i++] = 0x80 | (code & 0x3f);\n            } else if (code < 0xd800 || code >= 0xe000) {\n              buffer8[i++] = 0xe0 | (code >> 12);\n              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);\n              buffer8[i++] = 0x80 | (code & 0x3f);\n            } else {\n              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));\n              buffer8[i++] = 0xf0 | (code >> 18);\n              buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);\n              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);\n              buffer8[i++] = 0x80 | (code & 0x3f);\n            }\n          }\n        } else {\n          for (i = this.start; index < length && i < 64; ++index) {\n            code = message.charCodeAt(index);\n            if (code < 0x80) {\n              blocks[i >> 2] |= code << SHIFT[i++ & 3];\n            } else if (code < 0x800) {\n              blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];\n              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];\n            } else if (code < 0xd800 || code >= 0xe000) {\n              blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];\n              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];\n              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];\n            } else {\n              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));\n              blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];\n              blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];\n              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];\n              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];\n            }\n          }\n        }\n      }\n      this.lastByteIndex = i;\n      this.bytes += i - this.start;\n      if (i >= 64) {\n        this.start = i - 64;\n        this.hash();\n        this.hashed = true;\n      } else {\n        this.start = i;\n      }\n    }\n    if (this.bytes > 4294967295) {\n      this.hBytes += this.bytes / 4294967296 << 0;\n      this.bytes = this.bytes % 4294967296;\n    }\n    return this;\n  };\n\n  Md5.prototype.finalize = function () {\n    if (this.finalized) {\n      return;\n    }\n    this.finalized = true;\n    var blocks = this.blocks, i = this.lastByteIndex;\n    blocks[i >> 2] |= EXTRA[i & 3];\n    if (i >= 56) {\n      if (!this.hashed) {\n        this.hash();\n      }\n      blocks[0] = blocks[16];\n      blocks[16] = blocks[1] = blocks[2] = blocks[3] =\n      blocks[4] = blocks[5] = blocks[6] = blocks[7] =\n      blocks[8] = blocks[9] = blocks[10] = blocks[11] =\n      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;\n    }\n    blocks[14] = this.bytes << 3;\n    blocks[15] = this.hBytes << 3 | this.bytes >>> 29;\n    this.hash();\n  };\n\n  Md5.prototype.hash = function () {\n    var a, b, c, d, bc, da, blocks = this.blocks;\n\n    if (this.first) {\n      a = blocks[0] - 680876937;\n      a = (a << 7 | a >>> 25) - 271733879 << 0;\n      d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;\n      d = (d << 12 | d >>> 20) + a << 0;\n      c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;\n      c = (c << 17 | c >>> 15) + d << 0;\n      b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;\n      b = (b << 22 | b >>> 10) + c << 0;\n    } else {\n      a = this.h0;\n      b = this.h1;\n      c = this.h2;\n      d = this.h3;\n      a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;\n      a = (a << 7 | a >>> 25) + b << 0;\n      d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;\n      d = (d << 12 | d >>> 20) + a << 0;\n      c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;\n      c = (c << 17 | c >>> 15) + d << 0;\n      b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;\n      b = (b << 22 | b >>> 10) + c << 0;\n    }\n\n    a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;\n    a = (a << 7 | a >>> 25) + b << 0;\n    d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;\n    d = (d << 12 | d >>> 20) + a << 0;\n    c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;\n    c = (c << 17 | c >>> 15) + d << 0;\n    b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;\n    b = (b << 22 | b >>> 10) + c << 0;\n    a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;\n    a = (a << 7 | a >>> 25) + b << 0;\n    d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;\n    d = (d << 12 | d >>> 20) + a << 0;\n    c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;\n    c = (c << 17 | c >>> 15) + d << 0;\n    b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;\n    b = (b << 22 | b >>> 10) + c << 0;\n    a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;\n    a = (a << 7 | a >>> 25) + b << 0;\n    d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;\n    d = (d << 12 | d >>> 20) + a << 0;\n    c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;\n    c = (c << 17 | c >>> 15) + d << 0;\n    b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;\n    b = (b << 22 | b >>> 10) + c << 0;\n    a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;\n    a = (a << 5 | a >>> 27) + b << 0;\n    d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;\n    d = (d << 9 | d >>> 23) + a << 0;\n    c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;\n    c = (c << 14 | c >>> 18) + d << 0;\n    b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;\n    b = (b << 20 | b >>> 12) + c << 0;\n    a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;\n    a = (a << 5 | a >>> 27) + b << 0;\n    d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;\n    d = (d << 9 | d >>> 23) + a << 0;\n    c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;\n    c = (c << 14 | c >>> 18) + d << 0;\n    b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;\n    b = (b << 20 | b >>> 12) + c << 0;\n    a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;\n    a = (a << 5 | a >>> 27) + b << 0;\n    d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;\n    d = (d << 9 | d >>> 23) + a << 0;\n    c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;\n    c = (c << 14 | c >>> 18) + d << 0;\n    b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;\n    b = (b << 20 | b >>> 12) + c << 0;\n    a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;\n    a = (a << 5 | a >>> 27) + b << 0;\n    d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;\n    d = (d << 9 | d >>> 23) + a << 0;\n    c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;\n    c = (c << 14 | c >>> 18) + d << 0;\n    b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;\n    b = (b << 20 | b >>> 12) + c << 0;\n    bc = b ^ c;\n    a += (bc ^ d) + blocks[5] - 378558;\n    a = (a << 4 | a >>> 28) + b << 0;\n    d += (bc ^ a) + blocks[8] - 2022574463;\n    d = (d << 11 | d >>> 21) + a << 0;\n    da = d ^ a;\n    c += (da ^ b) + blocks[11] + 1839030562;\n    c = (c << 16 | c >>> 16) + d << 0;\n    b += (da ^ c) + blocks[14] - 35309556;\n    b = (b << 23 | b >>> 9) + c << 0;\n    bc = b ^ c;\n    a += (bc ^ d) + blocks[1] - 1530992060;\n    a = (a << 4 | a >>> 28) + b << 0;\n    d += (bc ^ a) + blocks[4] + 1272893353;\n    d = (d << 11 | d >>> 21) + a << 0;\n    da = d ^ a;\n    c += (da ^ b) + blocks[7] - 155497632;\n    c = (c << 16 | c >>> 16) + d << 0;\n    b += (da ^ c) + blocks[10] - 1094730640;\n    b = (b << 23 | b >>> 9) + c << 0;\n    bc = b ^ c;\n    a += (bc ^ d) + blocks[13] + 681279174;\n    a = (a << 4 | a >>> 28) + b << 0;\n    d += (bc ^ a) + blocks[0] - 358537222;\n    d = (d << 11 | d >>> 21) + a << 0;\n    da = d ^ a;\n    c += (da ^ b) + blocks[3] - 722521979;\n    c = (c << 16 | c >>> 16) + d << 0;\n    b += (da ^ c) + blocks[6] + 76029189;\n    b = (b << 23 | b >>> 9) + c << 0;\n    bc = b ^ c;\n    a += (bc ^ d) + blocks[9] - 640364487;\n    a = (a << 4 | a >>> 28) + b << 0;\n    d += (bc ^ a) + blocks[12] - 421815835;\n    d = (d << 11 | d >>> 21) + a << 0;\n    da = d ^ a;\n    c += (da ^ b) + blocks[15] + 530742520;\n    c = (c << 16 | c >>> 16) + d << 0;\n    b += (da ^ c) + blocks[2] - 995338651;\n    b = (b << 23 | b >>> 9) + c << 0;\n    a += (c ^ (b | ~d)) + blocks[0] - 198630844;\n    a = (a << 6 | a >>> 26) + b << 0;\n    d += (b ^ (a | ~c)) + blocks[7] + 1126891415;\n    d = (d << 10 | d >>> 22) + a << 0;\n    c += (a ^ (d | ~b)) + blocks[14] - 1416354905;\n    c = (c << 15 | c >>> 17) + d << 0;\n    b += (d ^ (c | ~a)) + blocks[5] - 57434055;\n    b = (b << 21 | b >>> 11) + c << 0;\n    a += (c ^ (b | ~d)) + blocks[12] + 1700485571;\n    a = (a << 6 | a >>> 26) + b << 0;\n    d += (b ^ (a | ~c)) + blocks[3] - 1894986606;\n    d = (d << 10 | d >>> 22) + a << 0;\n    c += (a ^ (d | ~b)) + blocks[10] - 1051523;\n    c = (c << 15 | c >>> 17) + d << 0;\n    b += (d ^ (c | ~a)) + blocks[1] - 2054922799;\n    b = (b << 21 | b >>> 11) + c << 0;\n    a += (c ^ (b | ~d)) + blocks[8] + 1873313359;\n    a = (a << 6 | a >>> 26) + b << 0;\n    d += (b ^ (a | ~c)) + blocks[15] - 30611744;\n    d = (d << 10 | d >>> 22) + a << 0;\n    c += (a ^ (d | ~b)) + blocks[6] - 1560198380;\n    c = (c << 15 | c >>> 17) + d << 0;\n    b += (d ^ (c | ~a)) + blocks[13] + 1309151649;\n    b = (b << 21 | b >>> 11) + c << 0;\n    a += (c ^ (b | ~d)) + blocks[4] - 145523070;\n    a = (a << 6 | a >>> 26) + b << 0;\n    d += (b ^ (a | ~c)) + blocks[11] - 1120210379;\n    d = (d << 10 | d >>> 22) + a << 0;\n    c += (a ^ (d | ~b)) + blocks[2] + 718787259;\n    c = (c << 15 | c >>> 17) + d << 0;\n    b += (d ^ (c | ~a)) + blocks[9] - 343485551;\n    b = (b << 21 | b >>> 11) + c << 0;\n\n    if (this.first) {\n      this.h0 = a + 1732584193 << 0;\n      this.h1 = b - 271733879 << 0;\n      this.h2 = c - 1732584194 << 0;\n      this.h3 = d + 271733878 << 0;\n      this.first = false;\n    } else {\n      this.h0 = this.h0 + a << 0;\n      this.h1 = this.h1 + b << 0;\n      this.h2 = this.h2 + c << 0;\n      this.h3 = this.h3 + d << 0;\n    }\n  };\n\n  /**\n   * @method hex\n   * @memberof Md5\n   * @instance\n   * @description Output hash as hex string\n   * @returns {String} Hex string\n   * @see {@link md5.hex}\n   * @example\n   * hash.hex();\n   */\n  Md5.prototype.hex = function () {\n    this.finalize();\n\n    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;\n\n    return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +\n      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +\n      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +\n      HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +\n      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +\n      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +\n      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +\n      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +\n      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +\n      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +\n      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +\n      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +\n      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +\n      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +\n      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +\n      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];\n  };\n\n  /**\n   * @method toString\n   * @memberof Md5\n   * @instance\n   * @description Output hash as hex string\n   * @returns {String} Hex string\n   * @see {@link md5.hex}\n   * @example\n   * hash.toString();\n   */\n  Md5.prototype.toString = Md5.prototype.hex;\n\n  /**\n   * @method digest\n   * @memberof Md5\n   * @instance\n   * @description Output hash as bytes array\n   * @returns {Array} Bytes array\n   * @see {@link md5.digest}\n   * @example\n   * hash.digest();\n   */\n  Md5.prototype.digest = function () {\n    this.finalize();\n\n    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;\n    return [\n      h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,\n      h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,\n      h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,\n      h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF\n    ];\n  };\n\n  /**\n   * @method array\n   * @memberof Md5\n   * @instance\n   * @description Output hash as bytes array\n   * @returns {Array} Bytes array\n   * @see {@link md5.array}\n   * @example\n   * hash.array();\n   */\n  Md5.prototype.array = Md5.prototype.digest;\n\n  /**\n   * @method arrayBuffer\n   * @memberof Md5\n   * @instance\n   * @description Output hash as ArrayBuffer\n   * @returns {ArrayBuffer} ArrayBuffer\n   * @see {@link md5.arrayBuffer}\n   * @example\n   * hash.arrayBuffer();\n   */\n  Md5.prototype.arrayBuffer = function () {\n    this.finalize();\n\n    var buffer = new ArrayBuffer(16);\n    var blocks = new Uint32Array(buffer);\n    blocks[0] = this.h0;\n    blocks[1] = this.h1;\n    blocks[2] = this.h2;\n    blocks[3] = this.h3;\n    return buffer;\n  };\n\n  /**\n   * @method buffer\n   * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.\n   * @memberof Md5\n   * @instance\n   * @description Output hash as ArrayBuffer\n   * @returns {ArrayBuffer} ArrayBuffer\n   * @see {@link md5.buffer}\n   * @example\n   * hash.buffer();\n   */\n  Md5.prototype.buffer = Md5.prototype.arrayBuffer;\n\n  /**\n   * @method base64\n   * @memberof Md5\n   * @instance\n   * @description Output hash as base64 string\n   * @returns {String} base64 string\n   * @see {@link md5.base64}\n   * @example\n   * hash.base64();\n   */\n  Md5.prototype.base64 = function () {\n    var v1, v2, v3, base64Str = '', bytes = this.array();\n    for (var i = 0; i < 15;) {\n      v1 = bytes[i++];\n      v2 = bytes[i++];\n      v3 = bytes[i++];\n      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +\n        BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +\n        BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +\n        BASE64_ENCODE_CHAR[v3 & 63];\n    }\n    v1 = bytes[i];\n    base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +\n      BASE64_ENCODE_CHAR[(v1 << 4) & 63] +\n      '==';\n    return base64Str;\n  };\n\n  var exports = createMethod();\n\n  if (COMMON_JS) {\n    module.exports = exports;\n  } else {\n    /**\n     * @method md5\b\n     * @description Md5 hash function, export to global in browsers.\n     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash\n     * @returns {String} md5 hashes\n     * @example\n     * md5(''); // d41d8cd98f00b204e9800998ecf8427e\n     * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6\n     * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0\n     *\n     * // It also supports UTF-8 encoding\n     * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07\n     *\n     * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`\n     * md5([]); // d41d8cd98f00b204e9800998ecf8427e\n     * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e\n     */\n    root.md5 = exports;\n    if (AMD) {\n      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {\n        return exports;\n      }).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n  }\n})();\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ \"./node_modules/process/browser.js\"), __webpack_require__(/*! ./../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://TIC/./node_modules/js-md5/src/md5.js?");

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//# sourceURL=webpack://TIC/./node_modules/process/browser.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/amd-options.js":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */\nmodule.exports = __webpack_amd_options__;\n\n/* WEBPACK VAR INJECTION */}.call(this, {}))\n\n//# sourceURL=webpack://TIC/(webpack)/buildin/amd-options.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack://TIC/(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/TIC.js":
/*!********************!*\
  !*** ./src/TIC.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ \"./node_modules/core-js/modules/es6.regexp.to-string.js\");\n/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es6_date_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.date.to-string */ \"./node_modules/core-js/modules/es6.date.to-string.js\");\n/* harmony import */ var core_js_modules_es6_date_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_date_to_string__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _constant_Constant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constant/Constant */ \"./src/constant/Constant.js\");\n/* harmony import */ var _webim_WebIM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./webim/WebIM */ \"./src/webim/WebIM.js\");\n/* harmony import */ var _webboard_webBoard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./webboard/webBoard */ \"./src/webboard/webBoard.js\");\n/* harmony import */ var _webrtc_WebRTC__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./webrtc/WebRTC */ \"./src/webrtc/WebRTC.js\");\n/* harmony import */ var _event_MessageListener__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./event/MessageListener */ \"./src/event/MessageListener.js\");\n/* harmony import */ var _event_EventListener__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./event/EventListener */ \"./src/event/EventListener.js\");\n/* harmony import */ var _event_StatusListener__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./event/StatusListener */ \"./src/event/StatusListener.js\");\n/* harmony import */ var _model_AccountModel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./model/AccountModel */ \"./src/model/AccountModel.js\");\n/* harmony import */ var _model_BoardOptionModel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./model/BoardOptionModel */ \"./src/model/BoardOptionModel.js\");\n/* harmony import */ var _model_WebRTCOptionModel__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./model/WebRTCOptionModel */ \"./src/model/WebRTCOptionModel.js\");\n/* harmony import */ var _config_Config__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./config/Config */ \"./src/config/Config.js\");\n/* harmony import */ var _log_LogReport__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./log/LogReport */ \"./src/log/LogReport.js\");\n/* harmony import */ var _model_ClassModel__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./model/ClassModel */ \"./src/model/ClassModel.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfunction TIC() {\n  this.accountModel = new _model_AccountModel__WEBPACK_IMPORTED_MODULE_9__[\"default\"]();\n  this.boardOptionModel = new _model_BoardOptionModel__WEBPACK_IMPORTED_MODULE_10__[\"default\"]();\n  this.webRTCOptionModel = new _model_WebRTCOptionModel__WEBPACK_IMPORTED_MODULE_11__[\"default\"]();\n  this.classModel = new _model_ClassModel__WEBPACK_IMPORTED_MODULE_14__[\"default\"]();\n  this.messageListener = new _event_MessageListener__WEBPACK_IMPORTED_MODULE_6__[\"default\"]();\n  this.eventListener = new _event_EventListener__WEBPACK_IMPORTED_MODULE_7__[\"default\"]();\n  this.statusListener = new _event_StatusListener__WEBPACK_IMPORTED_MODULE_8__[\"default\"]();\n  this.ticVersion = _config_Config__WEBPACK_IMPORTED_MODULE_12__[\"default\"].version;\n  this.log = new _log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"]();\n  this.log.setSdkVersion(_config_Config__WEBPACK_IMPORTED_MODULE_12__[\"default\"].version);\n  this._disableAllModule = false; // 禁用所有模块\n\n  this._disableTRTCModule = false; // 禁用TRTC模块\n}\n/** @constant {string} */\n\n\nTIC.CONSTANT = _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\nTIC.prototype = {\n  /**\r\n   * 初始化;\r\n   * @param sdkAppId\t\t\t在腾讯云申请的sdkAppId\r\n   * @param callback\t\t\t回调\r\n   * @return 错误码, 0表示成功\r\n   */\n  init: function init(sdkAppId, disableModule, callback) {\n    var cb = null;\n\n    if (arguments.length == 2) {\n      cb = disableModule;\n    } else if (arguments.length == 3) {\n      cb = callback; // 不禁用所有模块\n\n      if (disableModule === _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICDisableModule.TIC_DISABLE_MODULE_NONE) {\n        this._disableAllModule = false;\n      } else if (disableModule >> 1 & 1 === 1) {\n        // 禁用TRTC模块\n        this._disableAllModule = false;\n        this._disableTRTCModule = true; // 禁用TRTC模块\n      }\n    }\n\n    this.log.setSdkAppId(sdkAppId);\n    var startTime = Date.now(); // 初始化开始\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITSDK_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: '',\n      ext: ''\n    });\n\n    if (sdkAppId) {\n      this.ticWebIm = new _webim_WebIM__WEBPACK_IMPORTED_MODULE_3__[\"default\"]();\n      this.ticWebIm.setLog(this.log);\n      this.accountModel.sdkAppId = sdkAppId;\n      this.ticWebIm.init(sdkAppId);\n      cb && cb({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      }); // 初始化完成\n\n      this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITSDK_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n    } else {\n      cb && cb({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: -7,\n        desc: 'sdkAppId is illegal'\n      }); // 初始化\n\n      this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITSDK_END, {\n        errorCode: -7,\n        errorDesc: 'sdkAppId is illegal',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n    }\n  },\n  // 保留接口\n  uninit: function uninit() {// this.tim.uninitEvent();\n  },\n\n  /**\r\n   * 登录\r\n   * @param loginConfig\t\tuserid, usersig鉴权信息\r\n   * @param callback\t\t\t回调\r\n   */\n  login: function login(loginConfig, callback) {\n    var _this = this;\n\n    var startTime = Date.now();\n    this.accountModel.userId = loginConfig.userId;\n    this.accountModel.userSig = loginConfig.userSig;\n    this.log.setUserId(loginConfig.userId); // 登录-start\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.LOGIN_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: '',\n      ext: ''\n    });\n    this.ticWebIm.login(this.accountModel, this.classModel).then(function () {\n      _this.ticWebIm.setMessageListener(_this.messageListener);\n\n      _this.ticWebIm.setEventListener(_this.eventListener);\n\n      _this.ticWebIm.setStatusListener(_this.statusListener);\n\n      _this.addTICStatusListener({\n        // 监听被踢下线\n        onTICForceOffline: function onTICForceOffline() {\n          _this.ticWebRTC && _this.ticWebRTC.quit();\n          _this.ticBoard && _this.ticBoard.quit(); // this.removeTICEventListener();\n          // this.removeTICMessageListener();\n          // this.removeTICStatusListener();\n        }\n      }); // 登录- end\n\n\n      _this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.LOGIN_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }, function (error) {\n      // 登录- end\n      _this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.LOGIN_END, {\n        errorCode: error.code,\n        errorDesc: error.message,\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 登出\r\n   * @param callback\t\t\t回调\r\n   */\n  logout: function logout(callback) {\n    var _this2 = this;\n\n    var startTime = Date.now(); // 登出-start\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.LOGOUT_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: '',\n      ext: ''\n    });\n    this.ticWebIm.logout().then(function () {\n      // 登出-end\n      _this2.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.LOGOUT_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }).catch(function (error) {\n      // 登出-end\n      _this2.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.LOGOUT_END, {\n        errorCode: error.code,\n        errorDesc: error.message,\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 创建课堂\r\n   * @param classObj\t\t\t课堂ID，由业务生成和维护\r\n   * @param callback\t\t\t回调\r\n   */\n  createClassroom: function createClassroom(classObj, callback) {\n    var _this3 = this;\n\n    // 默认是实时通话场景\n    var scene = _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL; // 0 实时通话场景  1 直播场景\n\n    var classId = classObj; // 如果是对象，则要拆一下classId\n\n    if (Object.prototype.toString.call(classObj) === '[object Object]') {\n      classId = classObj.classId;\n      scene = classObj.classScene || _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL; // 场景\n    }\n\n    var startTime = Date.now(); // 创建课堂-start\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.CREATEGROUP_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: classId + '',\n      ext: 'scene:' + scene // 将场景上报\n\n    }); // WebIM加入聊天房间\n\n    this.ticWebIm.createRoom(classId, scene).then(function () {\n      // 创建课堂-end\n      _this3.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.CREATEGROUP_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: classId + '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }, function (error) {\n      // 创建课堂-end\n      _this3.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.CREATEGROUP_END, {\n        errorCode: error.code,\n        errorDesc: error.message,\n        timeCost: Date.now() - startTime,\n        data: classId + '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 加入课堂\r\n   * @param classId\t\t课堂ID\r\n   * @param webRTCOption\t\tWebRTC相关参数\r\n   * @param boardOption\t白板相关参数\r\n   * @param callback\t\t\t回调\r\n   */\n  joinClassroom: function joinClassroom(classOption, webRTCOption, boardOption, callback) {\n    var _this4 = this;\n\n    var classId = null;\n\n    if (Object.prototype.toString.call(classOption) === '[object Object]') {\n      this.classModel.compatSaas = !!classOption.compatSaas;\n      classId = classOption.classId;\n    } else {\n      classId = classOption;\n    }\n\n    this.log.setRoomId(classId);\n    var startTime = Date.now(); // 加入课堂-start\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINGROUP_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: '',\n      ext: JSON.stringify({\n        webRTCOption: webRTCOption,\n        boardOption: boardOption\n      })\n    });\n    this.accountModel.classId = classId; // 是否需要与saas同步\n\n    if (this.classModel.compatSaas) {\n      this.accountModel.classChatId = classId + '_chat';\n    } else {\n      this.classModel.classChatId = classId;\n    }\n\n    this.ticWebIm.joinRoom().then(function (res) {\n      // 加入课堂-end\n      _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINGROUP_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n\n      _this4.ticWebIm.setReceiveBoardNotifyCallback(function (boardData) {\n        if (_this4.ticBoard && _this4.ticBoard.getInstance()) {\n          _this4.ticBoard.getInstance().addSyncData(JSON.parse(boardData));\n        }\n      }); // 如果禁用了所有模块 || 禁用了TRTC模块 || 进房参数传了false\n\n\n      if (_this4._disableAllModule || _this4._disableTRTCModule || !webRTCOption) {\n        // 白板初始化\n        _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITBOARD_START, {\n          errorCode: 0,\n          errorDesc: '',\n          timeCost: Date.now() - startTime,\n          data: '',\n          ext: ''\n        });\n\n        _this4.boardOptionModel.setData(boardOption);\n\n        _this4.ticBoard = new _webboard_webBoard__WEBPACK_IMPORTED_MODULE_4__[\"default\"](_this4.accountModel, _this4.boardOptionModel);\n\n        _this4.ticBoard.setLog(_this4.log);\n\n        _this4.ticBoard.render(); // 白板初始化\n\n\n        _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITBOARD_END, {\n          errorCode: 0,\n          errorDesc: '',\n          timeCost: Date.now() - startTime,\n          data: '',\n          ext: ''\n        }); // 设置白板的监听回调\n\n\n        _this4.ticBoard.addSyncDataEventCallback(function (data) {\n          _this4.ticWebIm.sendBoardGroupCustomMessage(data).then(function (content) {\n            var board = _this4.getBoardInstance();\n\n            board && board.addAckData(content);\n          });\n        });\n\n        callback && callback({\n          module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n          code: 0\n        });\n      } else {\n        _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.ENTERROOM_START, {\n          errorCode: 0,\n          errorDesc: '',\n          timeCost: Date.now() - startTime,\n          data: '',\n          ext: ''\n        });\n\n        _this4.webRTCOptionModel.setData(webRTCOption);\n\n        _this4.ticWebRTC = new _webrtc_WebRTC__WEBPACK_IMPORTED_MODULE_5__[\"default\"](_this4.accountModel, _this4.webRTCOptionModel);\n\n        _this4.ticWebRTC.setLog(_this4.log);\n\n        _this4.ticWebRTC.setEventListener(_this4.eventListener);\n\n        _this4.ticWebRTC.joinAvRoom(function () {\n          // 加入AV房间-end\n          _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.ENTERROOM_END, {\n            errorCode: 0,\n            errorDesc: '',\n            timeCost: Date.now() - startTime,\n            data: '',\n            ext: ''\n          });\n\n          _this4.ticWebRTC.setStatusListener(_this4.statusListener); // 白板初始化\n\n\n          _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITBOARD_START, {\n            errorCode: 0,\n            errorDesc: '',\n            timeCost: Date.now() - startTime,\n            data: '',\n            ext: ''\n          });\n\n          _this4.boardOptionModel.setData(boardOption);\n\n          _this4.ticBoard = new _webboard_webBoard__WEBPACK_IMPORTED_MODULE_4__[\"default\"](_this4.accountModel, _this4.boardOptionModel);\n\n          _this4.ticBoard.setLog(_this4.log);\n\n          try {\n            _this4.ticBoard.render(); // 白板初始化\n\n\n            _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.INITBOARD_END, {\n              errorCode: 0,\n              errorDesc: '',\n              timeCost: Date.now() - startTime,\n              data: '',\n              ext: ''\n            }); // 设置白板的监听回调\n\n\n            _this4.ticBoard.addSyncDataEventCallback(function (data) {\n              _this4.ticWebIm.sendBoardGroupCustomMessage(data).then(function (content) {\n                var board = _this4.getBoardInstance();\n\n                board && board.addAckData(content);\n              });\n            });\n\n            callback && callback({\n              module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n              code: 0\n            });\n          } catch (error) {\n            _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.ENTERROOM_END, {\n              errorCode: -9999,\n              errorDesc: error.message,\n              timeCost: Date.now() - startTime,\n              data: '',\n              ext: JSON.stringify({\n                stack: error.stack,\n                message: error.message\n              })\n            });\n\n            callback && callback({\n              module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_BOARD,\n              code: -9999,\n              desc: error.message\n            });\n          }\n        }, function (error) {\n          // 加入AV房间-end\n          _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.ENTERROOM_END, {\n            errorCode: error.errorCode,\n            errorDesc: error.message,\n            timeCost: Date.now() - startTime,\n            data: '',\n            ext: JSON.stringify({\n              stack: error.stack,\n              message: error.message\n            })\n          });\n\n          callback && callback({\n            module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_TRTC,\n            code: error.errorCode,\n            desc: error.message\n          });\n        });\n      }\n    }, function (error) {\n      // 加入课堂-end\n      _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINGROUP_END, {\n        errorCode: error.code,\n        errorDesc: error.message,\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    }); // 如果需要与saas同步\n\n    if (this.classModel.compatSaas) {\n      // 加入聊天群-start\n      this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINCHATGROUP_START, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      });\n      this.ticWebIm.joinSaasChatRoom().then(function (res) {\n        // 加入聊天群-end\n        _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINCHATGROUP_END, {\n          errorCode: 0,\n          errorDesc: '',\n          timeCost: Date.now() - startTime,\n          data: '',\n          ext: ''\n        });\n      }, function () {\n        // 重试一次\n        _this4.ticWebIm.joinSaasChatRoom().then(function () {\n          // 加入聊天群-end\n          _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINCHATGROUP_END, {\n            errorCode: 0,\n            errorDesc: '',\n            timeCost: Date.now() - startTime,\n            data: '',\n            ext: ''\n          });\n        }, function (error) {\n          // 加入聊天群-end\n          _this4.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.JOINCHATGROUP_END, {\n            errorCode: error.code,\n            errorDesc: error.message,\n            timeCost: Date.now() - startTime,\n            data: '',\n            ext: ''\n          });\n        });\n      });\n    }\n  },\n\n  /**\r\n   * 退出课堂\r\n   * @param callback\t\t\t回调\r\n   */\n  quitClassroom: function quitClassroom(callback) {\n    var _this5 = this;\n\n    var startTime = Date.now(); // 退出课堂-start\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.QUITGROUP_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: '',\n      ext: ''\n    });\n    this.ticWebIm.quitGroup().then(function () {\n      _this5.ticWebRTC && _this5.ticWebRTC.quit();\n      _this5.ticBoard && _this5.ticBoard.quit(); // 退出课堂-end\n\n      _this5.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.QUITGROUP_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      }); // 退出成功\n\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }).catch(function (error) {\n      // 退出课堂-end\n      _this5.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.QUITGROUP_END, {\n        errorCode: error.code,\n        errorDesc: error.message,\n        timeCost: Date.now() - startTime,\n        data: '',\n        ext: ''\n      }); // 退出失败\n\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    }); // 如果与互动课堂互通\n\n    if (this.classModel.compatSaas) {\n      this.ticWebIm.quitChatGroup();\n    }\n  },\n\n  /**\r\n   * 销毁课堂\r\n   * @param classId\t\t\t课堂ID，由业务生成和维护\r\n   * @param callback\t\t\t回调\r\n   */\n  destroyClassroom: function destroyClassroom(classId, callback) {\n    var _this6 = this;\n\n    var startTime = Date.now(); // 销毁课堂-start\n\n    this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.DELETEGROUP_START, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: Date.now() - startTime,\n      data: classId + '',\n      ext: ''\n    });\n    this.ticWebIm.destroyGroup(classId).then(function (data) {\n      _this6.ticWebRTC && _this6.ticWebRTC.quit();\n      _this6.ticBoard && _this6.ticBoard.clearAll();\n      _this6.ticBoard && _this6.ticBoard.quit(); // 销毁课堂-start\n\n      _this6.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.DELETEGROUP_END, {\n        errorCode: 0,\n        errorDesc: '',\n        timeCost: Date.now() - startTime,\n        data: classId + '',\n        ext: ''\n      }); // 销毁成功\n\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }).catch(function (error) {\n      // 销毁课堂-end\n      _this6.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_13__[\"default\"].EVENT_NAME.DELETEGROUP_END, {\n        errorCode: error.code,\n        errorDesc: error.message,\n        timeCost: Date.now() - startTime,\n        data: classId + '',\n        ext: ''\n      }); // 销毁失败\n\n\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 发送C2C文本消息\r\n   * @param userId\t\t\t消息接收者\r\n   * @param text\t\t\t\t文本消息内容\r\n   * @param callback\t\t\t回调\r\n   */\n  sendTextMessage: function sendTextMessage(userId, text, callback) {\n    this.ticWebIm.sendC2CTextMessage(userId, text).then(function () {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }, function (error) {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 发送C2C自定义消息\r\n   * @param userId\t\t\t消息接收者\r\n   * @param data\t\t\t\t自定义消息内容\r\n   * @param callback\t\t\t回调\r\n   */\n  sendCustomMessage: function sendCustomMessage(userId, data, callback) {\n    this.ticWebIm.sendC2CCustomMessage(userId, data).then(function () {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }, function (error) {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 发送群文本消息\r\n   * @param text\t\t\t\t文本消息内容\r\n   * @param callback\t\t\t回调\r\n   */\n  sendGroupTextMessage: function sendGroupTextMessage(text, callback) {\n    this.ticWebIm.sendGroupTextMessage(text).then(function () {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }, function (error) {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * 发送群自定义消息\r\n   * @param data\t\t\t\t自定义消息内容\r\n   * @param callback\t\t\t回调\r\n   */\n  sendGroupCustomMessage: function sendGroupCustomMessage(text, callback) {\n    this.ticWebIm.sendGroupCustomMessage(text).then(function () {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: 0\n      });\n    }, function (error) {\n      callback && callback({\n        module: _constant_Constant__WEBPACK_IMPORTED_MODULE_2__[\"default\"].TICModule.TICMODULE_IMSDK,\n        code: error.code,\n        desc: error.message\n      });\n    });\n  },\n\n  /**\r\n   * @desc 获取白板实例\r\n   * @return {Board} board 返回白板实例\r\n   */\n  getBoardInstance: function getBoardInstance() {\n    return this.ticBoard.getInstance();\n  },\n\n  /**\r\n   * @desc 获取IM实例, 初始化TICKSDK后即可获得IM实例\r\n   * @return {webim} im 返回IM实例\r\n   */\n  getImInstance: function getImInstance() {\n    return this.ticWebIm.getInstance();\n  },\n\n  /**\r\n   * @desc  获取trtc client 实例\r\n   * @return {WebRTC} cos 返回WebRTC实例\r\n   */\n  getTrtcClient: function getTrtcClient() {\n    return this.ticWebRTC && this.ticWebRTC.getInstance();\n  },\n\n  /**\r\n   * 添加IM消息监听回调\r\n   * @param listener\t\t\t回调\r\n   */\n  addTICMessageListener: function addTICMessageListener(listener) {\n    this.messageListener.addTICMessageListener(listener);\n  },\n\n  /**\r\n   * 移除IM消息监听回调\r\n   * @param listener\t\t\t回调\r\n   */\n  removeTICMessageListener: function removeTICMessageListener(listener) {\n    this.messageListener.removeTICMessageListener(listener);\n  },\n\n  /**\r\n   * 添加事件监听回调\r\n   * @param listener\t\t\t回调\r\n   */\n  addTICEventListener: function addTICEventListener(listener) {\n    this.eventListener.addTICEventListener(listener);\n  },\n\n  /**\r\n   * 移除事件监听回调\r\n   * @param listener\t\t\t回调\r\n   */\n  removeTICEventListener: function removeTICEventListener(listener) {\n    this.eventListener.removeTICEventListener(listener);\n  },\n\n  /**\r\n   * 添加IM状态监听回调\r\n   * @param listener\t\t\t回调\r\n   */\n  addTICStatusListener: function addTICStatusListener(listener) {\n    this.statusListener.addTICStatusListener(listener);\n  },\n\n  /**\r\n   * 移除IM状态监听回调\r\n   * @param listener\t\t\t回调\r\n   */\n  removeTICStatusListener: function removeTICStatusListener(listener) {\n    this.statusListener.removeTICStatusListener(listener);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (TIC);\n\n//# sourceURL=webpack://TIC/./src/TIC.js?");

/***/ }),

/***/ "./src/config/Config.js":
/*!******************************!*\
  !*** ./src/config/Config.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  version: '2.5.0'\n});\n\n//# sourceURL=webpack://TIC/./src/config/Config.js?");

/***/ }),

/***/ "./src/constant/Constant.js":
/*!**********************************!*\
  !*** ./src/constant/Constant.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar Constant = {\n  TICModule: {\n    TICMODULE_IMSDK: 0,\n    //IMSDK模块\n    TICMODULE_TRTC: 1,\n    //TRTC模块\n    TICMODULE_BOARD: 2,\n    //BOARD模块\n    TICMODULE_TIC: 3 //TIC模块\n\n  },\n\n  /**\r\n   * 课堂场景\r\n   **/\n  TICClassScene: {\n    TIC_CLASS_SCENE_VIDEO_CALL: 0,\n    //实时通话模式，支持1000人以下场景，低延时\n    TIC_CLASS_SCENE_LIVE: 1 //直播模式，支持1000人以上场景，会增加600ms左右延时\n\n  },\n\n  /**\r\n   * 房间角色\r\n   * 仅适用于直播模式（TIC_CLASS_SCENE_LIVE），角色TIC_ROLE_TYPE_ANCHOR具有上行权限\r\n   **/\n  TICRoleType: {\n    TIC_ROLE_TYPE_ANCHOR: 20,\n    //主播\n    TIC_ROLE_TYPE_AUDIENCE: 21 //观众\n\n  },\n  TICDisableModule: {\n    TIC_DISABLE_MODULE_NONE: 0,\n    //默认全部启用\n    TIC_DISABLE_MODULE_TRTC: 1 << 1 //禁用TRTC\n\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Constant);\n\n//# sourceURL=webpack://TIC/./src/constant/Constant.js?");

/***/ }),

/***/ "./src/event/EventListener.js":
/*!************************************!*\
  !*** ./src/event/EventListener.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ \"./node_modules/core-js/modules/web.dom.iterable.js\");\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction EventListener() {\n  this.listenerList = [];\n}\n\nEventListener.prototype.addTICEventListener = function (listener) {\n  this.listenerList.push(listener);\n};\n\nEventListener.prototype.removeTICEventListener = function (listener) {\n  if (listener) {\n    var index = -1;\n\n    for (var i = 0, len = this.listenerList.length; i < len; i++) {\n      if (listener == this.listenerList[i]) {\n        index = i;\n      }\n    }\n\n    if (index > -1) {\n      this.listenerList.splice(index, 1);\n    }\n  } else {\n    this.listenerList = [];\n  }\n};\n\nEventListener.prototype.fireEvent = function (eventName) {\n  for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    data[_key - 1] = arguments[_key];\n  }\n\n  this.listenerList.forEach(function (listener) {\n    var callback = listener[eventName];\n    callback && callback.apply(void 0, data);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (EventListener);\n\n//# sourceURL=webpack://TIC/./src/event/EventListener.js?");

/***/ }),

/***/ "./src/event/MessageListener.js":
/*!**************************************!*\
  !*** ./src/event/MessageListener.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ \"./node_modules/core-js/modules/web.dom.iterable.js\");\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction MessageListener() {\n  this.listenerList = [];\n} // 增加消息监听\n\n\nMessageListener.prototype.addTICMessageListener = function (listener) {\n  this.listenerList.push(listener);\n};\n\nMessageListener.prototype.removeTICMessageListener = function (listener) {\n  if (listener) {\n    var index = -1;\n\n    for (var i = 0, len = this.listenerList.length; i < len; i++) {\n      if (listener == this.listenerList[i]) {\n        index = i;\n      }\n    }\n\n    if (index > -1) {\n      this.listenerList.splice(index, 1);\n    }\n  } else {\n    this.listenerList = [];\n  }\n};\n\nMessageListener.prototype.fireEvent = function (eventName) {\n  for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    data[_key - 1] = arguments[_key];\n  }\n\n  this.listenerList.forEach(function (listener) {\n    var callback = listener[eventName];\n    callback && callback.apply(void 0, data);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MessageListener);\n\n//# sourceURL=webpack://TIC/./src/event/MessageListener.js?");

/***/ }),

/***/ "./src/event/StatusListener.js":
/*!*************************************!*\
  !*** ./src/event/StatusListener.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ \"./node_modules/core-js/modules/web.dom.iterable.js\");\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction StatusListener() {\n  this.listenerList = [];\n} // 增加消息监听\n\n\nStatusListener.prototype.addTICStatusListener = function (listener) {\n  this.listenerList.push(listener);\n};\n\nStatusListener.prototype.removeTICStatusListener = function (listener) {\n  if (listener) {\n    var index = -1;\n\n    for (var i = 0, len = this.listenerList.length; i < len; i++) {\n      if (listener == this.listenerList[i]) {\n        index = i;\n      }\n    }\n\n    if (index > -1) {\n      this.listenerList.splice(index, 1);\n    }\n  } else {\n    this.listenerList = [];\n  }\n};\n\nStatusListener.prototype.fireEvent = function (eventName) {\n  for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    data[_key - 1] = arguments[_key];\n  }\n\n  this.listenerList.forEach(function (listener) {\n    var callback = listener[eventName];\n    callback && callback.apply(void 0, data);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (StatusListener);\n\n//# sourceURL=webpack://TIC/./src/event/StatusListener.js?");

/***/ }),

/***/ "./src/log/LogReport.js":
/*!******************************!*\
  !*** ./src/log/LogReport.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.object.assign */ \"./node_modules/core-js/modules/es6.object.assign.js\");\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var js_md5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-md5 */ \"./node_modules/js-md5/src/md5.js\");\n/* harmony import */ var js_md5__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(js_md5__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar LogReport =\n/*#__PURE__*/\nfunction () {\n  function LogReport() {\n    _classCallCheck(this, LogReport);\n\n    this.reportApi = 'https://ilivelog.qcloud.com/log/report';\n    this.reportData = {\n      business: 'tic2.0',\n      dcid: 'dc0000',\n      version: 0,\n      kv_str: ''\n    };\n    this.businessData = {\n      sdkAppId: '',\n      //int\t应用标识\n      userId: '',\n      //String\t用户Id\n      sdkVersion: '',\n      //String\tsdk版本号\n      devId: '',\n      //String\t设备Id\n      devType: '',\n      //String\t设备型号\n      netType: '',\n      //String\t网络类型，\"Wifi\",\"4G\",\"3G\",\"2G\"\n      platform: 'Web',\n      //String\t平台，\"iOS\",\"Android\",\"macOS\",\"Windows\",\"Web\",\"小程序\"\n      sysVersion: navigator.userAgent,\n      //String\t系统版本\n      roomId: '',\n      //String\t房间号\n      event: '',\n      //String\t事件\n      errorCode: '',\n      //int\t错误码\n      errorDesc: '',\n      //String\t错误信息\n      timeCost: '',\n      //int\t耗时（ms）\n      timestamp: '',\n      //int64\t时间戳（ms）\n      data: '',\n      //String\t事件数据\n      ext: '' //String\t扩展字段\n\n    };\n  }\n\n  _createClass(LogReport, [{\n    key: \"setSdkAppId\",\n    value: function setSdkAppId(sdkAppId) {\n      this.businessData.sdkAppId = sdkAppId;\n    }\n  }, {\n    key: \"setUserId\",\n    value: function setUserId(userId) {\n      this.businessData.userId = userId;\n    }\n  }, {\n    key: \"setSdkVersion\",\n    value: function setSdkVersion(sdkVersion) {\n      this.businessData.sdkVersion = sdkVersion;\n    }\n  }, {\n    key: \"setRoomId\",\n    value: function setRoomId(roomId) {\n      this.businessData.roomId = roomId;\n    }\n  }, {\n    key: \"getXHR\",\n    value: function getXHR() {\n      var xmlhttp = null;\n\n      if (window.XMLHttpRequest) {\n        xmlhttp = new XMLHttpRequest();\n      } else if (window.ActiveXObject) {\n        try {\n          xmlhttp = new ActiveXObject(\"Msxml2.XMLHTTP\");\n        } catch (e) {\n          try {\n            xmlhttp = new ActiveXObject(\"Microsoft.XMLHTTP\");\n          } catch (e) {}\n        }\n      }\n\n      if (xmlhttp == null) {\n        return;\n      }\n\n      return xmlhttp;\n    }\n  }, {\n    key: \"post\",\n    value: function post() {\n      var arr = [];\n\n      for (var p in this.businessData) {\n        if (p === 'errorDesc') {\n          arr.push(\"\".concat(p, \"=\").concat(encodeURIComponent(this.businessData[p])));\n        } else {\n          arr.push(\"\".concat(p, \"=\").concat(this.businessData[p]));\n        }\n      }\n\n      this.reportData.kv_str = arr.join('&');\n      var xhr = this.getXHR();\n      xhr.open('POST', this.reportApi + '?sign=' + js_md5__WEBPACK_IMPORTED_MODULE_1___default()(JSON.stringify(this.reportData)), true);\n      xhr.setRequestHeader(\"Content-type\", \"application/json\");\n      xhr.send(JSON.stringify(this.reportData));\n    }\n  }, {\n    key: \"report\",\n    value: function report(eventName, data) {\n      this.businessData.event = eventName;\n      Object.assign(this.businessData, {\n        timestamp: Date.now()\n      }, data);\n      this.post();\n    }\n  }]);\n\n  return LogReport;\n}();\n\nLogReport.EVENT_NAME = {\n  INITSDK_START: 'initSdk_start',\n  //\tim初始化\t\n  INITSDK_END: 'initSdk_end',\n  //\tim初始化\t\n  LOGIN_START: 'login_start',\n  //\tim登陆\t\n  LOGIN_END: 'login_end',\n  //\tim登陆\t\n  LOGOUT_START: 'logout_start',\n  //\tim登出\t\n  LOGOUT_END: 'logout_end',\n  //\tim登出\t\n  CREATEGROUP_START: 'createGroup_start',\n  //\t创建群组\t\n  CREATEGROUP_END: 'createGroup_end',\n  //\t创建群组\t\n  DELETEGROUP_START: 'deleteGroup_start',\n  //\t销毁群组\t\n  DELETEGROUP_END: 'deleteGroup_end',\n  //\t销毁群组\t\n  JOINGROUP_START: 'joinGroup_start',\n  //\t加入群组\t\n  JOINGROUP_END: 'joinGroup_end',\n  //\t加入群组\t\n  JOINCHATGROUP_START: 'joinChatGroup_start',\n  //\t加入群组\t\n  JOINCHATGROUP_END: 'joinChatGroup_end',\n  //\t加入群组\t\n  INITBOARD_START: 'initBoard_start',\n  //\t初始化白板\t\n  INITBOARD_END: 'initBoard_end',\n  //\t初始化白板\t\n  SYNCBOARDHISTORY_END: 'syncBoardHistory_end',\n  //\t白板历史数据同步\t\n  ENTERROOM_START: 'enterRoom_start',\n  //\ttrtc进房\t\n  ENTERROOM_END: 'enterRoom_end',\n  //\ttrtc进房\t\n  QUITGROUP_START: 'quitGroup_start',\n  //\t退出群组\t\n  QUITGROUP_END: 'quitGroup_end',\n  //\t退出群组\t\n  SENDOFFLINERECORDINFO_START: 'sendOfflineRecordInfo_start',\n  //\t发送对时信息\t\n  SENDOFFLINERECORDINFO_END: 'sendOfflineRecordInfo_end',\n  //\t发送对时信息\t\n  ONUSERAUDIOAVAILABLE: 'onUserAudioAvailable',\n  //\t音频是否启用\t{userId:, available:}\n  ONUSERVIDEOAVAILABLE: 'onUserVideoAvailable',\n  //\t视频是否启用\t{userId:, available:}\n  ONUSERSUBSTREAMAVAILABLE: 'onUserSubStreamAvailable',\n  //\t辅流是否启用\t{userId:, available:}\n  ONFORCEOFFLINE: 'onForceOffline',\n  //\t被强制下线\t\n  ONUSERSIGEXPIRED: 'onUserSigExpired',\n  //\tuserSig过期\t\n  ONTEBERROR: 'onTEBError',\n  //\t错误信息\t\n  ONTEBWARNING: 'onTEBWarning' //\t警告信息\n\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (LogReport);\n\n//# sourceURL=webpack://TIC/./src/log/LogReport.js?");

/***/ }),

/***/ "./src/model/AccountModel.js":
/*!***********************************!*\
  !*** ./src/model/AccountModel.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction AccountModel() {\n  this.sdkAppId = null;\n  this.userId = null;\n  this.userSig = null;\n  this.userNick = null; // 昵称\n\n  this.userAvatar = null; // 头像\n\n  this.accountType = 1; // 帐号类型\n\n  this.classId = null; // 信令群ID\n\n  this.classChatId = null; // 聊天群ID\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (AccountModel);\n\n//# sourceURL=webpack://TIC/./src/model/AccountModel.js?");

/***/ }),

/***/ "./src/model/BoardOptionModel.js":
/*!***************************************!*\
  !*** ./src/model/BoardOptionModel.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.object.assign */ \"./node_modules/core-js/modules/es6.object.assign.js\");\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction BoardOptionModel() {\n  this.id = null;\n  this.ratio = '16:9';\n  this.drawEnable = true;\n  this.textFamily = null;\n  this.textStyle = 0;\n  this.textSize = 320;\n  this.textColor = null;\n  this.brushColor = '#ff0000';\n  this.brushThin = 100;\n  this.toolType = 1;\n  this.globalBackgroundColor = '#ffffff';\n  this.boardFileFitMode = 0; // \n\n  this.scale = 100; // \n\n  this.smoothLevel = 0.1; // 平滑系数\n\n  this.preloadDepth = 5; // 预加载深度\n}\n\nBoardOptionModel.prototype.setData = function (data) {\n  Object.assign(this, data);\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (BoardOptionModel);\n\n//# sourceURL=webpack://TIC/./src/model/BoardOptionModel.js?");

/***/ }),

/***/ "./src/model/ClassModel.js":
/*!*********************************!*\
  !*** ./src/model/ClassModel.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction ClassModel() {\n  this.compatSaas = false; // 是否要与Saas互通\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ClassModel);\n\n//# sourceURL=webpack://TIC/./src/model/ClassModel.js?");

/***/ }),

/***/ "./src/model/WebRTCOptionModel.js":
/*!****************************************!*\
  !*** ./src/model/WebRTCOptionModel.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.object.assign */ \"./node_modules/core-js/modules/es6.object.assign.js\");\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction WebRTCOptionModel() {\n  this.role = null;\n  this.privateMapKey = null;\n  this.pureAudioPushMod = null;\n  this.recordId = null;\n  this.peerAddNotify = null;\n  this.classScene = null;\n}\n\nWebRTCOptionModel.prototype.setData = function (data) {\n  Object.assign(this, data);\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (WebRTCOptionModel);\n\n//# sourceURL=webpack://TIC/./src/model/WebRTCOptionModel.js?");

/***/ }),

/***/ "./src/webboard/webBoard.js":
/*!**********************************!*\
  !*** ./src/webboard/webBoard.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.object.assign */ \"./node_modules/core-js/modules/es6.object.assign.js\");\n/* harmony import */ var core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_assign__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _log_LogReport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log/LogReport */ \"./src/log/LogReport.js\");\n\n\n\nfunction WebBoard(accountModel, boardOptionModel) {\n  this.board = null;\n  this.accountModel = accountModel;\n  this.boardOptionModel = boardOptionModel;\n}\n\nWebBoard.prototype.getInstance = function () {\n  return this.board;\n};\n\nWebBoard.prototype.setLog = function (log) {\n  this.log = log;\n};\n\nWebBoard.prototype.render = function () {\n  var _this = this;\n\n  this.board = null;\n  this.board = new TEduBoard(Object.assign({}, this.boardOptionModel, {\n    classId: this.accountModel.classId,\n    sdkAppId: this.accountModel.sdkAppId,\n    userId: this.accountModel.userId + '',\n    userSig: this.accountModel.userSig\n  })); // 错误\n\n  this.board.on(TEduBoard.EVENT.TEB_ERROR, function (code, msg) {\n    _this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_1__[\"default\"].EVENT_NAME.ONTEBERROR, {\n      errorCode: code,\n      errorDesc: msg,\n      timeCost: 0,\n      data: '',\n      ext: ''\n    });\n  }); // 历史数据加载完成\n\n  this.board.on(TEduBoard.EVENT.TEB_WARNING, function (code, msg) {\n    _this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_1__[\"default\"].EVENT_NAME.ONTEBWARNING, {\n      errorCode: code,\n      errorDesc: msg,\n      timeCost: 0,\n      data: '',\n      ext: ''\n    });\n  }); // 历史数据加载完成\n\n  this.board.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, function () {\n    _this.log.report(_log_LogReport__WEBPACK_IMPORTED_MODULE_1__[\"default\"].EVENT_NAME.SYNCBOARDHISTORY_END, {\n      errorCode: 0,\n      errorDesc: '',\n      timeCost: 0,\n      data: '',\n      ext: ''\n    });\n  });\n};\n\nWebBoard.prototype.addSyncDataEventCallback = function (callback) {\n  this.board.on(TEduBoard.EVENT.TEB_SYNCDATA, function (data) {\n    callback && callback(data);\n  });\n};\n\nWebBoard.prototype.quit = function () {\n  if (this.board) {\n    this.board.destroy && this.board.destroy();\n    this.board.off && this.board.off();\n    this.board = null;\n  }\n}; // 清空课堂数据\n\n\nWebBoard.prototype.clearAll = function () {\n  if (this.board) {\n    this.board && this.board.reset();\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (WebBoard);\n\n//# sourceURL=webpack://TIC/./src/webboard/webBoard.js?");

/***/ }),

/***/ "./src/webim/WebIM.js":
/*!****************************!*\
  !*** ./src/webim/WebIM.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ \"./node_modules/core-js/modules/web.dom.iterable.js\");\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.promise */ \"./node_modules/core-js/modules/es6.promise.js\");\n/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.number.constructor */ \"./node_modules/core-js/modules/es6.number.constructor.js\");\n/* harmony import */ var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _log_LogReport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../log/LogReport */ \"./src/log/LogReport.js\");\n/* harmony import */ var _constant_Constant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constant/Constant */ \"./src/constant/Constant.js\");\n\n\n\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\nvar TICWebIM =\n/*#__PURE__*/\nfunction () {\n  function TICWebIM() {\n    _classCallCheck(this, TICWebIM);\n\n    this.accountModel = null;\n    this.classModel = null;\n    this.imListener = null;\n    this.boardNotifyCallback = null;\n    this.compatSaas = null;\n    this.groupChatId = null;\n    this.groupBoardId = null;\n    this.xmlHttp = null;\n  }\n\n  _createClass(TICWebIM, [{\n    key: \"init\",\n    value: function init(sdkAppId) {\n      var options = {\n        SDKAppID: sdkAppId // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID\n\n      };\n      this.tim = window.TIM.create(options);\n      this.tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用\n\n      this.tim.registerPlugin({\n        'cos-js-sdk': window.COS\n      }); // 注册 COS SDK 插件\n    }\n  }, {\n    key: \"getInstance\",\n    value: function getInstance() {\n      return this.tim;\n    }\n  }, {\n    key: \"setLog\",\n    value: function setLog(log) {\n      this.log = log;\n    }\n  }, {\n    key: \"login\",\n    value: function login(accountModel, classModel) {\n      this.accountModel = accountModel;\n      this.classModel = classModel;\n      this.uninitEvent();\n      this.initEvent();\n      return this.tim.login({\n        userID: String(accountModel.userId),\n        userSig: String(accountModel.userSig)\n      });\n    }\n  }, {\n    key: \"initEvent\",\n    value: function initEvent() {\n      this.tim.on(window.TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived, this); // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息\n\n      this.tim.on(window.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived, this); // SDK 收到新的群系统通知时触发\n\n      this.tim.on(window.TIM.EVENT.KICKED_OUT, this.onKickedOut, this); // 用户被踢下线时触发\n    }\n  }, {\n    key: \"uninitEvent\",\n    value: function uninitEvent() {\n      this.tim.off(window.TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived); // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息\n\n      this.tim.off(window.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived); // SDK 收到新的群系统通知时触发\n\n      this.tim.off(window.TIM.EVENT.KICKED_OUT, this.onKickedOut); // 用户被踢下线时触发\n    }\n  }, {\n    key: \"logout\",\n    value: function logout() {\n      this.uninitEvent();\n      return this.tim.logout();\n    }\n    /**\r\n     * @classId 群组id\r\n     * @scene 场景\r\n     */\n\n  }, {\n    key: \"createRoom\",\n    value: function createRoom(groupId, scene) {\n      scene = Number(scene);\n      groupId = String(groupId);\n      var groupType = null;\n\n      if (scene === _constant_Constant__WEBPACK_IMPORTED_MODULE_4__[\"default\"].TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL) {\n        groupType = window.TIM.TYPES.GRP_PUBLIC;\n      } else {\n        groupType = window.TIM.TYPES.GRP_AVCHATROOM;\n      }\n\n      var options = {\n        name: groupId,\n        groupID: groupId,\n        type: groupType,\n        joinOption: window.TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS //自由加入\n\n      };\n      return this.tim.createGroup(options).then(function (res) {\n        return Promise.resolve();\n      }, function (error) {\n        if (error.code == 10025) {\n          // 群组 ID 已被使用，并且操作者为群主，可以直接使用。\n          return Promise.resolve();\n        } else {\n          return Promise.reject(error);\n        }\n      });\n    }\n    /**\r\n     * 加入白板信令群\r\n     */\n\n  }, {\n    key: \"joinRoom\",\n    value: function joinRoom() {\n      var groupId = String(this.accountModel.classId);\n      this.groupBoardId = groupId;\n      var compatSaas = this.classModel.compatSaas; // 是否要与saas互通\n\n      this.compatSaas = compatSaas;\n\n      if (!compatSaas) {\n        // 如果不与saas互通\n        this.groupChatId = null; // 将saas的聊天群置空\n      }\n\n      return this.tim.joinGroup({\n        groupID: groupId,\n        type: window.TIM.TYPES.GRP_AVCHATROOM\n      }).then(function (res) {\n        switch (res.data.status) {\n          case window.TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功\n\n          case window.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:\n            // 已经在群中\n            return Promise.resolve();\n\n          case window.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意,业务上认为失败\n\n          default:\n            return Promise.reject(res);\n        }\n      }, function (error) {\n        if (error.code == 10013) {\n          // 被邀请加入的用户已经是群成员,也表示成功\n          return Promise.resolve();\n        } else if (error.code == -12) {\n          // Join Group succeed; But the type of group is not AVChatRoom\n          return Promise.resolve();\n        }\n\n        return Promise.reject(error);\n      });\n    }\n    /**\r\n     * 加入Saas聊天群\r\n     */\n\n  }, {\n    key: \"joinSaasChatRoom\",\n    value: function joinSaasChatRoom() {\n      var groupChatId = String(this.accountModel.classChatId);\n      this.groupChatId = groupChatId;\n      return this.tim.joinGroup({\n        groupID: groupChatId,\n        type: window.TIM.TYPES.GRP_AVCHATROOM\n      }).then(function (res) {\n        switch (res.data.status) {\n          case window.TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功\n\n          case window.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:\n            // 已经在群中\n            return Promise.resolve();\n\n          case window.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意,业务上认为失败\n\n          default:\n            return Promise.reject(res);\n        }\n      }, function (error) {\n        if (error.code == 10013) {\n          // 被邀请加入的用户已经是群成员,也表示成功\n          return Promise.resolve();\n        } else if (error.code == -12) {\n          // Join Group succeed; But the type of group is not AVChatRoom\n          return Promise.resolve();\n        }\n\n        return Promise.reject(error);\n      });\n    }\n    /**\r\n     * 销毁群组\r\n     */\n\n  }, {\n    key: \"destroyGroup\",\n    value: function destroyGroup(groupId) {\n      groupId = String(groupId);\n      return this.tim.dismissGroup(groupId);\n    }\n    /**\r\n     * 退出群组\r\n     */\n\n  }, {\n    key: \"quitGroup\",\n    value: function quitGroup() {\n      var groupId = String(this.accountModel.classId);\n      groupId = String(groupId);\n      return this.tim.quitGroup(groupId).then(function (res) {\n        return Promise.resolve();\n      }, function (error) {\n        // 群不存在 或者 不在群里了 或者 群id不合法（一般这种情况是课堂销毁了groupId被重置后发生）\n        if (error.code === 10010 || error.code === 10007 || error.code === 10015) {\n          return Promise.resolve();\n        } else if (error.code == 10009) {\n          // 群主自己想退课堂\n          return Promise.resolve();\n        } else {\n          return Promise.reject(error);\n        }\n      });\n    }\n    /**\r\n     * 退出chat群组\r\n     */\n\n  }, {\n    key: \"quitChatGroup\",\n    value: function quitChatGroup() {\n      var groupId = String(this.accountModel.classChatId);\n      return this.tim.quitGroup(groupId).then(function (res) {\n        return Promise.resolve();\n      }, function (error) {\n        // 群不存在 或者 不在群里了 或者 群id不合法（一般这种情况是课堂销毁了groupId被重置后发生）\n        if (error.code === 10010 || error.code === 10007 || error.code === 10015) {\n          return Promise.resolve();\n        } else if (error.code == 10009) {\n          // 群主自己想退课堂\n          return Promise.resolve();\n        } else {\n          return Promise.reject(error);\n        }\n      });\n    }\n  }, {\n    key: \"onKickedOut\",\n    value: function onKickedOut(event) {\n      this.statusListener.fireEvent('onTICForceOffline');\n    }\n  }, {\n    key: \"onGroupSystemNoticeReceived\",\n    value: function onGroupSystemNoticeReceived(event) {\n      var message = event.data.message; // 群系统通知的消息实例，详见 Message\n\n      var payload = message.payload;\n\n      switch (payload.operationType) {\n        case 4:\n          // 被踢出群组\n          if (event.data.message.to == this.groupBoardId || event.data.message.to == this.groupChatId) {\n            this.eventListener.fireEvent('onTICClassroomDestroy');\n          }\n\n          break;\n\n        case 5:\n          // 群组被解散\n          if (event.data.message.to == this.groupBoardId || event.data.message.to == this.groupChatId) {\n            this.eventListener.fireEvent('onTICClassroomDestroy');\n          }\n\n          break;\n\n        case 11:\n          //群已被回收(全员接收)\n          if (event.data.message.to == this.groupBoardId || event.data.message.to == this.groupChatId) {\n            this.eventListener.fireEvent('onTICClassroomDestroy');\n          }\n\n          break;\n\n        case 255:\n          this.messageListener.fireEvent('onTICRecvGroupSystemNotify', 255, event.data.message);\n          break;\n      }\n    }\n  }, {\n    key: \"onMessageReceived\",\n    value: function onMessageReceived(event) {\n      var _this = this;\n\n      var messages = event.data;\n      messages.forEach(function (message) {\n        // 群组消息\n        if (message.conversationType === window.TIM.TYPES.CONV_GROUP) {\n          if (message.to === _this.groupBoardId || message.to === _this.groupChatId && _this.compatSaas) {\n            // 如果是当前群组\n            var elements = message.getElements();\n            var isBoardMessage = false; // 如果是白板消息\n\n            if (elements.length) {\n              elements.forEach(function (element) {\n                if (element.type === 'TIMGroupTipElem') {\n                  switch (element.content.operationType) {\n                    case window.TIM.TYPES.GRP_TIP_MBR_JOIN:\n                      _this.eventListener.fireEvent('onTICMemberJoin', element.content.userIDList);\n\n                      break;\n\n                    case window.TIM.TYPES.GRP_TIP_MBR_QUIT:\n                      _this.eventListener.fireEvent('onTICMemberQuit', element.content.userIDList);\n\n                      break;\n                  }\n                } else if (element.type === 'TIMTextElem') {\n                  _this.messageListener.fireEvent('onTICRecvGroupTextMessage', message.from, element.content.text, element.content.text.length);\n                } else if (element.type === 'TIMFileElem') {\n                  if (element.content.fileName === 'TXWhiteBoardExt') {\n                    if (message.from != _this.userId) {\n                      isBoardMessage = true; // 是白板消息\n\n                      var xhr = _this._getXhr();\n\n                      xhr.onreadystatechange = function () {\n                        if (xhr.readyState == 4) {\n                          if (xhr.status == 200) {\n                            _this.boardNotifyCallback && _this.boardNotifyCallback(xhr.responseText);\n                          }\n                        }\n                      };\n\n                      xhr.open('get', element.content.fileUrl, true);\n                      xhr.send();\n                    }\n                  }\n                } else if (element.type === 'TIMCustomElem') {\n                  if (element.content.extension === 'TXWhiteBoardExt') {\n                    isBoardMessage = true; // 是白板消息\n\n                    if (message.from != _this.userId) {\n                      _this.boardNotifyCallback && _this.boardNotifyCallback(element.content.data);\n                    }\n                  } else if (element.content.extension === 'TXConferenceExt') {\n                    isBoardMessage = true; // 是白板消息\n                    // 对时消息过滤掉\n                  } else {\n                    _this.messageListener.fireEvent('onTICRecvGroupCustomMessage', message.from, element.content.data, element.content.data.length);\n                  }\n                }\n              });\n            }\n\n            if (!isBoardMessage) {\n              // 如果不是白板消息，则需要将消息抛出来\n              try {\n                _this.messageListener.fireEvent('onTICRecvMessage', message);\n              } catch (error) {}\n            }\n          } else if (message.to == _this.groupChatId) {\n            // 如果是saas聊天群\n            try {\n              _this.messageListener.fireEvent('onTICRecvMessage', message);\n            } catch (error) {}\n          } else {// 其他群组消息忽略\n          }\n        } else if (message.conversationType === window.TIM.TYPES.CONV_C2C) {\n          // C2C消息\n          var _elements = message.getElements();\n\n          if (_elements.length) {\n            _elements.forEach(function (element) {\n              if (element.type === 'TIMTextElem') {\n                _this.messageListener.fireEvent('onTICRecvTextMessage', message.from, element.content.text, element.content.text.length);\n              } else if (element.type === 'TIMCustomElem') {\n                _this.messageListener.fireEvent('onTICRecvCustomMessage', message.from, element.content, element.content.length);\n              }\n            });\n          }\n\n          try {\n            _this.messageListener.fireEvent('onTICRecvMessage', message);\n          } catch (error) {}\n        }\n      });\n    }\n    /**\r\n     * 收到白板消息的回调\r\n     * @param {Function} callback \r\n     */\n\n  }, {\n    key: \"setReceiveBoardNotifyCallback\",\n    value: function setReceiveBoardNotifyCallback(callback) {\n      this.boardNotifyCallback = callback;\n    }\n    /**\r\n     * 发送C2C文本消息\r\n     */\n\n  }, {\n    key: \"sendC2CTextMessage\",\n    value: function sendC2CTextMessage(userId, msg) {\n      var message = this.tim.createTextMessage({\n        to: userId,\n        conversationType: window.TIM.TYPES.CONV_C2C,\n        payload: {\n          text: msg\n        }\n      });\n      return this.tim.sendMessage(message).then(function () {\n        return Promise.resolve();\n      }, function (error) {\n        return Promise.reject(error);\n      });\n    }\n    /**\r\n     * 发送C2C自定义消息\r\n     */\n\n  }, {\n    key: \"sendC2CCustomMessage\",\n    value: function sendC2CCustomMessage(userId, msg) {\n      var message = this.tim.createCustomMessage({\n        to: userId,\n        conversationType: window.TIM.TYPES.CONV_C2C,\n        payload: {\n          data: msg.data,\n          description: msg.description,\n          extension: msg.extension\n        }\n      });\n      return this.tim.sendMessage(message).then(function () {\n        return Promise.resolve();\n      }, function (error) {\n        return Promise.reject(error);\n      });\n    }\n    /**\r\n     * 发送群文本消息\r\n     */\n\n  }, {\n    key: \"sendGroupTextMessage\",\n    value: function sendGroupTextMessage(msg) {\n      var toGroupId = this.compatSaas ? this.groupChatId : this.groupBoardId;\n      var message = this.tim.createTextMessage({\n        to: toGroupId,\n        conversationType: window.TIM.TYPES.CONV_GROUP,\n        payload: {\n          text: msg\n        }\n      });\n      return this.tim.sendMessage(message).then(function () {\n        return Promise.resolve();\n      }, function (error) {\n        return Promise.reject(error);\n      });\n    }\n    /**\r\n     * 发送群组自定义消息\r\n     */\n\n  }, {\n    key: \"sendGroupCustomMessage\",\n    value: function sendGroupCustomMessage(msg) {\n      var toGroupId = this.compatSaas ? this.groupChatId : this.groupBoardId;\n      var message = this.tim.createCustomMessage({\n        to: toGroupId,\n        conversationType: window.TIM.TYPES.CONV_GROUP,\n        payload: {\n          data: msg.data,\n          description: msg.description,\n          extension: msg.extension\n        }\n      });\n      return this.tim.sendMessage(message).then(function () {\n        return Promise.resolve();\n      }, function (error) {\n        return Promise.reject(error);\n      });\n    } // 发送白板数据\n\n  }, {\n    key: \"sendBoardGroupCustomMessage\",\n    value: function sendBoardGroupCustomMessage(content) {\n      var _this2 = this;\n\n      var contentStr = null;\n\n      try {\n        contentStr = JSON.stringify(content);\n      } catch (error) {\n        contentStr = content;\n      }\n\n      if (contentStr.length > 7000) {\n        return this.sendBoardGroupFileMessage(content);\n      } else {\n        var toGroupId = this.groupBoardId;\n        var message = this.tim.createCustomMessage({\n          to: toGroupId,\n          conversationType: window.TIM.TYPES.CONV_GROUP,\n          payload: {\n            data: JSON.stringify(content),\n            description: '',\n            extension: 'TXWhiteBoardExt'\n          }\n        });\n        return this.tim.sendMessage(message).then(function () {\n          return Promise.resolve(content);\n        }, function () {\n          // 失败重试一次\n          return _this2.tim.resendMessage(message).then(function () {\n            return Promise.resolve(content);\n          }, function (error) {\n            return Promise.reject(error);\n          });\n        });\n      }\n    }\n    /**\r\n     * 发送文件\r\n     * @param {*} content \r\n     */\n\n  }, {\n    key: \"sendBoardGroupFileMessage\",\n    value: function sendBoardGroupFileMessage(content) {\n      var _this3 = this;\n\n      var toGroupId = this.groupBoardId;\n      var blob = new Blob([JSON.stringify(content)], {\n        type: 'application/json'\n      });\n      var myFile = new File([blob], 'TXWhiteBoardExt', {\n        type: \"text/plain\"\n      });\n      var message = this.tim.createFileMessage({\n        to: toGroupId,\n        conversationType: window.TIM.TYPES.CONV_GROUP,\n        payload: {\n          file: myFile\n        },\n        onProgress: function onProgress() {}\n      });\n      return this.tim.sendMessage(message).then(function () {\n        return Promise.resolve(content);\n      }, function () {\n        // 失败重试一次\n        return _this3.tim.resendMessage(message).then(function () {\n          return Promise.resolve(content);\n        }, function (error) {\n          return Promise.reject(error);\n        });\n      });\n    }\n  }, {\n    key: \"setMessageListener\",\n    value: function setMessageListener(messageListener) {\n      this.messageListener = messageListener;\n    }\n  }, {\n    key: \"setEventListener\",\n    value: function setEventListener(eventListener) {\n      this.eventListener = eventListener;\n    }\n  }, {\n    key: \"setStatusListener\",\n    value: function setStatusListener(statusListener) {\n      this.statusListener = statusListener;\n    }\n  }, {\n    key: \"_getXhr\",\n    value: function _getXhr() {\n      if (this.xmlHttp) {\n        return this.xmlHttp;\n      }\n\n      var xmlHttp = null;\n\n      if (window.XMLHttpRequest) {\n        xmlHttp = new XMLHttpRequest();\n      } else if (window.ActiveXObject) {\n        try {\n          xmlHttp = new ActiveXObject(\"Msxml2.XMLHTTP\");\n        } catch (e) {\n          try {\n            xmlHttp = new ActiveXObject(\"Microsoft.XMLHTTP\");\n          } catch (e) {}\n        }\n      }\n\n      this.xmlHttp = xmlHttp;\n      return xmlHttp;\n    }\n  }]);\n\n  return TICWebIM;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (TICWebIM);\n\n//# sourceURL=webpack://TIC/./src/webim/WebIM.js?");

/***/ }),

/***/ "./src/webrtc/WebRTC.js":
/*!******************************!*\
  !*** ./src/webrtc/WebRTC.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.symbol.async-iterator */ \"./node_modules/core-js/modules/es7.symbol.async-iterator.js\");\n/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.symbol */ \"./node_modules/core-js/modules/es6.symbol.js\");\n/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.number.constructor */ \"./node_modules/core-js/modules/es6.number.constructor.js\");\n/* harmony import */ var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _constant_Constant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constant/Constant */ \"./src/constant/Constant.js\");\n\n\n\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\n\n\nfunction TICWebRTC(accountModel, webRTCOptionModel) {\n  this.accountModel = accountModel;\n  this.webRTCOptionModel = webRTCOptionModel;\n  this.trtcClient = null;\n}\n\nTICWebRTC.prototype.getInstance = function () {\n  return this.trtcClient;\n};\n\nTICWebRTC.prototype.setLog = function (log) {\n  return this.log = log;\n};\n\nTICWebRTC.prototype.quit = function (succ, fail) {\n  if (this.trtcClient) {\n    this.trtcClient.leave().then(succ).catch(fail);\n    this.trtcClient = null;\n  }\n};\n\nTICWebRTC.prototype.joinAvRoom = function () {\n  var succ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};\n  var fail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};\n  var client = this.trtcClient = TRTC.createClient({\n    sdkAppId: this.accountModel.sdkAppId,\n    userId: this.accountModel.userId,\n    userSig: this.accountModel.userSig,\n    mode: this.webRTCOptionModel.mode === _constant_Constant__WEBPACK_IMPORTED_MODULE_3__[\"default\"].TICClassScene.TIC_CLASS_SCENE_LIVE ? 'live' : 'videoCall',\n    recordId: this.webRTCOptionModel.recordId,\n    pureAudioPushMod: this.webRTCOptionModel.pureAudioPushMod\n  });\n  this.eventListener.fireEvent('onTICTrtcClientCreated');\n  this.initEvent();\n  var joinOption = {\n    roomId: Number(this.accountModel.classId),\n    privateMapKey: this.webRTCOptionModel.privateMapKey\n  };\n\n  if (this.webRTCOptionModel.mode === 1) {\n    // 大房间\n    // 如果是主播，则用主播角色，否则都是观众角色\n    if (this.webRTCOptionModel.role === _constant_Constant__WEBPACK_IMPORTED_MODULE_3__[\"default\"].TICRoleType.TIC_ROLE_TYPE_ANCHOR) {\n      joinOption['role'] = 'anchor';\n    } else {\n      joinOption['role'] = 'audience';\n    }\n  }\n\n  this.trtcClient.join(joinOption).then(succ).catch(fail);\n};\n\nTICWebRTC.prototype.initEvent = function () {\n  var _this = this;\n\n  // 通过监听‘stream-added’事件获得远端流对象\n  this.trtcClient.on('stream-added', function (event) {\n    var remoteStream = event.stream;\n\n    _this._reportTRTCEvent('stream-added', remoteStream);\n  }); // 监听‘stream-removed’事件\n\n  this.trtcClient.on('stream-removed', function (event) {\n    var remoteStream = event.stream;\n\n    _this._reportTRTCEvent('stream-removed', remoteStream);\n  }); // 监听‘stream-updated’事件\n\n  this.trtcClient.on('stream-updated', function (event) {\n    var remoteStream = event.stream;\n\n    _this._reportTRTCEvent('stream-updated', remoteStream);\n  }); // 监听‘stream-subscribed’事件\n\n  this.trtcClient.on('stream-subscribed', function (event) {\n    var remoteStream = event.stream;\n\n    _this._reportTRTCEvent('stream-subscribed', remoteStream);\n  });\n  this.trtcClient.on('connection-state-changed', function (event) {\n    _this._reportTRTCEvent('connection-state-changed', event);\n  });\n  this.trtcClient.on('peer-join', function (event) {\n    _this._reportTRTCEvent('peer-join', event);\n  });\n  this.trtcClient.on('peer-leave', function (event) {\n    _this._reportTRTCEvent('peer-leave', event);\n  });\n  this.trtcClient.on('mute-audio', function (event) {\n    _this._reportTRTCEvent('mute-audio', event);\n  });\n  this.trtcClient.on('mute-video', function (event) {\n    _this._reportTRTCEvent('mute-video', event);\n  });\n  this.trtcClient.on('unmute-audio', function (event) {\n    _this._reportTRTCEvent('unmute-audio', event);\n  });\n  this.trtcClient.on('unmute-video', function (event) {\n    _this._reportTRTCEvent('unmute-video', event);\n  });\n  this.trtcClient.on('client-banned', function (error) {\n    _this.statusListener.fireEvent('onTICForceOffline');\n\n    _this._reportTRTCEvent('client-banned', error);\n  });\n  this.trtcClient.on('error', function (error) {\n    _this._reportTRTCEvent('error', error);\n  });\n};\n\nTICWebRTC.prototype.setStatusListener = function (listener) {\n  this.statusListener = listener;\n};\n\nTICWebRTC.prototype.setEventListener = function (eventListener) {\n  this.eventListener = eventListener;\n};\n\nTICWebRTC.prototype._reportTRTCEvent = function (eventName, object) {\n  var extObj = {};\n\n  for (var key in object) {\n    var value = object[key];\n\n    if (_typeof(value) != 'object') {\n      extObj[key] = value;\n    }\n  }\n\n  this.log.report(eventName, {\n    errorCode: 0,\n    errorDesc: '',\n    timeCost: 0,\n    data: '',\n    ext: JSON.stringify(extObj)\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (TICWebRTC);\n\n//# sourceURL=webpack://TIC/./src/webrtc/WebRTC.js?");

/***/ })

/******/ })["default"];
});