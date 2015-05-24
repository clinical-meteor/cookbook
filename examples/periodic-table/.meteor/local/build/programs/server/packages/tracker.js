(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Tracker, Deps;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tracker/tracker.js                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/////////////////////////////////////////////////////                                                             // 1
// Package docs at http://docs.meteor.com/#tracker //                                                             // 2
/////////////////////////////////////////////////////                                                             // 3
                                                                                                                  // 4
/**                                                                                                               // 5
 * @namespace Tracker                                                                                             // 6
 * @summary The namespace for Tracker-related methods.                                                            // 7
 */                                                                                                               // 8
Tracker = {};                                                                                                     // 9
                                                                                                                  // 10
// http://docs.meteor.com/#tracker_active                                                                         // 11
                                                                                                                  // 12
/**                                                                                                               // 13
 * @summary True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.
 * @locus Client                                                                                                  // 15
 * @type {Boolean}                                                                                                // 16
 */                                                                                                               // 17
Tracker.active = false;                                                                                           // 18
                                                                                                                  // 19
// http://docs.meteor.com/#tracker_currentcomputation                                                             // 20
                                                                                                                  // 21
/**                                                                                                               // 22
 * @summary The current computation, or `null` if there isn't one.  The current computation is the [`Tracker.Computation`](#tracker_computation) object created by the innermost active call to `Tracker.autorun`, and it's the computation that gains dependencies when reactive data sources are accessed.
 * @locus Client                                                                                                  // 24
 * @type {Tracker.Computation}                                                                                    // 25
 */                                                                                                               // 26
Tracker.currentComputation = null;                                                                                // 27
                                                                                                                  // 28
// References to all computations created within the Tracker by id.                                               // 29
// Keeping these references on an underscore property gives more control to                                       // 30
// tooling and packages extending Tracker without increasing the API surface.                                     // 31
// These can used to monkey-patch computations, their functions, use                                              // 32
// computation ids for tracking, etc.                                                                             // 33
Tracker._computations = {};                                                                                       // 34
                                                                                                                  // 35
var setCurrentComputation = function (c) {                                                                        // 36
  Tracker.currentComputation = c;                                                                                 // 37
  Tracker.active = !! c;                                                                                          // 38
};                                                                                                                // 39
                                                                                                                  // 40
var _debugFunc = function () {                                                                                    // 41
  // We want this code to work without Meteor, and also without                                                   // 42
  // "console" (which is technically non-standard and may be missing                                              // 43
  // on some browser we come across, like it was on IE 7).                                                        // 44
  //                                                                                                              // 45
  // Lazy evaluation because `Meteor` does not exist right away.(??)                                              // 46
  return (typeof Meteor !== "undefined" ? Meteor._debug :                                                         // 47
          ((typeof console !== "undefined") && console.error ?                                                    // 48
           function () { console.error.apply(console, arguments); } :                                             // 49
           function () {}));                                                                                      // 50
};                                                                                                                // 51
                                                                                                                  // 52
var _maybeSupressMoreLogs = function (messagesLength) {                                                           // 53
  // Sometimes when running tests, we intentionally supress logs on expected                                      // 54
  // printed errors. Since the current implementation of _throwOrLog can log                                      // 55
  // multiple separate log messages, supress all of them if at least one supress                                  // 56
  // is expected as we still want them to count as one.                                                           // 57
  if (typeof Meteor !== "undefined") {                                                                            // 58
    if (Meteor._supressed_log_expected()) {                                                                       // 59
      Meteor._suppress_log(messagesLength - 1);                                                                   // 60
    }                                                                                                             // 61
  }                                                                                                               // 62
};                                                                                                                // 63
                                                                                                                  // 64
var _throwOrLog = function (from, e) {                                                                            // 65
  if (throwFirstError) {                                                                                          // 66
    throw e;                                                                                                      // 67
  } else {                                                                                                        // 68
    var printArgs = ["Exception from Tracker " + from + " function:"];                                            // 69
    if (e.stack && e.message && e.name) {                                                                         // 70
      var idx = e.stack.indexOf(e.message);                                                                       // 71
      if (idx < 0 || idx > e.name.length + 2) { // check for "Error: "                                            // 72
        // message is not part of the stack                                                                       // 73
        var message = e.name + ": " + e.message;                                                                  // 74
        printArgs.push(message);                                                                                  // 75
      }                                                                                                           // 76
    }                                                                                                             // 77
    printArgs.push(e.stack);                                                                                      // 78
    _maybeSupressMoreLogs(printArgs.length);                                                                      // 79
                                                                                                                  // 80
    for (var i = 0; i < printArgs.length; i++) {                                                                  // 81
      _debugFunc()(printArgs[i]);                                                                                 // 82
    }                                                                                                             // 83
  }                                                                                                               // 84
};                                                                                                                // 85
                                                                                                                  // 86
// Takes a function `f`, and wraps it in a `Meteor._noYieldsAllowed`                                              // 87
// block if we are running on the server. On the client, returns the                                              // 88
// original function (since `Meteor._noYieldsAllowed` is a                                                        // 89
// no-op). This has the benefit of not adding an unnecessary stack                                                // 90
// frame on the client.                                                                                           // 91
var withNoYieldsAllowed = function (f) {                                                                          // 92
  if ((typeof Meteor === 'undefined') || Meteor.isClient) {                                                       // 93
    return f;                                                                                                     // 94
  } else {                                                                                                        // 95
    return function () {                                                                                          // 96
      var args = arguments;                                                                                       // 97
      Meteor._noYieldsAllowed(function () {                                                                       // 98
        f.apply(null, args);                                                                                      // 99
      });                                                                                                         // 100
    };                                                                                                            // 101
  }                                                                                                               // 102
};                                                                                                                // 103
                                                                                                                  // 104
var nextId = 1;                                                                                                   // 105
// computations whose callbacks we should call at flush time                                                      // 106
var pendingComputations = [];                                                                                     // 107
// `true` if a Tracker.flush is scheduled, or if we are in Tracker.flush now                                      // 108
var willFlush = false;                                                                                            // 109
// `true` if we are in Tracker.flush now                                                                          // 110
var inFlush = false;                                                                                              // 111
// `true` if we are computing a computation now, either first time                                                // 112
// or recompute.  This matches Tracker.active unless we are inside                                                // 113
// Tracker.nonreactive, which nullfies currentComputation even though                                             // 114
// an enclosing computation may still be running.                                                                 // 115
var inCompute = false;                                                                                            // 116
// `true` if the `_throwFirstError` option was passed in to the call                                              // 117
// to Tracker.flush that we are in. When set, throw rather than log the                                           // 118
// first error encountered while flushing. Before throwing the error,                                             // 119
// finish flushing (from a finally block), logging any subsequent                                                 // 120
// errors.                                                                                                        // 121
var throwFirstError = false;                                                                                      // 122
                                                                                                                  // 123
var afterFlushCallbacks = [];                                                                                     // 124
                                                                                                                  // 125
var requireFlush = function () {                                                                                  // 126
  if (! willFlush) {                                                                                              // 127
    // We want this code to work without Meteor, see debugFunc above                                              // 128
    if (typeof Meteor !== "undefined")                                                                            // 129
      Meteor._setImmediate(Tracker._runFlush);                                                                    // 130
    else                                                                                                          // 131
      setTimeout(Tracker._runFlush, 0);                                                                           // 132
    willFlush = true;                                                                                             // 133
  }                                                                                                               // 134
};                                                                                                                // 135
                                                                                                                  // 136
// Tracker.Computation constructor is visible but private                                                         // 137
// (throws an error if you try to call it)                                                                        // 138
var constructingComputation = false;                                                                              // 139
                                                                                                                  // 140
//                                                                                                                // 141
// http://docs.meteor.com/#tracker_computation                                                                    // 142
                                                                                                                  // 143
/**                                                                                                               // 144
 * @summary A Computation object represents code that is repeatedly rerun                                         // 145
 * in response to                                                                                                 // 146
 * reactive data changes. Computations don't have return values; they just                                        // 147
 * perform actions, such as rerendering a template on the screen. Computations                                    // 148
 * are created using Tracker.autorun. Use stop to prevent further rerunning of a                                  // 149
 * computation.                                                                                                   // 150
 * @instancename computation                                                                                      // 151
 */                                                                                                               // 152
Tracker.Computation = function (f, parent, onError) {                                                             // 153
  if (! constructingComputation)                                                                                  // 154
    throw new Error(                                                                                              // 155
      "Tracker.Computation constructor is private; use Tracker.autorun");                                         // 156
  constructingComputation = false;                                                                                // 157
                                                                                                                  // 158
  var self = this;                                                                                                // 159
                                                                                                                  // 160
  // http://docs.meteor.com/#computation_stopped                                                                  // 161
                                                                                                                  // 162
  /**                                                                                                             // 163
   * @summary True if this computation has been stopped.                                                          // 164
   * @locus Client                                                                                                // 165
   * @memberOf Tracker.Computation                                                                                // 166
   * @instance                                                                                                    // 167
   * @name  stopped                                                                                               // 168
   */                                                                                                             // 169
  self.stopped = false;                                                                                           // 170
                                                                                                                  // 171
  // http://docs.meteor.com/#computation_invalidated                                                              // 172
                                                                                                                  // 173
  /**                                                                                                             // 174
   * @summary True if this computation has been invalidated (and not yet rerun), or if it has been stopped.       // 175
   * @locus Client                                                                                                // 176
   * @memberOf Tracker.Computation                                                                                // 177
   * @instance                                                                                                    // 178
   * @name  invalidated                                                                                           // 179
   * @type {Boolean}                                                                                              // 180
   */                                                                                                             // 181
  self.invalidated = false;                                                                                       // 182
                                                                                                                  // 183
  // http://docs.meteor.com/#computation_firstrun                                                                 // 184
                                                                                                                  // 185
  /**                                                                                                             // 186
   * @summary True during the initial run of the computation at the time `Tracker.autorun` is called, and false on subsequent reruns and at other times.
   * @locus Client                                                                                                // 188
   * @memberOf Tracker.Computation                                                                                // 189
   * @instance                                                                                                    // 190
   * @name  firstRun                                                                                              // 191
   * @type {Boolean}                                                                                              // 192
   */                                                                                                             // 193
  self.firstRun = true;                                                                                           // 194
                                                                                                                  // 195
  self._id = nextId++;                                                                                            // 196
  self._onInvalidateCallbacks = [];                                                                               // 197
  // the plan is at some point to use the parent relation                                                         // 198
  // to constrain the order that computations are processed                                                       // 199
  self._parent = parent;                                                                                          // 200
  self._func = f;                                                                                                 // 201
  self._onError = onError;                                                                                        // 202
  self._recomputing = false;                                                                                      // 203
                                                                                                                  // 204
  // Register the computation within the global Tracker.                                                          // 205
  Tracker._computations[self._id] = self;                                                                         // 206
                                                                                                                  // 207
  var errored = true;                                                                                             // 208
  try {                                                                                                           // 209
    self._compute();                                                                                              // 210
    errored = false;                                                                                              // 211
  } finally {                                                                                                     // 212
    self.firstRun = false;                                                                                        // 213
    if (errored)                                                                                                  // 214
      self.stop();                                                                                                // 215
  }                                                                                                               // 216
};                                                                                                                // 217
                                                                                                                  // 218
// http://docs.meteor.com/#computation_oninvalidate                                                               // 219
                                                                                                                  // 220
/**                                                                                                               // 221
 * @summary Registers `callback` to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated.  The callback is run exactly once and not upon future invalidations unless `onInvalidate` is called again after the computation becomes valid again.
 * @locus Client                                                                                                  // 223
 * @param {Function} callback Function to be called on invalidation. Receives one argument, the computation that was invalidated.
 */                                                                                                               // 225
Tracker.Computation.prototype.onInvalidate = function (f) {                                                       // 226
  var self = this;                                                                                                // 227
                                                                                                                  // 228
  if (typeof f !== 'function')                                                                                    // 229
    throw new Error("onInvalidate requires a function");                                                          // 230
                                                                                                                  // 231
  if (self.invalidated) {                                                                                         // 232
    Tracker.nonreactive(function () {                                                                             // 233
      withNoYieldsAllowed(f)(self);                                                                               // 234
    });                                                                                                           // 235
  } else {                                                                                                        // 236
    self._onInvalidateCallbacks.push(f);                                                                          // 237
  }                                                                                                               // 238
};                                                                                                                // 239
                                                                                                                  // 240
// http://docs.meteor.com/#computation_invalidate                                                                 // 241
                                                                                                                  // 242
/**                                                                                                               // 243
 * @summary Invalidates this computation so that it will be rerun.                                                // 244
 * @locus Client                                                                                                  // 245
 */                                                                                                               // 246
Tracker.Computation.prototype.invalidate = function () {                                                          // 247
  var self = this;                                                                                                // 248
  if (! self.invalidated) {                                                                                       // 249
    // if we're currently in _recompute(), don't enqueue                                                          // 250
    // ourselves, since we'll rerun immediately anyway.                                                           // 251
    if (! self._recomputing && ! self.stopped) {                                                                  // 252
      requireFlush();                                                                                             // 253
      pendingComputations.push(this);                                                                             // 254
    }                                                                                                             // 255
                                                                                                                  // 256
    self.invalidated = true;                                                                                      // 257
                                                                                                                  // 258
    // callbacks can't add callbacks, because                                                                     // 259
    // self.invalidated === true.                                                                                 // 260
    for(var i = 0, f; f = self._onInvalidateCallbacks[i]; i++) {                                                  // 261
      Tracker.nonreactive(function () {                                                                           // 262
        withNoYieldsAllowed(f)(self);                                                                             // 263
      });                                                                                                         // 264
    }                                                                                                             // 265
    self._onInvalidateCallbacks = [];                                                                             // 266
  }                                                                                                               // 267
};                                                                                                                // 268
                                                                                                                  // 269
// http://docs.meteor.com/#computation_stop                                                                       // 270
                                                                                                                  // 271
/**                                                                                                               // 272
 * @summary Prevents this computation from rerunning.                                                             // 273
 * @locus Client                                                                                                  // 274
 */                                                                                                               // 275
Tracker.Computation.prototype.stop = function () {                                                                // 276
  if (! this.stopped) {                                                                                           // 277
    this.stopped = true;                                                                                          // 278
    this.invalidate();                                                                                            // 279
    // Unregister from global Tracker.                                                                            // 280
    delete Tracker._computations[this._id];                                                                       // 281
  }                                                                                                               // 282
};                                                                                                                // 283
                                                                                                                  // 284
Tracker.Computation.prototype._compute = function () {                                                            // 285
  var self = this;                                                                                                // 286
  self.invalidated = false;                                                                                       // 287
                                                                                                                  // 288
  var previous = Tracker.currentComputation;                                                                      // 289
  setCurrentComputation(self);                                                                                    // 290
  var previousInCompute = inCompute;                                                                              // 291
  inCompute = true;                                                                                               // 292
  try {                                                                                                           // 293
    withNoYieldsAllowed(self._func)(self);                                                                        // 294
  } finally {                                                                                                     // 295
    setCurrentComputation(previous);                                                                              // 296
    inCompute = previousInCompute;                                                                                // 297
  }                                                                                                               // 298
};                                                                                                                // 299
                                                                                                                  // 300
Tracker.Computation.prototype._needsRecompute = function () {                                                     // 301
  var self = this;                                                                                                // 302
  return self.invalidated && ! self.stopped;                                                                      // 303
};                                                                                                                // 304
                                                                                                                  // 305
Tracker.Computation.prototype._recompute = function () {                                                          // 306
  var self = this;                                                                                                // 307
                                                                                                                  // 308
  self._recomputing = true;                                                                                       // 309
  try {                                                                                                           // 310
    if (self._needsRecompute()) {                                                                                 // 311
      try {                                                                                                       // 312
        self._compute();                                                                                          // 313
      } catch (e) {                                                                                               // 314
        if (self._onError) {                                                                                      // 315
          self._onError(e);                                                                                       // 316
        } else {                                                                                                  // 317
          _throwOrLog("recompute", e);                                                                            // 318
        }                                                                                                         // 319
      }                                                                                                           // 320
    }                                                                                                             // 321
  } finally {                                                                                                     // 322
    self._recomputing = false;                                                                                    // 323
  }                                                                                                               // 324
};                                                                                                                // 325
                                                                                                                  // 326
//                                                                                                                // 327
// http://docs.meteor.com/#tracker_dependency                                                                     // 328
                                                                                                                  // 329
/**                                                                                                               // 330
 * @summary A Dependency represents an atomic unit of reactive data that a                                        // 331
 * computation might depend on. Reactive data sources such as Session or                                          // 332
 * Minimongo internally create different Dependency objects for different                                         // 333
 * pieces of data, each of which may be depended on by multiple computations.                                     // 334
 * When the data changes, the computations are invalidated.                                                       // 335
 * @class                                                                                                         // 336
 * @instanceName dependency                                                                                       // 337
 */                                                                                                               // 338
Tracker.Dependency = function () {                                                                                // 339
  this._dependentsById = {};                                                                                      // 340
};                                                                                                                // 341
                                                                                                                  // 342
// http://docs.meteor.com/#dependency_depend                                                                      // 343
//                                                                                                                // 344
// Adds `computation` to this set if it is not already                                                            // 345
// present.  Returns true if `computation` is a new member of the set.                                            // 346
// If no argument, defaults to currentComputation, or does nothing                                                // 347
// if there is no currentComputation.                                                                             // 348
                                                                                                                  // 349
/**                                                                                                               // 350
 * @summary Declares that the current computation (or `fromComputation` if given) depends on `dependency`.  The computation will be invalidated the next time `dependency` changes.
                                                                                                                  // 352
If there is no current computation and `depend()` is called with no arguments, it does nothing and returns false. // 353
                                                                                                                  // 354
Returns true if the computation is a new dependent of `dependency` rather than an existing one.                   // 355
 * @locus Client                                                                                                  // 356
 * @param {Tracker.Computation} [fromComputation] An optional computation declared to depend on `dependency` instead of the current computation.
 * @returns {Boolean}                                                                                             // 358
 */                                                                                                               // 359
Tracker.Dependency.prototype.depend = function (computation) {                                                    // 360
  if (! computation) {                                                                                            // 361
    if (! Tracker.active)                                                                                         // 362
      return false;                                                                                               // 363
                                                                                                                  // 364
    computation = Tracker.currentComputation;                                                                     // 365
  }                                                                                                               // 366
  var self = this;                                                                                                // 367
  var id = computation._id;                                                                                       // 368
  if (! (id in self._dependentsById)) {                                                                           // 369
    self._dependentsById[id] = computation;                                                                       // 370
    computation.onInvalidate(function () {                                                                        // 371
      delete self._dependentsById[id];                                                                            // 372
    });                                                                                                           // 373
    return true;                                                                                                  // 374
  }                                                                                                               // 375
  return false;                                                                                                   // 376
};                                                                                                                // 377
                                                                                                                  // 378
// http://docs.meteor.com/#dependency_changed                                                                     // 379
                                                                                                                  // 380
/**                                                                                                               // 381
 * @summary Invalidate all dependent computations immediately and remove them as dependents.                      // 382
 * @locus Client                                                                                                  // 383
 */                                                                                                               // 384
Tracker.Dependency.prototype.changed = function () {                                                              // 385
  var self = this;                                                                                                // 386
  for (var id in self._dependentsById)                                                                            // 387
    self._dependentsById[id].invalidate();                                                                        // 388
};                                                                                                                // 389
                                                                                                                  // 390
// http://docs.meteor.com/#dependency_hasdependents                                                               // 391
                                                                                                                  // 392
/**                                                                                                               // 393
 * @summary True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.
 * @locus Client                                                                                                  // 395
 * @returns {Boolean}                                                                                             // 396
 */                                                                                                               // 397
Tracker.Dependency.prototype.hasDependents = function () {                                                        // 398
  var self = this;                                                                                                // 399
  for(var id in self._dependentsById)                                                                             // 400
    return true;                                                                                                  // 401
  return false;                                                                                                   // 402
};                                                                                                                // 403
                                                                                                                  // 404
// http://docs.meteor.com/#tracker_flush                                                                          // 405
                                                                                                                  // 406
/**                                                                                                               // 407
 * @summary Process all reactive updates immediately and ensure that all invalidated computations are rerun.      // 408
 * @locus Client                                                                                                  // 409
 */                                                                                                               // 410
Tracker.flush = function (options) {                                                                              // 411
  Tracker._runFlush({ finishSynchronously: true,                                                                  // 412
                      throwFirstError: options && options._throwFirstError });                                    // 413
};                                                                                                                // 414
                                                                                                                  // 415
// Run all pending computations and afterFlush callbacks.  If we were not called                                  // 416
// directly via Tracker.flush, this may return before they're all done to allow                                   // 417
// the event loop to run a little before continuing.                                                              // 418
Tracker._runFlush = function (options) {                                                                          // 419
  // XXX What part of the comment below is still true? (We no longer                                              // 420
  // have Spark)                                                                                                  // 421
  //                                                                                                              // 422
  // Nested flush could plausibly happen if, say, a flush causes                                                  // 423
  // DOM mutation, which causes a "blur" event, which runs an                                                     // 424
  // app event handler that calls Tracker.flush.  At the moment                                                   // 425
  // Spark blocks event handlers during DOM mutation anyway,                                                      // 426
  // because the LiveRange tree isn't valid.  And we don't have                                                   // 427
  // any useful notion of a nested flush.                                                                         // 428
  //                                                                                                              // 429
  // https://app.asana.com/0/159908330244/385138233856                                                            // 430
  if (inFlush)                                                                                                    // 431
    throw new Error("Can't call Tracker.flush while flushing");                                                   // 432
                                                                                                                  // 433
  if (inCompute)                                                                                                  // 434
    throw new Error("Can't flush inside Tracker.autorun");                                                        // 435
                                                                                                                  // 436
  options = options || {};                                                                                        // 437
                                                                                                                  // 438
  inFlush = true;                                                                                                 // 439
  willFlush = true;                                                                                               // 440
  throwFirstError = !! options.throwFirstError;                                                                   // 441
                                                                                                                  // 442
  var recomputedCount = 0;                                                                                        // 443
  var finishedTry = false;                                                                                        // 444
  try {                                                                                                           // 445
    while (pendingComputations.length ||                                                                          // 446
           afterFlushCallbacks.length) {                                                                          // 447
                                                                                                                  // 448
      // recompute all pending computations                                                                       // 449
      while (pendingComputations.length) {                                                                        // 450
        var comp = pendingComputations.shift();                                                                   // 451
        comp._recompute();                                                                                        // 452
        if (comp._needsRecompute()) {                                                                             // 453
          pendingComputations.unshift(comp);                                                                      // 454
        }                                                                                                         // 455
                                                                                                                  // 456
        if (! options.finishSynchronously && ++recomputedCount > 1000) {                                          // 457
          finishedTry = true;                                                                                     // 458
          return;                                                                                                 // 459
        }                                                                                                         // 460
      }                                                                                                           // 461
                                                                                                                  // 462
      if (afterFlushCallbacks.length) {                                                                           // 463
        // call one afterFlush callback, which may                                                                // 464
        // invalidate more computations                                                                           // 465
        var func = afterFlushCallbacks.shift();                                                                   // 466
        try {                                                                                                     // 467
          func();                                                                                                 // 468
        } catch (e) {                                                                                             // 469
          _throwOrLog("afterFlush", e);                                                                           // 470
        }                                                                                                         // 471
      }                                                                                                           // 472
    }                                                                                                             // 473
    finishedTry = true;                                                                                           // 474
  } finally {                                                                                                     // 475
    if (! finishedTry) {                                                                                          // 476
      // we're erroring due to throwFirstError being true.                                                        // 477
      inFlush = false; // needed before calling `Tracker.flush()` again                                           // 478
      // finish flushing                                                                                          // 479
      Tracker._runFlush({                                                                                         // 480
        finishSynchronously: options.finishSynchronously,                                                         // 481
        throwFirstError: false                                                                                    // 482
      });                                                                                                         // 483
    }                                                                                                             // 484
    willFlush = false;                                                                                            // 485
    inFlush = false;                                                                                              // 486
    if (pendingComputations.length || afterFlushCallbacks.length) {                                               // 487
      // We're yielding because we ran a bunch of computations and we aren't                                      // 488
      // required to finish synchronously, so we'd like to give the event loop a                                  // 489
      // chance. We should flush again soon.                                                                      // 490
      if (options.finishSynchronously) {                                                                          // 491
        throw new Error("still have more to do?");  // shouldn't happen                                           // 492
      }                                                                                                           // 493
      setTimeout(requireFlush, 10);                                                                               // 494
    }                                                                                                             // 495
  }                                                                                                               // 496
};                                                                                                                // 497
                                                                                                                  // 498
// http://docs.meteor.com/#tracker_autorun                                                                        // 499
//                                                                                                                // 500
// Run f(). Record its dependencies. Rerun it whenever the                                                        // 501
// dependencies change.                                                                                           // 502
//                                                                                                                // 503
// Returns a new Computation, which is also passed to f.                                                          // 504
//                                                                                                                // 505
// Links the computation to the current computation                                                               // 506
// so that it is stopped if the current computation is invalidated.                                               // 507
                                                                                                                  // 508
/**                                                                                                               // 509
 * @callback Tracker.ComputationFunction                                                                          // 510
 * @param {Tracker.Computation}                                                                                   // 511
 */                                                                                                               // 512
/**                                                                                                               // 513
 * @summary Run a function now and rerun it later whenever its dependencies                                       // 514
 * change. Returns a Computation object that can be used to stop or observe the                                   // 515
 * rerunning.                                                                                                     // 516
 * @locus Client                                                                                                  // 517
 * @param {Tracker.ComputationFunction} runFunc The function to run. It receives                                  // 518
 * one argument: the Computation object that will be returned.                                                    // 519
 * @param {Object} [options]                                                                                      // 520
 * @param {Function} options.onError Optional. The function to run when an error                                  // 521
 * happens in the Computation. The only argument it recieves is the Error                                         // 522
 * thrown. Defaults to the error being logged to the console.                                                     // 523
 * @returns {Tracker.Computation}                                                                                 // 524
 */                                                                                                               // 525
Tracker.autorun = function (f, options) {                                                                         // 526
  if (typeof f !== 'function')                                                                                    // 527
    throw new Error('Tracker.autorun requires a function argument');                                              // 528
                                                                                                                  // 529
  options = options || {};                                                                                        // 530
                                                                                                                  // 531
  constructingComputation = true;                                                                                 // 532
  var c = new Tracker.Computation(                                                                                // 533
    f, Tracker.currentComputation, options.onError);                                                              // 534
                                                                                                                  // 535
  if (Tracker.active)                                                                                             // 536
    Tracker.onInvalidate(function () {                                                                            // 537
      c.stop();                                                                                                   // 538
    });                                                                                                           // 539
                                                                                                                  // 540
  return c;                                                                                                       // 541
};                                                                                                                // 542
                                                                                                                  // 543
// http://docs.meteor.com/#tracker_nonreactive                                                                    // 544
//                                                                                                                // 545
// Run `f` with no current computation, returning the return value                                                // 546
// of `f`.  Used to turn off reactivity for the duration of `f`,                                                  // 547
// so that reactive data sources accessed by `f` will not result in any                                           // 548
// computations being invalidated.                                                                                // 549
                                                                                                                  // 550
/**                                                                                                               // 551
 * @summary Run a function without tracking dependencies.                                                         // 552
 * @locus Client                                                                                                  // 553
 * @param {Function} func A function to call immediately.                                                         // 554
 */                                                                                                               // 555
Tracker.nonreactive = function (f) {                                                                              // 556
  var previous = Tracker.currentComputation;                                                                      // 557
  setCurrentComputation(null);                                                                                    // 558
  try {                                                                                                           // 559
    return f();                                                                                                   // 560
  } finally {                                                                                                     // 561
    setCurrentComputation(previous);                                                                              // 562
  }                                                                                                               // 563
};                                                                                                                // 564
                                                                                                                  // 565
// http://docs.meteor.com/#tracker_oninvalidate                                                                   // 566
                                                                                                                  // 567
/**                                                                                                               // 568
 * @summary Registers a new [`onInvalidate`](#computation_oninvalidate) callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.
 * @locus Client                                                                                                  // 570
 * @param {Function} callback A callback function that will be invoked as `func(c)`, where `c` is the computation on which the callback is registered.
 */                                                                                                               // 572
Tracker.onInvalidate = function (f) {                                                                             // 573
  if (! Tracker.active)                                                                                           // 574
    throw new Error("Tracker.onInvalidate requires a currentComputation");                                        // 575
                                                                                                                  // 576
  Tracker.currentComputation.onInvalidate(f);                                                                     // 577
};                                                                                                                // 578
                                                                                                                  // 579
// http://docs.meteor.com/#tracker_afterflush                                                                     // 580
                                                                                                                  // 581
/**                                                                                                               // 582
 * @summary Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun.  The function will be run once and not on subsequent flushes unless `afterFlush` is called again.
 * @locus Client                                                                                                  // 584
 * @param {Function} callback A function to call at flush time.                                                   // 585
 */                                                                                                               // 586
Tracker.afterFlush = function (f) {                                                                               // 587
  afterFlushCallbacks.push(f);                                                                                    // 588
  requireFlush();                                                                                                 // 589
};                                                                                                                // 590
                                                                                                                  // 591
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tracker/deprecated.js                                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
// Deprecated functions.                                                                                          // 1
                                                                                                                  // 2
// These functions used to be on the Meteor object (and worked slightly                                           // 3
// differently).                                                                                                  // 4
// XXX COMPAT WITH 0.5.7                                                                                          // 5
Meteor.flush = Tracker.flush;                                                                                     // 6
Meteor.autorun = Tracker.autorun;                                                                                 // 7
                                                                                                                  // 8
// We used to require a special "autosubscribe" call to reactively subscribe to                                   // 9
// things. Now, it works with autorun.                                                                            // 10
// XXX COMPAT WITH 0.5.4                                                                                          // 11
Meteor.autosubscribe = Tracker.autorun;                                                                           // 12
                                                                                                                  // 13
// This Tracker API briefly existed in 0.5.8 and 0.5.9                                                            // 14
// XXX COMPAT WITH 0.5.9                                                                                          // 15
Tracker.depend = function (d) {                                                                                   // 16
  return d.depend();                                                                                              // 17
};                                                                                                                // 18
                                                                                                                  // 19
Deps = Tracker;                                                                                                   // 20
                                                                                                                  // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.tracker = {
  Tracker: Tracker,
  Deps: Deps
};

})();

//# sourceMappingURL=tracker.js.map
