(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var Controller;

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
// packages/iron:controller/lib/controller_server.js                                       //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
Controller.prototype.init = function () {};                                                // 1
                                                                                           // 2
Controller.prototype.wait = function () {};                                                // 3
                                                                                           // 4
Controller.prototype.ready = function () {                                                 // 5
  // for now there are no subscribe calls on the server. All data should                   // 6
  // be ready synchronously which means this.ready() should always be true.                // 7
  return true;                                                                             // 8
};                                                                                         // 9
                                                                                           // 10
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:controller'] = {};

})();

//# sourceMappingURL=iron_controller.js.map
