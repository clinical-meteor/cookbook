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
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var check, Match;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/check/match.js                                                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// XXX docs                                                                      // 1
                                                                                 // 2
// Things we explicitly do NOT support:                                          // 3
//    - heterogenous arrays                                                      // 4
                                                                                 // 5
var currentArgumentChecker = new Meteor.EnvironmentVariable;                     // 6
                                                                                 // 7
/**                                                                              // 8
 * @summary Check that a value matches a [pattern](#matchpatterns).              // 9
 * If the value does not match the pattern, throw a `Match.Error`.               // 10
 *                                                                               // 11
 * Particularly useful to assert that arguments to a function have the right     // 12
 * types and structure.                                                          // 13
 * @locus Anywhere                                                               // 14
 * @param {Any} value The value to check                                         // 15
 * @param {MatchPattern} pattern The pattern to match                            // 16
 * `value` against                                                               // 17
 */                                                                              // 18
check = function (value, pattern) {                                              // 19
  // Record that check got called, if somebody cared.                            // 20
  //                                                                             // 21
  // We use getOrNullIfOutsideFiber so that it's OK to call check()              // 22
  // from non-Fiber server contexts; the downside is that if you forget to       // 23
  // bindEnvironment on some random callback in your method/publisher,           // 24
  // it might not find the argumentChecker and you'll get an error about         // 25
  // not checking an argument that it looks like you're checking (instead        // 26
  // of just getting a "Node code must run in a Fiber" error).                   // 27
  var argChecker = currentArgumentChecker.getOrNullIfOutsideFiber();             // 28
  if (argChecker)                                                                // 29
    argChecker.checking(value);                                                  // 30
  try {                                                                          // 31
    checkSubtree(value, pattern);                                                // 32
  } catch (err) {                                                                // 33
    if ((err instanceof Match.Error) && err.path)                                // 34
      err.message += " in field " + err.path;                                    // 35
    throw err;                                                                   // 36
  }                                                                              // 37
};                                                                               // 38
                                                                                 // 39
/**                                                                              // 40
 * @namespace Match                                                              // 41
 * @summary The namespace for all Match types and methods.                       // 42
 */                                                                              // 43
Match = {                                                                        // 44
  Optional: function (pattern) {                                                 // 45
    return new Optional(pattern);                                                // 46
  },                                                                             // 47
  OneOf: function (/*arguments*/) {                                              // 48
    return new OneOf(_.toArray(arguments));                                      // 49
  },                                                                             // 50
  Any: ['__any__'],                                                              // 51
  Where: function (condition) {                                                  // 52
    return new Where(condition);                                                 // 53
  },                                                                             // 54
  ObjectIncluding: function (pattern) {                                          // 55
    return new ObjectIncluding(pattern);                                         // 56
  },                                                                             // 57
  ObjectWithValues: function (pattern) {                                         // 58
    return new ObjectWithValues(pattern);                                        // 59
  },                                                                             // 60
  // Matches only signed 32-bit integers                                         // 61
  Integer: ['__integer__'],                                                      // 62
                                                                                 // 63
  // XXX matchers should know how to describe themselves for errors              // 64
  Error: Meteor.makeErrorType("Match.Error", function (msg) {                    // 65
    this.message = "Match error: " + msg;                                        // 66
    // The path of the value that failed to match. Initially empty, this gets    // 67
    // populated by catching and rethrowing the exception as it goes back up the // 68
    // stack.                                                                    // 69
    // E.g.: "vals[3].entity.created"                                            // 70
    this.path = "";                                                              // 71
    // If this gets sent over DDP, don't give full internal details but at least // 72
    // provide something better than 500 Internal server error.                  // 73
    this.sanitizedError = new Meteor.Error(400, "Match failed");                 // 74
  }),                                                                            // 75
                                                                                 // 76
  // Tests to see if value matches pattern. Unlike check, it merely returns true // 77
  // or false (unless an error other than Match.Error was thrown). It does not   // 78
  // interact with _failIfArgumentsAreNotAllChecked.                             // 79
  // XXX maybe also implement a Match.match which returns more information about // 80
  //     failures but without using exception handling or doing what check()     // 81
  //     does with _failIfArgumentsAreNotAllChecked and Meteor.Error conversion  // 82
                                                                                 // 83
  /**                                                                            // 84
   * @summary Returns true if the value matches the pattern.                     // 85
   * @locus Anywhere                                                             // 86
   * @param {Any} value The value to check                                       // 87
   * @param {MatchPattern} pattern The pattern to match `value` against          // 88
   */                                                                            // 89
  test: function (value, pattern) {                                              // 90
    try {                                                                        // 91
      checkSubtree(value, pattern);                                              // 92
      return true;                                                               // 93
    } catch (e) {                                                                // 94
      if (e instanceof Match.Error)                                              // 95
        return false;                                                            // 96
      // Rethrow other errors.                                                   // 97
      throw e;                                                                   // 98
    }                                                                            // 99
  },                                                                             // 100
                                                                                 // 101
  // Runs `f.apply(context, args)`. If check() is not called on every element of // 102
  // `args` (either directly or in the first level of an array), throws an error // 103
  // (using `description` in the message).                                       // 104
  //                                                                             // 105
  _failIfArgumentsAreNotAllChecked: function (f, context, args, description) {   // 106
    var argChecker = new ArgumentChecker(args, description);                     // 107
    var result = currentArgumentChecker.withValue(argChecker, function () {      // 108
      return f.apply(context, args);                                             // 109
    });                                                                          // 110
    // If f didn't itself throw, make sure it checked all of its arguments.      // 111
    argChecker.throwUnlessAllArgumentsHaveBeenChecked();                         // 112
    return result;                                                               // 113
  }                                                                              // 114
};                                                                               // 115
                                                                                 // 116
var Optional = function (pattern) {                                              // 117
  this.pattern = pattern;                                                        // 118
};                                                                               // 119
                                                                                 // 120
var OneOf = function (choices) {                                                 // 121
  if (_.isEmpty(choices))                                                        // 122
    throw new Error("Must provide at least one choice to Match.OneOf");          // 123
  this.choices = choices;                                                        // 124
};                                                                               // 125
                                                                                 // 126
var Where = function (condition) {                                               // 127
  this.condition = condition;                                                    // 128
};                                                                               // 129
                                                                                 // 130
var ObjectIncluding = function (pattern) {                                       // 131
  this.pattern = pattern;                                                        // 132
};                                                                               // 133
                                                                                 // 134
var ObjectWithValues = function (pattern) {                                      // 135
  this.pattern = pattern;                                                        // 136
};                                                                               // 137
                                                                                 // 138
var typeofChecks = [                                                             // 139
  [String, "string"],                                                            // 140
  [Number, "number"],                                                            // 141
  [Boolean, "boolean"],                                                          // 142
  // While we don't allow undefined in EJSON, this is good for optional          // 143
  // arguments with OneOf.                                                       // 144
  [undefined, "undefined"]                                                       // 145
];                                                                               // 146
                                                                                 // 147
var checkSubtree = function (value, pattern) {                                   // 148
  // Match anything!                                                             // 149
  if (pattern === Match.Any)                                                     // 150
    return;                                                                      // 151
                                                                                 // 152
  // Basic atomic types.                                                         // 153
  // Do not match boxed objects (e.g. String, Boolean)                           // 154
  for (var i = 0; i < typeofChecks.length; ++i) {                                // 155
    if (pattern === typeofChecks[i][0]) {                                        // 156
      if (typeof value === typeofChecks[i][1])                                   // 157
        return;                                                                  // 158
      throw new Match.Error("Expected " + typeofChecks[i][1] + ", got " +        // 159
                            typeof value);                                       // 160
    }                                                                            // 161
  }                                                                              // 162
  if (pattern === null) {                                                        // 163
    if (value === null)                                                          // 164
      return;                                                                    // 165
    throw new Match.Error("Expected null, got " + EJSON.stringify(value));       // 166
  }                                                                              // 167
                                                                                 // 168
  // Strings and numbers match literally.  Goes well with Match.OneOf.           // 169
  if (typeof pattern === "string" || typeof pattern === "number") {              // 170
    if (value === pattern)                                                       // 171
      return;                                                                    // 172
    throw new Match.Error("Expected " + pattern + ", got " +                     // 173
                          EJSON.stringify(value));                               // 174
  }                                                                              // 175
                                                                                 // 176
  // Match.Integer is special type encoded with array                            // 177
  if (pattern === Match.Integer) {                                               // 178
    // There is no consistent and reliable way to check if variable is a 64-bit  // 179
    // integer. One of the popular solutions is to get reminder of division by 1 // 180
    // but this method fails on really large floats with big precision.          // 181
    // E.g.: 1.348192308491824e+23 % 1 === 0 in V8                               // 182
    // Bitwise operators work consistantly but always cast variable to 32-bit    // 183
    // signed integer according to JavaScript specs.                             // 184
    if (typeof value === "number" && (value | 0) === value)                      // 185
      return                                                                     // 186
    throw new Match.Error("Expected Integer, got "                               // 187
                + (value instanceof Object ? EJSON.stringify(value) : value));   // 188
  }                                                                              // 189
                                                                                 // 190
  // "Object" is shorthand for Match.ObjectIncluding({});                        // 191
  if (pattern === Object)                                                        // 192
    pattern = Match.ObjectIncluding({});                                         // 193
                                                                                 // 194
  // Array (checked AFTER Any, which is implemented as an Array).                // 195
  if (pattern instanceof Array) {                                                // 196
    if (pattern.length !== 1)                                                    // 197
      throw Error("Bad pattern: arrays must have one type element" +             // 198
                  EJSON.stringify(pattern));                                     // 199
    if (!_.isArray(value) && !_.isArguments(value)) {                            // 200
      throw new Match.Error("Expected array, got " + EJSON.stringify(value));    // 201
    }                                                                            // 202
                                                                                 // 203
    _.each(value, function (valueElement, index) {                               // 204
      try {                                                                      // 205
        checkSubtree(valueElement, pattern[0]);                                  // 206
      } catch (err) {                                                            // 207
        if (err instanceof Match.Error) {                                        // 208
          err.path = _prependPath(index, err.path);                              // 209
        }                                                                        // 210
        throw err;                                                               // 211
      }                                                                          // 212
    });                                                                          // 213
    return;                                                                      // 214
  }                                                                              // 215
                                                                                 // 216
  // Arbitrary validation checks. The condition can return false or throw a      // 217
  // Match.Error (ie, it can internally use check()) to fail.                    // 218
  if (pattern instanceof Where) {                                                // 219
    if (pattern.condition(value))                                                // 220
      return;                                                                    // 221
    // XXX this error is terrible                                                // 222
    throw new Match.Error("Failed Match.Where validation");                      // 223
  }                                                                              // 224
                                                                                 // 225
                                                                                 // 226
  if (pattern instanceof Optional)                                               // 227
    pattern = Match.OneOf(undefined, pattern.pattern);                           // 228
                                                                                 // 229
  if (pattern instanceof OneOf) {                                                // 230
    for (var i = 0; i < pattern.choices.length; ++i) {                           // 231
      try {                                                                      // 232
        checkSubtree(value, pattern.choices[i]);                                 // 233
        // No error? Yay, return.                                                // 234
        return;                                                                  // 235
      } catch (err) {                                                            // 236
        // Other errors should be thrown. Match errors just mean try another     // 237
        // choice.                                                               // 238
        if (!(err instanceof Match.Error))                                       // 239
          throw err;                                                             // 240
      }                                                                          // 241
    }                                                                            // 242
    // XXX this error is terrible                                                // 243
    throw new Match.Error("Failed Match.OneOf or Match.Optional validation");    // 244
  }                                                                              // 245
                                                                                 // 246
  // A function that isn't something we special-case is assumed to be a          // 247
  // constructor.                                                                // 248
  if (pattern instanceof Function) {                                             // 249
    if (value instanceof pattern)                                                // 250
      return;                                                                    // 251
    throw new Match.Error("Expected " + (pattern.name ||                         // 252
                                         "particular constructor"));             // 253
  }                                                                              // 254
                                                                                 // 255
  var unknownKeysAllowed = false;                                                // 256
  var unknownKeyPattern;                                                         // 257
  if (pattern instanceof ObjectIncluding) {                                      // 258
    unknownKeysAllowed = true;                                                   // 259
    pattern = pattern.pattern;                                                   // 260
  }                                                                              // 261
  if (pattern instanceof ObjectWithValues) {                                     // 262
    unknownKeysAllowed = true;                                                   // 263
    unknownKeyPattern = [pattern.pattern];                                       // 264
    pattern = {};  // no required keys                                           // 265
  }                                                                              // 266
                                                                                 // 267
  if (typeof pattern !== "object")                                               // 268
    throw Error("Bad pattern: unknown pattern type");                            // 269
                                                                                 // 270
  // An object, with required and optional keys. Note that this does NOT do      // 271
  // structural matches against objects of special types that happen to match    // 272
  // the pattern: this really needs to be a plain old {Object}!                  // 273
  if (typeof value !== 'object')                                                 // 274
    throw new Match.Error("Expected object, got " + typeof value);               // 275
  if (value === null)                                                            // 276
    throw new Match.Error("Expected object, got null");                          // 277
  if (value.constructor !== Object)                                              // 278
    throw new Match.Error("Expected plain object");                              // 279
                                                                                 // 280
  var requiredPatterns = {};                                                     // 281
  var optionalPatterns = {};                                                     // 282
  _.each(pattern, function (subPattern, key) {                                   // 283
    if (subPattern instanceof Optional)                                          // 284
      optionalPatterns[key] = subPattern.pattern;                                // 285
    else                                                                         // 286
      requiredPatterns[key] = subPattern;                                        // 287
  });                                                                            // 288
                                                                                 // 289
  _.each(value, function (subValue, key) {                                       // 290
    try {                                                                        // 291
      if (_.has(requiredPatterns, key)) {                                        // 292
        checkSubtree(subValue, requiredPatterns[key]);                           // 293
        delete requiredPatterns[key];                                            // 294
      } else if (_.has(optionalPatterns, key)) {                                 // 295
        checkSubtree(subValue, optionalPatterns[key]);                           // 296
      } else {                                                                   // 297
        if (!unknownKeysAllowed)                                                 // 298
          throw new Match.Error("Unknown key");                                  // 299
        if (unknownKeyPattern) {                                                 // 300
          checkSubtree(subValue, unknownKeyPattern[0]);                          // 301
        }                                                                        // 302
      }                                                                          // 303
    } catch (err) {                                                              // 304
      if (err instanceof Match.Error)                                            // 305
        err.path = _prependPath(key, err.path);                                  // 306
      throw err;                                                                 // 307
    }                                                                            // 308
  });                                                                            // 309
                                                                                 // 310
  _.each(requiredPatterns, function (subPattern, key) {                          // 311
    throw new Match.Error("Missing key '" + key + "'");                          // 312
  });                                                                            // 313
};                                                                               // 314
                                                                                 // 315
var ArgumentChecker = function (args, description) {                             // 316
  var self = this;                                                               // 317
  // Make a SHALLOW copy of the arguments. (We'll be doing identity checks       // 318
  // against its contents.)                                                      // 319
  self.args = _.clone(args);                                                     // 320
  // Since the common case will be to check arguments in order, and we splice    // 321
  // out arguments when we check them, make it so we splice out from the end     // 322
  // rather than the beginning.                                                  // 323
  self.args.reverse();                                                           // 324
  self.description = description;                                                // 325
};                                                                               // 326
                                                                                 // 327
_.extend(ArgumentChecker.prototype, {                                            // 328
  checking: function (value) {                                                   // 329
    var self = this;                                                             // 330
    if (self._checkingOneValue(value))                                           // 331
      return;                                                                    // 332
    // Allow check(arguments, [String]) or check(arguments.slice(1), [String])   // 333
    // or check([foo, bar], [String]) to count... but only if value wasn't       // 334
    // itself an argument.                                                       // 335
    if (_.isArray(value) || _.isArguments(value)) {                              // 336
      _.each(value, _.bind(self._checkingOneValue, self));                       // 337
    }                                                                            // 338
  },                                                                             // 339
  _checkingOneValue: function (value) {                                          // 340
    var self = this;                                                             // 341
    for (var i = 0; i < self.args.length; ++i) {                                 // 342
      // Is this value one of the arguments? (This can have a false positive if  // 343
      // the argument is an interned primitive, but it's still a good enough     // 344
      // check.)                                                                 // 345
      // (NaN is not === to itself, so we have to check specially.)              // 346
      if (value === self.args[i] || (_.isNaN(value) && _.isNaN(self.args[i]))) { // 347
        self.args.splice(i, 1);                                                  // 348
        return true;                                                             // 349
      }                                                                          // 350
    }                                                                            // 351
    return false;                                                                // 352
  },                                                                             // 353
  throwUnlessAllArgumentsHaveBeenChecked: function () {                          // 354
    var self = this;                                                             // 355
    if (!_.isEmpty(self.args))                                                   // 356
      throw new Error("Did not check() all arguments during " +                  // 357
                      self.description);                                         // 358
  }                                                                              // 359
});                                                                              // 360
                                                                                 // 361
var _jsKeywords = ["do", "if", "in", "for", "let", "new", "try", "var", "case",  // 362
  "else", "enum", "eval", "false", "null", "this", "true", "void", "with",       // 363
  "break", "catch", "class", "const", "super", "throw", "while", "yield",        // 364
  "delete", "export", "import", "public", "return", "static", "switch",          // 365
  "typeof", "default", "extends", "finally", "package", "private", "continue",   // 366
  "debugger", "function", "arguments", "interface", "protected", "implements",   // 367
  "instanceof"];                                                                 // 368
                                                                                 // 369
// Assumes the base of path is already escaped properly                          // 370
// returns key + base                                                            // 371
var _prependPath = function (key, base) {                                        // 372
  if ((typeof key) === "number" || key.match(/^[0-9]+$/))                        // 373
    key = "[" + key + "]";                                                       // 374
  else if (!key.match(/^[a-z_$][0-9a-z_$]*$/i) || _.contains(_jsKeywords, key))  // 375
    key = JSON.stringify([key]);                                                 // 376
                                                                                 // 377
  if (base && base[0] !== "[")                                                   // 378
    return key + '.' + base;                                                     // 379
  return key + base;                                                             // 380
};                                                                               // 381
                                                                                 // 382
                                                                                 // 383
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.check = {
  check: check,
  Match: Match
};

})();
