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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var DDP = Package.ddp.DDP;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

/* Package-scope variables */
var Autoupdate, ClientVersions;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/autoupdate/autoupdate_client.js                                                //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
// Subscribe to the `meteor_autoupdate_clientVersions` collection,                         // 1
// which contains the set of acceptable client versions.                                   // 2
//                                                                                         // 3
// A "hard code push" occurs when the running client version is not in                     // 4
// the set of acceptable client versions (or the server updates the                        // 5
// collection, there is a published client version marked `current` and                    // 6
// the running client version is no longer in the set).                                    // 7
//                                                                                         // 8
// When the `reload` package is loaded, a hard code push causes                            // 9
// the browser to reload, so that it will load the latest client                           // 10
// version from the server.                                                                // 11
//                                                                                         // 12
// A "soft code push" represents the situation when the running client                     // 13
// version is in the set of acceptable versions, but there is a newer                      // 14
// version available on the server.                                                        // 15
//                                                                                         // 16
// `Autoupdate.newClientAvailable` is a reactive data source which                         // 17
// becomes `true` if there is a new version of the client is available on                  // 18
// the server.                                                                             // 19
//                                                                                         // 20
// This package doesn't implement a soft code reload process itself,                       // 21
// but `newClientAvailable` could be used for example to display a                         // 22
// "click to reload" link to the user.                                                     // 23
                                                                                           // 24
// The client version of the client code currently running in the                          // 25
// browser.                                                                                // 26
var autoupdateVersion = __meteor_runtime_config__.autoupdateVersion || "unknown";          // 27
var autoupdateVersionRefreshable =                                                         // 28
  __meteor_runtime_config__.autoupdateVersionRefreshable || "unknown";                     // 29
                                                                                           // 30
// The collection of acceptable client versions.                                           // 31
ClientVersions = new Mongo.Collection("meteor_autoupdate_clientVersions");                 // 32
                                                                                           // 33
Autoupdate = {};                                                                           // 34
                                                                                           // 35
Autoupdate.newClientAvailable = function () {                                              // 36
  return !! ClientVersions.findOne({                                                       // 37
               _id: "version",                                                             // 38
               version: {$ne: autoupdateVersion} }) ||                                     // 39
         !! ClientVersions.findOne({                                                       // 40
               _id: "version-refreshable",                                                 // 41
               version: {$ne: autoupdateVersionRefreshable} });                            // 42
};                                                                                         // 43
                                                                                           // 44
var knownToSupportCssOnLoad = false;                                                       // 45
                                                                                           // 46
var retry = new Retry({                                                                    // 47
  // Unlike the stream reconnect use of Retry, which we want to be instant                 // 48
  // in normal operation, this is a wacky failure. We don't want to retry                  // 49
  // right away, we can start slowly.                                                      // 50
  //                                                                                       // 51
  // A better way than timeconstants here might be to use the knowledge                    // 52
  // of when we reconnect to help trigger these retries. Typically, the                    // 53
  // server fixing code will result in a restart and reconnect, but                        // 54
  // potentially the subscription could have a transient error.                            // 55
  minCount: 0, // don't do any immediate retries                                           // 56
  baseTimeout: 30*1000 // start with 30s                                                   // 57
});                                                                                        // 58
var failures = 0;                                                                          // 59
                                                                                           // 60
Autoupdate._retrySubscription = function () {                                              // 61
  Meteor.subscribe("meteor_autoupdate_clientVersions", {                                   // 62
    onError: function (error) {                                                            // 63
      Meteor._debug("autoupdate subscription failed:", error);                             // 64
      failures++;                                                                          // 65
      retry.retryLater(failures, function () {                                             // 66
        // Just retry making the subscription, don't reload the whole                      // 67
        // page. While reloading would catch more cases (for example,                      // 68
        // the server went back a version and is now doing old-style hot                   // 69
        // code push), it would also be more prone to reload loops,                        // 70
        // which look really bad to the user. Just retrying the                            // 71
        // subscription over DDP means it is at least possible to fix by                   // 72
        // updating the server.                                                            // 73
        Autoupdate._retrySubscription();                                                   // 74
      });                                                                                  // 75
    },                                                                                     // 76
    onReady: function () {                                                                 // 77
      if (Package.reload) {                                                                // 78
        var checkNewVersionDocument = function (doc) {                                     // 79
          var self = this;                                                                 // 80
          if (doc._id === 'version-refreshable' &&                                         // 81
              doc.version !== autoupdateVersionRefreshable) {                              // 82
            autoupdateVersionRefreshable = doc.version;                                    // 83
            // Switch out old css links for the new css links. Inspired by:                // 84
            // https://github.com/guard/guard-livereload/blob/master/js/livereload.js#L710 // 85
            var newCss = (doc.assets && doc.assets.allCss) || [];                          // 86
            var oldLinks = [];                                                             // 87
            _.each(document.getElementsByTagName('link'), function (link) {                // 88
              if (link.className === '__meteor-css__') {                                   // 89
                oldLinks.push(link);                                                       // 90
              }                                                                            // 91
            });                                                                            // 92
                                                                                           // 93
            var waitUntilCssLoads = function  (link, callback) {                           // 94
              var executeCallback = _.once(callback);                                      // 95
              link.onload = function () {                                                  // 96
                knownToSupportCssOnLoad = true;                                            // 97
                executeCallback();                                                         // 98
              };                                                                           // 99
              if (! knownToSupportCssOnLoad) {                                             // 100
                var id = Meteor.setInterval(function () {                                  // 101
                  if (link.sheet) {                                                        // 102
                    executeCallback();                                                     // 103
                    Meteor.clearInterval(id);                                              // 104
                  }                                                                        // 105
                }, 50);                                                                    // 106
              }                                                                            // 107
            };                                                                             // 108
                                                                                           // 109
            var removeOldLinks = _.after(newCss.length, function () {                      // 110
              _.each(oldLinks, function (oldLink) {                                        // 111
                oldLink.parentNode.removeChild(oldLink);                                   // 112
              });                                                                          // 113
            });                                                                            // 114
                                                                                           // 115
            var attachStylesheetLink = function (newLink) {                                // 116
              document.getElementsByTagName("head").item(0).appendChild(newLink);          // 117
                                                                                           // 118
              waitUntilCssLoads(newLink, function () {                                     // 119
                Meteor.setTimeout(removeOldLinks, 200);                                    // 120
              });                                                                          // 121
            };                                                                             // 122
                                                                                           // 123
            if (newCss.length !== 0) {                                                     // 124
              _.each(newCss, function (css) {                                              // 125
                var newLink = document.createElement("link");                              // 126
                newLink.setAttribute("rel", "stylesheet");                                 // 127
                newLink.setAttribute("type", "text/css");                                  // 128
                newLink.setAttribute("class", "__meteor-css__");                           // 129
                newLink.setAttribute("href", Meteor._relativeToSiteRootUrl(css.url));      // 130
                attachStylesheetLink(newLink);                                             // 131
              });                                                                          // 132
            } else {                                                                       // 133
              removeOldLinks();                                                            // 134
            }                                                                              // 135
                                                                                           // 136
          }                                                                                // 137
          else if (doc._id === 'version' && doc.version !== autoupdateVersion) {           // 138
            handle && handle.stop();                                                       // 139
            Package.reload.Reload._reload();                                               // 140
          }                                                                                // 141
        };                                                                                 // 142
                                                                                           // 143
        var handle = ClientVersions.find().observe({                                       // 144
          added: checkNewVersionDocument,                                                  // 145
          changed: checkNewVersionDocument                                                 // 146
        });                                                                                // 147
      }                                                                                    // 148
    }                                                                                      // 149
  });                                                                                      // 150
};                                                                                         // 151
Autoupdate._retrySubscription();                                                           // 152
                                                                                           // 153
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.autoupdate = {
  Autoupdate: Autoupdate
};

})();
