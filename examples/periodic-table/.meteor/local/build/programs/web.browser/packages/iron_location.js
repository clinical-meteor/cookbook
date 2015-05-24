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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var urlToHashStyle, urlFromHashStyle, fixHashPath, State, Location;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:location/lib/utils.js                                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var Url = Iron.Url;                                                                                         // 1
var HASH_PARAM_NAME='__hash__';                                                                             // 2
                                                                                                            // 3
/**                                                                                                         // 4
 * Given:                                                                                                   // 5
 *   http://host:port/some/pathname/?query=string#bar                                                       // 6
 *                                                                                                          // 7
 * Return:                                                                                                  // 8
 *   http://host:port#!some/pathname/?query=string&__hash__=bar                                             // 9
 */                                                                                                         // 10
urlToHashStyle = function (url) {                                                                           // 11
  var parts = Url.parse(url);                                                                               // 12
  var hash = parts.hash && parts.hash.replace('#', '');                                                     // 13
  var search = parts.search;                                                                                // 14
  var pathname = parts.pathname;                                                                            // 15
  var root = parts.rootUrl;                                                                                 // 16
                                                                                                            // 17
  // do we have another hash value that isn't a path?                                                       // 18
  if (hash && hash.charAt(0) !== '!') {                                                                     // 19
    var hashQueryString = HASH_PARAM_NAME + '=' + hash;                                                     // 20
    search = search ? (search + '&') : '?';                                                                 // 21
    search += hashQueryString;                                                                              // 22
    hash = '';                                                                                              // 23
  }                                                                                                         // 24
                                                                                                            // 25
  // if we don't already have a path on the hash create one                                                 // 26
  if (! hash && pathname) {                                                                                 // 27
    hash = '#!' + pathname.substring(1);                                                                    // 28
  } else if (hash) {                                                                                        // 29
    hash = '#' + hash;                                                                                      // 30
  }                                                                                                         // 31
                                                                                                            // 32
  return [                                                                                                  // 33
    root,                                                                                                   // 34
    hash,                                                                                                   // 35
    search                                                                                                  // 36
  ].join('');                                                                                               // 37
};                                                                                                          // 38
                                                                                                            // 39
/**                                                                                                         // 40
 * Given a url that uses the hash style (see above), return a new url that uses                             // 41
 * the hash path as a normal pathname.                                                                      // 42
 *                                                                                                          // 43
 * Given:                                                                                                   // 44
 *   http://host:port#!some/pathname/?query=string&__hash__=bar                                             // 45
 *                                                                                                          // 46
 * Return:                                                                                                  // 47
 *   http://host:port/some/pathname/?query=string#bar                                                       // 48
 */                                                                                                         // 49
urlFromHashStyle = function (url) {                                                                         // 50
  var parts = Url.parse(url);                                                                               // 51
  var pathname = parts.hash && parts.hash.replace('#!', '/');                                               // 52
  var search = parts.search;                                                                                // 53
  var root = parts.rootUrl;                                                                                 // 54
  var hash;                                                                                                 // 55
                                                                                                            // 56
  // see if there's a __hash__=value in the query string in which case put it                               // 57
  // back in the normal hash position and delete it from the search string.                                 // 58
  if (_.has(parts.queryObject, HASH_PARAM_NAME)) {                                                          // 59
    hash = '#' + parts.queryObject[HASH_PARAM_NAME];                                                        // 60
    delete parts.queryObject[HASH_PARAM_NAME];                                                              // 61
  } else {                                                                                                  // 62
    hash = '';                                                                                              // 63
  }                                                                                                         // 64
                                                                                                            // 65
  return [                                                                                                  // 66
    root,                                                                                                   // 67
    pathname,                                                                                               // 68
    Url.toQueryString(parts.queryObject),                                                                   // 69
    hash                                                                                                    // 70
  ].join('');                                                                                               // 71
};                                                                                                          // 72
                                                                                                            // 73
/**                                                                                                         // 74
 * Fix up a pathname intended for use with a hash path by moving any hash                                   // 75
 * fragments into the query string.                                                                         // 76
 */                                                                                                         // 77
fixHashPath = function (pathname) {                                                                         // 78
  var parts = Url.parse(pathname);                                                                          // 79
  var query = parts.queryObject;                                                                            // 80
                                                                                                            // 81
  // if there's a hash in the path move that to the query string                                            // 82
  if (parts.hash) {                                                                                         // 83
    query[HASH_PARAM_NAME] = parts.hash.replace('#', '')                                                    // 84
  }                                                                                                         // 85
                                                                                                            // 86
  return [                                                                                                  // 87
    '!',                                                                                                    // 88
    parts.pathname.substring(1),                                                                            // 89
    Url.toQueryString(query)                                                                                // 90
  ].join('');                                                                                               // 91
};                                                                                                          // 92
                                                                                                            // 93
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:location/lib/state.js                                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var Url = Iron.Url;                                                                                         // 1
                                                                                                            // 2
State = function (url, options) {                                                                           // 3
  _.extend(this, Url.parse(url), {options: options || {}});                                                 // 4
};                                                                                                          // 5
                                                                                                            // 6
// XXX: should this compare options (e.g. history.state?)                                                   // 7
State.prototype.equals = function (other) {                                                                 // 8
  if (!other)                                                                                               // 9
    return false;                                                                                           // 10
                                                                                                            // 11
  if (!(other instanceof State))                                                                            // 12
    return false;                                                                                           // 13
                                                                                                            // 14
  if (other.pathname == this.pathname &&                                                                    // 15
     other.search == this.search &&                                                                         // 16
     other.hash == this.hash &&                                                                             // 17
     other.options.historyState === this.options.historyState)                                              // 18
    return true;                                                                                            // 19
                                                                                                            // 20
  return false;                                                                                             // 21
};                                                                                                          // 22
                                                                                                            // 23
State.prototype.isCancelled = function () {                                                                 // 24
  return !!this._isCancelled;                                                                               // 25
};                                                                                                          // 26
                                                                                                            // 27
State.prototype.cancelUrlChange = function () {                                                             // 28
  this._isCancelled = true;                                                                                 // 29
};                                                                                                          // 30
                                                                                                            // 31
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:location/lib/location.js                                                                   //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*****************************************************************************/                             // 1
/* Imports */                                                                                               // 2
/*****************************************************************************/                             // 3
var Url = Iron.Url;                                                                                         // 4
                                                                                                            // 5
/*****************************************************************************/                             // 6
/* Private */                                                                                               // 7
/*****************************************************************************/                             // 8
var current = null;                                                                                         // 9
var dep = new Deps.Dependency;                                                                              // 10
var handlers = {go: [], popState: []};                                                                      // 11
                                                                                                            // 12
var isIE9 = function () {                                                                                   // 13
  return /MSIE 9/.test(navigator.appVersion);                                                               // 14
};                                                                                                          // 15
                                                                                                            // 16
var isIE8 = function () {                                                                                   // 17
  return /MSIE 8/.test(navigator.appVersion);                                                               // 18
};                                                                                                          // 19
                                                                                                            // 20
var usingAppcache = function() {                                                                            // 21
  return !! Package.appcache;                                                                               // 22
}                                                                                                           // 23
                                                                                                            // 24
var replaceStateUndefined = function() {                                                                    // 25
  return (typeof history === "undefined")  || (typeof history.pushState !== "function");                    // 26
}                                                                                                           // 27
                                                                                                            // 28
var shouldUseHashPaths = function () {                                                                      // 29
  return Location.options.useHashPaths || isIE8() || isIE9() || usingAppcache() || replaceStateUndefined(); // 30
};                                                                                                          // 31
                                                                                                            // 32
var isUsingHashPaths = function () {                                                                        // 33
  return !!Location.options.useHashPaths;                                                                   // 34
};                                                                                                          // 35
                                                                                                            // 36
var runHandlers = function(name, state) {                                                                   // 37
  _.each(handlers[name], function(cb) {                                                                     // 38
    cb.call(state);                                                                                         // 39
  });                                                                                                       // 40
}                                                                                                           // 41
                                                                                                            // 42
var set = function (state) {                                                                                // 43
  if (!(state instanceof State))                                                                            // 44
    throw new Error("Expected a State instance");                                                           // 45
                                                                                                            // 46
  if (!state.equals(current)) {                                                                             // 47
    current = state;                                                                                        // 48
    dep.changed();                                                                                          // 49
                                                                                                            // 50
    // return true to indicate state was set to a new value.                                                // 51
    return true;                                                                                            // 52
  }                                                                                                         // 53
                                                                                                            // 54
  // state not set                                                                                          // 55
  return false;                                                                                             // 56
};                                                                                                          // 57
                                                                                                            // 58
var setStateFromEventHandler = function () {                                                                // 59
  var href = location.href;                                                                                 // 60
  var state;                                                                                                // 61
                                                                                                            // 62
  if (isUsingHashPaths()) {                                                                                 // 63
    state = new State(urlFromHashStyle(href));                                                              // 64
  } else {                                                                                                  // 65
    state = new State(href, {historyState: history.state});                                                 // 66
  }                                                                                                         // 67
                                                                                                            // 68
  runHandlers('popState', state);                                                                           // 69
  set(state);                                                                                               // 70
};                                                                                                          // 71
                                                                                                            // 72
var fireOnClick = function (e) {                                                                            // 73
  var handler = onClickHandler;                                                                             // 74
  handler && handler(e);                                                                                    // 75
};                                                                                                          // 76
                                                                                                            // 77
/**                                                                                                         // 78
 * Go to a url.                                                                                             // 79
 */                                                                                                         // 80
var go = function (url, options) {                                                                          // 81
  options = options || {};                                                                                  // 82
                                                                                                            // 83
  var state = new State(url, options);                                                                      // 84
                                                                                                            // 85
  runHandlers('go', state);                                                                                 // 86
                                                                                                            // 87
  if (set(state)) {                                                                                         // 88
    Deps.afterFlush(function () {                                                                           // 89
      // if after we've flushed if nobody has cancelled the state then change                               // 90
      // the url.                                                                                           // 91
      if (!state.isCancelled()) {                                                                           // 92
        if (isUsingHashPaths()) {                                                                           // 93
          location.hash = fixHashPath(url);                                                                 // 94
        } else {                                                                                            // 95
          if (options.replaceState === true)                                                                // 96
            history.replaceState(options.historyState, null, url);                                          // 97
          else                                                                                              // 98
            history.pushState(options.historyState, null, url);                                             // 99
        }                                                                                                   // 100
      }                                                                                                     // 101
    });                                                                                                     // 102
  }                                                                                                         // 103
};                                                                                                          // 104
                                                                                                            // 105
var onClickHandler = function (e) {                                                                         // 106
  try {                                                                                                     // 107
    var el = e.currentTarget;                                                                               // 108
    var href = el.href;                                                                                     // 109
    var path = el.pathname + el.search + el.hash;                                                           // 110
                                                                                                            // 111
    // ie9 omits the leading slash in pathname - so patch up if it's missing                                // 112
    path = path.replace(/(^\/?)/,"/");                                                                      // 113
                                                                                                            // 114
    // haven't been cancelled already                                                                       // 115
    if (e.isDefaultPrevented()) {                                                                           // 116
      e.preventDefault();                                                                                   // 117
      return;                                                                                               // 118
    }                                                                                                       // 119
                                                                                                            // 120
    // with no meta key pressed                                                                             // 121
    if (e.metaKey || e.ctrlKey || e.shiftKey)                                                               // 122
      return;                                                                                               // 123
                                                                                                            // 124
    // aren't targeting a new window                                                                        // 125
    if (el.target)                                                                                          // 126
      return;                                                                                               // 127
                                                                                                            // 128
    // aren't external to the app                                                                           // 129
    if (!Url.isSameOrigin(href, location.href))                                                             // 130
      return;                                                                                               // 131
                                                                                                            // 132
    // note that we _do_ handle links which point to the current URL                                        // 133
    // and links which only change the hash.                                                                // 134
    e.preventDefault();                                                                                     // 135
                                                                                                            // 136
    // manage setting the new state and maybe pushing onto the pushState stack                              // 137
    go(path);                                                                                               // 138
  } catch (err) {                                                                                           // 139
    // make sure we can see any errors that are thrown before going to the                                  // 140
    // server.                                                                                              // 141
    e.preventDefault();                                                                                     // 142
    throw err;                                                                                              // 143
  }                                                                                                         // 144
};                                                                                                          // 145
                                                                                                            // 146
/*****************************************************************************/                             // 147
/* Location API */                                                                                          // 148
/*****************************************************************************/                             // 149
                                                                                                            // 150
/**                                                                                                         // 151
 * Main Location object. Reactively respond to url changes. Normalized urls                                 // 152
 * between hash style (ie8/9) and normal style using pushState.                                             // 153
 */                                                                                                         // 154
Location = {};                                                                                              // 155
                                                                                                            // 156
/**                                                                                                         // 157
 * Default options.                                                                                         // 158
 */                                                                                                         // 159
Location.options = {                                                                                        // 160
  linkSelector: 'a[href]',                                                                                  // 161
  useHashPaths: false                                                                                       // 162
};                                                                                                          // 163
                                                                                                            // 164
/**                                                                                                         // 165
 * Set options on the Location object.                                                                      // 166
 */                                                                                                         // 167
Location.configure = function (options) {                                                                   // 168
  _.extend(this.options, options || {});                                                                    // 169
};                                                                                                          // 170
                                                                                                            // 171
/**                                                                                                         // 172
 * Reactively get the current state.                                                                        // 173
 */                                                                                                         // 174
Location.get = function () {                                                                                // 175
  dep.depend();                                                                                             // 176
  return current;                                                                                           // 177
};                                                                                                          // 178
                                                                                                            // 179
/**                                                                                                         // 180
 * Set the initial state and start listening for url events.                                                // 181
 */                                                                                                         // 182
Location.start = function () {                                                                              // 183
  if (this._isStarted)                                                                                      // 184
    return;                                                                                                 // 185
                                                                                                            // 186
  var parts = Url.parse(location.href);                                                                     // 187
                                                                                                            // 188
  // if we're using the /#/items/5 style then start off at the root url but                                 // 189
  // store away the pathname, query and hash into the hash fragment so when the                             // 190
  // client gets the response we can render the correct page.                                               // 191
  if (shouldUseHashPaths()) {                                                                               // 192
    // if we have any pathname like /items/5 take a trip to the server to get us                            // 193
    // back a root url.                                                                                     // 194
    if (parts.pathname.length > 1) {                                                                        // 195
      var url = urlToHashStyle(location.href);                                                              // 196
      window.location = url;                                                                                // 197
    }                                                                                                       // 198
                                                                                                            // 199
    // ok good to go                                                                                        // 200
    this.configure({useHashPaths: true});                                                                   // 201
  }                                                                                                         // 202
  // set initial state                                                                                      // 203
  var href = location.href;                                                                                 // 204
                                                                                                            // 205
  if (isUsingHashPaths()) {                                                                                 // 206
    var state = new State(urlFromHashStyle(href));                                                          // 207
    set(state);                                                                                             // 208
  } else {                                                                                                  // 209
    // if we started at a URL in the /#!items/5 style then we have picked up a                              // 210
    // URL from an non-HTML5 user. Let's redirect to /items/5                                               // 211
    if (parts.hash.replace('#', '')[0] === '!') {                                                           // 212
      var href = urlFromHashStyle(href);                                                                    // 213
    }                                                                                                       // 214
                                                                                                            // 215
    // store the fact that this is the first route we hit.                                                  // 216
    // this serves two purposes                                                                             // 217
    //   1. We can tell when we've reached an unhandled route and need to show a                            // 218
    //      404 (rather than bailing out to let the server handle it)                                       // 219
    //   2. Users can look at the state to tell if the history.back() will stay                             // 220
    //      inside the app (this is important for mobile apps).                                             // 221
    var historyState = {initial: true}                                                                      // 222
    history.replaceState(historyState, null, href);                                                         // 223
    var state = new State(href, {historyState: historyState});                                              // 224
    set(state);                                                                                             // 225
  }                                                                                                         // 226
                                                                                                            // 227
  // bind the event handlers                                                                                // 228
  $(window).on('popstate.iron-location', setStateFromEventHandler);                                         // 229
  $(window).on('hashchange.iron-location', setStateFromEventHandler);                                       // 230
                                                                                                            // 231
  // make sure we have a document before binding the click handler                                          // 232
  Meteor.startup(function () {                                                                              // 233
    $(document).on('click.iron-location', Location.options.linkSelector, fireOnClick);                      // 234
  });                                                                                                       // 235
                                                                                                            // 236
  this._isStarted = true;                                                                                   // 237
};                                                                                                          // 238
                                                                                                            // 239
/**                                                                                                         // 240
 * Stop the Location from listening for url changes.                                                        // 241
 */                                                                                                         // 242
Location.stop = function () {                                                                               // 243
  if (!this._isStarted)                                                                                     // 244
    return;                                                                                                 // 245
                                                                                                            // 246
  $(window).on('popstate.iron-location');                                                                   // 247
  $(window).on('hashchange.iron-location');                                                                 // 248
  $(document).off('click.iron-location');                                                                   // 249
                                                                                                            // 250
  this._isStarted = false;                                                                                  // 251
};                                                                                                          // 252
                                                                                                            // 253
/**                                                                                                         // 254
 * Assign a different click handler.                                                                        // 255
 */                                                                                                         // 256
Location.onClick = function (fn) {                                                                          // 257
  onClickHandler = fn;                                                                                      // 258
};                                                                                                          // 259
                                                                                                            // 260
/**                                                                                                         // 261
 * Go to a new url.                                                                                         // 262
 */                                                                                                         // 263
Location.go = function (url, options) {                                                                     // 264
  return go(url, options);                                                                                  // 265
};                                                                                                          // 266
                                                                                                            // 267
/**                                                                                                         // 268
 * Run the supplied callback whenever we "go" to a new location.                                            // 269
 *                                                                                                          // 270
 * Argument: cb - function, called with no arguments,                                                       // 271
 * `this` is the state that's being set, _may_ be modified.                                                 // 272
 */                                                                                                         // 273
Location.onGo = function (cb) {                                                                             // 274
  handlers.go.push(cb);                                                                                     // 275
};                                                                                                          // 276
                                                                                                            // 277
/**                                                                                                         // 278
 * Run the supplied callback whenever we "popState" to an old location.                                     // 279
 *                                                                                                          // 280
 * Argument: cb - function, called with no arguments,                                                       // 281
 * `this` is the state that's being set, _may_ be modified.                                                 // 282
 */                                                                                                         // 283
Location.onPopState = function (cb) {                                                                       // 284
  handlers.popState.push(cb);                                                                               // 285
};                                                                                                          // 286
                                                                                                            // 287
/**                                                                                                         // 288
 * Automatically start Iron.Location                                                                        // 289
 */                                                                                                         // 290
Location.start();                                                                                           // 291
                                                                                                            // 292
/*****************************************************************************/                             // 293
/* Namespacing */                                                                                           // 294
/*****************************************************************************/                             // 295
Iron.Location = Location;                                                                                   // 296
                                                                                                            // 297
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:location'] = {
  urlToHashStyle: urlToHashStyle,
  urlFromHashStyle: urlFromHashStyle
};

})();
