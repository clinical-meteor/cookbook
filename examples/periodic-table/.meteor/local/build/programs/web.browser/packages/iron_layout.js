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
var Template = Package.templating.Template;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var _ = Package.underscore._;
var Iron = Package['iron:core'].Iron;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var findFirstLayout, Layout, DEFAULT_REGION;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/iron:layout/version_conflict_errors.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var errors = [];                                                                                                       // 1
                                                                                                                       // 2
if (Package['cmather:iron-layout']) {                                                                                  // 3
  errors.push("\n\n\
    The cmather:iron-{x} packages were migrated to the new package system with the wrong name, and you have duplicate copies.\n\
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
  ");                                                                                                                  // 19
}                                                                                                                      // 20
                                                                                                                       // 21
// If the user still has blaze-layout throw  an error. Let's get rid of that                                           // 22
// package so it's not lingering around with all its nastiness.                                                        // 23
if (Package['cmather:blaze-layout']) {                                                                                 // 24
  errors.push(                                                                                                         // 25
    "The blaze-layout package has been replaced by iron-layout. Please remove the package like this:\n> meteor remove cmather:blaze-layout\n"
  );                                                                                                                   // 27
}                                                                                                                      // 28
                                                                                                                       // 29
if (errors.length > 0) {                                                                                               // 30
  throw new Error("Sorry! Looks like there's a few errors related to iron:layout\n\n" + errors.join("\n\n"));          // 31
}                                                                                                                      // 32
                                                                                                                       // 33
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/iron:layout/template.default_layout.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("__IronDefaultLayout__");                                                                         // 2
Template["__IronDefaultLayout__"] = new Template("Template.__IronDefaultLayout__", (function() {                       // 3
  var view = this;                                                                                                     // 4
  return Spacebars.include(view.lookupTemplate("yield"));                                                              // 5
}));                                                                                                                   // 6
                                                                                                                       // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/iron:layout/layout.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*****************************************************************************/                                        // 1
/* Imports */                                                                                                          // 2
/*****************************************************************************/                                        // 3
var DynamicTemplate = Iron.DynamicTemplate;                                                                            // 4
var inherits = Iron.utils.inherits;                                                                                    // 5
                                                                                                                       // 6
/*****************************************************************************/                                        // 7
/* Helpers */                                                                                                          // 8
/*****************************************************************************/                                        // 9
/**                                                                                                                    // 10
 * Find the first Layout in the rendered parent hierarchy.                                                             // 11
 */                                                                                                                    // 12
findFirstLayout = function (view) {                                                                                    // 13
  while (view) {                                                                                                       // 14
    if (view.name === 'Iron.Layout')                                                                                   // 15
      return view.__dynamicTemplate__;                                                                                 // 16
    else                                                                                                               // 17
      view = view.parentView;                                                                                          // 18
  }                                                                                                                    // 19
                                                                                                                       // 20
  return null;                                                                                                         // 21
};                                                                                                                     // 22
                                                                                                                       // 23
/*****************************************************************************/                                        // 24
/* Layout */                                                                                                           // 25
/*****************************************************************************/                                        // 26
                                                                                                                       // 27
/**                                                                                                                    // 28
 * Dynamically render templates into regions.                                                                          // 29
 *                                                                                                                     // 30
 * Layout inherits from Iron.DynamicTemplate and provides the ability to create                                        // 31
 * regions that a user can render templates or content blocks into. The layout                                         // 32
 * and each region is an instance of DynamicTemplate so the template and data                                          // 33
 * contexts are completely dynamic and programmable in javascript.                                                     // 34
 */                                                                                                                    // 35
Layout = function (options) {                                                                                          // 36
  var self = this;                                                                                                     // 37
                                                                                                                       // 38
  Layout.__super__.constructor.apply(this, arguments);                                                                 // 39
                                                                                                                       // 40
  options = options || {};                                                                                             // 41
  this.name = 'Iron.Layout';                                                                                           // 42
  this._regions = {};                                                                                                  // 43
  this._regionHooks = {};                                                                                              // 44
  this.defaultTemplate('__IronDefaultLayout__');                                                                       // 45
                                                                                                                       // 46
  // if there's block content then render that                                                                         // 47
  // to the main region                                                                                                // 48
  if (options.content)                                                                                                 // 49
    this.render(options.content);                                                                                      // 50
};                                                                                                                     // 51
                                                                                                                       // 52
/**                                                                                                                    // 53
 * The default region for a layout where the main content will go.                                                     // 54
 */                                                                                                                    // 55
DEFAULT_REGION = Layout.DEFAULT_REGION = 'main';                                                                       // 56
                                                                                                                       // 57
/**                                                                                                                    // 58
 * Inherits from Iron.DynamicTemplate which gives us the ability to set the                                            // 59
 * template and data context dynamically.                                                                              // 60
 */                                                                                                                    // 61
inherits(Layout, Iron.DynamicTemplate);                                                                                // 62
                                                                                                                       // 63
/**                                                                                                                    // 64
 * Return the DynamicTemplate instance for a given region. If the region doesn't                                       // 65
 * exist it is created.                                                                                                // 66
 *                                                                                                                     // 67
 * The regions object looks like this:                                                                                 // 68
 *                                                                                                                     // 69
 *  {                                                                                                                  // 70
 *    "main": DynamicTemplate,                                                                                         // 71
 *    "footer": DynamicTemplate,                                                                                       // 72
 *    .                                                                                                                // 73
 *    .                                                                                                                // 74
 *    .                                                                                                                // 75
 *  }                                                                                                                  // 76
 */                                                                                                                    // 77
Layout.prototype.region = function (name, options) {                                                                   // 78
  return this._ensureRegion(name, options);                                                                            // 79
};                                                                                                                     // 80
                                                                                                                       // 81
/**                                                                                                                    // 82
 * Destroy all child regions and reset the regions map.                                                                // 83
 */                                                                                                                    // 84
Layout.prototype.destroyRegions = function () {                                                                        // 85
  _.each(this._regions, function (dynamicTemplate) {                                                                   // 86
    dynamicTemplate.destroy();                                                                                         // 87
  });                                                                                                                  // 88
                                                                                                                       // 89
  this._regions = {};                                                                                                  // 90
};                                                                                                                     // 91
                                                                                                                       // 92
/**                                                                                                                    // 93
 * Set the template for a region.                                                                                      // 94
 */                                                                                                                    // 95
Layout.prototype.render = function (template, options) {                                                               // 96
  // having options is usually good                                                                                    // 97
  options = options || {};                                                                                             // 98
                                                                                                                       // 99
  // let the user specify the region to render the template into                                                       // 100
  var region = options.to || options.region || DEFAULT_REGION;                                                         // 101
                                                                                                                       // 102
  // get the DynamicTemplate for this region                                                                           // 103
  var dynamicTemplate = this.region(region);                                                                           // 104
                                                                                                                       // 105
  // if we're in a rendering transaction, track that we've rendered this                                               // 106
  // particular region                                                                                                 // 107
  this._trackRenderedRegion(region);                                                                                   // 108
                                                                                                                       // 109
  // set the template value for the dynamic template                                                                   // 110
  dynamicTemplate.template(template);                                                                                  // 111
                                                                                                                       // 112
  // set the data for the region. If options.data is not defined, this will                                            // 113
  // clear the data, which is what we want                                                                             // 114
  dynamicTemplate.data(options.data);                                                                                  // 115
                                                                                                                       // 116
  return dynamicTemplate;                                                                                              // 117
};                                                                                                                     // 118
                                                                                                                       // 119
/**                                                                                                                    // 120
 * Returns true if the given region is defined and false otherwise.                                                    // 121
 */                                                                                                                    // 122
Layout.prototype.has = function (region) {                                                                             // 123
  region = region || Layout.DEFAULT_REGION;                                                                            // 124
  return !!this._regions[region];                                                                                      // 125
};                                                                                                                     // 126
                                                                                                                       // 127
/**                                                                                                                    // 128
 * Returns an array of region keys.                                                                                    // 129
 */                                                                                                                    // 130
Layout.prototype.regionKeys = function () {                                                                            // 131
  return _.keys(this._regions);                                                                                        // 132
};                                                                                                                     // 133
                                                                                                                       // 134
/**                                                                                                                    // 135
 * Clear a given region or the "main" region by default.                                                               // 136
 */                                                                                                                    // 137
Layout.prototype.clear = function (region) {                                                                           // 138
  region = region || Layout.DEFAULT_REGION;                                                                            // 139
                                                                                                                       // 140
  // we don't want to create a region if it didn't exist before                                                        // 141
  if (this.has(region))                                                                                                // 142
    this.region(region).template(null);                                                                                // 143
                                                                                                                       // 144
  // chain it up                                                                                                       // 145
  return this;                                                                                                         // 146
};                                                                                                                     // 147
                                                                                                                       // 148
/**                                                                                                                    // 149
 * Clear all regions.                                                                                                  // 150
 */                                                                                                                    // 151
Layout.prototype.clearAll = function () {                                                                              // 152
  _.each(this._regions, function (dynamicTemplate) {                                                                   // 153
    dynamicTemplate.template(null);                                                                                    // 154
  });                                                                                                                  // 155
                                                                                                                       // 156
  // chain it up                                                                                                       // 157
  return this;                                                                                                         // 158
};                                                                                                                     // 159
                                                                                                                       // 160
/**                                                                                                                    // 161
 * Start tracking rendered regions.                                                                                    // 162
 */                                                                                                                    // 163
Layout.prototype.beginRendering = function (onComplete) {                                                              // 164
  var self = this;                                                                                                     // 165
  if (this._finishRenderingTransaction)                                                                                // 166
    this._finishRenderingTransaction();                                                                                // 167
                                                                                                                       // 168
  this._finishRenderingTransaction = _.once(function () {                                                              // 169
    var regions = self._endRendering({flush: false});                                                                  // 170
    onComplete && onComplete(regions);                                                                                 // 171
  });                                                                                                                  // 172
                                                                                                                       // 173
  Deps.afterFlush(this._finishRenderingTransaction);                                                                   // 174
                                                                                                                       // 175
  if (this._renderedRegions)                                                                                           // 176
    throw new Error("You called beginRendering again before calling endRendering");                                    // 177
  this._renderedRegions = {};                                                                                          // 178
};                                                                                                                     // 179
                                                                                                                       // 180
/**                                                                                                                    // 181
 * Track a rendered region if we're in a transaction.                                                                  // 182
 */                                                                                                                    // 183
Layout.prototype._trackRenderedRegion = function (region) {                                                            // 184
  if (!this._renderedRegions)                                                                                          // 185
    return;                                                                                                            // 186
  this._renderedRegions[region] = true;                                                                                // 187
};                                                                                                                     // 188
                                                                                                                       // 189
/**                                                                                                                    // 190
 * Stop a rendering transaction and retrieve the rendered regions. This                                                // 191
 * shouldn't be called directly. Instead, pass an onComplete callback to the                                           // 192
 * beginRendering method.                                                                                              // 193
 */                                                                                                                    // 194
Layout.prototype._endRendering = function (opts) {                                                                     // 195
  // we flush here to ensure all of the {{#contentFor}} inclusions have had a                                          // 196
  // chance to render from our templates, otherwise we'll never know about                                             // 197
  // them.                                                                                                             // 198
  opts = opts || {};                                                                                                   // 199
  if (opts.flush !== false)                                                                                            // 200
    Deps.flush();                                                                                                      // 201
  var renderedRegions = this._renderedRegions || {};                                                                   // 202
  this._renderedRegions = null;                                                                                        // 203
  return _.keys(renderedRegions);                                                                                      // 204
};                                                                                                                     // 205
                                                                                                                       // 206
/**                                                                                                                    // 207
 * View lifecycle hooks for regions.                                                                                   // 208
 */                                                                                                                    // 209
_.each(                                                                                                                // 210
  [                                                                                                                    // 211
    'onRegionCreated',                                                                                                 // 212
    'onRegionRendered',                                                                                                // 213
    'onRegionDestroyed'                                                                                                // 214
  ],                                                                                                                   // 215
  function (hook) {                                                                                                    // 216
    Layout.prototype[hook] = function (cb) {                                                                           // 217
      var hooks = this._regionHooks[hook] = this._regionHooks[hook] || [];                                             // 218
      hooks.push(cb);                                                                                                  // 219
      return this;                                                                                                     // 220
    }                                                                                                                  // 221
  }                                                                                                                    // 222
);                                                                                                                     // 223
                                                                                                                       // 224
/**                                                                                                                    // 225
 * Returns the DynamicTemplate for a given region or creates it if it doesn't                                          // 226
 * exists yet.                                                                                                         // 227
 */                                                                                                                    // 228
Layout.prototype._ensureRegion = function (name, options) {                                                            // 229
 return this._regions[name] = this._regions[name] || this._createDynamicTemplate(name, options);                       // 230
};                                                                                                                     // 231
                                                                                                                       // 232
/**                                                                                                                    // 233
 * Create a new DynamicTemplate instance.                                                                              // 234
 */                                                                                                                    // 235
Layout.prototype._createDynamicTemplate = function (name, options) {                                                   // 236
  var self = this;                                                                                                     // 237
  var tmpl = new Iron.DynamicTemplate(options);                                                                        // 238
  var capitalize = Iron.utils.capitalize;                                                                              // 239
  tmpl._region = name;                                                                                                 // 240
                                                                                                                       // 241
  _.each(['viewCreated', 'viewReady', 'viewDestroyed'], function (hook) {                                              // 242
    hook = capitalize(hook);                                                                                           // 243
    tmpl['on' + hook](function (dynamicTemplate) {                                                                     // 244
      // "this" is the view instance                                                                                   // 245
      var view = this;                                                                                                 // 246
      var regionHook = ({                                                                                              // 247
        viewCreated: "regionCreated",                                                                                  // 248
        viewReady: "regionRendered",                                                                                   // 249
        viewDestroyed: "regionDestroyed"                                                                               // 250
      })[hook];                                                                                                        // 251
      self._runRegionHooks('on' + regionHook, view, dynamicTemplate);                                                  // 252
    });                                                                                                                // 253
  });                                                                                                                  // 254
                                                                                                                       // 255
  return tmpl;                                                                                                         // 256
};                                                                                                                     // 257
                                                                                                                       // 258
Layout.prototype._runRegionHooks = function (name, regionView, regionDynamicTemplate) {                                // 259
  var layout = this;                                                                                                   // 260
  var hooks = this._regionHooks[name] || [];                                                                           // 261
  var hook;                                                                                                            // 262
                                                                                                                       // 263
  for (var i = 0; i < hooks.length; i++) {                                                                             // 264
    hook = hooks[i];                                                                                                   // 265
    // keep the "thisArg" pointing to the view, but make the first parameter to                                        // 266
    // the callback teh dynamic template instance.                                                                     // 267
    hook.call(regionView, regionDynamicTemplate.region, regionDynamicTemplate, this);                                  // 268
  }                                                                                                                    // 269
};                                                                                                                     // 270
                                                                                                                       // 271
/*****************************************************************************/                                        // 272
/* UI Helpers */                                                                                                       // 273
/*****************************************************************************/                                        // 274
if (typeof Template !== 'undefined') {                                                                                 // 275
  /**                                                                                                                  // 276
   * Create a region in the closest layout ancestor.                                                                   // 277
   *                                                                                                                   // 278
   * Examples:                                                                                                         // 279
   *    <aside>                                                                                                        // 280
   *      {{> yield "aside"}}                                                                                          // 281
   *    </aside>                                                                                                       // 282
   *                                                                                                                   // 283
   *    <article>                                                                                                      // 284
   *      {{> yield}}                                                                                                  // 285
   *    </article>                                                                                                     // 286
   *                                                                                                                   // 287
   *    <footer>                                                                                                       // 288
   *      {{> yield "footer"}}                                                                                         // 289
   *    </footer>                                                                                                      // 290
   */                                                                                                                  // 291
  UI.registerHelper('yield', new Template('yield', function () {                                                       // 292
    var layout = findFirstLayout(this);                                                                                // 293
                                                                                                                       // 294
    if (!layout)                                                                                                       // 295
      throw new Error("No Iron.Layout found so you can't use yield!");                                                 // 296
                                                                                                                       // 297
    // Example options: {{> yield region="footer"}} or {{> yield "footer"}}                                            // 298
    var options = DynamicTemplate.getInclusionArguments(this);                                                         // 299
    var region;                                                                                                        // 300
    var dynamicTemplate;                                                                                               // 301
                                                                                                                       // 302
    if (_.isString(options)) {                                                                                         // 303
      region = options;                                                                                                // 304
    } else if (_.isObject(options)) {                                                                                  // 305
      region = options.region;                                                                                         // 306
    }                                                                                                                  // 307
                                                                                                                       // 308
    // if there's no region specified we'll assume you meant the main region                                           // 309
    region = region || DEFAULT_REGION;                                                                                 // 310
                                                                                                                       // 311
    // get or create the region                                                                                        // 312
    dynamicTemplate = layout.region(region);                                                                           // 313
                                                                                                                       // 314
    // if the dynamicTemplate had already been inserted, let's                                                         // 315
    // destroy it before creating a new one.                                                                           // 316
    if (dynamicTemplate.isCreated)                                                                                     // 317
      dynamicTemplate.destroy();                                                                                       // 318
                                                                                                                       // 319
    // now return a newly created view                                                                                 // 320
    return dynamicTemplate.create();                                                                                   // 321
  }));                                                                                                                 // 322
                                                                                                                       // 323
  /**                                                                                                                  // 324
   * Render a template into a region in the closest layout ancestor from within                                        // 325
   * your template markup.                                                                                             // 326
   *                                                                                                                   // 327
   * Examples:                                                                                                         // 328
   *                                                                                                                   // 329
   *  {{#contentFor "footer"}}                                                                                         // 330
   *    Footer stuff                                                                                                   // 331
   *  {{/contentFor}}                                                                                                  // 332
   *                                                                                                                   // 333
   *  {{> contentFor region="footer" template="SomeTemplate" data=someData}}                                           // 334
   *                                                                                                                   // 335
   * Note: The helper is a UI.Component object instead of a function so that                                           // 336
   * Meteor UI does not create a Deps.Dependency.                                                                      // 337
   *                                                                                                                   // 338
   * XXX what happens if the parent that calls contentFor gets destroyed?                                              // 339
   * XXX the layout.region should be reset to be empty?                                                                // 340
   * XXX but how do we control order of setting the region? what if it gets destroyed but then something else sets it? // 341
   *                                                                                                                   // 342
   */                                                                                                                  // 343
  UI.registerHelper('contentFor', new Template('contentFor', function () {                                             // 344
    var layout = findFirstLayout(this);                                                                                // 345
                                                                                                                       // 346
    if (!layout)                                                                                                       // 347
      throw new Error("No Iron.Layout found so you can't use contentFor!");                                            // 348
                                                                                                                       // 349
    var options = DynamicTemplate.getInclusionArguments(this) || {}                                                    // 350
    var content = this.templateContentBlock;                                                                           // 351
    var template = options.template;                                                                                   // 352
    var data = options.data;                                                                                           // 353
    var region;                                                                                                        // 354
                                                                                                                       // 355
    if (_.isString(options))                                                                                           // 356
      region = options;                                                                                                // 357
    else if (_.isObject(options))                                                                                      // 358
      region = options.region;                                                                                         // 359
    else                                                                                                               // 360
      throw new Error("Which region is this contentFor block supposed to be for?");                                    // 361
                                                                                                                       // 362
    // set the region to a provided template or the content directly.                                                  // 363
    layout.region(region).template(template || content);                                                               // 364
                                                                                                                       // 365
    // tell the layout to track this as a rendered region if we're in a                                                // 366
    // rendering transaction.                                                                                          // 367
    layout._trackRenderedRegion(region);                                                                               // 368
                                                                                                                       // 369
    // if we have some data then set the data context                                                                  // 370
    if (data)                                                                                                          // 371
      layout.region(region).data(data);                                                                                // 372
                                                                                                                       // 373
    // just render nothing into this area of the page since the dynamic template                                       // 374
    // will do the actual rendering into the right region.                                                             // 375
    return null;                                                                                                       // 376
  }));                                                                                                                 // 377
                                                                                                                       // 378
  /**                                                                                                                  // 379
   * Check to see if a given region is currently rendered to.                                                          // 380
   *                                                                                                                   // 381
   * Example:                                                                                                          // 382
   *    {{#if hasRegion 'aside'}}                                                                                      // 383
   *      <aside>                                                                                                      // 384
   *        {{> yield "aside"}}                                                                                        // 385
   *      </aside>                                                                                                     // 386
   *    {{/if}}                                                                                                        // 387
   */                                                                                                                  // 388
  UI.registerHelper('hasRegion', function (region) {                                                                   // 389
    var layout = findFirstLayout(Blaze.getView());                                                                     // 390
                                                                                                                       // 391
    if (!layout)                                                                                                       // 392
      throw new Error("No Iron.Layout found so you can't use hasRegion!");                                             // 393
                                                                                                                       // 394
    if (!_.isString(region))                                                                                           // 395
      throw new Error("You need to provide an region argument to hasRegion");                                          // 396
                                                                                                                       // 397
    return !! layout.region(region).template();                                                                        // 398
  });                                                                                                                  // 399
                                                                                                                       // 400
  /**                                                                                                                  // 401
   * Let people use Layout directly from their templates!                                                              // 402
   *                                                                                                                   // 403
   * Example:                                                                                                          // 404
   *  {{#Layout template="MyTemplate"}}                                                                                // 405
   *    Main content goes here                                                                                         // 406
   *                                                                                                                   // 407
   *    {{#contentFor "footer"}}                                                                                       // 408
   *      footer goes here                                                                                             // 409
   *    {{/contentFor}}                                                                                                // 410
   *  {{/Layout}}                                                                                                      // 411
   */                                                                                                                  // 412
  UI.registerHelper('Layout', new Template('layout', function () {                                                     // 413
    var args = Iron.DynamicTemplate.args(this);                                                                        // 414
                                                                                                                       // 415
    var layout = new Layout({                                                                                          // 416
      template: function () { return args('template'); },                                                              // 417
      data: function () { return args('data'); },                                                                      // 418
      content: this.templateContentBlock                                                                               // 419
    });                                                                                                                // 420
                                                                                                                       // 421
    return layout.create();                                                                                            // 422
  }));                                                                                                                 // 423
}                                                                                                                      // 424
/*****************************************************************************/                                        // 425
/* Namespacing */                                                                                                      // 426
/*****************************************************************************/                                        // 427
Iron.Layout = Layout;                                                                                                  // 428
                                                                                                                       // 429
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:layout'] = {};

})();
