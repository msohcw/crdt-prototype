/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client.js":
/*!***********************!*\
  !*** ./src/client.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Document = __webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'teletype-crdt/lib/document'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\nconst LocalDocument = __webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'teletype-crdt/test/helpers/local-document'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\n\n/* @format\n *\n * Message Types\n *\n * ping - request the full state\n * pong - return the full state\n * insert - insert op\n * delete - delete op\n *\n */\n\nINIT = 'init';\nSTATE = 'state';\nINSERT = 'insert';\nDELETE = 'delete';\n\nconst channel = new BroadcastChannel('ops');\nvar timeout = 3 * 1000;\n\nvar siteId = Math.floor(Math.random() * 9999999999);\nvar initialized = false;\n\nvar stateDisplay;\nvar document;\n\nfunction sleep(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\nasync function latency() {\n  // Here we simulate the latency of a real server-client connection\n  await sleep(300 + Math.random() * 300);\n}\n\nfunction initialize() {\n  broadcast({\n    type: INIT,\n  });\n  setTimeout(function() {\n    if (!initialized) {\n      initialized = true;\n      document = buildDocument(siteId);\n    }\n  }, timeout);\n}\n\nfunction buildDocument(siteId, text) {\n  const document = new Document({siteId, text});\n  // Do I need this?\n  document.localDocument = new LocalDocument(document.getText());\n  return document;\n}\n\nfunction integrateInsert(text, pos) {\n  before = stateDisplay.innerText.slice(0, pos);\n  after = stateDisplay.innerText.slice(pos);\n  stateDisplay.innerText = before + text + after;\n}\n\nfunction integrateDelete(pos) {\n  before = stateDisplay.innerText.slice(0, pos);\n  after = stateDisplay.innerText.slice(pos + 1);\n  stateDisplay.innerText = before + after;\n}\n\nfunction integrateState(state) {\n  stateDisplay.innerText = state;\n}\n\nasync function broadcast(msg) {\n  console.log('Broadcasting');\n  console.log(msg);\n  await latency();\n  channel.postMessage(msg);\n}\n\nasync function receive(msg) {\n  msg = msg.data;\n  await latency();\n  console.log('Received');\n  console.log(msg);\n  switch (msg.type) {\n    case INIT:\n      broadcast({\n        type: STATE,\n        text: stateDisplay.innerText,\n      });\n      break;\n    case STATE:\n      if (!initialized) buildDocument(siteId, msg.text);\n      initialized = true;\n      break;\n    case INSERT:\n      integrateInsert(msg.text, msg.pos);\n      break;\n    case DELETE:\n      integrateDelete(msg.pos);\n      break;\n    default:\n      break;\n  }\n}\n\nchannel.onmessage = receive;\n\nfunction insertOp(e) {\n  insertTextBox = document.getElementById('insert-text');\n  insertPosBox = document.getElementById('insert-pos');\n  text = insertTextBox.value;\n  pos = parseInt(insertPosBox.value);\n\n  msg = {\n    type: INSERT,\n    text: text,\n    pos: pos,\n  };\n\n  integrateInsert(text, pos);\n  broadcast(msg);\n}\n\nfunction deleteOp(e) {\n  deletePosBox = document.getElementById('delete-pos');\n  pos = parseInt(deletePosBox.value);\n\n  msg = {\n    type: DELETE,\n    pos: pos,\n  };\n\n  integrateDelete(pos);\n  broadcast(msg);\n}\n\nwindow.onload = function() {\n  document.getElementById('insert-btn').onclick = insertOp;\n  document.getElementById('delete-btn').onclick = deleteOp;\n  stateDisplay = document.getElementById('state-display');\n\n  initialize();\n};\n\n\n//# sourceURL=webpack:///./src/client.js?");

/***/ }),

/***/ 0:
/*!***************************************!*\
  !*** multi ./src/client.js client.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /home/matthew/berkeley/clubs/codebase/hackerrank/crdt-prototype/src/client.js */\"./src/client.js\");\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'client.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n//# sourceURL=webpack:///multi_./src/client.js_client.js?");

/***/ })

/******/ });