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
var JSON = Package.json.JSON;
var EJSON = Package.ejson.EJSON;
var IdMap = Package['id-map'].IdMap;
var OrderedDict = Package['ordered-dict'].OrderedDict;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Random = Package.random.Random;
var GeoJSON = Package['geojson-utils'].GeoJSON;

/* Package-scope variables */
var LocalCollection, Minimongo, MinimongoTest, MinimongoError, isArray, isPlainObject, isIndexable, isOperatorObject, isNumericKey, regexpElementMatcher, equalityElementMatcher, ELEMENT_OPERATORS, makeLookupFunction, expandArraysInBranches, projectionDetails, pathsToTree;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/minimongo.js                                                                           //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// XXX type checking on selectors (graceful error if malformed)                                              // 1
                                                                                                             // 2
// LocalCollection: a set of documents that supports queries and modifiers.                                  // 3
                                                                                                             // 4
// Cursor: a specification for a particular subset of documents, w/                                          // 5
// a defined order, limit, and offset.  creating a Cursor with LocalCollection.find(),                       // 6
                                                                                                             // 7
// ObserveHandle: the return value of a live query.                                                          // 8
                                                                                                             // 9
LocalCollection = function (name) {                                                                          // 10
  var self = this;                                                                                           // 11
  self.name = name;                                                                                          // 12
  // _id -> document (also containing id)                                                                    // 13
  self._docs = new LocalCollection._IdMap;                                                                   // 14
                                                                                                             // 15
  self._observeQueue = new Meteor._SynchronousQueue();                                                       // 16
                                                                                                             // 17
  self.next_qid = 1; // live query id generator                                                              // 18
                                                                                                             // 19
  // qid -> live query object. keys:                                                                         // 20
  //  ordered: bool. ordered queries have addedBefore/movedBefore callbacks.                                 // 21
  //  results: array (ordered) or object (unordered) of current results                                      // 22
  //    (aliased with self._docs!)                                                                           // 23
  //  resultsSnapshot: snapshot of results. null if not paused.                                              // 24
  //  cursor: Cursor object for the query.                                                                   // 25
  //  selector, sorter, (callbacks): functions                                                               // 26
  self.queries = {};                                                                                         // 27
                                                                                                             // 28
  // null if not saving originals; an IdMap from id to original document value if                            // 29
  // saving originals. See comments before saveOriginals().                                                  // 30
  self._savedOriginals = null;                                                                               // 31
                                                                                                             // 32
  // True when observers are paused and we should not send callbacks.                                        // 33
  self.paused = false;                                                                                       // 34
};                                                                                                           // 35
                                                                                                             // 36
Minimongo = {};                                                                                              // 37
                                                                                                             // 38
// Object exported only for unit testing.                                                                    // 39
// Use it to export private functions to test in Tinytest.                                                   // 40
MinimongoTest = {};                                                                                          // 41
                                                                                                             // 42
LocalCollection._applyChanges = function (doc, changeFields) {                                               // 43
  _.each(changeFields, function (value, key) {                                                               // 44
    if (value === undefined)                                                                                 // 45
      delete doc[key];                                                                                       // 46
    else                                                                                                     // 47
      doc[key] = value;                                                                                      // 48
  });                                                                                                        // 49
};                                                                                                           // 50
                                                                                                             // 51
MinimongoError = function (message) {                                                                        // 52
  var e = new Error(message);                                                                                // 53
  e.name = "MinimongoError";                                                                                 // 54
  return e;                                                                                                  // 55
};                                                                                                           // 56
                                                                                                             // 57
                                                                                                             // 58
// options may include sort, skip, limit, reactive                                                           // 59
// sort may be any of these forms:                                                                           // 60
//     {a: 1, b: -1}                                                                                         // 61
//     [["a", "asc"], ["b", "desc"]]                                                                         // 62
//     ["a", ["b", "desc"]]                                                                                  // 63
//   (in the first form you're beholden to key enumeration order in                                          // 64
//   your javascript VM)                                                                                     // 65
//                                                                                                           // 66
// reactive: if given, and false, don't register with Tracker (default                                       // 67
// is true)                                                                                                  // 68
//                                                                                                           // 69
// XXX possibly should support retrieving a subset of fields? and                                            // 70
// have it be a hint (ignored on the client, when not copying the                                            // 71
// doc?)                                                                                                     // 72
//                                                                                                           // 73
// XXX sort does not yet support subkeys ('a.b') .. fix that!                                                // 74
// XXX add one more sort form: "key"                                                                         // 75
// XXX tests                                                                                                 // 76
LocalCollection.prototype.find = function (selector, options) {                                              // 77
  // default syntax for everything is to omit the selector argument.                                         // 78
  // but if selector is explicitly passed in as false or undefined, we                                       // 79
  // want a selector that matches nothing.                                                                   // 80
  if (arguments.length === 0)                                                                                // 81
    selector = {};                                                                                           // 82
                                                                                                             // 83
  return new LocalCollection.Cursor(this, selector, options);                                                // 84
};                                                                                                           // 85
                                                                                                             // 86
// don't call this ctor directly.  use LocalCollection.find().                                               // 87
                                                                                                             // 88
LocalCollection.Cursor = function (collection, selector, options) {                                          // 89
  var self = this;                                                                                           // 90
  if (!options) options = {};                                                                                // 91
                                                                                                             // 92
  self.collection = collection;                                                                              // 93
  self.sorter = null;                                                                                        // 94
                                                                                                             // 95
  if (LocalCollection._selectorIsId(selector)) {                                                             // 96
    // stash for fast path                                                                                   // 97
    self._selectorId = selector;                                                                             // 98
    self.matcher = new Minimongo.Matcher(selector);                                                          // 99
  } else {                                                                                                   // 100
    self._selectorId = undefined;                                                                            // 101
    self.matcher = new Minimongo.Matcher(selector);                                                          // 102
    if (self.matcher.hasGeoQuery() || options.sort) {                                                        // 103
      self.sorter = new Minimongo.Sorter(options.sort || [],                                                 // 104
                                         { matcher: self.matcher });                                         // 105
    }                                                                                                        // 106
  }                                                                                                          // 107
  self.skip = options.skip;                                                                                  // 108
  self.limit = options.limit;                                                                                // 109
  self.fields = options.fields;                                                                              // 110
                                                                                                             // 111
  self._projectionFn = LocalCollection._compileProjection(self.fields || {});                                // 112
                                                                                                             // 113
  self._transform = LocalCollection.wrapTransform(options.transform);                                        // 114
                                                                                                             // 115
  // by default, queries register w/ Tracker when it is available.                                           // 116
  if (typeof Tracker !== "undefined")                                                                        // 117
    self.reactive = (options.reactive === undefined) ? true : options.reactive;                              // 118
};                                                                                                           // 119
                                                                                                             // 120
// Since we don't actually have a "nextObject" interface, there's really no                                  // 121
// reason to have a "rewind" interface.  All it did was make multiple calls                                  // 122
// to fetch/map/forEach return nothing the second time.                                                      // 123
// XXX COMPAT WITH 0.8.1                                                                                     // 124
LocalCollection.Cursor.prototype.rewind = function () {                                                      // 125
};                                                                                                           // 126
                                                                                                             // 127
LocalCollection.prototype.findOne = function (selector, options) {                                           // 128
  if (arguments.length === 0)                                                                                // 129
    selector = {};                                                                                           // 130
                                                                                                             // 131
  // NOTE: by setting limit 1 here, we end up using very inefficient                                         // 132
  // code that recomputes the whole query on each update. The upside is                                      // 133
  // that when you reactively depend on a findOne you only get                                               // 134
  // invalidated when the found object changes, not any object in the                                        // 135
  // collection. Most findOne will be by id, which has a fast path, so                                       // 136
  // this might not be a big deal. In most cases, invalidation causes                                        // 137
  // the called to re-query anyway, so this should be a net performance                                      // 138
  // improvement.                                                                                            // 139
  options = options || {};                                                                                   // 140
  options.limit = 1;                                                                                         // 141
                                                                                                             // 142
  return this.find(selector, options).fetch()[0];                                                            // 143
};                                                                                                           // 144
                                                                                                             // 145
/**                                                                                                          // 146
 * @callback IterationCallback                                                                               // 147
 * @param {Object} doc                                                                                       // 148
 * @param {Number} index                                                                                     // 149
 */                                                                                                          // 150
/**                                                                                                          // 151
 * @summary Call `callback` once for each matching document, sequentially and synchronously.                 // 152
 * @locus Anywhere                                                                                           // 153
 * @method  forEach                                                                                          // 154
 * @instance                                                                                                 // 155
 * @memberOf Mongo.Cursor                                                                                    // 156
 * @param {IterationCallback} callback Function to call. It will be called with three arguments: the document, a 0-based index, and <em>cursor</em> itself.
 * @param {Any} [thisArg] An object which will be the value of `this` inside `callback`.                     // 158
 */                                                                                                          // 159
LocalCollection.Cursor.prototype.forEach = function (callback, thisArg) {                                    // 160
  var self = this;                                                                                           // 161
                                                                                                             // 162
  var objects = self._getRawObjects({ordered: true});                                                        // 163
                                                                                                             // 164
  if (self.reactive) {                                                                                       // 165
    self._depend({                                                                                           // 166
      addedBefore: true,                                                                                     // 167
      removed: true,                                                                                         // 168
      changed: true,                                                                                         // 169
      movedBefore: true});                                                                                   // 170
  }                                                                                                          // 171
                                                                                                             // 172
  _.each(objects, function (elt, i) {                                                                        // 173
    // This doubles as a clone operation.                                                                    // 174
    elt = self._projectionFn(elt);                                                                           // 175
                                                                                                             // 176
    if (self._transform)                                                                                     // 177
      elt = self._transform(elt);                                                                            // 178
    callback.call(thisArg, elt, i, self);                                                                    // 179
  });                                                                                                        // 180
};                                                                                                           // 181
                                                                                                             // 182
LocalCollection.Cursor.prototype.getTransform = function () {                                                // 183
  return this._transform;                                                                                    // 184
};                                                                                                           // 185
                                                                                                             // 186
/**                                                                                                          // 187
 * @summary Map callback over all matching documents.  Returns an Array.                                     // 188
 * @locus Anywhere                                                                                           // 189
 * @method map                                                                                               // 190
 * @instance                                                                                                 // 191
 * @memberOf Mongo.Cursor                                                                                    // 192
 * @param {IterationCallback} callback Function to call. It will be called with three arguments: the document, a 0-based index, and <em>cursor</em> itself.
 * @param {Any} [thisArg] An object which will be the value of `this` inside `callback`.                     // 194
 */                                                                                                          // 195
LocalCollection.Cursor.prototype.map = function (callback, thisArg) {                                        // 196
  var self = this;                                                                                           // 197
  var res = [];                                                                                              // 198
  self.forEach(function (doc, index) {                                                                       // 199
    res.push(callback.call(thisArg, doc, index, self));                                                      // 200
  });                                                                                                        // 201
  return res;                                                                                                // 202
};                                                                                                           // 203
                                                                                                             // 204
/**                                                                                                          // 205
 * @summary Return all matching documents as an Array.                                                       // 206
 * @memberOf Mongo.Cursor                                                                                    // 207
 * @method  fetch                                                                                            // 208
 * @instance                                                                                                 // 209
 * @locus Anywhere                                                                                           // 210
 * @returns {Object[]}                                                                                       // 211
 */                                                                                                          // 212
LocalCollection.Cursor.prototype.fetch = function () {                                                       // 213
  var self = this;                                                                                           // 214
  var res = [];                                                                                              // 215
  self.forEach(function (doc) {                                                                              // 216
    res.push(doc);                                                                                           // 217
  });                                                                                                        // 218
  return res;                                                                                                // 219
};                                                                                                           // 220
                                                                                                             // 221
/**                                                                                                          // 222
 * @summary Returns the number of documents that match a query.                                              // 223
 * @memberOf Mongo.Cursor                                                                                    // 224
 * @method  count                                                                                            // 225
 * @instance                                                                                                 // 226
 * @locus Anywhere                                                                                           // 227
 * @returns {Number}                                                                                         // 228
 */                                                                                                          // 229
LocalCollection.Cursor.prototype.count = function () {                                                       // 230
  var self = this;                                                                                           // 231
                                                                                                             // 232
  if (self.reactive)                                                                                         // 233
    self._depend({added: true, removed: true},                                                               // 234
                 true /* allow the observe to be unordered */);                                              // 235
                                                                                                             // 236
  return self._getRawObjects({ordered: true}).length;                                                        // 237
};                                                                                                           // 238
                                                                                                             // 239
LocalCollection.Cursor.prototype._publishCursor = function (sub) {                                           // 240
  var self = this;                                                                                           // 241
  if (! self.collection.name)                                                                                // 242
    throw new Error("Can't publish a cursor from a collection without a name.");                             // 243
  var collection = self.collection.name;                                                                     // 244
                                                                                                             // 245
  // XXX minimongo should not depend on mongo-livedata!                                                      // 246
  return Mongo.Collection._publishCursor(self, sub, collection);                                             // 247
};                                                                                                           // 248
                                                                                                             // 249
LocalCollection.Cursor.prototype._getCollectionName = function () {                                          // 250
  var self = this;                                                                                           // 251
  return self.collection.name;                                                                               // 252
};                                                                                                           // 253
                                                                                                             // 254
LocalCollection._observeChangesCallbacksAreOrdered = function (callbacks) {                                  // 255
  if (callbacks.added && callbacks.addedBefore)                                                              // 256
    throw new Error("Please specify only one of added() and addedBefore()");                                 // 257
  return !!(callbacks.addedBefore || callbacks.movedBefore);                                                 // 258
};                                                                                                           // 259
                                                                                                             // 260
LocalCollection._observeCallbacksAreOrdered = function (callbacks) {                                         // 261
  if (callbacks.addedAt && callbacks.added)                                                                  // 262
    throw new Error("Please specify only one of added() and addedAt()");                                     // 263
  if (callbacks.changedAt && callbacks.changed)                                                              // 264
    throw new Error("Please specify only one of changed() and changedAt()");                                 // 265
  if (callbacks.removed && callbacks.removedAt)                                                              // 266
    throw new Error("Please specify only one of removed() and removedAt()");                                 // 267
                                                                                                             // 268
  return !!(callbacks.addedAt || callbacks.movedTo || callbacks.changedAt                                    // 269
            || callbacks.removedAt);                                                                         // 270
};                                                                                                           // 271
                                                                                                             // 272
// the handle that comes back from observe.                                                                  // 273
LocalCollection.ObserveHandle = function () {};                                                              // 274
                                                                                                             // 275
// options to contain:                                                                                       // 276
//  * callbacks for observe():                                                                               // 277
//    - addedAt (document, atIndex)                                                                          // 278
//    - added (document)                                                                                     // 279
//    - changedAt (newDocument, oldDocument, atIndex)                                                        // 280
//    - changed (newDocument, oldDocument)                                                                   // 281
//    - removedAt (document, atIndex)                                                                        // 282
//    - removed (document)                                                                                   // 283
//    - movedTo (document, oldIndex, newIndex)                                                               // 284
//                                                                                                           // 285
// attributes available on returned query handle:                                                            // 286
//  * stop(): end updates                                                                                    // 287
//  * collection: the collection this query is querying                                                      // 288
//                                                                                                           // 289
// iff x is a returned query handle, (x instanceof                                                           // 290
// LocalCollection.ObserveHandle) is true                                                                    // 291
//                                                                                                           // 292
// initial results delivered through added callback                                                          // 293
// XXX maybe callbacks should take a list of objects, to expose transactions?                                // 294
// XXX maybe support field limiting (to limit what you're notified on)                                       // 295
                                                                                                             // 296
_.extend(LocalCollection.Cursor.prototype, {                                                                 // 297
  /**                                                                                                        // 298
   * @summary Watch a query.  Receive callbacks as the result set changes.                                   // 299
   * @locus Anywhere                                                                                         // 300
   * @memberOf Mongo.Cursor                                                                                  // 301
   * @instance                                                                                               // 302
   * @param {Object} callbacks Functions to call to deliver the result set as it changes                     // 303
   */                                                                                                        // 304
  observe: function (options) {                                                                              // 305
    var self = this;                                                                                         // 306
    return LocalCollection._observeFromObserveChanges(self, options);                                        // 307
  },                                                                                                         // 308
                                                                                                             // 309
  /**                                                                                                        // 310
   * @summary Watch a query.  Receive callbacks as the result set changes.  Only the differences between the old and new documents are passed to the callbacks.
   * @locus Anywhere                                                                                         // 312
   * @memberOf Mongo.Cursor                                                                                  // 313
   * @instance                                                                                               // 314
   * @param {Object} callbacks Functions to call to deliver the result set as it changes                     // 315
   */                                                                                                        // 316
  observeChanges: function (options) {                                                                       // 317
    var self = this;                                                                                         // 318
                                                                                                             // 319
    var ordered = LocalCollection._observeChangesCallbacksAreOrdered(options);                               // 320
                                                                                                             // 321
    // there are several places that assume you aren't combining skip/limit with                             // 322
    // unordered observe.  eg, update's EJSON.clone, and the "there are several"                             // 323
    // comment in _modifyAndNotify                                                                           // 324
    // XXX allow skip/limit with unordered observe                                                           // 325
    if (!options._allow_unordered && !ordered && (self.skip || self.limit))                                  // 326
      throw new Error("must use ordered observe (ie, 'addedBefore' instead of 'added') with skip or limit"); // 327
                                                                                                             // 328
    if (self.fields && (self.fields._id === 0 || self.fields._id === false))                                 // 329
      throw Error("You may not observe a cursor with {fields: {_id: 0}}");                                   // 330
                                                                                                             // 331
    var query = {                                                                                            // 332
      matcher: self.matcher, // not fast pathed                                                              // 333
      sorter: ordered && self.sorter,                                                                        // 334
      distances: (                                                                                           // 335
        self.matcher.hasGeoQuery() && ordered && new LocalCollection._IdMap),                                // 336
      resultsSnapshot: null,                                                                                 // 337
      ordered: ordered,                                                                                      // 338
      cursor: self,                                                                                          // 339
      projectionFn: self._projectionFn                                                                       // 340
    };                                                                                                       // 341
    var qid;                                                                                                 // 342
                                                                                                             // 343
    // Non-reactive queries call added[Before] and then never call anything                                  // 344
    // else.                                                                                                 // 345
    if (self.reactive) {                                                                                     // 346
      qid = self.collection.next_qid++;                                                                      // 347
      self.collection.queries[qid] = query;                                                                  // 348
    }                                                                                                        // 349
    query.results = self._getRawObjects({                                                                    // 350
      ordered: ordered, distances: query.distances});                                                        // 351
    if (self.collection.paused)                                                                              // 352
      query.resultsSnapshot = (ordered ? [] : new LocalCollection._IdMap);                                   // 353
                                                                                                             // 354
    // wrap callbacks we were passed. callbacks only fire when not paused and                                // 355
    // are never undefined                                                                                   // 356
    // Filters out blacklisted fields according to cursor's projection.                                      // 357
    // XXX wrong place for this?                                                                             // 358
                                                                                                             // 359
    // furthermore, callbacks enqueue until the operation we're working on is                                // 360
    // done.                                                                                                 // 361
    var wrapCallback = function (f) {                                                                        // 362
      if (!f)                                                                                                // 363
        return function () {};                                                                               // 364
      return function (/*args*/) {                                                                           // 365
        var context = this;                                                                                  // 366
        var args = arguments;                                                                                // 367
                                                                                                             // 368
        if (self.collection.paused)                                                                          // 369
          return;                                                                                            // 370
                                                                                                             // 371
        self.collection._observeQueue.queueTask(function () {                                                // 372
          f.apply(context, args);                                                                            // 373
        });                                                                                                  // 374
      };                                                                                                     // 375
    };                                                                                                       // 376
    query.added = wrapCallback(options.added);                                                               // 377
    query.changed = wrapCallback(options.changed);                                                           // 378
    query.removed = wrapCallback(options.removed);                                                           // 379
    if (ordered) {                                                                                           // 380
      query.addedBefore = wrapCallback(options.addedBefore);                                                 // 381
      query.movedBefore = wrapCallback(options.movedBefore);                                                 // 382
    }                                                                                                        // 383
                                                                                                             // 384
    if (!options._suppress_initial && !self.collection.paused) {                                             // 385
      // XXX unify ordered and unordered interface                                                           // 386
      var each = ordered                                                                                     // 387
            ? _.bind(_.each, null, query.results)                                                            // 388
            : _.bind(query.results.forEach, query.results);                                                  // 389
      each(function (doc) {                                                                                  // 390
        var fields = EJSON.clone(doc);                                                                       // 391
                                                                                                             // 392
        delete fields._id;                                                                                   // 393
        if (ordered)                                                                                         // 394
          query.addedBefore(doc._id, self._projectionFn(fields), null);                                      // 395
        query.added(doc._id, self._projectionFn(fields));                                                    // 396
      });                                                                                                    // 397
    }                                                                                                        // 398
                                                                                                             // 399
    var handle = new LocalCollection.ObserveHandle;                                                          // 400
    _.extend(handle, {                                                                                       // 401
      collection: self.collection,                                                                           // 402
      stop: function () {                                                                                    // 403
        if (self.reactive)                                                                                   // 404
          delete self.collection.queries[qid];                                                               // 405
      }                                                                                                      // 406
    });                                                                                                      // 407
                                                                                                             // 408
    if (self.reactive && Tracker.active) {                                                                   // 409
      // XXX in many cases, the same observe will be recreated when                                          // 410
      // the current autorun is rerun.  we could save work by                                                // 411
      // letting it linger across rerun and potentially get                                                  // 412
      // repurposed if the same observe is performed, using logic                                            // 413
      // similar to that of Meteor.subscribe.                                                                // 414
      Tracker.onInvalidate(function () {                                                                     // 415
        handle.stop();                                                                                       // 416
      });                                                                                                    // 417
    }                                                                                                        // 418
    // run the observe callbacks resulting from the initial contents                                         // 419
    // before we leave the observe.                                                                          // 420
    self.collection._observeQueue.drain();                                                                   // 421
                                                                                                             // 422
    return handle;                                                                                           // 423
  }                                                                                                          // 424
});                                                                                                          // 425
                                                                                                             // 426
// Returns a collection of matching objects, but doesn't deep copy them.                                     // 427
//                                                                                                           // 428
// If ordered is set, returns a sorted array, respecting sorter, skip, and limit                             // 429
// properties of the query.  if sorter is falsey, no sort -- you get the natural                             // 430
// order.                                                                                                    // 431
//                                                                                                           // 432
// If ordered is not set, returns an object mapping from ID to doc (sorter, skip                             // 433
// and limit should not be set).                                                                             // 434
//                                                                                                           // 435
// If ordered is set and this cursor is a $near geoquery, then this function                                 // 436
// will use an _IdMap to track each distance from the $near argument point in                                // 437
// order to use it as a sort key. If an _IdMap is passed in the 'distances'                                  // 438
// argument, this function will clear it and use it for this purpose (otherwise                              // 439
// it will just create its own _IdMap). The observeChanges implementation uses                               // 440
// this to remember the distances after this function returns.                                               // 441
LocalCollection.Cursor.prototype._getRawObjects = function (options) {                                       // 442
  var self = this;                                                                                           // 443
  options = options || {};                                                                                   // 444
                                                                                                             // 445
  // XXX use OrderedDict instead of array, and make IdMap and OrderedDict                                    // 446
  // compatible                                                                                              // 447
  var results = options.ordered ? [] : new LocalCollection._IdMap;                                           // 448
                                                                                                             // 449
  // fast path for single ID value                                                                           // 450
  if (self._selectorId !== undefined) {                                                                      // 451
    // If you have non-zero skip and ask for a single id, you get                                            // 452
    // nothing. This is so it matches the behavior of the '{_id: foo}'                                       // 453
    // path.                                                                                                 // 454
    if (self.skip)                                                                                           // 455
      return results;                                                                                        // 456
                                                                                                             // 457
    var selectedDoc = self.collection._docs.get(self._selectorId);                                           // 458
    if (selectedDoc) {                                                                                       // 459
      if (options.ordered)                                                                                   // 460
        results.push(selectedDoc);                                                                           // 461
      else                                                                                                   // 462
        results.set(self._selectorId, selectedDoc);                                                          // 463
    }                                                                                                        // 464
    return results;                                                                                          // 465
  }                                                                                                          // 466
                                                                                                             // 467
  // slow path for arbitrary selector, sort, skip, limit                                                     // 468
                                                                                                             // 469
  // in the observeChanges case, distances is actually part of the "query" (ie,                              // 470
  // live results set) object.  in other cases, distances is only used inside                                // 471
  // this function.                                                                                          // 472
  var distances;                                                                                             // 473
  if (self.matcher.hasGeoQuery() && options.ordered) {                                                       // 474
    if (options.distances) {                                                                                 // 475
      distances = options.distances;                                                                         // 476
      distances.clear();                                                                                     // 477
    } else {                                                                                                 // 478
      distances = new LocalCollection._IdMap();                                                              // 479
    }                                                                                                        // 480
  }                                                                                                          // 481
                                                                                                             // 482
  self.collection._docs.forEach(function (doc, id) {                                                         // 483
    var matchResult = self.matcher.documentMatches(doc);                                                     // 484
    if (matchResult.result) {                                                                                // 485
      if (options.ordered) {                                                                                 // 486
        results.push(doc);                                                                                   // 487
        if (distances && matchResult.distance !== undefined)                                                 // 488
          distances.set(id, matchResult.distance);                                                           // 489
      } else {                                                                                               // 490
        results.set(id, doc);                                                                                // 491
      }                                                                                                      // 492
    }                                                                                                        // 493
    // Fast path for limited unsorted queries.                                                               // 494
    // XXX 'length' check here seems wrong for ordered                                                       // 495
    if (self.limit && !self.skip && !self.sorter &&                                                          // 496
        results.length === self.limit)                                                                       // 497
      return false;  // break                                                                                // 498
    return true;  // continue                                                                                // 499
  });                                                                                                        // 500
                                                                                                             // 501
  if (!options.ordered)                                                                                      // 502
    return results;                                                                                          // 503
                                                                                                             // 504
  if (self.sorter) {                                                                                         // 505
    var comparator = self.sorter.getComparator({distances: distances});                                      // 506
    results.sort(comparator);                                                                                // 507
  }                                                                                                          // 508
                                                                                                             // 509
  var idx_start = self.skip || 0;                                                                            // 510
  var idx_end = self.limit ? (self.limit + idx_start) : results.length;                                      // 511
  return results.slice(idx_start, idx_end);                                                                  // 512
};                                                                                                           // 513
                                                                                                             // 514
// XXX Maybe we need a version of observe that just calls a callback if                                      // 515
// anything changed.                                                                                         // 516
LocalCollection.Cursor.prototype._depend = function (changers, _allow_unordered) {                           // 517
  var self = this;                                                                                           // 518
                                                                                                             // 519
  if (Tracker.active) {                                                                                      // 520
    var v = new Tracker.Dependency;                                                                          // 521
    v.depend();                                                                                              // 522
    var notifyChange = _.bind(v.changed, v);                                                                 // 523
                                                                                                             // 524
    var options = {                                                                                          // 525
      _suppress_initial: true,                                                                               // 526
      _allow_unordered: _allow_unordered                                                                     // 527
    };                                                                                                       // 528
    _.each(['added', 'changed', 'removed', 'addedBefore', 'movedBefore'],                                    // 529
           function (fnName) {                                                                               // 530
             if (changers[fnName])                                                                           // 531
               options[fnName] = notifyChange;                                                               // 532
           });                                                                                               // 533
                                                                                                             // 534
    // observeChanges will stop() when this computation is invalidated                                       // 535
    self.observeChanges(options);                                                                            // 536
  }                                                                                                          // 537
};                                                                                                           // 538
                                                                                                             // 539
// XXX enforce rule that field names can't start with '$' or contain '.'                                     // 540
// (real mongodb does in fact enforce this)                                                                  // 541
// XXX possibly enforce that 'undefined' does not appear (we assume                                          // 542
// this in our handling of null and $exists)                                                                 // 543
LocalCollection.prototype.insert = function (doc, callback) {                                                // 544
  var self = this;                                                                                           // 545
  doc = EJSON.clone(doc);                                                                                    // 546
                                                                                                             // 547
  if (!_.has(doc, '_id')) {                                                                                  // 548
    // if you really want to use ObjectIDs, set this global.                                                 // 549
    // Mongo.Collection specifies its own ids and does not use this code.                                    // 550
    doc._id = LocalCollection._useOID ? new LocalCollection._ObjectID()                                      // 551
                                      : Random.id();                                                         // 552
  }                                                                                                          // 553
  var id = doc._id;                                                                                          // 554
                                                                                                             // 555
  if (self._docs.has(id))                                                                                    // 556
    throw MinimongoError("Duplicate _id '" + id + "'");                                                      // 557
                                                                                                             // 558
  self._saveOriginal(id, undefined);                                                                         // 559
  self._docs.set(id, doc);                                                                                   // 560
                                                                                                             // 561
  var queriesToRecompute = [];                                                                               // 562
  // trigger live queries that match                                                                         // 563
  for (var qid in self.queries) {                                                                            // 564
    var query = self.queries[qid];                                                                           // 565
    var matchResult = query.matcher.documentMatches(doc);                                                    // 566
    if (matchResult.result) {                                                                                // 567
      if (query.distances && matchResult.distance !== undefined)                                             // 568
        query.distances.set(id, matchResult.distance);                                                       // 569
      if (query.cursor.skip || query.cursor.limit)                                                           // 570
        queriesToRecompute.push(qid);                                                                        // 571
      else                                                                                                   // 572
        LocalCollection._insertInResults(query, doc);                                                        // 573
    }                                                                                                        // 574
  }                                                                                                          // 575
                                                                                                             // 576
  _.each(queriesToRecompute, function (qid) {                                                                // 577
    if (self.queries[qid])                                                                                   // 578
      self._recomputeResults(self.queries[qid]);                                                             // 579
  });                                                                                                        // 580
  self._observeQueue.drain();                                                                                // 581
                                                                                                             // 582
  // Defer because the caller likely doesn't expect the callback to be run                                   // 583
  // immediately.                                                                                            // 584
  if (callback)                                                                                              // 585
    Meteor.defer(function () {                                                                               // 586
      callback(null, id);                                                                                    // 587
    });                                                                                                      // 588
  return id;                                                                                                 // 589
};                                                                                                           // 590
                                                                                                             // 591
// Iterates over a subset of documents that could match selector; calls                                      // 592
// f(doc, id) on each of them.  Specifically, if selector specifies                                          // 593
// specific _id's, it only looks at those.  doc is *not* cloned: it is the                                   // 594
// same object that is in _docs.                                                                             // 595
LocalCollection.prototype._eachPossiblyMatchingDoc = function (selector, f) {                                // 596
  var self = this;                                                                                           // 597
  var specificIds = LocalCollection._idsMatchedBySelector(selector);                                         // 598
  if (specificIds) {                                                                                         // 599
    for (var i = 0; i < specificIds.length; ++i) {                                                           // 600
      var id = specificIds[i];                                                                               // 601
      var doc = self._docs.get(id);                                                                          // 602
      if (doc) {                                                                                             // 603
        var breakIfFalse = f(doc, id);                                                                       // 604
        if (breakIfFalse === false)                                                                          // 605
          break;                                                                                             // 606
      }                                                                                                      // 607
    }                                                                                                        // 608
  } else {                                                                                                   // 609
    self._docs.forEach(f);                                                                                   // 610
  }                                                                                                          // 611
};                                                                                                           // 612
                                                                                                             // 613
LocalCollection.prototype.remove = function (selector, callback) {                                           // 614
  var self = this;                                                                                           // 615
                                                                                                             // 616
  // Easy special case: if we're not calling observeChanges callbacks and we're                              // 617
  // not saving originals and we got asked to remove everything, then just empty                             // 618
  // everything directly.                                                                                    // 619
  if (self.paused && !self._savedOriginals && EJSON.equals(selector, {})) {                                  // 620
    var result = self._docs.size();                                                                          // 621
    self._docs.clear();                                                                                      // 622
    _.each(self.queries, function (query) {                                                                  // 623
      if (query.ordered) {                                                                                   // 624
        query.results = [];                                                                                  // 625
      } else {                                                                                               // 626
        query.results.clear();                                                                               // 627
      }                                                                                                      // 628
    });                                                                                                      // 629
    if (callback) {                                                                                          // 630
      Meteor.defer(function () {                                                                             // 631
        callback(null, result);                                                                              // 632
      });                                                                                                    // 633
    }                                                                                                        // 634
    return result;                                                                                           // 635
  }                                                                                                          // 636
                                                                                                             // 637
  var matcher = new Minimongo.Matcher(selector);                                                             // 638
  var remove = [];                                                                                           // 639
  self._eachPossiblyMatchingDoc(selector, function (doc, id) {                                               // 640
    if (matcher.documentMatches(doc).result)                                                                 // 641
      remove.push(id);                                                                                       // 642
  });                                                                                                        // 643
                                                                                                             // 644
  var queriesToRecompute = [];                                                                               // 645
  var queryRemove = [];                                                                                      // 646
  for (var i = 0; i < remove.length; i++) {                                                                  // 647
    var removeId = remove[i];                                                                                // 648
    var removeDoc = self._docs.get(removeId);                                                                // 649
    _.each(self.queries, function (query, qid) {                                                             // 650
      if (query.matcher.documentMatches(removeDoc).result) {                                                 // 651
        if (query.cursor.skip || query.cursor.limit)                                                         // 652
          queriesToRecompute.push(qid);                                                                      // 653
        else                                                                                                 // 654
          queryRemove.push({qid: qid, doc: removeDoc});                                                      // 655
      }                                                                                                      // 656
    });                                                                                                      // 657
    self._saveOriginal(removeId, removeDoc);                                                                 // 658
    self._docs.remove(removeId);                                                                             // 659
  }                                                                                                          // 660
                                                                                                             // 661
  // run live query callbacks _after_ we've removed the documents.                                           // 662
  _.each(queryRemove, function (remove) {                                                                    // 663
    var query = self.queries[remove.qid];                                                                    // 664
    if (query) {                                                                                             // 665
      query.distances && query.distances.remove(remove.doc._id);                                             // 666
      LocalCollection._removeFromResults(query, remove.doc);                                                 // 667
    }                                                                                                        // 668
  });                                                                                                        // 669
  _.each(queriesToRecompute, function (qid) {                                                                // 670
    var query = self.queries[qid];                                                                           // 671
    if (query)                                                                                               // 672
      self._recomputeResults(query);                                                                         // 673
  });                                                                                                        // 674
  self._observeQueue.drain();                                                                                // 675
  result = remove.length;                                                                                    // 676
  if (callback)                                                                                              // 677
    Meteor.defer(function () {                                                                               // 678
      callback(null, result);                                                                                // 679
    });                                                                                                      // 680
  return result;                                                                                             // 681
};                                                                                                           // 682
                                                                                                             // 683
// XXX atomicity: if multi is true, and one modification fails, do                                           // 684
// we rollback the whole operation, or what?                                                                 // 685
LocalCollection.prototype.update = function (selector, mod, options, callback) {                             // 686
  var self = this;                                                                                           // 687
  if (! callback && options instanceof Function) {                                                           // 688
    callback = options;                                                                                      // 689
    options = null;                                                                                          // 690
  }                                                                                                          // 691
  if (!options) options = {};                                                                                // 692
                                                                                                             // 693
  var matcher = new Minimongo.Matcher(selector);                                                             // 694
                                                                                                             // 695
  // Save the original results of any query that we might need to                                            // 696
  // _recomputeResults on, because _modifyAndNotify will mutate the objects in                               // 697
  // it. (We don't need to save the original results of paused queries because                               // 698
  // they already have a resultsSnapshot and we won't be diffing in                                          // 699
  // _recomputeResults.)                                                                                     // 700
  var qidToOriginalResults = {};                                                                             // 701
  _.each(self.queries, function (query, qid) {                                                               // 702
    // XXX for now, skip/limit implies ordered observe, so query.results is                                  // 703
    // always an array                                                                                       // 704
    if ((query.cursor.skip || query.cursor.limit) && ! self.paused)                                          // 705
      qidToOriginalResults[qid] = EJSON.clone(query.results);                                                // 706
  });                                                                                                        // 707
  var recomputeQids = {};                                                                                    // 708
                                                                                                             // 709
  var updateCount = 0;                                                                                       // 710
                                                                                                             // 711
  self._eachPossiblyMatchingDoc(selector, function (doc, id) {                                               // 712
    var queryResult = matcher.documentMatches(doc);                                                          // 713
    if (queryResult.result) {                                                                                // 714
      // XXX Should we save the original even if mod ends up being a no-op?                                  // 715
      self._saveOriginal(id, doc);                                                                           // 716
      self._modifyAndNotify(doc, mod, recomputeQids, queryResult.arrayIndices);                              // 717
      ++updateCount;                                                                                         // 718
      if (!options.multi)                                                                                    // 719
        return false;  // break                                                                              // 720
    }                                                                                                        // 721
    return true;                                                                                             // 722
  });                                                                                                        // 723
                                                                                                             // 724
  _.each(recomputeQids, function (dummy, qid) {                                                              // 725
    var query = self.queries[qid];                                                                           // 726
    if (query)                                                                                               // 727
      self._recomputeResults(query, qidToOriginalResults[qid]);                                              // 728
  });                                                                                                        // 729
  self._observeQueue.drain();                                                                                // 730
                                                                                                             // 731
  // If we are doing an upsert, and we didn't modify any documents yet, then                                 // 732
  // it's time to do an insert. Figure out what document we are inserting, and                               // 733
  // generate an id for it.                                                                                  // 734
  var insertedId;                                                                                            // 735
  if (updateCount === 0 && options.upsert) {                                                                 // 736
    var newDoc = LocalCollection._removeDollarOperators(selector);                                           // 737
    LocalCollection._modify(newDoc, mod, {isInsert: true});                                                  // 738
    if (! newDoc._id && options.insertedId)                                                                  // 739
      newDoc._id = options.insertedId;                                                                       // 740
    insertedId = self.insert(newDoc);                                                                        // 741
    updateCount = 1;                                                                                         // 742
  }                                                                                                          // 743
                                                                                                             // 744
  // Return the number of affected documents, or in the upsert case, an object                               // 745
  // containing the number of affected docs and the id of the doc that was                                   // 746
  // inserted, if any.                                                                                       // 747
  var result;                                                                                                // 748
  if (options._returnObject) {                                                                               // 749
    result = {                                                                                               // 750
      numberAffected: updateCount                                                                            // 751
    };                                                                                                       // 752
    if (insertedId !== undefined)                                                                            // 753
      result.insertedId = insertedId;                                                                        // 754
  } else {                                                                                                   // 755
    result = updateCount;                                                                                    // 756
  }                                                                                                          // 757
                                                                                                             // 758
  if (callback)                                                                                              // 759
    Meteor.defer(function () {                                                                               // 760
      callback(null, result);                                                                                // 761
    });                                                                                                      // 762
  return result;                                                                                             // 763
};                                                                                                           // 764
                                                                                                             // 765
// A convenience wrapper on update. LocalCollection.upsert(sel, mod) is                                      // 766
// equivalent to LocalCollection.update(sel, mod, { upsert: true, _returnObject:                             // 767
// true }).                                                                                                  // 768
LocalCollection.prototype.upsert = function (selector, mod, options, callback) {                             // 769
  var self = this;                                                                                           // 770
  if (! callback && typeof options === "function") {                                                         // 771
    callback = options;                                                                                      // 772
    options = {};                                                                                            // 773
  }                                                                                                          // 774
  return self.update(selector, mod, _.extend({}, options, {                                                  // 775
    upsert: true,                                                                                            // 776
    _returnObject: true                                                                                      // 777
  }), callback);                                                                                             // 778
};                                                                                                           // 779
                                                                                                             // 780
LocalCollection.prototype._modifyAndNotify = function (                                                      // 781
    doc, mod, recomputeQids, arrayIndices) {                                                                 // 782
  var self = this;                                                                                           // 783
                                                                                                             // 784
  var matched_before = {};                                                                                   // 785
  for (var qid in self.queries) {                                                                            // 786
    var query = self.queries[qid];                                                                           // 787
    if (query.ordered) {                                                                                     // 788
      matched_before[qid] = query.matcher.documentMatches(doc).result;                                       // 789
    } else {                                                                                                 // 790
      // Because we don't support skip or limit (yet) in unordered queries, we                               // 791
      // can just do a direct lookup.                                                                        // 792
      matched_before[qid] = query.results.has(doc._id);                                                      // 793
    }                                                                                                        // 794
  }                                                                                                          // 795
                                                                                                             // 796
  var old_doc = EJSON.clone(doc);                                                                            // 797
                                                                                                             // 798
  LocalCollection._modify(doc, mod, {arrayIndices: arrayIndices});                                           // 799
                                                                                                             // 800
  for (qid in self.queries) {                                                                                // 801
    query = self.queries[qid];                                                                               // 802
    var before = matched_before[qid];                                                                        // 803
    var afterMatch = query.matcher.documentMatches(doc);                                                     // 804
    var after = afterMatch.result;                                                                           // 805
    if (after && query.distances && afterMatch.distance !== undefined)                                       // 806
      query.distances.set(doc._id, afterMatch.distance);                                                     // 807
                                                                                                             // 808
    if (query.cursor.skip || query.cursor.limit) {                                                           // 809
      // We need to recompute any query where the doc may have been in the                                   // 810
      // cursor's window either before or after the update. (Note that if skip                               // 811
      // or limit is set, "before" and "after" being true do not necessarily                                 // 812
      // mean that the document is in the cursor's output after skip/limit is                                // 813
      // applied... but if they are false, then the document definitely is NOT                               // 814
      // in the output. So it's safe to skip recompute if neither before or                                  // 815
      // after are true.)                                                                                    // 816
      if (before || after)                                                                                   // 817
        recomputeQids[qid] = true;                                                                           // 818
    } else if (before && !after) {                                                                           // 819
      LocalCollection._removeFromResults(query, doc);                                                        // 820
    } else if (!before && after) {                                                                           // 821
      LocalCollection._insertInResults(query, doc);                                                          // 822
    } else if (before && after) {                                                                            // 823
      LocalCollection._updateInResults(query, doc, old_doc);                                                 // 824
    }                                                                                                        // 825
  }                                                                                                          // 826
};                                                                                                           // 827
                                                                                                             // 828
// XXX the sorted-query logic below is laughably inefficient. we'll                                          // 829
// need to come up with a better datastructure for this.                                                     // 830
//                                                                                                           // 831
// XXX the logic for observing with a skip or a limit is even more                                           // 832
// laughably inefficient. we recompute the whole results every time!                                         // 833
                                                                                                             // 834
LocalCollection._insertInResults = function (query, doc) {                                                   // 835
  var fields = EJSON.clone(doc);                                                                             // 836
  delete fields._id;                                                                                         // 837
  if (query.ordered) {                                                                                       // 838
    if (!query.sorter) {                                                                                     // 839
      query.addedBefore(doc._id, query.projectionFn(fields), null);                                          // 840
      query.results.push(doc);                                                                               // 841
    } else {                                                                                                 // 842
      var i = LocalCollection._insertInSortedList(                                                           // 843
        query.sorter.getComparator({distances: query.distances}),                                            // 844
        query.results, doc);                                                                                 // 845
      var next = query.results[i+1];                                                                         // 846
      if (next)                                                                                              // 847
        next = next._id;                                                                                     // 848
      else                                                                                                   // 849
        next = null;                                                                                         // 850
      query.addedBefore(doc._id, query.projectionFn(fields), next);                                          // 851
    }                                                                                                        // 852
    query.added(doc._id, query.projectionFn(fields));                                                        // 853
  } else {                                                                                                   // 854
    query.added(doc._id, query.projectionFn(fields));                                                        // 855
    query.results.set(doc._id, doc);                                                                         // 856
  }                                                                                                          // 857
};                                                                                                           // 858
                                                                                                             // 859
LocalCollection._removeFromResults = function (query, doc) {                                                 // 860
  if (query.ordered) {                                                                                       // 861
    var i = LocalCollection._findInOrderedResults(query, doc);                                               // 862
    query.removed(doc._id);                                                                                  // 863
    query.results.splice(i, 1);                                                                              // 864
  } else {                                                                                                   // 865
    var id = doc._id;  // in case callback mutates doc                                                       // 866
    query.removed(doc._id);                                                                                  // 867
    query.results.remove(id);                                                                                // 868
  }                                                                                                          // 869
};                                                                                                           // 870
                                                                                                             // 871
LocalCollection._updateInResults = function (query, doc, old_doc) {                                          // 872
  if (!EJSON.equals(doc._id, old_doc._id))                                                                   // 873
    throw new Error("Can't change a doc's _id while updating");                                              // 874
  var projectionFn = query.projectionFn;                                                                     // 875
  var changedFields = LocalCollection._makeChangedFields(                                                    // 876
    projectionFn(doc), projectionFn(old_doc));                                                               // 877
                                                                                                             // 878
  if (!query.ordered) {                                                                                      // 879
    if (!_.isEmpty(changedFields)) {                                                                         // 880
      query.changed(doc._id, changedFields);                                                                 // 881
      query.results.set(doc._id, doc);                                                                       // 882
    }                                                                                                        // 883
    return;                                                                                                  // 884
  }                                                                                                          // 885
                                                                                                             // 886
  var orig_idx = LocalCollection._findInOrderedResults(query, doc);                                          // 887
                                                                                                             // 888
  if (!_.isEmpty(changedFields))                                                                             // 889
    query.changed(doc._id, changedFields);                                                                   // 890
  if (!query.sorter)                                                                                         // 891
    return;                                                                                                  // 892
                                                                                                             // 893
  // just take it out and put it back in again, and see if the index                                         // 894
  // changes                                                                                                 // 895
  query.results.splice(orig_idx, 1);                                                                         // 896
  var new_idx = LocalCollection._insertInSortedList(                                                         // 897
    query.sorter.getComparator({distances: query.distances}),                                                // 898
    query.results, doc);                                                                                     // 899
  if (orig_idx !== new_idx) {                                                                                // 900
    var next = query.results[new_idx+1];                                                                     // 901
    if (next)                                                                                                // 902
      next = next._id;                                                                                       // 903
    else                                                                                                     // 904
      next = null;                                                                                           // 905
    query.movedBefore && query.movedBefore(doc._id, next);                                                   // 906
  }                                                                                                          // 907
};                                                                                                           // 908
                                                                                                             // 909
// Recomputes the results of a query and runs observe callbacks for the                                      // 910
// difference between the previous results and the current results (unless                                   // 911
// paused). Used for skip/limit queries.                                                                     // 912
//                                                                                                           // 913
// When this is used by insert or remove, it can just use query.results for the                              // 914
// old results (and there's no need to pass in oldResults), because these                                    // 915
// operations don't mutate the documents in the collection. Update needs to pass                             // 916
// in an oldResults which was deep-copied before the modifier was applied.                                   // 917
//                                                                                                           // 918
// oldResults is guaranteed to be ignored if the query is not paused.                                        // 919
LocalCollection.prototype._recomputeResults = function (query, oldResults) {                                 // 920
  var self = this;                                                                                           // 921
  if (! self.paused && ! oldResults)                                                                         // 922
    oldResults = query.results;                                                                              // 923
  if (query.distances)                                                                                       // 924
    query.distances.clear();                                                                                 // 925
  query.results = query.cursor._getRawObjects({                                                              // 926
    ordered: query.ordered, distances: query.distances});                                                    // 927
                                                                                                             // 928
  if (! self.paused) {                                                                                       // 929
    LocalCollection._diffQueryChanges(                                                                       // 930
      query.ordered, oldResults, query.results, query,                                                       // 931
      { projectionFn: query.projectionFn });                                                                 // 932
  }                                                                                                          // 933
};                                                                                                           // 934
                                                                                                             // 935
                                                                                                             // 936
LocalCollection._findInOrderedResults = function (query, doc) {                                              // 937
  if (!query.ordered)                                                                                        // 938
    throw new Error("Can't call _findInOrderedResults on unordered query");                                  // 939
  for (var i = 0; i < query.results.length; i++)                                                             // 940
    if (query.results[i] === doc)                                                                            // 941
      return i;                                                                                              // 942
  throw Error("object missing from query");                                                                  // 943
};                                                                                                           // 944
                                                                                                             // 945
// This binary search puts a value between any equal values, and the first                                   // 946
// lesser value.                                                                                             // 947
LocalCollection._binarySearch = function (cmp, array, value) {                                               // 948
  var first = 0, rangeLength = array.length;                                                                 // 949
                                                                                                             // 950
  while (rangeLength > 0) {                                                                                  // 951
    var halfRange = Math.floor(rangeLength/2);                                                               // 952
    if (cmp(value, array[first + halfRange]) >= 0) {                                                         // 953
      first += halfRange + 1;                                                                                // 954
      rangeLength -= halfRange + 1;                                                                          // 955
    } else {                                                                                                 // 956
      rangeLength = halfRange;                                                                               // 957
    }                                                                                                        // 958
  }                                                                                                          // 959
  return first;                                                                                              // 960
};                                                                                                           // 961
                                                                                                             // 962
LocalCollection._insertInSortedList = function (cmp, array, value) {                                         // 963
  if (array.length === 0) {                                                                                  // 964
    array.push(value);                                                                                       // 965
    return 0;                                                                                                // 966
  }                                                                                                          // 967
                                                                                                             // 968
  var idx = LocalCollection._binarySearch(cmp, array, value);                                                // 969
  array.splice(idx, 0, value);                                                                               // 970
  return idx;                                                                                                // 971
};                                                                                                           // 972
                                                                                                             // 973
// To track what documents are affected by a piece of code, call saveOriginals()                             // 974
// before it and retrieveOriginals() after it. retrieveOriginals returns an                                  // 975
// object whose keys are the ids of the documents that were affected since the                               // 976
// call to saveOriginals(), and the values are equal to the document's contents                              // 977
// at the time of saveOriginals. (In the case of an inserted document, undefined                             // 978
// is the value.) You must alternate between calls to saveOriginals() and                                    // 979
// retrieveOriginals().                                                                                      // 980
LocalCollection.prototype.saveOriginals = function () {                                                      // 981
  var self = this;                                                                                           // 982
  if (self._savedOriginals)                                                                                  // 983
    throw new Error("Called saveOriginals twice without retrieveOriginals");                                 // 984
  self._savedOriginals = new LocalCollection._IdMap;                                                         // 985
};                                                                                                           // 986
LocalCollection.prototype.retrieveOriginals = function () {                                                  // 987
  var self = this;                                                                                           // 988
  if (!self._savedOriginals)                                                                                 // 989
    throw new Error("Called retrieveOriginals without saveOriginals");                                       // 990
                                                                                                             // 991
  var originals = self._savedOriginals;                                                                      // 992
  self._savedOriginals = null;                                                                               // 993
  return originals;                                                                                          // 994
};                                                                                                           // 995
                                                                                                             // 996
LocalCollection.prototype._saveOriginal = function (id, doc) {                                               // 997
  var self = this;                                                                                           // 998
  // Are we even trying to save originals?                                                                   // 999
  if (!self._savedOriginals)                                                                                 // 1000
    return;                                                                                                  // 1001
  // Have we previously mutated the original (and so 'doc' is not actually                                   // 1002
  // original)?  (Note the 'has' check rather than truth: we store undefined                                 // 1003
  // here for inserted docs!)                                                                                // 1004
  if (self._savedOriginals.has(id))                                                                          // 1005
    return;                                                                                                  // 1006
  self._savedOriginals.set(id, EJSON.clone(doc));                                                            // 1007
};                                                                                                           // 1008
                                                                                                             // 1009
// Pause the observers. No callbacks from observers will fire until                                          // 1010
// 'resumeObservers' is called.                                                                              // 1011
LocalCollection.prototype.pauseObservers = function () {                                                     // 1012
  // No-op if already paused.                                                                                // 1013
  if (this.paused)                                                                                           // 1014
    return;                                                                                                  // 1015
                                                                                                             // 1016
  // Set the 'paused' flag such that new observer messages don't fire.                                       // 1017
  this.paused = true;                                                                                        // 1018
                                                                                                             // 1019
  // Take a snapshot of the query results for each query.                                                    // 1020
  for (var qid in this.queries) {                                                                            // 1021
    var query = this.queries[qid];                                                                           // 1022
                                                                                                             // 1023
    query.resultsSnapshot = EJSON.clone(query.results);                                                      // 1024
  }                                                                                                          // 1025
};                                                                                                           // 1026
                                                                                                             // 1027
// Resume the observers. Observers immediately receive change                                                // 1028
// notifications to bring them to the current state of the                                                   // 1029
// database. Note that this is not just replaying all the changes that                                       // 1030
// happened during the pause, it is a smarter 'coalesced' diff.                                              // 1031
LocalCollection.prototype.resumeObservers = function () {                                                    // 1032
  var self = this;                                                                                           // 1033
  // No-op if not paused.                                                                                    // 1034
  if (!this.paused)                                                                                          // 1035
    return;                                                                                                  // 1036
                                                                                                             // 1037
  // Unset the 'paused' flag. Make sure to do this first, otherwise                                          // 1038
  // observer methods won't actually fire when we trigger them.                                              // 1039
  this.paused = false;                                                                                       // 1040
                                                                                                             // 1041
  for (var qid in this.queries) {                                                                            // 1042
    var query = self.queries[qid];                                                                           // 1043
    // Diff the current results against the snapshot and send to observers.                                  // 1044
    // pass the query object for its observer callbacks.                                                     // 1045
    LocalCollection._diffQueryChanges(                                                                       // 1046
      query.ordered, query.resultsSnapshot, query.results, query,                                            // 1047
      { projectionFn: query.projectionFn });                                                                 // 1048
    query.resultsSnapshot = null;                                                                            // 1049
  }                                                                                                          // 1050
  self._observeQueue.drain();                                                                                // 1051
};                                                                                                           // 1052
                                                                                                             // 1053
                                                                                                             // 1054
// NB: used by livedata                                                                                      // 1055
LocalCollection._idStringify = function (id) {                                                               // 1056
  if (id instanceof LocalCollection._ObjectID) {                                                             // 1057
    return id.valueOf();                                                                                     // 1058
  } else if (typeof id === 'string') {                                                                       // 1059
    if (id === "") {                                                                                         // 1060
      return id;                                                                                             // 1061
    } else if (id.substr(0, 1) === "-" || // escape previously dashed strings                                // 1062
               id.substr(0, 1) === "~" || // escape escaped numbers, true, false                             // 1063
               LocalCollection._looksLikeObjectID(id) || // escape object-id-form strings                    // 1064
               id.substr(0, 1) === '{') { // escape object-form strings, for maybe implementing later        // 1065
      return "-" + id;                                                                                       // 1066
    } else {                                                                                                 // 1067
      return id; // other strings go through unchanged.                                                      // 1068
    }                                                                                                        // 1069
  } else if (id === undefined) {                                                                             // 1070
    return '-';                                                                                              // 1071
  } else if (typeof id === 'object' && id !== null) {                                                        // 1072
    throw new Error("Meteor does not currently support objects other than ObjectID as ids");                 // 1073
  } else { // Numbers, true, false, null                                                                     // 1074
    return "~" + JSON.stringify(id);                                                                         // 1075
  }                                                                                                          // 1076
};                                                                                                           // 1077
                                                                                                             // 1078
                                                                                                             // 1079
// NB: used by livedata                                                                                      // 1080
LocalCollection._idParse = function (id) {                                                                   // 1081
  if (id === "") {                                                                                           // 1082
    return id;                                                                                               // 1083
  } else if (id === '-') {                                                                                   // 1084
    return undefined;                                                                                        // 1085
  } else if (id.substr(0, 1) === '-') {                                                                      // 1086
    return id.substr(1);                                                                                     // 1087
  } else if (id.substr(0, 1) === '~') {                                                                      // 1088
    return JSON.parse(id.substr(1));                                                                         // 1089
  } else if (LocalCollection._looksLikeObjectID(id)) {                                                       // 1090
    return new LocalCollection._ObjectID(id);                                                                // 1091
  } else {                                                                                                   // 1092
    return id;                                                                                               // 1093
  }                                                                                                          // 1094
};                                                                                                           // 1095
                                                                                                             // 1096
LocalCollection._makeChangedFields = function (newDoc, oldDoc) {                                             // 1097
  var fields = {};                                                                                           // 1098
  LocalCollection._diffObjects(oldDoc, newDoc, {                                                             // 1099
    leftOnly: function (key, value) {                                                                        // 1100
      fields[key] = undefined;                                                                               // 1101
    },                                                                                                       // 1102
    rightOnly: function (key, value) {                                                                       // 1103
      fields[key] = value;                                                                                   // 1104
    },                                                                                                       // 1105
    both: function (key, leftValue, rightValue) {                                                            // 1106
      if (!EJSON.equals(leftValue, rightValue))                                                              // 1107
        fields[key] = rightValue;                                                                            // 1108
    }                                                                                                        // 1109
  });                                                                                                        // 1110
  return fields;                                                                                             // 1111
};                                                                                                           // 1112
                                                                                                             // 1113
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/wrap_transform.js                                                                      //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// Wrap a transform function to return objects that have the _id field                                       // 1
// of the untransformed document. This ensures that subsystems such as                                       // 2
// the observe-sequence package that call `observe` can keep track of                                        // 3
// the documents identities.                                                                                 // 4
//                                                                                                           // 5
// - Require that it returns objects                                                                         // 6
// - If the return value has an _id field, verify that it matches the                                        // 7
//   original _id field                                                                                      // 8
// - If the return value doesn't have an _id field, add it back.                                             // 9
LocalCollection.wrapTransform = function (transform) {                                                       // 10
  if (! transform)                                                                                           // 11
    return null;                                                                                             // 12
                                                                                                             // 13
  // No need to doubly-wrap transforms.                                                                      // 14
  if (transform.__wrappedTransform__)                                                                        // 15
    return transform;                                                                                        // 16
                                                                                                             // 17
  var wrapped = function (doc) {                                                                             // 18
    if (!_.has(doc, '_id')) {                                                                                // 19
      // XXX do we ever have a transform on the oplog's collection? because that                             // 20
      // collection has no _id.                                                                              // 21
      throw new Error("can only transform documents with _id");                                              // 22
    }                                                                                                        // 23
                                                                                                             // 24
    var id = doc._id;                                                                                        // 25
    // XXX consider making tracker a weak dependency and checking Package.tracker here                       // 26
    var transformed = Tracker.nonreactive(function () {                                                      // 27
      return transform(doc);                                                                                 // 28
    });                                                                                                      // 29
                                                                                                             // 30
    if (!isPlainObject(transformed)) {                                                                       // 31
      throw new Error("transform must return object");                                                       // 32
    }                                                                                                        // 33
                                                                                                             // 34
    if (_.has(transformed, '_id')) {                                                                         // 35
      if (!EJSON.equals(transformed._id, id)) {                                                              // 36
        throw new Error("transformed document can't have different _id");                                    // 37
      }                                                                                                      // 38
    } else {                                                                                                 // 39
      transformed._id = id;                                                                                  // 40
    }                                                                                                        // 41
    return transformed;                                                                                      // 42
  };                                                                                                         // 43
  wrapped.__wrappedTransform__ = true;                                                                       // 44
  return wrapped;                                                                                            // 45
};                                                                                                           // 46
                                                                                                             // 47
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/helpers.js                                                                             //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// Like _.isArray, but doesn't regard polyfilled Uint8Arrays on old browsers as                              // 1
// arrays.                                                                                                   // 2
// XXX maybe this should be EJSON.isArray                                                                    // 3
isArray = function (x) {                                                                                     // 4
  return _.isArray(x) && !EJSON.isBinary(x);                                                                 // 5
};                                                                                                           // 6
                                                                                                             // 7
// XXX maybe this should be EJSON.isObject, though EJSON doesn't know about                                  // 8
// RegExp                                                                                                    // 9
// XXX note that _type(undefined) === 3!!!!                                                                  // 10
isPlainObject = LocalCollection._isPlainObject = function (x) {                                              // 11
  return x && LocalCollection._f._type(x) === 3;                                                             // 12
};                                                                                                           // 13
                                                                                                             // 14
isIndexable = function (x) {                                                                                 // 15
  return isArray(x) || isPlainObject(x);                                                                     // 16
};                                                                                                           // 17
                                                                                                             // 18
// Returns true if this is an object with at least one key and all keys begin                                // 19
// with $.  Unless inconsistentOK is set, throws if some keys begin with $ and                               // 20
// others don't.                                                                                             // 21
isOperatorObject = function (valueSelector, inconsistentOK) {                                                // 22
  if (!isPlainObject(valueSelector))                                                                         // 23
    return false;                                                                                            // 24
                                                                                                             // 25
  var theseAreOperators = undefined;                                                                         // 26
  _.each(valueSelector, function (value, selKey) {                                                           // 27
    var thisIsOperator = selKey.substr(0, 1) === '$';                                                        // 28
    if (theseAreOperators === undefined) {                                                                   // 29
      theseAreOperators = thisIsOperator;                                                                    // 30
    } else if (theseAreOperators !== thisIsOperator) {                                                       // 31
      if (!inconsistentOK)                                                                                   // 32
        throw new Error("Inconsistent operator: " +                                                          // 33
                        JSON.stringify(valueSelector));                                                      // 34
      theseAreOperators = false;                                                                             // 35
    }                                                                                                        // 36
  });                                                                                                        // 37
  return !!theseAreOperators;  // {} has no operators                                                        // 38
};                                                                                                           // 39
                                                                                                             // 40
                                                                                                             // 41
// string can be converted to integer                                                                        // 42
isNumericKey = function (s) {                                                                                // 43
  return /^[0-9]+$/.test(s);                                                                                 // 44
};                                                                                                           // 45
                                                                                                             // 46
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/selector.js                                                                            //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// The minimongo selector compiler!                                                                          // 1
                                                                                                             // 2
// Terminology:                                                                                              // 3
//  - a "selector" is the EJSON object representing a selector                                               // 4
//  - a "matcher" is its compiled form (whether a full Minimongo.Matcher                                     // 5
//    object or one of the component lambdas that matches parts of it)                                       // 6
//  - a "result object" is an object with a "result" field and maybe                                         // 7
//    distance and arrayIndices.                                                                             // 8
//  - a "branched value" is an object with a "value" field and maybe                                         // 9
//    "dontIterate" and "arrayIndices".                                                                      // 10
//  - a "document" is a top-level object that can be stored in a collection.                                 // 11
//  - a "lookup function" is a function that takes in a document and returns                                 // 12
//    an array of "branched values".                                                                         // 13
//  - a "branched matcher" maps from an array of branched values to a result                                 // 14
//    object.                                                                                                // 15
//  - an "element matcher" maps from a single value to a bool.                                               // 16
                                                                                                             // 17
// Main entry point.                                                                                         // 18
//   var matcher = new Minimongo.Matcher({a: {$gt: 5}});                                                     // 19
//   if (matcher.documentMatches({a: 7})) ...                                                                // 20
Minimongo.Matcher = function (selector) {                                                                    // 21
  var self = this;                                                                                           // 22
  // A set (object mapping string -> *) of all of the document paths looked                                  // 23
  // at by the selector. Also includes the empty string if it may look at any                                // 24
  // path (eg, $where).                                                                                      // 25
  self._paths = {};                                                                                          // 26
  // Set to true if compilation finds a $near.                                                               // 27
  self._hasGeoQuery = false;                                                                                 // 28
  // Set to true if compilation finds a $where.                                                              // 29
  self._hasWhere = false;                                                                                    // 30
  // Set to false if compilation finds anything other than a simple equality or                              // 31
  // one or more of '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin' used with                             // 32
  // scalars as operands.                                                                                    // 33
  self._isSimple = true;                                                                                     // 34
  // Set to a dummy document which always matches this Matcher. Or set to null                               // 35
  // if such document is too hard to find.                                                                   // 36
  self._matchingDocument = undefined;                                                                        // 37
  // A clone of the original selector. It may just be a function if the user                                 // 38
  // passed in a function; otherwise is definitely an object (eg, IDs are                                    // 39
  // translated into {_id: ID} first. Used by canBecomeTrueByModifier and                                    // 40
  // Sorter._useWithMatcher.                                                                                 // 41
  self._selector = null;                                                                                     // 42
  self._docMatcher = self._compileSelector(selector);                                                        // 43
};                                                                                                           // 44
                                                                                                             // 45
_.extend(Minimongo.Matcher.prototype, {                                                                      // 46
  documentMatches: function (doc) {                                                                          // 47
    if (!doc || typeof doc !== "object") {                                                                   // 48
      throw Error("documentMatches needs a document");                                                       // 49
    }                                                                                                        // 50
    return this._docMatcher(doc);                                                                            // 51
  },                                                                                                         // 52
  hasGeoQuery: function () {                                                                                 // 53
    return this._hasGeoQuery;                                                                                // 54
  },                                                                                                         // 55
  hasWhere: function () {                                                                                    // 56
    return this._hasWhere;                                                                                   // 57
  },                                                                                                         // 58
  isSimple: function () {                                                                                    // 59
    return this._isSimple;                                                                                   // 60
  },                                                                                                         // 61
                                                                                                             // 62
  // Given a selector, return a function that takes one argument, a                                          // 63
  // document. It returns a result object.                                                                   // 64
  _compileSelector: function (selector) {                                                                    // 65
    var self = this;                                                                                         // 66
    // you can pass a literal function instead of a selector                                                 // 67
    if (selector instanceof Function) {                                                                      // 68
      self._isSimple = false;                                                                                // 69
      self._selector = selector;                                                                             // 70
      self._recordPathUsed('');                                                                              // 71
      return function (doc) {                                                                                // 72
        return {result: !!selector.call(doc)};                                                               // 73
      };                                                                                                     // 74
    }                                                                                                        // 75
                                                                                                             // 76
    // shorthand -- scalars match _id                                                                        // 77
    if (LocalCollection._selectorIsId(selector)) {                                                           // 78
      self._selector = {_id: selector};                                                                      // 79
      self._recordPathUsed('_id');                                                                           // 80
      return function (doc) {                                                                                // 81
        return {result: EJSON.equals(doc._id, selector)};                                                    // 82
      };                                                                                                     // 83
    }                                                                                                        // 84
                                                                                                             // 85
    // protect against dangerous selectors.  falsey and {_id: falsey} are both                               // 86
    // likely programmer error, and not what you want, particularly for                                      // 87
    // destructive operations.                                                                               // 88
    if (!selector || (('_id' in selector) && !selector._id)) {                                               // 89
      self._isSimple = false;                                                                                // 90
      return nothingMatcher;                                                                                 // 91
    }                                                                                                        // 92
                                                                                                             // 93
    // Top level can't be an array or true or binary.                                                        // 94
    if (typeof(selector) === 'boolean' || isArray(selector) ||                                               // 95
        EJSON.isBinary(selector))                                                                            // 96
      throw new Error("Invalid selector: " + selector);                                                      // 97
                                                                                                             // 98
    self._selector = EJSON.clone(selector);                                                                  // 99
    return compileDocumentSelector(selector, self, {isRoot: true});                                          // 100
  },                                                                                                         // 101
  _recordPathUsed: function (path) {                                                                         // 102
    this._paths[path] = true;                                                                                // 103
  },                                                                                                         // 104
  // Returns a list of key paths the given selector is looking for. It includes                              // 105
  // the empty string if there is a $where.                                                                  // 106
  _getPaths: function () {                                                                                   // 107
    return _.keys(this._paths);                                                                              // 108
  }                                                                                                          // 109
});                                                                                                          // 110
                                                                                                             // 111
                                                                                                             // 112
// Takes in a selector that could match a full document (eg, the original                                    // 113
// selector). Returns a function mapping document->result object.                                            // 114
//                                                                                                           // 115
// matcher is the Matcher object we are compiling.                                                           // 116
//                                                                                                           // 117
// If this is the root document selector (ie, not wrapped in $and or the like),                              // 118
// then isRoot is true. (This is used by $near.)                                                             // 119
var compileDocumentSelector = function (docSelector, matcher, options) {                                     // 120
  options = options || {};                                                                                   // 121
  var docMatchers = [];                                                                                      // 122
  _.each(docSelector, function (subSelector, key) {                                                          // 123
    if (key.substr(0, 1) === '$') {                                                                          // 124
      // Outer operators are either logical operators (they recurse back into                                // 125
      // this function), or $where.                                                                          // 126
      if (!_.has(LOGICAL_OPERATORS, key))                                                                    // 127
        throw new Error("Unrecognized logical operator: " + key);                                            // 128
      matcher._isSimple = false;                                                                             // 129
      docMatchers.push(LOGICAL_OPERATORS[key](subSelector, matcher,                                          // 130
                                              options.inElemMatch));                                         // 131
    } else {                                                                                                 // 132
      // Record this path, but only if we aren't in an elemMatcher, since in an                              // 133
      // elemMatch this is a path inside an object in an array, not in the doc                               // 134
      // root.                                                                                               // 135
      if (!options.inElemMatch)                                                                              // 136
        matcher._recordPathUsed(key);                                                                        // 137
      var lookUpByIndex = makeLookupFunction(key);                                                           // 138
      var valueMatcher =                                                                                     // 139
        compileValueSelector(subSelector, matcher, options.isRoot);                                          // 140
      docMatchers.push(function (doc) {                                                                      // 141
        var branchValues = lookUpByIndex(doc);                                                               // 142
        return valueMatcher(branchValues);                                                                   // 143
      });                                                                                                    // 144
    }                                                                                                        // 145
  });                                                                                                        // 146
                                                                                                             // 147
  return andDocumentMatchers(docMatchers);                                                                   // 148
};                                                                                                           // 149
                                                                                                             // 150
// Takes in a selector that could match a key-indexed value in a document; eg,                               // 151
// {$gt: 5, $lt: 9}, or a regular expression, or any non-expression object (to                               // 152
// indicate equality).  Returns a branched matcher: a function mapping                                       // 153
// [branched value]->result object.                                                                          // 154
var compileValueSelector = function (valueSelector, matcher, isRoot) {                                       // 155
  if (valueSelector instanceof RegExp) {                                                                     // 156
    matcher._isSimple = false;                                                                               // 157
    return convertElementMatcherToBranchedMatcher(                                                           // 158
      regexpElementMatcher(valueSelector));                                                                  // 159
  } else if (isOperatorObject(valueSelector)) {                                                              // 160
    return operatorBranchedMatcher(valueSelector, matcher, isRoot);                                          // 161
  } else {                                                                                                   // 162
    return convertElementMatcherToBranchedMatcher(                                                           // 163
      equalityElementMatcher(valueSelector));                                                                // 164
  }                                                                                                          // 165
};                                                                                                           // 166
                                                                                                             // 167
// Given an element matcher (which evaluates a single value), returns a branched                             // 168
// value (which evaluates the element matcher on all the branches and returns a                              // 169
// more structured return value possibly including arrayIndices).                                            // 170
var convertElementMatcherToBranchedMatcher = function (                                                      // 171
    elementMatcher, options) {                                                                               // 172
  options = options || {};                                                                                   // 173
  return function (branches) {                                                                               // 174
    var expanded = branches;                                                                                 // 175
    if (!options.dontExpandLeafArrays) {                                                                     // 176
      expanded = expandArraysInBranches(                                                                     // 177
        branches, options.dontIncludeLeafArrays);                                                            // 178
    }                                                                                                        // 179
    var ret = {};                                                                                            // 180
    ret.result = _.any(expanded, function (element) {                                                        // 181
      var matched = elementMatcher(element.value);                                                           // 182
                                                                                                             // 183
      // Special case for $elemMatch: it means "true, and use this as an array                               // 184
      // index if I didn't already have one".                                                                // 185
      if (typeof matched === 'number') {                                                                     // 186
        // XXX This code dates from when we only stored a single array index                                 // 187
        // (for the outermost array). Should we be also including deeper array                               // 188
        // indices from the $elemMatch match?                                                                // 189
        if (!element.arrayIndices)                                                                           // 190
          element.arrayIndices = [matched];                                                                  // 191
        matched = true;                                                                                      // 192
      }                                                                                                      // 193
                                                                                                             // 194
      // If some element matched, and it's tagged with array indices, include                                // 195
      // those indices in our result object.                                                                 // 196
      if (matched && element.arrayIndices)                                                                   // 197
        ret.arrayIndices = element.arrayIndices;                                                             // 198
                                                                                                             // 199
      return matched;                                                                                        // 200
    });                                                                                                      // 201
    return ret;                                                                                              // 202
  };                                                                                                         // 203
};                                                                                                           // 204
                                                                                                             // 205
// Takes a RegExp object and returns an element matcher.                                                     // 206
regexpElementMatcher = function (regexp) {                                                                   // 207
  return function (value) {                                                                                  // 208
    if (value instanceof RegExp) {                                                                           // 209
      // Comparing two regexps means seeing if the regexps are identical                                     // 210
      // (really!). Underscore knows how.                                                                    // 211
      return _.isEqual(value, regexp);                                                                       // 212
    }                                                                                                        // 213
    // Regexps only work against strings.                                                                    // 214
    if (typeof value !== 'string')                                                                           // 215
      return false;                                                                                          // 216
                                                                                                             // 217
    // Reset regexp's state to avoid inconsistent matching for objects with the                              // 218
    // same value on consecutive calls of regexp.test. This happens only if the                              // 219
    // regexp has the 'g' flag. Also note that ES6 introduces a new flag 'y' for                             // 220
    // which we should *not* change the lastIndex but MongoDB doesn't support                                // 221
    // either of these flags.                                                                                // 222
    regexp.lastIndex = 0;                                                                                    // 223
                                                                                                             // 224
    return regexp.test(value);                                                                               // 225
  };                                                                                                         // 226
};                                                                                                           // 227
                                                                                                             // 228
// Takes something that is not an operator object and returns an element matcher                             // 229
// for equality with that thing.                                                                             // 230
equalityElementMatcher = function (elementSelector) {                                                        // 231
  if (isOperatorObject(elementSelector))                                                                     // 232
    throw Error("Can't create equalityValueSelector for operator object");                                   // 233
                                                                                                             // 234
  // Special-case: null and undefined are equal (if you got undefined in there                               // 235
  // somewhere, or if you got it due to some branch being non-existent in the                                // 236
  // weird special case), even though they aren't with EJSON.equals.                                         // 237
  if (elementSelector == null) {  // undefined or null                                                       // 238
    return function (value) {                                                                                // 239
      return value == null;  // undefined or null                                                            // 240
    };                                                                                                       // 241
  }                                                                                                          // 242
                                                                                                             // 243
  return function (value) {                                                                                  // 244
    return LocalCollection._f._equal(elementSelector, value);                                                // 245
  };                                                                                                         // 246
};                                                                                                           // 247
                                                                                                             // 248
// Takes an operator object (an object with $ keys) and returns a branched                                   // 249
// matcher for it.                                                                                           // 250
var operatorBranchedMatcher = function (valueSelector, matcher, isRoot) {                                    // 251
  // Each valueSelector works separately on the various branches.  So one                                    // 252
  // operator can match one branch and another can match another branch.  This                               // 253
  // is OK.                                                                                                  // 254
                                                                                                             // 255
  var operatorMatchers = [];                                                                                 // 256
  _.each(valueSelector, function (operand, operator) {                                                       // 257
    // XXX we should actually implement $eq, which is new in 2.6                                             // 258
    var simpleRange = _.contains(['$lt', '$lte', '$gt', '$gte'], operator) &&                                // 259
      _.isNumber(operand);                                                                                   // 260
    var simpleInequality = operator === '$ne' && !_.isObject(operand);                                       // 261
    var simpleInclusion = _.contains(['$in', '$nin'], operator) &&                                           // 262
      _.isArray(operand) && !_.any(operand, _.isObject);                                                     // 263
                                                                                                             // 264
    if (! (operator === '$eq' || simpleRange ||                                                              // 265
           simpleInclusion || simpleInequality)) {                                                           // 266
      matcher._isSimple = false;                                                                             // 267
    }                                                                                                        // 268
                                                                                                             // 269
    if (_.has(VALUE_OPERATORS, operator)) {                                                                  // 270
      operatorMatchers.push(                                                                                 // 271
        VALUE_OPERATORS[operator](operand, valueSelector, matcher, isRoot));                                 // 272
    } else if (_.has(ELEMENT_OPERATORS, operator)) {                                                         // 273
      var options = ELEMENT_OPERATORS[operator];                                                             // 274
      operatorMatchers.push(                                                                                 // 275
        convertElementMatcherToBranchedMatcher(                                                              // 276
          options.compileElementSelector(                                                                    // 277
            operand, valueSelector, matcher),                                                                // 278
          options));                                                                                         // 279
    } else {                                                                                                 // 280
      throw new Error("Unrecognized operator: " + operator);                                                 // 281
    }                                                                                                        // 282
  });                                                                                                        // 283
                                                                                                             // 284
  return andBranchedMatchers(operatorMatchers);                                                              // 285
};                                                                                                           // 286
                                                                                                             // 287
var compileArrayOfDocumentSelectors = function (                                                             // 288
    selectors, matcher, inElemMatch) {                                                                       // 289
  if (!isArray(selectors) || _.isEmpty(selectors))                                                           // 290
    throw Error("$and/$or/$nor must be nonempty array");                                                     // 291
  return _.map(selectors, function (subSelector) {                                                           // 292
    if (!isPlainObject(subSelector))                                                                         // 293
      throw Error("$or/$and/$nor entries need to be full objects");                                          // 294
    return compileDocumentSelector(                                                                          // 295
      subSelector, matcher, {inElemMatch: inElemMatch});                                                     // 296
  });                                                                                                        // 297
};                                                                                                           // 298
                                                                                                             // 299
// Operators that appear at the top level of a document selector.                                            // 300
var LOGICAL_OPERATORS = {                                                                                    // 301
  $and: function (subSelector, matcher, inElemMatch) {                                                       // 302
    var matchers = compileArrayOfDocumentSelectors(                                                          // 303
      subSelector, matcher, inElemMatch);                                                                    // 304
    return andDocumentMatchers(matchers);                                                                    // 305
  },                                                                                                         // 306
                                                                                                             // 307
  $or: function (subSelector, matcher, inElemMatch) {                                                        // 308
    var matchers = compileArrayOfDocumentSelectors(                                                          // 309
      subSelector, matcher, inElemMatch);                                                                    // 310
                                                                                                             // 311
    // Special case: if there is only one matcher, use it directly, *preserving*                             // 312
    // any arrayIndices it returns.                                                                          // 313
    if (matchers.length === 1)                                                                               // 314
      return matchers[0];                                                                                    // 315
                                                                                                             // 316
    return function (doc) {                                                                                  // 317
      var result = _.any(matchers, function (f) {                                                            // 318
        return f(doc).result;                                                                                // 319
      });                                                                                                    // 320
      // $or does NOT set arrayIndices when it has multiple                                                  // 321
      // sub-expressions. (Tested against MongoDB.)                                                          // 322
      return {result: result};                                                                               // 323
    };                                                                                                       // 324
  },                                                                                                         // 325
                                                                                                             // 326
  $nor: function (subSelector, matcher, inElemMatch) {                                                       // 327
    var matchers = compileArrayOfDocumentSelectors(                                                          // 328
      subSelector, matcher, inElemMatch);                                                                    // 329
    return function (doc) {                                                                                  // 330
      var result = _.all(matchers, function (f) {                                                            // 331
        return !f(doc).result;                                                                               // 332
      });                                                                                                    // 333
      // Never set arrayIndices, because we only match if nothing in particular                              // 334
      // "matched" (and because this is consistent with MongoDB).                                            // 335
      return {result: result};                                                                               // 336
    };                                                                                                       // 337
  },                                                                                                         // 338
                                                                                                             // 339
  $where: function (selectorValue, matcher) {                                                                // 340
    // Record that *any* path may be used.                                                                   // 341
    matcher._recordPathUsed('');                                                                             // 342
    matcher._hasWhere = true;                                                                                // 343
    if (!(selectorValue instanceof Function)) {                                                              // 344
      // XXX MongoDB seems to have more complex logic to decide where or or not                              // 345
      // to add "return"; not sure exactly what it is.                                                       // 346
      selectorValue = Function("obj", "return " + selectorValue);                                            // 347
    }                                                                                                        // 348
    return function (doc) {                                                                                  // 349
      // We make the document available as both `this` and `obj`.                                            // 350
      // XXX not sure what we should do if this throws                                                       // 351
      return {result: selectorValue.call(doc, doc)};                                                         // 352
    };                                                                                                       // 353
  },                                                                                                         // 354
                                                                                                             // 355
  // This is just used as a comment in the query (in MongoDB, it also ends up in                             // 356
  // query logs); it has no effect on the actual selection.                                                  // 357
  $comment: function () {                                                                                    // 358
    return function () {                                                                                     // 359
      return {result: true};                                                                                 // 360
    };                                                                                                       // 361
  }                                                                                                          // 362
};                                                                                                           // 363
                                                                                                             // 364
// Returns a branched matcher that matches iff the given matcher does not.                                   // 365
// Note that this implicitly "deMorganizes" the wrapped function.  ie, it                                    // 366
// means that ALL branch values need to fail to match innerBranchedMatcher.                                  // 367
var invertBranchedMatcher = function (branchedMatcher) {                                                     // 368
  return function (branchValues) {                                                                           // 369
    var invertMe = branchedMatcher(branchValues);                                                            // 370
    // We explicitly choose to strip arrayIndices here: it doesn't make sense to                             // 371
    // say "update the array element that does not match something", at least                                // 372
    // in mongo-land.                                                                                        // 373
    return {result: !invertMe.result};                                                                       // 374
  };                                                                                                         // 375
};                                                                                                           // 376
                                                                                                             // 377
// Operators that (unlike LOGICAL_OPERATORS) pertain to individual paths in a                                // 378
// document, but (unlike ELEMENT_OPERATORS) do not have a simple definition as                               // 379
// "match each branched value independently and combine with                                                 // 380
// convertElementMatcherToBranchedMatcher".                                                                  // 381
var VALUE_OPERATORS = {                                                                                      // 382
  $not: function (operand, valueSelector, matcher) {                                                         // 383
    return invertBranchedMatcher(compileValueSelector(operand, matcher));                                    // 384
  },                                                                                                         // 385
  $ne: function (operand) {                                                                                  // 386
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(                                     // 387
      equalityElementMatcher(operand)));                                                                     // 388
  },                                                                                                         // 389
  $nin: function (operand) {                                                                                 // 390
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(                                     // 391
      ELEMENT_OPERATORS.$in.compileElementSelector(operand)));                                               // 392
  },                                                                                                         // 393
  $exists: function (operand) {                                                                              // 394
    var exists = convertElementMatcherToBranchedMatcher(function (value) {                                   // 395
      return value !== undefined;                                                                            // 396
    });                                                                                                      // 397
    return operand ? exists : invertBranchedMatcher(exists);                                                 // 398
  },                                                                                                         // 399
  // $options just provides options for $regex; its logic is inside $regex                                   // 400
  $options: function (operand, valueSelector) {                                                              // 401
    if (!_.has(valueSelector, '$regex'))                                                                     // 402
      throw Error("$options needs a $regex");                                                                // 403
    return everythingMatcher;                                                                                // 404
  },                                                                                                         // 405
  // $maxDistance is basically an argument to $near                                                          // 406
  $maxDistance: function (operand, valueSelector) {                                                          // 407
    if (!valueSelector.$near)                                                                                // 408
      throw Error("$maxDistance needs a $near");                                                             // 409
    return everythingMatcher;                                                                                // 410
  },                                                                                                         // 411
  $all: function (operand, valueSelector, matcher) {                                                         // 412
    if (!isArray(operand))                                                                                   // 413
      throw Error("$all requires array");                                                                    // 414
    // Not sure why, but this seems to be what MongoDB does.                                                 // 415
    if (_.isEmpty(operand))                                                                                  // 416
      return nothingMatcher;                                                                                 // 417
                                                                                                             // 418
    var branchedMatchers = [];                                                                               // 419
    _.each(operand, function (criterion) {                                                                   // 420
      // XXX handle $all/$elemMatch combination                                                              // 421
      if (isOperatorObject(criterion))                                                                       // 422
        throw Error("no $ expressions in $all");                                                             // 423
      // This is always a regexp or equality selector.                                                       // 424
      branchedMatchers.push(compileValueSelector(criterion, matcher));                                       // 425
    });                                                                                                      // 426
    // andBranchedMatchers does NOT require all selectors to return true on the                              // 427
    // SAME branch.                                                                                          // 428
    return andBranchedMatchers(branchedMatchers);                                                            // 429
  },                                                                                                         // 430
  $near: function (operand, valueSelector, matcher, isRoot) {                                                // 431
    if (!isRoot)                                                                                             // 432
      throw Error("$near can't be inside another $ operator");                                               // 433
    matcher._hasGeoQuery = true;                                                                             // 434
                                                                                                             // 435
    // There are two kinds of geodata in MongoDB: coordinate pairs and                                       // 436
    // GeoJSON. They use different distance metrics, too. GeoJSON queries are                                // 437
    // marked with a $geometry property.                                                                     // 438
                                                                                                             // 439
    var maxDistance, point, distance;                                                                        // 440
    if (isPlainObject(operand) && _.has(operand, '$geometry')) {                                             // 441
      // GeoJSON "2dsphere" mode.                                                                            // 442
      maxDistance = operand.$maxDistance;                                                                    // 443
      point = operand.$geometry;                                                                             // 444
      distance = function (value) {                                                                          // 445
        // XXX: for now, we don't calculate the actual distance between, say,                                // 446
        // polygon and circle. If people care about this use-case it will get                                // 447
        // a priority.                                                                                       // 448
        if (!value || !value.type)                                                                           // 449
          return null;                                                                                       // 450
        if (value.type === "Point") {                                                                        // 451
          return GeoJSON.pointDistance(point, value);                                                        // 452
        } else {                                                                                             // 453
          return GeoJSON.geometryWithinRadius(value, point, maxDistance)                                     // 454
            ? 0 : maxDistance + 1;                                                                           // 455
        }                                                                                                    // 456
      };                                                                                                     // 457
    } else {                                                                                                 // 458
      maxDistance = valueSelector.$maxDistance;                                                              // 459
      if (!isArray(operand) && !isPlainObject(operand))                                                      // 460
        throw Error("$near argument must be coordinate pair or GeoJSON");                                    // 461
      point = pointToArray(operand);                                                                         // 462
      distance = function (value) {                                                                          // 463
        if (!isArray(value) && !isPlainObject(value))                                                        // 464
          return null;                                                                                       // 465
        return distanceCoordinatePairs(point, value);                                                        // 466
      };                                                                                                     // 467
    }                                                                                                        // 468
                                                                                                             // 469
    return function (branchedValues) {                                                                       // 470
      // There might be multiple points in the document that match the given                                 // 471
      // field. Only one of them needs to be within $maxDistance, but we need to                             // 472
      // evaluate all of them and use the nearest one for the implicit sort                                  // 473
      // specifier. (That's why we can't just use ELEMENT_OPERATORS here.)                                   // 474
      //                                                                                                     // 475
      // Note: This differs from MongoDB's implementation, where a document will                             // 476
      // actually show up *multiple times* in the result set, with one entry for                             // 477
      // each within-$maxDistance branching point.                                                           // 478
      branchedValues = expandArraysInBranches(branchedValues);                                               // 479
      var result = {result: false};                                                                          // 480
      _.each(branchedValues, function (branch) {                                                             // 481
        var curDistance = distance(branch.value);                                                            // 482
        // Skip branches that aren't real points or are too far away.                                        // 483
        if (curDistance === null || curDistance > maxDistance)                                               // 484
          return;                                                                                            // 485
        // Skip anything that's a tie.                                                                       // 486
        if (result.distance !== undefined && result.distance <= curDistance)                                 // 487
          return;                                                                                            // 488
        result.result = true;                                                                                // 489
        result.distance = curDistance;                                                                       // 490
        if (!branch.arrayIndices)                                                                            // 491
          delete result.arrayIndices;                                                                        // 492
        else                                                                                                 // 493
          result.arrayIndices = branch.arrayIndices;                                                         // 494
      });                                                                                                    // 495
      return result;                                                                                         // 496
    };                                                                                                       // 497
  }                                                                                                          // 498
};                                                                                                           // 499
                                                                                                             // 500
// Helpers for $near.                                                                                        // 501
var distanceCoordinatePairs = function (a, b) {                                                              // 502
  a = pointToArray(a);                                                                                       // 503
  b = pointToArray(b);                                                                                       // 504
  var x = a[0] - b[0];                                                                                       // 505
  var y = a[1] - b[1];                                                                                       // 506
  if (_.isNaN(x) || _.isNaN(y))                                                                              // 507
    return null;                                                                                             // 508
  return Math.sqrt(x * x + y * y);                                                                           // 509
};                                                                                                           // 510
// Makes sure we get 2 elements array and assume the first one to be x and                                   // 511
// the second one to y no matter what user passes.                                                           // 512
// In case user passes { lon: x, lat: y } returns [x, y]                                                     // 513
var pointToArray = function (point) {                                                                        // 514
  return _.map(point, _.identity);                                                                           // 515
};                                                                                                           // 516
                                                                                                             // 517
// Helper for $lt/$gt/$lte/$gte.                                                                             // 518
var makeInequality = function (cmpValueComparator) {                                                         // 519
  return {                                                                                                   // 520
    compileElementSelector: function (operand) {                                                             // 521
      // Arrays never compare false with non-arrays for any inequality.                                      // 522
      // XXX This was behavior we observed in pre-release MongoDB 2.5, but                                   // 523
      //     it seems to have been reverted.                                                                 // 524
      //     See https://jira.mongodb.org/browse/SERVER-11444                                                // 525
      if (isArray(operand)) {                                                                                // 526
        return function () {                                                                                 // 527
          return false;                                                                                      // 528
        };                                                                                                   // 529
      }                                                                                                      // 530
                                                                                                             // 531
      // Special case: consider undefined and null the same (so true with                                    // 532
      // $gte/$lte).                                                                                         // 533
      if (operand === undefined)                                                                             // 534
        operand = null;                                                                                      // 535
                                                                                                             // 536
      var operandType = LocalCollection._f._type(operand);                                                   // 537
                                                                                                             // 538
      return function (value) {                                                                              // 539
        if (value === undefined)                                                                             // 540
          value = null;                                                                                      // 541
        // Comparisons are never true among things of different type (except                                 // 542
        // null vs undefined).                                                                               // 543
        if (LocalCollection._f._type(value) !== operandType)                                                 // 544
          return false;                                                                                      // 545
        return cmpValueComparator(LocalCollection._f._cmp(value, operand));                                  // 546
      };                                                                                                     // 547
    }                                                                                                        // 548
  };                                                                                                         // 549
};                                                                                                           // 550
                                                                                                             // 551
// Each element selector contains:                                                                           // 552
//  - compileElementSelector, a function with args:                                                          // 553
//    - operand - the "right hand side" of the operator                                                      // 554
//    - valueSelector - the "context" for the operator (so that $regex can find                              // 555
//      $options)                                                                                            // 556
//    - matcher - the Matcher this is going into (so that $elemMatch can compile                             // 557
//      more things)                                                                                         // 558
//    returning a function mapping a single value to bool.                                                   // 559
//  - dontExpandLeafArrays, a bool which prevents expandArraysInBranches from                                // 560
//    being called                                                                                           // 561
//  - dontIncludeLeafArrays, a bool which causes an argument to be passed to                                 // 562
//    expandArraysInBranches if it is called                                                                 // 563
ELEMENT_OPERATORS = {                                                                                        // 564
  $lt: makeInequality(function (cmpValue) {                                                                  // 565
    return cmpValue < 0;                                                                                     // 566
  }),                                                                                                        // 567
  $gt: makeInequality(function (cmpValue) {                                                                  // 568
    return cmpValue > 0;                                                                                     // 569
  }),                                                                                                        // 570
  $lte: makeInequality(function (cmpValue) {                                                                 // 571
    return cmpValue <= 0;                                                                                    // 572
  }),                                                                                                        // 573
  $gte: makeInequality(function (cmpValue) {                                                                 // 574
    return cmpValue >= 0;                                                                                    // 575
  }),                                                                                                        // 576
  $mod: {                                                                                                    // 577
    compileElementSelector: function (operand) {                                                             // 578
      if (!(isArray(operand) && operand.length === 2                                                         // 579
            && typeof(operand[0]) === 'number'                                                               // 580
            && typeof(operand[1]) === 'number')) {                                                           // 581
        throw Error("argument to $mod must be an array of two numbers");                                     // 582
      }                                                                                                      // 583
      // XXX could require to be ints or round or something                                                  // 584
      var divisor = operand[0];                                                                              // 585
      var remainder = operand[1];                                                                            // 586
      return function (value) {                                                                              // 587
        return typeof value === 'number' && value % divisor === remainder;                                   // 588
      };                                                                                                     // 589
    }                                                                                                        // 590
  },                                                                                                         // 591
  $in: {                                                                                                     // 592
    compileElementSelector: function (operand) {                                                             // 593
      if (!isArray(operand))                                                                                 // 594
        throw Error("$in needs an array");                                                                   // 595
                                                                                                             // 596
      var elementMatchers = [];                                                                              // 597
      _.each(operand, function (option) {                                                                    // 598
        if (option instanceof RegExp)                                                                        // 599
          elementMatchers.push(regexpElementMatcher(option));                                                // 600
        else if (isOperatorObject(option))                                                                   // 601
          throw Error("cannot nest $ under $in");                                                            // 602
        else                                                                                                 // 603
          elementMatchers.push(equalityElementMatcher(option));                                              // 604
      });                                                                                                    // 605
                                                                                                             // 606
      return function (value) {                                                                              // 607
        // Allow {a: {$in: [null]}} to match when 'a' does not exist.                                        // 608
        if (value === undefined)                                                                             // 609
          value = null;                                                                                      // 610
        return _.any(elementMatchers, function (e) {                                                         // 611
          return e(value);                                                                                   // 612
        });                                                                                                  // 613
      };                                                                                                     // 614
    }                                                                                                        // 615
  },                                                                                                         // 616
  $size: {                                                                                                   // 617
    // {a: [[5, 5]]} must match {a: {$size: 1}} but not {a: {$size: 2}}, so we                               // 618
    // don't want to consider the element [5,5] in the leaf array [[5,5]] as a                               // 619
    // possible value.                                                                                       // 620
    dontExpandLeafArrays: true,                                                                              // 621
    compileElementSelector: function (operand) {                                                             // 622
      if (typeof operand === 'string') {                                                                     // 623
        // Don't ask me why, but by experimentation, this seems to be what Mongo                             // 624
        // does.                                                                                             // 625
        operand = 0;                                                                                         // 626
      } else if (typeof operand !== 'number') {                                                              // 627
        throw Error("$size needs a number");                                                                 // 628
      }                                                                                                      // 629
      return function (value) {                                                                              // 630
        return isArray(value) && value.length === operand;                                                   // 631
      };                                                                                                     // 632
    }                                                                                                        // 633
  },                                                                                                         // 634
  $type: {                                                                                                   // 635
    // {a: [5]} must not match {a: {$type: 4}} (4 means array), but it should                                // 636
    // match {a: {$type: 1}} (1 means number), and {a: [[5]]} must match {$a:                                // 637
    // {$type: 4}}. Thus, when we see a leaf array, we *should* expand it but                                // 638
    // should *not* include it itself.                                                                       // 639
    dontIncludeLeafArrays: true,                                                                             // 640
    compileElementSelector: function (operand) {                                                             // 641
      if (typeof operand !== 'number')                                                                       // 642
        throw Error("$type needs a number");                                                                 // 643
      return function (value) {                                                                              // 644
        return value !== undefined                                                                           // 645
          && LocalCollection._f._type(value) === operand;                                                    // 646
      };                                                                                                     // 647
    }                                                                                                        // 648
  },                                                                                                         // 649
  $regex: {                                                                                                  // 650
    compileElementSelector: function (operand, valueSelector) {                                              // 651
      if (!(typeof operand === 'string' || operand instanceof RegExp))                                       // 652
        throw Error("$regex has to be a string or RegExp");                                                  // 653
                                                                                                             // 654
      var regexp;                                                                                            // 655
      if (valueSelector.$options !== undefined) {                                                            // 656
        // Options passed in $options (even the empty string) always overrides                               // 657
        // options in the RegExp object itself. (See also                                                    // 658
        // Mongo.Collection._rewriteSelector.)                                                               // 659
                                                                                                             // 660
        // Be clear that we only support the JS-supported options, not extended                              // 661
        // ones (eg, Mongo supports x and s). Ideally we would implement x and s                             // 662
        // by transforming the regexp, but not today...                                                      // 663
        if (/[^gim]/.test(valueSelector.$options))                                                           // 664
          throw new Error("Only the i, m, and g regexp options are supported");                              // 665
                                                                                                             // 666
        var regexSource = operand instanceof RegExp ? operand.source : operand;                              // 667
        regexp = new RegExp(regexSource, valueSelector.$options);                                            // 668
      } else if (operand instanceof RegExp) {                                                                // 669
        regexp = operand;                                                                                    // 670
      } else {                                                                                               // 671
        regexp = new RegExp(operand);                                                                        // 672
      }                                                                                                      // 673
      return regexpElementMatcher(regexp);                                                                   // 674
    }                                                                                                        // 675
  },                                                                                                         // 676
  $elemMatch: {                                                                                              // 677
    dontExpandLeafArrays: true,                                                                              // 678
    compileElementSelector: function (operand, valueSelector, matcher) {                                     // 679
      if (!isPlainObject(operand))                                                                           // 680
        throw Error("$elemMatch need an object");                                                            // 681
                                                                                                             // 682
      var subMatcher, isDocMatcher;                                                                          // 683
      if (isOperatorObject(operand, true)) {                                                                 // 684
        subMatcher = compileValueSelector(operand, matcher);                                                 // 685
        isDocMatcher = false;                                                                                // 686
      } else {                                                                                               // 687
        // This is NOT the same as compileValueSelector(operand), and not just                               // 688
        // because of the slightly different calling convention.                                             // 689
        // {$elemMatch: {x: 3}} means "an element has a field x:3", not                                      // 690
        // "consists only of a field x:3". Also, regexps and sub-$ are allowed.                              // 691
        subMatcher = compileDocumentSelector(operand, matcher,                                               // 692
                                             {inElemMatch: true});                                           // 693
        isDocMatcher = true;                                                                                 // 694
      }                                                                                                      // 695
                                                                                                             // 696
      return function (value) {                                                                              // 697
        if (!isArray(value))                                                                                 // 698
          return false;                                                                                      // 699
        for (var i = 0; i < value.length; ++i) {                                                             // 700
          var arrayElement = value[i];                                                                       // 701
          var arg;                                                                                           // 702
          if (isDocMatcher) {                                                                                // 703
            // We can only match {$elemMatch: {b: 3}} against objects.                                       // 704
            // (We can also match against arrays, if there's numeric indices,                                // 705
            // eg {$elemMatch: {'0.b': 3}} or {$elemMatch: {0: 3}}.)                                         // 706
            if (!isPlainObject(arrayElement) && !isArray(arrayElement))                                      // 707
              return false;                                                                                  // 708
            arg = arrayElement;                                                                              // 709
          } else {                                                                                           // 710
            // dontIterate ensures that {a: {$elemMatch: {$gt: 5}}} matches                                  // 711
            // {a: [8]} but not {a: [[8]]}                                                                   // 712
            arg = [{value: arrayElement, dontIterate: true}];                                                // 713
          }                                                                                                  // 714
          // XXX support $near in $elemMatch by propagating $distance?                                       // 715
          if (subMatcher(arg).result)                                                                        // 716
            return i;   // specially understood to mean "use as arrayIndices"                                // 717
        }                                                                                                    // 718
        return false;                                                                                        // 719
      };                                                                                                     // 720
    }                                                                                                        // 721
  }                                                                                                          // 722
};                                                                                                           // 723
                                                                                                             // 724
// makeLookupFunction(key) returns a lookup function.                                                        // 725
//                                                                                                           // 726
// A lookup function takes in a document and returns an array of matching                                    // 727
// branches.  If no arrays are found while looking up the key, this array will                               // 728
// have exactly one branches (possibly 'undefined', if some segment of the key                               // 729
// was not found).                                                                                           // 730
//                                                                                                           // 731
// If arrays are found in the middle, this can have more than one element, since                             // 732
// we "branch". When we "branch", if there are more key segments to look up,                                 // 733
// then we only pursue branches that are plain objects (not arrays or scalars).                              // 734
// This means we can actually end up with no branches!                                                       // 735
//                                                                                                           // 736
// We do *NOT* branch on arrays that are found at the end (ie, at the last                                   // 737
// dotted member of the key). We just return that array; if you want to                                      // 738
// effectively "branch" over the array's values, post-process the lookup                                     // 739
// function with expandArraysInBranches.                                                                     // 740
//                                                                                                           // 741
// Each branch is an object with keys:                                                                       // 742
//  - value: the value at the branch                                                                         // 743
//  - dontIterate: an optional bool; if true, it means that 'value' is an array                              // 744
//    that expandArraysInBranches should NOT expand. This specifically happens                               // 745
//    when there is a numeric index in the key, and ensures the                                              // 746
//    perhaps-surprising MongoDB behavior where {'a.0': 5} does NOT                                          // 747
//    match {a: [[5]]}.                                                                                      // 748
//  - arrayIndices: if any array indexing was done during lookup (either due to                              // 749
//    explicit numeric indices or implicit branching), this will be an array of                              // 750
//    the array indices used, from outermost to innermost; it is falsey or                                   // 751
//    absent if no array index is used. If an explicit numeric index is used,                                // 752
//    the index will be followed in arrayIndices by the string 'x'.                                          // 753
//                                                                                                           // 754
//    Note: arrayIndices is used for two purposes. First, it is used to                                      // 755
//    implement the '$' modifier feature, which only ever looks at its first                                 // 756
//    element.                                                                                               // 757
//                                                                                                           // 758
//    Second, it is used for sort key generation, which needs to be able to tell                             // 759
//    the difference between different paths. Moreover, it needs to                                          // 760
//    differentiate between explicit and implicit branching, which is why                                    // 761
//    there's the somewhat hacky 'x' entry: this means that explicit and                                     // 762
//    implicit array lookups will have different full arrayIndices paths. (That                              // 763
//    code only requires that different paths have different arrayIndices; it                                // 764
//    doesn't actually "parse" arrayIndices. As an alternative, arrayIndices                                 // 765
//    could contain objects with flags like "implicit", but I think that only                                // 766
//    makes the code surrounding them more complex.)                                                         // 767
//                                                                                                           // 768
//    (By the way, this field ends up getting passed around a lot without                                    // 769
//    cloning, so never mutate any arrayIndices field/var in this package!)                                  // 770
//                                                                                                           // 771
//                                                                                                           // 772
// At the top level, you may only pass in a plain object or array.                                           // 773
//                                                                                                           // 774
// See the test 'minimongo - lookup' for some examples of what lookup functions                              // 775
// return.                                                                                                   // 776
makeLookupFunction = function (key, options) {                                                               // 777
  options = options || {};                                                                                   // 778
  var parts = key.split('.');                                                                                // 779
  var firstPart = parts.length ? parts[0] : '';                                                              // 780
  var firstPartIsNumeric = isNumericKey(firstPart);                                                          // 781
  var nextPartIsNumeric = parts.length >= 2 && isNumericKey(parts[1]);                                       // 782
  var lookupRest;                                                                                            // 783
  if (parts.length > 1) {                                                                                    // 784
    lookupRest = makeLookupFunction(parts.slice(1).join('.'));                                               // 785
  }                                                                                                          // 786
                                                                                                             // 787
  var omitUnnecessaryFields = function (retVal) {                                                            // 788
    if (!retVal.dontIterate)                                                                                 // 789
      delete retVal.dontIterate;                                                                             // 790
    if (retVal.arrayIndices && !retVal.arrayIndices.length)                                                  // 791
      delete retVal.arrayIndices;                                                                            // 792
    return retVal;                                                                                           // 793
  };                                                                                                         // 794
                                                                                                             // 795
  // Doc will always be a plain object or an array.                                                          // 796
  // apply an explicit numeric index, an array.                                                              // 797
  return function (doc, arrayIndices) {                                                                      // 798
    if (!arrayIndices)                                                                                       // 799
      arrayIndices = [];                                                                                     // 800
                                                                                                             // 801
    if (isArray(doc)) {                                                                                      // 802
      // If we're being asked to do an invalid lookup into an array (non-integer                             // 803
      // or out-of-bounds), return no results (which is different from returning                             // 804
      // a single undefined result, in that `null` equality checks won't match).                             // 805
      if (!(firstPartIsNumeric && firstPart < doc.length))                                                   // 806
        return [];                                                                                           // 807
                                                                                                             // 808
      // Remember that we used this array index. Include an 'x' to indicate that                             // 809
      // the previous index came from being considered as an explicit array                                  // 810
      // index (not branching).                                                                              // 811
      arrayIndices = arrayIndices.concat(+firstPart, 'x');                                                   // 812
    }                                                                                                        // 813
                                                                                                             // 814
    // Do our first lookup.                                                                                  // 815
    var firstLevel = doc[firstPart];                                                                         // 816
                                                                                                             // 817
    // If there is no deeper to dig, return what we found.                                                   // 818
    //                                                                                                       // 819
    // If what we found is an array, most value selectors will choose to treat                               // 820
    // the elements of the array as matchable values in their own right, but                                 // 821
    // that's done outside of the lookup function. (Exceptions to this are $size                             // 822
    // and stuff relating to $elemMatch.  eg, {a: {$size: 2}} does not match {a:                             // 823
    // [[1, 2]]}.)                                                                                           // 824
    //                                                                                                       // 825
    // That said, if we just did an *explicit* array lookup (on doc) to find                                 // 826
    // firstLevel, and firstLevel is an array too, we do NOT want value                                      // 827
    // selectors to iterate over it.  eg, {'a.0': 5} does not match {a: [[5]]}.                              // 828
    // So in that case, we mark the return value as "don't iterate".                                         // 829
    if (!lookupRest) {                                                                                       // 830
      return [omitUnnecessaryFields({                                                                        // 831
        value: firstLevel,                                                                                   // 832
        dontIterate: isArray(doc) && isArray(firstLevel),                                                    // 833
        arrayIndices: arrayIndices})];                                                                       // 834
    }                                                                                                        // 835
                                                                                                             // 836
    // We need to dig deeper.  But if we can't, because what we've found is not                              // 837
    // an array or plain object, we're done. If we just did a numeric index into                             // 838
    // an array, we return nothing here (this is a change in Mongo 2.5 from                                  // 839
    // Mongo 2.4, where {'a.0.b': null} stopped matching {a: [5]}). Otherwise,                               // 840
    // return a single `undefined` (which can, for example, match via equality                               // 841
    // with `null`).                                                                                         // 842
    if (!isIndexable(firstLevel)) {                                                                          // 843
      if (isArray(doc))                                                                                      // 844
        return [];                                                                                           // 845
      return [omitUnnecessaryFields({value: undefined,                                                       // 846
                                      arrayIndices: arrayIndices})];                                         // 847
    }                                                                                                        // 848
                                                                                                             // 849
    var result = [];                                                                                         // 850
    var appendToResult = function (more) {                                                                   // 851
      Array.prototype.push.apply(result, more);                                                              // 852
    };                                                                                                       // 853
                                                                                                             // 854
    // Dig deeper: look up the rest of the parts on whatever we've found.                                    // 855
    // (lookupRest is smart enough to not try to do invalid lookups into                                     // 856
    // firstLevel if it's an array.)                                                                         // 857
    appendToResult(lookupRest(firstLevel, arrayIndices));                                                    // 858
                                                                                                             // 859
    // If we found an array, then in *addition* to potentially treating the next                             // 860
    // part as a literal integer lookup, we should also "branch": try to look up                             // 861
    // the rest of the parts on each array element in parallel.                                              // 862
    //                                                                                                       // 863
    // In this case, we *only* dig deeper into array elements that are plain                                 // 864
    // objects. (Recall that we only got this far if we have further to dig.)                                // 865
    // This makes sense: we certainly don't dig deeper into non-indexable                                    // 866
    // objects. And it would be weird to dig into an array: it's simpler to have                             // 867
    // a rule that explicit integer indexes only apply to an outer array, not to                             // 868
    // an array you find after a branching search.                                                           // 869
    //                                                                                                       // 870
    // In the special case of a numeric part in a *sort selector* (not a query                               // 871
    // selector), we skip the branching: we ONLY allow the numeric part to mean                              // 872
    // "look up this index" in that case, not "also look up this index in all                                // 873
    // the elements of the array".                                                                           // 874
    if (isArray(firstLevel) && !(nextPartIsNumeric && options.forSort)) {                                    // 875
      _.each(firstLevel, function (branch, arrayIndex) {                                                     // 876
        if (isPlainObject(branch)) {                                                                         // 877
          appendToResult(lookupRest(                                                                         // 878
            branch,                                                                                          // 879
            arrayIndices.concat(arrayIndex)));                                                               // 880
        }                                                                                                    // 881
      });                                                                                                    // 882
    }                                                                                                        // 883
                                                                                                             // 884
    return result;                                                                                           // 885
  };                                                                                                         // 886
};                                                                                                           // 887
MinimongoTest.makeLookupFunction = makeLookupFunction;                                                       // 888
                                                                                                             // 889
expandArraysInBranches = function (branches, skipTheArrays) {                                                // 890
  var branchesOut = [];                                                                                      // 891
  _.each(branches, function (branch) {                                                                       // 892
    var thisIsArray = isArray(branch.value);                                                                 // 893
    // We include the branch itself, *UNLESS* we it's an array that we're going                              // 894
    // to iterate and we're told to skip arrays.  (That's right, we include some                             // 895
    // arrays even skipTheArrays is true: these are arrays that were found via                               // 896
    // explicit numerical indices.)                                                                          // 897
    if (!(skipTheArrays && thisIsArray && !branch.dontIterate)) {                                            // 898
      branchesOut.push({                                                                                     // 899
        value: branch.value,                                                                                 // 900
        arrayIndices: branch.arrayIndices                                                                    // 901
      });                                                                                                    // 902
    }                                                                                                        // 903
    if (thisIsArray && !branch.dontIterate) {                                                                // 904
      _.each(branch.value, function (leaf, i) {                                                              // 905
        branchesOut.push({                                                                                   // 906
          value: leaf,                                                                                       // 907
          arrayIndices: (branch.arrayIndices || []).concat(i)                                                // 908
        });                                                                                                  // 909
      });                                                                                                    // 910
    }                                                                                                        // 911
  });                                                                                                        // 912
  return branchesOut;                                                                                        // 913
};                                                                                                           // 914
                                                                                                             // 915
var nothingMatcher = function (docOrBranchedValues) {                                                        // 916
  return {result: false};                                                                                    // 917
};                                                                                                           // 918
                                                                                                             // 919
var everythingMatcher = function (docOrBranchedValues) {                                                     // 920
  return {result: true};                                                                                     // 921
};                                                                                                           // 922
                                                                                                             // 923
                                                                                                             // 924
// NB: We are cheating and using this function to implement "AND" for both                                   // 925
// "document matchers" and "branched matchers". They both return result objects                              // 926
// but the argument is different: for the former it's a whole doc, whereas for                               // 927
// the latter it's an array of "branched values".                                                            // 928
var andSomeMatchers = function (subMatchers) {                                                               // 929
  if (subMatchers.length === 0)                                                                              // 930
    return everythingMatcher;                                                                                // 931
  if (subMatchers.length === 1)                                                                              // 932
    return subMatchers[0];                                                                                   // 933
                                                                                                             // 934
  return function (docOrBranches) {                                                                          // 935
    var ret = {};                                                                                            // 936
    ret.result = _.all(subMatchers, function (f) {                                                           // 937
      var subResult = f(docOrBranches);                                                                      // 938
      // Copy a 'distance' number out of the first sub-matcher that has                                      // 939
      // one. Yes, this means that if there are multiple $near fields in a                                   // 940
      // query, something arbitrary happens; this appears to be consistent with                              // 941
      // Mongo.                                                                                              // 942
      if (subResult.result && subResult.distance !== undefined                                               // 943
          && ret.distance === undefined) {                                                                   // 944
        ret.distance = subResult.distance;                                                                   // 945
      }                                                                                                      // 946
      // Similarly, propagate arrayIndices from sub-matchers... but to match                                 // 947
      // MongoDB behavior, this time the *last* sub-matcher with arrayIndices                                // 948
      // wins.                                                                                               // 949
      if (subResult.result && subResult.arrayIndices) {                                                      // 950
        ret.arrayIndices = subResult.arrayIndices;                                                           // 951
      }                                                                                                      // 952
      return subResult.result;                                                                               // 953
    });                                                                                                      // 954
                                                                                                             // 955
    // If we didn't actually match, forget any extra metadata we came up with.                               // 956
    if (!ret.result) {                                                                                       // 957
      delete ret.distance;                                                                                   // 958
      delete ret.arrayIndices;                                                                               // 959
    }                                                                                                        // 960
    return ret;                                                                                              // 961
  };                                                                                                         // 962
};                                                                                                           // 963
                                                                                                             // 964
var andDocumentMatchers = andSomeMatchers;                                                                   // 965
var andBranchedMatchers = andSomeMatchers;                                                                   // 966
                                                                                                             // 967
                                                                                                             // 968
// helpers used by compiled selector code                                                                    // 969
LocalCollection._f = {                                                                                       // 970
  // XXX for _all and _in, consider building 'inquery' at compile time..                                     // 971
                                                                                                             // 972
  _type: function (v) {                                                                                      // 973
    if (typeof v === "number")                                                                               // 974
      return 1;                                                                                              // 975
    if (typeof v === "string")                                                                               // 976
      return 2;                                                                                              // 977
    if (typeof v === "boolean")                                                                              // 978
      return 8;                                                                                              // 979
    if (isArray(v))                                                                                          // 980
      return 4;                                                                                              // 981
    if (v === null)                                                                                          // 982
      return 10;                                                                                             // 983
    if (v instanceof RegExp)                                                                                 // 984
      // note that typeof(/x/) === "object"                                                                  // 985
      return 11;                                                                                             // 986
    if (typeof v === "function")                                                                             // 987
      return 13;                                                                                             // 988
    if (v instanceof Date)                                                                                   // 989
      return 9;                                                                                              // 990
    if (EJSON.isBinary(v))                                                                                   // 991
      return 5;                                                                                              // 992
    if (v instanceof LocalCollection._ObjectID)                                                              // 993
      return 7;                                                                                              // 994
    return 3; // object                                                                                      // 995
                                                                                                             // 996
    // XXX support some/all of these:                                                                        // 997
    // 14, symbol                                                                                            // 998
    // 15, javascript code with scope                                                                        // 999
    // 16, 18: 32-bit/64-bit integer                                                                         // 1000
    // 17, timestamp                                                                                         // 1001
    // 255, minkey                                                                                           // 1002
    // 127, maxkey                                                                                           // 1003
  },                                                                                                         // 1004
                                                                                                             // 1005
  // deep equality test: use for literal document and array matches                                          // 1006
  _equal: function (a, b) {                                                                                  // 1007
    return EJSON.equals(a, b, {keyOrderSensitive: true});                                                    // 1008
  },                                                                                                         // 1009
                                                                                                             // 1010
  // maps a type code to a value that can be used to sort values of                                          // 1011
  // different types                                                                                         // 1012
  _typeorder: function (t) {                                                                                 // 1013
    // http://www.mongodb.org/display/DOCS/What+is+the+Compare+Order+for+BSON+Types                          // 1014
    // XXX what is the correct sort position for Javascript code?                                            // 1015
    // ('100' in the matrix below)                                                                           // 1016
    // XXX minkey/maxkey                                                                                     // 1017
    return [-1,  // (not a type)                                                                             // 1018
            1,   // number                                                                                   // 1019
            2,   // string                                                                                   // 1020
            3,   // object                                                                                   // 1021
            4,   // array                                                                                    // 1022
            5,   // binary                                                                                   // 1023
            -1,  // deprecated                                                                               // 1024
            6,   // ObjectID                                                                                 // 1025
            7,   // bool                                                                                     // 1026
            8,   // Date                                                                                     // 1027
            0,   // null                                                                                     // 1028
            9,   // RegExp                                                                                   // 1029
            -1,  // deprecated                                                                               // 1030
            100, // JS code                                                                                  // 1031
            2,   // deprecated (symbol)                                                                      // 1032
            100, // JS code                                                                                  // 1033
            1,   // 32-bit int                                                                               // 1034
            8,   // Mongo timestamp                                                                          // 1035
            1    // 64-bit int                                                                               // 1036
           ][t];                                                                                             // 1037
  },                                                                                                         // 1038
                                                                                                             // 1039
  // compare two values of unknown type according to BSON ordering                                           // 1040
  // semantics. (as an extension, consider 'undefined' to be less than                                       // 1041
  // any other value.) return negative if a is less, positive if b is                                        // 1042
  // less, or 0 if equal                                                                                     // 1043
  _cmp: function (a, b) {                                                                                    // 1044
    if (a === undefined)                                                                                     // 1045
      return b === undefined ? 0 : -1;                                                                       // 1046
    if (b === undefined)                                                                                     // 1047
      return 1;                                                                                              // 1048
    var ta = LocalCollection._f._type(a);                                                                    // 1049
    var tb = LocalCollection._f._type(b);                                                                    // 1050
    var oa = LocalCollection._f._typeorder(ta);                                                              // 1051
    var ob = LocalCollection._f._typeorder(tb);                                                              // 1052
    if (oa !== ob)                                                                                           // 1053
      return oa < ob ? -1 : 1;                                                                               // 1054
    if (ta !== tb)                                                                                           // 1055
      // XXX need to implement this if we implement Symbol or integers, or                                   // 1056
      // Timestamp                                                                                           // 1057
      throw Error("Missing type coercion logic in _cmp");                                                    // 1058
    if (ta === 7) { // ObjectID                                                                              // 1059
      // Convert to string.                                                                                  // 1060
      ta = tb = 2;                                                                                           // 1061
      a = a.toHexString();                                                                                   // 1062
      b = b.toHexString();                                                                                   // 1063
    }                                                                                                        // 1064
    if (ta === 9) { // Date                                                                                  // 1065
      // Convert to millis.                                                                                  // 1066
      ta = tb = 1;                                                                                           // 1067
      a = a.getTime();                                                                                       // 1068
      b = b.getTime();                                                                                       // 1069
    }                                                                                                        // 1070
                                                                                                             // 1071
    if (ta === 1) // double                                                                                  // 1072
      return a - b;                                                                                          // 1073
    if (tb === 2) // string                                                                                  // 1074
      return a < b ? -1 : (a === b ? 0 : 1);                                                                 // 1075
    if (ta === 3) { // Object                                                                                // 1076
      // this could be much more efficient in the expected case ...                                          // 1077
      var to_array = function (obj) {                                                                        // 1078
        var ret = [];                                                                                        // 1079
        for (var key in obj) {                                                                               // 1080
          ret.push(key);                                                                                     // 1081
          ret.push(obj[key]);                                                                                // 1082
        }                                                                                                    // 1083
        return ret;                                                                                          // 1084
      };                                                                                                     // 1085
      return LocalCollection._f._cmp(to_array(a), to_array(b));                                              // 1086
    }                                                                                                        // 1087
    if (ta === 4) { // Array                                                                                 // 1088
      for (var i = 0; ; i++) {                                                                               // 1089
        if (i === a.length)                                                                                  // 1090
          return (i === b.length) ? 0 : -1;                                                                  // 1091
        if (i === b.length)                                                                                  // 1092
          return 1;                                                                                          // 1093
        var s = LocalCollection._f._cmp(a[i], b[i]);                                                         // 1094
        if (s !== 0)                                                                                         // 1095
          return s;                                                                                          // 1096
      }                                                                                                      // 1097
    }                                                                                                        // 1098
    if (ta === 5) { // binary                                                                                // 1099
      // Surprisingly, a small binary blob is always less than a large one in                                // 1100
      // Mongo.                                                                                              // 1101
      if (a.length !== b.length)                                                                             // 1102
        return a.length - b.length;                                                                          // 1103
      for (i = 0; i < a.length; i++) {                                                                       // 1104
        if (a[i] < b[i])                                                                                     // 1105
          return -1;                                                                                         // 1106
        if (a[i] > b[i])                                                                                     // 1107
          return 1;                                                                                          // 1108
      }                                                                                                      // 1109
      return 0;                                                                                              // 1110
    }                                                                                                        // 1111
    if (ta === 8) { // boolean                                                                               // 1112
      if (a) return b ? 0 : 1;                                                                               // 1113
      return b ? -1 : 0;                                                                                     // 1114
    }                                                                                                        // 1115
    if (ta === 10) // null                                                                                   // 1116
      return 0;                                                                                              // 1117
    if (ta === 11) // regexp                                                                                 // 1118
      throw Error("Sorting not supported on regular expression"); // XXX                                     // 1119
    // 13: javascript code                                                                                   // 1120
    // 14: symbol                                                                                            // 1121
    // 15: javascript code with scope                                                                        // 1122
    // 16: 32-bit integer                                                                                    // 1123
    // 17: timestamp                                                                                         // 1124
    // 18: 64-bit integer                                                                                    // 1125
    // 255: minkey                                                                                           // 1126
    // 127: maxkey                                                                                           // 1127
    if (ta === 13) // javascript code                                                                        // 1128
      throw Error("Sorting not supported on Javascript code"); // XXX                                        // 1129
    throw Error("Unknown type to sort");                                                                     // 1130
  }                                                                                                          // 1131
};                                                                                                           // 1132
                                                                                                             // 1133
// Oddball function used by upsert.                                                                          // 1134
LocalCollection._removeDollarOperators = function (selector) {                                               // 1135
  var selectorDoc = {};                                                                                      // 1136
  for (var k in selector)                                                                                    // 1137
    if (k.substr(0, 1) !== '$')                                                                              // 1138
      selectorDoc[k] = selector[k];                                                                          // 1139
  return selectorDoc;                                                                                        // 1140
};                                                                                                           // 1141
                                                                                                             // 1142
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/sort.js                                                                                //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// Give a sort spec, which can be in any of these forms:                                                     // 1
//   {"key1": 1, "key2": -1}                                                                                 // 2
//   [["key1", "asc"], ["key2", "desc"]]                                                                     // 3
//   ["key1", ["key2", "desc"]]                                                                              // 4
//                                                                                                           // 5
// (.. with the first form being dependent on the key enumeration                                            // 6
// behavior of your javascript VM, which usually does what you mean in                                       // 7
// this case if the key names don't look like integers ..)                                                   // 8
//                                                                                                           // 9
// return a function that takes two objects, and returns -1 if the                                           // 10
// first object comes first in order, 1 if the second object comes                                           // 11
// first, or 0 if neither object comes before the other.                                                     // 12
                                                                                                             // 13
Minimongo.Sorter = function (spec, options) {                                                                // 14
  var self = this;                                                                                           // 15
  options = options || {};                                                                                   // 16
                                                                                                             // 17
  self._sortSpecParts = [];                                                                                  // 18
                                                                                                             // 19
  var addSpecPart = function (path, ascending) {                                                             // 20
    if (!path)                                                                                               // 21
      throw Error("sort keys must be non-empty");                                                            // 22
    if (path.charAt(0) === '$')                                                                              // 23
      throw Error("unsupported sort key: " + path);                                                          // 24
    self._sortSpecParts.push({                                                                               // 25
      path: path,                                                                                            // 26
      lookup: makeLookupFunction(path, {forSort: true}),                                                     // 27
      ascending: ascending                                                                                   // 28
    });                                                                                                      // 29
  };                                                                                                         // 30
                                                                                                             // 31
  if (spec instanceof Array) {                                                                               // 32
    for (var i = 0; i < spec.length; i++) {                                                                  // 33
      if (typeof spec[i] === "string") {                                                                     // 34
        addSpecPart(spec[i], true);                                                                          // 35
      } else {                                                                                               // 36
        addSpecPart(spec[i][0], spec[i][1] !== "desc");                                                      // 37
      }                                                                                                      // 38
    }                                                                                                        // 39
  } else if (typeof spec === "object") {                                                                     // 40
    _.each(spec, function (value, key) {                                                                     // 41
      addSpecPart(key, value >= 0);                                                                          // 42
    });                                                                                                      // 43
  } else {                                                                                                   // 44
    throw Error("Bad sort specification: " + JSON.stringify(spec));                                          // 45
  }                                                                                                          // 46
                                                                                                             // 47
  // To implement affectedByModifier, we piggy-back on top of Matcher's                                      // 48
  // affectedByModifier code; we create a selector that is affected by the same                              // 49
  // modifiers as this sort order. This is only implemented on the server.                                   // 50
  if (self.affectedByModifier) {                                                                             // 51
    var selector = {};                                                                                       // 52
    _.each(self._sortSpecParts, function (spec) {                                                            // 53
      selector[spec.path] = 1;                                                                               // 54
    });                                                                                                      // 55
    self._selectorForAffectedByModifier = new Minimongo.Matcher(selector);                                   // 56
  }                                                                                                          // 57
                                                                                                             // 58
  self._keyComparator = composeComparators(                                                                  // 59
    _.map(self._sortSpecParts, function (spec, i) {                                                          // 60
      return self._keyFieldComparator(i);                                                                    // 61
    }));                                                                                                     // 62
                                                                                                             // 63
  // If you specify a matcher for this Sorter, _keyFilter may be set to a                                    // 64
  // function which selects whether or not a given "sort key" (tuple of values                               // 65
  // for the different sort spec fields) is compatible with the selector.                                    // 66
  self._keyFilter = null;                                                                                    // 67
  options.matcher && self._useWithMatcher(options.matcher);                                                  // 68
};                                                                                                           // 69
                                                                                                             // 70
// In addition to these methods, sorter_project.js defines combineIntoProjection                             // 71
// on the server only.                                                                                       // 72
_.extend(Minimongo.Sorter.prototype, {                                                                       // 73
  getComparator: function (options) {                                                                        // 74
    var self = this;                                                                                         // 75
                                                                                                             // 76
    // If we have no distances, just use the comparator from the source                                      // 77
    // specification (which defaults to "everything is equal".                                               // 78
    if (!options || !options.distances) {                                                                    // 79
      return self._getBaseComparator();                                                                      // 80
    }                                                                                                        // 81
                                                                                                             // 82
    var distances = options.distances;                                                                       // 83
                                                                                                             // 84
    // Return a comparator which first tries the sort specification, and if that                             // 85
    // says "it's equal", breaks ties using $near distances.                                                 // 86
    return composeComparators([self._getBaseComparator(), function (a, b) {                                  // 87
      if (!distances.has(a._id))                                                                             // 88
        throw Error("Missing distance for " + a._id);                                                        // 89
      if (!distances.has(b._id))                                                                             // 90
        throw Error("Missing distance for " + b._id);                                                        // 91
      return distances.get(a._id) - distances.get(b._id);                                                    // 92
    }]);                                                                                                     // 93
  },                                                                                                         // 94
                                                                                                             // 95
  _getPaths: function () {                                                                                   // 96
    var self = this;                                                                                         // 97
    return _.pluck(self._sortSpecParts, 'path');                                                             // 98
  },                                                                                                         // 99
                                                                                                             // 100
  // Finds the minimum key from the doc, according to the sort specs.  (We say                               // 101
  // "minimum" here but this is with respect to the sort spec, so "descending"                               // 102
  // sort fields mean we're finding the max for that field.)                                                 // 103
  //                                                                                                         // 104
  // Note that this is NOT "find the minimum value of the first field, the                                   // 105
  // minimum value of the second field, etc"... it's "choose the                                             // 106
  // lexicographically minimum value of the key vector, allowing only keys which                             // 107
  // you can find along the same paths".  ie, for a doc {a: [{x: 0, y: 5}, {x:                               // 108
  // 1, y: 3}]} with sort spec {'a.x': 1, 'a.y': 1}, the only keys are [0,5] and                             // 109
  // [1,3], and the minimum key is [0,5]; notably, [0,3] is NOT a key.                                       // 110
  _getMinKeyFromDoc: function (doc) {                                                                        // 111
    var self = this;                                                                                         // 112
    var minKey = null;                                                                                       // 113
                                                                                                             // 114
    self._generateKeysFromDoc(doc, function (key) {                                                          // 115
      if (!self._keyCompatibleWithSelector(key))                                                             // 116
        return;                                                                                              // 117
                                                                                                             // 118
      if (minKey === null) {                                                                                 // 119
        minKey = key;                                                                                        // 120
        return;                                                                                              // 121
      }                                                                                                      // 122
      if (self._compareKeys(key, minKey) < 0) {                                                              // 123
        minKey = key;                                                                                        // 124
      }                                                                                                      // 125
    });                                                                                                      // 126
                                                                                                             // 127
    // This could happen if our key filter somehow filters out all the keys even                             // 128
    // though somehow the selector matches.                                                                  // 129
    if (minKey === null)                                                                                     // 130
      throw Error("sort selector found no keys in doc?");                                                    // 131
    return minKey;                                                                                           // 132
  },                                                                                                         // 133
                                                                                                             // 134
  _keyCompatibleWithSelector: function (key) {                                                               // 135
    var self = this;                                                                                         // 136
    return !self._keyFilter || self._keyFilter(key);                                                         // 137
  },                                                                                                         // 138
                                                                                                             // 139
  // Iterates over each possible "key" from doc (ie, over each branch), calling                              // 140
  // 'cb' with the key.                                                                                      // 141
  _generateKeysFromDoc: function (doc, cb) {                                                                 // 142
    var self = this;                                                                                         // 143
                                                                                                             // 144
    if (self._sortSpecParts.length === 0)                                                                    // 145
      throw new Error("can't generate keys without a spec");                                                 // 146
                                                                                                             // 147
    // maps index -> ({'' -> value} or {path -> value})                                                      // 148
    var valuesByIndexAndPath = [];                                                                           // 149
                                                                                                             // 150
    var pathFromIndices = function (indices) {                                                               // 151
      return indices.join(',') + ',';                                                                        // 152
    };                                                                                                       // 153
                                                                                                             // 154
    var knownPaths = null;                                                                                   // 155
                                                                                                             // 156
    _.each(self._sortSpecParts, function (spec, whichField) {                                                // 157
      // Expand any leaf arrays that we find, and ignore those arrays                                        // 158
      // themselves.  (We never sort based on an array itself.)                                              // 159
      var branches = expandArraysInBranches(spec.lookup(doc), true);                                         // 160
                                                                                                             // 161
      // If there are no values for a key (eg, key goes to an empty array),                                  // 162
      // pretend we found one null value.                                                                    // 163
      if (!branches.length)                                                                                  // 164
        branches = [{value: null}];                                                                          // 165
                                                                                                             // 166
      var usedPaths = false;                                                                                 // 167
      valuesByIndexAndPath[whichField] = {};                                                                 // 168
      _.each(branches, function (branch) {                                                                   // 169
        if (!branch.arrayIndices) {                                                                          // 170
          // If there are no array indices for a branch, then it must be the                                 // 171
          // only branch, because the only thing that produces multiple branches                             // 172
          // is the use of arrays.                                                                           // 173
          if (branches.length > 1)                                                                           // 174
            throw Error("multiple branches but no array used?");                                             // 175
          valuesByIndexAndPath[whichField][''] = branch.value;                                               // 176
          return;                                                                                            // 177
        }                                                                                                    // 178
                                                                                                             // 179
        usedPaths = true;                                                                                    // 180
        var path = pathFromIndices(branch.arrayIndices);                                                     // 181
        if (_.has(valuesByIndexAndPath[whichField], path))                                                   // 182
          throw Error("duplicate path: " + path);                                                            // 183
        valuesByIndexAndPath[whichField][path] = branch.value;                                               // 184
                                                                                                             // 185
        // If two sort fields both go into arrays, they have to go into the                                  // 186
        // exact same arrays and we have to find the same paths.  This is                                    // 187
        // roughly the same condition that makes MongoDB throw this strange                                  // 188
        // error message.  eg, the main thing is that if sort spec is {a: 1,                                 // 189
        // b:1} then a and b cannot both be arrays.                                                          // 190
        //                                                                                                   // 191
        // (In MongoDB it seems to be OK to have {a: 1, 'a.x.y': 1} where 'a'                                // 192
        // and 'a.x.y' are both arrays, but we don't allow this for now.                                     // 193
        // #NestedArraySort                                                                                  // 194
        // XXX achieve full compatibility here                                                               // 195
        if (knownPaths && !_.has(knownPaths, path)) {                                                        // 196
          throw Error("cannot index parallel arrays");                                                       // 197
        }                                                                                                    // 198
      });                                                                                                    // 199
                                                                                                             // 200
      if (knownPaths) {                                                                                      // 201
        // Similarly to above, paths must match everywhere, unless this is a                                 // 202
        // non-array field.                                                                                  // 203
        if (!_.has(valuesByIndexAndPath[whichField], '') &&                                                  // 204
            _.size(knownPaths) !== _.size(valuesByIndexAndPath[whichField])) {                               // 205
          throw Error("cannot index parallel arrays!");                                                      // 206
        }                                                                                                    // 207
      } else if (usedPaths) {                                                                                // 208
        knownPaths = {};                                                                                     // 209
        _.each(valuesByIndexAndPath[whichField], function (x, path) {                                        // 210
          knownPaths[path] = true;                                                                           // 211
        });                                                                                                  // 212
      }                                                                                                      // 213
    });                                                                                                      // 214
                                                                                                             // 215
    if (!knownPaths) {                                                                                       // 216
      // Easy case: no use of arrays.                                                                        // 217
      var soleKey = _.map(valuesByIndexAndPath, function (values) {                                          // 218
        if (!_.has(values, ''))                                                                              // 219
          throw Error("no value in sole key case?");                                                         // 220
        return values[''];                                                                                   // 221
      });                                                                                                    // 222
      cb(soleKey);                                                                                           // 223
      return;                                                                                                // 224
    }                                                                                                        // 225
                                                                                                             // 226
    _.each(knownPaths, function (x, path) {                                                                  // 227
      var key = _.map(valuesByIndexAndPath, function (values) {                                              // 228
        if (_.has(values, ''))                                                                               // 229
          return values[''];                                                                                 // 230
        if (!_.has(values, path))                                                                            // 231
          throw Error("missing path?");                                                                      // 232
        return values[path];                                                                                 // 233
      });                                                                                                    // 234
      cb(key);                                                                                               // 235
    });                                                                                                      // 236
  },                                                                                                         // 237
                                                                                                             // 238
  // Takes in two keys: arrays whose lengths match the number of spec                                        // 239
  // parts. Returns negative, 0, or positive based on using the sort spec to                                 // 240
  // compare fields.                                                                                         // 241
  _compareKeys: function (key1, key2) {                                                                      // 242
    var self = this;                                                                                         // 243
    if (key1.length !== self._sortSpecParts.length ||                                                        // 244
        key2.length !== self._sortSpecParts.length) {                                                        // 245
      throw Error("Key has wrong length");                                                                   // 246
    }                                                                                                        // 247
                                                                                                             // 248
    return self._keyComparator(key1, key2);                                                                  // 249
  },                                                                                                         // 250
                                                                                                             // 251
  // Given an index 'i', returns a comparator that compares two key arrays based                             // 252
  // on field 'i'.                                                                                           // 253
  _keyFieldComparator: function (i) {                                                                        // 254
    var self = this;                                                                                         // 255
    var invert = !self._sortSpecParts[i].ascending;                                                          // 256
    return function (key1, key2) {                                                                           // 257
      var compare = LocalCollection._f._cmp(key1[i], key2[i]);                                               // 258
      if (invert)                                                                                            // 259
        compare = -compare;                                                                                  // 260
      return compare;                                                                                        // 261
    };                                                                                                       // 262
  },                                                                                                         // 263
                                                                                                             // 264
  // Returns a comparator that represents the sort specification (but not                                    // 265
  // including a possible geoquery distance tie-breaker).                                                    // 266
  _getBaseComparator: function () {                                                                          // 267
    var self = this;                                                                                         // 268
                                                                                                             // 269
    // If we're only sorting on geoquery distance and no specs, just say                                     // 270
    // everything is equal.                                                                                  // 271
    if (!self._sortSpecParts.length) {                                                                       // 272
      return function (doc1, doc2) {                                                                         // 273
        return 0;                                                                                            // 274
      };                                                                                                     // 275
    }                                                                                                        // 276
                                                                                                             // 277
    return function (doc1, doc2) {                                                                           // 278
      var key1 = self._getMinKeyFromDoc(doc1);                                                               // 279
      var key2 = self._getMinKeyFromDoc(doc2);                                                               // 280
      return self._compareKeys(key1, key2);                                                                  // 281
    };                                                                                                       // 282
  },                                                                                                         // 283
                                                                                                             // 284
  // In MongoDB, if you have documents                                                                       // 285
  //    {_id: 'x', a: [1, 10]} and                                                                           // 286
  //    {_id: 'y', a: [5, 15]},                                                                              // 287
  // then C.find({}, {sort: {a: 1}}) puts x before y (1 comes before 5).                                     // 288
  // But  C.find({a: {$gt: 3}}, {sort: {a: 1}}) puts y before x (1 does not                                  // 289
  // match the selector, and 5 comes before 10).                                                             // 290
  //                                                                                                         // 291
  // The way this works is pretty subtle!  For example, if the documents                                     // 292
  // are instead {_id: 'x', a: [{x: 1}, {x: 10}]}) and                                                       // 293
  //             {_id: 'y', a: [{x: 5}, {x: 15}]}),                                                          // 294
  // then C.find({'a.x': {$gt: 3}}, {sort: {'a.x': 1}}) and                                                  // 295
  //      C.find({a: {$elemMatch: {x: {$gt: 3}}}}, {sort: {'a.x': 1}})                                       // 296
  // both follow this rule (y before x).  (ie, you do have to apply this                                     // 297
  // through $elemMatch.)                                                                                    // 298
  //                                                                                                         // 299
  // So if you pass a matcher to this sorter's constructor, we will attempt to                               // 300
  // skip sort keys that don't match the selector. The logic here is pretty                                  // 301
  // subtle and undocumented; we've gotten as close as we can figure out based                               // 302
  // on our understanding of Mongo's behavior.                                                               // 303
  _useWithMatcher: function (matcher) {                                                                      // 304
    var self = this;                                                                                         // 305
                                                                                                             // 306
    if (self._keyFilter)                                                                                     // 307
      throw Error("called _useWithMatcher twice?");                                                          // 308
                                                                                                             // 309
    // If we are only sorting by distance, then we're not going to bother to                                 // 310
    // build a key filter.                                                                                   // 311
    // XXX figure out how geoqueries interact with this stuff                                                // 312
    if (_.isEmpty(self._sortSpecParts))                                                                      // 313
      return;                                                                                                // 314
                                                                                                             // 315
    var selector = matcher._selector;                                                                        // 316
                                                                                                             // 317
    // If the user just passed a literal function to find(), then we can't get a                             // 318
    // key filter from it.                                                                                   // 319
    if (selector instanceof Function)                                                                        // 320
      return;                                                                                                // 321
                                                                                                             // 322
    var constraintsByPath = {};                                                                              // 323
    _.each(self._sortSpecParts, function (spec, i) {                                                         // 324
      constraintsByPath[spec.path] = [];                                                                     // 325
    });                                                                                                      // 326
                                                                                                             // 327
    _.each(selector, function (subSelector, key) {                                                           // 328
      // XXX support $and and $or                                                                            // 329
                                                                                                             // 330
      var constraints = constraintsByPath[key];                                                              // 331
      if (!constraints)                                                                                      // 332
        return;                                                                                              // 333
                                                                                                             // 334
      // XXX it looks like the real MongoDB implementation isn't "does the                                   // 335
      // regexp match" but "does the value fall into a range named by the                                    // 336
      // literal prefix of the regexp", ie "foo" in /^foo(bar|baz)+/  But                                    // 337
      // "does the regexp match" is a good approximation.                                                    // 338
      if (subSelector instanceof RegExp) {                                                                   // 339
        // As far as we can tell, using either of the options that both we and                               // 340
        // MongoDB support ('i' and 'm') disables use of the key filter. This                                // 341
        // makes sense: MongoDB mostly appears to be calculating ranges of an                                // 342
        // index to use, which means it only cares about regexps that match                                  // 343
        // one range (with a literal prefix), and both 'i' and 'm' prevent the                               // 344
        // literal prefix of the regexp from actually meaning one range.                                     // 345
        if (subSelector.ignoreCase || subSelector.multiline)                                                 // 346
          return;                                                                                            // 347
        constraints.push(regexpElementMatcher(subSelector));                                                 // 348
        return;                                                                                              // 349
      }                                                                                                      // 350
                                                                                                             // 351
      if (isOperatorObject(subSelector)) {                                                                   // 352
        _.each(subSelector, function (operand, operator) {                                                   // 353
          if (_.contains(['$lt', '$lte', '$gt', '$gte'], operator)) {                                        // 354
            // XXX this depends on us knowing that these operators don't use any                             // 355
            // of the arguments to compileElementSelector other than operand.                                // 356
            constraints.push(                                                                                // 357
              ELEMENT_OPERATORS[operator].compileElementSelector(operand));                                  // 358
          }                                                                                                  // 359
                                                                                                             // 360
          // See comments in the RegExp block above.                                                         // 361
          if (operator === '$regex' && !subSelector.$options) {                                              // 362
            constraints.push(                                                                                // 363
              ELEMENT_OPERATORS.$regex.compileElementSelector(                                               // 364
                operand, subSelector));                                                                      // 365
          }                                                                                                  // 366
                                                                                                             // 367
          // XXX support {$exists: true}, $mod, $type, $in, $elemMatch                                       // 368
        });                                                                                                  // 369
        return;                                                                                              // 370
      }                                                                                                      // 371
                                                                                                             // 372
      // OK, it's an equality thing.                                                                         // 373
      constraints.push(equalityElementMatcher(subSelector));                                                 // 374
    });                                                                                                      // 375
                                                                                                             // 376
    // It appears that the first sort field is treated differently from the                                  // 377
    // others; we shouldn't create a key filter unless the first sort field is                               // 378
    // restricted, though after that point we can restrict the other sort fields                             // 379
    // or not as we wish.                                                                                    // 380
    if (_.isEmpty(constraintsByPath[self._sortSpecParts[0].path]))                                           // 381
      return;                                                                                                // 382
                                                                                                             // 383
    self._keyFilter = function (key) {                                                                       // 384
      return _.all(self._sortSpecParts, function (specPart, index) {                                         // 385
        return _.all(constraintsByPath[specPart.path], function (f) {                                        // 386
          return f(key[index]);                                                                              // 387
        });                                                                                                  // 388
      });                                                                                                    // 389
    };                                                                                                       // 390
  }                                                                                                          // 391
});                                                                                                          // 392
                                                                                                             // 393
// Given an array of comparators                                                                             // 394
// (functions (a,b)->(negative or positive or zero)), returns a single                                       // 395
// comparator which uses each comparator in order and returns the first                                      // 396
// non-zero value.                                                                                           // 397
var composeComparators = function (comparatorArray) {                                                        // 398
  return function (a, b) {                                                                                   // 399
    for (var i = 0; i < comparatorArray.length; ++i) {                                                       // 400
      var compare = comparatorArray[i](a, b);                                                                // 401
      if (compare !== 0)                                                                                     // 402
        return compare;                                                                                      // 403
    }                                                                                                        // 404
    return 0;                                                                                                // 405
  };                                                                                                         // 406
};                                                                                                           // 407
                                                                                                             // 408
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/projection.js                                                                          //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// Knows how to compile a fields projection to a predicate function.                                         // 1
// @returns - Function: a closure that filters out an object according to the                                // 2
//            fields projection rules:                                                                       // 3
//            @param obj - Object: MongoDB-styled document                                                   // 4
//            @returns - Object: a document with the fields filtered out                                     // 5
//                       according to projection rules. Doesn't retain subfields                             // 6
//                       of passed argument.                                                                 // 7
LocalCollection._compileProjection = function (fields) {                                                     // 8
  LocalCollection._checkSupportedProjection(fields);                                                         // 9
                                                                                                             // 10
  var _idProjection = _.isUndefined(fields._id) ? true : fields._id;                                         // 11
  var details = projectionDetails(fields);                                                                   // 12
                                                                                                             // 13
  // returns transformed doc according to ruleTree                                                           // 14
  var transform = function (doc, ruleTree) {                                                                 // 15
    // Special case for "sets"                                                                               // 16
    if (_.isArray(doc))                                                                                      // 17
      return _.map(doc, function (subdoc) { return transform(subdoc, ruleTree); });                          // 18
                                                                                                             // 19
    var res = details.including ? {} : EJSON.clone(doc);                                                     // 20
    _.each(ruleTree, function (rule, key) {                                                                  // 21
      if (!_.has(doc, key))                                                                                  // 22
        return;                                                                                              // 23
      if (_.isObject(rule)) {                                                                                // 24
        // For sub-objects/subsets we branch                                                                 // 25
        if (_.isObject(doc[key]))                                                                            // 26
          res[key] = transform(doc[key], rule);                                                              // 27
        // Otherwise we don't even touch this subfield                                                       // 28
      } else if (details.including)                                                                          // 29
        res[key] = EJSON.clone(doc[key]);                                                                    // 30
      else                                                                                                   // 31
        delete res[key];                                                                                     // 32
    });                                                                                                      // 33
                                                                                                             // 34
    return res;                                                                                              // 35
  };                                                                                                         // 36
                                                                                                             // 37
  return function (obj) {                                                                                    // 38
    var res = transform(obj, details.tree);                                                                  // 39
                                                                                                             // 40
    if (_idProjection && _.has(obj, '_id'))                                                                  // 41
      res._id = obj._id;                                                                                     // 42
    if (!_idProjection && _.has(res, '_id'))                                                                 // 43
      delete res._id;                                                                                        // 44
    return res;                                                                                              // 45
  };                                                                                                         // 46
};                                                                                                           // 47
                                                                                                             // 48
// Traverses the keys of passed projection and constructs a tree where all                                   // 49
// leaves are either all True or all False                                                                   // 50
// @returns Object:                                                                                          // 51
//  - tree - Object - tree representation of keys involved in projection                                     // 52
//  (exception for '_id' as it is a special case handled separately)                                         // 53
//  - including - Boolean - "take only certain fields" type of projection                                    // 54
projectionDetails = function (fields) {                                                                      // 55
  // Find the non-_id keys (_id is handled specially because it is included unless                           // 56
  // explicitly excluded). Sort the keys, so that our code to detect overlaps                                // 57
  // like 'foo' and 'foo.bar' can assume that 'foo' comes first.                                             // 58
  var fieldsKeys = _.keys(fields).sort();                                                                    // 59
                                                                                                             // 60
  // If there are other rules other than '_id', treat '_id' differently in a                                 // 61
  // separate case. If '_id' is the only rule, use it to understand if it is                                 // 62
  // including/excluding projection.                                                                         // 63
  if (fieldsKeys.length > 0 && !(fieldsKeys.length === 1 && fieldsKeys[0] === '_id'))                        // 64
    fieldsKeys = _.reject(fieldsKeys, function (key) { return key === '_id'; });                             // 65
                                                                                                             // 66
  var including = null; // Unknown                                                                           // 67
                                                                                                             // 68
  _.each(fieldsKeys, function (keyPath) {                                                                    // 69
    var rule = !!fields[keyPath];                                                                            // 70
    if (including === null)                                                                                  // 71
      including = rule;                                                                                      // 72
    if (including !== rule)                                                                                  // 73
      // This error message is copies from MongoDB shell                                                     // 74
      throw MinimongoError("You cannot currently mix including and excluding fields.");                      // 75
  });                                                                                                        // 76
                                                                                                             // 77
                                                                                                             // 78
  var projectionRulesTree = pathsToTree(                                                                     // 79
    fieldsKeys,                                                                                              // 80
    function (path) { return including; },                                                                   // 81
    function (node, path, fullPath) {                                                                        // 82
      // Check passed projection fields' keys: If you have two rules such as                                 // 83
      // 'foo.bar' and 'foo.bar.baz', then the result becomes ambiguous. If                                  // 84
      // that happens, there is a probability you are doing something wrong,                                 // 85
      // framework should notify you about such mistake earlier on cursor                                    // 86
      // compilation step than later during runtime.  Note, that real mongo                                  // 87
      // doesn't do anything about it and the later rule appears in projection                               // 88
      // project, more priority it takes.                                                                    // 89
      //                                                                                                     // 90
      // Example, assume following in mongo shell:                                                           // 91
      // > db.coll.insert({ a: { b: 23, c: 44 } })                                                           // 92
      // > db.coll.find({}, { 'a': 1, 'a.b': 1 })                                                            // 93
      // { "_id" : ObjectId("520bfe456024608e8ef24af3"), "a" : { "b" : 23 } }                                // 94
      // > db.coll.find({}, { 'a.b': 1, 'a': 1 })                                                            // 95
      // { "_id" : ObjectId("520bfe456024608e8ef24af3"), "a" : { "b" : 23, "c" : 44 } }                      // 96
      //                                                                                                     // 97
      // Note, how second time the return set of keys is different.                                          // 98
                                                                                                             // 99
      var currentPath = fullPath;                                                                            // 100
      var anotherPath = path;                                                                                // 101
      throw MinimongoError("both " + currentPath + " and " + anotherPath +                                   // 102
                           " found in fields option, using both of them may trigger " +                      // 103
                           "unexpected behavior. Did you mean to use only one of them?");                    // 104
    });                                                                                                      // 105
                                                                                                             // 106
  return {                                                                                                   // 107
    tree: projectionRulesTree,                                                                               // 108
    including: including                                                                                     // 109
  };                                                                                                         // 110
};                                                                                                           // 111
                                                                                                             // 112
// paths - Array: list of mongo style paths                                                                  // 113
// newLeafFn - Function: of form function(path) should return a scalar value to                              // 114
//                       put into list created for that path                                                 // 115
// conflictFn - Function: of form function(node, path, fullPath) is called                                   // 116
//                        when building a tree path for 'fullPath' node on                                   // 117
//                        'path' was already a leaf with a value. Must return a                              // 118
//                        conflict resolution.                                                               // 119
// initial tree - Optional Object: starting tree.                                                            // 120
// @returns - Object: tree represented as a set of nested objects                                            // 121
pathsToTree = function (paths, newLeafFn, conflictFn, tree) {                                                // 122
  tree = tree || {};                                                                                         // 123
  _.each(paths, function (keyPath) {                                                                         // 124
    var treePos = tree;                                                                                      // 125
    var pathArr = keyPath.split('.');                                                                        // 126
                                                                                                             // 127
    // use _.all just for iteration with break                                                               // 128
    var success = _.all(pathArr.slice(0, -1), function (key, idx) {                                          // 129
      if (!_.has(treePos, key))                                                                              // 130
        treePos[key] = {};                                                                                   // 131
      else if (!_.isObject(treePos[key])) {                                                                  // 132
        treePos[key] = conflictFn(treePos[key],                                                              // 133
                                  pathArr.slice(0, idx + 1).join('.'),                                       // 134
                                  keyPath);                                                                  // 135
        // break out of loop if we are failing for this path                                                 // 136
        if (!_.isObject(treePos[key]))                                                                       // 137
          return false;                                                                                      // 138
      }                                                                                                      // 139
                                                                                                             // 140
      treePos = treePos[key];                                                                                // 141
      return true;                                                                                           // 142
    });                                                                                                      // 143
                                                                                                             // 144
    if (success) {                                                                                           // 145
      var lastKey = _.last(pathArr);                                                                         // 146
      if (!_.has(treePos, lastKey))                                                                          // 147
        treePos[lastKey] = newLeafFn(keyPath);                                                               // 148
      else                                                                                                   // 149
        treePos[lastKey] = conflictFn(treePos[lastKey], keyPath, keyPath);                                   // 150
    }                                                                                                        // 151
  });                                                                                                        // 152
                                                                                                             // 153
  return tree;                                                                                               // 154
};                                                                                                           // 155
                                                                                                             // 156
LocalCollection._checkSupportedProjection = function (fields) {                                              // 157
  if (!_.isObject(fields) || _.isArray(fields))                                                              // 158
    throw MinimongoError("fields option must be an object");                                                 // 159
                                                                                                             // 160
  _.each(fields, function (val, keyPath) {                                                                   // 161
    if (_.contains(keyPath.split('.'), '$'))                                                                 // 162
      throw MinimongoError("Minimongo doesn't support $ operator in projections yet.");                      // 163
    if (_.indexOf([1, 0, true, false], val) === -1)                                                          // 164
      throw MinimongoError("Projection values should be one of 1, 0, true, or false");                       // 165
  });                                                                                                        // 166
};                                                                                                           // 167
                                                                                                             // 168
                                                                                                             // 169
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/modify.js                                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// XXX need a strategy for passing the binding of $ into this                                                // 1
// function, from the compiled selector                                                                      // 2
//                                                                                                           // 3
// maybe just {key.up.to.just.before.dollarsign: array_index}                                                // 4
//                                                                                                           // 5
// XXX atomicity: if one modification fails, do we roll back the whole                                       // 6
// change?                                                                                                   // 7
//                                                                                                           // 8
// options:                                                                                                  // 9
//   - isInsert is set when _modify is being called to compute the document to                               // 10
//     insert as part of an upsert operation. We use this primarily to figure                                // 11
//     out when to set the fields in $setOnInsert, if present.                                               // 12
LocalCollection._modify = function (doc, mod, options) {                                                     // 13
  options = options || {};                                                                                   // 14
  if (!isPlainObject(mod))                                                                                   // 15
    throw MinimongoError("Modifier must be an object");                                                      // 16
  var isModifier = isOperatorObject(mod);                                                                    // 17
                                                                                                             // 18
  var newDoc;                                                                                                // 19
                                                                                                             // 20
  if (!isModifier) {                                                                                         // 21
    if (mod._id && !EJSON.equals(doc._id, mod._id))                                                          // 22
      throw MinimongoError("Cannot change the _id of a document");                                           // 23
                                                                                                             // 24
    // replace the whole document                                                                            // 25
    for (var k in mod) {                                                                                     // 26
      if (/\./.test(k))                                                                                      // 27
        throw MinimongoError(                                                                                // 28
          "When replacing document, field name may not contain '.'");                                        // 29
    }                                                                                                        // 30
    newDoc = mod;                                                                                            // 31
  } else {                                                                                                   // 32
    // apply modifiers to the doc.                                                                           // 33
    newDoc = EJSON.clone(doc);                                                                               // 34
                                                                                                             // 35
    _.each(mod, function (operand, op) {                                                                     // 36
      var modFunc = MODIFIERS[op];                                                                           // 37
      // Treat $setOnInsert as $set if this is an insert.                                                    // 38
      if (options.isInsert && op === '$setOnInsert')                                                         // 39
        modFunc = MODIFIERS['$set'];                                                                         // 40
      if (!modFunc)                                                                                          // 41
        throw MinimongoError("Invalid modifier specified " + op);                                            // 42
      _.each(operand, function (arg, keypath) {                                                              // 43
        if (keypath === '') {                                                                                // 44
          throw MinimongoError("An empty update path is not valid.");                                        // 45
        }                                                                                                    // 46
                                                                                                             // 47
        if (keypath === '_id') {                                                                             // 48
          throw MinimongoError("Mod on _id not allowed");                                                    // 49
        }                                                                                                    // 50
                                                                                                             // 51
        var keyparts = keypath.split('.');                                                                   // 52
                                                                                                             // 53
        if (! _.all(keyparts, _.identity)) {                                                                 // 54
          throw MinimongoError(                                                                              // 55
            "The update path '" + keypath +                                                                  // 56
              "' contains an empty field name, which is not allowed.");                                      // 57
        }                                                                                                    // 58
                                                                                                             // 59
        var noCreate = _.has(NO_CREATE_MODIFIERS, op);                                                       // 60
        var forbidArray = (op === "$rename");                                                                // 61
        var target = findModTarget(newDoc, keyparts, {                                                       // 62
          noCreate: NO_CREATE_MODIFIERS[op],                                                                 // 63
          forbidArray: (op === "$rename"),                                                                   // 64
          arrayIndices: options.arrayIndices                                                                 // 65
        });                                                                                                  // 66
        var field = keyparts.pop();                                                                          // 67
        modFunc(target, field, arg, keypath, newDoc);                                                        // 68
      });                                                                                                    // 69
    });                                                                                                      // 70
  }                                                                                                          // 71
                                                                                                             // 72
  // move new document into place.                                                                           // 73
  _.each(_.keys(doc), function (k) {                                                                         // 74
    // Note: this used to be for (var k in doc) however, this does not                                       // 75
    // work right in Opera. Deleting from a doc while iterating over it                                      // 76
    // would sometimes cause opera to skip some keys.                                                        // 77
    if (k !== '_id')                                                                                         // 78
      delete doc[k];                                                                                         // 79
  });                                                                                                        // 80
  _.each(newDoc, function (v, k) {                                                                           // 81
    doc[k] = v;                                                                                              // 82
  });                                                                                                        // 83
};                                                                                                           // 84
                                                                                                             // 85
// for a.b.c.2.d.e, keyparts should be ['a', 'b', 'c', '2', 'd', 'e'],                                       // 86
// and then you would operate on the 'e' property of the returned                                            // 87
// object.                                                                                                   // 88
//                                                                                                           // 89
// if options.noCreate is falsey, creates intermediate levels of                                             // 90
// structure as necessary, like mkdir -p (and raises an exception if                                         // 91
// that would mean giving a non-numeric property to an array.) if                                            // 92
// options.noCreate is true, return undefined instead.                                                       // 93
//                                                                                                           // 94
// may modify the last element of keyparts to signal to the caller that it needs                             // 95
// to use a different value to index into the returned object (for example,                                  // 96
// ['a', '01'] -> ['a', 1]).                                                                                 // 97
//                                                                                                           // 98
// if forbidArray is true, return null if the keypath goes through an array.                                 // 99
//                                                                                                           // 100
// if options.arrayIndices is set, use its first element for the (first) '$' in                              // 101
// the path.                                                                                                 // 102
var findModTarget = function (doc, keyparts, options) {                                                      // 103
  options = options || {};                                                                                   // 104
  var usedArrayIndex = false;                                                                                // 105
  for (var i = 0; i < keyparts.length; i++) {                                                                // 106
    var last = (i === keyparts.length - 1);                                                                  // 107
    var keypart = keyparts[i];                                                                               // 108
    var indexable = isIndexable(doc);                                                                        // 109
    if (!indexable) {                                                                                        // 110
      if (options.noCreate)                                                                                  // 111
        return undefined;                                                                                    // 112
      var e = MinimongoError(                                                                                // 113
        "cannot use the part '" + keypart + "' to traverse " + doc);                                         // 114
      e.setPropertyError = true;                                                                             // 115
      throw e;                                                                                               // 116
    }                                                                                                        // 117
    if (doc instanceof Array) {                                                                              // 118
      if (options.forbidArray)                                                                               // 119
        return null;                                                                                         // 120
      if (keypart === '$') {                                                                                 // 121
        if (usedArrayIndex)                                                                                  // 122
          throw MinimongoError("Too many positional (i.e. '$') elements");                                   // 123
        if (!options.arrayIndices || !options.arrayIndices.length) {                                         // 124
          throw MinimongoError("The positional operator did not find the " +                                 // 125
                               "match needed from the query");                                               // 126
        }                                                                                                    // 127
        keypart = options.arrayIndices[0];                                                                   // 128
        usedArrayIndex = true;                                                                               // 129
      } else if (isNumericKey(keypart)) {                                                                    // 130
        keypart = parseInt(keypart);                                                                         // 131
      } else {                                                                                               // 132
        if (options.noCreate)                                                                                // 133
          return undefined;                                                                                  // 134
        throw MinimongoError(                                                                                // 135
          "can't append to array using string field name ["                                                  // 136
                    + keypart + "]");                                                                        // 137
      }                                                                                                      // 138
      if (last)                                                                                              // 139
        // handle 'a.01'                                                                                     // 140
        keyparts[i] = keypart;                                                                               // 141
      if (options.noCreate && keypart >= doc.length)                                                         // 142
        return undefined;                                                                                    // 143
      while (doc.length < keypart)                                                                           // 144
        doc.push(null);                                                                                      // 145
      if (!last) {                                                                                           // 146
        if (doc.length === keypart)                                                                          // 147
          doc.push({});                                                                                      // 148
        else if (typeof doc[keypart] !== "object")                                                           // 149
          throw MinimongoError("can't modify field '" + keyparts[i + 1] +                                    // 150
                      "' of list value " + JSON.stringify(doc[keypart]));                                    // 151
      }                                                                                                      // 152
    } else {                                                                                                 // 153
      if (keypart.length && keypart.substr(0, 1) === '$')                                                    // 154
        throw MinimongoError("can't set field named " + keypart);                                            // 155
      if (!(keypart in doc)) {                                                                               // 156
        if (options.noCreate)                                                                                // 157
          return undefined;                                                                                  // 158
        if (!last)                                                                                           // 159
          doc[keypart] = {};                                                                                 // 160
      }                                                                                                      // 161
    }                                                                                                        // 162
                                                                                                             // 163
    if (last)                                                                                                // 164
      return doc;                                                                                            // 165
    doc = doc[keypart];                                                                                      // 166
  }                                                                                                          // 167
                                                                                                             // 168
  // notreached                                                                                              // 169
};                                                                                                           // 170
                                                                                                             // 171
var NO_CREATE_MODIFIERS = {                                                                                  // 172
  $unset: true,                                                                                              // 173
  $pop: true,                                                                                                // 174
  $rename: true,                                                                                             // 175
  $pull: true,                                                                                               // 176
  $pullAll: true                                                                                             // 177
};                                                                                                           // 178
                                                                                                             // 179
var MODIFIERS = {                                                                                            // 180
  $inc: function (target, field, arg) {                                                                      // 181
    if (typeof arg !== "number")                                                                             // 182
      throw MinimongoError("Modifier $inc allowed for numbers only");                                        // 183
    if (field in target) {                                                                                   // 184
      if (typeof target[field] !== "number")                                                                 // 185
        throw MinimongoError("Cannot apply $inc modifier to non-number");                                    // 186
      target[field] += arg;                                                                                  // 187
    } else {                                                                                                 // 188
      target[field] = arg;                                                                                   // 189
    }                                                                                                        // 190
  },                                                                                                         // 191
  $set: function (target, field, arg) {                                                                      // 192
    if (!_.isObject(target)) { // not an array or an object                                                  // 193
      var e = MinimongoError("Cannot set property on non-object field");                                     // 194
      e.setPropertyError = true;                                                                             // 195
      throw e;                                                                                               // 196
    }                                                                                                        // 197
    if (target === null) {                                                                                   // 198
      var e = MinimongoError("Cannot set property on null");                                                 // 199
      e.setPropertyError = true;                                                                             // 200
      throw e;                                                                                               // 201
    }                                                                                                        // 202
    target[field] = EJSON.clone(arg);                                                                        // 203
  },                                                                                                         // 204
  $setOnInsert: function (target, field, arg) {                                                              // 205
    // converted to `$set` in `_modify`                                                                      // 206
  },                                                                                                         // 207
  $unset: function (target, field, arg) {                                                                    // 208
    if (target !== undefined) {                                                                              // 209
      if (target instanceof Array) {                                                                         // 210
        if (field in target)                                                                                 // 211
          target[field] = null;                                                                              // 212
      } else                                                                                                 // 213
        delete target[field];                                                                                // 214
    }                                                                                                        // 215
  },                                                                                                         // 216
  $push: function (target, field, arg) {                                                                     // 217
    if (target[field] === undefined)                                                                         // 218
      target[field] = [];                                                                                    // 219
    if (!(target[field] instanceof Array))                                                                   // 220
      throw MinimongoError("Cannot apply $push modifier to non-array");                                      // 221
                                                                                                             // 222
    if (!(arg && arg.$each)) {                                                                               // 223
      // Simple mode: not $each                                                                              // 224
      target[field].push(EJSON.clone(arg));                                                                  // 225
      return;                                                                                                // 226
    }                                                                                                        // 227
                                                                                                             // 228
    // Fancy mode: $each (and maybe $slice and $sort)                                                        // 229
    var toPush = arg.$each;                                                                                  // 230
    if (!(toPush instanceof Array))                                                                          // 231
      throw MinimongoError("$each must be an array");                                                        // 232
                                                                                                             // 233
    // Parse $slice.                                                                                         // 234
    var slice = undefined;                                                                                   // 235
    if ('$slice' in arg) {                                                                                   // 236
      if (typeof arg.$slice !== "number")                                                                    // 237
        throw MinimongoError("$slice must be a numeric value");                                              // 238
      // XXX should check to make sure integer                                                               // 239
      if (arg.$slice > 0)                                                                                    // 240
        throw MinimongoError("$slice in $push must be zero or negative");                                    // 241
      slice = arg.$slice;                                                                                    // 242
    }                                                                                                        // 243
                                                                                                             // 244
    // Parse $sort.                                                                                          // 245
    var sortFunction = undefined;                                                                            // 246
    if (arg.$sort) {                                                                                         // 247
      if (slice === undefined)                                                                               // 248
        throw MinimongoError("$sort requires $slice to be present");                                         // 249
      // XXX this allows us to use a $sort whose value is an array, but that's                               // 250
      // actually an extension of the Node driver, so it won't work                                          // 251
      // server-side. Could be confusing!                                                                    // 252
      // XXX is it correct that we don't do geo-stuff here?                                                  // 253
      sortFunction = new Minimongo.Sorter(arg.$sort).getComparator();                                        // 254
      for (var i = 0; i < toPush.length; i++) {                                                              // 255
        if (LocalCollection._f._type(toPush[i]) !== 3) {                                                     // 256
          throw MinimongoError("$push like modifiers using $sort " +                                         // 257
                      "require all elements to be objects");                                                 // 258
        }                                                                                                    // 259
      }                                                                                                      // 260
    }                                                                                                        // 261
                                                                                                             // 262
    // Actually push.                                                                                        // 263
    for (var j = 0; j < toPush.length; j++)                                                                  // 264
      target[field].push(EJSON.clone(toPush[j]));                                                            // 265
                                                                                                             // 266
    // Actually sort.                                                                                        // 267
    if (sortFunction)                                                                                        // 268
      target[field].sort(sortFunction);                                                                      // 269
                                                                                                             // 270
    // Actually slice.                                                                                       // 271
    if (slice !== undefined) {                                                                               // 272
      if (slice === 0)                                                                                       // 273
        target[field] = [];  // differs from Array.slice!                                                    // 274
      else                                                                                                   // 275
        target[field] = target[field].slice(slice);                                                          // 276
    }                                                                                                        // 277
  },                                                                                                         // 278
  $pushAll: function (target, field, arg) {                                                                  // 279
    if (!(typeof arg === "object" && arg instanceof Array))                                                  // 280
      throw MinimongoError("Modifier $pushAll/pullAll allowed for arrays only");                             // 281
    var x = target[field];                                                                                   // 282
    if (x === undefined)                                                                                     // 283
      target[field] = arg;                                                                                   // 284
    else if (!(x instanceof Array))                                                                          // 285
      throw MinimongoError("Cannot apply $pushAll modifier to non-array");                                   // 286
    else {                                                                                                   // 287
      for (var i = 0; i < arg.length; i++)                                                                   // 288
        x.push(arg[i]);                                                                                      // 289
    }                                                                                                        // 290
  },                                                                                                         // 291
  $addToSet: function (target, field, arg) {                                                                 // 292
    var isEach = false;                                                                                      // 293
    if (typeof arg === "object") {                                                                           // 294
      //check if first key is '$each'                                                                        // 295
      for (var k in arg) {                                                                                   // 296
        if (k === "$each")                                                                                   // 297
          isEach = true;                                                                                     // 298
        break;                                                                                               // 299
      }                                                                                                      // 300
    }                                                                                                        // 301
    var values = isEach ? arg["$each"] : [arg];                                                              // 302
    var x = target[field];                                                                                   // 303
    if (x === undefined)                                                                                     // 304
      target[field] = values;                                                                                // 305
    else if (!(x instanceof Array))                                                                          // 306
      throw MinimongoError("Cannot apply $addToSet modifier to non-array");                                  // 307
    else {                                                                                                   // 308
      _.each(values, function (value) {                                                                      // 309
        for (var i = 0; i < x.length; i++)                                                                   // 310
          if (LocalCollection._f._equal(value, x[i]))                                                        // 311
            return;                                                                                          // 312
        x.push(EJSON.clone(value));                                                                          // 313
      });                                                                                                    // 314
    }                                                                                                        // 315
  },                                                                                                         // 316
  $pop: function (target, field, arg) {                                                                      // 317
    if (target === undefined)                                                                                // 318
      return;                                                                                                // 319
    var x = target[field];                                                                                   // 320
    if (x === undefined)                                                                                     // 321
      return;                                                                                                // 322
    else if (!(x instanceof Array))                                                                          // 323
      throw MinimongoError("Cannot apply $pop modifier to non-array");                                       // 324
    else {                                                                                                   // 325
      if (typeof arg === 'number' && arg < 0)                                                                // 326
        x.splice(0, 1);                                                                                      // 327
      else                                                                                                   // 328
        x.pop();                                                                                             // 329
    }                                                                                                        // 330
  },                                                                                                         // 331
  $pull: function (target, field, arg) {                                                                     // 332
    if (target === undefined)                                                                                // 333
      return;                                                                                                // 334
    var x = target[field];                                                                                   // 335
    if (x === undefined)                                                                                     // 336
      return;                                                                                                // 337
    else if (!(x instanceof Array))                                                                          // 338
      throw MinimongoError("Cannot apply $pull/pullAll modifier to non-array");                              // 339
    else {                                                                                                   // 340
      var out = [];                                                                                          // 341
      if (typeof arg === "object" && !(arg instanceof Array)) {                                              // 342
        // XXX would be much nicer to compile this once, rather than                                         // 343
        // for each document we modify.. but usually we're not                                               // 344
        // modifying that many documents, so we'll let it slide for                                          // 345
        // now                                                                                               // 346
                                                                                                             // 347
        // XXX Minimongo.Matcher isn't up for the job, because we need                                       // 348
        // to permit stuff like {$pull: {a: {$gt: 4}}}.. something                                           // 349
        // like {$gt: 4} is not normally a complete selector.                                                // 350
        // same issue as $elemMatch possibly?                                                                // 351
        var matcher = new Minimongo.Matcher(arg);                                                            // 352
        for (var i = 0; i < x.length; i++)                                                                   // 353
          if (!matcher.documentMatches(x[i]).result)                                                         // 354
            out.push(x[i]);                                                                                  // 355
      } else {                                                                                               // 356
        for (var i = 0; i < x.length; i++)                                                                   // 357
          if (!LocalCollection._f._equal(x[i], arg))                                                         // 358
            out.push(x[i]);                                                                                  // 359
      }                                                                                                      // 360
      target[field] = out;                                                                                   // 361
    }                                                                                                        // 362
  },                                                                                                         // 363
  $pullAll: function (target, field, arg) {                                                                  // 364
    if (!(typeof arg === "object" && arg instanceof Array))                                                  // 365
      throw MinimongoError("Modifier $pushAll/pullAll allowed for arrays only");                             // 366
    if (target === undefined)                                                                                // 367
      return;                                                                                                // 368
    var x = target[field];                                                                                   // 369
    if (x === undefined)                                                                                     // 370
      return;                                                                                                // 371
    else if (!(x instanceof Array))                                                                          // 372
      throw MinimongoError("Cannot apply $pull/pullAll modifier to non-array");                              // 373
    else {                                                                                                   // 374
      var out = [];                                                                                          // 375
      for (var i = 0; i < x.length; i++) {                                                                   // 376
        var exclude = false;                                                                                 // 377
        for (var j = 0; j < arg.length; j++) {                                                               // 378
          if (LocalCollection._f._equal(x[i], arg[j])) {                                                     // 379
            exclude = true;                                                                                  // 380
            break;                                                                                           // 381
          }                                                                                                  // 382
        }                                                                                                    // 383
        if (!exclude)                                                                                        // 384
          out.push(x[i]);                                                                                    // 385
      }                                                                                                      // 386
      target[field] = out;                                                                                   // 387
    }                                                                                                        // 388
  },                                                                                                         // 389
  $rename: function (target, field, arg, keypath, doc) {                                                     // 390
    if (keypath === arg)                                                                                     // 391
      // no idea why mongo has this restriction..                                                            // 392
      throw MinimongoError("$rename source must differ from target");                                        // 393
    if (target === null)                                                                                     // 394
      throw MinimongoError("$rename source field invalid");                                                  // 395
    if (typeof arg !== "string")                                                                             // 396
      throw MinimongoError("$rename target must be a string");                                               // 397
    if (target === undefined)                                                                                // 398
      return;                                                                                                // 399
    var v = target[field];                                                                                   // 400
    delete target[field];                                                                                    // 401
                                                                                                             // 402
    var keyparts = arg.split('.');                                                                           // 403
    var target2 = findModTarget(doc, keyparts, {forbidArray: true});                                         // 404
    if (target2 === null)                                                                                    // 405
      throw MinimongoError("$rename target field invalid");                                                  // 406
    var field2 = keyparts.pop();                                                                             // 407
    target2[field2] = v;                                                                                     // 408
  },                                                                                                         // 409
  $bit: function (target, field, arg) {                                                                      // 410
    // XXX mongo only supports $bit on integers, and we only support                                         // 411
    // native javascript numbers (doubles) so far, so we can't support $bit                                  // 412
    throw MinimongoError("$bit is not supported");                                                           // 413
  }                                                                                                          // 414
};                                                                                                           // 415
                                                                                                             // 416
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/diff.js                                                                                //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// ordered: bool.                                                                                            // 1
// old_results and new_results: collections of documents.                                                    // 2
//    if ordered, they are arrays.                                                                           // 3
//    if unordered, they are IdMaps                                                                          // 4
LocalCollection._diffQueryChanges = function (ordered, oldResults, newResults,                               // 5
                                              observer, options) {                                           // 6
  if (ordered)                                                                                               // 7
    LocalCollection._diffQueryOrderedChanges(                                                                // 8
      oldResults, newResults, observer, options);                                                            // 9
  else                                                                                                       // 10
    LocalCollection._diffQueryUnorderedChanges(                                                              // 11
      oldResults, newResults, observer, options);                                                            // 12
};                                                                                                           // 13
                                                                                                             // 14
LocalCollection._diffQueryUnorderedChanges = function (oldResults, newResults,                               // 15
                                                       observer, options) {                                  // 16
  options = options || {};                                                                                   // 17
  var projectionFn = options.projectionFn || EJSON.clone;                                                    // 18
                                                                                                             // 19
  if (observer.movedBefore) {                                                                                // 20
    throw new Error("_diffQueryUnordered called with a movedBefore observer!");                              // 21
  }                                                                                                          // 22
                                                                                                             // 23
  newResults.forEach(function (newDoc, id) {                                                                 // 24
    var oldDoc = oldResults.get(id);                                                                         // 25
    if (oldDoc) {                                                                                            // 26
      if (observer.changed && !EJSON.equals(oldDoc, newDoc)) {                                               // 27
        var projectedNew = projectionFn(newDoc);                                                             // 28
        var projectedOld = projectionFn(oldDoc);                                                             // 29
        var changedFields =                                                                                  // 30
              LocalCollection._makeChangedFields(projectedNew, projectedOld);                                // 31
        if (! _.isEmpty(changedFields)) {                                                                    // 32
          observer.changed(id, changedFields);                                                               // 33
        }                                                                                                    // 34
      }                                                                                                      // 35
    } else if (observer.added) {                                                                             // 36
      var fields = projectionFn(newDoc);                                                                     // 37
      delete fields._id;                                                                                     // 38
      observer.added(newDoc._id, fields);                                                                    // 39
    }                                                                                                        // 40
  });                                                                                                        // 41
                                                                                                             // 42
  if (observer.removed) {                                                                                    // 43
    oldResults.forEach(function (oldDoc, id) {                                                               // 44
      if (!newResults.has(id))                                                                               // 45
        observer.removed(id);                                                                                // 46
    });                                                                                                      // 47
  }                                                                                                          // 48
};                                                                                                           // 49
                                                                                                             // 50
                                                                                                             // 51
LocalCollection._diffQueryOrderedChanges = function (old_results, new_results,                               // 52
                                                     observer, options) {                                    // 53
  options = options || {};                                                                                   // 54
  var projectionFn = options.projectionFn || EJSON.clone;                                                    // 55
                                                                                                             // 56
  var new_presence_of_id = {};                                                                               // 57
  _.each(new_results, function (doc) {                                                                       // 58
    if (new_presence_of_id[doc._id])                                                                         // 59
      Meteor._debug("Duplicate _id in new_results");                                                         // 60
    new_presence_of_id[doc._id] = true;                                                                      // 61
  });                                                                                                        // 62
                                                                                                             // 63
  var old_index_of_id = {};                                                                                  // 64
  _.each(old_results, function (doc, i) {                                                                    // 65
    if (doc._id in old_index_of_id)                                                                          // 66
      Meteor._debug("Duplicate _id in old_results");                                                         // 67
    old_index_of_id[doc._id] = i;                                                                            // 68
  });                                                                                                        // 69
                                                                                                             // 70
  // ALGORITHM:                                                                                              // 71
  //                                                                                                         // 72
  // To determine which docs should be considered "moved" (and which                                         // 73
  // merely change position because of other docs moving) we run                                             // 74
  // a "longest common subsequence" (LCS) algorithm.  The LCS of the                                         // 75
  // old doc IDs and the new doc IDs gives the docs that should NOT be                                       // 76
  // considered moved.                                                                                       // 77
                                                                                                             // 78
  // To actually call the appropriate callbacks to get from the old state to the                             // 79
  // new state:                                                                                              // 80
                                                                                                             // 81
  // First, we call removed() on all the items that only appear in the old                                   // 82
  // state.                                                                                                  // 83
                                                                                                             // 84
  // Then, once we have the items that should not move, we walk through the new                              // 85
  // results array group-by-group, where a "group" is a set of items that have                               // 86
  // moved, anchored on the end by an item that should not move.  One by one, we                             // 87
  // move each of those elements into place "before" the anchoring end-of-group                              // 88
  // item, and fire changed events on them if necessary.  Then we fire a changed                             // 89
  // event on the anchor, and move on to the next group.  There is always at                                 // 90
  // least one group; the last group is anchored by a virtual "null" id at the                               // 91
  // end.                                                                                                    // 92
                                                                                                             // 93
  // Asymptotically: O(N k) where k is number of ops, or potentially                                         // 94
  // O(N log N) if inner loop of LCS were made to be binary search.                                          // 95
                                                                                                             // 96
                                                                                                             // 97
  //////// LCS (longest common sequence, with respect to _id)                                                // 98
  // (see Wikipedia article on Longest Increasing Subsequence,                                               // 99
  // where the LIS is taken of the sequence of old indices of the                                            // 100
  // docs in new_results)                                                                                    // 101
  //                                                                                                         // 102
  // unmoved: the output of the algorithm; members of the LCS,                                               // 103
  // in the form of indices into new_results                                                                 // 104
  var unmoved = [];                                                                                          // 105
  // max_seq_len: length of LCS found so far                                                                 // 106
  var max_seq_len = 0;                                                                                       // 107
  // seq_ends[i]: the index into new_results of the last doc in a                                            // 108
  // common subsequence of length of i+1 <= max_seq_len                                                      // 109
  var N = new_results.length;                                                                                // 110
  var seq_ends = new Array(N);                                                                               // 111
  // ptrs:  the common subsequence ending with new_results[n] extends                                        // 112
  // a common subsequence ending with new_results[ptr[n]], unless                                            // 113
  // ptr[n] is -1.                                                                                           // 114
  var ptrs = new Array(N);                                                                                   // 115
  // virtual sequence of old indices of new results                                                          // 116
  var old_idx_seq = function(i_new) {                                                                        // 117
    return old_index_of_id[new_results[i_new]._id];                                                          // 118
  };                                                                                                         // 119
  // for each item in new_results, use it to extend a common subsequence                                     // 120
  // of length j <= max_seq_len                                                                              // 121
  for(var i=0; i<N; i++) {                                                                                   // 122
    if (old_index_of_id[new_results[i]._id] !== undefined) {                                                 // 123
      var j = max_seq_len;                                                                                   // 124
      // this inner loop would traditionally be a binary search,                                             // 125
      // but scanning backwards we will likely find a subseq to extend                                       // 126
      // pretty soon, bounded for example by the total number of ops.                                        // 127
      // If this were to be changed to a binary search, we'd still want                                      // 128
      // to scan backwards a bit as an optimization.                                                         // 129
      while (j > 0) {                                                                                        // 130
        if (old_idx_seq(seq_ends[j-1]) < old_idx_seq(i))                                                     // 131
          break;                                                                                             // 132
        j--;                                                                                                 // 133
      }                                                                                                      // 134
                                                                                                             // 135
      ptrs[i] = (j === 0 ? -1 : seq_ends[j-1]);                                                              // 136
      seq_ends[j] = i;                                                                                       // 137
      if (j+1 > max_seq_len)                                                                                 // 138
        max_seq_len = j+1;                                                                                   // 139
    }                                                                                                        // 140
  }                                                                                                          // 141
                                                                                                             // 142
  // pull out the LCS/LIS into unmoved                                                                       // 143
  var idx = (max_seq_len === 0 ? -1 : seq_ends[max_seq_len-1]);                                              // 144
  while (idx >= 0) {                                                                                         // 145
    unmoved.push(idx);                                                                                       // 146
    idx = ptrs[idx];                                                                                         // 147
  }                                                                                                          // 148
  // the unmoved item list is built backwards, so fix that                                                   // 149
  unmoved.reverse();                                                                                         // 150
                                                                                                             // 151
  // the last group is always anchored by the end of the result list, which is                               // 152
  // an id of "null"                                                                                         // 153
  unmoved.push(new_results.length);                                                                          // 154
                                                                                                             // 155
  _.each(old_results, function (doc) {                                                                       // 156
    if (!new_presence_of_id[doc._id])                                                                        // 157
      observer.removed && observer.removed(doc._id);                                                         // 158
  });                                                                                                        // 159
  // for each group of things in the new_results that is anchored by an unmoved                              // 160
  // element, iterate through the things before it.                                                          // 161
  var startOfGroup = 0;                                                                                      // 162
  _.each(unmoved, function (endOfGroup) {                                                                    // 163
    var groupId = new_results[endOfGroup] ? new_results[endOfGroup]._id : null;                              // 164
    var oldDoc, newDoc, fields, projectedNew, projectedOld;                                                  // 165
    for (var i = startOfGroup; i < endOfGroup; i++) {                                                        // 166
      newDoc = new_results[i];                                                                               // 167
      if (!_.has(old_index_of_id, newDoc._id)) {                                                             // 168
        fields = projectionFn(newDoc);                                                                       // 169
        delete fields._id;                                                                                   // 170
        observer.addedBefore && observer.addedBefore(newDoc._id, fields, groupId);                           // 171
        observer.added && observer.added(newDoc._id, fields);                                                // 172
      } else {                                                                                               // 173
        // moved                                                                                             // 174
        oldDoc = old_results[old_index_of_id[newDoc._id]];                                                   // 175
        projectedNew = projectionFn(newDoc);                                                                 // 176
        projectedOld = projectionFn(oldDoc);                                                                 // 177
        fields = LocalCollection._makeChangedFields(projectedNew, projectedOld);                             // 178
        if (!_.isEmpty(fields)) {                                                                            // 179
          observer.changed && observer.changed(newDoc._id, fields);                                          // 180
        }                                                                                                    // 181
        observer.movedBefore && observer.movedBefore(newDoc._id, groupId);                                   // 182
      }                                                                                                      // 183
    }                                                                                                        // 184
    if (groupId) {                                                                                           // 185
      newDoc = new_results[endOfGroup];                                                                      // 186
      oldDoc = old_results[old_index_of_id[newDoc._id]];                                                     // 187
      projectedNew = projectionFn(newDoc);                                                                   // 188
      projectedOld = projectionFn(oldDoc);                                                                   // 189
      fields = LocalCollection._makeChangedFields(projectedNew, projectedOld);                               // 190
      if (!_.isEmpty(fields)) {                                                                              // 191
        observer.changed && observer.changed(newDoc._id, fields);                                            // 192
      }                                                                                                      // 193
    }                                                                                                        // 194
    startOfGroup = endOfGroup+1;                                                                             // 195
  });                                                                                                        // 196
                                                                                                             // 197
                                                                                                             // 198
};                                                                                                           // 199
                                                                                                             // 200
                                                                                                             // 201
// General helper for diff-ing two objects.                                                                  // 202
// callbacks is an object like so:                                                                           // 203
// { leftOnly: function (key, leftValue) {...},                                                              // 204
//   rightOnly: function (key, rightValue) {...},                                                            // 205
//   both: function (key, leftValue, rightValue) {...},                                                      // 206
// }                                                                                                         // 207
LocalCollection._diffObjects = function (left, right, callbacks) {                                           // 208
  _.each(left, function (leftValue, key) {                                                                   // 209
    if (_.has(right, key))                                                                                   // 210
      callbacks.both && callbacks.both(key, leftValue, right[key]);                                          // 211
    else                                                                                                     // 212
      callbacks.leftOnly && callbacks.leftOnly(key, leftValue);                                              // 213
  });                                                                                                        // 214
  if (callbacks.rightOnly) {                                                                                 // 215
    _.each(right, function(rightValue, key) {                                                                // 216
      if (!_.has(left, key))                                                                                 // 217
        callbacks.rightOnly(key, rightValue);                                                                // 218
    });                                                                                                      // 219
  }                                                                                                          // 220
};                                                                                                           // 221
                                                                                                             // 222
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/id_map.js                                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
LocalCollection._IdMap = function () {                                                                       // 1
  var self = this;                                                                                           // 2
  IdMap.call(self, LocalCollection._idStringify, LocalCollection._idParse);                                  // 3
};                                                                                                           // 4
                                                                                                             // 5
Meteor._inherits(LocalCollection._IdMap, IdMap);                                                             // 6
                                                                                                             // 7
                                                                                                             // 8
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/observe.js                                                                             //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// XXX maybe move these into another ObserveHelpers package or something                                     // 1
                                                                                                             // 2
// _CachingChangeObserver is an object which receives observeChanges callbacks                               // 3
// and keeps a cache of the current cursor state up to date in self.docs. Users                              // 4
// of this class should read the docs field but not modify it. You should pass                               // 5
// the "applyChange" field as the callbacks to the underlying observeChanges                                 // 6
// call. Optionally, you can specify your own observeChanges callbacks which are                             // 7
// invoked immediately before the docs field is updated; this object is made                                 // 8
// available as `this` to those callbacks.                                                                   // 9
LocalCollection._CachingChangeObserver = function (options) {                                                // 10
  var self = this;                                                                                           // 11
  options = options || {};                                                                                   // 12
                                                                                                             // 13
  var orderedFromCallbacks = options.callbacks &&                                                            // 14
        LocalCollection._observeChangesCallbacksAreOrdered(options.callbacks);                               // 15
  if (_.has(options, 'ordered')) {                                                                           // 16
    self.ordered = options.ordered;                                                                          // 17
    if (options.callbacks && options.ordered !== orderedFromCallbacks)                                       // 18
      throw Error("ordered option doesn't match callbacks");                                                 // 19
  } else if (options.callbacks) {                                                                            // 20
    self.ordered = orderedFromCallbacks;                                                                     // 21
  } else {                                                                                                   // 22
    throw Error("must provide ordered or callbacks");                                                        // 23
  }                                                                                                          // 24
  var callbacks = options.callbacks || {};                                                                   // 25
                                                                                                             // 26
  if (self.ordered) {                                                                                        // 27
    self.docs = new OrderedDict(LocalCollection._idStringify);                                               // 28
    self.applyChange = {                                                                                     // 29
      addedBefore: function (id, fields, before) {                                                           // 30
        var doc = EJSON.clone(fields);                                                                       // 31
        doc._id = id;                                                                                        // 32
        callbacks.addedBefore && callbacks.addedBefore.call(                                                 // 33
          self, id, fields, before);                                                                         // 34
        // This line triggers if we provide added with movedBefore.                                          // 35
        callbacks.added && callbacks.added.call(self, id, fields);                                           // 36
        // XXX could `before` be a falsy ID?  Technically                                                    // 37
        // idStringify seems to allow for them -- though                                                     // 38
        // OrderedDict won't call stringify on a falsy arg.                                                  // 39
        self.docs.putBefore(id, doc, before || null);                                                        // 40
      },                                                                                                     // 41
      movedBefore: function (id, before) {                                                                   // 42
        var doc = self.docs.get(id);                                                                         // 43
        callbacks.movedBefore && callbacks.movedBefore.call(self, id, before);                               // 44
        self.docs.moveBefore(id, before || null);                                                            // 45
      }                                                                                                      // 46
    };                                                                                                       // 47
  } else {                                                                                                   // 48
    self.docs = new LocalCollection._IdMap;                                                                  // 49
    self.applyChange = {                                                                                     // 50
      added: function (id, fields) {                                                                         // 51
        var doc = EJSON.clone(fields);                                                                       // 52
        callbacks.added && callbacks.added.call(self, id, fields);                                           // 53
        doc._id = id;                                                                                        // 54
        self.docs.set(id,  doc);                                                                             // 55
      }                                                                                                      // 56
    };                                                                                                       // 57
  }                                                                                                          // 58
                                                                                                             // 59
  // The methods in _IdMap and OrderedDict used by these callbacks are                                       // 60
  // identical.                                                                                              // 61
  self.applyChange.changed = function (id, fields) {                                                         // 62
    var doc = self.docs.get(id);                                                                             // 63
    if (!doc)                                                                                                // 64
      throw new Error("Unknown id for changed: " + id);                                                      // 65
    callbacks.changed && callbacks.changed.call(                                                             // 66
      self, id, EJSON.clone(fields));                                                                        // 67
    LocalCollection._applyChanges(doc, fields);                                                              // 68
  };                                                                                                         // 69
  self.applyChange.removed = function (id) {                                                                 // 70
    callbacks.removed && callbacks.removed.call(self, id);                                                   // 71
    self.docs.remove(id);                                                                                    // 72
  };                                                                                                         // 73
};                                                                                                           // 74
                                                                                                             // 75
LocalCollection._observeFromObserveChanges = function (cursor, observeCallbacks) {                           // 76
  var transform = cursor.getTransform() || function (doc) {return doc;};                                     // 77
  var suppressed = !!observeCallbacks._suppress_initial;                                                     // 78
                                                                                                             // 79
  var observeChangesCallbacks;                                                                               // 80
  if (LocalCollection._observeCallbacksAreOrdered(observeCallbacks)) {                                       // 81
    // The "_no_indices" option sets all index arguments to -1 and skips the                                 // 82
    // linear scans required to generate them.  This lets observers that don't                               // 83
    // need absolute indices benefit from the other features of this API --                                  // 84
    // relative order, transforms, and applyChanges -- without the speed hit.                                // 85
    var indices = !observeCallbacks._no_indices;                                                             // 86
    observeChangesCallbacks = {                                                                              // 87
      addedBefore: function (id, fields, before) {                                                           // 88
        var self = this;                                                                                     // 89
        if (suppressed || !(observeCallbacks.addedAt || observeCallbacks.added))                             // 90
          return;                                                                                            // 91
        var doc = transform(_.extend(fields, {_id: id}));                                                    // 92
        if (observeCallbacks.addedAt) {                                                                      // 93
          var index = indices                                                                                // 94
                ? (before ? self.docs.indexOf(before) : self.docs.size()) : -1;                              // 95
          observeCallbacks.addedAt(doc, index, before);                                                      // 96
        } else {                                                                                             // 97
          observeCallbacks.added(doc);                                                                       // 98
        }                                                                                                    // 99
      },                                                                                                     // 100
      changed: function (id, fields) {                                                                       // 101
        var self = this;                                                                                     // 102
        if (!(observeCallbacks.changedAt || observeCallbacks.changed))                                       // 103
          return;                                                                                            // 104
        var doc = EJSON.clone(self.docs.get(id));                                                            // 105
        if (!doc)                                                                                            // 106
          throw new Error("Unknown id for changed: " + id);                                                  // 107
        var oldDoc = transform(EJSON.clone(doc));                                                            // 108
        LocalCollection._applyChanges(doc, fields);                                                          // 109
        doc = transform(doc);                                                                                // 110
        if (observeCallbacks.changedAt) {                                                                    // 111
          var index = indices ? self.docs.indexOf(id) : -1;                                                  // 112
          observeCallbacks.changedAt(doc, oldDoc, index);                                                    // 113
        } else {                                                                                             // 114
          observeCallbacks.changed(doc, oldDoc);                                                             // 115
        }                                                                                                    // 116
      },                                                                                                     // 117
      movedBefore: function (id, before) {                                                                   // 118
        var self = this;                                                                                     // 119
        if (!observeCallbacks.movedTo)                                                                       // 120
          return;                                                                                            // 121
        var from = indices ? self.docs.indexOf(id) : -1;                                                     // 122
                                                                                                             // 123
        var to = indices                                                                                     // 124
              ? (before ? self.docs.indexOf(before) : self.docs.size()) : -1;                                // 125
        // When not moving backwards, adjust for the fact that removing the                                  // 126
        // document slides everything back one slot.                                                         // 127
        if (to > from)                                                                                       // 128
          --to;                                                                                              // 129
        observeCallbacks.movedTo(transform(EJSON.clone(self.docs.get(id))),                                  // 130
                                 from, to, before || null);                                                  // 131
      },                                                                                                     // 132
      removed: function (id) {                                                                               // 133
        var self = this;                                                                                     // 134
        if (!(observeCallbacks.removedAt || observeCallbacks.removed))                                       // 135
          return;                                                                                            // 136
        // technically maybe there should be an EJSON.clone here, but it's about                             // 137
        // to be removed from self.docs!                                                                     // 138
        var doc = transform(self.docs.get(id));                                                              // 139
        if (observeCallbacks.removedAt) {                                                                    // 140
          var index = indices ? self.docs.indexOf(id) : -1;                                                  // 141
          observeCallbacks.removedAt(doc, index);                                                            // 142
        } else {                                                                                             // 143
          observeCallbacks.removed(doc);                                                                     // 144
        }                                                                                                    // 145
      }                                                                                                      // 146
    };                                                                                                       // 147
  } else {                                                                                                   // 148
    observeChangesCallbacks = {                                                                              // 149
      added: function (id, fields) {                                                                         // 150
        if (!suppressed && observeCallbacks.added) {                                                         // 151
          var doc = _.extend(fields, {_id:  id});                                                            // 152
          observeCallbacks.added(transform(doc));                                                            // 153
        }                                                                                                    // 154
      },                                                                                                     // 155
      changed: function (id, fields) {                                                                       // 156
        var self = this;                                                                                     // 157
        if (observeCallbacks.changed) {                                                                      // 158
          var oldDoc = self.docs.get(id);                                                                    // 159
          var doc = EJSON.clone(oldDoc);                                                                     // 160
          LocalCollection._applyChanges(doc, fields);                                                        // 161
          observeCallbacks.changed(transform(doc),                                                           // 162
                                   transform(EJSON.clone(oldDoc)));                                          // 163
        }                                                                                                    // 164
      },                                                                                                     // 165
      removed: function (id) {                                                                               // 166
        var self = this;                                                                                     // 167
        if (observeCallbacks.removed) {                                                                      // 168
          observeCallbacks.removed(transform(self.docs.get(id)));                                            // 169
        }                                                                                                    // 170
      }                                                                                                      // 171
    };                                                                                                       // 172
  }                                                                                                          // 173
                                                                                                             // 174
  var changeObserver = new LocalCollection._CachingChangeObserver(                                           // 175
    {callbacks: observeChangesCallbacks});                                                                   // 176
  var handle = cursor.observeChanges(changeObserver.applyChange);                                            // 177
  suppressed = false;                                                                                        // 178
                                                                                                             // 179
  return handle;                                                                                             // 180
};                                                                                                           // 181
                                                                                                             // 182
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/minimongo/objectid.js                                                                            //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
LocalCollection._looksLikeObjectID = function (str) {                                                        // 1
  return str.length === 24 && str.match(/^[0-9a-f]*$/);                                                      // 2
};                                                                                                           // 3
                                                                                                             // 4
LocalCollection._ObjectID = function (hexString) {                                                           // 5
  //random-based impl of Mongo ObjectID                                                                      // 6
  var self = this;                                                                                           // 7
  if (hexString) {                                                                                           // 8
    hexString = hexString.toLowerCase();                                                                     // 9
    if (!LocalCollection._looksLikeObjectID(hexString)) {                                                    // 10
      throw new Error("Invalid hexadecimal string for creating an ObjectID");                                // 11
    }                                                                                                        // 12
    // meant to work with _.isEqual(), which relies on structural equality                                   // 13
    self._str = hexString;                                                                                   // 14
  } else {                                                                                                   // 15
    self._str = Random.hexString(24);                                                                        // 16
  }                                                                                                          // 17
};                                                                                                           // 18
                                                                                                             // 19
LocalCollection._ObjectID.prototype.toString = function () {                                                 // 20
  var self = this;                                                                                           // 21
  return "ObjectID(\"" + self._str + "\")";                                                                  // 22
};                                                                                                           // 23
                                                                                                             // 24
LocalCollection._ObjectID.prototype.equals = function (other) {                                              // 25
  var self = this;                                                                                           // 26
  return other instanceof LocalCollection._ObjectID &&                                                       // 27
    self.valueOf() === other.valueOf();                                                                      // 28
};                                                                                                           // 29
                                                                                                             // 30
LocalCollection._ObjectID.prototype.clone = function () {                                                    // 31
  var self = this;                                                                                           // 32
  return new LocalCollection._ObjectID(self._str);                                                           // 33
};                                                                                                           // 34
                                                                                                             // 35
LocalCollection._ObjectID.prototype.typeName = function() {                                                  // 36
  return "oid";                                                                                              // 37
};                                                                                                           // 38
                                                                                                             // 39
LocalCollection._ObjectID.prototype.getTimestamp = function() {                                              // 40
  var self = this;                                                                                           // 41
  return parseInt(self._str.substr(0, 8), 16);                                                               // 42
};                                                                                                           // 43
                                                                                                             // 44
LocalCollection._ObjectID.prototype.valueOf =                                                                // 45
    LocalCollection._ObjectID.prototype.toJSONValue =                                                        // 46
    LocalCollection._ObjectID.prototype.toHexString =                                                        // 47
    function () { return this._str; };                                                                       // 48
                                                                                                             // 49
// Is this selector just shorthand for lookup by _id?                                                        // 50
LocalCollection._selectorIsId = function (selector) {                                                        // 51
  return (typeof selector === "string") ||                                                                   // 52
    (typeof selector === "number") ||                                                                        // 53
    selector instanceof LocalCollection._ObjectID;                                                           // 54
};                                                                                                           // 55
                                                                                                             // 56
// Is the selector just lookup by _id (shorthand or not)?                                                    // 57
LocalCollection._selectorIsIdPerhapsAsObject = function (selector) {                                         // 58
  return LocalCollection._selectorIsId(selector) ||                                                          // 59
    (selector && typeof selector === "object" &&                                                             // 60
     selector._id && LocalCollection._selectorIsId(selector._id) &&                                          // 61
     _.size(selector) === 1);                                                                                // 62
};                                                                                                           // 63
                                                                                                             // 64
// If this is a selector which explicitly constrains the match by ID to a finite                             // 65
// number of documents, returns a list of their IDs.  Otherwise returns                                      // 66
// null. Note that the selector may have other restrictions so it may not even                               // 67
// match those document!  We care about $in and $and since those are generated                               // 68
// access-controlled update and remove.                                                                      // 69
LocalCollection._idsMatchedBySelector = function (selector) {                                                // 70
  // Is the selector just an ID?                                                                             // 71
  if (LocalCollection._selectorIsId(selector))                                                               // 72
    return [selector];                                                                                       // 73
  if (!selector)                                                                                             // 74
    return null;                                                                                             // 75
                                                                                                             // 76
  // Do we have an _id clause?                                                                               // 77
  if (_.has(selector, '_id')) {                                                                              // 78
    // Is the _id clause just an ID?                                                                         // 79
    if (LocalCollection._selectorIsId(selector._id))                                                         // 80
      return [selector._id];                                                                                 // 81
    // Is the _id clause {_id: {$in: ["x", "y", "z"]}}?                                                      // 82
    if (selector._id && selector._id.$in                                                                     // 83
        && _.isArray(selector._id.$in)                                                                       // 84
        && !_.isEmpty(selector._id.$in)                                                                      // 85
        && _.all(selector._id.$in, LocalCollection._selectorIsId)) {                                         // 86
      return selector._id.$in;                                                                               // 87
    }                                                                                                        // 88
    return null;                                                                                             // 89
  }                                                                                                          // 90
                                                                                                             // 91
  // If this is a top-level $and, and any of the clauses constrain their                                     // 92
  // documents, then the whole selector is constrained by any one clause's                                   // 93
  // constraint. (Well, by their intersection, but that seems unlikely.)                                     // 94
  if (selector.$and && _.isArray(selector.$and)) {                                                           // 95
    for (var i = 0; i < selector.$and.length; ++i) {                                                         // 96
      var subIds = LocalCollection._idsMatchedBySelector(selector.$and[i]);                                  // 97
      if (subIds)                                                                                            // 98
        return subIds;                                                                                       // 99
    }                                                                                                        // 100
  }                                                                                                          // 101
                                                                                                             // 102
  return null;                                                                                               // 103
};                                                                                                           // 104
                                                                                                             // 105
EJSON.addType("oid",  function (str) {                                                                       // 106
  return new LocalCollection._ObjectID(str);                                                                 // 107
});                                                                                                          // 108
                                                                                                             // 109
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.minimongo = {
  LocalCollection: LocalCollection,
  Minimongo: Minimongo,
  MinimongoTest: MinimongoTest
};

})();
