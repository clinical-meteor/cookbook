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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Template = Package.templating.Template;
var Iron = Package['iron:core'].Iron;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var WaitList, Controller;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/iron:controller/lib/wait_list.js                                               //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/*****************************************************************************/            // 1
/* Imports */                                                                              // 2
/*****************************************************************************/            // 3
var assert = Iron.utils.assert;                                                            // 4
                                                                                           // 5
/*****************************************************************************/            // 6
/* Private */                                                                              // 7
/*****************************************************************************/            // 8
                                                                                           // 9
/**                                                                                        // 10
 * Returns an object of computation ids starting with                                      // 11
 * the current computation and including all ancestor                                      // 12
 * computations. The data structure is an object                                           // 13
 * so we can index by id and do quick checks.                                              // 14
 */                                                                                        // 15
var parentComputations = function () {                                                     // 16
  var list = {};                                                                           // 17
  var c = Deps.currentComputation;                                                         // 18
                                                                                           // 19
  while (c) {                                                                              // 20
    list[String(c._id)] = true;                                                            // 21
    c = c._parent;                                                                         // 22
  }                                                                                        // 23
                                                                                           // 24
  return list;                                                                             // 25
};                                                                                         // 26
                                                                                           // 27
/**                                                                                        // 28
 * Check whether the user has called ready() and then called wait(). This                  // 29
 * can cause a condition that can be simplified to this:                                   // 30
 *                                                                                         // 31
 * dep = new Deps.Dependency;                                                              // 32
 *                                                                                         // 33
 * Deps.autorun(function () {                                                              // 34
 *   dep.depend();                                                                         // 35
 *   dep.changed();                                                                        // 36
 * });                                                                                     // 37
 */                                                                                        // 38
var assertNoInvalidationLoop = function (dependency) {                                     // 39
  var parentComps = parentComputations();                                                  // 40
  var depCompIds = _.keys(dependency._dependentsById);                                     // 41
                                                                                           // 42
  depCompIds.forEach(function (id) {                                                       // 43
    assert(!parentComps[id], "\n\n\
You called wait() after calling ready() inside the same computation tree.\
\n\n\
You can fix this problem in two possible ways:\n\n\
1) Put all of your wait() calls before any ready() calls.\n\
2) Put your ready() call in its own computation with Deps.autorun."                        // 49
    );                                                                                     // 50
  });                                                                                      // 51
};                                                                                         // 52
                                                                                           // 53
                                                                                           // 54
/*****************************************************************************/            // 55
/* WaitList */                                                                             // 56
/*****************************************************************************/            // 57
/**                                                                                        // 58
 * A WaitList tracks a list of reactive functions, each in its own computation.            // 59
 * The list is ready() when all of the functions return true. This list is not             // 60
 * ready (i.e. this.ready() === false) if at least one function returns false.             // 61
 *                                                                                         // 62
 * You add functions by calling the wait(fn) method. Each function is run its              // 63
 * own computation. The ready() method is a reactive method but only calls the             // 64
 * deps changed function if the overall state of the list changes from true to             // 65
 * false or from false to true.                                                            // 66
 */                                                                                        // 67
WaitList = function () {                                                                   // 68
  this._readyDep = new Deps.Dependency;                                                    // 69
  this._comps = [];                                                                        // 70
  this._notReadyCount = 0;                                                                 // 71
};                                                                                         // 72
                                                                                           // 73
/**                                                                                        // 74
 * Pass a function that returns true or false.                                             // 75
 */                                                                                        // 76
WaitList.prototype.wait = function (fn) {                                                  // 77
  var self = this;                                                                         // 78
                                                                                           // 79
  var activeComp = Deps.currentComputation;                                                // 80
                                                                                           // 81
  assertNoInvalidationLoop(self._readyDep);                                                // 82
                                                                                           // 83
  // break with parent computation and grab the new comp                                   // 84
  Deps.nonreactive(function () {                                                           // 85
                                                                                           // 86
    // store the cached result so we can see if it's different from one run to             // 87
    // the next.                                                                           // 88
    var cachedResult = null;                                                               // 89
                                                                                           // 90
    // create a computation for this handle                                                // 91
    var comp = Deps.autorun(function (c) {                                                 // 92
      // let's get the new result coerced into a true or false value.                      // 93
      var result = !!fn();                                                                 // 94
                                                                                           // 95
      var oldNotReadyCount = self._notReadyCount;                                          // 96
                                                                                           // 97
      // if it's the first run and we're false then inc                                    // 98
      if (c.firstRun && !result)                                                           // 99
        self._notReadyCount++;                                                             // 100
      else if (cachedResult !== null && result !== cachedResult && result === true)        // 101
        self._notReadyCount--;                                                             // 102
      else if (cachedResult !== null && result !== cachedResult && result === false)       // 103
        self._notReadyCount++;                                                             // 104
                                                                                           // 105
      cachedResult = result;                                                               // 106
                                                                                           // 107
      if (oldNotReadyCount === 0 && self._notReadyCount > 0)                               // 108
        self._readyDep.changed();                                                          // 109
      else if (oldNotReadyCount > 0 && self._notReadyCount === 0)                          // 110
        self._readyDep.changed();                                                          // 111
    });                                                                                    // 112
                                                                                           // 113
    self._comps.push(comp);                                                                // 114
                                                                                           // 115
    if (activeComp) {                                                                      // 116
      activeComp.onInvalidate(function () {                                                // 117
        // keep the old computation and notReadyCount the same for one                     // 118
        // flush cycle so that we don't end up in an intermediate state                    // 119
        // where list.ready() is not correct.                                              // 120
                                                                                           // 121
        // keep the state the same until the flush cycle is complete                       // 122
        Deps.afterFlush(function () {                                                      // 123
          // stop the computation                                                          // 124
          comp.stop();                                                                     // 125
                                                                                           // 126
          // remove the computation from the list                                          // 127
          self._comps.splice(_.indexOf(self._comps, comp), 1);                             // 128
                                                                                           // 129
          if (cachedResult === false) {                                                    // 130
            self._notReadyCount--;                                                         // 131
                                                                                           // 132
            if (self._notReadyCount === 0)                                                 // 133
              self._readyDep.changed();                                                    // 134
          }                                                                                // 135
        });                                                                                // 136
      });                                                                                  // 137
    }                                                                                      // 138
  });                                                                                      // 139
};                                                                                         // 140
                                                                                           // 141
WaitList.prototype.ready = function () {                                                   // 142
  this._readyDep.depend();                                                                 // 143
  return this._notReadyCount === 0;                                                        // 144
};                                                                                         // 145
                                                                                           // 146
WaitList.prototype.stop = function () {                                                    // 147
  _.each(this._comps, function (c) { c.stop(); });                                         // 148
  this._comps = [];                                                                        // 149
};                                                                                         // 150
                                                                                           // 151
Iron.WaitList = WaitList;                                                                  // 152
                                                                                           // 153
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/iron:controller/lib/controller.js                                              //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/*****************************************************************************/            // 1
/* Imports */                                                                              // 2
/*****************************************************************************/            // 3
var debug = Iron.utils.debug('iron:controller');                                           // 4
var Layout = Iron.Layout;                                                                  // 5
var DynamicTemplate = Iron.DynamicTemplate;                                                // 6
                                                                                           // 7
/*****************************************************************************/            // 8
/* Private */                                                                              // 9
/*****************************************************************************/            // 10
var bindData = function (value, thisArg) {                                                 // 11
  return function () {                                                                     // 12
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;        // 13
  };                                                                                       // 14
};                                                                                         // 15
                                                                                           // 16
/*****************************************************************************/            // 17
/* Controller */                                                                           // 18
/*****************************************************************************/            // 19
Controller = function (options) {                                                          // 20
  var self = this;                                                                         // 21
  this.options = options || {};                                                            // 22
  this._layout = this.options.layout || new Layout(this.options);                          // 23
  this._isController = true;                                                               // 24
  this._layout._setLookupHost(this);                                                       // 25
                                                                                           // 26
  // grab the event map from the Controller constructor which was                          // 27
  // set if the user does MyController.events({...});                                      // 28
  var eventMap = Controller._collectEventMaps.call(this.constructor);                      // 29
  this._layout.events(eventMap, this);                                                     // 30
                                                                                           // 31
  this.init(options);                                                                      // 32
};                                                                                         // 33
                                                                                           // 34
/**                                                                                        // 35
 * Set or get the layout's template and optionally its data context.                       // 36
 */                                                                                        // 37
Controller.prototype.layout = function (template, options) {                               // 38
  var self = this;                                                                         // 39
                                                                                           // 40
  this._layout.template(template);                                                         // 41
                                                                                           // 42
  // check whether options has a data property                                             // 43
  if (options && (_.has(options, 'data')))                                                 // 44
    this._layout.data(bindData(options.data, this));                                       // 45
                                                                                           // 46
  return {                                                                                 // 47
    data: function (val) {                                                                 // 48
      return self._layout.data(bindData(val, self));                                       // 49
    }                                                                                      // 50
  };                                                                                       // 51
};                                                                                         // 52
                                                                                           // 53
/**                                                                                        // 54
 * Render a template into a region of the layout.                                          // 55
 */                                                                                        // 56
Controller.prototype.render = function (template, options) {                               // 57
  var self = this;                                                                         // 58
                                                                                           // 59
  if (options && (typeof options.data !== 'undefined'))                                    // 60
    options.data = bindData(options.data, this);                                           // 61
                                                                                           // 62
  var tmpl = this._layout.render(template, options);                                       // 63
                                                                                           // 64
  // allow caller to do: this.render('MyTemplate').data(function () {...});                // 65
  return {                                                                                 // 66
    data: function (func) {                                                                // 67
      return tmpl.data(bindData(func, self));                                              // 68
    }                                                                                      // 69
  };                                                                                       // 70
};                                                                                         // 71
                                                                                           // 72
/**                                                                                        // 73
 * Begin recording rendered regions.                                                       // 74
 */                                                                                        // 75
Controller.prototype.beginRendering = function (onComplete) {                              // 76
  return this._layout.beginRendering(onComplete);                                          // 77
};                                                                                         // 78
                                                                                           // 79
/*****************************************************************************/            // 80
/* Controller Static Methods */                                                            // 81
/*****************************************************************************/            // 82
/**                                                                                        // 83
 * Inherit from Controller.                                                                // 84
 *                                                                                         // 85
 * Note: The inheritance function in Meteor._inherits is broken. Static                    // 86
 * properties on functions don't get copied.                                               // 87
 */                                                                                        // 88
Controller.extend = function (props) {                                                     // 89
  return Iron.utils.extend(this, props);                                                   // 90
};                                                                                         // 91
                                                                                           // 92
Controller.events = function (events) {                                                    // 93
  this._eventMap = events;                                                                 // 94
  return this;                                                                             // 95
};                                                                                         // 96
                                                                                           // 97
/**                                                                                        // 98
 * Returns a single event map merged from super to child.                                  // 99
 * Called from the constructor function like this:                                         // 100
 *                                                                                         // 101
 * this.constructor._collectEventMaps()                                                    // 102
 */                                                                                        // 103
                                                                                           // 104
var mergeStaticInheritedObjectProperty = function (ctor, prop) {                           // 105
  var merge = {};                                                                          // 106
                                                                                           // 107
  if (ctor.__super__)                                                                      // 108
    _.extend(merge, mergeStaticInheritedObjectProperty(ctor.__super__.constructor, prop)); // 109
                                                                                           // 110
  return _.has(ctor, prop) ? _.extend(merge, ctor[prop]) : merge;                          // 111
};                                                                                         // 112
                                                                                           // 113
Controller._collectEventMaps = function () {                                               // 114
  return mergeStaticInheritedObjectProperty(this, '_eventMap');                            // 115
};                                                                                         // 116
                                                                                           // 117
// NOTE: helpers are not inherited from one controller to another, for now.                // 118
Controller._helpers = {};                                                                  // 119
Controller.helpers = function (helpers) {                                                  // 120
  _.extend(this._helpers, helpers);                                                        // 121
  return this;                                                                             // 122
};                                                                                         // 123
                                                                                           // 124
/*****************************************************************************/            // 125
/* Global Helpers */                                                                       // 126
/*****************************************************************************/            // 127
if (typeof Template !== 'undefined') {                                                     // 128
  /**                                                                                      // 129
   * Returns the nearest controller for a template instance. You can call this             // 130
   * function from inside a template helper.                                               // 131
   *                                                                                       // 132
   * Example:                                                                              // 133
   * Template.MyPage.helpers({                                                             // 134
   *   greeting: function () {                                                             // 135
   *    var controller = Iron.controller();                                                // 136
   *    return controller.state.get('greeting');                                           // 137
   *   }                                                                                   // 138
   * });                                                                                   // 139
   */                                                                                      // 140
  Iron.controller = function () {                                                          // 141
    //XXX establishes a reactive dependency which causes helper to run                     // 142
    return DynamicTemplate.findLookupHostWithProperty(Blaze.getView(), '_isController');   // 143
  };                                                                                       // 144
                                                                                           // 145
  /**                                                                                      // 146
   * Find a lookup host with a state key and return it reactively if we have               // 147
   * it.                                                                                   // 148
   */                                                                                      // 149
  Template.registerHelper('get', function (key) {                                          // 150
    var controller = Iron.controller();                                                    // 151
    if (controller && controller.state)                                                    // 152
      return controller.state.get(key);                                                    // 153
  });                                                                                      // 154
}                                                                                          // 155
/*****************************************************************************/            // 156
/* Namespacing */                                                                          // 157
/*****************************************************************************/            // 158
Iron.Controller = Controller;                                                              // 159
                                                                                           // 160
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/iron:controller/lib/controller_client.js                                       //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/*****************************************************************************/            // 1
/* Imports */                                                                              // 2
/*****************************************************************************/            // 3
var Layout = Iron.Layout;                                                                  // 4
var debug = Iron.utils.debug('iron:controller');                                           // 5
var defaultValue = Iron.utils.defaultValue;                                                // 6
                                                                                           // 7
/*****************************************************************************/            // 8
/* Private */                                                                              // 9
/*****************************************************************************/            // 10
var bindData = function (value, thisArg) {                                                 // 11
  return function () {                                                                     // 12
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;        // 13
  };                                                                                       // 14
};                                                                                         // 15
                                                                                           // 16
/*****************************************************************************/            // 17
/* Controller Client */                                                                    // 18
/*****************************************************************************/            // 19
/**                                                                                        // 20
 * Client specific init code.                                                              // 21
 */                                                                                        // 22
Controller.prototype.init = function (options) {                                           // 23
  this._waitlist = new WaitList;                                                           // 24
  this.state = new ReactiveDict;                                                           // 25
};                                                                                         // 26
                                                                                           // 27
/**                                                                                        // 28
 * Insert the controller's layout into the DOM.                                            // 29
 */                                                                                        // 30
Controller.prototype.insert = function (options) {                                         // 31
  return this._layout.insert.apply(this._layout, arguments);                               // 32
};                                                                                         // 33
                                                                                           // 34
/**                                                                                        // 35
 * Add an item to the waitlist.                                                            // 36
 */                                                                                        // 37
Controller.prototype.wait = function (fn) {                                                // 38
  var self = this;                                                                         // 39
                                                                                           // 40
  if (!fn)                                                                                 // 41
    // it's possible fn is just undefined but we'll just return instead                    // 42
    // of throwing an error, to make it easier to call this function                       // 43
    // with waitOn which might not return anything.                                        // 44
    return;                                                                                // 45
                                                                                           // 46
  if (_.isArray(fn)) {                                                                     // 47
    _.each(fn, function eachWait (fnOrHandle) {                                            // 48
      self.wait(fnOrHandle);                                                               // 49
    });                                                                                    // 50
  } else if (fn.ready) {                                                                   // 51
    this._waitlist.wait(function () { return fn.ready(); });                               // 52
  } else {                                                                                 // 53
    this._waitlist.wait(fn);                                                               // 54
  }                                                                                        // 55
                                                                                           // 56
  return this;                                                                             // 57
};                                                                                         // 58
                                                                                           // 59
/**                                                                                        // 60
 * Returns true if all items in the waitlist are ready.                                    // 61
 */                                                                                        // 62
Controller.prototype.ready = function () {                                                 // 63
  return this._waitlist.ready();                                                           // 64
};                                                                                         // 65
                                                                                           // 66
/**                                                                                        // 67
 * Clean up the controller and stop the waitlist.                                          // 68
 */                                                                                        // 69
Controller.prototype.stop = function () {                                                  // 70
  this._waitlist.stop();                                                                   // 71
};                                                                                         // 72
                                                                                           // 73
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:controller'] = {};

})();
