//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var Handler, MiddlewareStack, Iron;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/iron:middleware-stack/lib/handler.js                                                       //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Url = Iron.Url;                                                                                    // 1
                                                                                                       // 2
Handler = function (path, fn, options) {                                                               // 3
  if (_.isFunction(path)) {                                                                            // 4
    options = options || fn || {};                                                                     // 5
    fn = path;                                                                                         // 6
    path = '/';                                                                                        // 7
                                                                                                       // 8
    // probably need a better approach here to differentiate between                                   // 9
    // Router.use(function () {}) and Router.use(MyAdminApp). In the first                             // 10
    // case we don't want to count it as a viable server handler when we're                            // 11
    // on the client and need to decide whether to go to the server. in the                            // 12
    // latter case, we DO want to go to the server, potentially.                                       // 13
    this.middleware = true;                                                                            // 14
                                                                                                       // 15
    if (typeof options.mount === 'undefined')                                                          // 16
      options.mount = true;                                                                            // 17
  }                                                                                                    // 18
                                                                                                       // 19
  // if fn is a function then typeof fn => 'function'                                                  // 20
  // but note we can't use _.isObject here because that will return true if the                        // 21
  // fn is a function OR an object.                                                                    // 22
  if (typeof fn === 'object') {                                                                        // 23
    options = fn;                                                                                      // 24
    fn = options.action || 'action';                                                                   // 25
  }                                                                                                    // 26
                                                                                                       // 27
  options = options || {};                                                                             // 28
                                                                                                       // 29
  this.options = options;                                                                              // 30
  this.mount = options.mount;                                                                          // 31
  this.method = (options.method && options.method.toLowerCase()) || false;                             // 32
                                                                                                       // 33
  // should the handler be on the 'client', 'server' or 'both'?                                        // 34
  // XXX can't we default this to undefined in which case it's run in all                              // 35
  // environments?                                                                                     // 36
  this.where = options.where || 'client';                                                              // 37
                                                                                                       // 38
  // if we're mounting at path '/foo' then this handler should also handle                             // 39
  // '/foo/bar' and '/foo/bar/baz'                                                                     // 40
  if (this.mount)                                                                                      // 41
    options.end = false;                                                                               // 42
                                                                                                       // 43
  // set the name                                                                                      // 44
  if (options.name)                                                                                    // 45
    this.name = options.name;                                                                          // 46
  else if (typeof path === 'string' && path.charAt(0) !== '/')                                         // 47
    this.name = path;                                                                                  // 48
  else if (fn && fn.name)                                                                              // 49
    this.name = fn.name;                                                                               // 50
  else if (typeof path === 'string' && path !== '/')                                                   // 51
    this.name = path.split('/').slice(1).join('.');                                                    // 52
                                                                                                       // 53
  // if the path is explicitly set on the options (e.g. legacy router support)                         // 54
  // then use that                                                                                     // 55
  // otherwise use the path argument which could also be a name                                        // 56
  path = options.path || path;                                                                         // 57
                                                                                                       // 58
  if (typeof path === 'string' && path.charAt(0) !== '/')                                              // 59
    path = '/' + path;                                                                                 // 60
                                                                                                       // 61
  this.path = path;                                                                                    // 62
  this.compiledUrl = new Url(path, options);                                                           // 63
                                                                                                       // 64
  if (_.isString(fn)) {                                                                                // 65
    this.handle = function handle () {                                                                 // 66
      // try to find a method on the current thisArg which might be a Controller                       // 67
      // for example.                                                                                  // 68
      var func = this[fn];                                                                             // 69
                                                                                                       // 70
      if (typeof func !== 'function')                                                                  // 71
        throw new Error("No method named " + JSON.stringify(fn) + " found on handler.");               // 72
                                                                                                       // 73
      return func.apply(this, arguments);                                                              // 74
    };                                                                                                 // 75
  } else if (_.isFunction(fn)) {                                                                       // 76
    // or just a regular old function                                                                  // 77
    this.handle = fn;                                                                                  // 78
  }                                                                                                    // 79
};                                                                                                     // 80
                                                                                                       // 81
/**                                                                                                    // 82
 * Returns true if the path matches the handler's compiled url, method                                 // 83
 * and environment (e.g. client/server). If no options.method or options.where                         // 84
 * is provided, then only the path will be used to test.                                               // 85
 */                                                                                                    // 86
Handler.prototype.test = function (path, options) {                                                    // 87
  options = options || {};                                                                             // 88
                                                                                                       // 89
  var isUrlMatch = this.compiledUrl.test(path);                                                        // 90
  var isMethodMatch = true;                                                                            // 91
  var isEnvMatch = true;                                                                               // 92
                                                                                                       // 93
  if (this.method && options.method)                                                                   // 94
    isMethodMatch = this.method == options.method.toLowerCase();                                       // 95
                                                                                                       // 96
  if (options.where)                                                                                   // 97
    isEnvMatch = this.where == options.where;                                                          // 98
                                                                                                       // 99
  return isUrlMatch && isMethodMatch && isEnvMatch;                                                    // 100
};                                                                                                     // 101
                                                                                                       // 102
Handler.prototype.params = function (path) {                                                           // 103
  return this.compiledUrl.params(path);                                                                // 104
};                                                                                                     // 105
                                                                                                       // 106
Handler.prototype.resolve = function (params, options) {                                               // 107
  return this.compiledUrl.resolve(params, options);                                                    // 108
};                                                                                                     // 109
                                                                                                       // 110
/**                                                                                                    // 111
 * Returns a new cloned Handler.                                                                       // 112
 * XXX problem is here because we're not storing the original path.                                    // 113
 */                                                                                                    // 114
Handler.prototype.clone = function () {                                                                // 115
  var clone = new Handler(this.path, this.handle, this.options);                                       // 116
  // in case the original function had a name                                                          // 117
  clone.name = this.name;                                                                              // 118
  return clone;                                                                                        // 119
};                                                                                                     // 120
                                                                                                       // 121
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/iron:middleware-stack/lib/middleware_stack.js                                              //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Url = Iron.Url;                                                                                    // 1
var assert = Iron.utils.assert;                                                                        // 2
var defaultValue = Iron.utils.defaultValue;                                                            // 3
                                                                                                       // 4
/**                                                                                                    // 5
 * Connect inspired middleware stack that works on the client and the server.                          // 6
 *                                                                                                     // 7
 * You can add handlers to the stack for various paths. Those handlers can run                         // 8
 * on the client or server. Then you can dispatch into the stack with a                                // 9
 * given path by calling the dispatch method. This goes down the stack looking                         // 10
 * for matching handlers given the url and environment (client/server). If we're                       // 11
 * on the client and we should make a trip to the server, the onServerDispatch                         // 12
 * callback is called.                                                                                 // 13
 *                                                                                                     // 14
 * The middleware stack supports the Connect API. But it also allows you to                            // 15
 * specify a context so we can have one context object (like a Controller) that                        // 16
 * is a consistent context for each handler function called on a dispatch.                             // 17
 *                                                                                                     // 18
 */                                                                                                    // 19
MiddlewareStack = function () {                                                                        // 20
  this._stack = [];                                                                                    // 21
  this.length = 0;                                                                                     // 22
};                                                                                                     // 23
                                                                                                       // 24
MiddlewareStack.prototype._create = function (path, fn, options) {                                     // 25
  var handler = new Handler(path, fn, options);                                                        // 26
  var name = handler.name;                                                                             // 27
                                                                                                       // 28
  if (name) {                                                                                          // 29
    if (_.has(this._stack, name)) {                                                                    // 30
      throw new Error("Handler with name '" + name + "' already exists.");                             // 31
    }                                                                                                  // 32
    this._stack[name] = handler;                                                                       // 33
  }                                                                                                    // 34
                                                                                                       // 35
  return handler;                                                                                      // 36
};                                                                                                     // 37
                                                                                                       // 38
MiddlewareStack.prototype.findByName = function (name) {                                               // 39
  return this._stack[name];                                                                            // 40
};                                                                                                     // 41
                                                                                                       // 42
/**                                                                                                    // 43
 * Push a new handler onto the stack.                                                                  // 44
 */                                                                                                    // 45
MiddlewareStack.prototype.push = function (path, fn, options) {                                        // 46
  var handler = this._create(path, fn, options);                                                       // 47
  this._stack.push(handler);                                                                           // 48
  this.length++;                                                                                       // 49
  return handler;                                                                                      // 50
};                                                                                                     // 51
                                                                                                       // 52
MiddlewareStack.prototype.append = function (/* fn1, fn2, [f3, f4]... */) {                            // 53
  var self = this;                                                                                     // 54
  var args = _.toArray(arguments);                                                                     // 55
  var options = {};                                                                                    // 56
                                                                                                       // 57
  if (typeof args[args.length-1] === 'object')                                                         // 58
    options = args.pop();                                                                              // 59
                                                                                                       // 60
  _.each(args, function (fnOrArray) {                                                                  // 61
    if (typeof fnOrArray === 'undefined')                                                              // 62
      return;                                                                                          // 63
    else if (typeof fnOrArray === 'function')                                                          // 64
      self.push(fnOrArray, options);                                                                   // 65
    else if (_.isArray(fnOrArray))                                                                     // 66
      self.append.apply(self, fnOrArray.concat([options]));                                            // 67
    else                                                                                               // 68
      throw new Error("Can only append functions or arrays to the MiddlewareStack");                   // 69
  });                                                                                                  // 70
                                                                                                       // 71
  return this;                                                                                         // 72
};                                                                                                     // 73
                                                                                                       // 74
/**                                                                                                    // 75
 * Insert a handler at a specific index in the stack.                                                  // 76
 *                                                                                                     // 77
 * The index behavior is the same as Array.prototype.splice. If the index is                           // 78
 * greater than the stack length the handler will be appended at the end of the                        // 79
 * stack. If the index is negative, the item will be inserted "index" elements                         // 80
 * from the end.                                                                                       // 81
 */                                                                                                    // 82
MiddlewareStack.prototype.insertAt = function (index, path, fn, options) {                             // 83
  var handler = this._create(path, fn, options);                                                       // 84
  this._stack.splice(index, 0, handler);                                                               // 85
  this.length = this._stack.length;                                                                    // 86
  return this;                                                                                         // 87
};                                                                                                     // 88
                                                                                                       // 89
/**                                                                                                    // 90
 * Insert a handler before another named handler.                                                      // 91
 */                                                                                                    // 92
MiddlewareStack.prototype.insertBefore = function (name, path, fn, options) {                          // 93
  var beforeHandler;                                                                                   // 94
  var index;                                                                                           // 95
                                                                                                       // 96
  if (!(beforeHandler = this._stack[name]))                                                            // 97
    throw new Error("Couldn't find a handler named '" + name + "' on the path stack");                 // 98
                                                                                                       // 99
  index = _.indexOf(this._stack, beforeHandler);                                                       // 100
  this.insertAt(index, path, fn, options);                                                             // 101
  return this;                                                                                         // 102
};                                                                                                     // 103
                                                                                                       // 104
/**                                                                                                    // 105
 * Insert a handler after another named handler.                                                       // 106
 *                                                                                                     // 107
 */                                                                                                    // 108
MiddlewareStack.prototype.insertAfter = function (name, path, fn, options) {                           // 109
  var handler;                                                                                         // 110
  var index;                                                                                           // 111
                                                                                                       // 112
  if (!(handler = this._stack[name]))                                                                  // 113
    throw new Error("Couldn't find a handler named '" + name + "' on the path stack");                 // 114
                                                                                                       // 115
  index = _.indexOf(this._stack, handler);                                                             // 116
  this.insertAt(index + 1, path, fn, options);                                                         // 117
  return this;                                                                                         // 118
};                                                                                                     // 119
                                                                                                       // 120
/**                                                                                                    // 121
 * Return a new MiddlewareStack comprised of this stack joined with other                              // 122
 * stacks. Note the new stack will not have named handlers anymore. Only the                           // 123
 * handlers are cloned but not the name=>handler mapping.                                              // 124
 */                                                                                                    // 125
MiddlewareStack.prototype.concat = function (/* stack1, stack2, */) {                                  // 126
  var ret = new MiddlewareStack;                                                                       // 127
  var concat = Array.prototype.concat;                                                                 // 128
  var clonedThisStack = EJSON.clone(this._stack);                                                      // 129
  var clonedOtherStacks = _.map(_.toArray(arguments), function (s) { return EJSON.clone(s._stack); }); // 130
  ret._stack = concat.apply(clonedThisStack, clonedOtherStacks);                                       // 131
  this.length = ret._stack.length;                                                                     // 132
  return ret;                                                                                          // 133
};                                                                                                     // 134
                                                                                                       // 135
/**                                                                                                    // 136
 * Dispatch into the middleware stack, allowing the handlers to control the                            // 137
 * iteration by calling this.next();                                                                   // 138
 */                                                                                                    // 139
MiddlewareStack.prototype.dispatch = function dispatch (url, context, done) {                          // 140
  var self = this;                                                                                     // 141
  var originalUrl = url;                                                                               // 142
                                                                                                       // 143
  assert(typeof url === 'string', "Requires url");                                                     // 144
  assert(typeof context === 'object', "Requires context object");                                      // 145
                                                                                                       // 146
  url = Url.normalize(url || '/');                                                                     // 147
                                                                                                       // 148
  defaultValue(context, 'request', {});                                                                // 149
  defaultValue(context, 'response', {});                                                               // 150
  defaultValue(context, 'originalUrl', url);                                                           // 151
                                                                                                       // 152
  //defaultValue(context, 'location', Url.parse(originalUrl));                                         // 153
  defaultValue(context, '_method', context.method);                                                    // 154
  defaultValue(context, '_handlersForEnv', {client: false, server: false});                            // 155
  defaultValue(context, '_handled', false);                                                            // 156
                                                                                                       // 157
  defaultValue(context, 'isHandled', function () {                                                     // 158
    return context._handled;                                                                           // 159
  });                                                                                                  // 160
                                                                                                       // 161
  defaultValue(context, 'willBeHandledOnClient', function () {                                         // 162
    return context._handlersForEnv.client;                                                             // 163
  });                                                                                                  // 164
                                                                                                       // 165
  defaultValue(context, 'willBeHandledOnServer', function () {                                         // 166
    return context._handlersForEnv.server;                                                             // 167
  });                                                                                                  // 168
                                                                                                       // 169
  var wrappedDone = function () {                                                                      // 170
    if (done) {                                                                                        // 171
      try {                                                                                            // 172
        done.apply(this, arguments);                                                                   // 173
      } catch (err) {                                                                                  // 174
        // if we catch an error at this point in the stack we don't want it                            // 175
        // handled in the next() iterator below. So we'll mark the error to tell                       // 176
        // the next iterator to ignore it.                                                             // 177
        err._punt = true;                                                                              // 178
                                                                                                       // 179
        // now rethrow it!                                                                             // 180
        throw err;                                                                                     // 181
      }                                                                                                // 182
    }                                                                                                  // 183
  };                                                                                                   // 184
                                                                                                       // 185
  var index = 0;                                                                                       // 186
                                                                                                       // 187
  var next = Meteor.bindEnvironment(function boundNext (err) {                                         // 188
    var handler = self._stack[index++];                                                                // 189
                                                                                                       // 190
    // reset the url                                                                                   // 191
    context.url = context.request.url = context.originalUrl;                                           // 192
                                                                                                       // 193
    if (!handler)                                                                                      // 194
      return wrappedDone.call(context, err);                                                           // 195
                                                                                                       // 196
    if (!handler.test(url, {method: context._method}))                                                 // 197
      return next(err);                                                                                // 198
                                                                                                       // 199
    // okay if we've gotten this far the handler matches our url but we still                          // 200
    // don't know if this is a client or server handler. Let's track that.                             // 201
    // XXX couldn't the environment be something else like cordova?                                    // 202
    var where = Meteor.isClient ? 'client' : 'server';                                                 // 203
                                                                                                       // 204
    // track that we have a handler for the given environment so long as it's                          // 205
    // not middleware created like this Router.use(function () {}). We'll assume                       // 206
    // that if the handler is of that form we don't want to make a trip to                             // 207
    // the client or the server for it.                                                                // 208
    if (!handler.middleware)                                                                           // 209
      context._handlersForEnv[handler.where] = true;                                                   // 210
                                                                                                       // 211
    // but if we're not actually on that env, skip to the next handler.                                // 212
    if (handler.where !== where)                                                                       // 213
      return next(err);                                                                                // 214
                                                                                                       // 215
    // get the parameters for this url from the handler's compiled path                                // 216
    // XXX removing for now                                                                            // 217
    //var params = handler.params(context.location.href);                                              // 218
    //context.request.params = defaultValue(context, 'params', {});                                    // 219
    //_.extend(context.params, params);                                                                // 220
                                                                                                       // 221
    // so we can call this.next()                                                                      // 222
    // XXX this breaks with things like request.body which require that the                            // 223
    // iterator be saved for the given function call.                                                  // 224
    context.next = next;                                                                               // 225
                                                                                                       // 226
    if (handler.mount) {                                                                               // 227
      var mountpath = Url.normalize(handler.compiledUrl.pathname);                                     // 228
      var newUrl = url.substr(mountpath.length, url.length);                                           // 229
      newUrl = Url.normalize(newUrl);                                                                  // 230
      context.url = context.request.url = newUrl;                                                      // 231
    }                                                                                                  // 232
                                                                                                       // 233
    try {                                                                                              // 234
      //                                                                                               // 235
      // The connect api says a handler signature (arity) can look like any of:                        // 236
      //                                                                                               // 237
      // 1) function (req, res, next)                                                                  // 238
      // 2) function (err, req, res, next)                                                             // 239
      // 3) function (err)                                                                             // 240
      var arity = handler.handle.length                                                                // 241
      var req = context.request;                                                                       // 242
      var res = context.response;                                                                      // 243
                                                                                                       // 244
      // function (err, req, res, next)                                                                // 245
      if (err && arity === 4)                                                                          // 246
        return handler.handle.call(context, err, req, res, next);                                      // 247
                                                                                                       // 248
      // function (req, res, next)                                                                     // 249
      if (!err && arity < 4)                                                                           // 250
        return handler.handle.call(context, req, res, next);                                           // 251
                                                                                                       // 252
      // default is function (err) so punt the error down the stack                                    // 253
      // until we either find a handler who likes to deal with errors or we call                       // 254
      // out                                                                                           // 255
      return next(err);                                                                                // 256
    } catch (err) {                                                                                    // 257
      if (err._punt)                                                                                   // 258
        // ignore this error and throw it down the stack                                               // 259
        throw err;                                                                                     // 260
      else                                                                                             // 261
        // see if the next handler wants to deal with the error                                        // 262
        next(err);                                                                                     // 263
    } finally {                                                                                        // 264
      // we'll put this at the end because some middleware                                             // 265
      // might want to decide what to do based on whether we've                                        // 266
      // been handled "yet". If we set this to true before the handler                                 // 267
      // is called, there's no way for the handler to say, if we haven't been                          // 268
      // handled yet go to the server, for example.                                                    // 269
      context._handled = true;                                                                         // 270
      context.next = null;                                                                             // 271
    }                                                                                                  // 272
  });                                                                                                  // 273
                                                                                                       // 274
  next();                                                                                              // 275
                                                                                                       // 276
  context.next = null;                                                                                 // 277
  return context;                                                                                      // 278
};                                                                                                     // 279
                                                                                                       // 280
Iron = Iron || {};                                                                                     // 281
Iron.MiddlewareStack = MiddlewareStack;                                                                // 282
                                                                                                       // 283
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:middleware-stack'] = {
  Handler: Handler
};

})();
