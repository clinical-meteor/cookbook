(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var RoutePolicy, RoutePolicyTest;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/routepolicy/routepolicy.js                                                                         //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// In addition to listing specific files to be cached, the browser                                             // 1
// application cache manifest allows URLs to be designated as NETWORK                                          // 2
// (always fetched from the Internet) and FALLBACK (which we use to                                            // 3
// serve app HTML on arbitrary URLs).                                                                          // 4
//                                                                                                             // 5
// The limitation of the manifest file format is that the designations                                         // 6
// are by prefix only: if "/foo" is declared NETWORK then "/foobar"                                            // 7
// will also be treated as a network route.                                                                    // 8
//                                                                                                             // 9
// RoutePolicy is a low-level API for declaring the route type of URL prefixes:                                // 10
//                                                                                                             // 11
// "network": for network routes that should not conflict with static                                          // 12
// resources.  (For example, if "/sockjs/" is a network route, we                                              // 13
// shouldn't have "/sockjs/red-sock.jpg" as a static resource).                                                // 14
//                                                                                                             // 15
// "static-online": for static resources which should not be cached in                                         // 16
// the app cache.  This is implemented by also adding them to the                                              // 17
// NETWORK section (as otherwise the browser would receive app HTML                                            // 18
// for them because of the FALLBACK section), but static-online routes                                         // 19
// don't need to be checked for conflict with static resources.                                                // 20
                                                                                                               // 21
// The route policy is a singleton in a running application, but we                                            // 22
// can't unit test the real singleton because messing with the real                                            // 23
// routes would break tinytest... so allow policy instances to be                                              // 24
// constructed for testing.                                                                                    // 25
                                                                                                               // 26
RoutePolicyTest = {};                                                                                          // 27
                                                                                                               // 28
var RoutePolicyConstructor = RoutePolicyTest.Constructor = function () {                                       // 29
  var self = this;                                                                                             // 30
  self.urlPrefixTypes = {};                                                                                    // 31
};                                                                                                             // 32
                                                                                                               // 33
_.extend(RoutePolicyConstructor.prototype, {                                                                   // 34
                                                                                                               // 35
  urlPrefixMatches: function (urlPrefix, url) {                                                                // 36
    return url.substr(0, urlPrefix.length) === urlPrefix;                                                      // 37
  },                                                                                                           // 38
                                                                                                               // 39
  checkType: function (type) {                                                                                 // 40
    if (! _.contains(['network', 'static-online'], type))                                                      // 41
      return 'the route type must be "network" or "static-online"';                                            // 42
    return null;                                                                                               // 43
  },                                                                                                           // 44
                                                                                                               // 45
  checkUrlPrefix: function (urlPrefix, type) {                                                                 // 46
    var self = this;                                                                                           // 47
                                                                                                               // 48
    if (urlPrefix.charAt(0) !== '/')                                                                           // 49
      return 'a route URL prefix must begin with a slash';                                                     // 50
                                                                                                               // 51
    if (urlPrefix === '/')                                                                                     // 52
      return 'a route URL prefix cannot be /';                                                                 // 53
                                                                                                               // 54
    var existingType = self.urlPrefixTypes[urlPrefix];                                                         // 55
    if (existingType && existingType !== type)                                                                 // 56
      return 'the route URL prefix ' + urlPrefix + ' has already been declared to be of type ' + existingType; // 57
                                                                                                               // 58
    return null;                                                                                               // 59
  },                                                                                                           // 60
                                                                                                               // 61
  checkForConflictWithStatic: function (urlPrefix, type, _testManifest) {                                      // 62
    var self = this;                                                                                           // 63
    if (type === 'static-online')                                                                              // 64
      return null;                                                                                             // 65
    if (!Package.webapp || !Package.webapp.WebApp                                                              // 66
        || !Package.webapp.WebApp.clientPrograms                                                               // 67
        || !Package.webapp.WebApp.clientPrograms[Package.webapp.WebApp.defaultArch].manifest) {                // 68
      // Hack: If we don't have a manifest, deal with it                                                       // 69
      // gracefully. This lets us load livedata into a nodejs                                                  // 70
      // environment that doesn't have a HTTP server (eg, a                                                    // 71
      // command-line tool).                                                                                   // 72
      return null;                                                                                             // 73
    }                                                                                                          // 74
    var manifest = _testManifest ||                                                                            // 75
      Package.webapp.WebApp.clientPrograms[Package.webapp.WebApp.defaultArch].manifest;                        // 76
    var conflict = _.find(manifest, function (resource) {                                                      // 77
      return (resource.type === 'static' &&                                                                    // 78
              resource.where === 'client' &&                                                                   // 79
              self.urlPrefixMatches(urlPrefix, resource.url));                                                 // 80
    });                                                                                                        // 81
    if (conflict)                                                                                              // 82
      return ('static resource ' + conflict.url + ' conflicts with ' +                                         // 83
              type + ' route ' + urlPrefix);                                                                   // 84
    else                                                                                                       // 85
      return null;                                                                                             // 86
  },                                                                                                           // 87
                                                                                                               // 88
  declare: function (urlPrefix, type) {                                                                        // 89
    var self = this;                                                                                           // 90
    var problem = self.checkType(type) ||                                                                      // 91
                  self.checkUrlPrefix(urlPrefix, type) ||                                                      // 92
                  self.checkForConflictWithStatic(urlPrefix, type);                                            // 93
    if (problem)                                                                                               // 94
      throw new Error(problem);                                                                                // 95
    // TODO overlapping prefixes, e.g. /foo/ and /foo/bar/                                                     // 96
    self.urlPrefixTypes[urlPrefix] = type;                                                                     // 97
  },                                                                                                           // 98
                                                                                                               // 99
  isValidUrl: function (url) {                                                                                 // 100
    return url.charAt(0) === '/';                                                                              // 101
  },                                                                                                           // 102
                                                                                                               // 103
  classify: function (url) {                                                                                   // 104
    var self = this;                                                                                           // 105
    if (url.charAt(0) !== '/')                                                                                 // 106
      throw new Error('url must be a relative URL: ' + url);                                                   // 107
    var prefix = _.find(_.keys(self.urlPrefixTypes), function (_prefix) {                                      // 108
      return self.urlPrefixMatches(_prefix, url);                                                              // 109
    });                                                                                                        // 110
    if (prefix)                                                                                                // 111
      return self.urlPrefixTypes[prefix];                                                                      // 112
    else                                                                                                       // 113
      return null;                                                                                             // 114
  },                                                                                                           // 115
                                                                                                               // 116
  urlPrefixesFor: function (type) {                                                                            // 117
    var self = this;                                                                                           // 118
    var prefixes = [];                                                                                         // 119
    _.each(self.urlPrefixTypes, function (_type, _prefix) {                                                    // 120
      if (_type === type)                                                                                      // 121
        prefixes.push(_prefix);                                                                                // 122
    });                                                                                                        // 123
    return prefixes.sort();                                                                                    // 124
  }                                                                                                            // 125
});                                                                                                            // 126
                                                                                                               // 127
RoutePolicy = new RoutePolicyConstructor();                                                                    // 128
                                                                                                               // 129
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.routepolicy = {
  RoutePolicy: RoutePolicy,
  RoutePolicyTest: RoutePolicyTest
};

})();

//# sourceMappingURL=routepolicy.js.map
