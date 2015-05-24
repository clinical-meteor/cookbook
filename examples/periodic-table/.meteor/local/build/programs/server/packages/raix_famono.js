(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RoutePolicy = Package.routepolicy.RoutePolicy;

/* Package-scope variables */
var Famono;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/raix:famono/requirejs_server.js                                                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
if (typeof global.require == 'undefined') global.require = function () {                                        // 2
  throw new Error('Famous "require" cannot run on the server');                                                 // 3
}                                                                                                               // 4
                                                                                                                // 5
if (typeof global.define == 'undefined') global.define = function () {                                          // 6
  throw new Error('Famous "define" cannot run on the server');                                                  // 7
};                                                                                                              // 8
                                                                                                                // 9
Famono = {};                                                                                                    // 10
                                                                                                                // 11
Famono.define = function () {                                                                                   // 12
  throw new Error('Famous "Famono.define" cannot run on the server');                                           // 13
};                                                                                                              // 14
                                                                                                                // 15
Famono.require = function () {                                                                                  // 16
  throw new Error('Famous "Famono.require" cannot run on the server');                                          // 17
};                                                                                                              // 18
                                                                                                                // 19
Famono.scope = function () {                                                                                    // 20
  throw new Error('Famous "Famono.scope" cannot run on the server');                                            // 21
};                                                                                                              // 22
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/raix:famono/requirejs_libraries_server.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var fs = Npm.require('fs');                                                                                     // 1
var path = Npm.require('path');                                                                                 // 2
var send = Npm.require('send');                                                                                 // 3
var useragent = Npm.require('useragent');                                                                       // 4
                                                                                                                // 5
// Set the main famono folder for our work...                                                                   // 6
var famonoRepoFolder = path.resolve(process.cwd(), '../../../../.famono-repos');                                // 7
                                                                                                                // 8
var famonoBaseFolder = path.resolve(process.cwd(), '../../../../.famono-base');                                 // 9
                                                                                                                // 10
var famonoLibFolder = path.join(famonoBaseFolder, 'lib');                                                       // 11
                                                                                                                // 12
var config;                                                                                                     // 13
var registry = {};                                                                                              // 14
                                                                                                                // 15
// Make sure famonoLibFolder exists                                                                             // 16
if (!fs.existsSync(famonoLibFolder)) {                                                                          // 17
  console.log('Famono-server: Error lib folder not found "' + famonoLibFolder + '"');                           // 18
} else {                                                                                                        // 19
  // Load config and registry into mem                                                                          // 20
                                                                                                                // 21
  try {                                                                                                         // 22
    config = JSON.parse(fs.readFileSync(path.join(famonoBaseFolder, '.config'), 'utf8'));                       // 23
  } catch (err) {                                                                                               // 24
    throw new Error('Famono-server: Error could not parse .config json, ' + err.message);                       // 25
  }                                                                                                             // 26
                                                                                                                // 27
  for (var ns in config) {                                                                                      // 28
    try {                                                                                                       // 29
      registry[ns] = JSON.parse(fs.readFileSync(path.join(famonoRepoFolder, '.' + ns), 'utf8'));                // 30
    } catch (err) {                                                                                             // 31
      console.log('Famono-server: Error namespace config load failed "' + ns + '"');                            // 32
    }                                                                                                           // 33
  }                                                                                                             // 34
                                                                                                                // 35
}                                                                                                               // 36
                                                                                                                // 37
var getExt = function(url) {                                                                                    // 38
  var last = url.split('.').pop();                                                                              // 39
  // Only allow certain filetypes?                                                                              // 40
  if (last === 'js' || last === 'css')                                                                          // 41
    return '.' + last;                                                                                          // 42
                                                                                                                // 43
  return;                                                                                                       // 44
};                                                                                                              // 45
                                                                                                                // 46
var getNamespace = function(url) {                                                                              // 47
  var list = url.split('/');                                                                                    // 48
  // '' lib namespace foo bar                                                                                   // 49
  //  0  1      2      3   4                                                                                    // 50
  return list[2];                                                                                               // 51
};                                                                                                              // 52
                                                                                                                // 53
var getLibrary = function(url) {                                                                                // 54
  // Remove the lib part                                                                                        // 55
  var name = url.replace('/lib/', '');                                                                          // 56
  // Get the extension                                                                                          // 57
  var ext = getExt(url);                                                                                        // 58
  // Remove the ext if found                                                                                    // 59
  if (ext) name = name.substring(0, name.length - ext.length);                                                  // 60
  // Return the name                                                                                            // 61
  return {                                                                                                      // 62
    name: name,                                                                                                 // 63
    ext: ext                                                                                                    // 64
  };                                                                                                            // 65
};                                                                                                              // 66
                                                                                                                // 67
                                                                                                                // 68
WebApp.connectHandlers.use(function(req, res, next) {                                                           // 69
  // Check if the user requested something in the /lib/ folder                                                  // 70
  if (/^\/lib\//.test(req.url)) {                                                                               // 71
    if (!config) {                                                                                              // 72
      // Set error                                                                                              // 73
      res.writeHead(500);                                                                                       // 74
      // If no config loaded then report as an error                                                            // 75
      res.end('Famono-server: Error registry not found in "' + famonoRepoFolder + '"');                         // 76
    } else {                                                                                                    // 77
      // Get the namespace                                                                                      // 78
      var namespace = getNamespace(req.url);                                                                    // 79
      // Get the lib info                                                                                       // 80
      var lib = getLibrary(req.url);                                                                            // 81
      // Get the library name                                                                                   // 82
      var name = lib.name;                                                                                      // 83
      // Get the extension                                                                                      // 84
      var ext = lib.ext;                                                                                        // 85
                                                                                                                // 86
      // console.log(namespace);                                                                                // 87
      var currentNS = registry[namespace];                                                                      // 88
      // Check that we have the namespace                                                                       // 89
      if (currentNS) {                                                                                          // 90
        // Check if we need to add index or name                                                                // 91
        if (currentNS[name + '/index']) {                                                                       // 92
          name += '/index';                                                                                     // 93
        } if (currentNS[name + '/' + name]) {                                                                   // 94
          name += '/' + name;                                                                                   // 95
        }                                                                                                       // 96
                                                                                                                // 97
        // Check that we have the dependency                                                                    // 98
        if (currentNS[name]) {                                                                                  // 99
          // XXX: If we want to add client specific compilation                                                 // 100
          // We should have some conversion table eg.                                                           // 101
          // Chrome -> CH                                                                                       // 102
          // FireFox -> FF                                                                                      // 103
          // IE, SAF, OP etc. ?                                                                                 // 104
          //                                                                                                    // 105
          // Then have feature detection as a set of UA conditions                                              // 106
          //                                                                                                    // 107
          // The userAgent format:                                                                              // 108
          //                                                                                                    // 109
          // { family: 'Firefox',                                                                               // 110
          //   major: '28',                                                                                     // 111
          //   minor: '0',                                                                                      // 112
          //   patch: '0',                                                                                      // 113
          //   source: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0'      // 114
          // }                                                                                                  // 115
          //                                                                                                    // 116
          var userAgent = useragent.lookup(req.headers['user-agent']);                                          // 117
                                                                                                                // 118
          // Get the filename of the dependency                                                                 // 119
          var filename = path.join(famonoLibFolder, name + (ext || '.js'));                                     // 120
                                                                                                                // 121
          // XXX: We could compile any UA / Feature compiler conditions before                                  // 122
          // sending the file to the client?                                                                    // 123
                                                                                                                // 124
          // Serve the file                                                                                     // 125
          send(req, filename)                                                                                   // 126
            //.maxage(maxAge)                                                                                   // 127
            .on('error', function(err) {                                                                        // 128
              Log.error('Error serving library "' + name + '", file: ' + filename + ' ' + err);                 // 129
              res.writeHead(500);                                                                               // 130
              res.end();                                                                                        // 131
            })                                                                                                  // 132
            .on('directory', function() {                                                                       // 133
              Log.error("Unexpected directory " + filename);                                                    // 134
              res.writeHead(500);                                                                               // 135
              res.end();                                                                                        // 136
            })                                                                                                  // 137
            .pipe(res);                                                                                         // 138
                                                                                                                // 139
        } else {                                                                                                // 140
          // Set error                                                                                          // 141
          res.writeHead(404);                                                                                   // 142
                                                                                                                // 143
          var found;                                                                                            // 144
          for (var key in currentNS)                                                                            // 145
            if (name.toLowerCase() == key.toLowerCase()) found = { key: key, name: name};                       // 146
                                                                                                                // 147
          if (found) {                                                                                          // 148
            // Show nicer error message                                                                         // 149
            res.end('Famono-server: Error, did you mean "' + found.key + '" instead of "' + found.name + '"?'); // 150
          } else {                                                                                              // 151
            // If no config loaded then report as an error                                                      // 152
            res.end('Famono-server: Error, library not found in "' + name + '"');                               // 153
          }                                                                                                     // 154
        }                                                                                                       // 155
                                                                                                                // 156
      } else {                                                                                                  // 157
        // Set error                                                                                            // 158
        res.writeHead(400);                                                                                     // 159
        // If no config loaded then report as an error                                                          // 160
        res.end('Famono-server: Error namespace not found "' + namespace + '"');                                // 161
      }                                                                                                         // 162
    }                                                                                                           // 163
                                                                                                                // 164
  } else {                                                                                                      // 165
    // Pass on other urls than `/lib/`                                                                          // 166
    return next();                                                                                              // 167
  }                                                                                                             // 168
                                                                                                                // 169
                                                                                                                // 170
});                                                                                                             // 171
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:famono'] = {
  Famono: Famono
};

})();

//# sourceMappingURL=raix_famono.js.map
