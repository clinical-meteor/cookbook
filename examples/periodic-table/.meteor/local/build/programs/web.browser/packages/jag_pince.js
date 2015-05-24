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

/* Package-scope variables */
var Pince, Logger, MicroEvent, __coffeescriptShare;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/jag:pince/src/microevent.coffee.js                                                          //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var isBrowser, isMeteor, nextTick,            
  __slice = [].slice;

nextTick = (typeof process !== "undefined" && process !== null ? process.nextTick : void 0) != null ? process.nextTick : function(fn) {
  return setTimeout(fn, 0);
};

MicroEvent = (function() {
  function MicroEvent() {}

  MicroEvent.prototype.on = function(event, fct) {
    var _base;
    this._events || (this._events = {});
    (_base = this._events)[event] || (_base[event] = []);
    this._events[event].push(fct);
    return this;
  };

  MicroEvent.prototype.removeListener = function(event, fct) {
    var i, listeners, _base;
    this._events || (this._events = {});
    listeners = ((_base = this._events)[event] || (_base[event] = []));
    i = 0;
    while (i < listeners.length) {
      if (listeners[i] === fct) {
        listeners[i] = void 0;
      }
      i++;
    }
    nextTick((function(_this) {
      return function() {
        var x;
        return _this._events[event] = (function() {
          var _i, _len, _ref, _results;
          _ref = this._events[event];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            if (x) {
              _results.push(x);
            }
          }
          return _results;
        }).call(_this);
      };
    })(this));
    return this;
  };

  MicroEvent.prototype.emit = function() {
    var args, event, fn, _i, _len, _ref, _ref1;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!((_ref = this._events) != null ? _ref[event] : void 0)) {
      return this;
    }
    _ref1 = this._events[event];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      fn = _ref1[_i];
      if (fn) {
        fn.apply(this, args);
      }
    }
    return this;
  };

  return MicroEvent;

})();

MicroEvent.mixin = function(obj) {
  var proto;
  proto = obj.prototype || obj;
  proto.on = MicroEvent.prototype.on;
  proto.removeListener = MicroEvent.prototype.removeListener;
  proto.emit = MicroEvent.prototype.emit;
  return obj;
};

isBrowser = 'undefined' !== typeof window;

isMeteor = 'undefined' !== typeof Meteor;

if (isBrowser || isMeteor) {
  this.MicroEvent = MicroEvent;
} else {
  module.exports = MicroEvent;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/jag:pince/src/console.coffee.js                                                             //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var isBrowser, isMeteor;       

isBrowser = 'undefined' !== typeof window;

isMeteor = 'undefined' !== typeof Meteor;

Pince = {};

Pince._browserOut = function() {
  var log;
  if ((typeof console !== "undefined" && console !== null ? console.log : void 0) == null) {
    return;
  }
  if (arguments.length === 0) {
    return console.log('');
  }
  if (typeof console.log.apply === "function") {
    return console.log.apply(console, arguments);
  } else if (typeof Function.prototype.bind === "function") {
    log = Function.prototype.bind.call(console.log, console);
    return log.apply(console, arguments);
  } else {
    return Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
  }
};

Pince._browserErr = function() {
  var error;
  if ((typeof console !== "undefined" && console !== null ? console.error : void 0) == null) {
    return;
  }
  if (arguments.length === 0) {
    return console.error('');
  }
  if (typeof console.error.apply === "function") {
    return console.error.apply(console, arguments);
  } else if (typeof Function.prototype.bind === "function") {
    error = Function.prototype.bind.call(console.error, console);
    return error.apply(console, arguments);
  } else {
    return Function.prototype.call.call(console.error, console, Array.prototype.slice.call(arguments));
  }
};

Pince.out = function(messages) {
  if (isBrowser) {
    return Pince._browserOut.apply(this, messages);
  } else {
    return console.log.apply(console, messages);
  }
};

Pince.err = function(messages) {
  if (isBrowser) {
    return Pince._browserOut.apply(this, messages);
  } else {
    return console.error.apply(console, messages);
  }
};

if (isBrowser || isMeteor) {
  this.Pince = Pince;
} else {
  module.exports = Pince;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/jag:pince/src/logger.coffee.js                                                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var EventEmitter, LOG_PREFIX, Listener, clc, colors, isBrowser, isMeteor, listener, moment, noop, parseDefaultLogLevel, parseSpecificLogLevels, __levelnums, __loggerLevel, __onError, __specificLoggerLevels, _ref,               
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

isMeteor = 'undefined' !== typeof Meteor;

isBrowser = 'undefined' !== typeof window;

if (isBrowser) {
  moment = function(date) {
    return moment;
  };
  moment.format = function(format) {
    return "";
  };
  EventEmitter = MicroEvent;
} else {
  if (isMeteor) {
    moment = Npm.require('moment');
    EventEmitter = Npm.require('events').EventEmitter;
  } else {
    moment = require('moment');
    EventEmitter = require('events').EventEmitter;
    Pince = require('./console.coffee');
  }
}

__levelnums = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

noop = function(x) {
  return x;
};

if (isBrowser) {
  colors = {
    error: noop,
    warn: noop,
    info: noop,
    debug: noop,
    trace: noop
  };
} else {
  if (isMeteor) {
    clc = Npm.require('cli-color');
  } else {
    clc = require('cli-color');
  }
  colors = {
    error: clc.red.bold,
    warn: clc.yellow,
    info: clc.bold,
    debug: clc.blue,
    trace: clc.blackBright
  };
}

LOG_PREFIX = 'MADEYE_LOGLEVEL';

parseDefaultLogLevel = function() {
  var defaultLogLevel, _ref, _ref1;
  if (isBrowser) {
    if (isMeteor) {
      defaultLogLevel = (_ref = Meteor.settings) != null ? (_ref1 = _ref["public"]) != null ? _ref1.logLevel : void 0 : void 0;
    } else {
      defaultLogLevel = null;
    }
  } else {
    defaultLogLevel = process.env[LOG_PREFIX];
  }
  return defaultLogLevel;
};

parseSpecificLogLevels = function() {
  var k, name, specificLogLevels, v, _ref, _ref1, _ref2, _ref3;
  if (isBrowser) {
    if (isMeteor) {
      return (_ref = (_ref1 = Meteor.settings) != null ? (_ref2 = _ref1["public"]) != null ? _ref2.specificLogLevels : void 0 : void 0) != null ? _ref : {};
    } else {
      return {};
    }
  }
  specificLogLevels = {};
  _ref3 = process.env;
  for (k in _ref3) {
    v = _ref3[k];
    if (k.indexOf("" + LOG_PREFIX + "_") !== 0) {
      continue;
    }
    if (k === LOG_PREFIX) {
      continue;
    }
    name = k.substr(("" + LOG_PREFIX + "_").length);
    name = name.split('_').join(':');
    specificLogLevels[name] = v;
  }
  return specificLogLevels;
};

__loggerLevel = (_ref = parseDefaultLogLevel()) != null ? _ref : 'info';

__specificLoggerLevels = parseSpecificLogLevels();

__onError = null;

Listener = (function() {
  function Listener(options) {
    var _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    if ('string' === typeof options) {
      options = {
        logLevel: options
      };
    }
    this.logLevel = (_ref1 = options.logLevel) != null ? _ref1 : __loggerLevel;
    this.logLevels = (_ref2 = options.logLevels) != null ? _ref2 : __specificLoggerLevels;
    this.loggers = {};
    this.listenFns = {};
  }

  Listener.prototype._reattachLoggers = function() {
    var logger, name, _ref1, _results;
    _ref1 = this.loggers;
    _results = [];
    for (name in _ref1) {
      logger = _ref1[name];
      this.detach(name);
      _results.push(this.listen(logger, name));
    }
    return _results;
  };

  Listener.prototype.setLevel = function(name, level) {
    var levels;
    if (level) {
      if (!name) {
        throw new Error('Must supply a name');
      }
      levels = {};
      levels[name] = level;
      this.setLevels(levels);
      return;
    }
    level = name;
    if (!level) {
      throw new Error('Must supply a level');
    }
    if (this.logLevel === level) {
      return;
    }
    this.logLevel = level;
    this._reattachLoggers();
  };

  Listener.prototype.setLevels = function(levels) {
    var level, name;
    for (name in levels) {
      level = levels[name];
      this.logLevels[name] = level;
    }
    this._reattachLoggers();
  };

  Listener.prototype.findLevelFor = function(name) {
    var lastIdx, level, parentLevel, parentName;
    level = this.logLevels[name];
    parentName = name;
    while ((parentName.indexOf(':') > -1) && !level) {
      lastIdx = parentName.lastIndexOf(':');
      parentName = parentName.substr(0, lastIdx);
      parentLevel = this.logLevels[parentName];
      if (level == null) {
        level = parentLevel;
      }
      if (level) {
        break;
      }
    }
    if (level == null) {
      level = this.logLevel;
    }
    return level;
  };

  Listener.prototype.listen = function(logger, name) {
    var errorFn, level;
    if (!logger) {
      throw Error("An object is required for logging!");
    }
    if (!name) {
      throw Error("Name is required for logging!");
    }
    this.loggers[name] = logger;
    if (level) {
      this.logLevels[name] = level;
    }
    level = this.findLevelFor(name);
    this.listenFns[name] = {};
    errorFn = (function(_this) {
      return function() {
        var msgs, shouldPrint;
        msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        shouldPrint = typeof __onError === "function" ? __onError(msgs) : void 0;
        if (shouldPrint !== false) {
          return _this.handleLog({
            timestamp: new Date,
            level: 'error',
            name: name,
            message: msgs
          });
        }
      };
    })(this);
    logger.on('error', errorFn);
    this.listenFns[name]['error'] = errorFn;
    ['warn', 'info', 'debug', 'trace'].forEach((function(_this) {
      return function(l) {
        var listenFn;
        if (__levelnums[l] > __levelnums[level]) {
          return;
        }
        listenFn = function() {
          var msgs;
          msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this.handleLog({
            timestamp: new Date,
            level: l,
            name: name,
            message: msgs
          });
        };
        logger.on(l, listenFn);
        return _this.listenFns[name][l] = listenFn;
      };
    })(this));
  };

  Listener.prototype.detach = function(name) {
    var level, listenFn, logger, _ref1;
    logger = this.loggers[name];
    if (!logger) {
      return;
    }
    _ref1 = this.listenFns[name];
    for (level in _ref1) {
      listenFn = _ref1[level];
      logger.removeListener(level, listenFn);
    }
    delete this.listenFns[name];
    delete this.loggers[name];
  };

  Listener.prototype.handleLog = function(data) {
    var color, messages, prefix, timestr;
    timestr = moment(data.timestamp).format("YYYY-MM-DD HH:mm:ss.SSS");
    color = colors[data.level];
    prefix = "" + timestr + " " + (color(data.level + ": ")) + " ";
    if (data.name) {
      prefix += "[" + data.name + "] ";
    }
    if ('string' === typeof data.message) {
      messages = [data.message];
    } else {
      messages = data.message;
    }
    messages.unshift(prefix);
    if (__levelnums[data.level] <= __levelnums['warn']) {
      return Pince.err(messages);
    } else {
      return Pince.out(messages);
    }
  };

  return Listener;

})();

listener = new Listener();

Logger = (function(_super) {
  __extends(Logger, _super);

  function Logger(options) {
    if (options == null) {
      options = {};
    }
    if ('string' === typeof options) {
      options = {
        name: options
      };
    }
    this.name = options.name;
    listener.listen(this, options.name, options.logLevel);
  }

  Logger.setLevel = function(level) {
    return listener.setLevel.apply(listener, arguments);
  };

  Logger.setLevels = function(levels) {
    return listener.setLevels.apply(listener, arguments);
  };

  Logger.onError = function(callback) {
    return __onError = callback;
  };

  Logger.listen = function(logger, name, level) {
    return listener.listen(logger, name, level);
  };

  Logger.prototype._log = function(level, messages) {
    messages.unshift(level);
    return this.emit.apply(this, messages);
  };

  Logger.prototype.log = function() {
    var level, messages;
    level = arguments[0], messages = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this._log(level, messages);
  };

  Logger.prototype.trace = function() {
    var messages;
    messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('trace', messages);
  };

  Logger.prototype.debug = function() {
    var messages;
    messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('debug', messages);
  };

  Logger.prototype.info = function() {
    var messages;
    messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('info', messages);
  };

  Logger.prototype.warn = function() {
    var messages;
    messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('warn', messages);
  };

  Logger.prototype.error = function() {
    var messages;
    messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._log('error', messages);
  };

  return Logger;

})(EventEmitter);

this.Logger = Logger;

Logger.listener = listener;

if (typeof exports !== "undefined") {
  module.exports = Logger;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jag:pince'] = {
  Pince: Pince,
  Logger: Logger,
  MicroEvent: MicroEvent
};

})();
