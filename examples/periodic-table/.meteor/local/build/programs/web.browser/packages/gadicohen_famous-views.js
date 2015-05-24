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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Template = Package.templating.Template;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Pince = Package['jag:pince'].Pince;
var Logger = Package['jag:pince'].Logger;
var MicroEvent = Package['jag:pince'].MicroEvent;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var FView, log, postFirstAddQueue, Engine, Transform, initializeFamous, optionString, handleOptions, options, forEach, Deps, MeteorFamousView, throwError, sequencer, parentViewName, parentTemplateName, famousContextWrapper, templateSurface, div;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/famous-views.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Could use something from --settings too                                                                            // 1
var isDev = ("localhost" === window.location.hostname);                                                               // 2
                                                                                                                      // 3
log = new Logger('famous-views');                                                                                     // 4
Logger.setLevel('famous-views', isDev ? 'trace' : 'info');                                                            // 5
                                                                                                                      // 6
FView = {};                                                                                                           // 7
FView.log = log; // allow other fview-* packages to use this too                                                      // 8
                                                                                                                      // 9
var readyQueue = [];                                                                                                  // 10
var readyDep = new Tracker.Dependency();                                                                              // 11
FView.ready = function(func) {                                                                                        // 12
  if (func) {                                                                                                         // 13
    if (FView.isReady)                                                                                                // 14
      func();                                                                                                         // 15
    else                                                                                                              // 16
      readyQueue.push(func);                                                                                          // 17
  } else {                                                                                                            // 18
    readyDep.depend();                                                                                                // 19
    return FView.isReady;                                                                                             // 20
  }                                                                                                                   // 21
};                                                                                                                    // 22
FView.runReadies = function() {                                                                                       // 23
  FView.isReady = true;                                                                                               // 24
  readyDep.changed();                                                                                                 // 25
  while(readyQueue.length) {                                                                                          // 26
    (readyQueue.shift())();                                                                                           // 27
  }                                                                                                                   // 28
};                                                                                                                    // 29
                                                                                                                      // 30
postFirstAddQueue = [];                                                                                               // 31
FView.postFirstAdd = function(func) {                                                                                 // 32
  postFirstAddQueue.push(func);                                                                                       // 33
};                                                                                                                    // 34
                                                                                                                      // 35
// famous-views globals from Famous                                                                                   // 36
Engine = null;                                                                                                        // 37
Transform = null;                                                                                                     // 38
                                                                                                                      // 39
if (typeof(famous) === 'undefined' && typeof(define) !== 'undefined')                                                 // 40
define(function(require) {                                                                                            // 41
//  console.log(1);                                                                                                   // 42
});                                                                                                                   // 43
                                                                                                                      // 44
/*                                                                                                                    // 45
 * This must be an exact copy of the function from famous.core.Engine                                                 // 46
 * which is not public.  We only use it if famousContext is a direct                                                  // 47
 * child of the document body.  Current as of 0.3.1.                                                                  // 48
 */                                                                                                                   // 49
initializeFamous = function() {                                                                                       // 50
  // prevent scrolling via browser                                                                                    // 51
  window.addEventListener('touchmove', function(event) {                                                              // 52
      event.preventDefault();                                                                                         // 53
  }, true);                                                                                                           // 54
  document.body.classList.add('famous-root');                                                                         // 55
  document.documentElement.classList.add('famous-root');                                                              // 56
};                                                                                                                    // 57
                                                                                                                      // 58
FView.startup = function() {                                                                                          // 59
  log.debug('Current logging default is "debug" (for localhost).  ' +                                                 // 60
    'Change in your app with Logger.setLevel("famous-views", "info");');                                              // 61
  FView.startedUp = true;                                                                                             // 62
                                                                                                                      // 63
  // Globals for inside all of famous-views                                                                           // 64
  Engine = famous.core.Engine;                                                                                        // 65
  Engine.setOptions({appMode: false});                                                                                // 66
  Transform = famous.core.Transform;                                                                                  // 67
                                                                                                                      // 68
                                                                                                                      // 69
  // Required document.body                                                                                           // 70
  Meteor.startup(function() {                                                                                         // 71
                                                                                                                      // 72
    // Sanity check, disallow templates with same name as a View                                                      // 73
    var names = [];                                                                                                   // 74
    for (var name in FView.views)                                                                                     // 75
      if (Template[name])                                                                                             // 76
        names.push(name);                                                                                             // 77
    if (names.length)                                                                                                 // 78
      throw new Error("You have created Template(s) with the same name " +                                            // 79
        "as these famous-views: " + names.join(', ') +                                                                // 80
        '.  Nothing will work until you rename them.');                                                               // 81
                                                                                                                      // 82
    /*                                                                                                                // 83
    THIS WAS MOVED TO meteorFamousView.js AND IS ONLY CALLED IF A                                                     // 84
    VIEW IS CREATED IN LIMBO AND FVIEW.MAINCTX IS UNSET                                                               // 85
    if (!FView.mainCtx) {                                                                                             // 86
      if (typeof FView.mainCtx === 'undefined')                                                                       // 87
        log.debug('Creating a new main context.  If you already have '                                                // 88
          + 'your own, set FView.mainCtx = yourMainContext (or to false to get '                                      // 89
          + 'rid of this warning, or null to not set a mainContext)');                                                // 90
      if (FView.mainCtx !== null) {                                                                                   // 91
        var view = FView.famousContext.constructView();                                                               // 92
        var wrapped = Blaze.With({ id:"mainCtx", style:"" },                                                          // 93
          function() { return view });                                                                                // 94
        wrapped.__isTemplateWith = true;                                                                              // 95
        Blaze.render(wrapped, document.body);                                                                         // 96
                                                                                                                      // 97
        /*                                                                                                            // 98
         * Mostly for old way of using iron-router (pre #famousContext)                                               // 99
         * In future, we could return after Blaze.render                                                              // 100
         * and move stuff below to inside arendered callback */                                                       // 101
         /*                                                                                                           // 102
        Tracker.flush();                                                                                              // 103
                                                                                                                      // 104
        FView.mainCtx = FView.byId("mainCtx").context;                                                                // 105
      }                                                                                                               // 106
    }                                                                                                                 // 107
    */                                                                                                                // 108
                                                                                                                      // 109
    // Note, various views are registered here                                                                        // 110
    FView.runReadies();                                                                                               // 111
                                                                                                                      // 112
    if (Template.famousInit)                                                                                          // 113
      Blaze.render(Template.famousInit, document.body);                                                               // 114
  });                                                                                                                 // 115
};                                                                                                                    // 116
                                                                                                                      // 117
FView.isReady = false;                                                                                                // 118
                                                                                                                      // 119
// Imports from weak deps                                                                                             // 120
/*                                                                                                                    // 121
if (Package['mjnetworks:famous'])                                                                                     // 122
  // @famono ignore                                                                                                   // 123
  famous = Package['mjnetworks:famous'].famous;                                                                       // 124
else if (Package['mjnetworks:mj-famous'])                                                                             // 125
  // @famono ignore                                                                                                   // 126
  famous = Package['mjnetworks:mj-famous'].famous;                                                                    // 127
*/                                                                                                                    // 128
                                                                                                                      // 129
// Load as ealry as possible, and keep trying                                                                         // 130
if (typeof(famous) !== 'undefined') {                                                                                 // 131
  log.debug("Starting up.  famous global found while loading package, great!");                                       // 132
  FView.startup();                                                                                                    // 133
}                                                                                                                     // 134
else                                                                                                                  // 135
  Meteor.startup(function() {                                                                                         // 136
    if (typeof(famous) !== 'undefined') {                                                                             // 137
      log.debug("Starting up.  famous global found during Meteor.startup()");                                         // 138
      FView.startup();                                                                                                // 139
    } else {                                                                                                          // 140
      log.debug("No famous global available in Meteor.startup().  Call FView.startup() when appropriate.");           // 141
    }                                                                                                                 // 142
  });                                                                                                                 // 143
                                                                                                                      // 144
var optionEval = function(string, key) {                                                                              // 145
  if (FView.attrEvalAllowedKeys && (FView.attrEvalAllowedKeys == '*' ||                                               // 146
      FView.attrEvalAllowedKeys.indexOf(key) > -1)) {                                                                 // 147
    /* jshint ignore:start */                                                                                         // 148
    // Obviously this is "safe" since it's been whitelisted by app author                                             // 149
    return eval(string.substr(5));  // strip "eval:"                                                                  // 150
    /* jshint ignore:end */                                                                                           // 151
  } else {                                                                                                            // 152
    throw new Error("[famous-views] Blocked " + key + '="' + string + '".  ' +                                        // 153
      'Set FView.attrEvalAllowedKeys = "*" or FView.attrEvalAllowedKeys = ["' +                                       // 154
      key + '"] and make sure you understand the security implications. ' +                                           // 155
      'Particularly, make sure none of your helper functions return a string ' +                                      // 156
      'that can be influenced by client-side input');                                                                 // 157
    }                                                                                                                 // 158
};                                                                                                                    // 159
                                                                                                                      // 160
var optionBlaze = function(string, key, blazeView) {                                                                  // 161
  // temporary, for options that get called (wrongly!) from init as well                                              // 162
  // or maybe that is the right place and render is the wrong place :)                                                // 163
  if (!blazeView)                                                                                                     // 164
    return '__FVIEW::SKIP__';                                                                                         // 165
                                                                                                                      // 166
  var args = string.substr(2, string.length-4).split(" ");                                                            // 167
  var view = blazeView, value;                                                                                        // 168
  while (view.name.substr(0,9) !== 'Template.')                                                                       // 169
    view = view.parentView;                                                                                           // 170
  value = view.lookup(args.splice(0,1)[0]);                                                                           // 171
                                                                                                                      // 172
  // Scalar value from data context                                                                                   // 173
  if (typeof value !== 'function')                                                                                    // 174
    return value;                                                                                                     // 175
                                                                                                                      // 176
  // Reactive value from helper                                                                                       // 177
  Engine.defer(function() {                                                                                           // 178
    blazeView.autorun(function() {                                                                                    // 179
      var run = value.apply(null, args);                                                                              // 180
      blazeView.fview._view.attrUpdate.call(blazeView.fview, key, run);                                               // 181
    });                                                                                                               // 182
  });                                                                                                                 // 183
                                                                                                                      // 184
  return '__FVIEW::SKIP__';                                                                                           // 185
};                                                                                                                    // 186
                                                                                                                      // 187
optionString = function(string, key, blazeView) {                                                                     // 188
  // special handling based on special key names                                                                      // 189
  if (key === 'direction' &&                                                                                          // 190
      typeof famous.utilities.Utility.Direction[string] !== 'undefined')                                              // 191
    return famous.utilities.Utility.Direction[string];                                                                // 192
  if (key === 'id')                                                                                                   // 193
    return string;                                                                                                    // 194
                                                                                                                      // 195
  // general string handling                                                                                          // 196
  if (string.substr(0,5) == 'eval:')                                                                                  // 197
    return optionEval(string, key);                                                                                   // 198
  if (string == 'undefined')                                                                                          // 199
    return undefined;                                                                                                 // 200
  if (string == 'true')                                                                                               // 201
    return true;                                                                                                      // 202
  if (string == 'false')                                                                                              // 203
    return false;                                                                                                     // 204
  if (string === null)                                                                                                // 205
    return null;                                                                                                      // 206
                                                                                                                      // 207
  if (string.substr(0,2) === '{{')                                                                                    // 208
    return optionBlaze(string, key, blazeView);                                                                       // 209
                                                                                                                      // 210
  if (string[0] == '[' || string[0] == '{') {                                                                         // 211
                                                                                                                      // 212
    var obj;                                                                                                          // 213
    string = string.replace(/\bauto\b/g, '"auto"');                                                                   // 214
    string = string.replace(/undefined/g, '"__undefined__"');                                                         // 215
    // JSON can't parse values like ".5" so convert them to "0.5"                                                     // 216
    string = string.replace(/([\[\{,]+)(\W*)(\.[0-9])/g, '$1$20$3');                                                  // 217
                                                                                                                      // 218
    try {                                                                                                             // 219
      obj = JSON.parse(string);                                                                                       // 220
    }                                                                                                                 // 221
    catch (err) {                                                                                                     // 222
      log.error("Couldn't parse JSON, skipping: " + string);                                                          // 223
      log.error(err);                                                                                                 // 224
      return undefined;                                                                                               // 225
    }                                                                                                                 // 226
                                                                                                                      // 227
    if (key == 'size') {                                                                                              // 228
      _.each(obj, function(size, i) {                                                                                 // 229
        if (size == 'auto') {                                                                                         // 230
          log.debug("auto is deprecated, use true");                                                                  // 231
          obj[i] = 'true';                                                                                            // 232
        }                                                                                                             // 233
      });                                                                                                             // 234
    }                                                                                                                 // 235
                                                                                                                      // 236
    // re-use of "key" variable from function args that's not needed anymore                                          // 237
    for (key in obj)                                                                                                  // 238
      if (obj[key] === '__undefined__')                                                                               // 239
        obj[key] = undefined;                                                                                         // 240
    return obj;                                                                                                       // 241
                                                                                                                      // 242
  } else if (/^[-+]?(?:(?:\d*[.])?\d+|Infinity)$/.test(string)) {                                                     // 243
                                                                                                                      // 244
    return parseFloat(string);                                                                                        // 245
                                                                                                                      // 246
  } else {                                                                                                            // 247
                                                                                                                      // 248
    return string;                                                                                                    // 249
  }                                                                                                                   // 250
                                                                                                                      // 251
  /*                                                                                                                  // 252
  if (string == 'undefined')                                                                                          // 253
    return undefined;                                                                                                 // 254
  if (string == 'true')                                                                                               // 255
    return true;                                                                                                      // 256
  if (string == 'false')                                                                                              // 257
    return false;                                                                                                     // 258
  if (string.substr(0,1) == '[') {                                                                                    // 259
    var out = [];                                                                                                     // 260
    string = string.substr(1, string.length-2).split(',');                                                            // 261
    for (var i=0; i < string.length; i++)                                                                             // 262
      out.push(optionString(string[i].trim()));                                                                       // 263
    return out;                                                                                                       // 264
  }                                                                                                                   // 265
  if (string.match(/^[0-9\.]+$/))                                                                                     // 266
    return parseFloat(string);                                                                                        // 267
  */                                                                                                                  // 268
};                                                                                                                    // 269
                                                                                                                      // 270
handleOptions = function(data) {                                                                                      // 271
  options = {};                                                                                                       // 272
  for (var key in data) {                                                                                             // 273
    var value = data[key];                                                                                            // 274
    if (_.isString(value))                                                                                            // 275
      options[key] = optionString(value, key);                                                                        // 276
    else                                                                                                              // 277
      options[key] = value;                                                                                           // 278
  }                                                                                                                   // 279
  return options;                                                                                                     // 280
};                                                                                                                    // 281
                                                                                                                      // 282
FView.transitions = {};                                                                                               // 283
FView.registerTransition = function (name, transition) {                                                              // 284
  check(name, String);                                                                                                // 285
  check(transition, Function);                                                                                        // 286
                                                                                                                      // 287
  FView.transitions[name] = transition;                                                                               // 288
};                                                                                                                    // 289
                                                                                                                      // 290
/* --- totally not done --- */                                                                                        // 291
                                                                                                                      // 292
FView.showTreeGet = function(renderNode) {                                                                            // 293
  var obj = renderNode._node._child._object;                                                                          // 294
    if (obj.node)                                                                                                     // 295
      obj.node = this.showTreeGet(obj.node);                                                                          // 296
  return obj;                                                                                                         // 297
};                                                                                                                    // 298
FView.showTreeChildren = function(renderNode) {                                                                       // 299
  var out = {}, i=0;                                                                                                  // 300
  if (renderNode._node)                                                                                               // 301
    out['child'+(i++)] = this.showTreeGet(renderNode);                                                                // 302
  return out;                                                                                                         // 303
};                                                                                                                    // 304
FView.showTree = function() {                                                                                         // 305
  console.log(this.showTreeChildren(mainCtx));                                                                        // 306
};                                                                                                                    // 307
                                                                                                                      // 308
/* --- */                                                                                                             // 309
                                                                                                                      // 310
/*                                                                                                                    // 311
 * _.each is super slow.  This does everything I need.                                                                // 312
 * http://jsperf.com/jquery-each-vs-underscore-each-vs-for-loops                                                      // 313
 */                                                                                                                   // 314
forEach = function(a, c, clone) {                                                                                     // 315
  "use asm";                                                                                                          // 316
  var l = a.length|0;                                                                                                 // 317
  if (clone)                                                                                                          // 318
    a = a.slice(0);                                                                                                   // 319
  while (l-- !== 0)                                                                                                   // 320
    c(a[l], l);                                                                                                       // 321
}                                                                                                                     // 322
                                                                                                                      // 323
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/tracker.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
 * Modify Tracker to make sure auto flushing doesn't block famo.us frames                                             // 2
 */                                                                                                                   // 3
                                                                                                                      // 4
// Based on https://github.com/meteor/meteor/91ce1561c3e94c35685e09b439f02125312bec8e/packages/tracker/tracker.js     // 5
// commit 91ce156, released AFTER tracker 1.0.7 and AFTER Meteor v1.1.0.2, 2015-Apr-06                                // 6
                                                                                                                      // 7
// https://github.com/Famous/famous/blob/729b9754abfa6f2e465c2c5291086eb7c35bc7b6/src/core/Engine.js                  // 8
// commit 729b9754ab. first released in famo.us v0.3.2                                                                // 9
// var MAX_DEFER_FRAME_TIME = 10;                                                                                     // 10
                                                                                                                      // 11
/*                                                                                                                    // 12
 * First we need to replace all methods with the original code, to gain access                                        // 13
 * to (replace) private variables.  Later in FView.Ready() we'll replace the                                          // 14
 * actual function (at the end of this file).  Before then, only change is to                                         // 15
 * comment out "Tracker = {}" to avoid changing exports.                                                              // 16
 */                                                                                                                   // 17
                                                                                                                      // 18
/////////////////////////////////////////////////////                                                                 // 19
// Package docs at http://docs.meteor.com/#tracker //                                                                 // 20
/////////////////////////////////////////////////////                                                                 // 21
                                                                                                                      // 22
/**                                                                                                                   // 23
 * @namespace Tracker                                                                                                 // 24
 * @summary The namespace for Tracker-related methods.                                                                // 25
 */                                                                                                                   // 26
//Tracker = {};                                                                                                       // 27
                                                                                                                      // 28
// http://docs.meteor.com/#tracker_active                                                                             // 29
                                                                                                                      // 30
/**                                                                                                                   // 31
 * @summary True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.
 * @locus Client                                                                                                      // 33
 * @type {Boolean}                                                                                                    // 34
 */                                                                                                                   // 35
Tracker.active = false;                                                                                               // 36
                                                                                                                      // 37
// http://docs.meteor.com/#tracker_currentcomputation                                                                 // 38
                                                                                                                      // 39
/**                                                                                                                   // 40
 * @summary The current computation, or `null` if there isn't one.  The current computation is the [`Tracker.Computation`](#tracker_computation) object created by the innermost active call to `Tracker.autorun`, and it's the computation that gains dependencies when reactive data sources are accessed.
 * @locus Client                                                                                                      // 42
 * @type {Tracker.Computation}                                                                                        // 43
 */                                                                                                                   // 44
Tracker.currentComputation = null;                                                                                    // 45
                                                                                                                      // 46
// References to all computations created within the Tracker by id.                                                   // 47
// Keeping these references on an underscore property gives more control to                                           // 48
// tooling and packages extending Tracker without increasing the API surface.                                         // 49
// These can used to monkey-patch computations, their functions, use                                                  // 50
// computation ids for tracking, etc.                                                                                 // 51
Tracker._computations = {};                                                                                           // 52
                                                                                                                      // 53
var setCurrentComputation = function (c) {                                                                            // 54
  Tracker.currentComputation = c;                                                                                     // 55
  Tracker.active = !! c;                                                                                              // 56
};                                                                                                                    // 57
                                                                                                                      // 58
var _debugFunc = function () {                                                                                        // 59
  // We want this code to work without Meteor, and also without                                                       // 60
  // "console" (which is technically non-standard and may be missing                                                  // 61
  // on some browser we come across, like it was on IE 7).                                                            // 62
  //                                                                                                                  // 63
  // Lazy evaluation because `Meteor` does not exist right away.(??)                                                  // 64
  return (typeof Meteor !== "undefined" ? Meteor._debug :                                                             // 65
          ((typeof console !== "undefined") && console.error ?                                                        // 66
           function () { console.error.apply(console, arguments); } :                                                 // 67
           function () {}));                                                                                          // 68
};                                                                                                                    // 69
                                                                                                                      // 70
var _maybeSupressMoreLogs = function (messagesLength) {                                                               // 71
  // Sometimes when running tests, we intentionally supress logs on expected                                          // 72
  // printed errors. Since the current implementation of _throwOrLog can log                                          // 73
  // multiple separate log messages, supress all of them if at least one supress                                      // 74
  // is expected as we still want them to count as one.                                                               // 75
  if (typeof Meteor !== "undefined") {                                                                                // 76
    // fviews, optional for old meteor releases                                                                       // 77
    if (Meteor._supressed_log_expected && Meteor._supressed_log_expected()) {                                         // 78
      Meteor._suppress_log(messagesLength - 1);                                                                       // 79
    }                                                                                                                 // 80
  }                                                                                                                   // 81
};                                                                                                                    // 82
                                                                                                                      // 83
var _throwOrLog = function (from, e) {                                                                                // 84
  if (throwFirstError) {                                                                                              // 85
    throw e;                                                                                                          // 86
  } else {                                                                                                            // 87
    var printArgs = ["Exception from Tracker " + from + " function:"];                                                // 88
    if (e.stack && e.message && e.name) {                                                                             // 89
      var idx = e.stack.indexOf(e.message);                                                                           // 90
      if (idx < 0 || idx > e.name.length + 2) { // check for "Error: "                                                // 91
        // message is not part of the stack                                                                           // 92
        var message = e.name + ": " + e.message;                                                                      // 93
        printArgs.push(message);                                                                                      // 94
      }                                                                                                               // 95
    }                                                                                                                 // 96
    printArgs.push(e.stack);                                                                                          // 97
    _maybeSupressMoreLogs(printArgs.length);                                                                          // 98
                                                                                                                      // 99
    for (var i = 0; i < printArgs.length; i++) {                                                                      // 100
      _debugFunc()(printArgs[i]);                                                                                     // 101
    }                                                                                                                 // 102
  }                                                                                                                   // 103
};                                                                                                                    // 104
                                                                                                                      // 105
// Takes a function `f`, and wraps it in a `Meteor._noYieldsAllowed`                                                  // 106
// block if we are running on the server. On the client, returns the                                                  // 107
// original function (since `Meteor._noYieldsAllowed` is a                                                            // 108
// no-op). This has the benefit of not adding an unnecessary stack                                                    // 109
// frame on the client.                                                                                               // 110
var withNoYieldsAllowed = function (f) {                                                                              // 111
  if ((typeof Meteor === 'undefined') || Meteor.isClient) {                                                           // 112
    return f;                                                                                                         // 113
  } else {                                                                                                            // 114
    return function () {                                                                                              // 115
      var args = arguments;                                                                                           // 116
      Meteor._noYieldsAllowed(function () {                                                                           // 117
        f.apply(null, args);                                                                                          // 118
      });                                                                                                             // 119
    };                                                                                                                // 120
  }                                                                                                                   // 121
};                                                                                                                    // 122
                                                                                                                      // 123
var nextId = 1;                                                                                                       // 124
// computations whose callbacks we should call at flush time                                                          // 125
var pendingComputations = [];                                                                                         // 126
// `true` if a Tracker.flush is scheduled, or if we are in Tracker.flush now                                          // 127
var willFlush = false;                                                                                                // 128
// `true` if we are in Tracker.flush now                                                                              // 129
var inFlush = false;                                                                                                  // 130
// `true` if we are computing a computation now, either first time                                                    // 131
// or recompute.  This matches Tracker.active unless we are inside                                                    // 132
// Tracker.nonreactive, which nullfies currentComputation even though                                                 // 133
// an enclosing computation may still be running.                                                                     // 134
var inCompute = false;                                                                                                // 135
// `true` if the `_throwFirstError` option was passed in to the call                                                  // 136
// to Tracker.flush that we are in. When set, throw rather than log the                                               // 137
// first error encountered while flushing. Before throwing the error,                                                 // 138
// finish flushing (from a finally block), logging any subsequent                                                     // 139
// errors.                                                                                                            // 140
var throwFirstError = false;                                                                                          // 141
                                                                                                                      // 142
var afterFlushCallbacks = [];                                                                                         // 143
                                                                                                                      // 144
var requireFlush = function () {                                                                                      // 145
  if (! willFlush) {                                                                                                  // 146
    // We want this code to work without Meteor, see debugFunc above                                                  // 147
    if (typeof Meteor !== "undefined")                                                                                // 148
      Meteor._setImmediate(Tracker._runFlush);                                                                        // 149
    else                                                                                                              // 150
      setTimeout(Tracker._runFlush, 0);                                                                               // 151
    willFlush = true;                                                                                                 // 152
  }                                                                                                                   // 153
};                                                                                                                    // 154
                                                                                                                      // 155
// Tracker.Computation constructor is visible but private                                                             // 156
// (throws an error if you try to call it)                                                                            // 157
var constructingComputation = false;                                                                                  // 158
                                                                                                                      // 159
//                                                                                                                    // 160
// http://docs.meteor.com/#tracker_computation                                                                        // 161
                                                                                                                      // 162
/**                                                                                                                   // 163
 * @summary A Computation object represents code that is repeatedly rerun                                             // 164
 * in response to                                                                                                     // 165
 * reactive data changes. Computations don't have return values; they just                                            // 166
 * perform actions, such as rerendering a template on the screen. Computations                                        // 167
 * are created using Tracker.autorun. Use stop to prevent further rerunning of a                                      // 168
 * computation.                                                                                                       // 169
 * @instancename computation                                                                                          // 170
 */                                                                                                                   // 171
Tracker.Computation = function (f, parent, onError) {                                                                 // 172
  if (! constructingComputation)                                                                                      // 173
    throw new Error(                                                                                                  // 174
      "Tracker.Computation constructor is private; use Tracker.autorun");                                             // 175
  constructingComputation = false;                                                                                    // 176
                                                                                                                      // 177
  var self = this;                                                                                                    // 178
                                                                                                                      // 179
  // http://docs.meteor.com/#computation_stopped                                                                      // 180
                                                                                                                      // 181
  /**                                                                                                                 // 182
   * @summary True if this computation has been stopped.                                                              // 183
   * @locus Client                                                                                                    // 184
   * @memberOf Tracker.Computation                                                                                    // 185
   * @instance                                                                                                        // 186
   * @name  stopped                                                                                                   // 187
   */                                                                                                                 // 188
  self.stopped = false;                                                                                               // 189
                                                                                                                      // 190
  // http://docs.meteor.com/#computation_invalidated                                                                  // 191
                                                                                                                      // 192
  /**                                                                                                                 // 193
   * @summary True if this computation has been invalidated (and not yet rerun), or if it has been stopped.           // 194
   * @locus Client                                                                                                    // 195
   * @memberOf Tracker.Computation                                                                                    // 196
   * @instance                                                                                                        // 197
   * @name  invalidated                                                                                               // 198
   * @type {Boolean}                                                                                                  // 199
   */                                                                                                                 // 200
  self.invalidated = false;                                                                                           // 201
                                                                                                                      // 202
  // http://docs.meteor.com/#computation_firstrun                                                                     // 203
                                                                                                                      // 204
  /**                                                                                                                 // 205
   * @summary True during the initial run of the computation at the time `Tracker.autorun` is called, and false on subsequent reruns and at other times.
   * @locus Client                                                                                                    // 207
   * @memberOf Tracker.Computation                                                                                    // 208
   * @instance                                                                                                        // 209
   * @name  firstRun                                                                                                  // 210
   * @type {Boolean}                                                                                                  // 211
   */                                                                                                                 // 212
  self.firstRun = true;                                                                                               // 213
                                                                                                                      // 214
  self._id = nextId++;                                                                                                // 215
  self._onInvalidateCallbacks = [];                                                                                   // 216
  self._onStopCallbacks = [];                                                                                         // 217
  // the plan is at some point to use the parent relation                                                             // 218
  // to constrain the order that computations are processed                                                           // 219
  self._parent = parent;                                                                                              // 220
  self._func = f;                                                                                                     // 221
  self._onError = onError;                                                                                            // 222
  self._recomputing = false;                                                                                          // 223
                                                                                                                      // 224
  // Register the computation within the global Tracker.                                                              // 225
  Tracker._computations[self._id] = self;                                                                             // 226
                                                                                                                      // 227
  var errored = true;                                                                                                 // 228
  try {                                                                                                               // 229
    self._compute();                                                                                                  // 230
    errored = false;                                                                                                  // 231
  } finally {                                                                                                         // 232
    self.firstRun = false;                                                                                            // 233
    if (errored)                                                                                                      // 234
      self.stop();                                                                                                    // 235
  }                                                                                                                   // 236
};                                                                                                                    // 237
                                                                                                                      // 238
// http://docs.meteor.com/#computation_oninvalidate                                                                   // 239
                                                                                                                      // 240
/**                                                                                                                   // 241
 * @summary Registers `callback` to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated.  The callback is run exactly once and not upon future invalidations unless `onInvalidate` is called again after the computation becomes valid again.
 * @locus Client                                                                                                      // 243
 * @param {Function} callback Function to be called on invalidation. Receives one argument, the computation that was invalidated.
 */                                                                                                                   // 245
Tracker.Computation.prototype.onInvalidate = function (f) {                                                           // 246
  var self = this;                                                                                                    // 247
                                                                                                                      // 248
  if (typeof f !== 'function')                                                                                        // 249
    throw new Error("onInvalidate requires a function");                                                              // 250
                                                                                                                      // 251
  if (self.invalidated) {                                                                                             // 252
    Tracker.nonreactive(function () {                                                                                 // 253
      withNoYieldsAllowed(f)(self);                                                                                   // 254
    });                                                                                                               // 255
  } else {                                                                                                            // 256
    self._onInvalidateCallbacks.push(f);                                                                              // 257
  }                                                                                                                   // 258
};                                                                                                                    // 259
                                                                                                                      // 260
/**                                                                                                                   // 261
 * @summary Registers `callback` to run when this computation is stopped, or runs it immediately if the computation is already stopped.  The callback is run after any `onInvalidate` callbacks.
 * @locus Client                                                                                                      // 263
 * @param {Function} callback Function to be called on stop. Receives one argument, the computation that was stopped. // 264
 */                                                                                                                   // 265
Tracker.Computation.prototype.onStop = function (f) {                                                                 // 266
  var self = this;                                                                                                    // 267
                                                                                                                      // 268
  if (typeof f !== 'function')                                                                                        // 269
    throw new Error("onStop requires a function");                                                                    // 270
                                                                                                                      // 271
  if (self.stopped) {                                                                                                 // 272
    Tracker.nonreactive(function () {                                                                                 // 273
      withNoYieldsAllowed(f)(self);                                                                                   // 274
    });                                                                                                               // 275
  } else {                                                                                                            // 276
    self._onStopCallbacks.push(f);                                                                                    // 277
  }                                                                                                                   // 278
};                                                                                                                    // 279
                                                                                                                      // 280
// http://docs.meteor.com/#computation_invalidate                                                                     // 281
                                                                                                                      // 282
/**                                                                                                                   // 283
 * @summary Invalidates this computation so that it will be rerun.                                                    // 284
 * @locus Client                                                                                                      // 285
 */                                                                                                                   // 286
Tracker.Computation.prototype.invalidate = function () {                                                              // 287
  var self = this;                                                                                                    // 288
  if (! self.invalidated) {                                                                                           // 289
    // if we're currently in _recompute(), don't enqueue                                                              // 290
    // ourselves, since we'll rerun immediately anyway.                                                               // 291
    if (! self._recomputing && ! self.stopped) {                                                                      // 292
      requireFlush();                                                                                                 // 293
      pendingComputations.push(this);                                                                                 // 294
    }                                                                                                                 // 295
                                                                                                                      // 296
    self.invalidated = true;                                                                                          // 297
                                                                                                                      // 298
    // callbacks can't add callbacks, because                                                                         // 299
    // self.invalidated === true.                                                                                     // 300
    for(var i = 0, f; f = self._onInvalidateCallbacks[i]; i++) {                                                      // 301
      Tracker.nonreactive(function () {                                                                               // 302
        withNoYieldsAllowed(f)(self);                                                                                 // 303
      });                                                                                                             // 304
    }                                                                                                                 // 305
    self._onInvalidateCallbacks = [];                                                                                 // 306
  }                                                                                                                   // 307
};                                                                                                                    // 308
                                                                                                                      // 309
// http://docs.meteor.com/#computation_stop                                                                           // 310
                                                                                                                      // 311
/**                                                                                                                   // 312
 * @summary Prevents this computation from rerunning.                                                                 // 313
 * @locus Client                                                                                                      // 314
 */                                                                                                                   // 315
Tracker.Computation.prototype.stop = function () {                                                                    // 316
  var self = this;                                                                                                    // 317
                                                                                                                      // 318
  if (! self.stopped) {                                                                                               // 319
    self.stopped = true;                                                                                              // 320
    self.invalidate();                                                                                                // 321
    // Unregister from global Tracker.                                                                                // 322
    delete Tracker._computations[self._id];                                                                           // 323
    for(var i = 0, f; f = self._onStopCallbacks[i]; i++) {                                                            // 324
      Tracker.nonreactive(function () {                                                                               // 325
        withNoYieldsAllowed(f)(self);                                                                                 // 326
      });                                                                                                             // 327
    }                                                                                                                 // 328
    self._onStopCallbacks = [];                                                                                       // 329
  }                                                                                                                   // 330
};                                                                                                                    // 331
                                                                                                                      // 332
Tracker.Computation.prototype._compute = function () {                                                                // 333
  var self = this;                                                                                                    // 334
  self.invalidated = false;                                                                                           // 335
                                                                                                                      // 336
  var previous = Tracker.currentComputation;                                                                          // 337
  setCurrentComputation(self);                                                                                        // 338
  var previousInCompute = inCompute;                                                                                  // 339
  inCompute = true;                                                                                                   // 340
  try {                                                                                                               // 341
    withNoYieldsAllowed(self._func)(self);                                                                            // 342
  } finally {                                                                                                         // 343
    setCurrentComputation(previous);                                                                                  // 344
    inCompute = previousInCompute;                                                                                    // 345
  }                                                                                                                   // 346
};                                                                                                                    // 347
                                                                                                                      // 348
Tracker.Computation.prototype._needsRecompute = function () {                                                         // 349
  var self = this;                                                                                                    // 350
  return self.invalidated && ! self.stopped;                                                                          // 351
};                                                                                                                    // 352
                                                                                                                      // 353
Tracker.Computation.prototype._recompute = function () {                                                              // 354
  var self = this;                                                                                                    // 355
                                                                                                                      // 356
  self._recomputing = true;                                                                                           // 357
  try {                                                                                                               // 358
    if (self._needsRecompute()) {                                                                                     // 359
      try {                                                                                                           // 360
        self._compute();                                                                                              // 361
      } catch (e) {                                                                                                   // 362
        if (self._onError) {                                                                                          // 363
          self._onError(e);                                                                                           // 364
        } else {                                                                                                      // 365
          _throwOrLog("recompute", e);                                                                                // 366
        }                                                                                                             // 367
      }                                                                                                               // 368
    }                                                                                                                 // 369
  } finally {                                                                                                         // 370
    self._recomputing = false;                                                                                        // 371
  }                                                                                                                   // 372
};                                                                                                                    // 373
                                                                                                                      // 374
//                                                                                                                    // 375
// http://docs.meteor.com/#tracker_dependency                                                                         // 376
                                                                                                                      // 377
/**                                                                                                                   // 378
 * @summary A Dependency represents an atomic unit of reactive data that a                                            // 379
 * computation might depend on. Reactive data sources such as Session or                                              // 380
 * Minimongo internally create different Dependency objects for different                                             // 381
 * pieces of data, each of which may be depended on by multiple computations.                                         // 382
 * When the data changes, the computations are invalidated.                                                           // 383
 * @class                                                                                                             // 384
 * @instanceName dependency                                                                                           // 385
 */                                                                                                                   // 386
Tracker.Dependency = function () {                                                                                    // 387
  this._dependentsById = {};                                                                                          // 388
};                                                                                                                    // 389
                                                                                                                      // 390
// http://docs.meteor.com/#dependency_depend                                                                          // 391
//                                                                                                                    // 392
// Adds `computation` to this set if it is not already                                                                // 393
// present.  Returns true if `computation` is a new member of the set.                                                // 394
// If no argument, defaults to currentComputation, or does nothing                                                    // 395
// if there is no currentComputation.                                                                                 // 396
                                                                                                                      // 397
/**                                                                                                                   // 398
 * @summary Declares that the current computation (or `fromComputation` if given) depends on `dependency`.  The computation will be invalidated the next time `dependency` changes.
                                                                                                                      // 400
If there is no current computation and `depend()` is called with no arguments, it does nothing and returns false.     // 401
                                                                                                                      // 402
Returns true if the computation is a new dependent of `dependency` rather than an existing one.                       // 403
 * @locus Client                                                                                                      // 404
 * @param {Tracker.Computation} [fromComputation] An optional computation declared to depend on `dependency` instead of the current computation.
 * @returns {Boolean}                                                                                                 // 406
 */                                                                                                                   // 407
Tracker.Dependency.prototype.depend = function (computation) {                                                        // 408
  if (! computation) {                                                                                                // 409
    if (! Tracker.active)                                                                                             // 410
      return false;                                                                                                   // 411
                                                                                                                      // 412
    computation = Tracker.currentComputation;                                                                         // 413
  }                                                                                                                   // 414
  var self = this;                                                                                                    // 415
  var id = computation._id;                                                                                           // 416
  if (! (id in self._dependentsById)) {                                                                               // 417
    self._dependentsById[id] = computation;                                                                           // 418
    computation.onInvalidate(function () {                                                                            // 419
      delete self._dependentsById[id];                                                                                // 420
    });                                                                                                               // 421
    return true;                                                                                                      // 422
  }                                                                                                                   // 423
  return false;                                                                                                       // 424
};                                                                                                                    // 425
                                                                                                                      // 426
// http://docs.meteor.com/#dependency_changed                                                                         // 427
                                                                                                                      // 428
/**                                                                                                                   // 429
 * @summary Invalidate all dependent computations immediately and remove them as dependents.                          // 430
 * @locus Client                                                                                                      // 431
 */                                                                                                                   // 432
Tracker.Dependency.prototype.changed = function () {                                                                  // 433
  var self = this;                                                                                                    // 434
  for (var id in self._dependentsById)                                                                                // 435
    self._dependentsById[id].invalidate();                                                                            // 436
};                                                                                                                    // 437
                                                                                                                      // 438
// http://docs.meteor.com/#dependency_hasdependents                                                                   // 439
                                                                                                                      // 440
/**                                                                                                                   // 441
 * @summary True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.
 * @locus Client                                                                                                      // 443
 * @returns {Boolean}                                                                                                 // 444
 */                                                                                                                   // 445
Tracker.Dependency.prototype.hasDependents = function () {                                                            // 446
  var self = this;                                                                                                    // 447
  for(var id in self._dependentsById)                                                                                 // 448
    return true;                                                                                                      // 449
  return false;                                                                                                       // 450
};                                                                                                                    // 451
                                                                                                                      // 452
// http://docs.meteor.com/#tracker_flush                                                                              // 453
                                                                                                                      // 454
/**                                                                                                                   // 455
 * @summary Process all reactive updates immediately and ensure that all invalidated computations are rerun.          // 456
 * @locus Client                                                                                                      // 457
 */                                                                                                                   // 458
Tracker.flush = function (options) {                                                                                  // 459
  Tracker._runFlush({ finishSynchronously: true,                                                                      // 460
                      throwFirstError: options && options._throwFirstError });                                        // 461
};                                                                                                                    // 462
                                                                                                                      // 463
// Run all pending computations and afterFlush callbacks.  If we were not called                                      // 464
// directly via Tracker.flush, this may return before they're all done to allow                                       // 465
// the event loop to run a little before continuing.                                                                  // 466
Tracker._runFlush = function (options) {                                                                              // 467
  // XXX What part of the comment below is still true? (We no longer                                                  // 468
  // have Spark)                                                                                                      // 469
  //                                                                                                                  // 470
  // Nested flush could plausibly happen if, say, a flush causes                                                      // 471
  // DOM mutation, which causes a "blur" event, which runs an                                                         // 472
  // app event handler that calls Tracker.flush.  At the moment                                                       // 473
  // Spark blocks event handlers during DOM mutation anyway,                                                          // 474
  // because the LiveRange tree isn't valid.  And we don't have                                                       // 475
  // any useful notion of a nested flush.                                                                             // 476
  //                                                                                                                  // 477
  // https://app.asana.com/0/159908330244/385138233856                                                                // 478
  if (inFlush)                                                                                                        // 479
    throw new Error("Can't call Tracker.flush while flushing");                                                       // 480
                                                                                                                      // 481
  if (inCompute)                                                                                                      // 482
    throw new Error("Can't flush inside Tracker.autorun");                                                            // 483
                                                                                                                      // 484
  options = options || {};                                                                                            // 485
                                                                                                                      // 486
  inFlush = true;                                                                                                     // 487
  willFlush = true;                                                                                                   // 488
  throwFirstError = !! options.throwFirstError;                                                                       // 489
                                                                                                                      // 490
  var recomputedCount = 0;                                                                                            // 491
  var finishedTry = false;                                                                                            // 492
  try {                                                                                                               // 493
    while (pendingComputations.length ||                                                                              // 494
           afterFlushCallbacks.length) {                                                                              // 495
                                                                                                                      // 496
      // recompute all pending computations                                                                           // 497
      while (pendingComputations.length) {                                                                            // 498
        var comp = pendingComputations.shift();                                                                       // 499
        comp._recompute();                                                                                            // 500
        if (comp._needsRecompute()) {                                                                                 // 501
          pendingComputations.unshift(comp);                                                                          // 502
        }                                                                                                             // 503
                                                                                                                      // 504
        if (! options.finishSynchronously && ++recomputedCount > 1000) {                                              // 505
          finishedTry = true;                                                                                         // 506
          return;                                                                                                     // 507
        }                                                                                                             // 508
      }                                                                                                               // 509
                                                                                                                      // 510
      if (afterFlushCallbacks.length) {                                                                               // 511
        // call one afterFlush callback, which may                                                                    // 512
        // invalidate more computations                                                                               // 513
        var func = afterFlushCallbacks.shift();                                                                       // 514
        try {                                                                                                         // 515
          func();                                                                                                     // 516
        } catch (e) {                                                                                                 // 517
          _throwOrLog("afterFlush", e);                                                                               // 518
        }                                                                                                             // 519
      }                                                                                                               // 520
    }                                                                                                                 // 521
    finishedTry = true;                                                                                               // 522
  } finally {                                                                                                         // 523
    if (! finishedTry) {                                                                                              // 524
      // we're erroring due to throwFirstError being true.                                                            // 525
      inFlush = false; // needed before calling `Tracker.flush()` again                                               // 526
      // finish flushing                                                                                              // 527
      Tracker._runFlush({                                                                                             // 528
        finishSynchronously: options.finishSynchronously,                                                             // 529
        throwFirstError: false                                                                                        // 530
      });                                                                                                             // 531
    }                                                                                                                 // 532
    willFlush = false;                                                                                                // 533
    inFlush = false;                                                                                                  // 534
    if (pendingComputations.length || afterFlushCallbacks.length) {                                                   // 535
      // We're yielding because we ran a bunch of computations and we aren't                                          // 536
      // required to finish synchronously, so we'd like to give the event loop a                                      // 537
      // chance. We should flush again soon.                                                                          // 538
      if (options.finishSynchronously) {                                                                              // 539
        throw new Error("still have more to do?");  // shouldn't happen                                               // 540
      }                                                                                                               // 541
      setTimeout(requireFlush, 10);                                                                                   // 542
    }                                                                                                                 // 543
  }                                                                                                                   // 544
};                                                                                                                    // 545
                                                                                                                      // 546
// http://docs.meteor.com/#tracker_autorun                                                                            // 547
//                                                                                                                    // 548
// Run f(). Record its dependencies. Rerun it whenever the                                                            // 549
// dependencies change.                                                                                               // 550
//                                                                                                                    // 551
// Returns a new Computation, which is also passed to f.                                                              // 552
//                                                                                                                    // 553
// Links the computation to the current computation                                                                   // 554
// so that it is stopped if the current computation is invalidated.                                                   // 555
                                                                                                                      // 556
/**                                                                                                                   // 557
 * @callback Tracker.ComputationFunction                                                                              // 558
 * @param {Tracker.Computation}                                                                                       // 559
 */                                                                                                                   // 560
/**                                                                                                                   // 561
 * @summary Run a function now and rerun it later whenever its dependencies                                           // 562
 * change. Returns a Computation object that can be used to stop or observe the                                       // 563
 * rerunning.                                                                                                         // 564
 * @locus Client                                                                                                      // 565
 * @param {Tracker.ComputationFunction} runFunc The function to run. It receives                                      // 566
 * one argument: the Computation object that will be returned.                                                        // 567
 * @param {Object} [options]                                                                                          // 568
 * @param {Function} options.onError Optional. The function to run when an error                                      // 569
 * happens in the Computation. The only argument it recieves is the Error                                             // 570
 * thrown. Defaults to the error being logged to the console.                                                         // 571
 * @returns {Tracker.Computation}                                                                                     // 572
 */                                                                                                                   // 573
Tracker.autorun = function (f, options) {                                                                             // 574
  if (typeof f !== 'function')                                                                                        // 575
    throw new Error('Tracker.autorun requires a function argument');                                                  // 576
                                                                                                                      // 577
  options = options || {};                                                                                            // 578
                                                                                                                      // 579
  constructingComputation = true;                                                                                     // 580
  var c = new Tracker.Computation(                                                                                    // 581
    f, Tracker.currentComputation, options.onError);                                                                  // 582
                                                                                                                      // 583
  if (Tracker.active)                                                                                                 // 584
    Tracker.onInvalidate(function () {                                                                                // 585
      c.stop();                                                                                                       // 586
    });                                                                                                               // 587
                                                                                                                      // 588
  return c;                                                                                                           // 589
};                                                                                                                    // 590
                                                                                                                      // 591
// http://docs.meteor.com/#tracker_nonreactive                                                                        // 592
//                                                                                                                    // 593
// Run `f` with no current computation, returning the return value                                                    // 594
// of `f`.  Used to turn off reactivity for the duration of `f`,                                                      // 595
// so that reactive data sources accessed by `f` will not result in any                                               // 596
// computations being invalidated.                                                                                    // 597
                                                                                                                      // 598
/**                                                                                                                   // 599
 * @summary Run a function without tracking dependencies.                                                             // 600
 * @locus Client                                                                                                      // 601
 * @param {Function} func A function to call immediately.                                                             // 602
 */                                                                                                                   // 603
Tracker.nonreactive = function (f) {                                                                                  // 604
  var previous = Tracker.currentComputation;                                                                          // 605
  setCurrentComputation(null);                                                                                        // 606
  try {                                                                                                               // 607
    return f();                                                                                                       // 608
  } finally {                                                                                                         // 609
    setCurrentComputation(previous);                                                                                  // 610
  }                                                                                                                   // 611
};                                                                                                                    // 612
                                                                                                                      // 613
// http://docs.meteor.com/#tracker_oninvalidate                                                                       // 614
                                                                                                                      // 615
/**                                                                                                                   // 616
 * @summary Registers a new [`onInvalidate`](#computation_oninvalidate) callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.
 * @locus Client                                                                                                      // 618
 * @param {Function} callback A callback function that will be invoked as `func(c)`, where `c` is the computation on which the callback is registered.
 */                                                                                                                   // 620
Tracker.onInvalidate = function (f) {                                                                                 // 621
  if (! Tracker.active)                                                                                               // 622
    throw new Error("Tracker.onInvalidate requires a currentComputation");                                            // 623
                                                                                                                      // 624
  Tracker.currentComputation.onInvalidate(f);                                                                         // 625
};                                                                                                                    // 626
                                                                                                                      // 627
// http://docs.meteor.com/#tracker_afterflush                                                                         // 628
                                                                                                                      // 629
/**                                                                                                                   // 630
 * @summary Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun.  The function will be run once and not on subsequent flushes unless `afterFlush` is called again.
 * @locus Client                                                                                                      // 632
 * @param {Function} callback A function to call at flush time.                                                       // 633
 */                                                                                                                   // 634
Tracker.afterFlush = function (f) {                                                                                   // 635
  afterFlushCallbacks.push(f);                                                                                        // 636
  requireFlush();                                                                                                     // 637
};                                                                                                                    // 638
                                                                                                                      // 639
/* --------------------------- deprecated.js ------------------------------ */                                        // 640
                                                                                                                      // 641
// These functions used to be on the Meteor object (and worked slightly                                               // 642
// differently).                                                                                                      // 643
// XXX COMPAT WITH 0.5.7                                                                                              // 644
Meteor.flush = Tracker.flush;                                                                                         // 645
Meteor.autorun = Tracker.autorun;                                                                                     // 646
                                                                                                                      // 647
// We used to require a special "autosubscribe" call to reactively subscribe to                                       // 648
// things. Now, it works with autorun.                                                                                // 649
// XXX COMPAT WITH 0.5.4                                                                                              // 650
Meteor.autosubscribe = Tracker.autorun;                                                                               // 651
                                                                                                                      // 652
// This Tracker API briefly existed in 0.5.8 and 0.5.9                                                                // 653
// XXX COMPAT WITH 0.5.9                                                                                              // 654
Tracker.depend = function (d) {                                                                                       // 655
  return d.depend();                                                                                                  // 656
};                                                                                                                    // 657
                                                                                                                      // 658
Deps = Tracker;                                                                                                       // 659
                                                                                                                      // 660
/* -------------------------------- FVIEW --------------------------------- */                                        // 661
                                                                                                                      // 662
// Unfortunately famo.us Engine also uses private methods, so let's just                                              // 663
// cap at 1/4 of what we expect that limit to be to err on the side of                                                // 664
// caution and hope for the best.                                                                                     // 665
                                                                                                                      // 666
var MAX_DEFER_FRAME_TIME = 1; // 2;                                                                                   // 667
var COMPUTATION_WARN_THRESHOLD = 5;                                                                                   // 668
                                                                                                                      // 669
Tracker._FViewRunFlush = function (options) {                                                                         // 670
  if (inFlush)                                                                                                        // 671
    throw new Error("Can't call Tracker.flush while flushing");                                                       // 672
                                                                                                                      // 673
  if (inCompute)                                                                                                      // 674
    throw new Error("Can't flush inside Tracker.autorun");                                                            // 675
                                                                                                                      // 676
  options = options || {};                                                                                            // 677
                                                                                                                      // 678
  inFlush = true;                                                                                                     // 679
  willFlush = true;                                                                                                   // 680
  throwFirstError = !! options.throwFirstError;                                                                       // 681
                                                                                                                      // 682
  // fviews change #2 - watch frame time                                                                              // 683
  var flushStartTime = Date.now();                                                                                    // 684
  var computationStartTime;                                                                                           // 685
                                                                                                                      // 686
  var recomputedCount = 0;                                                                                            // 687
  var finishedTry = false;                                                                                            // 688
  try {                                                                                                               // 689
    while (pendingComputations.length ||                                                                              // 690
           afterFlushCallbacks.length) {                                                                              // 691
                                                                                                                      // 692
      // recompute all pending computations                                                                           // 693
      while (pendingComputations.length) {                                                                            // 694
        var comp = pendingComputations.shift();                                                                       // 695
        computationStartTime = Date.now(); // fview#3                                                                 // 696
        comp._recompute();                                                                                            // 697
        if (comp._needsRecompute()) {                                                                                 // 698
          pendingComputations.unshift(comp);                                                                          // 699
        }                                                                                                             // 700
                                                                                                                      // 701
        if (! options.finishSynchronously && (++recomputedCount > 1000 || // fviews#2                                 // 702
            Date.now() - flushStartTime > MAX_DEFER_FRAME_TIME)) {                                                    // 703
          // This log.debug will fall away after all this is well tested                                              // 704
          /* log.debug('Tracker._FViewRunFlush -- splitting after ' +                                                 // 705
            (Date.now() - flushStartTime) + 'ms, ' +                                                                  // 706
            pendingComputations.length + ' pending computations'); */                                                 // 707
                                                                                                                      // 708
          // This is definitely useful to keep around                                                                 // 709
          if (Tracker.warnOnLongComputations === true &&                                                              // 710
              Date.now() - computationStartTime > COMPUTATION_WARN_THRESHOLD) {                                       // 711
            var func = Tracker.showFullFuncsInWarnings ? comp._func :                                                 // 712
              ( comp._func.toString()                                                                                 // 713
                .replace(/^function ([^\(]*)\(([^\)]*)\)[\s\S]*$/, 'function $1($2) ') +                              // 714
                (comp._func.displayName || comp._func.name || ''));                                                   // 715
            log.debug("The following computation took " +                                                             // 716
              (Date.now() - computationStartTime) + 'ms to complete:' /* : ' + func */,                               // 717
              func, Tracker.showComputationsInWarnings ? comp : "");                                                  // 718
          }                                                                                                           // 719
                                                                                                                      // 720
          finishedTry = true;                                                                                         // 721
          return;                                                                                                     // 722
        }                                                                                                             // 723
      }                                                                                                               // 724
                                                                                                                      // 725
      if (afterFlushCallbacks.length) {                                                                               // 726
        // call one afterFlush callback, which may                                                                    // 727
        // invalidate more computations                                                                               // 728
        var func = afterFlushCallbacks.shift();                                                                       // 729
        try {                                                                                                         // 730
          func();                                                                                                     // 731
        } catch (e) {                                                                                                 // 732
          _throwOrLog("afterFlush", e);                                                                               // 733
        }                                                                                                             // 734
      }                                                                                                               // 735
    }                                                                                                                 // 736
    finishedTry = true;                                                                                               // 737
  } finally {                                                                                                         // 738
    if (! finishedTry) {                                                                                              // 739
      // we're erroring due to throwFirstError being true.                                                            // 740
      inFlush = false; // needed before calling `Tracker.flush()` again                                               // 741
      // finish flushing                                                                                              // 742
      Tracker._runFlush({                                                                                             // 743
        finishSynchronously: options.finishSynchronously,                                                             // 744
        throwFirstError: false                                                                                        // 745
      });                                                                                                             // 746
    }                                                                                                                 // 747
    willFlush = false;                                                                                                // 748
    inFlush = false;                                                                                                  // 749
    if (pendingComputations.length || afterFlushCallbacks.length) {                                                   // 750
      // We're yielding because we ran a bunch of computations and we aren't                                          // 751
      // required to finish synchronously, so we'd like to give the event loop a                                      // 752
      // chance. We should flush again soon.                                                                          // 753
      if (options.finishSynchronously) {                                                                              // 754
        throw new Error("still have more to do?");  // shouldn't happen                                               // 755
      }                                                                                                               // 756
      // fviews#5                                                                                                     // 757
      if (recomputedCount > 1000)                                                                                     // 758
        setTimeout(requireFlush, 10);                                                                                 // 759
      else                                                                                                            // 760
        requireFlush(); // defers anyway                                                                              // 761
        // Engine.nextTick(requireFlush);  -- could do this if we track famous' time.                                 // 762
    }                                                                                                                 // 763
  }                                                                                                                   // 764
};                                                                                                                    // 765
                                                                                                                      // 766
/*                                                                                                                    // 767
FView.ready(function() {                                                                                              // 768
  var Engine = famous.core.Engine;                                                                                    // 769
                                                                                                                      // 770
  log.debug('Tracker.requireFlush -- replacing');                                                                     // 771
  requireFlush = function () {                                                                                        // 772
    if (! willFlush) {                                                                                                // 773
      setTimeout(Tracker.FViewFlush, 0);                                                                              // 774
      willFlush = true;                                                                                               // 775
    }                                                                                                                 // 776
  };                                                                                                                  // 777
});                                                                                                                   // 778
*/                                                                                                                    // 779
                                                                                                                      // 780
FView.ready(function() {                                                                                              // 781
  var Engine = famous.core.Engine;                                                                                    // 782
                                                                                                                      // 783
  // Would be better to figure out where we are in a tick to limit the                                                // 784
  // threshold, and then have a resumed flush be in the next tick                                                     // 785
  log.debug('Tracker.requireFlush -- replacing');                                                                     // 786
  requireFlush = function () {                                                                                        // 787
    if (! willFlush) {                                                                                                // 788
      Engine.defer(Tracker._FViewRunFlush)                                                                            // 789
      willFlush = true;                                                                                               // 790
    }                                                                                                                 // 791
  };                                                                                                                  // 792
  Tracker.warnOnLongComputations = true;                                                                              // 793
  Tracker.showFullFuncsInWarnings = false;                                                                            // 794
  Tracker.showComputationsInWarnings = false;                                                                         // 795
                                                                                                                      // 796
  log.debug('Overriding Meteor._setImmediate() to use famous.core.Engine.defer()');                                   // 797
  var setImmediate = function (fn) {                                                                                  // 798
    Engine.defer(fn);                                                                                                 // 799
  };                                                                                                                  // 800
  setImmediate.implementation = 'famous';                                                                             // 801
  Meteor._setImmediate = setImmediate;                                                                                // 802
});                                                                                                                   // 803
                                                                                                                      // 804
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/timers.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// From meteor/timers.js, 28aug14, commit 3189a36                                                                     // 1
                                                                                                                      // 2
var withoutInvocation = function (f) {                                                                                // 3
  if (Package.ddp) {                                                                                                  // 4
    var _CurrentInvocation = Package.ddp.DDP._CurrentInvocation;                                                      // 5
    if (_CurrentInvocation.get() && _CurrentInvocation.get().isSimulation)                                            // 6
      throw new Error("Can't set timers inside simulations");                                                         // 7
    return function () { _CurrentInvocation.withValue(null, f); };                                                    // 8
  }                                                                                                                   // 9
  else                                                                                                                // 10
    return f;                                                                                                         // 11
};                                                                                                                    // 12
                                                                                                                      // 13
var bindAndCatch = function (context, f) {                                                                            // 14
  return Meteor.bindEnvironment(withoutInvocation(f), context);                                                       // 15
};                                                                                                                    // 16
                                                                                                                      // 17
FView.ready(function() {                                                                                              // 18
  var FamousTimer = famous.utilities.Timer;                                                                           // 19
                                                                                                                      // 20
  _.extend(Meteor, {                                                                                                  // 21
    setTimeout: function (f, duration) {                                                                              // 22
      return FamousTimer.setTimeout(bindAndCatch("setTimeout callback", f), duration);                                // 23
    },                                                                                                                // 24
    setInterval: function (f, duration) {                                                                             // 25
      return FamousTimer.setInterval(bindAndCatch("setInterval callback", f), duration);                              // 26
    },                                                                                                                // 27
    clearInterval: function(x) {                                                                                      // 28
      return FamousTimer.clear(x);                                                                                    // 29
    },                                                                                                                // 30
    clearTimeout: function(x) {                                                                                       // 31
      return FamousTimer.clear(x);                                                                                    // 32
    },                                                                                                                // 33
    defer: function (f) {                                                                                             // 34
      Meteor._setImmediate(bindAndCatch("defer callback", f));                                                        // 35
    }                                                                                                                 // 36
  });                                                                                                                 // 37
});                                                                                                                   // 38
                                                                                                                      // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/meteorFamousView.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
 * Templates are always added to a MeteorFamousView ("fview"), in turn is                                             // 2
 * added to it's parent fview or a context.  This allows us to handle                                                 // 3
 * situations where a template is later removed (since nodes cannot ever                                              // 4
 * be manually removed from the render tree).                                                                         // 5
 *                                                                                                                    // 6
 * http://stackoverflow.com/questions/23087980/how-to-remove-nodes-from-the-ren                                       // 7
 */                                                                                                                   // 8
                                                                                                                      // 9
var meteorFamousViews = {};                                                                                           // 10
var meteorFamousViewsCount = 0;                                                                                       // 11
                                                                                                                      // 12
MeteorFamousView = function(blazeView, options, noAdd) {                                                              // 13
  this.id = options.id || ++meteorFamousViewsCount;                                                                   // 14
  meteorFamousViews[this.id] = this;                                                                                  // 15
                                                                                                                      // 16
  this.blazeView = blazeView;                                                                                         // 17
  this.children = [];                                                                                                 // 18
                                                                                                                      // 19
  this._callbacks = { cleanup: [], destroy: [] };                                                                     // 20
                                                                                                                      // 21
  if (noAdd)                                                                                                          // 22
    return;                                                                                                           // 23
                                                                                                                      // 24
  var parent = blazeView;                                                                                             // 25
  while ((parent=parent.parentView) && !parent.fview);                                                                // 26
  if (parent) {                                                                                                       // 27
    parent = parent.fview;                                                                                            // 28
  } else {                                                                                                            // 29
    // backcompat with children created in limbo going to main context                                                // 30
    // but we should still only create that if we need to now                                                         // 31
    if (!FView.mainCtx) {                                                                                             // 32
      if (typeof FView.mainCtx === 'undefined')                                                                       // 33
        log.debug('Creating a new main context to maintain backwards ' +                                              // 34
          'compatibility.  Consider using ' +                                                                         // 35
          '{{#famousContext id="mainCtx"}} in your body.');                                                           // 36
        /*                                                                                                            // 37
        log.debug('Creating a new main context.  If you already have '                                                // 38
          + 'your own, set FView.mainCtx = yourMainContext (or to false to get '                                      // 39
          + 'rid of this warning, or null to not set a mainContext)');                                                // 40
        */                                                                                                            // 41
      if (FView.mainCtx !== null) {                                                                                   // 42
        var view = FView.famousContext.constructView();                                                               // 43
        var wrapped = Blaze.With({ id:"mainCtx" },                                                                    // 44
          function() { return view; });                                                                               // 45
        wrapped.__isTemplateWith = true;                                                                              // 46
        // Because of id:mainCtx, this populates FView.mainCtxFView                                                   // 47
        Blaze.render(wrapped, document.body);                                                                         // 48
      }                                                                                                               // 49
      parent = FView.mainCtxFView;                                                                                    // 50
    } else {                                                                                                          // 51
      // backcompat, user set FView.mainCtx manually                                                                  // 52
                                                                                                                      // 53
    }                                                                                                                 // 54
  }                                                                                                                   // 55
  //parent = parent ? parent.fview : { node: FView.mainCtx, children: [] };                                           // 56
                                                                                                                      // 57
  this.parent = parent;                                                                                               // 58
                                                                                                                      // 59
  // Keep track of fview children, since Meteor only tracks children in DOM                                           // 60
  parent.children.push(this);                                                                                         // 61
                                                                                                                      // 62
  // Adding to famous parent node, once done here, is now in famous.js                                                // 63
                                                                                                                      // 64
  // Now we have a tree, and a FView.mainCtx if in appMode                                                            // 65
  if (postFirstAddQueue) {                                                                                            // 66
    for (var i=0; i < postFirstAddQueue.length; i++)                                                                  // 67
      Engine.defer(postFirstAddQueue[i]);                                                                             // 68
    postFirstAddQueue = null;                                                                                         // 69
    FView.postFirstAdd = function(func) {                                                                             // 70
      Engine.defer(postFirstAddQueue[i]);                                                                             // 71
    };                                                                                                                // 72
  }                                                                                                                   // 73
};                                                                                                                    // 74
                                                                                                                      // 75
MeteorFamousView.prototype.render = function() {                                                                      // 76
  if (this.isDestroyed)                                                                                               // 77
    return [];                                                                                                        // 78
  if (this.node)                                                                                                      // 79
    return this.node.render();                                                                                        // 80
  console.log('render called before anything set');                                                                   // 81
  return [];                                                                                                          // 82
};                                                                                                                    // 83
                                                                                                                      // 84
MeteorFamousView.prototype.setNode = function(node) {                                                                 // 85
  // surface or modifier/view                                                                                         // 86
  this.node = new famous.core.RenderNode(node);                                                                       // 87
  return this.node;                                                                                                   // 88
};                                                                                                                    // 89
                                                                                                                      // 90
MeteorFamousView.prototype.getSize = function() {                                                                     // 91
  return this.node && this.node.getSize() || this.size || [true,true];                                                // 92
};                                                                                                                    // 93
                                                                                                                      // 94
MeteorFamousView.prototype.preventDestroy = function() {                                                              // 95
  this.destroyPrevented = true;                                                                                       // 96
};                                                                                                                    // 97
                                                                                                                      // 98
/*                                                                                                                    // 99
 * A "TemplateDestroy" is when destroy() is called via a Blaze.remove                                                 // 100
 * destroyed callback, and should observe destroyPrevented if set.                                                    // 101
 * Otherwise, when destroy() is called directly / purposefully /                                                      // 102
 * with no arguments, we force cleanup (and ignore destroyPrevented).                                                 // 103
 */                                                                                                                   // 104
MeteorFamousView.prototype.destroy = function(isTemplateDestroy) {                                                    // 105
  var i;                                                                                                              // 106
  var fview = this;                                                                                                   // 107
                                                                                                                      // 108
  // break early and don't run onDestroy().                                                                           // 109
  if (fview.waitForNoChildrenBeforeDestroy && fview.children.length) {                                                // 110
    if (fview.waitForNoChildrenBeforeDestroy === true) {                                                              // 111
      log.debug('Destroying ' + (fview._view ?                                                                        // 112
        fview._view.name : (fview._modifier ? fview._modifier.name : fview.kind)) +                                   // 113
        ' (#' + fview.id + ') (deferred until all children destroyed)');                                              // 114
      fview.waitForNoChildrenBeforeDestroy = 1;                                                                       // 115
    }                                                                                                                 // 116
    return;                                                                                                           // 117
  }                                                                                                                   // 118
                                                                                                                      // 119
  log.debug('Destroying ' + (fview._view ?                                                                            // 120
    fview._view.name : (fview._modifier ? fview._modifier.name : fview.kind)) +                                       // 121
    ' (#' + fview.id + ') and children' +                                                                             // 122
    (isTemplateDestroy&&fview.destroyPrevented ? ' (destroyPrevented)':''));                                          // 123
                                                                                                                      // 124
  if (isTemplateDestroy) {                                                                                            // 125
                                                                                                                      // 126
    if (fview.onDestroy) {                                                                                            // 127
      /* -- we can wait a while before warning about this (since 2015-02-24)                                          // 128
      log.warn('#' + fview.id + ' - you set fview.onDestroy = function().  ' +                                        // 129
        'This will work for now but is deprecated.  Please rather use ' +                                             // 130
        'fview.on("destroy", callback), which may ' +                                                                 // 131
        'be used multiple times, and receives the `fview` as `this`.');                                               // 132
      */                                                                                                              // 133
      fview.onDestroy();                                                                                              // 134
    }                                                                                                                 // 135
                                                                                                                      // 136
    fview._fireCallbacks('destroy');                                                                                  // 137
                                                                                                                      // 138
    if (fview.destroyPrevented) {                                                                                     // 139
      // log.debug('  #' + fview.id + ' - destroyPrevented');                                                         // 140
      return;                                                                                                         // 141
    }                                                                                                                 // 142
  }                                                                                                                   // 143
                                                                                                                      // 144
  // First delete children (via Blaze to trigger Template destroy callback)                                           // 145
  if (fview.children) {                                                                                               // 146
    forEach(fview.children, function(child) {                                                                         // 147
      Blaze.remove(child.blazeView);                                                                                  // 148
    }, true);                                                                                                         // 149
  }                                                                                                                   // 150
                                                                                                                      // 151
  if (fview._view && fview._view.onDestroy)                                                                           // 152
    fview._view.onDestroy.call(fview);                                                                                // 153
                                                                                                                      // 154
  fview.isDestroyed = true;                                                                                           // 155
  fview.node = null;                                                                                                  // 156
  fview.view = null;                                                                                                  // 157
  fview.modifier = null;                                                                                              // 158
                                                                                                                      // 159
  delete(meteorFamousViews[fview.id]);                                                                                // 160
                                                                                                                      // 161
  // remove fview from parent                                                                                         // 162
  for (i=0; i < fview.parent.children.length; i++) {                                                                  // 163
    if (fview.parent.children[i] === fview) {                                                                         // 164
      fview.parent.children.splice(i, 1);                                                                             // 165
      break;                                                                                                          // 166
    }                                                                                                                 // 167
  }                                                                                                                   // 168
                                                                                                                      // 169
  // If we're part of a sequence, now is the time to remove ourselves                                                 // 170
  if (fview.parent.sequence) {                                                                                        // 171
    Engine.defer(function() {                                                                                         // 172
      fview.parent.sequence.remove(fview);  // less flicker in a defer                                                // 173
    });                                                                                                               // 174
    // Originally we had code here to remove child sequences; this is now                                             // 175
    // handled in famousEach via the cleanup event.                                                                   // 176
  }                                                                                                                   // 177
                                                                                                                      // 178
  if (fview.parent.waitForNoChildrenBeforeDestroy)                                                                    // 179
    fview.parent.destroy();                                                                                           // 180
                                                                                                                      // 181
  fview._fireCallbacks('cleanup');                                                                                    // 182
};                                                                                                                    // 183
                                                                                                                      // 184
MeteorFamousView.prototype.on = function(event, func) {                                                               // 185
  this._callbacks[event].push(func);                                                                                  // 186
  return this;                                                                                                        // 187
};                                                                                                                    // 188
MeteorFamousView.prototype.removeListener = function(event, func) {                                                   // 189
  for (var i=0; i < this._callbacks[event].length; i++)                                                               // 190
    if (this._callbacks[event][i] === func) {                                                                         // 191
      this._callbacks[event].splice(i, 1);                                                                            // 192
      return;                                                                                                         // 193
    }                                                                                                                 // 194
};                                                                                                                    // 195
MeteorFamousView.prototype.listeners = function(event) {                                                              // 196
  return this._callbacks[event];                                                                                      // 197
};                                                                                                                    // 198
MeteorFamousView.prototype._fireCallbacks = function(event, args) {                                                   // 199
  for (var i=0; i < this._callbacks[event].length; i++)                                                               // 200
    this._callbacks[event][i].apply(this, args);                                                                      // 201
};                                                                                                                    // 202
MeteorFamousView.prototype.addListener = MeteorFamousView.prototype.on;                                               // 203
                                                                                                                      // 204
throwError = function(startStr, object) {                                                                             // 205
  if (object instanceof Object)                                                                                       // 206
    console.error(object);                                                                                            // 207
  throw new Error('FView.getData() expects BlazeView or TemplateInstance or ' +                                       // 208
      'DOM node, but got ' + object);                                                                                 // 209
};                                                                                                                    // 210
                                                                                                                      // 211
FView.from = function(viewOrTplorEl) {                                                                                // 212
  if (viewOrTplorEl instanceof Blaze.View)                                                                            // 213
    return FView.fromBlazeView(viewOrTplorEl);                                                                        // 214
  else if (viewOrTplorEl instanceof Blaze.TemplateInstance)                                                           // 215
    return FView.fromTemplate(viewOrTplorEl);                                                                         // 216
  else if (viewOrTplorEl && typeof viewOrTplorEl.nodeType === 'number')                                               // 217
    return FView.fromElement(viewOrTplorEl);                                                                          // 218
  else {                                                                                                              // 219
    throwError('FView.getData() expects BlazeView or TemplateInstance or ' +                                          // 220
        'DOM node, but got ', viewOrTplorEl);                                                                         // 221
  }                                                                                                                   // 222
};                                                                                                                    // 223
                                                                                                                      // 224
FView.fromBlazeView = FView.dataFromView = function(view) {                                                           // 225
  while (!view.fview && (view=view.parentView));                                                                      // 226
  return view ? view.fview : undefined;                                                                               // 227
};                                                                                                                    // 228
                                                                                                                      // 229
FView.fromTemplate = FView.dataFromTemplate = function(tplInstance) {                                                 // 230
  return this.dataFromView(tplInstance.view);                                                                         // 231
};                                                                                                                    // 232
                                                                                                                      // 233
FView.fromElement = FView.dataFromElement = function(el) {                                                            // 234
  var view = Blaze.getView(el);                                                                                       // 235
  return this.dataFromView(view);                                                                                     // 236
};                                                                                                                    // 237
                                                                                                                      // 238
FView.byId = function(id) {                                                                                           // 239
  return meteorFamousViews[id];                                                                                       // 240
};                                                                                                                    // 241
                                                                                                                      // 242
// Leave as alias?  Deprecate?                                                                                        // 243
FView.dataFromCmp = FView.dataFromComponent;                                                                          // 244
FView.dataFromTpl = FView.dataFromTemplate;                                                                           // 245
                                                                                                                      // 246
FView.dataFromComponent = function(component) {                                                                       // 247
  log.warn("FView.dataFromComponent has been deprecated.  Please use 'FView.fromBlazeView' instead.");                // 248
  return FView.fromBlazeView(component);                                                                              // 249
};                                                                                                                    // 250
                                                                                                                      // 251
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/sequencer.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* Sequencer and childSequence */                                                                                     // 1
                                                                                                                      // 2
sequencer = function(parent) {                                                                                        // 3
  this._sequence = [];                                                                                                // 4
  this._children = [];                                                                                                // 5
                                                                                                                      // 6
  if (parent) {                                                                                                       // 7
    this.parent = parent;                                                                                             // 8
    this.childNo = parent._children.length;                                                                           // 9
    this.startIndex = parent._sequence.length;                                                                        // 10
  }                                                                                                                   // 11
};                                                                                                                    // 12
                                                                                                                      // 13
// TODO, refactor + cleanup for constructor                                                                           // 14
sequencer.prototype.child = function(index) {                                                                         // 15
  var child = new sequencer(this);                                                                                    // 16
                                                                                                                      // 17
  if (typeof index !== 'undefined') {                                                                                 // 18
    child.childNo = index;                                                                                            // 19
    child.startIndex = index < this._children.length ?                                                                // 20
      this._children[index].startIndex : this._sequence.length;                                                       // 21
    // Recall for below loop that child has not been inserted yet                                                     // 22
    for (var i=index; i < this._children.length; i++)                                                                 // 23
      this._children[i].childNo++;                                                                                    // 24
  } else                                                                                                              // 25
    index = this._children.length;                                                                                    // 26
                                                                                                                      // 27
  this._children.splice(index, 0, child);                                                                             // 28
  return child;                                                                                                       // 29
};                                                                                                                    // 30
                                                                                                                      // 31
// this is still not super urgent, let's not do it until we have time                                                 // 32
// to write tests, etc.                                                                                               // 33
// sequencer.prototype.removeFromParent = function() {                                                                // 34
// }                                                                                                                  // 35
                                                                                                                      // 36
/*                                                                                                                    // 37
 * For both functions below:                                                                                          // 38
 *                                                                                                                    // 39
 *   1. Splice into correct position in parent sequencer's _sequence                                                  // 40
 *   2. Update the startIndex of all siblings born after us                                                           // 41
 *   3. Modify our own _sequence                                                                                      // 42
 */                                                                                                                   // 43
                                                                                                                      // 44
sequencer.prototype.push = function(value) {                                                                          // 45
  if (this.parent) {                                                                                                  // 46
    this.parent.splice(this.startIndex+this._sequence.length, 0, value);                                              // 47
    for (var i=this.childNo+1; i < this.parent._children.length; i++) {                                               // 48
      this.parent._children[i].startIndex++;                                                                          // 49
    }                                                                                                                 // 50
  }                                                                                                                   // 51
  return this._sequence.push(value);                                                                                  // 52
};                                                                                                                    // 53
                                                                                                                      // 54
sequencer.prototype.splice = function(index, howMany /*, arguments */) {                                              // 55
  if (!this.parent)                                                                                                   // 56
    return this._sequence.splice.apply(this._sequence, arguments);                                                    // 57
                                                                                                                      // 58
  var diff, max = this._sequence.length - index;                                                                      // 59
  if (howMany > max) howMany = max;                                                                                   // 60
  diff = (arguments.length - 2) - howMany; // inserts - howMany                                                       // 61
                                                                                                                      // 62
  for (var i=this.childNo+1; i < this.parent._children.length; i++)                                                   // 63
    this.parent._children[i].startIndex += diff;                                                                      // 64
                                                                                                                      // 65
  this._sequence.splice.apply(this._sequence, arguments);                                                             // 66
  // add startIndex and re-use args                                                                                   // 67
  arguments[0] += this.startIndex;  // jshint ignore:line                                                             // 68
  return this.parent.splice.apply(this.parent, arguments);                                                            // 69
};                                                                                                                    // 70
                                                                                                                      // 71
sequencer.prototype.removeFromParent = function() {                                                                   // 72
  if (this._sequence.length)                                                                                          // 73
    throw new Error("called removeMe on non-empty sequence");                                                         // 74
  for (var i=this.childNo+1; i < this.parent._children.length; i++)                                                   // 75
    this.parent._children[i].childNo--;                                                                               // 76
  this.parent._children.splice(this.childNo, 1);                                                                      // 77
};                                                                                                                    // 78
                                                                                                                      // 79
sequencer.prototype.checkIndex = function(value, suspectedIndex) {                                                    // 80
  if (this._sequence[suspectedIndex] === value)                                                                       // 81
    return suspectedIndex;                                                                                            // 82
  for (var i=0; i < this._sequence.length; i++)                                                                       // 83
    if (this._sequence[i] === value)                                                                                  // 84
      return i;                                                                                                       // 85
  return null;                                                                                                        // 86
};                                                                                                                    // 87
                                                                                                                      // 88
/*                                                                                                                    // 89
 * Currently we don't keep track of our children and descedent children separately,                                   // 90
 * so grandChild.push(x) && parent.remove(x) would break everything.  That's                                          // 91
 * because x lands up in our top-level list, and there's nothing to stop us                                           // 92
 * from removing it from the wrong place (and breaking all indexes).  Although as                                     // 93
 * long as we don't mistakenly do this in our code, the only way this can happen                                      // 94
 * is if x exists in both the grandParent and grandChild (not supported).                                             // 95
 */                                                                                                                   // 96
sequencer.prototype.remove = function(value /*, suspectedIndex */) {                                                  // 97
  var index;                                                                                                          // 98
  for (index=0; index < this._sequence.length; index++)                                                               // 99
    if (this._sequence[index] === value)                                                                              // 100
      return this.splice(index, 1);                                                                                   // 101
};                                                                                                                    // 102
                                                                                                                      // 103
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/famous.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* Extend Meteor Template framework for .famousEvents() */                                                            // 1
Template.prototype.famousEvents = function (eventMap) {                                                               // 2
  var template = this;                                                                                                // 3
  template.__famousEventMaps = (template.__famousEventMaps || []);                                                    // 4
  template.__famousEventMaps.push(eventMap);                                                                          // 5
};                                                                                                                    // 6
                                                                                                                      // 7
function setupEvents(fview, template) {                                                                               // 8
  if (template.__famousEventMaps) {                                                                                   // 9
    var target = fview.surface || fview.view;                                                                         // 10
    _.each(template.__famousEventMaps, function(eventMap) {                                                           // 11
      for (var k in eventMap) {                                                                                       // 12
        target.on(k, (function(k) {                                                                                   // 13
          return function(/* arguments */) {                                                                          // 14
            Array.prototype.push.call(arguments, fview);                                                              // 15
            eventMap[k].apply(this, arguments);                                                                       // 16
          };                                                                                                          // 17
        })(k)); // jshint ignore:line                                                                                 // 18
      }                                                                                                               // 19
    });                                                                                                               // 20
  }                                                                                                                   // 21
}                                                                                                                     // 22
                                                                                                                      // 23
// Used by famousEach too                                                                                             // 24
parentViewName = function(blazeView) {                                                                                // 25
  while (blazeView &&                                                                                                 // 26
      (blazeView.name == "with" || blazeView.name == "(contentBlock)"))                                               // 27
    blazeView = blazeView.parentView;                                                                                 // 28
  return blazeView ? blazeView.name : '(root)';                                                                       // 29
};                                                                                                                    // 30
                                                                                                                      // 31
parentTemplateName = function(blazeView) {                                                                            // 32
  while (blazeView &&                                                                                                 // 33
      !blazeView.name.match(/^Template/) && !blazeView.name.match(/^body_content/))                                   // 34
    blazeView = blazeView.parentView;                                                                                 // 35
  return blazeView ? blazeView.name : '(none)';                                                                       // 36
};                                                                                                                    // 37
                                                                                                                      // 38
function getHelperFunc(view, name) {                                                                                  // 39
  var helper;                                                                                                         // 40
  while ((view = view.parentView) !== null && !helper) {                                                              // 41
    helper = view.template && view.template.__helpers.get(name);                                                      // 42
  }                                                                                                                   // 43
  return helper;                                                                                                      // 44
}                                                                                                                     // 45
                                                                                                                      // 46
function famousCreated() {                                                                                            // 47
  var blazeView = this.view;                                                                                          // 48
  var famousViewName = blazeView.name ? blazeView.name.substr(7) : "";                                                // 49
                                                                                                                      // 50
  // don't re-use parent's data/attributes, don't mutate data object                                                  // 51
  var inNewDataContext = blazeView.parentView && blazeView.parentView.__isTemplateWith;                               // 52
  var data = inNewDataContext ? _.clone(this.data) : {};                                                              // 53
                                                                                                                      // 54
  // deprecate                                                                                                        // 55
  if (!data.view && famousViewName === "")                                                                            // 56
    data.view = 'SequentialLayout';                                                                                   // 57
  if (!data.view) data.view = famousViewName;                                                                         // 58
  else if (!famousViewName) {                                                                                         // 59
    famousViewName = data.view;                                                                                       // 60
    blazeView.viewName = 'Famous.' + famousViewName;                                                                  // 61
  }                                                                                                                   // 62
                                                                                                                      // 63
  // Deprecated 2014-08-17                                                                                            // 64
  if (data.size && _.isString(data.size) && data.size.substr(0,1) != '[')                                             // 65
    throw new Error('[famous-views] size="' + data.size + '" is deprecated, ' +                                       // 66
      'please use size="['+ data.size + ']" instead');                                                                // 67
                                                                                                                      // 68
  var onRender;                                                                                                       // 69
  if (data._onRender) {                                                                                               // 70
    onRender = getHelperFunc(blazeView, data._onRender);                                                              // 71
    if (!onRender)                                                                                                    // 72
      log.error("No such helper for _onRender: " + data._onRender);                                                   // 73
    delete data._onRender;                                                                                            // 74
  }                                                                                                                   // 75
                                                                                                                      // 76
  // See attribute parsing notes in README                                                                            // 77
  var options = handleOptions(data);                                                                                  // 78
                                                                                                                      // 79
  // These require special handling (but should still be moved elsewhere)                                             // 80
  if (options.translate) {                                                                                            // 81
    options.transform =                                                                                               // 82
      Transform.translate.apply(null, options.translate);                                                             // 83
    delete options.translate;                                                                                         // 84
  }                                                                                                                   // 85
  // any other transforms added here later must act on existing transform matrix                                      // 86
                                                                                                                      // 87
  var fview = blazeView.fview = new MeteorFamousView(blazeView, options);                                             // 88
                                                                                                                      // 89
  var pViewName = parentViewName(blazeView.parentView);                                                               // 90
  var pTplName = parentTemplateName(blazeView.parentView);                                                            // 91
  log.debug('New ' + famousViewName + " (#" + fview.id + ')' +                                                        // 92
    (data.template ?                                                                                                  // 93
      ', content from "' + data.template + '"' :                                                                      // 94
      ', content from inline block') +                                                                                // 95
    ' (parent: ' + pViewName +                                                                                        // 96
    (pViewName == pTplName ? '' : ', template: ' + pTplName) + ')');                                                  // 97
                                                                                                                      // 98
  /*                                                                                                                  // 99
  if (FView.viewOptions[data.view]                                                                                    // 100
      && FView.viewOptions[data.view].childUiHooks) {                                                                 // 101
    // if childUiHooks specified, store them here too                                                                 // 102
    fview.childUiHooks = FView.viewOptions[data.view].childUiHooks;                                                   // 103
  } else if (fview.parent.childUiHooks) {                                                                             // 104
    if (data.view == 'Surface') {                                                                                     // 105
      fview.uiHooks = fview.parent.childUiHooks;                                                                      // 106
    } else {                                                                                                          // 107
      // Track descedents                                                                                             // 108
    }                                                                                                                 // 109
    console.log('child ' + data.view);                                                                                // 110
  }                                                                                                                   // 111
  */                                                                                                                  // 112
                                                                                                                      // 113
  var view, node, notReallyAView=false /* TODO :) */;                                                                 // 114
                                                                                                                      // 115
  // currently modifiers come via 'view' arg, for now (and Surface)                                                   // 116
  if (data.view /* != 'Surface' */) {                                                                                 // 117
                                                                                                                      // 118
    var registerable = FView._registerables[data.view];                                                               // 119
    if (!registerable)                                                                                                // 120
      throw new Error('Wanted view/modifier "' + data.view + '" but it ' +                                            // 121
        'doesn\'t exists.  Try FView.registerView/Modifier("'+ data.view +                                            // 122
        '", etc)');                                                                                                   // 123
                                                                                                                      // 124
    fview['_' + registerable.type] = registerable;        // fview._view                                              // 125
    node = registerable.create.call(fview, options);      // fview.node                                               // 126
    fview[registerable.type] = node;                      // fview.view                                               // 127
                                                                                                                      // 128
    if (node.sequenceFrom) {                                                                                          // 129
      fview.sequence = new sequencer();                                                                               // 130
      node.sequenceFrom(fview.sequence._sequence);                                                                    // 131
    }                                                                                                                 // 132
                                                                                                                      // 133
  }                                                                                                                   // 134
                                                                                                                      // 135
  // If no modifier used, default to Modifier if origin/translate/etc used                                            // 136
  if (!data.modifier && !fview.modifier &&                                                                            // 137
      (data.origin || data.translate || data.transform ||                                                             // 138
      (data.size && !node.size)))                                                                                     // 139
    data.modifier = 'Modifier';                                                                                       // 140
                                                                                                                      // 141
  // Allow us to prepend a modifier in a single template call                                                         // 142
  if (data.modifier) {                                                                                                // 143
                                                                                                                      // 144
    fview._modifier = FView._registerables[data.modifier];                                                            // 145
    fview.modifier = fview._modifier.create.call(fview, options);                                                     // 146
                                                                                                                      // 147
    if (node) {                                                                                                       // 148
      fview.setNode(fview.modifier).add(node);                                                                        // 149
      fview.view = node;                                                                                              // 150
    } else                                                                                                            // 151
      fview.setNode(fview.modifier);                                                                                  // 152
                                                                                                                      // 153
    if (fview._modifier.postRender)                                                                                   // 154
      fview._modifier.postRender();                                                                                   // 155
                                                                                                                      // 156
  } else if (node) {                                                                                                  // 157
                                                                                                                      // 158
    fview.setNode(node);                                                                                              // 159
                                                                                                                      // 160
  }                                                                                                                   // 161
                                                                                                                      // 162
  // could do pipe=1 in template helper?                                                                              // 163
  if (fview.parent.pipeChildrenTo)                                                                                    // 164
    fview.pipeChildrenTo = fview.parent.pipeChildrenTo;                                                               // 165
                                                                                                                      // 166
  // think about what else this needs  XXX better name, documentation                                                 // 167
  if (fview._view && fview._view.famousCreatedPost)                                                                   // 168
    fview._view.famousCreatedPost.call(fview);                                                                        // 169
                                                                                                                      // 170
  // Render contents (and children)                                                                                   // 171
  var newBlazeView, template, scopedView;                                                                             // 172
  if (blazeView.templateContentBlock) {                                                                               // 173
    if (data.template)                                                                                                // 174
      throw new Error("A block helper {{#View}} cannot also specify template=X");                                     // 175
    // Called like {{#famous}}inlineContents{{/famous}}                                                               // 176
    template = blazeView.templateContentBlock;                                                                        // 177
  } else if (data.template) {                                                                                         // 178
    template = Template[data.template];                                                                               // 179
    if (!template)                                                                                                    // 180
      throw new Error('Famous called with template="' + data.template +                                               // 181
        '" but no such template exists');                                                                             // 182
    fview.template = template;                                                                                        // 183
  } else {                                                                                                            // 184
    // Called with inclusion operator but not template {{>famous}}                                                    // 185
    throw new Error("No template='' specified");                                                                      // 186
  }                                                                                                                   // 187
                                                                                                                      // 188
  // Avoid Blaze running rendered() before it's actually on the DOM                                                   // 189
  // Delete must happen before Blaze.render() called.                                                                 // 190
  if (data.view == 'Surface' && template.rendered) {                                                                  // 191
    template.onDocumentDom = template.rendered;                                                                       // 192
    delete template.rendered;                                                                                         // 193
  }                                                                                                                   // 194
                                                                                                                      // 195
  newBlazeView = template.constructView();                                                                            // 196
  setupEvents(fview, template);                                                                                       // 197
                                                                                                                      // 198
  if (inNewDataContext) {                                                                                             // 199
    scopedView = Blaze._TemplateWith(                                                                                 // 200
      data.data || Blaze._parentData(1) && Blaze._parentData(1, true) || {},                                          // 201
      function() { return newBlazeView; }                                                                             // 202
    );                                                                                                                // 203
  }                                                                                                                   // 204
                                                                                                                      // 205
  if (data.view === 'Surface') {                                                                                      // 206
                                                                                                                      // 207
    // in views/Surface.js; materialization happens via Blaze.render()                                                // 208
    fview.surfaceBlazeView = newBlazeView;                                                                            // 209
    templateSurface(fview, scopedView || newBlazeView, blazeView, options,                                            // 210
      data.template ||                                                                                                // 211
        parentTemplateName(blazeView.parentView).substr(9) + '_inline');                                              // 212
                                                                                                                      // 213
  } else {                                                                                                            // 214
                                                                                                                      // 215
    /*                                                                                                                // 216
     * It looks like this may be unavoidable.  Rendered callbacks down                                                // 217
     * the tree don't fire correctly if we decouple from the DOM, seems                                               // 218
     * various Tracker code relies on it.                                                                             // 219
     */                                                                                                               // 220
    var unusedDiv = document.createElement('DIV');                                                                    // 221
    Blaze.render(scopedView || newBlazeView, unusedDiv, null, blazeView);                                             // 222
                                                                                                                      // 223
    /*                                                                                                                // 224
     * As per above, below doesn't work properly.  But leaving it around                                              // 225
     * in case we find it's salvageable                                                                               // 226
     */                                                                                                               // 227
                                                                                                                      // 228
    //materializeView(scopedView || newBlazeView, blazeView);                                                         // 229
    /*                                                                                                                // 230
     * Currently, we run this before we're added to the Render Tree, to                                               // 231
     * allow the rendered() callback to move us off screen before entrance,                                           // 232
     * etc.  In future, might be better to specify original position as                                               // 233
     * attributes, and then just do the animation in callback after we're                                             // 234
     * added to the tree                                                                                              // 235
     */                                                                                                               // 236
    //if (template.rendered) {                                                                                        // 237
    //  template.rendered.call(newBlazeView._templateInstance);                                                       // 238
    //}                                                                                                               // 239
  }                                                                                                                   // 240
                                                                                                                      // 241
  // XXX name, documentation                                                                                          // 242
  // after render, templateSurface, etc                                                                               // 243
  if (fview._view && fview._view.postRender)                                                                          // 244
    fview._view.postRender.call(fview);                                                                               // 245
                                                                                                                      // 246
  /*                                                                                                                  // 247
   * This is the final step where the fview is added to Famous Render Tree                                            // 248
   * By deferring the actual add we can prevent flicker from various causes                                           // 249
   */                                                                                                                 // 250
                                                                                                                      // 251
  var parent = fview.parent;                                                                                          // 252
  Engine.defer(function() {                                                                                           // 253
    /*                                                                                                                // 254
     * Blaze allows for situations where templates may be created and destroyed,                                      // 255
     * without being rendered.  We should accomodate this better by not                                               // 256
     * rendering unnecessarily, but in the meantime, let's make sure at least                                         // 257
     * that we don't crash.  TODO                                                                                     // 258
     *                                                                                                                // 259
     * E.g. subscription + cursor with sort+limit                                                                     // 260
     */                                                                                                               // 261
    if (fview.isDestroyed)                                                                                            // 262
      return;                                                                                                         // 263
                                                                                                                      // 264
    if (parent._view && parent._view.add)                                                                             // 265
      // views can explicitly handle how their children should be added                                               // 266
      parent._view.add.call(parent, fview, options);                                                                  // 267
    else if (parent.sequence)                                                                                         // 268
      // 'sequence' can be an array, sequencer or childSequencer, it doesn't matter                                   // 269
      parent.sequence.push(fview);                                                                                    // 270
    else if (!parent.node || (parent.node._object && parent.node._object.isDestroyed))                                // 271
      // compView->compView.  long part above is temp hack for template rerender #2010                                // 272
      parent.setNode(fview);                                                                                          // 273
    else                                                                                                              // 274
      // default case, just use the add method                                                                        // 275
      parent.node.add(fview);                                                                                         // 276
                                                                                                                      // 277
    // XXX another undocumented... consolidate names and document                                                     // 278
    // e.g. famousCreatedPost; and is modifier.postRender documented?                                                 // 279
    if (fview._view && fview._view.onRenderTree)                                                                      // 280
      fview._view.onRenderTree.call(fview);                                                                           // 281
                                                                                                                      // 282
    if (onRender) {                                                                                                   // 283
      onRender.call(fview.blazeView);                                                                                 // 284
    }                                                                                                                 // 285
  });                                                                                                                 // 286
}                                                                                                                     // 287
                                                                                                                      // 288
/*                                                                                                                    // 289
 * Here we emulate the flow of Blaze._materializeView but avoid all                                                   // 290
 * DOM stuff, since we don't need it                                                                                  // 291
 */                                                                                                                   // 292
var materializeView = function(view, parentView) {                                                                    // 293
  Blaze._createView(view, parentView);                                                                                // 294
                                                                                                                      // 295
  var lastHtmljs;                                                                                                     // 296
  Tracker.nonreactive(function() {                                                                                    // 297
    view.autorun(function doFamousRender(c) {                                                                         // 298
      view.renderCount++;                                                                                             // 299
      view._isInRender = true;                                                                                        // 300
      var htmljs = view._render(); // <-- only place invalidation happens                                             // 301
      view._isInRender = false;                                                                                       // 302
                                                                                                                      // 303
      Tracker.nonreactive(function doFamousMaterialize() {                                                            // 304
        var materializer = new Blaze._DOMMaterializer({parentView: view});                                            // 305
        materializer.visit(htmljs, []);                                                                               // 306
        if (c.firstRun || !Blaze._isContentEqual(lastHtmljs, htmljs)) {                                               // 307
          if (c.firstRun)                                                                                             // 308
            view.isRendered = true;                                                                                   // 309
          // handle this elsewhere                                                                                    // 310
          // Blaze._fireCallbacks(view, 'rendered');                                                                  // 311
        }                                                                                                             // 312
      });                                                                                                             // 313
      lastHtmljs = htmljs;                                                                                            // 314
    });                                                                                                               // 315
  });                                                                                                                 // 316
};                                                                                                                    // 317
                                                                                                                      // 318
/*                                                                                                                    // 319
 * This is called by Blaze when the View/Template is destroyed,                                                       // 320
 * e.g. {{#if 0}}{{#Scrollview}}{{/if}}.  When this happens we need to:                                               // 321
 *                                                                                                                    // 322
 * 1) Destroy children (Blaze won't do it since it's not in the DOM),                                                 // 323
 *    and any "eaches" that may have been added from a famousEach.                                                    // 324
 * 2) Call fview.destroy() which handles cleanup w.r.t. famous,                                                       // 325
 *    which lives in meteorFamousView.js.                                                                             // 326
 *                                                                                                                    // 327
 * It's possible we want to have the "template" destroyed but not the                                                 // 328
 * fview in the render tree to do a graceful exit animation, etc.                                                     // 329
 */                                                                                                                   // 330
function famousDestroyed() {                                                                                          // 331
  this.view.fview.destroy(true);                                                                                      // 332
}                                                                                                                     // 333
                                                                                                                      // 334
// Keep this at the bottom; Firefox doesn't do function hoisting                                                      // 335
                                                                                                                      // 336
FView.famousView = new Template(                                                                                      // 337
  'famous',           // viewName: "famous"                                                                           // 338
  function() {        // Blaze.View "renderFunc"                                                                      // 339
    var blazeView = this;                                                                                             // 340
    var data = Blaze.getData(blazeView);                                                                              // 341
    var tpl = blazeView._templateInstance;                                                                            // 342
    var fview = blazeView.fview;                                                                                      // 343
                                                                                                                      // 344
    var changed = {};                                                                                                 // 345
    var orig = {};                                                                                                    // 346
    for (var key in data) {                                                                                           // 347
      var value = data[key];                                                                                          // 348
      if (typeof value === "string")                                                                                  // 349
        value = optionString(value, key, blazeView);                                                                  // 350
      if (value === '__FVIEW::SKIP__')                                                                                // 351
        continue;                                                                                                     // 352
      if (!EJSON.equals(value, tpl.data[key]) || !blazeView.hasRendered) {                                            // 353
        orig[key] = blazeView.hasRendered ? tpl.data[key] : null;                                                     // 354
        changed[key] = tpl.data[key] = value;                                                                         // 355
      }                                                                                                               // 356
    }                                                                                                                 // 357
                                                                                                                      // 358
    /*                                                                                                                // 359
     * Think about:                                                                                                   // 360
     *                                                                                                                // 361
     * 1) Should the function get the old value or all old data too?                                                  // 362
     * 2) Should the function get all the new data, but translated?                                                   // 363
     *                                                                                                                // 364
     */                                                                                                               // 365
                                                                                                                      // 366
    _.each(['modifier', 'view'], function(node) {                                                                     // 367
                                                                                                                      // 368
      // If the fview has a modifier or view                                                                          // 369
      var what = '_' + node;                                                                                          // 370
      if (fview[what]) {                                                                                              // 371
        if (fview[what].attrUpdate) {                                                                                 // 372
          // If that mod/view wants to finely handle reactive updates                                                 // 373
          for (var key in changed)                                                                                    // 374
            fview[what].attrUpdate.call(fview,                                                                        // 375
              key, changed[key], orig[key], tpl.data, !blazeView.hasRendered);                                        // 376
        } else if (fview[node].setOptions && blazeView.hasRendered) {                                                 // 377
          // Otherwise if it has a setOptions                                                                         // 378
          fview[node].setOptions(tpl.data);                                                                           // 379
        }                                                                                                             // 380
      }                                                                                                               // 381
                                                                                                                      // 382
    });                                                                                                               // 383
                                                                                                                      // 384
//    console.log(view);                                                                                              // 385
    blazeView.hasRendered = true;                                                                                     // 386
    return null;                                                                                                      // 387
  }                                                                                                                   // 388
);                                                                                                                    // 389
                                                                                                                      // 390
Blaze.registerHelper('famous', FView.famousView);                                                                     // 391
FView.famousView.created = famousCreated;                                                                             // 392
FView.famousView.destroyed = famousDestroyed;                                                                         // 393
                                                                                                                      // 394
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/famousEach.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function famousEachRender(eachView, template, argFunc) {                                                              // 1
  var fview = eachView.fview;                                                                                         // 2
  var sequence = fview.sequence;            // fviews for Famous Render Tree                                          // 3
  var children = fview.children = [];       // each contentBlock instance                                             // 4
                                                                                                                      // 5
  // For Blaze.currentView (see blaze/builtins.js#each)                                                               // 6
  eachView.argVar = new Blaze.ReactiveVar();                                                                          // 7
  eachView.autorun(function () {                                                                                      // 8
    eachView.argVar.set(argFunc());                                                                                   // 9
  }, eachView.parentView);                                                                                            // 10
                                                                                                                      // 11
  // used for view overrides per event callback below                                                                 // 12
  var viewParent = fview.parent;                                                                                      // 13
                                                                                                                      // 14
  eachView.stopHandle = ObserveSequence.observe(function () {                                                         // 15
      return eachView.argVar.get();                                                                                   // 16
    }, {                                                                                                              // 17
      addedAt: function (id, item, index) {                                                                           // 18
        var override = (viewParent._view && viewParent._view.addedAt)                                                 // 19
          || viewParent.addedAt;                                                                                      // 20
        var _super = function() {                                                                                     // 21
            var newItemView = Blaze.With(item, function() {                                                           // 22
              return template.constructView();                                                                        // 23
            });                                                                                                       // 24
                                                                                                                      // 25
            /*                                                                                                        // 26
             * This is the repeated block inside famousEach, but not the actual node/                                 // 27
             * view/surface that gets created on render as this block's children.                                     // 28
             * We create a pseudo-fview for this                                                                      // 29
             */                                                                                                       // 30
            newItemView.fview = new MeteorFamousView(null, {}, true /* noAdd */);                                     // 31
            newItemView.fview.kind = 'famousEachBlock';                                                               // 32
            newItemView.fview.parent = eachView.fview;                                                                // 33
            log.debug("New famousEachBlock (#" + newItemView.fview.id + ')' +                                         // 34
              ' in famousEach (#' + newItemView.fview.parent.id + ")");                                               // 35
                                                                                                                      // 36
            if (fview.parent.pipeChildrenTo)                                                                          // 37
              newItemView.fview.pipeChildrenTo =                                                                      // 38
                fview.parent.pipeChildrenTo;                                                                          // 39
                                                                                                                      // 40
            newItemView.fview.sequence = sequence.child(index);                                                       // 41
            children.splice(index, 0, { blazeView: newItemView });                                                    // 42
                                                                                                                      // 43
            var unusedDiv = document.createElement('div');                                                            // 44
            Blaze.render(newItemView, unusedDiv, eachView);                                                           // 45
                                                                                                                      // 46
            // Splice to run first and make sure destroy() is called                                                  // 47
            // before childen are removed / destroyed by Blaze.                                                       // 48
            newItemView._callbacks.destroyed.splice(0, 0, function() {                                                // 49
              this.fview.destroy(true /* templateDestroy */);                                                         // 50
            });                                                                                                       // 51
                                                                                                                      // 52
            newItemView.fview.waitForNoChildrenBeforeDestroy = true;                                                  // 53
            newItemView.fview.on('cleanup', function() {                                                              // 54
              Engine.defer(function() {                                                                               // 55
                newItemView.fview.sequence.removeFromParent();                                                        // 56
              });                                                                                                     // 57
            });                                                                                                       // 58
                                                                                                                      // 59
            //Blaze.materializeView(newItemView, eachView);                                                           // 60
            //runRenderedCallback(newItemView);  // now called by Blaze.render                                        // 61
        };                                                                                                            // 62
                                                                                                                      // 63
        Engine.defer(function() {                                                                                     // 64
          if (override)                                                                                               // 65
              override.call(viewParent, id, item, index, _super, eachView);                                           // 66
          else                                                                                                        // 67
            _super();                                                                                                 // 68
        });                                                                                                           // 69
      },                                                                                                              // 70
      removedAt: function (id, item, index) {                                                                         // 71
        var override = (viewParent._view && viewParent._view.removedAt)                                               // 72
          || viewParent.removedAt;                                                                                    // 73
        var _super = function() {                                                                                     // 74
          Blaze.remove(children[index].blazeView);                                                                    // 75
          children.splice(index, 1);                                                                                  // 76
        };                                                                                                            // 77
                                                                                                                      // 78
        Engine.defer(function() {                                                                                     // 79
          if (override)                                                                                               // 80
            override.call(viewParent, id, item, index, _super, eachView);                                             // 81
          else                                                                                                        // 82
            _super();                                                                                                 // 83
        });                                                                                                           // 84
      },                                                                                                              // 85
      changedAt: function (id, newItem, oldItem, index) {                                                             // 86
        var override = (viewParent._view && viewParent._view.changedAt)                                               // 87
          || viewParent.changedAt;                                                                                    // 88
        var _super = function() {                                                                                     // 89
          children[index].blazeView.dataVar.set(newItem);                                                             // 90
        };                                                                                                            // 91
                                                                                                                      // 92
        Engine.defer(function() {                                                                                     // 93
          if (override) override.call(viewParent,                                                                     // 94
            id, newItem, oldItem, index, _super, eachView);                                                           // 95
          else                                                                                                        // 96
            _super();                                                                                                 // 97
        });                                                                                                           // 98
      },                                                                                                              // 99
      movedTo: function (id, doc, fromIndex, toIndex) {                                                               // 100
        var override = (viewParent._view && viewParent._view.movedTo)                                                 // 101
          || viewParent.movedTo;                                                                                      // 102
        var _super = function() {                                                                                     // 103
          var item = sequence.splice(fromIndex, 1)[0];                                                                // 104
          sequence.splice(toIndex, 0, item);                                                                          // 105
                                                                                                                      // 106
          item = children.splice(fromIndex, 1)[0];                                                                    // 107
          children.splice(toIndex, 0, item);                                                                          // 108
        };                                                                                                            // 109
                                                                                                                      // 110
        Engine.defer(function () {                                                                                    // 111
          if (override) override.call(viewParent,                                                                     // 112
            id, doc, fromIndex, toIndex, _super, eachView);                                                           // 113
          else                                                                                                        // 114
            _super();                                                                                                 // 115
        });                                                                                                           // 116
      }                                                                                                               // 117
    });                                                                                                               // 118
}                                                                                                                     // 119
                                                                                                                      // 120
function famousEachCreated() {                                                                                        // 121
  var blazeView = this.view;                                                                                          // 122
  var fview = blazeView.fview = new MeteorFamousView(blazeView, {});                                                  // 123
  fview.kind = 'famousEach';                                                                                          // 124
                                                                                                                      // 125
  log.debug('New famousEach' + " (#" + fview.id + ')' +                                                               // 126
    ' (parent: ' + parentViewName(blazeView.parentView) + ',' +                                                       // 127
    ' template: ' + parentTemplateName(blazeView.parentView) + ')');                                                  // 128
                                                                                                                      // 129
                                                                                                                      // 130
  // Maintain order with other deferred operations                                                                    // 131
  Engine.defer(function() {                                                                                           // 132
    fview.sequence = fview.parent.sequence.child();                                                                   // 133
                                                                                                                      // 134
    // Contents of {{#famousEach}}block{{/famousEach}}                                                                // 135
    if (blazeView.templateContentBlock)                                                                               // 136
      famousEachRender(blazeView, blazeView.templateContentBlock, function() {                                        // 137
        return Blaze.getData(blazeView);                                                                              // 138
      });                                                                                                             // 139
  });                                                                                                                 // 140
}                                                                                                                     // 141
                                                                                                                      // 142
function famousEachDestroyed() {                                                                                      // 143
  this.view.fview.destroy(true);                                                                                      // 144
}                                                                                                                     // 145
                                                                                                                      // 146
// Keep this at the bottom; Firefox doesn't do function hoisting                                                      // 147
                                                                                                                      // 148
FView.famousEachView = new Template(                                                                                  // 149
  'famousEach',       // viewName: "famousEach"                                                                       // 150
  function() {        // Blaze.View "renderFunc"                                                                      // 151
    var view = this;  // Blaze.View, viewName "famousEach"                                                            // 152
    // console.log(view);                                                                                             // 153
    return null;                                                                                                      // 154
  }                                                                                                                   // 155
);                                                                                                                    // 156
                                                                                                                      // 157
Blaze.registerHelper('famousEach', FView.famousEachView);                                                             // 158
FView.famousEachView.created = famousEachCreated;                                                                     // 159
FView.famousEachView.destroyed = famousEachDestroyed;                                                                 // 160
                                                                                                                      // 161
/*                                                                                                                    // 162
FView.Each = function (argFunc, contentFunc, elseFunc) {                                                              // 163
  var eachView = Blaze.View('Feach', function() {                                                                     // 164
    return null;                                                                                                      // 165
  });                                                                                                                 // 166
                                                                                                                      // 167
  eachView.onCreated(function() {                                                                                     // 168
    // For Blaze.currentView (see blaze/builtins.js#each)                                                             // 169
    eachView.autorun(function () {                                                                                    // 170
      eachView.argVar.set(argFunc());                                                                                 // 171
    }, eachView.parentView);                                                                                          // 172
                                                                                                                      // 173
                                                                                                                      // 174
  });                                                                                                                 // 175
                                                                                                                      // 176
  return eachView;                                                                                                    // 177
}                                                                                                                     // 178
Blaze.registerHelper('famousEach', FView.Each);                                                                       // 179
*/                                                                                                                    // 180
                                                                                                                      // 181
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/famousIf.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
 * In brief, on Create we setup a child sequence to serve as a placeholder for                                        // 2
 * any children (so that order is retained).  On reactive render, we destroy any                                      // 3
 * existing children and render the contentBlock / elseBlock (as our children).                                       // 4
 * On destroy, we cleanup and remove (TODO) child sequence placeholder.                                               // 5
 */                                                                                                                   // 6
                                                                                                                      // 7
/* Other thoughts:                                                                                                    // 8
 * - Currently this is only used to retain order in a sequence                                                        // 9
 * - If used in a surface we could force rerun of autoHeight, etc?                                                    // 10
 */                                                                                                                   // 11
                                                                                                                      // 12
function famousIfCreated() {                                                                                          // 13
  var blazeView = this.view;                                                                                          // 14
  var fview = blazeView.fview = new MeteorFamousView(blazeView, {});                                                  // 15
                                                                                                                      // 16
  log.debug('New famousIf' + " (#" + fview.id + ')' +                                                                 // 17
    ' (parent: ' + parentViewName(blazeView.parentView) + ',' +                                                       // 18
    ' template: ' + parentTemplateName(blazeView.parentView) + ')');                                                  // 19
                                                                                                                      // 20
  fview.kind = 'famousIf';                                                                                            // 21
                                                                                                                      // 22
  // Maintain ordering with other deferred operations                                                                 // 23
  Engine.defer(function() {                                                                                           // 24
    if (fview.parent.sequence) {                                                                                      // 25
      fview.sequence = fview.parent.sequence.child();                                                                 // 26
    } else {                                                                                                          // 27
      fview.setNode(null);                                                                                            // 28
      fview.parent.node.add(fview);                                                                                   // 29
    }                                                                                                                 // 30
  });                                                                                                                 // 31
}                                                                                                                     // 32
                                                                                                                      // 33
function cleanupChildren(blazeView) {                                                                                 // 34
  var children = blazeView.fview.children;                                                                            // 35
  for (var i=0; i < children.length; i++)                                                                             // 36
    Blaze.remove(children[i].blazeView);                                                                              // 37
                                                                                                                      // 38
  var fview = blazeView.fview;                                                                                        // 39
  if (fview.sequence) {                                                                                               // 40
    fview.setNode(null);                                                                                              // 41
    fview.children = [];                                                                                              // 42
  }                                                                                                                   // 43
}                                                                                                                     // 44
                                                                                                                      // 45
function famousIfDestroyed() {                                                                                        // 46
  this.view.fview.destroy(true);                                                                                      // 47
}                                                                                                                     // 48
                                                                                                                      // 49
FView.famousIfView = new Template('famousIf', function() {                                                            // 50
  var blazeView = this;                                                                                               // 51
  var condition = Blaze.getData(blazeView);                                                                           // 52
                                                                                                                      // 53
  log.debug('famousIf' + " (#" + blazeView.fview.id + ')' +                                                           // 54
    ' is now ' + !!condition +                                                                                        // 55
    ' (parent: ' + parentViewName(blazeView.parentView) + ',' +                                                       // 56
    ' template: ' + parentTemplateName(blazeView.parentView) + ')');                                                  // 57
                                                                                                                      // 58
  var dataContext = null /* this.data.data */ ||                                                                      // 59
    Blaze._parentData(1) && Blaze._parentData(1, true) ||                                                             // 60
    Blaze._parentData(0) && Blaze._parentData(0, true) ||                                                             // 61
    {};                                                                                                               // 62
                                                                                                                      // 63
  var unusedDiv = document.createElement('div');                                                                      // 64
  var template = blazeView.templateContentBlock;                                                                      // 65
                                                                                                                      // 66
  // Maintain order with other deferred operations                                                                    // 67
  Engine.defer(function() {                                                                                           // 68
    // Any time condition changes, remove all old children                                                            // 69
    cleanupChildren(blazeView);                                                                                       // 70
                                                                                                                      // 71
    var template = condition ?                                                                                        // 72
      blazeView.templateContentBlock : blazeView.templateElseBlock;                                                   // 73
                                                                                                                      // 74
    if (template)                                                                                                     // 75
      Blaze.renderWithData(template, dataContext, unusedDiv, null, blazeView);                                        // 76
  });                                                                                                                 // 77
});                                                                                                                   // 78
                                                                                                                      // 79
Blaze.registerHelper('famousIf', FView.famousIfView);                                                                 // 80
FView.famousIfView.created = famousIfCreated;                                                                         // 81
FView.famousIfView.destroyed = famousIfDestroyed;                                                                     // 82
                                                                                                                      // 83
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/famousContext.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Flag for inserting CSS rules only if at least one context is declared.                                             // 1
var isFamousContextDeclared = false;                                                                                  // 2
                                                                                                                      // 3
var famousContext = new Template('famousContext', function () {                                                       // 4
  // Only inject CSS rules if a famousContext is created                                                              // 5
  if (!isFamousContextDeclared) {                                                                                     // 6
    var css = new CSSC();                                                                                             // 7
    css.add('div.fview-context', {                                                                                    // 8
      webkitTransformStyle: 'preserve-3d',                                                                            // 9
      transformStyle: 'preserve-3d',                                                                                  // 10
      webkitBackfaceVisibility: 'visible',                                                                            // 11
      backfaceVisibility: 'visible',                                                                                  // 12
      pointerEvents: 'none',                                                                                          // 13
      position: 'relative',                                                                                           // 14
      overflow: 'hidden',                                                                                             // 15
      width: '100%',                                                                                                  // 16
      height: '100%'                                                                                                  // 17
    });                                                                                                               // 18
  }                                                                                                                   // 19
  // Ensure that no additional CSS rules for famousContext will get added.                                            // 20
  isFamousContextDeclared = true;                                                                                     // 21
                                                                                                                      // 22
  // don't re-use parent's data/attributes, don't mutate data object                                                  // 23
  var inNewDataContext = this.parentView && this.parentView.__isTemplateWith;                                         // 24
  var data = inNewDataContext ? _.clone(this.templateInstance().data) : {};                                           // 25
                                                                                                                      // 26
  var fview = this.fview = new MeteorFamousView(this, data, true /*noAdd*/ );                                         // 27
  fview.children = [];                                                                                                // 28
                                                                                                                      // 29
  var pViewName = parentViewName(this.parentView);                                                                    // 30
  var pTplName = parentTemplateName(this.parentView);                                                                 // 31
  log.debug('New famousContext (#' + fview.id + ')' +                                                                 // 32
    (data.template ?                                                                                                  // 33
      ', content from "' + data.template + '"' :                                                                      // 34
      ', content from inline block') +                                                                                // 35
    ' (parent: ' + pViewName +                                                                                        // 36
    (pViewName == pTplName ? '' : ', template: ' + pTplName) + ')');                                                  // 37
                                                                                                                      // 38
  var divOptions = {};                                                                                                // 39
  if (!data.useParent) {                                                                                              // 40
    if (data.size) {                                                                                                  // 41
      data.size = optionString(data.size, 'size');                                                                    // 42
      for (var i = 0; i < 2; i++) {                                                                                   // 43
        var size = data.size[i];                                                                                      // 44
        if (size === true)                                                                                            // 45
          throw new Error("Can't use `true` size on famousContext");                                                  // 46
        else if (!size)                                                                                               // 47
          data.size[i] = '100%';                                                                                      // 48
        else                                                                                                          // 49
          data.size[i] += 'px';                                                                                       // 50
      }                                                                                                               // 51
      if (!data.style)                                                                                                // 52
        data.style = '';                                                                                              // 53
      data.style = "width: " + data.size[0];                                                                          // 54
      data.style = "height: " + data.size[1];                                                                         // 55
    }                                                                                                                 // 56
                                                                                                                      // 57
    if (typeof data.style === 'undefined' && data.id !== 'mainCtx')                                                   // 58
      log.debug('^__ no style="" specified; you probably want to specify a ' +                                        // 59
        'size, unless you\'re doing it via CSS on .fview-context');                                                   // 60
                                                                                                                      // 61
    divOptions.class = 'fview-context';                                                                               // 62
    if (data.id) divOptions.id = data.id;                                                                             // 63
    if (data.style) divOptions.style = data.style;                                                                    // 64
    if (data.class) divOptions.class += ' ' + data.class;                                                             // 65
                                                                                                                      // 66
    if (data.id === "mainCtx")                                                                                        // 67
      FView.mainCtxFView = fview;                                                                                     // 68
  }                                                                                                                   // 69
                                                                                                                      // 70
  var addQueue = [];                                                                                                  // 71
  fview.node = fview.context = {                                                                                      // 72
    add: function (node) {                                                                                            // 73
      addQueue.push(node);                                                                                            // 74
    }                                                                                                                 // 75
  };                                                                                                                  // 76
  if (data.id === "mainCtx")                                                                                          // 77
    FView.mainCtx = fview.context;                                                                                    // 78
                                                                                                                      // 79
  this.onViewReady(function () {                                                                                      // 80
    var container = data.useParent ? this._domrange.parentElement : this._domrange.members[0];                        // 81
    fview.node = fview.context = Engine.createContext(container);                                                     // 82
    if (data.id === "mainCtx")                                                                                        // 83
      FView.mainCtx = fview.context;                                                                                  // 84
                                                                                                                      // 85
    for (var i = 0; i < addQueue.length; i++)                                                                         // 86
      fview.node.add(addQueue[i]);                                                                                    // 87
    addQueue = [];                                                                                                    // 88
                                                                                                                      // 89
    if (data.id === "mainCtx" || (container.parentNode === document.body &&                                           // 90
        document.body.childElementCount == 1)) {                                                                      // 91
      initializeFamous();                                                                                             // 92
      $(container).removeClass('fview-context').addClass('famous-container');                                         // 93
                                                                                                                      // 94
      // make sure browser or device can use the Event constructor                                                    // 95
      try {                                                                                                           // 96
          window.dispatchEvent(new Event('resize'));                                                                  // 97
      } catch (e) {                                                                                                   // 98
          var newEvent = document.createEvent('Event');                                                               // 99
          newEvent.initEvent('resize', false, false);                                                                 // 100
          window.dispatchEvent(newEvent);                                                                             // 101
      }                                                                                                               // 102
                                                                                                                      // 103
    }                                                                                                                 // 104
                                                                                                                      // 105
    var template = data.template ? Template[data.template] : this.templateContentBlock;                               // 106
    if (!template)                                                                                                    // 107
      return;                                                                                                         // 108
                                                                                                                      // 109
    if (inNewDataContext) {                                                                                           // 110
      var dataContext = data.data ||                                                                                  // 111
        Blaze._parentData(1) && Blaze._parentData(1, true) || {};                                                     // 112
      Blaze.renderWithData(template, dataContext, container, null, this);                                             // 113
    } else                                                                                                            // 114
      Blaze.render(template, container, null, this);                                                                  // 115
  });                                                                                                                 // 116
                                                                                                                      // 117
  // what else do we need here?  some stuff is automatic because of div/DOM                                           // 118
  this.onViewDestroyed(function() {                                                                                   // 119
    if (fview === FView.mainCtxFView)                                                                                 // 120
      FView.mainCtxFView = null;                                                                                      // 121
      FView.mainCtx = undefined;                                                                                      // 122
  });                                                                                                                 // 123
                                                                                                                      // 124
  if (data.useParent)                                                                                                 // 125
    return null;                                                                                                      // 126
  else                                                                                                                // 127
    return HTML.DIV(divOptions);                                                                                      // 128
});                                                                                                                   // 129
                                                                                                                      // 130
// Not usually necessary but let's make super sure we're ready :)                                                     // 131
                                                                                                                      // 132
famousContextWrapper = new Template('famousContextWrapper', function() {                                              // 133
  if (FView.ready()) {                                                                                                // 134
    var self = this;                                                                                                  // 135
    var view = famousContext.constructView();                                                                         // 136
    view.templateContentBlock = this.templateContentBlock;                                                            // 137
                                                                                                                      // 138
    var withView = Blaze.With(                                                                                        // 139
      function() { return Blaze.getData(self) || {}; },                                                               // 140
      function() { return view; }                                                                                     // 141
    );                                                                                                                // 142
    withView.__isTemplateWith = true;                                                                                 // 143
    return withView;                                                                                                  // 144
  } else                                                                                                              // 145
    return null;                                                                                                      // 146
});                                                                                                                   // 147
                                                                                                                      // 148
FView.ready(function() {                                                                                              // 149
  delete famousContextWrapper;                                                                                        // 150
  delete Blaze._globalHelpers.famousContext;                                                                          // 151
  delete Blaze._globalHelpers.FamousContext;                                                                          // 152
  Blaze.Template.registerHelper('famousContext', famousContext);                                                      // 153
  Blaze.Template.registerHelper('FamousContext', famousContext); // alias                                             // 154
});                                                                                                                   // 155
                                                                                                                      // 156
Blaze.Template.registerHelper('famousContext', famousContextWrapper);                                                 // 157
Blaze.Template.registerHelper('FamousContext', famousContextWrapper); // alias                                        // 158
FView.famousContext = famousContext;                                                                                  // 159
                                                                                                                      // 160
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/modifiers.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView._registerables = {};  // used in views.js too                                                                   // 1
                                                                                                                      // 2
function defaultCreate(_options) {                                                                                    // 3
  // Don't mutate original _options.  Note: shallow copy.                                                             // 4
  var i, options = Object.create(_options);                                                                           // 5
                                                                                                                      // 6
  // Default modifier can't handle "true" size                                                                        // 7
  // Be careful not to mutate the original size ARRAY which might already be used elsewhere                           // 8
  if (_options.size) {                                                                                                // 9
    options.size = [];                                                                                                // 10
    for (i=0; i < _options.size.length; i++)                                                                          // 11
      options.size[i] = _options.size[i] === true ? undefined : _options.size[i];                                     // 12
  }                                                                                                                   // 13
                                                                                                                      // 14
  return new this._modifier.constructor(options);                                                                     // 15
}                                                                                                                     // 16
                                                                                                                      // 17
/* Available in JS via `FView._registerables.Modifier` and in templates via                                           // 18
  `{{#famous modifier='Scrollview'}}` or just `{{#Modifier}}`. */                                                     // 19
FView.registerModifier = function(name, modifier, options) {                                                          // 20
  if (FView._registerables[name])                                                                                     // 21
    return;                                                                                                           // 22
                                                                                                                      // 23
  FView._registerables[name] = _.extend(                                                                              // 24
    { create: defaultCreate },                                                                                        // 25
    options,                                                                                                          // 26
    { name: name, constructor: modifier, type: 'modifier' }                                                           // 27
  );                                                                                                                  // 28
                                                                                                                      // 29
  var fview = FView.famousView;                                                                                       // 30
  var tpl = new Template('Famous.' + name, fview.renderFunction);                                                     // 31
  tpl.created = fview.created;                                                                                        // 32
  tpl.destroyed = fview.destroyed;                                                                                    // 33
  Blaze.registerHelper(name, tpl);                                                                                    // 34
};                                                                                                                    // 35
                                                                                                                      // 36
FView.ready(function(require) {                                                                                       // 37
  var Modifier = famous.core.Modifier;                                                                                // 38
                                                                                                                      // 39
  /*                                                                                                                  // 40
   * "Modifier" (the base class) should not be used for dynamic                                                       // 41
   * updates (as per the docs deprecating setXXX methods).  As                                                        // 42
   * such, we set up everything in `create` vs an `attrUpdate`                                                        // 43
   * function.                                                                                                        // 44
   */                                                                                                                 // 45
  FView.registerModifier('Modifier', Modifier);                                                                       // 46
                                                                                                                      // 47
  /* simple short cuts below */                                                                                       // 48
                                                                                                                      // 49
  FView.registerModifier('identity', null, {                                                                          // 50
    create: function(options) {                                                                                       // 51
      return new Modifier(_.extend({                                                                                  // 52
        transform : Transform.identity                                                                                // 53
      }, options));                                                                                                   // 54
    }                                                                                                                 // 55
  });                                                                                                                 // 56
                                                                                                                      // 57
  FView.registerModifier('inFront', null, {                                                                           // 58
    create: function(options) {                                                                                       // 59
      return new Modifier(_.extend({                                                                                  // 60
        transform : Transform.inFront                                                                                 // 61
      }, options));                                                                                                   // 62
    }                                                                                                                 // 63
  });                                                                                                                 // 64
                                                                                                                      // 65
  FView.registerModifier('behind', null, {                                                                            // 66
    create: function(options) {                                                                                       // 67
      return new Modifier(_.extend({                                                                                  // 68
        transform : Transform.behind                                                                                  // 69
      }, options));                                                                                                   // 70
    }                                                                                                                 // 71
  });                                                                                                                 // 72
                                                                                                                      // 73
});                                                                                                                   // 74
                                                                                                                      // 75
/*                                                                                                                    // 76
FView.modifiers.pageTransition = function(blazeView, options) {                                                       // 77
  this.blazeView = blazeView;                                                                                         // 78
  this.famous = new Modifier({                                                                                        // 79
    transform : Transform.identity,                                                                                   // 80
    opacity   : 1,                                                                                                    // 81
    origin    : [-0.5, -0.5],                                                                                         // 82
    size      : [100, 100]                                                                                            // 83
  });                                                                                                                 // 84
};                                                                                                                    // 85
                                                                                                                      // 86
FView.modifiers.pageTransition.prototype.postRender = function() {                                                    // 87
  this.famous.setOrigin([0,0], {duration : 5000});                                                                    // 88
};                                                                                                                    // 89
*/                                                                                                                    // 90
                                                                                                                      // 91
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* Note, `modifiers.js` is called first, so FView.registerables exists */                                             // 1
                                                                                                                      // 2
/* Available in JS via `FView._registerables.Scrollview` and in templates via                                         // 3
  `{{#famous view='Scrollview'}}` or just `{{#Scrollview}}`. */                                                       // 4
FView.registerView = function(name, famousView, options) {                                                            // 5
  if (FView._registerables[name])                                                                                     // 6
    return;                                                                                                           // 7
                                                                                                                      // 8
  /*                                                                                                                  // 9
  var tpl = _.clone(FView.famousView);                                                                                // 10
  tpl.viewName = 'Famous.' + name;                                                                                    // 11
  console.log(tpl);                                                                                                   // 12
  */                                                                                                                  // 13
                                                                                                                      // 14
  var fview = FView.famousView;                                                                                       // 15
  var tpl = new Template('Famous.' + name, fview.renderFunction);                                                     // 16
  tpl.created = fview.created;                                                                                        // 17
  tpl.destroyed = fview.destroyed;                                                                                    // 18
  Blaze.registerHelper(name, tpl);                                                                                    // 19
                                                                                                                      // 20
  FView._registerables[name] = _.extend(                                                                              // 21
    { create: defaultCreate },                                                                                        // 22
    options || {},                                                                                                    // 23
    { name: name, constructor: famousView, type: 'view' }                                                             // 24
  );                                                                                                                  // 25
};                                                                                                                    // 26
                                                                                                                      // 27
function defaultCreate(options) {                                                                                     // 28
  return new this._view.constructor(options);                                                                         // 29
}                                                                                                                     // 30
                                                                                                                      // 31
/* Do we still need this?  Most people explicitly register views with                                                 // 32
   registerView() these days, to get the template helper */                                                           // 33
/*                                                                                                                    // 34
FView.getView = function(name)  {                                                                                     // 35
  // @famono silent                                                                                                   // 36
  if (FView.views[name])                                                                                              // 37
    return FView.views[name].constructor;                                                                             // 38
  if (typeof Famous !== 'undefined' && Famous[name])                                                                  // 39
    return Famous[name];                                                                                              // 40
  if (typeof Famous !== 'undefined' && famous.Views && Famous.Views[name])                                            // 41
    return Famous.Views[name];                                                                                        // 42
  if (typeof famous !== 'undefined' && famous.views && famous.views[name])                                            // 43
    return famous.views[name];                                                                                        // 44
                                                                                                                      // 45
  /// XXX temp for proof-of-concept                                                                                   // 46
  if (FView.modifiers[name])                                                                                          // 47
    return FView.modifiers[name].modifier;                                                                            // 48
                                                                                                                      // 49
  else                                                                                                                // 50
    throw new Error('Wanted view "' + name + '" but it doesn\'t exists.'                                              // 51
      + ' Try FView.registerView("'+name+'", require(...))');                                                         // 52
}                                                                                                                     // 53
*/                                                                                                                    // 54
                                                                                                                      // 55
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/_simple.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('SequentialLayout', famous.views.SequentialLayout);                                              // 2
  FView.registerView('View', famous.core.View);                                                                       // 3
});                                                                                                                   // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/ContainerSurface.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('ContainerSurface', famous.surfaces.ContainerSurface, {                                          // 2
                                                                                                                      // 3
    add: function(child_fview, child_options) {                                                                       // 4
      this.view.add(child_fview);                                                                                     // 5
    },                                                                                                                // 6
                                                                                                                      // 7
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                     // 8
      if (key == 'overflow')                                                                                          // 9
        this.view.setProperties({ overflow: value });                                                                 // 10
      else if (key == 'class')                                                                                        // 11
        this.view.setClasses(value.split(" "));                                                                       // 12
      else if (key == 'perspective')                                                                                  // 13
        this.view.context.setPerspective(value);                                                                      // 14
    }                                                                                                                 // 15
  });                                                                                                                 // 16
});                                                                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/EdgeSwapper.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('EdgeSwapper', famous.views.EdgeSwapper, {                                                       // 2
    add: function(child_fview, child_options) {                                                                       // 3
      if (!this.view)                                                                                                 // 4
        return;  // when?                                                                                             // 5
                                                                                                                      // 6
      if (this.currentShow)                                                                                           // 7
        this.previousShow = this.currentShow;                                                                         // 8
      this.currentShow = child_fview;                                                                                 // 9
                                                                                                                      // 10
      child_fview.preventDestroy();                                                                                   // 11
                                                                                                                      // 12
      var self = this;                                                                                                // 13
      this.view.show(child_fview, null, function() {                                                                  // 14
        if (self.previousShow)                                                                                        // 15
          self.previousShow.destroy();                                                                                // 16
      });                                                                                                             // 17
    }                                                                                                                 // 18
  });                                                                                                                 // 19
});                                                                                                                   // 20
                                                                                                                      // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/Flipper.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('Flipper', famous.views.Flipper, {                                                               // 2
    add: function(child_fview, child_options) {                                                                       // 3
      var target = child_options.target;                                                                              // 4
      if (!target || (target != 'back' && target != 'front'))                                                         // 5
        throw new Error('Flipper must specify target="back/front"');                                                  // 6
                                                                                                                      // 7
      if (target == 'front')                                                                                          // 8
        this.view.setFront(child_fview);                                                                              // 9
      else                                                                                                            // 10
        this.view.setBack(child_fview);                                                                               // 11
    }                                                                                                                 // 12
  });                                                                                                                 // 13
});                                                                                                                   // 14
                                                                                                                      // 15
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/HeaderFooterLayout.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('HeaderFooterLayout', famous.views.HeaderFooterLayout, {                                         // 2
    add: function(child_fview, child_options) {                                                                       // 3
      var target = child_options.target;                                                                              // 4
      if (!target)                                                                                                    // 5
        throw new Error('HeaderFooterLayout children must specify target="header/footer/content"');                   // 6
      this.view[target].add(child_fview);                                                                             // 7
    }                                                                                                                 // 8
  });                                                                                                                 // 9
});                                                                                                                   // 10
                                                                                                                      // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/Lightbox.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// NOT DONE!                                                                                                          // 1
                                                                                                                      // 2
FView.ready(function(require) {                                                                                       // 3
  FView.registerView('Lightbox', famous.views.Lightbox, {                                                             // 4
    add: function(child_fview, child_options) {                                                                       // 5
      if (!this.view)                                                                                                 // 6
        return;  // when?                                                                                             // 7
                                                                                                                      // 8
      if (this.currentShow)                                                                                           // 9
        this.previousShow = this.currentShow;                                                                         // 10
      this.currentShow = child_fview;                                                                                 // 11
                                                                                                                      // 12
      child_fview.preventDestroy();                                                                                   // 13
                                                                                                                      // 14
      var self = this;                                                                                                // 15
      this.view.show(child_fview, null, function() {                                                                  // 16
        if (self.previousShow)                                                                                        // 17
          self.previousShow.destroy();                                                                                // 18
      });                                                                                                             // 19
    },                                                                                                                // 20
                                                                                                                      // 21
    attrUpdate: function(key, value, oldValue, allData, firstTime) {                                                  // 22
      if (key == 'transition') {                                                                                      // 23
        var data = FView.transitions[value];                                                                          // 24
        if (data) {                                                                                                   // 25
          for (key in data)                                                                                           // 26
            this.view[key](data[key]);                                                                                // 27
        } else {                                                                                                      // 28
          log.error('No such transition ' + transition);                                                              // 29
        }                                                                                                             // 30
      }                                                                                                               // 31
    }                                                                                                                 // 32
  });                                                                                                                 // 33
});                                                                                                                   // 34
                                                                                                                      // 35
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/RenderController.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function fullOpacity() { return 1; }                                                                                  // 1
function transformIdentity() { return Transform.Identity; }                                                           // 2
                                                                                                                      // 3
FView.transitionModifiers = {                                                                                         // 4
  opacity: {                                                                                                          // 5
    outOpacityFrom: function (progress) {                                                                             // 6
      return progress;                                                                                                // 7
    },                                                                                                                // 8
    inOpacityFrom: function (progress) {                                                                              // 9
      return progress;                                                                                                // 10
    },                                                                                                                // 11
    outTransformFrom: transformIdentity, inTransformFrom: transformIdentity                                           // 12
  },                                                                                                                  // 13
  slideWindow: {                                                                                                      // 14
    outTransformFrom: function(progress) {                                                                            // 15
      return Transform.translate(window.innerWidth * progress - window.innerWidth, 0, 0);                             // 16
    },                                                                                                                // 17
    inTransformFrom: function(progress) {                                                                             // 18
      return Transform.translate(window.innerWidth * (1.0 - progress), 0, 0);                                         // 19
    },                                                                                                                // 20
    inOpacityFrom: fullOpacity, outOpacityFrom: fullOpacity                                                           // 21
  },                                                                                                                  // 22
  WIP: {                                                                                                              // 23
    outTransformFrom: function(progress) {                                                                            // 24
      return Transform.rotateY(Math.PI*progress);                                                                     // 25
    },                                                                                                                // 26
    inTransformFrom: function(progress) {                                                                             // 27
      return Transform.rotateY(Math.PI + Math.PI*progress);                                                           // 28
    },                                                                                                                // 29
    inOpacityFrom: fullOpacity, outOpacityFrom: fullOpacity                                                           // 30
  }                                                                                                                   // 31
};                                                                                                                    // 32
                                                                                                                      // 33
// Other option is to allow a slideDirection attribute.  Think about this.                                            // 34
FView.transitionModifiers.slideWindowLeft = FView.transitionModifiers.slideWindow;                                    // 35
FView.transitionModifiers.slideWindowRight = {                                                                        // 36
    outTransformFrom: FView.transitionModifiers.slideWindow.inTransformFrom,                                          // 37
    inTransformFrom: FView.transitionModifiers.slideWindow.outTransformFrom                                           // 38
};                                                                                                                    // 39
                                                                                                                      // 40
function showHide(fview, child_fview, dynamic) {                                                                      // 41
  if (fview._currentShow)                                                                                             // 42
    fview._previousShow = fview._currentShow;                                                                         // 43
  fview._currentShow = child_fview;                                                                                   // 44
                                                                                                                      // 45
  if (dynamic)                                                                                                        // 46
    child_fview.preventDestroy();                                                                                     // 47
                                                                                                                      // 48
  var transition = fview._transition || null;                                                                         // 49
                                                                                                                      // 50
  var origTransitionData = {};                                                                                        // 51
  if (typeof fview._transitionOnce !== 'undefined') {                                                                 // 52
    origTransitionData.transition = transition;                                                                       // 53
    transition = fview._transitionOnce;                                                                               // 54
    delete fview._transitionOnce;                                                                                     // 55
  }                                                                                                                   // 56
  if (fview._transitionModifierOnce) {                                                                                // 57
    origTransitionData.modifierName = fview._transitionModifier;                                                      // 58
    var data = FView.transitionModifiers[fview._transitionModifierOnce];                                              // 59
    if (data) {                                                                                                       // 60
      for (var key in data)                                                                                           // 61
        fview.view[key](data[key]);                                                                                   // 62
    } else {                                                                                                          // 63
      log.error('No such transition ' + fview._transitionModifierOnce);                                               // 64
    }                                                                                                                 // 65
    delete fview._transitionModifierOnce;                                                                             // 66
  }                                                                                                                   // 67
                                                                                                                      // 68
  fview.view.show(child_fview, transition, function() {                                                               // 69
    // Now that transition is complete, we can destroy the old template                                               // 70
    if (fview._previousShow && dynamic)                                                                               // 71
      fview._previousShow.destroy();                                                                                  // 72
                                                                                                                      // 73
    // If _transitionOnce was used, now we can restore the defaults                                                   // 74
    if (origTransitionData.modifierName) {                                                                            // 75
      // console.log('restore ' + origTransitionData.modifierName);                                                   // 76
      var data = FView.transitionModifiers[origTransitionData.modifierName];                                          // 77
      for (var key in data)                                                                                           // 78
        fview.view[key](data[key]);                                                                                   // 79
    }                                                                                                                 // 80
    if (origTransitionData.transition)                                                                                // 81
      fview._transition = origTransitionData.transition;                                                              // 82
  });                                                                                                                 // 83
}                                                                                                                     // 84
                                                                                                                      // 85
function showHideId(id) {                                                                                             // 86
  var fview = this;                                                                                                   // 87
  var child = fview.prerenderIds[id];                                                                                 // 88
                                                                                                                      // 89
  if (child) {                                                                                                        // 90
    showHide(fview, child, false /* dynamic */)                                                                       // 91
  } else {                                                                                                            // 92
    if (fview.onRenderTree)                                                                                           // 93
      throw new Error("showId changed to '" + id + "' but we have no children with that id");                         // 94
    else                                                                                                              // 95
      fview.renderQueue = id;                                                                                         // 96
  }                                                                                                                   // 97
}                                                                                                                     // 98
                                                                                                                      // 99
FView.ready(function(require) {                                                                                       // 100
  FView.registerView('RenderController', famous.views.RenderController, {                                             // 101
    create: function(options) {                                                                                       // 102
      var fview = this;                                                                                               // 103
                                                                                                                      // 104
      if (options.prerender) {                                                                                        // 105
        fview.prerenderIds = {};                                                                                      // 106
        fview.showId = showHideId;                                                                                    // 107
      }                                                                                                               // 108
                                                                                                                      // 109
      return new fview._view.constructor(options);                                                                    // 110
    },                                                                                                                // 111
                                                                                                                      // 112
    add: function(child_fview, child_options) {                                                                       // 113
      var fview = this;                                                                                               // 114
                                                                                                                      // 115
      if (!fview.view)                                                                                                // 116
        return;  // when?                                                                                             // 117
                                                                                                                      // 118
      if (fview.prerenderIds) {                                                                                       // 119
        if (!child_options.id)                                                                                        // 120
          throw new Error("When using renderController prerender=true, every child must use id=somethingUnique");     // 121
        fview.prerenderIds[child_options.id] = child_fview;                                                           // 122
        return;                                                                                                       // 123
      }                                                                                                               // 124
                                                                                                                      // 125
      showHide(fview, child_fview, true /* dynamic */);                                                               // 126
    },                                                                                                                // 127
                                                                                                                      // 128
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                     // 129
      if (key == 'transition') {                                                                                      // 130
        var data = FView.transitionModifiers[value];                                                                  // 131
        if (data) {                                                                                                   // 132
          this._transitionModifier = value;                                                                           // 133
          for (var key in data)                                                                                       // 134
            this.view[key](data[key]);                                                                                // 135
        } else if (value) {                                                                                           // 136
          log.error('No such transition ' + value);                                                                   // 137
        }                                                                                                             // 138
      }                                                                                                               // 139
                                                                                                                      // 140
      if (key == 'showId') {                                                                                          // 141
        this.showId(value);                                                                                           // 142
      }                                                                                                               // 143
    },                                                                                                                // 144
                                                                                                                      // 145
    onRenderTree: function() {                                                                                        // 146
      this.onRenderTree = true;                                                                                       // 147
      if (this.renderQueue) {                                                                                         // 148
        this.showId(this.renderQueue);                                                                                // 149
        delete this.renderQueue;                                                                                      // 150
      }                                                                                                               // 151
    },                                                                                                                // 152
                                                                                                                      // 153
    onDestroy: function() {                                                                                           // 154
      if (this.prerenderIds)                                                                                          // 155
        delete this.prerenderIds;                                                                                     // 156
    }                                                                                                                 // 157
  });                                                                                                                 // 158
});                                                                                                                   // 159
                                                                                                                      // 160
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/Scrollview.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('Scrollview', famous.views.Scrollview, {                                                         // 2
                                                                                                                      // 3
    create: function(options) {                                                                                       // 4
      var fview = this;                                                                                               // 5
      var scrollview = new fview._view.constructor(options);                                                          // 6
                                                                                                                      // 7
      fview.properties = new ReactiveDict();                                                                          // 8
                                                                                                                      // 9
      if (options.paginated) {                                                                                        // 10
        fview.properties.set('index', 0);                                                                             // 11
                                                                                                                      // 12
        // famo.us pageChange event seems completely broken??                                                         // 13
        scrollview.on('pageChange', function(props) {                                                                 // 14
          for (var key in props)                                                                                      // 15
            fview.properties.set(key, props[key]);                                                                    // 16
        });                                                                                                           // 17
                                                                                                                      // 18
        // workaround for the above:                                                                                  // 19
        // - fires when event doesn't fire                                                                            // 20
        // - will override wrong value before flush                                                                   // 21
        scrollview.on('settle', function(props) {                                                                     // 22
          fview.properties.set('index',                                                                               // 23
            fview.view.getCurrentIndex());                                                                            // 24
        });                                                                                                           // 25
      }                                                                                                               // 26
                                                                                                                      // 27
      return scrollview;                                                                                              // 28
    },                                                                                                                // 29
                                                                                                                      // 30
    famousCreatedPost: function() {                                                                                   // 31
      this.pipeChildrenTo = this.parent.pipeChildrenTo ?                                                              // 32
        [ this.view, this.parent.pipeChildrenTo[0] ] :                                                                // 33
        [ this.view ];                                                                                                // 34
    }                                                                                                                 // 35
                                                                                                                      // 36
  });                                                                                                                 // 37
});                                                                                                                   // 38
                                                                                                                      // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/views/Surface.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function(require) {                                                                                       // 1
  FView.registerView('Surface', famous.core.Surface, {                                                                // 2
                                                                                                                      // 3
    add: function(child_fview, child_options) {                                                                       // 4
      var blazeView = this.blazeView;                                                                                 // 5
                                                                                                                      // 6
      log.error("You tried to embed a " + child_fview._view.name + " inside " +                                       // 7
        "a Surface (parent: " + parentViewName(blazeView) + ", template: " +                                          // 8
        parentTemplateName(blazeView) + ").  Surfaces are endpoints in the " +                                        // 9
        "Famous Render Tree and may not contain children themselves.  See " +                                         // 10
        "https://github.com/gadicc/meteor-famous-views/issues/78 for more info.");                                    // 11
                                                                                                                      // 12
      throw new Error("Cannot add View to Surface");                                                                  // 13
    },                                                                                                                // 14
                                                                                                                      // 15
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                     // 16
      switch(key) {                                                                                                   // 17
        case 'size':                                                                                                  // 18
          // Let our modifier control our size                                                                        // 19
          // Long term, rather specify modifierSize and surfaceSize args?                                             // 20
          // Modifier can't handler true                                                                              // 21
          if (this._modifier && this._modifier.name == 'StateModifier' &&                                             // 22
              (value[0] != true && value[1] != true))                                                                 // 23
            this.surface.setSize([undefined,undefined]);                                                              // 24
          else {                                                                                                      // 25
            this.surface.setSize(value);                                                                              // 26
          }                                                                                                           // 27
          break;                                                                                                      // 28
                                                                                                                      // 29
        case 'class':                                                                                                 // 30
        case 'classes':                                                                                               // 31
          if (Match.test(value, String))                                                                              // 32
            value = value === "" ? [] : value.split(" ");                                                             // 33
          else if (!Match.test(value, [String]))                                                                      // 34
            throw new Error('Surface class= expects string or array of strings');                                     // 35
          value.push(this.surfaceClassName);                                                                          // 36
          this.view.setClasses(value);                                                                                // 37
          break;                                                                                                      // 38
                                                                                                                      // 39
        case 'style':                                                                                                 // 40
        case 'properties':                                                                                            // 41
          if (Match.test(value, String)) {                                                                            // 42
            var parts = value.split(';'), pair;                                                                       // 43
            value = {};                                                                                               // 44
            for (var i=0; i < parts.length; i++) {                                                                    // 45
              pair = parts[i].split(':');                                                                             // 46
              if (pair.length > 1)                                                                                    // 47
                value[pair[0].trim()] = pair[1].trim();                                                               // 48
            }                                                                                                         // 49
          } else if (!Match.test(value, Object))                                                                      // 50
            throw new Error('Surface properties= expects string or key-value dictionary');                            // 51
          this.view.setProperties(value);                                                                             // 52
          break;                                                                                                      // 53
      }                                                                                                               // 54
    },                                                                                                                // 55
                                                                                                                      // 56
    onDestroy: function() {                                                                                           // 57
      /*                                                                                                              // 58
      if (this.mutationObserver)                                                                                      // 59
        this.mutationObserver.disconnect();                                                                           // 60
      */                                                                                                              // 61
                                                                                                                      // 62
      // Not sure this is even necessary since the element is destroyed                                               // 63
      // But we'll play it safe :)                                                                                    // 64
      if (this.resizeListener) {                                                                                      // 65
        removeResizeListener(this.surface.content, this.resizeListener);                                              // 66
        delete this.resizeListener;                                                                                   // 67
      }                                                                                                               // 68
    },                                                                                                                // 69
                                                                                                                      // 70
    postRender: function() {                                                                                          // 71
      if (this.template && this.template.onDocumentDom) {                                                             // 72
        var fview = this;                                                                                             // 73
        var cb = function() {                                                                                         // 74
          Engine.defer(function() {                                                                                   // 75
            fview.template.onDocumentDom.call(fview.surfaceBlazeView.templateInstance());                             // 76
            fview.surface.removeListener('deploy', cb);                                                               // 77
          });                                                                                                         // 78
        };                                                                                                            // 79
        fview.surface.on('deploy', cb);                                                                               // 80
      }                                                                                                               // 81
    }                                                                                                                 // 82
                                                                                                                      // 83
  });                                                                                                                 // 84
});                                                                                                                   // 85
                                                                                                                      // 86
/*                                                                                                                    // 87
 * Called in famous.js when rendering a Surface (which unlike anything else,                                          // 88
 * gets rendered to a div via Blaze.render and is treated differently)                                                // 89
 */                                                                                                                   // 90
templateSurface = function (fview, view, parentView, options, tName) {                                                // 91
  div = document.createElement('div');                                                                                // 92
  Blaze.render(view, div, null, parentView);                                                                          // 93
                                                                                                                      // 94
  if (!options)                                                                                                       // 95
    options = {};                                                                                                     // 96
                                                                                                                      // 97
  var autoSize = options.size && options.size[1] == 'auto';                                                           // 98
                                                                                                                      // 99
  if (autoSize)                                                                                                       // 100
    options.size = [0, 0];                                                                                            // 101
  else                                                                                                                // 102
    div.style.height='100%';                                                                                          // 103
  div.style.width='100%';                                                                                             // 104
                                                                                                                      // 105
  fview.surfaceClassName = 't_'+tName.replace(/ /, '_');                                                              // 106
  if (options.classes)                                                                                                // 107
    throw new Error('Surface classes="x,y" is deprecated.  Use class="x y" instead.');                                // 108
                                                                                                                      // 109
  var surfaceOptions = {                                                                                              // 110
    content: div,                                                                                                     // 111
    //size: fview.size                                                                                                // 112
  };                                                                                                                  // 113
                                                                                                                      // 114
  fview.surface = fview.view;                                                                                         // 115
  fview.surface.setOptions(surfaceOptions);                                                                           // 116
                                                                                                                      // 117
  var pipeChildrenTo = fview.parent.pipeChildrenTo;                                                                   // 118
  if (pipeChildrenTo)                                                                                                 // 119
    for (var i=0; i < pipeChildrenTo.length; i++)                                                                     // 120
      fview.surface.pipe(pipeChildrenTo[i]);                                                                          // 121
                                                                                                                      // 122
  if (autoSize) {                                                                                                     // 123
    fview.autoHeight = autoHeight;                                                                                    // 124
    fview.autoHeight();                                                                                               // 125
    // Deprecated 2014-11-01                                                                                          // 126
    log.warn(fview.surfaceClassName + ': size="[undefined,auto"] is ' +                                               // 127
      'deprecated.  Since Famo.us 0.3.0 ' +                                                                           // 128
      'you can simply use size="[undefined,true]" and it will work as ' +                                             // 129
      'expected in all cases (including SequentialLayout, Scrollview, etc)');                                         // 130
  }                                                                                                                   // 131
                                                                                                                      // 132
  if (options.watchSize) {                                                                                            // 133
    /*                                                                                                                // 134
     * The MutationObserver code is still around since                                                                // 135
     * javascript-detect-element-resize cannot handle a case like div.html()                                          // 136
     * where the entire div's contents are replaced (since it relies on                                               // 137
     * some special divs at the end).  I think that's an acceptable loss,                                             // 138
     * since that's an unlikely use case and the benefits are much bigger.                                            // 139
     *                                                                                                                // 140
    if (typeof MutationObserver === 'undefined')                                                                      // 141
      return console.warn("Can't observe on browser where MutationObserver " +                                        // 142
        "is not supported");                                                                                          // 143
    fview.mutationObserver = new MutationObserver(function(mutations) {                                               // 144
      fview.surface._contentDirty = true;                                                                             // 145
    });                                                                                                               // 146
    fview.mutationObserver.observe(div, {                                                                             // 147
      attributeFilter: true, attributes: true,                                                                        // 148
      characterData: true, childList: true, subtree: true                                                             // 149
    });                                                                                                               // 150
    */                                                                                                                // 151
                                                                                                                      // 152
    fview.resizeListener = function() {                                                                               // 153
      fview.surface._contentDirty = true;                                                                             // 154
    };                                                                                                                // 155
    addResizeListener(div, fview.resizeListener);                                                                     // 156
  }                                                                                                                   // 157
};                                                                                                                    // 158
                                                                                                                      // 159
function autoHeight(callback) {                                                                                       // 160
  var fview = this;                                                                                                   // 161
  var div = fview.surface.content;                                                                                    // 162
                                                                                                                      // 163
  var height = div.scrollHeight;                                                                                      // 164
  if (height && (!fview.size || (fview.size.length == 2 && fview.size[1] != height))) {                               // 165
    fview.size = [undefined, height];                                                                                 // 166
    if (fview.modifier) {                                                                                             // 167
      fview.modifier.setSize(fview.size);                                                                             // 168
      fview.surface.setSize([undefined,undefined]);                                                                   // 169
    } else {                                                                                                          // 170
      fview.surface.setSize(fview.size);                                                                              // 171
    }                                                                                                                 // 172
                                                                                                                      // 173
    if (callback)                                                                                                     // 174
      callback.call(fview, height);                                                                                   // 175
  } else {                                                                                                            // 176
    // Ideally Engine.nextTick, but                                                                                   // 177
    // https://github.com/Famous/famous/issues/342                                                                    // 178
    // e.g. /issue10                                                                                                  // 179
    window.setTimeout(function() {                                                                                    // 180
      fview.autoHeight();                                                                                             // 181
    }, 10);  // FYI: 16.67ms = 1x 60fps animation frame                                                               // 182
  }                                                                                                                   // 183
}                                                                                                                     // 184
                                                                                                                      // 185
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/gadicohen:famous-views/lib/modifiers/StateModifier.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
FView.ready(function() {                                                                                              // 1
  FView.registerModifier('StateModifier', famous.modifiers.StateModifier, {                                           // 2
                                                                                                                      // 3
    attrUpdate: function(key, value, oldValue, data, firstTime) {                                                     // 4
      // Allow for values like { value: 30, transition: {}, halt: true }                                              // 5
      var options = {};                                                                                               // 6
      if (typeof value === 'object' && value && typeof value.value !== 'undefined') {                                 // 7
        options = value;                                                                                              // 8
        value = options.value;                                                                                        // 9
      }                                                                                                               // 10
      if (typeof oldValue === 'object' && oldValue && typeof oldValue.value !== 'undefined')                          // 11
        oldValue = oldValue.value;                                                                                    // 12
      var amount;                                                                                                     // 13
                                                                                                                      // 14
      switch(key) {                                                                                                   // 15
        case 'transform': case 'opacity': case 'align': case 'size': case 'origin':                                   // 16
          modifierMethod(this, 'set'+key[0].toUpperCase()+key.substr(1), value, options);                             // 17
          break;                                                                                                      // 18
                                                                                                                      // 19
        // Below are helpful shortcuts for transforms                                                                 // 20
                                                                                                                      // 21
        case 'translate':                                                                                             // 22
          modifierMethod(this, 'setTransform',                                                                        // 23
            Transform.translate.apply(null, value), options);                                                         // 24
          break;                                                                                                      // 25
                                                                                                                      // 26
        case 'scaleX': case 'scaleY': case 'scaleZ':                                                                  // 27
          amount = (value || 0) - (oldValue || 0);                                                                    // 28
          var scale = [1,1,1];                                                                                        // 29
          if (key == 'scaleX') scale[0] = amount;                                                                     // 30
          else if (key == 'scaleY') scale[1] = amount;                                                                // 31
          else scale[2] = amount;                                                                                     // 32
          modifierMethod(this, 'setTransform', Transform.multiply(                                                    // 33
            this.modifier.getFinalTransform(),                                                                        // 34
            Transform.scale.apply(null, scale)                                                                        // 35
          ), options);                                                                                                // 36
          break;                                                                                                      // 37
                                                                                                                      // 38
        case 'skewX': case 'skewY':                                                                                   // 39
          amount = (value || 0) - (oldValue || 0);                                                                    // 40
          modifierMethod(this, 'setTransform', Transform.multiply(                                                    // 41
            this.modifier.getFinalTransform(),                                                                        // 42
            Transform[key](degreesToRadians(amount))                                                                  // 43
          ), options);                                                                                                // 44
          break;                                                                                                      // 45
                                                                                                                      // 46
        case 'skewZ': // doesn't exist in famous                                                                      // 47
          amount = (value || 0) - (oldValue || 0);                                                                    // 48
          modifierMethod(this, 'setTransform', Transform.multiply(                                                    // 49
            this.modifier.getFinalTransform(),                                                                        // 50
            Transform.skew(0, 0, degreesToRadians(amount))                                                            // 51
          ), options);                                                                                                // 52
          break;                                                                                                      // 53
                                                                                                                      // 54
        case 'rotateX': case 'rotateY': case 'rotateZ':                                                               // 55
          // value might be undefined from Session with no SessionDefault                                             // 56
          var rotateBy = (value || 0) - (oldValue || 0);                                                              // 57
          modifierMethod(this, 'setTransform', Transform.multiply(                                                    // 58
            this.modifier.getFinalTransform(),                                                                        // 59
            Transform[key](degreesToRadians(rotateBy))                                                                // 60
          ), options);                                                                                                // 61
          break;                                                                                                      // 62
      }                                                                                                               // 63
    }                                                                                                                 // 64
  });                                                                                                                 // 65
});                                                                                                                   // 66
                                                                                                                      // 67
function modifierMethod(fview, method, value, options) {                                                              // 68
  if (typeof options.halt !== 'undefined' ?                                                                           // 69
      options.halt : fview.modifierTransitionHalt)                                                                    // 70
  fview.modifier.halt();                                                                                              // 71
                                                                                                                      // 72
  fview.modifier[method](                                                                                             // 73
    value,                                                                                                            // 74
    options.transition || fview.modifierTransition,                                                                   // 75
    options.done || fview.modifierTransitionDone                                                                      // 76
  );                                                                                                                  // 77
}                                                                                                                     // 78
                                                                                                                      // 79
function degreesToRadians(x) {                                                                                        // 80
  return x * Math.PI / 180;                                                                                           // 81
}                                                                                                                     // 82
                                                                                                                      // 83
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['gadicohen:famous-views'] = {
  FView: FView
};

})();
