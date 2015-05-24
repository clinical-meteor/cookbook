(function () {

/* Imports */
var _ = Package.underscore._;

/* Package-scope variables */
var Meteor;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/server_environment.js                                                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
Meteor = {                                                                                                // 1
  isClient: false,                                                                                        // 2
  isServer: true,                                                                                         // 3
  isCordova: false                                                                                        // 4
};                                                                                                        // 5
                                                                                                          // 6
Meteor.settings = {};                                                                                     // 7
                                                                                                          // 8
if (process.env.METEOR_SETTINGS) {                                                                        // 9
  try {                                                                                                   // 10
    Meteor.settings = JSON.parse(process.env.METEOR_SETTINGS);                                            // 11
  } catch (e) {                                                                                           // 12
    throw new Error("METEOR_SETTINGS are not valid JSON: " + process.env.METEOR_SETTINGS);                // 13
  }                                                                                                       // 14
}                                                                                                         // 15
                                                                                                          // 16
// Push a subset of settings to the client.                                                               // 17
if (Meteor.settings && Meteor.settings.public &&                                                          // 18
    typeof __meteor_runtime_config__ === "object") {                                                      // 19
  __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;                                     // 20
}                                                                                                         // 21
                                                                                                          // 22
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/helpers.js                                                                             //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
if (Meteor.isServer)                                                                                      // 1
  var Future = Npm.require('fibers/future');                                                              // 2
                                                                                                          // 3
if (typeof __meteor_runtime_config__ === 'object' &&                                                      // 4
    __meteor_runtime_config__.meteorRelease) {                                                            // 5
  /**                                                                                                     // 6
   * @summary `Meteor.release` is a string containing the name of the [release](#meteorupdate) with which the project was built (for example, `"1.2.3"`). It is `undefined` if the project was built using a git checkout of Meteor.
   * @locus Anywhere                                                                                      // 8
   * @type {String}                                                                                       // 9
   */                                                                                                     // 10
  Meteor.release = __meteor_runtime_config__.meteorRelease;                                               // 11
}                                                                                                         // 12
                                                                                                          // 13
// XXX find a better home for these? Ideally they would be _.get,                                         // 14
// _.ensure, _.delete..                                                                                   // 15
                                                                                                          // 16
_.extend(Meteor, {                                                                                        // 17
  // _get(a,b,c,d) returns a[b][c][d], or else undefined if a[b] or                                       // 18
  // a[b][c] doesn't exist.                                                                               // 19
  //                                                                                                      // 20
  _get: function (obj /*, arguments */) {                                                                 // 21
    for (var i = 1; i < arguments.length; i++) {                                                          // 22
      if (!(arguments[i] in obj))                                                                         // 23
        return undefined;                                                                                 // 24
      obj = obj[arguments[i]];                                                                            // 25
    }                                                                                                     // 26
    return obj;                                                                                           // 27
  },                                                                                                      // 28
                                                                                                          // 29
  // _ensure(a,b,c,d) ensures that a[b][c][d] exists. If it does not,                                     // 30
  // it is created and set to {}. Either way, it is returned.                                             // 31
  //                                                                                                      // 32
  _ensure: function (obj /*, arguments */) {                                                              // 33
    for (var i = 1; i < arguments.length; i++) {                                                          // 34
      var key = arguments[i];                                                                             // 35
      if (!(key in obj))                                                                                  // 36
        obj[key] = {};                                                                                    // 37
      obj = obj[key];                                                                                     // 38
    }                                                                                                     // 39
                                                                                                          // 40
    return obj;                                                                                           // 41
  },                                                                                                      // 42
                                                                                                          // 43
  // _delete(a, b, c, d) deletes a[b][c][d], then a[b][c] unless it                                       // 44
  // isn't empty, then a[b] unless it isn't empty.                                                        // 45
  //                                                                                                      // 46
  _delete: function (obj /*, arguments */) {                                                              // 47
    var stack = [obj];                                                                                    // 48
    var leaf = true;                                                                                      // 49
    for (var i = 1; i < arguments.length - 1; i++) {                                                      // 50
      var key = arguments[i];                                                                             // 51
      if (!(key in obj)) {                                                                                // 52
        leaf = false;                                                                                     // 53
        break;                                                                                            // 54
      }                                                                                                   // 55
      obj = obj[key];                                                                                     // 56
      if (typeof obj !== "object")                                                                        // 57
        break;                                                                                            // 58
      stack.push(obj);                                                                                    // 59
    }                                                                                                     // 60
                                                                                                          // 61
    for (var i = stack.length - 1; i >= 0; i--) {                                                         // 62
      var key = arguments[i+1];                                                                           // 63
                                                                                                          // 64
      if (leaf)                                                                                           // 65
        leaf = false;                                                                                     // 66
      else                                                                                                // 67
        for (var other in stack[i][key])                                                                  // 68
          return; // not empty -- we're done                                                              // 69
                                                                                                          // 70
      delete stack[i][key];                                                                               // 71
    }                                                                                                     // 72
  },                                                                                                      // 73
                                                                                                          // 74
  // wrapAsync can wrap any function that takes some number of arguments that                             // 75
  // can't be undefined, followed by some optional arguments, where the callback                          // 76
  // is the last optional argument.                                                                       // 77
  // e.g. fs.readFile(pathname, [callback]),                                                              // 78
  // fs.open(pathname, flags, [mode], [callback])                                                         // 79
  // For maximum effectiveness and least confusion, wrapAsync should be used on                           // 80
  // functions where the callback is the only argument of type Function.                                  // 81
                                                                                                          // 82
  /**                                                                                                     // 83
   * @memberOf Meteor                                                                                     // 84
   * @summary Wrap a function that takes a callback function as its final parameter. On the server, the wrapped function can be used either synchronously (without passing a callback) or asynchronously (when a callback is passed). On the client, a callback is always required; errors will be logged if there is no callback. If a callback is provided, the environment captured when the original function was called will be restored in the callback.
   * @locus Anywhere                                                                                      // 86
   * @param {Function} func A function that takes a callback as its final parameter                       // 87
   * @param {Object} [context] Optional `this` object against which the original function will be invoked // 88
   */                                                                                                     // 89
  wrapAsync: function (fn, context) {                                                                     // 90
    return function (/* arguments */) {                                                                   // 91
      var self = context || this;                                                                         // 92
      var newArgs = _.toArray(arguments);                                                                 // 93
      var callback;                                                                                       // 94
                                                                                                          // 95
      for (var i = newArgs.length - 1; i >= 0; --i) {                                                     // 96
        var arg = newArgs[i];                                                                             // 97
        var type = typeof arg;                                                                            // 98
        if (type !== "undefined") {                                                                       // 99
          if (type === "function") {                                                                      // 100
            callback = arg;                                                                               // 101
          }                                                                                               // 102
          break;                                                                                          // 103
        }                                                                                                 // 104
      }                                                                                                   // 105
                                                                                                          // 106
      if (! callback) {                                                                                   // 107
        if (Meteor.isClient) {                                                                            // 108
          callback = logErr;                                                                              // 109
        } else {                                                                                          // 110
          var fut = new Future();                                                                         // 111
          callback = fut.resolver();                                                                      // 112
        }                                                                                                 // 113
        ++i; // Insert the callback just after arg.                                                       // 114
      }                                                                                                   // 115
                                                                                                          // 116
      newArgs[i] = Meteor.bindEnvironment(callback);                                                      // 117
      var result = fn.apply(self, newArgs);                                                               // 118
      return fut ? fut.wait() : result;                                                                   // 119
    };                                                                                                    // 120
  },                                                                                                      // 121
                                                                                                          // 122
  // Sets child's prototype to a new object whose prototype is parent's                                   // 123
  // prototype. Used as:                                                                                  // 124
  //   Meteor._inherits(ClassB, ClassA).                                                                  // 125
  //   _.extend(ClassB.prototype, { ... })                                                                // 126
  // Inspired by CoffeeScript's `extend` and Google Closure's `goog.inherits`.                            // 127
  _inherits: function (Child, Parent) {                                                                   // 128
    // copy Parent static properties                                                                      // 129
    for (var key in Parent) {                                                                             // 130
      // make sure we only copy hasOwnProperty properties vs. prototype                                   // 131
      // properties                                                                                       // 132
      if (_.has(Parent, key))                                                                             // 133
        Child[key] = Parent[key];                                                                         // 134
    }                                                                                                     // 135
                                                                                                          // 136
    // a middle member of prototype chain: takes the prototype from the Parent                            // 137
    var Middle = function () {                                                                            // 138
      this.constructor = Child;                                                                           // 139
    };                                                                                                    // 140
    Middle.prototype = Parent.prototype;                                                                  // 141
    Child.prototype = new Middle();                                                                       // 142
    Child.__super__ = Parent.prototype;                                                                   // 143
    return Child;                                                                                         // 144
  }                                                                                                       // 145
});                                                                                                       // 146
                                                                                                          // 147
var warnedAboutWrapAsync = false;                                                                         // 148
                                                                                                          // 149
/**                                                                                                       // 150
 * @deprecated in 0.9.3                                                                                   // 151
 */                                                                                                       // 152
Meteor._wrapAsync = function(fn, context) {                                                               // 153
  if (! warnedAboutWrapAsync) {                                                                           // 154
    Meteor._debug("Meteor._wrapAsync has been renamed to Meteor.wrapAsync");                              // 155
    warnedAboutWrapAsync = true;                                                                          // 156
  }                                                                                                       // 157
  return Meteor.wrapAsync.apply(Meteor, arguments);                                                       // 158
};                                                                                                        // 159
                                                                                                          // 160
function logErr(err) {                                                                                    // 161
  if (err) {                                                                                              // 162
    return Meteor._debug(                                                                                 // 163
      "Exception in callback of async function",                                                          // 164
      err.stack ? err.stack : err                                                                         // 165
    );                                                                                                    // 166
  }                                                                                                       // 167
}                                                                                                         // 168
                                                                                                          // 169
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/setimmediate.js                                                                        //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
// Chooses one of three setImmediate implementations:                                                     // 1
//                                                                                                        // 2
// * Native setImmediate (IE 10, Node 0.9+)                                                               // 3
//                                                                                                        // 4
// * postMessage (many browsers)                                                                          // 5
//                                                                                                        // 6
// * setTimeout  (fallback)                                                                               // 7
//                                                                                                        // 8
// The postMessage implementation is based on                                                             // 9
// https://github.com/NobleJS/setImmediate/tree/1.0.1                                                     // 10
//                                                                                                        // 11
// Don't use `nextTick` for Node since it runs its callbacks before                                       // 12
// I/O, which is stricter than we're looking for.                                                         // 13
//                                                                                                        // 14
// Not installed as a polyfill, as our public API is `Meteor.defer`.                                      // 15
// Since we're not trying to be a polyfill, we have some                                                  // 16
// simplifications:                                                                                       // 17
//                                                                                                        // 18
// If one invocation of a setImmediate callback pauses itself by a                                        // 19
// call to alert/prompt/showModelDialog, the NobleJS polyfill                                             // 20
// implementation ensured that no setImmedate callback would run until                                    // 21
// the first invocation completed.  While correct per the spec, what it                                   // 22
// would mean for us in practice is that any reactive updates relying                                     // 23
// on Meteor.defer would be hung in the main window until the modal                                       // 24
// dialog was dismissed.  Thus we only ensure that a setImmediate                                         // 25
// function is called in a later event loop.                                                              // 26
//                                                                                                        // 27
// We don't need to support using a string to be eval'ed for the                                          // 28
// callback, arguments to the function, or clearImmediate.                                                // 29
                                                                                                          // 30
"use strict";                                                                                             // 31
                                                                                                          // 32
var global = this;                                                                                        // 33
                                                                                                          // 34
                                                                                                          // 35
// IE 10, Node >= 9.1                                                                                     // 36
                                                                                                          // 37
function useSetImmediate() {                                                                              // 38
  if (! global.setImmediate)                                                                              // 39
    return null;                                                                                          // 40
  else {                                                                                                  // 41
    var setImmediate = function (fn) {                                                                    // 42
      global.setImmediate(fn);                                                                            // 43
    };                                                                                                    // 44
    setImmediate.implementation = 'setImmediate';                                                         // 45
    return setImmediate;                                                                                  // 46
  }                                                                                                       // 47
}                                                                                                         // 48
                                                                                                          // 49
                                                                                                          // 50
// Android 2.3.6, Chrome 26, Firefox 20, IE 8-9, iOS 5.1.1 Safari                                         // 51
                                                                                                          // 52
function usePostMessage() {                                                                               // 53
  // The test against `importScripts` prevents this implementation                                        // 54
  // from being installed inside a web worker, where                                                      // 55
  // `global.postMessage` means something completely different and                                        // 56
  // can't be used for this purpose.                                                                      // 57
                                                                                                          // 58
  if (!global.postMessage || global.importScripts) {                                                      // 59
    return null;                                                                                          // 60
  }                                                                                                       // 61
                                                                                                          // 62
  // Avoid synchronous post message implementations.                                                      // 63
                                                                                                          // 64
  var postMessageIsAsynchronous = true;                                                                   // 65
  var oldOnMessage = global.onmessage;                                                                    // 66
  global.onmessage = function () {                                                                        // 67
      postMessageIsAsynchronous = false;                                                                  // 68
  };                                                                                                      // 69
  global.postMessage("", "*");                                                                            // 70
  global.onmessage = oldOnMessage;                                                                        // 71
                                                                                                          // 72
  if (! postMessageIsAsynchronous)                                                                        // 73
    return null;                                                                                          // 74
                                                                                                          // 75
  var funcIndex = 0;                                                                                      // 76
  var funcs = {};                                                                                         // 77
                                                                                                          // 78
  // Installs an event handler on `global` for the `message` event: see                                   // 79
  // * https://developer.mozilla.org/en/DOM/window.postMessage                                            // 80
  // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages       // 81
                                                                                                          // 82
  // XXX use Random.id() here?                                                                            // 83
  var MESSAGE_PREFIX = "Meteor._setImmediate." + Math.random() + '.';                                     // 84
                                                                                                          // 85
  function isStringAndStartsWith(string, putativeStart) {                                                 // 86
    return (typeof string === "string" &&                                                                 // 87
            string.substring(0, putativeStart.length) === putativeStart);                                 // 88
  }                                                                                                       // 89
                                                                                                          // 90
  function onGlobalMessage(event) {                                                                       // 91
    // This will catch all incoming messages (even from other                                             // 92
    // windows!), so we need to try reasonably hard to avoid letting                                      // 93
    // anyone else trick us into firing off. We test the origin is                                        // 94
    // still this window, and that a (randomly generated)                                                 // 95
    // unpredictable identifying prefix is present.                                                       // 96
    if (event.source === global &&                                                                        // 97
        isStringAndStartsWith(event.data, MESSAGE_PREFIX)) {                                              // 98
      var index = event.data.substring(MESSAGE_PREFIX.length);                                            // 99
      try {                                                                                               // 100
        if (funcs[index])                                                                                 // 101
          funcs[index]();                                                                                 // 102
      }                                                                                                   // 103
      finally {                                                                                           // 104
        delete funcs[index];                                                                              // 105
      }                                                                                                   // 106
    }                                                                                                     // 107
  }                                                                                                       // 108
                                                                                                          // 109
  if (global.addEventListener) {                                                                          // 110
    global.addEventListener("message", onGlobalMessage, false);                                           // 111
  } else {                                                                                                // 112
    global.attachEvent("onmessage", onGlobalMessage);                                                     // 113
  }                                                                                                       // 114
                                                                                                          // 115
  var setImmediate = function (fn) {                                                                      // 116
    // Make `global` post a message to itself with the handle and                                         // 117
    // identifying prefix, thus asynchronously invoking our                                               // 118
    // onGlobalMessage listener above.                                                                    // 119
    ++funcIndex;                                                                                          // 120
    funcs[funcIndex] = fn;                                                                                // 121
    global.postMessage(MESSAGE_PREFIX + funcIndex, "*");                                                  // 122
  };                                                                                                      // 123
  setImmediate.implementation = 'postMessage';                                                            // 124
  return setImmediate;                                                                                    // 125
}                                                                                                         // 126
                                                                                                          // 127
                                                                                                          // 128
function useTimeout() {                                                                                   // 129
  var setImmediate = function (fn) {                                                                      // 130
    global.setTimeout(fn, 0);                                                                             // 131
  };                                                                                                      // 132
  setImmediate.implementation = 'setTimeout';                                                             // 133
  return setImmediate;                                                                                    // 134
}                                                                                                         // 135
                                                                                                          // 136
                                                                                                          // 137
Meteor._setImmediate =                                                                                    // 138
  useSetImmediate() ||                                                                                    // 139
  usePostMessage() ||                                                                                     // 140
  useTimeout();                                                                                           // 141
                                                                                                          // 142
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/timers.js                                                                              //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
var withoutInvocation = function (f) {                                                                    // 1
  if (Package.ddp) {                                                                                      // 2
    var _CurrentInvocation = Package.ddp.DDP._CurrentInvocation;                                          // 3
    if (_CurrentInvocation.get() && _CurrentInvocation.get().isSimulation)                                // 4
      throw new Error("Can't set timers inside simulations");                                             // 5
    return function () { _CurrentInvocation.withValue(null, f); };                                        // 6
  }                                                                                                       // 7
  else                                                                                                    // 8
    return f;                                                                                             // 9
};                                                                                                        // 10
                                                                                                          // 11
var bindAndCatch = function (context, f) {                                                                // 12
  return Meteor.bindEnvironment(withoutInvocation(f), context);                                           // 13
};                                                                                                        // 14
                                                                                                          // 15
_.extend(Meteor, {                                                                                        // 16
  // Meteor.setTimeout and Meteor.setInterval callbacks scheduled                                         // 17
  // inside a server method are not part of the method invocation and                                     // 18
  // should clear out the CurrentInvocation environment variable.                                         // 19
                                                                                                          // 20
  /**                                                                                                     // 21
   * @memberOf Meteor                                                                                     // 22
   * @summary Call a function in the future after waiting for a specified delay.                          // 23
   * @locus Anywhere                                                                                      // 24
   * @param {Function} func The function to run                                                           // 25
   * @param {Number} delay Number of milliseconds to wait before calling function                         // 26
   */                                                                                                     // 27
  setTimeout: function (f, duration) {                                                                    // 28
    return setTimeout(bindAndCatch("setTimeout callback", f), duration);                                  // 29
  },                                                                                                      // 30
                                                                                                          // 31
  /**                                                                                                     // 32
   * @memberOf Meteor                                                                                     // 33
   * @summary Call a function repeatedly, with a time delay between calls.                                // 34
   * @locus Anywhere                                                                                      // 35
   * @param {Function} func The function to run                                                           // 36
   * @param {Number} delay Number of milliseconds to wait between each function call.                     // 37
   */                                                                                                     // 38
  setInterval: function (f, duration) {                                                                   // 39
    return setInterval(bindAndCatch("setInterval callback", f), duration);                                // 40
  },                                                                                                      // 41
                                                                                                          // 42
  /**                                                                                                     // 43
   * @memberOf Meteor                                                                                     // 44
   * @summary Cancel a repeating function call scheduled by `Meteor.setInterval`.                         // 45
   * @locus Anywhere                                                                                      // 46
   * @param {Number} id The handle returned by `Meteor.setInterval`                                       // 47
   */                                                                                                     // 48
  clearInterval: function(x) {                                                                            // 49
    return clearInterval(x);                                                                              // 50
  },                                                                                                      // 51
                                                                                                          // 52
  /**                                                                                                     // 53
   * @memberOf Meteor                                                                                     // 54
   * @summary Cancel a function call scheduled by `Meteor.setTimeout`.                                    // 55
   * @locus Anywhere                                                                                      // 56
   * @param {Number} id The handle returned by `Meteor.setTimeout`                                        // 57
   */                                                                                                     // 58
  clearTimeout: function(x) {                                                                             // 59
    return clearTimeout(x);                                                                               // 60
  },                                                                                                      // 61
                                                                                                          // 62
  // XXX consider making this guarantee ordering of defer'd callbacks, like                               // 63
  // Tracker.afterFlush or Node's nextTick (in practice). Then tests can do:                              // 64
  //    callSomethingThatDefersSomeWork();                                                                // 65
  //    Meteor.defer(expect(somethingThatValidatesThatTheWorkHappened));                                  // 66
  defer: function (f) {                                                                                   // 67
    Meteor._setImmediate(bindAndCatch("defer callback", f));                                              // 68
  }                                                                                                       // 69
});                                                                                                       // 70
                                                                                                          // 71
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/errors.js                                                                              //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
// Makes an error subclass which properly contains a stack trace in most                                  // 1
// environments. constructor can set fields on `this` (and should probably set                            // 2
// `message`, which is what gets displayed at the top of a stack trace).                                  // 3
//                                                                                                        // 4
Meteor.makeErrorType = function (name, constructor) {                                                     // 5
  var errorClass = function (/*arguments*/) {                                                             // 6
    var self = this;                                                                                      // 7
                                                                                                          // 8
    // Ensure we get a proper stack trace in most Javascript environments                                 // 9
    if (Error.captureStackTrace) {                                                                        // 10
      // V8 environments (Chrome and Node.js)                                                             // 11
      Error.captureStackTrace(self, errorClass);                                                          // 12
    } else {                                                                                              // 13
      // Firefox                                                                                          // 14
      var e = new Error;                                                                                  // 15
      e.__proto__ = errorClass.prototype;                                                                 // 16
      if (e instanceof errorClass)                                                                        // 17
        self = e;                                                                                         // 18
    }                                                                                                     // 19
    // Safari magically works.                                                                            // 20
                                                                                                          // 21
    constructor.apply(self, arguments);                                                                   // 22
                                                                                                          // 23
    self.errorType = name;                                                                                // 24
                                                                                                          // 25
    return self;                                                                                          // 26
  };                                                                                                      // 27
                                                                                                          // 28
  Meteor._inherits(errorClass, Error);                                                                    // 29
                                                                                                          // 30
  return errorClass;                                                                                      // 31
};                                                                                                        // 32
                                                                                                          // 33
// This should probably be in the livedata package, but we don't want                                     // 34
// to require you to use the livedata package to get it. Eventually we                                    // 35
// should probably rename it to DDP.Error and put it back in the                                          // 36
// 'livedata' package (which we should rename to 'ddp' also.)                                             // 37
//                                                                                                        // 38
// Note: The DDP server assumes that Meteor.Error EJSON-serializes as an object                           // 39
// containing 'error' and optionally 'reason' and 'details'.                                              // 40
// The DDP client manually puts these into Meteor.Error objects. (We don't use                            // 41
// EJSON.addType here because the type is determined by location in the                                   // 42
// protocol, not text on the wire.)                                                                       // 43
                                                                                                          // 44
/**                                                                                                       // 45
 * @summary This class represents a symbolic error thrown by a method.                                    // 46
 * @locus Anywhere                                                                                        // 47
 * @class                                                                                                 // 48
 * @param {String} error A string code uniquely identifying this kind of error.                           // 49
 * This string should be used by callers of the method to determine the                                   // 50
 * appropriate action to take, instead of attempting to parse the reason                                  // 51
 * or details fields. For example:                                                                        // 52
 *                                                                                                        // 53
 * ```                                                                                                    // 54
 * // on the server, pick a code unique to this error                                                     // 55
 * // the reason field should be a useful debug message                                                   // 56
 * throw new Meteor.Error("logged-out",                                                                   // 57
 *   "The user must be logged in to post a comment.");                                                    // 58
 *                                                                                                        // 59
 * // on the client                                                                                       // 60
 * Meteor.call("methodName", function (error) {                                                           // 61
 *   // identify the error                                                                                // 62
 *   if (error.error === "logged-out") {                                                                  // 63
 *     // show a nice error message                                                                       // 64
 *     Session.set("errorMessage", "Please log in to post a comment.");                                   // 65
 *   }                                                                                                    // 66
 * });                                                                                                    // 67
 * ```                                                                                                    // 68
 *                                                                                                        // 69
 * For legacy reasons, some built-in Meteor functions such as `check` throw                               // 70
 * errors with a number in this field.                                                                    // 71
 *                                                                                                        // 72
 * @param {String} [reason] Optional.  A short human-readable summary of the                              // 73
 * error, like 'Not Found'.                                                                               // 74
 * @param {String} [details] Optional.  Additional information about the error,                           // 75
 * like a textual stack trace.                                                                            // 76
 */                                                                                                       // 77
Meteor.Error = Meteor.makeErrorType(                                                                      // 78
  "Meteor.Error",                                                                                         // 79
  function (error, reason, details) {                                                                     // 80
    var self = this;                                                                                      // 81
                                                                                                          // 82
    // Currently, a numeric code, likely similar to a HTTP code (eg,                                      // 83
    // 404, 500). That is likely to change though.                                                        // 84
    self.error = error;                                                                                   // 85
                                                                                                          // 86
    // Optional: A short human-readable summary of the error. Not                                         // 87
    // intended to be shown to end users, just developers. ("Not Found",                                  // 88
    // "Internal Server Error")                                                                           // 89
    self.reason = reason;                                                                                 // 90
                                                                                                          // 91
    // Optional: Additional information about the error, say for                                          // 92
    // debugging. It might be a (textual) stack trace if the server is                                    // 93
    // willing to provide one. The corresponding thing in HTTP would be                                   // 94
    // the body of a 404 or 500 response. (The difference is that we                                      // 95
    // never expect this to be shown to end users, only developers, so                                    // 96
    // it doesn't need to be pretty.)                                                                     // 97
    self.details = details;                                                                               // 98
                                                                                                          // 99
    // This is what gets displayed at the top of a stack trace. Current                                   // 100
    // format is "[404]" (if no reason is set) or "File not found [404]"                                  // 101
    if (self.reason)                                                                                      // 102
      self.message = self.reason + ' [' + self.error + ']';                                               // 103
    else                                                                                                  // 104
      self.message = '[' + self.error + ']';                                                              // 105
  });                                                                                                     // 106
                                                                                                          // 107
// Meteor.Error is basically data and is sent over DDP, so you should be able to                          // 108
// properly EJSON-clone it. This is especially important because if a                                     // 109
// Meteor.Error is thrown through a Future, the error, reason, and details                                // 110
// properties become non-enumerable so a standard Object clone won't preserve                             // 111
// them and they will be lost from DDP.                                                                   // 112
Meteor.Error.prototype.clone = function () {                                                              // 113
  var self = this;                                                                                        // 114
  return new Meteor.Error(self.error, self.reason, self.details);                                         // 115
};                                                                                                        // 116
                                                                                                          // 117
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/fiber_helpers.js                                                                       //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
var path = Npm.require('path');                                                                           // 1
var Fiber = Npm.require('fibers');                                                                        // 2
var Future = Npm.require(path.join('fibers', 'future'));                                                  // 3
                                                                                                          // 4
Meteor._noYieldsAllowed = function (f) {                                                                  // 5
  var savedYield = Fiber.yield;                                                                           // 6
  Fiber.yield = function () {                                                                             // 7
    throw new Error("Can't call yield in a noYieldsAllowed block!");                                      // 8
  };                                                                                                      // 9
  try {                                                                                                   // 10
    return f();                                                                                           // 11
  } finally {                                                                                             // 12
    Fiber.yield = savedYield;                                                                             // 13
  }                                                                                                       // 14
};                                                                                                        // 15
                                                                                                          // 16
Meteor._DoubleEndedQueue = Npm.require('double-ended-queue');                                             // 17
                                                                                                          // 18
// Meteor._SynchronousQueue is a queue which runs task functions serially.                                // 19
// Tasks are assumed to be synchronous: ie, it's assumed that they are                                    // 20
// done when they return.                                                                                 // 21
//                                                                                                        // 22
// It has two methods:                                                                                    // 23
//   - queueTask queues a task to be run, and returns immediately.                                        // 24
//   - runTask queues a task to be run, and then yields. It returns                                       // 25
//     when the task finishes running.                                                                    // 26
//                                                                                                        // 27
// It's safe to call queueTask from within a task, but not runTask (unless                                // 28
// you're calling runTask from a nested Fiber).                                                           // 29
//                                                                                                        // 30
// Somewhat inspired by async.queue, but specific to blocking tasks.                                      // 31
// XXX break this out into an NPM module?                                                                 // 32
// XXX could maybe use the npm 'schlock' module instead, which would                                      // 33
//     also support multiple concurrent "read" tasks                                                      // 34
//                                                                                                        // 35
Meteor._SynchronousQueue = function () {                                                                  // 36
  var self = this;                                                                                        // 37
  // List of tasks to run (not including a currently-running task if any). Each                           // 38
  // is an object with field 'task' (the task function to run) and 'future' (the                          // 39
  // Future associated with the blocking runTask call that queued it, or null if                          // 40
  // called from queueTask).                                                                              // 41
  self._taskHandles = new Meteor._DoubleEndedQueue();                                                     // 42
  // This is true if self._run() is either currently executing or scheduled to                            // 43
  // do so soon.                                                                                          // 44
  self._runningOrRunScheduled = false;                                                                    // 45
  // During the execution of a task, this is set to the fiber used to execute                             // 46
  // that task. We use this to throw an error rather than deadlocking if the                              // 47
  // user calls runTask from within a task on the same fiber.                                             // 48
  self._currentTaskFiber = undefined;                                                                     // 49
  // This is true if we're currently draining.  While we're draining, a further                           // 50
  // drain is a noop, to prevent infinite loops.  "drain" is a heuristic type                             // 51
  // operation, that has a meaning like unto "what a naive person would expect                            // 52
  // when modifying a table from an observe"                                                              // 53
  self._draining = false;                                                                                 // 54
};                                                                                                        // 55
                                                                                                          // 56
_.extend(Meteor._SynchronousQueue.prototype, {                                                            // 57
  runTask: function (task) {                                                                              // 58
    var self = this;                                                                                      // 59
                                                                                                          // 60
    if (!self.safeToRunTask()) {                                                                          // 61
      if (Fiber.current)                                                                                  // 62
        throw new Error("Can't runTask from another task in the same fiber");                             // 63
      else                                                                                                // 64
        throw new Error("Can only call runTask in a Fiber");                                              // 65
    }                                                                                                     // 66
                                                                                                          // 67
    var fut = new Future;                                                                                 // 68
    var handle = {                                                                                        // 69
      task: Meteor.bindEnvironment(task, function (e) {                                                   // 70
        Meteor._debug("Exception from task:", e && e.stack || e);                                         // 71
        throw e;                                                                                          // 72
      }),                                                                                                 // 73
      future: fut,                                                                                        // 74
      name: task.name                                                                                     // 75
    };                                                                                                    // 76
    self._taskHandles.push(handle);                                                                       // 77
    self._scheduleRun();                                                                                  // 78
    // Yield. We'll get back here after the task is run (and will throw if the                            // 79
    // task throws).                                                                                      // 80
    fut.wait();                                                                                           // 81
  },                                                                                                      // 82
  queueTask: function (task) {                                                                            // 83
    var self = this;                                                                                      // 84
    self._taskHandles.push({                                                                              // 85
      task: task,                                                                                         // 86
      name: task.name                                                                                     // 87
    });                                                                                                   // 88
    self._scheduleRun();                                                                                  // 89
    // No need to block.                                                                                  // 90
  },                                                                                                      // 91
                                                                                                          // 92
  flush: function () {                                                                                    // 93
    var self = this;                                                                                      // 94
    self.runTask(function () {});                                                                         // 95
  },                                                                                                      // 96
                                                                                                          // 97
  safeToRunTask: function () {                                                                            // 98
    var self = this;                                                                                      // 99
    return Fiber.current && self._currentTaskFiber !== Fiber.current;                                     // 100
  },                                                                                                      // 101
                                                                                                          // 102
  drain: function () {                                                                                    // 103
    var self = this;                                                                                      // 104
    if (self._draining)                                                                                   // 105
      return;                                                                                             // 106
    if (!self.safeToRunTask())                                                                            // 107
      return;                                                                                             // 108
    self._draining = true;                                                                                // 109
    while (! self._taskHandles.isEmpty()) {                                                               // 110
      self.flush();                                                                                       // 111
    }                                                                                                     // 112
    self._draining = false;                                                                               // 113
  },                                                                                                      // 114
                                                                                                          // 115
  _scheduleRun: function () {                                                                             // 116
    var self = this;                                                                                      // 117
    // Already running or scheduled? Do nothing.                                                          // 118
    if (self._runningOrRunScheduled)                                                                      // 119
      return;                                                                                             // 120
                                                                                                          // 121
    self._runningOrRunScheduled = true;                                                                   // 122
    setImmediate(function () {                                                                            // 123
      Fiber(function () {                                                                                 // 124
        self._run();                                                                                      // 125
      }).run();                                                                                           // 126
    });                                                                                                   // 127
  },                                                                                                      // 128
  _run: function () {                                                                                     // 129
    var self = this;                                                                                      // 130
                                                                                                          // 131
    if (!self._runningOrRunScheduled)                                                                     // 132
      throw new Error("expected to be _runningOrRunScheduled");                                           // 133
                                                                                                          // 134
    if (self._taskHandles.isEmpty()) {                                                                    // 135
      // Done running tasks! Don't immediately schedule another run, but                                  // 136
      // allow future tasks to do so.                                                                     // 137
      self._runningOrRunScheduled = false;                                                                // 138
      return;                                                                                             // 139
    }                                                                                                     // 140
    var taskHandle = self._taskHandles.shift();                                                           // 141
                                                                                                          // 142
    // Run the task.                                                                                      // 143
    self._currentTaskFiber = Fiber.current;                                                               // 144
    var exception = undefined;                                                                            // 145
    try {                                                                                                 // 146
      taskHandle.task();                                                                                  // 147
    } catch (err) {                                                                                       // 148
      if (taskHandle.future) {                                                                            // 149
        // We'll throw this exception through runTask.                                                    // 150
        exception = err;                                                                                  // 151
      } else {                                                                                            // 152
        Meteor._debug("Exception in queued task: " + err.stack);                                          // 153
      }                                                                                                   // 154
    }                                                                                                     // 155
    self._currentTaskFiber = undefined;                                                                   // 156
                                                                                                          // 157
    // Soon, run the next task, if there is any.                                                          // 158
    self._runningOrRunScheduled = false;                                                                  // 159
    self._scheduleRun();                                                                                  // 160
                                                                                                          // 161
    // If this was queued with runTask, let the runTask call return (throwing if                          // 162
    // the task threw).                                                                                   // 163
    if (taskHandle.future) {                                                                              // 164
      if (exception)                                                                                      // 165
        taskHandle.future['throw'](exception);                                                            // 166
      else                                                                                                // 167
        taskHandle.future['return']();                                                                    // 168
    }                                                                                                     // 169
  }                                                                                                       // 170
});                                                                                                       // 171
                                                                                                          // 172
// Sleep. Mostly used for debugging (eg, inserting latency into server                                    // 173
// methods).                                                                                              // 174
//                                                                                                        // 175
Meteor._sleepForMs = function (ms) {                                                                      // 176
  var fiber = Fiber.current;                                                                              // 177
  setTimeout(function() {                                                                                 // 178
    fiber.run();                                                                                          // 179
  }, ms);                                                                                                 // 180
  Fiber.yield();                                                                                          // 181
};                                                                                                        // 182
                                                                                                          // 183
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/startup_server.js                                                                      //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
Meteor.startup = function (callback) {                                                                    // 1
  if (__meteor_bootstrap__.startupHooks) {                                                                // 2
    __meteor_bootstrap__.startupHooks.push(callback);                                                     // 3
  } else {                                                                                                // 4
    // We already started up. Just call it now.                                                           // 5
    callback();                                                                                           // 6
  }                                                                                                       // 7
};                                                                                                        // 8
                                                                                                          // 9
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/debug.js                                                                               //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
var suppress = 0;                                                                                         // 1
                                                                                                          // 2
// replacement for console.log. This is a temporary API. We should                                        // 3
// provide a real logging API soon (possibly just a polyfill for                                          // 4
// console?)                                                                                              // 5
//                                                                                                        // 6
// NOTE: this is used on the server to print the warning about                                            // 7
// having autopublish enabled when you probably meant to turn it                                          // 8
// off. it's not really the proper use of something called                                                // 9
// _debug. the intent is for this message to go to the terminal and                                       // 10
// be very visible. if you change _debug to go someplace else, etc,                                       // 11
// please fix the autopublish code to do something reasonable.                                            // 12
//                                                                                                        // 13
Meteor._debug = function (/* arguments */) {                                                              // 14
  if (suppress) {                                                                                         // 15
    suppress--;                                                                                           // 16
    return;                                                                                               // 17
  }                                                                                                       // 18
  if (typeof console !== 'undefined' &&                                                                   // 19
      typeof console.log !== 'undefined') {                                                               // 20
    if (arguments.length == 0) { // IE Companion breaks otherwise                                         // 21
      // IE10 PP4 requires at least one argument                                                          // 22
      console.log('');                                                                                    // 23
    } else {                                                                                              // 24
      // IE doesn't have console.log.apply, it's not a real Object.                                       // 25
      // http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9                  // 26
      // http://patik.com/blog/complete-cross-browser-console-log/                                        // 27
      if (typeof console.log.apply === "function") {                                                      // 28
        // Most browsers                                                                                  // 29
                                                                                                          // 30
        // Chrome and Safari only hyperlink URLs to source files in first argument of                     // 31
        // console.log, so try to call it with one argument if possible.                                  // 32
        // Approach taken here: If all arguments are strings, join them on space.                         // 33
        // See https://github.com/meteor/meteor/pull/732#issuecomment-13975991                            // 34
        var allArgumentsOfTypeString = true;                                                              // 35
        for (var i = 0; i < arguments.length; i++)                                                        // 36
          if (typeof arguments[i] !== "string")                                                           // 37
            allArgumentsOfTypeString = false;                                                             // 38
                                                                                                          // 39
        if (allArgumentsOfTypeString)                                                                     // 40
          console.log.apply(console, [Array.prototype.join.call(arguments, " ")]);                        // 41
        else                                                                                              // 42
          console.log.apply(console, arguments);                                                          // 43
                                                                                                          // 44
      } else if (typeof Function.prototype.bind === "function") {                                         // 45
        // IE9                                                                                            // 46
        var log = Function.prototype.bind.call(console.log, console);                                     // 47
        log.apply(console, arguments);                                                                    // 48
      } else {                                                                                            // 49
        // IE8                                                                                            // 50
        Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));        // 51
      }                                                                                                   // 52
    }                                                                                                     // 53
  }                                                                                                       // 54
};                                                                                                        // 55
                                                                                                          // 56
// Suppress the next 'count' Meteor._debug messsages. Use this to                                         // 57
// stop tests from spamming the console.                                                                  // 58
//                                                                                                        // 59
Meteor._suppress_log = function (count) {                                                                 // 60
  suppress += count;                                                                                      // 61
};                                                                                                        // 62
                                                                                                          // 63
Meteor._supressed_log_expected = function () {                                                            // 64
  return suppress !== 0;                                                                                  // 65
};                                                                                                        // 66
                                                                                                          // 67
                                                                                                          // 68
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/dynamics_nodejs.js                                                                     //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
// Fiber-aware implementation of dynamic scoping, for use on the server                                   // 1
                                                                                                          // 2
var Fiber = Npm.require('fibers');                                                                        // 3
                                                                                                          // 4
var nextSlot = 0;                                                                                         // 5
                                                                                                          // 6
Meteor._nodeCodeMustBeInFiber = function () {                                                             // 7
  if (!Fiber.current) {                                                                                   // 8
    throw new Error("Meteor code must always run within a Fiber. " +                                      // 9
                    "Try wrapping callbacks that you pass to non-Meteor " +                               // 10
                    "libraries with Meteor.bindEnvironment.");                                            // 11
  }                                                                                                       // 12
};                                                                                                        // 13
                                                                                                          // 14
Meteor.EnvironmentVariable = function () {                                                                // 15
  this.slot = nextSlot++;                                                                                 // 16
};                                                                                                        // 17
                                                                                                          // 18
_.extend(Meteor.EnvironmentVariable.prototype, {                                                          // 19
  get: function () {                                                                                      // 20
    Meteor._nodeCodeMustBeInFiber();                                                                      // 21
                                                                                                          // 22
    return Fiber.current._meteor_dynamics &&                                                              // 23
      Fiber.current._meteor_dynamics[this.slot];                                                          // 24
  },                                                                                                      // 25
                                                                                                          // 26
  // Most Meteor code ought to run inside a fiber, and the                                                // 27
  // _nodeCodeMustBeInFiber assertion helps you remember to include appropriate                           // 28
  // bindEnvironment calls (which will get you the *right value* for your                                 // 29
  // environment variables, on the server).                                                               // 30
  //                                                                                                      // 31
  // In some very special cases, it's more important to run Meteor code on the                            // 32
  // server in non-Fiber contexts rather than to strongly enforce the safeguard                           // 33
  // against forgetting to use bindEnvironment. For example, using `check` in                             // 34
  // some top-level constructs like connect handlers without needing unnecessary                          // 35
  // Fibers on every request is more important that possibly failing to find the                          // 36
  // correct argumentChecker. So this function is just like get(), but it                                 // 37
  // returns null rather than throwing when called from outside a Fiber. (On the                          // 38
  // client, it is identical to get().)                                                                   // 39
  getOrNullIfOutsideFiber: function () {                                                                  // 40
    if (!Fiber.current)                                                                                   // 41
      return null;                                                                                        // 42
    return this.get();                                                                                    // 43
  },                                                                                                      // 44
                                                                                                          // 45
  withValue: function (value, func) {                                                                     // 46
    Meteor._nodeCodeMustBeInFiber();                                                                      // 47
                                                                                                          // 48
    if (!Fiber.current._meteor_dynamics)                                                                  // 49
      Fiber.current._meteor_dynamics = [];                                                                // 50
    var currentValues = Fiber.current._meteor_dynamics;                                                   // 51
                                                                                                          // 52
    var saved = currentValues[this.slot];                                                                 // 53
    try {                                                                                                 // 54
      currentValues[this.slot] = value;                                                                   // 55
      var ret = func();                                                                                   // 56
    } finally {                                                                                           // 57
      currentValues[this.slot] = saved;                                                                   // 58
    }                                                                                                     // 59
                                                                                                          // 60
    return ret;                                                                                           // 61
  }                                                                                                       // 62
});                                                                                                       // 63
                                                                                                          // 64
// Meteor application code is always supposed to be run inside a                                          // 65
// fiber. bindEnvironment ensures that the function it wraps is run from                                  // 66
// inside a fiber and ensures it sees the values of Meteor environment                                    // 67
// variables that are set at the time bindEnvironment is called.                                          // 68
//                                                                                                        // 69
// If an environment-bound function is called from outside a fiber (eg, from                              // 70
// an asynchronous callback from a non-Meteor library such as MongoDB), it'll                             // 71
// kick off a new fiber to execute the function, and returns undefined as soon                            // 72
// as that fiber returns or yields (and func's return value is ignored).                                  // 73
//                                                                                                        // 74
// If it's called inside a fiber, it works normally (the                                                  // 75
// return value of the function will be passed through, and no new                                        // 76
// fiber will be created.)                                                                                // 77
//                                                                                                        // 78
// `onException` should be a function or a string.  When it is a                                          // 79
// function, it is called as a callback when the bound function raises                                    // 80
// an exception.  If it is a string, it should be a description of the                                    // 81
// callback, and when an exception is raised a debug message will be                                      // 82
// printed with the description.                                                                          // 83
Meteor.bindEnvironment = function (func, onException, _this) {                                            // 84
  Meteor._nodeCodeMustBeInFiber();                                                                        // 85
                                                                                                          // 86
  var boundValues = _.clone(Fiber.current._meteor_dynamics || []);                                        // 87
                                                                                                          // 88
  if (!onException || typeof(onException) === 'string') {                                                 // 89
    var description = onException || "callback of async function";                                        // 90
    onException = function (error) {                                                                      // 91
      Meteor._debug(                                                                                      // 92
        "Exception in " + description + ":",                                                              // 93
        error && error.stack || error                                                                     // 94
      );                                                                                                  // 95
    };                                                                                                    // 96
  }                                                                                                       // 97
                                                                                                          // 98
  return function (/* arguments */) {                                                                     // 99
    var args = _.toArray(arguments);                                                                      // 100
                                                                                                          // 101
    var runWithEnvironment = function () {                                                                // 102
      var savedValues = Fiber.current._meteor_dynamics;                                                   // 103
      try {                                                                                               // 104
        // Need to clone boundValues in case two fibers invoke this                                       // 105
        // function at the same time                                                                      // 106
        Fiber.current._meteor_dynamics = _.clone(boundValues);                                            // 107
        var ret = func.apply(_this, args);                                                                // 108
      } catch (e) {                                                                                       // 109
        // note: callback-hook currently relies on the fact that if onException                           // 110
        // throws and you were originally calling the wrapped callback from                               // 111
        // within a Fiber, the wrapped call throws.                                                       // 112
        onException(e);                                                                                   // 113
      } finally {                                                                                         // 114
        Fiber.current._meteor_dynamics = savedValues;                                                     // 115
      }                                                                                                   // 116
      return ret;                                                                                         // 117
    };                                                                                                    // 118
                                                                                                          // 119
    if (Fiber.current)                                                                                    // 120
      return runWithEnvironment();                                                                        // 121
    Fiber(runWithEnvironment).run();                                                                      // 122
  };                                                                                                      // 123
};                                                                                                        // 124
                                                                                                          // 125
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/url_server.js                                                                          //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
if (process.env.ROOT_URL &&                                                                               // 1
    typeof __meteor_runtime_config__ === "object") {                                                      // 2
  __meteor_runtime_config__.ROOT_URL = process.env.ROOT_URL;                                              // 3
  if (__meteor_runtime_config__.ROOT_URL) {                                                               // 4
    var parsedUrl = Npm.require('url').parse(__meteor_runtime_config__.ROOT_URL);                         // 5
    // Sometimes users try to pass, eg, ROOT_URL=mydomain.com.                                            // 6
    if (!parsedUrl.host) {                                                                                // 7
      throw Error("$ROOT_URL, if specified, must be an URL");                                             // 8
    }                                                                                                     // 9
    var pathPrefix = parsedUrl.pathname;                                                                  // 10
    if (pathPrefix.slice(-1) === '/') {                                                                   // 11
      // remove trailing slash (or turn "/" into "")                                                      // 12
      pathPrefix = pathPrefix.slice(0, -1);                                                               // 13
    }                                                                                                     // 14
    __meteor_runtime_config__.ROOT_URL_PATH_PREFIX = pathPrefix;                                          // 15
  } else {                                                                                                // 16
    __meteor_runtime_config__.ROOT_URL_PATH_PREFIX = "";                                                  // 17
  }                                                                                                       // 18
}                                                                                                         // 19
                                                                                                          // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/url_common.js                                                                          //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
/**                                                                                                       // 1
 * @summary Generate an absolute URL pointing to the application. The server reads from the `ROOT_URL` environment variable to determine where it is running. This is taken care of automatically for apps deployed with `meteor deploy`, but must be provided when using `meteor build`.
 * @locus Anywhere                                                                                        // 3
 * @param {String} [path] A path to append to the root URL. Do not include a leading "`/`".               // 4
 * @param {Object} [options]                                                                              // 5
 * @param {Boolean} options.secure Create an HTTPS URL.                                                   // 6
 * @param {Boolean} options.replaceLocalhost Replace localhost with 127.0.0.1. Useful for services that don't recognize localhost as a domain name.
 * @param {String} options.rootUrl Override the default ROOT_URL from the server environment. For example: "`http://foo.example.com`"
 */                                                                                                       // 9
Meteor.absoluteUrl = function (path, options) {                                                           // 10
  // path is optional                                                                                     // 11
  if (!options && typeof path === 'object') {                                                             // 12
    options = path;                                                                                       // 13
    path = undefined;                                                                                     // 14
  }                                                                                                       // 15
  // merge options with defaults                                                                          // 16
  options = _.extend({}, Meteor.absoluteUrl.defaultOptions, options || {});                               // 17
                                                                                                          // 18
  var url = options.rootUrl;                                                                              // 19
  if (!url)                                                                                               // 20
    throw new Error("Must pass options.rootUrl or set ROOT_URL in the server environment");               // 21
                                                                                                          // 22
  if (!/^http[s]?:\/\//i.test(url)) // url starts with 'http://' or 'https://'                            // 23
    url = 'http://' + url; // we will later fix to https if options.secure is set                         // 24
                                                                                                          // 25
  if (!/\/$/.test(url)) // url ends with '/'                                                              // 26
    url += '/';                                                                                           // 27
                                                                                                          // 28
  if (path)                                                                                               // 29
    url += path;                                                                                          // 30
                                                                                                          // 31
  // turn http to https if secure option is set, and we're not talking                                    // 32
  // to localhost.                                                                                        // 33
  if (options.secure &&                                                                                   // 34
      /^http:/.test(url) && // url starts with 'http:'                                                    // 35
      !/http:\/\/localhost[:\/]/.test(url) && // doesn't match localhost                                  // 36
      !/http:\/\/127\.0\.0\.1[:\/]/.test(url)) // or 127.0.0.1                                            // 37
    url = url.replace(/^http:/, 'https:');                                                                // 38
                                                                                                          // 39
  if (options.replaceLocalhost)                                                                           // 40
    url = url.replace(/^http:\/\/localhost([:\/].*)/, 'http://127.0.0.1$1');                              // 41
                                                                                                          // 42
  return url;                                                                                             // 43
};                                                                                                        // 44
                                                                                                          // 45
// allow later packages to override default options                                                       // 46
Meteor.absoluteUrl.defaultOptions = { };                                                                  // 47
if (typeof __meteor_runtime_config__ === "object" &&                                                      // 48
    __meteor_runtime_config__.ROOT_URL)                                                                   // 49
  Meteor.absoluteUrl.defaultOptions.rootUrl = __meteor_runtime_config__.ROOT_URL;                         // 50
                                                                                                          // 51
                                                                                                          // 52
Meteor._relativeToSiteRootUrl = function (link) {                                                         // 53
  if (typeof __meteor_runtime_config__ === "object" &&                                                    // 54
      link.substr(0, 1) === "/")                                                                          // 55
    link = (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "") + link;                                 // 56
  return link;                                                                                            // 57
};                                                                                                        // 58
                                                                                                          // 59
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/meteor/flush-buffers-on-exit-in-windows.js                                                    //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
if (process.platform === "win32") {                                                                       // 1
  /*                                                                                                      // 2
   * Based on https://github.com/cowboy/node-exit                                                         // 3
   *                                                                                                      // 4
   * Copyright (c) 2013 "Cowboy" Ben Alman                                                                // 5
   * Licensed under the MIT license.                                                                      // 6
   */                                                                                                     // 7
  var origProcessExit = process.exit.bind(process);                                                       // 8
  process.exit = function (exitCode) {                                                                    // 9
    var streams = [process.stdout, process.stderr];                                                       // 10
    var drainCount = 0;                                                                                   // 11
    // Actually exit if all streams are drained.                                                          // 12
    function tryToExit() {                                                                                // 13
      if (drainCount === streams.length) {                                                                // 14
        origProcessExit(exitCode);                                                                        // 15
      }                                                                                                   // 16
    }                                                                                                     // 17
    streams.forEach(function(stream) {                                                                    // 18
      // Count drained streams now, but monitor non-drained streams.                                      // 19
      if (stream.bufferSize === 0) {                                                                      // 20
        drainCount++;                                                                                     // 21
      } else {                                                                                            // 22
        stream.write('', 'utf-8', function() {                                                            // 23
          drainCount++;                                                                                   // 24
          tryToExit();                                                                                    // 25
        });                                                                                               // 26
      }                                                                                                   // 27
      // Prevent further writing.                                                                         // 28
      stream.write = function() {};                                                                       // 29
    });                                                                                                   // 30
    // If all streams were already drained, exit now.                                                     // 31
    tryToExit();                                                                                          // 32
    // In Windows, when run as a Node.js child process, a script utilizing                                // 33
    // this library might just exit with a 0 exit code, regardless. This code,                            // 34
    // despite the fact that it looks a bit crazy, appears to fix that.                                   // 35
    process.on('exit', function() {                                                                       // 36
      origProcessExit(exitCode);                                                                          // 37
    });                                                                                                   // 38
  };                                                                                                      // 39
}                                                                                                         // 40
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.meteor = {
  Meteor: Meteor
};

})();

//# sourceMappingURL=meteor.js.map
