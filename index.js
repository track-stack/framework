(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var action_helper_1 = __webpack_require__(20);
exports.ANSWER_SUBMISSION = action_helper_1.createActionSet('ANSWER_SUBMITTED');
exports.FETCH_FRIENDS = action_helper_1.createActionSet('FETCH_FRIENDS');
exports.LAST_FM_SEARCH = action_helper_1.createActionSet('LAST_F_SEARCH');
exports.FETCH_GAME = action_helper_1.createActionSet('FETCH_GAME');
exports.INVITEE = action_helper_1.createActionSet('INVITEE');


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var BLACKLIST = "a|an|and|the|in|by";
var REGEX = {
    hyphensAndUnderscores: /[-_]/g,
    characters: /[.'!&\(\)\[\]]/g,
    articles: new RegExp("\\b(" + BLACKLIST + ")\\b", 'g'),
    whitespace: /\s+/g
};
function sanitize(input) {
    input = input.toLowerCase();
    input = input.replace(REGEX.characters, '');
    input = input.replace(REGEX.articles, '');
    input = input.replace(REGEX.hyphensAndUnderscores, ' ');
    input = input.replace(REGEX.whitespace, ' ');
    return input.trim();
}
exports.sanitize = sanitize;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stemmer = {},
    cache = {};

module.exports = stemmer;

stemmer.except = function (word, exceptions) {
  if (exceptions instanceof Array) {
    if (~exceptions.indexOf(word)) return word;
  } else {
    for (var k in exceptions) {
      if (k === word) return exceptions[k];
    }
  }
  return false;
};

// word - String
// offset - Integer (optional)
// replace - Key/Value Array of pattern, string, and function.
stemmer.among = function among(word, offset, replace) {
  if (replace == null) return among(word, 0, offset);

  // Store the intial value of the word.
  var initial = word.slice(),
      pattern,
      replacement;

  for (var i = 0; i < replace.length; i += 2) {
    pattern = replace[i];
    pattern = cache[pattern] || (cache[pattern] = new RegExp(replace[i] + "$"));
    replacement = replace[i + 1];

    if (typeof replacement === "function") {
      word = word.replace(pattern, function (m) {
        var off = arguments["" + (arguments.length - 2)];
        if (off >= offset) {
          return replacement.apply(null, arguments);
        } else {
          return m + " ";
        }
      });
    } else {
      word = word.replace(pattern, function (m) {
        var off = arguments["" + (arguments.length - 2)];
        return off >= offset ? replacement : m + " ";
      });
    }

    if (word !== initial) break;
  }

  return word.replace(/ /g, "");
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var turn_1 = __webpack_require__(4);
var Stack = /** @class */ (function () {
    function Stack(turns) {
        this.turns = turns || new Array();
    }
    Stack.from = function (json) {
        if (!json.turns) {
            return new Stack();
        }
        var turns = json.turns.map(function (turn) { return turn_1["default"].from(turn); });
        return new Stack(turns);
    };
    return Stack;
}());
exports["default"] = Stack;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var match_1 = __webpack_require__(5);
var Turn = /** @class */ (function () {
    function Turn(userId, answer, distance, hasExactNameMatch, hasExactArtistMatch, userPhoto, match, createdAt) {
        this.userId = userId;
        this.answer = answer;
        this.distance = distance;
        this.hasExactNameMatch = hasExactNameMatch;
        this.hasExactArtistMatch = hasExactArtistMatch;
        this.userPhoto = userPhoto;
        this.match = match;
        this.createdAt = new Date(createdAt);
    }
    Turn.from = function (json) {
        var match = match_1["default"].from(json.match);
        return new Turn(json.user_id, json.answer, json.distance, json.has_exact_name_match, json.has_exact_artist_match, json.user_photo, match, json.created_at);
    };
    return Turn;
}());
exports["default"] = Turn;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var Match = /** @class */ (function () {
    function Match(name, artist, image) {
        this.name = name;
        this.artist = artist;
        this.image = image;
    }
    Match.from = function (json) {
        return new Match(json.name, json.artist, json.image);
    };
    return Match;
}());
exports["default"] = Match;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = __webpack_require__(8);

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = __webpack_require__(39);

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = __webpack_require__(40);

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = __webpack_require__(41);

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = __webpack_require__(13);

var _compose2 = _interopRequireDefault(_compose);

var _warning = __webpack_require__(12);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2.default)('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2.default;
exports.combineReducers = _combineReducers2.default;
exports.bindActionCreators = _bindActionCreators2.default;
exports.applyMiddleware = _applyMiddleware2.default;
exports.compose = _compose2.default;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createStore;

var _isPlainObject = __webpack_require__(9);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = __webpack_require__(35);

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2.default)(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2.default] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2.default] = observable, _ref2;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseGetTag = __webpack_require__(27);

var _baseGetTag2 = _interopRequireDefault(_baseGetTag);

var _getPrototype = __webpack_require__(32);

var _getPrototype2 = _interopRequireDefault(_getPrototype);

var _isObjectLike = __webpack_require__(34);

var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!(0, _isObjectLike2.default)(value) || (0, _baseGetTag2.default)(value) != objectTag) {
    return false;
  }
  var proto = (0, _getPrototype2.default)(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

exports.default = isPlainObject;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _root = __webpack_require__(28);

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Built-in value references. */
var _Symbol = _root2.default.Symbol;

exports.default = _Symbol;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var a = __webpack_require__(15);
var store_1 = __webpack_require__(25);
exports.store = store_1["default"];
exports.actions = a;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var turn_processor_1 = __webpack_require__(16);
var sanitizer_1 = __webpack_require__(1);
var selectors_1 = __webpack_require__(19);
var types_1 = __webpack_require__(21);
function selectGameInvitee(friend) {
    return function (dispatch) {
        return dispatch(selectors_1._selectGameInvitee(friend));
    };
}
exports.selectGameInvitee = selectGameInvitee;
function fetchGame(gameId) {
    var headers = new Headers({ 'X-Requested-With': 'XMLHttpRequest' });
    return function (dispatch) {
        fetch("/games/" + gameId, {
            credentials: 'same-origin',
            headers: headers
        }).then(function (response) { return response.json(); }).then(function (json) {
            var game = types_1.Game.from(json.game);
            return dispatch(selectors_1._fetchedGame(game));
        });
    };
}
exports.fetchGame = fetchGame;
function fetchFriends() {
    return function (dispatch) {
        fetch('/friends', { credentials: 'same-origin' })
            .then(function (response) { return response.json(); })
            .then(function (json) {
            var friends = json.friends.map(function (friend) {
                return types_1.FBFriend.from(friend);
            });
            dispatch(selectors_1._fetchFriends(friends));
        });
    };
}
exports.fetchFriends = fetchFriends;
function performSearch(_a) {
    var sanitizedAnswer = _a.sanitizedAnswer;
    var apiKey = "80b1866e815a8d2ddf83757bd97fdc76";
    return fetch("http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + sanitizedAnswer + "&api_key=" + apiKey + "&format=json")
        .then(function (response) { return response.json(); });
}
function submitToServer(_a) {
    var dispatch = _a.dispatch, gameId = _a.gameId, answer = _a.answer, match = _a.match;
    var headers = new Headers({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    });
    var data = { answer: answer, match: match };
    fetch("/games/" + gameId + "/turn", {
        method: 'POST',
        credentials: 'same-origin',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
        var game = types_1.Game.from(json.game);
        dispatch(selectors_1._answerSubmitted(game));
    })["catch"](function (error) {
        dispatch(selectors_1._answerSubmissionFailed(error));
    });
}
// TODO: Remove logs
function submitAnswer(_a) {
    var gameId = _a.gameId, answer = _a.answer, previousTurn = _a.previousTurn;
    console.group = console.group || function (input) { };
    console.groupEnd = console.groupEnd || function () { };
    return function (dispatch) {
        dispatch(selectors_1._answerSubmissionStarted());
        console.group("INPUT: " + answer);
        console.log('  Searching Last.FM...');
        // TODO: sanitization here may be too agressive
        // Removing "by" and "-" may be enough
        var sanitizedAnswer = sanitizer_1.sanitize(answer);
        // search Last.fm
        performSearch({ sanitizedAnswer: sanitizedAnswer }).then(function (json) {
            // Bail early if the response lacks the required json structure
            var foundTracks = json && json.results && json.results.trackmatches;
            if (!foundTracks) {
                selectors_1._answerSubmissionFailed('no match found');
                console.log('%c    No match found', 'color: #A62F2F');
                console.groupEnd();
                return;
            }
            // Bail early if the results are empty
            var tracks = json.results.trackmatches.track;
            if (tracks.length == 0) {
                selectors_1._answerSubmissionFailed("no match found");
                console.log('%c    No match found', 'color: #A62F2F');
                console.groupEnd();
                return;
            }
            // Attempt to find a match 
            var match = turn_processor_1.findMatch(answer, tracks);
            // Bail early we didn't find a match
            if (!match) {
                selectors_1._answerSubmissionFailed("no match found");
                console.log('%c    No match found', 'color: #A62F2F');
                console.groupEnd();
                return;
            }
            if (previousTurn) {
                // validate match against previous turn
                var hasOverlap = turn_processor_1.hasIntersection(match.name, previousTurn.match.name);
                // Bail early if there's no overlap
                if (!hasOverlap) {
                    selectors_1._answerSubmissionFailed("Does not have any similar words with the previous answer");
                    console.log('%c        No similiary to previous answer', 'color: #A62F2F');
                    console.groupEnd();
                    return;
                }
                console.group("        Comparing Artists");
                console.log("%c        " + match.artist + ", " + previousTurn.match.artist, 'color: #4070B7');
                console.groupEnd();
                // Bail early if the 2 artists are the same
                if (match.artist === previousTurn.match.artist) {
                    selectors_1._answerSubmissionFailed("Can't play the same artist twice in a row");
                    console.log("%c        Can't play the same artist twice in a row", "color: #A62F2F");
                    console.groupEnd();
                    return;
                }
            }
            // validate match against first turn
            console.groupEnd();
            // Submit our answer and match to the server
            submitToServer({ dispatch: dispatch, gameId: gameId, answer: answer, match: match });
        });
    };
}
exports.submitAnswer = submitAnswer;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
/* turn-processor.ts
 *
 * A suite of functions designed to process user-generated input
 * at various stages of the turn validation process
*/
var sanitizer_1 = __webpack_require__(1);
var stem = __webpack_require__(17);
// Public: Given user-generated input and an array of
// tracks (json) from Last.fm, returns the track that 
// approximately matches the user-generated input.
// 
// userInput: string - User-generated input
// tracks: any[] - An array of tracks (json) from Last.fm
// Returns any 
function findMatch(userInput, tracks) {
    var match = null;
    var limit = Math.min(tracks.length, 5);
    for (var i = 0; i < limit; i++) {
        var _a = tracks[i], artist = _a.artist, name_1 = _a.name;
        console.log("%c    Match found: " + name_1 + " - " + artist, 'color: #42A143');
        console.log("      Validating...");
        if (validate(userInput, { artist: artist, name: name_1 })) {
            match = tracks[i];
            console.log('%c        valid match!', 'color: #42A143');
            break;
        }
        else {
            console.log('%c        not a valid match', 'color: #A62F2F');
        }
    }
    return match;
}
exports.findMatch = findMatch;
// Public: Given user-generated input and a single track (json) from the Last.fm API,
// tries to determine if the track provided is the track referenced in the user's input
// 
// answer: string - User-generated input
// track: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean
function validate(answer, track) {
    console.group = console.group || function (input) { };
    console.groupEnd = console.groupEnd || function () { };
    console.group("        Sanitizing");
    var sAnswer = sanitizer_1.sanitize(answer);
    var sArtist = sanitizer_1.sanitize(track.artist);
    var sName = sanitizer_1.sanitize(track.name);
    console.log("%c        answer: " + sAnswer, 'color: #4070B7');
    console.log("%c        match.name: " + sName, 'color: #4070B7');
    console.log("%c        match.artist: " + sArtist, 'color: #4070B7');
    console.groupEnd();
    var Patterns = {
        name: new RegExp(sName, 'g'),
        artist: new RegExp(sArtist, 'g')
    };
    var nameMatch = sAnswer.match(Patterns.name);
    var artistMatch = sAnswer.match(Patterns.artist);
    // if we have an exact match then we're 👌🏼
    if (nameMatch && artistMatch) {
        return true;
    }
    // see if the artist exists in the match
    if (nameMatch && !artistMatch) {
        var nameMatchReg = new RegExp(sName, "gi");
        var answerWithoutName = sAnswer.replace(nameMatchReg, "").trim();
        artistMatch = sArtist.match(answerWithoutName);
        if (artistMatch && artistMatch.length > 0) {
            return true;
        }
    }
    return false;
}
exports.validate = validate;
// Internal: A layer of abstraction, which provides an opportunity
// to add inject custom behavior into stemming algorithm
// 
// word - string
// 
// Returns a string
function stemmed(word) {
    if (word === "delivery") {
        return "deliver";
    }
    if (word === "trappin") {
        return "trap";
    }
    if (word === "american") {
        return "america";
    }
    // defer to the algo
    return stem(word);
}
// Public: Given two string, calculates whether there are overlapping words between
// the two strings after reducing each word to its stem.
// 
// left - string
// right - string
//
// Returns a boolean
function hasIntersection(left, right) {
    console.group = console.group || function (input) { };
    console.group("        Comparing Names");
    var lStemmed = sanitizer_1.sanitize(left).split(" ").map(function (word) { return stemmed(word); });
    var rStemmed = sanitizer_1.sanitize(right).split(" ").map(function (word) { return stemmed(word); });
    console.log("%c        stems: " + lStemmed, 'color: #4070B7');
    console.log("%c        stems: " + rStemmed, 'color: #4070B7');
    var long = lStemmed.length > rStemmed.length ? lStemmed : rStemmed;
    var short = long == lStemmed ? rStemmed : lStemmed;
    var results = long.filter(function (word) {
        return short.indexOf(word) !== -1;
    });
    var foundOverlap = results.length > 0;
    console.groupEnd();
    return foundOverlap;
}
exports.hasIntersection = hasIntersection;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stemmer = __webpack_require__(2);

exports = module.exports = __webpack_require__(18);

exports.among = stemmer.among;
exports.except = stemmer.except;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stemmer = __webpack_require__(2),
    alphabet = "abcdefghijklmnopqrstuvwxyz",
    vowels = "aeiouy",
    consonants = alphabet.replace(RegExp("[" + vowels + "]", "g"), "") + "Y",
    v_wxy = vowels + "wxY",
    valid_li = "cdeghkmnrt",
    r1_re = RegExp("^.*?([" + vowels + "][^" + vowels + "]|$)"),
    r1_spec = /^(gener|commun|arsen)/,
    doubles = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/,
    y_cons = RegExp("([" + vowels + "])y", "g"),
    y_suff = RegExp("(.[^" + vowels + "])[yY]$"),
    exceptions1 = { skis: "ski",
  skies: "sky",
  dying: "die",
  lying: "lie",
  tying: "tie",

  idly: "idl",
  gently: "gentl",
  ugly: "ugli",
  early: "earli",
  only: "onli",
  singly: "singl",

  sky: "sky",
  news: "news",
  howe: "howe",

  atlas: "atlas",
  cosmos: "cosmos",
  bias: "bias",
  andes: "andes"
},
    exceptions2 = ["inning", "outing", "canning", "herring", "earring", "proceed", "exceed", "succeed"];

module.exports = function (word) {
  // Exceptions 1
  var stop = stemmer.except(word, exceptions1);
  if (stop) return stop;

  // No stemming for short words.
  if (word.length < 3) return word;

  // Y = "y" as a consonant.
  if (word[0] === "y") word = "Y" + word.substr(1);
  word = word.replace(y_cons, "$1Y");

  // Identify the regions of the word.
  var r1, m;
  if (m = r1_spec.exec(word)) {
    r1 = m[0].length;
  } else {
    r1 = r1_re.exec(word)[0].length;
  }

  var r2 = r1 + r1_re.exec(word.substr(r1))[0].length;

  // Step 0
  word = word.replace(/^'/, "");
  word = word.replace(/'(s'?)?$/, "");

  // Step 1a
  word = stemmer.among(word, ["sses", "ss", "(ied|ies)", function (match, _, offset) {
    return offset > 1 ? "i" : "ie";
  }, "([" + vowels + "].*?[^us])s", function (match, m1) {
    return m1;
  }]);

  stop = stemmer.except(word, exceptions2);
  if (stop) return stop;

  // Step 1b
  word = stemmer.among(word, ["(eed|eedly)", function (match, _, offset) {
    return offset >= r1 ? "ee" : match + " ";
  }, "([" + vowels + "].*?)(ed|edly|ing|ingly)", function (match, prefix, suffix, off) {
    if (/(?:at|bl|iz)$/.test(prefix)) {
      return prefix + "e";
    } else if (doubles.test(prefix)) {
      return prefix.substr(0, prefix.length - 1);
    } else if (shortv(word.substr(0, off + prefix.length)) && off + prefix.length <= r1) {
      return prefix + "e";
    } else {
      return prefix;
    }
  }]);

  // Step 1c
  word = word.replace(y_suff, "$1i");

  // Step 2
  word = stemmer.among(word, r1, ["(izer|ization)", "ize", "(ational|ation|ator)", "ate", "enci", "ence", "anci", "ance", "abli", "able", "entli", "ent", "tional", "tion", "(alism|aliti|alli)", "al", "fulness", "ful", "(ousli|ousness)", "ous", "(iveness|iviti)", "ive", "(biliti|bli)", "ble", "ogi", function (m, off) {
    return word[off - 1] === "l" ? "og" : "ogi";
  }, "fulli", "ful", "lessli", "less", "li", function (m, off) {
    return ~valid_li.indexOf(word[off - 1]) ? "" : "li";
  }]);

  // Step 3
  word = stemmer.among(word, r1, ["ational", "ate", "tional", "tion", "alize", "al", "(icate|iciti|ical)", "ic", "(ful|ness)", "", "ative", function (m, off) {
    return off >= r2 ? "" : "ative";
  }]);

  // Step 4
  word = stemmer.among(word, r2, ["(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ism|ate|iti|ous|ive|ize)", "", "ion", function (m, off) {
    return ~"st".indexOf(word[off - 1]) ? "" : m;
  }]);

  // Step 5
  word = stemmer.among(word, r1, ["e", function (m, off) {
    return off >= r2 || !shortv(word, off - 2) ? "" : "e";
  }, "l", function (m, off) {
    return word[off - 1] === "l" && off >= r2 ? "" : "l";
  }]);

  word = word.replace(/Y/g, "y");

  return word;
};

// Check for a short syllable at the given index.
// Examples:
//
//   rap
//   trap
//   entrap
//
// NOT short
//
//   uproot
//   bestow
//   disturb
//
function shortv(word, i) {
  if (i == null) i = word.length - 2;
  if (word.length < 3) i = 0; //return true
  return !!(!~vowels.indexOf(word[i - 1]) && ~vowels.indexOf(word[i]) && !~v_wxy.indexOf(word[i + 1]) || i === 0 && ~vowels.indexOf(word[i]) && !~vowels.indexOf(word[i + 1]));
}

// Check if the word is short.
function short(word, r1) {
  var l = word.length;
  return r1 >= l && shortv(word, l - 2);
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var constants_1 = __webpack_require__(0);
function _answerSubmissionStarted() {
    return {
        type: constants_1.ANSWER_SUBMISSION.PENDING
    };
}
exports._answerSubmissionStarted = _answerSubmissionStarted;
function _answerSubmitted(game) {
    return {
        type: constants_1.ANSWER_SUBMISSION.SUCCESS,
        data: game
    };
}
exports._answerSubmitted = _answerSubmitted;
function _answerSubmissionFailed(error) {
    return {
        type: constants_1.ANSWER_SUBMISSION.ERROR,
        data: error
    };
}
exports._answerSubmissionFailed = _answerSubmissionFailed;
function _fetchFriends(friends) {
    return {
        type: constants_1.FETCH_FRIENDS.SUCCESS,
        data: friends
    };
}
exports._fetchFriends = _fetchFriends;
function _performSearch(results) {
    return {
        type: constants_1.LAST_FM_SEARCH.SUCCESS,
        data: results
    };
}
exports._performSearch = _performSearch;
function _fetchedGame(game) {
    return {
        type: constants_1.FETCH_GAME.SUCCESS,
        data: game
    };
}
exports._fetchedGame = _fetchedGame;
function _selectGameInvitee(friend) {
    return {
        type: constants_1.INVITEE.SUCCESS,
        data: friend
    };
}
exports._selectGameInvitee = _selectGameInvitee;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.createActionSet = function (actionName) {
    return {
        PENDING: actionName + "_PENDING",
        SUCCESS: actionName + "_SUCCESS",
        ERROR: actionName + "_ERROR"
    };
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var game_1 = __webpack_require__(22);
exports.Game = game_1["default"];
var player_1 = __webpack_require__(23);
exports.Player = player_1["default"];
var match_1 = __webpack_require__(5);
exports.Match = match_1["default"];
var turn_1 = __webpack_require__(4);
exports.Turn = turn_1["default"];
var fb_friend_1 = __webpack_require__(24);
exports.FBFriend = fb_friend_1["default"];
var stack_1 = __webpack_require__(3);
exports.Stack = stack_1["default"];


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var stack_1 = __webpack_require__(3);
var Game = /** @class */ (function () {
    function Game(id, players, status, stacks) {
        this.id = id;
        this.players = players;
        this.status = status;
        this.stacks = stacks;
    }
    Game.from = function (json) {
        var stacks = json.stacks.map(function (stack) { return stack_1["default"].from(stack); });
        var players = {
            viewer: json.players.viewer,
            opponent: json.players.opponent
        };
        return new Game(json.id, players, json.status, stacks);
    };
    Game.prototype.latestTurn = function () {
        var stack = this.latestStack();
        if (!stack) {
            return null;
        }
        if (!stack.turns) {
            return null;
        }
        if (stack.turns.length == 0) {
            return null;
        }
        return stack.turns[stack.turns.length - 1];
    };
    Game.prototype.latestStack = function () {
        if (!this.stacks) {
            return null;
        }
        if (this.stacks.length === 0) {
            return null;
        }
        return this.stacks[this.stacks.length - 1];
    };
    return Game;
}());
exports["default"] = Game;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var Player = /** @class */ (function () {
    function Player() {
    }
    return Player;
}());
exports["default"] = Player;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var FBFriend = /** @class */ (function () {
    function FBFriend(id, name, picture) {
        this.id = id;
        this.name = name;
        this.picture = picture;
    }
    FBFriend.from = function (json) {
        return new FBFriend(json.id, json.name, json.picture);
    };
    return FBFriend;
}());
exports["default"] = FBFriend;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var redux_thunk_1 = __webpack_require__(26);
var redux_1 = __webpack_require__(6);
var index_1 = __webpack_require__(42);
exports["default"] = redux_1.createStore(index_1["default"], redux_1.applyMiddleware(redux_thunk_1["default"]));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol2 = __webpack_require__(10);

var _Symbol3 = _interopRequireDefault(_Symbol2);

var _getRawTag = __webpack_require__(30);

var _getRawTag2 = _interopRequireDefault(_getRawTag);

var _objectToString = __webpack_require__(31);

var _objectToString2 = _interopRequireDefault(_objectToString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol3.default ? _Symbol3.default.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? (0, _getRawTag2.default)(value) : (0, _objectToString2.default)(value);
}

exports.default = baseGetTag;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _freeGlobal = __webpack_require__(29);

var _freeGlobal2 = _interopRequireDefault(_freeGlobal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal2.default || freeSelf || Function('return this')();

exports.default = root;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

exports.default = freeGlobal;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol2 = __webpack_require__(10);

var _Symbol3 = _interopRequireDefault(_Symbol2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol3.default ? _Symbol3.default.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

exports.default = getRawTag;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

exports.default = objectToString;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _overArg = __webpack_require__(33);

var _overArg2 = _interopRequireDefault(_overArg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Built-in value references. */
var getPrototype = (0, _overArg2.default)(Object.getPrototypeOf, Object);

exports.default = getPrototype;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

exports.default = overArg;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

exports.default = isObjectLike;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(36);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(38);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var root; /* global window */

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(37)(module)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineReducers;

var _createStore = __webpack_require__(8);

var _isPlainObject = __webpack_require__(9);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = __webpack_require__(12);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2.default)(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2.default)('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2.default)(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if ((typeof actionCreators === 'undefined' ? 'undefined' : _typeof(actionCreators)) !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators === 'undefined' ? 'undefined' : _typeof(actionCreators)) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyMiddleware;

var _compose = __webpack_require__(13);

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2.default.apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var redux_1 = __webpack_require__(6);
var lastfm_1 = __webpack_require__(43);
var main_1 = __webpack_require__(44);
exports["default"] = redux_1.combineReducers({
    lastFM: lastfm_1["default"],
    main: main_1["default"]
});


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var constants_1 = __webpack_require__(0);
var defaultState = { searchResults: [] };
function default_1(state, action) {
    if (state === void 0) { state = defaultState; }
    switch (action.type) {
        case constants_1.LAST_FM_SEARCH.SUCCESS: {
            return Object.assign({}, state, { searchResults: action.data });
        }
        default:
            return state;
    }
}
exports["default"] = default_1;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
exports.__esModule = true;
var constants_1 = __webpack_require__(0);
var defaultState = { friends: [], game: null, error: null, invitee: null };
function default_1(state, action) {
    if (state === void 0) { state = defaultState; }
    switch (action.type) {
        case constants_1.FETCH_FRIENDS.SUCCESS: {
            return Object.assign({}, state, { friends: action.data });
        }
        case constants_1.INVITEE.SUCCESS: {
            return Object.assign({}, state, { invitee: action.data });
        }
        case constants_1.FETCH_GAME.SUCCESS: {
            return Object.assign({}, state, { game: action.data });
        }
        case constants_1.ANSWER_SUBMISSION.PENDING: {
            return Object.assign({}, state, { error: null });
        }
        case constants_1.ANSWER_SUBMISSION.SUCCESS: {
            return Object.assign({}, state, { game: action.data });
        }
        case constants_1.ANSWER_SUBMISSION.ERROR: {
            return Object.assign({}, state, { error: action.data });
        }
        default:
            return state;
    }
}
exports["default"] = default_1;


/***/ })
/******/ ])));