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
var Reload = Package.reload.Reload;
var _ = Package.underscore._;

/* Package-scope variables */
var Famono, _loadModule, _defineModule, _defineGlobal;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix:famono/requirejs_client.js                                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// The library contains all the dependencies, they are not initialized                                               // 1
var modules = {};                                                                                                    // 2
                                                                                                                     // 3
Famono = {};                                                                                                         // 4
                                                                                                                     // 5
var getModule = function(name, isDefining) {                                                                         // 6
  if (name) {                                                                                                        // 7
                                                                                                                     // 8
    var last = '/' + name.split('/').pop();                                                                          // 9
    // We either return the module or init an empty module for tracking                                              // 10
    return modules[name] || modules[name + '/index'] || modules[name + last] ||                                      // 11
      (modules[name] = { exports: { prototype: {} }, callbacks: [], loaded: (isDefining) ? false : null });          // 12
                                                                                                                     // 13
  } else {                                                                                                           // 14
    return {};                                                                                                       // 15
  }                                                                                                                  // 16
};                                                                                                                   // 17
                                                                                                                     // 18
/**                                                                                                                  // 19
 * @method _require                                                                                                  // 20
 * @param {String} name Name of module                                                                               // 21
 * @returns {Any} Exported data                                                                                      // 22
 * This function expects that any dependencies are all loaded                                                        // 23
 * This function will return the module instance or initialize the module                                            // 24
 */                                                                                                                  // 25
Famono.require = function(name, f) {                                                                                 // 26
  // one could do require([deps], function( /* args */ ) { })                                                        // 27
  if (typeof f == 'function')                                                                                        // 28
    return Famono.define(name, f);                                                                                   // 29
                                                                                                                     // 30
  // Get the module                                                                                                  // 31
  var module = getModule(name);                                                                                      // 32
  // Check that the module is loaded                                                                                 // 33
  if (module.loaded === true) {                                                                                      // 34
                                                                                                                     // 35
    // Check if the library is found                                                                                 // 36
    if (module.init) {                                                                                               // 37
      // If we are loaded and we dont have a function then return then                                               // 38
      // assume that we are already initialized and return exports                                                   // 39
      return module.exports;                                                                                         // 40
    } else {                                                                                                         // 41
                                                                                                                     // 42
      // Set init flag                                                                                               // 43
      module.init = true;                                                                                            // 44
                                                                                                                     // 45
      var moduleDefinitions = (typeof module.f == 'function') ? [{ f: module.f }] : module.f;                        // 46
      // This is the current format Famo.us uses / requireJs or commonJS                                             // 47
      for (var i = 0; i < moduleDefinitions.length; i++) {                                                           // 48
        // Helper                                                                                                    // 49
        var current = moduleDefinitions[i];                                                                          // 50
        // function call                                                                                             // 51
        if (typeof current.deps !== 'undefined') {                                                                   // 52
          // Amd?                                                                                                    // 53
          var deps = [];                                                                                             // 54
          for (var d = 0; d < current.deps.length; d++) {                                                            // 55
            if (!/^\.|^\//.test(current.deps[d]))                                                                    // 56
              deps.push(Famono.require(current.deps[d]));                                                            // 57
          }                                                                                                          // 58
          // Serve deps                                                                                              // 59
          try {                                                                                                      // 60
            var returnedModule = current.f.apply(current.f, deps);                                                   // 61
            // XXX: Should we somehow extend the module.exports with objects                                         // 62
            // returned?                                                                                             // 63
            if (_.isObject(returnedModule) && !_.isArray(returnedModule)) {                                          // 64
              _.extend(module.exports, returnedModule );                                                             // 65
            }                                                                                                        // 66
          }catch(err) {                                                                                              // 67
            console.warn('Famono: Could not load part of module "' + name + '" define(' + (d+1) + '), Error: ' + err.message, err.stack);
          }                                                                                                          // 69
        } else if (current.name) {                                                                                   // 70
          // noop                                                                                                    // 71
        } else {                                                                                                     // 72
          // commonJS                                                                                                // 73
          try {                                                                                                      // 74
            var returnedModule = current.f(Famono.require, {}, module);                                              // 75
            // Be able to return the module                                                                          // 76
            module.exports = returnedModule || module.exports;                                                       // 77
          } catch(err) {                                                                                             // 78
            console.error('Famono: Could not load module "' + name + '",', err.stack);                               // 79
                                                                                                                     // 80
          }                                                                                                          // 81
        }                                                                                                            // 82
      }                                                                                                              // 83
                                                                                                                     // 84
      // Clean up, help GC                                                                                           // 85
      module.f = null;                                                                                               // 86
                                                                                                                     // 87
                                                                                                                     // 88
      // Set the now required library                                                                                // 89
      modules[name] = module;                                                                                        // 90
                                                                                                                     // 91
      // We return the things we want to export                                                                      // 92
      return module.exports;                                                                                         // 93
                                                                                                                     // 94
    }                                                                                                                // 95
                                                                                                                     // 96
  } else {                                                                                                           // 97
    // The module is not defined                                                                                     // 98
    throw new Error('Famono: library "' + name + '" not defined');                                                   // 99
  }                                                                                                                  // 100
                                                                                                                     // 101
};                                                                                                                   // 102
                                                                                                                     // 103
/**                                                                                                                  // 104
 * @method _loadScript                                                                                               // 105
 * @param {String} libraryName Library to load                                                                       // 106
 * @param {Function} callback (err, libraryName)                                                                     // 107
 * This method loads javascript libraries                                                                            // 108
 */                                                                                                                  // 109
var _loadScript = function(libraryName, callback) {                                                                  // 110
  console.log('Famono lazyloading', libraryName);                                                                    // 111
  // Get pointer to the head tag                                                                                     // 112
  var head = document.getElementsByTagName('head').item(0);                                                          // 113
                                                                                                                     // 114
  // Create script element                                                                                           // 115
  var script = document.createElement('script');                                                                     // 116
                                                                                                                     // 117
  // Set the onload event                                                                                            // 118
  script.onload = function() {                                                                                       // 119
    callback(null, libraryName);                                                                                     // 120
  };                                                                                                                 // 121
                                                                                                                     // 122
  // Set the on error event                                                                                          // 123
  script.onerror = function(err) {                                                                                   // 124
    callback(err, libraryName);                                                                                      // 125
  };                                                                                                                 // 126
                                                                                                                     // 127
  // Set the type to js                                                                                              // 128
  script.type = 'text/javascript';                                                                                   // 129
                                                                                                                     // 130
  // Set src to module                                                                                               // 131
  script.src = '/lib/' + libraryName;                                                                                // 132
                                                                                                                     // 133
  // Inject the script tag                                                                                           // 134
  head.appendChild(script);                                                                                          // 135
};                                                                                                                   // 136
                                                                                                                     // 137
/**                                                                                                                  // 138
 * @method loadModuleDefinition                                                                                      // 139
 * @param {String} name module to load                                                                               // 140
 * @param {Function} callback() is called when module is defined                                                     // 141
 * This function load module definitions                                                                             // 142
 */                                                                                                                  // 143
var loadModuleDefinition = function(name, f) {                                                                       // 144
  // Make sure the callback is set                                                                                   // 145
  if (typeof f !== 'function')                                                                                       // 146
    throw new Error('Famono: loadModuleDefinition require a callback as function');                                  // 147
  // Get the module                                                                                                  // 148
  var module = getModule(name);                                                                                      // 149
  // Check if module is loaded                                                                                       // 150
  if (module.loaded === true) {                                                                                      // 151
    // We callback instantly                                                                                         // 152
    f();                                                                                                             // 153
  } else {                                                                                                           // 154
    // Add the function                                                                                              // 155
    module.callbacks.push(f);                                                                                        // 156
    // load module...                                                                                                // 157
    if (module.loaded === null) {                                                                                    // 158
      // Set the module to be loading                                                                                // 159
      module.loaded = false;                                                                                         // 160
      // We are not loading the module so we start loading                                                           // 161
      _loadScript(name, function(err) {                                                                              // 162
        if (err) {                                                                                                   // 163
          // On error we reset                                                                                       // 164
          // XXX: should we start a retry algorithm? eg. 5 attepmts then final                                       // 165
          // failure?                                                                                                // 166
          module.loaded = null;                                                                                      // 167
        }                                                                                                            // 168
        // We dont have to do anything else - the module will trigger loaded                                         // 169
      });                                                                                                            // 170
    }                                                                                                                // 171
  }                                                                                                                  // 172
};                                                                                                                   // 173
                                                                                                                     // 174
/**                                                                                                                  // 175
 * @method moduleDefineDone                                                                                          // 176
 * @param {String} name module to mark as defined                                                                    // 177
 * @param {Function} f The module function                                                                           // 178
 * This function marks modules as defined                                                                            // 179
 */                                                                                                                  // 180
var moduleDefineDone = function(name, f) {                                                                           // 181
  if (name) {                                                                                                        // 182
    var module = getModule(name);                                                                                    // 183
    // Set loaded flag                                                                                               // 184
    module.loaded = true;                                                                                            // 185
    // Register the library                                                                                          // 186
    module.f = f;                                                                                                    // 187
    // Call back all listeners                                                                                       // 188
    while (module.callbacks.length) {                                                                                // 189
      // We pop out the listener callbacks                                                                           // 190
      module.callbacks.pop()(null, name);                                                                            // 191
    }                                                                                                                // 192
  }                                                                                                                  // 193
};                                                                                                                   // 194
                                                                                                                     // 195
/**                                                                                                                  // 196
 * @method loadLibraries                                                                                             // 197
 * @param {Array} deps List of dependencies to load                                                                  // 198
 * @param {Function} callback This function is called when deps are loaded                                           // 199
 * This function makes sure only to run callback when all dependecies are loaded                                     // 200
 */                                                                                                                  // 201
var loadLibraries = function(deps, callback) {                                                                       // 202
  // Expected callbacks                                                                                              // 203
  var count = deps && deps.length;                                                                                   // 204
  // Load dependencies                                                                                               // 205
  if (count) {                                                                                                       // 206
    // Load each dep                                                                                                 // 207
    for (var i = 0; i < deps.length; i++) {                                                                          // 208
      // We wait until the submodules have loaded                                                                    // 209
      loadModuleDefinition(deps[i], function() {                                                                     // 210
        if (--count === 0) callback(moduleDefineDone);                                                               // 211
      });                                                                                                            // 212
                                                                                                                     // 213
    }                                                                                                                // 214
  } else {                                                                                                           // 215
    // Call back instantly if we dont have any dependencies                                                          // 216
    callback(moduleDefineDone);                                                                                      // 217
  }                                                                                                                  // 218
};                                                                                                                   // 219
                                                                                                                     // 220
/**                                                                                                                  // 221
 * @method _loadModule                                                                                               // 222
 * @param {Array} deps List of dependencies to load                                                                  // 223
 * @param {Function} f This function is called when deps are loaded                                                  // 224
 * Dependencies are passed on to function f as parametres                                                            // 225
 */                                                                                                                  // 226
_loadModule = function(deps, f) {                                                                                    // 227
  //throw new Error('Not implemented');                                                                              // 228
  // Check for function                                                                                              // 229
  if (typeof f !== 'function')                                                                                       // 230
    throw new Error('Famono: define require a function');                                                            // 231
  // Convert strings to array of string                                                                              // 232
  if (deps === '' + deps) deps = [deps];                                                                             // 233
  // XXX: deps can be a string or an array of strings                                                                // 234
  // 1. ensure all deps are loaded by checking modules[]                                                             // 235
  loadLibraries(deps, function(done) {                                                                               // 236
    // 2. ensure all deps are initialized by checking modules[]                                                      // 237
    var result = [];                                                                                                 // 238
    // Init the dependecies                                                                                          // 239
    for (var i = 0; i < deps.length; i++) result.push(Famono.require(deps[i]));                                      // 240
    // 3. run f                                                                                                      // 241
    f.apply({}, result);                                                                                             // 242
  });                                                                                                                // 243
};                                                                                                                   // 244
                                                                                                                     // 245
/**                                                                                                                  // 246
 * @method _defineModule                                                                                             // 247
 * @param {String} name Name of module                                                                               // 248
 * @param {Array} deps List of dependencies to load                                                                  // 249
 * @param {Function|array of functions} f The module                                                                 // 250
 */                                                                                                                  // 251
_defineModule = function(name, deps, f) {                                                                            // 252
  // Get module                                                                                                      // 253
  var module = getModule(name, true);                                                                                // 254
  // Check for function                                                                                              // 255
  if (typeof f == 'undefined' || (typeof f !== 'function' && !f.length))                                             // 256
    throw new Error('Famono: library "' + name + '" require a function');                                            // 257
                                                                                                                     // 258
  // XXX: TODO we could be called multiple times, we want to keep the module                                         // 259
  // export intact but we may have to stack functions in f instead of having one                                     // 260
  // module definition.                                                                                              // 261
  // We currently initialize the module using require so the require statement                                       // 262
  // should be the one to call all the functions                                                                     // 263
  // Check library                                                                                                   // 264
  if (module.loaded === true)                                                                                        // 265
    throw new Error('Famono: library "' + name + '" already defined');                                               // 266
  // 1. Make sure the deps are loaded                                                                                // 267
  loadLibraries(deps, function(done) {                                                                               // 268
    // Mark this module as loaded                                                                                    // 269
    done(name, f);                                                                                                   // 270
    // Check if this is a global?                                                                                    // 271
    if (name === null) {                                                                                             // 272
      var result = f(Famono.require, {}, { exports: window });                                                       // 273
      // If object is returned then extend the window                                                                // 274
      if (_.isObject(result) && !_.isArray(result))                                                                  // 275
        _.extend(window, result);                                                                                    // 276
    }                                                                                                                // 277
  });                                                                                                                // 278
}                                                                                                                    // 279
                                                                                                                     // 280
/**                                                                                                                  // 281
 * @method _defineGlobal                                                                                             // 282
 * @param {String} name Name of module                                                                               // 283
 * @param {Array} deps List of dependencies to load                                                                  // 284
 * @param {Function} f The module                                                                                    // 285
 */                                                                                                                  // 286
_defineGlobal = function(f) {                                                                                        // 287
  // Define a global thing...                                                                                        // 288
  Famono.define(null, [], f);                                                                                        // 289
};                                                                                                                   // 290
                                                                                                                     // 291
var _parseDefineArguments = function(name, argsInput) {                                                              // 292
  var result = {};                                                                                                   // 293
                                                                                                                     // 294
  // Convert into array                                                                                              // 295
  var args = Array.prototype.slice.call(argsInput);                                                                  // 296
                                                                                                                     // 297
  // Get the function                                                                                                // 298
  result.f = args.pop();                                                                                             // 299
                                                                                                                     // 300
  // Check that we got a function                                                                                    // 301
  if (typeof result.f !== 'function') {                                                                              // 302
                                                                                                                     // 303
    // #87 - The leaflet case misuses the define by setting define(object);                                          // 304
    // XXX:                                                                                                          // 305
    // At the moment this is limited to objects - but could this be used more                                        // 306
    // widely? - we could never export functions this way because the normal                                         // 307
    // api expects a definition function, not the actual exported function...                                        // 308
    if (typeof result.f == 'object') {                                                                               // 309
                                                                                                                     // 310
      // We have been handed the exported object                                                                     // 311
      var exported = result.f;                                                                                       // 312
      // Convert into a proper export function for define                                                            // 313
      result.f = function(require, exports, module) { module.exports = exported; };                                  // 314
                                                                                                                     // 315
    } else {                                                                                                         // 316
                                                                                                                     // 317
      // This is unsupported usage of the define api                                                                 // 318
      throw new Error('Famono: ' + name + ' requires function or object');                                           // 319
    }                                                                                                                // 320
  }                                                                                                                  // 321
                                                                                                                     // 322
  // If first argument is string then set it and get on                                                              // 323
  if (args[0] === ''+args[0] || args[0] === null) result.name = args.shift();                                        // 324
                                                                                                                     // 325
  // If anything left it should be deps definition?                                                                  // 326
  if (args.length) result.deps = args.shift();                                                                       // 327
                                                                                                                     // 328
  if (result.deps && typeof result.deps.length == 'undefined')                                                       // 329
    throw new Error('Famono: ' + name + ' expected array of dependencies but found ' + (typeof result.deps));        // 330
                                                                                                                     // 331
  // If name is set but no deps then init empty deps array                                                           // 332
  if (typeof result.name !== 'undefined' && !result.deps) result.deps = [];                                          // 333
                                                                                                                     // 334
  // We should not have more than 3 arguments                                                                        // 335
  if (args.length) {                                                                                                 // 336
    // XXX: remove when issues resolved                                                                              // 337
    console.warn('Famono: ' + name + ' debug (Report to raix issue #55):', argsInput, 'Def:', result, 'Left', args); // 338
                                                                                                                     // 339
    throw new Error('Famono: ' + name + ' passed too many arguments');                                               // 340
  }                                                                                                                  // 341
                                                                                                                     // 342
  // Return parsed arguments { name, deps, f }                                                                       // 343
  return result;                                                                                                     // 344
};                                                                                                                   // 345
                                                                                                                     // 346
/**                                                                                                                  // 347
 * @method define                                                                                                    // 348
 * @param {String} [name] Name of module                                                                             // 349
 * @param {Array} deps List of dependencies to load                                                                  // 350
 * @param {Function} f The module                                                                                    // 351
 *                                                                                                                   // 352
 * > If no name is passed then deps are passed to f as arguments                                                     // 353
 */                                                                                                                  // 354
Famono.define = function(/* name, deps, f or deps, f */) {                                                           // 355
  var def = _parseDefineArguments('define', arguments);                                                              // 356
                                                                                                                     // 357
  if (typeof def.name === 'undefined' && !def.deps && def.f) {                                                       // 358
    // Return the load module define(function() {})                                                                  // 359
    return _defineGlobal(def.f);                                                                                     // 360
                                                                                                                     // 361
    // define([deps, ... , deps], function() {});                                                                    // 362
  } else if (typeof def.name === 'undefined'  && def.deps && def.f) {                                                // 363
    // Return the load module                                                                                        // 364
    return _loadModule(def.deps, def.f);                                                                             // 365
                                                                                                                     // 366
    // define('name', [deps, ... , deps], function() {});                                                            // 367
  } else if (typeof def.name !== 'undefined' && def.deps && def.f) {                                                 // 368
    // Return the define module                                                                                      // 369
    return _defineModule(def.name, def.deps, def.f);                                                                 // 370
                                                                                                                     // 371
    // Invalid arguments                                                                                             // 372
  } else {                                                                                                           // 373
    throw new Error('define got invalid number of arguments');                                                       // 374
  }                                                                                                                  // 375
};                                                                                                                   // 376
                                                                                                                     // 377
// Simulate support?                                                                                                 // 378
Famono.define.amd = true;                                                                                            // 379
                                                                                                                     // 380
// Noop module definition                                                                                            // 381
var noopModuleDefinition = function() {};                                                                            // 382
                                                                                                                     // 383
/* @method scope                                                                                                     // 384
 * @param {function} libraryModule The function setting the define/require scope                                     // 385
 */                                                                                                                  // 386
Famono.scope = function(/* name [, deps] , libraryModule */) {                                                       // 387
  var scope = _parseDefineArguments('Famono.scope', arguments);                                                      // 388
  try {                                                                                                              // 389
    var moduleDefinitions = [];                                                                                      // 390
    var scopedDefine = function(/* arguments */) {                                                                   // 391
      var def = _parseDefineArguments('define', arguments);                                                          // 392
                                                                                                                     // 393
      if (typeof def.name !== 'undefined') {                                                                         // 394
        // Load and define the module                                                                                // 395
        _defineModule(def.name, def.deps, def.f);                                                                    // 396
      } else {                                                                                                       // 397
        // Stack the definitions                                                                                     // 398
        moduleDefinitions.push(def);                                                                                 // 399
      }                                                                                                              // 400
    };                                                                                                               // 401
                                                                                                                     // 402
    // Simulate support?                                                                                             // 403
    scopedDefine.amd = true;                                                                                         // 404
                                                                                                                     // 405
    // Define the module                                                                                             // 406
    scope.f.apply(window, [Famono.require, scopedDefine]);                                                           // 407
                                                                                                                     // 408
    // If the module have no definitions we cheat at hand it one                                                     // 409
    // there could be valid reasons for a module to have no definition.                                              // 410
    // eg. if defines in the module define new modules.                                                              // 411
    if (!moduleDefinitions.length) moduleDefinitions = noopModuleDefinition;                                         // 412
                                                                                                                     // 413
    // Load and define the module                                                                                    // 414
    _defineModule(scope.name, scope.deps, moduleDefinitions);                                                        // 415
  } catch(err) {                                                                                                     // 416
    // XXX: Warn for now?                                                                                            // 417
    // console.log('ERROR:', scope.name, scope.deps);                                                                // 418
    console.warn(err.message);                                                                                       // 419
  }                                                                                                                  // 420
};                                                                                                                   // 421
                                                                                                                     // 422
// Add as globals - This part is deprecating...                                                                      // 423
if (typeof window.define === 'undefined') window.define = Famono.define;                                             // 424
if (typeof window.require === 'undefined') window.require = Famono.require;                                          // 425
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:famono'] = {
  Famono: Famono
};

})();
