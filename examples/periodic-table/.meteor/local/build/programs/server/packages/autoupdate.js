(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

/* Package-scope variables */
var Autoupdate, ClientVersions;

(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/autoupdate/autoupdate_server.js                                     //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// Publish the current client versions to the client.  When a client            // 1
// sees the subscription change and that there is a new version of the          // 2
// client available on the server, it can reload.                               // 3
//                                                                              // 4
// By default there are two current client versions. The refreshable client     // 5
// version is identified by a hash of the client resources seen by the browser  // 6
// that are refreshable, such as CSS, while the non refreshable client version  // 7
// is identified by a hash of the rest of the client assets                     // 8
// (the HTML, code, and static files in the `public` directory).                // 9
//                                                                              // 10
// If the environment variable `AUTOUPDATE_VERSION` is set it will be           // 11
// used as the client id instead.  You can use this to control when             // 12
// the client reloads.  For example, if you want to only force a                // 13
// reload on major changes, you can use a custom AUTOUPDATE_VERSION             // 14
// which you only change when something worth pushing to clients                // 15
// immediately happens.                                                         // 16
//                                                                              // 17
// The server publishes a `meteor_autoupdate_clientVersions`                    // 18
// collection. There are two documents in this collection, a document           // 19
// with _id 'version' which represnets the non refreshable client assets,       // 20
// and a document with _id 'version-refreshable' which represents the           // 21
// refreshable client assets. Each document has a 'version' field               // 22
// which is equivalent to the hash of the relevant assets. The refreshable      // 23
// document also contains a list of the refreshable assets, so that the client  // 24
// can swap in the new assets without forcing a page refresh. Clients can       // 25
// observe changes on these documents to detect when there is a new             // 26
// version available.                                                           // 27
//                                                                              // 28
// In this implementation only two documents are present in the collection      // 29
// the current refreshable client version and the current nonRefreshable client // 30
// version.  Developers can easily experiment with different versioning and     // 31
// updating models by forking this package.                                     // 32
                                                                                // 33
var Future = Npm.require("fibers/future");                                      // 34
                                                                                // 35
Autoupdate = {};                                                                // 36
                                                                                // 37
// The collection of acceptable client versions.                                // 38
ClientVersions = new Mongo.Collection("meteor_autoupdate_clientVersions",       // 39
  { connection: null });                                                        // 40
                                                                                // 41
// The client hash includes __meteor_runtime_config__, so wait until            // 42
// all packages have loaded and have had a chance to populate the               // 43
// runtime config before using the client hash as our default auto              // 44
// update version id.                                                           // 45
                                                                                // 46
// Note: Tests allow people to override Autoupdate.autoupdateVersion before     // 47
// startup.                                                                     // 48
Autoupdate.autoupdateVersion = null;                                            // 49
Autoupdate.autoupdateVersionRefreshable = null;                                 // 50
Autoupdate.autoupdateVersionCordova = null;                                     // 51
Autoupdate.appId = __meteor_runtime_config__.appId = process.env.APP_ID;        // 52
                                                                                // 53
var syncQueue = new Meteor._SynchronousQueue();                                 // 54
                                                                                // 55
// updateVersions can only be called after the server has fully loaded.         // 56
var updateVersions = function (shouldReloadClientProgram) {                     // 57
  // Step 1: load the current client program on the server and update the       // 58
  // hash values in __meteor_runtime_config__.                                  // 59
  if (shouldReloadClientProgram) {                                              // 60
    WebAppInternals.reloadClientPrograms();                                     // 61
  }                                                                             // 62
                                                                                // 63
  // If we just re-read the client program, or if we don't have an autoupdate   // 64
  // version, calculate it.                                                     // 65
  if (shouldReloadClientProgram || Autoupdate.autoupdateVersion === null) {     // 66
    Autoupdate.autoupdateVersion =                                              // 67
      process.env.AUTOUPDATE_VERSION ||                                         // 68
      WebApp.calculateClientHashNonRefreshable();                               // 69
  }                                                                             // 70
  // If we just recalculated it OR if it was set by (eg) test-in-browser,       // 71
  // ensure it ends up in __meteor_runtime_config__.                            // 72
  __meteor_runtime_config__.autoupdateVersion =                                 // 73
    Autoupdate.autoupdateVersion;                                               // 74
                                                                                // 75
  Autoupdate.autoupdateVersionRefreshable =                                     // 76
    __meteor_runtime_config__.autoupdateVersionRefreshable =                    // 77
      process.env.AUTOUPDATE_VERSION ||                                         // 78
      WebApp.calculateClientHashRefreshable();                                  // 79
                                                                                // 80
  Autoupdate.autoupdateVersionCordova =                                         // 81
    __meteor_runtime_config__.autoupdateVersionCordova =                        // 82
      process.env.AUTOUPDATE_VERSION ||                                         // 83
      WebApp.calculateClientHashCordova();                                      // 84
                                                                                // 85
  // Step 2: form the new client boilerplate which contains the updated         // 86
  // assets and __meteor_runtime_config__.                                      // 87
  if (shouldReloadClientProgram) {                                              // 88
    WebAppInternals.generateBoilerplate();                                      // 89
  }                                                                             // 90
                                                                                // 91
  // XXX COMPAT WITH 0.8.3                                                      // 92
  if (! ClientVersions.findOne({current: true})) {                              // 93
    // To ensure apps with version of Meteor prior to 0.9.0 (in                 // 94
    // which the structure of documents in `ClientVersions` was                 // 95
    // different) also reload.                                                  // 96
    ClientVersions.insert({current: true});                                     // 97
  }                                                                             // 98
                                                                                // 99
  if (! ClientVersions.findOne({_id: "version"})) {                             // 100
    ClientVersions.insert({                                                     // 101
      _id: "version",                                                           // 102
      version: Autoupdate.autoupdateVersion                                     // 103
    });                                                                         // 104
  } else {                                                                      // 105
    ClientVersions.update("version", { $set: {                                  // 106
      version: Autoupdate.autoupdateVersion                                     // 107
    }});                                                                        // 108
  }                                                                             // 109
                                                                                // 110
  if (! ClientVersions.findOne({_id: "version-cordova"})) {                     // 111
    ClientVersions.insert({                                                     // 112
      _id: "version-cordova",                                                   // 113
      version: Autoupdate.autoupdateVersionCordova,                             // 114
      refreshable: false                                                        // 115
    });                                                                         // 116
  } else {                                                                      // 117
    ClientVersions.update("version-cordova", { $set: {                          // 118
      version: Autoupdate.autoupdateVersionCordova                              // 119
    }});                                                                        // 120
  }                                                                             // 121
                                                                                // 122
  // Use `onListening` here because we need to use                              // 123
  // `WebAppInternals.refreshableAssets`, which is only set after               // 124
  // `WebApp.generateBoilerplate` is called by `main` in webapp.                // 125
  WebApp.onListening(function () {                                              // 126
    if (! ClientVersions.findOne({_id: "version-refreshable"})) {               // 127
      ClientVersions.insert({                                                   // 128
        _id: "version-refreshable",                                             // 129
        version: Autoupdate.autoupdateVersionRefreshable,                       // 130
        assets: WebAppInternals.refreshableAssets                               // 131
      });                                                                       // 132
    } else {                                                                    // 133
      ClientVersions.update("version-refreshable", { $set: {                    // 134
        version: Autoupdate.autoupdateVersionRefreshable,                       // 135
        assets: WebAppInternals.refreshableAssets                               // 136
      }});                                                                      // 137
    }                                                                           // 138
  });                                                                           // 139
};                                                                              // 140
                                                                                // 141
Meteor.publish(                                                                 // 142
  "meteor_autoupdate_clientVersions",                                           // 143
  function (appId) {                                                            // 144
    // `null` happens when a client doesn't have an appId and passes            // 145
    // `undefined` to `Meteor.subscribe`. `undefined` is translated to          // 146
    // `null` as JSON doesn't have `undefined.                                  // 147
    check(appId, Match.OneOf(String, undefined, null));                         // 148
                                                                                // 149
    // Don't notify clients using wrong appId such as mobile apps built with a  // 150
    // different server but pointing at the same local url                      // 151
    if (Autoupdate.appId && appId && Autoupdate.appId !== appId)                // 152
      return [];                                                                // 153
                                                                                // 154
    return ClientVersions.find();                                               // 155
  },                                                                            // 156
  {is_auto: true}                                                               // 157
);                                                                              // 158
                                                                                // 159
Meteor.startup(function () {                                                    // 160
  updateVersions(false);                                                        // 161
});                                                                             // 162
                                                                                // 163
var fut = new Future();                                                         // 164
                                                                                // 165
// We only want 'refresh' to trigger 'updateVersions' AFTER onListen,           // 166
// so we add a queued task that waits for onListen before 'refresh' can queue   // 167
// tasks. Note that the `onListening` callbacks do not fire until after         // 168
// Meteor.startup, so there is no concern that the 'updateVersions' calls from  // 169
// 'refresh' will overlap with the `updateVersions` call from Meteor.startup.   // 170
                                                                                // 171
syncQueue.queueTask(function () {                                               // 172
  fut.wait();                                                                   // 173
});                                                                             // 174
                                                                                // 175
WebApp.onListening(function () {                                                // 176
  fut.return();                                                                 // 177
});                                                                             // 178
                                                                                // 179
var enqueueVersionsRefresh = function () {                                      // 180
  syncQueue.queueTask(function () {                                             // 181
    updateVersions(true);                                                       // 182
  });                                                                           // 183
};                                                                              // 184
                                                                                // 185
// Listen for the special {refresh: 'client'} message, which signals that a     // 186
// client asset has changed.                                                    // 187
process.on('message', Meteor.bindEnvironment(function (m) {                     // 188
  if (m && m.refresh === 'client') {                                            // 189
    enqueueVersionsRefresh();                                                   // 190
  }                                                                             // 191
}));                                                                            // 192
                                                                                // 193
// Another way to tell the process to refresh: send SIGHUP signal               // 194
process.on('SIGHUP', Meteor.bindEnvironment(function () {                       // 195
  enqueueVersionsRefresh();                                                     // 196
}));                                                                            // 197
                                                                                // 198
                                                                                // 199
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.autoupdate = {
  Autoupdate: Autoupdate
};

})();

//# sourceMappingURL=autoupdate.js.map
