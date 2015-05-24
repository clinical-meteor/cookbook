(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/grigio:babel/lib/core-js-no-number.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**                                                                                                                // 1
 * Core.js 0.7.1                                                                                                   // 2
 * https://github.com/zloirock/core-js                                                                             // 3
 * License: http://rock.mit-license.org                                                                            // 4
 * © 2015 Denis Pushkarev                                                                                          // 5
 */                                                                                                                // 6
!function(undefined){                                                                                              // 7
var __e = null, __g = null;                                                                                        // 8
                                                                                                                   // 9
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./src/es5');                                                                                              // 11
require('./src/es6.symbol');                                                                                       // 12
require('./src/es6.object.statics');                                                                               // 13
require('./src/es6.object.prototype');                                                                             // 14
require('./src/es6.object.statics-accept-primitives');                                                             // 15
require('./src/es6.function');                                                                                     // 16
require('./src/es6.number.statics');                                                                               // 17
require('./src/es6.math');                                                                                         // 18
require('./src/es6.string');                                                                                       // 19
require('./src/es6.array.statics');                                                                                // 20
require('./src/es6.array.prototype');                                                                              // 21
require('./src/es6.iterators');                                                                                    // 22
require('./src/es6.regexp');                                                                                       // 23
require('./src/es6.promise');                                                                                      // 24
require('./src/es6.collections');                                                                                  // 25
require('./src/es6.reflect');                                                                                      // 26
require('./src/es7.proposals');                                                                                    // 27
require('./src/es7.abstract-refs');                                                                                // 28
require('./src/js.array.statics');                                                                                 // 29
require('./src/web.immediate');                                                                                    // 30
require('./src/web.dom.itarable');                                                                                 // 31
require('./src/web.timers');                                                                                       // 32
},{"./src/es5":20,"./src/es6.array.prototype":21,"./src/es6.array.statics":22,"./src/es6.collections":23,"./src/es6.function":24,"./src/es6.iterators":25,"./src/es6.math":26,"./src/es6.number.statics":27,"./src/es6.object.prototype":28,"./src/es6.object.statics":30,"./src/es6.object.statics-accept-primitives":29,"./src/es6.promise":31,"./src/es6.reflect":32,"./src/es6.regexp":33,"./src/es6.string":34,"./src/es6.symbol":35,"./src/es7.abstract-refs":36,"./src/es7.proposals":37,"./src/js.array.statics":38,"./src/web.dom.itarable":39,"./src/web.immediate":40,"./src/web.timers":41}],2:[function(require,module,exports){
'use strict';                                                                                                      // 34
// false -> indexOf                                                                                                // 35
// true  -> includes                                                                                               // 36
var $     = require('./$')                                                                                         // 37
  , isNaN = $.isNaN;                                                                                               // 38
module.exports = function(IS_CONTAINS){                                                                            // 39
  return function(el /*, fromIndex = 0 */){                                                                        // 40
    var O      = $.toObject(this)                                                                                  // 41
      , length = $.toLength(O.length)                                                                              // 42
      , index  = $.toIndex(arguments[1], length);                                                                  // 43
    if(IS_CONTAINS && el != el)for(;length > index; index++){                                                      // 44
      if(isNaN(O[index]))return true;                                                                              // 45
    } else for(;length > index; index++)if(IS_CONTAINS || index in O){                                             // 46
      if(O[index] === el)return IS_CONTAINS || index;                                                              // 47
    } return !IS_CONTAINS && -1;                                                                                   // 48
  }                                                                                                                // 49
}                                                                                                                  // 50
},{"./$":10}],3:[function(require,module,exports){                                                                 // 51
'use strict';                                                                                                      // 52
// 0 -> forEach                                                                                                    // 53
// 1 -> map                                                                                                        // 54
// 2 -> filter                                                                                                     // 55
// 3 -> some                                                                                                       // 56
// 4 -> every                                                                                                      // 57
// 5 -> find                                                                                                       // 58
// 6 -> findIndex                                                                                                  // 59
var $ = require('./$');                                                                                            // 60
module.exports = function(TYPE){                                                                                   // 61
  var IS_MAP        = TYPE == 1                                                                                    // 62
    , IS_FILTER     = TYPE == 2                                                                                    // 63
    , IS_SOME       = TYPE == 3                                                                                    // 64
    , IS_EVERY      = TYPE == 4                                                                                    // 65
    , IS_FIND_INDEX = TYPE == 6                                                                                    // 66
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;                                                                  // 67
  return function(callbackfn/*, that = undefined */){                                                              // 68
    var O      = Object($.assert.def(this))                                                                        // 69
      , self   = $.ES5Object(O)                                                                                    // 70
      , f      = $.ctx(callbackfn, arguments[1], 3)                                                                // 71
      , length = $.toLength(self.length)                                                                           // 72
      , index  = 0                                                                                                 // 73
      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined                                               // 74
      , val, res;                                                                                                  // 75
    for(;length > index; index++)if(NO_HOLES || index in self){                                                    // 76
      val = self[index];                                                                                           // 77
      res = f(val, index, O);                                                                                      // 78
      if(TYPE){                                                                                                    // 79
        if(IS_MAP)result[index] = res;            // map                                                           // 80
        else if(res)switch(TYPE){                                                                                  // 81
          case 3: return true;                    // some                                                          // 82
          case 5: return val;                     // find                                                          // 83
          case 6: return index;                   // findIndex                                                     // 84
          case 2: result.push(val);               // filter                                                        // 85
        } else if(IS_EVERY)return false;          // every                                                         // 86
      }                                                                                                            // 87
    }                                                                                                              // 88
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;                                           // 89
  }                                                                                                                // 90
}                                                                                                                  // 91
},{"./$":10}],4:[function(require,module,exports){                                                                 // 92
var $ = require('./$');                                                                                            // 93
// 19.1.2.1 Object.assign(target, source, ...)                                                                     // 94
module.exports = Object.assign || function(target, source){                                                        // 95
  var T = Object($.assert.def(target))                                                                             // 96
    , l = arguments.length                                                                                         // 97
    , i = 1;                                                                                                       // 98
  while(l > i){                                                                                                    // 99
    var S      = $.ES5Object(arguments[i++])                                                                       // 100
      , keys   = $.getKeys(S)                                                                                      // 101
      , length = keys.length                                                                                       // 102
      , j      = 0                                                                                                 // 103
      , key;                                                                                                       // 104
    while(length > j)T[key = keys[j++]] = S[key];                                                                  // 105
  }                                                                                                                // 106
  return T;                                                                                                        // 107
}                                                                                                                  // 108
},{"./$":10}],5:[function(require,module,exports){                                                                 // 109
var $        = require('./$')                                                                                      // 110
  , TAG      = require('./$.wks')('toStringTag')                                                                   // 111
  , toString = {}.toString;                                                                                        // 112
function cof(it){                                                                                                  // 113
  return toString.call(it).slice(8, -1);                                                                           // 114
}                                                                                                                  // 115
cof.classof = function(it){                                                                                        // 116
  var O, T;                                                                                                        // 117
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'                                                 // 118
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);                                                 // 119
}                                                                                                                  // 120
cof.set = function(it, tag, stat){                                                                                 // 121
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);                                        // 122
}                                                                                                                  // 123
module.exports = cof;                                                                                              // 124
},{"./$":10,"./$.wks":19}],6:[function(require,module,exports){                                                    // 125
var $          = require('./$')                                                                                    // 126
  , global     = $.g                                                                                               // 127
  , core       = $.core                                                                                            // 128
  , isFunction = $.isFunction;                                                                                     // 129
if(typeof __e != 'undefined')__e = core;                                                                           // 130
if(typeof __g != 'undefined')__g = global;                                                                         // 131
if($.FW)global.core = core;                                                                                        // 132
// type bitmap                                                                                                     // 133
$def.F = 1;  // forced                                                                                             // 134
$def.G = 2;  // global                                                                                             // 135
$def.S = 4;  // static                                                                                             // 136
$def.P = 8;  // proto                                                                                              // 137
$def.B = 16; // bind                                                                                               // 138
$def.W = 32; // wrap                                                                                               // 139
function $def(type, name, source){                                                                                 // 140
  var key, own, out, exp                                                                                           // 141
    , isGlobal = type & $def.G                                                                                     // 142
    , target   = isGlobal ? global : (type & $def.S)                                                               // 143
        ? global[name] : (global[name] || {}).prototype                                                            // 144
    , exports  = isGlobal ? core : core[name] || (core[name] = {});                                                // 145
  if(isGlobal)source = name;                                                                                       // 146
  for(key in source){                                                                                              // 147
    // there is a similar native                                                                                   // 148
    own = !(type & $def.F) && target && key in target;                                                             // 149
    // export native or passed                                                                                     // 150
    out = (own ? target : source)[key];                                                                            // 151
    // prevent global pollution for namespaces                                                                     // 152
    if(!$.FW && isGlobal && !isFunction(target[key]))exp = source[key];                                            // 153
    // bind timers to global for call from export context                                                          // 154
    else if(type & $def.B && own)exp = $.ctx(out, global);                                                         // 155
    // wrap global constructors for prevent change them in library                                                 // 156
    else if(type & $def.W && !$.FW && target[key] == out)!function(out){                                           // 157
      exp = function(param){                                                                                       // 158
        return this instanceof out ? new out(param) : out(param);                                                  // 159
      }                                                                                                            // 160
      exp.prototype = out.prototype;                                                                               // 161
    }(out);                                                                                                        // 162
    else exp = type & $def.P && isFunction(out) ? $.ctx(Function.call, out) : out;                                 // 163
    // extend global                                                                                               // 164
    if($.FW && target && !own){                                                                                    // 165
      if(isGlobal)target[key] = out;                                                                               // 166
      else delete target[key] && $.hide(target, key, out);                                                         // 167
    }                                                                                                              // 168
    // export                                                                                                      // 169
    if(exports[key] != out)$.hide(exports, key, exp);                                                              // 170
  }                                                                                                                // 171
}                                                                                                                  // 172
module.exports = $def;                                                                                             // 173
},{"./$":10}],7:[function(require,module,exports){                                                                 // 174
module.exports = typeof self != 'undefined' ? self : Function('return this')();                                    // 175
},{}],8:[function(require,module,exports){                                                                         // 176
// Fast apply                                                                                                      // 177
// http://jsperf.lnkit.com/fast-apply/5                                                                            // 178
module.exports = function(fn, args, that){                                                                         // 179
  var un = that === undefined;                                                                                     // 180
  switch(args.length){                                                                                             // 181
    case 0: return un ? fn()                                                                                       // 182
                      : fn.call(that);                                                                             // 183
    case 1: return un ? fn(args[0])                                                                                // 184
                      : fn.call(that, args[0]);                                                                    // 185
    case 2: return un ? fn(args[0], args[1])                                                                       // 186
                      : fn.call(that, args[0], args[1]);                                                           // 187
    case 3: return un ? fn(args[0], args[1], args[2])                                                              // 188
                      : fn.call(that, args[0], args[1], args[2]);                                                  // 189
    case 4: return un ? fn(args[0], args[1], args[2], args[3])                                                     // 190
                      : fn.call(that, args[0], args[1], args[2], args[3]);                                         // 191
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])                                            // 192
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);                                // 193
  } return              fn.apply(that, args);                                                                      // 194
}                                                                                                                  // 195
},{}],9:[function(require,module,exports){                                                                         // 196
'use strict';                                                                                                      // 197
var $                 = require('./$')                                                                             // 198
  , cof               = require('./$.cof')                                                                         // 199
  , $def              = require('./$.def')                                                                         // 200
  , invoke            = require('./$.invoke')                                                                      // 201
// Safari has byggy iterators w/o `next`                                                                           // 202
  , BUGGY             = 'keys' in [] && !('next' in [].keys())                                                     // 203
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')                                                             // 204
  , FF_ITERATOR       = '@@iterator'                                                                               // 205
  , Iterators         = {}                                                                                         // 206
  , IteratorPrototype = {};                                                                                        // 207
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()                                                                    // 208
setIterator(IteratorPrototype, $.that);                                                                            // 209
function setIterator(O, value){                                                                                    // 210
  $.hide(O, SYMBOL_ITERATOR, value);                                                                               // 211
  // Add iterator for FF iterator protocol                                                                         // 212
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);                                                              // 213
}                                                                                                                  // 214
function createIterator(Constructor, NAME, next, proto){                                                           // 215
  Constructor.prototype = $.create(proto || $iter.prototype, {next: $.desc(1, next)});                             // 216
  cof.set(Constructor, NAME + ' Iterator');                                                                        // 217
}                                                                                                                  // 218
function defineIterator(Constructor, NAME, value, DEFAULT){                                                        // 219
  var proto = Constructor.prototype                                                                                // 220
    , iter  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || (DEFAULT && proto[DEFAULT]) || value;                // 221
  if($.FW){                                                                                                        // 222
    // Define iterator                                                                                             // 223
    setIterator(proto, iter);                                                                                      // 224
    if(iter !== value){                                                                                            // 225
      var iterProto = $.getProto(iter.call(new Constructor));                                                      // 226
      // Set @@toStringTag to native iterators                                                                     // 227
      cof.set(iterProto, NAME + ' Iterator', true);                                                                // 228
      // FF fix                                                                                                    // 229
      $.has(proto, FF_ITERATOR) && setIterator(iterProto, $.that);                                                 // 230
    }                                                                                                              // 231
  }                                                                                                                // 232
  // Plug for library                                                                                              // 233
  Iterators[NAME] = iter;                                                                                          // 234
  // FF & v8 fix                                                                                                   // 235
  Iterators[NAME + ' Iterator'] = $.that;                                                                          // 236
  return iter;                                                                                                     // 237
}                                                                                                                  // 238
function getIterator(it){                                                                                          // 239
  var Symbol  = $.g.Symbol                                                                                         // 240
    , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]                                                       // 241
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];                                          // 242
  return $.assert.obj(getIter.call(it));                                                                           // 243
}                                                                                                                  // 244
function stepCall(fn, value, entries){                                                                             // 245
  return entries ? invoke(fn, value) : fn(value);                                                                  // 246
}                                                                                                                  // 247
function closeIterator(iterator){                                                                                  // 248
  var ret = iterator['return'];                                                                                    // 249
  if(ret !== undefined)ret.call(iterator);                                                                         // 250
}                                                                                                                  // 251
function safeIterExec(exec, iterator){                                                                             // 252
  try {                                                                                                            // 253
    return exec(iterator);                                                                                         // 254
  } catch(e){                                                                                                      // 255
    closeIterator(iterator);                                                                                       // 256
    throw e;                                                                                                       // 257
  }                                                                                                                // 258
}                                                                                                                  // 259
var DANGER_CLOSING = true;                                                                                         // 260
try {                                                                                                              // 261
  var iter = [1].keys();                                                                                           // 262
  iter['return'] = function(){ DANGER_CLOSING = false };                                                           // 263
  Array.from(iter, function(){ throw 2 });                                                                         // 264
} catch(e){}                                                                                                       // 265
var $iter = {                                                                                                      // 266
  BUGGY: BUGGY,                                                                                                    // 267
  DANGER_CLOSING: DANGER_CLOSING,                                                                                  // 268
  Iterators: Iterators,                                                                                            // 269
  prototype: IteratorPrototype,                                                                                    // 270
  step: function(done, value){                                                                                     // 271
    return {value: value, done: !!done};                                                                           // 272
  },                                                                                                               // 273
  stepCall: stepCall,                                                                                              // 274
  close: closeIterator,                                                                                            // 275
  exec: safeIterExec,                                                                                              // 276
  is: function(it){                                                                                                // 277
    var O      = Object(it)                                                                                        // 278
      , Symbol = $.g.Symbol                                                                                        // 279
      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;                                                         // 280
    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));                                   // 281
  },                                                                                                               // 282
  get: getIterator,                                                                                                // 283
  set: setIterator,                                                                                                // 284
  create: createIterator,                                                                                          // 285
  define: defineIterator,                                                                                          // 286
  std: function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){                                            // 287
    function createIter(kind){                                                                                     // 288
      return function(){                                                                                           // 289
        return new Constructor(this, kind);                                                                        // 290
      }                                                                                                            // 291
    }                                                                                                              // 292
    createIterator(Constructor, NAME, next);                                                                       // 293
    var entries = createIter('key+value')                                                                          // 294
      , values  = createIter('value')                                                                              // 295
      , proto   = Base.prototype                                                                                   // 296
      , methods, key;                                                                                              // 297
    if(DEFAULT == 'value')values = defineIterator(Base, NAME, values, 'values');                                   // 298
    else entries = defineIterator(Base, NAME, entries, 'entries');                                                 // 299
    if(DEFAULT){                                                                                                   // 300
      methods = {                                                                                                  // 301
        entries: entries,                                                                                          // 302
        keys: IS_SET ? values : createIter('key'),                                                                 // 303
        values: values                                                                                             // 304
      }                                                                                                            // 305
      $def($def.P + $def.F * BUGGY, NAME, methods);                                                                // 306
      if(FORCE)for(key in methods){                                                                                // 307
        if(!(key in proto))$.hide(proto, key, methods[key]);                                                       // 308
      }                                                                                                            // 309
    }                                                                                                              // 310
  },                                                                                                               // 311
  forOf: function(iterable, entries, fn, that){                                                                    // 312
    safeIterExec(function(iterator){                                                                               // 313
      var f = $.ctx(fn, that, entries ? 2 : 1)                                                                     // 314
        , step;                                                                                                    // 315
      while(!(step = iterator.next()).done)if(stepCall(f, step.value, entries) === false){                         // 316
        return closeIterator(iterator);                                                                            // 317
      }                                                                                                            // 318
    }, getIterator(iterable));                                                                                     // 319
  }                                                                                                                // 320
};                                                                                                                 // 321
module.exports = $iter;                                                                                            // 322
},{"./$":10,"./$.cof":5,"./$.def":6,"./$.invoke":8,"./$.wks":19}],10:[function(require,module,exports){            // 323
'use strict';                                                                                                      // 324
var global         = require('./$.global')                                                                         // 325
  , defineProperty = Object.defineProperty                                                                         // 326
  , hasOwnProperty = {}.hasOwnProperty                                                                             // 327
  , ceil  = Math.ceil                                                                                              // 328
  , floor = Math.floor                                                                                             // 329
  , max   = Math.max                                                                                               // 330
  , min   = Math.min                                                                                               // 331
  , trunc = Math.trunc || function(it){                                                                            // 332
      return (it > 0 ? floor : ceil)(it);                                                                          // 333
    }                                                                                                              // 334
// 7.1.4 ToInteger                                                                                                 // 335
function toInteger(it){                                                                                            // 336
  return isNaN(it) ? 0 : trunc(it);                                                                                // 337
}                                                                                                                  // 338
function desc(bitmap, value){                                                                                      // 339
  return {                                                                                                         // 340
    enumerable  : !(bitmap & 1),                                                                                   // 341
    configurable: !(bitmap & 2),                                                                                   // 342
    writable    : !(bitmap & 4),                                                                                   // 343
    value       : value                                                                                            // 344
  }                                                                                                                // 345
}                                                                                                                  // 346
function simpleSet(object, key, value){                                                                            // 347
  object[key] = value;                                                                                             // 348
  return object;                                                                                                   // 349
}                                                                                                                  // 350
function createDefiner(bitmap){                                                                                    // 351
  return DESC ? function(object, key, value){                                                                      // 352
    return $.setDesc(object, key, desc(bitmap, value));                                                            // 353
  } : simpleSet;                                                                                                   // 354
}                                                                                                                  // 355
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.                               // 356
var DESC = !!function(){try {                                                                                      // 357
  return defineProperty({}, 'a', {get: function(){ return 2 }}).a == 2;                                            // 358
} catch(e){}}();                                                                                                   // 359
var hide = createDefiner(1)                                                                                        // 360
  , core = {};                                                                                                     // 361
                                                                                                                   // 362
function isObject(it){                                                                                             // 363
  return it !== null && (typeof it == 'object' || typeof it == 'function');                                        // 364
}                                                                                                                  // 365
function isFunction(it){                                                                                           // 366
  return typeof it == 'function';                                                                                  // 367
}                                                                                                                  // 368
                                                                                                                   // 369
function assert(condition, msg1, msg2){                                                                            // 370
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);                                                        // 371
};                                                                                                                 // 372
assert.def = function(it){                                                                                         // 373
  if(it == undefined)throw TypeError('Function called on null or undefined');                                      // 374
  return it;                                                                                                       // 375
};                                                                                                                 // 376
assert.fn = function(it){                                                                                          // 377
  if(!isFunction(it))throw TypeError(it + ' is not a function!');                                                  // 378
  return it;                                                                                                       // 379
};                                                                                                                 // 380
assert.obj = function(it){                                                                                         // 381
  if(!isObject(it))throw TypeError(it + ' is not an object!');                                                     // 382
  return it;                                                                                                       // 383
};                                                                                                                 // 384
assert.inst = function(it, Constructor, name){                                                                     // 385
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");                             // 386
  return it;                                                                                                       // 387
};                                                                                                                 // 388
assert.REDUCE = 'Reduce of empty object with no initial value';                                                    // 389
                                                                                                                   // 390
var $ = {                                                                                                          // 391
  g: global,                                                                                                       // 392
  FW: true,                                                                                                        // 393
  path: global,                                                                                                    // 394
  core: core,                                                                                                      // 395
  html: global.document && document.documentElement,                                                               // 396
  // http://jsperf.com/core-js-isobject                                                                            // 397
  isObject: isObject,                                                                                              // 398
  isFunction: isFunction,                                                                                          // 399
  // Optional / simple context binding                                                                             // 400
  ctx: function(fn, that, length){                                                                                 // 401
    assert.fn(fn);                                                                                                 // 402
    if(~length && that === undefined)return fn;                                                                    // 403
    switch(length){                                                                                                // 404
      case 1: return function(a){                                                                                  // 405
        return fn.call(that, a);                                                                                   // 406
      }                                                                                                            // 407
      case 2: return function(a, b){                                                                               // 408
        return fn.call(that, a, b);                                                                                // 409
      }                                                                                                            // 410
      case 3: return function(a, b, c){                                                                            // 411
        return fn.call(that, a, b, c);                                                                             // 412
      }                                                                                                            // 413
    } return function(/* ...args */){                                                                              // 414
        return fn.apply(that, arguments);                                                                          // 415
    }                                                                                                              // 416
  },                                                                                                               // 417
  it: function(it){                                                                                                // 418
    return it;                                                                                                     // 419
  },                                                                                                               // 420
  that: function(){                                                                                                // 421
    return this;                                                                                                   // 422
  },                                                                                                               // 423
  // 7.1.4 ToInteger                                                                                               // 424
  toInteger: toInteger,                                                                                            // 425
  // 7.1.15 ToLength                                                                                               // 426
  toLength: function(it){                                                                                          // 427
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991                // 428
  },                                                                                                               // 429
  toIndex: function(index, length){                                                                                // 430
    var index = toInteger(index);                                                                                  // 431
    return index < 0 ? max(index + length, 0) : min(index, length);                                                // 432
  },                                                                                                               // 433
  trunc: trunc,                                                                                                    // 434
  // 20.1.2.4 Number.isNaN(number)                                                                                 // 435
  isNaN: function(number){                                                                                         // 436
    return number != number;                                                                                       // 437
  },                                                                                                               // 438
  has: function(it, key){                                                                                          // 439
    return hasOwnProperty.call(it, key);                                                                           // 440
  },                                                                                                               // 441
  create:     Object.create,                                                                                       // 442
  getProto:   Object.getPrototypeOf,                                                                               // 443
  DESC:       DESC,                                                                                                // 444
  desc:       desc,                                                                                                // 445
  getDesc:    Object.getOwnPropertyDescriptor,                                                                     // 446
  setDesc:    defineProperty,                                                                                      // 447
  getKeys:    Object.keys,                                                                                         // 448
  getNames:   Object.getOwnPropertyNames,                                                                          // 449
  getSymbols: Object.getOwnPropertySymbols,                                                                        // 450
  ownKeys: function(it){                                                                                           // 451
    assert.obj(it);                                                                                                // 452
    return $.getSymbols ? $.getNames(it).concat($.getSymbols(it)) : $.getNames(it);                                // 453
  },                                                                                                               // 454
  // Dummy, fix for not array-like ES3 string in es5 module                                                        // 455
  ES5Object: Object,                                                                                               // 456
  toObject: function(it){                                                                                          // 457
    return $.ES5Object(assert.def(it));                                                                            // 458
  },                                                                                                               // 459
  hide: hide,                                                                                                      // 460
  def: createDefiner(0),                                                                                           // 461
  set: global.Symbol ? simpleSet : hide,                                                                           // 462
  mix: function(target, src){                                                                                      // 463
    for(var key in src)hide(target, key, src[key]);                                                                // 464
    return target;                                                                                                 // 465
  },                                                                                                               // 466
  // $.a('str1,str2,str3') => ['str1', 'str2', 'str3']                                                             // 467
  a: function(it){                                                                                                 // 468
    return String(it).split(',');                                                                                  // 469
  },                                                                                                               // 470
  each: [].forEach,                                                                                                // 471
  assert: assert                                                                                                   // 472
};                                                                                                                 // 473
module.exports = $;                                                                                                // 474
},{"./$.global":7}],11:[function(require,module,exports){                                                          // 475
var $ = require('./$');                                                                                            // 476
module.exports = function(object, el){                                                                             // 477
  var O      = $.toObject(object)                                                                                  // 478
    , keys   = $.getKeys(O)                                                                                        // 479
    , length = keys.length                                                                                         // 480
    , index  = 0                                                                                                   // 481
    , key;                                                                                                         // 482
  while(length > index)if(O[key = keys[index++]] === el)return key;                                                // 483
}                                                                                                                  // 484
},{"./$":10}],12:[function(require,module,exports){                                                                // 485
'use strict';                                                                                                      // 486
var $      = require('./$')                                                                                        // 487
  , invoke = require('./$.invoke');                                                                                // 488
module.exports = function(/* ...pargs */){                                                                         // 489
  var fn     = $.assert.fn(this)                                                                                   // 490
    , length = arguments.length                                                                                    // 491
    , pargs  = Array(length)                                                                                       // 492
    , i      = 0                                                                                                   // 493
    , _      = $.path._                                                                                            // 494
    , holder = false;                                                                                              // 495
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;                                             // 496
  return function(/* ...args */){                                                                                  // 497
    var that    = this                                                                                             // 498
      , _length = arguments.length                                                                                 // 499
      , i = 0, j = 0, args;                                                                                        // 500
    if(!holder && !_length)return invoke(fn, pargs, that);                                                         // 501
    args = pargs.slice();                                                                                          // 502
    if(holder)for(;length > i; i++)if(args[i] === _)args[i] = arguments[j++];                                      // 503
    while(_length > j)args.push(arguments[j++]);                                                                   // 504
    return invoke(fn, args, that);                                                                                 // 505
  }                                                                                                                // 506
}                                                                                                                  // 507
},{"./$":10,"./$.invoke":8}],13:[function(require,module,exports){                                                 // 508
'use strict';                                                                                                      // 509
module.exports = function(regExp, replace, isStatic){                                                              // 510
  var replacer = replace === Object(replace) ? function(part){                                                     // 511
    return replace[part];                                                                                          // 512
  } : replace;                                                                                                     // 513
  return function(it){                                                                                             // 514
    return String(isStatic ? it : this).replace(regExp, replacer);                                                 // 515
  }                                                                                                                // 516
}                                                                                                                  // 517
},{}],14:[function(require,module,exports){                                                                        // 518
// Works with __proto__ only. Old v8 can't works with null proto objects.                                          // 519
var $      = require('./$')                                                                                        // 520
  , assert = $.assert;                                                                                             // 521
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function(buggy, set){                               // 522
  try {                                                                                                            // 523
    set = $.ctx(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);                                   // 524
    set({}, []);                                                                                                   // 525
  } catch(e){ buggy = true }                                                                                       // 526
  return function(O, proto){                                                                                       // 527
    assert.obj(O);                                                                                                 // 528
    assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");                               // 529
    if(buggy)O.__proto__ = proto;                                                                                  // 530
    else set(O, proto);                                                                                            // 531
    return O;                                                                                                      // 532
  }                                                                                                                // 533
}() : undefined);                                                                                                  // 534
},{"./$":10}],15:[function(require,module,exports){                                                                // 535
var $ = require('./$');                                                                                            // 536
module.exports = function(C){                                                                                      // 537
  if($.DESC && $.FW)$.setDesc(C, require('./$.wks')('species'), {                                                  // 538
    configurable: true,                                                                                            // 539
    get: $.that                                                                                                    // 540
  });                                                                                                              // 541
}                                                                                                                  // 542
},{"./$":10,"./$.wks":19}],16:[function(require,module,exports){                                                   // 543
'use strict';                                                                                                      // 544
var $ = require('./$');                                                                                            // 545
module.exports = function(toString){                                                                               // 546
  return function(pos){                                                                                            // 547
    var s = String($.assert.def(this))                                                                             // 548
      , i = $.toInteger(pos)                                                                                       // 549
      , l = s.length                                                                                               // 550
      , a, b;                                                                                                      // 551
    if(i < 0 || i >= l)return toString ? '' : undefined;                                                           // 552
    a = s.charCodeAt(i);                                                                                           // 553
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff             // 554
      ? toString ? s.charAt(i) : a                                                                                 // 555
      : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;                                // 556
  }                                                                                                                // 557
}                                                                                                                  // 558
},{"./$":10}],17:[function(require,module,exports){                                                                // 559
'use strict';                                                                                                      // 560
var $       = require('./$')                                                                                       // 561
  , cof     = require('./$.cof')                                                                                   // 562
  , invoke  = require('./$.invoke')                                                                                // 563
  , global             = $.g                                                                                       // 564
  , isFunction         = $.isFunction                                                                              // 565
  , ctx                = $.ctx                                                                                     // 566
  , setTask            = global.setImmediate                                                                       // 567
  , clearTask          = global.clearImmediate                                                                     // 568
  , postMessage        = global.postMessage                                                                        // 569
  , addEventListener   = global.addEventListener                                                                   // 570
  , MessageChannel     = global.MessageChannel                                                                     // 571
  , counter            = 0                                                                                         // 572
  , queue              = {}                                                                                        // 573
  , ONREADYSTATECHANGE = 'onreadystatechange'                                                                      // 574
  , defer, channel, port;                                                                                          // 575
function run(){                                                                                                    // 576
  var id = +this;                                                                                                  // 577
  if($.has(queue, id)){                                                                                            // 578
    var fn = queue[id];                                                                                            // 579
    delete queue[id];                                                                                              // 580
    fn();                                                                                                          // 581
  }                                                                                                                // 582
}                                                                                                                  // 583
function listner(event){                                                                                           // 584
  run.call(event.data);                                                                                            // 585
}                                                                                                                  // 586
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:                                                               // 587
if(!isFunction(setTask) || !isFunction(clearTask)){                                                                // 588
  setTask = function(fn){                                                                                          // 589
    var args = [], i = 1;                                                                                          // 590
    while(arguments.length > i)args.push(arguments[i++]);                                                          // 591
    queue[++counter] = function(){                                                                                 // 592
      invoke(isFunction(fn) ? fn : Function(fn), args);                                                            // 593
    }                                                                                                              // 594
    defer(counter);                                                                                                // 595
    return counter;                                                                                                // 596
  }                                                                                                                // 597
  clearTask = function(id){                                                                                        // 598
    delete queue[id];                                                                                              // 599
  }                                                                                                                // 600
  // Node.js 0.8-                                                                                                  // 601
  if(cof(global.process) == 'process'){                                                                            // 602
    defer = function(id){                                                                                          // 603
      global.process.nextTick(ctx(run, id, 1));                                                                    // 604
    }                                                                                                              // 605
  // Modern browsers, skip implementation for WebWorkers                                                           // 606
  // IE8 has postMessage, but it's sync & typeof its postMessage is object                                         // 607
  } else if(addEventListener && isFunction(postMessage) && !$.g.importScripts){                                    // 608
    defer = function(id){                                                                                          // 609
      postMessage(id, '*');                                                                                        // 610
    }                                                                                                              // 611
    addEventListener('message', listner, false);                                                                   // 612
  // WebWorkers                                                                                                    // 613
  } else if(isFunction(MessageChannel)){                                                                           // 614
    channel = new MessageChannel;                                                                                  // 615
    port    = channel.port2;                                                                                       // 616
    channel.port1.onmessage = listner;                                                                             // 617
    defer = ctx(port.postMessage, port, 1);                                                                        // 618
  // IE8-                                                                                                          // 619
  } else if($.g.document && ONREADYSTATECHANGE in document.createElement('script')){                               // 620
    defer = function(id){                                                                                          // 621
      $.html.appendChild(document.createElement('script'))[ONREADYSTATECHANGE] = function(){                       // 622
        $.html.removeChild(this);                                                                                  // 623
        run.call(id);                                                                                              // 624
      }                                                                                                            // 625
    }                                                                                                              // 626
  // Rest old browsers                                                                                             // 627
  } else {                                                                                                         // 628
    defer = function(id){                                                                                          // 629
      setTimeout(ctx(run, id, 1), 0);                                                                              // 630
    }                                                                                                              // 631
  }                                                                                                                // 632
}                                                                                                                  // 633
module.exports = {                                                                                                 // 634
  set:   setTask,                                                                                                  // 635
  clear: clearTask                                                                                                 // 636
};                                                                                                                 // 637
},{"./$":10,"./$.cof":5,"./$.invoke":8}],18:[function(require,module,exports){                                     // 638
var sid = 0                                                                                                        // 639
function uid(key){                                                                                                 // 640
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);                                            // 641
}                                                                                                                  // 642
uid.safe = require('./$.global').Symbol || uid;                                                                    // 643
module.exports = uid;                                                                                              // 644
},{"./$.global":7}],19:[function(require,module,exports){                                                          // 645
var global = require('./$.global')                                                                                 // 646
  , store  = {};                                                                                                   // 647
module.exports = function(name){                                                                                   // 648
  return store[name] || (store[name] =                                                                             // 649
    (global.Symbol && global.Symbol[name]) || require('./$.uid').safe('Symbol.' + name));                          // 650
}                                                                                                                  // 651
},{"./$.global":7,"./$.uid":18}],20:[function(require,module,exports){                                             // 652
var $                = require('./$')                                                                              // 653
  , cof              = require('./$.cof')                                                                          // 654
  , $def             = require('./$.def')                                                                          // 655
  , invoke           = require('./$.invoke')                                                                       // 656
  , arrayMethod      = require('./$.array-methods')                                                                // 657
  , IE_PROTO         = require('./$.uid').safe('__proto__')                                                        // 658
  , assert           = $.assert                                                                                    // 659
  , assertObject     = assert.obj                                                                                  // 660
  , ObjectProto      = Object.prototype                                                                            // 661
  , A                = []                                                                                          // 662
  , slice            = A.slice                                                                                     // 663
  , indexOf          = A.indexOf                                                                                   // 664
  , classof          = cof.classof                                                                                 // 665
  , defineProperties = Object.defineProperties                                                                     // 666
  , has              = $.has                                                                                       // 667
  , defineProperty   = $.setDesc                                                                                   // 668
  , getOwnDescriptor = $.getDesc                                                                                   // 669
  , isFunction       = $.isFunction                                                                                // 670
  , toObject         = $.toObject                                                                                  // 671
  , toLength         = $.toLength                                                                                  // 672
  , IE8_DOM_DEFINE   = false;                                                                                      // 673
                                                                                                                   // 674
if(!$.DESC){                                                                                                       // 675
  try {                                                                                                            // 676
    IE8_DOM_DEFINE = defineProperty(document.createElement('div'), 'x',                                            // 677
      {get: function(){return 8}}                                                                                  // 678
    ).x == 8;                                                                                                      // 679
  } catch(e){}                                                                                                     // 680
  $.setDesc = function(O, P, A){                                                                                   // 681
    if(IE8_DOM_DEFINE)try {                                                                                        // 682
      return defineProperty(O, P, A);                                                                              // 683
    } catch(e){}                                                                                                   // 684
    if('get' in A || 'set' in A)throw TypeError('Accessors not supported!');                                       // 685
    if('value' in A)assertObject(O)[P] = A.value;                                                                  // 686
    return O;                                                                                                      // 687
  };                                                                                                               // 688
  $.getDesc = function(O, P){                                                                                      // 689
    if(IE8_DOM_DEFINE)try {                                                                                        // 690
      return getOwnDescriptor(O, P);                                                                               // 691
    } catch(e){}                                                                                                   // 692
    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);                                // 693
  };                                                                                                               // 694
  defineProperties = function(O, Properties){                                                                      // 695
    assertObject(O);                                                                                               // 696
    var keys   = $.getKeys(Properties)                                                                             // 697
      , length = keys.length                                                                                       // 698
      , i = 0                                                                                                      // 699
      , P;                                                                                                         // 700
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);                                                   // 701
    return O;                                                                                                      // 702
  };                                                                                                               // 703
}                                                                                                                  // 704
$def($def.S + $def.F * !$.DESC, 'Object', {                                                                        // 705
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)                                                     // 706
  getOwnPropertyDescriptor: $.getDesc,                                                                             // 707
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)                                                   // 708
  defineProperty: $.setDesc,                                                                                       // 709
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)                                                    // 710
  defineProperties: defineProperties                                                                               // 711
});                                                                                                                // 712
                                                                                                                   // 713
  // IE 8- don't enum bug keys                                                                                     // 714
var keys1 = $.a('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf')   // 715
  // Additional keys for getOwnPropertyNames                                                                       // 716
  , keys2 = keys1.concat('length', 'prototype')                                                                    // 717
  , keysLen1 = keys1.length;                                                                                       // 718
                                                                                                                   // 719
// Create object with `null` prototype: use iframe Object with cleared prototype                                   // 720
function createDict(){                                                                                             // 721
  // Thrash, waste and sodomy: IE GC bug                                                                           // 722
  var iframe = document.createElement('iframe')                                                                    // 723
    , i      = keysLen1                                                                                            // 724
    , iframeDocument;                                                                                              // 725
  iframe.style.display = 'none';                                                                                   // 726
  $.html.appendChild(iframe);                                                                                      // 727
  iframe.src = 'javascript:';                                                                                      // 728
  // createDict = iframe.contentWindow.Object;                                                                     // 729
  // html.removeChild(iframe);                                                                                     // 730
  iframeDocument = iframe.contentWindow.document;                                                                  // 731
  iframeDocument.open();                                                                                           // 732
  iframeDocument.write('<script>document.F=Object</script>');                                                      // 733
  iframeDocument.close();                                                                                          // 734
  createDict = iframeDocument.F;                                                                                   // 735
  while(i--)delete createDict.prototype[keys1[i]];                                                                 // 736
  return createDict();                                                                                             // 737
}                                                                                                                  // 738
function createGetKeys(names, length, isNames){                                                                    // 739
  return function(object){                                                                                         // 740
    var O      = toObject(object)                                                                                  // 741
      , i      = 0                                                                                                 // 742
      , result = []                                                                                                // 743
      , key;                                                                                                       // 744
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);                                               // 745
    // Don't enum bug & hidden keys                                                                                // 746
    while(length > i)if(has(O, key = names[i++])){                                                                 // 747
      ~indexOf.call(result, key) || result.push(key);                                                              // 748
    }                                                                                                              // 749
    return result;                                                                                                 // 750
  }                                                                                                                // 751
}                                                                                                                  // 752
function isPrimitive(it){ return !$.isObject(it) }                                                                 // 753
function Empty(){}                                                                                                 // 754
$def($def.S, 'Object', {                                                                                           // 755
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)                                                                  // 756
  getPrototypeOf: $.getProto = $.getProto || function(O){                                                          // 757
    O = Object(assert.def(O));                                                                                     // 758
    if(has(O, IE_PROTO))return O[IE_PROTO];                                                                        // 759
    if(isFunction(O.constructor) && O instanceof O.constructor){                                                   // 760
      return O.constructor.prototype;                                                                              // 761
    } return O instanceof Object ? ObjectProto : null;                                                             // 762
  },                                                                                                               // 763
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)                                                             // 764
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),                        // 765
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])                                                           // 766
  create: $.create = $.create || function(O, /*?*/Properties){                                                     // 767
    var result                                                                                                     // 768
    if(O !== null){                                                                                                // 769
      Empty.prototype = assertObject(O);                                                                           // 770
      result = new Empty();                                                                                        // 771
      Empty.prototype = null;                                                                                      // 772
      // add "__proto__" for Object.getPrototypeOf shim                                                            // 773
      result[IE_PROTO] = O;                                                                                        // 774
    } else result = createDict();                                                                                  // 775
    return Properties === undefined ? result : defineProperties(result, Properties);                               // 776
  },                                                                                                               // 777
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)                                                                          // 778
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),                                            // 779
  // 19.1.2.17 / 15.2.3.8 Object.seal(O)                                                                           // 780
  seal: $.it, // <- cap                                                                                            // 781
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)                                                                          // 782
  freeze: $.it, // <- cap                                                                                          // 783
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)                                                             // 784
  preventExtensions: $.it, // <- cap                                                                               // 785
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)                                                                      // 786
  isSealed: isPrimitive, // <- cap                                                                                 // 787
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)                                                                      // 788
  isFrozen: isPrimitive, // <- cap                                                                                 // 789
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)                                                                  // 790
  isExtensible: $.isObject // <- cap                                                                               // 791
});                                                                                                                // 792
                                                                                                                   // 793
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)                                                   // 794
$def($def.P, 'Function', {                                                                                         // 795
  bind: function(that /*, args... */){                                                                             // 796
    var fn       = assert.fn(this)                                                                                 // 797
      , partArgs = slice.call(arguments, 1);                                                                       // 798
    function bound(/* args... */){                                                                                 // 799
      var args = partArgs.concat(slice.call(arguments));                                                           // 800
      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);                              // 801
    }                                                                                                              // 802
    if(fn.prototype)bound.prototype = fn.prototype;                                                                // 803
    return bound;                                                                                                  // 804
  }                                                                                                                // 805
});                                                                                                                // 806
                                                                                                                   // 807
// Fix for not array-like ES3 string                                                                               // 808
function arrayMethodFix(fn){                                                                                       // 809
  return function(){                                                                                               // 810
    return fn.apply($.ES5Object(this), arguments);                                                                 // 811
  }                                                                                                                // 812
}                                                                                                                  // 813
if(!(0 in Object('z') && 'z'[0] == 'z')){                                                                          // 814
  $.ES5Object = function(it){                                                                                      // 815
    return cof(it) == 'String' ? it.split('') : Object(it);                                                        // 816
  }                                                                                                                // 817
}                                                                                                                  // 818
$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {                                                         // 819
  slice: arrayMethodFix(slice),                                                                                    // 820
  join: arrayMethodFix(A.join)                                                                                     // 821
});                                                                                                                // 822
                                                                                                                   // 823
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)                                                                          // 824
$def($def.S, 'Array', {                                                                                            // 825
  isArray: function(arg){                                                                                          // 826
    return cof(arg) == 'Array'                                                                                     // 827
  }                                                                                                                // 828
});                                                                                                                // 829
function createArrayReduce(isRight){                                                                               // 830
  return function(callbackfn, memo){                                                                               // 831
    assert.fn(callbackfn);                                                                                         // 832
    var O      = toObject(this)                                                                                    // 833
      , length = toLength(O.length)                                                                                // 834
      , index  = isRight ? length - 1 : 0                                                                          // 835
      , i      = isRight ? -1 : 1;                                                                                 // 836
    if(2 > arguments.length)for(;;){                                                                               // 837
      if(index in O){                                                                                              // 838
        memo = O[index];                                                                                           // 839
        index += i;                                                                                                // 840
        break;                                                                                                     // 841
      }                                                                                                            // 842
      index += i;                                                                                                  // 843
      assert(isRight ? index >= 0 : length > index, assert.REDUCE);                                                // 844
    }                                                                                                              // 845
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){                                         // 846
      memo = callbackfn(memo, O[index], index, this);                                                              // 847
    }                                                                                                              // 848
    return memo;                                                                                                   // 849
  }                                                                                                                // 850
}                                                                                                                  // 851
$def($def.P, 'Array', {                                                                                            // 852
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])                                         // 853
  forEach: $.each = $.each || arrayMethod(0),                                                                      // 854
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])                                             // 855
  map: arrayMethod(1),                                                                                             // 856
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])                                           // 857
  filter: arrayMethod(2),                                                                                          // 858
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])                                            // 859
  some: arrayMethod(3),                                                                                            // 860
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])                                            // 861
  every: arrayMethod(4),                                                                                           // 862
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])                                     // 863
  reduce: createArrayReduce(false),                                                                                // 864
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])                                // 865
  reduceRight: createArrayReduce(true),                                                                            // 866
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])                                    // 867
  indexOf: indexOf = indexOf || require('./$.array-includes')(false),                                              // 868
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])                                // 869
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){                                                             // 870
    var O      = toObject(this)                                                                                    // 871
      , length = toLength(O.length)                                                                                // 872
      , index  = length - 1;                                                                                       // 873
    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));                                       // 874
    if(index < 0)index = toLength(length + index);                                                                 // 875
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;                                        // 876
    return -1;                                                                                                     // 877
  }                                                                                                                // 878
});                                                                                                                // 879
                                                                                                                   // 880
// 21.1.3.25 / 15.5.4.20 String.prototype.trim()                                                                   // 881
$def($def.P, 'String', {trim: require('./$.replacer')(/^\s*([\s\S]*\S)?\s*$/, '$1')});                             // 882
                                                                                                                   // 883
// 20.3.3.1 / 15.9.4.4 Date.now()                                                                                  // 884
$def($def.S, 'Date', {now: function(){                                                                             // 885
  return +new Date;                                                                                                // 886
}});                                                                                                               // 887
                                                                                                                   // 888
function lz(num){                                                                                                  // 889
  return num > 9 ? num : '0' + num;                                                                                // 890
}                                                                                                                  // 891
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()                                                              // 892
$def($def.P, 'Date', {toISOString: function(){                                                                     // 893
  if(!isFinite(this))throw RangeError('Invalid time value');                                                       // 894
  var d = this                                                                                                     // 895
    , y = d.getUTCFullYear()                                                                                       // 896
    , m = d.getUTCMilliseconds()                                                                                   // 897
    , s = y < 0 ? '-' : y > 9999 ? '+' : '';                                                                       // 898
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +                                                          // 899
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +                                                     // 900
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +                                                      // 901
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';                                          // 902
}});                                                                                                               // 903
                                                                                                                   // 904
if(classof(function(){return arguments}()) == 'Object')cof.classof = function(it){                                 // 905
  var cof = classof(it);                                                                                           // 906
  return cof == 'Object' && isFunction(it.callee) ? 'Arguments' : cof;                                             // 907
}                                                                                                                  // 908
},{"./$":10,"./$.array-includes":2,"./$.array-methods":3,"./$.cof":5,"./$.def":6,"./$.invoke":8,"./$.replacer":13,"./$.uid":18}],21:[function(require,module,exports){
'use strict';                                                                                                      // 910
var $                = require('./$')                                                                              // 911
  , $def             = require('./$.def')                                                                          // 912
  , arrayMethod      = require('./$.array-methods')                                                                // 913
  , UNSCOPABLES      = require('./$.wks')('unscopables')                                                           // 914
  , assertDefined    = $.assert.def                                                                                // 915
  , toIndex          = $.toIndex                                                                                   // 916
  , toLength         = $.toLength                                                                                  // 917
  , ArrayProto       = Array.prototype                                                                             // 918
  , ArrayUnscopables = ArrayProto[UNSCOPABLES] || {};                                                              // 919
$def($def.P, 'Array', {                                                                                            // 920
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)                                         // 921
  copyWithin: function(target /* = 0 */, start /* = 0, end = @length */){                                          // 922
    var O     = Object(assertDefined(this))                                                                        // 923
      , len   = toLength(O.length)                                                                                 // 924
      , to    = toIndex(target, len)                                                                               // 925
      , from  = toIndex(start, len)                                                                                // 926
      , end   = arguments[2]                                                                                       // 927
      , fin   = end === undefined ? len : toIndex(end, len)                                                        // 928
      , count = Math.min(fin - from, len - to)                                                                     // 929
      , inc   = 1;                                                                                                 // 930
    if(from < to && to < from + count){                                                                            // 931
      inc  = -1;                                                                                                   // 932
      from = from + count - 1;                                                                                     // 933
      to   = to + count - 1;                                                                                       // 934
    }                                                                                                              // 935
    while(count-- > 0){                                                                                            // 936
      if(from in O)O[to] = O[from];                                                                                // 937
      else delete O[to];                                                                                           // 938
      to += inc;                                                                                                   // 939
      from += inc;                                                                                                 // 940
    } return O;                                                                                                    // 941
  },                                                                                                               // 942
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)                                            // 943
  fill: function(value /*, start = 0, end = @length */){                                                           // 944
    var O      = Object(assertDefined(this))                                                                       // 945
      , length = toLength(O.length)                                                                                // 946
      , index  = toIndex(arguments[1], length)                                                                     // 947
      , end    = arguments[2]                                                                                      // 948
      , endPos = end === undefined ? length : toIndex(end, length);                                                // 949
    while(endPos > index)O[index++] = value;                                                                       // 950
    return O;                                                                                                      // 951
  },                                                                                                               // 952
  // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)                                                 // 953
  find: arrayMethod(5),                                                                                            // 954
  // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)                                            // 955
  findIndex: arrayMethod(6)                                                                                        // 956
});                                                                                                                // 957
                                                                                                                   // 958
if($.FW){                                                                                                          // 959
  // 22.1.3.31 Array.prototype[@@unscopables]                                                                      // 960
  $.each.call($.a('find,findIndex,fill,copyWithin,entries,keys,values'), function(it){                             // 961
    ArrayUnscopables[it] = true;                                                                                   // 962
  });                                                                                                              // 963
  UNSCOPABLES in ArrayProto || $.hide(ArrayProto, UNSCOPABLES, ArrayUnscopables);                                  // 964
}                                                                                                                  // 965
},{"./$":10,"./$.array-methods":3,"./$.def":6,"./$.wks":19}],22:[function(require,module,exports){                 // 966
require('./es6.iterators');                                                                                        // 967
var $     = require('./$')                                                                                         // 968
  , $def  = require('./$.def')                                                                                     // 969
  , $iter = require('./$.iter');                                                                                   // 970
function generic(A, B){                                                                                            // 971
  // strange IE quirks mode bug -> use typeof instead of isFunction                                                // 972
  return typeof A == 'function' ? A : B;                                                                           // 973
}                                                                                                                  // 974
$def($def.S + $def.F * $iter.DANGER_CLOSING, 'Array', {                                                            // 975
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)                                        // 976
  from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){                                           // 977
    var O       = Object($.assert.def(arrayLike))                                                                  // 978
      , mapfn   = arguments[1]                                                                                     // 979
      , mapping = mapfn !== undefined                                                                              // 980
      , f       = mapping ? $.ctx(mapfn, arguments[2], 2) : undefined                                              // 981
      , index   = 0                                                                                                // 982
      , length, result, step;                                                                                      // 983
    if($iter.is(O)){                                                                                               // 984
      result = new (generic(this, Array));                                                                         // 985
      $iter.exec(function(iterator){                                                                               // 986
        for(; !(step = iterator.next()).done; index++){                                                            // 987
          result[index] = mapping ? f(step.value, index) : step.value;                                             // 988
        }                                                                                                          // 989
      }, $iter.get(O));                                                                                            // 990
    } else {                                                                                                       // 991
      result = new (generic(this, Array))(length = $.toLength(O.length));                                          // 992
      for(; length > index; index++){                                                                              // 993
        result[index] = mapping ? f(O[index], index) : O[index];                                                   // 994
      }                                                                                                            // 995
    }                                                                                                              // 996
    result.length = index;                                                                                         // 997
    return result;                                                                                                 // 998
  }                                                                                                                // 999
});                                                                                                                // 1000
                                                                                                                   // 1001
$def($def.S, 'Array', {                                                                                            // 1002
  // 22.1.2.3 Array.of( ...items)                                                                                  // 1003
  of: function(/* ...args */){                                                                                     // 1004
    var index  = 0                                                                                                 // 1005
      , length = arguments.length                                                                                  // 1006
      , result = new (generic(this, Array))(length);                                                               // 1007
    while(length > index)result[index] = arguments[index++];                                                       // 1008
    result.length = length;                                                                                        // 1009
    return result;                                                                                                 // 1010
  }                                                                                                                // 1011
});                                                                                                                // 1012
                                                                                                                   // 1013
require('./$.species')(Array);                                                                                     // 1014
},{"./$":10,"./$.def":6,"./$.iter":9,"./$.species":15,"./es6.iterators":25}],23:[function(require,module,exports){ // 1015
'use strict';                                                                                                      // 1016
require('./es6.iterators');                                                                                        // 1017
var $        = require('./$')                                                                                      // 1018
  , cof      = require('./$.cof')                                                                                  // 1019
  , $def     = require('./$.def')                                                                                  // 1020
  , safe     = require('./$.uid').safe                                                                             // 1021
  , $iter    = require('./$.iter')                                                                                 // 1022
  , step     = $iter.step                                                                                          // 1023
  , assert   = $.assert                                                                                            // 1024
  , isFrozen = Object.isFrozen || $.core.Object.isFrozen                                                           // 1025
  , CID      = safe('cid')                                                                                         // 1026
  , O1       = safe('O1')                                                                                          // 1027
  , WEAK     = safe('weak')                                                                                        // 1028
  , LEAK     = safe('leak')                                                                                        // 1029
  , LAST     = safe('last')                                                                                        // 1030
  , FIRST    = safe('first')                                                                                       // 1031
  , ITER     = safe('iter')                                                                                        // 1032
  , SIZE     = $.DESC ? safe('size') : 'size'                                                                      // 1033
  , cid      = 0                                                                                                   // 1034
  , tmp      = {};                                                                                                 // 1035
                                                                                                                   // 1036
function getCollection(NAME, methods, commonMethods, isMap, isWeak){                                               // 1037
  var Base  = $.g[NAME]                                                                                            // 1038
    , C     = Base                                                                                                 // 1039
    , ADDER = isMap ? 'set' : 'add'                                                                                // 1040
    , proto = C && C.prototype                                                                                     // 1041
    , O     = {};                                                                                                  // 1042
  function initFromIterable(that, iterable){                                                                       // 1043
    if(iterable != undefined)$iter.forOf(iterable, isMap, that[ADDER], that);                                      // 1044
    return that;                                                                                                   // 1045
  }                                                                                                                // 1046
  function fixSVZ(key, chain){                                                                                     // 1047
    var method = proto[key];                                                                                       // 1048
    if($.FW)proto[key] = function(a, b){                                                                           // 1049
      var result = method.call(this, a === 0 ? 0 : a, b);                                                          // 1050
      return chain ? this : result;                                                                                // 1051
    };                                                                                                             // 1052
  }                                                                                                                // 1053
  function checkIter(){                                                                                            // 1054
    var done = false;                                                                                              // 1055
    var O = {next: function(){                                                                                     // 1056
      done = true;                                                                                                 // 1057
      return step(1);                                                                                              // 1058
    }};                                                                                                            // 1059
    O[SYMBOL_ITERATOR] = $.that;                                                                                   // 1060
    try { new C(O) } catch(e){}                                                                                    // 1061
    return done;                                                                                                   // 1062
  }                                                                                                                // 1063
  if(!$.isFunction(C) || !(isWeak || (!$iter.BUGGY && proto.forEach && proto.entries))){                           // 1064
    // create collection constructor                                                                               // 1065
    C = isWeak                                                                                                     // 1066
      ? function(iterable){                                                                                        // 1067
          $.set(assert.inst(this, C, NAME), CID, cid++);                                                           // 1068
          initFromIterable(this, iterable);                                                                        // 1069
        }                                                                                                          // 1070
      : function(iterable){                                                                                        // 1071
          var that = assert.inst(this, C, NAME);                                                                   // 1072
          $.set(that, O1, $.create(null));                                                                         // 1073
          $.set(that, SIZE, 0);                                                                                    // 1074
          $.set(that, LAST, undefined);                                                                            // 1075
          $.set(that, FIRST, undefined);                                                                           // 1076
          initFromIterable(that, iterable);                                                                        // 1077
        };                                                                                                         // 1078
    $.mix($.mix(C.prototype, methods), commonMethods);                                                             // 1079
    isWeak || !$.DESC || $.setDesc(C.prototype, 'size', {get: function(){                                          // 1080
      return assert.def(this[SIZE]);                                                                               // 1081
    }});                                                                                                           // 1082
  } else {                                                                                                         // 1083
    var Native = C                                                                                                 // 1084
      , inst   = new C                                                                                             // 1085
      , chain  = inst[ADDER](isWeak ? {} : -0, 1)                                                                  // 1086
      , buggyZero;                                                                                                 // 1087
    // wrap to init collections from iterable                                                                      // 1088
    if($iter.DANGER_CLOSING || !checkIter()){                                                                      // 1089
      C = function(iterable){                                                                                      // 1090
        assert.inst(this, C, NAME);                                                                                // 1091
        return initFromIterable(new Native, iterable);                                                             // 1092
      }                                                                                                            // 1093
      C.prototype = proto;                                                                                         // 1094
      if($.FW)proto.constructor = C;                                                                               // 1095
    }                                                                                                              // 1096
    isWeak || inst.forEach(function(val, key){                                                                     // 1097
      buggyZero = 1 / key === -Infinity;                                                                           // 1098
    });                                                                                                            // 1099
    // fix converting -0 key to +0                                                                                 // 1100
    if(buggyZero){                                                                                                 // 1101
      fixSVZ('delete');                                                                                            // 1102
      fixSVZ('has');                                                                                               // 1103
      isMap && fixSVZ('get');                                                                                      // 1104
    }                                                                                                              // 1105
    // + fix .add & .set for chaining                                                                              // 1106
    if(buggyZero || chain !== inst)fixSVZ(ADDER, true);                                                            // 1107
  }                                                                                                                // 1108
  cof.set(C, NAME);                                                                                                // 1109
  require('./$.species')(C);                                                                                       // 1110
                                                                                                                   // 1111
  O[NAME] = C;                                                                                                     // 1112
  $def($def.G + $def.W + $def.F * (C != Base), O);                                                                 // 1113
                                                                                                                   // 1114
  // add .keys, .values, .entries, [@@iterator]                                                                    // 1115
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11                            // 1116
  isWeak || $iter.std(C, NAME, function(iterated, kind){                                                           // 1117
    $.set(this, ITER, {o: iterated, k: kind});                                                                     // 1118
  }, function(){                                                                                                   // 1119
    var iter  = this[ITER]                                                                                         // 1120
      , kind  = iter.k                                                                                             // 1121
      , entry = iter.l;                                                                                            // 1122
    // revert to the last existing entry                                                                           // 1123
    while(entry && entry.r)entry = entry.p;                                                                        // 1124
    // get next entry                                                                                              // 1125
    if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){                                            // 1126
      // or finish the iteration                                                                                   // 1127
      iter.o = undefined;                                                                                          // 1128
      return step(1);                                                                                              // 1129
    }                                                                                                              // 1130
    // return step by kind                                                                                         // 1131
    if(kind == 'key')   return step(0, entry.k);                                                                   // 1132
    if(kind == 'value') return step(0, entry.v);                                                                   // 1133
                        return step(0, [entry.k, entry.v]);                                                        // 1134
  }, isMap ? 'key+value' : 'value', !isMap, true);                                                                 // 1135
                                                                                                                   // 1136
  return C;                                                                                                        // 1137
}                                                                                                                  // 1138
                                                                                                                   // 1139
function fastKey(it, create){                                                                                      // 1140
  // return primitive with prefix                                                                                  // 1141
  if(!$.isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;                                              // 1142
  // can't set id to frozen object                                                                                 // 1143
  if(isFrozen(it))return 'F';                                                                                      // 1144
  if(!$.has(it, CID)){                                                                                             // 1145
    // not necessary to add id                                                                                     // 1146
    if(!create)return 'E';                                                                                         // 1147
    // add missing object id                                                                                       // 1148
    $.hide(it, CID, ++cid);                                                                                        // 1149
  // return object id with prefix                                                                                  // 1150
  } return 'O' + it[CID];                                                                                          // 1151
}                                                                                                                  // 1152
function getEntry(that, key){                                                                                      // 1153
  // fast case                                                                                                     // 1154
  var index = fastKey(key), entry;                                                                                 // 1155
  if(index != 'F')return that[O1][index];                                                                          // 1156
  // frozen object case                                                                                            // 1157
  for(entry = that[FIRST]; entry; entry = entry.n){                                                                // 1158
    if(entry.k == key)return entry;                                                                                // 1159
  }                                                                                                                // 1160
}                                                                                                                  // 1161
function def(that, key, value){                                                                                    // 1162
  var entry = getEntry(that, key)                                                                                  // 1163
    , prev, index;                                                                                                 // 1164
  // change existing entry                                                                                         // 1165
  if(entry)entry.v = value;                                                                                        // 1166
  // create new entry                                                                                              // 1167
  else {                                                                                                           // 1168
    that[LAST] = entry = {                                                                                         // 1169
      i: index = fastKey(key, true), // <- index                                                                   // 1170
      k: key,                        // <- key                                                                     // 1171
      v: value,                      // <- value                                                                   // 1172
      p: prev = that[LAST],          // <- previous entry                                                          // 1173
      n: undefined,                  // <- next entry                                                              // 1174
      r: false                       // <- removed                                                                 // 1175
    };                                                                                                             // 1176
    if(!that[FIRST])that[FIRST] = entry;                                                                           // 1177
    if(prev)prev.n = entry;                                                                                        // 1178
    that[SIZE]++;                                                                                                  // 1179
    // add to index                                                                                                // 1180
    if(index != 'F')that[O1][index] = entry;                                                                       // 1181
  } return that;                                                                                                   // 1182
}                                                                                                                  // 1183
                                                                                                                   // 1184
var collectionMethods = {                                                                                          // 1185
  // 23.1.3.1 Map.prototype.clear()                                                                                // 1186
  // 23.2.3.2 Set.prototype.clear()                                                                                // 1187
  clear: function(){                                                                                               // 1188
    for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){                            // 1189
      entry.r = true;                                                                                              // 1190
      if(entry.p)entry.p = entry.p.n = undefined;                                                                  // 1191
      delete data[entry.i];                                                                                        // 1192
    }                                                                                                              // 1193
    that[FIRST] = that[LAST] = undefined;                                                                          // 1194
    that[SIZE] = 0;                                                                                                // 1195
  },                                                                                                               // 1196
  // 23.1.3.3 Map.prototype.delete(key)                                                                            // 1197
  // 23.2.3.4 Set.prototype.delete(value)                                                                          // 1198
  'delete': function(key){                                                                                         // 1199
    var that  = this                                                                                               // 1200
      , entry = getEntry(that, key);                                                                               // 1201
    if(entry){                                                                                                     // 1202
      var next = entry.n                                                                                           // 1203
        , prev = entry.p;                                                                                          // 1204
      delete that[O1][entry.i];                                                                                    // 1205
      entry.r = true;                                                                                              // 1206
      if(prev)prev.n = next;                                                                                       // 1207
      if(next)next.p = prev;                                                                                       // 1208
      if(that[FIRST] == entry)that[FIRST] = next;                                                                  // 1209
      if(that[LAST] == entry)that[LAST] = prev;                                                                    // 1210
      that[SIZE]--;                                                                                                // 1211
    } return !!entry;                                                                                              // 1212
  },                                                                                                               // 1213
  // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)                                               // 1214
  // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)                                               // 1215
  forEach: function(callbackfn /*, that = undefined */){                                                           // 1216
    var f = $.ctx(callbackfn, arguments[1], 3)                                                                     // 1217
      , entry;                                                                                                     // 1218
    while(entry = entry ? entry.n : this[FIRST]){                                                                  // 1219
      f(entry.v, entry.k, this);                                                                                   // 1220
      // revert to the last existing entry                                                                         // 1221
      while(entry && entry.r)entry = entry.p;                                                                      // 1222
    }                                                                                                              // 1223
  },                                                                                                               // 1224
  // 23.1.3.7 Map.prototype.has(key)                                                                               // 1225
  // 23.2.3.7 Set.prototype.has(value)                                                                             // 1226
  has: function(key){                                                                                              // 1227
    return !!getEntry(this, key);                                                                                  // 1228
  }                                                                                                                // 1229
}                                                                                                                  // 1230
                                                                                                                   // 1231
// 23.1 Map Objects                                                                                                // 1232
var Map = getCollection('Map', {                                                                                   // 1233
  // 23.1.3.6 Map.prototype.get(key)                                                                               // 1234
  get: function(key){                                                                                              // 1235
    var entry = getEntry(this, key);                                                                               // 1236
    return entry && entry.v;                                                                                       // 1237
  },                                                                                                               // 1238
  // 23.1.3.9 Map.prototype.set(key, value)                                                                        // 1239
  set: function(key, value){                                                                                       // 1240
    return def(this, key === 0 ? 0 : key, value);                                                                  // 1241
  }                                                                                                                // 1242
}, collectionMethods, true);                                                                                       // 1243
                                                                                                                   // 1244
// 23.2 Set Objects                                                                                                // 1245
getCollection('Set', {                                                                                             // 1246
  // 23.2.3.1 Set.prototype.add(value)                                                                             // 1247
  add: function(value){                                                                                            // 1248
    return def(this, value = value === 0 ? 0 : value, value);                                                      // 1249
  }                                                                                                                // 1250
}, collectionMethods);                                                                                             // 1251
                                                                                                                   // 1252
function defWeak(that, key, value){                                                                                // 1253
  if(isFrozen(assert.obj(key)))leakStore(that).set(key, value);                                                    // 1254
  else {                                                                                                           // 1255
    $.has(key, WEAK) || $.hide(key, WEAK, {});                                                                     // 1256
    key[WEAK][that[CID]] = value;                                                                                  // 1257
  } return that;                                                                                                   // 1258
}                                                                                                                  // 1259
function leakStore(that){                                                                                          // 1260
  return that[LEAK] || $.hide(that, LEAK, new Map)[LEAK];                                                          // 1261
}                                                                                                                  // 1262
                                                                                                                   // 1263
var weakMethods = {                                                                                                // 1264
  // 23.3.3.2 WeakMap.prototype.delete(key)                                                                        // 1265
  // 23.4.3.3 WeakSet.prototype.delete(value)                                                                      // 1266
  'delete': function(key){                                                                                         // 1267
    if(!$.isObject(key))return false;                                                                              // 1268
    if(isFrozen(key))return leakStore(this)['delete'](key);                                                        // 1269
    return $.has(key, WEAK) && $.has(key[WEAK], this[CID]) && delete key[WEAK][this[CID]];                         // 1270
  },                                                                                                               // 1271
  // 23.3.3.4 WeakMap.prototype.has(key)                                                                           // 1272
  // 23.4.3.4 WeakSet.prototype.has(value)                                                                         // 1273
  has: function(key){                                                                                              // 1274
    if(!$.isObject(key))return false;                                                                              // 1275
    if(isFrozen(key))return leakStore(this).has(key);                                                              // 1276
    return $.has(key, WEAK) && $.has(key[WEAK], this[CID]);                                                        // 1277
  }                                                                                                                // 1278
};                                                                                                                 // 1279
                                                                                                                   // 1280
// 23.3 WeakMap Objects                                                                                            // 1281
var WeakMap = getCollection('WeakMap', {                                                                           // 1282
  // 23.3.3.3 WeakMap.prototype.get(key)                                                                           // 1283
  get: function(key){                                                                                              // 1284
    if($.isObject(key)){                                                                                           // 1285
      if(isFrozen(key))return leakStore(this).get(key);                                                            // 1286
      if($.has(key, WEAK))return key[WEAK][this[CID]];                                                             // 1287
    }                                                                                                              // 1288
  },                                                                                                               // 1289
  // 23.3.3.5 WeakMap.prototype.set(key, value)                                                                    // 1290
  set: function(key, value){                                                                                       // 1291
    return defWeak(this, key, value);                                                                              // 1292
  }                                                                                                                // 1293
}, weakMethods, true, true);                                                                                       // 1294
                                                                                                                   // 1295
// IE11 WeakMap frozen keys fix                                                                                    // 1296
if($.FW && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){                                                // 1297
  $.each.call($.a('delete,has,get,set'), function(key){                                                            // 1298
    var method = WeakMap.prototype[key];                                                                           // 1299
    WeakMap.prototype[key] = function(a, b){                                                                       // 1300
      // store frozen objects on leaky map                                                                         // 1301
      if($.isObject(a) && isFrozen(a)){                                                                            // 1302
        var result = leakStore(this)[key](a, b);                                                                   // 1303
        return key == 'set' ? this : result;                                                                       // 1304
      // store all the rest on native weakmap                                                                      // 1305
      } return method.call(this, a, b);                                                                            // 1306
    };                                                                                                             // 1307
  });                                                                                                              // 1308
}                                                                                                                  // 1309
                                                                                                                   // 1310
// 23.4 WeakSet Objects                                                                                            // 1311
getCollection('WeakSet', {                                                                                         // 1312
  // 23.4.3.1 WeakSet.prototype.add(value)                                                                         // 1313
  add: function(value){                                                                                            // 1314
    return defWeak(this, value, true);                                                                             // 1315
  }                                                                                                                // 1316
}, weakMethods, false, true);                                                                                      // 1317
},{"./$":10,"./$.cof":5,"./$.def":6,"./$.iter":9,"./$.species":15,"./$.uid":18,"./es6.iterators":25}],24:[function(require,module,exports){
'use strict';                                                                                                      // 1319
var $       = require('./$')                                                                                       // 1320
  , NAME    = 'name'                                                                                               // 1321
  , FnProto = Function.prototype;                                                                                  // 1322
// 19.2.4.2 name                                                                                                   // 1323
NAME in FnProto || ($.FW && $.DESC && $.setDesc(FnProto, NAME, {                                                   // 1324
  configurable: true,                                                                                              // 1325
  get: function(){                                                                                                 // 1326
    var match = String(this).match(/^\s*function ([^ (]*)/)                                                        // 1327
      , name  = match ? match[1] : '';                                                                             // 1328
    $.has(this, NAME) || $.setDesc(this, NAME, $.desc(5, name));                                                   // 1329
    return name;                                                                                                   // 1330
  },                                                                                                               // 1331
  set: function(value){                                                                                            // 1332
    $.has(this, NAME) || $.setDesc(this, NAME, $.desc(0, value));                                                  // 1333
  }                                                                                                                // 1334
}));                                                                                                               // 1335
},{"./$":10}],25:[function(require,module,exports){                                                                // 1336
var $     = require('./$')                                                                                         // 1337
  , at    = require('./$.string-at')(true)                                                                         // 1338
  , ITER  = require('./$.uid').safe('iter')                                                                        // 1339
  , $iter = require('./$.iter')                                                                                    // 1340
  , step  = $iter.step                                                                                             // 1341
  , Iterators = $iter.Iterators;                                                                                   // 1342
// 22.1.3.4 Array.prototype.entries()                                                                              // 1343
// 22.1.3.13 Array.prototype.keys()                                                                                // 1344
// 22.1.3.29 Array.prototype.values()                                                                              // 1345
// 22.1.3.30 Array.prototype[@@iterator]()                                                                         // 1346
$iter.std(Array, 'Array', function(iterated, kind){                                                                // 1347
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});                                                     // 1348
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()                                                                      // 1349
}, function(){                                                                                                     // 1350
  var iter  = this[ITER]                                                                                           // 1351
    , O     = iter.o                                                                                               // 1352
    , kind  = iter.k                                                                                               // 1353
    , index = iter.i++;                                                                                            // 1354
  if(!O || index >= O.length){                                                                                     // 1355
    iter.o = undefined;                                                                                            // 1356
    return step(1);                                                                                                // 1357
  }                                                                                                                // 1358
  if(kind == 'key')   return step(0, index);                                                                       // 1359
  if(kind == 'value') return step(0, O[index]);                                                                    // 1360
                      return step(0, [index, O[index]]);                                                           // 1361
}, 'value');                                                                                                       // 1362
                                                                                                                   // 1363
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)                                             // 1364
Iterators.Arguments = Iterators.Array;                                                                             // 1365
                                                                                                                   // 1366
// 21.1.3.27 String.prototype[@@iterator]()                                                                        // 1367
$iter.std(String, 'String', function(iterated){                                                                    // 1368
  $.set(this, ITER, {o: String(iterated), i: 0});                                                                  // 1369
// 21.1.5.2.1 %StringIteratorPrototype%.next()                                                                     // 1370
}, function(){                                                                                                     // 1371
  var iter  = this[ITER]                                                                                           // 1372
    , O     = iter.o                                                                                               // 1373
    , index = iter.i                                                                                               // 1374
    , point;                                                                                                       // 1375
  if(index >= O.length)return step(1);                                                                             // 1376
  point = at.call(O, index);                                                                                       // 1377
  iter.i += point.length;                                                                                          // 1378
  return step(0, point);                                                                                           // 1379
});                                                                                                                // 1380
},{"./$":10,"./$.iter":9,"./$.string-at":16,"./$.uid":18}],26:[function(require,module,exports){                   // 1381
var $    = require('./$')                                                                                          // 1382
  , $def = require('./$.def')                                                                                      // 1383
  , Math = $.g.Math                                                                                                // 1384
  , E    = Math.E                                                                                                  // 1385
  , pow  = Math.pow                                                                                                // 1386
  , abs  = Math.abs                                                                                                // 1387
  , exp  = Math.exp                                                                                                // 1388
  , log  = Math.log                                                                                                // 1389
  , sqrt = Math.sqrt                                                                                               // 1390
  , Infinity = 1 / 0                                                                                               // 1391
  , sign = Math.sign || function(x){                                                                               // 1392
      return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;                                                         // 1393
    };                                                                                                             // 1394
                                                                                                                   // 1395
// 20.2.2.5 Math.asinh(x)                                                                                          // 1396
function asinh(x){                                                                                                 // 1397
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));                          // 1398
}                                                                                                                  // 1399
// 20.2.2.14 Math.expm1(x)                                                                                         // 1400
function expm1(x){                                                                                                 // 1401
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;                                   // 1402
}                                                                                                                  // 1403
                                                                                                                   // 1404
$def($def.S, 'Math', {                                                                                             // 1405
  // 20.2.2.3 Math.acosh(x)                                                                                        // 1406
  acosh: function(x){                                                                                              // 1407
    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;                  // 1408
  },                                                                                                               // 1409
  // 20.2.2.5 Math.asinh(x)                                                                                        // 1410
  asinh: asinh,                                                                                                    // 1411
  // 20.2.2.7 Math.atanh(x)                                                                                        // 1412
  atanh: function(x){                                                                                              // 1413
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;                                                         // 1414
  },                                                                                                               // 1415
  // 20.2.2.9 Math.cbrt(x)                                                                                         // 1416
  cbrt: function(x){                                                                                               // 1417
    return sign(x = +x) * pow(abs(x), 1 / 3);                                                                      // 1418
  },                                                                                                               // 1419
  // 20.2.2.11 Math.clz32(x)                                                                                       // 1420
  clz32: function(x){                                                                                              // 1421
    return (x >>>= 0) ? 32 - x.toString(2).length : 32;                                                            // 1422
  },                                                                                                               // 1423
  // 20.2.2.12 Math.cosh(x)                                                                                        // 1424
  cosh: function(x){                                                                                               // 1425
    return (exp(x = +x) + exp(-x)) / 2;                                                                            // 1426
  },                                                                                                               // 1427
  // 20.2.2.14 Math.expm1(x)                                                                                       // 1428
  expm1: expm1,                                                                                                    // 1429
  // 20.2.2.16 Math.fround(x)                                                                                      // 1430
  // TODO: fallback for IE9-                                                                                       // 1431
  fround: function(x){                                                                                             // 1432
    return new Float32Array([x])[0];                                                                               // 1433
  },                                                                                                               // 1434
  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])                                                                // 1435
  hypot: function(value1, value2){                                                                                 // 1436
    var sum  = 0                                                                                                   // 1437
      , len1 = arguments.length                                                                                    // 1438
      , len2 = len1                                                                                                // 1439
      , args = Array(len1)                                                                                         // 1440
      , larg = -Infinity                                                                                           // 1441
      , arg;                                                                                                       // 1442
    while(len1--){                                                                                                 // 1443
      arg = args[len1] = +arguments[len1];                                                                         // 1444
      if(arg == Infinity || arg == -Infinity)return Infinity;                                                      // 1445
      if(arg > larg)larg = arg;                                                                                    // 1446
    }                                                                                                              // 1447
    larg = arg || 1;                                                                                               // 1448
    while(len2--)sum += pow(args[len2] / larg, 2);                                                                 // 1449
    return larg * sqrt(sum);                                                                                       // 1450
  },                                                                                                               // 1451
  // 20.2.2.18 Math.imul(x, y)                                                                                     // 1452
  imul: function(x, y){                                                                                            // 1453
    var UInt16 = 0xffff                                                                                            // 1454
      , xn = +x                                                                                                    // 1455
      , yn = +y                                                                                                    // 1456
      , xl = UInt16 & xn                                                                                           // 1457
      , yl = UInt16 & yn;                                                                                          // 1458
    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);                      // 1459
  },                                                                                                               // 1460
  // 20.2.2.20 Math.log1p(x)                                                                                       // 1461
  log1p: function(x){                                                                                              // 1462
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);                                              // 1463
  },                                                                                                               // 1464
  // 20.2.2.21 Math.log10(x)                                                                                       // 1465
  log10: function(x){                                                                                              // 1466
    return log(x) / Math.LN10;                                                                                     // 1467
  },                                                                                                               // 1468
  // 20.2.2.22 Math.log2(x)                                                                                        // 1469
  log2: function(x){                                                                                               // 1470
    return log(x) / Math.LN2;                                                                                      // 1471
  },                                                                                                               // 1472
  // 20.2.2.28 Math.sign(x)                                                                                        // 1473
  sign: sign,                                                                                                      // 1474
  // 20.2.2.30 Math.sinh(x)                                                                                        // 1475
  sinh: function(x){                                                                                               // 1476
    return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);                  // 1477
  },                                                                                                               // 1478
  // 20.2.2.33 Math.tanh(x)                                                                                        // 1479
  tanh: function(x){                                                                                               // 1480
    var a = expm1(x = +x)                                                                                          // 1481
      , b = expm1(-x);                                                                                             // 1482
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));                                  // 1483
  },                                                                                                               // 1484
  // 20.2.2.34 Math.trunc(x)                                                                                       // 1485
  trunc: $.trunc                                                                                                   // 1486
});                                                                                                                // 1487
},{"./$":10,"./$.def":6}],27:[function(require,module,exports){                                                    // 1488
var $     = require('./$')                                                                                         // 1489
  , $def  = require('./$.def')                                                                                     // 1490
  , abs   = Math.abs                                                                                               // 1491
  , floor = Math.floor                                                                                             // 1492
  , MAX_SAFE_INTEGER = 0x1fffffffffffff // pow(2, 53) - 1 == 9007199254740991;                                     // 1493
// 20.1.2.3 Number.isInteger(number)                                                                               // 1494
function isInteger(it){                                                                                            // 1495
  return !$.isObject(it) && isFinite(it) && floor(it) === it;                                                      // 1496
}                                                                                                                  // 1497
$def($def.S, 'Number', {                                                                                           // 1498
  // 20.1.2.1 Number.EPSILON                                                                                       // 1499
  EPSILON: Math.pow(2, -52),                                                                                       // 1500
  // 20.1.2.2 Number.isFinite(number)                                                                              // 1501
  isFinite: function(it){                                                                                          // 1502
    return typeof it == 'number' && isFinite(it);                                                                  // 1503
  },                                                                                                               // 1504
  // 20.1.2.3 Number.isInteger(number)                                                                             // 1505
  isInteger: isInteger,                                                                                            // 1506
  // 20.1.2.4 Number.isNaN(number)                                                                                 // 1507
  isNaN: $.isNaN,                                                                                                  // 1508
  // 20.1.2.5 Number.isSafeInteger(number)                                                                         // 1509
  isSafeInteger: function(number){                                                                                 // 1510
    return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;                                                   // 1511
  },                                                                                                               // 1512
  // 20.1.2.6 Number.MAX_SAFE_INTEGER                                                                              // 1513
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,                                                                              // 1514
  // 20.1.2.10 Number.MIN_SAFE_INTEGER                                                                             // 1515
  MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,                                                                             // 1516
  // 20.1.2.12 Number.parseFloat(string)                                                                           // 1517
  parseFloat: parseFloat,                                                                                          // 1518
  // 20.1.2.13 Number.parseInt(string, radix)                                                                      // 1519
  parseInt: parseInt                                                                                               // 1520
});                                                                                                                // 1521
},{"./$":10,"./$.def":6}],28:[function(require,module,exports){                                                    // 1522
'use strict';                                                                                                      // 1523
// 19.1.3.6 Object.prototype.toString()                                                                            // 1524
var $   = require('./$')                                                                                           // 1525
  , cof = require('./$.cof')                                                                                       // 1526
  , tmp = {};                                                                                                      // 1527
tmp[require('./$.wks')('toStringTag')] = 'z';                                                                      // 1528
if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function(){                                        // 1529
  return '[object ' + cof.classof(this) + ']';                                                                     // 1530
});                                                                                                                // 1531
},{"./$":10,"./$.cof":5,"./$.wks":19}],29:[function(require,module,exports){                                       // 1532
var $        = require('./$')                                                                                      // 1533
  , $def     = require('./$.def')                                                                                  // 1534
  , isObject = $.isObject                                                                                          // 1535
  , toObject = $.toObject;                                                                                         // 1536
function wrapObjectMethod(key, MODE){                                                                              // 1537
  var fn  = ($.core.Object || {})[key] || Object[key]                                                              // 1538
    , f   = 0                                                                                                      // 1539
    , o   = {};                                                                                                    // 1540
  o[key] = MODE == 1 ? function(it){                                                                               // 1541
    return isObject(it) ? fn(it) : it;                                                                             // 1542
  } : MODE == 2 ? function(it){                                                                                    // 1543
    return isObject(it) ? fn(it) : true;                                                                           // 1544
  } : MODE == 3 ? function(it){                                                                                    // 1545
    return isObject(it) ? fn(it) : false;                                                                          // 1546
  } : MODE == 4 ? function(it, key){                                                                               // 1547
    return fn(toObject(it), key);                                                                                  // 1548
  } : function(it){                                                                                                // 1549
    return fn(toObject(it));                                                                                       // 1550
  };                                                                                                               // 1551
  try { fn('z') }                                                                                                  // 1552
  catch(e){ f = 1 }                                                                                                // 1553
  $def($def.S + $def.F * f, 'Object', o);                                                                          // 1554
}                                                                                                                  // 1555
wrapObjectMethod('freeze', 1);                                                                                     // 1556
wrapObjectMethod('seal', 1);                                                                                       // 1557
wrapObjectMethod('preventExtensions', 1);                                                                          // 1558
wrapObjectMethod('isFrozen', 2);                                                                                   // 1559
wrapObjectMethod('isSealed', 2);                                                                                   // 1560
wrapObjectMethod('isExtensible', 3);                                                                               // 1561
wrapObjectMethod('getOwnPropertyDescriptor', 4);                                                                   // 1562
wrapObjectMethod('getPrototypeOf');                                                                                // 1563
wrapObjectMethod('keys');                                                                                          // 1564
wrapObjectMethod('getOwnPropertyNames');                                                                           // 1565
},{"./$":10,"./$.def":6}],30:[function(require,module,exports){                                                    // 1566
var $def     = require('./$.def')                                                                                  // 1567
  , setProto = require('./$.set-proto');                                                                           // 1568
var objectStatic = {                                                                                               // 1569
  // 19.1.3.1 Object.assign(target, source)                                                                        // 1570
  assign: require('./$.assign'),                                                                                   // 1571
  // 19.1.3.10 Object.is(value1, value2)                                                                           // 1572
  is: function(x, y){                                                                                              // 1573
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;                                                // 1574
  }                                                                                                                // 1575
};                                                                                                                 // 1576
// 19.1.3.19 Object.setPrototypeOf(O, proto)                                                                       // 1577
if(setProto)objectStatic.setPrototypeOf = setProto;                                                                // 1578
$def($def.S, 'Object', objectStatic);                                                                              // 1579
},{"./$.assign":4,"./$.def":6,"./$.set-proto":14}],31:[function(require,module,exports){                           // 1580
'use strict';                                                                                                      // 1581
require('./es6.iterators');                                                                                        // 1582
var $       = require('./$')                                                                                       // 1583
  , cof     = require('./$.cof')                                                                                   // 1584
  , $def    = require('./$.def')                                                                                   // 1585
  , forOf   = require('./$.iter').forOf                                                                            // 1586
  , SPECIES = require('./$.wks')('species')                                                                        // 1587
  , RECORD  = require('./$.uid').safe('record')                                                                    // 1588
  , PROMISE = 'Promise'                                                                                            // 1589
  , global  = $.g                                                                                                  // 1590
  , assert  = $.assert                                                                                             // 1591
  , ctx     = $.ctx                                                                                                // 1592
  , process = global.process                                                                                       // 1593
  , asap    = process && process.nextTick || require('./$.task').set                                               // 1594
  , Promise = global[PROMISE]                                                                                      // 1595
  , Base    = Promise                                                                                              // 1596
  , isFunction = $.isFunction                                                                                      // 1597
  , isObject   = $.isObject                                                                                        // 1598
  , assertFn   = assert.fn                                                                                         // 1599
  , assertObj  = assert.obj                                                                                        // 1600
  , test;                                                                                                          // 1601
isFunction(Promise) && isFunction(Promise.resolve)                                                                 // 1602
&& Promise.resolve(test = new Promise(function(){})) == test                                                       // 1603
|| function(){                                                                                                     // 1604
  function isThenable(it){                                                                                         // 1605
    var then;                                                                                                      // 1606
    if(isObject(it))then = it.then;                                                                                // 1607
    return isFunction(then) ? then : false;                                                                        // 1608
  }                                                                                                                // 1609
  function handledRejectionOrHasOnRejected(promise){                                                               // 1610
    var record = promise[RECORD]                                                                                   // 1611
      , chain  = record.c                                                                                          // 1612
      , i      = 0                                                                                                 // 1613
      , react;                                                                                                     // 1614
    if(record.h)return true;                                                                                       // 1615
    while(chain.length > i){                                                                                       // 1616
      react = chain[i++];                                                                                          // 1617
      if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;                                       // 1618
    }                                                                                                              // 1619
  }                                                                                                                // 1620
  function notify(record, reject){                                                                                 // 1621
    var chain = record.c;                                                                                          // 1622
    if(reject || chain.length)asap(function(){                                                                     // 1623
      var promise = record.p                                                                                       // 1624
        , value   = record.v                                                                                       // 1625
        , ok      = record.s == 1                                                                                  // 1626
        , i       = 0;                                                                                             // 1627
      if(reject && !handledRejectionOrHasOnRejected(promise)){                                                     // 1628
        setTimeout(function(){                                                                                     // 1629
          if(!handledRejectionOrHasOnRejected(promise)){                                                           // 1630
            if(cof(process) == 'process'){                                                                         // 1631
              if(!process.emit('unhandledRejection', value, promise)){                                             // 1632
                // default node.js behavior                                                                        // 1633
              }                                                                                                    // 1634
            } else if(global.console && isFunction(console.error)){                                                // 1635
              console.error('Unhandled promise rejection', value);                                                 // 1636
            }                                                                                                      // 1637
          }                                                                                                        // 1638
        }, 1e3);                                                                                                   // 1639
      } else while(chain.length > i)!function(react){                                                              // 1640
        var cb = ok ? react.ok : react.fail                                                                        // 1641
          , ret, then;                                                                                             // 1642
        try {                                                                                                      // 1643
          if(cb){                                                                                                  // 1644
            if(!ok)record.h = true;                                                                                // 1645
            ret = cb === true ? value : cb(value);                                                                 // 1646
            if(ret === react.P){                                                                                   // 1647
              react.rej(TypeError(PROMISE + '-chain cycle'));                                                      // 1648
            } else if(then = isThenable(ret)){                                                                     // 1649
              then.call(ret, react.res, react.rej);                                                                // 1650
            } else react.res(ret);                                                                                 // 1651
          } else react.rej(value);                                                                                 // 1652
        } catch(err){                                                                                              // 1653
          react.rej(err);                                                                                          // 1654
        }                                                                                                          // 1655
      }(chain[i++]);                                                                                               // 1656
      chain.length = 0;                                                                                            // 1657
    });                                                                                                            // 1658
  }                                                                                                                // 1659
  function resolve(value){                                                                                         // 1660
    var record = this                                                                                              // 1661
      , then, wrapper;                                                                                             // 1662
    if(record.d)return;                                                                                            // 1663
    record.d = true;                                                                                               // 1664
    record = record.r || record; // unwrap                                                                         // 1665
    try {                                                                                                          // 1666
      if(then = isThenable(value)){                                                                                // 1667
        wrapper = {r: record, d: false}; // wrap                                                                   // 1668
        then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));                                       // 1669
      } else {                                                                                                     // 1670
        record.v = value;                                                                                          // 1671
        record.s = 1;                                                                                              // 1672
        notify(record);                                                                                            // 1673
      }                                                                                                            // 1674
    } catch(err){                                                                                                  // 1675
      reject.call(wrapper || {r: record, d: false}, err); // wrap                                                  // 1676
    }                                                                                                              // 1677
  }                                                                                                                // 1678
  function reject(value){                                                                                          // 1679
    var record = this;                                                                                             // 1680
    if(record.d)return;                                                                                            // 1681
    record.d = true;                                                                                               // 1682
    record = record.r || record; // unwrap                                                                         // 1683
    record.v = value;                                                                                              // 1684
    record.s = 2;                                                                                                  // 1685
    notify(record, true);                                                                                          // 1686
  }                                                                                                                // 1687
  function getConstructor(C){                                                                                      // 1688
    var S = assertObj(C)[SPECIES];                                                                                 // 1689
    return S != undefined ? S : C;                                                                                 // 1690
  }                                                                                                                // 1691
  // 25.4.3.1 Promise(executor)                                                                                    // 1692
  Promise = function(executor){                                                                                    // 1693
    assertFn(executor);                                                                                            // 1694
    var record = {                                                                                                 // 1695
      p: assert.inst(this, Promise, PROMISE), // <- promise                                                        // 1696
      c: [],                                  // <- chain                                                          // 1697
      s: 0,                                   // <- state                                                          // 1698
      d: false,                               // <- done                                                           // 1699
      v: undefined,                           // <- value                                                          // 1700
      h: false                                // <- handled rejection                                              // 1701
    };                                                                                                             // 1702
    $.hide(this, RECORD, record);                                                                                  // 1703
    try {                                                                                                          // 1704
      executor(ctx(resolve, record, 1), ctx(reject, record, 1));                                                   // 1705
    } catch(err){                                                                                                  // 1706
      reject.call(record, err);                                                                                    // 1707
    }                                                                                                              // 1708
  }                                                                                                                // 1709
  $.mix(Promise.prototype, {                                                                                       // 1710
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)                                                    // 1711
    then: function(onFulfilled, onRejected){                                                                       // 1712
      var S = assertObj(assertObj(this).constructor)[SPECIES];                                                     // 1713
      var react = {                                                                                                // 1714
        ok:   isFunction(onFulfilled) ? onFulfilled : true,                                                        // 1715
        fail: isFunction(onRejected)  ? onRejected  : false                                                        // 1716
      } , P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject){                              // 1717
        react.res = assertFn(resolve);                                                                             // 1718
        react.rej = assertFn(reject);                                                                              // 1719
      }), record = this[RECORD];                                                                                   // 1720
      record.c.push(react);                                                                                        // 1721
      record.s && notify(record);                                                                                  // 1722
      return P;                                                                                                    // 1723
    },                                                                                                             // 1724
    // 25.4.5.1 Promise.prototype.catch(onRejected)                                                                // 1725
    'catch': function(onRejected){                                                                                 // 1726
      return this.then(undefined, onRejected);                                                                     // 1727
    }                                                                                                              // 1728
  });                                                                                                              // 1729
  $.mix(Promise, {                                                                                                 // 1730
    // 25.4.4.1 Promise.all(iterable)                                                                              // 1731
    all: function(iterable){                                                                                       // 1732
      var Promise = getConstructor(this)                                                                           // 1733
        , values  = [];                                                                                            // 1734
      return new Promise(function(resolve, reject){                                                                // 1735
        forOf(iterable, false, values.push, values);                                                               // 1736
        var remaining = values.length                                                                              // 1737
          , results   = Array(remaining);                                                                          // 1738
        if(remaining)$.each.call(values, function(promise, index){                                                 // 1739
          Promise.resolve(promise).then(function(value){                                                           // 1740
            results[index] = value;                                                                                // 1741
            --remaining || resolve(results);                                                                       // 1742
          }, reject);                                                                                              // 1743
        });                                                                                                        // 1744
        else resolve(results);                                                                                     // 1745
      });                                                                                                          // 1746
    },                                                                                                             // 1747
    // 25.4.4.4 Promise.race(iterable)                                                                             // 1748
    race: function(iterable){                                                                                      // 1749
      var Promise = getConstructor(this);                                                                          // 1750
      return new Promise(function(resolve, reject){                                                                // 1751
        forOf(iterable, false, function(promise){                                                                  // 1752
          Promise.resolve(promise).then(resolve, reject);                                                          // 1753
        });                                                                                                        // 1754
      });                                                                                                          // 1755
    },                                                                                                             // 1756
    // 25.4.4.5 Promise.reject(r)                                                                                  // 1757
    reject: function(r){                                                                                           // 1758
      return new (getConstructor(this))(function(resolve, reject){                                                 // 1759
        reject(r);                                                                                                 // 1760
      });                                                                                                          // 1761
    },                                                                                                             // 1762
    // 25.4.4.6 Promise.resolve(x)                                                                                 // 1763
    resolve: function(x){                                                                                          // 1764
      return isObject(x) && RECORD in x && $.getProto(x) === this.prototype                                        // 1765
        ? x : new (getConstructor(this))(function(resolve, reject){                                                // 1766
          resolve(x);                                                                                              // 1767
        });                                                                                                        // 1768
    }                                                                                                              // 1769
  });                                                                                                              // 1770
}();                                                                                                               // 1771
cof.set(Promise, PROMISE);                                                                                         // 1772
require('./$.species')(Promise);                                                                                   // 1773
$def($def.G + $def.F * (Promise != Base), {Promise: Promise});                                                     // 1774
},{"./$":10,"./$.cof":5,"./$.def":6,"./$.iter":9,"./$.species":15,"./$.task":17,"./$.uid":18,"./$.wks":19,"./es6.iterators":25}],32:[function(require,module,exports){
var $         = require('./$')                                                                                     // 1776
  , $def      = require('./$.def')                                                                                 // 1777
  , setProto  = require('./$.set-proto')                                                                           // 1778
  , $iter     = require('./$.iter')                                                                                // 1779
  , ITER      = require('./$.uid').safe('iter')                                                                    // 1780
  , step      = $iter.step                                                                                         // 1781
  , assert    = $.assert                                                                                           // 1782
  , assertObj = assert.obj                                                                                         // 1783
  , isObject  = $.isObject                                                                                         // 1784
  , getDesc   = $.getDesc                                                                                          // 1785
  , setDesc   = $.setDesc                                                                                          // 1786
  , getProto  = $.getProto                                                                                         // 1787
  , apply     = Function.apply                                                                                     // 1788
  , isExtensible = Object.isExtensible || $.it;                                                                    // 1789
function Enumerate(iterated){                                                                                      // 1790
  var keys = [], key;                                                                                              // 1791
  for(key in iterated)keys.push(key);                                                                              // 1792
  $.set(this, ITER, {o: iterated, a: keys, i: 0});                                                                 // 1793
}                                                                                                                  // 1794
$iter.create(Enumerate, 'Object', function(){                                                                      // 1795
  var iter = this[ITER]                                                                                            // 1796
    , keys = iter.a                                                                                                // 1797
    , key;                                                                                                         // 1798
  do {                                                                                                             // 1799
    if(iter.i >= keys.length)return step(1);                                                                       // 1800
  } while(!((key = keys[iter.i++]) in iter.o));                                                                    // 1801
  return step(0, key);                                                                                             // 1802
});                                                                                                                // 1803
                                                                                                                   // 1804
function wrap(fn){                                                                                                 // 1805
  return function(it){                                                                                             // 1806
    assertObj(it);                                                                                                 // 1807
    try {                                                                                                          // 1808
      return fn.apply(undefined, arguments), true;                                                                 // 1809
    } catch(e){                                                                                                    // 1810
      return false;                                                                                                // 1811
    }                                                                                                              // 1812
  }                                                                                                                // 1813
}                                                                                                                  // 1814
                                                                                                                   // 1815
function reflectGet(target, propertyKey/*, receiver*/){                                                            // 1816
  var receiver = arguments.length < 3 ? target : arguments[2]                                                      // 1817
    , desc = getDesc(assertObj(target), propertyKey), proto;                                                       // 1818
  if(desc)return $.has(desc, 'value')                                                                              // 1819
    ? desc.value                                                                                                   // 1820
    : desc.get === undefined                                                                                       // 1821
      ? undefined                                                                                                  // 1822
      : desc.get.call(receiver);                                                                                   // 1823
  return isObject(proto = getProto(target))                                                                        // 1824
    ? reflectGet(proto, propertyKey, receiver)                                                                     // 1825
    : undefined;                                                                                                   // 1826
}                                                                                                                  // 1827
function reflectSet(target, propertyKey, V/*, receiver*/){                                                         // 1828
  var receiver = arguments.length < 4 ? target : arguments[3]                                                      // 1829
    , ownDesc  = getDesc(assertObj(target), propertyKey)                                                           // 1830
    , existingDescriptor, proto;                                                                                   // 1831
  if(!ownDesc){                                                                                                    // 1832
    if(isObject(proto = getProto(target))){                                                                        // 1833
      return reflectSet(proto, propertyKey, V, receiver);                                                          // 1834
    }                                                                                                              // 1835
    ownDesc = $.desc(0);                                                                                           // 1836
  }                                                                                                                // 1837
  if($.has(ownDesc, 'value')){                                                                                     // 1838
    if(ownDesc.writable === false || !isObject(receiver))return false;                                             // 1839
    existingDescriptor = getDesc(receiver, propertyKey) || $.desc(0);                                              // 1840
    existingDescriptor.value = V;                                                                                  // 1841
    return setDesc(receiver, propertyKey, existingDescriptor), true;                                               // 1842
  }                                                                                                                // 1843
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);                                // 1844
}                                                                                                                  // 1845
                                                                                                                   // 1846
var reflect = {                                                                                                    // 1847
  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)                                                     // 1848
  apply: $.ctx(Function.call, apply, 3),                                                                           // 1849
  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])                                                 // 1850
  construct: function(target, argumentsList /*, newTarget*/){                                                      // 1851
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype                               // 1852
      , instance = $.create(isObject(proto) ? proto : Object.prototype)                                            // 1853
      , result   = apply.call(target, instance, argumentsList);                                                    // 1854
    return isObject(result) ? result : instance;                                                                   // 1855
  },                                                                                                               // 1856
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)                                                // 1857
  defineProperty: wrap(setDesc),                                                                                   // 1858
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)                                                            // 1859
  deleteProperty: function(target, propertyKey){                                                                   // 1860
    var desc = getDesc(assertObj(target), propertyKey);                                                            // 1861
    return desc && !desc.configurable ? false : delete target[propertyKey];                                        // 1862
  },                                                                                                               // 1863
  // 26.1.5 Reflect.enumerate(target)                                                                              // 1864
  enumerate: function(target){                                                                                     // 1865
    return new Enumerate(assertObj(target));                                                                       // 1866
  },                                                                                                               // 1867
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])                                                          // 1868
  get: reflectGet,                                                                                                 // 1869
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)                                                  // 1870
  getOwnPropertyDescriptor: function(target, propertyKey){                                                         // 1871
    return getDesc(assertObj(target), propertyKey);                                                                // 1872
  },                                                                                                               // 1873
  // 26.1.8 Reflect.getPrototypeOf(target)                                                                         // 1874
  getPrototypeOf: function(target){                                                                                // 1875
    return getProto(assertObj(target));                                                                            // 1876
  },                                                                                                               // 1877
  // 26.1.9 Reflect.has(target, propertyKey)                                                                       // 1878
  has: function(target, propertyKey){                                                                              // 1879
    return propertyKey in target;                                                                                  // 1880
  },                                                                                                               // 1881
  // 26.1.10 Reflect.isExtensible(target)                                                                          // 1882
  isExtensible: function(target){                                                                                  // 1883
    return !!isExtensible(assertObj(target));                                                                      // 1884
  },                                                                                                               // 1885
  // 26.1.11 Reflect.ownKeys(target)                                                                               // 1886
  ownKeys: $.ownKeys,                                                                                              // 1887
  // 26.1.12 Reflect.preventExtensions(target)                                                                     // 1888
  preventExtensions: wrap(Object.preventExtensions || $.it),                                                       // 1889
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])                                                      // 1890
  set: reflectSet                                                                                                  // 1891
}                                                                                                                  // 1892
// 26.1.14 Reflect.setPrototypeOf(target, proto)                                                                   // 1893
if(setProto)reflect.setPrototypeOf = function(target, proto){                                                      // 1894
  return setProto(assertObj(target), proto), true;                                                                 // 1895
}                                                                                                                  // 1896
                                                                                                                   // 1897
$def($def.G, {Reflect: {}});                                                                                       // 1898
$def($def.S, 'Reflect', reflect);                                                                                  // 1899
},{"./$":10,"./$.def":6,"./$.iter":9,"./$.set-proto":14,"./$.uid":18}],33:[function(require,module,exports){       // 1900
var $      = require('./$')                                                                                        // 1901
  , cof    = require('./$.cof')                                                                                    // 1902
  , RegExp = $.g.RegExp                                                                                            // 1903
  , Base   = RegExp                                                                                                // 1904
  , proto  = RegExp.prototype;                                                                                     // 1905
if($.FW && $.DESC){                                                                                                // 1906
  // RegExp allows a regex with flags as the pattern                                                               // 1907
  if(!function(){try{return RegExp(/a/g, 'i') == '/a/i'}catch(e){}}()){                                            // 1908
    RegExp = function RegExp(pattern, flags){                                                                      // 1909
      return new Base(cof(pattern) == 'RegExp' && flags !== undefined                                              // 1910
        ? pattern.source : pattern, flags);                                                                        // 1911
    }                                                                                                              // 1912
    $.each.call($.getNames(Base), function(key){                                                                   // 1913
      key in RegExp || $.setDesc(RegExp, key, {                                                                    // 1914
        configurable: true,                                                                                        // 1915
        get: function(){ return Base[key] },                                                                       // 1916
        set: function(it){ Base[key] = it }                                                                        // 1917
      });                                                                                                          // 1918
    });                                                                                                            // 1919
    proto.constructor = RegExp;                                                                                    // 1920
    RegExp.prototype = proto;                                                                                      // 1921
    $.hide($.g, 'RegExp', RegExp);                                                                                 // 1922
  }                                                                                                                // 1923
                                                                                                                   // 1924
  // 21.2.5.3 get RegExp.prototype.flags()                                                                         // 1925
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {                                                                 // 1926
    configurable: true,                                                                                            // 1927
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')                                                              // 1928
  });                                                                                                              // 1929
}                                                                                                                  // 1930
require('./$.species')(RegExp);                                                                                    // 1931
},{"./$":10,"./$.cof":5,"./$.replacer":13,"./$.species":15}],34:[function(require,module,exports){                 // 1932
'use strict';                                                                                                      // 1933
var $         = require('./$')                                                                                     // 1934
  , cof       = require('./$.cof')                                                                                 // 1935
  , $def      = require('./$.def')                                                                                 // 1936
  , assertDef = $.assert.def                                                                                       // 1937
  , toLength  = $.toLength                                                                                         // 1938
  , min       = Math.min                                                                                           // 1939
  , STRING    = 'String'                                                                                           // 1940
  , String    = $.g[STRING]                                                                                        // 1941
  , fromCharCode = String.fromCharCode;                                                                            // 1942
function assertNotRegExp(it){                                                                                      // 1943
  if(cof(it) == 'RegExp')throw TypeError();                                                                        // 1944
}                                                                                                                  // 1945
                                                                                                                   // 1946
$def($def.S, STRING, {                                                                                             // 1947
  // 21.1.2.2 String.fromCodePoint(...codePoints)                                                                  // 1948
  fromCodePoint: function(x){                                                                                      // 1949
    var res = []                                                                                                   // 1950
      , len = arguments.length                                                                                     // 1951
      , i   = 0                                                                                                    // 1952
      , code                                                                                                       // 1953
    while(len > i){                                                                                                // 1954
      code = +arguments[i++];                                                                                      // 1955
      if($.toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');                 // 1956
      res.push(code < 0x10000                                                                                      // 1957
        ? fromCharCode(code)                                                                                       // 1958
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)                                  // 1959
      );                                                                                                           // 1960
    } return res.join('');                                                                                         // 1961
  },                                                                                                               // 1962
  // 21.1.2.4 String.raw(callSite, ...substitutions)                                                               // 1963
  raw: function(callSite){                                                                                         // 1964
    var raw = $.toObject(callSite.raw)                                                                             // 1965
      , len = toLength(raw.length)                                                                                 // 1966
      , sln = arguments.length                                                                                     // 1967
      , res = []                                                                                                   // 1968
      , i   = 0;                                                                                                   // 1969
    while(len > i){                                                                                                // 1970
     res.push(String(raw[i++]));                                                                                   // 1971
     if(i < sln)res.push(String(arguments[i]));                                                                    // 1972
    } return res.join('');                                                                                         // 1973
  }                                                                                                                // 1974
});                                                                                                                // 1975
                                                                                                                   // 1976
$def($def.P, STRING, {                                                                                             // 1977
  // 21.1.3.3 String.prototype.codePointAt(pos)                                                                    // 1978
  codePointAt: require('./$.string-at')(false),                                                                    // 1979
  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])                                              // 1980
  endsWith: function(searchString /*, endPosition = @length */){                                                   // 1981
    assertNotRegExp(searchString);                                                                                 // 1982
    var that = String(assertDef(this))                                                                             // 1983
      , endPosition = arguments[1]                                                                                 // 1984
      , len = toLength(that.length)                                                                                // 1985
      , end = endPosition === undefined ? len : min(toLength(endPosition), len);                                   // 1986
    searchString += '';                                                                                            // 1987
    return that.slice(end - searchString.length, end) === searchString;                                            // 1988
  },                                                                                                               // 1989
  // 21.1.3.7 String.prototype.includes(searchString, position = 0)                                                // 1990
  includes: function(searchString /*, position = 0 */){                                                            // 1991
    assertNotRegExp(searchString);                                                                                 // 1992
    return !!~String(assertDef(this)).indexOf(searchString, arguments[1]);                                         // 1993
  },                                                                                                               // 1994
  // 21.1.3.13 String.prototype.repeat(count)                                                                      // 1995
  repeat: function(count){                                                                                         // 1996
    var str = String(assertDef(this))                                                                              // 1997
      , res = ''                                                                                                   // 1998
      , n   = $.toInteger(count);                                                                                  // 1999
    if(0 > n || n == Infinity)throw RangeError("Count can't be negative");                                         // 2000
    for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;                                                    // 2001
    return res;                                                                                                    // 2002
  },                                                                                                               // 2003
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])                                             // 2004
  startsWith: function(searchString /*, position = 0 */){                                                          // 2005
    assertNotRegExp(searchString);                                                                                 // 2006
    var that  = String(assertDef(this))                                                                            // 2007
      , index = toLength(min(arguments[1], that.length));                                                          // 2008
    searchString += '';                                                                                            // 2009
    return that.slice(index, index + searchString.length) === searchString;                                        // 2010
  }                                                                                                                // 2011
});                                                                                                                // 2012
},{"./$":10,"./$.cof":5,"./$.def":6,"./$.string-at":16}],35:[function(require,module,exports){                     // 2013
'use strict';                                                                                                      // 2014
// ECMAScript 6 symbols shim                                                                                       // 2015
var $        = require('./$')                                                                                      // 2016
  , setTag   = require('./$.cof').set                                                                              // 2017
  , uid      = require('./$.uid')                                                                                  // 2018
  , $def     = require('./$.def')                                                                                  // 2019
  , assert   = $.assert                                                                                            // 2020
  , has      = $.has                                                                                               // 2021
  , hide     = $.hide                                                                                              // 2022
  , getNames = $.getNames                                                                                          // 2023
  , toObject = $.toObject                                                                                          // 2024
  , Symbol   = $.g.Symbol                                                                                          // 2025
  , Base     = Symbol                                                                                              // 2026
  , setter   = true                                                                                                // 2027
  , TAG      = uid.safe('tag')                                                                                     // 2028
  , SymbolRegistry = {}                                                                                            // 2029
  , AllSymbols     = {};                                                                                           // 2030
// 19.4.1.1 Symbol([description])                                                                                  // 2031
if(!$.isFunction(Symbol)){                                                                                         // 2032
  Symbol = function(description){                                                                                  // 2033
    $.assert(!(this instanceof Symbol), 'Symbol is not a constructor');                                            // 2034
    var tag = uid(description)                                                                                     // 2035
      , sym = $.set($.create(Symbol.prototype), TAG, tag);                                                         // 2036
    AllSymbols[tag] = sym;                                                                                         // 2037
    $.DESC && setter && $.setDesc(Object.prototype, tag, {                                                         // 2038
      configurable: true,                                                                                          // 2039
      set: function(value){                                                                                        // 2040
        hide(this, tag, value);                                                                                    // 2041
      }                                                                                                            // 2042
    });                                                                                                            // 2043
    return sym;                                                                                                    // 2044
  }                                                                                                                // 2045
  hide(Symbol.prototype, 'toString', function(){                                                                   // 2046
    return this[TAG];                                                                                              // 2047
  });                                                                                                              // 2048
}                                                                                                                  // 2049
$def($def.G + $def.W, {Symbol: Symbol});                                                                           // 2050
                                                                                                                   // 2051
var symbolStatics = {                                                                                              // 2052
  // 19.4.2.1 Symbol.for(key)                                                                                      // 2053
  'for': function(key){                                                                                            // 2054
    return has(SymbolRegistry, key += '')                                                                          // 2055
      ? SymbolRegistry[key]                                                                                        // 2056
      : SymbolRegistry[key] = Symbol(key);                                                                         // 2057
  },                                                                                                               // 2058
  // 19.4.2.5 Symbol.keyFor(sym)                                                                                   // 2059
  keyFor: require('./$.partial').call(require('./$.keyof'), SymbolRegistry, 0),                                    // 2060
  pure: uid.safe,                                                                                                  // 2061
  set: $.set,                                                                                                      // 2062
  useSetter: function(){ setter = true },                                                                          // 2063
  useSimple: function(){ setter = false }                                                                          // 2064
};                                                                                                                 // 2065
// 19.4.2.2 Symbol.hasInstance                                                                                     // 2066
// 19.4.2.3 Symbol.isConcatSpreadable                                                                              // 2067
// 19.4.2.4 Symbol.iterator                                                                                        // 2068
// 19.4.2.6 Symbol.match                                                                                           // 2069
// 19.4.2.8 Symbol.replace                                                                                         // 2070
// 19.4.2.9 Symbol.search                                                                                          // 2071
// 19.4.2.10 Symbol.species                                                                                        // 2072
// 19.4.2.11 Symbol.split                                                                                          // 2073
// 19.4.2.12 Symbol.toPrimitive                                                                                    // 2074
// 19.4.2.13 Symbol.toStringTag                                                                                    // 2075
// 19.4.2.14 Symbol.unscopables                                                                                    // 2076
$.each.call($.a('hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'),
  function(it){                                                                                                    // 2078
    symbolStatics[it] = require('./$.wks')(it);                                                                    // 2079
  }                                                                                                                // 2080
);                                                                                                                 // 2081
                                                                                                                   // 2082
$def($def.S, 'Symbol', symbolStatics);                                                                             // 2083
                                                                                                                   // 2084
$def($def.S + $def.F * (Symbol != Base), 'Object', {                                                               // 2085
  // 19.1.2.7 Object.getOwnPropertyNames(O)                                                                        // 2086
  getOwnPropertyNames: function(it){                                                                               // 2087
    var names = getNames(toObject(it)), result = [], key, i = 0;                                                   // 2088
    while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);                                  // 2089
    return result;                                                                                                 // 2090
  },                                                                                                               // 2091
  // 19.1.2.8 Object.getOwnPropertySymbols(O)                                                                      // 2092
  getOwnPropertySymbols: function(it){                                                                             // 2093
    var names = getNames(toObject(it)), result = [], key, i = 0;                                                   // 2094
    while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);                      // 2095
    return result;                                                                                                 // 2096
  }                                                                                                                // 2097
});                                                                                                                // 2098
                                                                                                                   // 2099
setTag(Symbol, 'Symbol');                                                                                          // 2100
// 20.2.1.9 Math[@@toStringTag]                                                                                    // 2101
setTag(Math, 'Math', true);                                                                                        // 2102
// 24.3.3 JSON[@@toStringTag]                                                                                      // 2103
setTag($.g.JSON, 'JSON', true);                                                                                    // 2104
},{"./$":10,"./$.cof":5,"./$.def":6,"./$.keyof":11,"./$.partial":12,"./$.uid":18,"./$.wks":19}],36:[function(require,module,exports){
// https://github.com/zenparsing/es-abstract-refs                                                                  // 2106
var $                = require('./$')                                                                              // 2107
  , wks              = require('./$.wks')                                                                          // 2108
  , $def             = require('./$.def')                                                                          // 2109
  , REFERENCE_GET    = wks('referenceGet')                                                                         // 2110
  , REFERENCE_SET    = wks('referenceSet')                                                                         // 2111
  , REFERENCE_DELETE = wks('referenceDelete')                                                                      // 2112
  , hide             = $.hide;                                                                                     // 2113
                                                                                                                   // 2114
$def($def.S, 'Symbol', {                                                                                           // 2115
  referenceGet:    REFERENCE_GET,                                                                                  // 2116
  referenceSet:    REFERENCE_SET,                                                                                  // 2117
  referenceDelete: REFERENCE_DELETE                                                                                // 2118
});                                                                                                                // 2119
                                                                                                                   // 2120
hide(Function.prototype, REFERENCE_GET, $.that);                                                                   // 2121
                                                                                                                   // 2122
function setMapMethods(Constructor){                                                                               // 2123
  if(Constructor){                                                                                                 // 2124
    var MapProto = Constructor.prototype;                                                                          // 2125
    hide(MapProto, REFERENCE_GET,    MapProto.get);                                                                // 2126
    hide(MapProto, REFERENCE_SET,    MapProto.set);                                                                // 2127
    hide(MapProto, REFERENCE_DELETE, MapProto['delete']);                                                          // 2128
 }                                                                                                                 // 2129
}                                                                                                                  // 2130
setMapMethods($.core.Map || $.g.Map);                                                                              // 2131
setMapMethods($.core.WeakMap || $.g.WeakMap);                                                                      // 2132
},{"./$":10,"./$.def":6,"./$.wks":19}],37:[function(require,module,exports){                                       // 2133
var $        = require('./$')                                                                                      // 2134
  , $def     = require('./$.def')                                                                                  // 2135
  , toObject = $.toObject;                                                                                         // 2136
                                                                                                                   // 2137
$def($def.P, 'Array', {                                                                                            // 2138
  // https://github.com/domenic/Array.prototype.includes                                                           // 2139
  includes: require('./$.array-includes')(true)                                                                    // 2140
});                                                                                                                // 2141
$def($def.P, 'String', {                                                                                           // 2142
  // https://github.com/mathiasbynens/String.prototype.at                                                          // 2143
  at: require('./$.string-at')(true)                                                                               // 2144
});                                                                                                                // 2145
                                                                                                                   // 2146
function createObjectToArray(isEntries){                                                                           // 2147
  return function(object){                                                                                         // 2148
    var O      = toObject(object)                                                                                  // 2149
      , keys   = $.getKeys(object)                                                                                 // 2150
      , length = keys.length                                                                                       // 2151
      , i      = 0                                                                                                 // 2152
      , result = Array(length)                                                                                     // 2153
      , key;                                                                                                       // 2154
    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];                                           // 2155
    else while(length > i)result[i] = O[keys[i++]];                                                                // 2156
    return result;                                                                                                 // 2157
  }                                                                                                                // 2158
}                                                                                                                  // 2159
$def($def.S, 'Object', {                                                                                           // 2160
  // https://gist.github.com/WebReflection/9353781                                                                 // 2161
  getOwnPropertyDescriptors: function(object){                                                                     // 2162
    var O      = toObject(object)                                                                                  // 2163
      , result = {};                                                                                               // 2164
    $.each.call($.ownKeys(O), function(key){                                                                       // 2165
      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));                                                        // 2166
    });                                                                                                            // 2167
    return result;                                                                                                 // 2168
  },                                                                                                               // 2169
  // https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-04/apr-9.md#51-objectentries-objectvalues         // 2170
  values:  createObjectToArray(false),                                                                             // 2171
  entries: createObjectToArray(true)                                                                               // 2172
});                                                                                                                // 2173
$def($def.S, 'RegExp', {                                                                                           // 2174
  // https://gist.github.com/kangax/9698100                                                                        // 2175
  escape: require('./$.replacer')(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)                                        // 2176
});                                                                                                                // 2177
},{"./$":10,"./$.array-includes":2,"./$.def":6,"./$.replacer":13,"./$.string-at":16}],38:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim                                                                    // 2179
var $       = require('./$')                                                                                       // 2180
  , $def    = require('./$.def')                                                                                   // 2181
  , statics = {};                                                                                                  // 2182
function setStatics(keys, length){                                                                                 // 2183
  $.each.call($.a(keys), function(key){                                                                            // 2184
    if(key in [])statics[key] = $.ctx(Function.call, [][key], length);                                             // 2185
  });                                                                                                              // 2186
}                                                                                                                  // 2187
setStatics('pop,reverse,shift,keys,values,entries', 1);                                                            // 2188
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);                                    // 2189
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +                                             // 2190
           'reduce,reduceRight,copyWithin,fill,turn');                                                             // 2191
$def($def.S, 'Array', statics);                                                                                    // 2192
},{"./$":10,"./$.def":6}],39:[function(require,module,exports){                                                    // 2193
var $         = require('./$')                                                                                     // 2194
  , Iterators = require('./$.iter').Iterators                                                                      // 2195
  , ITERATOR  = require('./$.wks')('iterator')                                                                     // 2196
  , NodeList  = $.g.NodeList;                                                                                      // 2197
if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){                                                         // 2198
  $.hide(NodeList.prototype, ITERATOR, Iterators.Array);                                                           // 2199
}                                                                                                                  // 2200
Iterators.NodeList = Iterators.Array;                                                                              // 2201
},{"./$":10,"./$.iter":9,"./$.wks":19}],40:[function(require,module,exports){                                      // 2202
var $def  = require('./$.def')                                                                                     // 2203
  , $task = require('./$.task');                                                                                   // 2204
$def($def.G + $def.B, {                                                                                            // 2205
  setImmediate:   $task.set,                                                                                       // 2206
  clearImmediate: $task.clear                                                                                      // 2207
});                                                                                                                // 2208
},{"./$.def":6,"./$.task":17}],41:[function(require,module,exports){                                               // 2209
// ie9- setTimeout & setInterval additional parameters fix                                                         // 2210
var $       = require('./$')                                                                                       // 2211
  , $def    = require('./$.def')                                                                                   // 2212
  , invoke  = require('./$.invoke')                                                                                // 2213
  , partial = require('./$.partial')                                                                               // 2214
  , MSIE    = !!$.g.navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check                      // 2215
function wrap(set){                                                                                                // 2216
  return MSIE ? function(fn, time /*, ...args */){                                                                 // 2217
    return set(invoke(partial, [].slice.call(arguments, 2), $.isFunction(fn) ? fn : Function(fn)), time);          // 2218
  } : set;                                                                                                         // 2219
}                                                                                                                  // 2220
$def($def.G + $def.B + $def.F * MSIE, {                                                                            // 2221
  setTimeout:  wrap(setTimeout),                                                                                   // 2222
  setInterval: wrap(setInterval)                                                                                   // 2223
});                                                                                                                // 2224
},{"./$":10,"./$.def":6,"./$.invoke":8,"./$.partial":12}]},{},[1]);                                                // 2225
                                                                                                                   // 2226
// CommonJS export                                                                                                 // 2227
if(typeof module != 'undefined' && module.exports)module.exports = __e;                                            // 2228
// RequireJS export                                                                                                // 2229
else if(typeof define == 'function' && define.amd)define(function(){return __e});                                  // 2230
// Export to global object                                                                                         // 2231
else __g.core = __e;                                                                                               // 2232
}();                                                                                                               // 2233
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/grigio:babel/lib/runtime.js                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**                                                                                                                // 1
 * Copyright (c) 2014, Facebook, Inc.                                                                              // 2
 * All rights reserved.                                                                                            // 3
 *                                                                                                                 // 4
 * This source code is licensed under the BSD-style license found in the                                           // 5
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An                                             // 6
 * additional grant of patent rights can be found in the PATENTS file in                                           // 7
 * the same directory.                                                                                             // 8
 */                                                                                                                // 9
                                                                                                                   // 10
!(function(global) {                                                                                               // 11
  "use strict";                                                                                                    // 12
                                                                                                                   // 13
  var hasOwn = Object.prototype.hasOwnProperty;                                                                    // 14
  var undefined; // More compressible than void 0.                                                                 // 15
  var iteratorSymbol =                                                                                             // 16
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";                                               // 17
                                                                                                                   // 18
  var inModule = typeof module === "object";                                                                       // 19
  var runtime = global.regeneratorRuntime;                                                                         // 20
  if (runtime) {                                                                                                   // 21
    if (inModule) {                                                                                                // 22
      // If regeneratorRuntime is defined globally and we're in a module,                                          // 23
      // make the exports object identical to regeneratorRuntime.                                                  // 24
      module.exports = runtime;                                                                                    // 25
    }                                                                                                              // 26
    // Don't bother evaluating the rest of this file if the runtime was                                            // 27
    // already defined globally.                                                                                   // 28
    return;                                                                                                        // 29
  }                                                                                                                // 30
                                                                                                                   // 31
  // Define the runtime globally (as expected by generated code) as either                                         // 32
  // module.exports (if we're in a module) or a new, empty object.                                                 // 33
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};                                            // 34
                                                                                                                   // 35
  function wrap(innerFn, outerFn, self, tryLocsList) {                                                             // 36
    // If outerFn provided, then outerFn.prototype instanceof Generator.                                           // 37
    var generator = Object.create((outerFn || Generator).prototype);                                               // 38
                                                                                                                   // 39
    generator._invoke = makeInvokeMethod(                                                                          // 40
      innerFn, self || null,                                                                                       // 41
      new Context(tryLocsList || [])                                                                               // 42
    );                                                                                                             // 43
                                                                                                                   // 44
    return generator;                                                                                              // 45
  }                                                                                                                // 46
  runtime.wrap = wrap;                                                                                             // 47
                                                                                                                   // 48
  // Try/catch helper to minimize deoptimizations. Returns a completion                                            // 49
  // record like context.tryEntries[i].completion. This interface could                                            // 50
  // have been (and was previously) designed to take a closure to be                                               // 51
  // invoked without arguments, but in all the cases we care about we                                              // 52
  // already have an existing method we want to call, so there's no need                                           // 53
  // to create a new function object. We can even get away with assuming                                           // 54
  // the method takes exactly one argument, since that happens to be true                                          // 55
  // in every case, so we don't have to touch the arguments object. The                                            // 56
  // only additional allocation required is the completion record, which                                           // 57
  // has a stable shape and so hopefully should be cheap to allocate.                                              // 58
  function tryCatch(fn, obj, arg) {                                                                                // 59
    try {                                                                                                          // 60
      return { type: "normal", arg: fn.call(obj, arg) };                                                           // 61
    } catch (err) {                                                                                                // 62
      return { type: "throw", arg: err };                                                                          // 63
    }                                                                                                              // 64
  }                                                                                                                // 65
                                                                                                                   // 66
  var GenStateSuspendedStart = "suspendedStart";                                                                   // 67
  var GenStateSuspendedYield = "suspendedYield";                                                                   // 68
  var GenStateExecuting = "executing";                                                                             // 69
  var GenStateCompleted = "completed";                                                                             // 70
                                                                                                                   // 71
  // Returning this object from the innerFn has the same effect as                                                 // 72
  // breaking out of the dispatch switch statement.                                                                // 73
  var ContinueSentinel = {};                                                                                       // 74
                                                                                                                   // 75
  // Dummy constructor functions that we use as the .constructor and                                               // 76
  // .constructor.prototype properties for functions that return Generator                                         // 77
  // objects. For full spec compliance, you may wish to configure your                                             // 78
  // minifier not to mangle the names of these two functions.                                                      // 79
  function Generator() {}                                                                                          // 80
  function GeneratorFunction() {}                                                                                  // 81
  function GeneratorFunctionPrototype() {}                                                                         // 82
                                                                                                                   // 83
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;                                             // 84
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;                                       // 85
  GeneratorFunctionPrototype.constructor = GeneratorFunction;                                                      // 86
  GeneratorFunction.displayName = "GeneratorFunction";                                                             // 87
                                                                                                                   // 88
  runtime.isGeneratorFunction = function(genFun) {                                                                 // 89
    var ctor = typeof genFun === "function" && genFun.constructor;                                                 // 90
    return ctor                                                                                                    // 91
      ? ctor === GeneratorFunction ||                                                                              // 92
        // For the native GeneratorFunction constructor, the best we can                                           // 93
        // do is to check its .name property.                                                                      // 94
        (ctor.displayName || ctor.name) === "GeneratorFunction"                                                    // 95
      : false;                                                                                                     // 96
  };                                                                                                               // 97
                                                                                                                   // 98
  runtime.mark = function(genFun) {                                                                                // 99
    genFun.__proto__ = GeneratorFunctionPrototype;                                                                 // 100
    genFun.prototype = Object.create(Gp);                                                                          // 101
    return genFun;                                                                                                 // 102
  };                                                                                                               // 103
                                                                                                                   // 104
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {                                                  // 105
    return new Promise(function(resolve, reject) {                                                                 // 106
      var generator = wrap(innerFn, outerFn, self, tryLocsList);                                                   // 107
      var callNext = step.bind(generator, "next");                                                                 // 108
      var callThrow = step.bind(generator, "throw");                                                               // 109
                                                                                                                   // 110
      function step(method, arg) {                                                                                 // 111
        var record = tryCatch(generator[method], generator, arg);                                                  // 112
        if (record.type === "throw") {                                                                             // 113
          reject(record.arg);                                                                                      // 114
          return;                                                                                                  // 115
        }                                                                                                          // 116
                                                                                                                   // 117
        var info = record.arg;                                                                                     // 118
        if (info.done) {                                                                                           // 119
          resolve(info.value);                                                                                     // 120
        } else {                                                                                                   // 121
          Promise.resolve(info.value).then(callNext, callThrow);                                                   // 122
        }                                                                                                          // 123
      }                                                                                                            // 124
                                                                                                                   // 125
      callNext();                                                                                                  // 126
    });                                                                                                            // 127
  };                                                                                                               // 128
                                                                                                                   // 129
  function makeInvokeMethod(innerFn, self, context) {                                                              // 130
    var state = GenStateSuspendedStart;                                                                            // 131
                                                                                                                   // 132
    return function invoke(method, arg) {                                                                          // 133
      if (state === GenStateExecuting) {                                                                           // 134
        throw new Error("Generator is already running");                                                           // 135
      }                                                                                                            // 136
                                                                                                                   // 137
      if (state === GenStateCompleted) {                                                                           // 138
        // Be forgiving, per 25.3.3.3.3 of the spec:                                                               // 139
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume                               // 140
        return doneResult();                                                                                       // 141
      }                                                                                                            // 142
                                                                                                                   // 143
      while (true) {                                                                                               // 144
        var delegate = context.delegate;                                                                           // 145
        if (delegate) {                                                                                            // 146
          if (method === "return" ||                                                                               // 147
              (method === "throw" && delegate.iterator.throw === undefined)) {                                     // 148
            // A return or throw (when the delegate iterator has no throw                                          // 149
            // method) always terminates the yield* loop.                                                          // 150
            context.delegate = null;                                                                               // 151
                                                                                                                   // 152
            // If the delegate iterator has a return method, give it a                                             // 153
            // chance to clean up.                                                                                 // 154
            var returnMethod = delegate.iterator.return;                                                           // 155
            if (returnMethod) {                                                                                    // 156
              var record = tryCatch(returnMethod, delegate.iterator, arg);                                         // 157
              if (record.type === "throw") {                                                                       // 158
                // If the return method threw an exception, let that                                               // 159
                // exception prevail over the original return or throw.                                            // 160
                method = "throw";                                                                                  // 161
                arg = record.arg;                                                                                  // 162
                continue;                                                                                          // 163
              }                                                                                                    // 164
            }                                                                                                      // 165
                                                                                                                   // 166
            if (method === "return") {                                                                             // 167
              // Continue with the outer return, now that the delegate                                             // 168
              // iterator has been terminated.                                                                     // 169
              continue;                                                                                            // 170
            }                                                                                                      // 171
          }                                                                                                        // 172
                                                                                                                   // 173
          var record = tryCatch(                                                                                   // 174
            delegate.iterator[method],                                                                             // 175
            delegate.iterator,                                                                                     // 176
            arg                                                                                                    // 177
          );                                                                                                       // 178
                                                                                                                   // 179
          if (record.type === "throw") {                                                                           // 180
            context.delegate = null;                                                                               // 181
                                                                                                                   // 182
            // Like returning generator.throw(uncaught), but without the                                           // 183
            // overhead of an extra function call.                                                                 // 184
            method = "throw";                                                                                      // 185
            arg = record.arg;                                                                                      // 186
            continue;                                                                                              // 187
          }                                                                                                        // 188
                                                                                                                   // 189
          // Delegate generator ran and handled its own exceptions so                                              // 190
          // regardless of what the method was, we continue as if it is                                            // 191
          // "next" with an undefined arg.                                                                         // 192
          method = "next";                                                                                         // 193
          arg = undefined;                                                                                         // 194
                                                                                                                   // 195
          var info = record.arg;                                                                                   // 196
          if (info.done) {                                                                                         // 197
            context[delegate.resultName] = info.value;                                                             // 198
            context.next = delegate.nextLoc;                                                                       // 199
          } else {                                                                                                 // 200
            state = GenStateSuspendedYield;                                                                        // 201
            return info;                                                                                           // 202
          }                                                                                                        // 203
                                                                                                                   // 204
          context.delegate = null;                                                                                 // 205
        }                                                                                                          // 206
                                                                                                                   // 207
        if (method === "next") {                                                                                   // 208
          if (state === GenStateSuspendedYield) {                                                                  // 209
            context.sent = arg;                                                                                    // 210
          } else {                                                                                                 // 211
            delete context.sent;                                                                                   // 212
          }                                                                                                        // 213
                                                                                                                   // 214
        } else if (method === "throw") {                                                                           // 215
          if (state === GenStateSuspendedStart) {                                                                  // 216
            state = GenStateCompleted;                                                                             // 217
            throw arg;                                                                                             // 218
          }                                                                                                        // 219
                                                                                                                   // 220
          if (context.dispatchException(arg)) {                                                                    // 221
            // If the dispatched exception was caught by a catch block,                                            // 222
            // then let that catch block handle the exception normally.                                            // 223
            method = "next";                                                                                       // 224
            arg = undefined;                                                                                       // 225
          }                                                                                                        // 226
                                                                                                                   // 227
        } else if (method === "return") {                                                                          // 228
          context.abrupt("return", arg);                                                                           // 229
        }                                                                                                          // 230
                                                                                                                   // 231
        state = GenStateExecuting;                                                                                 // 232
                                                                                                                   // 233
        var record = tryCatch(innerFn, self, context);                                                             // 234
        if (record.type === "normal") {                                                                            // 235
          // If an exception is thrown from innerFn, we leave state ===                                            // 236
          // GenStateExecuting and loop back for another invocation.                                               // 237
          state = context.done                                                                                     // 238
            ? GenStateCompleted                                                                                    // 239
            : GenStateSuspendedYield;                                                                              // 240
                                                                                                                   // 241
          var info = {                                                                                             // 242
            value: record.arg,                                                                                     // 243
            done: context.done                                                                                     // 244
          };                                                                                                       // 245
                                                                                                                   // 246
          if (record.arg === ContinueSentinel) {                                                                   // 247
            if (context.delegate && method === "next") {                                                           // 248
              // Deliberately forget the last sent value so that we don't                                          // 249
              // accidentally pass it on to the delegate.                                                          // 250
              arg = undefined;                                                                                     // 251
            }                                                                                                      // 252
          } else {                                                                                                 // 253
            return info;                                                                                           // 254
          }                                                                                                        // 255
                                                                                                                   // 256
        } else if (record.type === "throw") {                                                                      // 257
          state = GenStateCompleted;                                                                               // 258
          // Dispatch the exception by looping back around to the                                                  // 259
          // context.dispatchException(arg) call above.                                                            // 260
          method = "throw";                                                                                        // 261
          arg = record.arg;                                                                                        // 262
        }                                                                                                          // 263
      }                                                                                                            // 264
    };                                                                                                             // 265
  }                                                                                                                // 266
                                                                                                                   // 267
  function defineGeneratorMethod(method) {                                                                         // 268
    Gp[method] = function(arg) {                                                                                   // 269
      return this._invoke(method, arg);                                                                            // 270
    };                                                                                                             // 271
  }                                                                                                                // 272
  defineGeneratorMethod("next");                                                                                   // 273
  defineGeneratorMethod("throw");                                                                                  // 274
  defineGeneratorMethod("return");                                                                                 // 275
                                                                                                                   // 276
  Gp[iteratorSymbol] = function() {                                                                                // 277
    return this;                                                                                                   // 278
  };                                                                                                               // 279
                                                                                                                   // 280
  Gp.toString = function() {                                                                                       // 281
    return "[object Generator]";                                                                                   // 282
  };                                                                                                               // 283
                                                                                                                   // 284
  function pushTryEntry(locs) {                                                                                    // 285
    var entry = { tryLoc: locs[0] };                                                                               // 286
                                                                                                                   // 287
    if (1 in locs) {                                                                                               // 288
      entry.catchLoc = locs[1];                                                                                    // 289
    }                                                                                                              // 290
                                                                                                                   // 291
    if (2 in locs) {                                                                                               // 292
      entry.finallyLoc = locs[2];                                                                                  // 293
      entry.afterLoc = locs[3];                                                                                    // 294
    }                                                                                                              // 295
                                                                                                                   // 296
    this.tryEntries.push(entry);                                                                                   // 297
  }                                                                                                                // 298
                                                                                                                   // 299
  function resetTryEntry(entry) {                                                                                  // 300
    var record = entry.completion || {};                                                                           // 301
    record.type = "normal";                                                                                        // 302
    delete record.arg;                                                                                             // 303
    entry.completion = record;                                                                                     // 304
  }                                                                                                                // 305
                                                                                                                   // 306
  function Context(tryLocsList) {                                                                                  // 307
    // The root entry object (effectively a try statement without a catch                                          // 308
    // or a finally block) gives us a place to store values thrown from                                            // 309
    // locations where there is no enclosing try statement.                                                        // 310
    this.tryEntries = [{ tryLoc: "root" }];                                                                        // 311
    tryLocsList.forEach(pushTryEntry, this);                                                                       // 312
    this.reset();                                                                                                  // 313
  }                                                                                                                // 314
                                                                                                                   // 315
  runtime.keys = function(object) {                                                                                // 316
    var keys = [];                                                                                                 // 317
    for (var key in object) {                                                                                      // 318
      keys.push(key);                                                                                              // 319
    }                                                                                                              // 320
    keys.reverse();                                                                                                // 321
                                                                                                                   // 322
    // Rather than returning an object with a next method, we keep                                                 // 323
    // things simple and return the next function itself.                                                          // 324
    return function next() {                                                                                       // 325
      while (keys.length) {                                                                                        // 326
        var key = keys.pop();                                                                                      // 327
        if (key in object) {                                                                                       // 328
          next.value = key;                                                                                        // 329
          next.done = false;                                                                                       // 330
          return next;                                                                                             // 331
        }                                                                                                          // 332
      }                                                                                                            // 333
                                                                                                                   // 334
      // To avoid creating an additional object, we just hang the .value                                           // 335
      // and .done properties off the next function object itself. This                                            // 336
      // also ensures that the minifier will not anonymize the function.                                           // 337
      next.done = true;                                                                                            // 338
      return next;                                                                                                 // 339
    };                                                                                                             // 340
  };                                                                                                               // 341
                                                                                                                   // 342
  function values(iterable) {                                                                                      // 343
    if (iterable) {                                                                                                // 344
      var iteratorMethod = iterable[iteratorSymbol];                                                               // 345
      if (iteratorMethod) {                                                                                        // 346
        return iteratorMethod.call(iterable);                                                                      // 347
      }                                                                                                            // 348
                                                                                                                   // 349
      if (typeof iterable.next === "function") {                                                                   // 350
        return iterable;                                                                                           // 351
      }                                                                                                            // 352
                                                                                                                   // 353
      if (!isNaN(iterable.length)) {                                                                               // 354
        var i = -1, next = function next() {                                                                       // 355
          while (++i < iterable.length) {                                                                          // 356
            if (hasOwn.call(iterable, i)) {                                                                        // 357
              next.value = iterable[i];                                                                            // 358
              next.done = false;                                                                                   // 359
              return next;                                                                                         // 360
            }                                                                                                      // 361
          }                                                                                                        // 362
                                                                                                                   // 363
          next.value = undefined;                                                                                  // 364
          next.done = true;                                                                                        // 365
                                                                                                                   // 366
          return next;                                                                                             // 367
        };                                                                                                         // 368
                                                                                                                   // 369
        return next.next = next;                                                                                   // 370
      }                                                                                                            // 371
    }                                                                                                              // 372
                                                                                                                   // 373
    // Return an iterator with no values.                                                                          // 374
    return { next: doneResult };                                                                                   // 375
  }                                                                                                                // 376
  runtime.values = values;                                                                                         // 377
                                                                                                                   // 378
  function doneResult() {                                                                                          // 379
    return { value: undefined, done: true };                                                                       // 380
  }                                                                                                                // 381
                                                                                                                   // 382
  Context.prototype = {                                                                                            // 383
    constructor: Context,                                                                                          // 384
                                                                                                                   // 385
    reset: function() {                                                                                            // 386
      this.prev = 0;                                                                                               // 387
      this.next = 0;                                                                                               // 388
      this.sent = undefined;                                                                                       // 389
      this.done = false;                                                                                           // 390
      this.delegate = null;                                                                                        // 391
                                                                                                                   // 392
      this.tryEntries.forEach(resetTryEntry);                                                                      // 393
                                                                                                                   // 394
      // Pre-initialize at least 20 temporary variables to enable hidden                                           // 395
      // class optimizations for simple generators.                                                                // 396
      for (var tempIndex = 0, tempName;                                                                            // 397
           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;                                        // 398
           ++tempIndex) {                                                                                          // 399
        this[tempName] = null;                                                                                     // 400
      }                                                                                                            // 401
    },                                                                                                             // 402
                                                                                                                   // 403
    stop: function() {                                                                                             // 404
      this.done = true;                                                                                            // 405
                                                                                                                   // 406
      var rootEntry = this.tryEntries[0];                                                                          // 407
      var rootRecord = rootEntry.completion;                                                                       // 408
      if (rootRecord.type === "throw") {                                                                           // 409
        throw rootRecord.arg;                                                                                      // 410
      }                                                                                                            // 411
                                                                                                                   // 412
      return this.rval;                                                                                            // 413
    },                                                                                                             // 414
                                                                                                                   // 415
    dispatchException: function(exception) {                                                                       // 416
      if (this.done) {                                                                                             // 417
        throw exception;                                                                                           // 418
      }                                                                                                            // 419
                                                                                                                   // 420
      var context = this;                                                                                          // 421
      function handle(loc, caught) {                                                                               // 422
        record.type = "throw";                                                                                     // 423
        record.arg = exception;                                                                                    // 424
        context.next = loc;                                                                                        // 425
        return !!caught;                                                                                           // 426
      }                                                                                                            // 427
                                                                                                                   // 428
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                      // 429
        var entry = this.tryEntries[i];                                                                            // 430
        var record = entry.completion;                                                                             // 431
                                                                                                                   // 432
        if (entry.tryLoc === "root") {                                                                             // 433
          // Exception thrown outside of any try block that could handle                                           // 434
          // it, so set the completion value of the entire function to                                             // 435
          // throw the exception.                                                                                  // 436
          return handle("end");                                                                                    // 437
        }                                                                                                          // 438
                                                                                                                   // 439
        if (entry.tryLoc <= this.prev) {                                                                           // 440
          var hasCatch = hasOwn.call(entry, "catchLoc");                                                           // 441
          var hasFinally = hasOwn.call(entry, "finallyLoc");                                                       // 442
                                                                                                                   // 443
          if (hasCatch && hasFinally) {                                                                            // 444
            if (this.prev < entry.catchLoc) {                                                                      // 445
              return handle(entry.catchLoc, true);                                                                 // 446
            } else if (this.prev < entry.finallyLoc) {                                                             // 447
              return handle(entry.finallyLoc);                                                                     // 448
            }                                                                                                      // 449
                                                                                                                   // 450
          } else if (hasCatch) {                                                                                   // 451
            if (this.prev < entry.catchLoc) {                                                                      // 452
              return handle(entry.catchLoc, true);                                                                 // 453
            }                                                                                                      // 454
                                                                                                                   // 455
          } else if (hasFinally) {                                                                                 // 456
            if (this.prev < entry.finallyLoc) {                                                                    // 457
              return handle(entry.finallyLoc);                                                                     // 458
            }                                                                                                      // 459
                                                                                                                   // 460
          } else {                                                                                                 // 461
            throw new Error("try statement without catch or finally");                                             // 462
          }                                                                                                        // 463
        }                                                                                                          // 464
      }                                                                                                            // 465
    },                                                                                                             // 466
                                                                                                                   // 467
    abrupt: function(type, arg) {                                                                                  // 468
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                      // 469
        var entry = this.tryEntries[i];                                                                            // 470
        if (entry.tryLoc <= this.prev &&                                                                           // 471
            hasOwn.call(entry, "finallyLoc") &&                                                                    // 472
            this.prev < entry.finallyLoc) {                                                                        // 473
          var finallyEntry = entry;                                                                                // 474
          break;                                                                                                   // 475
        }                                                                                                          // 476
      }                                                                                                            // 477
                                                                                                                   // 478
      if (finallyEntry &&                                                                                          // 479
          (type === "break" ||                                                                                     // 480
           type === "continue") &&                                                                                 // 481
          finallyEntry.tryLoc <= arg &&                                                                            // 482
          arg < finallyEntry.finallyLoc) {                                                                         // 483
        // Ignore the finally entry if control is not jumping to a                                                 // 484
        // location outside the try/catch block.                                                                   // 485
        finallyEntry = null;                                                                                       // 486
      }                                                                                                            // 487
                                                                                                                   // 488
      var record = finallyEntry ? finallyEntry.completion : {};                                                    // 489
      record.type = type;                                                                                          // 490
      record.arg = arg;                                                                                            // 491
                                                                                                                   // 492
      if (finallyEntry) {                                                                                          // 493
        this.next = finallyEntry.finallyLoc;                                                                       // 494
      } else {                                                                                                     // 495
        this.complete(record);                                                                                     // 496
      }                                                                                                            // 497
                                                                                                                   // 498
      return ContinueSentinel;                                                                                     // 499
    },                                                                                                             // 500
                                                                                                                   // 501
    complete: function(record, afterLoc) {                                                                         // 502
      if (record.type === "throw") {                                                                               // 503
        throw record.arg;                                                                                          // 504
      }                                                                                                            // 505
                                                                                                                   // 506
      if (record.type === "break" ||                                                                               // 507
          record.type === "continue") {                                                                            // 508
        this.next = record.arg;                                                                                    // 509
      } else if (record.type === "return") {                                                                       // 510
        this.rval = record.arg;                                                                                    // 511
        this.next = "end";                                                                                         // 512
      } else if (record.type === "normal" && afterLoc) {                                                           // 513
        this.next = afterLoc;                                                                                      // 514
      }                                                                                                            // 515
                                                                                                                   // 516
      return ContinueSentinel;                                                                                     // 517
    },                                                                                                             // 518
                                                                                                                   // 519
    finish: function(finallyLoc) {                                                                                 // 520
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                      // 521
        var entry = this.tryEntries[i];                                                                            // 522
        if (entry.finallyLoc === finallyLoc) {                                                                     // 523
          return this.complete(entry.completion, entry.afterLoc);                                                  // 524
        }                                                                                                          // 525
      }                                                                                                            // 526
    },                                                                                                             // 527
                                                                                                                   // 528
    "catch": function(tryLoc) {                                                                                    // 529
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                      // 530
        var entry = this.tryEntries[i];                                                                            // 531
        if (entry.tryLoc === tryLoc) {                                                                             // 532
          var record = entry.completion;                                                                           // 533
          if (record.type === "throw") {                                                                           // 534
            var thrown = record.arg;                                                                               // 535
            resetTryEntry(entry);                                                                                  // 536
          }                                                                                                        // 537
          return thrown;                                                                                           // 538
        }                                                                                                          // 539
      }                                                                                                            // 540
                                                                                                                   // 541
      // The context.catch method must only be called with a location                                              // 542
      // argument that corresponds to a known catch block.                                                         // 543
      throw new Error("illegal catch attempt");                                                                    // 544
    },                                                                                                             // 545
                                                                                                                   // 546
    delegateYield: function(iterable, resultName, nextLoc) {                                                       // 547
      this.delegate = {                                                                                            // 548
        iterator: values(iterable),                                                                                // 549
        resultName: resultName,                                                                                    // 550
        nextLoc: nextLoc                                                                                           // 551
      };                                                                                                           // 552
                                                                                                                   // 553
      return ContinueSentinel;                                                                                     // 554
    }                                                                                                              // 555
  };                                                                                                               // 556
})(                                                                                                                // 557
  // Among the various tricks for obtaining a reference to the global                                              // 558
  // object, this seems to be the most reliable technique that does not                                            // 559
  // use indirect eval (which violates Content Security Policy).                                                   // 560
  typeof global === "object" ? global :                                                                            // 561
  typeof window === "object" ? window :                                                                            // 562
  typeof self === "object" ? self : this                                                                           // 563
);                                                                                                                 // 564
                                                                                                                   // 565
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['grigio:babel'] = {};

})();

//# sourceMappingURL=grigio_babel.js.map
