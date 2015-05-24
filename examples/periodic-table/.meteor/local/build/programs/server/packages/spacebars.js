(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTML = Package.htmljs.HTML;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var _ = Package.underscore._;

/* Package-scope variables */
var Spacebars;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/spacebars/spacebars-runtime.js                                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
Spacebars = {};                                                                  // 1
                                                                                 // 2
var tripleEquals = function (a, b) { return a === b; };                          // 3
                                                                                 // 4
Spacebars.include = function (templateOrFunction, contentFunc, elseFunc) {       // 5
  if (! templateOrFunction)                                                      // 6
    return null;                                                                 // 7
                                                                                 // 8
  if (typeof templateOrFunction !== 'function') {                                // 9
    var template = templateOrFunction;                                           // 10
    if (! Blaze.isTemplate(template))                                            // 11
      throw new Error("Expected template or null, found: " + template);          // 12
    return templateOrFunction.constructView(contentFunc, elseFunc);              // 13
  }                                                                              // 14
                                                                                 // 15
  var templateVar = Blaze.ReactiveVar(null, tripleEquals);                       // 16
  var view = Blaze.View('Spacebars.include', function () {                       // 17
    var template = templateVar.get();                                            // 18
    if (template === null)                                                       // 19
      return null;                                                               // 20
                                                                                 // 21
    if (! Blaze.isTemplate(template))                                            // 22
      throw new Error("Expected template or null, found: " + template);          // 23
                                                                                 // 24
    return template.constructView(contentFunc, elseFunc);                        // 25
  });                                                                            // 26
  view.__templateVar = templateVar;                                              // 27
  view.onViewCreated(function () {                                               // 28
    this.autorun(function () {                                                   // 29
      templateVar.set(templateOrFunction());                                     // 30
    });                                                                          // 31
  });                                                                            // 32
                                                                                 // 33
  return view;                                                                   // 34
};                                                                               // 35
                                                                                 // 36
// Executes `{{foo bar baz}}` when called on `(foo, bar, baz)`.                  // 37
// If `bar` and `baz` are functions, they are called before                      // 38
// `foo` is called on them.                                                      // 39
//                                                                               // 40
// This is the shared part of Spacebars.mustache and                             // 41
// Spacebars.attrMustache, which differ in how they post-process the             // 42
// result.                                                                       // 43
Spacebars.mustacheImpl = function (value/*, args*/) {                            // 44
  var args = arguments;                                                          // 45
  // if we have any arguments (pos or kw), add an options argument               // 46
  // if there isn't one.                                                         // 47
  if (args.length > 1) {                                                         // 48
    var kw = args[args.length - 1];                                              // 49
    if (! (kw instanceof Spacebars.kw)) {                                        // 50
      kw = Spacebars.kw();                                                       // 51
      // clone arguments into an actual array, then push                         // 52
      // the empty kw object.                                                    // 53
      args = Array.prototype.slice.call(arguments);                              // 54
      args.push(kw);                                                             // 55
    } else {                                                                     // 56
      // For each keyword arg, call it if it's a function                        // 57
      var newHash = {};                                                          // 58
      for (var k in kw.hash) {                                                   // 59
        var v = kw.hash[k];                                                      // 60
        newHash[k] = (typeof v === 'function' ? v() : v);                        // 61
      }                                                                          // 62
      args[args.length - 1] = Spacebars.kw(newHash);                             // 63
    }                                                                            // 64
  }                                                                              // 65
                                                                                 // 66
  return Spacebars.call.apply(null, args);                                       // 67
};                                                                               // 68
                                                                                 // 69
Spacebars.mustache = function (value/*, args*/) {                                // 70
  var result = Spacebars.mustacheImpl.apply(null, arguments);                    // 71
                                                                                 // 72
  if (result instanceof Spacebars.SafeString)                                    // 73
    return HTML.Raw(result.toString());                                          // 74
  else                                                                           // 75
    // map `null`, `undefined`, and `false` to null, which is important          // 76
    // so that attributes with nully values are considered absent.               // 77
    // stringify anything else (e.g. strings, booleans, numbers including 0).    // 78
    return (result == null || result === false) ? null : String(result);         // 79
};                                                                               // 80
                                                                                 // 81
Spacebars.attrMustache = function (value/*, args*/) {                            // 82
  var result = Spacebars.mustacheImpl.apply(null, arguments);                    // 83
                                                                                 // 84
  if (result == null || result === '') {                                         // 85
    return null;                                                                 // 86
  } else if (typeof result === 'object') {                                       // 87
    return result;                                                               // 88
  } else if (typeof result === 'string' && HTML.isValidAttributeName(result)) {  // 89
    var obj = {};                                                                // 90
    obj[result] = '';                                                            // 91
    return obj;                                                                  // 92
  } else {                                                                       // 93
    throw new Error("Expected valid attribute name, '', null, or object");       // 94
  }                                                                              // 95
};                                                                               // 96
                                                                                 // 97
Spacebars.dataMustache = function (value/*, args*/) {                            // 98
  var result = Spacebars.mustacheImpl.apply(null, arguments);                    // 99
                                                                                 // 100
  return result;                                                                 // 101
};                                                                               // 102
                                                                                 // 103
// Idempotently wrap in `HTML.Raw`.                                              // 104
//                                                                               // 105
// Called on the return value from `Spacebars.mustache` in case the              // 106
// template uses triple-stache (`{{{foo bar baz}}}`).                            // 107
Spacebars.makeRaw = function (value) {                                           // 108
  if (value == null) // null or undefined                                        // 109
    return null;                                                                 // 110
  else if (value instanceof HTML.Raw)                                            // 111
    return value;                                                                // 112
  else                                                                           // 113
    return HTML.Raw(value);                                                      // 114
};                                                                               // 115
                                                                                 // 116
// If `value` is a function, called it on the `args`, after                      // 117
// evaluating the args themselves (by calling them if they are                   // 118
// functions).  Otherwise, simply return `value` (and assert that                // 119
// there are no args).                                                           // 120
Spacebars.call = function (value/*, args*/) {                                    // 121
  if (typeof value === 'function') {                                             // 122
    // evaluate arguments if they are functions (by calling them)                // 123
    var newArgs = [];                                                            // 124
    for (var i = 1; i < arguments.length; i++) {                                 // 125
      var arg = arguments[i];                                                    // 126
      newArgs[i-1] = (typeof arg === 'function' ? arg() : arg);                  // 127
    }                                                                            // 128
                                                                                 // 129
    return value.apply(null, newArgs);                                           // 130
  } else {                                                                       // 131
    if (arguments.length > 1)                                                    // 132
      throw new Error("Can't call non-function: " + value);                      // 133
                                                                                 // 134
    return value;                                                                // 135
  }                                                                              // 136
};                                                                               // 137
                                                                                 // 138
// Call this as `Spacebars.kw({ ... })`.  The return value                       // 139
// is `instanceof Spacebars.kw`.                                                 // 140
Spacebars.kw = function (hash) {                                                 // 141
  if (! (this instanceof Spacebars.kw))                                          // 142
    // called without new; call with new                                         // 143
    return new Spacebars.kw(hash);                                               // 144
                                                                                 // 145
  this.hash = hash || {};                                                        // 146
};                                                                               // 147
                                                                                 // 148
// Call this as `Spacebars.SafeString("some HTML")`.  The return value           // 149
// is `instanceof Spacebars.SafeString` (and `instanceof Handlebars.SafeString). // 150
Spacebars.SafeString = function (html) {                                         // 151
  if (! (this instanceof Spacebars.SafeString))                                  // 152
    // called without new; call with new                                         // 153
    return new Spacebars.SafeString(html);                                       // 154
                                                                                 // 155
  return new Handlebars.SafeString(html);                                        // 156
};                                                                               // 157
Spacebars.SafeString.prototype = Handlebars.SafeString.prototype;                // 158
                                                                                 // 159
// `Spacebars.dot(foo, "bar", "baz")` performs a special kind                    // 160
// of `foo.bar.baz` that allows safe indexing of `null` and                      // 161
// indexing of functions (which calls the function).  If the                     // 162
// result is a function, it is always a bound function (e.g.                     // 163
// a wrapped version of `baz` that always uses `foo.bar` as                      // 164
// `this`).                                                                      // 165
//                                                                               // 166
// In `Spacebars.dot(foo, "bar")`, `foo` is assumed to be either                 // 167
// a non-function value or a "fully-bound" function wrapping a value,            // 168
// where fully-bound means it takes no arguments and ignores `this`.             // 169
//                                                                               // 170
// `Spacebars.dot(foo, "bar")` performs the following steps:                     // 171
//                                                                               // 172
// * If `foo` is falsy, return `foo`.                                            // 173
//                                                                               // 174
// * If `foo` is a function, call it (set `foo` to `foo()`).                     // 175
//                                                                               // 176
// * If `foo` is falsy now, return `foo`.                                        // 177
//                                                                               // 178
// * Return `foo.bar`, binding it to `foo` if it's a function.                   // 179
Spacebars.dot = function (value, id1/*, id2, ...*/) {                            // 180
  if (arguments.length > 2) {                                                    // 181
    // Note: doing this recursively is probably less efficient than              // 182
    // doing it in an iterative loop.                                            // 183
    var argsForRecurse = [];                                                     // 184
    argsForRecurse.push(Spacebars.dot(value, id1));                              // 185
    argsForRecurse.push.apply(argsForRecurse,                                    // 186
                              Array.prototype.slice.call(arguments, 2));         // 187
    return Spacebars.dot.apply(null, argsForRecurse);                            // 188
  }                                                                              // 189
                                                                                 // 190
  if (typeof value === 'function')                                               // 191
    value = value();                                                             // 192
                                                                                 // 193
  if (! value)                                                                   // 194
    return value; // falsy, don't index, pass through                            // 195
                                                                                 // 196
  var result = value[id1];                                                       // 197
  if (typeof result !== 'function')                                              // 198
    return result;                                                               // 199
  // `value[id1]` (or `value()[id1]`) is a function.                             // 200
  // Bind it so that when called, `value` will be placed in `this`.              // 201
  return function (/*arguments*/) {                                              // 202
    return result.apply(value, arguments);                                       // 203
  };                                                                             // 204
};                                                                               // 205
                                                                                 // 206
// Spacebars.With implements the conditional logic of rendering                  // 207
// the `{{else}}` block if the argument is falsy.  It combines                   // 208
// a Blaze.If with a Blaze.With (the latter only in the truthy                   // 209
// case, since the else block is evaluated without entering                      // 210
// a new data context).                                                          // 211
Spacebars.With = function (argFunc, contentFunc, elseFunc) {                     // 212
  var argVar = new Blaze.ReactiveVar;                                            // 213
  var view = Blaze.View('Spacebars_with', function () {                          // 214
    return Blaze.If(function () { return argVar.get(); },                        // 215
                    function () { return Blaze.With(function () {                // 216
                      return argVar.get(); }, contentFunc); },                   // 217
                    elseFunc);                                                   // 218
  });                                                                            // 219
  view.onViewCreated(function () {                                               // 220
    this.autorun(function () {                                                   // 221
      argVar.set(argFunc());                                                     // 222
                                                                                 // 223
      // This is a hack so that autoruns inside the body                         // 224
      // of the #with get stopped sooner.  It reaches inside                     // 225
      // our ReactiveVar to access its dep.                                      // 226
                                                                                 // 227
      Tracker.onInvalidate(function () {                                         // 228
        argVar.dep.changed();                                                    // 229
      });                                                                        // 230
                                                                                 // 231
      // Take the case of `{{#with A}}{{B}}{{/with}}`.  The goal                 // 232
      // is to not re-render `B` if `A` changes to become falsy                  // 233
      // and `B` is simultaneously invalidated.                                  // 234
      //                                                                         // 235
      // A series of autoruns are involved:                                      // 236
      //                                                                         // 237
      // 1. This autorun (argument to Spacebars.With)                            // 238
      // 2. Argument to Blaze.If                                                 // 239
      // 3. Blaze.If view re-render                                              // 240
      // 4. Argument to Blaze.With                                               // 241
      // 5. The template tag `{{B}}`                                             // 242
      //                                                                         // 243
      // When (3) is invalidated, it immediately stops (4) and (5)               // 244
      // because of a Tracker.onInvalidate built into materializeView.           // 245
      // (When a View's render method is invalidated, it immediately             // 246
      // tears down all the subviews, via a Tracker.onInvalidate much            // 247
      // like this one.                                                          // 248
      //                                                                         // 249
      // Suppose `A` changes to become falsy, and `B` changes at the             // 250
      // same time (i.e. without an intervening flush).                          // 251
      // Without the code above, this happens:                                   // 252
      //                                                                         // 253
      // - (1) and (5) are invalidated.                                          // 254
      // - (1) runs, invalidating (2) and (4).                                   // 255
      // - (5) runs.                                                             // 256
      // - (2) runs, invalidating (3), stopping (4) and (5).                     // 257
      //                                                                         // 258
      // With the code above:                                                    // 259
      //                                                                         // 260
      // - (1) and (5) are invalidated, invalidating (2) and (4).                // 261
      // - (1) runs.                                                             // 262
      // - (2) runs, invalidating (3), stopping (4) and (5).                     // 263
      //                                                                         // 264
      // If the re-run of (5) is originally enqueued before (1), all             // 265
      // bets are off, but typically that doesn't seem to be the                 // 266
      // case.  Anyway, doing this is always better than not doing it,           // 267
      // because it might save a bunch of DOM from being updated                 // 268
      // needlessly.                                                             // 269
    });                                                                          // 270
  });                                                                            // 271
                                                                                 // 272
  return view;                                                                   // 273
};                                                                               // 274
                                                                                 // 275
// XXX COMPAT WITH 0.9.0                                                         // 276
Spacebars.TemplateWith = Blaze._TemplateWith;                                    // 277
                                                                                 // 278
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.spacebars = {
  Spacebars: Spacebars
};

})();

//# sourceMappingURL=spacebars.js.map
