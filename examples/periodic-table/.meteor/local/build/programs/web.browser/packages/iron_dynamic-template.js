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
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var _ = Package.underscore._;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Template = Package.templating.Template;
var Random = Package.random.Random;
var Iron = Package['iron:core'].Iron;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var DynamicTemplate;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/version_conflict_error.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
if (Package['cmather:iron-dynamic-template']) {                                                                   // 1
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
  ");                                                                                                             // 17
                                                                                                                  // 18
}                                                                                                                 // 19
                                                                                                                  // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/template.dynamic_template.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
Template.__checkName("__DynamicTemplateError__");                                                                 // 2
Template["__DynamicTemplateError__"] = new Template("Template.__DynamicTemplateError__", (function() {            // 3
  var view = this;                                                                                                // 4
  return HTML.DIV({                                                                                               // 5
    style: "margin: 0 auto; color: red;"                                                                          // 6
  }, "\n    ", Blaze.View(function() {                                                                            // 7
    return Spacebars.mustache(view.lookup("msg"));                                                                // 8
  }), "\n  ");                                                                                                    // 9
}));                                                                                                              // 10
                                                                                                                  // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/dynamic_template.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var debug = Iron.utils.debug('iron:dynamic-template');                                                            // 4
var assert = Iron.utils.assert;                                                                                   // 5
var get = Iron.utils.get;                                                                                         // 6
var camelCase = Iron.utils.camelCase;                                                                             // 7
                                                                                                                  // 8
/*****************************************************************************/                                   // 9
/* Private */                                                                                                     // 10
/*****************************************************************************/                                   // 11
var typeOf = function (value) {                                                                                   // 12
  return Object.prototype.toString.call(value);                                                                   // 13
};                                                                                                                // 14
                                                                                                                  // 15
/*****************************************************************************/                                   // 16
/* DynamicTemplate */                                                                                             // 17
/*****************************************************************************/                                   // 18
                                                                                                                  // 19
/**                                                                                                               // 20
 * Render a component to the page whose template and data context can change                                      // 21
 * dynamically, either from code or from helpers.                                                                 // 22
 *                                                                                                                // 23
 */                                                                                                               // 24
DynamicTemplate = function (options) {                                                                            // 25
  this._id = Random.id();                                                                                         // 26
  this.options = options = options || {};                                                                         // 27
  this._template = options.template;                                                                              // 28
  this._defaultTemplate = options.defaultTemplate;                                                                // 29
  this._content = options.content;                                                                                // 30
  this._data = options.data;                                                                                      // 31
  this._templateDep = new Tracker.Dependency;                                                                     // 32
  this._dataDep = new Tracker.Dependency;                                                                         // 33
                                                                                                                  // 34
  this._lookupHostDep = new Tracker.Dependency;                                                                   // 35
  this._lookupHostValue = null;                                                                                   // 36
                                                                                                                  // 37
  this._hooks = {};                                                                                               // 38
  this._eventMap = null;                                                                                          // 39
  this._eventHandles = null;                                                                                      // 40
  this._eventThisArg = null;                                                                                      // 41
  this.name = options.name || this.constructor.prototype.name || 'DynamicTemplate';                               // 42
                                                                                                                  // 43
  // has the Blaze.View been created?                                                                             // 44
  this.isCreated = false;                                                                                         // 45
                                                                                                                  // 46
  // has the Blaze.View been destroyed and not created again?                                                     // 47
  this.isDestroyed = false;                                                                                       // 48
};                                                                                                                // 49
                                                                                                                  // 50
/**                                                                                                               // 51
 * Get or set the template.                                                                                       // 52
 */                                                                                                               // 53
DynamicTemplate.prototype.template = function (value) {                                                           // 54
  if (arguments.length === 1 && value !== this._template) {                                                       // 55
    this._template = value;                                                                                       // 56
    this._templateDep.changed();                                                                                  // 57
    return;                                                                                                       // 58
  }                                                                                                               // 59
                                                                                                                  // 60
  if (arguments.length > 0)                                                                                       // 61
    return;                                                                                                       // 62
                                                                                                                  // 63
  this._templateDep.depend();                                                                                     // 64
                                                                                                                  // 65
  // do we have a template?                                                                                       // 66
  if (this._template)                                                                                             // 67
    return (typeof this._template === 'function') ? this._template() : this._template;                            // 68
                                                                                                                  // 69
  // no template? ok let's see if we have a default one set                                                       // 70
  if (this._defaultTemplate)                                                                                      // 71
    return (typeof this._defaultTemplate === 'function') ? this._defaultTemplate() : this._defaultTemplate;       // 72
};                                                                                                                // 73
                                                                                                                  // 74
/**                                                                                                               // 75
 * Get or set the default template.                                                                               // 76
 *                                                                                                                // 77
 * This function does not change any dependencies.                                                                // 78
 */                                                                                                               // 79
DynamicTemplate.prototype.defaultTemplate = function (value) {                                                    // 80
  if (arguments.length === 1)                                                                                     // 81
    this._defaultTemplate = value;                                                                                // 82
  else                                                                                                            // 83
    return this._defaultTemplate;                                                                                 // 84
};                                                                                                                // 85
                                                                                                                  // 86
/**                                                                                                               // 87
 * Clear the template and data contexts.                                                                          // 88
 */                                                                                                               // 89
DynamicTemplate.prototype.clear = function () {                                                                   // 90
  //XXX do we need to clear dependencies here too?                                                                // 91
  this._template = undefined;                                                                                     // 92
  this._data = undefined;                                                                                         // 93
  this._templateDep.changed();                                                                                    // 94
};                                                                                                                // 95
                                                                                                                  // 96
/**                                                                                                               // 97
 * Get or set the data context.                                                                                   // 98
 */                                                                                                               // 99
DynamicTemplate.prototype.data = function (value) {                                                               // 100
  if (arguments.length === 1 && value !== this._data) {                                                           // 101
    this._data = value;                                                                                           // 102
    this._dataDep.changed();                                                                                      // 103
    return;                                                                                                       // 104
  }                                                                                                               // 105
                                                                                                                  // 106
  this._dataDep.depend();                                                                                         // 107
  return typeof this._data === 'function' ? this._data() : this._data;                                            // 108
};                                                                                                                // 109
                                                                                                                  // 110
/**                                                                                                               // 111
 * Create the view if it hasn't been created yet.                                                                 // 112
 */                                                                                                               // 113
DynamicTemplate.prototype.create = function (options) {                                                           // 114
  var self = this;                                                                                                // 115
                                                                                                                  // 116
  if (this.isCreated) {                                                                                           // 117
    throw new Error("DynamicTemplate view is already created");                                                   // 118
  }                                                                                                               // 119
                                                                                                                  // 120
  this.isCreated = true;                                                                                          // 121
  this.isDestroyed = false;                                                                                       // 122
                                                                                                                  // 123
  var templateVar = ReactiveVar(null);                                                                            // 124
                                                                                                                  // 125
  var view = Blaze.View('DynamicTemplate', function () {                                                          // 126
    var thisView = this;                                                                                          // 127
                                                                                                                  // 128
    // create the template dependency here because we need the entire                                             // 129
    // dynamic template to re-render if the template changes, including                                           // 130
    // the Blaze.With view.                                                                                       // 131
    var template = templateVar.get();                                                                             // 132
                                                                                                                  // 133
    return Blaze.With(function () {                                                                               // 134
      // NOTE: This will rerun anytime the data function invalidates this                                         // 135
      // computation OR if created from an inclusion helper (see note below) any                                  // 136
      // time any of the argument functions invlidate the computation. For                                        // 137
      // example, when the template changes this function will rerun also. But                                    // 138
      // it's probably generally ok. The more serious use case is to not                                          // 139
      // re-render the entire template every time the data context changes.                                       // 140
      var result = self.data();                                                                                   // 141
                                                                                                                  // 142
      if (typeof result !== 'undefined')                                                                          // 143
        // looks like data was set directly on this dynamic template                                              // 144
        return result;                                                                                            // 145
      else                                                                                                        // 146
        // return the first parent data context that is not inclusion arguments                                   // 147
        return DynamicTemplate.getParentDataContext(thisView);                                                    // 148
    }, function () {                                                                                              // 149
      return self.renderView(template);                                                                           // 150
    });                                                                                                           // 151
  });                                                                                                             // 152
                                                                                                                  // 153
  view.onViewCreated(function () {                                                                                // 154
    this.autorun(function () {                                                                                    // 155
      templateVar.set(self.template());                                                                           // 156
    });                                                                                                           // 157
  });                                                                                                             // 158
                                                                                                                  // 159
  // wire up the view lifecycle callbacks                                                                         // 160
  _.each(['onViewCreated', 'onViewReady', '_onViewRendered', 'onViewDestroyed'], function (hook) {                // 161
    view[hook](function () {                                                                                      // 162
      // "this" is the view instance                                                                              // 163
      self._runHooks(hook, this);                                                                                 // 164
    });                                                                                                           // 165
  });                                                                                                             // 166
                                                                                                                  // 167
  view._onViewRendered(function () {                                                                              // 168
    // avoid inserting the view twice by accident.                                                                // 169
    self.isInserted = true;                                                                                       // 170
                                                                                                                  // 171
    if (view.renderCount !== 1)                                                                                   // 172
      return;                                                                                                     // 173
                                                                                                                  // 174
    self._attachEvents();                                                                                         // 175
  });                                                                                                             // 176
                                                                                                                  // 177
  view.onViewDestroyed(function () {                                                                              // 178
    // clean up the event handlers if                                                                             // 179
    // the view is destroyed                                                                                      // 180
    self._detachEvents();                                                                                         // 181
  });                                                                                                             // 182
                                                                                                                  // 183
  view._templateInstance = new Blaze.TemplateInstance(view);                                                      // 184
  view.templateInstance = function () {                                                                           // 185
    // Update data, firstNode, and lastNode, and return the TemplateInstance                                      // 186
    // object.                                                                                                    // 187
    var inst = view._templateInstance;                                                                            // 188
                                                                                                                  // 189
    inst.data = Blaze.getData(view);                                                                              // 190
                                                                                                                  // 191
    if (view._domrange && !view.isDestroyed) {                                                                    // 192
      inst.firstNode = view._domrange.firstNode();                                                                // 193
      inst.lastNode = view._domrange.lastNode();                                                                  // 194
    } else {                                                                                                      // 195
      // on 'created' or 'destroyed' callbacks we don't have a DomRange                                           // 196
      inst.firstNode = null;                                                                                      // 197
      inst.lastNode = null;                                                                                       // 198
    }                                                                                                             // 199
                                                                                                                  // 200
    return inst;                                                                                                  // 201
  };                                                                                                              // 202
                                                                                                                  // 203
  this.view = view;                                                                                               // 204
  view.__dynamicTemplate__ = this;                                                                                // 205
  view.name = this.name;                                                                                          // 206
  return view;                                                                                                    // 207
};                                                                                                                // 208
                                                                                                                  // 209
DynamicTemplate.prototype.renderView = function (template) {                                                      // 210
  var self = this;                                                                                                // 211
                                                                                                                  // 212
  // NOTE: When DynamicTemplate is used from a template inclusion helper                                          // 213
  // like this {{> DynamicTemplate template=getTemplate data=getData}} the                                        // 214
  // function below will rerun any time the getData function invalidates the                                      // 215
  // argument data computation.                                                                                   // 216
  var tmpl = null;                                                                                                // 217
                                                                                                                  // 218
  // is it a template name like "MyTemplate"?                                                                     // 219
  if (typeof template === 'string') {                                                                             // 220
    tmpl = Template[template];                                                                                    // 221
                                                                                                                  // 222
    if (!tmpl)                                                                                                    // 223
      // as a fallback double check the user didn't actually define                                               // 224
      // a camelCase version of the template.                                                                     // 225
      tmpl = Template[camelCase(template)];                                                                       // 226
                                                                                                                  // 227
    if (!tmpl) {                                                                                                  // 228
      tmpl = Blaze.With({                                                                                         // 229
        msg: "Couldn't find a template named " + JSON.stringify(template) + " or " + JSON.stringify(camelCase(template))+ ". Are you sure you defined it?"
      }, function () {                                                                                            // 231
        return Template.__DynamicTemplateError__;                                                                 // 232
      });                                                                                                         // 233
    }                                                                                                             // 234
  } else if (typeOf(template) === '[object Object]') {                                                            // 235
    // or maybe a view already?                                                                                   // 236
    tmpl = template;                                                                                              // 237
  } else if (typeof self._content !== 'undefined') {                                                              // 238
    // or maybe its block content like                                                                            // 239
    // {{#DynamicTemplate}}                                                                                       // 240
    //  Some block                                                                                                // 241
    // {{/DynamicTemplate}}                                                                                       // 242
    tmpl = self._content;                                                                                         // 243
  }                                                                                                               // 244
                                                                                                                  // 245
  return tmpl;                                                                                                    // 246
};                                                                                                                // 247
                                                                                                                  // 248
/**                                                                                                               // 249
 * Destroy the dynamic template, also destroying the view if it exists.                                           // 250
 */                                                                                                               // 251
DynamicTemplate.prototype.destroy = function () {                                                                 // 252
  if (this.isCreated) {                                                                                           // 253
    Blaze.remove(this.view);                                                                                      // 254
    this.view = null;                                                                                             // 255
    this.isDestroyed = true;                                                                                      // 256
    this.isCreated = false;                                                                                       // 257
  }                                                                                                               // 258
};                                                                                                                // 259
                                                                                                                  // 260
/**                                                                                                               // 261
 * View lifecycle hooks.                                                                                          // 262
 */                                                                                                               // 263
_.each(['onViewCreated', 'onViewReady', '_onViewRendered', 'onViewDestroyed'], function (hook) {                  // 264
  DynamicTemplate.prototype[hook] = function (cb) {                                                               // 265
    var hooks = this._hooks[hook] = this._hooks[hook] || [];                                                      // 266
    hooks.push(cb);                                                                                               // 267
    return this;                                                                                                  // 268
  };                                                                                                              // 269
});                                                                                                               // 270
                                                                                                                  // 271
DynamicTemplate.prototype._runHooks = function (name, view) {                                                     // 272
  var hooks = this._hooks[name] || [];                                                                            // 273
  var hook;                                                                                                       // 274
                                                                                                                  // 275
  for (var i = 0; i < hooks.length; i++) {                                                                        // 276
    hook = hooks[i];                                                                                              // 277
    // keep the "thisArg" pointing to the view, but make the first parameter to                                   // 278
    // the callback teh dynamic template instance.                                                                // 279
    hook.call(view, this);                                                                                        // 280
  }                                                                                                               // 281
};                                                                                                                // 282
                                                                                                                  // 283
DynamicTemplate.prototype.events = function (eventMap, thisInHandler) {                                           // 284
  var self = this;                                                                                                // 285
                                                                                                                  // 286
  this._detachEvents();                                                                                           // 287
  this._eventThisArg = thisInHandler;                                                                             // 288
                                                                                                                  // 289
  var boundMap = this._eventMap = {};                                                                             // 290
                                                                                                                  // 291
  for (var key in eventMap) {                                                                                     // 292
    boundMap[key] = (function (key, handler) {                                                                    // 293
      return function (e) {                                                                                       // 294
        var data = Blaze.getData(e.currentTarget);                                                                // 295
        if (data == null) data = {};                                                                              // 296
        var tmplInstance = self.view.templateInstance();                                                          // 297
        return handler.call(thisInHandler || this, e, tmplInstance, data);                                        // 298
      }                                                                                                           // 299
    })(key, eventMap[key]);                                                                                       // 300
  }                                                                                                               // 301
                                                                                                                  // 302
  this._attachEvents();                                                                                           // 303
};                                                                                                                // 304
                                                                                                                  // 305
DynamicTemplate.prototype._attachEvents = function () {                                                           // 306
  var self = this;                                                                                                // 307
  var thisArg = self._eventThisArg;                                                                               // 308
  var boundMap = self._eventMap;                                                                                  // 309
  var view = self.view;                                                                                           // 310
  var handles = self._eventHandles;                                                                               // 311
                                                                                                                  // 312
  if (!view)                                                                                                      // 313
    return;                                                                                                       // 314
                                                                                                                  // 315
  var domrange = view._domrange;                                                                                  // 316
                                                                                                                  // 317
  if (!domrange)                                                                                                  // 318
    throw new Error("no domrange");                                                                               // 319
                                                                                                                  // 320
  var attach = function (range, element) {                                                                        // 321
    _.each(boundMap, function (handler, spec) {                                                                   // 322
      var clauses = spec.split(/,\s+/);                                                                           // 323
      // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']                                          // 324
      _.each(clauses, function (clause) {                                                                         // 325
        var parts = clause.split(/\s+/);                                                                          // 326
        if (parts.length === 0)                                                                                   // 327
          return;                                                                                                 // 328
                                                                                                                  // 329
        var newEvents = parts.shift();                                                                            // 330
        var selector = parts.join(' ');                                                                           // 331
        handles.push(Blaze._EventSupport.listen(                                                                  // 332
          element, newEvents, selector,                                                                           // 333
          function (evt) {                                                                                        // 334
            if (! range.containsElement(evt.currentTarget))                                                       // 335
              return null;                                                                                        // 336
            var handlerThis = self._eventThisArg || this;                                                         // 337
            var handlerArgs = arguments;                                                                          // 338
            //XXX which view should this be? What if the event happened                                           // 339
            //somwhere down the hierarchy?                                                                        // 340
            return Blaze._withCurrentView(view, function () {                                                     // 341
              return handler.apply(handlerThis, handlerArgs);                                                     // 342
            });                                                                                                   // 343
          },                                                                                                      // 344
          range, function (r) {                                                                                   // 345
            return r.parentRange;                                                                                 // 346
          }));                                                                                                    // 347
      });                                                                                                         // 348
    });                                                                                                           // 349
  };                                                                                                              // 350
                                                                                                                  // 351
  if (domrange.attached)                                                                                          // 352
    attach(domrange, domrange.parentElement);                                                                     // 353
  else                                                                                                            // 354
    domrange.onAttached(attach);                                                                                  // 355
};                                                                                                                // 356
                                                                                                                  // 357
DynamicTemplate.prototype._detachEvents = function () {                                                           // 358
  _.each(this._eventHandles, function (h) { h.stop(); });                                                         // 359
  this._eventHandles = [];                                                                                        // 360
};                                                                                                                // 361
                                                                                                                  // 362
var attachEventMaps = function (range, element, eventMap, thisInHandler) {                                        // 363
  _.each(eventMap, function (handler, spec) {                                                                     // 364
    var clauses = spec.split(/,\s+/);                                                                             // 365
    // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']                                            // 366
    _.each(clauses, function (clause) {                                                                           // 367
      var parts = clause.split(/\s+/);                                                                            // 368
      if (parts.length === 0)                                                                                     // 369
        return;                                                                                                   // 370
                                                                                                                  // 371
      var newEvents = parts.shift();                                                                              // 372
      var selector = parts.join(' ');                                                                             // 373
      handles.push(Blaze._EventSupport.listen(                                                                    // 374
        element, newEvents, selector,                                                                             // 375
        function (evt) {                                                                                          // 376
          if (! range.containsElement(evt.currentTarget))                                                         // 377
            return null;                                                                                          // 378
          var handlerThis = thisInHandler || this;                                                                // 379
          var handlerArgs = arguments;                                                                            // 380
          return Blaze._withCurrentView(view, function () {                                                       // 381
            return handler.apply(handlerThis, handlerArgs);                                                       // 382
          });                                                                                                     // 383
        },                                                                                                        // 384
        range, function (r) {                                                                                     // 385
          return r.parentRange;                                                                                   // 386
        }));                                                                                                      // 387
    });                                                                                                           // 388
  });                                                                                                             // 389
};                                                                                                                // 390
                                                                                                                  // 391
/**                                                                                                               // 392
 * Insert the Layout view into the dom.                                                                           // 393
 */                                                                                                               // 394
DynamicTemplate.prototype.insert = function (options) {                                                           // 395
  options = options || {};                                                                                        // 396
                                                                                                                  // 397
  if (this.isInserted)                                                                                            // 398
    return;                                                                                                       // 399
  this.isInserted = true;                                                                                         // 400
                                                                                                                  // 401
  var el = options.el || document.body;                                                                           // 402
  var $el = $(el);                                                                                                // 403
                                                                                                                  // 404
  if ($el.length === 0)                                                                                           // 405
    throw new Error("No element to insert layout into. Is your element defined? Try a Meteor.startup callback."); // 406
                                                                                                                  // 407
  if (!this.view)                                                                                                 // 408
    this.create(options);                                                                                         // 409
                                                                                                                  // 410
  Blaze.render(this.view, $el[0], options.nextNode, options.parentView);                                          // 411
                                                                                                                  // 412
  return this;                                                                                                    // 413
};                                                                                                                // 414
                                                                                                                  // 415
/**                                                                                                               // 416
 * Reactively return the value of the current lookup host or null if there                                        // 417
 * is no lookup host.                                                                                             // 418
 */                                                                                                               // 419
DynamicTemplate.prototype._getLookupHost = function () {                                                          // 420
  // XXX this is called from the Blaze overrides so we can't create a dep                                         // 421
  // here for every single lookup. Will revisit.                                                                  // 422
  //this._lookupHostDep.depend();                                                                                 // 423
  return this._lookupHostValue;                                                                                   // 424
};                                                                                                                // 425
                                                                                                                  // 426
/**                                                                                                               // 427
 * Set the reactive value of the lookup host.                                                                     // 428
 *                                                                                                                // 429
 */                                                                                                               // 430
DynamicTemplate.prototype._setLookupHost = function (host) {                                                      // 431
  var self = this;                                                                                                // 432
                                                                                                                  // 433
  if (self._lookupHostValue !== host) {                                                                           // 434
    self._lookupHostValue = host;                                                                                 // 435
    Deps.afterFlush(function () {                                                                                 // 436
      // if the lookup host changes and the template also changes                                                 // 437
      // before the next flush cycle, this gives the new template                                                 // 438
      // a chance to render, and the old template to be torn off                                                  // 439
      // the page (including stopping its computation) before the                                                 // 440
      // lookupHostDep is changed.                                                                                // 441
      self._lookupHostDep.changed();                                                                              // 442
    });                                                                                                           // 443
  }                                                                                                               // 444
                                                                                                                  // 445
  return this;                                                                                                    // 446
};                                                                                                                // 447
                                                                                                                  // 448
/*****************************************************************************/                                   // 449
/* DynamicTemplate Static Methods */                                                                              // 450
/*****************************************************************************/                                   // 451
                                                                                                                  // 452
/**                                                                                                               // 453
 * Get the first parent data context that are not inclusion arguments                                             // 454
 * (see above function). Note: This function can create reactive dependencies.                                    // 455
 */                                                                                                               // 456
DynamicTemplate.getParentDataContext = function (view) {                                                          // 457
  return DynamicTemplate.getDataContext(view && view.parentView);                                                 // 458
};                                                                                                                // 459
                                                                                                                  // 460
/**                                                                                                               // 461
 * Get the first data context that is not inclusion arguments.                                                    // 462
 */                                                                                                               // 463
DynamicTemplate.getDataContext = function (view) {                                                                // 464
  while (view) {                                                                                                  // 465
    if (view.name === 'with' && !view.__isTemplateWith)                                                           // 466
      return view.dataVar.get();                                                                                  // 467
    else                                                                                                          // 468
      view = view.parentView;                                                                                     // 469
  }                                                                                                               // 470
                                                                                                                  // 471
  return null;                                                                                                    // 472
};                                                                                                                // 473
                                                                                                                  // 474
/**                                                                                                               // 475
 * Get inclusion arguments, if any, from a view.                                                                  // 476
 *                                                                                                                // 477
 * Uses the __isTemplateWith property set when a parent view is used                                              // 478
 * specificially for a data context with inclusion args.                                                          // 479
 *                                                                                                                // 480
 * Inclusion arguments are arguments provided in a template like this:                                            // 481
 * {{> yield "inclusionArg"}}                                                                                     // 482
 * or                                                                                                             // 483
 * {{> yield region="inclusionArgValue"}}                                                                         // 484
 */                                                                                                               // 485
DynamicTemplate.getInclusionArguments = function (view) {                                                         // 486
  var parent = view && view.parentView;                                                                           // 487
                                                                                                                  // 488
  if (!parent)                                                                                                    // 489
    return null;                                                                                                  // 490
                                                                                                                  // 491
  if (parent.__isTemplateWith)                                                                                    // 492
    return parent.dataVar.get();                                                                                  // 493
                                                                                                                  // 494
  return null;                                                                                                    // 495
};                                                                                                                // 496
                                                                                                                  // 497
/**                                                                                                               // 498
 * Given a view, return a function that can be used to access argument values at                                  // 499
 * the time the view was rendered. There are two key benefits:                                                    // 500
 *                                                                                                                // 501
 * 1. Save the argument data at the time of rendering. When you use lookup(...)                                   // 502
 *    it starts from the current data context which can change.                                                   // 503
 * 2. Defer creating a dependency on inclusion arguments until later.                                             // 504
 *                                                                                                                // 505
 * Example:                                                                                                       // 506
 *                                                                                                                // 507
 *   {{> MyTemplate template="MyTemplate"                                                                         // 508
 *   var args = DynamicTemplate.args(view);                                                                       // 509
 *   var tmplValue = args('template');                                                                            // 510
 *     => "MyTemplate"                                                                                            // 511
 */                                                                                                               // 512
DynamicTemplate.args = function (view) {                                                                          // 513
  return function (key) {                                                                                         // 514
    var data = DynamicTemplate.getInclusionArguments(view);                                                       // 515
                                                                                                                  // 516
    if (data) {                                                                                                   // 517
      if (key)                                                                                                    // 518
        return data[key];                                                                                         // 519
      else                                                                                                        // 520
        return data;                                                                                              // 521
    }                                                                                                             // 522
                                                                                                                  // 523
    return null;                                                                                                  // 524
  };                                                                                                              // 525
};                                                                                                                // 526
                                                                                                                  // 527
/**                                                                                                               // 528
 * Inherit from DynamicTemplate.                                                                                  // 529
 */                                                                                                               // 530
DynamicTemplate.extend = function (props) {                                                                       // 531
  return Iron.utils.extend(this, props);                                                                          // 532
};                                                                                                                // 533
                                                                                                                  // 534
DynamicTemplate.findFirstLookupHost = function (view) {                                                           // 535
  var host;                                                                                                       // 536
  var helper;                                                                                                     // 537
  assert(view instanceof Blaze.View, "view must be a Blaze.View");                                                // 538
  while (view) {                                                                                                  // 539
    if (view.__dynamicTemplate__) {                                                                               // 540
      // creates a reactive dependency.                                                                           // 541
      var host = view.__dynamicTemplate__._getLookupHost();                                                       // 542
      if (host) return host;                                                                                      // 543
    } else {                                                                                                      // 544
      view = view.parentView;                                                                                     // 545
    }                                                                                                             // 546
  }                                                                                                               // 547
                                                                                                                  // 548
  return undefined;                                                                                               // 549
};                                                                                                                // 550
                                                                                                                  // 551
DynamicTemplate.findLookupHostWithProperty = function (view, key) {                                               // 552
  var host;                                                                                                       // 553
  var prop;                                                                                                       // 554
  assert(view instanceof Blaze.View, "view must be a Blaze.View");                                                // 555
  while (view) {                                                                                                  // 556
    if (view.__dynamicTemplate__) {                                                                               // 557
                                                                                                                  // 558
      // creates a reactive dependency                                                                            // 559
      var host = view.__dynamicTemplate__._getLookupHost();                                                       // 560
                                                                                                                  // 561
      if (host && get(host, key)) {                                                                               // 562
        return host;                                                                                              // 563
      }                                                                                                           // 564
    }                                                                                                             // 565
                                                                                                                  // 566
    view = view.parentView;                                                                                       // 567
  }                                                                                                               // 568
                                                                                                                  // 569
  return undefined;                                                                                               // 570
};                                                                                                                // 571
                                                                                                                  // 572
/**                                                                                                               // 573
 * Find a lookup host that has a given helper and returns the host. Note,                                         // 574
 * this will create a reactive dependency on each dynamic template's getLookupHost                                // 575
 * function. This is required becuase we need to rerun the entire lookup if                                       // 576
 * the host changes or is added or removed later, anywhere in the chain.                                          // 577
 */                                                                                                               // 578
DynamicTemplate.findLookupHostWithHelper = function (view, helperKey) {                                           // 579
  var host;                                                                                                       // 580
  var helper;                                                                                                     // 581
  assert(view instanceof Blaze.View, "view must be a Blaze.View");                                                // 582
  while (view) {                                                                                                  // 583
    if (view.__dynamicTemplate__) {                                                                               // 584
      // creates a reactive dependency                                                                            // 585
      var host = view.__dynamicTemplate__._getLookupHost();                                                       // 586
      if (host && get(host, 'constructor', '_helpers', helperKey)) {                                              // 587
        return host;                                                                                              // 588
      }                                                                                                           // 589
    }                                                                                                             // 590
                                                                                                                  // 591
    view = view.parentView;                                                                                       // 592
  }                                                                                                               // 593
                                                                                                                  // 594
  return undefined;                                                                                               // 595
};                                                                                                                // 596
                                                                                                                  // 597
/*****************************************************************************/                                   // 598
/* UI Helpers */                                                                                                  // 599
/*****************************************************************************/                                   // 600
if (typeof Template !== 'undefined') {                                                                            // 601
  UI.registerHelper('DynamicTemplate', new Template('DynamicTemplateHelper', function () {                        // 602
    var args = DynamicTemplate.args(this);                                                                        // 603
                                                                                                                  // 604
    return new DynamicTemplate({                                                                                  // 605
      data: function () { return args('data'); },                                                                 // 606
      template: function () { return args('template'); },                                                         // 607
      content: this.templateContentBlock                                                                          // 608
    }).create();                                                                                                  // 609
  }));                                                                                                            // 610
}                                                                                                                 // 611
                                                                                                                  // 612
/*****************************************************************************/                                   // 613
/* Namespacing */                                                                                                 // 614
/*****************************************************************************/                                   // 615
Iron.DynamicTemplate = DynamicTemplate;                                                                           // 616
                                                                                                                  // 617
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:dynamic-template/blaze_overrides.js                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var assert = Iron.utils.assert;                                                                                   // 4
var get = Iron.utils.get;                                                                                         // 5
                                                                                                                  // 6
/*****************************************************************************/                                   // 7
/* Blaze Overrides */                                                                                             // 8
/*****************************************************************************/                                   // 9
/**                                                                                                               // 10
 * Adds ability to inject lookup hosts into views that can participate in                                         // 11
 * property lookup. For example, iron:controller or iron:component could make                                     // 12
 * use of this to add methods into the lookup chain. If the property is found,                                    // 13
 * a function is returned that either returns the property value or the result                                    // 14
 * of calling the function (bound to the __lookupHost__).                                                         // 15
 */                                                                                                               // 16
var origLookup = Blaze.View.prototype.lookup;                                                                     // 17
Blaze.View.prototype.lookup = function (name /*, args */) {                                                       // 18
  var host;                                                                                                       // 19
                                                                                                                  // 20
  host = DynamicTemplate.findLookupHostWithHelper(Blaze.getView(), name);                                         // 21
                                                                                                                  // 22
  if (host) {                                                                                                     // 23
    return function callLookupHostHelper (/* args */) {                                                           // 24
      var helper = get(host, 'constructor', '_helpers', name);                                                    // 25
      var args = [].slice.call(arguments);                                                                        // 26
      return (typeof helper === 'function') ? helper.apply(host, args) : helper;                                  // 27
    }                                                                                                             // 28
  } else {                                                                                                        // 29
    return origLookup.apply(this, arguments);                                                                     // 30
  }                                                                                                               // 31
};                                                                                                                // 32
                                                                                                                  // 33
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:dynamic-template'] = {};

})();
