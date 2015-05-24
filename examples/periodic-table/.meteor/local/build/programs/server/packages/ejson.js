(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Base64 = Package.base64.Base64;

/* Package-scope variables */
var EJSON, EJSONTest;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ejson/ejson.js                                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * @namespace                                                                                                        // 2
 * @summary Namespace for EJSON functions                                                                            // 3
 */                                                                                                                  // 4
EJSON = {};                                                                                                          // 5
EJSONTest = {};                                                                                                      // 6
                                                                                                                     // 7
                                                                                                                     // 8
                                                                                                                     // 9
// Custom type interface definition                                                                                  // 10
/**                                                                                                                  // 11
 * @class CustomType                                                                                                 // 12
 * @instanceName customType                                                                                          // 13
 * @memberOf EJSON                                                                                                   // 14
 * @summary The interface that a class must satisfy to be able to become an                                          // 15
 * EJSON custom type via EJSON.addType.                                                                              // 16
 */                                                                                                                  // 17
                                                                                                                     // 18
/**                                                                                                                  // 19
 * @function typeName                                                                                                // 20
 * @memberOf EJSON.CustomType                                                                                        // 21
 * @summary Return the tag used to identify this type.  This must match the tag used to register this type with [`EJSON.addType`](#ejson_add_type).
 * @locus Anywhere                                                                                                   // 23
 * @instance                                                                                                         // 24
 */                                                                                                                  // 25
                                                                                                                     // 26
/**                                                                                                                  // 27
 * @function toJSONValue                                                                                             // 28
 * @memberOf EJSON.CustomType                                                                                        // 29
 * @summary Serialize this instance into a JSON-compatible value.                                                    // 30
 * @locus Anywhere                                                                                                   // 31
 * @instance                                                                                                         // 32
 */                                                                                                                  // 33
                                                                                                                     // 34
/**                                                                                                                  // 35
 * @function clone                                                                                                   // 36
 * @memberOf EJSON.CustomType                                                                                        // 37
 * @summary Return a value `r` such that `this.equals(r)` is true, and modifications to `r` do not affect `this` and vice versa.
 * @locus Anywhere                                                                                                   // 39
 * @instance                                                                                                         // 40
 */                                                                                                                  // 41
                                                                                                                     // 42
/**                                                                                                                  // 43
 * @function equals                                                                                                  // 44
 * @memberOf EJSON.CustomType                                                                                        // 45
 * @summary Return `true` if `other` has a value equal to `this`; `false` otherwise.                                 // 46
 * @locus Anywhere                                                                                                   // 47
 * @param {Object} other Another object to compare this to.                                                          // 48
 * @instance                                                                                                         // 49
 */                                                                                                                  // 50
                                                                                                                     // 51
                                                                                                                     // 52
var customTypes = {};                                                                                                // 53
// Add a custom type, using a method of your choice to get to and                                                    // 54
// from a basic JSON-able representation.  The factory argument                                                      // 55
// is a function of JSON-able --> your object                                                                        // 56
// The type you add must have:                                                                                       // 57
// - A toJSONValue() method, so that Meteor can serialize it                                                         // 58
// - a typeName() method, to show how to look it up in our type table.                                               // 59
// It is okay if these methods are monkey-patched on.                                                                // 60
// EJSON.clone will use toJSONValue and the given factory to produce                                                 // 61
// a clone, but you may specify a method clone() that will be                                                        // 62
// used instead.                                                                                                     // 63
// Similarly, EJSON.equals will use toJSONValue to make comparisons,                                                 // 64
// but you may provide a method equals() instead.                                                                    // 65
/**                                                                                                                  // 66
 * @summary Add a custom datatype to EJSON.                                                                          // 67
 * @locus Anywhere                                                                                                   // 68
 * @param {String} name A tag for your custom type; must be unique among custom data types defined in your project, and must match the result of your type's `typeName` method.
 * @param {Function} factory A function that deserializes a JSON-compatible value into an instance of your type.  This should match the serialization performed by your type's `toJSONValue` method.
 */                                                                                                                  // 71
EJSON.addType = function (name, factory) {                                                                           // 72
  if (_.has(customTypes, name))                                                                                      // 73
    throw new Error("Type " + name + " already present");                                                            // 74
  customTypes[name] = factory;                                                                                       // 75
};                                                                                                                   // 76
                                                                                                                     // 77
var isInfOrNan = function (obj) {                                                                                    // 78
  return _.isNaN(obj) || obj === Infinity || obj === -Infinity;                                                      // 79
};                                                                                                                   // 80
                                                                                                                     // 81
var builtinConverters = [                                                                                            // 82
  { // Date                                                                                                          // 83
    matchJSONValue: function (obj) {                                                                                 // 84
      return _.has(obj, '$date') && _.size(obj) === 1;                                                               // 85
    },                                                                                                               // 86
    matchObject: function (obj) {                                                                                    // 87
      return obj instanceof Date;                                                                                    // 88
    },                                                                                                               // 89
    toJSONValue: function (obj) {                                                                                    // 90
      return {$date: obj.getTime()};                                                                                 // 91
    },                                                                                                               // 92
    fromJSONValue: function (obj) {                                                                                  // 93
      return new Date(obj.$date);                                                                                    // 94
    }                                                                                                                // 95
  },                                                                                                                 // 96
  { // NaN, Inf, -Inf. (These are the only objects with typeof !== 'object'                                          // 97
    // which we match.)                                                                                              // 98
    matchJSONValue: function (obj) {                                                                                 // 99
      return _.has(obj, '$InfNaN') && _.size(obj) === 1;                                                             // 100
    },                                                                                                               // 101
    matchObject: isInfOrNan,                                                                                         // 102
    toJSONValue: function (obj) {                                                                                    // 103
      var sign;                                                                                                      // 104
      if (_.isNaN(obj))                                                                                              // 105
        sign = 0;                                                                                                    // 106
      else if (obj === Infinity)                                                                                     // 107
        sign = 1;                                                                                                    // 108
      else                                                                                                           // 109
        sign = -1;                                                                                                   // 110
      return {$InfNaN: sign};                                                                                        // 111
    },                                                                                                               // 112
    fromJSONValue: function (obj) {                                                                                  // 113
      return obj.$InfNaN/0;                                                                                          // 114
    }                                                                                                                // 115
  },                                                                                                                 // 116
  { // Binary                                                                                                        // 117
    matchJSONValue: function (obj) {                                                                                 // 118
      return _.has(obj, '$binary') && _.size(obj) === 1;                                                             // 119
    },                                                                                                               // 120
    matchObject: function (obj) {                                                                                    // 121
      return typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array                                          // 122
        || (obj && _.has(obj, '$Uint8ArrayPolyfill'));                                                               // 123
    },                                                                                                               // 124
    toJSONValue: function (obj) {                                                                                    // 125
      return {$binary: Base64.encode(obj)};                                                                          // 126
    },                                                                                                               // 127
    fromJSONValue: function (obj) {                                                                                  // 128
      return Base64.decode(obj.$binary);                                                                             // 129
    }                                                                                                                // 130
  },                                                                                                                 // 131
  { // Escaping one level                                                                                            // 132
    matchJSONValue: function (obj) {                                                                                 // 133
      return _.has(obj, '$escape') && _.size(obj) === 1;                                                             // 134
    },                                                                                                               // 135
    matchObject: function (obj) {                                                                                    // 136
      if (_.isEmpty(obj) || _.size(obj) > 2) {                                                                       // 137
        return false;                                                                                                // 138
      }                                                                                                              // 139
      return _.any(builtinConverters, function (converter) {                                                         // 140
        return converter.matchJSONValue(obj);                                                                        // 141
      });                                                                                                            // 142
    },                                                                                                               // 143
    toJSONValue: function (obj) {                                                                                    // 144
      var newObj = {};                                                                                               // 145
      _.each(obj, function (value, key) {                                                                            // 146
        newObj[key] = EJSON.toJSONValue(value);                                                                      // 147
      });                                                                                                            // 148
      return {$escape: newObj};                                                                                      // 149
    },                                                                                                               // 150
    fromJSONValue: function (obj) {                                                                                  // 151
      var newObj = {};                                                                                               // 152
      _.each(obj.$escape, function (value, key) {                                                                    // 153
        newObj[key] = EJSON.fromJSONValue(value);                                                                    // 154
      });                                                                                                            // 155
      return newObj;                                                                                                 // 156
    }                                                                                                                // 157
  },                                                                                                                 // 158
  { // Custom                                                                                                        // 159
    matchJSONValue: function (obj) {                                                                                 // 160
      return _.has(obj, '$type') && _.has(obj, '$value') && _.size(obj) === 2;                                       // 161
    },                                                                                                               // 162
    matchObject: function (obj) {                                                                                    // 163
      return EJSON._isCustomType(obj);                                                                               // 164
    },                                                                                                               // 165
    toJSONValue: function (obj) {                                                                                    // 166
      var jsonValue = Meteor._noYieldsAllowed(function () {                                                          // 167
        return obj.toJSONValue();                                                                                    // 168
      });                                                                                                            // 169
      return {$type: obj.typeName(), $value: jsonValue};                                                             // 170
    },                                                                                                               // 171
    fromJSONValue: function (obj) {                                                                                  // 172
      var typeName = obj.$type;                                                                                      // 173
      if (!_.has(customTypes, typeName))                                                                             // 174
        throw new Error("Custom EJSON type " + typeName + " is not defined");                                        // 175
      var converter = customTypes[typeName];                                                                         // 176
      return Meteor._noYieldsAllowed(function () {                                                                   // 177
        return converter(obj.$value);                                                                                // 178
      });                                                                                                            // 179
    }                                                                                                                // 180
  }                                                                                                                  // 181
];                                                                                                                   // 182
                                                                                                                     // 183
EJSON._isCustomType = function (obj) {                                                                               // 184
  return obj &&                                                                                                      // 185
    typeof obj.toJSONValue === 'function' &&                                                                         // 186
    typeof obj.typeName === 'function' &&                                                                            // 187
    _.has(customTypes, obj.typeName());                                                                              // 188
};                                                                                                                   // 189
                                                                                                                     // 190
                                                                                                                     // 191
// for both arrays and objects, in-place modification.                                                               // 192
var adjustTypesToJSONValue =                                                                                         // 193
EJSON._adjustTypesToJSONValue = function (obj) {                                                                     // 194
  // Is it an atom that we need to adjust?                                                                           // 195
  if (obj === null)                                                                                                  // 196
    return null;                                                                                                     // 197
  var maybeChanged = toJSONValueHelper(obj);                                                                         // 198
  if (maybeChanged !== undefined)                                                                                    // 199
    return maybeChanged;                                                                                             // 200
                                                                                                                     // 201
  // Other atoms are unchanged.                                                                                      // 202
  if (typeof obj !== 'object')                                                                                       // 203
    return obj;                                                                                                      // 204
                                                                                                                     // 205
  // Iterate over array or object structure.                                                                         // 206
  _.each(obj, function (value, key) {                                                                                // 207
    if (typeof value !== 'object' && value !== undefined &&                                                          // 208
        !isInfOrNan(value))                                                                                          // 209
      return; // continue                                                                                            // 210
                                                                                                                     // 211
    var changed = toJSONValueHelper(value);                                                                          // 212
    if (changed) {                                                                                                   // 213
      obj[key] = changed;                                                                                            // 214
      return; // on to the next key                                                                                  // 215
    }                                                                                                                // 216
    // if we get here, value is an object but not adjustable                                                         // 217
    // at this level.  recurse.                                                                                      // 218
    adjustTypesToJSONValue(value);                                                                                   // 219
  });                                                                                                                // 220
  return obj;                                                                                                        // 221
};                                                                                                                   // 222
                                                                                                                     // 223
// Either return the JSON-compatible version of the argument, or undefined (if                                       // 224
// the item isn't itself replaceable, but maybe some fields in it are)                                               // 225
var toJSONValueHelper = function (item) {                                                                            // 226
  for (var i = 0; i < builtinConverters.length; i++) {                                                               // 227
    var converter = builtinConverters[i];                                                                            // 228
    if (converter.matchObject(item)) {                                                                               // 229
      return converter.toJSONValue(item);                                                                            // 230
    }                                                                                                                // 231
  }                                                                                                                  // 232
  return undefined;                                                                                                  // 233
};                                                                                                                   // 234
                                                                                                                     // 235
/**                                                                                                                  // 236
 * @summary Serialize an EJSON-compatible value into its plain JSON representation.                                  // 237
 * @locus Anywhere                                                                                                   // 238
 * @param {EJSON} val A value to serialize to plain JSON.                                                            // 239
 */                                                                                                                  // 240
EJSON.toJSONValue = function (item) {                                                                                // 241
  var changed = toJSONValueHelper(item);                                                                             // 242
  if (changed !== undefined)                                                                                         // 243
    return changed;                                                                                                  // 244
  if (typeof item === 'object') {                                                                                    // 245
    item = EJSON.clone(item);                                                                                        // 246
    adjustTypesToJSONValue(item);                                                                                    // 247
  }                                                                                                                  // 248
  return item;                                                                                                       // 249
};                                                                                                                   // 250
                                                                                                                     // 251
// for both arrays and objects. Tries its best to just                                                               // 252
// use the object you hand it, but may return something                                                              // 253
// different if the object you hand it itself needs changing.                                                        // 254
//                                                                                                                   // 255
var adjustTypesFromJSONValue =                                                                                       // 256
EJSON._adjustTypesFromJSONValue = function (obj) {                                                                   // 257
  if (obj === null)                                                                                                  // 258
    return null;                                                                                                     // 259
  var maybeChanged = fromJSONValueHelper(obj);                                                                       // 260
  if (maybeChanged !== obj)                                                                                          // 261
    return maybeChanged;                                                                                             // 262
                                                                                                                     // 263
  // Other atoms are unchanged.                                                                                      // 264
  if (typeof obj !== 'object')                                                                                       // 265
    return obj;                                                                                                      // 266
                                                                                                                     // 267
  _.each(obj, function (value, key) {                                                                                // 268
    if (typeof value === 'object') {                                                                                 // 269
      var changed = fromJSONValueHelper(value);                                                                      // 270
      if (value !== changed) {                                                                                       // 271
        obj[key] = changed;                                                                                          // 272
        return;                                                                                                      // 273
      }                                                                                                              // 274
      // if we get here, value is an object but not adjustable                                                       // 275
      // at this level.  recurse.                                                                                    // 276
      adjustTypesFromJSONValue(value);                                                                               // 277
    }                                                                                                                // 278
  });                                                                                                                // 279
  return obj;                                                                                                        // 280
};                                                                                                                   // 281
                                                                                                                     // 282
// Either return the argument changed to have the non-json                                                           // 283
// rep of itself (the Object version) or the argument itself.                                                        // 284
                                                                                                                     // 285
// DOES NOT RECURSE.  For actually getting the fully-changed value, use                                              // 286
// EJSON.fromJSONValue                                                                                               // 287
var fromJSONValueHelper = function (value) {                                                                         // 288
  if (typeof value === 'object' && value !== null) {                                                                 // 289
    if (_.size(value) <= 2                                                                                           // 290
        && _.all(value, function (v, k) {                                                                            // 291
          return typeof k === 'string' && k.substr(0, 1) === '$';                                                    // 292
        })) {                                                                                                        // 293
      for (var i = 0; i < builtinConverters.length; i++) {                                                           // 294
        var converter = builtinConverters[i];                                                                        // 295
        if (converter.matchJSONValue(value)) {                                                                       // 296
          return converter.fromJSONValue(value);                                                                     // 297
        }                                                                                                            // 298
      }                                                                                                              // 299
    }                                                                                                                // 300
  }                                                                                                                  // 301
  return value;                                                                                                      // 302
};                                                                                                                   // 303
                                                                                                                     // 304
/**                                                                                                                  // 305
 * @summary Deserialize an EJSON value from its plain JSON representation.                                           // 306
 * @locus Anywhere                                                                                                   // 307
 * @param {JSONCompatible} val A value to deserialize into EJSON.                                                    // 308
 */                                                                                                                  // 309
EJSON.fromJSONValue = function (item) {                                                                              // 310
  var changed = fromJSONValueHelper(item);                                                                           // 311
  if (changed === item && typeof item === 'object') {                                                                // 312
    item = EJSON.clone(item);                                                                                        // 313
    adjustTypesFromJSONValue(item);                                                                                  // 314
    return item;                                                                                                     // 315
  } else {                                                                                                           // 316
    return changed;                                                                                                  // 317
  }                                                                                                                  // 318
};                                                                                                                   // 319
                                                                                                                     // 320
/**                                                                                                                  // 321
 * @summary Serialize a value to a string.                                                                           // 322
                                                                                                                     // 323
For EJSON values, the serialization fully represents the value. For non-EJSON values, serializes the same way as `JSON.stringify`.
 * @locus Anywhere                                                                                                   // 325
 * @param {EJSON} val A value to stringify.                                                                          // 326
 * @param {Object} [options]                                                                                         // 327
 * @param {Boolean | Integer | String} options.indent Indents objects and arrays for easy readability.  When `true`, indents by 2 spaces; when an integer, indents by that number of spaces; and when a string, uses the string as the indentation pattern.
 * @param {Boolean} options.canonical When `true`, stringifies keys in an object in sorted order.                    // 329
 */                                                                                                                  // 330
EJSON.stringify = function (item, options) {                                                                         // 331
  var json = EJSON.toJSONValue(item);                                                                                // 332
  if (options && (options.canonical || options.indent)) {                                                            // 333
    return EJSON._canonicalStringify(json, options);                                                                 // 334
  } else {                                                                                                           // 335
    return JSON.stringify(json);                                                                                     // 336
  }                                                                                                                  // 337
};                                                                                                                   // 338
                                                                                                                     // 339
/**                                                                                                                  // 340
 * @summary Parse a string into an EJSON value. Throws an error if the string is not valid EJSON.                    // 341
 * @locus Anywhere                                                                                                   // 342
 * @param {String} str A string to parse into an EJSON value.                                                        // 343
 */                                                                                                                  // 344
EJSON.parse = function (item) {                                                                                      // 345
  if (typeof item !== 'string')                                                                                      // 346
    throw new Error("EJSON.parse argument should be a string");                                                      // 347
  return EJSON.fromJSONValue(JSON.parse(item));                                                                      // 348
};                                                                                                                   // 349
                                                                                                                     // 350
/**                                                                                                                  // 351
 * @summary Returns true if `x` is a buffer of binary data, as returned from [`EJSON.newBinary`](#ejson_new_binary). // 352
 * @param {Object} x The variable to check.                                                                          // 353
 * @locus Anywhere                                                                                                   // 354
 */                                                                                                                  // 355
EJSON.isBinary = function (obj) {                                                                                    // 356
  return !!((typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array) ||                                      // 357
    (obj && obj.$Uint8ArrayPolyfill));                                                                               // 358
};                                                                                                                   // 359
                                                                                                                     // 360
/**                                                                                                                  // 361
 * @summary Return true if `a` and `b` are equal to each other.  Return false otherwise.  Uses the `equals` method on `a` if present, otherwise performs a deep comparison.
 * @locus Anywhere                                                                                                   // 363
 * @param {EJSON} a                                                                                                  // 364
 * @param {EJSON} b                                                                                                  // 365
 * @param {Object} [options]                                                                                         // 366
 * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order, if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}` is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The default is `false`.
 */                                                                                                                  // 368
EJSON.equals = function (a, b, options) {                                                                            // 369
  var i;                                                                                                             // 370
  var keyOrderSensitive = !!(options && options.keyOrderSensitive);                                                  // 371
  if (a === b)                                                                                                       // 372
    return true;                                                                                                     // 373
  if (_.isNaN(a) && _.isNaN(b))                                                                                      // 374
    return true; // This differs from the IEEE spec for NaN equality, b/c we don't want                              // 375
                 // anything ever with a NaN to be poisoned from becoming equal to anything.                         // 376
  if (!a || !b) // if either one is falsy, they'd have to be === to be equal                                         // 377
    return false;                                                                                                    // 378
  if (!(typeof a === 'object' && typeof b === 'object'))                                                             // 379
    return false;                                                                                                    // 380
  if (a instanceof Date && b instanceof Date)                                                                        // 381
    return a.valueOf() === b.valueOf();                                                                              // 382
  if (EJSON.isBinary(a) && EJSON.isBinary(b)) {                                                                      // 383
    if (a.length !== b.length)                                                                                       // 384
      return false;                                                                                                  // 385
    for (i = 0; i < a.length; i++) {                                                                                 // 386
      if (a[i] !== b[i])                                                                                             // 387
        return false;                                                                                                // 388
    }                                                                                                                // 389
    return true;                                                                                                     // 390
  }                                                                                                                  // 391
  if (typeof (a.equals) === 'function')                                                                              // 392
    return a.equals(b, options);                                                                                     // 393
  if (typeof (b.equals) === 'function')                                                                              // 394
    return b.equals(a, options);                                                                                     // 395
  if (a instanceof Array) {                                                                                          // 396
    if (!(b instanceof Array))                                                                                       // 397
      return false;                                                                                                  // 398
    if (a.length !== b.length)                                                                                       // 399
      return false;                                                                                                  // 400
    for (i = 0; i < a.length; i++) {                                                                                 // 401
      if (!EJSON.equals(a[i], b[i], options))                                                                        // 402
        return false;                                                                                                // 403
    }                                                                                                                // 404
    return true;                                                                                                     // 405
  }                                                                                                                  // 406
  // fallback for custom types that don't implement their own equals                                                 // 407
  switch (EJSON._isCustomType(a) + EJSON._isCustomType(b)) {                                                         // 408
    case 1: return false;                                                                                            // 409
    case 2: return EJSON.equals(EJSON.toJSONValue(a), EJSON.toJSONValue(b));                                         // 410
  }                                                                                                                  // 411
  // fall back to structural equality of objects                                                                     // 412
  var ret;                                                                                                           // 413
  if (keyOrderSensitive) {                                                                                           // 414
    var bKeys = [];                                                                                                  // 415
    _.each(b, function (val, x) {                                                                                    // 416
        bKeys.push(x);                                                                                               // 417
    });                                                                                                              // 418
    i = 0;                                                                                                           // 419
    ret = _.all(a, function (val, x) {                                                                               // 420
      if (i >= bKeys.length) {                                                                                       // 421
        return false;                                                                                                // 422
      }                                                                                                              // 423
      if (x !== bKeys[i]) {                                                                                          // 424
        return false;                                                                                                // 425
      }                                                                                                              // 426
      if (!EJSON.equals(val, b[bKeys[i]], options)) {                                                                // 427
        return false;                                                                                                // 428
      }                                                                                                              // 429
      i++;                                                                                                           // 430
      return true;                                                                                                   // 431
    });                                                                                                              // 432
    return ret && i === bKeys.length;                                                                                // 433
  } else {                                                                                                           // 434
    i = 0;                                                                                                           // 435
    ret = _.all(a, function (val, key) {                                                                             // 436
      if (!_.has(b, key)) {                                                                                          // 437
        return false;                                                                                                // 438
      }                                                                                                              // 439
      if (!EJSON.equals(val, b[key], options)) {                                                                     // 440
        return false;                                                                                                // 441
      }                                                                                                              // 442
      i++;                                                                                                           // 443
      return true;                                                                                                   // 444
    });                                                                                                              // 445
    return ret && _.size(b) === i;                                                                                   // 446
  }                                                                                                                  // 447
};                                                                                                                   // 448
                                                                                                                     // 449
/**                                                                                                                  // 450
 * @summary Return a deep copy of `val`.                                                                             // 451
 * @locus Anywhere                                                                                                   // 452
 * @param {EJSON} val A value to copy.                                                                               // 453
 */                                                                                                                  // 454
EJSON.clone = function (v) {                                                                                         // 455
  var ret;                                                                                                           // 456
  if (typeof v !== "object")                                                                                         // 457
    return v;                                                                                                        // 458
  if (v === null)                                                                                                    // 459
    return null; // null has typeof "object"                                                                         // 460
  if (v instanceof Date)                                                                                             // 461
    return new Date(v.getTime());                                                                                    // 462
  // RegExps are not really EJSON elements (eg we don't define a serialization                                       // 463
  // for them), but they're immutable anyway, so we can support them in clone.                                       // 464
  if (v instanceof RegExp)                                                                                           // 465
    return v;                                                                                                        // 466
  if (EJSON.isBinary(v)) {                                                                                           // 467
    ret = EJSON.newBinary(v.length);                                                                                 // 468
    for (var i = 0; i < v.length; i++) {                                                                             // 469
      ret[i] = v[i];                                                                                                 // 470
    }                                                                                                                // 471
    return ret;                                                                                                      // 472
  }                                                                                                                  // 473
  // XXX: Use something better than underscore's isArray                                                             // 474
  if (_.isArray(v) || _.isArguments(v)) {                                                                            // 475
    // For some reason, _.map doesn't work in this context on Opera (weird test                                      // 476
    // failures).                                                                                                    // 477
    ret = [];                                                                                                        // 478
    for (i = 0; i < v.length; i++)                                                                                   // 479
      ret[i] = EJSON.clone(v[i]);                                                                                    // 480
    return ret;                                                                                                      // 481
  }                                                                                                                  // 482
  // handle general user-defined typed Objects if they have a clone method                                           // 483
  if (typeof v.clone === 'function') {                                                                               // 484
    return v.clone();                                                                                                // 485
  }                                                                                                                  // 486
  // handle other custom types                                                                                       // 487
  if (EJSON._isCustomType(v)) {                                                                                      // 488
    return EJSON.fromJSONValue(EJSON.clone(EJSON.toJSONValue(v)), true);                                             // 489
  }                                                                                                                  // 490
  // handle other objects                                                                                            // 491
  ret = {};                                                                                                          // 492
  _.each(v, function (value, key) {                                                                                  // 493
    ret[key] = EJSON.clone(value);                                                                                   // 494
  });                                                                                                                // 495
  return ret;                                                                                                        // 496
};                                                                                                                   // 497
                                                                                                                     // 498
/**                                                                                                                  // 499
 * @summary Allocate a new buffer of binary data that EJSON can serialize.                                           // 500
 * @locus Anywhere                                                                                                   // 501
 * @param {Number} size The number of bytes of binary data to allocate.                                              // 502
 */                                                                                                                  // 503
// EJSON.newBinary is the public documented API for this functionality,                                              // 504
// but the implementation is in the 'base64' package to avoid                                                        // 505
// introducing a circular dependency. (If the implementation were here,                                              // 506
// then 'base64' would have to use EJSON.newBinary, and 'ejson' would                                                // 507
// also have to use 'base64'.)                                                                                       // 508
EJSON.newBinary = Base64.newBinary;                                                                                  // 509
                                                                                                                     // 510
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ejson/stringify.js                                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Based on json2.js from https://github.com/douglascrockford/JSON-js                                                // 1
//                                                                                                                   // 2
//    json2.js                                                                                                       // 3
//    2012-10-08                                                                                                     // 4
//                                                                                                                   // 5
//    Public Domain.                                                                                                 // 6
//                                                                                                                   // 7
//    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.                                                        // 8
                                                                                                                     // 9
function quote(string) {                                                                                             // 10
  return JSON.stringify(string);                                                                                     // 11
}                                                                                                                    // 12
                                                                                                                     // 13
var str = function (key, holder, singleIndent, outerIndent, canonical) {                                             // 14
                                                                                                                     // 15
  // Produce a string from holder[key].                                                                              // 16
                                                                                                                     // 17
  var i;          // The loop counter.                                                                               // 18
  var k;          // The member key.                                                                                 // 19
  var v;          // The member value.                                                                               // 20
  var length;                                                                                                        // 21
  var innerIndent = outerIndent;                                                                                     // 22
  var partial;                                                                                                       // 23
  var value = holder[key];                                                                                           // 24
                                                                                                                     // 25
  // What happens next depends on the value's type.                                                                  // 26
                                                                                                                     // 27
  switch (typeof value) {                                                                                            // 28
  case 'string':                                                                                                     // 29
    return quote(value);                                                                                             // 30
  case 'number':                                                                                                     // 31
    // JSON numbers must be finite. Encode non-finite numbers as null.                                               // 32
    return isFinite(value) ? String(value) : 'null';                                                                 // 33
  case 'boolean':                                                                                                    // 34
    return String(value);                                                                                            // 35
  // If the type is 'object', we might be dealing with an object or an array or                                      // 36
  // null.                                                                                                           // 37
  case 'object':                                                                                                     // 38
    // Due to a specification blunder in ECMAScript, typeof null is 'object',                                        // 39
    // so watch out for that case.                                                                                   // 40
    if (!value) {                                                                                                    // 41
      return 'null';                                                                                                 // 42
    }                                                                                                                // 43
    // Make an array to hold the partial results of stringifying this object value.                                  // 44
    innerIndent = outerIndent + singleIndent;                                                                        // 45
    partial = [];                                                                                                    // 46
                                                                                                                     // 47
    // Is the value an array?                                                                                        // 48
    if (_.isArray(value) || _.isArguments(value)) {                                                                  // 49
                                                                                                                     // 50
      // The value is an array. Stringify every element. Use null as a placeholder                                   // 51
      // for non-JSON values.                                                                                        // 52
                                                                                                                     // 53
      length = value.length;                                                                                         // 54
      for (i = 0; i < length; i += 1) {                                                                              // 55
        partial[i] = str(i, value, singleIndent, innerIndent, canonical) || 'null';                                  // 56
      }                                                                                                              // 57
                                                                                                                     // 58
      // Join all of the elements together, separated with commas, and wrap them in                                  // 59
      // brackets.                                                                                                   // 60
                                                                                                                     // 61
      if (partial.length === 0) {                                                                                    // 62
        v = '[]';                                                                                                    // 63
      } else if (innerIndent) {                                                                                      // 64
        v = '[\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + ']';                      // 65
      } else {                                                                                                       // 66
        v = '[' + partial.join(',') + ']';                                                                           // 67
      }                                                                                                              // 68
      return v;                                                                                                      // 69
    }                                                                                                                // 70
                                                                                                                     // 71
                                                                                                                     // 72
    // Iterate through all of the keys in the object.                                                                // 73
    var keys = _.keys(value);                                                                                        // 74
    if (canonical)                                                                                                   // 75
      keys = keys.sort();                                                                                            // 76
    _.each(keys, function (k) {                                                                                      // 77
      v = str(k, value, singleIndent, innerIndent, canonical);                                                       // 78
      if (v) {                                                                                                       // 79
        partial.push(quote(k) + (innerIndent ? ': ' : ':') + v);                                                     // 80
      }                                                                                                              // 81
    });                                                                                                              // 82
                                                                                                                     // 83
                                                                                                                     // 84
    // Join all of the member texts together, separated with commas,                                                 // 85
    // and wrap them in braces.                                                                                      // 86
                                                                                                                     // 87
    if (partial.length === 0) {                                                                                      // 88
      v = '{}';                                                                                                      // 89
    } else if (innerIndent) {                                                                                        // 90
      v = '{\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + '}';                        // 91
    } else {                                                                                                         // 92
      v = '{' + partial.join(',') + '}';                                                                             // 93
    }                                                                                                                // 94
    return v;                                                                                                        // 95
  }                                                                                                                  // 96
}                                                                                                                    // 97
                                                                                                                     // 98
// If the JSON object does not yet have a stringify method, give it one.                                             // 99
                                                                                                                     // 100
EJSON._canonicalStringify = function (value, options) {                                                              // 101
  // Make a fake root object containing our value under the key of ''.                                               // 102
  // Return the result of stringifying the value.                                                                    // 103
  options = _.extend({                                                                                               // 104
    indent: "",                                                                                                      // 105
    canonical: false                                                                                                 // 106
  }, options);                                                                                                       // 107
  if (options.indent === true) {                                                                                     // 108
    options.indent = "  ";                                                                                           // 109
  } else if (typeof options.indent === 'number') {                                                                   // 110
    var newIndent = "";                                                                                              // 111
    for (var i = 0; i < options.indent; i++) {                                                                       // 112
      newIndent += ' ';                                                                                              // 113
    }                                                                                                                // 114
    options.indent = newIndent;                                                                                      // 115
  }                                                                                                                  // 116
  return str('', {'': value}, options.indent, "", options.canonical);                                                // 117
};                                                                                                                   // 118
                                                                                                                     // 119
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ejson = {
  EJSON: EJSON,
  EJSONTest: EJSONTest
};

})();

//# sourceMappingURL=ejson.js.map
