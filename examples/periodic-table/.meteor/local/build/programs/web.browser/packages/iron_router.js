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
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Template = Package.templating.Template;
var EJSON = Package.ejson.EJSON;
var Meteor = Package.meteor.Meteor;
var Iron = Package['iron:core'].Iron;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Router, RouteController, CurrentOptions, HTTP_METHODS, Route, route;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/current_options.js                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/**                                                                                                               // 1
 * Allows for dynamic scoping of options variables. Primarily intended to be                                      // 2
 * used in the RouteController.prototype.lookupOption method.                                                     // 3
 */                                                                                                               // 4
CurrentOptions = new Meteor.EnvironmentVariable;                                                                  // 5
                                                                                                                  // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/http_methods.js                                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
HTTP_METHODS = [                                                                                                  // 1
  'get',                                                                                                          // 2
  'post',                                                                                                         // 3
  'put',                                                                                                          // 4
  'delete',                                                                                                       // 5
];                                                                                                                // 6
                                                                                                                  // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/route_controller.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var Controller = Iron.Controller;                                                                                 // 4
var Url = Iron.Url;                                                                                               // 5
var MiddlewareStack = Iron.MiddlewareStack;                                                                       // 6
var assert = Iron.utils.assert;                                                                                   // 7
                                                                                                                  // 8
/*****************************************************************************/                                   // 9
/* RouteController */                                                                                             // 10
/*****************************************************************************/                                   // 11
RouteController = Controller.extend({                                                                             // 12
  constructor: function (options) {                                                                               // 13
    RouteController.__super__.constructor.apply(this, arguments);                                                 // 14
    options = options || {};                                                                                      // 15
    this.options = options;                                                                                       // 16
    this._onStopCallbacks = [];                                                                                   // 17
    this.route = options.route;                                                                                   // 18
    this.params = [];                                                                                             // 19
                                                                                                                  // 20
    // Sometimes the data property can be defined on route options,                                               // 21
    // or even on the global router config. And people will expect the                                            // 22
    // data function to be available on the controller instance if it                                             // 23
    // is defined anywhere in the chain. This ensure that if we have                                              // 24
    // a data function somewhere in the chain, you can call this.data().                                          // 25
    var data = this.lookupOption('data');                                                                         // 26
                                                                                                                  // 27
    if (typeof data === 'function')                                                                               // 28
      this.data = _.bind(data, this);                                                                             // 29
    else if (typeof data !== 'undefined')                                                                         // 30
      this.data = function () { return data; };                                                                   // 31
                                                                                                                  // 32
    this.init(options);                                                                                           // 33
  }                                                                                                               // 34
});                                                                                                               // 35
                                                                                                                  // 36
/**                                                                                                               // 37
 * Returns an option value following an "options chain" which is this path:                                       // 38
 *                                                                                                                // 39
 *   this.options                                                                                                 // 40
 *   this (which includes the proto chain)                                                                        // 41
 *   this.route.options                                                                                           // 42
 *   dynamic variable                                                                                             // 43
 *   this.router.options                                                                                          // 44
 */                                                                                                               // 45
RouteController.prototype.lookupOption = function (key) {                                                         // 46
  // this.route.options                                                                                           // 47
  // NOTE: we've debated whether route options should come before controller but                                  // 48
  // Tom has convinced me that it's easier for people to think about overriding                                   // 49
  // controller stuff at the route option level. However, this has the possibly                                   // 50
  // counterintuitive effect that if you define this.someprop = true on the                                       // 51
  // controller instance, and you have someprop defined as an option on your                                      // 52
  // Route, the route option will take precedence.                                                                // 53
  if (this.route && this.route.options && _.has(this.route.options, key))                                         // 54
    return this.route.options[key];                                                                               // 55
                                                                                                                  // 56
  // this.options                                                                                                 // 57
  if (_.has(this.options, key))                                                                                   // 58
    return this.options[key];                                                                                     // 59
                                                                                                                  // 60
  // "this" object or its proto chain                                                                             // 61
  if (typeof this[key] !== 'undefined')                                                                           // 62
    return this[key];                                                                                             // 63
                                                                                                                  // 64
  // see if we have the CurrentOptions dynamic variable set.                                                      // 65
  var opts = CurrentOptions.get();                                                                                // 66
  if (opts && _.has(opts, key))                                                                                   // 67
    return opts[key];                                                                                             // 68
                                                                                                                  // 69
  // this.router.options                                                                                          // 70
  if (this.router && this.router.options && _.has(this.router.options, key))                                      // 71
    return this.router.options[key];                                                                              // 72
};                                                                                                                // 73
                                                                                                                  // 74
RouteController.prototype.configureFromUrl = function (url, context, options) {                                   // 75
  assert(typeof url === 'string', 'url must be a string');                                                        // 76
  context = context || {};                                                                                        // 77
  this.request = context.request || {};                                                                           // 78
  this.response = context.response || {};                                                                         // 79
  this.url = context.url || url;                                                                                  // 80
  this.originalUrl = context.originalUrl || url;                                                                  // 81
  this.method = this.request.method;                                                                              // 82
  if (this.route) {                                                                                               // 83
    // pass options to that we can set reactive: false                                                            // 84
    this.setParams(this.route.params(url), options);                                                              // 85
  }                                                                                                               // 86
};                                                                                                                // 87
                                                                                                                  // 88
/**                                                                                                               // 89
 * Returns an array of hook functions for the given hook names. Hooks are                                         // 90
 * collected in this order:                                                                                       // 91
 *                                                                                                                // 92
 * router global hooks                                                                                            // 93
 * route option hooks                                                                                             // 94
 * prototype of the controller                                                                                    // 95
 * this object for the controller                                                                                 // 96
 *                                                                                                                // 97
 * For example, this.collectHooks('onBeforeAction', 'before')                                                     // 98
 * will return an array of hook functions where the key is either onBeforeAction                                  // 99
 * or before.                                                                                                     // 100
 *                                                                                                                // 101
 * Hook values can also be strings in which case they are looked up in the                                        // 102
 * Iron.Router.hooks object.                                                                                      // 103
 *                                                                                                                // 104
 * TODO: Add an options last argument which can specify to only collect hooks                                     // 105
 * for a particular environment (client, server or both).                                                         // 106
 */                                                                                                               // 107
RouteController.prototype._collectHooks = function (/* hook1, alias1, ... */) {                                   // 108
  var self = this;                                                                                                // 109
  var hookNames = _.toArray(arguments);                                                                           // 110
                                                                                                                  // 111
  var getHookValues = function (value) {                                                                          // 112
    if (!value)                                                                                                   // 113
      return [];                                                                                                  // 114
    var lookupHook = self.router.lookupHook;                                                                      // 115
    var hooks = _.isArray(value) ? value : [value];                                                               // 116
    return _.map(hooks, function (h) { return lookupHook(h); });                                                  // 117
  };                                                                                                              // 118
                                                                                                                  // 119
  var collectInheritedHooks = function (ctor, hookName) {                                                         // 120
    var hooks = [];                                                                                               // 121
                                                                                                                  // 122
    if (ctor.__super__)                                                                                           // 123
      hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor, hookName));                          // 124
                                                                                                                  // 125
    return _.has(ctor.prototype, hookName) ?                                                                      // 126
      hooks.concat(getHookValues(ctor.prototype[hookName])) : hooks;                                              // 127
  };                                                                                                              // 128
                                                                                                                  // 129
  var eachHook = function (cb) {                                                                                  // 130
    for (var i = 0; i < hookNames.length; i++) {                                                                  // 131
      cb(hookNames[i]);                                                                                           // 132
    }                                                                                                             // 133
  };                                                                                                              // 134
                                                                                                                  // 135
  var routerHooks = [];                                                                                           // 136
  eachHook(function (hook) {                                                                                      // 137
    var name = self.route && self.route.getName();                                                                // 138
    var hooks = self.router.getHooks(hook, name);                                                                 // 139
    routerHooks = routerHooks.concat(hooks);                                                                      // 140
  });                                                                                                             // 141
                                                                                                                  // 142
  var protoHooks = [];                                                                                            // 143
  eachHook(function (hook) {                                                                                      // 144
    var hooks = collectInheritedHooks(self.constructor, hook);                                                    // 145
    protoHooks = protoHooks.concat(hooks);                                                                        // 146
  });                                                                                                             // 147
                                                                                                                  // 148
  var thisHooks = [];                                                                                             // 149
  eachHook(function (hook) {                                                                                      // 150
    if (_.has(self, hook)) {                                                                                      // 151
      var hooks = getHookValues(self[hook]);                                                                      // 152
      thisHooks = thisHooks.concat(hooks);                                                                        // 153
    }                                                                                                             // 154
  });                                                                                                             // 155
                                                                                                                  // 156
  var routeHooks = [];                                                                                            // 157
  if (self.route) {                                                                                               // 158
    eachHook(function (hook) {                                                                                    // 159
      var hooks = getHookValues(self.route.options[hook]);                                                        // 160
      routeHooks = routeHooks.concat(hooks);                                                                      // 161
    });                                                                                                           // 162
  }                                                                                                               // 163
                                                                                                                  // 164
  var allHooks = routerHooks                                                                                      // 165
    .concat(routeHooks)                                                                                           // 166
    .concat(protoHooks)                                                                                           // 167
    .concat(thisHooks);                                                                                           // 168
                                                                                                                  // 169
  return allHooks;                                                                                                // 170
};                                                                                                                // 171
                                                                                                                  // 172
/**                                                                                                               // 173
 * Runs each hook and returns the number of hooks that were run.                                                  // 174
 */                                                                                                               // 175
RouteController.prototype.runHooks = function (/* hook, alias1, ...*/ ) {                                         // 176
  var hooks = this._collectHooks.apply(this, arguments);                                                          // 177
  for (var i = 0, l = hooks.length; i < l; i++) {                                                                 // 178
    var h = hooks[i];                                                                                             // 179
    h.call(this);                                                                                                 // 180
  }                                                                                                               // 181
  return hooks.length;                                                                                            // 182
};                                                                                                                // 183
                                                                                                                  // 184
RouteController.prototype.getParams = function () {                                                               // 185
  return this.params;                                                                                             // 186
};                                                                                                                // 187
                                                                                                                  // 188
RouteController.prototype.setParams = function (value) {                                                          // 189
  this.params = value;                                                                                            // 190
  return this;                                                                                                    // 191
};                                                                                                                // 192
                                                                                                                  // 193
Iron.RouteController = RouteController;                                                                           // 194
                                                                                                                  // 195
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/route_controller_client.js                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var Controller = Iron.Controller;                                                                                 // 4
var Url = Iron.Url;                                                                                               // 5
var MiddlewareStack = Iron.MiddlewareStack;                                                                       // 6
var debug = Iron.utils.debug('iron-router:RouteController');                                                      // 7
                                                                                                                  // 8
/*****************************************************************************/                                   // 9
/* RouteController */                                                                                             // 10
/*****************************************************************************/                                   // 11
/**                                                                                                               // 12
 * Client specific initialization.                                                                                // 13
 */                                                                                                               // 14
RouteController.prototype.init = function (options) {                                                             // 15
  RouteController.__super__.init.apply(this, arguments);                                                          // 16
  this._computation = null;                                                                                       // 17
  this._paramsDep = new Tracker.Dependency;                                                                       // 18
  this.location = Iron.Location;                                                                                  // 19
};                                                                                                                // 20
                                                                                                                  // 21
RouteController.prototype.getParams = function () {                                                               // 22
  this._paramsDep.depend();                                                                                       // 23
  return this.params;                                                                                             // 24
};                                                                                                                // 25
                                                                                                                  // 26
RouteController.prototype.setParams = function (value, options) {                                                 // 27
  var equals = function (a, b) {                                                                                  // 28
    if (!(a instanceof Array))                                                                                    // 29
      throw new Error("you called equals with a non array value in setParams");                                   // 30
    if (!(b instanceof Array))                                                                                    // 31
      return false;                                                                                               // 32
    if (a.length !== b.length)                                                                                    // 33
      return false;                                                                                               // 34
    for (var i = 0; i < a.length; i++) {                                                                          // 35
      if (!EJSON.equals(a[i], b[i], options))                                                                     // 36
        return false;                                                                                             // 37
    }                                                                                                             // 38
                                                                                                                  // 39
    // now check all of the hasOwn properties of params                                                           // 40
    var aKeys = _.keys(a);                                                                                        // 41
    var bKeys = _.keys(b);                                                                                        // 42
    var key;                                                                                                      // 43
                                                                                                                  // 44
    if (aKeys.length !== bKeys.length)                                                                            // 45
      return false;                                                                                               // 46
                                                                                                                  // 47
    for (var i = 0; i < aKeys.length; i++) {                                                                      // 48
      key = aKeys[i];                                                                                             // 49
      if (!_.has(b, key))                                                                                         // 50
        return false;                                                                                             // 51
      if (!EJSON.equals(a[key], b[key]))                                                                          // 52
        return false;                                                                                             // 53
    }                                                                                                             // 54
                                                                                                                  // 55
    return true;                                                                                                  // 56
  };                                                                                                              // 57
                                                                                                                  // 58
  // this won't work because the array values are the same                                                        // 59
  // most of the time.                                                                                            // 60
  if (equals(this.params, value))                                                                                 // 61
    return;                                                                                                       // 62
                                                                                                                  // 63
  this.params = value;                                                                                            // 64
                                                                                                                  // 65
  options = options || {};                                                                                        // 66
  if (options.reactive !== false)                                                                                 // 67
    this._paramsDep.changed();                                                                                    // 68
                                                                                                                  // 69
  return this;                                                                                                    // 70
};                                                                                                                // 71
                                                                                                                  // 72
/**                                                                                                               // 73
 * Let this controller run a dispatch process. This function will be called                                       // 74
 * from the router. That way, any state associated with the dispatch can go on                                    // 75
 * the controller instance.                                                                                       // 76
 */                                                                                                               // 77
RouteController.prototype.dispatch = function (stack, url, done) {                                                // 78
  if (this._computation && !this._computation.stopped)                                                            // 79
    throw new Error("RouteController computation is already running. Stop it first.");                            // 80
                                                                                                                  // 81
  var self = this;                                                                                                // 82
                                                                                                                  // 83
  // break the computation chain with any parent comps                                                            // 84
  Deps.nonreactive(function () {                                                                                  // 85
    Deps.autorun(function (comp) {                                                                                // 86
      self._computation = comp;                                                                                   // 87
      stack.dispatch(url, self, done);                                                                            // 88
    });                                                                                                           // 89
  });                                                                                                             // 90
                                                                                                                  // 91
  return self;                                                                                                    // 92
};                                                                                                                // 93
                                                                                                                  // 94
/**                                                                                                               // 95
 * Run a route. When the router runs its middleware stack, it can run regular                                     // 96
 * middleware functions or it can run a route. There should only one route                                        // 97
 * object per path as where there may be many middleware functions.                                               // 98
 *                                                                                                                // 99
 * For example:                                                                                                   // 100
 *                                                                                                                // 101
 *   "/some/path" => [middleware1, middleware2, route, middleware3]                                               // 102
 *                                                                                                                // 103
 * When a route is dispatched, it tells the controller to _runRoute so that                                       // 104
 * the controller can controll the process. At this point we should already be                                    // 105
 * in a dispatch so a computation should already exist.                                                           // 106
 */                                                                                                               // 107
RouteController.prototype._runRoute = function (route, url, done) {                                               // 108
  var self = this;                                                                                                // 109
                                                                                                                  // 110
                                                                                                                  // 111
  // this will now be where you can put your subscriptions                                                        // 112
  // instead of waitOn. If you use waitOn, it will also                                                           // 113
  // add the result to the wait list, but will also use                                                           // 114
  // the loading hook.                                                                                            // 115
  //                                                                                                              // 116
  // Similar to waitOn, we'll collect these just like hooks. See the comment                                      // 117
  // below on the waitOnList.                                                                                     // 118
  //                                                                                                              // 119
  // If you don't want the subscription to affect the readiness of the waitlist                                   // 120
  // then just don't return the subscription handle from the function.                                            // 121
  var subsList = this._collectHooks('subscriptions');                                                             // 122
  _.each(subsList, function (subFunc) {                                                                           // 123
    self.wait(subFunc.call(self));                                                                                // 124
  });                                                                                                             // 125
                                                                                                                  // 126
                                                                                                                  // 127
  // waitOn isn't really a 'hook' but we use the _collectHooks method here                                        // 128
  // because I want an array of values collected in the same order that we                                        // 129
  // collect regular hooks (router global, route option, controller proto,                                        // 130
  // controller inst object. Then we need to map over the results to make                                         // 131
  // sure the thisArg is set to the controller instance.                                                          // 132
  var waitOnList = this._collectHooks('waitOn');                                                                  // 133
                                                                                                                  // 134
  _.each(waitOnList, function (waitOn) {                                                                          // 135
    self.wait(waitOn.call(self));                                                                                 // 136
  });                                                                                                             // 137
                                                                                                                  // 138
  // if we have a waitOn option, the loading hook will be                                                         // 139
  // added at the end of the before hook stack, right before                                                      // 140
  // the action function.                                                                                         // 141
  var useLoadingHook = waitOnList.length > 0;                                                                     // 142
                                                                                                                  // 143
  // start the rendering transaction so we record which regions were rendered                                     // 144
  // into so we can clear the unused regions later. the callback function will                                    // 145
  // get called automatically on the next flush, OR if beginRendering is called                                   // 146
  // again before the afterFlush callback.                                                                        // 147
  var previousLayout;                                                                                             // 148
  var previousMainTemplate;                                                                                       // 149
                                                                                                                  // 150
  var getLayout = function () {                                                                                   // 151
    return Deps.nonreactive(function () {                                                                         // 152
      return self._layout.template();                                                                             // 153
    });                                                                                                           // 154
  };                                                                                                              // 155
                                                                                                                  // 156
  var getMainTemplate = function () {                                                                             // 157
    return Deps.nonreactive(function () {                                                                         // 158
      var region = self._layout._regions.main;                                                                    // 159
      return region && region.template();                                                                         // 160
    });                                                                                                           // 161
  };                                                                                                              // 162
                                                                                                                  // 163
  var prevLayout = getLayout();                                                                                   // 164
  var prevMainTemplate = getMainTemplate();                                                                       // 165
                                                                                                                  // 166
  this.beginRendering(function onCompleteRenderingTransaction (usedRegions) {                                     // 167
    if (self.isStopped)                                                                                           // 168
      return;                                                                                                     // 169
                                                                                                                  // 170
    var curLayout = getLayout();                                                                                  // 171
    var curMainTemplate = getMainTemplate();                                                                      // 172
                                                                                                                  // 173
    // in the case where we're using the same layout and main template                                            // 174
    // across route changes don't automatically clear the unused regions                                          // 175
    // because we could have static content in them that we want to keep!                                         // 176
    if (prevLayout === curLayout && prevMainTemplate == curMainTemplate)                                          // 177
      return;                                                                                                     // 178
                                                                                                                  // 179
    var allRegions = self._layout.regionKeys();                                                                   // 180
    var unusedRegions = _.difference(allRegions, usedRegions);                                                    // 181
    _.each(unusedRegions, function (r) { self._layout.clear(r); });                                               // 182
  });                                                                                                             // 183
                                                                                                                  // 184
  this.layout(this.lookupOption('layoutTemplate'), {                                                              // 185
    data: this.lookupOption('data')                                                                               // 186
  });                                                                                                             // 187
                                                                                                                  // 188
  var stack = new MiddlewareStack;                                                                                // 189
  var onRunStack = new MiddlewareStack;                                                                           // 190
  var onRerunStack = new MiddlewareStack;                                                                         // 191
                                                                                                                  // 192
  onRunStack.append(this._collectHooks('onRun', 'load'), {where: 'client'});                                      // 193
  onRerunStack.append(this._collectHooks('onRerun'), {where: 'client'});                                          // 194
                                                                                                                  // 195
  stack.append(                                                                                                   // 196
    function onRun (req, res, next) {                                                                             // 197
      if (this._computation.firstRun && !RouteController._hasJustReloaded) {                                      // 198
        RouteController._hasJustReloaded = false;                                                                 // 199
        if (onRunStack.length > 0) {                                                                              // 200
          onRunStack.dispatch(req.url, this, next);                                                               // 201
        } else {                                                                                                  // 202
          next();                                                                                                 // 203
        }                                                                                                         // 204
      } else {                                                                                                    // 205
        next();                                                                                                   // 206
      }                                                                                                           // 207
    },                                                                                                            // 208
                                                                                                                  // 209
    function onRerun (req, res, next) {                                                                           // 210
      if (!this._computation.firstRun) {                                                                          // 211
        if (onRerunStack.length > 0) {                                                                            // 212
          onRerunStack.dispatch(req.url, this, next);                                                             // 213
        } else {                                                                                                  // 214
          next();                                                                                                 // 215
        }                                                                                                         // 216
      } else {                                                                                                    // 217
        next();                                                                                                   // 218
      }                                                                                                           // 219
    }                                                                                                             // 220
  , {where: 'client'});                                                                                           // 221
                                                                                                                  // 222
  // make sure the loading hook is the first one to run                                                           // 223
  // before any of the other onBeforeAction hooks.                                                                // 224
  if (useLoadingHook) {                                                                                           // 225
    stack.push(_.bind(Iron.Router.hooks.loading, self));                                                          // 226
  }                                                                                                               // 227
                                                                                                                  // 228
  var beforeHooks = this._collectHooks('onBeforeAction', 'before');                                               // 229
  stack.append(beforeHooks, {where: 'client'});                                                                   // 230
                                                                                                                  // 231
  // make sure the action stack has at least one handler on it that defaults                                      // 232
  // to the 'action' method                                                                                       // 233
  if (route._actionStack.length === 0)                                                                            // 234
    route._actionStack.push(route._path, 'action', route.options);                                                // 235
                                                                                                                  // 236
  stack = stack.concat(route._actionStack);                                                                       // 237
                                                                                                                  // 238
  // the "context" is the current instance of the RouteController                                                 // 239
  this._rendered = false;                                                                                         // 240
  stack.dispatch(url, this, done);                                                                                // 241
  // we put this in an afterFlush to let a redirected route have a chance to                                      // 242
  //   start and to stop this route.                                                                              // 243
  Deps.afterFlush(function() {                                                                                    // 244
    Iron.utils.warn(self._rendered || self.isStopped,                                                             // 245
      "Route dispatch never rendered. Did you forget to call this.next() in an onBeforeAction?");                 // 246
  });                                                                                                             // 247
                                                                                                                  // 248
  // run the after hooks. Note, at this point we're out of the middleware                                         // 249
  // stack way of doing things. So after actions don't call this.next(). They                                     // 250
  // run just like a regular hook. In contrast, before hooks have to call                                         // 251
  // this.next() to progress to the next handler, just like Connect                                               // 252
  // middleware.                                                                                                  // 253
  this.runHooks('onAfterAction', 'after');                                                                        // 254
};                                                                                                                // 255
                                                                                                                  // 256
/**                                                                                                               // 257
 * The default action for the controller simply renders the main template.                                        // 258
 */                                                                                                               // 259
RouteController.prototype.action = function () {                                                                  // 260
  this.render();                                                                                                  // 261
};                                                                                                                // 262
                                                                                                                  // 263
/**                                                                                                               // 264
 * Returns the name of the main template for this controller. If no explicit                                      // 265
 * value is found we will guess the name of the template.                                                         // 266
 */                                                                                                               // 267
RouteController.prototype.lookupTemplate = function () {                                                          // 268
  return this.lookupOption('template') ||                                                                         // 269
    (this.router && this.router.toTemplateName(this.route.getName()));                                            // 270
};                                                                                                                // 271
                                                                                                                  // 272
/**                                                                                                               // 273
 * The regionTemplates for the RouteController.                                                                   // 274
 */                                                                                                               // 275
RouteController.prototype.lookupRegionTemplates = function () {                                                   // 276
  return this.lookupOption('yieldRegions') ||                                                                     // 277
    // XXX: deprecated                                                                                            // 278
    this.lookupOption('regionTemplates') ||                                                                       // 279
    this.lookupOption('yieldTemplates') || {};                                                                    // 280
};                                                                                                                // 281
                                                                                                                  // 282
/**                                                                                                               // 283
 * Overrides Controller.prototype.render to automatically render the                                              // 284
 * controller's main template and region templates or just render a region                                        // 285
 * template if the arguments are provided.                                                                        // 286
 */                                                                                                               // 287
RouteController.prototype.render = function (template, options) {                                                 // 288
  this._rendered = true;                                                                                          // 289
  if (arguments.length === 0) {                                                                                   // 290
    var template = this.lookupTemplate();                                                                         // 291
    var result = RouteController.__super__.render.call(this, template);                                           // 292
    this.renderRegions();                                                                                         // 293
    return result;                                                                                                // 294
  } else {                                                                                                        // 295
    return RouteController.__super__.render.call(this, template, options);                                        // 296
  }                                                                                                               // 297
};                                                                                                                // 298
                                                                                                                  // 299
/**                                                                                                               // 300
 * Render all region templates into their respective regions in the layout.                                       // 301
 */                                                                                                               // 302
RouteController.prototype.renderRegions = function () {                                                           // 303
  var self = this;                                                                                                // 304
  var regionTemplates = this.lookupRegionTemplates();                                                             // 305
                                                                                                                  // 306
  debug('regionTemplates: ' + JSON.stringify(regionTemplates));                                                   // 307
                                                                                                                  // 308
                                                                                                                  // 309
  // regionTemplates =>                                                                                           // 310
  //   {                                                                                                          // 311
  //     "MyTemplate": {to: 'MyRegion'}                                                                           // 312
  //   }                                                                                                          // 313
  _.each(regionTemplates, function (opts, templateName) {                                                         // 314
    self.render(templateName, opts);                                                                              // 315
  });                                                                                                             // 316
};                                                                                                                // 317
                                                                                                                  // 318
/**                                                                                                               // 319
 * Stop the RouteController.                                                                                      // 320
 */                                                                                                               // 321
RouteController.prototype.stop = function () {                                                                    // 322
  RouteController.__super__.stop.call(this);                                                                      // 323
                                                                                                                  // 324
  if (this._computation)                                                                                          // 325
    this._computation.stop();                                                                                     // 326
  this.runHooks('onStop', 'unload');                                                                              // 327
  this.isStopped = true;                                                                                          // 328
};                                                                                                                // 329
                                                                                                                  // 330
/**                                                                                                               // 331
 * Just proxies to the go method of router.                                                                       // 332
 *                                                                                                                // 333
 * It used to have more significance. Keeping because people are used to it.                                      // 334
 */                                                                                                               // 335
RouteController.prototype.redirect = function () {                                                                // 336
  return this.router.go.apply(this.router, arguments);                                                            // 337
};                                                                                                                // 338
                                                                                                                  // 339
/**                                                                                                               // 340
 * Calls Meteor.subscribe but extends the handle with a wait() method.                                            // 341
 *                                                                                                                // 342
 * The wait method adds the subscription handle to this controller's                                              // 343
 * wait list. This is equivalent to returning a subscription handle                                               // 344
 * from the waitOn function. However, using the waitOn function has the                                           // 345
 * benefit that it will be called before any other hooks. So if you want                                          // 346
 * to use the "loading" hooks for example, you'll want the wait list populated                                    // 347
 * before the hook runs.                                                                                          // 348
 *                                                                                                                // 349
 * Example:                                                                                                       // 350
 *                                                                                                                // 351
 *   this.subscribe('item', this.params._id).wait();                                                              // 352
 *                                                                                                                // 353
 *   if (this.ready()) {                                                                                          // 354
 *     ...                                                                                                        // 355
 *   } else {                                                                                                     // 356
 *     ...                                                                                                        // 357
 *   }                                                                                                            // 358
 */                                                                                                               // 359
RouteController.prototype.subscribe = function (/* same as Meteor.subscribe */) {                                 // 360
  var self = this;                                                                                                // 361
  var handle = Meteor.subscribe.apply(this, arguments);                                                           // 362
  return _.extend(handle, {                                                                                       // 363
    wait: function () {                                                                                           // 364
      self.wait(this);                                                                                            // 365
    }                                                                                                             // 366
  });                                                                                                             // 367
};                                                                                                                // 368
                                                                                                                  // 369
if (Meteor._reload) {                                                                                             // 370
  // just register the fact that a migration _has_ happened                                                       // 371
  Meteor._reload.onMigrate('iron-router', function() { return [true, true]});                                     // 372
                                                                                                                  // 373
  // then when we come back up, check if it it's set                                                              // 374
  var data = Meteor._reload.migrationData('iron-router');                                                         // 375
  RouteController._hasJustReloaded = data;                                                                        // 376
}                                                                                                                 // 377
                                                                                                                  // 378
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/route.js                                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var Url = Iron.Url;                                                                                               // 1
var MiddlewareStack = Iron.MiddlewareStack;                                                                       // 2
var assert = Iron.utils.assert;                                                                                   // 3
                                                                                                                  // 4
/*****************************************************************************/                                   // 5
/* Both */                                                                                                        // 6
/*****************************************************************************/                                   // 7
Route = function (path, fn, options) {                                                                            // 8
  var route = function (req, res, next) {                                                                         // 9
    var controller = this;                                                                                        // 10
    controller.request = req;                                                                                     // 11
    controller.response = res;                                                                                    // 12
    route.dispatch(req.url, controller, next);                                                                    // 13
  }                                                                                                               // 14
                                                                                                                  // 15
  if (typeof fn === 'object') {                                                                                   // 16
    options = fn;                                                                                                 // 17
    fn = options.action;                                                                                          // 18
  }                                                                                                               // 19
                                                                                                                  // 20
  options = options || {};                                                                                        // 21
                                                                                                                  // 22
  if (typeof path === 'string' && path.charAt(0) !== '/') {                                                       // 23
    path = options.path ? options.path : '/' + path                                                               // 24
  }                                                                                                               // 25
                                                                                                                  // 26
  // extend the route function with properties from this instance and its                                         // 27
  // prototype.                                                                                                   // 28
  _.extend(route, this);                                                                                          // 29
                                                                                                                  // 30
  // always good to have options                                                                                  // 31
  options = route.options = options || {};                                                                        // 32
                                                                                                                  // 33
  // the main action function as well as any HTTP VERB action functions will go                                   // 34
  // onto this stack.                                                                                             // 35
  route._actionStack = new MiddlewareStack;                                                                       // 36
                                                                                                                  // 37
  // any before hooks will go onto this stack to make sure they get executed                                      // 38
  // before the action stack.                                                                                     // 39
  route._beforeStack = new MiddlewareStack;                                                                       // 40
  route._beforeStack.append(route.options.onBeforeAction);                                                        // 41
  route._beforeStack.append(route.options.before);                                                                // 42
                                                                                                                  // 43
  // after hooks get run after the action stack                                                                   // 44
  route._afterStack = new MiddlewareStack;                                                                        // 45
  route._afterStack.append(route.options.onAfterAction);                                                          // 46
  route._afterStack.append(route.options.after);                                                                  // 47
                                                                                                                  // 48
                                                                                                                  // 49
  // track which methods this route uses                                                                          // 50
  route._methods = {};                                                                                            // 51
                                                                                                                  // 52
  if (typeof fn === 'string') {                                                                                   // 53
    route._actionStack.push(path, _.extend(options, {                                                             // 54
      template: fn                                                                                                // 55
    }));                                                                                                          // 56
  } else if (typeof fn === 'function' || typeof fn === 'object') {                                                // 57
    route._actionStack.push(path, fn, options);                                                                   // 58
  }                                                                                                               // 59
                                                                                                                  // 60
  route._path = path;                                                                                             // 61
  return route;                                                                                                   // 62
};                                                                                                                // 63
                                                                                                                  // 64
/**                                                                                                               // 65
 * The name of the route is actually stored on the handler since a route is a                                     // 66
 * function that has an unassignable "name" property.                                                             // 67
 */                                                                                                               // 68
Route.prototype.getName = function () {                                                                           // 69
  return this.handler && this.handler.name;                                                                       // 70
};                                                                                                                // 71
                                                                                                                  // 72
/**                                                                                                               // 73
 * Returns an appropriate RouteController constructor the this Route.                                             // 74
 *                                                                                                                // 75
 * There are three possibilities:                                                                                 // 76
 *                                                                                                                // 77
 *  1. controller option provided as a string on the route                                                        // 78
 *  2. a controller in the global namespace with the converted name of the route                                  // 79
 *  3. a default RouteController                                                                                  // 80
 *                                                                                                                // 81
 */                                                                                                               // 82
Route.prototype.findControllerConstructor = function () {                                                         // 83
  var self = this;                                                                                                // 84
                                                                                                                  // 85
  var resolve = function (name, opts) {                                                                           // 86
    opts = opts || {};                                                                                            // 87
    var C = Iron.utils.resolve(name);                                                                             // 88
    if (!C || !RouteController.prototype.isPrototypeOf(C.prototype)) {                                            // 89
      if (opts.supressErrors !== true)                                                                            // 90
        throw new Error("RouteController '" + name + "' is not defined.");                                        // 91
      else                                                                                                        // 92
        return undefined;                                                                                         // 93
    } else {                                                                                                      // 94
      return C;                                                                                                   // 95
    }                                                                                                             // 96
  };                                                                                                              // 97
                                                                                                                  // 98
  var convert = function (name) {                                                                                 // 99
    return self.router.toControllerName(name);                                                                    // 100
  };                                                                                                              // 101
                                                                                                                  // 102
  var result;                                                                                                     // 103
  var name = this.getName();                                                                                      // 104
                                                                                                                  // 105
  // the controller was set directly                                                                              // 106
  if (typeof this.options.controller === 'function')                                                              // 107
    return this.options.controller;                                                                               // 108
                                                                                                                  // 109
  // was the controller specified precisely by name? then resolve to an actual                                    // 110
  // javascript constructor value                                                                                 // 111
  else if (typeof this.options.controller === 'string')                                                           // 112
    return resolve(this.options.controller);                                                                      // 113
                                                                                                                  // 114
  // otherwise do we have a name? try to convert the name to a controller name                                    // 115
  // and resolve it to a value                                                                                    // 116
  else if (name && (result = resolve(convert(name), {supressErrors: true})))                                      // 117
    return result;                                                                                                // 118
                                                                                                                  // 119
  // otherwise just use an anonymous route controller                                                             // 120
  else                                                                                                            // 121
    return RouteController;                                                                                       // 122
};                                                                                                                // 123
                                                                                                                  // 124
                                                                                                                  // 125
/**                                                                                                               // 126
 * Create a new controller for the route.                                                                         // 127
 */                                                                                                               // 128
Route.prototype.createController = function (options) {                                                           // 129
  options = options || {};                                                                                        // 130
  var C = this.findControllerConstructor();                                                                       // 131
  options.route = this;                                                                                           // 132
  var instance = new C(options);                                                                                  // 133
  return instance;                                                                                                // 134
};                                                                                                                // 135
                                                                                                                  // 136
Route.prototype.setControllerParams = function (controller, url) {                                                // 137
};                                                                                                                // 138
                                                                                                                  // 139
/**                                                                                                               // 140
 * Dispatch into the route's middleware stack.                                                                    // 141
 */                                                                                                               // 142
Route.prototype.dispatch = function (url, context, done) {                                                        // 143
  // call runRoute on the controller which will behave similarly to the previous                                  // 144
  // version of IR.                                                                                               // 145
  assert(context._runRoute, "context doesn't have a _runRoute method");                                           // 146
  return context._runRoute(this, url, done);                                                                      // 147
};                                                                                                                // 148
                                                                                                                  // 149
/**                                                                                                               // 150
 * Returns a relative path for the route.                                                                         // 151
 */                                                                                                               // 152
Route.prototype.path = function (params, options) {                                                               // 153
  return this.handler.resolve(params, options);                                                                   // 154
};                                                                                                                // 155
                                                                                                                  // 156
/**                                                                                                               // 157
 * Return a fully qualified url for the route, given a set of parmeters and                                       // 158
 * options like hash and query.                                                                                   // 159
 */                                                                                                               // 160
Route.prototype.url = function (params, options) {                                                                // 161
  var path = this.path(params, options);                                                                          // 162
  var host = (options && options.host) || Meteor.absoluteUrl();                                                   // 163
                                                                                                                  // 164
  if (host.charAt(host.length-1) === '/');                                                                        // 165
    host = host.slice(0, host.length-1);                                                                          // 166
  return host + path;                                                                                             // 167
};                                                                                                                // 168
                                                                                                                  // 169
/**                                                                                                               // 170
 * Return a params object for the route given a path.                                                             // 171
 */                                                                                                               // 172
Route.prototype.params = function (path) {                                                                        // 173
  return this.handler.params(path);                                                                               // 174
};                                                                                                                // 175
                                                                                                                  // 176
/**                                                                                                               // 177
 * Add convenience methods for each HTTP verb.                                                                    // 178
 *                                                                                                                // 179
 * Example:                                                                                                       // 180
 *  var route = router.route('/item')                                                                             // 181
 *    .get(function () { })                                                                                       // 182
 *    .post(function () { })                                                                                      // 183
 *    .put(function () { })                                                                                       // 184
 */                                                                                                               // 185
_.each(HTTP_METHODS, function (method) {                                                                          // 186
  Route.prototype[method] = function (fn) {                                                                       // 187
    // track the method being used for OPTIONS requests.                                                          // 188
    this._methods[method] = true;                                                                                 // 189
                                                                                                                  // 190
    this._actionStack.push(this._path, fn, {                                                                      // 191
      // give each method a unique name so it doesn't clash with the route's                                      // 192
      // name in the action stack                                                                                 // 193
      name: this.getName() + '_' + method.toLowerCase(),                                                          // 194
      method: method,                                                                                             // 195
                                                                                                                  // 196
      // for now just make the handler where the same as the route, presumably a                                  // 197
      // server route.                                                                                            // 198
      where: this.handler.where,                                                                                  // 199
      mount: false                                                                                                // 200
    });                                                                                                           // 201
                                                                                                                  // 202
    return this;                                                                                                  // 203
  };                                                                                                              // 204
});                                                                                                               // 205
                                                                                                                  // 206
Iron.Route = Route;                                                                                               // 207
                                                                                                                  // 208
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/router.js                                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var MiddlewareStack = Iron.MiddlewareStack;                                                                       // 4
var Url = Iron.Url;                                                                                               // 5
var Layout = Iron.Layout;                                                                                         // 6
var warn = Iron.utils.warn;                                                                                       // 7
var assert = Iron.utils.assert;                                                                                   // 8
                                                                                                                  // 9
Router = function (options) {                                                                                     // 10
  // keep the same api throughout which is:                                                                       // 11
  // fn(url, context, done);                                                                                      // 12
  function router (req, res, next) {                                                                              // 13
    //XXX this assumes no other routers on the parent stack which we should probably fix                          // 14
    router.dispatch(req.url, {                                                                                    // 15
      request: req,                                                                                               // 16
      response: res                                                                                               // 17
    }, next);                                                                                                     // 18
  }                                                                                                               // 19
                                                                                                                  // 20
  // the main router stack                                                                                        // 21
  router._stack = new MiddlewareStack;                                                                            // 22
                                                                                                                  // 23
  // for storing global hooks like before, after, etc.                                                            // 24
  router._globalHooks = {};                                                                                       // 25
                                                                                                                  // 26
  // backward compat and quicker lookup of Route handlers vs. regular function                                    // 27
  // handlers.                                                                                                    // 28
  router.routes = [];                                                                                             // 29
                                                                                                                  // 30
  // to make sure we don't have more than one route per path                                                      // 31
  router.routes._byPath = {};                                                                                     // 32
                                                                                                                  // 33
  // always good to have options                                                                                  // 34
  this.configure.call(router, options);                                                                           // 35
                                                                                                                  // 36
  // add proto properties to the router function                                                                  // 37
  _.extend(router, this);                                                                                         // 38
                                                                                                                  // 39
  // let client and server side routing doing different things here                                               // 40
  this.init.call(router, options);                                                                                // 41
                                                                                                                  // 42
  Meteor.startup(function () {                                                                                    // 43
    Meteor.defer(function () {                                                                                    // 44
      if (router.options.autoStart !== false)                                                                     // 45
        router.start();                                                                                           // 46
    });                                                                                                           // 47
  });                                                                                                             // 48
                                                                                                                  // 49
  return router;                                                                                                  // 50
};                                                                                                                // 51
                                                                                                                  // 52
Router.prototype.init = function (options) {};                                                                    // 53
                                                                                                                  // 54
Router.prototype.configure = function (options) {                                                                 // 55
  var self = this;                                                                                                // 56
                                                                                                                  // 57
  options = options || {};                                                                                        // 58
                                                                                                                  // 59
  var toArray = function (value) {                                                                                // 60
    if (!value)                                                                                                   // 61
      return [];                                                                                                  // 62
                                                                                                                  // 63
    if (_.isArray(value))                                                                                         // 64
      return value;                                                                                               // 65
                                                                                                                  // 66
    return [value];                                                                                               // 67
  };                                                                                                              // 68
                                                                                                                  // 69
  // e.g. before: fn OR before: [fn1, fn2]                                                                        // 70
  _.each(Iron.Router.HOOK_TYPES, function eachHookType (type) {                                                   // 71
    if (options[type]) {                                                                                          // 72
      _.each(toArray(options[type]), function eachHook (hook) {                                                   // 73
        self.addHook(type, hook);                                                                                 // 74
      });                                                                                                         // 75
                                                                                                                  // 76
      delete options[type];                                                                                       // 77
    }                                                                                                             // 78
  });                                                                                                             // 79
                                                                                                                  // 80
  this.options = this.options || {};                                                                              // 81
  _.extend(this.options, options);                                                                                // 82
                                                                                                                  // 83
  return this;                                                                                                    // 84
};                                                                                                                // 85
                                                                                                                  // 86
/**                                                                                                               // 87
 * Just to support legacy calling. Doesn't really serve much purpose.                                             // 88
 */                                                                                                               // 89
Router.prototype.map = function (fn) {                                                                            // 90
  return fn.call(this);                                                                                           // 91
};                                                                                                                // 92
                                                                                                                  // 93
/*                                                                                                                // 94
 * XXX removing for now until this is thought about more carefully.                                               // 95
Router.prototype.use = function (path, fn, opts) {                                                                // 96
  if (typeof path === 'function') {                                                                               // 97
    opts = fn || {};                                                                                              // 98
    opts.mount = true;                                                                                            // 99
    opts.where = opts.where || 'server';                                                                          // 100
    this._stack.push(path, opts);                                                                                 // 101
  } else {                                                                                                        // 102
    opts = opts || {};                                                                                            // 103
    opts.mount = true;                                                                                            // 104
    opts.where = opts.where || 'server';                                                                          // 105
    this._stack.push(path, fn, opts);                                                                             // 106
  }                                                                                                               // 107
                                                                                                                  // 108
  return this;                                                                                                    // 109
};                                                                                                                // 110
*/                                                                                                                // 111
                                                                                                                  // 112
//XXX seems like we could put a params method on the route directly and make it reactive                          // 113
Router.prototype.route = function (path, fn, opts) {                                                              // 114
  var typeOf = function (val) { return Object.prototype.toString.call(val); };                                    // 115
  assert(typeOf(path) === '[object String]' || typeOf(path) === '[object RegExp]', "Router.route requires a path that is a string or regular expression.");
                                                                                                                  // 117
  if (typeof fn === 'object') {                                                                                   // 118
    opts = fn;                                                                                                    // 119
    fn = opts.action;                                                                                             // 120
  }                                                                                                               // 121
                                                                                                                  // 122
  var route = new Route(path, fn, opts);                                                                          // 123
                                                                                                                  // 124
  opts = opts || {};                                                                                              // 125
                                                                                                                  // 126
  // don't mount the route                                                                                        // 127
  opts.mount = false;                                                                                             // 128
                                                                                                                  // 129
  // stack expects a function which is exactly what a new Route returns!                                          // 130
  var handler = this._stack.push(path, route, opts);                                                              // 131
                                                                                                                  // 132
  handler.route = route;                                                                                          // 133
  route.handler = handler;                                                                                        // 134
  route.router = this;                                                                                            // 135
                                                                                                                  // 136
  assert(!this.routes._byPath[handler.path],                                                                      // 137
    "A route for the path " + JSON.stringify(handler.path) + " already exists by the name of " + JSON.stringify(handler.name) + ".");
  this.routes._byPath[handler.path] = route;                                                                      // 139
                                                                                                                  // 140
  this.routes.push(route);                                                                                        // 141
                                                                                                                  // 142
  if (typeof handler.name === 'string')                                                                           // 143
    this.routes[handler.name] = route;                                                                            // 144
                                                                                                                  // 145
  return route;                                                                                                   // 146
};                                                                                                                // 147
                                                                                                                  // 148
/**                                                                                                               // 149
 * Find the first route for the given url and options.                                                            // 150
 */                                                                                                               // 151
Router.prototype.findFirstRoute = function (url) {                                                                // 152
  var isMatch;                                                                                                    // 153
  var routeHandler;                                                                                               // 154
  for (var i = 0; i < this.routes.length; i++) {                                                                  // 155
    route = this.routes[i];                                                                                       // 156
                                                                                                                  // 157
    // only matches if the url matches AND the                                                                    // 158
    // current environment matches.                                                                               // 159
    isMatch = route.handler.test(url, {                                                                           // 160
      where: Meteor.isServer ? 'server' : 'client'                                                                // 161
    });                                                                                                           // 162
                                                                                                                  // 163
    if (isMatch)                                                                                                  // 164
      return route;                                                                                               // 165
  }                                                                                                               // 166
                                                                                                                  // 167
  return null;                                                                                                    // 168
};                                                                                                                // 169
                                                                                                                  // 170
Router.prototype.path = function (routeName, params, options) {                                                   // 171
  var route = this.routes[routeName];                                                                             // 172
  warn(route, "You called Router.path for a route named " + JSON.stringify(routeName) + " but that route doesn't seem to exist. Are you sure you created it?");
  return route && route.path(params, options);                                                                    // 174
};                                                                                                                // 175
                                                                                                                  // 176
Router.prototype.url = function (routeName, params, options) {                                                    // 177
  var route = this.routes[routeName];                                                                             // 178
  warn(route, "You called Router.url for a route named " + JSON.stringify(routeName) + " but that route doesn't seem to exist. Are you sure you created it?");
  return route && route.url(params, options);                                                                     // 180
};                                                                                                                // 181
                                                                                                                  // 182
/**                                                                                                               // 183
 * Create a new controller for a dispatch.                                                                        // 184
 */                                                                                                               // 185
Router.prototype.createController = function (url, context) {                                                     // 186
  // see if there's a route for this url and environment                                                          // 187
  // it's possible that we find a route but it's a client                                                         // 188
  // route so we don't instantiate its controller and instead                                                     // 189
  // use an anonymous controller to run the route.                                                                // 190
  var route = this.findFirstRoute(url);                                                                           // 191
  var controller;                                                                                                 // 192
                                                                                                                  // 193
  context = context || {};                                                                                        // 194
                                                                                                                  // 195
  if (route)                                                                                                      // 196
    // let the route decide what controller to use                                                                // 197
    controller = route.createController({layout: this._layout});                                                  // 198
  else                                                                                                            // 199
    // create an anonymous controller                                                                             // 200
    controller = new RouteController({layout: this._layout});                                                     // 201
                                                                                                                  // 202
  controller.router = this;                                                                                       // 203
  controller.configureFromUrl(url, context, {reactive: false});                                                   // 204
  return controller;                                                                                              // 205
};                                                                                                                // 206
                                                                                                                  // 207
Router.prototype.setTemplateNameConverter = function (fn) {                                                       // 208
  this._templateNameConverter = fn;                                                                               // 209
  return this;                                                                                                    // 210
};                                                                                                                // 211
                                                                                                                  // 212
Router.prototype.setControllerNameConverter = function (fn) {                                                     // 213
  this._controllerNameConverter = fn;                                                                             // 214
  return this;                                                                                                    // 215
};                                                                                                                // 216
                                                                                                                  // 217
Router.prototype.toTemplateName = function (str) {                                                                // 218
  if (this._templateNameConverter)                                                                                // 219
    return this._templateNameConverter(str);                                                                      // 220
  else                                                                                                            // 221
    return Iron.utils.classCase(str);                                                                             // 222
};                                                                                                                // 223
                                                                                                                  // 224
Router.prototype.toControllerName = function (str) {                                                              // 225
  if (this._controllerNameConverter)                                                                              // 226
    return this._controllerNameConverter(str);                                                                    // 227
  else                                                                                                            // 228
    return Iron.utils.classCase(str) + 'Controller';                                                              // 229
};                                                                                                                // 230
                                                                                                                  // 231
/**                                                                                                               // 232
 *                                                                                                                // 233
 * Add a hook to all routes. The hooks will apply to all routes,                                                  // 234
 * unless you name routes to include or exclude via `only` and `except` options                                   // 235
 *                                                                                                                // 236
 * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                                            // 237
 * @param {Object} [options] Options to controll the hooks [optional]                                             // 238
 * @param {Function} [hook] Callback to run                                                                       // 239
 * @return {IronRouter}                                                                                           // 240
 * @api public                                                                                                    // 241
 *                                                                                                                // 242
 */                                                                                                               // 243
                                                                                                                  // 244
Router.prototype.addHook = function(type, hook, options) {                                                        // 245
  var self = this;                                                                                                // 246
                                                                                                                  // 247
  options = options || {};                                                                                        // 248
                                                                                                                  // 249
  var toArray = function (input) {                                                                                // 250
    if (!input)                                                                                                   // 251
      return [];                                                                                                  // 252
    else if (_.isArray(input))                                                                                    // 253
      return input;                                                                                               // 254
    else                                                                                                          // 255
      return [input];                                                                                             // 256
  }                                                                                                               // 257
                                                                                                                  // 258
  if (options.only)                                                                                               // 259
    options.only = toArray(options.only);                                                                         // 260
  if (options.except)                                                                                             // 261
    options.except = toArray(options.except);                                                                     // 262
                                                                                                                  // 263
  var hooks = this._globalHooks[type] = this._globalHooks[type] || [];                                            // 264
                                                                                                                  // 265
  var hookWithOptions = function () {                                                                             // 266
    var thisArg = this;                                                                                           // 267
    var args = arguments;                                                                                         // 268
    // this allows us to bind hooks to options that get looked up when you call                                   // 269
    // this.lookupOption from within the hook. And it looks better to keep                                        // 270
    // plugin/hook related options close to their definitions instead of                                          // 271
    // Router.configure. But we use a dynamic variable so we don't have to                                        // 272
    // pass the options explicitly as an argument and plugin creators can                                         // 273
    // just use this.lookupOption which will follow the proper lookup chain from                                  // 274
    // "this", local options, dynamic variable options, route, router, etc.                                       // 275
    return CurrentOptions.withValue(options, function () {                                                        // 276
      return self.lookupHook(hook).apply(thisArg, args);                                                          // 277
    });                                                                                                           // 278
  };                                                                                                              // 279
                                                                                                                  // 280
  hooks.push({options: options, hook: hookWithOptions});                                                          // 281
  return this;                                                                                                    // 282
};                                                                                                                // 283
                                                                                                                  // 284
/**                                                                                                               // 285
 * If the argument is a function return it directly. If it's a string, see if                                     // 286
 * there is a function in the Iron.Router.hooks namespace. Throw an error if we                                   // 287
 * can't find the hook.                                                                                           // 288
 */                                                                                                               // 289
Router.prototype.lookupHook = function (nameOrFn) {                                                               // 290
  var fn = nameOrFn;                                                                                              // 291
                                                                                                                  // 292
  // if we already have a func just return it                                                                     // 293
  if (_.isFunction(fn))                                                                                           // 294
    return fn;                                                                                                    // 295
                                                                                                                  // 296
  // look up one of the out-of-box hooks like                                                                     // 297
  // 'loaded or 'dataNotFound' if the nameOrFn is a                                                               // 298
  // string                                                                                                       // 299
  if (_.isString(fn)) {                                                                                           // 300
    if (_.isFunction(Iron.Router.hooks[fn]))                                                                      // 301
      return Iron.Router.hooks[fn];                                                                               // 302
  }                                                                                                               // 303
                                                                                                                  // 304
  // we couldn't find it so throw an error                                                                        // 305
  throw new Error("No hook found named: " + nameOrFn);                                                            // 306
};                                                                                                                // 307
                                                                                                                  // 308
/**                                                                                                               // 309
 *                                                                                                                // 310
 * Fetch the list of global hooks that apply to the given route name.                                             // 311
 * Hooks are defined by the .addHook() function above.                                                            // 312
 *                                                                                                                // 313
 * @param {String} [type] one of IronRouter.HOOK_TYPES                                                            // 314
 * @param {String} [name] the name of the route we are interested in                                              // 315
 * @return {[Function]} [hooks] an array of hooks to run                                                          // 316
 * @api public                                                                                                    // 317
 *                                                                                                                // 318
 */                                                                                                               // 319
                                                                                                                  // 320
Router.prototype.getHooks = function(type, name) {                                                                // 321
  var self = this;                                                                                                // 322
  var hooks = [];                                                                                                 // 323
                                                                                                                  // 324
  _.each(this._globalHooks[type], function(hook) {                                                                // 325
    var options = hook.options;                                                                                   // 326
                                                                                                                  // 327
    if (options.except && _.include(options.except, name))                                                        // 328
      return [];                                                                                                  // 329
                                                                                                                  // 330
    if (options.only && ! _.include(options.only, name))                                                          // 331
      return [];                                                                                                  // 332
                                                                                                                  // 333
    hooks.push(hook.hook);                                                                                        // 334
  });                                                                                                             // 335
                                                                                                                  // 336
  return hooks;                                                                                                   // 337
};                                                                                                                // 338
                                                                                                                  // 339
Router.HOOK_TYPES = [                                                                                             // 340
  'onRun',                                                                                                        // 341
  'onRerun',                                                                                                      // 342
  'onBeforeAction',                                                                                               // 343
  'onAfterAction',                                                                                                // 344
  'onStop',                                                                                                       // 345
                                                                                                                  // 346
  // not technically a hook but we'll use it                                                                      // 347
  // in a similar way. This will cause waitOn                                                                     // 348
  // to be added as a method to the Router and then                                                               // 349
  // it can be selectively applied to specific routes                                                             // 350
  'waitOn',                                                                                                       // 351
  'subscriptions',                                                                                                // 352
                                                                                                                  // 353
  // legacy hook types but we'll let them slide                                                                   // 354
  'load', // onRun                                                                                                // 355
  'before', // onBeforeAction                                                                                     // 356
  'after', // onAfterAction                                                                                       // 357
  'unload' // onStop                                                                                              // 358
];                                                                                                                // 359
                                                                                                                  // 360
/**                                                                                                               // 361
 * A namespace for hooks keyed by name.                                                                           // 362
 */                                                                                                               // 363
Router.hooks = {};                                                                                                // 364
                                                                                                                  // 365
                                                                                                                  // 366
/**                                                                                                               // 367
 * A namespace for plugin functions keyed by name.                                                                // 368
 */                                                                                                               // 369
Router.plugins = {};                                                                                              // 370
                                                                                                                  // 371
/**                                                                                                               // 372
 * Auto add helper mtehods for all the hooks.                                                                     // 373
 */                                                                                                               // 374
                                                                                                                  // 375
_.each(Router.HOOK_TYPES, function (type) {                                                                       // 376
  Router.prototype[type] = function (hook, options) {                                                             // 377
    this.addHook(type, hook, options);                                                                            // 378
  };                                                                                                              // 379
});                                                                                                               // 380
                                                                                                                  // 381
/**                                                                                                               // 382
 * Add a plugin to the router instance.                                                                           // 383
 */                                                                                                               // 384
Router.prototype.plugin = function (nameOrFn, options) {                                                          // 385
  var func;                                                                                                       // 386
                                                                                                                  // 387
  if (typeof nameOrFn === 'function')                                                                             // 388
    func = nameOrFn;                                                                                              // 389
  else if (typeof nameOrFn === 'string')                                                                          // 390
    func = Iron.Router.plugins[nameOrFn];                                                                         // 391
                                                                                                                  // 392
  if (!func)                                                                                                      // 393
    throw new Error("No plugin found named " + JSON.stringify(nameOrFn));                                         // 394
                                                                                                                  // 395
  // fn(router, options)                                                                                          // 396
  func.call(this, this, options);                                                                                 // 397
                                                                                                                  // 398
  return this;                                                                                                    // 399
};                                                                                                                // 400
                                                                                                                  // 401
Iron.Router = Router;                                                                                             // 402
                                                                                                                  // 403
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/hooks.js                                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
if (typeof Template !== 'undefined') {                                                                            // 1
  /**                                                                                                             // 2
   * The default anonymous loading template.                                                                      // 3
   */                                                                                                             // 4
  var defaultLoadingTemplate = new Template('DefaultLoadingTemplate', function () {                               // 5
    return 'Loading...';                                                                                          // 6
  });                                                                                                             // 7
                                                                                                                  // 8
  /**                                                                                                             // 9
   * The default anonymous data not found template.                                                               // 10
   */                                                                                                             // 11
  var defaultDataNotFoundTemplate = new Template('DefaultDataNotFoundTemplate', function () {                     // 12
    return 'Data not found...';                                                                                   // 13
  });                                                                                                             // 14
}                                                                                                                 // 15
                                                                                                                  // 16
/**                                                                                                               // 17
 * Automatically render a loading template into the main region if the                                            // 18
 * controller is not ready (i.e. this.ready() is false). If no loadingTemplate                                    // 19
 * is defined use some default text.                                                                              // 20
 */                                                                                                               // 21
                                                                                                                  // 22
Router.hooks.loading = function () {                                                                              // 23
  // if we're ready just pass through                                                                             // 24
  if (this.ready()) {                                                                                             // 25
    this.next();                                                                                                  // 26
    return;                                                                                                       // 27
  }                                                                                                               // 28
                                                                                                                  // 29
  var template = this.lookupOption('loadingTemplate');                                                            // 30
  this.render(template || defaultLoadingTemplate);                                                                // 31
  this.renderRegions();                                                                                           // 32
};                                                                                                                // 33
                                                                                                                  // 34
/**                                                                                                               // 35
 * Render a "data not found" template if a global data function returns a falsey                                  // 36
 * value                                                                                                          // 37
 */                                                                                                               // 38
Router.hooks.dataNotFound = function () {                                                                         // 39
  if (!this.ready()) {                                                                                            // 40
    this.next();                                                                                                  // 41
    return;                                                                                                       // 42
  }                                                                                                               // 43
                                                                                                                  // 44
  var data = this.lookupOption('data');                                                                           // 45
  var dataValue;                                                                                                  // 46
  var template = this.lookupOption('notFoundTemplate');                                                           // 47
                                                                                                                  // 48
  if (typeof data === 'function') {                                                                               // 49
    if (!(dataValue = data.call(this))) {                                                                         // 50
      this.render(template || defaultDataNotFoundTemplate);                                                       // 51
      this.renderRegions();                                                                                       // 52
      return;                                                                                                     // 53
    }                                                                                                             // 54
  }                                                                                                               // 55
                                                                                                                  // 56
  // okay never mind just pass along now                                                                          // 57
  this.next();                                                                                                    // 58
};                                                                                                                // 59
                                                                                                                  // 60
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/helpers.js                                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
var warn = Iron.utils.warn;                                                                                       // 4
var DynamicTemplate = Iron.DynamicTemplate;                                                                       // 5
var debug = Iron.utils.debug('iron:router <helpers>');                                                            // 6
                                                                                                                  // 7
/*****************************************************************************/                                   // 8
/* UI Helpers */                                                                                                  // 9
/*****************************************************************************/                                   // 10
                                                                                                                  // 11
/**                                                                                                               // 12
 * Render the Router to a specific location on the page instead of the                                            // 13
 * document.body.                                                                                                 // 14
 */                                                                                                               // 15
UI.registerHelper('Router', new Blaze.Template('Router', function () {                                            // 16
  return Router.createView();                                                                                     // 17
}));                                                                                                              // 18
                                                                                                                  // 19
/**                                                                                                               // 20
 * Returns a relative path given a route name, data context and optional query                                    // 21
 * and hash parameters.                                                                                           // 22
 */                                                                                                               // 23
UI.registerHelper('pathFor', function (options) {                                                                 // 24
  var routeName;                                                                                                  // 25
                                                                                                                  // 26
  if (arguments.length > 1) {                                                                                     // 27
    routeName = arguments[0];                                                                                     // 28
    options = arguments[1] || {};                                                                                 // 29
  }                                                                                                               // 30
                                                                                                                  // 31
  var opts = options && options.hash;                                                                             // 32
                                                                                                                  // 33
  opts = opts || {};                                                                                              // 34
                                                                                                                  // 35
  var path = '';                                                                                                  // 36
  var query = opts.query;                                                                                         // 37
  var hash = opts.hash;                                                                                           // 38
  var routeName = routeName || opts.route;                                                                        // 39
  var data = _.extend({}, opts.data || this);                                                                     // 40
                                                                                                                  // 41
  var route = Router.routes[routeName];                                                                           // 42
  warn(route, "pathFor couldn't find a route named " + JSON.stringify(routeName));                                // 43
                                                                                                                  // 44
  if (route) {                                                                                                    // 45
    _.each(route.handler.compiledUrl.keys, function (keyConfig) {                                                 // 46
      var key = keyConfig.name;                                                                                   // 47
      if (_.has(opts, key)) {                                                                                     // 48
        data[key] = EJSON.clone(opts[key]);                                                                       // 49
                                                                                                                  // 50
        // so the option doesn't end up on the element as an attribute                                            // 51
        delete opts[key];                                                                                         // 52
      }                                                                                                           // 53
    });                                                                                                           // 54
                                                                                                                  // 55
    path = route.path(data, {query: query, hash: hash});                                                          // 56
  }                                                                                                               // 57
                                                                                                                  // 58
  return path;                                                                                                    // 59
});                                                                                                               // 60
                                                                                                                  // 61
/**                                                                                                               // 62
 * Returns a relative path given a route name, data context and optional query                                    // 63
 * and hash parameters.                                                                                           // 64
 */                                                                                                               // 65
UI.registerHelper('urlFor', function (options) {                                                                  // 66
  var routeName;                                                                                                  // 67
                                                                                                                  // 68
  if (arguments.length > 1) {                                                                                     // 69
    routeName = arguments[0];                                                                                     // 70
    options = arguments[1] || {};                                                                                 // 71
  }                                                                                                               // 72
                                                                                                                  // 73
  var opts = options && options.hash;                                                                             // 74
                                                                                                                  // 75
  opts = opts || {};                                                                                              // 76
  var url = '';                                                                                                   // 77
  var query = opts.query;                                                                                         // 78
  var hash = opts.hash;                                                                                           // 79
  var routeName = routeName || opts.route;                                                                        // 80
  var data = _.extend({}, opts.data || this);                                                                     // 81
                                                                                                                  // 82
  var route = Router.routes[routeName];                                                                           // 83
  warn(route, "urlFor couldn't find a route named " + JSON.stringify(routeName));                                 // 84
                                                                                                                  // 85
  if (route) {                                                                                                    // 86
    _.each(route.handler.compiledUrl.keys, function (keyConfig) {                                                 // 87
      var key = keyConfig.name;                                                                                   // 88
      if (_.has(opts, key)) {                                                                                     // 89
        data[key] = EJSON.clone(opts[key]);                                                                       // 90
                                                                                                                  // 91
        // so the option doesn't end up on the element as an attribute                                            // 92
        delete opts[key];                                                                                         // 93
      }                                                                                                           // 94
    });                                                                                                           // 95
                                                                                                                  // 96
    url = route.url(data, {query: query, hash: hash});                                                            // 97
  }                                                                                                               // 98
                                                                                                                  // 99
  return url;                                                                                                     // 100
});                                                                                                               // 101
                                                                                                                  // 102
/**                                                                                                               // 103
 * Create a link with optional content block.                                                                     // 104
 *                                                                                                                // 105
 * Example:                                                                                                       // 106
 *   {{#linkTo route="one" query="query" hash="hash" class="my-cls"}}                                             // 107
 *    <div>My Custom Link Content</div>                                                                           // 108
 *   {{/linkTo}}                                                                                                  // 109
 */                                                                                                               // 110
UI.registerHelper('linkTo', new Blaze.Template('linkTo', function () {                                            // 111
  var self = this;                                                                                                // 112
  var opts = DynamicTemplate.getInclusionArguments(this);                                                         // 113
                                                                                                                  // 114
  if (typeof opts !== 'object')                                                                                   // 115
    throw new Error("linkTo options must be key value pairs such as {{#linkTo route='my.route.name'}}. You passed: " + JSON.stringify(opts));
                                                                                                                  // 117
  opts = opts || {};                                                                                              // 118
  var path = '';                                                                                                  // 119
  var query = opts.query;                                                                                         // 120
  var hash = opts.hash;                                                                                           // 121
  var routeName = opts.route;                                                                                     // 122
  var data = _.extend({}, opts.data || DynamicTemplate.getParentDataContext(this));                               // 123
  var route = Router.routes[routeName];                                                                           // 124
  var paramKeys;                                                                                                  // 125
                                                                                                                  // 126
  warn(route, "linkTo couldn't find a route named " + JSON.stringify(routeName));                                 // 127
                                                                                                                  // 128
  if (route) {                                                                                                    // 129
    _.each(route.handler.compiledUrl.keys, function (keyConfig) {                                                 // 130
      var key = keyConfig.name;                                                                                   // 131
      if (_.has(opts, key)) {                                                                                     // 132
        data[key] = EJSON.clone(opts[key]);                                                                       // 133
                                                                                                                  // 134
        // so the option doesn't end up on the element as an attribute                                            // 135
        delete opts[key];                                                                                         // 136
      }                                                                                                           // 137
    });                                                                                                           // 138
                                                                                                                  // 139
    path = route.path(data, {query: query, hash: hash});                                                          // 140
  }                                                                                                               // 141
                                                                                                                  // 142
  // anything that isn't one of our keywords we'll assume is an attributed                                        // 143
  // intended for the <a> tag                                                                                     // 144
  var attrs = _.omit(opts, 'route', 'query', 'hash', 'data');                                                     // 145
  attrs.href = path;                                                                                              // 146
                                                                                                                  // 147
  return Blaze.With(function () {                                                                                 // 148
    return DynamicTemplate.getParentDataContext(self);                                                            // 149
  }, function () {                                                                                                // 150
    return HTML.A(attrs, self.templateContentBlock);                                                              // 151
  });                                                                                                             // 152
}));                                                                                                              // 153
                                                                                                                  // 154
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/router_client.js                                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var MiddlewareStack = Iron.MiddlewareStack;                                                                       // 1
var Url = Iron.Url;                                                                                               // 2
var Layout = Iron.Layout;                                                                                         // 3
var assert = Iron.utils.assert;                                                                                   // 4
var DEFAULT_NOT_FOUND_TEMPLATE = '__IronRouterNotFound__';                                                        // 5
var NO_ROUTES_TEMPLATE = '__IronRouterNoRoutes__';                                                                // 6
                                                                                                                  // 7
/**                                                                                                               // 8
 * Client specific initialization.                                                                                // 9
 */                                                                                                               // 10
Router.prototype.init = function (options) {                                                                      // 11
  var self = this;                                                                                                // 12
                                                                                                                  // 13
  // the current RouteController from a dispatch                                                                  // 14
  self._currentController = null;                                                                                 // 15
                                                                                                                  // 16
  // the current route                                                                                            // 17
  self._currentRoute = null;                                                                                      // 18
                                                                                                                  // 19
  // the current() dep                                                                                            // 20
  self._currentDep = new Deps.Dependency;                                                                         // 21
                                                                                                                  // 22
  // the location computation                                                                                     // 23
  self._locationComputation = null;                                                                               // 24
                                                                                                                  // 25
  // the ui layout for the router                                                                                 // 26
  self._layout = new Layout({template: self.options.layoutTemplate});                                             // 27
                                                                                                                  // 28
  Meteor.startup(function () {                                                                                    // 29
    setTimeout(function maybeAutoInsertRouter () {                                                                // 30
      if (self.options.autoRender !== false)                                                                      // 31
        self.insert({el: document.body});                                                                         // 32
    });                                                                                                           // 33
  });                                                                                                             // 34
};                                                                                                                // 35
                                                                                                                  // 36
/**                                                                                                               // 37
 * Programmatically insert the router into document.body or a particular                                          // 38
 * element with {el: 'selector'}                                                                                  // 39
 */                                                                                                               // 40
Router.prototype.insert = function (options) {                                                                    // 41
  this._layout.insert(options);                                                                                   // 42
  return this;                                                                                                    // 43
};                                                                                                                // 44
                                                                                                                  // 45
/**                                                                                                               // 46
 * Returns a layout view that can be used in a UI helper to render the router                                     // 47
 * to a particular place.                                                                                         // 48
 */                                                                                                               // 49
Router.prototype.createView = function () {                                                                       // 50
  return this._layout.create();                                                                                   // 51
};                                                                                                                // 52
                                                                                                                  // 53
Router.prototype.lookupNotFoundTemplate = function () {                                                           // 54
  if (this.options.notFoundTemplate)                                                                              // 55
    return this.options.notFoundTemplate;                                                                         // 56
                                                                                                                  // 57
  return (this.routes.length === 0) ? NO_ROUTES_TEMPLATE : DEFAULT_NOT_FOUND_TEMPLATE;                            // 58
};                                                                                                                // 59
                                                                                                                  // 60
Router.prototype.lookupLayoutTemplate = function () {                                                             // 61
  return this.options.layoutTemplate;                                                                             // 62
};                                                                                                                // 63
                                                                                                                  // 64
Router.prototype.dispatch = function (url, context, done) {                                                       // 65
  var self = this;                                                                                                // 66
                                                                                                                  // 67
  assert(typeof url === 'string', "expected url string in router dispatch");                                      // 68
                                                                                                                  // 69
  var controller = this._currentController;                                                                       // 70
  var route = this.findFirstRoute(url);                                                                           // 71
  var prevRoute = this._currentRoute;                                                                             // 72
                                                                                                                  // 73
  this._currentRoute = route;                                                                                     // 74
                                                                                                                  // 75
                                                                                                                  // 76
  // even if we already have an existing controller we'll stop it                                                 // 77
  // and start it again. But since the actual controller instance                                                 // 78
  // hasn't changed, the helpers won't need to rerun.                                                             // 79
  if (this._currentController)                                                                                    // 80
    this._currentController.stop();                                                                               // 81
                                                                                                                  // 82
  //XXX Instead of this, let's consider making all RouteControllers                                               // 83
  //    singletons that get configured at dispatch. Will revisit this                                             // 84
  //    after v1.0.                                                                                               // 85
  if (controller && route && prevRoute === route) {                                                               // 86
    // this will change the parameters dep so anywhere you call                                                   // 87
    // this.getParams will rerun if the parameters have changed                                                   // 88
    controller.configureFromUrl(url, context);                                                                    // 89
  } else {                                                                                                        // 90
    // Looks like we're on a new route so we'll create a new                                                      // 91
    // controller from scratch.                                                                                   // 92
    controller = this.createController(url, context);                                                             // 93
  }                                                                                                               // 94
                                                                                                                  // 95
  this._currentController = controller;                                                                           // 96
                                                                                                                  // 97
  controller.dispatch(self._stack, url, function onRouterDispatchCompleted (err) {                                // 98
    if (err)                                                                                                      // 99
      throw err;                                                                                                  // 100
    else {                                                                                                        // 101
      if (!controller.isHandled()) {                                                                              // 102
        // if we aren't at the initial state, we haven't yet given the server                                     // 103
        //   a true chance to handle this URL. We'll try.                                                         // 104
        //   if the server CAN'T handle the router, we'll be back,                                                // 105
        //   but as the very first route handled on the client,                                                   // 106
        //   and so initial will be true.                                                                         // 107
        var state = Deps.nonreactive(function () { return controller.location.get().options.historyState; });     // 108
                                                                                                                  // 109
        if (state && state.initial === true) {                                                                    // 110
          // looks like there's no handlers so let's give a default                                               // 111
          // not found message! Use the layout defined in global config                                           // 112
          // if we have one.                                                                                      // 113
          //                                                                                                      // 114
          // NOTE: this => controller                                                                             // 115
          this.layout(this.lookupOption('layoutTemplate'), {data: {url: this.url}});                              // 116
                                                                                                                  // 117
          var notFoundTemplate = this.lookupOption('notFoundTemplate');                                           // 118
                                                                                                                  // 119
          if (!notFoundTemplate)                                                                                  // 120
            notFoundTemplate = (self.routes.length === 0) ? NO_ROUTES_TEMPLATE : DEFAULT_NOT_FOUND_TEMPLATE;      // 121
          this.render(notFoundTemplate, {data: {url: this.url}});                                                 // 122
          this.renderRegions();                                                                                   // 123
                                                                                                                  // 124
          // kind of janky but will work for now. this makes sure                                                 // 125
          // that any downstream functions see that this route has been                                           // 126
          // handled so we don't get into an infinite loop with the                                               // 127
          // server.                                                                                              // 128
          controller.isHandled = function () { return true; };                                                    // 129
        }                                                                                                         // 130
                                                                                                                  // 131
        return done && done.call(controller);                                                                     // 132
      }                                                                                                           // 133
    }                                                                                                             // 134
  });                                                                                                             // 135
                                                                                                                  // 136
  // Note: even if the controller didn't actually change I change the                                             // 137
  // currentDep since if we did a dispatch, the url changed and that                                              // 138
  // means either we have a new controller OR the parameters for an                                               // 139
  // existing controller have changed.                                                                            // 140
  if (this._currentController == controller)                                                                      // 141
    this._currentDep.changed();                                                                                   // 142
                                                                                                                  // 143
  return controller;                                                                                              // 144
};                                                                                                                // 145
                                                                                                                  // 146
/**                                                                                                               // 147
 * The current controller object.                                                                                 // 148
 */                                                                                                               // 149
Router.prototype.current = function () {                                                                          // 150
  this._currentDep.depend();                                                                                      // 151
  return this._currentController;                                                                                 // 152
};                                                                                                                // 153
                                                                                                                  // 154
/*                                                                                                                // 155
 * Scroll to a specific location on the page.                                                                     // 156
 * Overridable by applications that want to customize this behavior.                                              // 157
 */                                                                                                               // 158
Router.prototype._scrollToHash = function (hashValue) {                                                           // 159
  try {                                                                                                           // 160
    var $target = $(hashValue);                                                                                   // 161
    $('html, body').scrollTop($target.offset().top);                                                              // 162
  } catch (e) {                                                                                                   // 163
    // in case the hashValue is bogus just bail out                                                               // 164
  }                                                                                                               // 165
};                                                                                                                // 166
                                                                                                                  // 167
/**                                                                                                               // 168
 * Start reacting to location changes.                                                                            // 169
 */                                                                                                               // 170
Router.prototype.start = function () {                                                                            // 171
  var self = this;                                                                                                // 172
  var prevLocation;                                                                                               // 173
                                                                                                                  // 174
  self._locationComputation = Deps.autorun(function onLocationChange (c) {                                        // 175
    var controller;                                                                                               // 176
    var loc = Iron.Location.get();                                                                                // 177
    var hash, pathname, search;                                                                                   // 178
    var current = self._currentController;                                                                        // 179
                                                                                                                  // 180
    if (!current || (prevLocation && prevLocation.path !== loc.path)) {                                           // 181
      controller = self.dispatch(loc.href, null, function onRouterStartDispatchCompleted (error) {                // 182
        // if we're going to the server cancel the url change                                                     // 183
        if (!this.isHandled()) {                                                                                  // 184
          loc.cancelUrlChange();                                                                                  // 185
          window.location = loc.path;                                                                             // 186
        }                                                                                                         // 187
      });                                                                                                         // 188
    } else {                                                                                                      // 189
      self._scrollToHash(loc.hash);                                                                               // 190
      // either the query or hash has changed so configure the current                                            // 191
      // controller again.                                                                                        // 192
      current.configureFromUrl(loc.href);                                                                         // 193
    }                                                                                                             // 194
                                                                                                                  // 195
    prevLocation = loc;                                                                                           // 196
  });                                                                                                             // 197
};                                                                                                                // 198
                                                                                                                  // 199
/**                                                                                                               // 200
 * Stop all computations and put us in a not started state.                                                       // 201
 */                                                                                                               // 202
Router.prototype.stop = function () {                                                                             // 203
  if (!this._isStarted)                                                                                           // 204
    return;                                                                                                       // 205
                                                                                                                  // 206
  if (this._locationComputation)                                                                                  // 207
    this._locationComputation.stop();                                                                             // 208
                                                                                                                  // 209
  if (this._currentController)                                                                                    // 210
    this._currentController.stop();                                                                               // 211
                                                                                                                  // 212
  this._isStarted = false;                                                                                        // 213
};                                                                                                                // 214
                                                                                                                  // 215
/**                                                                                                               // 216
 * Go to a given path or route name, optinally pass parameters and options.                                       // 217
 *                                                                                                                // 218
 * Example:                                                                                                       // 219
 * router.go('itemsShowRoute', {_id: 5}, {hash: 'frag', query: 'string});                                         // 220
 */                                                                                                               // 221
Router.prototype.go = function (routeNameOrPath, params, options) {                                               // 222
  var self = this;                                                                                                // 223
  var isPath = /^\/|http/;                                                                                        // 224
  var path;                                                                                                       // 225
                                                                                                                  // 226
  options = options || {};                                                                                        // 227
                                                                                                                  // 228
  if (isPath.test(routeNameOrPath)) {                                                                             // 229
    // it's a path!                                                                                               // 230
    path = routeNameOrPath;                                                                                       // 231
  } else {                                                                                                        // 232
    // it's a route name!                                                                                         // 233
    var route = self.routes[routeNameOrPath];                                                                     // 234
    assert(route, "No route found named " + JSON.stringify(routeNameOrPath));                                     // 235
    path = route.path(params, _.extend(options, {throwOnMissingParams: true}));                                   // 236
  }                                                                                                               // 237
                                                                                                                  // 238
  // let Iron Location handle it and we'll pick up the change in                                                  // 239
  // Iron.Location.get() computation.                                                                             // 240
  Iron.Location.go(path, options);                                                                                // 241
};                                                                                                                // 242
                                                                                                                  // 243
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/plugins.js                                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/**                                                                                                               // 1
 * Simple plugin wrapper around the loading hook.                                                                 // 2
 */                                                                                                               // 3
Router.plugins.loading = function (router, options) {                                                             // 4
  router.onBeforeAction('loading', options);                                                                      // 5
};                                                                                                                // 6
                                                                                                                  // 7
/**                                                                                                               // 8
 * Simple plugin wrapper around the dataNotFound hook.                                                            // 9
 */                                                                                                               // 10
Router.plugins.dataNotFound = function (router, options) {                                                        // 11
  router.onBeforeAction('dataNotFound', options);                                                                 // 12
};                                                                                                                // 13
                                                                                                                  // 14
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/global_router.js                                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Router = new Iron.Router;                                                                                         // 1
                                                                                                                  // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/iron:router/lib/template.templates.js                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
Template.__checkName("__IronRouterNotFound__");                                                                   // 2
Template["__IronRouterNotFound__"] = new Template("Template.__IronRouterNotFound__", (function() {                // 3
  var view = this;                                                                                                // 4
  return HTML.DIV({                                                                                               // 5
    style: "width: 600px; margin: 0 auto; padding: 20px;"                                                         // 6
  }, "\n    ", HTML.DIV({                                                                                         // 7
    style: "font-size: 18pt; color: #999;"                                                                        // 8
  }, "\n      Oops, looks like there's no route on the client or the server for url: \"", Blaze.View(function() { // 9
    return Spacebars.mustache(view.lookup("url"));                                                                // 10
  }), '."\n    '), "\n  ");                                                                                       // 11
}));                                                                                                              // 12
                                                                                                                  // 13
Template.__checkName("__IronRouterNoRoutes__");                                                                   // 14
Template["__IronRouterNoRoutes__"] = new Template("Template.__IronRouterNoRoutes__", (function() {                // 15
  var view = this;                                                                                                // 16
  return HTML.Raw('<div style="font-family: helvetica; color: #777; max-width: 600px; margin: 20px auto;">\n      <h1 style="text-align: center; margin: 0; font-size: 48pt;">\n        iron:router\n      </h1>\n      <p style="text-align: center; font-size: 1.3em;">\n        Organize your Meteor application.\n      </p>\n      <div style="margin: 50px 0px;">\n        <pre style="background: #f2f2f2; margin: 0; padding: 10px;">\nRouter.route(\'/\', function () {\n  this.render(\'Home\', {\n    data: function () { return Items.findOne({_id: this.params._id}); }\n  });\n});\n        </pre>\n      </div>\n      <div style="margin: 50px 0px;">\n        Check it out on Github:<br>\n        <a href="https://github.com/eventedmind/iron-router" target="_blank">https://github.com/eventedmind/iron-router</a>\n        <br>\n        <br>\n        And check out the new Guide:<br>\n        <a href="https://eventedmind.github.io/iron-router" target="_blank">\n          https://eventedmind.github.io/iron-router\n        </a>\n      </div>\n    </div>');
}));                                                                                                              // 18
                                                                                                                  // 19
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:router'] = {
  Router: Router,
  RouteController: RouteController
};

})();
