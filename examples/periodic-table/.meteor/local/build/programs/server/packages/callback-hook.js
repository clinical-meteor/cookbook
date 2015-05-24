(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Hook;

(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/callback-hook/hook.js                                               //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// XXX This pattern is under development. Do not add more callsites             // 1
// using this package for now. See:                                             // 2
// https://meteor.hackpad.com/Design-proposal-Hooks-YxvgEW06q6f                 // 3
//                                                                              // 4
// Encapsulates the pattern of registering callbacks on a hook.                 // 5
//                                                                              // 6
// The `each` method of the hook calls its iterator function argument           // 7
// with each registered callback.  This allows the hook to                      // 8
// conditionally decide not to call the callback (if, for example, the          // 9
// observed object has been closed or terminated).                              // 10
//                                                                              // 11
// Callbacks are bound with `Meteor.bindEnvironment`, so they will be           // 12
// called with the Meteor environment of the calling code that                  // 13
// registered the callback.                                                     // 14
//                                                                              // 15
// Registering a callback returns an object with a single `stop`                // 16
// method which unregisters the callback.                                       // 17
//                                                                              // 18
// The code is careful to allow a callback to be safely unregistered            // 19
// while the callbacks are being iterated over.                                 // 20
//                                                                              // 21
// If the hook is configured with the `exceptionHandler` option, the            // 22
// handler will be called if a called callback throws an exception.             // 23
// By default (if the exception handler doesn't itself throw an                 // 24
// exception, or if the iterator function doesn't return a falsy value          // 25
// to terminate the calling of callbacks), the remaining callbacks              // 26
// will still be called.                                                        // 27
//                                                                              // 28
// Alternatively, the `debugPrintExceptions` option can be specified            // 29
// as string describing the callback.  On an exception the string and           // 30
// the exception will be printed to the console log with                        // 31
// `Meteor._debug`, and the exception otherwise ignored.                        // 32
//                                                                              // 33
// If an exception handler isn't specified, exceptions thrown in the            // 34
// callback will propagate up to the iterator function, and will                // 35
// terminate calling the remaining callbacks if not caught.                     // 36
                                                                                // 37
Hook = function (options) {                                                     // 38
  var self = this;                                                              // 39
  options = options || {};                                                      // 40
  self.nextCallbackId = 0;                                                      // 41
  self.callbacks = {};                                                          // 42
                                                                                // 43
  if (options.exceptionHandler)                                                 // 44
    self.exceptionHandler = options.exceptionHandler;                           // 45
  else if (options.debugPrintExceptions) {                                      // 46
    if (! _.isString(options.debugPrintExceptions))                             // 47
      throw new Error("Hook option debugPrintExceptions should be a string");   // 48
    self.exceptionHandler = options.debugPrintExceptions;                       // 49
  }                                                                             // 50
};                                                                              // 51
                                                                                // 52
_.extend(Hook.prototype, {                                                      // 53
  register: function (callback) {                                               // 54
    var self = this;                                                            // 55
                                                                                // 56
    callback = Meteor.bindEnvironment(                                          // 57
      callback,                                                                 // 58
      self.exceptionHandler || function (exception) {                           // 59
        // Note: this relies on the undocumented fact that if bindEnvironment's // 60
        // onException throws, and you are invoking the callback either in the  // 61
        // browser or from within a Fiber in Node, the exception is propagated. // 62
        throw exception;                                                        // 63
      }                                                                         // 64
    );                                                                          // 65
                                                                                // 66
    var id = self.nextCallbackId++;                                             // 67
    self.callbacks[id] = callback;                                              // 68
                                                                                // 69
    return {                                                                    // 70
      stop: function () {                                                       // 71
        delete self.callbacks[id];                                              // 72
      }                                                                         // 73
    };                                                                          // 74
  },                                                                            // 75
                                                                                // 76
  // For each registered callback, call the passed iterator function            // 77
  // with the callback.                                                         // 78
  //                                                                            // 79
  // The iterator function can choose whether or not to call the                // 80
  // callback.  (For example, it might not call the callback if the             // 81
  // observed object has been closed or terminated).                            // 82
  //                                                                            // 83
  // The iteration is stopped if the iterator function returns a falsy          // 84
  // value or throws an exception.                                              // 85
  //                                                                            // 86
  each: function (iterator) {                                                   // 87
    var self = this;                                                            // 88
                                                                                // 89
    // Invoking bindEnvironment'd callbacks outside of a Fiber in Node doesn't  // 90
    // run them to completion (and exceptions thrown from onException are not   // 91
    // propagated), so we need to be in a Fiber.                                // 92
    Meteor._nodeCodeMustBeInFiber();                                            // 93
                                                                                // 94
    var ids = _.keys(self.callbacks);                                           // 95
    for (var i = 0;  i < ids.length;  ++i) {                                    // 96
      var id = ids[i];                                                          // 97
      // check to see if the callback was removed during iteration              // 98
      if (_.has(self.callbacks, id)) {                                          // 99
        var callback = self.callbacks[id];                                      // 100
                                                                                // 101
        if (! iterator(callback))                                               // 102
          break;                                                                // 103
      }                                                                         // 104
    }                                                                           // 105
  }                                                                             // 106
});                                                                             // 107
                                                                                // 108
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['callback-hook'] = {
  Hook: Hook
};

})();

//# sourceMappingURL=callback-hook.js.map
