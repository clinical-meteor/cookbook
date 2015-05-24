(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Log = Package.logging.Log;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var MaxHeap = Package['binary-heap'].MaxHeap;
var MinHeap = Package['binary-heap'].MinHeap;
var MinMaxHeap = Package['binary-heap'].MinMaxHeap;
var Hook = Package['callback-hook'].Hook;

/* Package-scope variables */
var MongoInternals, MongoTest, Mongo, MongoConnection, CursorDescription, Cursor, listenAll, forEachTrigger, OPLOG_COLLECTION, idForOp, OplogHandle, ObserveMultiplexer, ObserveHandle, DocFetcher, PollingObserveDriver, OplogObserveDriver, LocalCollectionDriver;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/mongo_driver.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Provide a synchronous Collection API using fibers, backed by                                                       // 2
 * MongoDB.  This is only for use on the server, and mostly identical                                                 // 3
 * to the client API.                                                                                                 // 4
 *                                                                                                                    // 5
 * NOTE: the public API methods must be run within a fiber. If you call                                               // 6
 * these outside of a fiber they will explode!                                                                        // 7
 */                                                                                                                   // 8
                                                                                                                      // 9
var path = Npm.require('path');                                                                                       // 10
var MongoDB = Npm.require('mongodb');                                                                                 // 11
var Fiber = Npm.require('fibers');                                                                                    // 12
var Future = Npm.require(path.join('fibers', 'future'));                                                              // 13
                                                                                                                      // 14
MongoInternals = {};                                                                                                  // 15
MongoTest = {};                                                                                                       // 16
                                                                                                                      // 17
MongoInternals.NpmModules = {                                                                                         // 18
  mongodb: {                                                                                                          // 19
    version: Npm.require('mongodb/package.json').version,                                                             // 20
    module: MongoDB                                                                                                   // 21
  }                                                                                                                   // 22
};                                                                                                                    // 23
                                                                                                                      // 24
// Older version of what is now available via                                                                         // 25
// MongoInternals.NpmModules.mongodb.module.  It was never documented, but                                            // 26
// people do use it.                                                                                                  // 27
// XXX COMPAT WITH 1.0.3.2                                                                                            // 28
MongoInternals.NpmModule = MongoDB;                                                                                   // 29
                                                                                                                      // 30
// This is used to add or remove EJSON from the beginning of everything nested                                        // 31
// inside an EJSON custom type. It should only be called on pure JSON!                                                // 32
var replaceNames = function (filter, thing) {                                                                         // 33
  if (typeof thing === "object") {                                                                                    // 34
    if (_.isArray(thing)) {                                                                                           // 35
      return _.map(thing, _.bind(replaceNames, null, filter));                                                        // 36
    }                                                                                                                 // 37
    var ret = {};                                                                                                     // 38
    _.each(thing, function (value, key) {                                                                             // 39
      ret[filter(key)] = replaceNames(filter, value);                                                                 // 40
    });                                                                                                               // 41
    return ret;                                                                                                       // 42
  }                                                                                                                   // 43
  return thing;                                                                                                       // 44
};                                                                                                                    // 45
                                                                                                                      // 46
// Ensure that EJSON.clone keeps a Timestamp as a Timestamp (instead of just                                          // 47
// doing a structural clone).                                                                                         // 48
// XXX how ok is this? what if there are multiple copies of MongoDB loaded?                                           // 49
MongoDB.Timestamp.prototype.clone = function () {                                                                     // 50
  // Timestamps should be immutable.                                                                                  // 51
  return this;                                                                                                        // 52
};                                                                                                                    // 53
                                                                                                                      // 54
var makeMongoLegal = function (name) { return "EJSON" + name; };                                                      // 55
var unmakeMongoLegal = function (name) { return name.substr(5); };                                                    // 56
                                                                                                                      // 57
var replaceMongoAtomWithMeteor = function (document) {                                                                // 58
  if (document instanceof MongoDB.Binary) {                                                                           // 59
    var buffer = document.value(true);                                                                                // 60
    return new Uint8Array(buffer);                                                                                    // 61
  }                                                                                                                   // 62
  if (document instanceof MongoDB.ObjectID) {                                                                         // 63
    return new Mongo.ObjectID(document.toHexString());                                                                // 64
  }                                                                                                                   // 65
  if (document["EJSON$type"] && document["EJSON$value"]                                                               // 66
      && _.size(document) === 2) {                                                                                    // 67
    return EJSON.fromJSONValue(replaceNames(unmakeMongoLegal, document));                                             // 68
  }                                                                                                                   // 69
  if (document instanceof MongoDB.Timestamp) {                                                                        // 70
    // For now, the Meteor representation of a Mongo timestamp type (not a date!                                      // 71
    // this is a weird internal thing used in the oplog!) is the same as the                                          // 72
    // Mongo representation. We need to do this explicitly or else we would do a                                      // 73
    // structural clone and lose the prototype.                                                                       // 74
    return document;                                                                                                  // 75
  }                                                                                                                   // 76
  return undefined;                                                                                                   // 77
};                                                                                                                    // 78
                                                                                                                      // 79
var replaceMeteorAtomWithMongo = function (document) {                                                                // 80
  if (EJSON.isBinary(document)) {                                                                                     // 81
    // This does more copies than we'd like, but is necessary because                                                 // 82
    // MongoDB.BSON only looks like it takes a Uint8Array (and doesn't actually                                       // 83
    // serialize it correctly).                                                                                       // 84
    return new MongoDB.Binary(new Buffer(document));                                                                  // 85
  }                                                                                                                   // 86
  if (document instanceof Mongo.ObjectID) {                                                                           // 87
    return new MongoDB.ObjectID(document.toHexString());                                                              // 88
  }                                                                                                                   // 89
  if (document instanceof MongoDB.Timestamp) {                                                                        // 90
    // For now, the Meteor representation of a Mongo timestamp type (not a date!                                      // 91
    // this is a weird internal thing used in the oplog!) is the same as the                                          // 92
    // Mongo representation. We need to do this explicitly or else we would do a                                      // 93
    // structural clone and lose the prototype.                                                                       // 94
    return document;                                                                                                  // 95
  }                                                                                                                   // 96
  if (EJSON._isCustomType(document)) {                                                                                // 97
    return replaceNames(makeMongoLegal, EJSON.toJSONValue(document));                                                 // 98
  }                                                                                                                   // 99
  // It is not ordinarily possible to stick dollar-sign keys into mongo                                               // 100
  // so we don't bother checking for things that need escaping at this time.                                          // 101
  return undefined;                                                                                                   // 102
};                                                                                                                    // 103
                                                                                                                      // 104
var replaceTypes = function (document, atomTransformer) {                                                             // 105
  if (typeof document !== 'object' || document === null)                                                              // 106
    return document;                                                                                                  // 107
                                                                                                                      // 108
  var replacedTopLevelAtom = atomTransformer(document);                                                               // 109
  if (replacedTopLevelAtom !== undefined)                                                                             // 110
    return replacedTopLevelAtom;                                                                                      // 111
                                                                                                                      // 112
  var ret = document;                                                                                                 // 113
  _.each(document, function (val, key) {                                                                              // 114
    var valReplaced = replaceTypes(val, atomTransformer);                                                             // 115
    if (val !== valReplaced) {                                                                                        // 116
      // Lazy clone. Shallow copy.                                                                                    // 117
      if (ret === document)                                                                                           // 118
        ret = _.clone(document);                                                                                      // 119
      ret[key] = valReplaced;                                                                                         // 120
    }                                                                                                                 // 121
  });                                                                                                                 // 122
  return ret;                                                                                                         // 123
};                                                                                                                    // 124
                                                                                                                      // 125
                                                                                                                      // 126
MongoConnection = function (url, options) {                                                                           // 127
  var self = this;                                                                                                    // 128
  options = options || {};                                                                                            // 129
  self._observeMultiplexers = {};                                                                                     // 130
  self._onFailoverHook = new Hook;                                                                                    // 131
                                                                                                                      // 132
  var mongoOptions = {db: {safe: true}, server: {}, replSet: {}};                                                     // 133
                                                                                                                      // 134
  // Set autoReconnect to true, unless passed on the URL. Why someone                                                 // 135
  // would want to set autoReconnect to false, I'm not really sure, but                                               // 136
  // keeping this for backwards compatibility for now.                                                                // 137
  if (!(/[\?&]auto_?[rR]econnect=/.test(url))) {                                                                      // 138
    mongoOptions.server.auto_reconnect = true;                                                                        // 139
  }                                                                                                                   // 140
                                                                                                                      // 141
  // Disable the native parser by default, unless specifically enabled                                                // 142
  // in the mongo URL.                                                                                                // 143
  // - The native driver can cause errors which normally would be                                                     // 144
  //   thrown, caught, and handled into segfaults that take down the                                                  // 145
  //   whole app.                                                                                                     // 146
  // - Binary modules don't yet work when you bundle and move the bundle                                              // 147
  //   to a different platform (aka deploy)                                                                           // 148
  // We should revisit this after binary npm module support lands.                                                    // 149
  if (!(/[\?&]native_?[pP]arser=/.test(url))) {                                                                       // 150
    mongoOptions.db.native_parser = false;                                                                            // 151
  }                                                                                                                   // 152
                                                                                                                      // 153
  // XXX maybe we should have a better way of allowing users to configure the                                         // 154
  // underlying Mongo driver                                                                                          // 155
  if (_.has(options, 'poolSize')) {                                                                                   // 156
    // If we just set this for "server", replSet will override it. If we just                                         // 157
    // set it for replSet, it will be ignored if we're not using a replSet.                                           // 158
    mongoOptions.server.poolSize = options.poolSize;                                                                  // 159
    mongoOptions.replSet.poolSize = options.poolSize;                                                                 // 160
  }                                                                                                                   // 161
                                                                                                                      // 162
  self.db = null;                                                                                                     // 163
  // We keep track of the ReplSet's primary, so that we can trigger hooks when                                        // 164
  // it changes.  The Node driver's joined callback seems to fire way too                                             // 165
  // often, which is why we need to track it ourselves.                                                               // 166
  self._primary = null;                                                                                               // 167
  self._oplogHandle = null;                                                                                           // 168
  self._docFetcher = null;                                                                                            // 169
                                                                                                                      // 170
                                                                                                                      // 171
  var connectFuture = new Future;                                                                                     // 172
  MongoDB.connect(                                                                                                    // 173
    url,                                                                                                              // 174
    mongoOptions,                                                                                                     // 175
    Meteor.bindEnvironment(                                                                                           // 176
      function (err, db) {                                                                                            // 177
        if (err) {                                                                                                    // 178
          throw err;                                                                                                  // 179
        }                                                                                                             // 180
                                                                                                                      // 181
        // First, figure out what the current primary is, if any.                                                     // 182
        if (db.serverConfig._state.master)                                                                            // 183
          self._primary = db.serverConfig._state.master.name;                                                         // 184
        db.serverConfig.on(                                                                                           // 185
          'joined', Meteor.bindEnvironment(function (kind, doc) {                                                     // 186
            if (kind === 'primary') {                                                                                 // 187
              if (doc.primary !== self._primary) {                                                                    // 188
                self._primary = doc.primary;                                                                          // 189
                self._onFailoverHook.each(function (callback) {                                                       // 190
                  callback();                                                                                         // 191
                  return true;                                                                                        // 192
                });                                                                                                   // 193
              }                                                                                                       // 194
            } else if (doc.me === self._primary) {                                                                    // 195
              // The thing we thought was primary is now something other than                                         // 196
              // primary.  Forget that we thought it was primary.  (This means                                        // 197
              // that if a server stops being primary and then starts being                                           // 198
              // primary again without another server becoming primary in the                                         // 199
              // middle, we'll correctly count it as a failover.)                                                     // 200
              self._primary = null;                                                                                   // 201
            }                                                                                                         // 202
          }));                                                                                                        // 203
                                                                                                                      // 204
        // Allow the constructor to return.                                                                           // 205
        connectFuture['return'](db);                                                                                  // 206
      },                                                                                                              // 207
      connectFuture.resolver()  // onException                                                                        // 208
    )                                                                                                                 // 209
  );                                                                                                                  // 210
                                                                                                                      // 211
  // Wait for the connection to be successful; throws on failure.                                                     // 212
  self.db = connectFuture.wait();                                                                                     // 213
                                                                                                                      // 214
  if (options.oplogUrl && ! Package['disable-oplog']) {                                                               // 215
    self._oplogHandle = new OplogHandle(options.oplogUrl, self.db.databaseName);                                      // 216
    self._docFetcher = new DocFetcher(self);                                                                          // 217
  }                                                                                                                   // 218
};                                                                                                                    // 219
                                                                                                                      // 220
MongoConnection.prototype.close = function() {                                                                        // 221
  var self = this;                                                                                                    // 222
                                                                                                                      // 223
  if (! self.db)                                                                                                      // 224
    throw Error("close called before Connection created?");                                                           // 225
                                                                                                                      // 226
  // XXX probably untested                                                                                            // 227
  var oplogHandle = self._oplogHandle;                                                                                // 228
  self._oplogHandle = null;                                                                                           // 229
  if (oplogHandle)                                                                                                    // 230
    oplogHandle.stop();                                                                                               // 231
                                                                                                                      // 232
  // Use Future.wrap so that errors get thrown. This happens to                                                       // 233
  // work even outside a fiber since the 'close' method is not                                                        // 234
  // actually asynchronous.                                                                                           // 235
  Future.wrap(_.bind(self.db.close, self.db))(true).wait();                                                           // 236
};                                                                                                                    // 237
                                                                                                                      // 238
// Returns the Mongo Collection object; may yield.                                                                    // 239
MongoConnection.prototype.rawCollection = function (collectionName) {                                                 // 240
  var self = this;                                                                                                    // 241
                                                                                                                      // 242
  if (! self.db)                                                                                                      // 243
    throw Error("rawCollection called before Connection created?");                                                   // 244
                                                                                                                      // 245
  var future = new Future;                                                                                            // 246
  self.db.collection(collectionName, future.resolver());                                                              // 247
  return future.wait();                                                                                               // 248
};                                                                                                                    // 249
                                                                                                                      // 250
MongoConnection.prototype._createCappedCollection = function (                                                        // 251
    collectionName, byteSize, maxDocuments) {                                                                         // 252
  var self = this;                                                                                                    // 253
                                                                                                                      // 254
  if (! self.db)                                                                                                      // 255
    throw Error("_createCappedCollection called before Connection created?");                                         // 256
                                                                                                                      // 257
  var future = new Future();                                                                                          // 258
  self.db.createCollection(                                                                                           // 259
    collectionName,                                                                                                   // 260
    { capped: true, size: byteSize, max: maxDocuments },                                                              // 261
    future.resolver());                                                                                               // 262
  future.wait();                                                                                                      // 263
};                                                                                                                    // 264
                                                                                                                      // 265
// This should be called synchronously with a write, to create a                                                      // 266
// transaction on the current write fence, if any. After we can read                                                  // 267
// the write, and after observers have been notified (or at least,                                                    // 268
// after the observer notifiers have added themselves to the write                                                    // 269
// fence), you should call 'committed()' on the object returned.                                                      // 270
MongoConnection.prototype._maybeBeginWrite = function () {                                                            // 271
  var self = this;                                                                                                    // 272
  var fence = DDPServer._CurrentWriteFence.get();                                                                     // 273
  if (fence)                                                                                                          // 274
    return fence.beginWrite();                                                                                        // 275
  else                                                                                                                // 276
    return {committed: function () {}};                                                                               // 277
};                                                                                                                    // 278
                                                                                                                      // 279
// Internal interface: adds a callback which is called when the Mongo primary                                         // 280
// changes. Returns a stop handle.                                                                                    // 281
MongoConnection.prototype._onFailover = function (callback) {                                                         // 282
  return this._onFailoverHook.register(callback);                                                                     // 283
};                                                                                                                    // 284
                                                                                                                      // 285
                                                                                                                      // 286
//////////// Public API //////////                                                                                    // 287
                                                                                                                      // 288
// The write methods block until the database has confirmed the write (it may                                         // 289
// not be replicated or stable on disk, but one server has confirmed it) if no                                        // 290
// callback is provided. If a callback is provided, then they call the callback                                       // 291
// when the write is confirmed. They return nothing on success, and raise an                                          // 292
// exception on failure.                                                                                              // 293
//                                                                                                                    // 294
// After making a write (with insert, update, remove), observers are                                                  // 295
// notified asynchronously. If you want to receive a callback once all                                                // 296
// of the observer notifications have landed for your write, do the                                                   // 297
// writes inside a write fence (set DDPServer._CurrentWriteFence to a new                                             // 298
// _WriteFence, and then set a callback on the write fence.)                                                          // 299
//                                                                                                                    // 300
// Since our execution environment is single-threaded, this is                                                        // 301
// well-defined -- a write "has been made" if it's returned, and an                                                   // 302
// observer "has been notified" if its callback has returned.                                                         // 303
                                                                                                                      // 304
var writeCallback = function (write, refresh, callback) {                                                             // 305
  return function (err, result) {                                                                                     // 306
    if (! err) {                                                                                                      // 307
      // XXX We don't have to run this on error, right?                                                               // 308
      refresh();                                                                                                      // 309
    }                                                                                                                 // 310
    write.committed();                                                                                                // 311
    if (callback)                                                                                                     // 312
      callback(err, result);                                                                                          // 313
    else if (err)                                                                                                     // 314
      throw err;                                                                                                      // 315
  };                                                                                                                  // 316
};                                                                                                                    // 317
                                                                                                                      // 318
var bindEnvironmentForWrite = function (callback) {                                                                   // 319
  return Meteor.bindEnvironment(callback, "Mongo write");                                                             // 320
};                                                                                                                    // 321
                                                                                                                      // 322
MongoConnection.prototype._insert = function (collection_name, document,                                              // 323
                                              callback) {                                                             // 324
  var self = this;                                                                                                    // 325
                                                                                                                      // 326
  var sendError = function (e) {                                                                                      // 327
    if (callback)                                                                                                     // 328
      return callback(e);                                                                                             // 329
    throw e;                                                                                                          // 330
  };                                                                                                                  // 331
                                                                                                                      // 332
  if (collection_name === "___meteor_failure_test_collection") {                                                      // 333
    var e = new Error("Failure test");                                                                                // 334
    e.expected = true;                                                                                                // 335
    sendError(e);                                                                                                     // 336
    return;                                                                                                           // 337
  }                                                                                                                   // 338
                                                                                                                      // 339
  if (!(LocalCollection._isPlainObject(document) &&                                                                   // 340
        !EJSON._isCustomType(document))) {                                                                            // 341
    sendError(new Error(                                                                                              // 342
      "Only plain objects may be inserted into MongoDB"));                                                            // 343
    return;                                                                                                           // 344
  }                                                                                                                   // 345
                                                                                                                      // 346
  var write = self._maybeBeginWrite();                                                                                // 347
  var refresh = function () {                                                                                         // 348
    Meteor.refresh({collection: collection_name, id: document._id });                                                 // 349
  };                                                                                                                  // 350
  callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));                                        // 351
  try {                                                                                                               // 352
    var collection = self.rawCollection(collection_name);                                                             // 353
    collection.insert(replaceTypes(document, replaceMeteorAtomWithMongo),                                             // 354
                      {safe: true}, callback);                                                                        // 355
  } catch (e) {                                                                                                       // 356
    write.committed();                                                                                                // 357
    throw e;                                                                                                          // 358
  }                                                                                                                   // 359
};                                                                                                                    // 360
                                                                                                                      // 361
// Cause queries that may be affected by the selector to poll in this write                                           // 362
// fence.                                                                                                             // 363
MongoConnection.prototype._refresh = function (collectionName, selector) {                                            // 364
  var self = this;                                                                                                    // 365
  var refreshKey = {collection: collectionName};                                                                      // 366
  // If we know which documents we're removing, don't poll queries that are                                           // 367
  // specific to other documents. (Note that multiple notifications here should                                       // 368
  // not cause multiple polls, since all our listener is doing is enqueueing a                                        // 369
  // poll.)                                                                                                           // 370
  var specificIds = LocalCollection._idsMatchedBySelector(selector);                                                  // 371
  if (specificIds) {                                                                                                  // 372
    _.each(specificIds, function (id) {                                                                               // 373
      Meteor.refresh(_.extend({id: id}, refreshKey));                                                                 // 374
    });                                                                                                               // 375
  } else {                                                                                                            // 376
    Meteor.refresh(refreshKey);                                                                                       // 377
  }                                                                                                                   // 378
};                                                                                                                    // 379
                                                                                                                      // 380
MongoConnection.prototype._remove = function (collection_name, selector,                                              // 381
                                              callback) {                                                             // 382
  var self = this;                                                                                                    // 383
                                                                                                                      // 384
  if (collection_name === "___meteor_failure_test_collection") {                                                      // 385
    var e = new Error("Failure test");                                                                                // 386
    e.expected = true;                                                                                                // 387
    if (callback)                                                                                                     // 388
      return callback(e);                                                                                             // 389
    else                                                                                                              // 390
      throw e;                                                                                                        // 391
  }                                                                                                                   // 392
                                                                                                                      // 393
  var write = self._maybeBeginWrite();                                                                                // 394
  var refresh = function () {                                                                                         // 395
    self._refresh(collection_name, selector);                                                                         // 396
  };                                                                                                                  // 397
  callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));                                        // 398
                                                                                                                      // 399
  try {                                                                                                               // 400
    var collection = self.rawCollection(collection_name);                                                             // 401
    collection.remove(replaceTypes(selector, replaceMeteorAtomWithMongo),                                             // 402
                      {safe: true}, callback);                                                                        // 403
  } catch (e) {                                                                                                       // 404
    write.committed();                                                                                                // 405
    throw e;                                                                                                          // 406
  }                                                                                                                   // 407
};                                                                                                                    // 408
                                                                                                                      // 409
MongoConnection.prototype._dropCollection = function (collectionName, cb) {                                           // 410
  var self = this;                                                                                                    // 411
                                                                                                                      // 412
  var write = self._maybeBeginWrite();                                                                                // 413
  var refresh = function () {                                                                                         // 414
    Meteor.refresh({collection: collectionName, id: null,                                                             // 415
                    dropCollection: true});                                                                           // 416
  };                                                                                                                  // 417
  cb = bindEnvironmentForWrite(writeCallback(write, refresh, cb));                                                    // 418
                                                                                                                      // 419
  try {                                                                                                               // 420
    var collection = self.rawCollection(collectionName);                                                              // 421
    collection.drop(cb);                                                                                              // 422
  } catch (e) {                                                                                                       // 423
    write.committed();                                                                                                // 424
    throw e;                                                                                                          // 425
  }                                                                                                                   // 426
};                                                                                                                    // 427
                                                                                                                      // 428
MongoConnection.prototype._update = function (collection_name, selector, mod,                                         // 429
                                              options, callback) {                                                    // 430
  var self = this;                                                                                                    // 431
                                                                                                                      // 432
  if (! callback && options instanceof Function) {                                                                    // 433
    callback = options;                                                                                               // 434
    options = null;                                                                                                   // 435
  }                                                                                                                   // 436
                                                                                                                      // 437
  if (collection_name === "___meteor_failure_test_collection") {                                                      // 438
    var e = new Error("Failure test");                                                                                // 439
    e.expected = true;                                                                                                // 440
    if (callback)                                                                                                     // 441
      return callback(e);                                                                                             // 442
    else                                                                                                              // 443
      throw e;                                                                                                        // 444
  }                                                                                                                   // 445
                                                                                                                      // 446
  // explicit safety check. null and undefined can crash the mongo                                                    // 447
  // driver. Although the node driver and minimongo do 'support'                                                      // 448
  // non-object modifier in that they don't crash, they are not                                                       // 449
  // meaningful operations and do not do anything. Defensively throw an                                               // 450
  // error here.                                                                                                      // 451
  if (!mod || typeof mod !== 'object')                                                                                // 452
    throw new Error("Invalid modifier. Modifier must be an object.");                                                 // 453
                                                                                                                      // 454
  if (!(LocalCollection._isPlainObject(mod) &&                                                                        // 455
        !EJSON._isCustomType(mod))) {                                                                                 // 456
    throw new Error(                                                                                                  // 457
      "Only plain objects may be used as replacement" +                                                               // 458
        " documents in MongoDB");                                                                                     // 459
    return;                                                                                                           // 460
  }                                                                                                                   // 461
                                                                                                                      // 462
  if (!options) options = {};                                                                                         // 463
                                                                                                                      // 464
  var write = self._maybeBeginWrite();                                                                                // 465
  var refresh = function () {                                                                                         // 466
    self._refresh(collection_name, selector);                                                                         // 467
  };                                                                                                                  // 468
  callback = writeCallback(write, refresh, callback);                                                                 // 469
  try {                                                                                                               // 470
    var collection = self.rawCollection(collection_name);                                                             // 471
    var mongoOpts = {safe: true};                                                                                     // 472
    // explictly enumerate options that minimongo supports                                                            // 473
    if (options.upsert) mongoOpts.upsert = true;                                                                      // 474
    if (options.multi) mongoOpts.multi = true;                                                                        // 475
    // Lets you get a more more full result from MongoDB. Use with caution:                                           // 476
    // might not work with C.upsert (as opposed to C.update({upsert:true}) or                                         // 477
    // with simulated upsert.                                                                                         // 478
    if (options.fullResult) mongoOpts.fullResult = true;                                                              // 479
                                                                                                                      // 480
    var mongoSelector = replaceTypes(selector, replaceMeteorAtomWithMongo);                                           // 481
    var mongoMod = replaceTypes(mod, replaceMeteorAtomWithMongo);                                                     // 482
                                                                                                                      // 483
    var isModify = isModificationMod(mongoMod);                                                                       // 484
    var knownId = selector._id || mod._id;                                                                            // 485
                                                                                                                      // 486
    if (options._forbidReplace && ! isModify) {                                                                       // 487
      var e = new Error("Invalid modifier. Replacements are forbidden.");                                             // 488
      if (callback) {                                                                                                 // 489
        return callback(e);                                                                                           // 490
      } else {                                                                                                        // 491
        throw e;                                                                                                      // 492
      }                                                                                                               // 493
    }                                                                                                                 // 494
                                                                                                                      // 495
    if (options.upsert && (! knownId) && options.insertedId) {                                                        // 496
      // XXX If we know we're using Mongo 2.6 (and this isn't a replacement)                                          // 497
      //     we should be able to just use $setOnInsert instead of this                                               // 498
      //     simulated upsert thing. (We can't use $setOnInsert with                                                  // 499
      //     replacements because there's nowhere to write it, and $setOnInsert                                       // 500
      //     can't set _id on Mongo 2.4.)                                                                             // 501
      //                                                                                                              // 502
      //     Also, in the future we could do a real upsert for the mongo id                                           // 503
      //     generation case, if the the node mongo driver gives us back the id                                       // 504
      //     of the upserted doc (which our current version does not).                                                // 505
      //                                                                                                              // 506
      //     For more context, see                                                                                    // 507
      //     https://github.com/meteor/meteor/issues/2278#issuecomment-64252706                                       // 508
      simulateUpsertWithInsertedId(                                                                                   // 509
        collection, mongoSelector, mongoMod,                                                                          // 510
        isModify, options,                                                                                            // 511
        // This callback does not need to be bindEnvironment'ed because                                               // 512
        // simulateUpsertWithInsertedId() wraps it and then passes it through                                         // 513
        // bindEnvironmentForWrite.                                                                                   // 514
        function (err, result) {                                                                                      // 515
          // If we got here via a upsert() call, then options._returnObject will                                      // 516
          // be set and we should return the whole object. Otherwise, we should                                       // 517
          // just return the number of affected docs to match the mongo API.                                          // 518
          if (result && ! options._returnObject)                                                                      // 519
            callback(err, result.numberAffected);                                                                     // 520
          else                                                                                                        // 521
            callback(err, result);                                                                                    // 522
        }                                                                                                             // 523
      );                                                                                                              // 524
    } else {                                                                                                          // 525
      collection.update(                                                                                              // 526
        mongoSelector, mongoMod, mongoOpts,                                                                           // 527
        bindEnvironmentForWrite(function (err, result, extra) {                                                       // 528
          if (! err) {                                                                                                // 529
            if (result && options._returnObject) {                                                                    // 530
              result = { numberAffected: result };                                                                    // 531
              // If this was an upsert() call, and we ended up                                                        // 532
              // inserting a new doc and we know its id, then                                                         // 533
              // return that id as well.                                                                              // 534
              if (options.upsert && knownId &&                                                                        // 535
                  ! extra.updatedExisting)                                                                            // 536
                result.insertedId = knownId;                                                                          // 537
            }                                                                                                         // 538
          }                                                                                                           // 539
          callback(err, result);                                                                                      // 540
        }));                                                                                                          // 541
    }                                                                                                                 // 542
  } catch (e) {                                                                                                       // 543
    write.committed();                                                                                                // 544
    throw e;                                                                                                          // 545
  }                                                                                                                   // 546
};                                                                                                                    // 547
                                                                                                                      // 548
var isModificationMod = function (mod) {                                                                              // 549
  var isReplace = false;                                                                                              // 550
  var isModify = false;                                                                                               // 551
  for (var k in mod) {                                                                                                // 552
    if (k.substr(0, 1) === '$') {                                                                                     // 553
      isModify = true;                                                                                                // 554
    } else {                                                                                                          // 555
      isReplace = true;                                                                                               // 556
    }                                                                                                                 // 557
  }                                                                                                                   // 558
  if (isModify && isReplace) {                                                                                        // 559
    throw new Error(                                                                                                  // 560
      "Update parameter cannot have both modifier and non-modifier fields.");                                         // 561
  }                                                                                                                   // 562
  return isModify;                                                                                                    // 563
};                                                                                                                    // 564
                                                                                                                      // 565
var NUM_OPTIMISTIC_TRIES = 3;                                                                                         // 566
                                                                                                                      // 567
// exposed for testing                                                                                                // 568
MongoConnection._isCannotChangeIdError = function (err) {                                                             // 569
  // First check for what this error looked like in Mongo 2.4.  Either of these                                       // 570
  // checks should work, but just to be safe...                                                                       // 571
  if (err.code === 13596)                                                                                             // 572
    return true;                                                                                                      // 573
  if (err.err.indexOf("cannot change _id of a document") === 0)                                                       // 574
    return true;                                                                                                      // 575
                                                                                                                      // 576
  // Now look for what it looks like in Mongo 2.6.  We don't use the error code                                       // 577
  // here, because the error code we observed it producing (16837) appears to be                                      // 578
  // a far more generic error code based on examining the source.                                                     // 579
  if (err.err.indexOf("The _id field cannot be changed") === 0)                                                       // 580
    return true;                                                                                                      // 581
                                                                                                                      // 582
  return false;                                                                                                       // 583
};                                                                                                                    // 584
                                                                                                                      // 585
var simulateUpsertWithInsertedId = function (collection, selector, mod,                                               // 586
                                             isModify, options, callback) {                                           // 587
  // STRATEGY:  First try doing a plain update.  If it affected 0 documents,                                          // 588
  // then without affecting the database, we know we should probably do an                                            // 589
  // insert.  We then do a *conditional* insert that will fail in the case                                            // 590
  // of a race condition.  This conditional insert is actually an                                                     // 591
  // upsert-replace with an _id, which will never successfully update an                                              // 592
  // existing document.  If this upsert fails with an error saying it                                                 // 593
  // couldn't change an existing _id, then we know an intervening write has                                           // 594
  // caused the query to match something.  We go back to step one and repeat.                                         // 595
  // Like all "optimistic write" schemes, we rely on the fact that it's                                               // 596
  // unlikely our writes will continue to be interfered with under normal                                             // 597
  // circumstances (though sufficiently heavy contention with writers                                                 // 598
  // disagreeing on the existence of an object will cause writes to fail                                              // 599
  // in theory).                                                                                                      // 600
                                                                                                                      // 601
  var newDoc;                                                                                                         // 602
  // Run this code up front so that it fails fast if someone uses                                                     // 603
  // a Mongo update operator we don't support.                                                                        // 604
  if (isModify) {                                                                                                     // 605
    // We've already run replaceTypes/replaceMeteorAtomWithMongo on                                                   // 606
    // selector and mod.  We assume it doesn't matter, as far as                                                      // 607
    // the behavior of modifiers is concerned, whether `_modify`                                                      // 608
    // is run on EJSON or on mongo-converted EJSON.                                                                   // 609
    var selectorDoc = LocalCollection._removeDollarOperators(selector);                                               // 610
    LocalCollection._modify(selectorDoc, mod, {isInsert: true});                                                      // 611
    newDoc = selectorDoc;                                                                                             // 612
  } else {                                                                                                            // 613
    newDoc = mod;                                                                                                     // 614
  }                                                                                                                   // 615
                                                                                                                      // 616
  var insertedId = options.insertedId; // must exist                                                                  // 617
  var mongoOptsForUpdate = {                                                                                          // 618
    safe: true,                                                                                                       // 619
    multi: options.multi                                                                                              // 620
  };                                                                                                                  // 621
  var mongoOptsForInsert = {                                                                                          // 622
    safe: true,                                                                                                       // 623
    upsert: true                                                                                                      // 624
  };                                                                                                                  // 625
                                                                                                                      // 626
  var tries = NUM_OPTIMISTIC_TRIES;                                                                                   // 627
                                                                                                                      // 628
  var doUpdate = function () {                                                                                        // 629
    tries--;                                                                                                          // 630
    if (! tries) {                                                                                                    // 631
      callback(new Error("Upsert failed after " + NUM_OPTIMISTIC_TRIES + " tries."));                                 // 632
    } else {                                                                                                          // 633
      collection.update(selector, mod, mongoOptsForUpdate,                                                            // 634
                        bindEnvironmentForWrite(function (err, result) {                                              // 635
                          if (err)                                                                                    // 636
                            callback(err);                                                                            // 637
                          else if (result)                                                                            // 638
                            callback(null, {                                                                          // 639
                              numberAffected: result                                                                  // 640
                            });                                                                                       // 641
                          else                                                                                        // 642
                            doConditionalInsert();                                                                    // 643
                        }));                                                                                          // 644
    }                                                                                                                 // 645
  };                                                                                                                  // 646
                                                                                                                      // 647
  var doConditionalInsert = function () {                                                                             // 648
    var replacementWithId = _.extend(                                                                                 // 649
      replaceTypes({_id: insertedId}, replaceMeteorAtomWithMongo),                                                    // 650
      newDoc);                                                                                                        // 651
    collection.update(selector, replacementWithId, mongoOptsForInsert,                                                // 652
                      bindEnvironmentForWrite(function (err, result) {                                                // 653
                        if (err) {                                                                                    // 654
                          // figure out if this is a                                                                  // 655
                          // "cannot change _id of document" error, and                                               // 656
                          // if so, try doUpdate() again, up to 3 times.                                              // 657
                          if (MongoConnection._isCannotChangeIdError(err)) {                                          // 658
                            doUpdate();                                                                               // 659
                          } else {                                                                                    // 660
                            callback(err);                                                                            // 661
                          }                                                                                           // 662
                        } else {                                                                                      // 663
                          callback(null, {                                                                            // 664
                            numberAffected: result,                                                                   // 665
                            insertedId: insertedId                                                                    // 666
                          });                                                                                         // 667
                        }                                                                                             // 668
                      }));                                                                                            // 669
  };                                                                                                                  // 670
                                                                                                                      // 671
  doUpdate();                                                                                                         // 672
};                                                                                                                    // 673
                                                                                                                      // 674
_.each(["insert", "update", "remove", "dropCollection"], function (method) {                                          // 675
  MongoConnection.prototype[method] = function (/* arguments */) {                                                    // 676
    var self = this;                                                                                                  // 677
    return Meteor.wrapAsync(self["_" + method]).apply(self, arguments);                                               // 678
  };                                                                                                                  // 679
});                                                                                                                   // 680
                                                                                                                      // 681
// XXX MongoConnection.upsert() does not return the id of the inserted document                                       // 682
// unless you set it explicitly in the selector or modifier (as a replacement                                         // 683
// doc).                                                                                                              // 684
MongoConnection.prototype.upsert = function (collectionName, selector, mod,                                           // 685
                                             options, callback) {                                                     // 686
  var self = this;                                                                                                    // 687
  if (typeof options === "function" && ! callback) {                                                                  // 688
    callback = options;                                                                                               // 689
    options = {};                                                                                                     // 690
  }                                                                                                                   // 691
                                                                                                                      // 692
  return self.update(collectionName, selector, mod,                                                                   // 693
                     _.extend({}, options, {                                                                          // 694
                       upsert: true,                                                                                  // 695
                       _returnObject: true                                                                            // 696
                     }), callback);                                                                                   // 697
};                                                                                                                    // 698
                                                                                                                      // 699
MongoConnection.prototype.find = function (collectionName, selector, options) {                                       // 700
  var self = this;                                                                                                    // 701
                                                                                                                      // 702
  if (arguments.length === 1)                                                                                         // 703
    selector = {};                                                                                                    // 704
                                                                                                                      // 705
  return new Cursor(                                                                                                  // 706
    self, new CursorDescription(collectionName, selector, options));                                                  // 707
};                                                                                                                    // 708
                                                                                                                      // 709
MongoConnection.prototype.findOne = function (collection_name, selector,                                              // 710
                                              options) {                                                              // 711
  var self = this;                                                                                                    // 712
  if (arguments.length === 1)                                                                                         // 713
    selector = {};                                                                                                    // 714
                                                                                                                      // 715
  options = options || {};                                                                                            // 716
  options.limit = 1;                                                                                                  // 717
  return self.find(collection_name, selector, options).fetch()[0];                                                    // 718
};                                                                                                                    // 719
                                                                                                                      // 720
// We'll actually design an index API later. For now, we just pass through to                                         // 721
// Mongo's, but make it synchronous.                                                                                  // 722
MongoConnection.prototype._ensureIndex = function (collectionName, index,                                             // 723
                                                   options) {                                                         // 724
  var self = this;                                                                                                    // 725
  options = _.extend({safe: true}, options);                                                                          // 726
                                                                                                                      // 727
  // We expect this function to be called at startup, not from within a method,                                       // 728
  // so we don't interact with the write fence.                                                                       // 729
  var collection = self.rawCollection(collectionName);                                                                // 730
  var future = new Future;                                                                                            // 731
  var indexName = collection.ensureIndex(index, options, future.resolver());                                          // 732
  future.wait();                                                                                                      // 733
};                                                                                                                    // 734
MongoConnection.prototype._dropIndex = function (collectionName, index) {                                             // 735
  var self = this;                                                                                                    // 736
                                                                                                                      // 737
  // This function is only used by test code, not within a method, so we don't                                        // 738
  // interact with the write fence.                                                                                   // 739
  var collection = self.rawCollection(collectionName);                                                                // 740
  var future = new Future;                                                                                            // 741
  var indexName = collection.dropIndex(index, future.resolver());                                                     // 742
  future.wait();                                                                                                      // 743
};                                                                                                                    // 744
                                                                                                                      // 745
// CURSORS                                                                                                            // 746
                                                                                                                      // 747
// There are several classes which relate to cursors:                                                                 // 748
//                                                                                                                    // 749
// CursorDescription represents the arguments used to construct a cursor:                                             // 750
// collectionName, selector, and (find) options.  Because it is used as a key                                         // 751
// for cursor de-dup, everything in it should either be JSON-stringifiable or                                         // 752
// not affect observeChanges output (eg, options.transform functions are not                                          // 753
// stringifiable but do not affect observeChanges).                                                                   // 754
//                                                                                                                    // 755
// SynchronousCursor is a wrapper around a MongoDB cursor                                                             // 756
// which includes fully-synchronous versions of forEach, etc.                                                         // 757
//                                                                                                                    // 758
// Cursor is the cursor object returned from find(), which implements the                                             // 759
// documented Mongo.Collection cursor API.  It wraps a CursorDescription and a                                        // 760
// SynchronousCursor (lazily: it doesn't contact Mongo until you call a method                                        // 761
// like fetch or forEach on it).                                                                                      // 762
//                                                                                                                    // 763
// ObserveHandle is the "observe handle" returned from observeChanges. It has a                                       // 764
// reference to an ObserveMultiplexer.                                                                                // 765
//                                                                                                                    // 766
// ObserveMultiplexer allows multiple identical ObserveHandles to be driven by a                                      // 767
// single observe driver.                                                                                             // 768
//                                                                                                                    // 769
// There are two "observe drivers" which drive ObserveMultiplexers:                                                   // 770
//   - PollingObserveDriver caches the results of a query and reruns it when                                          // 771
//     necessary.                                                                                                     // 772
//   - OplogObserveDriver follows the Mongo operation log to directly observe                                         // 773
//     database changes.                                                                                              // 774
// Both implementations follow the same simple interface: when you create them,                                       // 775
// they start sending observeChanges callbacks (and a ready() invocation) to                                          // 776
// their ObserveMultiplexer, and you stop them by calling their stop() method.                                        // 777
                                                                                                                      // 778
CursorDescription = function (collectionName, selector, options) {                                                    // 779
  var self = this;                                                                                                    // 780
  self.collectionName = collectionName;                                                                               // 781
  self.selector = Mongo.Collection._rewriteSelector(selector);                                                        // 782
  self.options = options || {};                                                                                       // 783
};                                                                                                                    // 784
                                                                                                                      // 785
Cursor = function (mongo, cursorDescription) {                                                                        // 786
  var self = this;                                                                                                    // 787
                                                                                                                      // 788
  self._mongo = mongo;                                                                                                // 789
  self._cursorDescription = cursorDescription;                                                                        // 790
  self._synchronousCursor = null;                                                                                     // 791
};                                                                                                                    // 792
                                                                                                                      // 793
_.each(['forEach', 'map', 'fetch', 'count'], function (method) {                                                      // 794
  Cursor.prototype[method] = function () {                                                                            // 795
    var self = this;                                                                                                  // 796
                                                                                                                      // 797
    // You can only observe a tailable cursor.                                                                        // 798
    if (self._cursorDescription.options.tailable)                                                                     // 799
      throw new Error("Cannot call " + method + " on a tailable cursor");                                             // 800
                                                                                                                      // 801
    if (!self._synchronousCursor) {                                                                                   // 802
      self._synchronousCursor = self._mongo._createSynchronousCursor(                                                 // 803
        self._cursorDescription, {                                                                                    // 804
          // Make sure that the "self" argument to forEach/map callbacks is the                                       // 805
          // Cursor, not the SynchronousCursor.                                                                       // 806
          selfForIteration: self,                                                                                     // 807
          useTransform: true                                                                                          // 808
        });                                                                                                           // 809
    }                                                                                                                 // 810
                                                                                                                      // 811
    return self._synchronousCursor[method].apply(                                                                     // 812
      self._synchronousCursor, arguments);                                                                            // 813
  };                                                                                                                  // 814
});                                                                                                                   // 815
                                                                                                                      // 816
// Since we don't actually have a "nextObject" interface, there's really no                                           // 817
// reason to have a "rewind" interface.  All it did was make multiple calls                                           // 818
// to fetch/map/forEach return nothing the second time.                                                               // 819
// XXX COMPAT WITH 0.8.1                                                                                              // 820
Cursor.prototype.rewind = function () {                                                                               // 821
};                                                                                                                    // 822
                                                                                                                      // 823
Cursor.prototype.getTransform = function () {                                                                         // 824
  return this._cursorDescription.options.transform;                                                                   // 825
};                                                                                                                    // 826
                                                                                                                      // 827
// When you call Meteor.publish() with a function that returns a Cursor, we need                                      // 828
// to transmute it into the equivalent subscription.  This is the function that                                       // 829
// does that.                                                                                                         // 830
                                                                                                                      // 831
Cursor.prototype._publishCursor = function (sub) {                                                                    // 832
  var self = this;                                                                                                    // 833
  var collection = self._cursorDescription.collectionName;                                                            // 834
  return Mongo.Collection._publishCursor(self, sub, collection);                                                      // 835
};                                                                                                                    // 836
                                                                                                                      // 837
// Used to guarantee that publish functions return at most one cursor per                                             // 838
// collection. Private, because we might later have cursors that include                                              // 839
// documents from multiple collections somehow.                                                                       // 840
Cursor.prototype._getCollectionName = function () {                                                                   // 841
  var self = this;                                                                                                    // 842
  return self._cursorDescription.collectionName;                                                                      // 843
}                                                                                                                     // 844
                                                                                                                      // 845
Cursor.prototype.observe = function (callbacks) {                                                                     // 846
  var self = this;                                                                                                    // 847
  return LocalCollection._observeFromObserveChanges(self, callbacks);                                                 // 848
};                                                                                                                    // 849
                                                                                                                      // 850
Cursor.prototype.observeChanges = function (callbacks) {                                                              // 851
  var self = this;                                                                                                    // 852
  var ordered = LocalCollection._observeChangesCallbacksAreOrdered(callbacks);                                        // 853
  return self._mongo._observeChanges(                                                                                 // 854
    self._cursorDescription, ordered, callbacks);                                                                     // 855
};                                                                                                                    // 856
                                                                                                                      // 857
MongoConnection.prototype._createSynchronousCursor = function(                                                        // 858
    cursorDescription, options) {                                                                                     // 859
  var self = this;                                                                                                    // 860
  options = _.pick(options || {}, 'selfForIteration', 'useTransform');                                                // 861
                                                                                                                      // 862
  var collection = self.rawCollection(cursorDescription.collectionName);                                              // 863
  var cursorOptions = cursorDescription.options;                                                                      // 864
  var mongoOptions = {                                                                                                // 865
    sort: cursorOptions.sort,                                                                                         // 866
    limit: cursorOptions.limit,                                                                                       // 867
    skip: cursorOptions.skip                                                                                          // 868
  };                                                                                                                  // 869
                                                                                                                      // 870
  // Do we want a tailable cursor (which only works on capped collections)?                                           // 871
  if (cursorOptions.tailable) {                                                                                       // 872
    // We want a tailable cursor...                                                                                   // 873
    mongoOptions.tailable = true;                                                                                     // 874
    // ... and for the server to wait a bit if any getMore has no data (rather                                        // 875
    // than making us put the relevant sleeps in the client)...                                                       // 876
    mongoOptions.awaitdata = true;                                                                                    // 877
    // ... and to keep querying the server indefinitely rather than just 5 times                                      // 878
    // if there's no more data.                                                                                       // 879
    mongoOptions.numberOfRetries = -1;                                                                                // 880
    // And if this is on the oplog collection and the cursor specifies a 'ts',                                        // 881
    // then set the undocumented oplog replay flag, which does a special scan to                                      // 882
    // find the first document (instead of creating an index on ts). This is a                                        // 883
    // very hard-coded Mongo flag which only works on the oplog collection and                                        // 884
    // only works with the ts field.                                                                                  // 885
    if (cursorDescription.collectionName === OPLOG_COLLECTION &&                                                      // 886
        cursorDescription.selector.ts) {                                                                              // 887
      mongoOptions.oplogReplay = true;                                                                                // 888
    }                                                                                                                 // 889
  }                                                                                                                   // 890
                                                                                                                      // 891
  var dbCursor = collection.find(                                                                                     // 892
    replaceTypes(cursorDescription.selector, replaceMeteorAtomWithMongo),                                             // 893
    cursorOptions.fields, mongoOptions);                                                                              // 894
                                                                                                                      // 895
  return new SynchronousCursor(dbCursor, cursorDescription, options);                                                 // 896
};                                                                                                                    // 897
                                                                                                                      // 898
var SynchronousCursor = function (dbCursor, cursorDescription, options) {                                             // 899
  var self = this;                                                                                                    // 900
  options = _.pick(options || {}, 'selfForIteration', 'useTransform');                                                // 901
                                                                                                                      // 902
  self._dbCursor = dbCursor;                                                                                          // 903
  self._cursorDescription = cursorDescription;                                                                        // 904
  // The "self" argument passed to forEach/map callbacks. If we're wrapped                                            // 905
  // inside a user-visible Cursor, we want to provide the outer cursor!                                               // 906
  self._selfForIteration = options.selfForIteration || self;                                                          // 907
  if (options.useTransform && cursorDescription.options.transform) {                                                  // 908
    self._transform = LocalCollection.wrapTransform(                                                                  // 909
      cursorDescription.options.transform);                                                                           // 910
  } else {                                                                                                            // 911
    self._transform = null;                                                                                           // 912
  }                                                                                                                   // 913
                                                                                                                      // 914
  // Need to specify that the callback is the first argument to nextObject,                                           // 915
  // since otherwise when we try to call it with no args the driver will                                              // 916
  // interpret "undefined" first arg as an options hash and crash.                                                    // 917
  self._synchronousNextObject = Future.wrap(                                                                          // 918
    dbCursor.nextObject.bind(dbCursor), 0);                                                                           // 919
  self._synchronousCount = Future.wrap(dbCursor.count.bind(dbCursor));                                                // 920
  self._visitedIds = new LocalCollection._IdMap;                                                                      // 921
};                                                                                                                    // 922
                                                                                                                      // 923
_.extend(SynchronousCursor.prototype, {                                                                               // 924
  _nextObject: function () {                                                                                          // 925
    var self = this;                                                                                                  // 926
                                                                                                                      // 927
    while (true) {                                                                                                    // 928
      var doc = self._synchronousNextObject().wait();                                                                 // 929
                                                                                                                      // 930
      if (!doc) return null;                                                                                          // 931
      doc = replaceTypes(doc, replaceMongoAtomWithMeteor);                                                            // 932
                                                                                                                      // 933
      if (!self._cursorDescription.options.tailable && _.has(doc, '_id')) {                                           // 934
        // Did Mongo give us duplicate documents in the same cursor? If so,                                           // 935
        // ignore this one. (Do this before the transform, since transform might                                      // 936
        // return some unrelated value.) We don't do this for tailable cursors,                                       // 937
        // because we want to maintain O(1) memory usage. And if there isn't _id                                      // 938
        // for some reason (maybe it's the oplog), then we don't do this either.                                      // 939
        // (Be careful to do this for falsey but existing _id, though.)                                               // 940
        if (self._visitedIds.has(doc._id)) continue;                                                                  // 941
        self._visitedIds.set(doc._id, true);                                                                          // 942
      }                                                                                                               // 943
                                                                                                                      // 944
      if (self._transform)                                                                                            // 945
        doc = self._transform(doc);                                                                                   // 946
                                                                                                                      // 947
      return doc;                                                                                                     // 948
    }                                                                                                                 // 949
  },                                                                                                                  // 950
                                                                                                                      // 951
  forEach: function (callback, thisArg) {                                                                             // 952
    var self = this;                                                                                                  // 953
                                                                                                                      // 954
    // Get back to the beginning.                                                                                     // 955
    self._rewind();                                                                                                   // 956
                                                                                                                      // 957
    // We implement the loop ourself instead of using self._dbCursor.each,                                            // 958
    // because "each" will call its callback outside of a fiber which makes it                                        // 959
    // much more complex to make this function synchronous.                                                           // 960
    var index = 0;                                                                                                    // 961
    while (true) {                                                                                                    // 962
      var doc = self._nextObject();                                                                                   // 963
      if (!doc) return;                                                                                               // 964
      callback.call(thisArg, doc, index++, self._selfForIteration);                                                   // 965
    }                                                                                                                 // 966
  },                                                                                                                  // 967
                                                                                                                      // 968
  // XXX Allow overlapping callback executions if callback yields.                                                    // 969
  map: function (callback, thisArg) {                                                                                 // 970
    var self = this;                                                                                                  // 971
    var res = [];                                                                                                     // 972
    self.forEach(function (doc, index) {                                                                              // 973
      res.push(callback.call(thisArg, doc, index, self._selfForIteration));                                           // 974
    });                                                                                                               // 975
    return res;                                                                                                       // 976
  },                                                                                                                  // 977
                                                                                                                      // 978
  _rewind: function () {                                                                                              // 979
    var self = this;                                                                                                  // 980
                                                                                                                      // 981
    // known to be synchronous                                                                                        // 982
    self._dbCursor.rewind();                                                                                          // 983
                                                                                                                      // 984
    self._visitedIds = new LocalCollection._IdMap;                                                                    // 985
  },                                                                                                                  // 986
                                                                                                                      // 987
  // Mostly usable for tailable cursors.                                                                              // 988
  close: function () {                                                                                                // 989
    var self = this;                                                                                                  // 990
                                                                                                                      // 991
    self._dbCursor.close();                                                                                           // 992
  },                                                                                                                  // 993
                                                                                                                      // 994
  fetch: function () {                                                                                                // 995
    var self = this;                                                                                                  // 996
    return self.map(_.identity);                                                                                      // 997
  },                                                                                                                  // 998
                                                                                                                      // 999
  count: function () {                                                                                                // 1000
    var self = this;                                                                                                  // 1001
    return self._synchronousCount().wait();                                                                           // 1002
  },                                                                                                                  // 1003
                                                                                                                      // 1004
  // This method is NOT wrapped in Cursor.                                                                            // 1005
  getRawObjects: function (ordered) {                                                                                 // 1006
    var self = this;                                                                                                  // 1007
    if (ordered) {                                                                                                    // 1008
      return self.fetch();                                                                                            // 1009
    } else {                                                                                                          // 1010
      var results = new LocalCollection._IdMap;                                                                       // 1011
      self.forEach(function (doc) {                                                                                   // 1012
        results.set(doc._id, doc);                                                                                    // 1013
      });                                                                                                             // 1014
      return results;                                                                                                 // 1015
    }                                                                                                                 // 1016
  }                                                                                                                   // 1017
});                                                                                                                   // 1018
                                                                                                                      // 1019
MongoConnection.prototype.tail = function (cursorDescription, docCallback) {                                          // 1020
  var self = this;                                                                                                    // 1021
  if (!cursorDescription.options.tailable)                                                                            // 1022
    throw new Error("Can only tail a tailable cursor");                                                               // 1023
                                                                                                                      // 1024
  var cursor = self._createSynchronousCursor(cursorDescription);                                                      // 1025
                                                                                                                      // 1026
  var stopped = false;                                                                                                // 1027
  var lastTS = undefined;                                                                                             // 1028
  var loop = function () {                                                                                            // 1029
    while (true) {                                                                                                    // 1030
      if (stopped)                                                                                                    // 1031
        return;                                                                                                       // 1032
      try {                                                                                                           // 1033
        var doc = cursor._nextObject();                                                                               // 1034
      } catch (err) {                                                                                                 // 1035
        // There's no good way to figure out if this was actually an error                                            // 1036
        // from Mongo. Ah well. But either way, we need to retry the cursor                                           // 1037
        // (unless the failure was because the observe got stopped).                                                  // 1038
        doc = null;                                                                                                   // 1039
      }                                                                                                               // 1040
      // Since cursor._nextObject can yield, we need to check again to see if                                         // 1041
      // we've been stopped before calling the callback.                                                              // 1042
      if (stopped)                                                                                                    // 1043
        return;                                                                                                       // 1044
      if (doc) {                                                                                                      // 1045
        // If a tailable cursor contains a "ts" field, use it to recreate the                                         // 1046
        // cursor on error. ("ts" is a standard that Mongo uses internally for                                        // 1047
        // the oplog, and there's a special flag that lets you do binary search                                       // 1048
        // on it instead of needing to use an index.)                                                                 // 1049
        lastTS = doc.ts;                                                                                              // 1050
        docCallback(doc);                                                                                             // 1051
      } else {                                                                                                        // 1052
        var newSelector = _.clone(cursorDescription.selector);                                                        // 1053
        if (lastTS) {                                                                                                 // 1054
          newSelector.ts = {$gt: lastTS};                                                                             // 1055
        }                                                                                                             // 1056
        cursor = self._createSynchronousCursor(new CursorDescription(                                                 // 1057
          cursorDescription.collectionName,                                                                           // 1058
          newSelector,                                                                                                // 1059
          cursorDescription.options));                                                                                // 1060
        // Mongo failover takes many seconds.  Retry in a bit.  (Without this                                         // 1061
        // setTimeout, we peg the CPU at 100% and never notice the actual                                             // 1062
        // failover.                                                                                                  // 1063
        Meteor.setTimeout(loop, 100);                                                                                 // 1064
        break;                                                                                                        // 1065
      }                                                                                                               // 1066
    }                                                                                                                 // 1067
  };                                                                                                                  // 1068
                                                                                                                      // 1069
  Meteor.defer(loop);                                                                                                 // 1070
                                                                                                                      // 1071
  return {                                                                                                            // 1072
    stop: function () {                                                                                               // 1073
      stopped = true;                                                                                                 // 1074
      cursor.close();                                                                                                 // 1075
    }                                                                                                                 // 1076
  };                                                                                                                  // 1077
};                                                                                                                    // 1078
                                                                                                                      // 1079
MongoConnection.prototype._observeChanges = function (                                                                // 1080
    cursorDescription, ordered, callbacks) {                                                                          // 1081
  var self = this;                                                                                                    // 1082
                                                                                                                      // 1083
  if (cursorDescription.options.tailable) {                                                                           // 1084
    return self._observeChangesTailable(cursorDescription, ordered, callbacks);                                       // 1085
  }                                                                                                                   // 1086
                                                                                                                      // 1087
  // You may not filter out _id when observing changes, because the id is a core                                      // 1088
  // part of the observeChanges API.                                                                                  // 1089
  if (cursorDescription.options.fields &&                                                                             // 1090
      (cursorDescription.options.fields._id === 0 ||                                                                  // 1091
       cursorDescription.options.fields._id === false)) {                                                             // 1092
    throw Error("You may not observe a cursor with {fields: {_id: 0}}");                                              // 1093
  }                                                                                                                   // 1094
                                                                                                                      // 1095
  var observeKey = JSON.stringify(                                                                                    // 1096
    _.extend({ordered: ordered}, cursorDescription));                                                                 // 1097
                                                                                                                      // 1098
  var multiplexer, observeDriver;                                                                                     // 1099
  var firstHandle = false;                                                                                            // 1100
                                                                                                                      // 1101
  // Find a matching ObserveMultiplexer, or create a new one. This next block is                                      // 1102
  // guaranteed to not yield (and it doesn't call anything that can observe a                                         // 1103
  // new query), so no other calls to this function can interleave with it.                                           // 1104
  Meteor._noYieldsAllowed(function () {                                                                               // 1105
    if (_.has(self._observeMultiplexers, observeKey)) {                                                               // 1106
      multiplexer = self._observeMultiplexers[observeKey];                                                            // 1107
    } else {                                                                                                          // 1108
      firstHandle = true;                                                                                             // 1109
      // Create a new ObserveMultiplexer.                                                                             // 1110
      multiplexer = new ObserveMultiplexer({                                                                          // 1111
        ordered: ordered,                                                                                             // 1112
        onStop: function () {                                                                                         // 1113
          delete self._observeMultiplexers[observeKey];                                                               // 1114
          observeDriver.stop();                                                                                       // 1115
        }                                                                                                             // 1116
      });                                                                                                             // 1117
      self._observeMultiplexers[observeKey] = multiplexer;                                                            // 1118
    }                                                                                                                 // 1119
  });                                                                                                                 // 1120
                                                                                                                      // 1121
  var observeHandle = new ObserveHandle(multiplexer, callbacks);                                                      // 1122
                                                                                                                      // 1123
  if (firstHandle) {                                                                                                  // 1124
    var matcher, sorter;                                                                                              // 1125
    var canUseOplog = _.all([                                                                                         // 1126
      function () {                                                                                                   // 1127
        // At a bare minimum, using the oplog requires us to have an oplog, to                                        // 1128
        // want unordered callbacks, and to not want a callback on the polls                                          // 1129
        // that won't happen.                                                                                         // 1130
        return self._oplogHandle && !ordered &&                                                                       // 1131
          !callbacks._testOnlyPollCallback;                                                                           // 1132
      }, function () {                                                                                                // 1133
        // We need to be able to compile the selector. Fall back to polling for                                       // 1134
        // some newfangled $selector that minimongo doesn't support yet.                                              // 1135
        try {                                                                                                         // 1136
          matcher = new Minimongo.Matcher(cursorDescription.selector);                                                // 1137
          return true;                                                                                                // 1138
        } catch (e) {                                                                                                 // 1139
          // XXX make all compilation errors MinimongoError or something                                              // 1140
          //     so that this doesn't ignore unrelated exceptions                                                     // 1141
          return false;                                                                                               // 1142
        }                                                                                                             // 1143
      }, function () {                                                                                                // 1144
        // ... and the selector itself needs to support oplog.                                                        // 1145
        return OplogObserveDriver.cursorSupported(cursorDescription, matcher);                                        // 1146
      }, function () {                                                                                                // 1147
        // And we need to be able to compile the sort, if any.  eg, can't be                                          // 1148
        // {$natural: 1}.                                                                                             // 1149
        if (!cursorDescription.options.sort)                                                                          // 1150
          return true;                                                                                                // 1151
        try {                                                                                                         // 1152
          sorter = new Minimongo.Sorter(cursorDescription.options.sort,                                               // 1153
                                        { matcher: matcher });                                                        // 1154
          return true;                                                                                                // 1155
        } catch (e) {                                                                                                 // 1156
          // XXX make all compilation errors MinimongoError or something                                              // 1157
          //     so that this doesn't ignore unrelated exceptions                                                     // 1158
          return false;                                                                                               // 1159
        }                                                                                                             // 1160
      }], function (f) { return f(); });  // invoke each function                                                     // 1161
                                                                                                                      // 1162
    var driverClass = canUseOplog ? OplogObserveDriver : PollingObserveDriver;                                        // 1163
    observeDriver = new driverClass({                                                                                 // 1164
      cursorDescription: cursorDescription,                                                                           // 1165
      mongoHandle: self,                                                                                              // 1166
      multiplexer: multiplexer,                                                                                       // 1167
      ordered: ordered,                                                                                               // 1168
      matcher: matcher,  // ignored by polling                                                                        // 1169
      sorter: sorter,  // ignored by polling                                                                          // 1170
      _testOnlyPollCallback: callbacks._testOnlyPollCallback                                                          // 1171
    });                                                                                                               // 1172
                                                                                                                      // 1173
    // This field is only set for use in tests.                                                                       // 1174
    multiplexer._observeDriver = observeDriver;                                                                       // 1175
  }                                                                                                                   // 1176
                                                                                                                      // 1177
  // Blocks until the initial adds have been sent.                                                                    // 1178
  multiplexer.addHandleAndSendInitialAdds(observeHandle);                                                             // 1179
                                                                                                                      // 1180
  return observeHandle;                                                                                               // 1181
};                                                                                                                    // 1182
                                                                                                                      // 1183
// Listen for the invalidation messages that will trigger us to poll the                                              // 1184
// database for changes. If this selector specifies specific IDs, specify them                                        // 1185
// here, so that updates to different specific IDs don't cause us to poll.                                            // 1186
// listenCallback is the same kind of (notification, complete) callback passed                                        // 1187
// to InvalidationCrossbar.listen.                                                                                    // 1188
                                                                                                                      // 1189
listenAll = function (cursorDescription, listenCallback) {                                                            // 1190
  var listeners = [];                                                                                                 // 1191
  forEachTrigger(cursorDescription, function (trigger) {                                                              // 1192
    listeners.push(DDPServer._InvalidationCrossbar.listen(                                                            // 1193
      trigger, listenCallback));                                                                                      // 1194
  });                                                                                                                 // 1195
                                                                                                                      // 1196
  return {                                                                                                            // 1197
    stop: function () {                                                                                               // 1198
      _.each(listeners, function (listener) {                                                                         // 1199
        listener.stop();                                                                                              // 1200
      });                                                                                                             // 1201
    }                                                                                                                 // 1202
  };                                                                                                                  // 1203
};                                                                                                                    // 1204
                                                                                                                      // 1205
forEachTrigger = function (cursorDescription, triggerCallback) {                                                      // 1206
  var key = {collection: cursorDescription.collectionName};                                                           // 1207
  var specificIds = LocalCollection._idsMatchedBySelector(                                                            // 1208
    cursorDescription.selector);                                                                                      // 1209
  if (specificIds) {                                                                                                  // 1210
    _.each(specificIds, function (id) {                                                                               // 1211
      triggerCallback(_.extend({id: id}, key));                                                                       // 1212
    });                                                                                                               // 1213
    triggerCallback(_.extend({dropCollection: true, id: null}, key));                                                 // 1214
  } else {                                                                                                            // 1215
    triggerCallback(key);                                                                                             // 1216
  }                                                                                                                   // 1217
};                                                                                                                    // 1218
                                                                                                                      // 1219
// observeChanges for tailable cursors on capped collections.                                                         // 1220
//                                                                                                                    // 1221
// Some differences from normal cursors:                                                                              // 1222
//   - Will never produce anything other than 'added' or 'addedBefore'. If you                                        // 1223
//     do update a document that has already been produced, this will not notice                                      // 1224
//     it.                                                                                                            // 1225
//   - If you disconnect and reconnect from Mongo, it will essentially restart                                        // 1226
//     the query, which will lead to duplicate results. This is pretty bad,                                           // 1227
//     but if you include a field called 'ts' which is inserted as                                                    // 1228
//     new MongoInternals.MongoTimestamp(0, 0) (which is initialized to the                                           // 1229
//     current Mongo-style timestamp), we'll be able to find the place to                                             // 1230
//     restart properly. (This field is specifically understood by Mongo with an                                      // 1231
//     optimization which allows it to find the right place to start without                                          // 1232
//     an index on ts. It's how the oplog works.)                                                                     // 1233
//   - No callbacks are triggered synchronously with the call (there's no                                             // 1234
//     differentiation between "initial data" and "later changes"; everything                                         // 1235
//     that matches the query gets sent asynchronously).                                                              // 1236
//   - De-duplication is not implemented.                                                                             // 1237
//   - Does not yet interact with the write fence. Probably, this should work by                                      // 1238
//     ignoring removes (which don't work on capped collections) and updates                                          // 1239
//     (which don't affect tailable cursors), and just keeping track of the ID                                        // 1240
//     of the inserted object, and closing the write fence once you get to that                                       // 1241
//     ID (or timestamp?).  This doesn't work well if the document doesn't match                                      // 1242
//     the query, though.  On the other hand, the write fence can close                                               // 1243
//     immediately if it does not match the query. So if we trust minimongo                                           // 1244
//     enough to accurately evaluate the query against the write fence, we                                            // 1245
//     should be able to do this...  Of course, minimongo doesn't even support                                        // 1246
//     Mongo Timestamps yet.                                                                                          // 1247
MongoConnection.prototype._observeChangesTailable = function (                                                        // 1248
    cursorDescription, ordered, callbacks) {                                                                          // 1249
  var self = this;                                                                                                    // 1250
                                                                                                                      // 1251
  // Tailable cursors only ever call added/addedBefore callbacks, so it's an                                          // 1252
  // error if you didn't provide them.                                                                                // 1253
  if ((ordered && !callbacks.addedBefore) ||                                                                          // 1254
      (!ordered && !callbacks.added)) {                                                                               // 1255
    throw new Error("Can't observe an " + (ordered ? "ordered" : "unordered")                                         // 1256
                    + " tailable cursor without a "                                                                   // 1257
                    + (ordered ? "addedBefore" : "added") + " callback");                                             // 1258
  }                                                                                                                   // 1259
                                                                                                                      // 1260
  return self.tail(cursorDescription, function (doc) {                                                                // 1261
    var id = doc._id;                                                                                                 // 1262
    delete doc._id;                                                                                                   // 1263
    // The ts is an implementation detail. Hide it.                                                                   // 1264
    delete doc.ts;                                                                                                    // 1265
    if (ordered) {                                                                                                    // 1266
      callbacks.addedBefore(id, doc, null);                                                                           // 1267
    } else {                                                                                                          // 1268
      callbacks.added(id, doc);                                                                                       // 1269
    }                                                                                                                 // 1270
  });                                                                                                                 // 1271
};                                                                                                                    // 1272
                                                                                                                      // 1273
// XXX We probably need to find a better way to expose this. Right now                                                // 1274
// it's only used by tests, but in fact you need it in normal                                                         // 1275
// operation to interact with capped collections.                                                                     // 1276
MongoInternals.MongoTimestamp = MongoDB.Timestamp;                                                                    // 1277
                                                                                                                      // 1278
MongoInternals.Connection = MongoConnection;                                                                          // 1279
                                                                                                                      // 1280
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/oplog_tailing.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Future = Npm.require('fibers/future');                                                                            // 1
                                                                                                                      // 2
OPLOG_COLLECTION = 'oplog.rs';                                                                                        // 3
                                                                                                                      // 4
var TOO_FAR_BEHIND = process.env.METEOR_OPLOG_TOO_FAR_BEHIND || 2000;                                                 // 5
                                                                                                                      // 6
// Like Perl's quotemeta: quotes all regexp metacharacters. See                                                       // 7
//   https://github.com/substack/quotemeta/blob/master/index.js                                                       // 8
// XXX this is duplicated with accounts_server.js                                                                     // 9
var quotemeta = function (str) {                                                                                      // 10
    return String(str).replace(/(\W)/g, '\\$1');                                                                      // 11
};                                                                                                                    // 12
                                                                                                                      // 13
var showTS = function (ts) {                                                                                          // 14
  return "Timestamp(" + ts.getHighBits() + ", " + ts.getLowBits() + ")";                                              // 15
};                                                                                                                    // 16
                                                                                                                      // 17
idForOp = function (op) {                                                                                             // 18
  if (op.op === 'd')                                                                                                  // 19
    return op.o._id;                                                                                                  // 20
  else if (op.op === 'i')                                                                                             // 21
    return op.o._id;                                                                                                  // 22
  else if (op.op === 'u')                                                                                             // 23
    return op.o2._id;                                                                                                 // 24
  else if (op.op === 'c')                                                                                             // 25
    throw Error("Operator 'c' doesn't supply an object with id: " +                                                   // 26
                EJSON.stringify(op));                                                                                 // 27
  else                                                                                                                // 28
    throw Error("Unknown op: " + EJSON.stringify(op));                                                                // 29
};                                                                                                                    // 30
                                                                                                                      // 31
OplogHandle = function (oplogUrl, dbName) {                                                                           // 32
  var self = this;                                                                                                    // 33
  self._oplogUrl = oplogUrl;                                                                                          // 34
  self._dbName = dbName;                                                                                              // 35
                                                                                                                      // 36
  self._oplogLastEntryConnection = null;                                                                              // 37
  self._oplogTailConnection = null;                                                                                   // 38
  self._stopped = false;                                                                                              // 39
  self._tailHandle = null;                                                                                            // 40
  self._readyFuture = new Future();                                                                                   // 41
  self._crossbar = new DDPServer._Crossbar({                                                                          // 42
    factPackage: "mongo-livedata", factName: "oplog-watchers"                                                         // 43
  });                                                                                                                 // 44
  self._baseOplogSelector = {                                                                                         // 45
    ns: new RegExp('^' + quotemeta(self._dbName) + '\\.'),                                                            // 46
    $or: [                                                                                                            // 47
      { op: {$in: ['i', 'u', 'd']} },                                                                                 // 48
      // If it is not db.collection.drop(), ignore it                                                                 // 49
      { op: 'c', 'o.drop': { $exists: true } }]                                                                       // 50
  };                                                                                                                  // 51
                                                                                                                      // 52
  // Data structures to support waitUntilCaughtUp(). Each oplog entry has a                                           // 53
  // MongoTimestamp object on it (which is not the same as a Date --- it's a                                          // 54
  // combination of time and an incrementing counter; see                                                             // 55
  // http://docs.mongodb.org/manual/reference/bson-types/#timestamps).                                                // 56
  //                                                                                                                  // 57
  // _catchingUpFutures is an array of {ts: MongoTimestamp, future: Future}                                           // 58
  // objects, sorted by ascending timestamp. _lastProcessedTS is the                                                  // 59
  // MongoTimestamp of the last oplog entry we've processed.                                                          // 60
  //                                                                                                                  // 61
  // Each time we call waitUntilCaughtUp, we take a peek at the final oplog                                           // 62
  // entry in the db.  If we've already processed it (ie, it is not greater than                                      // 63
  // _lastProcessedTS), waitUntilCaughtUp immediately returns. Otherwise,                                             // 64
  // waitUntilCaughtUp makes a new Future and inserts it along with the final                                         // 65
  // timestamp entry that it read, into _catchingUpFutures. waitUntilCaughtUp                                         // 66
  // then waits on that future, which is resolved once _lastProcessedTS is                                            // 67
  // incremented to be past its timestamp by the worker fiber.                                                        // 68
  //                                                                                                                  // 69
  // XXX use a priority queue or something else that's faster than an array                                           // 70
  self._catchingUpFutures = [];                                                                                       // 71
  self._lastProcessedTS = null;                                                                                       // 72
                                                                                                                      // 73
  self._onSkippedEntriesHook = new Hook({                                                                             // 74
    debugPrintExceptions: "onSkippedEntries callback"                                                                 // 75
  });                                                                                                                 // 76
                                                                                                                      // 77
  self._entryQueue = new Meteor._DoubleEndedQueue();                                                                  // 78
  self._workerActive = false;                                                                                         // 79
                                                                                                                      // 80
  self._startTailing();                                                                                               // 81
};                                                                                                                    // 82
                                                                                                                      // 83
_.extend(OplogHandle.prototype, {                                                                                     // 84
  stop: function () {                                                                                                 // 85
    var self = this;                                                                                                  // 86
    if (self._stopped)                                                                                                // 87
      return;                                                                                                         // 88
    self._stopped = true;                                                                                             // 89
    if (self._tailHandle)                                                                                             // 90
      self._tailHandle.stop();                                                                                        // 91
    // XXX should close connections too                                                                               // 92
  },                                                                                                                  // 93
  onOplogEntry: function (trigger, callback) {                                                                        // 94
    var self = this;                                                                                                  // 95
    if (self._stopped)                                                                                                // 96
      throw new Error("Called onOplogEntry on stopped handle!");                                                      // 97
                                                                                                                      // 98
    // Calling onOplogEntry requires us to wait for the tailing to be ready.                                          // 99
    self._readyFuture.wait();                                                                                         // 100
                                                                                                                      // 101
    var originalCallback = callback;                                                                                  // 102
    callback = Meteor.bindEnvironment(function (notification) {                                                       // 103
      // XXX can we avoid this clone by making oplog.js careful?                                                      // 104
      originalCallback(EJSON.clone(notification));                                                                    // 105
    }, function (err) {                                                                                               // 106
      Meteor._debug("Error in oplog callback", err.stack);                                                            // 107
    });                                                                                                               // 108
    var listenHandle = self._crossbar.listen(trigger, callback);                                                      // 109
    return {                                                                                                          // 110
      stop: function () {                                                                                             // 111
        listenHandle.stop();                                                                                          // 112
      }                                                                                                               // 113
    };                                                                                                                // 114
  },                                                                                                                  // 115
  // Register a callback to be invoked any time we skip oplog entries (eg,                                            // 116
  // because we are too far behind).                                                                                  // 117
  onSkippedEntries: function (callback) {                                                                             // 118
    var self = this;                                                                                                  // 119
    if (self._stopped)                                                                                                // 120
      throw new Error("Called onSkippedEntries on stopped handle!");                                                  // 121
    return self._onSkippedEntriesHook.register(callback);                                                             // 122
  },                                                                                                                  // 123
  // Calls `callback` once the oplog has been processed up to a point that is                                         // 124
  // roughly "now": specifically, once we've processed all ops that are                                               // 125
  // currently visible.                                                                                               // 126
  // XXX become convinced that this is actually safe even if oplogConnection                                          // 127
  // is some kind of pool                                                                                             // 128
  waitUntilCaughtUp: function () {                                                                                    // 129
    var self = this;                                                                                                  // 130
    if (self._stopped)                                                                                                // 131
      throw new Error("Called waitUntilCaughtUp on stopped handle!");                                                 // 132
                                                                                                                      // 133
    // Calling waitUntilCaughtUp requries us to wait for the oplog connection to                                      // 134
    // be ready.                                                                                                      // 135
    self._readyFuture.wait();                                                                                         // 136
                                                                                                                      // 137
    while (!self._stopped) {                                                                                          // 138
      // We need to make the selector at least as restrictive as the actual                                           // 139
      // tailing selector (ie, we need to specify the DB name) or else we might                                       // 140
      // find a TS that won't show up in the actual tail stream.                                                      // 141
      try {                                                                                                           // 142
        var lastEntry = self._oplogLastEntryConnection.findOne(                                                       // 143
          OPLOG_COLLECTION, self._baseOplogSelector,                                                                  // 144
          {fields: {ts: 1}, sort: {$natural: -1}});                                                                   // 145
        break;                                                                                                        // 146
      } catch (e) {                                                                                                   // 147
        // During failover (eg) if we get an exception we should log and retry                                        // 148
        // instead of crashing.                                                                                       // 149
        Meteor._debug("Got exception while reading last entry: " + e);                                                // 150
        Meteor._sleepForMs(100);                                                                                      // 151
      }                                                                                                               // 152
    }                                                                                                                 // 153
                                                                                                                      // 154
    if (self._stopped)                                                                                                // 155
      return;                                                                                                         // 156
                                                                                                                      // 157
    if (!lastEntry) {                                                                                                 // 158
      // Really, nothing in the oplog? Well, we've processed everything.                                              // 159
      return;                                                                                                         // 160
    }                                                                                                                 // 161
                                                                                                                      // 162
    var ts = lastEntry.ts;                                                                                            // 163
    if (!ts)                                                                                                          // 164
      throw Error("oplog entry without ts: " + EJSON.stringify(lastEntry));                                           // 165
                                                                                                                      // 166
    if (self._lastProcessedTS && ts.lessThanOrEqual(self._lastProcessedTS)) {                                         // 167
      // We've already caught up to here.                                                                             // 168
      return;                                                                                                         // 169
    }                                                                                                                 // 170
                                                                                                                      // 171
                                                                                                                      // 172
    // Insert the future into our list. Almost always, this will be at the end,                                       // 173
    // but it's conceivable that if we fail over from one primary to another,                                         // 174
    // the oplog entries we see will go backwards.                                                                    // 175
    var insertAfter = self._catchingUpFutures.length;                                                                 // 176
    while (insertAfter - 1 > 0                                                                                        // 177
           && self._catchingUpFutures[insertAfter - 1].ts.greaterThan(ts)) {                                          // 178
      insertAfter--;                                                                                                  // 179
    }                                                                                                                 // 180
    var f = new Future;                                                                                               // 181
    self._catchingUpFutures.splice(insertAfter, 0, {ts: ts, future: f});                                              // 182
    f.wait();                                                                                                         // 183
  },                                                                                                                  // 184
  _startTailing: function () {                                                                                        // 185
    var self = this;                                                                                                  // 186
    // First, make sure that we're talking to the local database.                                                     // 187
    var mongodbUri = Npm.require('mongodb-uri');                                                                      // 188
    if (mongodbUri.parse(self._oplogUrl).database !== 'local') {                                                      // 189
      throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " +                                        // 190
                  "a Mongo replica set");                                                                             // 191
    }                                                                                                                 // 192
                                                                                                                      // 193
    // We make two separate connections to Mongo. The Node Mongo driver                                               // 194
    // implements a naive round-robin connection pool: each "connection" is a                                         // 195
    // pool of several (5 by default) TCP connections, and each request is                                            // 196
    // rotated through the pools. Tailable cursor queries block on the server                                         // 197
    // until there is some data to return (or until a few seconds have                                                // 198
    // passed). So if the connection pool used for tailing cursors is the same                                        // 199
    // pool used for other queries, the other queries will be delayed by seconds                                      // 200
    // 1/5 of the time.                                                                                               // 201
    //                                                                                                                // 202
    // The tail connection will only ever be running a single tail command, so                                        // 203
    // it only needs to make one underlying TCP connection.                                                           // 204
    self._oplogTailConnection = new MongoConnection(                                                                  // 205
      self._oplogUrl, {poolSize: 1});                                                                                 // 206
    // XXX better docs, but: it's to get monotonic results                                                            // 207
    // XXX is it safe to say "if there's an in flight query, just use its                                             // 208
    //     results"? I don't think so but should consider that                                                        // 209
    self._oplogLastEntryConnection = new MongoConnection(                                                             // 210
      self._oplogUrl, {poolSize: 1});                                                                                 // 211
                                                                                                                      // 212
    // Now, make sure that there actually is a repl set here. If not, oplog                                           // 213
    // tailing won't ever find anything!                                                                              // 214
    var f = new Future;                                                                                               // 215
    self._oplogLastEntryConnection.db.admin().command(                                                                // 216
      { ismaster: 1 }, f.resolver());                                                                                 // 217
    var isMasterDoc = f.wait();                                                                                       // 218
    if (!(isMasterDoc && isMasterDoc.documents && isMasterDoc.documents[0] &&                                         // 219
          isMasterDoc.documents[0].setName)) {                                                                        // 220
      throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " +                                        // 221
                  "a Mongo replica set");                                                                             // 222
    }                                                                                                                 // 223
                                                                                                                      // 224
    // Find the last oplog entry.                                                                                     // 225
    var lastOplogEntry = self._oplogLastEntryConnection.findOne(                                                      // 226
      OPLOG_COLLECTION, {}, {sort: {$natural: -1}, fields: {ts: 1}});                                                 // 227
                                                                                                                      // 228
    var oplogSelector = _.clone(self._baseOplogSelector);                                                             // 229
    if (lastOplogEntry) {                                                                                             // 230
      // Start after the last entry that currently exists.                                                            // 231
      oplogSelector.ts = {$gt: lastOplogEntry.ts};                                                                    // 232
      // If there are any calls to callWhenProcessedLatest before any other                                           // 233
      // oplog entries show up, allow callWhenProcessedLatest to call its                                             // 234
      // callback immediately.                                                                                        // 235
      self._lastProcessedTS = lastOplogEntry.ts;                                                                      // 236
    }                                                                                                                 // 237
                                                                                                                      // 238
    var cursorDescription = new CursorDescription(                                                                    // 239
      OPLOG_COLLECTION, oplogSelector, {tailable: true});                                                             // 240
                                                                                                                      // 241
    self._tailHandle = self._oplogTailConnection.tail(                                                                // 242
      cursorDescription, function (doc) {                                                                             // 243
        self._entryQueue.push(doc);                                                                                   // 244
        self._maybeStartWorker();                                                                                     // 245
      }                                                                                                               // 246
    );                                                                                                                // 247
    self._readyFuture.return();                                                                                       // 248
  },                                                                                                                  // 249
                                                                                                                      // 250
  _maybeStartWorker: function () {                                                                                    // 251
    var self = this;                                                                                                  // 252
    if (self._workerActive)                                                                                           // 253
      return;                                                                                                         // 254
    self._workerActive = true;                                                                                        // 255
    Meteor.defer(function () {                                                                                        // 256
      try {                                                                                                           // 257
        while (! self._stopped && ! self._entryQueue.isEmpty()) {                                                     // 258
          // Are we too far behind? Just tell our observers that they need to                                         // 259
          // repoll, and drop our queue.                                                                              // 260
          if (self._entryQueue.length > TOO_FAR_BEHIND) {                                                             // 261
            var lastEntry = self._entryQueue.pop();                                                                   // 262
            self._entryQueue.clear();                                                                                 // 263
                                                                                                                      // 264
            self._onSkippedEntriesHook.each(function (callback) {                                                     // 265
              callback();                                                                                             // 266
              return true;                                                                                            // 267
            });                                                                                                       // 268
                                                                                                                      // 269
            // Free any waitUntilCaughtUp() calls that were waiting for us to                                         // 270
            // pass something that we just skipped.                                                                   // 271
            self._setLastProcessedTS(lastEntry.ts);                                                                   // 272
            continue;                                                                                                 // 273
          }                                                                                                           // 274
                                                                                                                      // 275
          var doc = self._entryQueue.shift();                                                                         // 276
                                                                                                                      // 277
          if (!(doc.ns && doc.ns.length > self._dbName.length + 1 &&                                                  // 278
                doc.ns.substr(0, self._dbName.length + 1) ===                                                         // 279
                (self._dbName + '.'))) {                                                                              // 280
            throw new Error("Unexpected ns");                                                                         // 281
          }                                                                                                           // 282
                                                                                                                      // 283
          var trigger = {collection: doc.ns.substr(self._dbName.length + 1),                                          // 284
                         dropCollection: false,                                                                       // 285
                         op: doc};                                                                                    // 286
                                                                                                                      // 287
          // Is it a special command and the collection name is hidden somewhere                                      // 288
          // in operator?                                                                                             // 289
          if (trigger.collection === "$cmd") {                                                                        // 290
            trigger.collection = doc.o.drop;                                                                          // 291
            trigger.dropCollection = true;                                                                            // 292
            trigger.id = null;                                                                                        // 293
          } else {                                                                                                    // 294
            // All other ops have an id.                                                                              // 295
            trigger.id = idForOp(doc);                                                                                // 296
          }                                                                                                           // 297
                                                                                                                      // 298
          self._crossbar.fire(trigger);                                                                               // 299
                                                                                                                      // 300
          // Now that we've processed this operation, process pending                                                 // 301
          // sequencers.                                                                                              // 302
          if (!doc.ts)                                                                                                // 303
            throw Error("oplog entry without ts: " + EJSON.stringify(doc));                                           // 304
          self._setLastProcessedTS(doc.ts);                                                                           // 305
        }                                                                                                             // 306
      } finally {                                                                                                     // 307
        self._workerActive = false;                                                                                   // 308
      }                                                                                                               // 309
    });                                                                                                               // 310
  },                                                                                                                  // 311
  _setLastProcessedTS: function (ts) {                                                                                // 312
    var self = this;                                                                                                  // 313
    self._lastProcessedTS = ts;                                                                                       // 314
    while (!_.isEmpty(self._catchingUpFutures)                                                                        // 315
           && self._catchingUpFutures[0].ts.lessThanOrEqual(                                                          // 316
             self._lastProcessedTS)) {                                                                                // 317
      var sequencer = self._catchingUpFutures.shift();                                                                // 318
      sequencer.future.return();                                                                                      // 319
    }                                                                                                                 // 320
  }                                                                                                                   // 321
});                                                                                                                   // 322
                                                                                                                      // 323
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/observe_multiplex.js                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Future = Npm.require('fibers/future');                                                                            // 1
                                                                                                                      // 2
ObserveMultiplexer = function (options) {                                                                             // 3
  var self = this;                                                                                                    // 4
                                                                                                                      // 5
  if (!options || !_.has(options, 'ordered'))                                                                         // 6
    throw Error("must specified ordered");                                                                            // 7
                                                                                                                      // 8
  Package.facts && Package.facts.Facts.incrementServerFact(                                                           // 9
    "mongo-livedata", "observe-multiplexers", 1);                                                                     // 10
                                                                                                                      // 11
  self._ordered = options.ordered;                                                                                    // 12
  self._onStop = options.onStop || function () {};                                                                    // 13
  self._queue = new Meteor._SynchronousQueue();                                                                       // 14
  self._handles = {};                                                                                                 // 15
  self._readyFuture = new Future;                                                                                     // 16
  self._cache = new LocalCollection._CachingChangeObserver({                                                          // 17
    ordered: options.ordered});                                                                                       // 18
  // Number of addHandleAndSendInitialAdds tasks scheduled but not yet                                                // 19
  // running. removeHandle uses this to know if it's time to call the onStop                                          // 20
  // callback.                                                                                                        // 21
  self._addHandleTasksScheduledButNotPerformed = 0;                                                                   // 22
                                                                                                                      // 23
  _.each(self.callbackNames(), function (callbackName) {                                                              // 24
    self[callbackName] = function (/* ... */) {                                                                       // 25
      self._applyCallback(callbackName, _.toArray(arguments));                                                        // 26
    };                                                                                                                // 27
  });                                                                                                                 // 28
};                                                                                                                    // 29
                                                                                                                      // 30
_.extend(ObserveMultiplexer.prototype, {                                                                              // 31
  addHandleAndSendInitialAdds: function (handle) {                                                                    // 32
    var self = this;                                                                                                  // 33
                                                                                                                      // 34
    // Check this before calling runTask (even though runTask does the same                                           // 35
    // check) so that we don't leak an ObserveMultiplexer on error by                                                 // 36
    // incrementing _addHandleTasksScheduledButNotPerformed and never                                                 // 37
    // decrementing it.                                                                                               // 38
    if (!self._queue.safeToRunTask())                                                                                 // 39
      throw new Error(                                                                                                // 40
        "Can't call observeChanges from an observe callback on the same query");                                      // 41
    ++self._addHandleTasksScheduledButNotPerformed;                                                                   // 42
                                                                                                                      // 43
    Package.facts && Package.facts.Facts.incrementServerFact(                                                         // 44
      "mongo-livedata", "observe-handles", 1);                                                                        // 45
                                                                                                                      // 46
    self._queue.runTask(function () {                                                                                 // 47
      self._handles[handle._id] = handle;                                                                             // 48
      // Send out whatever adds we have so far (whether or not we the                                                 // 49
      // multiplexer is ready).                                                                                       // 50
      self._sendAdds(handle);                                                                                         // 51
      --self._addHandleTasksScheduledButNotPerformed;                                                                 // 52
    });                                                                                                               // 53
    // *outside* the task, since otherwise we'd deadlock                                                              // 54
    self._readyFuture.wait();                                                                                         // 55
  },                                                                                                                  // 56
                                                                                                                      // 57
  // Remove an observe handle. If it was the last observe handle, call the                                            // 58
  // onStop callback; you cannot add any more observe handles after this.                                             // 59
  //                                                                                                                  // 60
  // This is not synchronized with polls and handle additions: this means that                                        // 61
  // you can safely call it from within an observe callback, but it also means                                        // 62
  // that we have to be careful when we iterate over _handles.                                                        // 63
  removeHandle: function (id) {                                                                                       // 64
    var self = this;                                                                                                  // 65
                                                                                                                      // 66
    // This should not be possible: you can only call removeHandle by having                                          // 67
    // access to the ObserveHandle, which isn't returned to user code until the                                       // 68
    // multiplex is ready.                                                                                            // 69
    if (!self._ready())                                                                                               // 70
      throw new Error("Can't remove handles until the multiplex is ready");                                           // 71
                                                                                                                      // 72
    delete self._handles[id];                                                                                         // 73
                                                                                                                      // 74
    Package.facts && Package.facts.Facts.incrementServerFact(                                                         // 75
      "mongo-livedata", "observe-handles", -1);                                                                       // 76
                                                                                                                      // 77
    if (_.isEmpty(self._handles) &&                                                                                   // 78
        self._addHandleTasksScheduledButNotPerformed === 0) {                                                         // 79
      self._stop();                                                                                                   // 80
    }                                                                                                                 // 81
  },                                                                                                                  // 82
  _stop: function (options) {                                                                                         // 83
    var self = this;                                                                                                  // 84
    options = options || {};                                                                                          // 85
                                                                                                                      // 86
    // It shouldn't be possible for us to stop when all our handles still                                             // 87
    // haven't been returned from observeChanges!                                                                     // 88
    if (! self._ready() && ! options.fromQueryError)                                                                  // 89
      throw Error("surprising _stop: not ready");                                                                     // 90
                                                                                                                      // 91
    // Call stop callback (which kills the underlying process which sends us                                          // 92
    // callbacks and removes us from the connection's dictionary).                                                    // 93
    self._onStop();                                                                                                   // 94
    Package.facts && Package.facts.Facts.incrementServerFact(                                                         // 95
      "mongo-livedata", "observe-multiplexers", -1);                                                                  // 96
                                                                                                                      // 97
    // Cause future addHandleAndSendInitialAdds calls to throw (but the onStop                                        // 98
    // callback should make our connection forget about us).                                                          // 99
    self._handles = null;                                                                                             // 100
  },                                                                                                                  // 101
                                                                                                                      // 102
  // Allows all addHandleAndSendInitialAdds calls to return, once all preceding                                       // 103
  // adds have been processed. Does not block.                                                                        // 104
  ready: function () {                                                                                                // 105
    var self = this;                                                                                                  // 106
    self._queue.queueTask(function () {                                                                               // 107
      if (self._ready())                                                                                              // 108
        throw Error("can't make ObserveMultiplex ready twice!");                                                      // 109
      self._readyFuture.return();                                                                                     // 110
    });                                                                                                               // 111
  },                                                                                                                  // 112
                                                                                                                      // 113
  // If trying to execute the query results in an error, call this. This is                                           // 114
  // intended for permanent errors, not transient network errors that could be                                        // 115
  // fixed. It should only be called before ready(), because if you called ready                                      // 116
  // that meant that you managed to run the query once. It will stop this                                             // 117
  // ObserveMultiplex and cause addHandleAndSendInitialAdds calls (and thus                                           // 118
  // observeChanges calls) to throw the error.                                                                        // 119
  queryError: function (err) {                                                                                        // 120
    var self = this;                                                                                                  // 121
    self._queue.runTask(function () {                                                                                 // 122
      if (self._ready())                                                                                              // 123
        throw Error("can't claim query has an error after it worked!");                                               // 124
      self._stop({fromQueryError: true});                                                                             // 125
      self._readyFuture.throw(err);                                                                                   // 126
    });                                                                                                               // 127
  },                                                                                                                  // 128
                                                                                                                      // 129
  // Calls "cb" once the effects of all "ready", "addHandleAndSendInitialAdds"                                        // 130
  // and observe callbacks which came before this call have been propagated to                                        // 131
  // all handles. "ready" must have already been called on this multiplexer.                                          // 132
  onFlush: function (cb) {                                                                                            // 133
    var self = this;                                                                                                  // 134
    self._queue.queueTask(function () {                                                                               // 135
      if (!self._ready())                                                                                             // 136
        throw Error("only call onFlush on a multiplexer that will be ready");                                         // 137
      cb();                                                                                                           // 138
    });                                                                                                               // 139
  },                                                                                                                  // 140
  callbackNames: function () {                                                                                        // 141
    var self = this;                                                                                                  // 142
    if (self._ordered)                                                                                                // 143
      return ["addedBefore", "changed", "movedBefore", "removed"];                                                    // 144
    else                                                                                                              // 145
      return ["added", "changed", "removed"];                                                                         // 146
  },                                                                                                                  // 147
  _ready: function () {                                                                                               // 148
    return this._readyFuture.isResolved();                                                                            // 149
  },                                                                                                                  // 150
  _applyCallback: function (callbackName, args) {                                                                     // 151
    var self = this;                                                                                                  // 152
    self._queue.queueTask(function () {                                                                               // 153
      // If we stopped in the meantime, do nothing.                                                                   // 154
      if (!self._handles)                                                                                             // 155
        return;                                                                                                       // 156
                                                                                                                      // 157
      // First, apply the change to the cache.                                                                        // 158
      // XXX We could make applyChange callbacks promise not to hang on to any                                        // 159
      // state from their arguments (assuming that their supplied callbacks                                           // 160
      // don't) and skip this clone. Currently 'changed' hangs on to state                                            // 161
      // though.                                                                                                      // 162
      self._cache.applyChange[callbackName].apply(null, EJSON.clone(args));                                           // 163
                                                                                                                      // 164
      // If we haven't finished the initial adds, then we should only be getting                                      // 165
      // adds.                                                                                                        // 166
      if (!self._ready() &&                                                                                           // 167
          (callbackName !== 'added' && callbackName !== 'addedBefore')) {                                             // 168
        throw new Error("Got " + callbackName + " during initial adds");                                              // 169
      }                                                                                                               // 170
                                                                                                                      // 171
      // Now multiplex the callbacks out to all observe handles. It's OK if                                           // 172
      // these calls yield; since we're inside a task, no other use of our queue                                      // 173
      // can continue until these are done. (But we do have to be careful to not                                      // 174
      // use a handle that got removed, because removeHandle does not use the                                         // 175
      // queue; thus, we iterate over an array of keys that we control.)                                              // 176
      _.each(_.keys(self._handles), function (handleId) {                                                             // 177
        var handle = self._handles && self._handles[handleId];                                                        // 178
        if (!handle)                                                                                                  // 179
          return;                                                                                                     // 180
        var callback = handle['_' + callbackName];                                                                    // 181
        // clone arguments so that callbacks can mutate their arguments                                               // 182
        callback && callback.apply(null, EJSON.clone(args));                                                          // 183
      });                                                                                                             // 184
    });                                                                                                               // 185
  },                                                                                                                  // 186
                                                                                                                      // 187
  // Sends initial adds to a handle. It should only be called from within a task                                      // 188
  // (the task that is processing the addHandleAndSendInitialAdds call). It                                           // 189
  // synchronously invokes the handle's added or addedBefore; there's no need to                                      // 190
  // flush the queue afterwards to ensure that the callbacks get out.                                                 // 191
  _sendAdds: function (handle) {                                                                                      // 192
    var self = this;                                                                                                  // 193
    if (self._queue.safeToRunTask())                                                                                  // 194
      throw Error("_sendAdds may only be called from within a task!");                                                // 195
    var add = self._ordered ? handle._addedBefore : handle._added;                                                    // 196
    if (!add)                                                                                                         // 197
      return;                                                                                                         // 198
    // note: docs may be an _IdMap or an OrderedDict                                                                  // 199
    self._cache.docs.forEach(function (doc, id) {                                                                     // 200
      if (!_.has(self._handles, handle._id))                                                                          // 201
        throw Error("handle got removed before sending initial adds!");                                               // 202
      var fields = EJSON.clone(doc);                                                                                  // 203
      delete fields._id;                                                                                              // 204
      if (self._ordered)                                                                                              // 205
        add(id, fields, null); // we're going in order, so add at end                                                 // 206
      else                                                                                                            // 207
        add(id, fields);                                                                                              // 208
    });                                                                                                               // 209
  }                                                                                                                   // 210
});                                                                                                                   // 211
                                                                                                                      // 212
                                                                                                                      // 213
var nextObserveHandleId = 1;                                                                                          // 214
ObserveHandle = function (multiplexer, callbacks) {                                                                   // 215
  var self = this;                                                                                                    // 216
  // The end user is only supposed to call stop().  The other fields are                                              // 217
  // accessible to the multiplexer, though.                                                                           // 218
  self._multiplexer = multiplexer;                                                                                    // 219
  _.each(multiplexer.callbackNames(), function (name) {                                                               // 220
    if (callbacks[name]) {                                                                                            // 221
      self['_' + name] = callbacks[name];                                                                             // 222
    } else if (name === "addedBefore" && callbacks.added) {                                                           // 223
      // Special case: if you specify "added" and "movedBefore", you get an                                           // 224
      // ordered observe where for some reason you don't get ordering data on                                         // 225
      // the adds.  I dunno, we wrote tests for it, there must have been a                                            // 226
      // reason.                                                                                                      // 227
      self._addedBefore = function (id, fields, before) {                                                             // 228
        callbacks.added(id, fields);                                                                                  // 229
      };                                                                                                              // 230
    }                                                                                                                 // 231
  });                                                                                                                 // 232
  self._stopped = false;                                                                                              // 233
  self._id = nextObserveHandleId++;                                                                                   // 234
};                                                                                                                    // 235
ObserveHandle.prototype.stop = function () {                                                                          // 236
  var self = this;                                                                                                    // 237
  if (self._stopped)                                                                                                  // 238
    return;                                                                                                           // 239
  self._stopped = true;                                                                                               // 240
  self._multiplexer.removeHandle(self._id);                                                                           // 241
};                                                                                                                    // 242
                                                                                                                      // 243
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/doc_fetcher.js                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
var Future = Npm.require('fibers/future');                                                                            // 2
                                                                                                                      // 3
DocFetcher = function (mongoConnection) {                                                                             // 4
  var self = this;                                                                                                    // 5
  self._mongoConnection = mongoConnection;                                                                            // 6
  // Map from cache key -> [callback]                                                                                 // 7
  self._callbacksForCacheKey = {};                                                                                    // 8
};                                                                                                                    // 9
                                                                                                                      // 10
_.extend(DocFetcher.prototype, {                                                                                      // 11
  // Fetches document "id" from collectionName, returning it or null if not                                           // 12
  // found.                                                                                                           // 13
  //                                                                                                                  // 14
  // If you make multiple calls to fetch() with the same cacheKey (a string),                                         // 15
  // DocFetcher may assume that they all return the same document. (It does                                           // 16
  // not check to see if collectionName/id match.)                                                                    // 17
  //                                                                                                                  // 18
  // You may assume that callback is never called synchronously (and in fact                                          // 19
  // OplogObserveDriver does so).                                                                                     // 20
  fetch: function (collectionName, id, cacheKey, callback) {                                                          // 21
    var self = this;                                                                                                  // 22
                                                                                                                      // 23
    check(collectionName, String);                                                                                    // 24
    // id is some sort of scalar                                                                                      // 25
    check(cacheKey, String);                                                                                          // 26
                                                                                                                      // 27
    // If there's already an in-progress fetch for this cache key, yield until                                        // 28
    // it's done and return whatever it returns.                                                                      // 29
    if (_.has(self._callbacksForCacheKey, cacheKey)) {                                                                // 30
      self._callbacksForCacheKey[cacheKey].push(callback);                                                            // 31
      return;                                                                                                         // 32
    }                                                                                                                 // 33
                                                                                                                      // 34
    var callbacks = self._callbacksForCacheKey[cacheKey] = [callback];                                                // 35
                                                                                                                      // 36
    Fiber(function () {                                                                                               // 37
      try {                                                                                                           // 38
        var doc = self._mongoConnection.findOne(                                                                      // 39
          collectionName, {_id: id}) || null;                                                                         // 40
        // Return doc to all relevant callbacks. Note that this array can                                             // 41
        // continue to grow during callback excecution.                                                               // 42
        while (!_.isEmpty(callbacks)) {                                                                               // 43
          // Clone the document so that the various calls to fetch don't return                                       // 44
          // objects that are intertwingled with each other. Clone before                                             // 45
          // popping the future, so that if clone throws, the error gets passed                                       // 46
          // to the next callback.                                                                                    // 47
          var clonedDoc = EJSON.clone(doc);                                                                           // 48
          callbacks.pop()(null, clonedDoc);                                                                           // 49
        }                                                                                                             // 50
      } catch (e) {                                                                                                   // 51
        while (!_.isEmpty(callbacks)) {                                                                               // 52
          callbacks.pop()(e);                                                                                         // 53
        }                                                                                                             // 54
      } finally {                                                                                                     // 55
        // XXX consider keeping the doc around for a period of time before                                            // 56
        // removing from the cache                                                                                    // 57
        delete self._callbacksForCacheKey[cacheKey];                                                                  // 58
      }                                                                                                               // 59
    }).run();                                                                                                         // 60
  }                                                                                                                   // 61
});                                                                                                                   // 62
                                                                                                                      // 63
MongoTest.DocFetcher = DocFetcher;                                                                                    // 64
                                                                                                                      // 65
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/polling_observe_driver.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
PollingObserveDriver = function (options) {                                                                           // 1
  var self = this;                                                                                                    // 2
                                                                                                                      // 3
  self._cursorDescription = options.cursorDescription;                                                                // 4
  self._mongoHandle = options.mongoHandle;                                                                            // 5
  self._ordered = options.ordered;                                                                                    // 6
  self._multiplexer = options.multiplexer;                                                                            // 7
  self._stopCallbacks = [];                                                                                           // 8
  self._stopped = false;                                                                                              // 9
                                                                                                                      // 10
  self._synchronousCursor = self._mongoHandle._createSynchronousCursor(                                               // 11
    self._cursorDescription);                                                                                         // 12
                                                                                                                      // 13
  // previous results snapshot.  on each poll cycle, diffs against                                                    // 14
  // results drives the callbacks.                                                                                    // 15
  self._results = null;                                                                                               // 16
                                                                                                                      // 17
  // The number of _pollMongo calls that have been added to self._taskQueue but                                       // 18
  // have not started running. Used to make sure we never schedule more than one                                      // 19
  // _pollMongo (other than possibly the one that is currently running). It's                                         // 20
  // also used by _suspendPolling to pretend there's a poll scheduled. Usually,                                       // 21
  // it's either 0 (for "no polls scheduled other than maybe one currently                                            // 22
  // running") or 1 (for "a poll scheduled that isn't running yet"), but it can                                       // 23
  // also be 2 if incremented by _suspendPolling.                                                                     // 24
  self._pollsScheduledButNotStarted = 0;                                                                              // 25
  self._pendingWrites = []; // people to notify when polling completes                                                // 26
                                                                                                                      // 27
  // Make sure to create a separately throttled function for each                                                     // 28
  // PollingObserveDriver object.                                                                                     // 29
  self._ensurePollIsScheduled = _.throttle(                                                                           // 30
    self._unthrottledEnsurePollIsScheduled, 50 /* ms */);                                                             // 31
                                                                                                                      // 32
  // XXX figure out if we still need a queue                                                                          // 33
  self._taskQueue = new Meteor._SynchronousQueue();                                                                   // 34
                                                                                                                      // 35
  var listenersHandle = listenAll(                                                                                    // 36
    self._cursorDescription, function (notification) {                                                                // 37
      // When someone does a transaction that might affect us, schedule a poll                                        // 38
      // of the database. If that transaction happens inside of a write fence,                                        // 39
      // block the fence until we've polled and notified observers.                                                   // 40
      var fence = DDPServer._CurrentWriteFence.get();                                                                 // 41
      if (fence)                                                                                                      // 42
        self._pendingWrites.push(fence.beginWrite());                                                                 // 43
      // Ensure a poll is scheduled... but if we already know that one is,                                            // 44
      // don't hit the throttled _ensurePollIsScheduled function (which might                                         // 45
      // lead to us calling it unnecessarily in 50ms).                                                                // 46
      if (self._pollsScheduledButNotStarted === 0)                                                                    // 47
        self._ensurePollIsScheduled();                                                                                // 48
    }                                                                                                                 // 49
  );                                                                                                                  // 50
  self._stopCallbacks.push(function () { listenersHandle.stop(); });                                                  // 51
                                                                                                                      // 52
  // every once and a while, poll even if we don't think we're dirty, for                                             // 53
  // eventual consistency with database writes from outside the Meteor                                                // 54
  // universe.                                                                                                        // 55
  //                                                                                                                  // 56
  // For testing, there's an undocumented callback argument to observeChanges                                         // 57
  // which disables time-based polling and gets called at the beginning of each                                       // 58
  // poll.                                                                                                            // 59
  if (options._testOnlyPollCallback) {                                                                                // 60
    self._testOnlyPollCallback = options._testOnlyPollCallback;                                                       // 61
  } else {                                                                                                            // 62
    var intervalHandle = Meteor.setInterval(                                                                          // 63
      _.bind(self._ensurePollIsScheduled, self), 10 * 1000);                                                          // 64
    self._stopCallbacks.push(function () {                                                                            // 65
      Meteor.clearInterval(intervalHandle);                                                                           // 66
    });                                                                                                               // 67
  }                                                                                                                   // 68
                                                                                                                      // 69
  // Make sure we actually poll soon!                                                                                 // 70
  self._unthrottledEnsurePollIsScheduled();                                                                           // 71
                                                                                                                      // 72
  Package.facts && Package.facts.Facts.incrementServerFact(                                                           // 73
    "mongo-livedata", "observe-drivers-polling", 1);                                                                  // 74
};                                                                                                                    // 75
                                                                                                                      // 76
_.extend(PollingObserveDriver.prototype, {                                                                            // 77
  // This is always called through _.throttle (except once at startup).                                               // 78
  _unthrottledEnsurePollIsScheduled: function () {                                                                    // 79
    var self = this;                                                                                                  // 80
    if (self._pollsScheduledButNotStarted > 0)                                                                        // 81
      return;                                                                                                         // 82
    ++self._pollsScheduledButNotStarted;                                                                              // 83
    self._taskQueue.queueTask(function () {                                                                           // 84
      self._pollMongo();                                                                                              // 85
    });                                                                                                               // 86
  },                                                                                                                  // 87
                                                                                                                      // 88
  // test-only interface for controlling polling.                                                                     // 89
  //                                                                                                                  // 90
  // _suspendPolling blocks until any currently running and scheduled polls are                                       // 91
  // done, and prevents any further polls from being scheduled. (new                                                  // 92
  // ObserveHandles can be added and receive their initial added callbacks,                                           // 93
  // though.)                                                                                                         // 94
  //                                                                                                                  // 95
  // _resumePolling immediately polls, and allows further polls to occur.                                             // 96
  _suspendPolling: function() {                                                                                       // 97
    var self = this;                                                                                                  // 98
    // Pretend that there's another poll scheduled (which will prevent                                                // 99
    // _ensurePollIsScheduled from queueing any more polls).                                                          // 100
    ++self._pollsScheduledButNotStarted;                                                                              // 101
    // Now block until all currently running or scheduled polls are done.                                             // 102
    self._taskQueue.runTask(function() {});                                                                           // 103
                                                                                                                      // 104
    // Confirm that there is only one "poll" (the fake one we're pretending to                                        // 105
    // have) scheduled.                                                                                               // 106
    if (self._pollsScheduledButNotStarted !== 1)                                                                      // 107
      throw new Error("_pollsScheduledButNotStarted is " +                                                            // 108
                      self._pollsScheduledButNotStarted);                                                             // 109
  },                                                                                                                  // 110
  _resumePolling: function() {                                                                                        // 111
    var self = this;                                                                                                  // 112
    // We should be in the same state as in the end of _suspendPolling.                                               // 113
    if (self._pollsScheduledButNotStarted !== 1)                                                                      // 114
      throw new Error("_pollsScheduledButNotStarted is " +                                                            // 115
                      self._pollsScheduledButNotStarted);                                                             // 116
    // Run a poll synchronously (which will counteract the                                                            // 117
    // ++_pollsScheduledButNotStarted from _suspendPolling).                                                          // 118
    self._taskQueue.runTask(function () {                                                                             // 119
      self._pollMongo();                                                                                              // 120
    });                                                                                                               // 121
  },                                                                                                                  // 122
                                                                                                                      // 123
  _pollMongo: function () {                                                                                           // 124
    var self = this;                                                                                                  // 125
    --self._pollsScheduledButNotStarted;                                                                              // 126
                                                                                                                      // 127
    if (self._stopped)                                                                                                // 128
      return;                                                                                                         // 129
                                                                                                                      // 130
    var first = false;                                                                                                // 131
    var oldResults = self._results;                                                                                   // 132
    if (!oldResults) {                                                                                                // 133
      first = true;                                                                                                   // 134
      // XXX maybe use OrderedDict instead?                                                                           // 135
      oldResults = self._ordered ? [] : new LocalCollection._IdMap;                                                   // 136
    }                                                                                                                 // 137
                                                                                                                      // 138
    self._testOnlyPollCallback && self._testOnlyPollCallback();                                                       // 139
                                                                                                                      // 140
    // Save the list of pending writes which this round will commit.                                                  // 141
    var writesForCycle = self._pendingWrites;                                                                         // 142
    self._pendingWrites = [];                                                                                         // 143
                                                                                                                      // 144
    // Get the new query results. (This yields.)                                                                      // 145
    try {                                                                                                             // 146
      var newResults = self._synchronousCursor.getRawObjects(self._ordered);                                          // 147
    } catch (e) {                                                                                                     // 148
      if (first && typeof(e.code) === 'number') {                                                                     // 149
        // This is an error document sent to us by mongod, not a connection                                           // 150
        // error generated by the client. And we've never seen this query work                                        // 151
        // successfully. Probably it's a bad selector or something, so we should                                      // 152
        // NOT retry. Instead, we should halt the observe (which ends up calling                                      // 153
        // `stop` on us).                                                                                             // 154
        self._multiplexer.queryError(                                                                                 // 155
          new Error(                                                                                                  // 156
            "Exception while polling query " +                                                                        // 157
              JSON.stringify(self._cursorDescription) + ": " + e.message));                                           // 158
        return;                                                                                                       // 159
      }                                                                                                               // 160
                                                                                                                      // 161
      // getRawObjects can throw if we're having trouble talking to the                                               // 162
      // database.  That's fine --- we will repoll later anyway. But we should                                        // 163
      // make sure not to lose track of this cycle's writes.                                                          // 164
      // (It also can throw if there's just something invalid about this query;                                       // 165
      // unfortunately the ObserveDriver API doesn't provide a good way to                                            // 166
      // "cancel" the observe from the inside in this case.                                                           // 167
      Array.prototype.push.apply(self._pendingWrites, writesForCycle);                                                // 168
      Meteor._debug("Exception while polling query " +                                                                // 169
                    JSON.stringify(self._cursorDescription) + ": " + e.stack);                                        // 170
      return;                                                                                                         // 171
    }                                                                                                                 // 172
                                                                                                                      // 173
    // Run diffs.                                                                                                     // 174
    if (!self._stopped) {                                                                                             // 175
      LocalCollection._diffQueryChanges(                                                                              // 176
        self._ordered, oldResults, newResults, self._multiplexer);                                                    // 177
    }                                                                                                                 // 178
                                                                                                                      // 179
    // Signals the multiplexer to allow all observeChanges calls that share this                                      // 180
    // multiplexer to return. (This happens asynchronously, via the                                                   // 181
    // multiplexer's queue.)                                                                                          // 182
    if (first)                                                                                                        // 183
      self._multiplexer.ready();                                                                                      // 184
                                                                                                                      // 185
    // Replace self._results atomically.  (This assignment is what makes `first`                                      // 186
    // stay through on the next cycle, so we've waited until after we've                                              // 187
    // committed to ready-ing the multiplexer.)                                                                       // 188
    self._results = newResults;                                                                                       // 189
                                                                                                                      // 190
    // Once the ObserveMultiplexer has processed everything we've done in this                                        // 191
    // round, mark all the writes which existed before this call as                                                   // 192
    // commmitted. (If new writes have shown up in the meantime, there'll                                             // 193
    // already be another _pollMongo task scheduled.)                                                                 // 194
    self._multiplexer.onFlush(function () {                                                                           // 195
      _.each(writesForCycle, function (w) {                                                                           // 196
        w.committed();                                                                                                // 197
      });                                                                                                             // 198
    });                                                                                                               // 199
  },                                                                                                                  // 200
                                                                                                                      // 201
  stop: function () {                                                                                                 // 202
    var self = this;                                                                                                  // 203
    self._stopped = true;                                                                                             // 204
    _.each(self._stopCallbacks, function (c) { c(); });                                                               // 205
    // Release any write fences that are waiting on us.                                                               // 206
    _.each(self._pendingWrites, function (w) {                                                                        // 207
      w.committed();                                                                                                  // 208
    });                                                                                                               // 209
    Package.facts && Package.facts.Facts.incrementServerFact(                                                         // 210
      "mongo-livedata", "observe-drivers-polling", -1);                                                               // 211
  }                                                                                                                   // 212
});                                                                                                                   // 213
                                                                                                                      // 214
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/oplog_observe_driver.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
var Future = Npm.require('fibers/future');                                                                            // 2
                                                                                                                      // 3
var PHASE = {                                                                                                         // 4
  QUERYING: "QUERYING",                                                                                               // 5
  FETCHING: "FETCHING",                                                                                               // 6
  STEADY: "STEADY"                                                                                                    // 7
};                                                                                                                    // 8
                                                                                                                      // 9
// Exception thrown by _needToPollQuery which unrolls the stack up to the                                             // 10
// enclosing call to finishIfNeedToPollQuery.                                                                         // 11
var SwitchedToQuery = function () {};                                                                                 // 12
var finishIfNeedToPollQuery = function (f) {                                                                          // 13
  return function () {                                                                                                // 14
    try {                                                                                                             // 15
      f.apply(this, arguments);                                                                                       // 16
    } catch (e) {                                                                                                     // 17
      if (!(e instanceof SwitchedToQuery))                                                                            // 18
        throw e;                                                                                                      // 19
    }                                                                                                                 // 20
  };                                                                                                                  // 21
};                                                                                                                    // 22
                                                                                                                      // 23
// OplogObserveDriver is an alternative to PollingObserveDriver which follows                                         // 24
// the Mongo operation log instead of just re-polling the query. It obeys the                                         // 25
// same simple interface: constructing it starts sending observeChanges                                               // 26
// callbacks (and a ready() invocation) to the ObserveMultiplexer, and you stop                                       // 27
// it by calling the stop() method.                                                                                   // 28
OplogObserveDriver = function (options) {                                                                             // 29
  var self = this;                                                                                                    // 30
  self._usesOplog = true;  // tests look at this                                                                      // 31
                                                                                                                      // 32
  self._cursorDescription = options.cursorDescription;                                                                // 33
  self._mongoHandle = options.mongoHandle;                                                                            // 34
  self._multiplexer = options.multiplexer;                                                                            // 35
                                                                                                                      // 36
  if (options.ordered) {                                                                                              // 37
    throw Error("OplogObserveDriver only supports unordered observeChanges");                                         // 38
  }                                                                                                                   // 39
                                                                                                                      // 40
  var sorter = options.sorter;                                                                                        // 41
  // We don't support $near and other geo-queries so it's OK to initialize the                                        // 42
  // comparator only once in the constructor.                                                                         // 43
  var comparator = sorter && sorter.getComparator();                                                                  // 44
                                                                                                                      // 45
  if (options.cursorDescription.options.limit) {                                                                      // 46
    // There are several properties ordered driver implements:                                                        // 47
    // - _limit is a positive number                                                                                  // 48
    // - _comparator is a function-comparator by which the query is ordered                                           // 49
    // - _unpublishedBuffer is non-null Min/Max Heap,                                                                 // 50
    //                      the empty buffer in STEADY phase implies that the                                         // 51
    //                      everything that matches the queries selector fits                                         // 52
    //                      into published set.                                                                       // 53
    // - _published - Min Heap (also implements IdMap methods)                                                        // 54
                                                                                                                      // 55
    var heapOptions = { IdMap: LocalCollection._IdMap };                                                              // 56
    self._limit = self._cursorDescription.options.limit;                                                              // 57
    self._comparator = comparator;                                                                                    // 58
    self._sorter = sorter;                                                                                            // 59
    self._unpublishedBuffer = new MinMaxHeap(comparator, heapOptions);                                                // 60
    // We need something that can find Max value in addition to IdMap interface                                       // 61
    self._published = new MaxHeap(comparator, heapOptions);                                                           // 62
  } else {                                                                                                            // 63
    self._limit = 0;                                                                                                  // 64
    self._comparator = null;                                                                                          // 65
    self._sorter = null;                                                                                              // 66
    self._unpublishedBuffer = null;                                                                                   // 67
    self._published = new LocalCollection._IdMap;                                                                     // 68
  }                                                                                                                   // 69
                                                                                                                      // 70
  // Indicates if it is safe to insert a new document at the end of the buffer                                        // 71
  // for this query. i.e. it is known that there are no documents matching the                                        // 72
  // selector those are not in published or buffer.                                                                   // 73
  self._safeAppendToBuffer = false;                                                                                   // 74
                                                                                                                      // 75
  self._stopped = false;                                                                                              // 76
  self._stopHandles = [];                                                                                             // 77
                                                                                                                      // 78
  Package.facts && Package.facts.Facts.incrementServerFact(                                                           // 79
    "mongo-livedata", "observe-drivers-oplog", 1);                                                                    // 80
                                                                                                                      // 81
  self._registerPhaseChange(PHASE.QUERYING);                                                                          // 82
                                                                                                                      // 83
  var selector = self._cursorDescription.selector;                                                                    // 84
  self._matcher = options.matcher;                                                                                    // 85
  var projection = self._cursorDescription.options.fields || {};                                                      // 86
  self._projectionFn = LocalCollection._compileProjection(projection);                                                // 87
  // Projection function, result of combining important fields for selector and                                       // 88
  // existing fields projection                                                                                       // 89
  self._sharedProjection = self._matcher.combineIntoProjection(projection);                                           // 90
  if (sorter)                                                                                                         // 91
    self._sharedProjection = sorter.combineIntoProjection(self._sharedProjection);                                    // 92
  self._sharedProjectionFn = LocalCollection._compileProjection(                                                      // 93
    self._sharedProjection);                                                                                          // 94
                                                                                                                      // 95
  self._needToFetch = new LocalCollection._IdMap;                                                                     // 96
  self._currentlyFetching = null;                                                                                     // 97
  self._fetchGeneration = 0;                                                                                          // 98
                                                                                                                      // 99
  self._requeryWhenDoneThisQuery = false;                                                                             // 100
  self._writesToCommitWhenWeReachSteady = [];                                                                         // 101
                                                                                                                      // 102
  // If the oplog handle tells us that it skipped some entries (because it got                                        // 103
  // behind, say), re-poll.                                                                                           // 104
  self._stopHandles.push(self._mongoHandle._oplogHandle.onSkippedEntries(                                             // 105
    finishIfNeedToPollQuery(function () {                                                                             // 106
      self._needToPollQuery();                                                                                        // 107
    })                                                                                                                // 108
  ));                                                                                                                 // 109
                                                                                                                      // 110
  forEachTrigger(self._cursorDescription, function (trigger) {                                                        // 111
    self._stopHandles.push(self._mongoHandle._oplogHandle.onOplogEntry(                                               // 112
      trigger, function (notification) {                                                                              // 113
        Meteor._noYieldsAllowed(finishIfNeedToPollQuery(function () {                                                 // 114
          var op = notification.op;                                                                                   // 115
          if (notification.dropCollection) {                                                                          // 116
            // Note: this call is not allowed to block on anything (especially                                        // 117
            // on waiting for oplog entries to catch up) because that will block                                      // 118
            // onOplogEntry!                                                                                          // 119
            self._needToPollQuery();                                                                                  // 120
          } else {                                                                                                    // 121
            // All other operators should be handled depending on phase                                               // 122
            if (self._phase === PHASE.QUERYING)                                                                       // 123
              self._handleOplogEntryQuerying(op);                                                                     // 124
            else                                                                                                      // 125
              self._handleOplogEntrySteadyOrFetching(op);                                                             // 126
          }                                                                                                           // 127
        }));                                                                                                          // 128
      }                                                                                                               // 129
    ));                                                                                                               // 130
  });                                                                                                                 // 131
                                                                                                                      // 132
  // XXX ordering w.r.t. everything else?                                                                             // 133
  self._stopHandles.push(listenAll(                                                                                   // 134
    self._cursorDescription, function (notification) {                                                                // 135
      // If we're not in a write fence, we don't have to do anything.                                                 // 136
      var fence = DDPServer._CurrentWriteFence.get();                                                                 // 137
      if (!fence)                                                                                                     // 138
        return;                                                                                                       // 139
      var write = fence.beginWrite();                                                                                 // 140
      // This write cannot complete until we've caught up to "this point" in the                                      // 141
      // oplog, and then made it back to the steady state.                                                            // 142
      Meteor.defer(function () {                                                                                      // 143
        self._mongoHandle._oplogHandle.waitUntilCaughtUp();                                                           // 144
        if (self._stopped) {                                                                                          // 145
          // We're stopped, so just immediately commit.                                                               // 146
          write.committed();                                                                                          // 147
        } else if (self._phase === PHASE.STEADY) {                                                                    // 148
          // Make sure that all of the callbacks have made it through the                                             // 149
          // multiplexer and been delivered to ObserveHandles before committing                                       // 150
          // writes.                                                                                                  // 151
          self._multiplexer.onFlush(function () {                                                                     // 152
            write.committed();                                                                                        // 153
          });                                                                                                         // 154
        } else {                                                                                                      // 155
          self._writesToCommitWhenWeReachSteady.push(write);                                                          // 156
        }                                                                                                             // 157
      });                                                                                                             // 158
    }                                                                                                                 // 159
  ));                                                                                                                 // 160
                                                                                                                      // 161
  // When Mongo fails over, we need to repoll the query, in case we processed an                                      // 162
  // oplog entry that got rolled back.                                                                                // 163
  self._stopHandles.push(self._mongoHandle._onFailover(finishIfNeedToPollQuery(                                       // 164
    function () {                                                                                                     // 165
      self._needToPollQuery();                                                                                        // 166
    })));                                                                                                             // 167
                                                                                                                      // 168
  // Give _observeChanges a chance to add the new ObserveHandle to our                                                // 169
  // multiplexer, so that the added calls get streamed.                                                               // 170
  Meteor.defer(finishIfNeedToPollQuery(function () {                                                                  // 171
    self._runInitialQuery();                                                                                          // 172
  }));                                                                                                                // 173
};                                                                                                                    // 174
                                                                                                                      // 175
_.extend(OplogObserveDriver.prototype, {                                                                              // 176
  _addPublished: function (id, doc) {                                                                                 // 177
    var self = this;                                                                                                  // 178
    Meteor._noYieldsAllowed(function () {                                                                             // 179
      var fields = _.clone(doc);                                                                                      // 180
      delete fields._id;                                                                                              // 181
      self._published.set(id, self._sharedProjectionFn(doc));                                                         // 182
      self._multiplexer.added(id, self._projectionFn(fields));                                                        // 183
                                                                                                                      // 184
      // After adding this document, the published set might be overflowed                                            // 185
      // (exceeding capacity specified by limit). If so, push the maximum                                             // 186
      // element to the buffer, we might want to save it in memory to reduce the                                      // 187
      // amount of Mongo lookups in the future.                                                                       // 188
      if (self._limit && self._published.size() > self._limit) {                                                      // 189
        // XXX in theory the size of published is no more than limit+1                                                // 190
        if (self._published.size() !== self._limit + 1) {                                                             // 191
          throw new Error("After adding to published, " +                                                             // 192
                          (self._published.size() - self._limit) +                                                    // 193
                          " documents are overflowing the set");                                                      // 194
        }                                                                                                             // 195
                                                                                                                      // 196
        var overflowingDocId = self._published.maxElementId();                                                        // 197
        var overflowingDoc = self._published.get(overflowingDocId);                                                   // 198
                                                                                                                      // 199
        if (EJSON.equals(overflowingDocId, id)) {                                                                     // 200
          throw new Error("The document just added is overflowing the published set");                                // 201
        }                                                                                                             // 202
                                                                                                                      // 203
        self._published.remove(overflowingDocId);                                                                     // 204
        self._multiplexer.removed(overflowingDocId);                                                                  // 205
        self._addBuffered(overflowingDocId, overflowingDoc);                                                          // 206
      }                                                                                                               // 207
    });                                                                                                               // 208
  },                                                                                                                  // 209
  _removePublished: function (id) {                                                                                   // 210
    var self = this;                                                                                                  // 211
    Meteor._noYieldsAllowed(function () {                                                                             // 212
      self._published.remove(id);                                                                                     // 213
      self._multiplexer.removed(id);                                                                                  // 214
      if (! self._limit || self._published.size() === self._limit)                                                    // 215
        return;                                                                                                       // 216
                                                                                                                      // 217
      if (self._published.size() > self._limit)                                                                       // 218
        throw Error("self._published got too big");                                                                   // 219
                                                                                                                      // 220
      // OK, we are publishing less than the limit. Maybe we should look in the                                       // 221
      // buffer to find the next element past what we were publishing before.                                         // 222
                                                                                                                      // 223
      if (!self._unpublishedBuffer.empty()) {                                                                         // 224
        // There's something in the buffer; move the first thing in it to                                             // 225
        // _published.                                                                                                // 226
        var newDocId = self._unpublishedBuffer.minElementId();                                                        // 227
        var newDoc = self._unpublishedBuffer.get(newDocId);                                                           // 228
        self._removeBuffered(newDocId);                                                                               // 229
        self._addPublished(newDocId, newDoc);                                                                         // 230
        return;                                                                                                       // 231
      }                                                                                                               // 232
                                                                                                                      // 233
      // There's nothing in the buffer.  This could mean one of a few things.                                         // 234
                                                                                                                      // 235
      // (a) We could be in the middle of re-running the query (specifically, we                                      // 236
      // could be in _publishNewResults). In that case, _unpublishedBuffer is                                         // 237
      // empty because we clear it at the beginning of _publishNewResults. In                                         // 238
      // this case, our caller already knows the entire answer to the query and                                       // 239
      // we don't need to do anything fancy here.  Just return.                                                       // 240
      if (self._phase === PHASE.QUERYING)                                                                             // 241
        return;                                                                                                       // 242
                                                                                                                      // 243
      // (b) We're pretty confident that the union of _published and                                                  // 244
      // _unpublishedBuffer contain all documents that match selector. Because                                        // 245
      // _unpublishedBuffer is empty, that means we're confident that _published                                      // 246
      // contains all documents that match selector. So we have nothing to do.                                        // 247
      if (self._safeAppendToBuffer)                                                                                   // 248
        return;                                                                                                       // 249
                                                                                                                      // 250
      // (c) Maybe there are other documents out there that should be in our                                          // 251
      // buffer. But in that case, when we emptied _unpublishedBuffer in                                              // 252
      // _removeBuffered, we should have called _needToPollQuery, which will                                          // 253
      // either put something in _unpublishedBuffer or set _safeAppendToBuffer                                        // 254
      // (or both), and it will put us in QUERYING for that whole time. So in                                         // 255
      // fact, we shouldn't be able to get here.                                                                      // 256
                                                                                                                      // 257
      throw new Error("Buffer inexplicably empty");                                                                   // 258
    });                                                                                                               // 259
  },                                                                                                                  // 260
  _changePublished: function (id, oldDoc, newDoc) {                                                                   // 261
    var self = this;                                                                                                  // 262
    Meteor._noYieldsAllowed(function () {                                                                             // 263
      self._published.set(id, self._sharedProjectionFn(newDoc));                                                      // 264
      var projectedNew = self._projectionFn(newDoc);                                                                  // 265
      var projectedOld = self._projectionFn(oldDoc);                                                                  // 266
      var changed = LocalCollection._makeChangedFields(                                                               // 267
        projectedNew, projectedOld);                                                                                  // 268
      if (!_.isEmpty(changed))                                                                                        // 269
        self._multiplexer.changed(id, changed);                                                                       // 270
    });                                                                                                               // 271
  },                                                                                                                  // 272
  _addBuffered: function (id, doc) {                                                                                  // 273
    var self = this;                                                                                                  // 274
    Meteor._noYieldsAllowed(function () {                                                                             // 275
      self._unpublishedBuffer.set(id, self._sharedProjectionFn(doc));                                                 // 276
                                                                                                                      // 277
      // If something is overflowing the buffer, we just remove it from cache                                         // 278
      if (self._unpublishedBuffer.size() > self._limit) {                                                             // 279
        var maxBufferedId = self._unpublishedBuffer.maxElementId();                                                   // 280
                                                                                                                      // 281
        self._unpublishedBuffer.remove(maxBufferedId);                                                                // 282
                                                                                                                      // 283
        // Since something matching is removed from cache (both published set and                                     // 284
        // buffer), set flag to false                                                                                 // 285
        self._safeAppendToBuffer = false;                                                                             // 286
      }                                                                                                               // 287
    });                                                                                                               // 288
  },                                                                                                                  // 289
  // Is called either to remove the doc completely from matching set or to move                                       // 290
  // it to the published set later.                                                                                   // 291
  _removeBuffered: function (id) {                                                                                    // 292
    var self = this;                                                                                                  // 293
    Meteor._noYieldsAllowed(function () {                                                                             // 294
      self._unpublishedBuffer.remove(id);                                                                             // 295
      // To keep the contract "buffer is never empty in STEADY phase unless the                                       // 296
      // everything matching fits into published" true, we poll everything as                                         // 297
      // soon as we see the buffer becoming empty.                                                                    // 298
      if (! self._unpublishedBuffer.size() && ! self._safeAppendToBuffer)                                             // 299
        self._needToPollQuery();                                                                                      // 300
    });                                                                                                               // 301
  },                                                                                                                  // 302
  // Called when a document has joined the "Matching" results set.                                                    // 303
  // Takes responsibility of keeping _unpublishedBuffer in sync with _published                                       // 304
  // and the effect of limit enforced.                                                                                // 305
  _addMatching: function (doc) {                                                                                      // 306
    var self = this;                                                                                                  // 307
    Meteor._noYieldsAllowed(function () {                                                                             // 308
      var id = doc._id;                                                                                               // 309
      if (self._published.has(id))                                                                                    // 310
        throw Error("tried to add something already published " + id);                                                // 311
      if (self._limit && self._unpublishedBuffer.has(id))                                                             // 312
        throw Error("tried to add something already existed in buffer " + id);                                        // 313
                                                                                                                      // 314
      var limit = self._limit;                                                                                        // 315
      var comparator = self._comparator;                                                                              // 316
      var maxPublished = (limit && self._published.size() > 0) ?                                                      // 317
        self._published.get(self._published.maxElementId()) : null;                                                   // 318
      var maxBuffered = (limit && self._unpublishedBuffer.size() > 0)                                                 // 319
        ? self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId())                                         // 320
        : null;                                                                                                       // 321
      // The query is unlimited or didn't publish enough documents yet or the                                         // 322
      // new document would fit into published set pushing the maximum element                                        // 323
      // out, then we need to publish the doc.                                                                        // 324
      var toPublish = ! limit || self._published.size() < limit ||                                                    // 325
        comparator(doc, maxPublished) < 0;                                                                            // 326
                                                                                                                      // 327
      // Otherwise we might need to buffer it (only in case of limited query).                                        // 328
      // Buffering is allowed if the buffer is not filled up yet and all                                              // 329
      // matching docs are either in the published set or in the buffer.                                              // 330
      var canAppendToBuffer = !toPublish && self._safeAppendToBuffer &&                                               // 331
        self._unpublishedBuffer.size() < limit;                                                                       // 332
                                                                                                                      // 333
      // Or if it is small enough to be safely inserted to the middle or the                                          // 334
      // beginning of the buffer.                                                                                     // 335
      var canInsertIntoBuffer = !toPublish && maxBuffered &&                                                          // 336
        comparator(doc, maxBuffered) <= 0;                                                                            // 337
                                                                                                                      // 338
      var toBuffer = canAppendToBuffer || canInsertIntoBuffer;                                                        // 339
                                                                                                                      // 340
      if (toPublish) {                                                                                                // 341
        self._addPublished(id, doc);                                                                                  // 342
      } else if (toBuffer) {                                                                                          // 343
        self._addBuffered(id, doc);                                                                                   // 344
      } else {                                                                                                        // 345
        // dropping it and not saving to the cache                                                                    // 346
        self._safeAppendToBuffer = false;                                                                             // 347
      }                                                                                                               // 348
    });                                                                                                               // 349
  },                                                                                                                  // 350
  // Called when a document leaves the "Matching" results set.                                                        // 351
  // Takes responsibility of keeping _unpublishedBuffer in sync with _published                                       // 352
  // and the effect of limit enforced.                                                                                // 353
  _removeMatching: function (id) {                                                                                    // 354
    var self = this;                                                                                                  // 355
    Meteor._noYieldsAllowed(function () {                                                                             // 356
      if (! self._published.has(id) && ! self._limit)                                                                 // 357
        throw Error("tried to remove something matching but not cached " + id);                                       // 358
                                                                                                                      // 359
      if (self._published.has(id)) {                                                                                  // 360
        self._removePublished(id);                                                                                    // 361
      } else if (self._unpublishedBuffer.has(id)) {                                                                   // 362
        self._removeBuffered(id);                                                                                     // 363
      }                                                                                                               // 364
    });                                                                                                               // 365
  },                                                                                                                  // 366
  _handleDoc: function (id, newDoc) {                                                                                 // 367
    var self = this;                                                                                                  // 368
    Meteor._noYieldsAllowed(function () {                                                                             // 369
      var matchesNow = newDoc && self._matcher.documentMatches(newDoc).result;                                        // 370
                                                                                                                      // 371
      var publishedBefore = self._published.has(id);                                                                  // 372
      var bufferedBefore = self._limit && self._unpublishedBuffer.has(id);                                            // 373
      var cachedBefore = publishedBefore || bufferedBefore;                                                           // 374
                                                                                                                      // 375
      if (matchesNow && !cachedBefore) {                                                                              // 376
        self._addMatching(newDoc);                                                                                    // 377
      } else if (cachedBefore && !matchesNow) {                                                                       // 378
        self._removeMatching(id);                                                                                     // 379
      } else if (cachedBefore && matchesNow) {                                                                        // 380
        var oldDoc = self._published.get(id);                                                                         // 381
        var comparator = self._comparator;                                                                            // 382
        var minBuffered = self._limit && self._unpublishedBuffer.size() &&                                            // 383
          self._unpublishedBuffer.get(self._unpublishedBuffer.minElementId());                                        // 384
                                                                                                                      // 385
        if (publishedBefore) {                                                                                        // 386
          // Unlimited case where the document stays in published once it                                             // 387
          // matches or the case when we don't have enough matching docs to                                           // 388
          // publish or the changed but matching doc will stay in published                                           // 389
          // anyways.                                                                                                 // 390
          //                                                                                                          // 391
          // XXX: We rely on the emptiness of buffer. Be sure to maintain the                                         // 392
          // fact that buffer can't be empty if there are matching documents not                                      // 393
          // published. Notably, we don't want to schedule repoll and continue                                        // 394
          // relying on this property.                                                                                // 395
          var staysInPublished = ! self._limit ||                                                                     // 396
            self._unpublishedBuffer.size() === 0 ||                                                                   // 397
            comparator(newDoc, minBuffered) <= 0;                                                                     // 398
                                                                                                                      // 399
          if (staysInPublished) {                                                                                     // 400
            self._changePublished(id, oldDoc, newDoc);                                                                // 401
          } else {                                                                                                    // 402
            // after the change doc doesn't stay in the published, remove it                                          // 403
            self._removePublished(id);                                                                                // 404
            // but it can move into buffered now, check it                                                            // 405
            var maxBuffered = self._unpublishedBuffer.get(                                                            // 406
              self._unpublishedBuffer.maxElementId());                                                                // 407
                                                                                                                      // 408
            var toBuffer = self._safeAppendToBuffer ||                                                                // 409
                  (maxBuffered && comparator(newDoc, maxBuffered) <= 0);                                              // 410
                                                                                                                      // 411
            if (toBuffer) {                                                                                           // 412
              self._addBuffered(id, newDoc);                                                                          // 413
            } else {                                                                                                  // 414
              // Throw away from both published set and buffer                                                        // 415
              self._safeAppendToBuffer = false;                                                                       // 416
            }                                                                                                         // 417
          }                                                                                                           // 418
        } else if (bufferedBefore) {                                                                                  // 419
          oldDoc = self._unpublishedBuffer.get(id);                                                                   // 420
          // remove the old version manually instead of using _removeBuffered so                                      // 421
          // we don't trigger the querying immediately.  if we end this block                                         // 422
          // with the buffer empty, we will need to trigger the query poll                                            // 423
          // manually too.                                                                                            // 424
          self._unpublishedBuffer.remove(id);                                                                         // 425
                                                                                                                      // 426
          var maxPublished = self._published.get(                                                                     // 427
            self._published.maxElementId());                                                                          // 428
          var maxBuffered = self._unpublishedBuffer.size() &&                                                         // 429
                self._unpublishedBuffer.get(                                                                          // 430
                  self._unpublishedBuffer.maxElementId());                                                            // 431
                                                                                                                      // 432
          // the buffered doc was updated, it could move to published                                                 // 433
          var toPublish = comparator(newDoc, maxPublished) < 0;                                                       // 434
                                                                                                                      // 435
          // or stays in buffer even after the change                                                                 // 436
          var staysInBuffer = (! toPublish && self._safeAppendToBuffer) ||                                            // 437
                (!toPublish && maxBuffered &&                                                                         // 438
                 comparator(newDoc, maxBuffered) <= 0);                                                               // 439
                                                                                                                      // 440
          if (toPublish) {                                                                                            // 441
            self._addPublished(id, newDoc);                                                                           // 442
          } else if (staysInBuffer) {                                                                                 // 443
            // stays in buffer but changes                                                                            // 444
            self._unpublishedBuffer.set(id, newDoc);                                                                  // 445
          } else {                                                                                                    // 446
            // Throw away from both published set and buffer                                                          // 447
            self._safeAppendToBuffer = false;                                                                         // 448
            // Normally this check would have been done in _removeBuffered but                                        // 449
            // we didn't use it, so we need to do it ourself now.                                                     // 450
            if (! self._unpublishedBuffer.size()) {                                                                   // 451
              self._needToPollQuery();                                                                                // 452
            }                                                                                                         // 453
          }                                                                                                           // 454
        } else {                                                                                                      // 455
          throw new Error("cachedBefore implies either of publishedBefore or bufferedBefore is true.");               // 456
        }                                                                                                             // 457
      }                                                                                                               // 458
    });                                                                                                               // 459
  },                                                                                                                  // 460
  _fetchModifiedDocuments: function () {                                                                              // 461
    var self = this;                                                                                                  // 462
    Meteor._noYieldsAllowed(function () {                                                                             // 463
      self._registerPhaseChange(PHASE.FETCHING);                                                                      // 464
      // Defer, because nothing called from the oplog entry handler may yield,                                        // 465
      // but fetch() yields.                                                                                          // 466
      Meteor.defer(finishIfNeedToPollQuery(function () {                                                              // 467
        while (!self._stopped && !self._needToFetch.empty()) {                                                        // 468
          if (self._phase === PHASE.QUERYING) {                                                                       // 469
            // While fetching, we decided to go into QUERYING mode, and then we                                       // 470
            // saw another oplog entry, so _needToFetch is not empty. But we                                          // 471
            // shouldn't fetch these documents until AFTER the query is done.                                         // 472
            break;                                                                                                    // 473
          }                                                                                                           // 474
                                                                                                                      // 475
          // Being in steady phase here would be surprising.                                                          // 476
          if (self._phase !== PHASE.FETCHING)                                                                         // 477
            throw new Error("phase in fetchModifiedDocuments: " + self._phase);                                       // 478
                                                                                                                      // 479
          self._currentlyFetching = self._needToFetch;                                                                // 480
          var thisGeneration = ++self._fetchGeneration;                                                               // 481
          self._needToFetch = new LocalCollection._IdMap;                                                             // 482
          var waiting = 0;                                                                                            // 483
          var fut = new Future;                                                                                       // 484
          // This loop is safe, because _currentlyFetching will not be updated                                        // 485
          // during this loop (in fact, it is never mutated).                                                         // 486
          self._currentlyFetching.forEach(function (cacheKey, id) {                                                   // 487
            waiting++;                                                                                                // 488
            self._mongoHandle._docFetcher.fetch(                                                                      // 489
              self._cursorDescription.collectionName, id, cacheKey,                                                   // 490
              finishIfNeedToPollQuery(function (err, doc) {                                                           // 491
                try {                                                                                                 // 492
                  if (err) {                                                                                          // 493
                    Meteor._debug("Got exception while fetching documents: " +                                        // 494
                                  err);                                                                               // 495
                    // If we get an error from the fetcher (eg, trouble                                               // 496
                    // connecting to Mongo), let's just abandon the fetch phase                                       // 497
                    // altogether and fall back to polling. It's not like we're                                       // 498
                    // getting live updates anyway.                                                                   // 499
                    if (self._phase !== PHASE.QUERYING) {                                                             // 500
                      self._needToPollQuery();                                                                        // 501
                    }                                                                                                 // 502
                  } else if (!self._stopped && self._phase === PHASE.FETCHING                                         // 503
                             && self._fetchGeneration === thisGeneration) {                                           // 504
                    // We re-check the generation in case we've had an explicit                                       // 505
                    // _pollQuery call (eg, in another fiber) which should                                            // 506
                    // effectively cancel this round of fetches.  (_pollQuery                                         // 507
                    // increments the generation.)                                                                    // 508
                    self._handleDoc(id, doc);                                                                         // 509
                  }                                                                                                   // 510
                } finally {                                                                                           // 511
                  waiting--;                                                                                          // 512
                  // Because fetch() never calls its callback synchronously,                                          // 513
                  // this is safe (ie, we won't call fut.return() before the                                          // 514
                  // forEach is done).                                                                                // 515
                  if (waiting === 0)                                                                                  // 516
                    fut.return();                                                                                     // 517
                }                                                                                                     // 518
              }));                                                                                                    // 519
          });                                                                                                         // 520
          fut.wait();                                                                                                 // 521
          // Exit now if we've had a _pollQuery call (here or in another fiber).                                      // 522
          if (self._phase === PHASE.QUERYING)                                                                         // 523
            return;                                                                                                   // 524
          self._currentlyFetching = null;                                                                             // 525
        }                                                                                                             // 526
        // We're done fetching, so we can be steady, unless we've had a                                               // 527
        // _pollQuery call (here or in another fiber).                                                                // 528
        if (self._phase !== PHASE.QUERYING)                                                                           // 529
          self._beSteady();                                                                                           // 530
      }));                                                                                                            // 531
    });                                                                                                               // 532
  },                                                                                                                  // 533
  _beSteady: function () {                                                                                            // 534
    var self = this;                                                                                                  // 535
    Meteor._noYieldsAllowed(function () {                                                                             // 536
      self._registerPhaseChange(PHASE.STEADY);                                                                        // 537
      var writes = self._writesToCommitWhenWeReachSteady;                                                             // 538
      self._writesToCommitWhenWeReachSteady = [];                                                                     // 539
      self._multiplexer.onFlush(function () {                                                                         // 540
        _.each(writes, function (w) {                                                                                 // 541
          w.committed();                                                                                              // 542
        });                                                                                                           // 543
      });                                                                                                             // 544
    });                                                                                                               // 545
  },                                                                                                                  // 546
  _handleOplogEntryQuerying: function (op) {                                                                          // 547
    var self = this;                                                                                                  // 548
    Meteor._noYieldsAllowed(function () {                                                                             // 549
      self._needToFetch.set(idForOp(op), op.ts.toString());                                                           // 550
    });                                                                                                               // 551
  },                                                                                                                  // 552
  _handleOplogEntrySteadyOrFetching: function (op) {                                                                  // 553
    var self = this;                                                                                                  // 554
    Meteor._noYieldsAllowed(function () {                                                                             // 555
      var id = idForOp(op);                                                                                           // 556
      // If we're already fetching this one, or about to, we can't optimize;                                          // 557
      // make sure that we fetch it again if necessary.                                                               // 558
      if (self._phase === PHASE.FETCHING &&                                                                           // 559
          ((self._currentlyFetching && self._currentlyFetching.has(id)) ||                                            // 560
           self._needToFetch.has(id))) {                                                                              // 561
        self._needToFetch.set(id, op.ts.toString());                                                                  // 562
        return;                                                                                                       // 563
      }                                                                                                               // 564
                                                                                                                      // 565
      if (op.op === 'd') {                                                                                            // 566
        if (self._published.has(id) ||                                                                                // 567
            (self._limit && self._unpublishedBuffer.has(id)))                                                         // 568
          self._removeMatching(id);                                                                                   // 569
      } else if (op.op === 'i') {                                                                                     // 570
        if (self._published.has(id))                                                                                  // 571
          throw new Error("insert found for already-existing ID in published");                                       // 572
        if (self._unpublishedBuffer && self._unpublishedBuffer.has(id))                                               // 573
          throw new Error("insert found for already-existing ID in buffer");                                          // 574
                                                                                                                      // 575
        // XXX what if selector yields?  for now it can't but later it could                                          // 576
        // have $where                                                                                                // 577
        if (self._matcher.documentMatches(op.o).result)                                                               // 578
          self._addMatching(op.o);                                                                                    // 579
      } else if (op.op === 'u') {                                                                                     // 580
        // Is this a modifier ($set/$unset, which may require us to poll the                                          // 581
        // database to figure out if the whole document matches the selector) or                                      // 582
        // a replacement (in which case we can just directly re-evaluate the                                          // 583
        // selector)?                                                                                                 // 584
        var isReplace = !_.has(op.o, '$set') && !_.has(op.o, '$unset');                                               // 585
        // If this modifier modifies something inside an EJSON custom type (ie,                                       // 586
        // anything with EJSON$), then we can't try to use                                                            // 587
        // LocalCollection._modify, since that just mutates the EJSON encoding,                                       // 588
        // not the actual object.                                                                                     // 589
        var canDirectlyModifyDoc =                                                                                    // 590
          !isReplace && modifierCanBeDirectlyApplied(op.o);                                                           // 591
                                                                                                                      // 592
        var publishedBefore = self._published.has(id);                                                                // 593
        var bufferedBefore = self._limit && self._unpublishedBuffer.has(id);                                          // 594
                                                                                                                      // 595
        if (isReplace) {                                                                                              // 596
          self._handleDoc(id, _.extend({_id: id}, op.o));                                                             // 597
        } else if ((publishedBefore || bufferedBefore) &&                                                             // 598
                   canDirectlyModifyDoc) {                                                                            // 599
          // Oh great, we actually know what the document is, so we can apply                                         // 600
          // this directly.                                                                                           // 601
          var newDoc = self._published.has(id)                                                                        // 602
            ? self._published.get(id) : self._unpublishedBuffer.get(id);                                              // 603
          newDoc = EJSON.clone(newDoc);                                                                               // 604
                                                                                                                      // 605
          newDoc._id = id;                                                                                            // 606
          try {                                                                                                       // 607
            LocalCollection._modify(newDoc, op.o);                                                                    // 608
          } catch (e) {                                                                                               // 609
            if (e.name !== "MinimongoError")                                                                          // 610
              throw e;                                                                                                // 611
            // We didn't understand the modifier.  Re-fetch.                                                          // 612
            self._needToFetch.set(id, op.ts.toString());                                                              // 613
            if (self._phase === PHASE.STEADY) {                                                                       // 614
              self._fetchModifiedDocuments();                                                                         // 615
            }                                                                                                         // 616
            return;                                                                                                   // 617
          }                                                                                                           // 618
          self._handleDoc(id, self._sharedProjectionFn(newDoc));                                                      // 619
        } else if (!canDirectlyModifyDoc ||                                                                           // 620
                   self._matcher.canBecomeTrueByModifier(op.o) ||                                                     // 621
                   (self._sorter && self._sorter.affectedByModifier(op.o))) {                                         // 622
          self._needToFetch.set(id, op.ts.toString());                                                                // 623
          if (self._phase === PHASE.STEADY)                                                                           // 624
            self._fetchModifiedDocuments();                                                                           // 625
        }                                                                                                             // 626
      } else {                                                                                                        // 627
        throw Error("XXX SURPRISING OPERATION: " + op);                                                               // 628
      }                                                                                                               // 629
    });                                                                                                               // 630
  },                                                                                                                  // 631
  // Yields!                                                                                                          // 632
  _runInitialQuery: function () {                                                                                     // 633
    var self = this;                                                                                                  // 634
    if (self._stopped)                                                                                                // 635
      throw new Error("oplog stopped surprisingly early");                                                            // 636
                                                                                                                      // 637
    self._runQuery({initial: true});  // yields                                                                       // 638
                                                                                                                      // 639
    if (self._stopped)                                                                                                // 640
      return;  // can happen on queryError                                                                            // 641
                                                                                                                      // 642
    // Allow observeChanges calls to return. (After this, it's possible for                                           // 643
    // stop() to be called.)                                                                                          // 644
    self._multiplexer.ready();                                                                                        // 645
                                                                                                                      // 646
    self._doneQuerying();  // yields                                                                                  // 647
  },                                                                                                                  // 648
                                                                                                                      // 649
  // In various circumstances, we may just want to stop processing the oplog and                                      // 650
  // re-run the initial query, just as if we were a PollingObserveDriver.                                             // 651
  //                                                                                                                  // 652
  // This function may not block, because it is called from an oplog entry                                            // 653
  // handler.                                                                                                         // 654
  //                                                                                                                  // 655
  // XXX We should call this when we detect that we've been in FETCHING for "too                                      // 656
  // long".                                                                                                           // 657
  //                                                                                                                  // 658
  // XXX We should call this when we detect Mongo failover (since that might                                          // 659
  // mean that some of the oplog entries we have processed have been rolled                                           // 660
  // back). The Node Mongo driver is in the middle of a bunch of huge                                                 // 661
  // refactorings, including the way that it notifies you when primary                                                // 662
  // changes. Will put off implementing this until driver 1.4 is out.                                                 // 663
  _pollQuery: function () {                                                                                           // 664
    var self = this;                                                                                                  // 665
    Meteor._noYieldsAllowed(function () {                                                                             // 666
      if (self._stopped)                                                                                              // 667
        return;                                                                                                       // 668
                                                                                                                      // 669
      // Yay, we get to forget about all the things we thought we had to fetch.                                       // 670
      self._needToFetch = new LocalCollection._IdMap;                                                                 // 671
      self._currentlyFetching = null;                                                                                 // 672
      ++self._fetchGeneration;  // ignore any in-flight fetches                                                       // 673
      self._registerPhaseChange(PHASE.QUERYING);                                                                      // 674
                                                                                                                      // 675
      // Defer so that we don't yield.  We don't need finishIfNeedToPollQuery                                         // 676
      // here because SwitchedToQuery is not thrown in QUERYING mode.                                                 // 677
      Meteor.defer(function () {                                                                                      // 678
        self._runQuery();                                                                                             // 679
        self._doneQuerying();                                                                                         // 680
      });                                                                                                             // 681
    });                                                                                                               // 682
  },                                                                                                                  // 683
                                                                                                                      // 684
  // Yields!                                                                                                          // 685
  _runQuery: function (options) {                                                                                     // 686
    var self = this;                                                                                                  // 687
    options = options || {};                                                                                          // 688
    var newResults, newBuffer;                                                                                        // 689
                                                                                                                      // 690
    // This while loop is just to retry failures.                                                                     // 691
    while (true) {                                                                                                    // 692
      // If we've been stopped, we don't have to run anything any more.                                               // 693
      if (self._stopped)                                                                                              // 694
        return;                                                                                                       // 695
                                                                                                                      // 696
      newResults = new LocalCollection._IdMap;                                                                        // 697
      newBuffer = new LocalCollection._IdMap;                                                                         // 698
                                                                                                                      // 699
      // Query 2x documents as the half excluded from the original query will go                                      // 700
      // into unpublished buffer to reduce additional Mongo lookups in cases                                          // 701
      // when documents are removed from the published set and need a                                                 // 702
      // replacement.                                                                                                 // 703
      // XXX needs more thought on non-zero skip                                                                      // 704
      // XXX 2 is a "magic number" meaning there is an extra chunk of docs for                                        // 705
      // buffer if such is needed.                                                                                    // 706
      var cursor = self._cursorForQuery({ limit: self._limit * 2 });                                                  // 707
      try {                                                                                                           // 708
        cursor.forEach(function (doc, i) {  // yields                                                                 // 709
          if (!self._limit || i < self._limit)                                                                        // 710
            newResults.set(doc._id, doc);                                                                             // 711
          else                                                                                                        // 712
            newBuffer.set(doc._id, doc);                                                                              // 713
        });                                                                                                           // 714
        break;                                                                                                        // 715
      } catch (e) {                                                                                                   // 716
        if (options.initial && typeof(e.code) === 'number') {                                                         // 717
          // This is an error document sent to us by mongod, not a connection                                         // 718
          // error generated by the client. And we've never seen this query work                                      // 719
          // successfully. Probably it's a bad selector or something, so we                                           // 720
          // should NOT retry. Instead, we should halt the observe (which ends                                        // 721
          // up calling `stop` on us).                                                                                // 722
          self._multiplexer.queryError(e);                                                                            // 723
          return;                                                                                                     // 724
        }                                                                                                             // 725
                                                                                                                      // 726
        // During failover (eg) if we get an exception we should log and retry                                        // 727
        // instead of crashing.                                                                                       // 728
        Meteor._debug("Got exception while polling query: " + e);                                                     // 729
        Meteor._sleepForMs(100);                                                                                      // 730
      }                                                                                                               // 731
    }                                                                                                                 // 732
                                                                                                                      // 733
    if (self._stopped)                                                                                                // 734
      return;                                                                                                         // 735
                                                                                                                      // 736
    self._publishNewResults(newResults, newBuffer);                                                                   // 737
  },                                                                                                                  // 738
                                                                                                                      // 739
  // Transitions to QUERYING and runs another query, or (if already in QUERYING)                                      // 740
  // ensures that we will query again later.                                                                          // 741
  //                                                                                                                  // 742
  // This function may not block, because it is called from an oplog entry                                            // 743
  // handler. However, if we were not already in the QUERYING phase, it throws                                        // 744
  // an exception that is caught by the closest surrounding                                                           // 745
  // finishIfNeedToPollQuery call; this ensures that we don't continue running                                        // 746
  // close that was designed for another phase inside PHASE.QUERYING.                                                 // 747
  //                                                                                                                  // 748
  // (It's also necessary whenever logic in this file yields to check that other                                      // 749
  // phases haven't put us into QUERYING mode, though; eg,                                                            // 750
  // _fetchModifiedDocuments does this.)                                                                              // 751
  _needToPollQuery: function () {                                                                                     // 752
    var self = this;                                                                                                  // 753
    Meteor._noYieldsAllowed(function () {                                                                             // 754
      if (self._stopped)                                                                                              // 755
        return;                                                                                                       // 756
                                                                                                                      // 757
      // If we're not already in the middle of a query, we can query now                                              // 758
      // (possibly pausing FETCHING).                                                                                 // 759
      if (self._phase !== PHASE.QUERYING) {                                                                           // 760
        self._pollQuery();                                                                                            // 761
        throw new SwitchedToQuery;                                                                                    // 762
      }                                                                                                               // 763
                                                                                                                      // 764
      // We're currently in QUERYING. Set a flag to ensure that we run another                                        // 765
      // query when we're done.                                                                                       // 766
      self._requeryWhenDoneThisQuery = true;                                                                          // 767
    });                                                                                                               // 768
  },                                                                                                                  // 769
                                                                                                                      // 770
  // Yields!                                                                                                          // 771
  _doneQuerying: function () {                                                                                        // 772
    var self = this;                                                                                                  // 773
                                                                                                                      // 774
    if (self._stopped)                                                                                                // 775
      return;                                                                                                         // 776
    self._mongoHandle._oplogHandle.waitUntilCaughtUp();  // yields                                                    // 777
    if (self._stopped)                                                                                                // 778
      return;                                                                                                         // 779
    if (self._phase !== PHASE.QUERYING)                                                                               // 780
      throw Error("Phase unexpectedly " + self._phase);                                                               // 781
                                                                                                                      // 782
    Meteor._noYieldsAllowed(function () {                                                                             // 783
      if (self._requeryWhenDoneThisQuery) {                                                                           // 784
        self._requeryWhenDoneThisQuery = false;                                                                       // 785
        self._pollQuery();                                                                                            // 786
      } else if (self._needToFetch.empty()) {                                                                         // 787
        self._beSteady();                                                                                             // 788
      } else {                                                                                                        // 789
        self._fetchModifiedDocuments();                                                                               // 790
      }                                                                                                               // 791
    });                                                                                                               // 792
  },                                                                                                                  // 793
                                                                                                                      // 794
  _cursorForQuery: function (optionsOverwrite) {                                                                      // 795
    var self = this;                                                                                                  // 796
    return Meteor._noYieldsAllowed(function () {                                                                      // 797
      // The query we run is almost the same as the cursor we are observing,                                          // 798
      // with a few changes. We need to read all the fields that are relevant to                                      // 799
      // the selector, not just the fields we are going to publish (that's the                                        // 800
      // "shared" projection). And we don't want to apply any transform in the                                        // 801
      // cursor, because observeChanges shouldn't use the transform.                                                  // 802
      var options = _.clone(self._cursorDescription.options);                                                         // 803
                                                                                                                      // 804
      // Allow the caller to modify the options. Useful to specify different                                          // 805
      // skip and limit values.                                                                                       // 806
      _.extend(options, optionsOverwrite);                                                                            // 807
                                                                                                                      // 808
      options.fields = self._sharedProjection;                                                                        // 809
      delete options.transform;                                                                                       // 810
      // We are NOT deep cloning fields or selector here, which should be OK.                                         // 811
      var description = new CursorDescription(                                                                        // 812
        self._cursorDescription.collectionName,                                                                       // 813
        self._cursorDescription.selector,                                                                             // 814
        options);                                                                                                     // 815
      return new Cursor(self._mongoHandle, description);                                                              // 816
    });                                                                                                               // 817
  },                                                                                                                  // 818
                                                                                                                      // 819
                                                                                                                      // 820
  // Replace self._published with newResults (both are IdMaps), invoking observe                                      // 821
  // callbacks on the multiplexer.                                                                                    // 822
  // Replace self._unpublishedBuffer with newBuffer.                                                                  // 823
  //                                                                                                                  // 824
  // XXX This is very similar to LocalCollection._diffQueryUnorderedChanges. We                                       // 825
  // should really: (a) Unify IdMap and OrderedDict into Unordered/OrderedDict                                        // 826
  // (b) Rewrite diff.js to use these classes instead of arrays and objects.                                          // 827
  _publishNewResults: function (newResults, newBuffer) {                                                              // 828
    var self = this;                                                                                                  // 829
    Meteor._noYieldsAllowed(function () {                                                                             // 830
                                                                                                                      // 831
      // If the query is limited and there is a buffer, shut down so it doesn't                                       // 832
      // stay in a way.                                                                                               // 833
      if (self._limit) {                                                                                              // 834
        self._unpublishedBuffer.clear();                                                                              // 835
      }                                                                                                               // 836
                                                                                                                      // 837
      // First remove anything that's gone. Be careful not to modify                                                  // 838
      // self._published while iterating over it.                                                                     // 839
      var idsToRemove = [];                                                                                           // 840
      self._published.forEach(function (doc, id) {                                                                    // 841
        if (!newResults.has(id))                                                                                      // 842
          idsToRemove.push(id);                                                                                       // 843
      });                                                                                                             // 844
      _.each(idsToRemove, function (id) {                                                                             // 845
        self._removePublished(id);                                                                                    // 846
      });                                                                                                             // 847
                                                                                                                      // 848
      // Now do adds and changes.                                                                                     // 849
      // If self has a buffer and limit, the new fetched result will be                                               // 850
      // limited correctly as the query has sort specifier.                                                           // 851
      newResults.forEach(function (doc, id) {                                                                         // 852
        self._handleDoc(id, doc);                                                                                     // 853
      });                                                                                                             // 854
                                                                                                                      // 855
      // Sanity-check that everything we tried to put into _published ended up                                        // 856
      // there.                                                                                                       // 857
      // XXX if this is slow, remove it later                                                                         // 858
      if (self._published.size() !== newResults.size()) {                                                             // 859
        throw Error(                                                                                                  // 860
          "The Mongo server and the Meteor query disagree on how " +                                                  // 861
            "many documents match your query. Maybe it is hitting a Mongo " +                                         // 862
            "edge case? The query is: " +                                                                             // 863
            EJSON.stringify(self._cursorDescription.selector));                                                       // 864
      }                                                                                                               // 865
      self._published.forEach(function (doc, id) {                                                                    // 866
        if (!newResults.has(id))                                                                                      // 867
          throw Error("_published has a doc that newResults doesn't; " + id);                                         // 868
      });                                                                                                             // 869
                                                                                                                      // 870
      // Finally, replace the buffer                                                                                  // 871
      newBuffer.forEach(function (doc, id) {                                                                          // 872
        self._addBuffered(id, doc);                                                                                   // 873
      });                                                                                                             // 874
                                                                                                                      // 875
      self._safeAppendToBuffer = newBuffer.size() < self._limit;                                                      // 876
    });                                                                                                               // 877
  },                                                                                                                  // 878
                                                                                                                      // 879
  // This stop function is invoked from the onStop of the ObserveMultiplexer, so                                      // 880
  // it shouldn't actually be possible to call it until the multiplexer is                                            // 881
  // ready.                                                                                                           // 882
  //                                                                                                                  // 883
  // It's important to check self._stopped after every call in this file that                                         // 884
  // can yield!                                                                                                       // 885
  stop: function () {                                                                                                 // 886
    var self = this;                                                                                                  // 887
    if (self._stopped)                                                                                                // 888
      return;                                                                                                         // 889
    self._stopped = true;                                                                                             // 890
    _.each(self._stopHandles, function (handle) {                                                                     // 891
      handle.stop();                                                                                                  // 892
    });                                                                                                               // 893
                                                                                                                      // 894
    // Note: we *don't* use multiplexer.onFlush here because this stop                                                // 895
    // callback is actually invoked by the multiplexer itself when it has                                             // 896
    // determined that there are no handles left. So nothing is actually going                                        // 897
    // to get flushed (and it's probably not valid to call methods on the                                             // 898
    // dying multiplexer).                                                                                            // 899
    _.each(self._writesToCommitWhenWeReachSteady, function (w) {                                                      // 900
      w.committed();  // maybe yields?                                                                                // 901
    });                                                                                                               // 902
    self._writesToCommitWhenWeReachSteady = null;                                                                     // 903
                                                                                                                      // 904
    // Proactively drop references to potentially big things.                                                         // 905
    self._published = null;                                                                                           // 906
    self._unpublishedBuffer = null;                                                                                   // 907
    self._needToFetch = null;                                                                                         // 908
    self._currentlyFetching = null;                                                                                   // 909
    self._oplogEntryHandle = null;                                                                                    // 910
    self._listenersHandle = null;                                                                                     // 911
                                                                                                                      // 912
    Package.facts && Package.facts.Facts.incrementServerFact(                                                         // 913
      "mongo-livedata", "observe-drivers-oplog", -1);                                                                 // 914
  },                                                                                                                  // 915
                                                                                                                      // 916
  _registerPhaseChange: function (phase) {                                                                            // 917
    var self = this;                                                                                                  // 918
    Meteor._noYieldsAllowed(function () {                                                                             // 919
      var now = new Date;                                                                                             // 920
                                                                                                                      // 921
      if (self._phase) {                                                                                              // 922
        var timeDiff = now - self._phaseStartTime;                                                                    // 923
        Package.facts && Package.facts.Facts.incrementServerFact(                                                     // 924
          "mongo-livedata", "time-spent-in-" + self._phase + "-phase", timeDiff);                                     // 925
      }                                                                                                               // 926
                                                                                                                      // 927
      self._phase = phase;                                                                                            // 928
      self._phaseStartTime = now;                                                                                     // 929
    });                                                                                                               // 930
  }                                                                                                                   // 931
});                                                                                                                   // 932
                                                                                                                      // 933
// Does our oplog tailing code support this cursor? For now, we are being very                                        // 934
// conservative and allowing only simple queries with simple options.                                                 // 935
// (This is a "static method".)                                                                                       // 936
OplogObserveDriver.cursorSupported = function (cursorDescription, matcher) {                                          // 937
  // First, check the options.                                                                                        // 938
  var options = cursorDescription.options;                                                                            // 939
                                                                                                                      // 940
  // Did the user say no explicitly?                                                                                  // 941
  if (options._disableOplog)                                                                                          // 942
    return false;                                                                                                     // 943
                                                                                                                      // 944
  // skip is not supported: to support it we would need to keep track of all                                          // 945
  // "skipped" documents or at least their ids.                                                                       // 946
  // limit w/o a sort specifier is not supported: current implementation needs a                                      // 947
  // deterministic way to order documents.                                                                            // 948
  if (options.skip || (options.limit && !options.sort)) return false;                                                 // 949
                                                                                                                      // 950
  // If a fields projection option is given check if it is supported by                                               // 951
  // minimongo (some operators are not supported).                                                                    // 952
  if (options.fields) {                                                                                               // 953
    try {                                                                                                             // 954
      LocalCollection._checkSupportedProjection(options.fields);                                                      // 955
    } catch (e) {                                                                                                     // 956
      if (e.name === "MinimongoError")                                                                                // 957
        return false;                                                                                                 // 958
      else                                                                                                            // 959
        throw e;                                                                                                      // 960
    }                                                                                                                 // 961
  }                                                                                                                   // 962
                                                                                                                      // 963
  // We don't allow the following selectors:                                                                          // 964
  //   - $where (not confident that we provide the same JS environment                                                // 965
  //             as Mongo, and can yield!)                                                                            // 966
  //   - $near (has "interesting" properties in MongoDB, like the possibility                                         // 967
  //            of returning an ID multiple times, though even polling maybe                                          // 968
  //            have a bug there)                                                                                     // 969
  //           XXX: once we support it, we would need to think more on how we                                         // 970
  //           initialize the comparators when we create the driver.                                                  // 971
  return !matcher.hasWhere() && !matcher.hasGeoQuery();                                                               // 972
};                                                                                                                    // 973
                                                                                                                      // 974
var modifierCanBeDirectlyApplied = function (modifier) {                                                              // 975
  return _.all(modifier, function (fields, operation) {                                                               // 976
    return _.all(fields, function (value, field) {                                                                    // 977
      return !/EJSON\$/.test(field);                                                                                  // 978
    });                                                                                                               // 979
  });                                                                                                                 // 980
};                                                                                                                    // 981
                                                                                                                      // 982
MongoInternals.OplogObserveDriver = OplogObserveDriver;                                                               // 983
                                                                                                                      // 984
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/local_collection_driver.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
LocalCollectionDriver = function () {                                                                                 // 1
  var self = this;                                                                                                    // 2
  self.noConnCollections = {};                                                                                        // 3
};                                                                                                                    // 4
                                                                                                                      // 5
var ensureCollection = function (name, collections) {                                                                 // 6
  if (!(name in collections))                                                                                         // 7
    collections[name] = new LocalCollection(name);                                                                    // 8
  return collections[name];                                                                                           // 9
};                                                                                                                    // 10
                                                                                                                      // 11
_.extend(LocalCollectionDriver.prototype, {                                                                           // 12
  open: function (name, conn) {                                                                                       // 13
    var self = this;                                                                                                  // 14
    if (!name)                                                                                                        // 15
      return new LocalCollection;                                                                                     // 16
    if (! conn) {                                                                                                     // 17
      return ensureCollection(name, self.noConnCollections);                                                          // 18
    }                                                                                                                 // 19
    if (! conn._mongo_livedata_collections)                                                                           // 20
      conn._mongo_livedata_collections = {};                                                                          // 21
    // XXX is there a way to keep track of a connection's collections without                                         // 22
    // dangling it off the connection object?                                                                         // 23
    return ensureCollection(name, conn._mongo_livedata_collections);                                                  // 24
  }                                                                                                                   // 25
});                                                                                                                   // 26
                                                                                                                      // 27
// singleton                                                                                                          // 28
LocalCollectionDriver = new LocalCollectionDriver;                                                                    // 29
                                                                                                                      // 30
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/remote_collection_driver.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
MongoInternals.RemoteCollectionDriver = function (                                                                    // 1
  mongo_url, options) {                                                                                               // 2
  var self = this;                                                                                                    // 3
  self.mongo = new MongoConnection(mongo_url, options);                                                               // 4
};                                                                                                                    // 5
                                                                                                                      // 6
_.extend(MongoInternals.RemoteCollectionDriver.prototype, {                                                           // 7
  open: function (name) {                                                                                             // 8
    var self = this;                                                                                                  // 9
    var ret = {};                                                                                                     // 10
    _.each(                                                                                                           // 11
      ['find', 'findOne', 'insert', 'update', 'upsert',                                                               // 12
       'remove', '_ensureIndex', '_dropIndex', '_createCappedCollection',                                             // 13
       'dropCollection', 'rawCollection'],                                                                            // 14
      function (m) {                                                                                                  // 15
        ret[m] = _.bind(self.mongo[m], self.mongo, name);                                                             // 16
      });                                                                                                             // 17
    return ret;                                                                                                       // 18
  }                                                                                                                   // 19
});                                                                                                                   // 20
                                                                                                                      // 21
                                                                                                                      // 22
// Create the singleton RemoteCollectionDriver only on demand, so we                                                  // 23
// only require Mongo configuration if it's actually used (eg, not if                                                 // 24
// you're only trying to receive data from a remote DDP server.)                                                      // 25
MongoInternals.defaultRemoteCollectionDriver = _.once(function () {                                                   // 26
  var connectionOptions = {};                                                                                         // 27
                                                                                                                      // 28
  var mongoUrl = process.env.MONGO_URL;                                                                               // 29
                                                                                                                      // 30
  if (process.env.MONGO_OPLOG_URL) {                                                                                  // 31
    connectionOptions.oplogUrl = process.env.MONGO_OPLOG_URL;                                                         // 32
  }                                                                                                                   // 33
                                                                                                                      // 34
  if (! mongoUrl)                                                                                                     // 35
    throw new Error("MONGO_URL must be set in environment");                                                          // 36
                                                                                                                      // 37
  return new MongoInternals.RemoteCollectionDriver(mongoUrl, connectionOptions);                                      // 38
});                                                                                                                   // 39
                                                                                                                      // 40
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/collection.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// options.connection, if given, is a LivedataClient or LivedataServer                                                // 1
// XXX presently there is no way to destroy/clean up a Collection                                                     // 2
                                                                                                                      // 3
/**                                                                                                                   // 4
 * @summary Namespace for MongoDB-related items                                                                       // 5
 * @namespace                                                                                                         // 6
 */                                                                                                                   // 7
Mongo = {};                                                                                                           // 8
                                                                                                                      // 9
/**                                                                                                                   // 10
 * @summary Constructor for a Collection                                                                              // 11
 * @locus Anywhere                                                                                                    // 12
 * @instancename collection                                                                                           // 13
 * @class                                                                                                             // 14
 * @param {String} name The name of the collection.  If null, creates an unmanaged (unsynchronized) local collection. // 15
 * @param {Object} [options]                                                                                          // 16
 * @param {Object} options.connection The server connection that will manage this collection. Uses the default connection if not specified.  Pass the return value of calling [`DDP.connect`](#ddp_connect) to specify a different server. Pass `null` to specify no connection. Unmanaged (`name` is null) collections cannot specify a connection.
 * @param {String} options.idGeneration The method of generating the `_id` fields of new documents in this collection.  Possible values:
                                                                                                                      // 19
 - **`'STRING'`**: random strings                                                                                     // 20
 - **`'MONGO'`**:  random [`Mongo.ObjectID`](#mongo_object_id) values                                                 // 21
                                                                                                                      // 22
The default id generation technique is `'STRING'`.                                                                    // 23
 * @param {Function} options.transform An optional transformation function. Documents will be passed through this function before being returned from `fetch` or `findOne`, and before being passed to callbacks of `observe`, `map`, `forEach`, `allow`, and `deny`. Transforms are *not* applied for the callbacks of `observeChanges` or to cursors returned from publish functions.
 */                                                                                                                   // 25
Mongo.Collection = function (name, options) {                                                                         // 26
  var self = this;                                                                                                    // 27
  if (! (self instanceof Mongo.Collection))                                                                           // 28
    throw new Error('use "new" to construct a Mongo.Collection');                                                     // 29
                                                                                                                      // 30
  if (!name && (name !== null)) {                                                                                     // 31
    Meteor._debug("Warning: creating anonymous collection. It will not be " +                                         // 32
                  "saved or synchronized over the network. (Pass null for " +                                         // 33
                  "the collection name to turn off this warning.)");                                                  // 34
    name = null;                                                                                                      // 35
  }                                                                                                                   // 36
                                                                                                                      // 37
  if (name !== null && typeof name !== "string") {                                                                    // 38
    throw new Error(                                                                                                  // 39
      "First argument to new Mongo.Collection must be a string or null");                                             // 40
  }                                                                                                                   // 41
                                                                                                                      // 42
  if (options && options.methods) {                                                                                   // 43
    // Backwards compatibility hack with original signature (which passed                                             // 44
    // "connection" directly instead of in options. (Connections must have a "methods"                                // 45
    // method.)                                                                                                       // 46
    // XXX remove before 1.0                                                                                          // 47
    options = {connection: options};                                                                                  // 48
  }                                                                                                                   // 49
  // Backwards compatibility: "connection" used to be called "manager".                                               // 50
  if (options && options.manager && !options.connection) {                                                            // 51
    options.connection = options.manager;                                                                             // 52
  }                                                                                                                   // 53
  options = _.extend({                                                                                                // 54
    connection: undefined,                                                                                            // 55
    idGeneration: 'STRING',                                                                                           // 56
    transform: null,                                                                                                  // 57
    _driver: undefined,                                                                                               // 58
    _preventAutopublish: false                                                                                        // 59
  }, options);                                                                                                        // 60
                                                                                                                      // 61
  switch (options.idGeneration) {                                                                                     // 62
  case 'MONGO':                                                                                                       // 63
    self._makeNewID = function () {                                                                                   // 64
      var src = name ? DDP.randomStream('/collection/' + name) : Random;                                              // 65
      return new Mongo.ObjectID(src.hexString(24));                                                                   // 66
    };                                                                                                                // 67
    break;                                                                                                            // 68
  case 'STRING':                                                                                                      // 69
  default:                                                                                                            // 70
    self._makeNewID = function () {                                                                                   // 71
      var src = name ? DDP.randomStream('/collection/' + name) : Random;                                              // 72
      return src.id();                                                                                                // 73
    };                                                                                                                // 74
    break;                                                                                                            // 75
  }                                                                                                                   // 76
                                                                                                                      // 77
  self._transform = LocalCollection.wrapTransform(options.transform);                                                 // 78
                                                                                                                      // 79
  if (! name || options.connection === null)                                                                          // 80
    // note: nameless collections never have a connection                                                             // 81
    self._connection = null;                                                                                          // 82
  else if (options.connection)                                                                                        // 83
    self._connection = options.connection;                                                                            // 84
  else if (Meteor.isClient)                                                                                           // 85
    self._connection = Meteor.connection;                                                                             // 86
  else                                                                                                                // 87
    self._connection = Meteor.server;                                                                                 // 88
                                                                                                                      // 89
  if (!options._driver) {                                                                                             // 90
    // XXX This check assumes that webapp is loaded so that Meteor.server !==                                         // 91
    // null. We should fully support the case of "want to use a Mongo-backed                                          // 92
    // collection from Node code without webapp", but we don't yet.                                                   // 93
    // #MeteorServerNull                                                                                              // 94
    if (name && self._connection === Meteor.server &&                                                                 // 95
        typeof MongoInternals !== "undefined" &&                                                                      // 96
        MongoInternals.defaultRemoteCollectionDriver) {                                                               // 97
      options._driver = MongoInternals.defaultRemoteCollectionDriver();                                               // 98
    } else {                                                                                                          // 99
      options._driver = LocalCollectionDriver;                                                                        // 100
    }                                                                                                                 // 101
  }                                                                                                                   // 102
                                                                                                                      // 103
  self._collection = options._driver.open(name, self._connection);                                                    // 104
  self._name = name;                                                                                                  // 105
  self._driver = options._driver;                                                                                     // 106
                                                                                                                      // 107
  if (self._connection && self._connection.registerStore) {                                                           // 108
    // OK, we're going to be a slave, replicating some remote                                                         // 109
    // database, except possibly with some temporary divergence while                                                 // 110
    // we have unacknowledged RPC's.                                                                                  // 111
    var ok = self._connection.registerStore(name, {                                                                   // 112
      // Called at the beginning of a batch of updates. batchSize is the number                                       // 113
      // of update calls to expect.                                                                                   // 114
      //                                                                                                              // 115
      // XXX This interface is pretty janky. reset probably ought to go back to                                       // 116
      // being its own function, and callers shouldn't have to calculate                                              // 117
      // batchSize. The optimization of not calling pause/remove should be                                            // 118
      // delayed until later: the first call to update() should buffer its                                            // 119
      // message, and then we can either directly apply it at endUpdate time if                                       // 120
      // it was the only update, or do pauseObservers/apply/apply at the next                                         // 121
      // update() if there's another one.                                                                             // 122
      beginUpdate: function (batchSize, reset) {                                                                      // 123
        // pause observers so users don't see flicker when updating several                                           // 124
        // objects at once (including the post-reconnect reset-and-reapply                                            // 125
        // stage), and so that a re-sorting of a query can take advantage of the                                      // 126
        // full _diffQuery moved calculation instead of applying change one at a                                      // 127
        // time.                                                                                                      // 128
        if (batchSize > 1 || reset)                                                                                   // 129
          self._collection.pauseObservers();                                                                          // 130
                                                                                                                      // 131
        if (reset)                                                                                                    // 132
          self._collection.remove({});                                                                                // 133
      },                                                                                                              // 134
                                                                                                                      // 135
      // Apply an update.                                                                                             // 136
      // XXX better specify this interface (not in terms of a wire message)?                                          // 137
      update: function (msg) {                                                                                        // 138
        var mongoId = LocalCollection._idParse(msg.id);                                                               // 139
        var doc = self._collection.findOne(mongoId);                                                                  // 140
                                                                                                                      // 141
        // Is this a "replace the whole doc" message coming from the quiescence                                       // 142
        // of method writes to an object? (Note that 'undefined' is a valid                                           // 143
        // value meaning "remove it".)                                                                                // 144
        if (msg.msg === 'replace') {                                                                                  // 145
          var replace = msg.replace;                                                                                  // 146
          if (!replace) {                                                                                             // 147
            if (doc)                                                                                                  // 148
              self._collection.remove(mongoId);                                                                       // 149
          } else if (!doc) {                                                                                          // 150
            self._collection.insert(replace);                                                                         // 151
          } else {                                                                                                    // 152
            // XXX check that replace has no $ ops                                                                    // 153
            self._collection.update(mongoId, replace);                                                                // 154
          }                                                                                                           // 155
          return;                                                                                                     // 156
        } else if (msg.msg === 'added') {                                                                             // 157
          if (doc) {                                                                                                  // 158
            throw new Error("Expected not to find a document already present for an add");                            // 159
          }                                                                                                           // 160
          self._collection.insert(_.extend({_id: mongoId}, msg.fields));                                              // 161
        } else if (msg.msg === 'removed') {                                                                           // 162
          if (!doc)                                                                                                   // 163
            throw new Error("Expected to find a document already present for removed");                               // 164
          self._collection.remove(mongoId);                                                                           // 165
        } else if (msg.msg === 'changed') {                                                                           // 166
          if (!doc)                                                                                                   // 167
            throw new Error("Expected to find a document to change");                                                 // 168
          if (!_.isEmpty(msg.fields)) {                                                                               // 169
            var modifier = {};                                                                                        // 170
            _.each(msg.fields, function (value, key) {                                                                // 171
              if (value === undefined) {                                                                              // 172
                if (!modifier.$unset)                                                                                 // 173
                  modifier.$unset = {};                                                                               // 174
                modifier.$unset[key] = 1;                                                                             // 175
              } else {                                                                                                // 176
                if (!modifier.$set)                                                                                   // 177
                  modifier.$set = {};                                                                                 // 178
                modifier.$set[key] = value;                                                                           // 179
              }                                                                                                       // 180
            });                                                                                                       // 181
            self._collection.update(mongoId, modifier);                                                               // 182
          }                                                                                                           // 183
        } else {                                                                                                      // 184
          throw new Error("I don't know how to deal with this message");                                              // 185
        }                                                                                                             // 186
                                                                                                                      // 187
      },                                                                                                              // 188
                                                                                                                      // 189
      // Called at the end of a batch of updates.                                                                     // 190
      endUpdate: function () {                                                                                        // 191
        self._collection.resumeObservers();                                                                           // 192
      },                                                                                                              // 193
                                                                                                                      // 194
      // Called around method stub invocations to capture the original versions                                       // 195
      // of modified documents.                                                                                       // 196
      saveOriginals: function () {                                                                                    // 197
        self._collection.saveOriginals();                                                                             // 198
      },                                                                                                              // 199
      retrieveOriginals: function () {                                                                                // 200
        return self._collection.retrieveOriginals();                                                                  // 201
      }                                                                                                               // 202
    });                                                                                                               // 203
                                                                                                                      // 204
    if (!ok)                                                                                                          // 205
      throw new Error("There is already a collection named '" + name + "'");                                          // 206
  }                                                                                                                   // 207
                                                                                                                      // 208
  self._defineMutationMethods();                                                                                      // 209
                                                                                                                      // 210
  // autopublish                                                                                                      // 211
  if (Package.autopublish && !options._preventAutopublish && self._connection                                         // 212
      && self._connection.publish) {                                                                                  // 213
    self._connection.publish(null, function () {                                                                      // 214
      return self.find();                                                                                             // 215
    }, {is_auto: true});                                                                                              // 216
  }                                                                                                                   // 217
};                                                                                                                    // 218
                                                                                                                      // 219
///                                                                                                                   // 220
/// Main collection API                                                                                               // 221
///                                                                                                                   // 222
                                                                                                                      // 223
                                                                                                                      // 224
_.extend(Mongo.Collection.prototype, {                                                                                // 225
                                                                                                                      // 226
  _getFindSelector: function (args) {                                                                                 // 227
    if (args.length == 0)                                                                                             // 228
      return {};                                                                                                      // 229
    else                                                                                                              // 230
      return args[0];                                                                                                 // 231
  },                                                                                                                  // 232
                                                                                                                      // 233
  _getFindOptions: function (args) {                                                                                  // 234
    var self = this;                                                                                                  // 235
    if (args.length < 2) {                                                                                            // 236
      return { transform: self._transform };                                                                          // 237
    } else {                                                                                                          // 238
      check(args[1], Match.Optional(Match.ObjectIncluding({                                                           // 239
        fields: Match.Optional(Match.OneOf(Object, undefined)),                                                       // 240
        sort: Match.Optional(Match.OneOf(Object, Array, undefined)),                                                  // 241
        limit: Match.Optional(Match.OneOf(Number, undefined)),                                                        // 242
        skip: Match.Optional(Match.OneOf(Number, undefined))                                                          // 243
     })));                                                                                                            // 244
                                                                                                                      // 245
      return _.extend({                                                                                               // 246
        transform: self._transform                                                                                    // 247
      }, args[1]);                                                                                                    // 248
    }                                                                                                                 // 249
  },                                                                                                                  // 250
                                                                                                                      // 251
  /**                                                                                                                 // 252
   * @summary Find the documents in a collection that match the selector.                                             // 253
   * @locus Anywhere                                                                                                  // 254
   * @method find                                                                                                     // 255
   * @memberOf Mongo.Collection                                                                                       // 256
   * @instance                                                                                                        // 257
   * @param {MongoSelector} [selector] A query describing the documents to find                                       // 258
   * @param {Object} [options]                                                                                        // 259
   * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)                                     // 260
   * @param {Number} options.skip Number of results to skip at the beginning                                          // 261
   * @param {Number} options.limit Maximum number of results to return                                                // 262
   * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.                           // 263
   * @param {Boolean} options.reactive (Client only) Default `true`; pass `false` to disable reactivity               // 264
   * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
   * @returns {Mongo.Cursor}                                                                                          // 266
   */                                                                                                                 // 267
  find: function (/* selector, options */) {                                                                          // 268
    // Collection.find() (return all docs) behaves differently                                                        // 269
    // from Collection.find(undefined) (return 0 docs).  so be                                                        // 270
    // careful about the length of arguments.                                                                         // 271
    var self = this;                                                                                                  // 272
    var argArray = _.toArray(arguments);                                                                              // 273
    return self._collection.find(self._getFindSelector(argArray),                                                     // 274
                                 self._getFindOptions(argArray));                                                     // 275
  },                                                                                                                  // 276
                                                                                                                      // 277
  /**                                                                                                                 // 278
   * @summary Finds the first document that matches the selector, as ordered by sort and skip options.                // 279
   * @locus Anywhere                                                                                                  // 280
   * @method findOne                                                                                                  // 281
   * @memberOf Mongo.Collection                                                                                       // 282
   * @instance                                                                                                        // 283
   * @param {MongoSelector} [selector] A query describing the documents to find                                       // 284
   * @param {Object} [options]                                                                                        // 285
   * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)                                     // 286
   * @param {Number} options.skip Number of results to skip at the beginning                                          // 287
   * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.                           // 288
   * @param {Boolean} options.reactive (Client only) Default true; pass false to disable reactivity                   // 289
   * @param {Function} options.transform Overrides `transform` on the [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
   * @returns {Object}                                                                                                // 291
   */                                                                                                                 // 292
  findOne: function (/* selector, options */) {                                                                       // 293
    var self = this;                                                                                                  // 294
    var argArray = _.toArray(arguments);                                                                              // 295
    return self._collection.findOne(self._getFindSelector(argArray),                                                  // 296
                                    self._getFindOptions(argArray));                                                  // 297
  }                                                                                                                   // 298
                                                                                                                      // 299
});                                                                                                                   // 300
                                                                                                                      // 301
Mongo.Collection._publishCursor = function (cursor, sub, collection) {                                                // 302
  var observeHandle = cursor.observeChanges({                                                                         // 303
    added: function (id, fields) {                                                                                    // 304
      sub.added(collection, id, fields);                                                                              // 305
    },                                                                                                                // 306
    changed: function (id, fields) {                                                                                  // 307
      sub.changed(collection, id, fields);                                                                            // 308
    },                                                                                                                // 309
    removed: function (id) {                                                                                          // 310
      sub.removed(collection, id);                                                                                    // 311
    }                                                                                                                 // 312
  });                                                                                                                 // 313
                                                                                                                      // 314
  // We don't call sub.ready() here: it gets called in livedata_server, after                                         // 315
  // possibly calling _publishCursor on multiple returned cursors.                                                    // 316
                                                                                                                      // 317
  // register stop callback (expects lambda w/ no args).                                                              // 318
  sub.onStop(function () {observeHandle.stop();});                                                                    // 319
};                                                                                                                    // 320
                                                                                                                      // 321
// protect against dangerous selectors.  falsey and {_id: falsey} are both                                            // 322
// likely programmer error, and not what you want, particularly for destructive                                       // 323
// operations.  JS regexps don't serialize over DDP but can be trivially                                              // 324
// replaced by $regex.                                                                                                // 325
Mongo.Collection._rewriteSelector = function (selector) {                                                             // 326
  // shorthand -- scalars match _id                                                                                   // 327
  if (LocalCollection._selectorIsId(selector))                                                                        // 328
    selector = {_id: selector};                                                                                       // 329
                                                                                                                      // 330
  if (!selector || (('_id' in selector) && !selector._id))                                                            // 331
    // can't match anything                                                                                           // 332
    return {_id: Random.id()};                                                                                        // 333
                                                                                                                      // 334
  var ret = {};                                                                                                       // 335
  _.each(selector, function (value, key) {                                                                            // 336
    // Mongo supports both {field: /foo/} and {field: {$regex: /foo/}}                                                // 337
    if (value instanceof RegExp) {                                                                                    // 338
      ret[key] = convertRegexpToMongoSelector(value);                                                                 // 339
    } else if (value && value.$regex instanceof RegExp) {                                                             // 340
      ret[key] = convertRegexpToMongoSelector(value.$regex);                                                          // 341
      // if value is {$regex: /foo/, $options: ...} then $options                                                     // 342
      // override the ones set on $regex.                                                                             // 343
      if (value.$options !== undefined)                                                                               // 344
        ret[key].$options = value.$options;                                                                           // 345
    }                                                                                                                 // 346
    else if (_.contains(['$or','$and','$nor'], key)) {                                                                // 347
      // Translate lower levels of $and/$or/$nor                                                                      // 348
      ret[key] = _.map(value, function (v) {                                                                          // 349
        return Mongo.Collection._rewriteSelector(v);                                                                  // 350
      });                                                                                                             // 351
    } else {                                                                                                          // 352
      ret[key] = value;                                                                                               // 353
    }                                                                                                                 // 354
  });                                                                                                                 // 355
  return ret;                                                                                                         // 356
};                                                                                                                    // 357
                                                                                                                      // 358
// convert a JS RegExp object to a Mongo {$regex: ..., $options: ...}                                                 // 359
// selector                                                                                                           // 360
var convertRegexpToMongoSelector = function (regexp) {                                                                // 361
  check(regexp, RegExp); // safety belt                                                                               // 362
                                                                                                                      // 363
  var selector = {$regex: regexp.source};                                                                             // 364
  var regexOptions = '';                                                                                              // 365
  // JS RegExp objects support 'i', 'm', and 'g'. Mongo regex $options                                                // 366
  // support 'i', 'm', 'x', and 's'. So we support 'i' and 'm' here.                                                  // 367
  if (regexp.ignoreCase)                                                                                              // 368
    regexOptions += 'i';                                                                                              // 369
  if (regexp.multiline)                                                                                               // 370
    regexOptions += 'm';                                                                                              // 371
  if (regexOptions)                                                                                                   // 372
    selector.$options = regexOptions;                                                                                 // 373
                                                                                                                      // 374
  return selector;                                                                                                    // 375
};                                                                                                                    // 376
                                                                                                                      // 377
var throwIfSelectorIsNotId = function (selector, methodName) {                                                        // 378
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {                                                      // 379
    throw new Meteor.Error(                                                                                           // 380
      403, "Not permitted. Untrusted code may only " + methodName +                                                   // 381
        " documents by ID.");                                                                                         // 382
  }                                                                                                                   // 383
};                                                                                                                    // 384
                                                                                                                      // 385
// 'insert' immediately returns the inserted document's new _id.                                                      // 386
// The others return values immediately if you are in a stub, an in-memory                                            // 387
// unmanaged collection, or a mongo-backed collection and you don't pass a                                            // 388
// callback. 'update' and 'remove' return the number of affected                                                      // 389
// documents. 'upsert' returns an object with keys 'numberAffected' and, if an                                        // 390
// insert happened, 'insertedId'.                                                                                     // 391
//                                                                                                                    // 392
// Otherwise, the semantics are exactly like other methods: they take                                                 // 393
// a callback as an optional last argument; if no callback is                                                         // 394
// provided, they block until the operation is complete, and throw an                                                 // 395
// exception if it fails; if a callback is provided, then they don't                                                  // 396
// necessarily block, and they call the callback when they finish with error and                                      // 397
// result arguments.  (The insert method provides the document ID as its result;                                      // 398
// update and remove provide the number of affected docs as the result; upsert                                        // 399
// provides an object with numberAffected and maybe insertedId.)                                                      // 400
//                                                                                                                    // 401
// On the client, blocking is impossible, so if a callback                                                            // 402
// isn't provided, they just return immediately and any error                                                         // 403
// information is lost.                                                                                               // 404
//                                                                                                                    // 405
// There's one more tweak. On the client, if you don't provide a                                                      // 406
// callback, then if there is an error, a message will be logged with                                                 // 407
// Meteor._debug.                                                                                                     // 408
//                                                                                                                    // 409
// The intent (though this is actually determined by the underlying                                                   // 410
// drivers) is that the operations should be done synchronously, not                                                  // 411
// generating their result until the database has acknowledged                                                        // 412
// them. In the future maybe we should provide a flag to turn this                                                    // 413
// off.                                                                                                               // 414
                                                                                                                      // 415
/**                                                                                                                   // 416
 * @summary Insert a document in the collection.  Returns its unique _id.                                             // 417
 * @locus Anywhere                                                                                                    // 418
 * @method  insert                                                                                                    // 419
 * @memberOf Mongo.Collection                                                                                         // 420
 * @instance                                                                                                          // 421
 * @param {Object} doc The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the _id as the second.
 */                                                                                                                   // 424
                                                                                                                      // 425
/**                                                                                                                   // 426
 * @summary Modify one or more documents in the collection. Returns the number of affected documents.                 // 427
 * @locus Anywhere                                                                                                    // 428
 * @method update                                                                                                     // 429
 * @memberOf Mongo.Collection                                                                                         // 430
 * @instance                                                                                                          // 431
 * @param {MongoSelector} selector Specifies which documents to modify                                                // 432
 * @param {MongoModifier} modifier Specifies how to modify the documents                                              // 433
 * @param {Object} [options]                                                                                          // 434
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Boolean} options.upsert True to insert a document if no matching documents are found.                      // 436
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 */                                                                                                                   // 438
                                                                                                                      // 439
/**                                                                                                                   // 440
 * @summary Remove documents from the collection                                                                      // 441
 * @locus Anywhere                                                                                                    // 442
 * @method remove                                                                                                     // 443
 * @memberOf Mongo.Collection                                                                                         // 444
 * @instance                                                                                                          // 445
 * @param {MongoSelector} selector Specifies which documents to remove                                                // 446
 * @param {Function} [callback] Optional.  If present, called with an error object as its argument.                   // 447
 */                                                                                                                   // 448
                                                                                                                      // 449
_.each(["insert", "update", "remove"], function (name) {                                                              // 450
  Mongo.Collection.prototype[name] = function (/* arguments */) {                                                     // 451
    var self = this;                                                                                                  // 452
    var args = _.toArray(arguments);                                                                                  // 453
    var callback;                                                                                                     // 454
    var insertId;                                                                                                     // 455
    var ret;                                                                                                          // 456
                                                                                                                      // 457
    // Pull off any callback (or perhaps a 'callback' variable that was passed                                        // 458
    // in undefined, like how 'upsert' does it).                                                                      // 459
    if (args.length &&                                                                                                // 460
        (args[args.length - 1] === undefined ||                                                                       // 461
         args[args.length - 1] instanceof Function)) {                                                                // 462
      callback = args.pop();                                                                                          // 463
    }                                                                                                                 // 464
                                                                                                                      // 465
    if (name === "insert") {                                                                                          // 466
      if (!args.length)                                                                                               // 467
        throw new Error("insert requires an argument");                                                               // 468
      // shallow-copy the document and generate an ID                                                                 // 469
      args[0] = _.extend({}, args[0]);                                                                                // 470
      if ('_id' in args[0]) {                                                                                         // 471
        insertId = args[0]._id;                                                                                       // 472
        if (!insertId || !(typeof insertId === 'string'                                                               // 473
              || insertId instanceof Mongo.ObjectID))                                                                 // 474
          throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs");                // 475
      } else {                                                                                                        // 476
        var generateId = true;                                                                                        // 477
        // Don't generate the id if we're the client and the 'outermost' call                                         // 478
        // This optimization saves us passing both the randomSeed and the id                                          // 479
        // Passing both is redundant.                                                                                 // 480
        if (self._connection && self._connection !== Meteor.server) {                                                 // 481
          var enclosing = DDP._CurrentInvocation.get();                                                               // 482
          if (!enclosing) {                                                                                           // 483
            generateId = false;                                                                                       // 484
          }                                                                                                           // 485
        }                                                                                                             // 486
        if (generateId) {                                                                                             // 487
          insertId = args[0]._id = self._makeNewID();                                                                 // 488
        }                                                                                                             // 489
      }                                                                                                               // 490
    } else {                                                                                                          // 491
      args[0] = Mongo.Collection._rewriteSelector(args[0]);                                                           // 492
                                                                                                                      // 493
      if (name === "update") {                                                                                        // 494
        // Mutate args but copy the original options object. We need to add                                           // 495
        // insertedId to options, but don't want to mutate the caller's options                                       // 496
        // object. We need to mutate `args` because we pass `args` into the                                           // 497
        // driver below.                                                                                              // 498
        var options = args[2] = _.clone(args[2]) || {};                                                               // 499
        if (options && typeof options !== "function" && options.upsert) {                                             // 500
          // set `insertedId` if absent.  `insertedId` is a Meteor extension.                                         // 501
          if (options.insertedId) {                                                                                   // 502
            if (!(typeof options.insertedId === 'string'                                                              // 503
                  || options.insertedId instanceof Mongo.ObjectID))                                                   // 504
              throw new Error("insertedId must be string or ObjectID");                                               // 505
          } else if (! args[0]._id) {                                                                                 // 506
            options.insertedId = self._makeNewID();                                                                   // 507
          }                                                                                                           // 508
        }                                                                                                             // 509
      }                                                                                                               // 510
    }                                                                                                                 // 511
                                                                                                                      // 512
    // On inserts, always return the id that we generated; on all other                                               // 513
    // operations, just return the result from the collection.                                                        // 514
    var chooseReturnValueFromCollectionResult = function (result) {                                                   // 515
      if (name === "insert") {                                                                                        // 516
        if (!insertId && result) {                                                                                    // 517
          insertId = result;                                                                                          // 518
        }                                                                                                             // 519
        return insertId;                                                                                              // 520
      } else {                                                                                                        // 521
        return result;                                                                                                // 522
      }                                                                                                               // 523
    };                                                                                                                // 524
                                                                                                                      // 525
    var wrappedCallback;                                                                                              // 526
    if (callback) {                                                                                                   // 527
      wrappedCallback = function (error, result) {                                                                    // 528
        callback(error, ! error && chooseReturnValueFromCollectionResult(result));                                    // 529
      };                                                                                                              // 530
    }                                                                                                                 // 531
                                                                                                                      // 532
    // XXX see #MeteorServerNull                                                                                      // 533
    if (self._connection && self._connection !== Meteor.server) {                                                     // 534
      // just remote to another endpoint, propagate return value or                                                   // 535
      // exception.                                                                                                   // 536
                                                                                                                      // 537
      var enclosing = DDP._CurrentInvocation.get();                                                                   // 538
      var alreadyInSimulation = enclosing && enclosing.isSimulation;                                                  // 539
                                                                                                                      // 540
      if (Meteor.isClient && !wrappedCallback && ! alreadyInSimulation) {                                             // 541
        // Client can't block, so it can't report errors by exception,                                                // 542
        // only by callback. If they forget the callback, give them a                                                 // 543
        // default one that logs the error, so they aren't totally                                                    // 544
        // baffled if their writes don't work because their database is                                               // 545
        // down.                                                                                                      // 546
        // Don't give a default callback in simulation, because inside stubs we                                       // 547
        // want to return the results from the local collection immediately and                                       // 548
        // not force a callback.                                                                                      // 549
        wrappedCallback = function (err) {                                                                            // 550
          if (err)                                                                                                    // 551
            Meteor._debug(name + " failed: " + (err.reason || err.stack));                                            // 552
        };                                                                                                            // 553
      }                                                                                                               // 554
                                                                                                                      // 555
      if (!alreadyInSimulation && name !== "insert") {                                                                // 556
        // If we're about to actually send an RPC, we should throw an error if                                        // 557
        // this is a non-ID selector, because the mutation methods only allow                                         // 558
        // single-ID selectors. (If we don't throw here, we'll see flicker.)                                          // 559
        throwIfSelectorIsNotId(args[0], name);                                                                        // 560
      }                                                                                                               // 561
                                                                                                                      // 562
      ret = chooseReturnValueFromCollectionResult(                                                                    // 563
        self._connection.apply(self._prefix + name, args, {returnStubValue: true}, wrappedCallback)                   // 564
      );                                                                                                              // 565
                                                                                                                      // 566
    } else {                                                                                                          // 567
      // it's my collection.  descend into the collection object                                                      // 568
      // and propagate any exception.                                                                                 // 569
      args.push(wrappedCallback);                                                                                     // 570
      try {                                                                                                           // 571
        // If the user provided a callback and the collection implements this                                         // 572
        // operation asynchronously, then queryRet will be undefined, and the                                         // 573
        // result will be returned through the callback instead.                                                      // 574
        var queryRet = self._collection[name].apply(self._collection, args);                                          // 575
        ret = chooseReturnValueFromCollectionResult(queryRet);                                                        // 576
      } catch (e) {                                                                                                   // 577
        if (callback) {                                                                                               // 578
          callback(e);                                                                                                // 579
          return null;                                                                                                // 580
        }                                                                                                             // 581
        throw e;                                                                                                      // 582
      }                                                                                                               // 583
    }                                                                                                                 // 584
                                                                                                                      // 585
    // both sync and async, unless we threw an exception, return ret                                                  // 586
    // (new document ID for insert, num affected for update/remove, object with                                       // 587
    // numberAffected and maybe insertedId for upsert).                                                               // 588
    return ret;                                                                                                       // 589
  };                                                                                                                  // 590
});                                                                                                                   // 591
                                                                                                                      // 592
/**                                                                                                                   // 593
 * @summary Modify one or more documents in the collection, or insert one if no matching documents were found. Returns an object with keys `numberAffected` (the number of documents modified)  and `insertedId` (the unique _id of the document that was inserted, if any).
 * @locus Anywhere                                                                                                    // 595
 * @param {MongoSelector} selector Specifies which documents to modify                                                // 596
 * @param {MongoModifier} modifier Specifies how to modify the documents                                              // 597
 * @param {Object} [options]                                                                                          // 598
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 */                                                                                                                   // 601
Mongo.Collection.prototype.upsert = function (selector, modifier,                                                     // 602
                                               options, callback) {                                                   // 603
  var self = this;                                                                                                    // 604
  if (! callback && typeof options === "function") {                                                                  // 605
    callback = options;                                                                                               // 606
    options = {};                                                                                                     // 607
  }                                                                                                                   // 608
  return self.update(selector, modifier,                                                                              // 609
              _.extend({}, options, { _returnObject: true, upsert: true }),                                           // 610
              callback);                                                                                              // 611
};                                                                                                                    // 612
                                                                                                                      // 613
// We'll actually design an index API later. For now, we just pass through to                                         // 614
// Mongo's, but make it synchronous.                                                                                  // 615
Mongo.Collection.prototype._ensureIndex = function (index, options) {                                                 // 616
  var self = this;                                                                                                    // 617
  if (!self._collection._ensureIndex)                                                                                 // 618
    throw new Error("Can only call _ensureIndex on server collections");                                              // 619
  self._collection._ensureIndex(index, options);                                                                      // 620
};                                                                                                                    // 621
Mongo.Collection.prototype._dropIndex = function (index) {                                                            // 622
  var self = this;                                                                                                    // 623
  if (!self._collection._dropIndex)                                                                                   // 624
    throw new Error("Can only call _dropIndex on server collections");                                                // 625
  self._collection._dropIndex(index);                                                                                 // 626
};                                                                                                                    // 627
Mongo.Collection.prototype._dropCollection = function () {                                                            // 628
  var self = this;                                                                                                    // 629
  if (!self._collection.dropCollection)                                                                               // 630
    throw new Error("Can only call _dropCollection on server collections");                                           // 631
  self._collection.dropCollection();                                                                                  // 632
};                                                                                                                    // 633
Mongo.Collection.prototype._createCappedCollection = function (byteSize, maxDocuments) {                              // 634
  var self = this;                                                                                                    // 635
  if (!self._collection._createCappedCollection)                                                                      // 636
    throw new Error("Can only call _createCappedCollection on server collections");                                   // 637
  self._collection._createCappedCollection(byteSize, maxDocuments);                                                   // 638
};                                                                                                                    // 639
                                                                                                                      // 640
Mongo.Collection.prototype.rawCollection = function () {                                                              // 641
  var self = this;                                                                                                    // 642
  if (! self._collection.rawCollection) {                                                                             // 643
    throw new Error("Can only call rawCollection on server collections");                                             // 644
  }                                                                                                                   // 645
  return self._collection.rawCollection();                                                                            // 646
};                                                                                                                    // 647
                                                                                                                      // 648
Mongo.Collection.prototype.rawDatabase = function () {                                                                // 649
  var self = this;                                                                                                    // 650
  if (! (self._driver.mongo && self._driver.mongo.db)) {                                                              // 651
    throw new Error("Can only call rawDatabase on server collections");                                               // 652
  }                                                                                                                   // 653
  return self._driver.mongo.db;                                                                                       // 654
};                                                                                                                    // 655
                                                                                                                      // 656
                                                                                                                      // 657
/**                                                                                                                   // 658
 * @summary Create a Mongo-style `ObjectID`.  If you don't specify a `hexString`, the `ObjectID` will generated randomly (not using MongoDB's ID construction rules).
 * @locus Anywhere                                                                                                    // 660
 * @class                                                                                                             // 661
 * @param {String} hexString Optional.  The 24-character hexadecimal contents of the ObjectID to create               // 662
 */                                                                                                                   // 663
Mongo.ObjectID = LocalCollection._ObjectID;                                                                           // 664
                                                                                                                      // 665
/**                                                                                                                   // 666
 * @summary To create a cursor, use find. To access the documents in a cursor, use forEach, map, or fetch.            // 667
 * @class                                                                                                             // 668
 * @instanceName cursor                                                                                               // 669
 */                                                                                                                   // 670
Mongo.Cursor = LocalCollection.Cursor;                                                                                // 671
                                                                                                                      // 672
/**                                                                                                                   // 673
 * @deprecated in 0.9.1                                                                                               // 674
 */                                                                                                                   // 675
Mongo.Collection.Cursor = Mongo.Cursor;                                                                               // 676
                                                                                                                      // 677
/**                                                                                                                   // 678
 * @deprecated in 0.9.1                                                                                               // 679
 */                                                                                                                   // 680
Mongo.Collection.ObjectID = Mongo.ObjectID;                                                                           // 681
                                                                                                                      // 682
///                                                                                                                   // 683
/// Remote methods and access control.                                                                                // 684
///                                                                                                                   // 685
                                                                                                                      // 686
// Restrict default mutators on collection. allow() and deny() take the                                               // 687
// same options:                                                                                                      // 688
//                                                                                                                    // 689
// options.insert {Function(userId, doc)}                                                                             // 690
//   return true to allow/deny adding this document                                                                   // 691
//                                                                                                                    // 692
// options.update {Function(userId, docs, fields, modifier)}                                                          // 693
//   return true to allow/deny updating these documents.                                                              // 694
//   `fields` is passed as an array of fields that are to be modified                                                 // 695
//                                                                                                                    // 696
// options.remove {Function(userId, docs)}                                                                            // 697
//   return true to allow/deny removing these documents                                                               // 698
//                                                                                                                    // 699
// options.fetch {Array}                                                                                              // 700
//   Fields to fetch for these validators. If any call to allow or deny                                               // 701
//   does not have this option then all fields are loaded.                                                            // 702
//                                                                                                                    // 703
// allow and deny can be called multiple times. The validators are                                                    // 704
// evaluated as follows:                                                                                              // 705
// - If neither deny() nor allow() has been called on the collection,                                                 // 706
//   then the request is allowed if and only if the "insecure" smart                                                  // 707
//   package is in use.                                                                                               // 708
// - Otherwise, if any deny() function returns true, the request is denied.                                           // 709
// - Otherwise, if any allow() function returns true, the request is allowed.                                         // 710
// - Otherwise, the request is denied.                                                                                // 711
//                                                                                                                    // 712
// Meteor may call your deny() and allow() functions in any order, and may not                                        // 713
// call all of them if it is able to make a decision without calling them all                                         // 714
// (so don't include side effects).                                                                                   // 715
                                                                                                                      // 716
(function () {                                                                                                        // 717
  var addValidator = function(allowOrDeny, options) {                                                                 // 718
    // validate keys                                                                                                  // 719
    var VALID_KEYS = ['insert', 'update', 'remove', 'fetch', 'transform'];                                            // 720
    _.each(_.keys(options), function (key) {                                                                          // 721
      if (!_.contains(VALID_KEYS, key))                                                                               // 722
        throw new Error(allowOrDeny + ": Invalid key: " + key);                                                       // 723
    });                                                                                                               // 724
                                                                                                                      // 725
    var self = this;                                                                                                  // 726
    self._restricted = true;                                                                                          // 727
                                                                                                                      // 728
    _.each(['insert', 'update', 'remove'], function (name) {                                                          // 729
      if (options[name]) {                                                                                            // 730
        if (!(options[name] instanceof Function)) {                                                                   // 731
          throw new Error(allowOrDeny + ": Value for `" + name + "` must be a function");                             // 732
        }                                                                                                             // 733
                                                                                                                      // 734
        // If the transform is specified at all (including as 'null') in this                                         // 735
        // call, then take that; otherwise, take the transform from the                                               // 736
        // collection.                                                                                                // 737
        if (options.transform === undefined) {                                                                        // 738
          options[name].transform = self._transform;  // already wrapped                                              // 739
        } else {                                                                                                      // 740
          options[name].transform = LocalCollection.wrapTransform(                                                    // 741
            options.transform);                                                                                       // 742
        }                                                                                                             // 743
                                                                                                                      // 744
        self._validators[name][allowOrDeny].push(options[name]);                                                      // 745
      }                                                                                                               // 746
    });                                                                                                               // 747
                                                                                                                      // 748
    // Only update the fetch fields if we're passed things that affect                                                // 749
    // fetching. This way allow({}) and allow({insert: f}) don't result in                                            // 750
    // setting fetchAllFields                                                                                         // 751
    if (options.update || options.remove || options.fetch) {                                                          // 752
      if (options.fetch && !(options.fetch instanceof Array)) {                                                       // 753
        throw new Error(allowOrDeny + ": Value for `fetch` must be an array");                                        // 754
      }                                                                                                               // 755
      self._updateFetch(options.fetch);                                                                               // 756
    }                                                                                                                 // 757
  };                                                                                                                  // 758
                                                                                                                      // 759
  /**                                                                                                                 // 760
   * @summary Allow users to write directly to this collection from client code, subject to limitations you define.   // 761
   * @locus Server                                                                                                    // 762
   * @param {Object} options                                                                                          // 763
   * @param {Function} options.insert,update,remove Functions that look at a proposed modification to the database and return true if it should be allowed.
   * @param {String[]} options.fetch Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your `update` and `remove` functions.
   * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections).  Pass `null` to disable transformation.
   */                                                                                                                 // 767
  Mongo.Collection.prototype.allow = function(options) {                                                              // 768
    addValidator.call(this, 'allow', options);                                                                        // 769
  };                                                                                                                  // 770
                                                                                                                      // 771
  /**                                                                                                                 // 772
   * @summary Override `allow` rules.                                                                                 // 773
   * @locus Server                                                                                                    // 774
   * @param {Object} options                                                                                          // 775
   * @param {Function} options.insert,update,remove Functions that look at a proposed modification to the database and return true if it should be denied, even if an [allow](#allow) rule says otherwise.
   * @param {String[]} options.fetch Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your `update` and `remove` functions.
   * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections).  Pass `null` to disable transformation.
   */                                                                                                                 // 779
  Mongo.Collection.prototype.deny = function(options) {                                                               // 780
    addValidator.call(this, 'deny', options);                                                                         // 781
  };                                                                                                                  // 782
})();                                                                                                                 // 783
                                                                                                                      // 784
                                                                                                                      // 785
Mongo.Collection.prototype._defineMutationMethods = function() {                                                      // 786
  var self = this;                                                                                                    // 787
                                                                                                                      // 788
  // set to true once we call any allow or deny methods. If true, use                                                 // 789
  // allow/deny semantics. If false, use insecure mode semantics.                                                     // 790
  self._restricted = false;                                                                                           // 791
                                                                                                                      // 792
  // Insecure mode (default to allowing writes). Defaults to 'undefined' which                                        // 793
  // means insecure iff the insecure package is loaded. This property can be                                          // 794
  // overriden by tests or packages wishing to change insecure mode behavior of                                       // 795
  // their collections.                                                                                               // 796
  self._insecure = undefined;                                                                                         // 797
                                                                                                                      // 798
  self._validators = {                                                                                                // 799
    insert: {allow: [], deny: []},                                                                                    // 800
    update: {allow: [], deny: []},                                                                                    // 801
    remove: {allow: [], deny: []},                                                                                    // 802
    upsert: {allow: [], deny: []}, // dummy arrays; can't set these!                                                  // 803
    fetch: [],                                                                                                        // 804
    fetchAllFields: false                                                                                             // 805
  };                                                                                                                  // 806
                                                                                                                      // 807
  if (!self._name)                                                                                                    // 808
    return; // anonymous collection                                                                                   // 809
                                                                                                                      // 810
  // XXX Think about method namespacing. Maybe methods should be                                                      // 811
  // "Meteor:Mongo:insert/NAME"?                                                                                      // 812
  self._prefix = '/' + self._name + '/';                                                                              // 813
                                                                                                                      // 814
  // mutation methods                                                                                                 // 815
  if (self._connection) {                                                                                             // 816
    var m = {};                                                                                                       // 817
                                                                                                                      // 818
    _.each(['insert', 'update', 'remove'], function (method) {                                                        // 819
      m[self._prefix + method] = function (/* ... */) {                                                               // 820
        // All the methods do their own validation, instead of using check().                                         // 821
        check(arguments, [Match.Any]);                                                                                // 822
        var args = _.toArray(arguments);                                                                              // 823
        try {                                                                                                         // 824
          // For an insert, if the client didn't specify an _id, generate one                                         // 825
          // now; because this uses DDP.randomStream, it will be consistent with                                      // 826
          // what the client generated. We generate it now rather than later so                                       // 827
          // that if (eg) an allow/deny rule does an insert to the same                                               // 828
          // collection (not that it really should), the generated _id will                                           // 829
          // still be the first use of the stream and will be consistent.                                             // 830
          //                                                                                                          // 831
          // However, we don't actually stick the _id onto the document yet,                                          // 832
          // because we want allow/deny rules to be able to differentiate                                             // 833
          // between arbitrary client-specified _id fields and merely                                                 // 834
          // client-controlled-via-randomSeed fields.                                                                 // 835
          var generatedId = null;                                                                                     // 836
          if (method === "insert" && !_.has(args[0], '_id')) {                                                        // 837
            generatedId = self._makeNewID();                                                                          // 838
          }                                                                                                           // 839
                                                                                                                      // 840
          if (this.isSimulation) {                                                                                    // 841
            // In a client simulation, you can do any mutation (even with a                                           // 842
            // complex selector).                                                                                     // 843
            if (generatedId !== null)                                                                                 // 844
              args[0]._id = generatedId;                                                                              // 845
            return self._collection[method].apply(                                                                    // 846
              self._collection, args);                                                                                // 847
          }                                                                                                           // 848
                                                                                                                      // 849
          // This is the server receiving a method call from the client.                                              // 850
                                                                                                                      // 851
          // We don't allow arbitrary selectors in mutations from the client: only                                    // 852
          // single-ID selectors.                                                                                     // 853
          if (method !== 'insert')                                                                                    // 854
            throwIfSelectorIsNotId(args[0], method);                                                                  // 855
                                                                                                                      // 856
          if (self._restricted) {                                                                                     // 857
            // short circuit if there is no way it will pass.                                                         // 858
            if (self._validators[method].allow.length === 0) {                                                        // 859
              throw new Meteor.Error(                                                                                 // 860
                403, "Access denied. No allow validators set on restricted " +                                        // 861
                  "collection for method '" + method + "'.");                                                         // 862
            }                                                                                                         // 863
                                                                                                                      // 864
            var validatedMethodName =                                                                                 // 865
                  '_validated' + method.charAt(0).toUpperCase() + method.slice(1);                                    // 866
            args.unshift(this.userId);                                                                                // 867
            method === 'insert' && args.push(generatedId);                                                            // 868
            return self[validatedMethodName].apply(self, args);                                                       // 869
          } else if (self._isInsecure()) {                                                                            // 870
            if (generatedId !== null)                                                                                 // 871
              args[0]._id = generatedId;                                                                              // 872
            // In insecure mode, allow any mutation (with a simple selector).                                         // 873
            // XXX This is kind of bogus.  Instead of blindly passing whatever                                        // 874
            //     we get from the network to this function, we should actually                                       // 875
            //     know the correct arguments for the function and pass just                                          // 876
            //     them.  For example, if you have an extraneous extra null                                           // 877
            //     argument and this is Mongo on the server, the .wrapAsync'd                                         // 878
            //     functions like update will get confused and pass the                                               // 879
            //     "fut.resolver()" in the wrong slot, where _update will never                                       // 880
            //     invoke it. Bam, broken DDP connection.  Probably should just                                       // 881
            //     take this whole method and write it three times, invoking                                          // 882
            //     helpers for the common code.                                                                       // 883
            return self._collection[method].apply(self._collection, args);                                            // 884
          } else {                                                                                                    // 885
            // In secure mode, if we haven't called allow or deny, then nothing                                       // 886
            // is permitted.                                                                                          // 887
            throw new Meteor.Error(403, "Access denied");                                                             // 888
          }                                                                                                           // 889
        } catch (e) {                                                                                                 // 890
          if (e.name === 'MongoError' || e.name === 'MinimongoError') {                                               // 891
            throw new Meteor.Error(409, e.toString());                                                                // 892
          } else {                                                                                                    // 893
            throw e;                                                                                                  // 894
          }                                                                                                           // 895
        }                                                                                                             // 896
      };                                                                                                              // 897
    });                                                                                                               // 898
    // Minimongo on the server gets no stubs; instead, by default                                                     // 899
    // it wait()s until its result is ready, yielding.                                                                // 900
    // This matches the behavior of macromongo on the server better.                                                  // 901
    // XXX see #MeteorServerNull                                                                                      // 902
    if (Meteor.isClient || self._connection === Meteor.server)                                                        // 903
      self._connection.methods(m);                                                                                    // 904
  }                                                                                                                   // 905
};                                                                                                                    // 906
                                                                                                                      // 907
                                                                                                                      // 908
Mongo.Collection.prototype._updateFetch = function (fields) {                                                         // 909
  var self = this;                                                                                                    // 910
                                                                                                                      // 911
  if (!self._validators.fetchAllFields) {                                                                             // 912
    if (fields) {                                                                                                     // 913
      self._validators.fetch = _.union(self._validators.fetch, fields);                                               // 914
    } else {                                                                                                          // 915
      self._validators.fetchAllFields = true;                                                                         // 916
      // clear fetch just to make sure we don't accidentally read it                                                  // 917
      self._validators.fetch = null;                                                                                  // 918
    }                                                                                                                 // 919
  }                                                                                                                   // 920
};                                                                                                                    // 921
                                                                                                                      // 922
Mongo.Collection.prototype._isInsecure = function () {                                                                // 923
  var self = this;                                                                                                    // 924
  if (self._insecure === undefined)                                                                                   // 925
    return !!Package.insecure;                                                                                        // 926
  return self._insecure;                                                                                              // 927
};                                                                                                                    // 928
                                                                                                                      // 929
var docToValidate = function (validator, doc, generatedId) {                                                          // 930
  var ret = doc;                                                                                                      // 931
  if (validator.transform) {                                                                                          // 932
    ret = EJSON.clone(doc);                                                                                           // 933
    // If you set a server-side transform on your collection, then you don't get                                      // 934
    // to tell the difference between "client specified the ID" and "server                                           // 935
    // generated the ID", because transforms expect to get _id.  If you want to                                       // 936
    // do that check, you can do it with a specific                                                                   // 937
    // `C.allow({insert: f, transform: null})` validator.                                                             // 938
    if (generatedId !== null) {                                                                                       // 939
      ret._id = generatedId;                                                                                          // 940
    }                                                                                                                 // 941
    ret = validator.transform(ret);                                                                                   // 942
  }                                                                                                                   // 943
  return ret;                                                                                                         // 944
};                                                                                                                    // 945
                                                                                                                      // 946
Mongo.Collection.prototype._validatedInsert = function (userId, doc,                                                  // 947
                                                         generatedId) {                                               // 948
  var self = this;                                                                                                    // 949
                                                                                                                      // 950
  // call user validators.                                                                                            // 951
  // Any deny returns true means denied.                                                                              // 952
  if (_.any(self._validators.insert.deny, function(validator) {                                                       // 953
    return validator(userId, docToValidate(validator, doc, generatedId));                                             // 954
  })) {                                                                                                               // 955
    throw new Meteor.Error(403, "Access denied");                                                                     // 956
  }                                                                                                                   // 957
  // Any allow returns true means proceed. Throw error if they all fail.                                              // 958
  if (_.all(self._validators.insert.allow, function(validator) {                                                      // 959
    return !validator(userId, docToValidate(validator, doc, generatedId));                                            // 960
  })) {                                                                                                               // 961
    throw new Meteor.Error(403, "Access denied");                                                                     // 962
  }                                                                                                                   // 963
                                                                                                                      // 964
  // If we generated an ID above, insert it now: after the validation, but                                            // 965
  // before actually inserting.                                                                                       // 966
  if (generatedId !== null)                                                                                           // 967
    doc._id = generatedId;                                                                                            // 968
                                                                                                                      // 969
  self._collection.insert.call(self._collection, doc);                                                                // 970
};                                                                                                                    // 971
                                                                                                                      // 972
var transformDoc = function (validator, doc) {                                                                        // 973
  if (validator.transform)                                                                                            // 974
    return validator.transform(doc);                                                                                  // 975
  return doc;                                                                                                         // 976
};                                                                                                                    // 977
                                                                                                                      // 978
// Simulate a mongo `update` operation while validating that the access                                               // 979
// control rules set by calls to `allow/deny` are satisfied. If all                                                   // 980
// pass, rewrite the mongo operation to use $in to set the list of                                                    // 981
// document ids to change ##ValidatedChange                                                                           // 982
Mongo.Collection.prototype._validatedUpdate = function(                                                               // 983
    userId, selector, mutator, options) {                                                                             // 984
  var self = this;                                                                                                    // 985
                                                                                                                      // 986
  check(mutator, Object);                                                                                             // 987
                                                                                                                      // 988
  options = _.clone(options) || {};                                                                                   // 989
                                                                                                                      // 990
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector))                                                        // 991
    throw new Error("validated update should be of a single ID");                                                     // 992
                                                                                                                      // 993
  // We don't support upserts because they don't fit nicely into allow/deny                                           // 994
  // rules.                                                                                                           // 995
  if (options.upsert)                                                                                                 // 996
    throw new Meteor.Error(403, "Access denied. Upserts not " +                                                       // 997
                           "allowed in a restricted collection.");                                                    // 998
                                                                                                                      // 999
  var noReplaceError = "Access denied. In a restricted collection you can only" +                                     // 1000
        " update documents, not replace them. Use a Mongo update operator, such " +                                   // 1001
        "as '$set'.";                                                                                                 // 1002
                                                                                                                      // 1003
  // compute modified fields                                                                                          // 1004
  var fields = [];                                                                                                    // 1005
  if (_.isEmpty(mutator)) {                                                                                           // 1006
    throw new Meteor.Error(403, noReplaceError);                                                                      // 1007
  }                                                                                                                   // 1008
  _.each(mutator, function (params, op) {                                                                             // 1009
    if (op.charAt(0) !== '$') {                                                                                       // 1010
      throw new Meteor.Error(403, noReplaceError);                                                                    // 1011
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {                                                               // 1012
      throw new Meteor.Error(                                                                                         // 1013
        403, "Access denied. Operator " + op + " not allowed in a restricted collection.");                           // 1014
    } else {                                                                                                          // 1015
      _.each(_.keys(params), function (field) {                                                                       // 1016
        // treat dotted fields as if they are replacing their                                                         // 1017
        // top-level part                                                                                             // 1018
        if (field.indexOf('.') !== -1)                                                                                // 1019
          field = field.substring(0, field.indexOf('.'));                                                             // 1020
                                                                                                                      // 1021
        // record the field we are trying to change                                                                   // 1022
        if (!_.contains(fields, field))                                                                               // 1023
          fields.push(field);                                                                                         // 1024
      });                                                                                                             // 1025
    }                                                                                                                 // 1026
  });                                                                                                                 // 1027
                                                                                                                      // 1028
  var findOptions = {transform: null};                                                                                // 1029
  if (!self._validators.fetchAllFields) {                                                                             // 1030
    findOptions.fields = {};                                                                                          // 1031
    _.each(self._validators.fetch, function(fieldName) {                                                              // 1032
      findOptions.fields[fieldName] = 1;                                                                              // 1033
    });                                                                                                               // 1034
  }                                                                                                                   // 1035
                                                                                                                      // 1036
  var doc = self._collection.findOne(selector, findOptions);                                                          // 1037
  if (!doc)  // none satisfied!                                                                                       // 1038
    return 0;                                                                                                         // 1039
                                                                                                                      // 1040
  // call user validators.                                                                                            // 1041
  // Any deny returns true means denied.                                                                              // 1042
  if (_.any(self._validators.update.deny, function(validator) {                                                       // 1043
    var factoriedDoc = transformDoc(validator, doc);                                                                  // 1044
    return validator(userId,                                                                                          // 1045
                     factoriedDoc,                                                                                    // 1046
                     fields,                                                                                          // 1047
                     mutator);                                                                                        // 1048
  })) {                                                                                                               // 1049
    throw new Meteor.Error(403, "Access denied");                                                                     // 1050
  }                                                                                                                   // 1051
  // Any allow returns true means proceed. Throw error if they all fail.                                              // 1052
  if (_.all(self._validators.update.allow, function(validator) {                                                      // 1053
    var factoriedDoc = transformDoc(validator, doc);                                                                  // 1054
    return !validator(userId,                                                                                         // 1055
                      factoriedDoc,                                                                                   // 1056
                      fields,                                                                                         // 1057
                      mutator);                                                                                       // 1058
  })) {                                                                                                               // 1059
    throw new Meteor.Error(403, "Access denied");                                                                     // 1060
  }                                                                                                                   // 1061
                                                                                                                      // 1062
  options._forbidReplace = true;                                                                                      // 1063
                                                                                                                      // 1064
  // Back when we supported arbitrary client-provided selectors, we actually                                          // 1065
  // rewrote the selector to include an _id clause before passing to Mongo to                                         // 1066
  // avoid races, but since selector is guaranteed to already just be an ID, we                                       // 1067
  // don't have to any more.                                                                                          // 1068
                                                                                                                      // 1069
  return self._collection.update.call(                                                                                // 1070
    self._collection, selector, mutator, options);                                                                    // 1071
};                                                                                                                    // 1072
                                                                                                                      // 1073
// Only allow these operations in validated updates. Specifically                                                     // 1074
// whitelist operations, rather than blacklist, so new complex                                                        // 1075
// operations that are added aren't automatically allowed. A complex                                                  // 1076
// operation is one that does more than just modify its target                                                        // 1077
// field. For now this contains all update operations except '$rename'.                                               // 1078
// http://docs.mongodb.org/manual/reference/operators/#update                                                         // 1079
var ALLOWED_UPDATE_OPERATIONS = {                                                                                     // 1080
  $inc:1, $set:1, $unset:1, $addToSet:1, $pop:1, $pullAll:1, $pull:1,                                                 // 1081
  $pushAll:1, $push:1, $bit:1                                                                                         // 1082
};                                                                                                                    // 1083
                                                                                                                      // 1084
// Simulate a mongo `remove` operation while validating access control                                                // 1085
// rules. See #ValidatedChange                                                                                        // 1086
Mongo.Collection.prototype._validatedRemove = function(userId, selector) {                                            // 1087
  var self = this;                                                                                                    // 1088
                                                                                                                      // 1089
  var findOptions = {transform: null};                                                                                // 1090
  if (!self._validators.fetchAllFields) {                                                                             // 1091
    findOptions.fields = {};                                                                                          // 1092
    _.each(self._validators.fetch, function(fieldName) {                                                              // 1093
      findOptions.fields[fieldName] = 1;                                                                              // 1094
    });                                                                                                               // 1095
  }                                                                                                                   // 1096
                                                                                                                      // 1097
  var doc = self._collection.findOne(selector, findOptions);                                                          // 1098
  if (!doc)                                                                                                           // 1099
    return 0;                                                                                                         // 1100
                                                                                                                      // 1101
  // call user validators.                                                                                            // 1102
  // Any deny returns true means denied.                                                                              // 1103
  if (_.any(self._validators.remove.deny, function(validator) {                                                       // 1104
    return validator(userId, transformDoc(validator, doc));                                                           // 1105
  })) {                                                                                                               // 1106
    throw new Meteor.Error(403, "Access denied");                                                                     // 1107
  }                                                                                                                   // 1108
  // Any allow returns true means proceed. Throw error if they all fail.                                              // 1109
  if (_.all(self._validators.remove.allow, function(validator) {                                                      // 1110
    return !validator(userId, transformDoc(validator, doc));                                                          // 1111
  })) {                                                                                                               // 1112
    throw new Meteor.Error(403, "Access denied");                                                                     // 1113
  }                                                                                                                   // 1114
                                                                                                                      // 1115
  // Back when we supported arbitrary client-provided selectors, we actually                                          // 1116
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to                                      // 1117
  // Mongo to avoid races, but since selector is guaranteed to already just be                                        // 1118
  // an ID, we don't have to any more.                                                                                // 1119
                                                                                                                      // 1120
  return self._collection.remove.call(self._collection, selector);                                                    // 1121
};                                                                                                                    // 1122
                                                                                                                      // 1123
/**                                                                                                                   // 1124
 * @deprecated in 0.9.1                                                                                               // 1125
 */                                                                                                                   // 1126
Meteor.Collection = Mongo.Collection;                                                                                 // 1127
                                                                                                                      // 1128
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.mongo = {
  MongoInternals: MongoInternals,
  MongoTest: MongoTest,
  Mongo: Mongo
};

})();

//# sourceMappingURL=mongo.js.map
