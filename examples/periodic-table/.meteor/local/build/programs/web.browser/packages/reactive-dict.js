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
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var ReactiveDict;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/reactive-dict/reactive-dict.js                                              //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// XXX come up with a serialization method which canonicalizes object key               // 1
// order, which would allow us to use objects as values for equals.                     // 2
var stringify = function (value) {                                                      // 3
  if (value === undefined)                                                              // 4
    return 'undefined';                                                                 // 5
  return EJSON.stringify(value);                                                        // 6
};                                                                                      // 7
var parse = function (serialized) {                                                     // 8
  if (serialized === undefined || serialized === 'undefined')                           // 9
    return undefined;                                                                   // 10
  return EJSON.parse(serialized);                                                       // 11
};                                                                                      // 12
                                                                                        // 13
// XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName                     // 14
ReactiveDict = function (dictName) {                                                    // 15
  // this.keys: key -> value                                                            // 16
  if (dictName) {                                                                       // 17
    if (typeof dictName === 'string') {                                                 // 18
      // the normal case, argument is a string name.                                    // 19
      // _registerDictForMigrate will throw an error on duplicate name.                 // 20
      ReactiveDict._registerDictForMigrate(dictName, this);                             // 21
      this.keys = ReactiveDict._loadMigratedDict(dictName) || {};                       // 22
    } else if (typeof dictName === 'object') {                                          // 23
      // back-compat case: dictName is actually migrationData                           // 24
      this.keys = dictName;                                                             // 25
    } else {                                                                            // 26
      throw new Error("Invalid ReactiveDict argument: " + dictName);                    // 27
    }                                                                                   // 28
  } else {                                                                              // 29
    // no name given; no migration will be performed                                    // 30
    this.keys = {};                                                                     // 31
  }                                                                                     // 32
                                                                                        // 33
  this.keyDeps = {}; // key -> Dependency                                               // 34
  this.keyValueDeps = {}; // key -> Dependency                                          // 35
};                                                                                      // 36
                                                                                        // 37
_.extend(ReactiveDict.prototype, {                                                      // 38
  // set() began as a key/value method, but we are now overloading it                   // 39
  // to take an object of key/value pairs, similar to backbone                          // 40
  // http://backbonejs.org/#Model-set                                                   // 41
                                                                                        // 42
  set: function (keyOrObject, value) {                                                  // 43
    var self = this;                                                                    // 44
                                                                                        // 45
    if ((typeof keyOrObject === 'object') && (value === undefined)) {                   // 46
      self._setObject(keyOrObject);                                                     // 47
      return;                                                                           // 48
    }                                                                                   // 49
    // the input isn't an object, so it must be a key                                   // 50
    // and we resume with the rest of the function                                      // 51
    var key = keyOrObject;                                                              // 52
                                                                                        // 53
    value = stringify(value);                                                           // 54
                                                                                        // 55
    var oldSerializedValue = 'undefined';                                               // 56
    if (_.has(self.keys, key)) oldSerializedValue = self.keys[key];                     // 57
    if (value === oldSerializedValue)                                                   // 58
      return;                                                                           // 59
    self.keys[key] = value;                                                             // 60
                                                                                        // 61
    var changed = function (v) {                                                        // 62
      v && v.changed();                                                                 // 63
    };                                                                                  // 64
                                                                                        // 65
    changed(self.keyDeps[key]);                                                         // 66
    if (self.keyValueDeps[key]) {                                                       // 67
      changed(self.keyValueDeps[key][oldSerializedValue]);                              // 68
      changed(self.keyValueDeps[key][value]);                                           // 69
    }                                                                                   // 70
  },                                                                                    // 71
                                                                                        // 72
  setDefault: function (key, value) {                                                   // 73
    var self = this;                                                                    // 74
    // for now, explicitly check for undefined, since there is no                       // 75
    // ReactiveDict.clear().  Later we might have a ReactiveDict.clear(), in which case // 76
    // we should check if it has the key.                                               // 77
    if (self.keys[key] === undefined) {                                                 // 78
      self.set(key, value);                                                             // 79
    }                                                                                   // 80
  },                                                                                    // 81
                                                                                        // 82
  get: function (key) {                                                                 // 83
    var self = this;                                                                    // 84
    self._ensureKey(key);                                                               // 85
    self.keyDeps[key].depend();                                                         // 86
    return parse(self.keys[key]);                                                       // 87
  },                                                                                    // 88
                                                                                        // 89
  equals: function (key, value) {                                                       // 90
    var self = this;                                                                    // 91
                                                                                        // 92
    // Mongo.ObjectID is in the 'mongo' package                                         // 93
    var ObjectID = null;                                                                // 94
    if (typeof Mongo !== 'undefined') {                                                 // 95
      ObjectID = Mongo.ObjectID;                                                        // 96
    }                                                                                   // 97
                                                                                        // 98
    // We don't allow objects (or arrays that might include objects) for                // 99
    // .equals, because JSON.stringify doesn't canonicalize object key                  // 100
    // order. (We can make equals have the right return value by parsing the            // 101
    // current value and using EJSON.equals, but we won't have a canonical              // 102
    // element of keyValueDeps[key] to store the dependency.) You can still use         // 103
    // "EJSON.equals(reactiveDict.get(key), value)".                                    // 104
    //                                                                                  // 105
    // XXX we could allow arrays as long as we recursively check that there             // 106
    // are no objects                                                                   // 107
    if (typeof value !== 'string' &&                                                    // 108
        typeof value !== 'number' &&                                                    // 109
        typeof value !== 'boolean' &&                                                   // 110
        typeof value !== 'undefined' &&                                                 // 111
        !(value instanceof Date) &&                                                     // 112
        !(ObjectID && value instanceof ObjectID) &&                                     // 113
        value !== null)                                                                 // 114
      throw new Error("ReactiveDict.equals: value must be scalar");                     // 115
    var serializedValue = stringify(value);                                             // 116
                                                                                        // 117
    if (Tracker.active) {                                                               // 118
      self._ensureKey(key);                                                             // 119
                                                                                        // 120
      if (! _.has(self.keyValueDeps[key], serializedValue))                             // 121
        self.keyValueDeps[key][serializedValue] = new Tracker.Dependency;               // 122
                                                                                        // 123
      var isNew = self.keyValueDeps[key][serializedValue].depend();                     // 124
      if (isNew) {                                                                      // 125
        Tracker.onInvalidate(function () {                                              // 126
          // clean up [key][serializedValue] if it's now empty, so we don't             // 127
          // use O(n) memory for n = values seen ever                                   // 128
          if (! self.keyValueDeps[key][serializedValue].hasDependents())                // 129
            delete self.keyValueDeps[key][serializedValue];                             // 130
        });                                                                             // 131
      }                                                                                 // 132
    }                                                                                   // 133
                                                                                        // 134
    var oldValue = undefined;                                                           // 135
    if (_.has(self.keys, key)) oldValue = parse(self.keys[key]);                        // 136
    return EJSON.equals(oldValue, value);                                               // 137
  },                                                                                    // 138
                                                                                        // 139
  _setObject: function (object) {                                                       // 140
    var self = this;                                                                    // 141
                                                                                        // 142
    _.each(object, function (value, key){                                               // 143
      self.set(key, value);                                                             // 144
    });                                                                                 // 145
  },                                                                                    // 146
                                                                                        // 147
  _ensureKey: function (key) {                                                          // 148
    var self = this;                                                                    // 149
    if (!(key in self.keyDeps)) {                                                       // 150
      self.keyDeps[key] = new Tracker.Dependency;                                       // 151
      self.keyValueDeps[key] = {};                                                      // 152
    }                                                                                   // 153
  },                                                                                    // 154
                                                                                        // 155
  // Get a JSON value that can be passed to the constructor to                          // 156
  // create a new ReactiveDict with the same contents as this one                       // 157
  _getMigrationData: function () {                                                      // 158
    // XXX sanitize and make sure it's JSONible?                                        // 159
    return this.keys;                                                                   // 160
  }                                                                                     // 161
});                                                                                     // 162
                                                                                        // 163
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/reactive-dict/migration.js                                                  //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
ReactiveDict._migratedDictData = {}; // name -> data                                    // 1
ReactiveDict._dictsToMigrate = {}; // name -> ReactiveDict                              // 2
                                                                                        // 3
ReactiveDict._loadMigratedDict = function (dictName) {                                  // 4
  if (_.has(ReactiveDict._migratedDictData, dictName))                                  // 5
    return ReactiveDict._migratedDictData[dictName];                                    // 6
                                                                                        // 7
  return null;                                                                          // 8
};                                                                                      // 9
                                                                                        // 10
ReactiveDict._registerDictForMigrate = function (dictName, dict) {                      // 11
  if (_.has(ReactiveDict._dictsToMigrate, dictName))                                    // 12
    throw new Error("Duplicate ReactiveDict name: " + dictName);                        // 13
                                                                                        // 14
  ReactiveDict._dictsToMigrate[dictName] = dict;                                        // 15
};                                                                                      // 16
                                                                                        // 17
if (Meteor.isClient && Package.reload) {                                                // 18
  // Put old migrated data into ReactiveDict._migratedDictData,                         // 19
  // where it can be accessed by ReactiveDict._loadMigratedDict.                        // 20
  var migrationData = Package.reload.Reload._migrationData('reactive-dict');            // 21
  if (migrationData && migrationData.dicts)                                             // 22
    ReactiveDict._migratedDictData = migrationData.dicts;                               // 23
                                                                                        // 24
  // On migration, assemble the data from all the dicts that have been                  // 25
  // registered.                                                                        // 26
  Package.reload.Reload._onMigrate('reactive-dict', function () {                       // 27
    var dictsToMigrate = ReactiveDict._dictsToMigrate;                                  // 28
    var dataToMigrate = {};                                                             // 29
                                                                                        // 30
    for (var dictName in dictsToMigrate)                                                // 31
      dataToMigrate[dictName] = dictsToMigrate[dictName]._getMigrationData();           // 32
                                                                                        // 33
    return [true, {dicts: dataToMigrate}];                                              // 34
  });                                                                                   // 35
}                                                                                       // 36
                                                                                        // 37
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['reactive-dict'] = {
  ReactiveDict: ReactiveDict
};

})();
