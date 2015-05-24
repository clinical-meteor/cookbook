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
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var JSON = Package.json.JSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Log = Package.logging.Log;
var DDP = Package.ddp.DDP;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var Mongo, LocalCollectionDriver;

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
  Mongo: Mongo
};

})();
