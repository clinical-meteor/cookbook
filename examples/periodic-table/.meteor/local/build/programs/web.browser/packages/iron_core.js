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
var Iron;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/iron:core/lib/version_conflict_error.js                                             //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
if (Package['cmather:iron-core']) {                                                             // 1
  throw new Error("\n\n\
    Sorry! The cmather:iron-{x} packages were migrated to the new package system with the wrong name, and you have duplicate copies.\n\
    You can see which cmather:iron-{x} packages have been installed by using this command:\n\n\
    > meteor list\n\n\
    Can you remove any installed cmather:iron-{x} packages like this:\
    \n\n\
    > meteor remove cmather:iron-core\n\
    > meteor remove cmather:iron-router\n\
    > meteor remove cmather:iron-dynamic-template\n\
    > meteor remove cmather:iron-dynamic-layout\n\
    \n\
    The new packages are named iron:{x}. For example:\n\n\
    > meteor add iron:router\n\n\
    Sorry for the hassle, but thank you!\
    \n\n\
  ");                                                                                           // 17
}                                                                                               // 18
                                                                                                // 19
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/iron:core/lib/iron_core.js                                                          //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Iron = {};                                                                                      // 1
Iron.utils = {};                                                                                // 2
                                                                                                // 3
/**                                                                                             // 4
 * Assert that the given condition is truthy and throw an error if not.                         // 5
 */                                                                                             // 6
                                                                                                // 7
Iron.utils.assert = function (condition, msg) {                                                 // 8
  if (!condition)                                                                               // 9
    throw new Error(msg);                                                                       // 10
};                                                                                              // 11
                                                                                                // 12
/**                                                                                             // 13
 * Print a warning message to the console if the console is defined.                            // 14
 */                                                                                             // 15
Iron.utils.warn = function (condition, msg) {                                                   // 16
  if (!condition)                                                                               // 17
    console && console.warn && console.warn(msg);                                               // 18
};                                                                                              // 19
                                                                                                // 20
/**                                                                                             // 21
 * Given a target object and a property name, if the value of that property is                  // 22
 * undefined, set a default value and return it. If the value is already                        // 23
 * defined, return the existing value.                                                          // 24
 */                                                                                             // 25
Iron.utils.defaultValue = function (target, prop, value) {                                      // 26
  if (typeof target[prop] === 'undefined') {                                                    // 27
    target[prop] = value;                                                                       // 28
    return value;                                                                               // 29
  } else {                                                                                      // 30
    return target[prop]                                                                         // 31
  }                                                                                             // 32
};                                                                                              // 33
                                                                                                // 34
/**                                                                                             // 35
 * Make one constructor function inherit from another. Optionally provide                       // 36
 * prototype properties for the child.                                                          // 37
 *                                                                                              // 38
 * @param {Function} Child The child constructor function.                                      // 39
 * @param {Function} Parent The parent constructor function.                                    // 40
 * @param {Object} [props] Prototype properties to add to the child                             // 41
 */                                                                                             // 42
Iron.utils.inherits = function (Child, Parent, props) {                                         // 43
  Iron.utils.assert(typeof Child !== "undefined", "Child is undefined in inherits function");   // 44
  Iron.utils.assert(typeof Parent !== "undefined", "Parent is undefined in inherits function"); // 45
                                                                                                // 46
  // copy static fields                                                                         // 47
  for (var key in Parent) {                                                                     // 48
    if (_.has(Parent, key))                                                                     // 49
      Child[key] = EJSON.clone(Parent[key]);                                                    // 50
  }                                                                                             // 51
                                                                                                // 52
  var Middle = function () {                                                                    // 53
    this.constructor = Child;                                                                   // 54
  };                                                                                            // 55
                                                                                                // 56
  // hook up the proto chain                                                                    // 57
  Middle.prototype = Parent.prototype;                                                          // 58
  Child.prototype = new Middle;                                                                 // 59
  Child.__super__ = Parent.prototype;                                                           // 60
                                                                                                // 61
  // copy over the prototype props                                                              // 62
  if (_.isObject(props))                                                                        // 63
    _.extend(Child.prototype, props);                                                           // 64
                                                                                                // 65
  return Child;                                                                                 // 66
};                                                                                              // 67
                                                                                                // 68
/**                                                                                             // 69
 * Create a new constructor function that inherits from Parent and copy in the                  // 70
 * provided prototype properties.                                                               // 71
 *                                                                                              // 72
 * @param {Function} Parent The parent constructor function.                                    // 73
 * @param {Object} [props] Prototype properties to add to the child                             // 74
 */                                                                                             // 75
Iron.utils.extend = function (Parent, props) {                                                  // 76
  props = props || {};                                                                          // 77
                                                                                                // 78
  var ctor = function () {                                                                      // 79
    // automatically call the parent constructor if a new one                                   // 80
    // isn't provided.                                                                          // 81
    var constructor;                                                                            // 82
    if (_.has(props, 'constructor'))                                                            // 83
      constructor = props.constructor                                                           // 84
    else                                                                                        // 85
      constructor = ctor.__super__.constructor;                                                 // 86
                                                                                                // 87
    constructor.apply(this, arguments);                                                         // 88
  };                                                                                            // 89
                                                                                                // 90
  return Iron.utils.inherits(ctor, Parent, props);                                              // 91
};                                                                                              // 92
                                                                                                // 93
/**                                                                                             // 94
 * Either window in the browser or global in NodeJS.                                            // 95
 */                                                                                             // 96
Iron.utils.global = (function () {                                                              // 97
  return Meteor.isClient ? window : global;                                                     // 98
})();                                                                                           // 99
                                                                                                // 100
/**                                                                                             // 101
 * Ensure a given namespace exists and assign it to the given value or                          // 102
 * return the existing value.                                                                   // 103
 */                                                                                             // 104
Iron.utils.namespace = function (namespace, value) {                                            // 105
  var global = Iron.utils.global;                                                               // 106
  var parts;                                                                                    // 107
  var part;                                                                                     // 108
  var name;                                                                                     // 109
  var ptr;                                                                                      // 110
                                                                                                // 111
  Iron.utils.assert(typeof namespace === 'string', "namespace must be a string");               // 112
                                                                                                // 113
  parts = namespace.split('.');                                                                 // 114
  name = parts.pop();                                                                           // 115
  ptr = global;                                                                                 // 116
                                                                                                // 117
  for (var i = 0; i < parts.length; i++) {                                                      // 118
    part = parts[i];                                                                            // 119
    ptr = ptr[part] = ptr[part] || {};                                                          // 120
  }                                                                                             // 121
                                                                                                // 122
  if (arguments.length === 2) {                                                                 // 123
    ptr[name] = value;                                                                          // 124
    return value;                                                                               // 125
  } else {                                                                                      // 126
    return ptr[name];                                                                           // 127
  }                                                                                             // 128
};                                                                                              // 129
                                                                                                // 130
/**                                                                                             // 131
 * Returns the resolved value at the given namespace or the value itself if it's                // 132
 * not a string.                                                                                // 133
 *                                                                                              // 134
 * Example:                                                                                     // 135
 *                                                                                              // 136
 * var Iron = {};                                                                               // 137
 * Iron.foo = {};                                                                               // 138
 *                                                                                              // 139
 * var baz = Iron.foo.baz = {};                                                                 // 140
 * Iron.utils.resolve("Iron.foo.baz") === baz                                                   // 141
 */                                                                                             // 142
Iron.utils.resolve = function (nameOrValue) {                                                   // 143
  var global = Iron.utils.global;                                                               // 144
  var parts;                                                                                    // 145
  var ptr;                                                                                      // 146
                                                                                                // 147
  if (typeof nameOrValue === 'string') {                                                        // 148
    parts = nameOrValue.split('.');                                                             // 149
    ptr = global;                                                                               // 150
    for (var i = 0; i < parts.length; i++) {                                                    // 151
      ptr = ptr[parts[i]];                                                                      // 152
      if (!ptr)                                                                                 // 153
        return undefined;                                                                       // 154
    }                                                                                           // 155
  } else {                                                                                      // 156
    ptr = nameOrValue;                                                                          // 157
  }                                                                                             // 158
                                                                                                // 159
  // final position of ptr should be the resolved value                                         // 160
  return ptr;                                                                                   // 161
};                                                                                              // 162
                                                                                                // 163
/**                                                                                             // 164
 * Capitalize a string.                                                                         // 165
 */                                                                                             // 166
Iron.utils.capitalize = function (str) {                                                        // 167
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                // 168
};                                                                                              // 169
                                                                                                // 170
/**                                                                                             // 171
 * Convert a string to class case.                                                              // 172
 */                                                                                             // 173
Iron.utils.classCase = function (str) {                                                         // 174
  var re = /_|-|\.|\//;                                                                         // 175
                                                                                                // 176
  if (!str)                                                                                     // 177
    return '';                                                                                  // 178
                                                                                                // 179
  return _.map(str.split(re), function (word) {                                                 // 180
    return Iron.utils.capitalize(word);                                                         // 181
  }).join('');                                                                                  // 182
};                                                                                              // 183
                                                                                                // 184
/**                                                                                             // 185
 * Convert a string to camel case.                                                              // 186
 */                                                                                             // 187
Iron.utils.camelCase = function (str) {                                                         // 188
  var output = Iron.utils.classCase(str);                                                       // 189
  output = output.charAt(0).toLowerCase() + output.slice(1, output.length);                     // 190
  return output;                                                                                // 191
};                                                                                              // 192
                                                                                                // 193
/**                                                                                             // 194
 * deprecatation notice to the user which can be a string or object                             // 195
 * of the form:                                                                                 // 196
 *                                                                                              // 197
 * {                                                                                            // 198
 *  name: 'somePropertyOrMethod',                                                               // 199
 *  where: 'RouteController',                                                                   // 200
 *  instead: 'someOtherPropertyOrMethod',                                                       // 201
 *  message: ':name is deprecated. Please use :instead instead'                                 // 202
 * }                                                                                            // 203
 */                                                                                             // 204
Iron.utils.notifyDeprecated = function (info) {                                                 // 205
  var name;                                                                                     // 206
  var instead;                                                                                  // 207
  var message;                                                                                  // 208
  var where;                                                                                    // 209
  var defaultMessage = "[:where] ':name' is deprecated. Please use ':instead' instead.";        // 210
                                                                                                // 211
  if (_.isObject(info)) {                                                                       // 212
    name = info.name;                                                                           // 213
    instead = info.instead;                                                                     // 214
    message = info.message || defaultMessage;                                                   // 215
    where = info.where || 'IronRouter';                                                         // 216
  } else {                                                                                      // 217
    message = info;                                                                             // 218
    name = '';                                                                                  // 219
    instead = '';                                                                               // 220
    where = '';                                                                                 // 221
  }                                                                                             // 222
                                                                                                // 223
  if (typeof console !== 'undefined' && console.warn) {                                         // 224
    console.warn(                                                                               // 225
      '<deprecated> ' +                                                                         // 226
      message                                                                                   // 227
      .replace(':name', name)                                                                   // 228
      .replace(':instead', instead)                                                             // 229
      .replace(':where', where) +                                                               // 230
      ' ' +                                                                                     // 231
      (new Error).stack                                                                         // 232
    );                                                                                          // 233
  }                                                                                             // 234
};                                                                                              // 235
                                                                                                // 236
Iron.utils.withDeprecatedNotice = function (info, fn, thisArg) {                                // 237
  return function () {                                                                          // 238
    Utils.notifyDeprecated(info);                                                               // 239
    return fn && fn.apply(thisArg || this, arguments);                                          // 240
  };                                                                                            // 241
};                                                                                              // 242
                                                                                                // 243
// so we can do this:                                                                           // 244
//   getController: function () {                                                               // 245
//    ...                                                                                       // 246
//   }.deprecate({...})                                                                         // 247
Function.prototype.deprecate = function (info) {                                                // 248
  var fn = this;                                                                                // 249
  return Iron.utils.withDeprecatedNotice(info, fn);                                             // 250
};                                                                                              // 251
                                                                                                // 252
/**                                                                                             // 253
 * Returns a function that can be used to log debug messages for a given                        // 254
 * package.                                                                                     // 255
 */                                                                                             // 256
Iron.utils.debug = function (package) {                                                         // 257
  Iron.utils.assert(typeof package === 'string', "debug requires a package name");              // 258
                                                                                                // 259
  return function debug (/* args */) {                                                          // 260
    if (console && console.log && Iron.debug === true) {                                        // 261
      var msg = _.toArray(arguments).join(' ');                                                 // 262
      console.log("%c<" + package + "> %c" + msg, "color: #999;", "color: #000;");              // 263
    }                                                                                           // 264
  };                                                                                            // 265
};                                                                                              // 266
                                                                                                // 267
/*                                                                                              // 268
 * Meteor's version of this function is broke.                                                  // 269
 */                                                                                             // 270
Iron.utils.get = function (obj /*, arguments */) {                                              // 271
  for (var i = 1; i < arguments.length; i++) {                                                  // 272
    if (!obj || !(arguments[i] in obj))                                                         // 273
      return undefined;                                                                         // 274
    obj = obj[arguments[i]];                                                                    // 275
  }                                                                                             // 276
  return obj;                                                                                   // 277
};                                                                                              // 278
                                                                                                // 279
// make sure Iron ends up in the global namespace                                               // 280
Iron.utils.global.Iron = Iron;                                                                  // 281
                                                                                                // 282
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:core'] = {
  Iron: Iron
};

})();
