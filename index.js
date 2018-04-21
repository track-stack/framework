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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
const BLACKLIST = "and|the|by|ft|remix|feat";
const FILTERS = [
    (input) => input.toLowerCase(),
    (input) => input.replace(/\(feat.*\)/, ''),
    (input) => input.replace(/[,.+\(\)\[\]\-_—]/g, ' '),
    (input) => input.replace(/[$!]/g, 's'),
    (input) => input.replace(new RegExp(`\\b(${BLACKLIST})\\b`, 'g'), ''),
    (input) => input.replace(/['&@]/g, ''),
    (input) => input.replace(/\s+/g, ' ')
];
// Public: Puts the input string through a series of regex filters
//
// input - string
//
// Returns a string
function sanitize(input) {
    FILTERS.forEach(filter => input = filter(input));
    return input.trim();
}
exports.sanitize = sanitize;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
/* turn-processor.ts
 *
 * A suite of functions designed to process user-generated input
 * at various stages of the turn validation process
*/
const sanitizer_1 = __webpack_require__(0);
const word_components_1 = __webpack_require__(21);
const stem = __webpack_require__(22);
const interfaces_1 = __webpack_require__(4);
// Public: Given user-generated input and an array of
// tracks (json) from Last.fm, returns the track that
// approximately matches the user-generated input.
//
// userInput: string - User-generated input
// tracks: any[] - An array of tracks (json) from Last.fm
// debugCallback?: DebugValue - An optional debug callback function
// Returns any
function findMatch(userInput, tracks, debugCallback) {
    let match = null;
    const limit = Math.min(tracks.length, 10);
    for (let i = 0; i < limit; i++) {
        const { artist, name } = tracks[i];
        if (debugCallback) {
            debugCallback({
                key: `Validating against ${artist} - ${name}`,
                options: { tags: [
                        { tag: 'span', range: [0, 'Validating against'.length] },
                        { tag: 'u', range: ['Validating against '.length, `${artist} - ${name}`.length] }
                    ] }
            });
        }
        if (validate(userInput, { artist, name }, debugCallback)) {
            return tracks[i];
        }
    }
}
exports.findMatch = findMatch;
// Public: Given user-generated input and a single track (json) from the Last.fm API,
// tries to determine if the track provided is the track referenced in the user's input
//
// answer: string - User-generated input
// track: {string, string} - An object that contains the artist and song name from Last.fm
//
// Returns boolean
function validate(answer, track, debugCallback) {
    if (debugCallback) {
        debugCallback({
            key: 'Validating match...',
            options: { indent: 1, tags: [
                    { tag: 'i', range: [0, 'Validating match...'.length] }
                ] }
        });
    }
    const sAnswer = sanitizer_1.sanitize(answer);
    const sArtist = sanitizer_1.sanitize(track.artist);
    const sName = sanitizer_1.sanitize(track.name);
    if (debugCallback) {
        debugCallback({
            key: 'Sanitizing values...',
            options: { indent: 1, tags: [
                    { tag: 'span', range: [0, 'Sanitizing values...'.length] }
                ] }
        });
        const hash = { 'Input:': sAnswer, 'Artist:': sArtist, 'Track': sName };
        for (let key in hash) {
            const val = hash[key];
            let tags = [{ tag: 'b', range: [0, key.length] }];
            if (val === sAnswer) {
                tags.push({ tag: 'span', range: ['input: '.length, sAnswer.length], style: interfaces_1.TagStyle.Input });
            }
            debugCallback({
                key: `${key} ${val}`,
                options: { indent: 2, tags: tags }
            });
        }
    }
    const Patterns = {
        name: new RegExp(sName, 'g'),
        artist: new RegExp(sArtist, 'g')
    };
    let nameMatch = sAnswer.match(Patterns.name);
    let artistMatch = sAnswer.match(Patterns.artist);
    if (debugCallback) {
        let matchClass = nameMatch ? interfaces_1.TagStyle.Success : interfaces_1.TagStyle.Error;
        let matchText = nameMatch ? "yes" : "no";
        debugCallback({
            key: `Do the track names match? ${matchText}`,
            options: { indent: 1, tags: [
                    { tag: 'span', range: [0, 'Do the track names match?'.length] },
                    { tag: 'span', range: ['Do the track names match? '.length, matchText.length], style: matchClass }
                ] }
        });
        matchClass = artistMatch ? interfaces_1.TagStyle.Success : interfaces_1.TagStyle.Error;
        matchText = artistMatch ? "yes" : "no";
        debugCallback({
            key: `Do the artist names match? ${matchText}`,
            options: { indent: 1, tags: [
                    { tag: 'span', range: [0, 'Do the artist names match?'.length] },
                    { tag: 'span', range: ['Do the artist names match? '.length, matchText.length], style: matchClass }
                ] }
        });
    }
    // if we have an exact match then we're 👌🏼
    if (nameMatch && artistMatch) {
        return true;
    }
    // see if the artist exists in the match
    if (nameMatch && !artistMatch) {
        if (debugCallback) {
            debugCallback({
                key: `Fuzzy match...`,
                options: { indent: 1, tags: [
                        { tag: 'h4', range: [0, 'Fuzz match...'.length] }
                    ] }
            });
        }
        const nameMatchReg = new RegExp(sName, "gi");
        const answerWithoutName = sAnswer.replace(nameMatchReg, "").trim();
        const hasIntersection = stringHasIntersection(sArtist, answerWithoutName, debugCallback);
        const klass = hasIntersection ? "success" : "error";
        const text = hasIntersection ? "yes" : "no";
        if (hasIntersection) {
            return true;
        }
    }
    if (debugCallback) {
        debugCallback({
            key: 'No match',
            options: { indent: 1, tags: [
                    { tag: 'span', style: interfaces_1.TagStyle.Error, range: [0, 'no match'.length] }
                ] }
        });
    }
    return false;
}
exports.validate = validate;
function stringHasIntersection(left, right, debugCallback) {
    return matchHasIntersection({ artist: left, name: "" }, { artist: right, name: "" }, debugCallback);
}
exports.stringHasIntersection = stringHasIntersection;
// Private: Runs a string through a transform function which considers
// our custom word component mappings
//
// str - string
//
// Returns a string
function stringThroughComponentTransform(str) {
    return str.split(' ').reduce((acc, word) => {
        const lower = word.toLowerCase();
        const components = word_components_1.default[lower];
        const words = components ? components : [word];
        return acc.concat(words);
    }, []).join(' ');
}
function splitDigits(str) {
    return str.split(' ').reduce((acc, word) => {
        if (/^\d+$/.test(word)) {
            const split = word.split('');
            return acc.concat(split);
        }
        return acc.concat([word]);
    }, []).join(' ');
}
// Private: Given a string, returns an array of transformed (see stringThroughComponentTransform),
// stemmed words.
// 
// str - string
//
// Returns a string[]
function stemmedComponents(str, debugCallback) {
    const transformed = stringThroughComponentTransform(str);
    if (debugCallback) {
        debugCallback({
            key: `👉 ${transformed}`,
            options: { indent: 3 }
        });
    }
    if (debugCallback) {
        debugCallback({
            key: 'Sanitizing...',
            options: { indent: 3, tags: [
                    { tag: 'i', range: [0, 'Sanitizing...'.length] }
                ] }
        });
    }
    const sanitized = sanitizer_1.sanitize(transformed);
    if (debugCallback) {
        debugCallback({
            key: `👉 ${sanitized}`,
            options: { indent: 3 }
        });
    }
    if (debugCallback) {
        debugCallback({
            key: 'Splitting digits...',
            options: { indent: 3, tags: [
                    { tag: 'i', range: [0, 'Splitting digits...'.length] }
                ] }
        });
    }
    const result = splitDigits(sanitized);
    if (debugCallback) {
        debugCallback({
            key: `👉 ${result}`,
            options: { indent: 3 }
        });
    }
    if (debugCallback) {
        debugCallback({
            key: 'Stemming...',
            options: { indent: 3, tags: [
                    { tag: 'i', range: [0, 'stemming...'.length] }
                ] }
        });
    }
    const stemmed = result.split(' ').map(word => stem(word));
    if (debugCallback) {
        debugCallback({
            key: `👉 ${stemmed}`,
            options: { indent: 3 }
        });
    }
    return stemmed;
}
function matchHasIntersection(left, right, debugCallback) {
    if (debugCallback) {
        debugCallback({
            key: `<b>input:</b> ${[left.name, left.artist].join(' ')}`,
            options: { indent: 2 }
        });
        debugCallback({
            key: `<i>Running custom component transform...</i>`,
            options: { indent: 3 }
        });
    }
    const aComponents = stemmedComponents([left.name, left.artist].join(' '), debugCallback);
    if (debugCallback) {
        debugCallback({
            key: `input: ${[right.name, right.artist].join(' ')}`,
            options: { indent: 2, tags: [
                    { tag: 'b', range: [0, 'input:'.length] }
                ] }
        });
        debugCallback({
            key: 'Running custom component transform...',
            options: { indent: 3, tags: [
                    { tag: 'i', range: [0, 'Running custom component transform...'.length] }
                ] }
        });
    }
    const bComponents = stemmedComponents([right.name, right.artist].join(' '), debugCallback);
    const long = aComponents.length > bComponents.length ? aComponents : bComponents;
    const short = long == aComponents ? bComponents : aComponents;
    const results = long.filter(word => {
        return short.indexOf(word) !== -1;
    });
    if (debugCallback) {
        const lHTMLString = long.map(word => {
            const match = results.indexOf(word) !== -1;
            const klass = match ? 'success' : '';
            return `<span class=${klass}>${word}</span>`;
        }).join(' ');
        const sHTMLString = short.map(word => {
            const match = results.indexOf(word) !== -1;
            const klass = match ? 'success' : '';
            return `<span class=${klass}>${word}</span>`;
        }).join(' ');
        debugCallback({
            key: `${lHTMLString} <> ${sHTMLString}`,
            options: { indent: 2 }
        });
    }
    return results.length > 0;
}
exports.matchHasIntersection = matchHasIntersection;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
function lastFMResponseVerifier(json) {
    // Bail early if the response lacks the required json structure
    const foundTracks = json && json.results && json.results.trackmatches;
    if (!foundTracks) {
        return [];
    }
    // Bail early if the results are empty
    const tracks = json.results.trackmatches.track;
    if (tracks.length == 0) {
        return [];
    }
    return tracks;
}
exports.lastFMResponseVerifier = lastFMResponseVerifier;


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TagStyle;
(function (TagStyle) {
    TagStyle["Success"] = "success";
    TagStyle["Error"] = "error";
    TagStyle["Input"] = "input";
    TagStyle["None"] = "";
})(TagStyle = exports.TagStyle || (exports.TagStyle = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(6);
function _answerSubmissionStarted() {
    return {
        type: constants_1.ANSWER_SUBMISSION.PENDING
    };
}
exports._answerSubmissionStarted = _answerSubmissionStarted;
function _answerSubmitted(game) {
    return {
        type: constants_1.ANSWER_SUBMISSION.SUCCESS,
        data: game,
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
function _loginSuccess(json) {
    return {
        type: constants_1.LOGIN.SUCCESS,
        data: {
            user: json.user,
            accessToken: json.accessToken
        }
    };
}
exports._loginSuccess = _loginSuccess;
function _setAccessToken(token) {
    return {
        type: constants_1.ACCESS_TOKEN.SET,
        data: token
    };
}
exports._setAccessToken = _setAccessToken;
function _fetchDashboardPending() {
    return {
        type: constants_1.DASHBAORD.PENDING,
        data: null
    };
}
exports._fetchDashboardPending = _fetchDashboardPending;
function _fetchDashboardSuccess(previews) {
    return {
        type: constants_1.DASHBAORD.SUCCESS,
        data: previews
    };
}
exports._fetchDashboardSuccess = _fetchDashboardSuccess;
function _fetchDashboardError(error) {
    return {
        type: constants_1.DASHBAORD.ERROR,
        data: error
    };
}
exports._fetchDashboardError = _fetchDashboardError;
function _unsetGame() {
    return {
        type: constants_1.GAME.UNSET
    };
}
exports._unsetGame = _unsetGame;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
const action_helper_1 = __webpack_require__(24);
exports.ANSWER_SUBMISSION = action_helper_1.createActionSet('ANSWER_SUBMITTED');
exports.FETCH_FRIENDS = action_helper_1.createActionSet('FETCH_FRIENDS');
exports.LAST_FM_SEARCH = action_helper_1.createActionSet('LAST_F_SEARCH');
exports.FETCH_GAME = action_helper_1.createActionSet('FETCH_GAME');
exports.LOGIN = action_helper_1.createActionSet('LOGIN');
exports.INVITEE = action_helper_1.createActionSet('INVITEE');
exports.ACCESS_TOKEN = { SET: 'ACCESS_TOKEN_SET' };
exports.DASHBAORD = action_helper_1.createActionSet('DASHBOARD');
exports.GAME = { UNSET: 'GAME_UNSET' };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(25);
exports.Game = game_1.default;
var player_1 = __webpack_require__(26);
exports.Player = player_1.default;
var match_1 = __webpack_require__(10);
exports.Match = match_1.default;
var turn_1 = __webpack_require__(9);
exports.Turn = turn_1.default;
var fb_friend_1 = __webpack_require__(27);
exports.FBFriend = fb_friend_1.default;
var stack_1 = __webpack_require__(8);
exports.Stack = stack_1.default;
var dashboard_game_preview_1 = __webpack_require__(28);
exports.DashboardGamePreview = dashboard_game_preview_1.default;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
const turn_1 = __webpack_require__(9);
class Stack {
    constructor(turns, canEnd, gameId, ended) {
        this.turns = turns || new Array();
        this.canEnd = canEnd;
        this.gameId = gameId;
        this.ended = ended;
    }
    lastTurn() {
        return this.turns[this.turns.length - 1];
    }
    firstTurn() {
        return this.turns[0];
    }
    static from(json) {
        const turns = json.turns.map(turn => turn_1.default.from(turn));
        return new Stack(turns, json.can_end, json.game_id, json.ended);
    }
}
exports.default = Stack;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
const match_1 = __webpack_require__(10);
class Turn {
    constructor(userId, answer, distance, hasExactNameMatch, hasExactArtistMatch, userPhoto, match, createdAt) {
        this.userId = userId;
        this.answer = answer;
        this.distance = distance;
        this.hasExactNameMatch = hasExactNameMatch;
        this.hasExactArtistMatch = hasExactArtistMatch;
        this.userPhoto = userPhoto;
        this.match = match;
        this.createdAt = new Date(createdAt);
    }
    static from(json) {
        const match = match_1.default.from(json.match);
        return new Turn(json.user_id, json.answer, json.distance, json.has_exact_name_match, json.has_exact_artist_match, json.user_photo, match, json.created_at);
    }
}
exports.default = Turn;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
class Match {
    constructor(name, artist, image) {
        this.name = name;
        this.artist = artist;
        this.image = image;
    }
    static from(json) {
        return new Match(json.name, json.artist, json.image);
    }
}
exports.default = Match;


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createStore;

var _isPlainObject = __webpack_require__(13);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = __webpack_require__(44);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseGetTag = __webpack_require__(36);

var _baseGetTag2 = _interopRequireDefault(_baseGetTag);

var _getPrototype = __webpack_require__(41);

var _getPrototype2 = _interopRequireDefault(_getPrototype);

var _isObjectLike = __webpack_require__(43);

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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _root = __webpack_require__(37);

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Built-in value references. */
var _Symbol = _root2.default.Symbol;

exports.default = _Symbol;

/***/ }),
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const a = __webpack_require__(19);
const store_1 = __webpack_require__(33);
exports.store = store_1.default;
exports.actions = a;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
var site_1 = __webpack_require__(20);
exports.Site = site_1.default;
var admin_1 = __webpack_require__(29);
exports.Admin = admin_1.default;
var api_1 = __webpack_require__(31);
exports.api = api_1.default;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const turn_processor_1 = __webpack_require__(1);
const sanitizer_1 = __webpack_require__(0);
const lastfm_response_verifier_1 = __webpack_require__(2);
const site_1 = __webpack_require__(5);
const types_1 = __webpack_require__(7);
function performSearch({ sanitizedAnswer }) {
    const apiKey = "80b1866e815a8d2ddf83757bd97fdc76";
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${sanitizedAnswer}&api_key=${apiKey}&format=json`)
        .then(response => response.json());
}
function submitToServer(dispatch, gameId, answer, match, gameOver) {
    const headers = new Headers({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    });
    const data = {
        answer: answer,
        match: match,
        game_over: gameOver
    };
    fetch(`/games/${gameId}/turn`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(json => {
        const game = types_1.Game.from(json.game);
        dispatch(site_1._answerSubmitted(game));
    })
        .catch(error => {
        dispatch(site_1._answerSubmissionFailed(error));
    });
}
exports.default = {
    setAccessToken: (token) => {
        return dispatch => {
            dispatch(site_1._setAccessToken(token));
        };
    },
    login: (token, expires, local, callback) => {
        return dispatch => {
            const headers = new Headers({
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            });
            const app_id = "029828097c99845e38f1ac6d43aa43946bf193b80a38f826f47e68ae7f63bbe9";
            const data = { token, expires, app_id };
            return fetch('http://track-stack-staging.herokuapp.com/api/v1/auth/create', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
        };
    },
    selectGameInvitee: (friend) => {
        return dispatch => {
            return dispatch(site_1._selectGameInvitee(friend));
        };
    },
    fetchGame: (gameId) => {
        const headers = new Headers({ 'X-Requested-With': 'XMLHttpRequest' });
        return dispatch => {
            fetch(`/games/${gameId}`, {
                credentials: 'same-origin',
                headers: headers
            }).then(response => response.json()).then(json => {
                const game = types_1.Game.from(json.game);
                return dispatch(site_1._fetchedGame(game));
            });
        };
    },
    fetchFriends: () => {
        return dispatch => {
            fetch('/friends', { credentials: 'same-origin' })
                .then(response => response.json())
                .then(json => {
                const friends = json.friends.map(friend => types_1.FBFriend.from(friend));
                dispatch(site_1._fetchFriends(friends));
            });
        };
    },
    submitAnswer: (answer, stack) => {
        return dispatch => {
            dispatch(site_1._answerSubmissionStarted());
            // TODO: full sanitization before searching may be too agressive
            // Removing "by" and "-" may be enough
            const sanitizedAnswer = sanitizer_1.sanitize(answer);
            performSearch({ sanitizedAnswer }).then(json => {
                // confirm that our input matches at least 1 track (check the top 5 results)
                // confirm that our match passes the test against the previous turn
                // if the stack can be ended, cofirm that our match passes the test against the first turn
                // make sure we get a response from Last.fm
                const tracks = lastfm_response_verifier_1.lastFMResponseVerifier(json);
                if (tracks.length === 0) {
                    dispatch(site_1._answerSubmissionFailed(`No track found for ${answer}.`));
                    return;
                }
                // Attempt to find a match
                const match = turn_processor_1.findMatch(answer, tracks);
                // Bail early we didn't find a match
                if (!match) {
                    dispatch(site_1._answerSubmissionFailed(`No track found for ${answer}.`));
                    return;
                }
                const previousTurn = stack.firstTurn();
                const hasOverlapWithPreviousTurn = turn_processor_1.matchHasIntersection(match, previousTurn.match);
                // Bail early if there's no overlap with previous turn
                if (!hasOverlapWithPreviousTurn) {
                    dispatch(site_1._answerSubmissionFailed("No similarity to the previous track."));
                    return;
                }
                // Bail early if the 2 artists are the same
                if (match.artist === previousTurn.match.artist) {
                    dispatch(site_1._answerSubmissionFailed("Can't play the same artist twice in a row."));
                    return;
                }
                const trackPlayedAlready = stack.turns.filter((turn) => {
                    return turn.match.artist == match.artist && turn.match.name == match.name;
                });
                if (trackPlayedAlready.length > 0) {
                    dispatch(site_1._answerSubmissionFailed("That song has already been played."));
                    return;
                }
                // validate match against first turn
                if (stack.canEnd) {
                    const firstTurn = stack.lastTurn();
                    const hasOverlapWithFirstTurn = turn_processor_1.matchHasIntersection(match, firstTurn.match);
                    // winner
                    if (hasOverlapWithFirstTurn) {
                        submitToServer(dispatch, stack.gameId, answer, match, true);
                        return;
                    }
                }
                // Submit our answer and match to the server
                submitToServer(dispatch, stack.gameId, answer, match, false);
            });
        };
    },
    fetchDashboard: (token) => {
        return dispatch => {
            dispatch(site_1._fetchDashboardPending);
            const headers = new Headers({ 'X-Requested-With': 'XMLHttpRequest' });
            const app_id = "029828097c99845e38f1ac6d43aa43946bf193b80a38f826f47e68ae7f63bbe9";
            fetch(`http://track-stack-staging.herokuapp.com/api/v1/dashboard?app_id=${app_id}&access_token=${token}`, {
                credentials: 'same-origin',
                headers: headers
            })
                .then(response => response.json())
                .then(json => {
                console.log('got the stuff!', json);
                const previews = json.active_game_previews.map(preview => types_1.DashboardGamePreview.from(preview));
                const invites = [];
                return dispatch(site_1._fetchDashboardSuccess({
                    previews: previews,
                    invites: invites
                }));
            })
                .catch(error => {
                console.log(error);
                return dispatch(site_1._fetchDashboardError(error));
            });
        };
    }
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    '100': ['1', '0', 'hundred'],
    '200': ['2', '0', 'hundred'],
    '300': ['3', '0', 'hundred'],
    '400': ['4', '0', 'hundred'],
    '500': ['5', '0', 'hundred'],
    '600': ['6', '0', 'hundred'],
    '700': ['7', '0', 'hundred'],
    '800': ['8', '0', 'hundred'],
    '900': ['9', '0', 'hundred'],
    '273': ['2', '7', '3'],
    '8255': ['8', '2', '5'],
    '10000': ['ten', 'thousand', '1', '0'],
    '$ave': ['save'],
    '$ixty': ['sixty', '6'],
    '$pitta': ['spit'],
    '$uicideboy$': ['suicide', 'boy'],
    'playland': ['play', 'land'],
    'toyland': ['toy', 'land'],
    'wokhardt': ['wok', 'hard'],
    '100it': ['1', '0', 'hundred'],
    '100k': ['1', '0', 'hundred', 'thousand', 'k'],
    'jban$2turnt': ['j', 'band', 'ban', '2', 'turn'],
    'jbans2turnt': ['j', 'band', 'ban', '2', 'turn'],
    '10th': ['1', '0', 'tenth'],
    '15th': ['1', '5'],
    '16yrold': ['1', '6', 'year', 'old'],
    '1fan': ['1', 'fan'],
    '1hunnid': ['1', 'hundred'],
    '1k': ['1', 'k', 'thousand', 'one'],
    '1nce': ['1', 'once', 'one'],
    '1st': ['1', 'first', 'one'],
    '1train': ['1', 'train'],
    '1x1': ['1', 'x'],
    '22s': ['twenty', '2'],
    '50': ['5', '0'],
    '21': ['1', '2'],
    '24': ['4', '2'],
    '96': ['9', '6'],
    '98': ['9', '8'],
    '24hrs': ['twenty', '2', '4', 'hour'],
    '24k': ['twenty', '2', '4', 'k', 'karat'],
    '24s': ['twenty', '2', '4'],
    '2am': ['2', 'am'],
    '2cup': ['2', 'cup'],
    '2do': ['2', 'do'],
    '2milly': ['2 million'],
    '2nd': ['2', 'second'],
    '2ne1': ['2 1 n', 'e', 'any'],
    '2nite': ['2', 'night'],
    '2pac': ['tupac', '2'],
    '2seater': ['2', 'seat'],
    '2u': ['2', 'u'],
    '300lbs': ['3', '0', 'hundred', 'pound'],
    '30k': ['thirty', '3', '0', 'thousand', 'k'],
    '3d': ['3', 'd'],
    '3if': ['3', 'x'],
    '3lau': ['3', 'lau'],
    '3lw': ['3', 'l', 'w'],
    '3rd': ['3', 'third'],
    '3t': ['3', 't'],
    '3way': ['3', 'way'],
    '3ww': ['3', 'w'],
    '4eva': ['4', 'for', 'ever'],
    '4everi': ['4', 'ever'],
    '4orever': ['4', 'for', 'ever'],
    '3oh!3': ['3', 'oh'],
    '4r': ['4', 'for'],
    '4th': ['4', 'fourth'],
    '4u': ['4', 'u'],
    '4x4': ['4', 'x'],
    '50k': ['fifty', '5', '0', 'k', 'thousand'],
    '5th': ['5', 'fifth'],
    '60km': ['6', '0', 'k', 'm'],
    '6am': ['6', 'am'],
    '6ix': ['6'],
    '6ix9ine': ['6', '9'],
    '6lack': ['6', 'black'],
    '6th': ['6', 'sixth'],
    '7dueceduece': ['7', 'duece', 'seven'],
    '7eventh': ['7', 'seventh'],
    '7th': ['7', 'seventh'],
    '88glam': ['eighty', '8', 'glam'],
    '8ball': ['8', 'ball'],
    '8teen': ['8', 'teen'],
    '8th': ['8', 'eigth'],
    '93feetofsmoke': ['9', '3', 'ninety', 'feet', 'of', 'smoke'],
    '9th': ['9', 'ninth'],
    'a f r o': ['afro'],
    'a l I e n s': ['alien'],
    'a l l i e': ['allie'],
    'a r i z o n a': ['arizona'],
    'a$$': ['ass'],
    'a$ton': ['aston'],
    'a1': ['a', '1'],
    'aa': ['a'],
    'aaahhhh': ['ahh'],
    'aahhyeahh': ['ah', 'yeah'],
    'aal': ['a', 'l'],
    'abandonment': ['abandon'],
    'abc': ['a', 'b', 'c'],
    'abel': ['able'],
    'abominationz': ['abomination'],
    'absofacto': ['abso', 'fact'],
    'absolutely': ['absolute'],
    'ac': ['a', 'c'],
    'acab': ['a', 'c', 'b'],
    'acdc': ['a', 'c', 'd'],
    'achy': ['ache'],
    'actin': ['act'],
    'activator': ['activate'],
    'adhd': ['a', 'd', 'h'],
    'adrift': ['drift'],
    'aerobatic': ['aero', 'batic'],
    'aerodynamic': ['aero', 'dynamic'],
    'aeroplane': ['aero', 'plane'],
    'aerosmith': ['aero', 'smith'],
    'affirmation': ['affirm'],
    'afi': ['a', 'f', 'i'],
    'afire': ['fire'],
    'african': ['africa'],
    'africanism': ['africa'],
    'afrika': ['africa'],
    'afrojack': ['afro', 'jack'],
    'afroman': ['afro', 'man'],
    'afrosmash': ['afro', 'smash'],
    'afterglow': ['after', 'glow'],
    'aftergold': ['after', 'gold'],
    'afterhours': ['after', 'hour'],
    'afterimage': ['after', 'image'],
    'afterlife': ['after', 'life'],
    'afternoon': ['after', 'noon'],
    'afterparties': ['after', 'party'],
    'afterparty': ['after', 'party'],
    'aftershock': ['after', 'shock'],
    'aftershow': ['after', 'show'],
    'aftr': ['after'],
    'ahhh': ['ahh'],
    'aiight': ['alright'],
    'aimee': ['amy'],
    'airborne': ['air', 'born'],
    'airline': ['air', 'line'],
    'airliner': ['air', 'line'],
    'airplane': ['air', 'plane'],
    'airplanes': ['air', 'plane'],
    'airport': ['air', 'port'],
    'airstream': ['air', 'stream'],
    'airwave': ['air', 'wave'],
    'airwaves': ['air', 'wave'],
    'airway': ['air', 'way'],
    'ajr': ['a', 'j', 'r'],
    'alaskan': ['alaska'],
    'albert': ['bert'],
    'alexbth': ['alex', 'b', 't', 'h'],
    'alfamega': ['alfa', 'mega'],
    'alison': ['allison'],
    'allan': ['alan', 'allen'],
    'allday': ['all', 'day'],
    'allentown': ['allen', 'town'],
    'alligator': ['gator'],
    'alligators': ['gator'],
    'allowance': ['allow'],
    'alma': ['a', 'l', 'm'],
    'alo': ['a', 'l', 'o'],
    'alot': ['lot'],
    'alphabet': ['alpha', 'bet'],
    'alunageorge': ['aluna', 'george'],
    'alvvays': ['always'],
    'alwayz': ['always'],
    'amazin': ['amaze'],
    'amazingly': ['amaze'],
    'amazonas': ['amazon'],
    'ambitionz': ['ambition'],
    'jana': ['america'],
    'americano': ['america'],
    'american': ['america'],
    'amerika': ['america'],
    'amerikaz': ['america'],
    'amerikkka': ['america'],
    'amigone': ['am', 'I', 'gone'],
    'amongst': ['among'],
    'analyser': ['analyse'],
    'angelsea': ['angel', 'sea'],
    'angelz': ['angel'],
    'andersson': ['anderson'],
    'anitta': ['anita'],
    'annalee': ['anna', 'lee'],
    'anne': ['ann'],
    'antichrist': ['anti', 'christ'],
    'anticipation': ['anticipate'],
    'anybody': ['any', 'body'],
    'anymore': ['any', 'more'],
    'anyone': ['any', '1'],
    'anything': ['any', 'thing'],
    'anytime': ['any', 'time'],
    'anyway': ['any', 'way'],
    'anywayican': ['any', 'way', 'i', 'can'],
    'anywhere': ['any', 'where'],
    'apl': ['a', 'p ,l'],
    'apocalypso': ['apocalypse'],
    'appearin': ['appear'],
    'applebottom': ['apple', 'bottom'],
    'applebum': ['apple', 'bum'],
    'appleby': ['apple', 'by'],
    'applejack': ['apple', 'jack'],
    'applewood': ['apple', 'wood'],
    'appointment': ['appoint'],
    'approval': ['approve'],
    'aquafina': ['aqua', 'fina'],
    'aqualung': ['aqua', 'lung'],
    'aquaman': ['aqua', 'man'],
    'ar': ['a', 'r'],
    'arabella': ['bella'],
    'arcangel': ['arc', 'angel'],
    'archangel': ['arch', 'angel'],
    'area21': ['area', '2', '1'],
    'arent': ['are'],
    'armies': ['army'],
    'armstrong': ['arm', 'strong'],
    'around': ['round'],
    'artful': ['art'],
    'artist': ['art'],
    'artistic': ['art'],
    'artistry': ['art'],
    'artpop': ['art', 'pop'],
    'artsy': ['art'],
    'arty': ['art'],
    'ashe': ['ash'],
    'ashlee': ['ashley'],
    'ashworth': ['ash', 'worth'],
    'askin': ['ask'],
    'asshole': ['ass', 'hole'],
    'assistant': ['assist'],
    'astr': ['a', 's', 't', 'r'],
    'astronomy': ['astro'],
    'atf': ['a', 't', 'f'],
    'atliens': ['a', 't', 'l', 'alien'],
    'atm': ['a', 't', 'm'],
    'atomize': ['atom'],
    'attachin': ['attach'],
    'attacker': ['attack'],
    'attackin': ['attack'],
    'attlas': ['atlas'],
    'attractor': ['attract'],
    'atwa': ['a', 't', 'w'],
    'au': ['a', 'u'],
    'audiodamn': ['audio', 'damn'],
    'audiomachine': ['audio', 'machine'],
    'audioslave': ['audio', 'slave'],
    'auntie': ['aunt'],
    'autoamerican': ['auto', 'america'],
    'autobiography': ['auto', 'bio', 'graph'],
    'autoerotique': ['auto', 'erotic'],
    'autograph': ['auto', 'graph'],
    'automobile': ['auto', 'mobile'],
    'automobiles': ['auto', 'mobile'],
    'automotive': ['auto', 'motive'],
    'ava1anche': ['avalanche'],
    'ave': ['avenue'],
    'awa': ['a', 'w'],
    'awaken': ['awake'],
    'awakening': ['awake'],
    'awolnation': ['awol', 'nation'],
    'aww': ['aw'],
    'awwsome': ['awesome'],
    'ayer': ['air'],
    'ayokay': ['ayo', 'okay'],
    'ayy': ['aye'],
    'az': ['as'],
    'azz': ['ass'],
    'azzhole': ['ass', 'hole'],
    'b2k': ['b', '2 k'],
    'babie': ['baby'],
    'babies': ['baby'],
    'babyface': ['baby', 'face'],
    'babygirl': ['baby', 'girl'],
    'babyshambles': ['baby', 'shamble'],
    'babysitter': ['baby', 'sit'],
    'babywipe': ['baby', 'wipe'],
    'backboard': ['back', 'board'],
    'backbone': ['back', 'bone'],
    'backdoor': ['back', 'door'],
    'background': ['back', 'ground'],
    'bacdafucup': ['back', 'fuck', 'up'],
    'backlash': ['back', 'lash'],
    'backpack': ['back', 'pack'],
    'backroads': ['back', 'road'],
    'backroad': ['back', 'road'],
    'backseat': ['back', 'seat'],
    'backspace': ['back', 'space'],
    'backspacer': ['back', 'space'],
    'backstabber': ['back', 'stab'],
    'backstabbers': ['back', 'stab'],
    'backstreet': ['back', 'street'],
    'backward': ['back', 'ward'],
    'backwater': ['back', 'water'],
    'backwood': ['back', 'wood'],
    'backwoods': ['back', 'wood'],
    'backwudz': ['back', 'wood'],
    'backyard': ['back', 'yard'],
    'bada$$': ['bad', 'ass'],
    'badass': ['bad', 'ass'],
    'badazz': ['bad', 'ass'],
    'badbadnotgood': ['bad', 'not', 'good'],
    'badd': ['bad'],
    'badder': ['bad'],
    'baddest': ['bad'],
    'badfinger': ['bad', 'finger'],
    'badfish': ['bad', 'fish'],
    'badflower': ['bad', 'flower'],
    'badhead': ['bad', 'head'],
    'badland': ['bad', 'land'],
    'badlands': ['bad', 'land'],
    'badly': ['bad'],
    'baecation': ['bae', 'vacation'],
    'bagbak': ['bag', 'back'],
    'bagger': ['bag'],
    'baggie': ['bag'],
    'baggin': ['bag'],
    'bailout': ['bail', 'out'],
    'baker': ['bake'],
    'bakin': ['bake'],
    'balla': ['ball'],
    'baller': ['ball'],
    'ballers': ['ball'],
    'ballin': ['ball'],
    'ballout': ['ball', 'out'],
    'ballroom': ['ball', 'room'],
    'ballyho': ['bally', 'ho'],
    'balm': ['calm'],
    'bamz': ['bam'],
    'bananarama': ['banana'],
    'bandgang': ['band', 'gang'],
    'bando': ['band'],
    'bandz': ['band'],
    'banga': ['bang'],
    'bangarang': ['bang', 'rang'],
    'bangaz': ['bang'],
    'banger': ['bang'],
    'bangers': ['bang'],
    'bangerz': ['bang'],
    'bangin': ['bang'],
    'bangx3': ['bang', 'x', '3'],
    'bangz': ['bang'],
    'banke': ['bank'],
    'banker': ['bank'],
    'bankie': ['bank'],
    'bankin': ['bank'],
    'bankrobbers': ['bank', 'rob'],
    'bankrobber': ['bank', 'rob'],
    'bankroll': ['bank', 'roll'],
    'barbi': ['barbie'],
    'barclay': ['bar', 'clay'],
    'barebone': ['bare', 'bone'],
    'barefoot': ['bare', 'foot'],
    'barenaked': ['bare', 'naked'],
    'barnes': ['barn'],
    'baroness': ['baron'],
    'barr': ['bar'],
    'barrymore': ['barry', 'more'],
    'barstool': ['bar', 'stool'],
    'barstools': ['bar', 'stool'],
    'barz': ['bar'],
    'baseball': ['base', 'ball'],
    'basehead': ['base', 'head'],
    'baseheads': ['base', 'head'],
    'basketball': ['basket', 'ball'],
    'basketcase': ['basket', 'case'],
    'bassboy': ['bass', 'boy'],
    'basshead': ['bass', 'head'],
    'bassjacker': ['bass', 'jack'],
    'bassline': ['bass', 'line'],
    'bassnectar': ['bass', 'nectar'],
    'bassy': ['bass'],
    'batdance': ['bat', 'dance'],
    'bathgate': ['bath', 'gate'],
    'bathroom': ['bath', 'room'],
    'bathtub': ['bath', 'tub'],
    'bathwater': ['bath', 'water'],
    'batman': ['bat', 'man'],
    'battlecry': ['battle', 'cry'],
    'battlefield': ['battle', 'field'],
    'battleme': ['battle', 'me'],
    'battleship': ['battle', 'ship'],
    'battlin': ['battle'],
    'bb': ['b'],
    'bbq': ['b', 'q', 'barbque'],
    'bc': ['b', 'c'],
    'bcx': ['b', 'c', 'x'],
    'bday': ['b', 'day', 'birth'],
    'bde': ['b', 'd', 'e'],
    'bdy': ['body'],
    'beachin': ['beach'],
    'beachwood': ['beach', 'wood'],
    'bearcat': ['bear', 'cat'],
    'bearclaw': ['bear', 'claw'],
    'beardo': ['beard'],
    'bearheart': ['bear', 'heart'],
    'bearhearts': ['bear', 'heart'],
    'bearson': ['bear', 'son'],
    'bearstronaut': ['bear', 'astro', 'naut'],
    'beartooth': ['bear', 'tooth'],
    'beastie': ['beast'],
    'beastly': ['beast'],
    'beasty': ['beast'],
    'beater': ['beat'],
    'beatin': ['beat'],
    'beatnut': ['beat', 'nut'],
    'beatnuts': ['beat', 'nut'],
    'beatz': ['beat'],
    'becca': ['rebecca'],
    'becomer': ['become'],
    'becomin': ['become'],
    'bedrock': ['bed', 'rock'],
    'bedroom': ['bed', 'room'],
    'bedtime': ['bed', 'time'],
    'beefheart': ['beef', 'heart'],
    'beekeeper': ['bee', 'keep'],
    'beekeepers': ['bee', 'keep'],
    'beetlebum': ['beetle', 'bum'],
    'beez': ['bee'],
    'beggar': ['beg'],
    'begger': ['beg'],
    'beggers': ['beg'],
    'beggin': ['beg'],
    'beginin': ['begin'],
    'beginner': ['begin'],
    'beginners': ['begin'],
    'beholder': ['behold'],
    'bein': ['be'],
    'believable': ['believe'],
    'believer': ['believe'],
    'believers': ['believe'],
    'believin': ['believe'],
    'belle': ['bell'],
    'bellyache': ['belly', 'ache'],
    'bendin': ['bend'],
    'benjamin': ['ben'],
    'bennie': ['ben'],
    'benny': ['ben'],
    'bentcousin': ['bent', 'cousin'],
    'bep': ['b', 'e', 'p'],
    'beside': ['be', 'side'],
    'bette': ['betty'],
    'bewitched': ['witch'],
    'bezz': ['best'],
    'bf': ['b', 'f'],
    'bff': ['b', 'f'],
    'bfg': ['b', 'f', 'g'],
    'bg': ['b', 'g'],
    'bga': ['b', 'g', 'a'],
    'bgib': ['b', 'g', 'I', 'b'],
    'bi***': ['bitch'],
    'bich': ['bitch'],
    'bigbang': ['big', 'bang'],
    'bigg': ['big'],
    'biggs': ['big'],
    'biggie': ['big'],
    'bigger': ['big'],
    'biggest': ['big'],
    'bightside': ['bright', 'side'],
    'bigtyme': ['big', 'time'],
    'bih': ['bitch'],
    'biig': ['big'],
    'billboard': ['bill', 'board'],
    'billie': ['bill'],
    'billionaire': ['billion'],
    'billionth': ['billion'],
    'billy': ['bill'],
    'billz': ['bill'],
    'biochemical': ['bio', 'chemical'],
    'biography': ['bio', 'graph'],
    'bipolar': ['bi', 'polar'],
    'birdie': ['bird'],
    'birdman': ['bird', 'man'],
    'birdsong': ['bird', 'song'],
    'birdtalk': ['bird', 'talk'],
    'birdtalker': ['bird', 'talk'],
    'birdy': ['bird'],
    'birdz': ['bird'],
    'birthday': ['birth', 'day'],
    'bitchin': ['bitch'],
    'biter': ['bite'],
    'bitten': ['bite'],
    'bitterblue': ['bitter', 'blue'],
    'bittersweat': ['bitter', 'sweat'],
    'bittersweet': ['bitter', 'sweet'],
    'bizkit': ['biscuit'],
    'bizzy': ['busy'],
    'bj': ['b', 'j'],
    'bk': ['b', 'k'],
    'bkaye': ['b', 'kay'],
    'bklu': ['b', 'k', 'l', 'u'],
    'bkny': ['b', 'k', 'n', 'y'],
    'blac': ['black'],
    'blacc': ['black'],
    'blackalicious': ['black'],
    'blackbear': ['black', 'bear'],
    'blackberry': ['black', 'berry'],
    'blackbird': ['black', 'bird'],
    'blackened': ['black'],
    'blacker': ['black'],
    'blackflag': ['black', 'flag'],
    'blackfoot': ['black', 'foot'],
    'blackhawk': ['black', 'hawk'],
    'blackish': ['black'],
    'blackjack': ['black', 'jack'],
    'blacklight': ['black', 'light'],
    'blackness': ['black'],
    'blackout': ['black', 'out'],
    'blackstreet': ['black', 'street'],
    'blacktop': ['black', 'top'],
    'blackwater': ['black', 'water'],
    'blackwood': ['black', 'wood'],
    'bladee': ['blade'],
    'bladez': ['blade'],
    'blakk': ['black'],
    'blaque': ['black'],
    'blaster': ['blast'],
    'blasterjaxx': ['blast', 'jack'],
    'blazer': ['blaze'],
    'blazers': ['blaze'],
    'blazin': ['blaze'],
    'ble$$ing': ['bless'],
    'ble$$ings': ['bless'],
    'bleacher': ['bleach'],
    'bleachers': ['bleach'],
    'blessid': ['bless'],
    'blieve': ['believe'],
    'blinder': ['blind'],
    'blinders': ['blind'],
    'blindfold': ['blind', 'fold'],
    'blindness': ['blind'],
    'blissful': ['bliss'],
    'blitzen': ['blitz'],
    'blitzkrieg': ['blitz'],
    'blkswn': ['black', 'swan'],
    'bloc': ['bloc'],
    'blocka': ['block'],
    'blockbuster': ['block', 'bust'],
    'blocker': ['block'],
    'blockers': ['block'],
    'blockin': ['block'],
    'blockz': ['block'],
    'blof': ['b', 'l', 'o', 'f'],
    'blonder': ['blonde'],
    'blondie': ['blonde'],
    'bloodboy': ['blood', 'boy'],
    'bloodclots': ['blood', 'clot'],
    'bloodclot': ['blood', 'clot'],
    'bloodhound': ['blood', 'hound'],
    'bloodpop': ['blood', 'pop'],
    'bloodraw': ['blood', 'raw'],
    'bloodsport': ['blood', 'sport'],
    'bloodstream': ['blood', 'stream'],
    'bloody': ['blood'],
    'bloodz': ['blood'],
    'bloomer': ['bloom'],
    'bloomin': ['bloom'],
    'blower': ['blow'],
    'blowers': ['blow'],
    'blowfelt': ['blow', 'felt'],
    'blowfish': ['blow', 'fish'],
    'blowin': ['blow'],
    'bloxx': ['block'],
    'blu': ['blue'],
    'bluebell': ['blue', 'bell'],
    'bluebelle': ['blue', 'bell'],
    'blueberry': ['blue', 'berry'],
    'bluebird': ['blue', 'bird'],
    'bluegrass': ['blue', 'grass'],
    'bluejay': ['blue', 'jay'],
    'bluez': ['blue'],
    'bluntone': ['blunt', 'one'],
    'blurry': ['blur'],
    'blurryface': ['blur', 'face'],
    'blvck': ['black'],
    'blvckness': ['black'],
    'blvk': ['black'],
    'bm': ['b', 'm'],
    'bmblb': ['b', 'm', 'l'],
    'bmbu': ['b', 'm', 'u'],
    'bmf': ['b', 'm', 'f'],
    'bmw': ['b', 'm', 'w'],
    'bmx': ['b', 'm', 'x'],
    'bnb': ['b', 'n'],
    'bnce': ['b', 'n', 'c', 'e'],
    'bnd': ['b,n', 'd', 'band'],
    'bns': ['b', 'n', 's'],
    'bnw': ['b', 'n', 'w'],
    'bo$$': ['boss'],
    'bo$$y': ['boss'],
    'boardroom': ['board', 'room'],
    'boardwalk': ['board', 'walk'],
    'boater': ['boat'],
    'boatin': ['boat'],
    'bobbie': ['bob'],
    'bobby': ['bob'],
    'bobsled': ['bob', 'sled'],
    'bodean': ['bo', 'dean'],
    'bodyache': ['body', 'ache'],
    'bodyguard': ['body', 'guard'],
    'bodyslam': ['body', 'slam'],
    'boi': ['boy'],
    'boiz': ['boy'],
    'bollected': ['collect'],
    'bondies': ['bond'],
    'bondy': ['bond'],
    'bonecrusher': ['bone', 'crush'],
    'boneless': ['bone'],
    'boney': ['bone'],
    'bonfire': ['bon', 'fire'],
    'boobie': ['boob'],
    'boobies': ['boob'],
    'boog': ['booger'],
    'boogies': ['booger'],
    'bookend': ['book', 'end'],
    'bookends': ['book', 'end'],
    'booker': ['book'],
    'bookmark': ['book', 'mark'],
    'bookshelf': ['book', 'shelf'],
    'bookstore': ['book', 'store'],
    'bool': ['cool'],
    'boombastic': ['boom'],
    'boombox': ['boom', 'box'],
    'boomer': ['boom'],
    'boomerang': ['boom', 'rang'],
    'boomin': ['boom'],
    'boomshakalaka': ['boom', 'shakalaka'],
    'boondock': ['boon', 'dock'],
    'booooom': ['boom'],
    'bootie': ['booty'],
    'bootin': ['boot'],
    'Bootleg': ['boot', 'leg'],
    'bootstrap': ['boot', 'strap'],
    'bootsy': ['boot'],
    'bootylicious': ['booty'],
    'bootyman': ['booty', 'man'],
    'bootz': ['boot'],
    'bopper': ['bop'],
    'borderline': ['border', 'line'],
    'borealism': ['bo', 'real'],
    'boredom': ['bored'],
    'bornagain': ['born', 'again'],
    'bossin': ['boss'],
    'bosstone': ['boss', 'tone'],
    'bossy': ['boss'],
    'bottlemen': ['bottle', 'men'],
    'boulevard': ['blvd'],
    'bouncybob': ['bounce', 'bob'],
    'bout': ['about'],
    'bowerbird': ['bower', 'bird'],
    'bowerbirds': ['bower', 'bird'],
    'boxer': ['box'],
    'boxers': ['box'],
    'boxin': ['box'],
    'boxinbox': ['box', 'in'],
    'boyfriend': ['boy', 'friend'],
    'boyz': ['boy'],
    'bpm': ['b', 'p', 'm'],
    'bpswr': ['b', 'p', 's', 'w', 'r'],
    'bpt': ['b', 'p', 't'],
    'bq': ['b', 'q'],
    'bqc': ['b', 'q', 'c'],
    'bql': ['b', 'q', 'l'],
    'bqto': ['b', 'q', 't', 'o'],
    'bradberry': ['brad', 'berry'],
    'bradbery': ['brad', 'berry'],
    'bradley': ['brad'],
    'bragg': ['brag'],
    'braggin': ['brag'],
    'brainchild': ['brain', 'child'],
    'brainfeeder': ['brain', 'feed'],
    'brainstorm': ['brain', 'storm'],
    'brainsugar': ['brain', 'sugar'],
    'brandi': ['brandy'],
    'brasstrack': ['brass', 'track'],
    'braveheart': ['brave', 'heart'],
    'bravehearts': ['brave', 'heart'],
    'bravery': ['brave'],
    'brazy': ['crazy'],
    'breadfan': ['bread', 'fan'],
    'breakable': ['break'],
    'breakdown': ['break', 'down'],
    'breakers': ['break'],
    'breaker': ['break'],
    'breakeven': ['break', 'even'],
    'breakin': ['break'],
    'breakn': ['break'],
    'breakout': ['break', 'out'],
    'breakthrough': ['break', 'through'],
    'breakthru': ['break', 'through'],
    'breakup': ['break', 'up'],
    'breaky': ['break'],
    'breathin': ['breathe'],
    'breeder': ['breed'],
    'breeders': ['breed'],
    'breezeblocks': ['breeze', 'block'],
    'bret': ['brett'],
    'bricc': ['brick'],
    'bridger': ['bridge'],
    'bridgers': ['bridge'],
    'bridie': ['bird'],
    'bridies': ['bird'],
    'brighter': ['bright'],
    'brightest': ['bright'],
    'brightly': ['bright'],
    'brillz': ['brill'],
    'bringer': ['bring'],
    'bringin': ['bring'],
    'brit': ['britney'],
    'britt': ['britney'],
    'brix': ['brick'],
    'broadcast': ['broad', 'cast'],
    'broadway': ['broad', 'way'],
    'brockbeats': ['brock', 'beat'],
    'brohug': ['bro', 'hug'],
    'brokedown': ['broke', 'down'],
    'broken': ['broke'],
    'bromance': ['bro', 'romance'],
    'brooke': ['brook'],
    'brostep': ['bro', 'step'],
    'brotha': ['brother'],
    'brotherhood': ['brother', 'hood'],
    'brotherly': ['brother'],
    'browne': ['brown'],
    'brownlee': ['brown', 'lee'],
    'brownstone': ['brown', 'stone'],
    'brownsville': ['brown'],
    'browz': ['brow'],
    'brushfire': ['brush', 'fire'],
    'brutally': ['brutal'],
    'bryan': ['brian'],
    'bryann': ['brian'],
    'bryce': ['brice'],
    'bs': ['b', 's'],
    'bsdu': ['b', 's', 'd', 'u'],
    'bsp': ['b', 's', 'p'],
    'bts': ['b', 't', 's'],
    'bttm': ['b', 't', 'm', 'bottom'],
    'bubblegum': ['bubble', 'gum'],
    'bubbly': ['bubble'],
    'buckcherry': ['buck', 'cherry'],
    'budd': ['bud'],
    'buddz': ['bud'],
    'bugg': ['bug'],
    'buggin': ['bug'],
    'builder': ['build'],
    'buildin': ['build'],
    'bulldozer': ['bull', 'dozer'],
    'bulletproof': ['bullet', 'proof'],
    'bulletproofangel': ['bullet', 'proof', 'angel'],
    'bullfight': ['bull', 'fight'],
    'bullish': ['bull'],
    'bullseye': ['bull', 'eye'],
    'bullshit': ['bull', 'shit'],
    'bumpers': ['bump'],
    'bumper': ['bump'],
    'bumpin': ['bump'],
    'bumpy': ['bump'],
    'bunchin': ['bunch'],
    'bunnies': ['bunny'],
    'bunnymen': ['bunny', 'men'],
    'burna': ['burn'],
    'burner': ['burn'],
    'burnin': ['burn'],
    'burnitup': ['burn', 'it', 'up'],
    'burnout': ['burn', 'out'],
    'burnside': ['burn', 'side'],
    'burnt': ['burn'],
    'bushy': ['bush'],
    'busload': ['bus', 'load'],
    'busta': ['bust'],
    'buster': ['bust'],
    'bustin': ['bust'],
    'busty': ['bust'],
    'butterball': ['butter', 'ball'],
    'buttercup': ['butter', 'cup'],
    'buttercups': ['butter', 'cup'],
    'butterfly': ['butter', 'fly'],
    'butterflies': ['butter', 'fly'],
    'butthead': ['butt', 'head'],
    'butthole': ['butt', 'hole'],
    'buuren': ['buren'],
    'buyer': ['buy'],
    'buyin': ['buy'],
    'buzzin': ['buzz'],
    'buzzkill': ['buzz', 'kill'],
    'bvd': ['b', 'v', 'd'],
    'bvndgxd': ['band', 'god'],
    'bvrger': ['burger'],
    'bvrnout': ['burn', 'out'],
    'bw': ['b', 'w'],
    'bwill': ['b', 'will'],
    'bwoi': ['boy'],
    'bwu': ['b', 'w', 'u'],
    'bxrber': ['barber'],
    'bxs': ['b', 'x', 's'],
    'byegone': ['bye', 'gone'],
    'byob': ['b', 'y', 'o'],
    'byrd': ['bird'],
    'bzkt': ['b', 'z', 'k', 't'],
    'bzrk': ['bezerk'],
    'caamp': ['camp'],
    'cabinessence': ['cabin', 'essecnce'],
    'cadillactica': ['cadillac'],
    'caffeinated': ['caffeine'],
    'cakin': ['cake'],
    'california': ['cali'],
    'californication': ['cali'],
    'caller': ['call'],
    'callers': ['call'],
    'callin': ['call'],
    'camelphat': ['camel', 'fat'],
    'camoflauge': ['camo'],
    'camper': ['camp'],
    'campers': ['camp'],
    'campfire': ['camp', 'fire'],
    'campground': ['camp', 'ground'],
    'campin': ['camp'],
    'campsite': ['camp', 'site'],
    'camron': ['cam', 'ron'],
    'canadian': ['canada'],
    'cancut': ['can', 'cut'],
    'candi': ['candy'],
    'candlebox': ['candle', 'box'],
    'candyman': ['candy', 'man'],
    'cannonball': ['cannon', 'ball'],
    'cannonballs': ['cannon', 'ball'],
    'cantaloop': ['cantalope', 'loop'],
    'cantcha': ['can', 'cha'],
    'caravan': ['cara', 'van'],
    'cardboard': ['card', 'board'],
    'cardstock': ['card', 'stock'],
    'careful': ['care'],
    'carefully': ['care'],
    'careless': ['care'],
    'caretaker': ['care', 'take'],
    'carll': ['carl'],
    'carried': ['carry'],
    'carrier': ['carry'],
    'carryin': ['carry'],
    'carseat': ['car', 'seat'],
    'carwash': ['car', 'wash'],
    'cashforgold': ['cash', 'for', 'gold'],
    'cashier': ['cash'],
    'cashville': ['cash', 'ville'],
    'castaway': ['cast', 'away'],
    'castlecomer': ['castle', 'come'],
    'castlecomers': ['castle', 'come'],
    'catacomb': ['cata', 'comb'],
    'catcher': ['catch'],
    'catchin': ['catch'],
    'catey': ['katy'],
    'catfish': ['cat', 'fish'],
    'catherine': ['cath'],
    'cause': ['because'],
    'cazette': ['cassette'],
    'cazzette': ['cassette'],
    'cb': ['c', 'b'],
    'cccxxv': ['c', 'x', 'v'],
    'cdot': ['c', 'dot'],
    'ceasefire': ['cease', 'fire'],
    'cellphone': ['cell', 'phone'],
    'cellphones': ['cell', 'phone'],
    'centerfield': ['center', 'field'],
    'centerfold': ['center', 'fold'],
    'centuries': ['century'],
    'ceo': ['c', 'e', 'o'],
    'ceremonial': ['ceremony'],
    'cf': ['c', 'f,'],
    'cfcf': ['c', 'f'],
    'cfo': ['c', 'f', 'o'],
    'cfo$': ['c', 'f', 'o', 's'],
    'cfos': ['c', 'f', 'o', 's'],
    'cg2': ['c', 'g', '2'],
    'cg5': ['c', 'g', '5'],
    'cgb': ['c', 'g', 'b'],
    'chainsaw': ['chain', 'saw'],
    'chainsmoker': ['chain', 'smoke'],
    'chainsmokers': ['chain', 'smoke'],
    'chainsmoking': ['chain', 'smoke'],
    'chainz': ['chain'],
    'chairlift': ['chair', 'lift'],
    'chairman': ['chair', 'man'],
    'chairmen': ['chair', 'men'],
    'challenger': ['challenge'],
    'chamillionaire': ['cham', 'million'],
    'champion': ['champ'],
    'championship': ['champ'],
    'champions': ['champ'],
    'changer': ['change'],
    'changin': ['change'],
    'chappo': ['chapo'],
    'chargers': ['charge'],
    'charger': ['charge'],
    'charli': ['charlie'],
    'charlotteville': ['charlotte', 'ville'],
    'charmers': ['charm'],
    'charmer': ['charm'],
    'chaser': ['chase'],
    'chasin': ['chase'],
    'cheater': ['cheat'],
    'cheaters': ['cheat'],
    'checkin': ['check'],
    'checkmate': ['check', 'mate'],
    'chedda': ['cheddar'],
    'cheerin': ['cheer'],
    'cheerleader': ['cheer', 'lead'],
    'cheerleaders': ['cheer', 'lead'],
    'cheeseburger': ['cheese', 'burger'],
    'chefspecial': ['chef', 'special'],
    'chemicalize': ['chemical'],
    'chestnutt': ['chest', 'nutt'],
    'chevorlett': ['chevy'],
    'chevrolet': ['chevy'],
    'chewin': ['chew'],
    'chic': ['chick'],
    'chickenhead': ['chicken', 'head'],
    'childbirth': ['child', 'birth'],
    'childhood': ['child', 'hood'],
    'childish': ['child'],
    'children': ['child'],
    'chillhop': ['chill', 'hop'],
    'chillin': ['chill'],
    'chilly': ['chill'],
    'chinx': ['chink'],
    'chipmunk': ['chip', 'munk'],
    'chipmunks': ['chip', 'munk'],
    'chokehold': ['choke', 'hold'],
    'chooser': ['choose'],
    'choosers': ['choose'],
    'choosin': ['choose'],
    'choppa': ['chop'],
    'choppas': ['chop'],
    'chopper': ['chop'],
    'choppers': ['chop'],
    'choppin': ['chop'],
    'choppy': ['chop'],
    'chppd': ['chop'],
    'christmases': ['christmas'],
    'christmastime': ['christmas', 'time'],
    'christopher': ['chris'],
    'chromeo': ['chrome'],
    'chronixx': ['chronic'],
    'chrystopher': ['chris'],
    'chubb': ['chub'],
    'chubby': ['chub'],
    'chunky': ['chunk'],
    'chvrches': ['church'],
    'chxpo': ['chapo'],
    'chyna': ['china'],
    'chynna': ['china'],
    'cig': ['cigarette'],
    'citi': ['city'],
    'cities': ['city'],
    'citiez': ['city'],
    'cjay': ['c', 'jay'],
    'cjayq': ['c', 'jay', 'q'],
    'cky': ['c', 'k', 'y'],
    'cl': ['c', 'l'],
    'clappin': ['clap'],
    'claptone': ['clap', 'tone'],
    'clare': ['claire'],
    'clarke': ['clark'],
    'clarkson': ['clark'],
    'clarksville': ['clark', 'ville'],
    'classified': ['classify'],
    'classixx': ['classic'],
    'classik': ['classic'],
    'clayton': ['clay'],
    'cleaner': ['clean'],
    'cleaners': ['clean'],
    'cleanin': ['clean'],
    'clearer': ['clear'],
    'clearest': ['clear'],
    'clearly': ['clear'],
    'clearmountain': ['clear', 'mountain'],
    'clearwater': ['clear', 'water'],
    'climber': ['climb'],
    'climbers': ['climb'],
    'climbin': ['climb'],
    'clipper': ['clip'],
    'clippin': ['clip'],
    'clipt': ['clip'],
    'clockin': ['clock'],
    'clockwise': ['clock', 'wise'],
    'clockz': ['clock'],
    'closeness': ['close'],
    'closer': ['close'],
    'closin': ['close'],
    'cloudburst': ['cloud', 'burst'],
    'cloudy': ['cloud'],
    'clubbin': ['club'],
    'clubhouse': ['club', 'house'],
    'clublife': ['club', 'life'],
    'clubroot': ['club', 'root'],
    'clubz': ['club'],
    'cmc$': ['c', 'm', 's'],
    'cmg': ['c', 'm', 'g'],
    'cmyk': ['c', 'm', 'y', 'k'],
    'coalmine': ['coal', 'mine'],
    'coalminer': ['coal', 'mine'],
    'coalminers': ['coal', 'mine'],
    'coaster': ['coast'],
    'coasters': ['coast'],
    'cobweb': ['cob', 'web'],
    'cobwebs': ['cob', 'web'],
    'cockeye': ['cock', 'eye'],
    'cockeyed': ['cock', 'eye'],
    'cocktail': ['cock', 'tail'],
    'cocktails': ['cock', 'tail'],
    'codefendant': ['co', 'defend'],
    'codefendants': ['co', 'defend'],
    'coffeeshop': ['coffee', 'shop'],
    'col3trane': ['coletrane'],
    'cold1': ['cold', '1'],
    'colder': ['cold'],
    'coldest': ['cold'],
    'coldplay': ['cold', 'play'],
    'coleman': ['cole', 'man'],
    'collarbone': ['collar', 'bone'],
    'collective': ['collect'],
    'colorblind': ['color', 'blind'],
    'colorfeel': ['color', 'feel'],
    'colorfeels': ['color', 'feel'],
    'colorshow': ['color', 'show'],
    'colorz': ['color'],
    'colour': ['color'],
    'colourist': ['color'],
    'comatose': ['coma'],
    'comeback': ['come', 'back'],
    'comfortable': ['comfort'],
    'comin': ['come'],
    'commander': ['command'],
    'commanders': ['command'],
    'commandments': ['command'],
    'commando': ['command'],
    'completely': ['complete'],
    'completly': ['complete'],
    'condemnation': ['condem'],
    'confession': ['confess'],
    'confessions': ['confess'],
    'confessional': ['confess'],
    'confusing': ['confuse'],
    'confusion': ['confuse'],
    'congressional': ['congress'],
    'consciousness': ['conscious'],
    'consumerism': ['consumer'],
    'container': ['contain'],
    'contenders': ['contend'],
    'contender': ['contend'],
    'controlla': ['control'],
    'conway': ['con', 'way'],
    'cookbook': ['cook', 'book'],
    'cooke': ['cook'],
    'cooker': ['cook'],
    'cookin': ['cook'],
    'coolade': ['cool', 'koolaid'],
    'cooler': ['cool'],
    'coolest': ['cool'],
    'coolin': ['cool'],
    'coolio': ['cool'],
    'copcar': ['cop', 'car'],
    'copeland': ['cope', 'land'],
    'copperhead': ['copper', 'head'],
    'copycat': ['copy', 'cat'],
    'corey': ['cory'],
    'cornbread': ['corn', 'bread'],
    'cornerback': ['corner', 'back'],
    'cornerstone': ['corner', 'stone'],
    'coryayo': ['cory', 'ayo'],
    'coughin': ['cough'],
    'coulda': ['could'],
    'couldnt': ['could'],
    'countdown': ['count', 'down'],
    'counter': ['count'],
    'countin': ['count'],
    'countryside': ['country', 'side'],
    'courtship': ['court', 'ship'],
    'covenhoven': ['coven', 'hoven'],
    'cowboy': ['cow', 'boy'],
    'cowboys': ['cow', 'boy'],
    'cowgirl': ['cow', 'girl'],
    'cowgirls': ['cow', 'girl'],
    'coziest': ['cozy'],
    'cpr': ['c', 'p', 'r'],
    'cpu': ['c', 'p', 'u'],
    'cqcq': ['c', 'q'],
    'crabber': ['crab'],
    'crabby': ['crab'],
    'crableg': ['crab', 'leg'],
    'crablegs': ['crab', 'leg'],
    'crackhead': ['crack', 'head'],
    'crackheads': ['crack', 'head'],
    'cracklin': ['crackle'],
    'cracker': ['crack'],
    'cranberry': ['cran', 'berry'],
    'cranberries': ['cran', 'berry'],
    'crappy': ['crap'],
    'crasher': ['crash'],
    'crashers': ['crash'],
    'crashin': ['crash'],
    'crawfish': ['craw', 'fish'],
    'crawler': ['crawl'],
    'crawlin': ['crawl'],
    'crazier': ['crazy'],
    'craziest': ['crazy'],
    'crazysexycool': ['crazy', 'sex', 'cool'],
    'creamer': ['cream'],
    'creamy': ['cream'],
    'creatin': ['create'],
    'creator': ['creat'],
    'creedence': ['creed'],
    'creekwater': ['creek', 'water'],
    'creepers': ['creep'],
    'creeper': ['creep'],
    'creepin': ['creep'],
    'creepoid': ['creep'],
    'creepy': ['creep'],
    'cries': ['cry'],
    'crippin': ['crip'],
    'cris': ['chris'],
    'crnkn': ['c', 'r', 'n', 'k', 'crank'],
    'cro': ['crow'],
    'crocodile': ['croc'],
    'crooklyn': ['crook', 'brooklyn'],
    'cropper': ['crop'],
    'crosseye': ['cross', 'eye'],
    'crosseyed': ['cross', 'eye'],
    'crossfade': ['cross', 'fade'],
    'crossfire': ['cross', 'fire'],
    'crossin': ['cross'],
    'crossroad': ['cross', 'road'],
    'crossroads': ['cross', 'road'],
    'crosstown': ['cross', 'town'],
    'crowe': ['crow'],
    'crue': ['crew'],
    'cruis': ['cruise'],
    'cruisers': ['cruise'],
    'cruiser': ['cruise'],
    'cruisin': ['cruise'],
    'cruisr': ['cruise'],
    'crumblin': ['crumb'],
    'Crumbz': ['crumb'],
    'crunchin': ['crunch'],
    'crunchy': ['crunch'],
    'crusher': ['crush'],
    'crushin': ['crush'],
    'crushmore': ['crush', 'more'],
    'crusty': ['crust'],
    'crx': ['c', 'r', 'x'],
    'crosshairs': ['cross', 'hair'],
    'crybaby': ['cry', 'baby'],
    'crystalize': ['crystal'],
    'crystalle': ['crystal'],
    'crzy': ['crazy'],
    'cryin': ['cry'],
    'ctrix': ['c', 'trix'],
    'ctrl': ['control'],
    'ctrlaltdelete': ['control', 'alt', 'delete'],
    'cubicolor': ['cube', 'color'],
    'cuickshank': ['cruick', 'shank'],
    'cum': ['come'],
    'cumbersome': ['cumber'],
    'cupcake': ['cup', 'cake'],
    'cupcakes': ['cup', 'cake'],
    'cupcakke': ['cup', 'cake'],
    'curbside': ['curb', 'side'],
    'curly': ['curl'],
    'curren$y': ['currensy'],
    'currently': ['current'],
    'curt@!n$': ['curtains'],
    'curtis': ['curt'],
    'curtismith': ['curtis', 'smith'],
    'curvy': ['curve'],
    'cussin': ['cuss'],
    'cuter': ['cute'],
    'cutest': ['cute'],
    'cutie': ['cute'],
    'cutter': ['cut'],
    'cuttin': ['cut'],
    'cutty': ['cut'],
    'cuz': ['because'],
    'cvbz': ['c', 'v', 'b', 'z', 'cub'],
    'cvs': ['c', 'v', 's'],
    'cw': ['c', 'w'],
    'cwow': ['c', 'wow'],
    'cx': ['c', 'x'],
    'cxloe': ['c', 'x', 'l', 'o', 'e'],
    'cybersex': ['cyber', 'sex'],
    'cyndi': ['cindy'],
    'czarface': ['czar', 'face'],
    'd*votion': ['devotion'],
    'd12': ['d', '1 2 twelve'],
    'd3mon': ['demon'],
    'd4l': ['d', '4 l'],
    'dabbin': ['dab'],
    'dabrat': ['da', 'brat'],
    'daddy': ['dad'],
    'daddies': ['dad'],
    'dallask': ['dallas', 'k'],
    'daly': ['daily'],
    'damian': ['damien'],
    'danceaholic': ['dance'],
    'danceophobia': ['dance', 'phobia'],
    'dancer': ['dance'],
    'dancers': ['dance'],
    'dancin': ['dance'],
    'dangelo': ['d', 'angelo'],
    'dangerous': ['danger'],
    'dangerously': ['danger'],
    'dangi': ['dang'],
    'daniel': ['dan'],
    'danny': ['dan'],
    'danville': ['dan'],
    'daredevil': ['dare', 'devil'],
    'daredevils': ['dare', 'devil'],
    'darker': ['dark'],
    'darkest': ['dark'],
    'darkness': ['dark'],
    'darkside': ['dark', 'side'],
    'darlin': ['darling'],
    'darlingside': ['darling', 'side'],
    'dashboard': ['dash', 'board'],
    'dasher': ['dash'],
    'dashin': ['dash'],
    'dat': ['that'],
    'database': ['data', 'base'],
    'datwaydisway': ['that', 'way', 'this'],
    'datarock': ['data', 'rock'],
    'dateless': ['date'],
    'datsik': ['that', 'sick'],
    'davi$': ['davis'],
    'dawg': ['dog'],
    'dawgs': ['dog'],
    'dawgz': ['dog'],
    'daydream': ['day', 'dream'],
    'daydreams': ['day', 'dream'],
    'daydreamer': ['day', 'dream'],
    'daydreamers': ['day', 'dream'],
    'daylight': ['day', 'light'],
    'daytime': ['day', 'time'],
    'dayum': ['damn'],
    'dayz': ['day'],
    'dbangz': ['d', 'bang'],
    'dblcrss': ['double', 'cross'],
    'dbx': ['d', 'b', 'x'],
    'dc': ['d', 'c'],
    'dd': ['d'],
    'ddfh': ['d', 'f', 'h'],
    'deadbeat': ['dead', 'beat'],
    'deadcrush': ['dead', 'crush'],
    'deadeye': ['dead', 'eye'],
    'deadi': ['dead'],
    'deadly': ['dead'],
    'deadman': ['dead', 'man'],
    'deadmau5': ['dead', 'mouse', 'five'],
    'deadmen': ['dead', 'men'],
    'deadpool': ['dead', 'pool'],
    'deadrose': ['dead', 'rose'],
    'deadstar': ['dead', 'star'],
    'deadfellow': ['dead', 'fellow'],
    'deadwood': ['dead', 'wood'],
    'deadz': ['dead'],
    'dealer': ['deal'],
    'dealers': ['deal'],
    'dealin': ['deal'],
    'dealt': ['deal'],
    'dearest': ['dear'],
    'deathly': ['death'],
    'deathpool': ['death', 'pool'],
    'deathporn': ['death', 'porn'],
    'debatable': ['debate'],
    'decemberist': ['december'],
    'decemberists': ['december'],
    'decider': ['decide'],
    'deejay': ['dee', 'jay'],
    'deeper': ['deep'],
    'deepest': ['deep'],
    'deeply': ['deep'],
    'deerhoof': ['deer', 'hoof'],
    'deerhunter': ['deer', 'hunt'],
    'deeweedub': ['dee', 'wee', 'dub'],
    'deez': ['these'],
    'def': ['deaf'],
    'defendant': ['defend'],
    'deftone': ['deaf', 'tone'],
    'deftones': ['deaf', 'tone'],
    'degreez': ['degree'],
    'delicately': ['delicate'],
    'delivery': ['deliver'],
    'dell': ['dale'],
    'dem': ['them'],
    'demolition': ['demo'],
    'demonology': ['demon'],
    'denm': ['denim'],
    'dependin': ['depend'],
    'depressedly': ['depress'],
    'depression': ['depress'],
    'derbyshire': ['derby', 'shire'],
    'dereck': ['derek'],
    'designer': ['design'],
    'designerflow': ['design', 'flow'],
    'desiigner': ['design'],
    'desirable': ['desire'],
    'destroyer': ['destroy'],
    'destroyers': ['destroy'],
    'destruction': ['destruct'],
    'destructo': ['destruct'],
    'developers': ['develop'],
    'developer': ['develop'],
    'development': ['develop'],
    'devvon': ['devon'],
    'dexter': ['dex'],
    'dexy': ['dex'],
    'dfa': ['d', 'f', 'a'],
    'dfc': ['d', 'f', 'c'],
    'dftf': ['d', 'f', 't'],
    'dfw': ['d', 'f', 'w'],
    'dfwm': ['d', 'f', 'w', 'm'],
    'dg': ['d', 'g'],
    'dgaf': ['d', 'g', 'a', 'f'],
    'dhoom': ['doom'],
    'dickie': ['dick'],
    'dickies': ['dick'],
    'dickin': ['dick'],
    'dicky': ['dick'],
    'didnt': ['did'],
    'diduntdidnut': ['did'],
    'died': ['die'],
    'diemonds': ['die', 'diamond'],
    'diezel': ['diesel'],
    'differentology': ['different'],
    'digger': ['dig'],
    'diggers': ['dig'],
    'diggin': ['dig'],
    'diirty': ['dirt'],
    'diller': ['dill'],
    'dimelo': ['dime'],
    'diner': ['dine'],
    'dinin': ['dine'],
    'dinosaur': ['dino'],
    'dinosaurs': ['dino'],
    'diplomatic': ['diplomat'],
    'dipper': ['dip'],
    'dippin': ['dip'],
    'directly': ['direct'],
    'dirtbag': ['dirt', 'bag'],
    'dirtbags': ['dirt', 'bag'],
    'dirtee': ['dirt'],
    'dirty': ['dirt'],
    'dirtybird': ['dirt', 'bird'],
    'dirtybirds': ['dirt', 'bird'],
    'dirtywhirl': ['dirt', 'whirl'],
    'dis': ['this'],
    'disarm': ['arm'],
    'disasterpeace': ['disaster', 'peace'],
    'discotheque': ['disco', 'tech'],
    'disgraceful': ['disgrace'],
    'dishwalla': ['dish', 'walla'],
    'disillusion': ['illusion'],
    'diskopunk': ['disco', 'punk'],
    'disorder': ['order'],
    'disrespect': ['respect'],
    'disrespectful': ['respect'],
    'disstracktion': ['distract', 'track'],
    'distortion': ['distort'],
    'disturbia': ['disturb'],
    'divin': ['dive'],
    'divinyl': ['vinyl'],
    'dixieland': ['dixie', 'land'],
    'dizzee': ['dizzy'],
    'dizzie': ['dizzy'],
    'dj': ['d', 'j'],
    'djds': ['d', 'j', 's'],
    'dkay': ['d', 'k', 'a', 'y'],
    'dkla': ['d', 'k', 'l', 'a'],
    'dklkl': ['d', 'k', 'l'],
    'dkny': ['d', 'k', 'n', 'y'],
    'dkr': ['d', 'k', 'r'],
    'dlk': ['d', 'l', 'k'],
    'dlm': ['d', 'l', 'm'],
    'dlz': ['d', 'l', 'z'],
    'dm': ['d', 'm'],
    'dmc': ['d', 'm', 'c'],
    'dmd': ['d', 'm'],
    'dmx': ['d', 'm', 'x'],
    'dnce': ['d', 'n', 'c', 'e'],
    'doa': ['d', 'o', 'a'],
    'doer': ['do'],
    'dogg': ['dog'],
    'doggie': ['dog'],
    'doggin': ['dog'],
    'doggy': ['dog'],
    'doghouse': ['dog', 'house'],
    'doggystyle': ['dog', 'style'],
    'doin': ['do'],
    'doldrum': ['drum'],
    'dolla': ['dollar'],
    'dollaz': ['dollar'],
    'dollhouse': ['doll', 'house'],
    'dollie': ['doll'],
    'dolly': ['doll'],
    'dominator': ['dominate'],
    'domo23': ['domo', '2', '3'],
    'donavon': ['donovan'],
    'donnie': ['don'],
    'donny': ['don'],
    'donttrustme': ['dont', 'trust', 'me'],
    'dooby': ['doobie'],
    'doomsday': ['doom', 'day'],
    'dooo': ['do'],
    'doorstep': ['door', 'step'],
    'doorway': ['door', 'way'],
    'doorways': ['door', 'way'],
    'doorz': ['door'],
    'dopeboy': ['dope', 'boy'],
    'dopeboys': ['dope', 'boy'],
    'dopeman': ['dope', 'man'],
    'dopesmoothie': ['dope', 'smoothie'],
    'dothatshit': ['do', 'that', 'shit'],
    'doublecross': ['double', 'cross'],
    'doubter': ['doubt'],
    'doubtful': ['doubt'],
    'doubtin': ['doubt'],
    'doughbeezy': ['dough', 'beezy'],
    'dougie': ['doug'],
    'douglass': ['douglas'],
    'downbound': ['down', 'bound'],
    'downeaster': ['down', 'easter'],
    'downer': ['down'],
    'downfall': ['down', 'fall'],
    'downgrade': ['down', 'grade'],
    'downhere': ['down', 'here'],
    'downhill': ['down', 'hill'],
    'download': ['down', 'load'],
    'downloads': ['down', 'load'],
    'downlow': ['down', 'low'],
    'downplay': ['down', 'play'],
    'downpour': ['down', 'pour'],
    'downside': ['down', 'side'],
    'downtown': ['down', 'town'],
    'downunder': ['down', 'under'],
    'doxamillion': ['million'],
    'dpr': ['d', 'p', 'r'],
    'dq': ['d', 'q'],
    'dquest': ['d', 'quest'],
    'dr': ['doctor', 'dr'],
    'doctor': ['doctor', 'dr'],
    'draggin': ['drag'],
    'dragonette': ['dragon'],
    'dragonfly': ['dragon', 'fly'],
    'dragonflies': ['dragon', 'fly'],
    'dragonz': ['dragon'],
    'drainage': ['drain'],
    'dram': ['dram', 'd', 'r', 'a', 'm'],
    'drank': ['drink'],
    'drawer': ['draw'],
    'drawers': ['draw'],
    'drawin': ['draw'],
    'drawn': ['draw'],
    'dreadful': ['dread'],
    'dreamer': ['dream'],
    'dreamers': ['dream'],
    'dreamgirl': ['dream', 'girl'],
    'dreamgirls': ['dream', 'girl'],
    'dreamin': ['dream'],
    'dreamlife': ['dream', 'life'],
    'dreamlover': ['dream', 'love'],
    'dreamlovers': ['dream', 'love'],
    'dreamt': ['dream'],
    'dreamy': ['dream'],
    'dreamz': ['dream'],
    'dresser': ['dress'],
    'drewsthatdude': ['drew', 'that', 'dude'],
    'drgn': ['dragon'],
    'drgs': ['drug'],
    'welshly': ['welsh'],
    'drifter': ['drift'],
    'drifters': ['drift'],
    'driftin': ['drift'],
    'driicky': ['dricky'],
    'drinker': ['drink'],
    'dripper': ['drip'],
    'drippin': ['drip'],
    'drippy': ['drip'],
    'dripy': ['drip'],
    'driven': ['drive'],
    'driver': ['drive'],
    'drivers': ['drive'],
    'driveway': ['drive', 'way'],
    'kflay': ['k', 'flay'],
    'driveways': ['drive', 'way'],
    'drivin': ['drivin'],
    'droolin': ['drool'],
    'dropkick': ['drop', 'kick'],
    'cleopatrick': ['cleo', 'patrick'],
    'droplet': ['drop'],
    'droplets': ['drop'],
    'dropout': ['drop', 'out'],
    'dropouts': ['drop', 'out'],
    'dropper': ['drop'],
    'droppin': ['drop'],
    'droptop': ['drop', 'top'],
    'drownin': ['drown'],
    'dru': ['drew'],
    'druggie': ['drug'],
    'druggy': ['drug'],
    'drugz': ['drug'],
    'druglord': ['drug', 'lord'],
    'drumline': ['drum', 'line'],
    'drummer': ['drum'],
    'drummin': ['drum'],
    'drumss': ['drum'],
    'drumstick': ['drum', 'stick'],
    'drunkard': ['drunk'],
    'ds': ['d'],
    'ds2': ['d', 's', '2'],
    'dsfm': ['d', 's', 'f', 'm'],
    'dsmc': ['d', 's', 'm', 'c'],
    'dt': ['d', 't'],
    'dtms': ['d', 't', 'm', 's'],
    'dtv': ['d', 't', 'v'],
    'dtw': ['d', 't', 'w'],
    'dubamine': ['dub', 'mine'],
    'dubvision': ['dub', 'vision'],
    'dubz': ['dub'],
    'duckling': ['duck'],
    'duckworth': ['duck', 'worth'],
    'ducttape': ['duct', 'tape'],
    'duk': ['duck'],
    'dumber': ['dumb'],
    'dumbest': ['dumb'],
    'dummie': ['dumb'],
    'dumpin': ['dump'],
    'dumptruck': ['dump', 'truck'],
    'dumpweed': ['dump', 'weed'],
    'dunkin': ['dunk'],
    'dunn': ['done'],
    'durt': ['dirt'],
    'durty': ['dirt'],
    'dusky': ['dusk'],
    'dustbowl': ['dust', 'bowl'],
    'dustlight': ['dust', 'light'],
    'dutchie': ['dutch'],
    'dutchman': ['dutch', 'man'],
    'duz': ['does'],
    'dvd': ['d', 'v'],
    'dvsn': ['division'],
    'dweller': ['dwell'],
    'dwntwn': ['down', 'town'],
    'dx': ['d', 'x'],
    'dx7': ['d', 'x', '7'],
    'dxnt': ['don’t', 'd', 'x', 'n', 't'],
    'dycy': ['d', 'c'],
    'dyer': ['dye'],
    'dyin': ['die'],
    'dyme': ['dime'],
    'dyou': ['d', 'you'],
    'dyt': ['d', 'y', 't'],
    'dz': ['d', 'z'],
    'dza': ['d', 'z', 'a'],
    'E40': ['e', '4”, “0”,  “forty'],
    'E-40': ['e', '4”, “0”,  “forty'],
    'earle': ['earl'],
    'earlimart': ['early', 'mart'],
    'earlly': ['early'],
    'earner': ['earn'],
    'earring': ['ear', 'ring'],
    'earrings': ['ear', 'ring'],
    'eartha': ['earth'],
    'earthen': ['earth'],
    'earthquake': ['earth', 'quake'],
    'easier': ['easy'],
    'easiest': ['easy'],
    'easily': ['easy'],
    'eastbound': ['east', 'bound'],
    'eastern': ['east'],
    'eastside': ['east', 'side'],
    'eastwood': ['east', 'wood'],
    'eaten': ['eat'],
    'eater': ['eat'],
    'eatin': ['eat'],
    'eavesdrop': ['eaves', 'drop'],
    'eazi': ['eazy'],
    'eazy': ['easy'],
    'eazyer': ['easy'],
    'echosmith': ['echo', 'smith'],
    'echospace': ['echo', 'space'],
    'eck$': ['ecks'],
    'eddi': ['ed'],
    'eddie': ['ed'],
    'eddy': ['ed'],
    'edgin': ['edge'],
    'edie': ['ed'],
    'edward': ['ed'],
    'edx': ['e', 'd', 'x'],
    'effortless': ['effot'],
    'efx': ['e', 'f', 'x'],
    'ei': ['e', 'i'],
    'eight': ['8'],
    'eightball': ['8', 'ball'],
    'eighteen': ['teen', '1', '8'],
    'eighty': ['eighty', '8', '0'],
    'eiht': ['8'],
    'ekko': ['echo'],
    'elderbrook': ['elder', 'brook'],
    'electrical': ['electric'],
    'electricladyland': ['electric', 'lady', 'land'],
    'electricland': ['electric', 'land'],
    'elemental': ['element'],
    'eliot': ['elliott'],
    'elliot': ['elliott'],
    'elliphant': ['elephant'],
    'elo': ['e', 'l', 'o'],
    'elsewhere': ['else', 'where'],
    'em': ['them'],
    'emancipator': ['emancipate'],
    'emblem3': ['emblem', '3'],
    'embr': ['ember'],
    'embryonic': ['embryo'],
    'emeli': ['emily'],
    'emf': ['e', 'm', 'f'],
    'emmylou': ['emmy', 'lou'],
    'emotional': ['emotion'],
    'emotionless': ['emotion'],
    'endin': ['end'],
    'endless': ['end'],
    'endlessly': ['end'],
    'endz': ['end'],
    'engelwood': ['engel', 'wood'],
    'entirely': ['entire'],
    'enuf': ['enough'],
    'enuff': ['enough'],
    'epmd': ['e', 'p', 'm', 'd'],
    'eraser': ['erase'],
    'erbody': ['every', 'body'],
    'erick': ['eric'],
    'erik': ['eric'],
    'errorsmith': ['error', 'smith'],
    'errywhere': ['every', 'where'],
    'erykah': ['erica'],
    'erything': ['every', 'thing'],
    'espn': ['e', 's', 'p', 'n'],
    'esta': ['e', 's', 't', 'a'],
    'et': ['e', 't'],
    'etc!': ['etc'],
    'etci': ['etc'],
    'eternally': ['eternal'],
    'ethiopian': ['ethiopia'],
    'euopean': ['europe'],
    'euphoric': ['euphoria'],
    'eurythmic': ['rhythm'],
    'eva': ['ever'],
    'evaride': ['ever', 'ride'],
    'evenin': ['evening'],
    'everclear': ['ever', 'clear'],
    'everglades': ['ever', 'glade'],
    'everglade': ['ever', 'glade'],
    'evergreen': ['ever', 'green'],
    'evergreens': ['ever', 'green'],
    'everlast': ['ever', 'last'],
    'everlong': ['ever', 'long'],
    'everlove': ['ever', 'love'],
    'everloving': ['ever', 'love'],
    'eversole': ['ever', 'sole'],
    'evertookatab': ['ever', 'took', 'a', 'tab'],
    'everwood': ['ever', 'wood'],
    'everybodys': ['every', 'body'],
    'everybody': ['every', 'body'],
    'everyday': ['every', 'day'],
    'everydays': ['every', 'day'],
    'everyman': ['every', 'man'],
    'everymans': ['every', 'man'],
    'everyone': ['every', '1'],
    'everyones': ['every', '1'],
    'everything': ['every', 'thing'],
    'everythings': ['every', 'thing'],
    'everytime': ['every', 'time'],
    'everywhere': ['every', 'where'],
    'eww': ['ew'],
    'executioner': ['execution'],
    'exo': ['e', 'o'],
    'expectation': ['expect'],
    'expectations': ['expect'],
    'exploration': ['explore'],
    'extinct': ['extinction'],
    'explorer': ['explore'],
    'explorers': ['explore'],
    'expression': ['express'],
    'exs': ['ex'],
    'extraordinary': ['extra', 'ordinary'],
    'eyelash': ['eye', 'lash'],
    'eyelashes': ['eye', 'lash'],
    'eyelids': ['eye', 'lid'],
    'eyelid': ['eye', 'lid'],
    'eyesdown': ['eye', 'down'],
    'eyeyieyie': ['eye', 'yie'],
    'eyez': ['eye'],
    'ez': ['e', 'z'],
    'f***': ['fuck'],
    'f**k': ['fuck'],
    'f**kin': ['fuck'],
    'f1lorida': ['florida'],
    'fabulously': ['fabulous'],
    'facebook': ['face', 'book'],
    'facelift': ['face', 'lift'],
    'faceoff': ['face', 'off'],
    'facetime': ['face', 'time'],
    'facin': ['face'],
    'factories': ['factory'],
    'factz': ['fact'],
    'fader': ['fade'],
    'fadin': ['fade'],
    'failin': ['fail'],
    'fairchild': ['fair', 'child'],
    'fairness': ['fair'],
    'fairytale': ['fairy', 'tale'],
    'fairytales': ['fairy', 'tale'],
    'faithful': ['faith'],
    'faithless': ['faith'],
    'faiyaz': ['fire'],
    'faker': ['fake'],
    'fakin': ['fake'],
    'fallback': ['fall', 'back'],
    '1975': ['1', '9', '7', '5'],
    '311': ['3', '1'],
    '112': ['1', '2'],
    'fallen': ['fall'],
    'fallin': ['fall'],
    'fallingforyou': ['fall', 'for', 'you'],
    'fallss': ['fall'],
    'fanclub': ['fan', 'club'],
    'fanfare': ['fan', 'fare'],
    'fantastica': ['fantastic'],
    'farewell': ['fare', 'well'],
    'farmer': ['farm'],
    'farmers': ['farm'],
    'farmin': ['farm'],
    'farr': ['far'],
    'fashionista': ['fashion'],
    'fastball': ['fast', 'ball'],
    'faster': ['fast'],
    'fastest': ['fast'],
    'fastlove': ['fast', 'love'],
    'fatboy': ['fat', 'boy'],
    'fatboys': ['fat', 'boy'],
    'fatherless': ['father'],
    'fatherly': ['father'],
    'fatherson': ['father', 'son'],
    'fatkidsbrotha': ['fat', 'kid', 'brother'],
    'fatman': ['fat', 'man'],
    'fatty': ['fat'],
    'favour': ['favor'],
    'favours': ['favor'],
    'favourite': ['favorite'],
    'fazoland': ['fazo', 'land'],
    'fbfw': ['f', 'b', 'w'],
    'fbg': ['f', 'b', 'g'],
    'fbgm': ['f', 'b', 'g', 'm'],
    'fbh': ['f', 'b,h'],
    'fbi': ['f', 'b', 'i'],
    'fck': ['fuck'],
    'fckn': ['fuck'],
    'fcktober': ['fuck', 'october'],
    'fda': ['f', 'd', 'a'],
    'fdb': ['f', 'd', 'b'],
    'fdt': ['f', 'd', 't'],
    'fearful': ['fear'],
    'feathery': ['feather'],
    'federal': ['fed'],
    'feedback': ['feed', 'back'],
    'feeder': ['feed'],
    'feeler': ['feel'],
    'feelgood': ['feel', 'good'],
    'feelin': ['feel'],
    'feelins': ['feel'],
    'fergie': ['ferg'],
    'fff': ['f'],
    'fffire': ['fire'],
    'ffrench': ['french'],
    'fge': ['f', 'g', 'e'],
    'fhb': ['f', 'h', 'b'],
    'fhkd': ['f', 'h', 'k', 'd'],
    'fidlar': ['fiddler'],
    'fifteen': ['teen', '1', '5'],
    'fifty': ['fifty', '5', '0'],
    'fighter': ['fight'],
    'fighters': ['fight'],
    'fightin': ['fight'],
    'filler': ['fill'],
    'fillin': ['fill'],
    'fillip': ['philip'],
    'fillmore': ['fill', 'more'],
    'filthy': ['filth'],
    'finder': ['find'],
    'findin': ['find'],
    'findum': ['find', 'um'],
    'finest': ['fine'],
    'fingaz': ['finger'],
    'fingerpick': ['finger', 'pick'],
    'fingerpickin': ['finger', 'pick'],
    'fingerpicking': ['finger', 'pick'],
    'fingerprint': ['finger', 'print'],
    'fingerprints': ['finger', 'print'],
    'finishline': ['finish', 'line'],
    'finna': ['fix'],
    'fireball': ['fire', 'ball'],
    'fireballs': ['fire', 'ball'],
    'firebeatz': ['fire', 'beat'],
    'firebird': ['fire', 'bird'],
    'fireflies': ['fire', 'fly'],
    'firefly': ['fire', 'fly'],
    'firehouse': ['fire', 'house'],
    'firekid': ['fire', 'kid'],
    'firelight': ['fire', 'light'],
    'fireman': ['fire', 'man'],
    'firestarter': ['fire', 'start'],
    'firestone': ['fire', 'stone'],
    'firework': ['fire', 'work'],
    'fireworks': ['fire', 'work'],
    'fisher': ['fish'],
    'fisherman': ['fish', 'man'],
    'fishin': ['fish'],
    'fishscale': ['fish', 'scale'],
    'fishy': ['fish'],
    'fitter': ['fit'],
    'fittin': ['fit'],
    'fittingly': ['fit'],
    'fitz': ['fit'],
    'fitzgerald': ['fitz', 'gerald'],
    'fitzpleasure': ['fitz', 'pleasure'],
    'fitzsimmons': ['fit', 'simmon'],
    'five': ['5'],
    'fixer': ['fix'],
    'fixin': ['fix'],
    'fixx': ['fix'],
    'fiya': ['fire'],
    'fka': ['f', 'k', 'a'],
    'fki': ['f', 'k', 'i'],
    'fkj': ['f', 'k', 'j'],
    'fkl': ['f', 'k', 'l'],
    'flacko': ['flack'],
    'muggers': ['mug'],
    'mugger': ['mug'],
    'flaggin': ['flag'],
    'flagpole': ['flag', 'pole'],
    'flaky': ['flake'],
    'flamin': ['flame'],
    'flamingoes': ['flamingo'],
    'flamingosis': ['flamingo'],
    'flapper': ['flap'],
    'flappin': ['flap'],
    'flashback': ['flash', 'back'],
    'flashdance': ['flash', 'dance'],
    'flasher': ['flash'],
    'flashin': ['flash'],
    'flashlight': ['flash', 'light'],
    'flashmob': ['flash', 'mob'],
    'flashwind': ['flash', 'wind'],
    'flashy': ['flash'],
    'flatbed': ['flat', 'bed'],
    'flatbush': ['flat', 'bush'],
    'flatest': ['flat'],
    'flatfoot': ['flat', 'foot'],
    'flatland': ['flat', 'land'],
    'flatlands': ['flat', 'land'],
    'flatline': ['flat', 'line'],
    'flatliner': ['flat', 'line'],
    'flatt': ['flat'],
    'flatter': ['flat'],
    'flatts': ['flat'],
    'flava': ['flavor'],
    'flawless': ['flaw'],
    'fleetwood': ['fleet', 'wood'],
    'flexicution': ['flex'],
    'flexin': ['flex'],
    'flicka': ['flick'],
    'flicker': ['flick'],
    'flickin': ['flick'],
    'flies': ['fly'],
    'flightless': ['flight'],
    'flipmode': ['flip', 'mode'],
    'flippa': ['flip'],
    'flippin': ['flip'],
    'flippy': ['flip'],
    'floater': ['float'],
    'floatin': ['float'],
    'floaty': ['float'],
    'flobot': ['flow', 'bot'],
    'flocka': ['flock'],
    'flockin': ['flock'],
    'floozies': ['floozy'],
    'floppin': ['flop'],
    'floppy': ['flop'],
    'flosstradamus': ['floss'],
    'fluffer': ['fluff'],
    'fluffy': ['fluff'],
    'flughand': ['flug', 'hand'],
    'flyer': ['fly'],
    'flyers': ['fly'],
    'flyin': ['fly'],
    'flyleaf': ['fly', 'leaf'],
    'flynn': ['flyn'],
    'fm': ['f', 'm'],
    'fml': ['f', 'm', 'l'],
    'fmlyhm': ['f', 'm', 'l', 'y', 'h', 'm'],
    'fn': ['f', 'n'],
    'fnh': ['f', 'n', 'h'],
    'fnktrp': ['f', 'n', 'k', 't', 'r', 'p', 'funk', 'trap'],
    'fnn': ['f', 'n'],
    'fofo': ['fo'],
    'foggy': ['fog'],
    'foghat': ['fog', 'hat'],
    'fogotten': ['forget'],
    'foldin': ['fold'],
    'follower': ['follow'],
    'followin': ['follow'],
    'foolin': ['fool'],
    'foolish': ['fool'],
    'football': ['foot', 'ball'],
    'foothills': ['foot', 'hill'],
    'foothill': ['foot', 'hill'],
    'footloose': ['foot', 'loose'],
    'footnote': ['foot', 'note'],
    'footprint': ['foot', 'print'],
    'footprints': ['foot', 'print'],
    'forceful': ['force'],
    'foreigner': ['foreign'],
    'foreplay': ['fore', 'play'],
    'forestry': ['forest'],
    'foreva': ['for', 'ever'],
    'forever': ['for', 'ever'],
    'forgettin': ['forget'],
    'forgotten': ['forgot'],
    'formation': ['form'],
    'forrest': ['forest'],
    'forsaken': ['forsake'],
    'fortress': ['fort'],
    'forty': ['forty', '4', '0'],
    'founder': ['found'],
    'four': ['4'],
    'fourfiveseconds': ['four', 'five', 'second'],
    'fourteen': ['teen', '1', '4'],
    'foxey': ['fox'],
    'foxgluvv': ['fox', 'glove'],
    'foxxes': ['fox'],
    'foxx': ['fox'],
    'foxxx': ['fox'],
    'foxy': ['fox'],
    'foxygen': ['fox'],
    'fr': ['for'],
    'franc': ['frank'],
    'frankie': ['frank'],
    'frankmusik': ['frank', 'music'],
    'franky': ['frank'],
    'freakin': ['freak'],
    'freaky': ['freak'],
    'freddie': ['fred'],
    'freddy': ['fred'],
    'freebase': ['free', 'base'],
    'freebird': ['free', 'bird'],
    'freedom': ['free'],
    'freek': ['freak'],
    'freeload': ['free', 'load'],
    'freestyle': ['free', 'style'],
    'freeway': ['free', 'way'],
    'freezer': ['freeze'],
    'frenchie': ['french'],
    'frenchman': ['french', 'man'],
    'frenship': ['friend'],
    'frequences': ['frequency'],
    'freshman': ['fresh', 'man'],
    'freshmen': ['fresh', 'men'],
    'freshly': ['fresh'],
    'freshlyground': ['fresh', 'ground'],
    'friendly': ['friend'],
    'friendship': ['friend', 'ship'],
    'friendz': ['friend'],
    'friendzone': ['friend', 'zone'],
    'frighten': ['fright'],
    'frnd': ['friend'],
    'froggie': ['frog'],
    'froggy': ['frog'],
    'frontin': ['front'],
    'frontline': ['front', 'line'],
    'frosty': ['frost'],
    'froze': ['frozen'],
    'frozen': ['froze'],
    'fruitcake': ['fruit', 'cake'],
    'fruitti': ['fruit'],
    'ftse': ['f', 't', 's', 'e'],
    'fu': ['f', 'u'],
    'fubu': ['f', 'u', 'b'],
    'fucker': ['fuck'],
    'fuckin': ['fuck'],
    'fuckthepopulation': ['fuck', 'the', 'population'],
    'fuckum': ['fuck', 'um'],
    'fuckwitmeuknowigotit': ['fuck', 'with', 'me', 'u', 'know', 'i', 'got', 'it'],
    'fukem': ['fuck', 'them'],
    'fulla': ['full'],
    'fullback': ['full', 'back'],
    'functional': ['function'],
    'funhouse': ['fun', 'house'],
    'funkadelic': ['funk'],
    'funkdaddydre': ['funk', 'dad', 'dre'],
    'funkist': ['fun'],
    'funky': ['funk'],
    'funkytown': ['funk', 'town'],
    'funtime': ['fun', 'time'],
    'furry': ['fur'],
    'futuresex': ['future', 'sex'],
    'futurist': ['future'],
    'futuristiic': ['future'],
    'fux': ['fuck'],
    'fuze': ['fuse'],
    'fvcked': ['fuck'],
    'fvlcrvm': ['f', 'v', 'l', 'c', 'r', 'm'],
    'fvmeless': ['fame', 'fume'],
    'fvneral': ['funeral'],
    'fweaky': ['freak'],
    'fwm': ['f', 'w', 'm'],
    'fx': ['f', 'x'],
    'fxxk': ['fuck'],
    'fybr': ['f', 'y', 'b', 'r'],
    'fyfe': ['fife'],
    'fyi': ['f', 'y', 'I'],
    'fym': ['f', 'y', 'm'],
    'fyn': ['f', 'y ', 'n'],
    'fyne': ['fine'],
    'fz': ['f', 'z'],
    'fzv': ['f', 'z', 'v'],
    'g2g': ['g', '2'],
    'g6': ['g', '6'],
    'gambler': ['gamble'],
    'gamblin': ['gamble'],
    'gameboy': ['game', 'boy'],
    'gamecock': ['game', 'cock'],
    'gameface': ['game', 'face'],
    'gamer': ['game'],
    'gameshow': ['game', 'show'],
    'gamez': ['game'],
    'gamin': ['game'],
    'gangbangin': ['gang', 'bang'],
    'gangland': ['gang', 'land'],
    'gangsta': ['gang'],
    'gangster': ['gang'],
    'gardener': ['garden'],
    'gasoline': ['gas'],
    'gatekeeper': ['gate', 'keep'],
    'gateway': ['gate', 'way'],
    'gawvi': ['g', 'a', 'w', 'v', 'I'],
    'gaye': ['gay'],
    'gba': ['g', 'b', 'a'],
    'gbhtyr': ['g', 'b', 'h', 't', 'y', 'r'],
    'gbkw': ['g', 'b', 'k', 'w'],
    'gc': ['g', 'c'],
    'gcf': ['g', 'c', 'f'],
    'gcm': ['g', 'c', 'm'],
    'gcusi': ['g', 'c ', 'u', 's', 'I'],
    'gd': ['g', 'd'],
    'gdfr': ['g', 'd', 'f', 'r'],
    'gdp': ['g', 'd', 'p'],
    'gearbox': ['gear', 'box'],
    'geekin': ['geek'],
    'gees': ['gee'],
    'geffery': ['jeff'],
    'genasis': ['genesis'],
    'generational': ['generation'],
    'gentleman': ['gentleman'],
    'gentlemen': ['gentle', 'men'],
    'gently': ['gentle'],
    'georgie': ['george'],
    'georgy': ['george'],
    'german': ['germany'],
    'getaway': ['get', 'away'],
    'geto': ['ghetto'],
    'gets': ['get'],
    'getset': ['get', 'set'],
    'gett': ['get'],
    'getta': ['get'],
    'getter': ['get'],
    'gettin': ['get'],
    'getto': ['ghetto'],
    'gfc': ['g', 'f', 'c'],
    'gfmbryyce': ['g', 'f', 'm', 'b', 'r', 'y', 'c', 'e'],
    'lxcpr': ['l', 'x', 'c', 'p', 'r'],
    'gfriend': ['g', 'friend'],
    'gfy': ['g', 'f', 'y'],
    'gg': ['g'],
    'ggoolldd': ['g', 'o', 'l', 'd', 'gold'],
    'ghettosocks': ['ghetto', 'sock'],
    'ghostbuster': ['ghost', 'bust'],
    'ghostemane': ['ghost', 'man'],
    'ghostface': ['ghost', 'face'],
    'ghostland': ['ghost', 'land'],
    'ghostly': ['ghost'],
    'ghosttown': ['ghost', 'town'],
    'ghostwrite': ['ghost', 'write'],
    'ghostwriter': ['ghost', 'write'],
    'gigamesh': ['gig', 'mesh'],
    'gimme': ['gimmie'],
    'gingerbread': ['ginger', 'bread'],
    'gingerlys': ['ginger'],
    'giraffage': ['giraffe'],
    'giriboy': ['giri', 'boy'],
    'girlfight': ['girl', 'fight'],
    'girlfriend': ['girl', 'friend'],
    'girlpool': ['girl', 'pool'],
    'girly': ['girl'],
    'girlz': ['girl'],
    'git': ['get'],
    'given': ['give'],
    'giver': ['give'],
    'givin': ['give'],
    'gk': ['g', 'k'],
    'gkkm': ['g', 'k', 'm'],
    'gkr': ['g', 'k', 'r'],
    'glamorous': ['glam'],
    'glasshouse': ['glass', 'house'],
    'glassware': ['glass', 'ware'],
    'glc': ['g', 'l', 'c'],
    'glenn': ['glen'],
    'glitta': ['glitter'],
    'glitterbomb': ['glitter', 'bomb'],
    'glitterbug': ['glitter', 'bug'],
    'glittery': ['glitter'],
    'glo': ['glow'],
    'gloomy': ['gloom'],
    'glowin': ['go'],
    'glowinthedark': ['glow', 'in', 'the', 'dark'],
    'gluestick': ['glue', 'stick'],
    'gmebe': ['g', 'm', 'e', 'b'],
    'gmo': ['g', 'm', 'o'],
    'gmwa': ['g', 'm', 'w', 'a'],
    'Godawful': ['god', 'awful'],
    'goddam': ['god', 'damn'],
    'goddamn': ['god', 'damn'],
    'goddaughter': ['god', 'daughter'],
    'goddess': ['god'],
    'godfather': ['god', 'father'],
    'godly': ['god'],
    'godmanchester': ['god', 'manchester'],
    'godmother': ['god', 'mother'],
    'godsmack': ['god', 'smack'],
    'godson': ['god', 'son'],
    'godspeed': ['god', 'speed'],
    'godzilla': ['god', 'zilla'],
    'goer': ['go'],
    'goin': ['go'],
    'goldchain': ['gold', 'chain'],
    'golddigger': ['gold', 'dig'],
    'golden': ['gold'],
    'goldeneye': ['gold', 'eye'],
    'goldenninjah': ['gold', 'ninja'],
    'goldfinger': ['gold', 'finger'],
    'goldfish': ['gold', 'fish'],
    'goldfrapp': ['gold', 'frap'],
    'goldheart': ['gold', 'heart'],
    'goldie': ['gold'],
    'goldlink': ['gold', 'link'],
    'goldmine': ['gold', 'mine'],
    'goldmund': ['gold', 'mund'],
    'goldroom': ['gold', 'room'],
    'goldsoul': ['gold', 'soul'],
    'goldspot': ['gold', 'spot'],
    'goldtone': ['gold', 'tone'],
    'goldwash': ['gold', 'wash'],
    'golfer': ['golf'],
    'gomd': ['g', 'o', 'm', 'd'],
    'gon': ['gonna'],
    'goodbye': ['good', 'bye'],
    'goode': ['good'],
    'goodfoot': ['good', 'foot'],
    'goodie': ['good'],
    'goodness': ['good'],
    'goodnight': ['good', 'night'],
    'goodpain': ['good', 'pain'],
    'goody': ['good'],
    'goodz': ['good'],
    'gooey': ['goo'],
    'goofball': ['goof', 'ball'],
    'goofy': ['goof'],
    'goonies': ['goon'],
    'goosebump': ['goose', 'bump'],
    'gorillaz': ['gorilla'],
    'gotdamn': ['got', 'damn'],
    'gots': ['got'],
    'gotta': ['got'],
    'govt': ['government'],
    'goyard': ['go', 'yard'],
    'gps': ['g', 'p', 's'],
    'gp': ['g', 'p'],
    'gq': ['g', 'q'],
    'graceful': ['grace'],
    'gracefully': ['grace'],
    'graceland': ['grace', 'land'],
    'graddad': ['grand', 'dad'],
    'grammar': ['grammer'],
    'grandad': ['grand', 'dad'],
    'grandaddy': ['grand', 'dad'],
    'grandaughter': ['grand', 'daughter'],
    'granddaddy': ['grand', 'dad'],
    'grandfather': ['grand', 'father'],
    'grandkid': ['grand', 'kid'],
    'grandkids': ['grand', 'kid'],
    'grandma': ['grand', 'ma'],
    'grandmaster': ['grand', 'master'],
    'grandmother': ['grand', 'mother'],
    'grandpa': ['grand', 'pa'],
    'grandson': ['grand', 'son'],
    'grandview': ['grand', 'view'],
    'grapefruit': ['grape', 'fruit'],
    'grapevine': ['grape', 'vine'],
    'graveclothes': ['grave', 'clothes'],
    'graveyard': ['grave', 'yard'],
    'gravez': ['grave'],
    'greater': ['great'],
    'greatest': ['great'],
    'greatness': ['great'],
    'greedy': ['greed'],
    'greenbaum': ['green', 'baum'],
    'greene': ['green'],
    'greener': ['green'],
    'greenest': ['green'],
    'greenfield': ['green', 'field'],
    'greenlight': ['green', 'light'],
    'greenline': ['green', 'line'],
    'greensboro': ['green', 'boro'],
    'greenstein': ['green', 'stein'],
    'greenville': ['green'],
    'greenvilletown': ['green', 'town'],
    'greenwood': ['green', 'wood'],
    'greeny': ['green'],
    'gregory': ['greg'],
    'grey': ['gray'],
    'grillz': ['grill'],
    'grimm': ['grim'],
    'grimmest': ['grimy'],
    'grimmie': ['grimy'],
    'grinder': ['grind'],
    'grindin': ['grind'],
    'Grinin': ['grin'],
    'gritty': ['grit'],
    'grizfolk': ['grizzly', 'folk'],
    'grizzley': ['griz'],
    'grizzly': ['griz'],
    'grl': ['g', 'r', 'l', 'girl'],
    'groanin': ['groan'],
    'groovin': ['groove'],
    'groovy': ['groove'],
    'groundbreaking': ['ground', 'break'],
    'groundhog': ['ground', 'hog'],
    'grouplove': ['group', 'love'],
    'grower': ['grow'],
    'growin': ['grow'],
    'grrrls': ['girl'],
    'gryffin': ['griffin'],
    'gs': ['g', 's'],
    'gta': ['g', 't', 'a'],
    'gto': ['g', 't', 'o'],
    'guapo': ['guap'],
    'guardian': ['guard'],
    'guardin': ['guard'],
    'gud': ['good'],
    'guerilla': ['gorilla'],
    'guessin': ['guess'],
    'guilty': ['guilt'],
    'guitarmuort': ['guitar', 'muort'],
    'gunfight': ['gun', 'fight'],
    'gunfighter': ['gun', 'fight'],
    'gunfire': ['gun', 'fire'],
    'gunman': ['gun', 'man'],
    'gunna': ['gun'],
    'gunner': ['gun'],
    'gunnin': ['gun'],
    'gunplay': ['gun', 'play'],
    'gunpowder': ['gun', 'powder'],
    'gunshot': ['gun', 'shot'],
    'gunslinger': ['gun', 'sling'],
    'gunwalk': ['gun', 'walk'],
    'gunz': ['gun'],
    'guordon': ['gordon'],
    'gurl': ['girl'],
    'guster': ['gust'],
    'gutterflower': ['gutter', 'flower'],
    'guvnah': ['governor'],
    'gv': ['g', 'v'],
    'gvng': ['gang'],
    'gx': ['g', 'x'],
    'gxdfather': ['god', 'father'],
    'gxmes': ['game'],
    'gxnxvs': ['g', 'x', 'n', 'v', 's'],
    'gyalchester': ['gyal', 'chester'],
    'gza': ['g', 'z', 'a'],
    'H2o': ['h', '2 o'],
    'haan808': ['haan', '8', '0'],
    'habitz': ['habit'],
    'hacker': ['hack'],
    'hackin': ['hack'],
    'haile': ['hailee'],
    'hailey': ['hailee'],
    'haircut': ['hair', 'cut'],
    'hairy': ['hair'],
    'halestorm': ['hale', 'storm'],
    'halftime': ['half', 'time'],
    'halfway': ['half', 'way'],
    'halves': ['half'],
    'hammersmith': ['hammer', 'smith'],
    'handclap': ['hand', 'clap'],
    'handcuff': ['hand', 'cuff'],
    'handed': ['hand'],
    'handmade': ['hand', 'made'],
    'handshake': ['hand', 'shake'],
    'handwritten': ['hand', 'written'],
    'handzum': ['handsome'],
    'hanger': ['hang'],
    'hangin': ['hang'],
    'hanginaround': ['hang', 'round'],
    'hangman': ['hang', 'man'],
    'hangover': ['hang', 'over'],
    'hanky': ['hank'],
    'happenin': ['happen'],
    'happier': ['happy'],
    'happiest': ['happy'],
    'happiness': ['happy'],
    'happysad': ['happy', 'sad'],
    'harbour': ['harbor'],
    'hardaway': ['hard', 'way'],
    'hardcore': ['hard', 'core'],
    'harden': ['hard'],
    'harder': ['hard'],
    'hardest': ['hard'],
    'hardly': ['hard'],
    'hardway': ['hard', 'way'],
    'hardwell': ['hard', 'well'],
    'hardwire': ['hard', 'wire'],
    'harmaleigh': ['harma', 'leigh'],
    'hart': ['heart'],
    'harvester': ['harvest'],
    'harveston': ['harvest'],
    'hatemail': ['hate', 'mail'],
    'hater': ['hate'],
    'hatin': ['hate'],
    'hatter': ['hat'],
    'havent': ['have'],
    'havin': ['have'],
    'hawaiian': ['hawaii'],
    'hawke': ['hawk'],
    'hawkin': ['hawk'],
    'hawkins': ['hawk'],
    'hawkwind': ['hawk', 'wind'],
    'hawthorne': ['hawthorn'],
    'hayes': ['hay'],
    'hayling': ['hay'],
    'haystack': ['hay', 'stack'],
    'haystak': ['hay', 'stack'],
    'haywyre': ['hay', 'wire'],
    'kin$oul': ['kin', 'soul'],
    'hazelnut': ['hazel', 'nut'],
    'hazey': ['haze'],
    'hazy': ['haze'],
    'hbhg': ['h', 'b', 'g'],
    'hbk': ['h', 'b', 'k'],
    'hbns': ['h', 'b', 'n', 's'],
    'hbo': ['h', 'b', 'o'],
    'hc': ['h', 'c'],
    'hcb': ['h', 'c', 'b'],
    'hcp': ['h', 'c', 'p'],
    'hd': ['h', 'd'],
    'hdbeendope': ['h', 'd', 'been', 'dope'],
    'headband': ['head', 'band'],
    'headbussaz': ['head', 'bust'],
    'headfirst': ['head', 'first'],
    'headhunters': ['head', 'hunt'],
    'headhunter': ['head', 'hunt'],
    'headhunterz': ['head', 'hunt'],
    'headin': ['head'],
    'headlight': ['head', 'light'],
    'headlights': ['head', 'light'],
    'headline': ['head', 'line'],
    'headlong': ['head', 'long'],
    'headphone': ['head', 'phone'],
    'headphones': ['head', 'phone'],
    'headrest': ['head', 'rest'],
    'headstrong': ['head', 'strong'],
    'heady': ['head'],
    'healer': ['heal'],
    'healin': ['heal'],
    'hearin': ['hear'],
    'heartache': ['heart', 'ache'],
    'heartattack': ['heart', 'attack'],
    'heartbeat': ['heart', 'beat'],
    'heartbreak': ['heart', 'break'],
    'heartbreakers': ['heart', 'break'],
    'heartbreaker': ['heart', 'break'],
    'heartland': ['heart', 'land'],
    'heartless': ['heart'],
    'heartsong': ['heart', 'song'],
    'heartlight': ['heart', 'light'],
    'heartline': ['heart', 'line'],
    'heartthrob': ['heart', 'throb'],
    'heartz': ['heart'],
    'heater': ['heat'],
    'heatin': ['heat'],
    'heatseeker': ['heat', 'seek'],
    'heatstroke': ['heat', 'stroke'],
    'heatwave': ['heat', 'wave'],
    'heavenly': ['heaven'],
    'heavydirtysoul': ['heavy', 'dirt', 'soul'],
    'heavyweight': ['heavy', 'weight'],
    'heiress': ['heir'],
    'hella': ['hell'],
    'hellboy': ['hell', 'boy'],
    'hellogoodbye': ['hello', 'good', 'bye'],
    'hellyeah': ['hell', 'yeah'],
    'helper': ['help'],
    'helpin': ['help'],
    'helpless': ['help'],
    'helplessly': ['help'],
    'helpline': ['help', 'line'],
    'hendryx': ['hendrix'],
    'herbie': ['herb'],
    'herbo': ['herb'],
    'here2a': ['here', '2', 'a'],
    'hermitude': ['hermit'],
    'heroes': ['hero'],
    'herself': ['her', 'self'],
    'herside': ['her', 'side'],
    'hexagram': ['hexa', 'gram'],
    'heydaze': ['hey', 'daze'],
    'hfgw': ['h', 'f', 'g', 'w'],
    'hfh': ['h', 'f'],
    'hfm': ['h', 'f', 'm'],
    'hg': ['h', 'g'],
    'hhhhhere': ['h', 'here'],
    'hhms': ['h', 'm', 's'],
    'hhooppee': ['hope'],
    'hhyy': ['h', 'y'],
    'hiccups': ['hicc', 'up'],
    'hicktown': ['hick', 'town'],
    'hideaway': ['hide', 'away'],
    'hider': ['hide'],
    'hidin': ['hide'],
    'higher': ['high'],
    'highest': ['high'],
    'highland': ['high', 'land'],
    'highlight': ['high', 'light'],
    'highlighter': ['high', 'light'],
    'highlite': ['high', 'light'],
    'highly': ['high'],
    'highness': ['high'],
    'highway': ['high', 'way'],
    'highwayman': ['high', 'way', 'man'],
    'highwaymen': ['high', 'way', 'men'],
    'hii': ['high', 'hi'],
    'hiiijack': ['high', 'hi', 'jack'],
    'hiiipower': ['high', 'power'],
    'hiit': ['hit'],
    'hilfigerrr': ['hilfiger'],
    'hillbillies': ['hill', 'bill'],
    'hillbilly': ['hill', 'bill'],
    'hillside': ['hill', 'side'],
    'hillsong': ['hill', 'song'],
    'hilltop': ['hill', 'top'],
    'hilly': ['hill'],
    'himself': ['him', 'self'],
    'hindsight': ['hind', 'sight'],
    'hisses': ['hiss'],
    'hissin': ['hiss'],
    'historian': ['history'],
    'historical': ['history'],
    'historically': ['history'],
    'hitchhike': ['hitch', 'hike'],
    'hitchhiker': ['hitch', 'hike'],
    'hitchin': ['hitch'],
    'hitimpulse': ['hit', 'impulse'],
    'hitlist': ['hit', 'list'],
    'hitsville': ['hit'],
    'hitta': ['hit'],
    'hitter': ['hit'],
    'hittin': ['hit'],
    'hittman': ['hit', 'man'],
    'hjb': ['h', 'j', 'b'],
    'hk': ['h', 'k'],
    'hkfiftyone': ['h', 'k', 'fifty', '5', '1'],
    'hklmr': ['h', 'k', 'l', 'm', 'r'],
    'hlttnl': ['h', 'l', 't', 'n'],
    'hmu': ['h', 'm', 'u'],
    'hndrxx': ['hendrix'],
    'hnic': ['h', 'n', 'I', 'c'],
    'hnny': ['h', 'n', 'y'],
    'hoedown': ['hoe', 'down'],
    'hoez': ['hoe'],
    'hogg': ['hog'],
    'hol': ['hold'],
    'holdin': ['hold'],
    'holdup': ['hold', 'up'],
    'holidae': ['holiday'],
    'holier': ['holy'],
    'holiest': ['holy'],
    'hollaback': ['holler', 'back'],
    'holliday': ['holiday'],
    'hollie': ['holly'],
    'hollies': ['holly'],
    'hollowpoint': ['hollow', 'point'],
    'hollyann': ['holly', 'ann'],
    'hollyhood': ['holly', 'hood'],
    'hollywood': ['holly', 'wood'],
    'holocene': ['holo'],
    'holyana': ['holy', 'ana'],
    'holychild': ['holy', 'child'],
    'homeboy': ['home', 'boy'],
    'homebwoi': ['home', 'boy'],
    'homecoming': ['home', 'come'],
    'homegirl': ['home', 'girl'],
    'homegrown': ['home', 'grown'],
    'homeless': ['home'],
    'homely': ['home'],
    'homemade': ['home', 'made'],
    'homesick': ['home', 'sick'],
    'homestead': ['home', 'stead'],
    'hometown': ['home', 'town'],
    'homeward': ['home', 'ward'],
    'homework': ['home', 'work'],
    'homewrecker': ['home', 'wreck'],
    'homme': ['home'],
    'honesty': ['honest'],
    'honeybear': ['honey', 'bear'],
    'honeydripper': ['honey', 'drip'],
    'honeymoon': ['honey', 'moon'],
    'honeymooner': ['honey', 'moon'],
    'honeysuckle': ['honey', 'suck'],
    'honkey': ['honk'],
    'honky': ['honk'],
    'honkytonk': ['honky', 'tonk'],
    'hoobastank': ['hooba', 'stank'],
    'hoochie': ['hooch'],
    'hoodie': ['hood'],
    'hoodstar': ['hood', 'star'],
    'hoodrich': ['hood', 'rich'],
    'hoodrat': ['hood', 'rat'],
    'hoodlum': ['hood'],
    'hooker': ['hook'],
    'hookin': ['hook'],
    'hopper': ['hop'],
    'hookup': ['hook', 'up'],
    'hookworm': ['hook', 'worm'],
    'hootie': ['hoot'],
    'hooty': ['hoot'],
    'hopin': ['hope'],
    'hopsin': ['hop', 'sin'],
    'horne': ['horn'],
    'horny': ['horn'],
    'horrorcore': ['horror', 'core'],
    'horsehead': ['horse', 'head'],
    'horseman': ['horse', 'man'],
    'horsemen': ['horse', 'men'],
    'horseshit': ['horse', 'shit'],
    'hos': ['hoe'],
    'hot2touch': ['hot', '2', 'touch'],
    'hotline': ['hot', 'line'],
    'hotrod': ['hot', 'rod'],
    'hotstepper': ['hot', 'step'],
    'hottie': ['hot'],
    'hotty': ['hot'],
    'hotwax': ['hot', 'wax'],
    'houndmouth': ['hound', 'mouth'],
    'houndstooth': ['hound', 'tooth'],
    'hourglass': ['hour', 'glass'],
    'housebroken': ['house', 'broke'],
    'housequake': ['house', 'quake'],
    'housewife': ['house', 'wife'],
    'howler': ['howl'],
    'howlin': ['howl'],
    'hows': ['how'],
    'hp': ['h', 'p'],
    'hq': ['h', 'q'],
    'hq454': ['h', 'q', '4', '5'],
    'hrmny': ['harmony'],
    'hrs': ['h', 'r', 's', 'hour'],
    'hrvrd': ['h', 'r', 'v', 'd'],
    'hrvy': ['h', 'r', 'v', 'y', 'harvey'],
    'hs87': ['h', 's', '8', '7'],
    'hskt': ['h', 's', 'k', 't'],
    'hsptl': ['h', 's', 'p', 't', 'l', 'hospital'],
    'hthaze': ['h', 't', 'haze'],
    'html': ['h', 't', 'm', 'l'],
    'htmlflowers': ['h', 't', 'm', 'l', 'flower'],
    'httr': ['h', 't', 'r'],
    'huckster': ['huck'],
    'humanz': ['human'],
    'humbug': ['hum', 'bug'],
    'hummer': ['hum'],
    'hummin': ['hum'],
    'hummingbird': ['hum', 'bird'],
    'humpty': ['hump'],
    'hundredth': ['hundred'],
    'hundredz': ['hundred'],
    'hunnid': ['hundred'],
    'hunny': ['honey'],
    'hunter': ['hunt'],
    'huntin': ['hunt'],
    'huntress': ['hunt'],
    'hurtin': ['hurt'],
    'husky': ['husk'],
    'hussle': ['hustle'],
    'hustla': ['hustle'],
    'hustlaz': ['hustle'],
    'hustler': ['hustle'],
    'hustlin': ['hustle'],
    'hvnnibvl': ['hannibal'],
    'hvy': ['h', 'v', 'y'],
    'hwy': ['high', 'way'],
    'hxlt': ['h', 'x', 'l', 't', 'halt'],
    'hxly': ['holy'],
    'hxv': ['h', 'x', 'v'],
    'hyd': ['h', 'y', 'd', 'hyde'],
    'hydro': ['dro'],
    'hydroplane': ['hydro', 'plane'],
    'hydroplaning': ['hydro', 'plane'],
    'hyfr': ['h', 'y', 'f', 'r'],
    'hyperparadise': ['hyper', 'paradise'],
    'hz': ['h', 'z'],
    'i20': ['i', '2 0 twenty'],
    'iain': ['ian'],
    'iam': ['I', 'am'],
    'iamamiwhoami': ['i', 'am', 'who'],
    'iamanthem': ['I', 'am', 'anthem'],
    'sammydextermaxo': ['sam', 'dexter', 'maxo'],
    'iamchino': ['I', 'am', 'chino'],
    'iamsu': ['i', 'am', 'su'],
    'ibetigotsumweed': ['i', 'bet', 'got', 'some', 'weed'],
    'icanteven': ['I', 'cant', 'even'],
    '#icanteven': ['I', 'cant', 'even'],
    'iceberg': ['ice', 'berg'],
    'iceburg': ['ice', 'berg'],
    'icona': ['icon'],
    'iconic': ['icon'],
    'icy': ['ice'],
    'id': ['i'],
    'idealism': ['ideal'],
    'idfc': ['i', 'd', 'f', 'c'],
    'idgaf': ['I', 'd', 'g', 'a', 'f'],
    'idk': ['I', 'd', 'k'],
    'idkanymore': ['I', 'd', 'k', 'any', 'more'],
    'idlewild': ['idle', 'wild'],
    'idolize': ['idol'],
    'ied': ['I', 'e', 'd'],
    'ieyiyi': ['yi'],
    'unthinkable': ['think'],
    'ifhy': ['I', 'f', 'h', 'y'],
    'iglooghost': ['igloo', 'ghost'],
    'ihate': ['I', 'hate'],
    'ihatefreco': ['I', 'hate', 'freco'],
    'ihop': ['I', 'hop'],
    'iji': ['i', 'j'],
    'illdude': ['ill', 'dude'],
    'illenium': ['ill'],
    'illiam': ['ill', 'I', 'am'],
    'illmatic': ['ill'],
    'illusionist': ['illusion'],
    'illy': ['ill'],
    'ilovemakonnen': ['i', 'love', 'makonnen'],
    'Ilovememphis': ['i', 'love', 'memphis'],
    'ily2': ['I', 'l', 'y', '2'],
    'ilysb': ['I', 'l', 'y', 's', 'b'],
    'im': ['i'],
    'ima': ['im', 'a'],
    'imagination': ['imagine'],
    'immersion': ['immerse'],
    'immortal': ['mortal'],
    'immortality': ['immortal'],
    'immortalized': ['immortal'],
    'imo': ['I', 'm', 'o'],
    'imperfect': ['perfect'],
    'imperfection': ['imperfect'],
    'importance': ['important'],
    'impossible': ['possible'],
    'impression': ['impress'],
    'inaudible': ['audible'],
    'incapable': ['capable'],
    'inchin': ['inch'],
    'incomplete': ['complete'],
    'incorporated': ['inc'],
    'indeed': ['in', 'deed'],
    'indestructable': ['destruct'],
    'indifference': ['indifferent'],
    'indoor': ['in', 'door'],
    'infared': ['red'],
    'information': ['info'],
    'informer': ['inform'],
    'inhaler': ['inhale'],
    'inlaw': ['in', 'law'],
    'innerspeaker': ['inner', 'speak'],
    'innervision': ['inner', 'vision'],
    'inoj': ['i', 'n', 'o', 'j'],
    'insecure': ['secure'],
    'insecurity': ['security'],
    'inside': ['in', 'side'],
    'insideout': ['inside', 'out'],
    'insomniak': ['insomniac'],
    'instagram': ['insta', 'gram'],
    'instantly': ['instant'],
    'institutionalized': ['institution'],
    'intentionally': ['intent'],
    'intentions': ['intent'],
    'interceptor': ['intercept'],
    'intercourse': ['inter', 'course'],
    'interruption': ['interrupt'],
    'intersectional': ['inter', 'section'],
    'interstellar': ['inter', 'stellar'],
    'intl': ['international'],
    'into': ['in', 'to'],
    'introduce': ['intro'],
    'introduction': ['intro'],
    'introversion': ['intro', 'version'],
    'introvert': ['intro', 'vert'],
    'invada': ['invade'],
    'invader': ['invade'],
    'invert': ['vert'],
    'investment': ['invest'],
    'invisible': ['visible'],
    'inxs': ['i', 'n', 'if (word  === ', 's'],
    'inzombia': ['zombie'],
    'ioio': ['I', 'o'],
    'ionize': ['ion'],
    'iou': ['I', 'o', 'u'],
    'ipad': ['i', 'pad'],
    'iplayyoulisten': ['I', 'play', 'you', 'listen'],
    'ipod': ['i', 'pod'],
    'iq': ['I', 'q'],
    'irreplaceable': ['replace'],
    'irresistible': ['resist'],
    'irun': ['I', 'run'],
    'isak': ['issac'],
    'islander': ['island'],
    'isnt': ['is'],
    'ispy': ['i', 'spy'],
    'issak': ['issac'],
    'italian': ['italy'],
    'italiano': ['italian'],
    'itchin': ['itch'],
    'iti': ['it'],
    'itll': ['it'],
    'its': ['it'],
    'itself': ['it', 'self'],
    'itsoktocry': ['it', 'ok', 'to', 'cry'],
    'itsthereal': ['it', 'real'],
    'itz': ['it'],
    'iv': ['4', 'i', 'v'],
    'ive': ['i'],
    'iwantdat': ['I', 'want', 'that'],
    'iwar': ['I', 'w', 'a', 'r'],
    'ixc999': ['I', 'x', 'c', '9'],
    'iyiyi': ['yi'],
    'jaci': ['jackie'],
    'jacka': ['jack'],
    'jackboy': ['jack', 'boy'],
    'jackpot': ['jack', 'pot'],
    'jacker': ['jack'],
    'jackie': ['jack'],
    'jackin': ['jack'],
    'jacksonville': ['jackson', 'ville'],
    'jacky': ['jack'],
    'jacquiee': ['jackie'],
    'jadakiss': ['jada', 'kiss'],
    'jaded': ['jade'],
    'jai': ['jay'],
    'jailbait': ['jail', 'bait'],
    'jailbreak': ['jail', 'break'],
    'jailer': ['jail'],
    'jailhouse': ['jail', 'house'],
    'jame$': ['james'],
    'jamestown': ['james', 'town'],
    'jamey': ['jamie'],
    'jamlock': ['jam', 'lock'],
    'jammer': ['jam'],
    'jammin': ['jam'],
    'jamrock': ['jam', 'rock'],
    'jamz': ['jam'],
    'japandroid': ['japan', 'droid'],
    'japanese': ['japan'],
    'jared': ['jarred'],
    'jarrod': ['jarred'],
    'jarryd': ['jarred'],
    'jawbone': ['jaw', 'bone'],
    'jawbreaker': ['jaw', 'break'],
    'jawin': ['jaw'],
    'jawline': ['jaw', 'line'],
    'jawster': ['jaw'],
    'jaxx': ['jack'],
    'jay2': ['jay', '2'],
    'jaychef': ['jay', 'chef'],
    'jayhawk': ['jay', 'hawk'],
    'jaymes': ['james'],
    'jazmine': ['jasmine'],
    'jazzchain': ['jazz', 'chain'],
    'jazze': ['jazz'],
    'jazzinuf': ['jazz', 'enough'],
    'jazzy': ['jazz'],
    'jbj': ['j', 'b'],
    'jbs': ['j', 'b', 's'],
    'jc': ['j', 'c'],
    'jd': ['j', 'd'],
    'jdnt': ['j', 'd', 'n', 't'],
    'jealousy': ['jealous'],
    'ject': ['project'],
    'jefferson': ['jeff'],
    'jeffrey': ['jeff'],
    'jehnny': ['jenny'],
    'jellybelly': ['jelly', 'belly'],
    'jellyfish': ['jelly', 'fish'],
    'jellyroll': ['jelly', 'roll'],
    'jesse': ['jessie'],
    'jetpack': ['jet', 'pack'],
    'jetset': ['jet', 'set'],
    'jewelz': ['jewel'],
    'jfa': ['j', 'f', 'a'],
    'jfk': ['j', 'f', 'k'],
    'jg': ['j', 'g'],
    'jgivens': ['j', 'givens'],
    'jhn': ['john'],
    'jigsaw': ['jig', 'saw'],
    'jimi': ['jim'],
    'jimmy': ['jim'],
    'jj': ['j'],
    'jk': ['j', 'k'],
    'jkl': ['j', 'k', 'l'],
    'jkyl': ['j', 'k', 'y', 'l', 'jeckyl'],
    'jl': ['j', 'l'],
    'jls': ['j', 'l', 's'],
    'jmsn': ['j', 'm', 's', 'n'],
    'jne': ['j', 'n', 'e'],
    'jnthn': ['john'],
    'jnyr': ['j', 'n', 'y', 'r'],
    'jo': ['joe'],
    'jodye': ['jody'],
    'joell': ['joel'],
    'joey': ['joey'],
    'johnathan': ['john'],
    'johnk': ['john', 'k'],
    'johnny': ['john'],
    'johnnyswim': ['john', 'swim'],
    'joi': ['joy'],
    'jojo': ['joe'],
    'joka': ['joke'],
    'joker': ['joke'],
    'jokerman': ['joke', 'man'],
    'jokester': ['joke'],
    'jokin': ['joke'],
    'jon': ['john'],
    'jonez': ['jones'],
    'joshua': ['josh'],
    'journeyman': ['journey'],
    'joyfunk': ['joy', 'funk'],
    'joyride': ['joy', 'ride'],
    'joytime': ['joy', 'time'],
    'joywave': ['joy', 'wave'],
    'jp': ['j', 'p'],
    'jq': ['j', 'q'],
    'jr': ['junior'],
    'jry': ['j', 'r', 'y'],
    'js': ['j', 's'],
    'jsan': ['j', 's', 'a', 'n'],
    'jt': ['j', 't'],
    'juelz': ['jewel'],
    'jugghouse': ['jugg', 'house'],
    'juiceman': ['juice', 'man'],
    'juicy': ['juice'],
    'jukebox': ['juke', 'box'],
    'jukin': ['juke'],
    'jumper': ['jump'],
    'jumpin': ['jump'],
    'jumpman': ['jump', 'man'],
    'jumpsuit': ['jump', 'suit'],
    'jumpz': ['jump'],
    'junkie': ['junk'],
    'junky': ['junk'],
    'junkyard': ['junk', 'yard'],
    'justboy': ['just', 'boy'],
    'justified': ['justify'],
    'justlikemypiss': ['just', 'like', 'my', 'piss'],
    'jvck': ['jack'],
    'jvst': ['just'],
    'jvzel': ['j', 'v', 'z', 'e', 'l'],
    'jw': ['j', 'w'],
    'jxl': ['j', 'x', 'l'],
    'jxmmi': ['jim'],
    'jywrrn': ['j', 'y', 'w', 'r', 'n'],
    'jyye': ['j', 'y', 'e'],
    'jz': ['j'],
    'jzac': ['j', 'z', 'a', 'c'],
    'k2': ['k', '2'],
    'kaleidoscope': ['scope'],
    'kaliko': ['calicoe'],
    'kandi': ['candy'],
    'kane': ['cane'],
    'kap': ['cap'],
    'kaptn': ['captain'],
    'kardinal': ['cardinal'],
    'kari': ['carrie'],
    'kartel': ['cartel'],
    'kat': ['cat'],
    'katherine': ['catherine'],
    'katie': ['katy'],
    'kb': ['k', 'b'],
    'kc': ['k', 'c'],
    'kci': ['k', 'c'],
    'kcu': ['k', 'c', 'u'],
    'kd': ['k', 'd'],
    'kdrew': ['k', 'drew'],
    'kdv': ['k', 'd', 'v'],
    'ke$ha': ['kesha'],
    'keeper': ['keep'],
    'keepin': ['keep'],
    'blackbagla': ['black', 'bag', 'la'],
    'unotheactivist': ['uno', 'the', 'activist'],
    'keepsake': ['keep', 'sake'],
    'kelley': ['kelly'],
    'kellie': ['kelly'],
    'kemist': ['chemist'],
    'kenneth': ['ken'],
    'kenny': ['ken'],
    'keri': ['kerry'],
    'kerri': ['kerry'],
    'keyz': ['key'],
    'kfc': ['k', 'f', 'c'],
    'kg': ['k', 'g'],
    'kgoon': ['k', 'goon'],
    'khalid': ['khaled'],
    'kicker': ['kick'],
    'kickin': ['kick'],
    'kickraux': ['kick', 'rock'],
    'kickstand': ['kick', 'stand'],
    'kickstart': ['kick', 'start'],
    'kickstarter': ['kick', 'start'],
    'kid6ix': ['kid', '6'],
    'brat': ['brat'],
    'kidd': ['kid'],
    'kiddies': ['kid'],
    'kiddy': ['kid'],
    'kidswaste': ['kid', 'waste'],
    'kidz': ['kid'],
    'kil': ['kill'],
    'kill4me': ['kill', '4', 'me'],
    'killa': ['kill'],
    'killah': ['kill'],
    'killer': ['kill'],
    'killin': ['kill'],
    'killswitch': ['kill', 'switch'],
    'killstation': ['kill', 'station'],
    'killy': ['kill'],
    'killz': ['kill'],
    'kilogram': ['kilo'],
    'kinda': ['kind'],
    'kinder': ['kind'],
    'kindest': ['kind'],
    'kindly': ['kind'],
    'kindness': ['kind'],
    'kingpin': ['king', 'pin'],
    'kingsmen': ['king', 'men'],
    'kissin': ['kiss'],
    'kitt': ['kit'],
    'kjay': ['k', 'jay'],
    'klik': ['click'],
    'klusterfuck': ['cluster', 'fuck'],
    'kmag': ['k', 'm', 'a', 'g'],
    'kmd': ['k', 'm', 'd'],
    'kmf': ['k', 'm', 'f'],
    'kmt': ['k', 'm', 't'],
    'knocker': ['knock'],
    'knockerz': ['knock'],
    'knockin': ['knock'],
    'knockout': ['knock', 'out'],
    'knocturnal': ['knock', 'nocturnal'],
    'knotty': ['knot'],
    'knower': ['know'],
    'knowin': ['know'],
    'knowmadic': ['nomad', 'know'],
    'known': ['know'],
    'knoxville': ['knox'],
    'kokamoe': ['kokomo'],
    'kolony': ['colony'],
    'kongo': ['congo'],
    'konkrete': ['concrete'],
    'kooky': ['kook'],
    'kream': ['cream'],
    'kool': ['cool'],
    'korean': ['korea'],
    'korn': ['corn'],
    'kottonmouth': ['cotton', 'mouth'],
    'kpm': ['k', 'p', 'm'],
    'kquick': ['k', 'quick'],
    'kracker': ['cracker'],
    'kranium': ['cranium'],
    'krate': ['crate'],
    'krayzie': ['crazy'],
    'krazy': ['crazy'],
    'kreayshawn': ['kreay', 'shawn'],
    'krept': ['crept'],
    'krippy': ['crip'],
    'kris': ['chris'],
    'kristopher': ['chris'],
    'krit': ['krit', 'k', 'r', 'i', 't'],
    'kross': ['cross'],
    'ks': ['k', 's'],
    'kshmr': ['k', 's', 'h', 'm', 'r'],
    'ksi': ['k', 's', 'I'],
    'kt': ['k', 't'],
    'kult': ['cult'],
    'kurt': ['curt'],
    'kurtis': ['curt'],
    'kushmore': ['kush', 'more'],
    'kutless': ['cut', 'less'],
    'kv': ['k', 'v'],
    'kvr': ['k', 'v', 'r'],
    'kwajbasket': ['kwaj', 'basket'],
    'kxa': ['k', 'x', 'a'],
    'kxng': ['king'],
    'kXss': ['k', 'x', 's', 'kiss'],
    'kz': ['k', 'z'],
    'l$d': ['l', 's', 'd'],
    'l10': ['l', '1', '0'],
    'la1': ['l', 'a', '1'],
    'la2': ['l', 'a', '2'],
    'la3': ['l', 'a', '3'],
    'la4': ['l', 'a', '4'],
    'la5': ['l', 'a', '5'],
    'la6': ['l', 'a', '6'],
    'la7': ['l', 'a', '7'],
    'laake': ['lake'],
    'labour': ['labor'],
    'lac': ['cadillac'],
    'ladies': ['lady'],
    'ladyhawke': ['lady', 'hawk'],
    'ladyland': ['lady', 'land'],
    'laidback': ['laid', 'back'],
    'lamborghini': ['lambo'],
    'lampshades': ['lamp', 'shade'],
    'landin': ['land'],
    'landlady': ['land', 'lady'],
    'landlord': ['land', 'lord'],
    'landman': ['land', 'man'],
    'landmark': ['land', 'mark'],
    'landscape': ['land', 'scape'],
    'landslide': ['land', 'slide'],
    'lanez': ['lane'],
    'langhorne': ['lang', 'horn'],
    'lany': ['laney'],
    'larrykoek': ['larry', 'koek'],
    'larsson': ['larson'],
    'las': ['last'],
    'laserdisk': ['laser', 'disc'],
    'laserlight': ['laser', 'light'],
    'laserquest': ['laser', 'quest'],
    'latoya': ['toya'],
    'laughin': ['laugh'],
    'laughingstock': ['laugh', 'stock'],
    'laughter': ['laugh'],
    'lauryn': ['lauren'],
    'lawd': ['lord'],
    'lawful': ['law'],
    'lawless': ['law'],
    'lax': ['l', 'a', 'x'],
    'layin': ['lay'],
    'lazer': ['laser'],
    'lazerdisk': ['laser', 'disc'],
    'lazerquest': ['laser', 'quest'],
    'laziness': ['lazy'],
    'lb': ['l', 'b'],
    'lbc': ['l', 'b', 'c'],
    'lbm': ['l', 'b', 'm'],
    'lcd': ['l', 'c', 'd'],
    'lda': ['l', 'd', 'a'],
    'ldn': ['l', 'd', 'n'],
    'ldr': ['l', 'd', 'r'],
    'le$': ['less'],
    'lea': ['lee'],
    'leader': ['lead'],
    'leadin': ['lead'],
    'leafling': ['leaf'],
    'leafy': ['leaf'],
    'leakin': ['leak'],
    'leann': ['lee', 'ann'],
    'leanne': ['lee', 'ann'],
    'learnin': ['learn'],
    'learnt': ['learn'],
    'leaver': ['leave'],
    'leavin': ['leave'],
    'ledbetter': ['led', 'better'],
    'leeann': ['lee', 'Ann'],
    'leela': ['lee', 'la'],
    'leftover': ['left', 'over'],
    'leftside': ['left', 'side'],
    'leftwich': ['left', 'wich'],
    'lefty': ['left'],
    'legendary': ['legend'],
    'lel': ['l', 'e'],
    'lemonade': ['lemon'],
    'lemonhead': ['lemon', 'head'],
    'lenny': ['len'],
    'lep': ['l', 'e', 'p'],
    'leppard': ['leopard'],
    'letoya': ['toya'],
    'lettaz': ['letter'],
    'letterbomb': ['letter', 'bomb'],
    'letterman': ['letter', 'man'],
    'lettin': ['let'],
    'levitation': ['levitate'],
    'lfo': ['l', 'f', 'o'],
    'lftm': ['l', 'f', 't', 'm'],
    'lfu300ma': ['l', 'f', 'u', '3', '0', 'hundred', 'm', 'a'],
    'lgbt': ['l', 'g', 'b', 't'],
    'lgnd': ['legend'],
    'lgndry': ['legend'],
    'lh': ['l', 'h'],
    'lhhc': ['l', 'h', 'c'],
    'liar': ['lie'],
    'librarian': ['library'],
    'lickin': ['lick'],
    'lifeguard': ['life', 'guard'],
    'lifehouse': ['life', 'house'],
    'lifeline': ['life', 'line'],
    'lifelong': ['life', 'long'],
    'lifer': ['life'],
    'lifesong': ['life', 'song'],
    'lifestyle': ['life', 'style'],
    'lifestylez': ['life', 'style'],
    'lifetime': ['life', 'time'],
    'liftin': ['lift'],
    'lighter': ['light'],
    'lighthouse': ['light', 'house'],
    'lightly': ['light'],
    'lightness': ['light'],
    'lightshow': ['light', 'show'],
    'lightspeed': ['light', 'speed'],
    'lightwieght': ['light', 'weight'],
    'lightyear': ['light', 'year'],
    'lightz': ['light'],
    'Liife': ['life'],
    'lillies': ['lilly'],
    'lily': ['lilly'],
    'lilyjets': ['lilly', 'jet'],
    'limelight': ['lime', 'light'],
    'lindsay': ['lindsey'],
    'lined': ['line'],
    'linehaul': ['line', 'haul'],
    'lineman': ['line', 'man'],
    'linepulse': ['line', 'pulse'],
    'liner': ['line'],
    'lining': ['line'],
    'linkin': ['lincoln'],
    'linx': ['link'],
    'lionheart': ['lion', 'heart'],
    'lionsized': ['lion', 'size'],
    'lipgloss': ['lip', 'gloss'],
    'lipps': ['lip'],
    'lipstick': ['lip', 'stick'],
    'listenin': ['listen'],
    'litty': ['lit'],
    'lively': ['live'],
    'livez': ['live'],
    'lividup': ['livid', 'live', 'up'],
    'livin': ['live'],
    'lizzy': ['liz'],
    'lj': ['l', 'j'],
    'lk': ['l', 'k'],
    'lka': ['l', 'k', 'a'],
    'lkj': ['l', 'k', 'j'],
    'll': ['l'],
    'llif3': ['life'],
    'lmfao': ['l', 'm', 'f', 'a', 'o'],
    'lndn': ['london'],
    'lny': ['loony', 'l', 'n', 'y'],
    'loadin': ['load'],
    'loaner': ['loan'],
    'locash': ['low', 'cash'],
    'lockdown': ['lock', 'down'],
    'locke': ['lock'],
    'lockjaw': ['lock', 'jaw'],
    'logical': ['logic'],
    'logiclub': ['logic', 'club'],
    'lolawolf': ['lola', 'wolf'],
    'lollipop': ['lolli', 'pop'],
    'lonely': ['lone'],
    'loner': ['lone'],
    'lonerism': ['lone'],
    'lonesome': ['lone'],
    'lonestar': ['lone', 'star'],
    'longer': ['long'],
    'longest': ['long'],
    'longfellow': ['long', 'fellow'],
    'longlivesteelo': ['long', 'live', 'steelo'],
    'longshot': ['long', 'shot'],
    'longview': ['long', 'view'],
    'longway': ['long', 'way'],
    'lonliest': ['lone'],
    'looka': ['look'],
    'looker': ['look'],
    'lookin': ['look'],
    'looper': ['loop'],
    'loote': ['loot'],
    'lorde': ['lord'],
    'loser': ['lose'],
    'losin': ['lose'],
    'losing': ['lose'],
    'lostboycrow': ['lost', 'boy', 'crow'],
    'lostprophets': ['lost', 'prophet'],
    'lotta': ['lot'],
    'louder': ['loud'],
    'loudest': ['loud'],
    'loudpvck': ['loud', 'pack'],
    'louie': ['lou'],
    'loungin': ['lounge'],
    'lov': ['l', 'o', 'v'],
    'loveblood': ['love', 'blood'],
    'loved': ['love'],
    'lovedance': ['love', 'dance'],
    'lovefool': ['love', 'fool'],
    'lovegame': ['love', 'game'],
    'loveless': ['love'],
    'lovelies': ['love'],
    'lovelife': ['love', 'life'],
    'lovely': ['love'],
    'lovelytheband': ['lovely', 'band'],
    'lover': ['love'],
    'loverboy': ['love', 'boy'],
    'loverman': ['love', 'man'],
    'lovesick': ['love', 'sick'],
    'lovesong': ['love', 'song'],
    'lovestain': ['love', 'stain'],
    'lovestoned': ['love', 'stone'],
    'lovestrong': ['love', 'strong'],
    'lovin': ['love'],
    'lowe': ['low'],
    'lower': ['low'],
    'lowering': ['low'],
    'lowest': ['low'],
    'lowkey': ['low', 'key'],
    'lowland': ['low', 'land'],
    'lowlife': ['low', 'life'],
    'lowmeek': ['low', 'meek'],
    'lowriderz': ['low', 'ride'],
    'lowriders': ['low', 'ride'],
    'lowrider': ['low', 'ride'],
    'loyalty': ['loyal'],
    'lp': ['l', 'p'],
    'lqd': ['l', 'q', 'd'],
    'lrc': ['l', 'r', 'c'],
    'lrkr': ['l', 'k', 'r'],
    'lsd': ['l', 's', 'd'],
    'lsg': ['l', 's', 'g'],
    'ltb': ['l', 't', 'b'],
    'ltd': ['l', 't', 'd', 'limited'],
    'lte': ['l', 't', 'e'],
    'lto': ['l', 't', 'o'],
    'lts': ['l', 't', 's'],
    'lucc': ['luck'],
    'lucidity': ['lucid'],
    'lucki': ['lucky'],
    'luckiest': ['luck'],
    'luckily': ['luck'],
    'lucky': ['luck'],
    'luftballoon': ['luft', 'balloon'],
    'lukas': ['lucas'],
    'lunchbox': ['lunch', 'box'],
    'lunchmoney': ['lunch', 'money'],
    'luv': ['love'],
    'luven': ['love'],
    'luvin': ['love'],
    'luving': ['love'],
    'luvn': ['love'],
    'lv': ['l', 'v'],
    'lvl': ['level'],
    'lvnd': ['land'],
    'lvndscape': ['land', 'scape'],
    'lwin': ['l', 'win'],
    'lwymmd': ['l', 'w', 'y', 'm', 'd'],
    'lx': ['l', 'x'],
    'lxfe': ['life'],
    'lxke': ['like'],
    'lxrry': ['larry'],
    'lyfe': ['life'],
    'lyft': ['lift'],
    'lyin': ['lie'],
    'lyk': ['like'],
    'lyrical': ['lyric'],
    'lyricist': ['lyric'],
    'lyricold': ['lyric', 'cold'],
    'lyte': ['light'],
    'lytle': ['little'],
    'lzrd': ['l', 'z', 'r', 'd', 'lizard'],
    'lzzy': ['lazy'],
    'm83': ['m', '8 3'],
    'ma ma': ['mama'],
    'ma$e': ['mase'],
    'maad': ['mad'],
    'mac': ['mack'],
    'maca': ['m', 'a', 'c'],
    'machinehead': ['machine', 'head'],
    'machinery': ['machine'],
    'macklemore': ['mack', 'more'],
    'mackned': ['mack'],
    'macrowave': ['macro', 'wave'],
    'madchild': ['mad', 'child'],
    'madcon': ['mad', 'con'],
    'madder': ['mad'],
    'madeintyo': ['made', 'in', 'tokyo'],
    'madeit': ['made', 'it'],
    'mademen': ['made', 'men'],
    'madlib': ['mad', 'adlib'],
    'madly': ['mad'],
    'madman': ['mad', 'man'],
    'madness': ['mad'],
    'madvillian': ['mad', 'villian'],
    'maejor': ['major'],
    'maggie': ['maggy'],
    'magical': ['magic'],
    'magici': ['magic'],
    'magician': ['magic'],
    'magnetic': ['magnet'],
    'magnolian': ['magnolia'],
    'mailbox': ['mail', 'box'],
    'mailman': ['mail', 'man'],
    'mainland': ['main', 'land'],
    'mainstay': ['mainstay'],
    'mainstream': ['main', 'stream'],
    'mainstreet': ['main', 'street'],
    'majorette': ['major'],
    'maker': ['make'],
    'makeshift': ['make', 'shift'],
    'makeup': ['make', 'up'],
    'makin': ['make'],
    'malfunction': ['function'],
    'maliblue': ['mali', 'blue'],
    'malnourished': ['nourish'],
    'mamma': ['mama'],
    'management': ['manage'],
    'manager': ['manage'],
    'manchild': ['man', 'child'],
    'mane': ['man'],
    'maneater': ['man', 'eat'],
    'manly': ['man'],
    'manmansavage': ['man', 'savage'],
    'mann': ['man'],
    'mannish': ['man'],
    'manowar': ['man', 'o', 'war'],
    'mansionair': ['mansion', 'air'],
    'mansionz': ['mansion'],
    'marc': ['mark'],
    'marchin': ['march'],
    'margaritaville': ['margarita'],
    'mariwanna': ['mary', 'wanna', 'marijuana'],
    'markie': ['mark'],
    'marky': ['mark'],
    'married': ['marry'],
    'marshmello': ['marsh', 'mellow'],
    'martyn': ['martin'],
    'martyrial': ['material'],
    'marvins': ['marvin'],
    'masego': ['mase', 'go'],
    'mashup': ['mash', 'up'],
    'mastermind': ['master', 'mind'],
    'masterpiece': ['master', 'piece'],
    'masterplan': ['master', 'plan'],
    'masterson': ['master'],
    'mat': ['matt'],
    'matchbox': ['match', 'box'],
    'materialistic': ['material'],
    'mathletic': ['math'],
    'mathmatics': ['math'],
    'matthew': ['matt'],
    'matthews': ['matt'],
    'mattrs': ['matter'],
    'maty': ['matt'],
    'maxwell': ['max'],
    'maybe': ['may', 'be'],
    'maybird': ['may', 'bird'],
    'mayday': ['may', 'day'],
    'mayfair': ['may', 'fair'],
    'mayfield': ['may', 'field'],
    'mayflies': ['may', 'fly'],
    'mayfly': ['may', 'fly'],
    'mayonaise': ['mayo'],
    'mayweather': ['may', 'weather'],
    'mazzy': ['maze'],
    'mbeat11x': ['m', 'beat', 'eleven', '1', 'x'],
    'mbo': ['m', 'b', 'o'],
    'mc': ['m', 'c'],
    'mcdonald': ['donald'],
    'mcfly': ['fly'],
    'mcknight': ['knight'],
    'mclean': ['lean'],
    'mdlc': ['m', 'd', 'l', 'c'],
    'mdsn': ['m', 'd', 's', 'n'],
    'mdws': ['m', 'd', 'w', 's'],
    'meade': ['mead'],
    'meadowlands': ['meadow', 'land'],
    'meadowlark': ['meadow', 'lark'],
    'meaner': ['mean'],
    'meanest': ['mean'],
    'meantime': ['mean', 'time'],
    'meanwhile': ['mean', 'while'],
    'meatball': ['meat', 'ball'],
    'meatloaf': ['meat', 'loaf'],
    'meaty': ['meat'],
    'medication': ['medicate'],
    'meetin': ['meet'],
    'megabytes': ['mega', 'bite'],
    'megafun': ['mega', 'fun'],
    'megalomania': ['mega', 'mania'],
    'megaman': ['mega', 'man'],
    'megaphone': ['mega', 'phone'],
    'meghan': ['megan'],
    'mello': ['mellow'],
    'mellowhype': ['mellow', 'hype'],
    'melosense': ['mellow', 'sense'],
    'meltdown': ['melt', 'down'],
    'melter': ['melt'],
    'meltin': ['melt'],
    'melty': ['melt'],
    'mercy1': ['mercy', '1'],
    'mercyme': ['mercy', 'me'],
    'merica': ['america'],
    'merkules': ['merk'],
    'merriweather': ['merry', 'weather'],
    'merrymaker': ['merry', 'make'],
    'messy': ['mess'],
    'methamphetamine': ['meth'],
    'metroflexual': ['metro', 'flex'],
    'metrosexual': ['metro', 'sex'],
    'mf': ['m', 'f'],
    'mfn': ['m', 'f', 'n'],
    'mgm': ['m', 'g'],
    'mgmt': ['m', 'g', 't'],
    'mgs': ['m', 'g'],
    'mhb': ['m', 'h', 'b'],
    'mhope': ['m', 'hope'],
    'mickey': ['mick'],
    'microphone': ['micro', 'phone'],
    'microsoft': ['micro', 'soft'],
    'microwave': ['micro', 'wave'],
    'midlake': ['mid', 'lake'],
    'midland': ['mid', 'land'],
    'midnight': ['mid', 'night'],
    'midsouth': ['mid', 'south'],
    'midwater': ['mid', 'water'],
    'midwest': ['mid', 'west'],
    'mighty': ['might'],
    'migration': ['migrate'],
    'miike': ['mike'],
    'mikeschair': ['mike', 'chair'],
    'mikexangel': ['mike', 'if (word  === ', 'angel'],
    'mikey': ['mike'],
    'mikhael': ['michael'],
    'milck': ['milk'],
    'milestone': ['mile', 'Stone'],
    'milkman': ['milk', 'man'],
    'milkshake': ['milk', 'shake'],
    'milktooth': ['milk', 'tooth'],
    'milky': ['milk'],
    'millameta': ['milli', 'meter'],
    'millameter': ['milla', 'meter'],
    'millimeta': ['milli', 'meter'],
    'millimeter': ['milli', 'meter'],
    'millionare': ['million'],
    'millionth': ['million'],
    'millionz': ['million'],
    'millisecond': ['milli', 'second'],
    'millz': ['mill'],
    'mindless': ['mind'],
    'mindtrick': ['mind', 'trick'],
    'mindz': ['mind'],
    'miner': ['mine'],
    'minivan': ['mini', 'van'],
    'minthaze': ['mint', 'haze'],
    'mirrorball': ['mirror', 'ball'],
    'misses': ['miss'],
    'missin': ['miss'],
    'missundaztood': ['missunderstood'],
    'mistadc': ['mister', 'd', 'c'],
    'misterwives': ['mister', 'wife'],
    'mistletoe': ['mistle', 'toe'],
    'mistreat': ['treat'],
    'misty': ['mist'],
    'mixer': ['mix'],
    'mixin': ['mix'],
    'mixtape': ['miif (word  === ', 'tape'],
    'mjg': ['m', 'j', 'g'],
    'mkto': ['m', 'k', 't', 'o'],
    'mlk': ['m', 'l', 'k'],
    'mmg': ['m', 'g'],
    'mmmbop': ['mmm', 'bop'],
    'mmmhmm': ['mmm', 'hmm'],
    'mmrs': ['memory'],
    'mndbd': ['m', 'n', 'd', 'b'],
    'mndr': ['m', 'n', 'd', 'r'],
    'mndsgn': ['m', 'n', 'd', 's', 'g'],
    'mnek': ['m', 'n', 'e', 'k'],
    'moanin': ['moan'],
    'mobb': ['mob'],
    'mobbin': ['mob'],
    'mobscene': ['mob', 'scene'],
    'mobsta': ['mob'],
    'mobster': ['mob'],
    'mockingbird': ['mock', 'bird'],
    'modelz': ['model'],
    'modestep': ['mode', 'step'],
    'mofaux': ['mo', 'faux'],
    'mohawk': ['mo', 'hawk'],
    'mohawke': ['mo', 'hawk'],
    'molife': ['mo', 'life'],
    'momentz': ['moment'],
    'momma': ['mama'],
    'mommy': ['mom'],
    'moneybag': ['money', 'bag'],
    'moneybagg': ['money', 'bag'],
    'moneygrabber': ['money', 'grab'],
    'moneytalk': ['money', 'talk'],
    'monkee': ['monkey'],
    'monkies': ['monkey'],
    'monsoonsiren': ['monsoon', 'siren'],
    'monsta': ['monster'],
    'moody': ['mood'],
    'moodz': ['mood'],
    'moonage': ['moon', 'age'],
    'moonbase': ['moon', 'base'],
    'moonboot': ['moon', 'boot'],
    'moonbound': ['moon', 'bound'],
    'moonchild': ['moon', 'child'],
    'moondance': ['moon', 'dance'],
    'moonday': ['moon', 'day'],
    'moonglow': ['moon', 'glow'],
    'moonlight': ['moon', 'light'],
    'moonlit': ['moon', 'lit'],
    'moonrise': ['moon', 'rise'],
    'moonshadow': ['moon', 'shadow'],
    'moonshine': ['moon', 'shine'],
    'moonzz': ['moon'],
    'moorglade': ['moor', 'glade'],
    'mop': ['mop', 'm', 'o', 'p'],
    'morebishop': ['more', 'bishop'],
    'mornin': ['morning'],
    'morningside': ['morning', 'side'],
    'morningsider': ['morning', 'side'],
    'mosss': ['moss'],
    'mossy': ['moss'],
    'motha': ['mother'],
    'mothafucker': ['mother', 'fuck'],
    'motherfucker': ['mother', 'fuck'],
    'motherless': ['mother'],
    'motherlode': ['mother', 'load'],
    'motherly': ['mother'],
    'motopony': ['moto', 'pony'],
    'motorbreath': ['motor', 'breath'],
    'motorcycle': ['motor', 'cycle'],
    'motorhead': ['motor', 'head'],
    'motorsport': ['motor', 'sport'],
    'motown': ['mo', 'town'],
    'motownphilly': ['mo', 'town', 'philly'],
    'movement': ['move'],
    'mover': ['move'],
    'movin': ['move'],
    'mp': ['m', 'p'],
    'mp3': ['m', 'p', '3'],
    'mpa': ['m', 'p', 'a'],
    'mph': ['m', 'p', 'h'],
    'mpr': ['m', 'p', 'r'],
    'mr': ['mister'],
    'mri': ['m', 'r', 'I'],
    'mrs': ['miss'],
    'ms': ['miss'],
    'msp': ['m', 's', 'p'],
    'mtn': ['mountain'],
    'mtrd': ['m', 't', 'r', 'd'],
    'mtv': ['m', 'tv'],
    'mudd': ['mud'],
    'muddy': ['mud'],
    'mudfootball': ['mud', 'foot', 'ball'],
    'mudhoney': ['mud', 'honey'],
    'mudvayne': ['mud', 'vain'],
    'munchin': ['munch'],
    'munster': ['monster'],
    'murda': ['murder'],
    'murderer': ['murder'],
    'murderous': ['murder'],
    'muscadinebloodline': ['muscadine', 'blood', 'line'],
    'musical': ['music'],
    'musicbox': ['music', 'box'],
    'musings': ['muse'],
    'musiq': ['music'],
    'musique': ['music'],
    'muskrat': ['musk', 'rat'],
    'mutemath': ['mute', 'math'],
    'muteson': ['mute', 'son'],
    'mutha': ['mother'],
    'muthafuckin': ['mother', 'fuck'],
    'muthaphuckkin': ['mother', 'fuck'],
    'mutilation': ['mutilate'],
    'muzik': ['music'],
    'mvmt': ['movement'],
    'mvp': ['m', 'v', 'p'],
    'mvs': ['m', 'v', 's'],
    'mx': ['m', 'x'],
    'mxmtoon': ['m', 'x', 'toon'],
    'mxpx': ['m', 'x', 'p'],
    'mxxwell': ['max', 'well'],
    'myers': ['meyers'],
    'myke': ['mike'],
    'myles': ['mile'],
    'mylife': ['my', 'life'],
    'myself': ['my', 'self'],
    'mystical': ['mystic'],
    'mysticphonk': ['mystic', 'funk'],
    'mystik': ['mystic'],
    'mystikal': ['mystic'],
    'mythical': ['myth'],
    'mythology': ['myth'],
    'mz': ['m', 'z'],
    'mzvee': ['m', 'z', 'v', 'e'],
    'n9ne': ['nine'],
    'nameless': ['name'],
    'namesake': ['name', 'sake'],
    'nao': ['n', 'a', 'o'],
    'naptime': ['nap', 'time'],
    'nashville': ['nash', 'ville'],
    'nathaniel': ['nathan'],
    'nathanson': ['nathan'],
    'national': ['nation'],
    'navigator': ['navigate'],
    'navuzimetro': ['nav', 'uzi', 'metro'],
    'nawfside': ['north', 'side'],
    'nba': ['n', 'b', 'a'],
    'nbk': ['n', 'b', 'k'],
    'ndn': ['n', 'd'],
    'nds': ['n', 'd', 's'],
    'necessities': ['neccessity'],
    'needtobreathe': ['need', 'to', 'breathe'],
    'negativity': ['negative'],
    'neighborhood': ['neighbor', 'hood'],
    'neighborz': ['neighbor'],
    'neighbourhood': ['neighbor', 'hood'],
    'nellyville': ['nelly', 'ville'],
    'nerdy': ['nerd'],
    'netfilx': ['net', 'flix'],
    'netflixxx': ['net', 'flix'],
    'neva': ['never'],
    'neverland': ['never', 'land'],
    'nevermind': ['never', 'mind'],
    'newborn': ['new', 'born'],
    'newer': ['new'],
    'newest': ['new'],
    'newfound': ['new', 'found'],
    'newgrass': ['new', 'grass'],
    'newsboys': ['new', 'boy'],
    'newsong': ['new', 'song'],
    'nexxthursday': ['next', 'thursday'],
    'nf': ['n', 'f'],
    'nfl': ['n', 'f', 'l'],
    'nghtmre': ['night', 'mare'],
    'nh': ['n', 'h'],
    'nhk': ['n', 'h', 'k'],
    'nhl': ['n', 'h', 'l'],
    'ni**az': ['nigga'],
    'nib': ['n', 'I', 'b'],
    'nic': ['nick'],
    'nice2knou': ['nice', '2', 'know', 'u'],
    'nickelback': ['nickel', 'back'],
    'nicki': ['nick'],
    'nicky': ['nick'],
    'niggaz': ['nigga'],
    'nigger': ['nigga'],
    'nightbus': ['night', 'bus'],
    'nightcall': ['night', 'call'],
    'nightcaller': ['night', 'call'],
    'nightcap': ['night', 'cap'],
    'nightcrawler': ['night', 'crawl'],
    'nightlife': ['night', 'life'],
    'nightly': ['night'],
    'nightmare': ['night', 'mare'],
    'nightshift': ['night', 'shift'],
    'nighttime': ['night', 'time'],
    'niki': ['nick'],
    'nikki': ['nick'],
    'nillionaire': ['nill'],
    'nimrod': ['nim', 'rod'],
    'nine': ['9'],
    'nineteen': ['teen', '1', '9'],
    'ninety': ['ninety', '9', '0'],
    'nite': ['night'],
    'noone': ['no', '1'],
    'nitelife': ['night', 'life'],
    'nj': ['n', 'j'],
    'nlb': ['n', 'l', 'b'],
    'nluv': ['n', 'in', 'love'],
    'nlyf': ['n', 'l', 'y', 'f'],
    'nm': ['n', 'm'],
    'nmd': ['n', 'm', 'd'],
    'nmim': ['n', 'm', 'I'],
    'nnge': ['n', 'g', 'e'],
    'nnuff': ['enough'],
    'nobody': ['no', 'body'],
    'nofx': ['n', 'o', 'f', 'x'],
    'nohidea': ['no', 'idea'],
    'noisey': ['noise'],
    'nolia': ['magnolia'],
    'nonono': ['no'],
    'nonpoint': ['non', 'point'],
    'norf': ['north'],
    'northbound': ['north', 'bound'],
    'northeast': ['north', 'east'],
    'northeastern': ['north', 'east'],
    'northern': ['north'],
    'northside': ['north', 'side'],
    'northwest': ['north', 'west'],
    'northwestern': ['north', 'west'],
    'notepad': ['note', 'pad'],
    'nothin': ['nothing'],
    'nothingman': ['nothing', 'man'],
    'nourishment': ['nourish'],
    'novaa': ['nova'],
    'novelist': ['novel'],
    'nowadays': ['now', 'day'],
    'nowhere': ['no', 'where'],
    'np': ['n', 'p'],
    'npr': ['n', 'p', 'r'],
    'nq': ['n', 'q'],
    'nqa': ['n', 'q', 'a'],
    'nqo': ['n', 'q', 'o'],
    'nqoi': ['n', 'q', 'o', 'I'],
    'nr': ['n', 'r'],
    'nrbq': ['n', 'r', 'b', 'q'],
    'nstynct': ['instinct'],
    'nsync': ['n', 'sync'],
    'ntdwy': ['n', 't', 'd', 'w', 'y'],
    'ntn': ['n', 't'],
    'nutbush': ['nut', 'bush'],
    'nutcracker': ['nut', 'crack'],
    'nuthin': ['nothing'],
    'nutshell': ['nut', 'shell'],
    'nvdes': ['nude'],
    'nvr': ['never', 'n', 'v', 'r'],
    'nwa': ['n', 'w', 'a'],
    'nxworries': ['no', 'worry'],
    'nxxxxxs': ['n', 'x', 's'],
    'nyc': ['n', 'y', 'c'],
    'nyce': ['nice'],
    'nyck': ['nick'],
    'nyikee': ['nick'],
    'oakland': ['oak', 'land'],
    'oar': ['oar', 'o', 'a', 'r'],
    'oates': ['oat'],
    'oatmeal': ['oat', 'meal'],
    'obrien': ['o', 'brian'],
    'observer': ['observe'],
    'obsession': ['obsess'],
    'oc': ['o', 'c'],
    'oclock': ['o', 'clock'],
    'oconnor': ['o', 'connor'],
    'oct': ['october'],
    'octobertwentyfirst': ['october', 'twenty', 'first', '2', '1'],
    'odb': ['o', 'd', 'b'],
    'oddish': ['odd'],
    'oddity': ['odd'],
    'odesza': ['odessa'],
    'odg': ['o', 'd', 'g'],
    'odissee': ['odyssey'],
    'odonnis': ['o', 'donnis'],
    'odonovan': ['o', 'donovan'],
    'oer': ['over'],
    'offa': ['off'],
    'offender': ['offend'],
    'offguard': ['off', 'guard'],
    'offishall': ['official'],
    'offline': ['off', 'line'],
    'offset': ['off', 'set'],
    'offshore': ['off', 'shore'],
    'offspring': ['off', 'spring'],
    'og': ['o', 'g'],
    'ohhh': ['ooh'],
    'oj': ['o', 'j'],
    'okay': ['ok'],
    'ol': ['old'],
    'older': ['old'],
    'oldest': ['old'],
    'oldie': ['old'],
    'ole': ['old'],
    'olyk': ['o', 'l', 'y', 'k'],
    'omc': ['o', 'm', 'c'],
    'omd': ['o', 'm', 'd'],
    'omg': ['o', 'm', 'g'],
    'oncue': ['on', 'cue'],
    'ones': ['1'],
    'one': ['1'],
    'onerepublic': ['1', 'republic'],
    'oneway': ['one', 'way'],
    'ooh': ['ooo'],
    'oohdem': ['ooh', 'them'],
    'ookay': ['ok'],
    'ooouuu': ['ooo'],
    'oozing': ['ooze'],
    'opener': ['open'],
    'openly': ['open'],
    'opp': ['o', 'p'],
    'orangecloud': ['orange', 'cloud'],
    'orbital': ['orbit'],
    'orchestral': ['orchestra'],
    'oriental': ['orient'],
    'ot': ['o', 't'],
    'otherside': ['other', 'side'],
    'otherwise': ['other', 'wise'],
    'outcast': ['out', 'cast'],
    'outcome': ['out', 'come'],
    'outdoor': ['out', 'door'],
    'outfield': ['out', 'field'],
    'outfit': ['out', 'fit'],
    'outkast': ['out', 'cast'],
    'outlaw': ['out', 'law'],
    'outlawz': ['out', 'law'],
    'outline': ['out', 'line'],
    'outshine': ['out', 'shine'],
    'outside': ['out', 'side'],
    'outsiders': ['out', 'side'],
    'outskirts': ['out', 'skirt'],
    'outstanding': ['out', 'stand'],
    'outta': ['out'],
    'outtake': ['out', 'take'],
    'ov': ['of'],
    'ova': ['over'],
    'ovaload': ['over', 'load'],
    'overall': ['over', 'all'],
    'overboard': ['over', 'board'],
    'overcoat': ['over', 'coat'],
    'overcome': ['over', 'come'],
    'overcomer': ['over', 'come'],
    'overdose': ['over', 'dose'],
    'overdoz': ['over', 'dose'],
    'overdressed': ['over', 'dress'],
    'overdrive': ['over', 'drive'],
    'overdue': ['over', 'due'],
    'overexposed': ['over', 'expose'],
    'overgrown': ['over', 'grown'],
    'overhaul': ['over', 'haul'],
    'overhead': ['over', 'head'],
    'overheard': ['over', 'heard'],
    'overjoyed': ['over', 'joy'],
    'overkill': ['over', 'kill'],
    'overload': ['over', 'load'],
    'overlord': ['over', 'lord'],
    'overnight': ['over', 'night'],
    'overnite': ['over', 'night'],
    'overprotected': ['over', 'protect'],
    'overprotective': ['over', 'protect'],
    'overrated': ['over', 'rate'],
    'overseas': ['over', 'sea'],
    'overtime': ['over', 'time'],
    'overture': ['over', 'ture'],
    'overwhelm': ['over', 'whelm'],
    'overwork': ['over', 'work'],
    'owner': ['own'],
    'oxytocin': ['oxy'],
    'oz': ['ounce', 'oz'],
    'p!nk': ['pink'],
    'pablow': ['pablo'],
    'packer': ['pack'],
    'packin': ['pack'],
    'painkiller': ['pain', 'kill'],
    'painless': ['pain'],
    'painter': ['paint'],
    'palehound': ['pale', 'hound'],
    'palmtree': ['palm', 'tree'],
    'pancake': ['pan', 'cake'],
    'panda$': ['panda'],
    'panhandle': ['pan', 'handle'],
    'paperback': ['paper', 'back'],
    'paperboard': ['paper', 'board'],
    'paperboy': ['paper', 'boy'],
    'papercut': ['paper', 'cut'],
    'paperwork': ['paper', 'work'],
    'paralyzer': ['paralyze'],
    'parental': ['parent'],
    'pari$': ['Paris'],
    'parkes': ['park'],
    'parklife': ['park', 'life'],
    'parties': ['party'],
    'partly': ['part'],
    'partyer': ['party'],
    'partyin': ['party'],
    'partyisntover': ['party', 'is', 'over'],
    'partyman': ['party', 'man'],
    'partynextdoor': ['party', 'next', 'door'],
    'partysquad': ['party', 'squad'],
    'passeport': ['pass', 'port'],
    'passer': ['pass'],
    'passin': ['pass'],
    'passionate': ['passion'],
    'passionfruit': ['passion', 'fruit'],
    'passport': ['pass', 'port'],
    'patti': ['patty'],
    'paula': ['paul'],
    'pawcut': ['paw', 'cut'],
    'pawfluffer': ['paw', 'fluff'],
    'payback': ['pay', 'back'],
    'paycheck': ['pay', 'check'],
    'payer': ['pay'],
    'payin': ['pay'],
    'payphone': ['pay', 'phone'],
    'payroll': ['pay', 'roll'],
    'pb': ['p', 'b'],
    'pbnj': ['p', 'b', 'n', 'j'],
    'pbr': ['p', 'b', 'r'],
    'pbs': ['p', 'b', 's'],
    'pc': ['p', 'c'],
    'pcb': ['p', 'c', 'b'],
    'pcc': ['p', 'c'],
    'pch': ['p', 'c', 'h'],
    'pda': ['p', 'd', 'a'],
    'peaceful': ['peace'],
    'peacekeeper': ['peace', 'keep'],
    'peacemaker': ['peace', 'make'],
    'peachfuzz': ['peach', 'fuzz'],
    'peachy': ['peach'],
    'peacock': ['pea', 'cock'],
    'peanut': ['pea', 'nut'],
    'pearlman': ['pearl', 'man'],
    'peat': ['repeat'],
    'peed': ['pee'],
    'peeper': ['peep'],
    'peepin': ['peep'],
    'peewee': ['pee', 'wee'],
    'pegboard': ['peg', 'board'],
    'peggy': ['peg'],
    'pegleg': ['peg', 'leg'],
    'pennies': ['penny'],
    'pennyroyal': ['penny', 'royal'],
    'pennywise': ['penny', 'wise'],
    'penthouse': ['pent', 'house'],
    'pepa': ['pepper'],
    'peppermint': ['pepper', 'mint'],
    'perfectly': ['perfect'],
    'perisher': ['perish'],
    'perri': ['perry'],
    'perryman': ['perry', 'man'],
    'peter': ['pete'],
    'petey': ['pete'],
    'pf': ['p', 'f'],
    'pfv': ['p', 'f', 'v'],
    'pg': ['p', 'g'],
    'pharcyde': ['far', 'side'],
    'phat': ['fat'],
    'philip': ['phil'],
    'phillip': ['phil'],
    'philly': ['philadelphia'],
    'philosophize': ['philosophy'],
    'philthy': ['filth'],
    'phish': ['fish'],
    'phonebooth': ['phone', 'booth'],
    'photobooth': ['photo', 'booth'],
    'photograph': ['photo', 'graph'],
    'phunk': ['funk'],
    'phunky': ['funk'],
    'picker': ['pick'],
    'pickin': ['pick'],
    'pickup': ['pick', 'up'],
    'picky': ['pick'],
    'piecin': ['piece'],
    'pig&dan': ['pig', 'dan'],
    'piggie': ['pig'],
    'piggly': ['pig'],
    'piggy': ['pig'],
    'piig': ['pig'],
    'piledriver': ['pile', 'drive'],
    'piling': ['pile'],
    'pillowcase': ['pillow', 'case'],
    'pillowtalk': ['pillow', 'talk'],
    'pillz': ['pill'],
    'pilote': ['pilot'],
    'pimper': ['pimp'],
    'pimpin': ['pimp'],
    'pinback': ['pin', 'back'],
    'pinball': ['pin', 'ball'],
    'pineapple': ['pine', 'apple'],
    'pinecone': ['pine', 'cone'],
    'pinegrove': ['pine', 'grove'],
    'pinenut': ['pine', 'nut'],
    'pistola': ['pistol'],
    'pitbull': ['pit', 'bull'],
    'pitchfork': ['pitch', 'fork'],
    'pj': ['p', 'j'],
    'pjs': ['p', 'j'],
    'pk': ['p', 'k'],
    'planetary': ['planet'],
    'planez': ['plane'],
    'playa': ['play'],
    'playboi': ['play', 'boy'],
    'playbook': ['play', 'book'],
    'playboy': ['play', 'boy'],
    'player': ['play'],
    'playground': ['play', 'ground'],
    'playin': ['play'],
    'playlist': ['play', 'list'],
    'playradioplay': ['play', 'radio'],
    'pleazer': ['please'],
    'plowed': ['plow'],
    'plvtinum': ['platinum'],
    'pm': ['p', 'm'],
    'pma': ['p', 'm', 'a'],
    'pmdawn': ['p', 'm', 'dawn'],
    'pmw': ['p', 'm', 'w'],
    'pnb': ['p', 'n', 'b'],
    'pnk': ['pink'],
    'pocketful': ['pocket'],
    'pod': ['pod', 'p', 'o', 'd'],
    'pointer': ['point'],
    'pokey': ['poke'],
    'policeman': ['police', 'man'],
    'politik': ['politic'],
    'pollyseed': ['polly', 'seed'],
    'pollywog': ['polly', 'wog'],
    'ponies': ['pony'],
    'ponytail': ['pony', 'tail'],
    'poochie': ['pooch'],
    'pooh': ['poo'],
    'popcorn': ['pop', 'corn'],
    'poppin': ['pop'],
    'poppyfield': ['poppy', 'field'],
    'poppyseed': ['poppy', 'seed'],
    'poptartpete': ['pop', 'tart', 'pete'],
    'porchlight': ['porch', 'light'],
    'porky': ['pork'],
    'porno': ['porn'],
    'pornographer': ['porn'],
    'pornography': ['porn'],
    'portishead': ['portis', 'head'],
    'posed': ['supposed'],
    'positively': ['positive'],
    'possum': ['opossum'],
    'postcard': ['post', 'card'],
    'postcards': ['post', 'card'],
    'postman': ['post', 'man'],
    'postpone': ['post', 'pone'],
    'potbelly': ['pot', 'belly'],
    'potter': ['pot'],
    'poundcake': ['pound', 'cake'],
    'poundin': ['pound'],
    'pourin': ['pour'],
    'pov': ['p', 'o', 'v'],
    'pow': ['pow', 'p', 'o ', 'w'],
    'ppp': ['p'],
    'pq': ['p', 'q'],
    'pqm': ['p', 'q', 'm'],
    'prancer': ['prance'],
    'prayer': ['pray'],
    'prayin': ['pray'],
    'preacher': ['preach'],
    'preacherman': ['preach', 'man'],
    'preachin': ['preach'],
    'predictable': ['predict'],
    'presidential': ['president'],
    'pressa': ['press'],
    'pretender': ['pretend'],
    'prettymuch': ['pretty', 'much'],
    'prez': ['president'],
    'primetime': ['prime', 'time'],
    'privately': ['private'],
    'problematic': ['problem'],
    'problematique': ['problem'],
    'problemz': ['problem'],
    'probz': ['problem'],
    'proclaimer': ['proclaim'],
    'producer': ['produce'],
    'projector': ['project'],
    'promiseland': ['promise', 'land'],
    'promoter': ['promote'],
    'proppa': ['propper'],
    'protester': ['protest'],
    'proven': ['prove'],
    'provider': ['provide'],
    'prty': ['party'],
    'prynce': ['prince'],
    'ps': ['p', 's'],
    'psc': ['p', 's', 'c'],
    'psycadelik': ['psychedelic'],
    'ptsd': ['p', 't', 's', 'd'],
    'puffer': ['puff'],
    'puffin': ['puff'],
    'puffy': ['puff'],
    'pulla': ['pull'],
    'pullin': ['pull'],
    'pumpin': ['pump'],
    'punchin': ['punch'],
    'punisher': ['punsih'],
    'punkie': ['punk'],
    'punky': ['punk'],
    'puppies': ['puppy'],
    'purple': ['purp'],
    'pusha': ['push'],
    'pusher': ['push'],
    'pushover': ['push', 'over'],
    'pussies': ['pussy'],
    'pussycat': ['pussy', 'cat'],
    'pussyfoot': ['pussy', 'foot'],
    'putter': ['put'],
    'puttin': ['put'],
    'puzzlin': ['puzzle'],
    'pvris': ['paris'],
    'pwa': ['p', 'w', 'a'],
    'pwr': ['p', 'w', 'r', 'power'],
    'pxndx': ['p', 'x', 'd', 'n'],
    'pyd': ['p', 'y', 'd'],
    'pyt': ['p', 'y', 't'],
    'pz': ['p', 'z'],
    'pzk': ['p', 'z', 'k'],
    'qinn': ['quin'],
    'qna': ['q', 'n', 'a'],
    'qq': ['q'],
    'qs': ['q'],
    'quarterback': ['quarter', 'back'],
    'quarterfinal': ['quarter', 'final'],
    'quarterflash': ['quarter', 'flash'],
    'queenie': ['queen'],
    'queensryche': ['queen', 'ryche'],
    'quicker': ['quick'],
    'quickest': ['quick'],
    'quickie': ['quick'],
    'quickly': ['quick'],
    'quicksand': ['quick', 'sand'],
    'quicksilver': ['quick', 'silver'],
    'quieter': ['quiet'],
    'quietest': ['quiet'],
    'quietly': ['quiet'],
    'quik': ['quick'],
    'quirky': ['quirk'],
    'r3hab': ['rehab'],
    'r5': ['r', '5'],
    'ra': ['r', 'a'],
    'rabbitt': ['rabbit'],
    'racer': ['race'],
    'radioactive': ['radio', 'active'],
    'radiohead': ['radio', 'head'],
    'rae': ['ray'],
    'raelynn': ['ray', 'lynn'],
    'raf': ['r', 'a', 'f'],
    'rager': ['rage'],
    'ragtime': ['rag', 'time'],
    'ragtop': ['rag', 'top'],
    'ragweed': ['rag', 'weed'],
    'raider': ['raid'],
    'railroad': ['rail', 'road'],
    'railway': ['rail', 'way'],
    'rainbow': ['rain', 'bow'],
    'rainbowland': ['rain', 'bow', 'land'],
    'raincoat': ['rain', 'coat'],
    'raindrop': ['rain', 'drop'],
    'raingurl': ['rain', 'girl'],
    'rainin': ['rain'],
    'rainy': ['rain'],
    'raiser': ['raise'],
    'raisin': ['raise'],
    'rakin': ['rake'],
    'ramblin': ['ramble'],
    'ramshackle': ['ram', 'shackle'],
    'raneraps': ['rane', 'rap'],
    'ranger': ['range'],
    'raper': ['rape'],
    'rapin': ['rape'],
    'rapist': ['rape'],
    'rapp': ['rap'],
    'rappa': ['rap'],
    'rappers': ['rap'],
    'rapper': ['rap'],
    'rappin': ['rap'],
    'rastaman': ['rasta', 'man'],
    'ratt': ['rat'],
    'rattler': ['rattle'],
    'rattlerette': ['rattle', 'rette'],
    'rattlesnake': ['rattle', 'snake'],
    'rattlin': ['rattle'],
    'ravenscroft': ['raven', 'croft'],
    'raww': ['raw'],
    'rawwest': ['raw'],
    'rawwwrr': ['raw', 'roar'],
    'raye': ['ray'],
    'rayland': ['ray', 'land'],
    'rayven': ['raven'],
    'rebellion': ['rebel'],
    'rayvn': ['raven'],
    'rayz': ['ray'],
    'razorback': ['razor', 'back'],
    'radkey': ['rad', 'key'],
    'viceroy': ['vice', 'roy'],
    'razorblade': ['razor', 'blade'],
    'razorblades': ['razor', 'blade'],
    'razorlight': ['razor', 'light'],
    'rbe': ['r', 'b', 'e'],
    'rbl': ['r', 'b', 'l'],
    'rc': ['r', 'c'],
    'rchris': ['r', 'chris'],
    'rcvr': ['r', 'c', 'v'],
    'rd': ['road'],
    'rd4': ['r', 'd', '4'],
    'rdgldgrn': ['r', 'd', 'g', 'l', 'n', 'red', 'gold', 'green'],
    'rdx': ['r', 'd', 'x'],
    'reacher': ['reach'],
    'reachin': ['reach'],
    'reader': ['read'],
    'readin': ['read'],
    'realest': ['real'],
    'realism': ['real'],
    'rearview': ['rear', 'view'],
    'rearviewmirror': ['rear', 'view', 'mirror'],
    'rebirth': ['birth'],
    'receiver': ['receive'],
    'recharge': ['charge'],
    'recklezz': ['wreck'],
    'recoil': ['coil'],
    'redbone': ['red', 'bone'],
    'reddish': ['red'],
    'redeemer': ['reddem'],
    'redfoo': ['red', 'foo'],
    'redhead': ['red', 'head'],
    'redline': ['red', 'line'],
    'redman': ['red', 'man'],
    'redmercedes': ['red', 'mercedes'],
    'redneck': ['red', 'neck'],
    'rednex': ['red'],
    'redd': ['red'],
    'redlight': ['red', 'light'],
    'redone': ['red', 'one'],
    'redwood': ['red', 'wood'],
    'redwoods': ['red', 'wood'],
    'reefer': ['reef'],
    'reelin': ['reel'],
    'refill': ['fill'],
    'reflection': ['reflect'],
    'reflektor': ['reflector'],
    'reindeer': ['rein', 'deer'],
    'reintroduce': ['intro'],
    'rejjie': ['reggie'],
    'relaxation': ['relax'],
    'relaxer': ['relax'],
    'rem': ['r', 'e', 'm'],
    'reo': ['r', 'e', 'o'],
    'reoccurring': ['occur'],
    'replacements': ['replace'],
    'replay': ['play'],
    'republica': ['republic'],
    'rescuer': ['rescue'],
    'resignation': ['resign'],
    'respectful': ['respect'],
    'respectfully': ['respect'],
    'restless': ['rest'],
    'retirement': ['retire'],
    'retrograde': ['retro', 'grade'],
    'retrospect': ['retro', 'spect'],
    'returner': ['return'],
    'returnin': ['return'],
    'reup': ['up'],
    'revisit': ['visit'],
    'revisited': ['visit'],
    'revivalists': ['revival'],
    'revolucion': ['revolution'],
    'revolver': ['revolve'],
    'rewind': ['wind'],
    'rexx': ['rex'],
    'rey': ['ray'],
    'rezident': ['resident'],
    'rf': ['r', 'f'],
    'rfa': ['r', 'f', 'a'],
    'rfg': ['r', 'f', 'g'],
    'rftc': ['r', 'f', 't', 'c'],
    'rg': ['r', 'g '],
    'rgf': ['r', 'g', 'f'],
    'rgv': ['r', 'g', 'v'],
    'rhime': ['rhyme'],
    'rhinestone': ['rhine', 'stone'],
    'rhinoceros': ['rhino'],
    'rhinosaur': ['rhino', 'dino'],
    'ricky': ['rick'],
    'ricosuave': ['rico', 'suave'],
    'rider': ['ride'],
    'ridin': ['ride'],
    'rightside': ['right', 'side'],
    'riiich': ['rich'],
    'rik': ['rick'],
    'rikki': ['rick'],
    'ringer': ['ring'],
    'ringers': ['ring'],
    'ringin': ['ring'],
    'rip': ['rip', 'r', 'I', 'p'],
    'ripcord': ['rip', 'cord'],
    'ripp': ['rip'],
    'ripper': ['rip'],
    'rippin': ['rip'],
    'riptide': ['rip', 'tide'],
    'riser': ['rise'],
    'risin': ['rise'],
    'rittz': ['ritz'],
    'riverdale': ['river', 'dale'],
    'riverrun': ['river', 'run'],
    'riverside': ['river', 'side'],
    'rjd2': ['r', 'j', 'd', '2'],
    'rkcb': ['r', 'k', 'c', 'b'],
    'rl': ['r', 'l'],
    'rlumr': ['r', 'lum'],
    'rly': ['really'],
    'rm': ['r', 'm'],
    'rma': ['r', 'm', 'a'],
    'rmn': ['r', 'm', 'n'],
    'rmx': ['r', 'm', 'x'],
    'rnb': ['r', 'n', 'b'],
    'rnd1': ['round', '1'],
    'rnr': ['r', 'n'],
    'rnw@y': ['run', 'way'],
    'roadhouse': ['road', 'house'],
    'roadkill': ['road', 'kill'],
    'roadrunner': ['road', 'run'],
    'roadshow': ['road', 'show'],
    'roadside': ['road', 'side'],
    'roadsinger': ['road', 'sing'],
    'robb': ['rob'],
    'robber': ['rob'],
    'robbers': ['rob'],
    'robbery': ['rob'],
    'robbie': ['rob'],
    'robbin': ['rob'],
    'robby': ['rob'],
    'robert': ['rob'],
    'roberta': ['rob'],
    'robinette': ['robin'],
    'robinson': ['rob'],
    'robotaki': ['robot', 'taki'],
    'robyn': ['robin'],
    'rockabilly': ['rock', 'bill'],
    'rockabye': ['rock', 'bye'],
    'fanmail': ['fan', 'mail'],
    'rocker': ['rock'],
    'rocketeer': ['rocket'],
    'rocketship': ['rocket', 'ship'],
    'rockford': ['rock', 'ford'],
    'rockmaker': ['rock', 'make'],
    'rocko': ['rock'],
    'rockshow': ['rock', 'show'],
    'rockstar': ['rock', 'star'],
    'rokstarr': ['rock', 'star'],
    'rockstars': ['rock', 'star'],
    'rockwell': ['rock', 'well'],
    'rocky': ['rock'],
    'roddy': ['rod'],
    'rok': ['rock'],
    'rokker': ['rock'],
    'rokkin': ['rock'],
    'roller': ['roll'],
    'rollercoaster': ['roll', 'coast'],
    'rollin': ['roll'],
    'rollout': ['roll', 'out'],
    'rollz': ['roll'],
    'ronda': ['rhonda'],
    'ronnie': ['ron'],
    'ronny': ['ron'],
    'roo': ['kangaroo'],
    'rooftop': ['roof', 'top'],
    'rooftops': ['roof', 'top'],
    'rook1e': ['rookie'],
    'roomy': ['room'],
    'rootkit': ['root', 'kit'],
    'rootless': ['root'],
    'rosabeales': ['rosa'],
    'rosebud': ['rose', 'bud'],
    'rosegold': ['rose', 'gold'],
    'rosemary': ['rose', 'mary'],
    'rossdale': ['ross', 'dale'],
    'rotc': ['r', 'o', 't', 'c'],
    'rowboat': ['row', 'boat'],
    'rowin': ['row'],
    'royale': ['royal'],
    'royalty': ['royal'],
    'roze': ['rose'],
    'rozes': ['rose'],
    'rpg': ['r', 'p', 'g'],
    'rpm': ['r', 'p', 'm'],
    'rqqr': ['r', 'q'],
    'rrmbam': ['ram', 'bam'],
    'rrome': ['rome'],
    'rrose': ['rose'],
    'rrr1': ['r', '1'],
    'rss': ['r', 's'],
    'rstlne': ['r', 's', 't', 'l', 'n', 'e'],
    'rsxgld': ['rose', 'gold'],
    'rtc': ['r', 't', 'c'],
    'rubba': ['rubber'],
    'rubbaband': ['rubber', 'band'],
    'rubbabands': ['rubber', 'band'],
    'rubberbands': ['rubber', 'band'],
    'rubberband': ['rubber', 'band'],
    'rubberneck': ['rubber', 'neck'],
    'rubbin': ['rub'],
    'rubies': ['ruby'],
    'rudolf': ['rudolph'],
    'ruff': ['rough'],
    'ruffneck': ['rough', 'neck'],
    'rugrat': ['rug', 'rat'],
    'rugrats': ['rug', 'rat'],
    'rumbleseat': ['rumble', 'seat'],
    'rumorz': ['rumor'],
    'rumour': ['rumor'],
    'rumours': ['rumor'],
    'rumtum': ['rum', 'tum'],
    'runaround': ['run', 'round'],
    'runaway': ['run', 'away'],
    'runaways': ['run', 'away'],
    'runner': ['run'],
    'runners': ['run'],
    'runnin': ['run'],
    'rushin': ['rush'],
    'rushmore': ['rush', 'more'],
    'russian': ['russia'],
    'rustin': ['rust'],
    'rusty': ['rust'],
    'rvssian': ['russia'],
    'rvtchet': ['ratchet'],
    'rwm': ['r', 'w', 'm'],
    'rwnd': ['r', 'w', 'n', 'd', 'rewind'],
    'rwt': ['r', 'w', 't'],
    'rx': ['r', 'x'],
    'rxbbit': ['rabbit'],
    'ryder': ['ride'],
    's**t': ['shit'],
    'sacreligious': ['religion'],
    'sadder': ['sad'],
    'saddest': ['sade'],
    'sadnecessary': ['sad', 'necessary'],
    'sadness': ['sad'],
    'safetysuit': ['safety', 'suit'],
    'sahbabii': ['sah', 'baby'],
    'sailboat': ['sail', 'boat'],
    'sailin': ['sail'],
    'saltwater': ['salt', 'water'],
    'salty': ['salt'],
    'samantha': ['sam'],
    'sammie': ['sam'],
    'sammy': ['sam'],
    'samuel': ['sam'],
    'sanctified': ['sanctify'],
    'sandcastle': ['sand', 'castle'],
    'sandcastles': ['sand', 'castle'],
    'sandman': ['sand', 'man'],
    'sandy': ['sand'],
    'santanaworld': ['santana', 'world'],
    'santigold': ['santi', 'gold'],
    'sara': ['sarah'],
    'sassy': ['sass'],
    'satelllliiiiiiiteee': ['satelite'],
    'saturnalia': ['saturn'],
    'saturnz': ['saturn'],
    'saucey': ['sauce'],
    'saucy': ['sauce'],
    'saver': ['save'],
    'savin': ['save'],
    'say10': ['say', '1', '0'],
    'sayer': ['say'],
    'sayers': ['say'],
    'sayin': ['say'],
    'sbtrkt': ['s', 'b', 't', 'r', 'k'],
    'scandalous': ['scandal'],
    'scapegoat': ['scape', 'goat'],
    'scarecrow': ['scare', 'crow'],
    'scarface': ['scar', 'face'],
    'scarlord': ['scar', 'lord'],
    'scarlxrd': ['scar', 'lord'],
    'scary': ['scare'],
    'scentless': ['scent'],
    'schemin': ['scheme'],
    'schoolboy': ['school', 'boy'],
    'schoolgirl': ['school', 'girl'],
    'schoolhouse': ['school', 'house'],
    'schoolyard': ['school', 'yard'],
    'scientist': ['science'],
    'scientists': ['science'],
    'scooper': ['scoop'],
    'scoopin': ['scoop'],
    'scooter': ['scoot'],
    'scot': ['scott'],
    'scottie': ['scott'],
    'scottin': ['scoot'],
    'scotty': ['scott'],
    'scraper': ['scrape'],
    'scrapin': ['scrape'],
    'scrappy': ['scrap'],
    'scratchin': ['scratch'],
    'screamin': ['scream'],
    'scrubbin': ['scrub'],
    'scumbag': ['scum', 'bag'],
    'sd': ['s', 'd'],
    'sdib': ['s', 'd', 'I', 'b'],
    'sdot': ['s', 'dot'],
    'sdp': ['s', 'd', 'p'],
    'seaboard': ['sea', 'board'],
    'seafret': ['sea', 'fret'],
    'seagull': ['sea', 'gull'],
    'seagulls': ['sea', 'gull'],
    'seahorse': ['sea', 'horse'],
    'sealeg': ['sea', 'leg'],
    'sealegs': ['sea', 'leg'],
    'sealion': ['sea', 'lion'],
    'sean': ['shawn'],
    'seaport': ['sea', 'port'],
    'seaquest': ['sea', 'quest'],
    'searchlight': ['search', 'light'],
    'seashell': ['sea', 'shell'],
    'seashells': ['sea', 'shell'],
    'seashore': ['sea', 'shore'],
    'seasick': ['sea', 'sick'],
    'seaside': ['sea', 'side'],
    'seater': ['seat'],
    'secondhand': ['second', 'hand'],
    'secretly': ['secret'],
    'secretpath': ['secret', 'path'],
    'sectional': ['section'],
    'seein': ['see'],
    'seeker': ['seek'],
    'seekin': ['seek'],
    'seemingly': ['seem'],
    'selfie': ['self'],
    'selfies': ['self'],
    'selfish': ['self'],
    'selfmade': ['self', 'made'],
    'seller': ['sell'],
    'sellin': ['sell'],
    'semicharmed': ['semi', 'charm'],
    'semiconductor': ['semi', 'conduct'],
    'semisonic': ['semi', 'sonic'],
    'semisweet': ['semi', 'sweet'],
    'senator': ['senate'],
    'sender': ['send'],
    'sendin': ['send'],
    'sensitivity': ['sensitive'],
    'sept': ['september'],
    'server': ['serve'],
    'servin': ['serve'],
    'setbacks': ['set', 'back'],
    'setback': ['set', 'back'],
    'settin': ['set'],
    'seven': ['7'],
    'sevendust': ['seven', 'dust'],
    'sevenfold': ['7 fold'],
    'sevenn': ['7'],
    'seventeen': ['teen', '1', '7'],
    'seventy': ['seventy', '7', '0'],
    'sevyn': ['7'],
    'sexbomb': ['sex', 'bomb'],
    'sexier': ['sex'],
    'sexiest': ['sex'],
    'sexin': ['sex'],
    'sexplaylist': ['sex', 'play', 'list'],
    'sextape': ['sex', 'tape'],
    'sexting': ['sex', 'text'],
    'sexual': ['sex'],
    'sexx': ['sex'],
    'sexy': ['sex'],
    'sf9': ['s', 'f', '9'],
    'sfw': ['s', 'f', 'w'],
    'sga': ['s', 'g', 'a'],
    'sgt': ['sargent'],
    'sh!t': ['shit'],
    'sh*t': ['shit'],
    'shackin': ['shack'],
    'shadowboxin': ['shadow', 'box'],
    'shadowy': ['shadow'],
    'shady': ['shade'],
    'shaggin': ['shag'],
    'shaggy': ['shag'],
    'shakedown': ['shake', 'down'],
    'shaken': ['shake'],
    'shaker': ['shake'],
    'shakermaker': ['shake', 'make'],
    'shakewell': ['shake', 'well'],
    'shakey': ['shake'],
    'shakin': ['shake'],
    'shameless': ['shame'],
    'shamrock': ['sham', 'rock'],
    'shapin': ['shape'],
    'shaqisdope': ['shaq', 'is', 'dope'],
    'sharpe': ['sharp'],
    'shatterin': ['shatter'],
    'shaun': ['shawn'],
    'shc': ['s', 'h', 'c'],
    'shedaisy': ['she', 'daisy'],
    'shedontknowbutsheknows': ['she', 'dont', 'know', 'but'],
    'sheepdog': ['sheep', 'dog'],
    'sheepdogs': ['sheep', 'dog'],
    'sheldrake': ['sheld', 'rake'],
    'sheppard': ['shepherd'],
    'shinedown': ['shine', 'down'],
    'shiner': ['shine'],
    'shinin': ['shine'],
    'shipboard': ['ship', 'board'],
    'shipper': ['ship'],
    'shippin': ['ship'],
    'shitter': ['shit'],
    'shitty': ['shit'],
    'shiznit': ['shit'],
    'shjip': ['ship'],
    'shlomo': ['slow', 'mo'],
    'shocka': ['shock'],
    'shockandawe': ['shock', 'and', 'awe'],
    'shocker': ['shock'],
    'shockin': ['shock'],
    'shoecraft': ['shoe', 'craft'],
    'shogun': ['sho', 'gun'],
    'shooter': ['shoot'],
    'shooters': ['shoot'],
    'shootin': ['shoot'],
    'shoppe': ['shop'],
    'shopper': ['shop'],
    'shoppers': ['shop'],
    'shoppin': ['shop'],
    'shortie': ['short'],
    'shotgun': ['shot', 'gun'],
    'shotter': ['shot'],
    'shotters': ['shot'],
    'shotty': ['shot'],
    'shotz': ['shot'],
    'shoulda': ['should'],
    'shout2000': ['shout', '2', 'thousand', '0'],
    'shoutin': ['shout'],
    'showdown': ['show', 'down'],
    'showin': ['show'],
    'showman': ['show', 'man'],
    'shown': ['show'],
    'showtek': ['show', 'tech'],
    'showz': ['show'],
    'sht': ['s', 'h', 't', 'shit'],
    'shuga': ['sugar'],
    'shuttin': ['shut'],
    'shyne': ['shine'],
    'sicken': ['sick'],
    'sickest': ['sick'],
    'sickly': ['sick'],
    'sickness': ['sick'],
    'sidelines': ['side', 'line'],
    'sideline': ['side', 'line'],
    'sidewalk': ['side', 'walk'],
    'sidewalks': ['side', 'walk'],
    'sideways': ['side', 'way'],
    'sidewayz': ['side', 'way'],
    'sidez': ['side'],
    'sidnie': ['sidney'],
    'silencer': ['silence'],
    'silento': ['silent'],
    'silkk': ['silk'],
    'silppery': ['slip'],
    'silverado': ['silver'],
    'silverchair': ['silver', 'chair'],
    'silverfuck': ['silver', 'fuck'],
    'silverstein': ['silver'],
    'silversteins': ['silver'],
    'silversun': ['silver', 'sun'],
    'silvertounge': ['silver', 'tounge'],
    'simplicity': ['simple'],
    'simply': ['simple'],
    'simz': ['sim'],
    'sincewhen': ['since', 'when'],
    'singa': ['sing'],
    'singer': ['sing'],
    'singers': ['sing'],
    'singin': ['sing'],
    'sinker': ['sink'],
    'sinkin': ['sink'],
    'sinners': ['sin'],
    'sinner': ['sin'],
    'sinnerman': ['sin', 'man'],
    'sinz': ['sin'],
    'sippin': ['sip'],
    'sista': ['sister'],
    'sisterhood': ['sister', 'hood'],
    'sisterly': ['sister'],
    'sitta': ['sit'],
    'sitter': ['sit'],
    'sittin': ['sit'],
    'six': ['6'],
    'sixes': ['6'],
    'sixpence': ['6 pence'],
    'sixteen': ['teen', '1', '6'],
    'sixty': ['Sixty', '6', '0'],
    'sixx': ['6'],
    'sizin': ['size'],
    'sjur': ['s', 'j', 'u', 'r'],
    'sk8er': ['skate'],
    'skateaway': ['skate', 'away'],
    'skateboard': ['skate', 'board'],
    'skateboards': ['skate', 'board'],
    'skateboarder': ['skate', 'board'],
    'skater': ['skate'],
    'skaters': ['skate'],
    'skatin': ['skate'],
    'skies': ['sky'],
    'skillz': ['skill'],
    'skimask': ['ski', 'mask'],
    'skinhead': ['skin', 'head'],
    'skinheads': ['skin', 'head'],
    'skippa': ['skip'],
    'skipper': ['skip'],
    'skippin': ['skip'],
    'skir': ['skirt'],
    'skirr': ['skirt'],
    'skizzy': ['skiz'],
    'skool': ['school'],
    'skrew': ['screw'],
    'skrewed': ['screw'],
    'skrrt': ['skirt'],
    'skrt': ['skirt'],
    'skybar': ['sky', 'bar'],
    'skybird': ['sky', 'bird'],
    'skydive': ['sky', 'dive'],
    'skydiver': ['sky', 'dive'],
    'skydiving': ['sky', 'dive'],
    'skye': ['sky'],
    'skyfall': ['sky', 'fall'],
    'skylander': ['sky', 'land'],
    'skylar': ['sky'],
    'skyline': ['sky', 'line'],
    'skylit': ['sky', 'lit'],
    'skyscraper': ['sky', 'scrape'],
    'skywalker': ['sky', 'walk'],
    'skyway': ['sky', 'way'],
    'skywritter': ['sky', 'write'],
    'slammer': ['slam'],
    'slammin': ['slam'],
    'slamz': ['slam'],
    'slappin': ['slap'],
    'slater': ['slate'],
    'slaughterhouse': ['slaughter', 'house'],
    'slayer': ['slay'],
    'slayin': ['slay'],
    'sledgehammer': ['sledge', 'hammer'],
    'sleepdealer': ['sleep', 'deal'],
    'sleepdriving': ['sleep', 'drive'],
    'sleeper': ['sleep'],
    'sleepin': ['sleep'],
    'sleepus': ['sleep'],
    'sleepwalk': ['sleep', 'walk'],
    'sleepwalker': ['sleep', 'walk'],
    'sleepwalking': ['sleep', 'walk'],
    'sleepy': ['sleep'],
    'sleepyhead': ['sleep', 'head'],
    'sleepytime': ['sleep', 'time'],
    'slenderbodies': ['slender', 'body'],
    'slider': ['slide'],
    'slidin': ['slide'],
    'slightly': ['slight'],
    'sliink': ['slink'],
    'slimm': ['slim'],
    'slimy': ['slime'],
    'slipknot': ['slip', 'knot'],
    'slipper': ['slip'],
    'slippery': ['slip'],
    'slippin': ['slip'],
    'slipstream': ['slip', 'stream'],
    'slipz': ['slip'],
    'slotface': ['slot', 'face'],
    'slowdive': ['slow', 'dive'],
    'slowdown': ['slow', 'down'],
    'slowly': ['slow'],
    'slowmotion': ['slow', 'motion'],
    'sluggish': ['slug'],
    'slumday': ['slum', 'day'],
    'slumlord': ['slum', 'lord'],
    'slumville': ['slum', 'ville'],
    'slushii': ['slush'],
    'slutgarden': ['slut', 'garden'],
    'sluty': ['slut'],
    'smaller': ['small'],
    'smallest': ['small'],
    'smallpool': ['small', 'pool'],
    'smartphone': ['smart', 'phone'],
    'smasher': ['smash'],
    'smashin': ['smash'],
    'smashmouth': ['smash', 'mouth'],
    'smeller': ['smell'],
    'smellin': ['smell'],
    'smfwu': ['s', 'm', 'f', 'w', 'u'],
    'smiff': ['smith'],
    'smiley': ['smile'],
    'smilin': ['smile'],
    'smithfield': ['smith', 'field'],
    'smokepurpp': ['smoke', 'purple'],
    'smoker': ['smoke'],
    'smokestack': ['smoke', 'stack'],
    'smokey': ['smoke'],
    'smokie': ['smoke'],
    'smokin': ['smoke'],
    'smoky': ['smoke'],
    'smoochie': ['smooch'],
    'smyle': ['smile'],
    'smyth': ['smith'],
    'snackin': ['snack'],
    'snaggletooth': ['snaggle', 'tooth'],
    'snak': ['snack'],
    'snakecharmer': ['snake', 'charm'],
    'snakehips': ['snake', 'hip'],
    'snakez': ['snake'],
    'snapback': ['snap', 'back'],
    'snapchat': ['snap', 'chat'],
    'snappin': ['snap'],
    'snbrn': ['sun', 'burn'],
    'sneaker': ['sneak'],
    'sneakin': ['sneak'],
    'sniper': ['snipe'],
    'snny': ['sunny'],
    'snoopy': ['snoop'],
    'snootie': ['snoot'],
    'snowball': ['snow', 'ball'],
    'snowblind': ['snow', 'blind'],
    'snowboard': ['snow', 'board'],
    'snowcone': ['snow', 'cone'],
    'snowflake': ['snow', 'flake'],
    'snowin': ['snow'],
    'snowman': ['snow', 'man'],
    'snowmen': ['snow', 'men'],
    'snowmine': ['snow', 'mine'],
    'snowmobile': ['snow', 'mobile'],
    'snowship': ['snow', 'ship'],
    'snupe': ['snoop'],
    'sobbin': ['sob'],
    'sofi': ['sophie'],
    'sofia': ['sophia'],
    'softly': ['soft'],
    'soggy': ['sog'],
    'somebody': ['some', 'body'],
    'somehow': ['some', 'how'],
    'someone': ['some', '1'],
    'somethin': ['some', 'thing'],
    'something': ['some', 'thing'],
    'sometime': ['some', 'time'],
    'sometimes': ['some', 'time'],
    'somewhere': ['some', 'where'],
    'songbird': ['song', 'bird'],
    'songbook': ['song', 'book'],
    'songz': ['song'],
    'sonicflood': ['sonic', 'flood'],
    'sonreal': ['son', 'real'],
    'sos': ['s', 'o'],
    'souf': ['south'],
    'soulchild': ['soul', 'child'],
    'soulja': ['soldier'],
    'soulmate': ['soul', 'mate'],
    'soulshine': ['soul', 'shine'],
    'soulwax': ['soul', 'wax'],
    'soundboy': ['sound', 'boy'],
    'soundclash': ['sound', 'clash'],
    'soundcloud': ['sound', 'cloud'],
    'soundgarden': ['sound', 'garden'],
    'soundin': ['sound'],
    'soundprank': ['sound', 'prank'],
    'soundsystem': ['sound', 'system'],
    'soundtrack': ['sound', 'track'],
    'soundwave': ['sound', 'wave'],
    'soundz': ['sound'],
    'southbound': ['south', 'bound'],
    'southeast': ['south', 'east'],
    'southeastern': ['south', 'east'],
    'southern': ['south'],
    'southernplayalisticcadillacmuzik': ['south', 'play', 'Cadillac', 'music'],
    'southpaw': ['south', 'paw'],
    'southside': ['south', 'side'],
    'southwest': ['south', 'west'],
    'southwestern': ['south', 'west'],
    'spacecraft': ['space', 'craft'],
    'spaceghost': ['space', 'ghost'],
    'spacehog': ['space', 'hog'],
    'spaceman': ['space', 'man'],
    'spaceship': ['space', 'ship'],
    'spanish': ['spain'],
    'sparkin': ['spark'],
    'sparklin': ['sparkle'],
    'sparro': ['sparrow'],
    'sparxxx': ['spark'],
    'spazzin': ['spaz'],
    'spazzn': ['spaz'],
    'speaker': ['speak'],
    'speakers': ['speak'],
    'speakerbox': ['speak', 'box'],
    'speakin': ['spean'],
    'spearhead': ['spear', 'head'],
    'spearmint': ['spear', 'mint'],
    'speechless': ['speech'],
    'speedin': ['speed'],
    'speedwagon': ['speed', 'wagon'],
    'speedway': ['speed', 'way'],
    'speedy': ['speed'],
    'spekrfrek': ['speak', 'freak'],
    'spender': ['spend'],
    'spendin': ['spend'],
    'spiceworld': ['spice', 'world'],
    'spicy': ['spice'],
    'spiderbite': ['spider', 'bite'],
    'spiderhead': ['spider', 'head'],
    'spiderman': ['spider', 'man'],
    'spiderweb': ['spider', 'web'],
    'spinderella': ['spin', 'cinderella'],
    'spinnin': ['spin'],
    'spinners': ['spin'],
    'spinner': ['spin'],
    'spiritesque': ['spirit'],
    'spiritualized': ['spiritual'],
    'spitta': ['spit'],
    'spitter': ['spit'],
    'spittin': ['spit'],
    'splithoff': ['split', 'hoff'],
    'spoken': ['spoke'],
    'spongebob': ['sponge', 'bob'],
    'spooky': ['spook'],
    'spoonful': ['spoon', 'full'],
    'spoonman': ['spoon', 'man'],
    'sportscaster': ['sport', 'cast'],
    'sportscenter': ['sport', 'center'],
    'sportsman': ['sport', 'man'],
    'sportsmanship': ['sport', 'man'],
    'spotless': ['spot'],
    'spottieottiedopalicious': ['spot', 'dope'],
    'spottin': ['spot'],
    'sprayin': ['spray'],
    'springbreak': ['spring', 'break'],
    'springtime': ['spring', 'time'],
    'squeezin': ['squeeze'],
    'sr': ['senior', 's', 'r'],
    'srsly': ['serious'],
    'ss': ['s'],
    'ssega': ['sega'],
    'sshh': ['shh'],
    'sshhii': ['shh'],
    'ssj3': ['s', 'j', '3'],
    'sss': ['s'],
    'ssss': ['s'],
    'st': ['saint'],
    'stabbin': ['stab'],
    'stackin': ['stack'],
    'stacys': ['stacy'],
    'stainless': ['stain'],
    'staircase': ['stair', 'case'],
    'stairfoot': ['stair', 'foot'],
    'stairstep': ['stair', 'step'],
    'stairsteps': ['stair', 'step'],
    'stairway': ['stair', 'way'],
    'stalker': ['stalk'],
    'stalkers': ['stalk'],
    'stalkin': ['stalk'],
    'stander': ['stand'],
    'standin': ['stand'],
    'starbender': ['star', 'bend'],
    'starbenders': ['star', 'bend'],
    'Starbuck': ['star', 'buck'],
    'starbucks': ['star', 'buck'],
    'starburst': ['star', 'burst'],
    'starbursts': ['star', 'burst'],
    'starchild': ['star', 'child'],
    'starcrawler': ['star', 'crawl'],
    'starcrawlers': ['star', 'crawl'],
    'stardust': ['star', 'dust'],
    'stargate': ['star', 'gate'],
    'stargaze': ['star', 'gaze'],
    'stargazer': ['star', 'gaze'],
    'stargazing': ['star', 'gaze'],
    'starland': ['star', 'land'],
    'starley': ['star'],
    'starlight': ['star', 'light'],
    'starlito': ['star', 'lito'],
    'starman': ['star', 'man'],
    'starr': ['star'],
    'starrah': ['star'],
    'starro': ['star', 'ro'],
    'starry': ['star'],
    'starsailor': ['star', 'sail'],
    'starset': ['star', 'set'],
    'starshine': ['star', 'shine'],
    'starship': ['star', 'ship'],
    'starships': ['star', 'ship'],
    'starstruck': ['star', 'struck'],
    'starstrukk': ['star', 'struck'],
    'starter': ['start'],
    'starters': ['start'],
    'startin': ['start'],
    'starvin': ['starve'],
    'starwave': ['star', 'wave'],
    'starwood': ['star', 'wood'],
    'stateless': ['state'],
    'stately': ['state'],
    'statesboro': ['state', 'boro'],
    'stax': ['stack'],
    'staxx': ['stack'],
    'stayin': ['stay'],
    'steadier': ['steady'],
    'stealer': ['steal'],
    'stealers': ['steal'],
    'steamers': ['steam'],
    'steamer': ['steam'],
    'steamroller': ['steam', 'roll'],
    'steamrollers': ['steam', 'roll'],
    'steamy': ['steam'],
    'steeldriver': ['steel', 'drive'],
    'steeldrivers': ['steel', 'drive'],
    'steppenwolf': ['step', 'wolf'],
    'stepper': ['step'],
    'steppin': ['step'],
    'stereophonic': ['stereo', 'phonic'],
    'stereophonics': ['stereo', 'phonic'],
    'stereotype': ['stereo', 'type'],
    'stereotypes': ['stereo', 'type'],
    'steven': ['steve'],
    'stevens': ['steve'],
    'stevie': ['steve'],
    'stickin': ['stick'],
    'stickwitu': ['stick', 'with', 'u'],
    'makedamnsure': ['make', 'damn', 'sure'],
    'sticky': ['stick'],
    'stingin': ['sting'],
    'stirling': ['sterling'],
    'stix': ['stick'],
    'stockade': ['stock', 'ade'],
    'stolen': ['stole'],
    'stompin': ['stomp'],
    'stonecutter': ['stone', 'cut'],
    'stonecutters': ['stone', 'cut'],
    'stoner': ['stone'],
    'stoney': ['stone'],
    'stoopid': ['stupid'],
    'stopper': ['stop'],
    'stoppers': ['stop'],
    'stoppin': ['stop'],
    'stories': ['story'],
    'stormbringer': ['storm', 'bring'],
    'stormy': ['storm'],
    'streamer': ['stream'],
    'streamers': ['stream'],
    'stormzy': ['storm'],
    'storybook': ['story', 'book'],
    'storybooks': ['story', 'book'],
    'storyline': ['story', 'line'],
    'storyteller': ['story', 'tell'],
    'storytellin': ['story', 'tell'],
    'storytelling': ['story', 'tell'],
    'stp': ['s', 't', 'p'],
    'straange': ['strange'],
    'straighter': ['straight'],
    'strangehold': ['strange', 'hold'],
    'strangelove': ['strange', 'love'],
    'stranger': ['strange'],
    'strangest': ['strange'],
    'strawberry': ['straw', 'berry'],
    'strawberries': ['straw', 'berry'],
    'streetcar': ['street', 'car'],
    'streetlight': ['street', 'light'],
    'streetlights': ['street', 'light'],
    'streetz': ['street'],
    'stressed': ['stress'],
    'stretcher': ['stretch'],
    'strfkr': ['s', 't', 'r', 'f', 'k'],
    'strickin': ['strick'],
    'stripper': ['strip'],
    'strippers': ['strip'],
    'strobelite': ['strobe', 'light'],
    'strobelites': ['strobe', 'light'],
    'strollin': ['stroll'],
    'stronger': ['strong'],
    'strongest': ['strong'],
    'struggler': ['struggle'],
    'strugglin': ['struggle'],
    'strumbella': ['strum', 'bella'],
    'strumbellas': ['strum', 'bella'],
    'strutnut': ['strut', 'nut'],
    'stryke': ['strike'],
    'stuffer': ['stuff'],
    'stuffin': ['stuff'],
    'stunna': ['stunt'],
    'stuntin': ['stunt'],
    'stupead': ['stupid'],
    'stupider': ['stupid'],
    'stupidest': ['stupid'],
    'stupidity': ['stupid'],
    'stupify': ['stupid'],
    'stylistics': ['style'],
    'styrofoam': ['styro', 'foam'],
    'styx': ['stick'],
    'sublime': ['sub'],
    'submarine': ['sub', 'marine'],
    'submarines': ['sub', 'marine'],
    'submerge': ['sub', 'merge'],
    'suburbia': ['suburb'],
    'subway': ['sub', 'way'],
    'sucker': ['suck'],
    'suckers': ['suck'],
    'suckerz': ['suck'],
    'suckin': ['suck'],
    'suddenly': ['sudden'],
    'suga': ['suger'],
    'sugarcult': ['sugar', 'cult'],
    'sugarhill': ['sugar', 'hill'],
    'sugarland': ['sugar', 'land'],
    'sugary': ['sugar'],
    'suicidal': ['suicide'],
    'suicideboys': ['suicide', 'boy'],
    'suicideyear': ['suicide', 'year'],
    'suitcase': ['suit', 'case'],
    'summatime': ['summer', 'time'],
    'summerdaze': ['summer', 'daze'],
    'summerland': ['summer', 'land'],
    'summertime': ['summer', 'time'],
    'sunbird': ['sun', 'bird'],
    'sunbreak': ['sun', 'break'],
    'sunburn': ['sun', 'burn'],
    'sunburnt': ['sun', 'burn'],
    'sundae': ['sunday'],
    'sundayfunday': ['Sunday', 'fun', 'day'],
    'sundaze': ['sun', 'daze'],
    'sundown': ['sun', 'down'],
    'sundy': ['sunday'],
    'sunflowers': ['sun', 'flower'],
    'sunflower': ['sun', 'flower'],
    'sunglasses': ['sun', 'glass'],
    'sunny': ['sun'],
    'sunray': ['sun', 'ray'],
    'sunrays': ['sun', 'ray'],
    'sunrise': ['sun', 'rise'],
    'sunrises': ['sun', 'rise'],
    'sunroof': ['sun', 'roof'],
    'sunroom': ['sun', 'room'],
    'sunset': ['sun', 'set'],
    'sunsets': ['sun', 'set'],
    'sunsetz': ['sun', 'set'],
    'sunshine': ['sun', 'shine'],
    'sunshower': ['sun', 'shower'],
    'sunshowers': ['sun', 'shower'],
    'sunsick': ['sun', 'sick'],
    'sunspot': ['sun', 'spot'],
    'sunspots': ['sun', 'spot'],
    'sunup': ['sun', 'up'],
    'supa': ['super'],
    'supafly': ['super', 'fly'],
    'supafreak': ['super', 'freak'],
    'supastar': ['super', 'star'],
    'super8': ['super', '8'],
    'superduperhero': ['super', 'duper', 'hero'],
    'superface': ['super', 'face'],
    'superfast': ['super', 'fast'],
    'superficial': ['super'],
    'superfruit': ['super', 'fruit'],
    'supergrass': ['super', 'grass'],
    'superhero': ['super', 'hero'],
    'superheroes': ['super', 'hero'],
    'superhouse': ['super', 'house'],
    'superlit': ['super', 'lit'],
    'superlove': ['super', 'love'],
    'superman': ['super', 'man'],
    'supermarket': ['super', 'market'],
    'supermarkets': ['super', 'market'],
    'supermassive': ['super', 'massive'],
    'supermodel': ['super', 'model'],
    'supermodels': ['super', 'model'],
    'supernatural': ['super', 'natural'],
    'supernaut': ['super', 'naut'],
    'supernovas': ['super', 'nova'],
    'supernova': ['super', 'nova'],
    'superorganism': ['super', 'organism'],
    'superorganisms': ['super', 'organism'],
    'superparka': ['super', 'parka'],
    'supersoaker': ['super', 'soak'],
    'superstition': ['super'],
    'supertramp': ['super', 'tramp'],
    'superunknown': ['super', 'known'],
    'superwoman': ['super', 'woman'],
    'supplier': ['supply'],
    'suppliers': ['supply'],
    'supplies': ['supply'],
    'supporter': ['support'],
    'surefire': ['sure', 'fire'],
    'surfbum': ['surf', 'bum'],
    'surfer': ['surf'],
    'surfers': ['surf'],
    'surfin': ['surf'],
    'survival': ['survive'],
    'survivor': ['survive'],
    'survivors': ['survive'],
    'suzie': ['susie'],
    'suzy': ['susie'],
    'svdden': ['sudden'],
    'swae': ['sway'],
    'swagga': ['swag'],
    'swaggin': ['swag'],
    'swagon': ['s', 'wagon'],
    'swalla': ['swallow'],
    'swang': ['swing'],
    'swangin': ['swing'],
    'swankiest': ['swanky'],
    'swayin': ['sway'],
    'sweatpants': ['sweat', 'pants'],
    'sweatshirt': ['sweat', 'shirt'],
    'sweatsuit': ['sweat', 'suit'],
    'swedish': ['swede'],
    'sweepling': ['sweep'],
    'sweeter': ['sweet'],
    'sweetest': ['sweet'],
    'sweethearts': ['sweet', 'heart'],
    'sweetheart': ['sweet', 'heart'],
    'sweetie': ['sweet'],
    'sweetly': ['sweet'],
    'swimm': ['swim'],
    'swimmer': ['swim'],
    'swimmers': ['swim'],
    'swimmin': ['swim'],
    'swinger': ['swing'],
    'swingers': ['swing'],
    'swingin': ['swing'],
    'swingtown': ['swing', 'town'],
    'swisha': ['swish'],
    'swishas': ['swish'],
    'swisher': ['swish'],
    'switchfoot': ['switch', 'foot'],
    'swizz': ['swiss'],
    'swollen': ['swoll'],
    'swv': ['s', 'w', 'v'],
    'syd': ['sid'],
    'sykler': ['sky'],
    'sylk': ['silk'],
    'symbolic': ['symbol'],
    'symbolism': ['symbol'],
    'symbolistic': ['symbol'],
    'symbolizing': ['symbol'],
    'syml': ['s', 'y', 'm', 'l'],
    'tacky': ['tack'],
    'tacopablow': ['taco', 'pablo'],
    'tadpoles': ['tad', 'pole'],
    'tadpole': ['tad', 'pole'],
    'tailfeather': ['tail', 'feather'],
    'tailgate': ['tail', 'gate'],
    'tailgates': ['tail', 'gate'],
    'taillight': ['tail', 'light'],
    'taillights': ['tail', 'light'],
    'tailspin': ['tail', 'spin'],
    'tailwhip': ['tail', 'whip'],
    'taken': ['take'],
    'taker': ['take'],
    'takin': ['take'],
    'talker': ['talk'],
    'talkin': ['talk'],
    'talky': ['talk'],
    'taller': ['tall'],
    'tallest': ['tall'],
    'tammi': ['tammy'],
    'tanker': ['tank'],
    'tanline': ['tan', 'line'],
    'tanlines': ['tan', 'line'],
    'taper': ['tape'],
    'tapeworm': ['tape', 'worm'],
    'tapout': ['tap', 'out'],
    'taxman': ['tax', 'man'],
    'tayk': ['tay', 'k'],
    'tb': ['t', 'b'],
    'tba': ['t', 'b', 'a'],
    'tbd': ['t', 'b', 'd'],
    'tbh': ['t', 'b', 'h'],
    'tbt': ['t', 'b'],
    'tcts': ['t', 'c', 's'],
    'td': ['t', 'd'],
    'tdot': ['t', 'dot'],
    'teacher': ['teach'],
    'teachers': ['teach'],
    'teachin': ['teach'],
    'teacups': ['tea', 'cup'],
    'teacup': ['tea', 'cup'],
    'teapot': ['tea', 'pot'],
    'teardrop': ['tear', 'drop'],
    'teardrops': ['tear', 'drop'],
    'teary': ['tear'],
    'teaspoon': ['tea', 'spoon'],
    'technically': ['technical'],
    'technicolour': ['tech', 'color'],
    'technologic': ['techno', 'logic'],
    'technotronic': ['techno'],
    'teddy': ['ted'],
    'teecee4800': ['tee', 'cee', '4', '8', '0'],
    'teenage': ['teen', 'age'],
    'teenager': ['teen', 'age'],
    'teenagers': ['teen', 'age'],
    'teetroit': ['tee', 'detroit'],
    'telegraph': ['tele', 'graph'],
    'telephone': ['tele', 'phone'],
    'telephones': ['tele', 'phone'],
    'telephono': ['phone'],
    'telescope': ['tele', 'scope'],
    'television': ['tv'],
    'teller': ['tell'],
    'tellin': ['tell'],
    'tempature': ['temp'],
    'temporarily': ['temporary'],
    'temptation': ['tempt'],
    'temptin': ['tempt'],
    'tenderly': ['tender'],
    'tenderness': ['tender'],
    'tengo': ['tango'],
    'terence': ['terrance'],
    'termination': ['terminate'],
    'terminator': ['terminate'],
    'terraform': ['terra', 'form'],
    'terrified': ['terrify'],
    'territories': ['territory'],
    'terrorson': ['terror', 'son'],
    'tester': ['test'],
    'testified': ['testify'],
    'testin': ['test'],
    'textin': ['text'],
    'texxxas': ['texas'],
    'tf': ['t', 'f'],
    'tf29': ['t', 'f', '2', '9'],
    'tfboys': ['t', 'f', 'boy'],
    'tfd': ['t', 'f', 'd'],
    'tg': ['t', 'g'],
    'tg3': ['t', 'g', '3'],
    'tg4m': ['t', 'g', '4', 'm'],
    'tgif': ['t', 'g', 'I', 'f'],
    'tha': ['the'],
    'thanksgiving': ['thank', 'give'],
    'thatll': ['that'],
    'thatpower': ['that', 'power'],
    'thats': ['that'],
    'theinternetisforever': ['the', 'internet', 'is', 'for', 'ever'],
    'themind': ['the', 'mind'],
    'themselves': ['them', 'self'],
    'theories': ['theory'],
    'thereof': ['there', 'of'],
    'theres': ['there'],
    'thesoundyouneed': ['the', 'sound', 'you', 'need'],
    'theyll': ['they'],
    'thicke': ['thick'],
    'thicker': ['thick'],
    'thickest': ['thick'],
    'thickfreakness': ['thick', 'freak'],
    'thickness': ['thick'],
    'thieves': ['thief'],
    'thinkable': ['think'],
    'thinker': ['think'],
    'thinkin': ['think'],
    'thinner': ['thin'],
    'thinnest': ['thin'],
    'thirsty': ['thirst'],
    'thirteen': ['teen', '1', '3'],
    'thirty': ['thirty', '3', '0'],
    'thirtyrack': ['thirty', '3', '0', 'rack'],
    'thiskidsnotalright': ['this', 'kid', 'not', 'alright'],
    'thnks': ['thank'],
    'thornhill': ['thorn', 'hill'],
    'thorny': ['thorn'],
    'thorogood': ['thorough', 'good'],
    'thot': ['thought'],
    'thoughtless': ['thought'],
    'thoughtz': ['thought'],
    'thr33': ['3'],
    'thrashin': ['trash'],
    'three': ['3'],
    'thriller': ['thrill'],
    'throwback': ['throw', 'back'],
    'throwdown': ['throw', 'down'],
    'thru': ['through'],
    'thunderstorming': ['thunder', 'storm'],
    'thuggish': ['thug'],
    'thugz': ['thug'],
    'thumbin': ['thumb'],
    'thumper': ['thump'],
    'thunderbird': ['thunder', 'bird'],
    'thunderbolt': ['thunder', 'bolt'],
    'thunderbolts': ['thunder', 'bolt'],
    'thundercat': ['thunder', 'cat'],
    'thunderpussy': ['thunder', 'pussy'],
    'thunderstorm': ['thunder', 'storm'],
    'thunderstorms': ['thunder', 'storm'],
    'thunderstruck': ['thunder', 'struck'],
    'thurr': ['there'],
    'ti': ['t', 'i'],
    'ticker': ['tick'],
    'ticketron': ['ticket'],
    'tickin': ['tick'],
    'tideray': ['tide', 'ray'],
    'tiffanys': ['tiffany'],
    'tigertown': ['tiger', 'town'],
    'tighter': ['tight'],
    'tightrope': ['tight', 'rope'],
    'tik': ['tick'],
    'till': ['til'],
    'tillerman': ['till', 'man'],
    'timbaland': ['timber', 'land'],
    'timberlake': ['timber', 'lake'],
    'timberland': ['timber', 'land'],
    'timberwolf': ['timber', 'wolf'],
    'timebomb': ['time', 'bomb'],
    'timeflies': ['time', 'fly'],
    'timeless': ['time'],
    'timeline': ['time', 'line'],
    'timely': ['time'],
    'timer': ['time'],
    'timeshare': ['time', 'share'],
    'timmy': ['tim'],
    'timothy': ['tim'],
    'tinfoil': ['tin', 'foil'],
    'tipp': ['tip'],
    'tipper': ['tip'],
    'tippin': ['tip'],
    'tiptoe': ['tip', 'toe'],
    'tiptoein': ['tip', 'toe'],
    'tiptoen': ['tip', 'toe'],
    'tity': ['tit'],
    'tj': ['t', 'j'],
    'tjr': ['t', 'j', 'r'],
    'tk': ['t', 'k'],
    'tko': ['t', 'k', 'o'],
    'tlc': ['t', 'l', 'c'],
    'tm88': ['t', 'm', '8'],
    'tmwyw': ['t', 'm', 'w', 'y'],
    'tn': ['t', 'n', 'tennessee'],
    'tnght': ['tonight'],
    'tnk': ['t', 'n', 'k'],
    'unlv': ['u', 'n', 'l', 'v'],
    'tnt': ['t', 'n'],
    'tnz': ['tune', 't', 'n', 'z'],
    'toadally': ['toad'],
    'toadies': ['toad'],
    'tobaccy': ['tobacco'],
    'tobymac': ['toby', 'mack'],
    'tok': ['tock'],
    'tokio': ['tokyo'],
    'tomahawk': ['hawk'],
    'tomboy': ['tom', 'boy'],
    'tommie': ['tom'],
    'tommy': ['tom'],
    'tomorrowland': ['tomorrow', 'land'],
    'toni': ['tony'],
    'tonite': ['tonight'],
    'toonz': ['toon'],
    'toothbrush': ['tooth', 'brush'],
    'toothgrinder': ['tooth', 'grind'],
    'toothgrinders': ['tooth', 'grind'],
    'toothpaste': ['tooth', 'paste'],
    'toploader': ['top', 'load'],
    'topshelf': ['top', 'shelf'],
    'topsoil': ['top', 'soil'],
    'topz': ['top'],
    'tory': ['torey'],
    'tori': ['torey'],
    'touchdown': ['touch', 'down'],
    'touchin': ['touch'],
    'touchy': ['touch'],
    'tougher': ['tough'],
    'tourist': ['tour'],
    'tourists': ['tour'],
    'towdown': ['tow', 'down'],
    'townes': ['town'],
    'townshend': ['town', 'shend'],
    'township': ['town', 'ship'],
    'toxicity': ['toxic'],
    'tp': ['t', 'p'],
    'tpau': ['t', 'pau'],
    'tpr': ['t', 'p', 'r'],
    'tq': ['t', 'q'],
    'tqm': ['t', 'q', 'm'],
    'tqx': ['t', 'q', 'x'],
    'trackd': ['track'],
    'trackz': ['track'],
    'trademark': ['trade', 'mark'],
    'trader': ['trade'],
    'tradin': ['trade'],
    'trae': ['trey'],
    'tragedies': ['tragedy'],
    'trail$': ['trail'],
    'trailerhood': ['trailer', 'hood'],
    'trainsong': ['train', 'song'],
    'trainwreck': ['train', 'wreck'],
    'trammp': ['tramp'],
    'trammps': ['tramp'],
    'tramplin': ['trample'],
    'tranquility': ['tranquil'],
    'tranquillo': ['tranquil'],
    'transatlanticism': ['trans', 'atlantic'],
    'transform': ['trans', 'form'],
    'transforms': ['trans', 'form'],
    'transformation': ['trans', 'form'],
    'transformer': ['trans', 'form'],
    'transformers': ['trans', 'form'],
    'transit22': ['transit', 'twenty', '2'],
    'translee': ['trans', 'lee'],
    'transportation': ['transpor'],
    'transporter': ['transport'],
    'transportin': ['transport'],
    'trapanese': ['trap'],
    'traphouse': ['trap', 'house'],
    'trappa': ['trap'],
    'trapper': ['trap'],
    'trappin': ['trap'],
    'trashbag': ['trash', 'bag'],
    'trashbags': ['trash', 'bag'],
    'trashcan': ['trash', 'can'],
    'trashcans': ['trash', 'can'],
    'trashin': ['trash'],
    'trashmen': ['trash', 'men'],
    'trashy': ['trash'],
    'traumatic': ['trauma'],
    'traumatize': ['trauma'],
    'traumatized': ['trauma'],
    'traveler': ['travel'],
    'travelers': ['travel'],
    'travelin': ['travel'],
    'travi$': ['travis'],
    'treasury': ['treasure'],
    'tree63': ['tree', '6 3'],
    'trenches': ['trench'],
    'trenchtown': ['trench', 'town'],
    'treyy': ['trey'],
    'tribalist': ['tribal'],
    'trickaz': ['trick'],
    'trickin': ['trick'],
    'trickster': ['trick'],
    'tricksters': ['trick'],
    'tricky': ['trick'],
    'tried': ['try'],
    'tries': ['try'],
    'trikk': ['trick'],
    'trillville': ['trill'],
    'tripp': ['trip'],
    'tripper': ['trip'],
    'trippie': ['trip'],
    'trippin': ['trip'],
    'trippy': ['trip'],
    'trophies': ['trophy'],
    'tropicala': ['tropical'],
    'troublemaker': ['trouble', 'make'],
    'troublemakers': ['trouble', 'make'],
    'troupers': ['trooper'],
    'trouper': ['trooper'],
    'troye': ['troy'],
    'trst': ['trust'],
    'truckaroo': ['truck'],
    'trucker': ['truck'],
    'truckers': ['truck'],
    'truckin': ['truck'],
    'truthfully': ['truth'],
    'trxye': ['troy'],
    'tryin': ['try'],
    'tryna': ['try'],
    'tryout': ['try', 'out'],
    'ts': ['t'],
    'tshirt': ['t', 'shirt'],
    'ttd': ['t', 'd'],
    'ttg': ['t', 'g'],
    'ttm': ['t', 'm'],
    'ttyl': ['t', 't', 'y', 'l'],
    'tubthumping': ['tub', 'thump'],
    'tucker': ['tuck'],
    'tuckin': ['tuck'],
    'tuh': ['to'],
    'tukker': ['tuck'],
    'tumblin': ['tumble'],
    'tunez': ['tune'],
    'turnin': ['turn'],
    'turnit': ['turn', 'it'],
    'turnovers': ['turn', 'over'],
    'turnover': ['turn', 'over'],
    'turnpike': ['turn', 'pike'],
    'turnt': ['turn'],
    'turntables': ['turn', 'table'],
    'turntable': ['turn', 'table'],
    'turtledoves': ['turtle', 'dove'],
    'tuvaband': ['tuva', 'band'],
    'tvc': ['t', 'v', 'c'],
    'tw': ['t', 'w'],
    'twangin': ['twang'],
    'twangy': ['twang'],
    'twelve': ['1', '2'],
    'twelveyy': ['twelve'],
    'twenty': ['twenty', '2', '0'],
    'twerkit': ['twerk', 'it'],
    'twinbow': ['twin', 'bow'],
    'twinbows': ['twin', 'bow'],
    'twista': ['twist'],
    'twister': ['twist'],
    'twistin': ['twist'],
    'twiztid': ['twist'],
    'two': ['2'],
    'twrk': ['twerk'],
    'tx': ['t', 'x', 'texas'],
    'txny': ['tiny'],
    'txtin': ['text'],
    'tyde': ['tide'],
    'Tyme': ['time'],
    'tymers': ['time'],
    'u2': ['u', '2'],
    'uae': ['u', 'a', 'e'],
    'ub40': ['u', 'b', '4 0 forty'],
    'uberjackd': ['uber', 'jack'],
    'udwn': ['u', 'down'],
    'uestlove': ['quest', 'love'],
    '?uestlove': ['quest', 'love'],
    'ufo': ['u', 'f', 'o'],
    'ugk': ['u', 'g', 'k'],
    'ugotme': ['u', 'got', 'me'],
    'uhaul': ['u', 'haul'],
    'uk': ['u', 'k'],
    'uknowhowwedu': ['u', 'know', 'how', 'we', 'do'],
    'ult': ['u', 'l', 't'],
    'ultralife': ['ultra', 'life'],
    'ultralight': ['ultra', 'light'],
    'ultravox': ['ultra', 'vox'],
    'umfang': ['um', 'fang'],
    'unapologetic': ['apologetic'],
    'unappeciative': ['appreciate'],
    'unappreciated': ['appreciate'],
    'unapproachable': ['approach'],
    'unapproved': ['approve'],
    'unbelieve': ['believe'],
    'unbeliever': ['believe'],
    'unbelievers': ['believe'],
    'unborn': ['born'],
    'unbound': ['bound'],
    'unbreak': ['break'],
    'unbreakable': ['break'],
    'unbroken': ['broke'],
    'unc': ['uncle'],
    'uncaged': ['cage'],
    'uncertain': ['certain'],
    'unchained': ['chain'],
    'unchanged': ['change'],
    'uncharted': ['chart'],
    'uncommon': ['common'],
    'unconditional': ['condition'],
    'unconditionally': ['condition'],
    'unda': ['under'],
    'undead': ['dead'],
    'undecided': ['decide'],
    'undefeated': ['defeat'],
    'undefined': ['define'],
    'undercover': ['under', 'cover'],
    'undercurrent': ['under', 'current'],
    'undercurrents': ['under', 'current'],
    'underdog': ['under', 'dog'],
    'underdogs': ['under', 'dog'],
    'underdressed': ['under', 'dress'],
    'underfoot': ['under', 'foot'],
    'undergo': ['under', 'go'],
    'underground': ['under', 'ground'],
    'underneath': ['under', 'neath'],
    'underoath': ['under', 'oath'],
    'understand': ['under', 'stand'],
    'understood': ['under', 'stood'],
    'undertake': ['under', 'take'],
    'undertaker': ['under', 'take'],
    'undertale': ['under', 'tale'],
    'undertone': ['under', 'tone'],
    'undertow': ['under', 'tow'],
    'underwater': ['under', 'water'],
    'underway': ['under', 'way'],
    'underwear': ['under', 'wear'],
    'underwood': ['under', 'wood'],
    'underworld': ['under', 'world'],
    'undimmed': ['dim'],
    'undisclosed': ['disclose'],
    'undisputed': ['dispute'],
    'undo': ['do'],
    'undone': ['done'],
    'undress': ['dress'],
    'unequal': ['equal'],
    'unexpected': ['expect'],
    'unfair': ['fair'],
    'unfaithful': ['faith'],
    'unfamiliar': ['familiar'],
    'unfazed': ['faze'],
    'unfinished': ['finish'],
    'unfold': ['fold'],
    'unfollow': ['follow'],
    'unforgettable': ['forget'],
    'unforgiven': ['forgive'],
    'ungrateful': ['grateful'],
    'unhappy': ['happy'],
    'unholy': ['holy'],
    'uninvited': ['invite'],
    'universally': ['universal'],
    'unkind': ['kind'],
    'unkinder': ['kind'],
    'unknown': ['know'],
    'unlawful': ['law'],
    'unlike': ['like'],
    'unluck': ['luck'],
    'unlucky': ['luck'],
    'unmistakable': ['mistake'],
    'unplanned': ['plan'],
    'unplugged': ['plug'],
    'unpretty': ['pretty'],
    'unraveling': ['ravel'],
    'unsaid': ['said'],
    'unseen': ['seen'],
    'unsent': ['sent'],
    'unsexy': ['sex'],
    'unskinny': ['skinny'],
    'unspecial': ['special'],
    'unspoiled': ['spoil'],
    'unstoppable': ['stop'],
    'untamed': ['tame'],
    'untangle': ['tangle'],
    'untangled': ['tangle'],
    'unthought': ['thought'],
    'untidy': ['tidy'],
    'until': ['til'],
    'untitled': ['title'],
    'untouchable': ['touch'],
    'untouched': ['touch'],
    'untrue': ['true'],
    'unwed': ['wed'],
    'unwell': ['well'],
    'unwind': ['wind'],
    'unwinds': ['wind'],
    'unwritten': ['write'],
    'upbeat': ['up', 'beat'],
    'upchurch': ['up', 'church'],
    'upgrade': ['up', 'grade'],
    'upgrades': ['up', 'grade'],
    'uphill': ['up', 'hill'],
    'upp': ['up'],
    'upper': ['up'],
    'uppers': ['up'],
    'upperdeck': ['up', 'deck'],
    'upright': ['up', 'right'],
    'uprising': ['up', 'rise'],
    'uproar': ['up', 'roar'],
    'upset': ['up', 'set'],
    'upsetting': ['up', 'set'],
    'upside': ['up', 'side'],
    'upstairs': ['up', 'stair'],
    'upstate': ['up', 'state'],
    'uptight': ['up', 'tight'],
    'uptown': ['up', 'town'],
    'ur': ['your'],
    'us3': ['u', 's', '3'],
    'usa': ['u', 's', 'a'],
    'usda': ['u', 's', 'd', 'a'],
    'used': ['use'],
    'users': ['use'],
    'user': ['use'],
    'using': ['use'],
    'ussr': ['u', 's', 's', 'r'],
    'utha': ['other'],
    'uuu': ['u'],
    'uv': ['u', 'v'],
    'uw': ['u', 'w'],
    'uwasntthere': ['u', 'was', 'there'],
    'uwonteva': ['u', 'wont', 'ever'],
    'uxbridge': ['ux', 'bridge'],
    'vacationer': ['vacation'],
    'vagabond': ['vaga', 'bond'],
    'vagabonds': ['vaga', 'bond'],
    'vampire': ['vamp'],
    'vampires': ['vamp'],
    'vandalize': ['vandal'],
    'vandalizer': ['vandal'],
    'vandam': ['van', 'dam'],
    'vanderwaal': ['vander', 'waal'],
    'vangogh': ['van', 'gogh'],
    'vbnd': ['v', 'b', 'n', 'd'],
    'vcr': ['v', 'c', 'r'],
    'vdg': ['v', 'd', 'g'],
    'vdon': ['v', 'don'],
    'veggies': ['veg'],
    'vegitable': ['veg'],
    'vegitables': ['veg'],
    'velvetear': ['velvet', 'tear'],
    'velvetears': ['velvet', 'tear'],
    'vengaboy': ['venga', 'boy'],
    'vengaboys': ['venga', 'boy'],
    'venusians': ['venus'],
    'verbz': ['verb'],
    'versitality': ['versitale'],
    'vertical': ['vert'],
    'vette': ['corvette'],
    'vfd': ['v', 'f', 'd'],
    'vfro': ['v', 'f', 'r', 'o'],
    'vfw': ['v', 'f', 'w'],
    'vgm': ['v', 'g', 'm'],
    'vhs': ['v', 'h', 's'],
    'vi': ['v', 'i', '6'],
    'vibez': ['vibe'],
    'vibin': ['vibe'],
    'vibration': ['vibrate'],
    'vic': ['v', 'i', 'c'],
    'vicki': ['vicky'],
    'victorious': ['victory'],
    'view2': ['view', '2'],
    'vigiland': ['vigi', 'land'],
    'villager': ['village'],
    'villagers': ['village'],
    'vip': ['v', 'I', 'p'],
    'vj': ['v', 'j'],
    'vjs': ['v', 'j', 's'],
    'vk': ['v', 'k'],
    'vkillz': ['v', 'kill'],
    'vkl': ['v', 'k', 'l'],
    'vkng': ['viking', 'v', 'k', 'n', 'g'],
    'volbeat': ['vol', 'beat'],
    'volleyball': ['volley', 'ball'],
    'voodoo': ['voo', 'doo'],
    'vs': ['v', 's', 'verses'],
    'vybz': ['vibe'],
    'w a y s': ['way'],
    'w o m a n': ['woman'],
    'wadsyaname': ['what', 'ya', 'name'],
    'waggy': ['wag'],
    'wailers': ['wail'],
    'wailer': ['wail'],
    'waistband': ['waist', 'band'],
    'waite': ['wait'],
    'waiters': ['wait'],
    'waiter': ['wait'],
    'waitin': ['wait'],
    'waitresses': ['wait'],
    'waitress': ['wait'],
    'wakeman': ['wake', 'man'],
    'wakey': ['wake'],
    'wakin': ['wake'],
    'waldorfworldwide': ['waldorf', 'world', 'wide'],
    'walkashame': ['walk', 'shame'],
    'walkaway': ['walk', 'away'],
    'walkers': ['walk'],
    'walker': ['walk'],
    'walkin': ['walk'],
    'walkman': ['walk', 'man'],
    'walkmen': ['walk', 'men'],
    'walkway': ['walk', 'way'],
    'walkways': ['walk', 'way'],
    'walky': ['walk'],
    'walled': ['wall'],
    'wallflower': ['wall', 'flower'],
    'wallflowers': ['wall', 'flower'],
    'walterwarm': ['walter', 'warm'],
    'wanderers': ['wander'],
    'wanderer': ['wander'],
    'wanderlust': ['wander', 'lust'],
    'wannabe': ['wanna', 'be'],
    'wannabes': ['wanna', 'be'],
    'warcry': ['war', 'cry'],
    'warehouse': ['ware', 'house'],
    'warewolf': ['ware', 'wolf'],
    'warewolves': ['ware', 'wolf'],
    'warfare': ['war', 'fare'],
    'warlord': ['war', 'lord'],
    'warlords': ['war', 'lord'],
    'warmer': ['warm'],
    'warmest': ['warm'],
    'warmness': ['warm'],
    'warmth': ['warm'],
    'warpaint': ['war', 'paint'],
    'warpath': ['war', 'path'],
    'warship': ['war', 'ship'],
    'wartime': ['war', 'time'],
    'warwick': ['war', 'wick'],
    'warzone': ['war', 'zone'],
    'washpoppin': ['wash', 'pop'],
    'washy': ['wash'],
    'wasnt': ['was'],
    'wassup': ['what', 'up'],
    'wasteland': ['waste', 'land'],
    'wastelands': ['waste', 'land'],
    'wastin': ['waste'],
    'wasting': ['waste'],
    'wat': ['what'],
    'watchdog': ['watch', 'dog'],
    'watchdogs': ['watch', 'dog'],
    'watchtower': ['watch', 'tower'],
    'waterbed': ['water', 'bed'],
    'waterbeds': ['water', 'bed'],
    'watercolor': ['water', 'color'],
    'watercolors': ['water', 'color'],
    'watercraft': ['water', 'craft'],
    'waterfall': ['water', 'fall'],
    'waterfalls': ['water', 'fall'],
    'waterfront': ['water', 'front'],
    'waterhouse': ['water', 'house'],
    'waterline': ['water', 'line'],
    'waterlines': ['water', 'line'],
    'waterloo': ['water'],
    'watermark': ['water', 'mark'],
    'watermelon': ['water', 'melon'],
    'watertower': ['water', 'tower'],
    'watertowers': ['water', 'tower'],
    'watery': ['water'],
    'wats': ['what'],
    'wavelength': ['wave', 'length'],
    'waverunners': ['wave', 'run'],
    'waverunner': ['wave', 'run'],
    'wavybone': ['wave', 'bone'],
    'wavey': ['wave'],
    'wavves': ['wave'],
    'wavy': ['wave'],
    'wayfair': ['way', 'fair'],
    'wayfare': ['way', 'fare'],
    'wayfarer': ['way', 'fare'],
    'wayfarers': ['way', 'fare'],
    'wayman': ['way', 'man'],
    'wayward': ['way', 'ward'],
    'wayz': ['way'],
    'wc': ['w', 'c'],
    'wdfhdf': ['w', 'd', 'f', 'h'],
    'wdyw': ['w', 'd', 'y'],
    'weakened': ['weak'],
    'weaker': ['weak'],
    'weakerthan': ['weak', 'than'],
    'weakest': ['weak'],
    'weakling': ['weak'],
    'wealthy': ['wealth'],
    'weatherman': ['weather', 'man'],
    'weaver': ['weave'],
    'weavers': ['weave'],
    'webb': ['web'],
    'weekend': ['week', 'end'],
    'weekends': ['week', 'end'],
    'weekly': ['week'],
    'weeknd': ['week', 'end'],
    'weepin': ['weep'],
    'weightless': ['weight'],
    'welcoming': ['welcome'],
    'west1ne': ['west', '1'],
    'westbound': ['west', 'bound'],
    'westbrook': ['west', 'brook'],
    'westerberg': ['west', 'berg'],
    'western': ['west'],
    'westlife': ['west', 'life'],
    'westernmind': ['west', 'mind'],
    'westside': ['west', 'side'],
    'westward': ['west', 'ward'],
    'wetter': ['wet'],
    'whaat': ['what'],
    'whaler': ['whale'],
    'whalers': ['whale'],
    'whataya': ['what', 'ya'],
    'whatd': ['what'],
    'whateva': ['what', 'ever'],
    'whatevas': ['what', 'ever'],
    'whatever': ['what', 'ever'],
    'whatevers': ['what', 'ever'],
    'whatsername': ['what', 'her', 'name'],
    'whatta': ['what'],
    'whattaya': ['what', 'ya'],
    'whatz': ['what'],
    'wheatus': ['wheat'],
    'wheelchairs': ['wheel', 'chair'],
    'wheelchair': ['wheel', 'chair'],
    'wheeler': ['wheel'],
    'wheelers': ['wheel'],
    'wheelz': ['wheel'],
    'whenever': ['when', 'ever'],
    'wheresthelove': ['where', 'the', 'love'],
    'wherever': ['where', 'ever'],
    'whiplash': ['whip', 'lash'],
    'whiskeyd': ['whiskey'],
    'whiskeytown': ['whiskey', 'town'],
    'whistlin': ['whistle'],
    'whitechapel': ['white', 'chapel'],
    'whitehouse': ['White', 'House'],
    'whiteout': ['white', 'out'],
    'whiter': ['white'],
    'whitesides': ['white', 'side'],
    'whitesnake': ['white', 'snake'],
    'whitest': ['white'],
    'whitetail': ['white', 'tail'],
    'whitetown': ['white', 'town'],
    'whiz': ['wiz'],
    'whoa': ['woah'],
    'whoeva': ['who', 'ever'],
    'whoever': ['who', 'ever'],
    'whoevers': ['who', 'ever'],
    'wholl': ['who'],
    'wholy': ['whole'],
    'whoppee': ['whop'],
    'whopper': ['whop'],
    'whoppin': ['whop'],
    'whos': ['who'],
    'whyd': ['why'],
    'widdit': ['with', 'it'],
    'wideboy': ['wide', 'boy'],
    'wider': ['wide'],
    'widespread': ['wide', 'spread'],
    'widowspeak': ['widow', 'peak', 'speak'],
    'wifey': ['wife'],
    'wifisfuneral': ['wifi', 'funeral'],
    'wigmore': ['wig', 'more'],
    'wildcards': ['wild', 'card'],
    'wildcard': ['wild', 'card'],
    'wilde': ['wild'],
    'wildebeest': ['wild', 'beast'],
    'wilder': ['wild'],
    'wilderness': ['wild'],
    'wildewoman': ['wild', 'woman'],
    'wildfire': ['wild', 'fire'],
    'wildfires': ['wild', 'fire'],
    'wildflower': ['wild', 'flower'],
    'wildheart': ['wild', 'heart'],
    'wildhearts': ['wild', 'heart'],
    'wildflowers': ['wild', 'flower'],
    'wildin': ['wild'],
    'wildlife': ['wild', 'life'],
    'wildly': ['wild'],
    'wildwood': ['wild', 'wood'],
    'williams': ['william'],
    'willie': ['will'],
    'willin': ['will'],
    'willingness': ['willing'],
    'willowbank': ['willow', 'bank'],
    'Willtharapper': ['will', 'the', 'rap'],
    'willy': ['will'],
    'winding': ['wind'],
    'windmill': ['wind', 'mill'],
    'windmills': ['wind', 'mill'],
    'windsong': ['wind', 'song'],
    'winehouse': ['wine', 'house'],
    'wing$': ['wing'],
    'winger': ['wing'],
    'wingman': ['wing', 'man'],
    'wingtip': ['wing', 'tip'],
    'winner': ['win'],
    'winners': ['win'],
    'winterbreak': ['winter', 'break'],
    'winterland': ['winter', 'land'],
    'wintertime': ['winter', 'time'],
    'winwood': ['win', 'wood'],
    'wiseman': ['wise', 'man'],
    'wisemen': ['wise', 'men'],
    'wishbone': ['wish', 'bone'],
    'wishful': ['wish'],
    'wishlist': ['wish', 'list'],
    'wishy': ['wish'],
    'wit': ['with'],
    'witchcraft': ['witch', 'craft'],
    'witchdoctor': ['witch', 'doctor'],
    'within': ['with', 'in'],
    'without': ['with', 'out'],
    'wiv': ['with'],
    'wizkid': ['wiz', 'kid'],
    'wk': ['w', 'k'],
    'woandering': ['wonder'],
    'wokeuplikethis': ['woke', 'up', 'like', 'this'],
    'wokeuplikethis*': ['woke', 'up', 'like', 'this'],
    'wolfe': ['wolf'],
    'wolfgang': ['wolf', 'gang'],
    'wolfmother': ['wolf', 'mother'],
    'wolves': ['wolf'],
    'womanizer': ['woman'],
    'wombass': ['wom', 'bass'],
    'womvn': ['woman'],
    'wonderful': ['wonder'],
    'wonderland': ['wonder', 'land'],
    'wonderlove': ['wonder', 'love'],
    'wonderman': ['wonder', 'man'],
    'wonderwall': ['wonder', 'wall'],
    'wooden': ['wood'],
    'woodes': ['wood'],
    'woodkid': ['wood', 'kid'],
    'woodland': ['wood', 'land'],
    'woodlock': ['wood', 'lock'],
    'woodstock': ['wood', 'stock'],
    'woody': ['wood'],
    'woohoo': ['woo', 'hoo'],
    'wooley': ['wool'],
    'wordplay': ['word', 'play'],
    'workaholic': ['work'],
    'workday': ['work', 'day'],
    'workdays': ['work', 'day'],
    'worker': ['work'],
    'workers': ['work'],
    'workin': ['work'],
    'workingman': ['work', 'man'],
    'workman': ['work', 'man'],
    'workouts': ['work', 'out'],
    'workout': ['work', 'out'],
    'worldstar': ['world', 'star'],
    'worldwide': ['world', 'wide'],
    'worthless': ['worth'],
    'worthy': ['worth'],
    'wouldnt': ['would'],
    'wrapit': ['wrap', 'it'],
    'wrdz': ['word'],
    'wrecker': ['wreck'],
    'wreckers': ['wreck'],
    'wreckless': ['wreck'],
    'wreckx': ['wreck'],
    'wrenn': ['wren'],
    'wrestler': ['wrestle'],
    'wrestlers': ['wrestle'],
    'writer': ['write'],
    'writers': ['write'],
    'written': ['write'],
    'wrote': ['write'],
    'wth': ['w', 't', 'h'],
    'wudz': ['wood'],
    'wulf': ['wolf'],
    'wurk': ['work'],
    'wwe': ['w', 'e'],
    'wwiii': ['w', 'I'],
    'wyld': ['wild'],
    'wylin': ['wild'],
    'wynter': ['winter'],
    'wyrd': ['word'],
    'wyte': ['white'],
    'wzrd': ['wizard'],
    'x2cu': ['x', '2', 'c', 'u'],
    'xanex': ['xan'],
    'xanny': ['xan'],
    'xcerts': ['excert'],
    'xcii': ['x', 'c', 'I'],
    'xcx': ['x', 'c'],
    'xi': ['x', 'i'],
    'xl': ['x', 'l'],
    'xmas': ['x', 'christmas'],
    'xo': ['x', 'o'],
    'xoxo': ['x', 'o'],
    'xoxoxo': ['x', 'o'],
    'xperience': ['experience'],
    'xplicit': ['explicit'],
    'xray': ['x', 'ray'],
    'xrs': ['x', 'r', 's'],
    'xscape': ['escape'],
    'xtc': ['x', 't', 'c'],
    'xuitcasecity': ['suit', 'case', 'city'],
    'xv': ['x', 'v'],
    'xxl': ['x', 'l'],
    'xxplosive': ['explosive'],
    'xxyyxx': ['x', 'y'],
    'xy': ['x', 'y'],
    'xylo': ['x', 'y', 'l', 'o'],
    'xypo': ['x', 'y', 'p', 'o'],
    'xyu': ['x', 'y', 'u'],
    'xzibit': ['exhibit'],
    'yachtclub': ['yacht', 'club'],
    'yachty': ['yacht'],
    'yamborghini': ['yam', 'Lambo'],
    'yaomingolajuwon': ['yao', 'ming', 'olajuwon'],
    'yardbird': ['yard', 'bird'],
    'yardbirds': ['yard', 'bird'],
    'yas': ['y', 'a', 's', 'yes'],
    'ybn': ['y', 'b', 'n'],
    'yc': ['y', 'c'],
    'yea': ['yeah'],
    'yearnin': ['yearn'],
    'yearwood': ['year', 'wood'],
    'yeasayer': ['yeah', 'say'],
    'yelawolf': ['yellow', 'wolf'],
    'yellowcard': ['yellow', 'card'],
    'yer': ['your'],
    'yg': ['y', 'g'],
    'ymca': ['y', 'm', 'c', 'a'],
    'yme': ['y', 'm', 'e'],
    'yorkshire': ['york', 'shire'],
    'yorkston': ['york'],
    'youarefire': ['you', 'are', 'fire'],
    'youll': ['you'],
    'youngbleed': ['young', 'bleed'],
    'youngbloods': ['young', 'blood'],
    'youngblood': ['young', 'blood'],
    'youngbloodz': ['young', 'blood'],
    'youngbodzy': ['young', 'body'],
    'youngboy': ['young', 'boy'],
    'younger': ['young'],
    'youngr': ['young'],
    'youngsta': ['young'],
    'youngster': ['young'],
    'yourself': ['your', 'self'],
    'youthful': ['youth'],
    'youthonix': ['youth'],
    'youtube': ['you', 'tube'],
    'yr': ['your'],
    'yrself': ['your', 'self'],
    'yung': ['young'],
    'yungblud': ['young', 'blood'],
    'yuppycult': ['yuppy', 'cult'],
    'zac': ['zach'],
    'zachary': ['zach'],
    'zack': ['zach'],
    'zayn': ['zane'],
    'zebrahead': ['zebra', 'head'],
    'zhane': ['zane'],
    'ziggy': ['zig'],
    'zillionaire': ['zillion'],
    'zinger': ['zing'],
    'zingers': ['zing'],
    'zipper': ['zip'],
    'zippers': ['zip'],
    'zomboy': ['zombie', 'boy'],
    'zoofunkition': ['zoo', 'funk'],
    'zoomin': ['zoom'],
    'zro': ['zero'],
    'zvvl': ['z', 'v', 'l'],
    'zz': ['z'],
    'eleven': ['1'],
    'rockaria': ['rock'],
    'rockaria!': ['rock'],
    'nightriders': ['night', 'ride'],
    'nightrider': ['night', 'ride'],
    'swordfish': ['sword', 'fish'],
    'hotkiss': ['hot', 'kiss'],
    'keystone': ['key', 'stone'],
    'appletree': ['apple', 'tree'],
    'treehome95': ['tree', 'home', '9', '5'],
    'cleva': ['clever'],
    'vocab': ['vocabulary'],
    'helplessness': ['help'],
    'stardom': ['star'],
    'headknockers': ['head', 'knock'],
    'headknocker': ['head', 'knock'],
    'thrdlife': ['third', 'life'],
    'slower': ['slow'],
    'slowest': ['slow'],
    'suntan': ['sun', 'tan'],
    'powerless': ['power'],
    'athrty': ['authority'],
    'ptsofathrty': ['point', 'of', 'authority'],
    'ultraviolence': ['ultra', 'violence'],
    'ultraviolet': ['ultra', 'violet'],
    'prisoner': ['prison'],
    'prisoners': ['prison'],
    'dayglo': ['day', 'glow'],
    'dayglow': ['day', 'glow'],
    'melodrama': ['melo', 'drama'],
    'buzzcut': ['buzz', 'cut'],
    'rework': ['work'],
    'ponyboy': ['pony', 'boy'],
    'outsider': ['out', 'side'],
    'insider': ['in', 'side'],
    'grandtheft': ['grand', 'theft'],
    'kaskade': ['cascade'],
    'jackman': ['jack', 'man'],
    'closest': ['close'],
    'gogo': ['go'],
    'skirrt': ['skirt'],
    'hellcat': ['hell', 'cat'],
    'bidness': ['business'],
    'kash': ['cash'],
    'shakem': ['shake', 'them'],
    'disrespekt': ['respect'],
    'rewrite': ['write'],
    'whatyo': ['what', 'yo'],
    'ohhwee': ['oowee', 'ooh', 'wee'],
    'krule': ['cruel'],
    'tragically': ['tragic'],
    'hypercolor': ['hyper', 'color'],
    'unpopular': ['popular'],
    'youwouldntlikemewhenimangry': ['you', 'would', 'like', 'me', 'when', 'im', 'angry'],
    'tomppabeats': ['tomppa', 'beat'],
    'waytolove': ['way', 'to', 'love'],
    'reefknot': ['reef', 'knot'],
    'liketht': ['like', 'that'],
    'moneypants': ['money', 'pants'],
    'hoggininthegame': ['hog', 'in', 'the', 'game'],
    'goodmorningme': ['good', 'morning', 'me'],
    'lovefiction': ['love', 'fiction'],
    'gitdown': ['get', 'down'],
    'flofitz': ['flow', 'fitz'],
    'keepitreal': ['keep', 'it', 'real'],
    'whirlwind': ['whirl', 'wind'],
    'getdismoney': ['get', 'this', 'money'],
    'onceagain': ['once', 'again'],
    'twosome': ['2'],
    'threesome': ['3'],
    'threesomes': ['3'],
    'foursome': ['4'],
    'one4jakarta': ['1', '4', 'jakarta'],
    'flowtec': ['flow', 'tech'],
    'speakthru': ['speak', 'through'],
    'standupcomedy': ['stand', 'up', 'comedy'],
    'standup': ['stand', 'up'],
    '12vince': ['1', '2', 'vince'],
    'annalog': ['anna', 'analog'],
    'crewpiece': ['crew', 'piece'],
    'one4hubert': ['1', '4', 'hubert'],
    'homebound': ['home', 'bound'],
    'lifelike': ['life', 'like'],
    'shoemaker': ['shoe', 'make'],
    'cleanup': ['clean', 'up'],
    'pothole': ['pot', 'hole'],
    'potholes': ['pot', 'hole'],
    'waterboy': ['water', 'boy'],
    'sundress': ['sun', 'dress'],
    'sunscreen': ['sun', 'screen'],
    'birdhouse': ['bird', 'house'],
    'boxcar': ['box', 'car'],
    'boxcars': ['box', 'car'],
    'lakeside': ['lake', 'side'],
    'oceanside': ['ocean', 'side'],
    'grayscale': ['gray', 'scale'],
    'ttng': ['t', 'n', 'g'],
    'heebiejeebie': ['heebie', 'jeebie'],
    'heebiejeebies': ['heebie', 'jeebie'],
    'culpriit': ['culprit'],
    'inxanity': ['xan', 'insanity'],
    'brockhampton': ['brock', 'hampton'],
    'wya': ['why', 'ya', 'w', 'y', 'a'],
    'xanarchy': ['xan', 'anarchy'],
    'wechat': ['we', 'chat'],
    'ecco2k': ['echo', '2', 'k', 'thousand'],
    'finessin': ['finess'],
    'slingshot': ['sling', 'shot'],
    'mcm': ['m', 'c'],
    'keyi': ['key'],
    'otw': ['o', 't', 'w'],
    'beamer': ['beam'],
    'skooly': ['school'],
    'riggs': ['rig'],
    'rigg': ['rig'],
    'blinger': ['bling'],
    'wcw': ['w', 'c'],
    'neg': ['negative'],
    'rerocc': ['rock'],
    'rocc': ['rock'],
    'lolife': ['low', 'life'],
    'switcharoo': ['switch'],
    'partna': ['partner'],
    'ruffless': ['ruthless'],
    'dejavu': ['deja', 'vu'],
    'whippin': ['whip'],
    'datin': ['date'],
    'str8': ['straight', '8'],
    'cyko': ['psycho'],
    'dripset': ['drip', 'set'],
    'dipset': ['dip', 'set'],
    'wwyd': ['w', 'y', 'd'],
    'ayoo': ['ayo'],
    'quanie': ['kwony'],
    'swervin': ['swerve'],
    'choppaz': ['chop'],
    'sho': ['sure', 'show'],
    'cookupboss': ['cook', 'up', 'boss'],
    'cookup': ['cook', 'up'],
    'wannab': ['wanna', 'b', 'be'],
    'wannabz': ['wanna', 'b', 'be'],
    'fuk': ['fuck'],
    'racc': ['rack'],
    'jus': ['just'],
    'moptop': ['mop', 'top'],
    'dreadhead': ['dread', 'head'],
    'gwapa': ['guap'],
    'wallstreet': ['wall', 'street'],
    'henri': ['henry'],
    'hardkore': ['hard', 'core'],
    'plottin': ['plot'],
    'fucc': ['fuck'],
    'quintessential': ['essential'],
    'skybourne': ['sky', 'born'],
    'spiteful': ['spite'],
    'hippa': ['hip'],
    'hoppa': ['hop'],
    'mftr': ['m', 'f', 't', 'r'],
    'dgifu': ['d', 'g', 'i', 'f', 'u'],
    'stormae': ['storm'],
    'timespace': ['time', 'space'],
    'atlass': ['atlas'],
    'rainmaker': ['rain', 'make'],
    'statik': ['static'],
    'selektah': ['select'],
    'ifuleave': ['if', 'u', 'leave'],
    'livewire': ['live', 'wire'],
    'willpower': ['will', 'power'],
    'ashtray': ['ash', 'tray'],
    'ashtrays': ['ash', 'tray'],
    'heartbreaks': ['heart', 'break'],
    'outthepound': ['out', 'the', 'pound'],
    'groundislava': ['ground', 'is', 'lava'],
    'ssaliva': ['saliva'],
    'babyfather': ['baby', 'father'],
    'bbf': ['b', 'f'],
    'jordann': ['jordan'],
    'exalter': ['exalt'],
    'endgame': ['end', 'game'],
    'wwwings': ['wing'],
    'phoenixxx': ['phoenix'],
    'dedekind': ['dede', 'kind'],
    'dangerzone': ['danger', 'zone'],
    'mssingno': ['missing', 'go'],
    'gunshotta': ['gun', 'shot'],
    'nbhd': ['n', 'b', 'h', 'd'],
    'takedown': ['take', 'down'],
    'headlock': ['head', 'lock'],
    'truckload': ['truck', 'load'],
    'truckloads': ['truck', 'load'],
    'takeoff': ['take', 'off'],
    'ibang': ['i', 'bang'],
    'prankster': ['prank'],
    'dammit': ['damn', 'it'],
    'hammerhead': ['hammer', 'head'],
    'blindside': ['blind', 'side'],
    'bricksquad': ['brick', 'squad'],
    'flockaveli': ['flock'],
    'lurkin': ['lurk'],
    'ttu': ['t', 'u'],
    'flyest': ['fly'],
    'lovele$$': ['love'],
    'unpredictable': ['predict'],
    'sunlit': ['sun', 'lit'],
    'ebb': ['e', 'b'],
    'nevernames': ['never', 'name'],
    'wormwood': ['worm', 'wood'],
    'westerman': ['west', 'man'],
    'windshield': ['wind', 'shield'],
    'roundabout': ['round', 'about'],
    'ryley': ['riley'],
    'rabbitfoot': ['rabbit', 'foot'],
    'bigbee': ['big', 'bee'],
    'whitetree': ['white', 'tree'],
    'creektime': ['creek', 'time'],
    'whyless': ['why'],
    'nightdriving': ['night', 'drive'],
    'reconfiguration': ['configure'],
    'configuration': ['configure'],
    'reconfigure': ['configure'],
    'greylag': ['grey', 'lag'],
    'deliciously': ['delicious'],
    'pierpont': ['pier', 'pont'],
    'janssen': ['jansen'],
    'inheritance': ['inherit'],
    'megafaun': ['mega', 'faun'],
    'misophone': ['miso', 'phone'],
    'rosebuds': ['rose', 'bud'],
    'seabear': ['sea', 'bear'],
    'sunparlour': ['sun', 'parlor'],
    'repave': ['pave'],
    'vudu': ['voodoo'],
    'wishingbone': ['wish', 'bone'],
    'transviolet': ['trans', 'violet'],
    'realigion': ['real', 'religion'],
    'realign': ['align'],
    'd33j': ['d', '3', 'j'],
    'nsfw': ['n', 's', 'f', 'w'],
    'psychostick': ['psycho', 'stick'],
    'drinkalong': ['drink', 'along'],
    'chillout': ['chill', 'out'],
    'drinkalia': ['drink'],
    'acquamarina': ['aqua', 'marine'],
    'watchtheduck': ['watch', 'the', 'duck'],
    'mudshovel': ['mud', 'shovel'],
    'glitterball': ['glitter', 'ball'],
    'wordsplayed': ['word', 'play'],
    'psychopath': ['psycho', 'path'],
    'rustie': ['rust'],
    'attak': ['attack'],
    'lamonica': ['la', 'monica'],
    'nitesky': ['night', 'sky'],
    'nitemayor': ['night', 'mayor'],
    'mercedez': ['mercedes'],
    'aquaberry': ['aqua', 'berry'],
    'aquabeat': ['aqua', 'beat'],
    'quinceee': ['quincy'],
    'jawwwdinz': ['jordan'],
    'aquabella': ['aqua', 'bella'],
    'brimstone': ['brim', 'stone'],
    'horsepower': ['horse', 'power'],
    'bloodbuzz': ['blood', 'buzz'],
    'mudcrutch': ['mud', 'crutch'],
    'slowcoaching': ['slow', 'coach'],
    'graceless': ['grace'],
    'steambreather': ['steam', 'breathe'],
    'birchmen': ['birch', 'men'],
    'seabeast': ['sea', 'beast'],
    'puncher': ['punch'],
    'workhorse': ['work', 'horse'],
    'spectrelight': ['spectre', 'light'],
    'deathbound': ['death', 'bound'],
    'bullysongs': ['bully', 'song'],
    'ghostloft': ['ghost', 'loft'],
    'fistful': ['fist'],
    'lapdance': ['lap', 'dance'],
    'gearheart': ['gear', 'heart'],
    'killdeer': ['kill', 'deer'],
    'yungstar': ['young', 'star'],
    'deadlocked': ['dead', 'lock'],
    'deadlock': ['dead', 'lock'],
    'blueprint': ['blue', 'print'],
    'gridlock': ['grid', 'lock'],
    'crossover': ['cross', 'over'],
    'beatking': ['beat', 'king'],
    'chipz': ['chip'],
    'sobeautiful': ['so', 'beautiful'],
    'joistarr': ['joy', 'star'],
    'onmyradio': ['on', 'my', 'radio'],
    'talkbox': ['talk', 'box'],
    'monstercat': ['monster', 'cat'],
    'asquared': ['a', 'square'],
    'squared': ['square'],
    'freefall': ['free', 'fall'],
    'freefalling': ['free', 'fall'],
    'hologram': ['holo', 'gram'],
    'musicboxes': ['music', 'box'],
    'petersburg': ['peter', 'burg'],
    'dreamworld': ['dream', 'world'],
    'riceboy': ['rice', 'boy'],
    'ok2222': ['ok', '2'],
    'disaterpeace': ['disaster', 'peace'],
    'lushness': ['lush'],
    'glowworm': ['glow', 'worm'],
    'coachlight': ['coach', 'light'],
    'underbart': ['under', 'bart'],
    'dreamcoat': ['dream', 'coat'],
    'bulldog': ['bull', 'dog'],
    'zimzilla': ['zim', 'zilla'],
    'cherries': ['cherry'],
    'floodlight': ['flood', 'light'],
    'floodlights': ['flood', 'light'],
    'lightchasers': ['light', 'chase'],
    'stori': ['story'],
    'idontwannabeyouanymore': ['I', 'dont', 'wanna', 'be', 'you', 'any', 'more'],
    'freesol': ['free', 'sol'],
    'stonestreet': ['stone', 'street'],
    'amaanda': ['amanda'],
    'goodluck': ['good', 'luck'],
    'dropgun': ['drop', 'gun'],
    'xquizit': ['exquisite'],
    'lookas': ['look'],
    'killers': ['kill'],
    'm808': ['m', '8', '0'],
    'gspr': ['g', 's', 'p', 'r'],
    'blr': ['b', 'l', 'r'],
    'mk': ['m', 'k'],
    'stonefox': ['stone', 'fox'],
    'seaway': ['sea', 'way'],
    'hightown': ['high', 'town'],
    'birdcage': ['bird', 'cage'],
    'numblife': ['numb', 'life'],
    'outlya': ['out'],
    'sickago': ['sick'],
    'beetroots': ['beet', 'root'],
    'smallpools': ['small', 'pool'],
    'phnx': ['phoenix'],
    'hellfire': ['hell', 'fire'],
    'rockisdead': ['rock', 'is', 'dead'],
    'vally': ['valley'],
    'asleep': ['sleep'],
    'switchblade': ['switch', 'blade'],
    'steepwater': ['steep', 'water'],
    'automatica': ['automatic'],
    'punchline': ['punch', 'line'],
    'midtown': ['mid', 'town'],
    'piebald': ['pie', 'bald'],
    'existentialism': ['existential'],
    'straylight': ['stray', 'light'],
    'glassjaw': ['glass', 'jaw'],
    'cosmopolitan': ['cosmo'],
    'bloodloss': ['blood', 'loss'],
    'fcpremix': ['f', 'c', 'p', 'r', 'e', 'm', 'I', 'x'],
    'bayside': ['bay', 'side'],
    'movielife': ['movie', 'life'],
    'loveletter': ['love', 'letter'],
    'prelow': ['low'],
    'plgrms': ['pilgrim'],
    'nightlight': ['night', 'light'],
    'heartbreaklist': ['heart', 'break', 'list'],
    'damnwells': ['damn', 'well'],
    'stereomud': ['stereo', 'mud'],
    'powerman': ['power', 'man'],
    'taproot': ['tap', 'root'],
    'fingertight': ['finger', 'tight'],
    'switchback': ['switch', 'back'],
    'nothingface': ['nothing', 'face'],
    'earshot': ['ear', 'shot'],
    'mushroomhead': ['mushroom', 'head'],
    'spineshank': ['spine', 'shank'],
    'crazyfists': ['crazy', 'fist'],
    'trustcompany': ['trust', 'company'],
    'ultranumb': ['ultra', 'numb'],
    'otherkin': ['other', 'kin'],
    'perfekt': ['perfect'],
    'shitkid': ['shit', 'kid'],
    'dygl': ['d', 'y', 'g', 'l'],
    'deathrays': ['death', 'ray'],
    'whatevr': ['what', 'ever'],
    'bloomfield': ['bloom', 'field'],
    'barleycorn': ['barley', 'corn'],
    'leadfoot': ['lead', 'foot'],
    'whitehorse': ['white', 'horse'],
    'broadbent': ['broad', 'bent'],
    'harpoonist': ['harpoon'],
    'boneyard': ['bone', 'yard'],
    'riverbottom': ['river', 'bottom'],
    'dreamcatcher': ['dream', 'catch'],
    'dreamcatchers': ['dream', 'catch'],
    'internationale': ['international'],
    'heartbroken': ['heart', 'broke'],
    'disrepair': ['repair'],
    'slideshow': ['slide', 'show'],
    'derek': ['derrick'],
    'allstars': ['all', 'star'],
    'allstar': ['all', 'star'],
    'grownass': ['grown', 'ass'],
    'passageway': ['passage', 'way'],
    'passageways': ['passage', 'way'],
    'bellhound': ['bell', 'hound'],
    'kingsborough': ['king', 'borough'],
    'dragonaut': ['dragon'],
    'bitchwax': ['bitch', 'wax'],
    'boxriff': ['box', 'riff'],
    'deconstruction': ['construction'],
    'greenleaf': ['green', 'leaf'],
    'passes': ['pass'],
    '1000mods': ['1', '0', 'mod'],
    'nightstalker': ['night', 'stalk'],
    'glasspack': ['glass', 'pack'],
    'powderkeg': ['powder', 'keg'],
    'weedeater': ['weed', 'eat'],
    'earthless': ['earth'],
    'booster': ['boost'],
    'catfight': ['cat', 'fight'],
    'nearby': ['near', 'by'],
    'weathered': ['weather'],
    'superheaven': ['super', 'heaven'],
    'morgxn': ['morgan'],
    'masseducation': ['mass', 'education'],
    'playtones': ['play', 'tone'],
    'buckaroos': ['buck'],
    'jaye': ['jay'],
    'showaddywaddy': ['show', 'waddy'],
    'refresh': ['fresh'],
    'refreshments': ['fresh'],
    'crashly': ['crash'],
    'roadmaster': ['road', 'master'],
    'roadmasters': ['road', 'master'],
    'kingbee': ['king', 'bee'],
    'sugarrush': ['sugar', 'rush'],
    'rockpile': ['rock', 'pile'],
    'slapper': ['slap'],
    'slappers': ['slap'],
    'jetaways': ['jet', 'away'],
    'lennerockers': ['rock'],
    'toein': ['toe'],
    'breathless': ['breath'],
    'bluelight': ['blue', 'light'],
    'rockabillies': ['rock', 'billy'],
    'highshots': ['high', 'shot'],
    'micke': ['mick'],
    'midlife': ['mid', 'life'],
    'bombtrack': ['bomb', 'track'],
    'infectious': ['infect'],
    'jonestown': ['jones', 'town'],
    'sailboats': ['sail', 'boat'],
    'holydrug': ['holy', 'drug'],
    'goatfuzz': ['goat', 'fuzz'],
    'motorpsycho': ['motor', 'psycho'],
    'hibernation': ['hibernate'],
    'drunken': ['drunk'],
    'sunburst': ['sun', 'burst'],
    'reflections': ['reflect'],
    'boredoms': ['bored'],
    'thunderthief': ['thunder', 'thief'],
    'groundhogs': ['ground', 'hog'],
    'hatfield': ['hat', 'field'],
    'starcastle': ['star', 'castle'],
    'oceansize': ['ocean', 'size'],
    'ornamental': ['ornament'],
    'fireballet': ['fire', 'ballet'],
    'sunhillow': ['sun', 'hillow'],
    'oldfield': ['old', 'field'],
    'holograms': ['holo', 'gram'],
    'oilfield': ['oil', 'field'],
    'ottomatic': ['otto', 'automatic'],
    'hellraiser': ['hell', 'raise'],
    'madmen': ['mad', 'men'],
    'tinkertrain': ['tinker', 'train'],
    'silvery': ['silver'],
    'uncover': ['cover'],
    'uncovered': ['cover'],
    'bordersz': ['border'],
    'aftershave': ['after', 'shave'],
    'generationwhy': ['generation', 'why'],
    'nightday': ['night', 'day'],
    'superfriends': ['super', 'friend'],
    'unworthy': ['worth'],
    'aftermath': ['after', 'math'],
    'vapour': ['vapor'],
    'heartburn': ['heart', 'burn'],
    'nationwide': ['nation', 'wide'],
    'afterburn': ['after', 'burn'],
    'afterburner': ['after', 'burn'],
    'pincushion': ['pin', 'cushion'],
    'doubleback': ['double', 'back'],
    'diamondback': ['diamond', 'back'],
    'rhythmeen': ['rhythm'],
    'frontlines': ['front', 'line'],
    'dirtyphonics': ['dirt', 'phonics'],
    'dnmo': ['d', 'n', 'm', 'o'],
    'rudeboy': ['rude', 'boy'],
    'bustamove': ['bust', 'a', 'move'],
    'deadbeats': ['dead', 'beat'],
    'crankin': ['crank'],
    'menswear': ['men', 'wear'],
    'uncomfortable': ['comfort'],
    'homebrew': ['home', 'brew'],
    'grassroots': ['grass', 'root'],
    'stylee': ['style'],
    'uplift': ['up', 'lift'],
    'uplifter': ['up', 'lift'],
    'uplifting': ['up', 'lift'],
    'reminder': ['remind'],
    'reminders': ['remind'],
    'yns': ['y', 'n', 's'],
    'backflip': ['back', 'flip'],
    'backstroke': ['back', 'stroke'],
    'tropkillaz': ['tropical', 'kill'],
    'debbie': ['deb'],
    'p*$$yrich': ['pussy', 'rich'],
    'pussyrich': ['pussy', 'rich'],
    'ibetchu': ['I', 'bet', 'chu'],
    'dancehall': ['dance', 'hall'],
    'meteorite': ['meteor'],
    'errrbody': ['every', 'body'],
    'ackwards': ['back', 'ward'],
    'happnin': ['happen'],
    'naggin': ['nag'],
    'jigglin': ['jiggle'],
    'twurkulator': ['twerk'],
    'debby': ['deb'],
    'yfn': ['y', 'f', 'n'],
    'leanworld': ['lean', 'world'],
    'luckaleannn': ['luck', 'lean'],
    'oreomilkshake': ['oreo', 'milk', 'shake'],
    'af1s': ['a', 'f', '1', 's'],
    'lightsaber': ['light', 'saber'],
    'sabertooth': ['saber', 'tooth'],
    'greygoose': ['grey', 'goose'],
    'email': ['e', 'mail'],
    'emails': ['e', 'mail'],
    'solarflare': ['solar', 'flare'],
    'voicemail': ['voice', 'mail'],
    'everygirl': ['every', 'girl'],
    '714ever': ['7', '1', '4', 'ever'],
    'reconsider': ['consider'],
    'seesaw': ['see', 'saw'],
    'nearer': ['near'],
    'nanna': ['nana'],
    'lioness': ['lion'],
    'limousine': ['limo'],
    'netherlands': ['nether', 'land'],
    'soften': ['soft'],
    'noname': ['no', 'name'],
    'wifeable': ['wife'],
    'collider': ['collide'],
    'stargirl': ['star', 'girl'],
    'me!': ['me'],
    'brokenheartsville': ['broke', 'heart', 'ville'],
    'fishtail': ['fish', 'tail'],
    'fishtails': ['fish', 'tail'],
    'paperbond': ['paper', 'bond'],
    'lovemaker': ['love', 'make'],
    'battlestations': ['battle', 'station'],
    'battlestation': ['battle', 'station'],
    'sidekick': ['side', 'kick'],
    'doorbell': ['door', 'bell'],
    'leaves': ['leaf'],
    'outpour': ['out', 'pour'],
    'outpouring': ['out', 'pour'],
    'underwhelming': ['under', 'whelm'],
    'icky': ['ick'],
    'fishermen': ['fish', 'men'],
    'fishers': ['fish'],
    'pineapples': ['pine', 'apple'],
    'lovehate': ['love', 'hate'],
    'clappers': ['clap'],
    'fiyah': ['fire'],
    'chessboxin': ['chess', 'box'],
    'learnd': ['learn'],
    'inspectah': ['inspect'],
    'reunited': ['unite'],
    'grimey': ['grime'],
    'visionz': ['vision'],
    'niceguy': ['nice', 'guy'],
    'uncloudy': ['cloud'],
    'jimmie': ['jim'],
    'theyre': ['they'],
    'moneytalks': ['money', 'talk'],
    'pokin': ['poke'],
    'aplhaville': ['alpha', 'ville'],
    'blanguage': ['language'],
    'breakaman': ['break', 'man'],
    'outright': ['out', 'right'],
    'skinned': ['skin'],
    'steamboat': ['steam', 'boat'],
    'waledance': ['wale', 'dance'],
    'bigfoot': ['big', 'foot'],
    'hangmans': ['hang', 'man'],
    'cedarwood': ['cedar', 'web'],
    'withdrawl': ['with', 'drawl'],
    'withdrawls': ['with', 'drawl'],
    'tung': ['tounge'],
    'jodd': ['j', 'o', 'd'],
    'likey': ['like'],
    'droppa': ['drop'],
    'sloppy': ['slop'],
    'toppy': ['top'],
    'bloodshot': ['blood', 'shot'],
    'tricken': ['trick'],
    'cornflake': ['corn', 'flake'],
    'sleeptalker': ['sleep', 'talker'],
    'mindstate': ['mind', 'state'],
    'inkredible': ['incredible'],
    'hoodoo': ['hoo', 'doo'],
    'backside': ['back', 'side'],
    'unbank': ['bank'],
    'floorboards': ['floor', 'board'],
    'woodson': ['wood', 'son'],
    'snowstorm': ['snow', 'storm'],
    'opportunistic': ['opportunity'],
    'botalks': ['bo', 'talk'],
    'yve': ['y', 'v', 'e'],
    'luv2vyk': ['love', '2', 'y', 'v', 'k'],
    'krosses': ['cross'],
    'vicetone': ['vice', 'tone'],
    'ltgtr': ['l', 't', 'g', 'r'],
    'cozi': ['cozy'],
    'pitfalls': ['pit', 'fall'],
    'lovespeake': ['love', 'speak'],
    'lipless': ['lip'],
    'ideh': ['i', 'd', 'e', 'h'],
    'quarterhead': ['quarter', 'head'],
    'serpentwithfeet': ['serpent', 'with', 'feet'],
    'blissing': ['bliss'],
    'boosegumps': ['goose', 'bump', 'boose', 'gump'],
    'kississippi': ['kiss', 'mississippi'],
    '3am': ['3', 'am'],
    '1am': ['1', 'am'],
    'smking': ['smoke'],
    'dth': ['death'],
    'cyberbully': ['cyber', 'bully'],
    'turnaround': ['turn', 'around'],
    'thrashville': ['trash', 'ville']
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stemmer = __webpack_require__(3);

exports = module.exports = __webpack_require__(23);

exports.among = stemmer.among;
exports.except = stemmer.except;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stemmer = __webpack_require__(3),
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createActionSet = actionName => {
    return {
        PENDING: `${actionName}_PENDING`,
        SUCCESS: `${actionName}_SUCCESS`,
        ERROR: `${actionName}_ERROR`
    };
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = __webpack_require__(8);
class Game {
    constructor(id, players, status, stacks) {
        this.id = id;
        this.players = players;
        this.status = status;
        this.stacks = stacks;
    }
    static from(json) {
        const stacks = json.stacks.map(stack => stack_1.default.from(stack));
        const players = {
            viewer: json.players.viewer,
            opponent: json.players.opponent
        };
        return new Game(json.id, players, json.status, stacks);
    }
    lastTurn() {
        const stack = this.lastStack();
        if (!stack) {
            return null;
        }
        if (!stack.turns) {
            return null;
        }
        if (stack.turns.length == 0) {
            return null;
        }
        return stack.lastTurn();
    }
    firstTurn() {
        const stack = this.lastStack();
        if (!stack) {
            return null;
        }
        if (!stack.turns) {
            return null;
        }
        if (stack.turns.length == 0) {
            return null;
        }
        return stack.firstTurn();
    }
    lastStack() {
        if (!this.stacks) {
            return null;
        }
        if (this.stacks.length === 0) {
            return null;
        }
        return this.stacks[this.stacks.length - 1];
    }
}
exports.default = Game;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*jshint esversion: 6 */
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
}
exports.default = Player;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FBFriend {
    constructor(id, name, picture) {
        this.id = id;
        this.name = name;
        this.picture = picture;
    }
    static from(json) {
        return new FBFriend(json.id, json.name, json.picture);
    }
}
exports.default = FBFriend;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DashboardGamePreview {
    constructor(viewersTurn, status, gameId, opponent) {
        this.viewersTurn = viewersTurn;
        this.status = status;
        this.gameId = gameId;
        this.opponent = opponent;
    }
    static from(json) {
        const viewersTurn = json.viewers_turn;
        const status = json.status;
        const gameId = json.game_id;
        const opponent = {
            id: json.opponent.id,
            name: json.opponent.name,
            image: json.opponent.image
        };
        return new DashboardGamePreview(viewersTurn, status, gameId, opponent);
    }
}
exports.default = DashboardGamePreview;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const turn_processor_1 = __webpack_require__(1);
const sanitizer_1 = __webpack_require__(0);
const lastfm_response_verifier_1 = __webpack_require__(2);
const admin_1 = __webpack_require__(30);
const interfaces_1 = __webpack_require__(4);
function performSearch({ sanitizedAnswer }) {
    const apiKey = "80b1866e815a8d2ddf83757bd97fdc76";
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${sanitizedAnswer}&api_key=${apiKey}&format=json`)
        .then(response => response.json());
}
exports.default = {
    reset: () => {
        return dispatch => {
            dispatch(admin_1._reset());
        };
    },
    submitAnswer: (answer) => {
        return dispatch => {
            dispatch(admin_1._debug({
                key: `Received input: ${answer}`,
                options: { tags: [
                        {
                            tag: 'span',
                            range: [0, "Received input:".length]
                        },
                        {
                            tag: 'u',
                            range: ['Received input: '.length, answer.length]
                        }
                    ] }
            }));
            dispatch(admin_1._debug({
                key: 'Sanitizing answer...',
                options: { tags: [
                        {
                            tag: 'i',
                            range: [0, -1]
                        }
                    ] }
            }));
            const sanitizedAnswer = sanitizer_1.sanitize(answer);
            dispatch(admin_1._debug({
                key: `Sanitized answer: ${sanitizedAnswer}`,
                options: { tags: [
                        {
                            tag: 'span',
                            range: [0, 'Sanitized answer:'.length]
                        },
                        {
                            tag: 'span',
                            range: ['Sanitized answer: '.length, sanitizedAnswer.length],
                            style: interfaces_1.TagStyle.Input
                        }
                    ] }
            }));
            dispatch(admin_1._debug({
                key: 'Last.fm',
                options: { tags: [
                        {
                            tag: 'h3',
                            range: [0, -1]
                        }
                    ] }
            }));
            dispatch(admin_1._debug({
                key: `Sending ${sanitizedAnswer} to Last.fm`,
                options: { tags: [
                        {
                            tag: 'span',
                            range: [0, 'Sending'.length]
                        },
                        {
                            tag: 'span',
                            range: ['sending '.length, sanitizedAnswer.length],
                            style: interfaces_1.TagStyle.Input
                        },
                        {
                            tag: 'span',
                            range: [`sending ${sanitizedAnswer} `.length, 'to last.fm'.length]
                        }
                    ] }
            }));
            performSearch({ sanitizedAnswer }).then(json => {
                const tracks = lastfm_response_verifier_1.lastFMResponseVerifier(json);
                if (tracks.length === 0) {
                    dispatch(admin_1._debug({
                        key: '0 results from Last.fm',
                        options: { tags: [
                                {
                                    tag: 'span',
                                    style: interfaces_1.TagStyle.Error,
                                    range: [0, -1]
                                }
                            ] }
                    }));
                    return;
                }
                const trackList = tracks.map(track => {
                    const { artist, name } = track;
                    return `${artist} - ${name}`;
                });
                dispatch(admin_1._debug({
                    key: 'Response:',
                    options: { tags: [
                            {
                                tag: 'span',
                                range: [0, -1],
                                style: interfaces_1.TagStyle.Success
                            }
                        ] }
                }));
                trackList.forEach(track => {
                    dispatch(admin_1._debug({
                        key: track,
                        options: { indent: 1 }
                    }));
                });
                dispatch(admin_1._debug({
                    key: 'Validation',
                    options: { tags: [
                            {
                                tag: 'h3',
                                range: [0, -1]
                            }
                        ] }
                }));
                const match = turn_processor_1.findMatch(answer, tracks, (retVal) => {
                    dispatch(admin_1._debug(retVal));
                });
                if (!match) {
                    dispatch(admin_1._debug({
                        key: 'User input didn\'t match any results from Last.fm',
                        options: { tags: [
                                {
                                    tag: 'span',
                                    style: interfaces_1.TagStyle.Error,
                                    range: [0, -1]
                                }
                            ] }
                    }));
                    return;
                }
                dispatch(admin_1._debug({
                    key: 'Match found:',
                    options: { tags: [
                            {
                                tag: 'span',
                                style: interfaces_1.TagStyle.Success,
                                range: [0, -1]
                            }
                        ] }
                }));
                dispatch(admin_1._debug({
                    key: `${match.artist} - ${match.name}`,
                    options: { indent: 2 }
                }));
            });
        };
    }
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function _debug(data) {
    return {
        type: "DEBUG",
        data: data
    };
}
exports._debug = _debug;
function _reset() {
    return {
        type: "RESET"
    };
}
exports._reset = _reset;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const turn_processor_1 = __webpack_require__(1);
const sanitizer_1 = __webpack_require__(0);
const lastfm_response_verifier_1 = __webpack_require__(2);
const site_1 = __webpack_require__(5);
const types_1 = __webpack_require__(7);
const config_1 = __webpack_require__(32);
const { appId, baseUrl } = config_1.staging;
function performSearch({ sanitizedAnswer }) {
    const apiKey = "80b1866e815a8d2ddf83757bd97fdc76";
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${sanitizedAnswer}&api_key=${apiKey}&format=json`)
        .then(response => response.json());
}
function submitToServer(dispatch, token, gameId, answer, match, gameOver) {
    const headers = new Headers({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    });
    const data = {
        answer: answer,
        match: match,
        game_over: gameOver,
        app_id: appId,
        access_token: token
    };
    fetch(`${baseUrl}/api/v1/games/${gameId}/turn`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(json => {
        const game = types_1.Game.from(json.game);
        dispatch(site_1._answerSubmitted(game));
    })
        .catch(error => {
        dispatch(site_1._answerSubmissionFailed(error));
    });
}
exports.default = {
    setAccessToken: (token) => {
        return dispatch => {
            dispatch(site_1._setAccessToken(token));
        };
    },
    login: (token, expires, local, callback) => {
        return dispatch => {
            const headers = new Headers({
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            });
            const data = { token: token, expires: expires, app_id: appId };
            return fetch(`${baseUrl}/api/v1/auth/create`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
        };
    },
    selectGameInvitee: (friend) => {
        return dispatch => {
            return dispatch(site_1._selectGameInvitee(friend));
        };
    },
    unsetGame: () => {
        return dispatch => {
            return dispatch(site_1._unsetGame());
        };
    },
    fetchGame: (token, gameId) => {
        return dispatch => {
            const headers = new Headers({ 'X-Requested-With': 'XMLHttpRequest' });
            fetch(`${baseUrl}/api/v1/games/${gameId}?app_id=${appId}&access_token=${token}`, {
                credentials: 'same-origin',
                headers: headers
            }).then(response => response.json()).then(json => {
                const game = types_1.Game.from(json.game);
                return dispatch(site_1._fetchedGame(game));
            });
        };
    },
    fetchFriends: () => {
        return dispatch => {
            fetch('/friends', { credentials: 'same-origin' })
                .then(response => response.json())
                .then(json => {
                const friends = json.friends.map(friend => types_1.FBFriend.from(friend));
                dispatch(site_1._fetchFriends(friends));
            });
        };
    },
    submitAnswer: (token, answer, stack) => {
        return dispatch => {
            dispatch(site_1._answerSubmissionStarted());
            // TODO: full sanitization before searching may be too agressive
            // Removing "by" and "-" may be enough
            const sanitizedAnswer = sanitizer_1.sanitize(answer);
            performSearch({ sanitizedAnswer }).then(json => {
                // confirm that our input matches at least 1 track (check the top 5 results)
                // confirm that our match passes the test against the previous turn
                // if the stack can be ended, cofirm that our match passes the test against the first turn
                // make sure we get a response from Last.fm
                const tracks = lastfm_response_verifier_1.lastFMResponseVerifier(json);
                if (tracks.length === 0) {
                    dispatch(site_1._answerSubmissionFailed(`No track found for ${answer}.`));
                    return;
                }
                // Attempt to find a match
                const match = turn_processor_1.findMatch(answer, tracks);
                // Bail early we didn't find a match
                if (!match) {
                    dispatch(site_1._answerSubmissionFailed(`No track found for ${answer}.`));
                    return;
                }
                const previousTurn = stack.firstTurn();
                const hasOverlapWithPreviousTurn = turn_processor_1.matchHasIntersection(match, previousTurn.match);
                // Bail early if there's no overlap with previous turn
                if (!hasOverlapWithPreviousTurn) {
                    dispatch(site_1._answerSubmissionFailed("No similarity to the previous track."));
                    return;
                }
                // Bail early if the 2 artists are the same
                if (match.artist === previousTurn.match.artist) {
                    dispatch(site_1._answerSubmissionFailed("Can't play the same artist twice in a row."));
                    return;
                }
                const trackPlayedAlready = stack.turns.filter((turn) => {
                    return turn.match.artist == match.artist && turn.match.name == match.name;
                });
                if (trackPlayedAlready.length > 0) {
                    dispatch(site_1._answerSubmissionFailed("That song has already been played."));
                    return;
                }
                // validate match against first turN
                if (stack.canEnd) {
                    const firstTurn = stack.lastTurn();
                    const hasOverlapWithFirstTurn = turn_processor_1.matchHasIntersection(match, firstTurn.match);
                    // winner
                    if (hasOverlapWithFirstTurn) {
                        submitToServer(dispatch, token, stack.gameId, answer, match, true);
                        return;
                    }
                }
                // Submit our answer and match to the server
                submitToServer(dispatch, token, stack.gameId, answer, match, false);
            });
        };
    },
    fetchDashboard: (token) => {
        return dispatch => {
            dispatch(site_1._fetchDashboardPending);
            const headers = new Headers({ 'X-Requested-With': 'XMLHttpRequest' });
            return fetch(`${baseUrl}/api/v1/dashboard?app_id=${appId}&access_token=${token}`, {
                credentials: 'same-origin',
                headers: headers
            })
                .then(response => {
                if (response.status !== 200) {
                    return response.json();
                }
                else {
                    throw Error(response.statusText);
                }
            })
                .then(response => response.json())
                .then(json => {
                const groups = json.active_game_previews;
                for (const key in groups) {
                    let previews = groups[key];
                    groups[key] = previews.map(preview => types_1.DashboardGamePreview.from(preview));
                }
                const invites = [];
                return dispatch(site_1._fetchDashboardSuccess({
                    previews: groups,
                    invites: invites
                }));
            })
                .catch(error => {
                console.log(error);
                return dispatch(site_1._fetchDashboardError(error));
            });
        };
    },
    postNotificationsToken: (accessToken, expoToken, deviceId) => {
        return dispatch => {
            const headers = new Headers({
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            });
            const data = {
                access_token: accessToken,
                expo_token: expoToken,
                device_id: deviceId
            };
            return fetch(`${baseUrl}/api/v1/devices/register`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
        };
    }
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.development = {
    sim: {
        appId: "5389c2bba5feea37eaae1fed6637d8c7df8bdaa912a4cb2b5b40a178e17abd97",
        baseUrl: "http://localhost:3000"
    },
    device: {
        appId: "5389c2bba5feea37eaae1fed6637d8c7df8bdaa912a4cb2b5b40a178e17abd97",
        baseUrl: "http://192.168.1.65:3000"
    }
};
exports.staging = {
    appId: "029828097c99845e38f1ac6d43aa43946bf193b80a38f826f47e68ae7f63bbe9",
    baseUrl: "http://track-stack-staging.herokuapp.com"
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const redux_thunk_1 = __webpack_require__(34);
const redux_1 = __webpack_require__(35);
const reducers_1 = __webpack_require__(50);
function default_1({ reducers, middleware }) {
    reducers = Object.assign({}, { main: reducers_1.main, admin: reducers_1.admin }, reducers);
    return redux_1.createStore(redux_1.combineReducers(reducers), redux_1.applyMiddleware(...middleware, redux_thunk_1.default));
}
exports.default = default_1;


/***/ }),
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = __webpack_require__(12);

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = __webpack_require__(47);

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = __webpack_require__(48);

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = __webpack_require__(49);

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = __webpack_require__(17);

var _compose2 = _interopRequireDefault(_compose);

var _warning = __webpack_require__(16);

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol2 = __webpack_require__(14);

var _Symbol3 = _interopRequireDefault(_Symbol2);

var _getRawTag = __webpack_require__(39);

var _getRawTag2 = _interopRequireDefault(_getRawTag);

var _objectToString = __webpack_require__(40);

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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _freeGlobal = __webpack_require__(38);

var _freeGlobal2 = _interopRequireDefault(_freeGlobal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal2.default || freeSelf || Function('return this')();

exports.default = root;

/***/ }),
/* 38 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol2 = __webpack_require__(14);

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
/* 40 */
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _overArg = __webpack_require__(42);

var _overArg2 = _interopRequireDefault(_overArg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Built-in value references. */
var getPrototype = (0, _overArg2.default)(Object.getPrototypeOf, Object);

exports.default = getPrototype;

/***/ }),
/* 42 */
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
/* 43 */
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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(46);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var result = (0, _ponyfill2.default)(root);
exports.default = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(45)(module)))

/***/ }),
/* 45 */
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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = symbolObservablePonyfill;
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineReducers;

var _createStore = __webpack_require__(12);

var _isPlainObject = __webpack_require__(13);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = __webpack_require__(16);

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 48 */
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyMiddleware;

var _compose = __webpack_require__(17);

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = __webpack_require__(51);
exports.main = main_1.default;
var admin_1 = __webpack_require__(52);
exports.admin = admin_1.default;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(6);
const defaultState = { friends: [], game: null, error: null, invitee: null, accessToken: null, dashboard: {} };
function default_1(state = defaultState, action) {
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
        case constants_1.ACCESS_TOKEN.SET: {
            return Object.assign({}, state, { accessToken: action.data });
        }
        case constants_1.DASHBAORD.SUCCESS: {
            return Object.assign({}, state, { dashboard: action.data });
        }
        case constants_1.GAME.UNSET: {
            return Object.assign({}, state, { game: null });
        }
        default:
            return state;
    }
}
exports.default = default_1;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const defaultState = { steps: [] };
function default_1(state = defaultState, action) {
    switch (action.type) {
        case "DEBUG":
            return Object.assign({}, state, { steps: [...state.steps, action.data] });
        case "RESET":
            return defaultState;
        default:
            return state;
    }
}
exports.default = default_1;


/***/ })
/******/ ])));