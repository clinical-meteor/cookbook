(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Log = Package.logging.Log;
var Retry = Package.retry.Retry;
var Hook = Package['callback-hook'].Hook;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

/* Package-scope variables */
var DDP, DDPServer, LivedataTest, toSockjsUrl, toWebsocketUrl, StreamServer, Heartbeat, Server, SUPPORTED_DDP_VERSIONS, MethodInvocation, parseDDP, stringifyDDP, RandomStream, makeRpcSeed, allConnections;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/common.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * @namespace DDP                                                                                                      // 2
 * @summary The namespace for DDP-related methods.                                                                     // 3
 */                                                                                                                    // 4
DDP = {};                                                                                                              // 5
LivedataTest = {};                                                                                                     // 6
                                                                                                                       // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/stream_client_nodejs.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// @param endpoint {String} URL to Meteor app                                                                          // 1
//   "http://subdomain.meteor.com/" or "/" or                                                                          // 2
//   "ddp+sockjs://foo-**.meteor.com/sockjs"                                                                           // 3
//                                                                                                                     // 4
// We do some rewriting of the URL to eventually make it "ws://" or "wss://",                                          // 5
// whatever was passed in.  At the very least, what Meteor.absoluteUrl() returns                                       // 6
// us should work.                                                                                                     // 7
//                                                                                                                     // 8
// We don't do any heartbeating. (The logic that did this in sockjs was removed,                                       // 9
// because it used a built-in sockjs mechanism. We could do it with WebSocket                                          // 10
// ping frames or with DDP-level messages.)                                                                            // 11
LivedataTest.ClientStream = function (endpoint, options) {                                                             // 12
  var self = this;                                                                                                     // 13
  options = options || {};                                                                                             // 14
                                                                                                                       // 15
  self.options = _.extend({                                                                                            // 16
    retry: true                                                                                                        // 17
  }, options);                                                                                                         // 18
                                                                                                                       // 19
  self.client = null;  // created in _launchConnection                                                                 // 20
  self.endpoint = endpoint;                                                                                            // 21
                                                                                                                       // 22
  self.headers = self.options.headers || {};                                                                           // 23
                                                                                                                       // 24
  self._initCommon(self.options);                                                                                      // 25
                                                                                                                       // 26
  //// Kickoff!                                                                                                        // 27
  self._launchConnection();                                                                                            // 28
};                                                                                                                     // 29
                                                                                                                       // 30
_.extend(LivedataTest.ClientStream.prototype, {                                                                        // 31
                                                                                                                       // 32
  // data is a utf8 string. Data sent while not connected is dropped on                                                // 33
  // the floor, and it is up the user of this API to retransmit lost                                                   // 34
  // messages on 'reset'                                                                                               // 35
  send: function (data) {                                                                                              // 36
    var self = this;                                                                                                   // 37
    if (self.currentStatus.connected) {                                                                                // 38
      self.client.send(data);                                                                                          // 39
    }                                                                                                                  // 40
  },                                                                                                                   // 41
                                                                                                                       // 42
  // Changes where this connection points                                                                              // 43
  _changeUrl: function (url) {                                                                                         // 44
    var self = this;                                                                                                   // 45
    self.endpoint = url;                                                                                               // 46
  },                                                                                                                   // 47
                                                                                                                       // 48
  _onConnect: function (client) {                                                                                      // 49
    var self = this;                                                                                                   // 50
                                                                                                                       // 51
    if (client !== self.client) {                                                                                      // 52
      // This connection is not from the last call to _launchConnection.                                               // 53
      // But _launchConnection calls _cleanup which closes previous connections.                                       // 54
      // It's our belief that this stifles future 'open' events, but maybe                                             // 55
      // we are wrong?                                                                                                 // 56
      throw new Error("Got open from inactive client " + !!self.client);                                               // 57
    }                                                                                                                  // 58
                                                                                                                       // 59
    if (self._forcedToDisconnect) {                                                                                    // 60
      // We were asked to disconnect between trying to open the connection and                                         // 61
      // actually opening it. Let's just pretend this never happened.                                                  // 62
      self.client.close();                                                                                             // 63
      self.client = null;                                                                                              // 64
      return;                                                                                                          // 65
    }                                                                                                                  // 66
                                                                                                                       // 67
    if (self.currentStatus.connected) {                                                                                // 68
      // We already have a connection. It must have been the case that we                                              // 69
      // started two parallel connection attempts (because we wanted to                                                // 70
      // 'reconnect now' on a hanging connection and we had no way to cancel the                                       // 71
      // connection attempt.) But this shouldn't happen (similarly to the client                                       // 72
      // !== self.client check above).                                                                                 // 73
      throw new Error("Two parallel connections?");                                                                    // 74
    }                                                                                                                  // 75
                                                                                                                       // 76
    self._clearConnectionTimer();                                                                                      // 77
                                                                                                                       // 78
    // update status                                                                                                   // 79
    self.currentStatus.status = "connected";                                                                           // 80
    self.currentStatus.connected = true;                                                                               // 81
    self.currentStatus.retryCount = 0;                                                                                 // 82
    self.statusChanged();                                                                                              // 83
                                                                                                                       // 84
    // fire resets. This must come after status change so that clients                                                 // 85
    // can call send from within a reset callback.                                                                     // 86
    _.each(self.eventCallbacks.reset, function (callback) { callback(); });                                            // 87
  },                                                                                                                   // 88
                                                                                                                       // 89
  _cleanup: function (maybeError) {                                                                                    // 90
    var self = this;                                                                                                   // 91
                                                                                                                       // 92
    self._clearConnectionTimer();                                                                                      // 93
    if (self.client) {                                                                                                 // 94
      var client = self.client;                                                                                        // 95
      self.client = null;                                                                                              // 96
      client.close();                                                                                                  // 97
                                                                                                                       // 98
      _.each(self.eventCallbacks.disconnect, function (callback) {                                                     // 99
        callback(maybeError);                                                                                          // 100
      });                                                                                                              // 101
    }                                                                                                                  // 102
  },                                                                                                                   // 103
                                                                                                                       // 104
  _clearConnectionTimer: function () {                                                                                 // 105
    var self = this;                                                                                                   // 106
                                                                                                                       // 107
    if (self.connectionTimer) {                                                                                        // 108
      clearTimeout(self.connectionTimer);                                                                              // 109
      self.connectionTimer = null;                                                                                     // 110
    }                                                                                                                  // 111
  },                                                                                                                   // 112
                                                                                                                       // 113
  _getProxyUrl: function (targetUrl) {                                                                                 // 114
    var self = this;                                                                                                   // 115
    // Similar to code in tools/http-helpers.js.                                                                       // 116
    var proxy = process.env.HTTP_PROXY || process.env.http_proxy || null;                                              // 117
    // if we're going to a secure url, try the https_proxy env variable first.                                         // 118
    if (targetUrl.match(/^wss:/)) {                                                                                    // 119
      proxy = process.env.HTTPS_PROXY || process.env.https_proxy || proxy;                                             // 120
    }                                                                                                                  // 121
    return proxy;                                                                                                      // 122
  },                                                                                                                   // 123
                                                                                                                       // 124
  _launchConnection: function () {                                                                                     // 125
    var self = this;                                                                                                   // 126
    self._cleanup(); // cleanup the old socket, if there was one.                                                      // 127
                                                                                                                       // 128
    // Since server-to-server DDP is still an experimental feature, we only                                            // 129
    // require the module if we actually create a server-to-server                                                     // 130
    // connection.                                                                                                     // 131
    var FayeWebSocket = Npm.require('faye-websocket');                                                                 // 132
                                                                                                                       // 133
    var targetUrl = toWebsocketUrl(self.endpoint);                                                                     // 134
    var fayeOptions = { headers: self.headers };                                                                       // 135
    var proxyUrl = self._getProxyUrl(targetUrl);                                                                       // 136
    if (proxyUrl) {                                                                                                    // 137
      fayeOptions.proxy = { origin: proxyUrl };                                                                        // 138
    };                                                                                                                 // 139
                                                                                                                       // 140
    // We would like to specify 'ddp' as the subprotocol here. The npm module we                                       // 141
    // used to use as a client would fail the handshake if we ask for a                                                // 142
    // subprotocol and the server doesn't send one back (and sockjs doesn't).                                          // 143
    // Faye doesn't have that behavior; it's unclear from reading RFC 6455 if                                          // 144
    // Faye is erroneous or not.  So for now, we don't specify protocols.                                              // 145
    var subprotocols = [];                                                                                             // 146
                                                                                                                       // 147
    var client = self.client = new FayeWebSocket.Client(                                                               // 148
      targetUrl, subprotocols, fayeOptions);                                                                           // 149
                                                                                                                       // 150
    self._clearConnectionTimer();                                                                                      // 151
    self.connectionTimer = Meteor.setTimeout(                                                                          // 152
      function () {                                                                                                    // 153
        self._lostConnection(                                                                                          // 154
          new DDP.ConnectionError("DDP connection timed out"));                                                        // 155
      },                                                                                                               // 156
      self.CONNECT_TIMEOUT);                                                                                           // 157
                                                                                                                       // 158
    self.client.on('open', Meteor.bindEnvironment(function () {                                                        // 159
      return self._onConnect(client);                                                                                  // 160
    }, "stream connect callback"));                                                                                    // 161
                                                                                                                       // 162
    var clientOnIfCurrent = function (event, description, f) {                                                         // 163
      self.client.on(event, Meteor.bindEnvironment(function () {                                                       // 164
        // Ignore events from any connection we've already cleaned up.                                                 // 165
        if (client !== self.client)                                                                                    // 166
          return;                                                                                                      // 167
        f.apply(this, arguments);                                                                                      // 168
      }, description));                                                                                                // 169
    };                                                                                                                 // 170
                                                                                                                       // 171
    clientOnIfCurrent('error', 'stream error callback', function (error) {                                             // 172
      if (!self.options._dontPrintErrors)                                                                              // 173
        Meteor._debug("stream error", error.message);                                                                  // 174
                                                                                                                       // 175
      // Faye's 'error' object is not a JS error (and among other things,                                              // 176
      // doesn't stringify well). Convert it to one.                                                                   // 177
      self._lostConnection(new DDP.ConnectionError(error.message));                                                    // 178
    });                                                                                                                // 179
                                                                                                                       // 180
                                                                                                                       // 181
    clientOnIfCurrent('close', 'stream close callback', function () {                                                  // 182
      self._lostConnection();                                                                                          // 183
    });                                                                                                                // 184
                                                                                                                       // 185
                                                                                                                       // 186
    clientOnIfCurrent('message', 'stream message callback', function (message) {                                       // 187
      // Ignore binary frames, where message.data is a Buffer                                                          // 188
      if (typeof message.data !== "string")                                                                            // 189
        return;                                                                                                        // 190
                                                                                                                       // 191
      _.each(self.eventCallbacks.message, function (callback) {                                                        // 192
        callback(message.data);                                                                                        // 193
      });                                                                                                              // 194
    });                                                                                                                // 195
  }                                                                                                                    // 196
});                                                                                                                    // 197
                                                                                                                       // 198
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/stream_client_common.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// XXX from Underscore.String (http://epeli.github.com/underscore.string/)                                             // 1
var startsWith = function(str, starts) {                                                                               // 2
  return str.length >= starts.length &&                                                                                // 3
    str.substring(0, starts.length) === starts;                                                                        // 4
};                                                                                                                     // 5
var endsWith = function(str, ends) {                                                                                   // 6
  return str.length >= ends.length &&                                                                                  // 7
    str.substring(str.length - ends.length) === ends;                                                                  // 8
};                                                                                                                     // 9
                                                                                                                       // 10
// @param url {String} URL to Meteor app, eg:                                                                          // 11
//   "/" or "madewith.meteor.com" or "https://foo.meteor.com"                                                          // 12
//   or "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                                 // 13
// @returns {String} URL to the endpoint with the specific scheme and subPath, e.g.                                    // 14
// for scheme "http" and subPath "sockjs"                                                                              // 15
//   "http://subdomain.meteor.com/sockjs" or "/sockjs"                                                                 // 16
//   or "https://ddp--1234-foo.meteor.com/sockjs"                                                                      // 17
var translateUrl =  function(url, newSchemeBase, subPath) {                                                            // 18
  if (! newSchemeBase) {                                                                                               // 19
    newSchemeBase = "http";                                                                                            // 20
  }                                                                                                                    // 21
                                                                                                                       // 22
  var ddpUrlMatch = url.match(/^ddp(i?)\+sockjs:\/\//);                                                                // 23
  var httpUrlMatch = url.match(/^http(s?):\/\//);                                                                      // 24
  var newScheme;                                                                                                       // 25
  if (ddpUrlMatch) {                                                                                                   // 26
    // Remove scheme and split off the host.                                                                           // 27
    var urlAfterDDP = url.substr(ddpUrlMatch[0].length);                                                               // 28
    newScheme = ddpUrlMatch[1] === "i" ? newSchemeBase : newSchemeBase + "s";                                          // 29
    var slashPos = urlAfterDDP.indexOf('/');                                                                           // 30
    var host =                                                                                                         // 31
          slashPos === -1 ? urlAfterDDP : urlAfterDDP.substr(0, slashPos);                                             // 32
    var rest = slashPos === -1 ? '' : urlAfterDDP.substr(slashPos);                                                    // 33
                                                                                                                       // 34
    // In the host (ONLY!), change '*' characters into random digits. This                                             // 35
    // allows different stream connections to connect to different hostnames                                           // 36
    // and avoid browser per-hostname connection limits.                                                               // 37
    host = host.replace(/\*/g, function () {                                                                           // 38
      return Math.floor(Random.fraction()*10);                                                                         // 39
    });                                                                                                                // 40
                                                                                                                       // 41
    return newScheme + '://' + host + rest;                                                                            // 42
  } else if (httpUrlMatch) {                                                                                           // 43
    newScheme = !httpUrlMatch[1] ? newSchemeBase : newSchemeBase + "s";                                                // 44
    var urlAfterHttp = url.substr(httpUrlMatch[0].length);                                                             // 45
    url = newScheme + "://" + urlAfterHttp;                                                                            // 46
  }                                                                                                                    // 47
                                                                                                                       // 48
  // Prefix FQDNs but not relative URLs                                                                                // 49
  if (url.indexOf("://") === -1 && !startsWith(url, "/")) {                                                            // 50
    url = newSchemeBase + "://" + url;                                                                                 // 51
  }                                                                                                                    // 52
                                                                                                                       // 53
  // XXX This is not what we should be doing: if I have a site                                                         // 54
  // deployed at "/foo", then DDP.connect("/") should actually connect                                                 // 55
  // to "/", not to "/foo". "/" is an absolute path. (Contrast: if                                                     // 56
  // deployed at "/foo", it would be reasonable for DDP.connect("bar")                                                 // 57
  // to connect to "/foo/bar").                                                                                        // 58
  //                                                                                                                   // 59
  // We should make this properly honor absolute paths rather than                                                     // 60
  // forcing the path to be relative to the site root. Simultaneously,                                                 // 61
  // we should set DDP_DEFAULT_CONNECTION_URL to include the site                                                      // 62
  // root. See also client_convenience.js #RationalizingRelativeDDPURLs                                                // 63
  url = Meteor._relativeToSiteRootUrl(url);                                                                            // 64
                                                                                                                       // 65
  if (endsWith(url, "/"))                                                                                              // 66
    return url + subPath;                                                                                              // 67
  else                                                                                                                 // 68
    return url + "/" + subPath;                                                                                        // 69
};                                                                                                                     // 70
                                                                                                                       // 71
toSockjsUrl = function (url) {                                                                                         // 72
  return translateUrl(url, "http", "sockjs");                                                                          // 73
};                                                                                                                     // 74
                                                                                                                       // 75
toWebsocketUrl = function (url) {                                                                                      // 76
  var ret = translateUrl(url, "ws", "websocket");                                                                      // 77
  return ret;                                                                                                          // 78
};                                                                                                                     // 79
                                                                                                                       // 80
LivedataTest.toSockjsUrl = toSockjsUrl;                                                                                // 81
                                                                                                                       // 82
                                                                                                                       // 83
_.extend(LivedataTest.ClientStream.prototype, {                                                                        // 84
                                                                                                                       // 85
  // Register for callbacks.                                                                                           // 86
  on: function (name, callback) {                                                                                      // 87
    var self = this;                                                                                                   // 88
                                                                                                                       // 89
    if (name !== 'message' && name !== 'reset' && name !== 'disconnect')                                               // 90
      throw new Error("unknown event type: " + name);                                                                  // 91
                                                                                                                       // 92
    if (!self.eventCallbacks[name])                                                                                    // 93
      self.eventCallbacks[name] = [];                                                                                  // 94
    self.eventCallbacks[name].push(callback);                                                                          // 95
  },                                                                                                                   // 96
                                                                                                                       // 97
                                                                                                                       // 98
  _initCommon: function (options) {                                                                                    // 99
    var self = this;                                                                                                   // 100
    options = options || {};                                                                                           // 101
                                                                                                                       // 102
    //// Constants                                                                                                     // 103
                                                                                                                       // 104
    // how long to wait until we declare the connection attempt                                                        // 105
    // failed.                                                                                                         // 106
    self.CONNECT_TIMEOUT = options.connectTimeoutMs || 10000;                                                          // 107
                                                                                                                       // 108
    self.eventCallbacks = {}; // name -> [callback]                                                                    // 109
                                                                                                                       // 110
    self._forcedToDisconnect = false;                                                                                  // 111
                                                                                                                       // 112
    //// Reactive status                                                                                               // 113
    self.currentStatus = {                                                                                             // 114
      status: "connecting",                                                                                            // 115
      connected: false,                                                                                                // 116
      retryCount: 0                                                                                                    // 117
    };                                                                                                                 // 118
                                                                                                                       // 119
                                                                                                                       // 120
    self.statusListeners = typeof Tracker !== 'undefined' && new Tracker.Dependency;                                   // 121
    self.statusChanged = function () {                                                                                 // 122
      if (self.statusListeners)                                                                                        // 123
        self.statusListeners.changed();                                                                                // 124
    };                                                                                                                 // 125
                                                                                                                       // 126
    //// Retry logic                                                                                                   // 127
    self._retry = new Retry;                                                                                           // 128
    self.connectionTimer = null;                                                                                       // 129
                                                                                                                       // 130
  },                                                                                                                   // 131
                                                                                                                       // 132
  // Trigger a reconnect.                                                                                              // 133
  reconnect: function (options) {                                                                                      // 134
    var self = this;                                                                                                   // 135
    options = options || {};                                                                                           // 136
                                                                                                                       // 137
    if (options.url) {                                                                                                 // 138
      self._changeUrl(options.url);                                                                                    // 139
    }                                                                                                                  // 140
                                                                                                                       // 141
    if (options._sockjsOptions) {                                                                                      // 142
      self.options._sockjsOptions = options._sockjsOptions;                                                            // 143
    }                                                                                                                  // 144
                                                                                                                       // 145
    if (self.currentStatus.connected) {                                                                                // 146
      if (options._force || options.url) {                                                                             // 147
        // force reconnect.                                                                                            // 148
        self._lostConnection(new DDP.ForcedReconnectError);                                                            // 149
      } // else, noop.                                                                                                 // 150
      return;                                                                                                          // 151
    }                                                                                                                  // 152
                                                                                                                       // 153
    // if we're mid-connection, stop it.                                                                               // 154
    if (self.currentStatus.status === "connecting") {                                                                  // 155
      // Pretend it's a clean close.                                                                                   // 156
      self._lostConnection();                                                                                          // 157
    }                                                                                                                  // 158
                                                                                                                       // 159
    self._retry.clear();                                                                                               // 160
    self.currentStatus.retryCount -= 1; // don't count manual retries                                                  // 161
    self._retryNow();                                                                                                  // 162
  },                                                                                                                   // 163
                                                                                                                       // 164
  disconnect: function (options) {                                                                                     // 165
    var self = this;                                                                                                   // 166
    options = options || {};                                                                                           // 167
                                                                                                                       // 168
    // Failed is permanent. If we're failed, don't let people go back                                                  // 169
    // online by calling 'disconnect' then 'reconnect'.                                                                // 170
    if (self._forcedToDisconnect)                                                                                      // 171
      return;                                                                                                          // 172
                                                                                                                       // 173
    // If _permanent is set, permanently disconnect a stream. Once a stream                                            // 174
    // is forced to disconnect, it can never reconnect. This is for                                                    // 175
    // error cases such as ddp version mismatch, where trying again                                                    // 176
    // won't fix the problem.                                                                                          // 177
    if (options._permanent) {                                                                                          // 178
      self._forcedToDisconnect = true;                                                                                 // 179
    }                                                                                                                  // 180
                                                                                                                       // 181
    self._cleanup();                                                                                                   // 182
    self._retry.clear();                                                                                               // 183
                                                                                                                       // 184
    self.currentStatus = {                                                                                             // 185
      status: (options._permanent ? "failed" : "offline"),                                                             // 186
      connected: false,                                                                                                // 187
      retryCount: 0                                                                                                    // 188
    };                                                                                                                 // 189
                                                                                                                       // 190
    if (options._permanent && options._error)                                                                          // 191
      self.currentStatus.reason = options._error;                                                                      // 192
                                                                                                                       // 193
    self.statusChanged();                                                                                              // 194
  },                                                                                                                   // 195
                                                                                                                       // 196
  // maybeError is set unless it's a clean protocol-level close.                                                       // 197
  _lostConnection: function (maybeError) {                                                                             // 198
    var self = this;                                                                                                   // 199
                                                                                                                       // 200
    self._cleanup(maybeError);                                                                                         // 201
    self._retryLater(maybeError); // sets status. no need to do it here.                                               // 202
  },                                                                                                                   // 203
                                                                                                                       // 204
  // fired when we detect that we've gone online. try to reconnect                                                     // 205
  // immediately.                                                                                                      // 206
  _online: function () {                                                                                               // 207
    // if we've requested to be offline by disconnecting, don't reconnect.                                             // 208
    if (this.currentStatus.status != "offline")                                                                        // 209
      this.reconnect();                                                                                                // 210
  },                                                                                                                   // 211
                                                                                                                       // 212
  _retryLater: function (maybeError) {                                                                                 // 213
    var self = this;                                                                                                   // 214
                                                                                                                       // 215
    var timeout = 0;                                                                                                   // 216
    if (self.options.retry ||                                                                                          // 217
        (maybeError && maybeError.errorType === "DDP.ForcedReconnectError")) {                                         // 218
      timeout = self._retry.retryLater(                                                                                // 219
        self.currentStatus.retryCount,                                                                                 // 220
        _.bind(self._retryNow, self)                                                                                   // 221
      );                                                                                                               // 222
      self.currentStatus.status = "waiting";                                                                           // 223
      self.currentStatus.retryTime = (new Date()).getTime() + timeout;                                                 // 224
    } else {                                                                                                           // 225
      self.currentStatus.status = "failed";                                                                            // 226
      delete self.currentStatus.retryTime;                                                                             // 227
    }                                                                                                                  // 228
                                                                                                                       // 229
    self.currentStatus.connected = false;                                                                              // 230
    self.statusChanged();                                                                                              // 231
  },                                                                                                                   // 232
                                                                                                                       // 233
  _retryNow: function () {                                                                                             // 234
    var self = this;                                                                                                   // 235
                                                                                                                       // 236
    if (self._forcedToDisconnect)                                                                                      // 237
      return;                                                                                                          // 238
                                                                                                                       // 239
    self.currentStatus.retryCount += 1;                                                                                // 240
    self.currentStatus.status = "connecting";                                                                          // 241
    self.currentStatus.connected = false;                                                                              // 242
    delete self.currentStatus.retryTime;                                                                               // 243
    self.statusChanged();                                                                                              // 244
                                                                                                                       // 245
    self._launchConnection();                                                                                          // 246
  },                                                                                                                   // 247
                                                                                                                       // 248
                                                                                                                       // 249
  // Get current status. Reactive.                                                                                     // 250
  status: function () {                                                                                                // 251
    var self = this;                                                                                                   // 252
    if (self.statusListeners)                                                                                          // 253
      self.statusListeners.depend();                                                                                   // 254
    return self.currentStatus;                                                                                         // 255
  }                                                                                                                    // 256
});                                                                                                                    // 257
                                                                                                                       // 258
DDP.ConnectionError = Meteor.makeErrorType(                                                                            // 259
  "DDP.ConnectionError", function (message) {                                                                          // 260
    var self = this;                                                                                                   // 261
    self.message = message;                                                                                            // 262
});                                                                                                                    // 263
                                                                                                                       // 264
DDP.ForcedReconnectError = Meteor.makeErrorType(                                                                       // 265
  "DDP.ForcedReconnectError", function () {});                                                                         // 266
                                                                                                                       // 267
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/stream_server.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var url = Npm.require('url');                                                                                          // 1
                                                                                                                       // 2
var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX ||  "";                                                // 3
                                                                                                                       // 4
StreamServer = function () {                                                                                           // 5
  var self = this;                                                                                                     // 6
  self.registration_callbacks = [];                                                                                    // 7
  self.open_sockets = [];                                                                                              // 8
                                                                                                                       // 9
  // Because we are installing directly onto WebApp.httpServer instead of using                                        // 10
  // WebApp.app, we have to process the path prefix ourselves.                                                         // 11
  self.prefix = pathPrefix + '/sockjs';                                                                                // 12
  // routepolicy is only a weak dependency, because we don't need it if we're                                          // 13
  // just doing server-to-server DDP as a client.                                                                      // 14
  if (Package.routepolicy) {                                                                                           // 15
    Package.routepolicy.RoutePolicy.declare(self.prefix + '/', 'network');                                             // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  // set up sockjs                                                                                                     // 19
  var sockjs = Npm.require('sockjs');                                                                                  // 20
  var serverOptions = {                                                                                                // 21
    prefix: self.prefix,                                                                                               // 22
    log: function() {},                                                                                                // 23
    // this is the default, but we code it explicitly because we depend                                                // 24
    // on it in stream_client:HEARTBEAT_TIMEOUT                                                                        // 25
    heartbeat_delay: 45000,                                                                                            // 26
    // The default disconnect_delay is 5 seconds, but if the server ends up CPU                                        // 27
    // bound for that much time, SockJS might not notice that the user has                                             // 28
    // reconnected because the timer (of disconnect_delay ms) can fire before                                          // 29
    // SockJS processes the new connection. Eventually we'll fix this by not                                           // 30
    // combining CPU-heavy processing with SockJS termination (eg a proxy which                                        // 31
    // converts to Unix sockets) but for now, raise the delay.                                                         // 32
    disconnect_delay: 60 * 1000,                                                                                       // 33
    // Set the USE_JSESSIONID environment variable to enable setting the                                               // 34
    // JSESSIONID cookie. This is useful for setting up proxies with                                                   // 35
    // session affinity.                                                                                               // 36
    jsessionid: !!process.env.USE_JSESSIONID                                                                           // 37
  };                                                                                                                   // 38
                                                                                                                       // 39
  // If you know your server environment (eg, proxies) will prevent websockets                                         // 40
  // from ever working, set $DISABLE_WEBSOCKETS and SockJS clients (ie,                                                // 41
  // browsers) will not waste time attempting to use them.                                                             // 42
  // (Your server will still have a /websocket endpoint.)                                                              // 43
  if (process.env.DISABLE_WEBSOCKETS)                                                                                  // 44
    serverOptions.websocket = false;                                                                                   // 45
                                                                                                                       // 46
  self.server = sockjs.createServer(serverOptions);                                                                    // 47
  if (!Package.webapp) {                                                                                               // 48
    throw new Error("Cannot create a DDP server without the webapp package");                                          // 49
  }                                                                                                                    // 50
  // Install the sockjs handlers, but we want to keep around our own particular                                        // 51
  // request handler that adjusts idle timeouts while we have an outstanding                                           // 52
  // request.  This compensates for the fact that sockjs removes all listeners                                         // 53
  // for "request" to add its own.                                                                                     // 54
  Package.webapp.WebApp.httpServer.removeListener('request', Package.webapp.WebApp._timeoutAdjustmentRequestCallback); // 55
  self.server.installHandlers(Package.webapp.WebApp.httpServer);                                                       // 56
  Package.webapp.WebApp.httpServer.addListener('request', Package.webapp.WebApp._timeoutAdjustmentRequestCallback);    // 57
                                                                                                                       // 58
  // Support the /websocket endpoint                                                                                   // 59
  self._redirectWebsocketEndpoint();                                                                                   // 60
                                                                                                                       // 61
  self.server.on('connection', function (socket) {                                                                     // 62
    socket.send = function (data) {                                                                                    // 63
      socket.write(data);                                                                                              // 64
    };                                                                                                                 // 65
    socket.on('close', function () {                                                                                   // 66
      self.open_sockets = _.without(self.open_sockets, socket);                                                        // 67
    });                                                                                                                // 68
    self.open_sockets.push(socket);                                                                                    // 69
                                                                                                                       // 70
    // XXX COMPAT WITH 0.6.6. Send the old style welcome message, which                                                // 71
    // will force old clients to reload. Remove this once we're not                                                    // 72
    // concerned about people upgrading from a pre-0.7.0 release. Also,                                                // 73
    // remove the clause in the client that ignores the welcome message                                                // 74
    // (livedata_connection.js)                                                                                        // 75
    socket.send(JSON.stringify({server_id: "0"}));                                                                     // 76
                                                                                                                       // 77
    // call all our callbacks when we get a new socket. they will do the                                               // 78
    // work of setting up handlers and such for specific messages.                                                     // 79
    _.each(self.registration_callbacks, function (callback) {                                                          // 80
      callback(socket);                                                                                                // 81
    });                                                                                                                // 82
  });                                                                                                                  // 83
                                                                                                                       // 84
};                                                                                                                     // 85
                                                                                                                       // 86
_.extend(StreamServer.prototype, {                                                                                     // 87
  // call my callback when a new socket connects.                                                                      // 88
  // also call it for all current connections.                                                                         // 89
  register: function (callback) {                                                                                      // 90
    var self = this;                                                                                                   // 91
    self.registration_callbacks.push(callback);                                                                        // 92
    _.each(self.all_sockets(), function (socket) {                                                                     // 93
      callback(socket);                                                                                                // 94
    });                                                                                                                // 95
  },                                                                                                                   // 96
                                                                                                                       // 97
  // get a list of all sockets                                                                                         // 98
  all_sockets: function () {                                                                                           // 99
    var self = this;                                                                                                   // 100
    return _.values(self.open_sockets);                                                                                // 101
  },                                                                                                                   // 102
                                                                                                                       // 103
  // Redirect /websocket to /sockjs/websocket in order to not expose                                                   // 104
  // sockjs to clients that want to use raw websockets                                                                 // 105
  _redirectWebsocketEndpoint: function() {                                                                             // 106
    var self = this;                                                                                                   // 107
    // Unfortunately we can't use a connect middleware here since                                                      // 108
    // sockjs installs itself prior to all existing listeners                                                          // 109
    // (meaning prior to any connect middlewares) so we need to take                                                   // 110
    // an approach similar to overshadowListeners in                                                                   // 111
    // https://github.com/sockjs/sockjs-node/blob/cf820c55af6a9953e16558555a31decea554f70e/src/utils.coffee            // 112
    _.each(['request', 'upgrade'], function(event) {                                                                   // 113
      var httpServer = Package.webapp.WebApp.httpServer;                                                               // 114
      var oldHttpServerListeners = httpServer.listeners(event).slice(0);                                               // 115
      httpServer.removeAllListeners(event);                                                                            // 116
                                                                                                                       // 117
      // request and upgrade have different arguments passed but                                                       // 118
      // we only care about the first one which is always request                                                      // 119
      var newListener = function(request /*, moreArguments */) {                                                       // 120
        // Store arguments for use within the closure below                                                            // 121
        var args = arguments;                                                                                          // 122
                                                                                                                       // 123
        // Rewrite /websocket and /websocket/ urls to /sockjs/websocket while                                          // 124
        // preserving query string.                                                                                    // 125
        var parsedUrl = url.parse(request.url);                                                                        // 126
        if (parsedUrl.pathname === pathPrefix + '/websocket' ||                                                        // 127
            parsedUrl.pathname === pathPrefix + '/websocket/') {                                                       // 128
          parsedUrl.pathname = self.prefix + '/websocket';                                                             // 129
          request.url = url.format(parsedUrl);                                                                         // 130
        }                                                                                                              // 131
        _.each(oldHttpServerListeners, function(oldListener) {                                                         // 132
          oldListener.apply(httpServer, args);                                                                         // 133
        });                                                                                                            // 134
      };                                                                                                               // 135
      httpServer.addListener(event, newListener);                                                                      // 136
    });                                                                                                                // 137
  }                                                                                                                    // 138
});                                                                                                                    // 139
                                                                                                                       // 140
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/heartbeat.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Heartbeat options:                                                                                                  // 1
//   heartbeatInterval: interval to send pings, in milliseconds.                                                       // 2
//   heartbeatTimeout: timeout to close the connection if a reply isn't                                                // 3
//     received, in milliseconds.                                                                                      // 4
//   sendPing: function to call to send a ping on the connection.                                                      // 5
//   onTimeout: function to call to close the connection.                                                              // 6
                                                                                                                       // 7
Heartbeat = function (options) {                                                                                       // 8
  var self = this;                                                                                                     // 9
                                                                                                                       // 10
  self.heartbeatInterval = options.heartbeatInterval;                                                                  // 11
  self.heartbeatTimeout = options.heartbeatTimeout;                                                                    // 12
  self._sendPing = options.sendPing;                                                                                   // 13
  self._onTimeout = options.onTimeout;                                                                                 // 14
                                                                                                                       // 15
  self._heartbeatIntervalHandle = null;                                                                                // 16
  self._heartbeatTimeoutHandle = null;                                                                                 // 17
};                                                                                                                     // 18
                                                                                                                       // 19
_.extend(Heartbeat.prototype, {                                                                                        // 20
  stop: function () {                                                                                                  // 21
    var self = this;                                                                                                   // 22
    self._clearHeartbeatIntervalTimer();                                                                               // 23
    self._clearHeartbeatTimeoutTimer();                                                                                // 24
  },                                                                                                                   // 25
                                                                                                                       // 26
  start: function () {                                                                                                 // 27
    var self = this;                                                                                                   // 28
    self.stop();                                                                                                       // 29
    self._startHeartbeatIntervalTimer();                                                                               // 30
  },                                                                                                                   // 31
                                                                                                                       // 32
  _startHeartbeatIntervalTimer: function () {                                                                          // 33
    var self = this;                                                                                                   // 34
    self._heartbeatIntervalHandle = Meteor.setTimeout(                                                                 // 35
      _.bind(self._heartbeatIntervalFired, self),                                                                      // 36
      self.heartbeatInterval                                                                                           // 37
    );                                                                                                                 // 38
  },                                                                                                                   // 39
                                                                                                                       // 40
  _startHeartbeatTimeoutTimer: function () {                                                                           // 41
    var self = this;                                                                                                   // 42
    self._heartbeatTimeoutHandle = Meteor.setTimeout(                                                                  // 43
      _.bind(self._heartbeatTimeoutFired, self),                                                                       // 44
      self.heartbeatTimeout                                                                                            // 45
    );                                                                                                                 // 46
  },                                                                                                                   // 47
                                                                                                                       // 48
  _clearHeartbeatIntervalTimer: function () {                                                                          // 49
    var self = this;                                                                                                   // 50
    if (self._heartbeatIntervalHandle) {                                                                               // 51
      Meteor.clearTimeout(self._heartbeatIntervalHandle);                                                              // 52
      self._heartbeatIntervalHandle = null;                                                                            // 53
    }                                                                                                                  // 54
  },                                                                                                                   // 55
                                                                                                                       // 56
  _clearHeartbeatTimeoutTimer: function () {                                                                           // 57
    var self = this;                                                                                                   // 58
    if (self._heartbeatTimeoutHandle) {                                                                                // 59
      Meteor.clearTimeout(self._heartbeatTimeoutHandle);                                                               // 60
      self._heartbeatTimeoutHandle = null;                                                                             // 61
    }                                                                                                                  // 62
  },                                                                                                                   // 63
                                                                                                                       // 64
  // The heartbeat interval timer is fired when we should send a ping.                                                 // 65
  _heartbeatIntervalFired: function () {                                                                               // 66
    var self = this;                                                                                                   // 67
    self._heartbeatIntervalHandle = null;                                                                              // 68
    self._sendPing();                                                                                                  // 69
    // Wait for a pong.                                                                                                // 70
    self._startHeartbeatTimeoutTimer();                                                                                // 71
  },                                                                                                                   // 72
                                                                                                                       // 73
  // The heartbeat timeout timer is fired when we sent a ping, but we                                                  // 74
  // timed out waiting for the pong.                                                                                   // 75
  _heartbeatTimeoutFired: function () {                                                                                // 76
    var self = this;                                                                                                   // 77
    self._heartbeatTimeoutHandle = null;                                                                               // 78
    self._onTimeout();                                                                                                 // 79
  },                                                                                                                   // 80
                                                                                                                       // 81
  pingReceived: function () {                                                                                          // 82
    var self = this;                                                                                                   // 83
    // We know the connection is alive if we receive a ping, so we                                                     // 84
    // don't need to send a ping ourselves.  Reset the interval timer.                                                 // 85
    if (self._heartbeatIntervalHandle) {                                                                               // 86
      self._clearHeartbeatIntervalTimer();                                                                             // 87
      self._startHeartbeatIntervalTimer();                                                                             // 88
    }                                                                                                                  // 89
  },                                                                                                                   // 90
                                                                                                                       // 91
  pongReceived: function () {                                                                                          // 92
    var self = this;                                                                                                   // 93
                                                                                                                       // 94
    // Receiving a pong means we won't timeout, so clear the timeout                                                   // 95
    // timer and start the interval again.                                                                             // 96
    if (self._heartbeatTimeoutHandle) {                                                                                // 97
      self._clearHeartbeatTimeoutTimer();                                                                              // 98
      self._startHeartbeatIntervalTimer();                                                                             // 99
    }                                                                                                                  // 100
  }                                                                                                                    // 101
});                                                                                                                    // 102
                                                                                                                       // 103
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/livedata_server.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
DDPServer = {};                                                                                                        // 1
                                                                                                                       // 2
var Fiber = Npm.require('fibers');                                                                                     // 3
                                                                                                                       // 4
// This file contains classes:                                                                                         // 5
// * Session - The server's connection to a single DDP client                                                          // 6
// * Subscription - A single subscription for a single client                                                          // 7
// * Server - An entire server that may talk to > 1 client. A DDP endpoint.                                            // 8
//                                                                                                                     // 9
// Session and Subscription are file scope. For now, until we freeze                                                   // 10
// the interface, Server is package scope (in the future it should be                                                  // 11
// exported.)                                                                                                          // 12
                                                                                                                       // 13
// Represents a single document in a SessionCollectionView                                                             // 14
var SessionDocumentView = function () {                                                                                // 15
  var self = this;                                                                                                     // 16
  self.existsIn = {}; // set of subscriptionHandle                                                                     // 17
  self.dataByKey = {}; // key-> [ {subscriptionHandle, value} by precedence]                                           // 18
};                                                                                                                     // 19
                                                                                                                       // 20
_.extend(SessionDocumentView.prototype, {                                                                              // 21
                                                                                                                       // 22
  getFields: function () {                                                                                             // 23
    var self = this;                                                                                                   // 24
    var ret = {};                                                                                                      // 25
    _.each(self.dataByKey, function (precedenceList, key) {                                                            // 26
      ret[key] = precedenceList[0].value;                                                                              // 27
    });                                                                                                                // 28
    return ret;                                                                                                        // 29
  },                                                                                                                   // 30
                                                                                                                       // 31
  clearField: function (subscriptionHandle, key, changeCollector) {                                                    // 32
    var self = this;                                                                                                   // 33
    // Publish API ignores _id if present in fields                                                                    // 34
    if (key === "_id")                                                                                                 // 35
      return;                                                                                                          // 36
    var precedenceList = self.dataByKey[key];                                                                          // 37
                                                                                                                       // 38
    // It's okay to clear fields that didn't exist. No need to throw                                                   // 39
    // an error.                                                                                                       // 40
    if (!precedenceList)                                                                                               // 41
      return;                                                                                                          // 42
                                                                                                                       // 43
    var removedValue = undefined;                                                                                      // 44
    for (var i = 0; i < precedenceList.length; i++) {                                                                  // 45
      var precedence = precedenceList[i];                                                                              // 46
      if (precedence.subscriptionHandle === subscriptionHandle) {                                                      // 47
        // The view's value can only change if this subscription is the one that                                       // 48
        // used to have precedence.                                                                                    // 49
        if (i === 0)                                                                                                   // 50
          removedValue = precedence.value;                                                                             // 51
        precedenceList.splice(i, 1);                                                                                   // 52
        break;                                                                                                         // 53
      }                                                                                                                // 54
    }                                                                                                                  // 55
    if (_.isEmpty(precedenceList)) {                                                                                   // 56
      delete self.dataByKey[key];                                                                                      // 57
      changeCollector[key] = undefined;                                                                                // 58
    } else if (removedValue !== undefined &&                                                                           // 59
               !EJSON.equals(removedValue, precedenceList[0].value)) {                                                 // 60
      changeCollector[key] = precedenceList[0].value;                                                                  // 61
    }                                                                                                                  // 62
  },                                                                                                                   // 63
                                                                                                                       // 64
  changeField: function (subscriptionHandle, key, value,                                                               // 65
                         changeCollector, isAdd) {                                                                     // 66
    var self = this;                                                                                                   // 67
    // Publish API ignores _id if present in fields                                                                    // 68
    if (key === "_id")                                                                                                 // 69
      return;                                                                                                          // 70
                                                                                                                       // 71
    // Don't share state with the data passed in by the user.                                                          // 72
    value = EJSON.clone(value);                                                                                        // 73
                                                                                                                       // 74
    if (!_.has(self.dataByKey, key)) {                                                                                 // 75
      self.dataByKey[key] = [{subscriptionHandle: subscriptionHandle,                                                  // 76
                              value: value}];                                                                          // 77
      changeCollector[key] = value;                                                                                    // 78
      return;                                                                                                          // 79
    }                                                                                                                  // 80
    var precedenceList = self.dataByKey[key];                                                                          // 81
    var elt;                                                                                                           // 82
    if (!isAdd) {                                                                                                      // 83
      elt = _.find(precedenceList, function (precedence) {                                                             // 84
        return precedence.subscriptionHandle === subscriptionHandle;                                                   // 85
      });                                                                                                              // 86
    }                                                                                                                  // 87
                                                                                                                       // 88
    if (elt) {                                                                                                         // 89
      if (elt === precedenceList[0] && !EJSON.equals(value, elt.value)) {                                              // 90
        // this subscription is changing the value of this field.                                                      // 91
        changeCollector[key] = value;                                                                                  // 92
      }                                                                                                                // 93
      elt.value = value;                                                                                               // 94
    } else {                                                                                                           // 95
      // this subscription is newly caring about this field                                                            // 96
      precedenceList.push({subscriptionHandle: subscriptionHandle, value: value});                                     // 97
    }                                                                                                                  // 98
                                                                                                                       // 99
  }                                                                                                                    // 100
});                                                                                                                    // 101
                                                                                                                       // 102
/**                                                                                                                    // 103
 * Represents a client's view of a single collection                                                                   // 104
 * @param {String} collectionName Name of the collection it represents                                                 // 105
 * @param {Object.<String, Function>} sessionCallbacks The callbacks for added, changed, removed                       // 106
 * @class SessionCollectionView                                                                                        // 107
 */                                                                                                                    // 108
var SessionCollectionView = function (collectionName, sessionCallbacks) {                                              // 109
  var self = this;                                                                                                     // 110
  self.collectionName = collectionName;                                                                                // 111
  self.documents = {};                                                                                                 // 112
  self.callbacks = sessionCallbacks;                                                                                   // 113
};                                                                                                                     // 114
                                                                                                                       // 115
LivedataTest.SessionCollectionView = SessionCollectionView;                                                            // 116
                                                                                                                       // 117
                                                                                                                       // 118
_.extend(SessionCollectionView.prototype, {                                                                            // 119
                                                                                                                       // 120
  isEmpty: function () {                                                                                               // 121
    var self = this;                                                                                                   // 122
    return _.isEmpty(self.documents);                                                                                  // 123
  },                                                                                                                   // 124
                                                                                                                       // 125
  diff: function (previous) {                                                                                          // 126
    var self = this;                                                                                                   // 127
    LocalCollection._diffObjects(previous.documents, self.documents, {                                                 // 128
      both: _.bind(self.diffDocument, self),                                                                           // 129
                                                                                                                       // 130
      rightOnly: function (id, nowDV) {                                                                                // 131
        self.callbacks.added(self.collectionName, id, nowDV.getFields());                                              // 132
      },                                                                                                               // 133
                                                                                                                       // 134
      leftOnly: function (id, prevDV) {                                                                                // 135
        self.callbacks.removed(self.collectionName, id);                                                               // 136
      }                                                                                                                // 137
    });                                                                                                                // 138
  },                                                                                                                   // 139
                                                                                                                       // 140
  diffDocument: function (id, prevDV, nowDV) {                                                                         // 141
    var self = this;                                                                                                   // 142
    var fields = {};                                                                                                   // 143
    LocalCollection._diffObjects(prevDV.getFields(), nowDV.getFields(), {                                              // 144
      both: function (key, prev, now) {                                                                                // 145
        if (!EJSON.equals(prev, now))                                                                                  // 146
          fields[key] = now;                                                                                           // 147
      },                                                                                                               // 148
      rightOnly: function (key, now) {                                                                                 // 149
        fields[key] = now;                                                                                             // 150
      },                                                                                                               // 151
      leftOnly: function(key, prev) {                                                                                  // 152
        fields[key] = undefined;                                                                                       // 153
      }                                                                                                                // 154
    });                                                                                                                // 155
    self.callbacks.changed(self.collectionName, id, fields);                                                           // 156
  },                                                                                                                   // 157
                                                                                                                       // 158
  added: function (subscriptionHandle, id, fields) {                                                                   // 159
    var self = this;                                                                                                   // 160
    var docView = self.documents[id];                                                                                  // 161
    var added = false;                                                                                                 // 162
    if (!docView) {                                                                                                    // 163
      added = true;                                                                                                    // 164
      docView = new SessionDocumentView();                                                                             // 165
      self.documents[id] = docView;                                                                                    // 166
    }                                                                                                                  // 167
    docView.existsIn[subscriptionHandle] = true;                                                                       // 168
    var changeCollector = {};                                                                                          // 169
    _.each(fields, function (value, key) {                                                                             // 170
      docView.changeField(                                                                                             // 171
        subscriptionHandle, key, value, changeCollector, true);                                                        // 172
    });                                                                                                                // 173
    if (added)                                                                                                         // 174
      self.callbacks.added(self.collectionName, id, changeCollector);                                                  // 175
    else                                                                                                               // 176
      self.callbacks.changed(self.collectionName, id, changeCollector);                                                // 177
  },                                                                                                                   // 178
                                                                                                                       // 179
  changed: function (subscriptionHandle, id, changed) {                                                                // 180
    var self = this;                                                                                                   // 181
    var changedResult = {};                                                                                            // 182
    var docView = self.documents[id];                                                                                  // 183
    if (!docView)                                                                                                      // 184
      throw new Error("Could not find element with id " + id + " to change");                                          // 185
    _.each(changed, function (value, key) {                                                                            // 186
      if (value === undefined)                                                                                         // 187
        docView.clearField(subscriptionHandle, key, changedResult);                                                    // 188
      else                                                                                                             // 189
        docView.changeField(subscriptionHandle, key, value, changedResult);                                            // 190
    });                                                                                                                // 191
    self.callbacks.changed(self.collectionName, id, changedResult);                                                    // 192
  },                                                                                                                   // 193
                                                                                                                       // 194
  removed: function (subscriptionHandle, id) {                                                                         // 195
    var self = this;                                                                                                   // 196
    var docView = self.documents[id];                                                                                  // 197
    if (!docView) {                                                                                                    // 198
      var err = new Error("Removed nonexistent document " + id);                                                       // 199
      throw err;                                                                                                       // 200
    }                                                                                                                  // 201
    delete docView.existsIn[subscriptionHandle];                                                                       // 202
    if (_.isEmpty(docView.existsIn)) {                                                                                 // 203
      // it is gone from everyone                                                                                      // 204
      self.callbacks.removed(self.collectionName, id);                                                                 // 205
      delete self.documents[id];                                                                                       // 206
    } else {                                                                                                           // 207
      var changed = {};                                                                                                // 208
      // remove this subscription from every precedence list                                                           // 209
      // and record the changes                                                                                        // 210
      _.each(docView.dataByKey, function (precedenceList, key) {                                                       // 211
        docView.clearField(subscriptionHandle, key, changed);                                                          // 212
      });                                                                                                              // 213
                                                                                                                       // 214
      self.callbacks.changed(self.collectionName, id, changed);                                                        // 215
    }                                                                                                                  // 216
  }                                                                                                                    // 217
});                                                                                                                    // 218
                                                                                                                       // 219
/******************************************************************************/                                       // 220
/* Session                                                                    */                                       // 221
/******************************************************************************/                                       // 222
                                                                                                                       // 223
var Session = function (server, version, socket, options) {                                                            // 224
  var self = this;                                                                                                     // 225
  self.id = Random.id();                                                                                               // 226
                                                                                                                       // 227
  self.server = server;                                                                                                // 228
  self.version = version;                                                                                              // 229
                                                                                                                       // 230
  self.initialized = false;                                                                                            // 231
  self.socket = socket;                                                                                                // 232
                                                                                                                       // 233
  // set to null when the session is destroyed. multiple places below                                                  // 234
  // use this to determine if the session is alive or not.                                                             // 235
  self.inQueue = new Meteor._DoubleEndedQueue();                                                                       // 236
                                                                                                                       // 237
  self.blocked = false;                                                                                                // 238
  self.workerRunning = false;                                                                                          // 239
                                                                                                                       // 240
  // Sub objects for active subscriptions                                                                              // 241
  self._namedSubs = {};                                                                                                // 242
  self._universalSubs = [];                                                                                            // 243
                                                                                                                       // 244
  self.userId = null;                                                                                                  // 245
                                                                                                                       // 246
  self.collectionViews = {};                                                                                           // 247
                                                                                                                       // 248
  // Set this to false to not send messages when collectionViews are                                                   // 249
  // modified. This is done when rerunning subs in _setUserId and those messages                                       // 250
  // are calculated via a diff instead.                                                                                // 251
  self._isSending = true;                                                                                              // 252
                                                                                                                       // 253
  // If this is true, don't start a newly-created universal publisher on this                                          // 254
  // session. The session will take care of starting it when appropriate.                                              // 255
  self._dontStartNewUniversalSubs = false;                                                                             // 256
                                                                                                                       // 257
  // when we are rerunning subscriptions, any ready messages                                                           // 258
  // we want to buffer up for when we are done rerunning subscriptions                                                 // 259
  self._pendingReady = [];                                                                                             // 260
                                                                                                                       // 261
  // List of callbacks to call when this connection is closed.                                                         // 262
  self._closeCallbacks = [];                                                                                           // 263
                                                                                                                       // 264
                                                                                                                       // 265
  // XXX HACK: If a sockjs connection, save off the URL. This is                                                       // 266
  // temporary and will go away in the near future.                                                                    // 267
  self._socketUrl = socket.url;                                                                                        // 268
                                                                                                                       // 269
  // Allow tests to disable responding to pings.                                                                       // 270
  self._respondToPings = options.respondToPings;                                                                       // 271
                                                                                                                       // 272
  // This object is the public interface to the session. In the public                                                 // 273
  // API, it is called the `connection` object.  Internally we call it                                                 // 274
  // a `connectionHandle` to avoid ambiguity.                                                                          // 275
  self.connectionHandle = {                                                                                            // 276
    id: self.id,                                                                                                       // 277
    close: function () {                                                                                               // 278
      self.close();                                                                                                    // 279
    },                                                                                                                 // 280
    onClose: function (fn) {                                                                                           // 281
      var cb = Meteor.bindEnvironment(fn, "connection onClose callback");                                              // 282
      if (self.inQueue) {                                                                                              // 283
        self._closeCallbacks.push(cb);                                                                                 // 284
      } else {                                                                                                         // 285
        // if we're already closed, call the callback.                                                                 // 286
        Meteor.defer(cb);                                                                                              // 287
      }                                                                                                                // 288
    },                                                                                                                 // 289
    clientAddress: self._clientAddress(),                                                                              // 290
    httpHeaders: self.socket.headers                                                                                   // 291
  };                                                                                                                   // 292
                                                                                                                       // 293
  socket.send(stringifyDDP({msg: 'connected',                                                                          // 294
                            session: self.id}));                                                                       // 295
  // On initial connect, spin up all the universal publishers.                                                         // 296
  Fiber(function () {                                                                                                  // 297
    self.startUniversalSubs();                                                                                         // 298
  }).run();                                                                                                            // 299
                                                                                                                       // 300
  if (version !== 'pre1' && options.heartbeatInterval !== 0) {                                                         // 301
    self.heartbeat = new Heartbeat({                                                                                   // 302
      heartbeatInterval: options.heartbeatInterval,                                                                    // 303
      heartbeatTimeout: options.heartbeatTimeout,                                                                      // 304
      onTimeout: function () {                                                                                         // 305
        self.close();                                                                                                  // 306
      },                                                                                                               // 307
      sendPing: function () {                                                                                          // 308
        self.send({msg: 'ping'});                                                                                      // 309
      }                                                                                                                // 310
    });                                                                                                                // 311
    self.heartbeat.start();                                                                                            // 312
  }                                                                                                                    // 313
                                                                                                                       // 314
  Package.facts && Package.facts.Facts.incrementServerFact(                                                            // 315
    "livedata", "sessions", 1);                                                                                        // 316
};                                                                                                                     // 317
                                                                                                                       // 318
_.extend(Session.prototype, {                                                                                          // 319
                                                                                                                       // 320
  sendReady: function (subscriptionIds) {                                                                              // 321
    var self = this;                                                                                                   // 322
    if (self._isSending)                                                                                               // 323
      self.send({msg: "ready", subs: subscriptionIds});                                                                // 324
    else {                                                                                                             // 325
      _.each(subscriptionIds, function (subscriptionId) {                                                              // 326
        self._pendingReady.push(subscriptionId);                                                                       // 327
      });                                                                                                              // 328
    }                                                                                                                  // 329
  },                                                                                                                   // 330
                                                                                                                       // 331
  sendAdded: function (collectionName, id, fields) {                                                                   // 332
    var self = this;                                                                                                   // 333
    if (self._isSending)                                                                                               // 334
      self.send({msg: "added", collection: collectionName, id: id, fields: fields});                                   // 335
  },                                                                                                                   // 336
                                                                                                                       // 337
  sendChanged: function (collectionName, id, fields) {                                                                 // 338
    var self = this;                                                                                                   // 339
    if (_.isEmpty(fields))                                                                                             // 340
      return;                                                                                                          // 341
                                                                                                                       // 342
    if (self._isSending) {                                                                                             // 343
      self.send({                                                                                                      // 344
        msg: "changed",                                                                                                // 345
        collection: collectionName,                                                                                    // 346
        id: id,                                                                                                        // 347
        fields: fields                                                                                                 // 348
      });                                                                                                              // 349
    }                                                                                                                  // 350
  },                                                                                                                   // 351
                                                                                                                       // 352
  sendRemoved: function (collectionName, id) {                                                                         // 353
    var self = this;                                                                                                   // 354
    if (self._isSending)                                                                                               // 355
      self.send({msg: "removed", collection: collectionName, id: id});                                                 // 356
  },                                                                                                                   // 357
                                                                                                                       // 358
  getSendCallbacks: function () {                                                                                      // 359
    var self = this;                                                                                                   // 360
    return {                                                                                                           // 361
      added: _.bind(self.sendAdded, self),                                                                             // 362
      changed: _.bind(self.sendChanged, self),                                                                         // 363
      removed: _.bind(self.sendRemoved, self)                                                                          // 364
    };                                                                                                                 // 365
  },                                                                                                                   // 366
                                                                                                                       // 367
  getCollectionView: function (collectionName) {                                                                       // 368
    var self = this;                                                                                                   // 369
    if (_.has(self.collectionViews, collectionName)) {                                                                 // 370
      return self.collectionViews[collectionName];                                                                     // 371
    }                                                                                                                  // 372
    var ret = new SessionCollectionView(collectionName,                                                                // 373
                                        self.getSendCallbacks());                                                      // 374
    self.collectionViews[collectionName] = ret;                                                                        // 375
    return ret;                                                                                                        // 376
  },                                                                                                                   // 377
                                                                                                                       // 378
  added: function (subscriptionHandle, collectionName, id, fields) {                                                   // 379
    var self = this;                                                                                                   // 380
    var view = self.getCollectionView(collectionName);                                                                 // 381
    view.added(subscriptionHandle, id, fields);                                                                        // 382
  },                                                                                                                   // 383
                                                                                                                       // 384
  removed: function (subscriptionHandle, collectionName, id) {                                                         // 385
    var self = this;                                                                                                   // 386
    var view = self.getCollectionView(collectionName);                                                                 // 387
    view.removed(subscriptionHandle, id);                                                                              // 388
    if (view.isEmpty()) {                                                                                              // 389
      delete self.collectionViews[collectionName];                                                                     // 390
    }                                                                                                                  // 391
  },                                                                                                                   // 392
                                                                                                                       // 393
  changed: function (subscriptionHandle, collectionName, id, fields) {                                                 // 394
    var self = this;                                                                                                   // 395
    var view = self.getCollectionView(collectionName);                                                                 // 396
    view.changed(subscriptionHandle, id, fields);                                                                      // 397
  },                                                                                                                   // 398
                                                                                                                       // 399
  startUniversalSubs: function () {                                                                                    // 400
    var self = this;                                                                                                   // 401
    // Make a shallow copy of the set of universal handlers and start them. If                                         // 402
    // additional universal publishers start while we're running them (due to                                          // 403
    // yielding), they will run separately as part of Server.publish.                                                  // 404
    var handlers = _.clone(self.server.universal_publish_handlers);                                                    // 405
    _.each(handlers, function (handler) {                                                                              // 406
      self._startSubscription(handler);                                                                                // 407
    });                                                                                                                // 408
  },                                                                                                                   // 409
                                                                                                                       // 410
  // Destroy this session and unregister it at the server.                                                             // 411
  close: function () {                                                                                                 // 412
    var self = this;                                                                                                   // 413
                                                                                                                       // 414
    // Destroy this session, even if it's not registered at the                                                        // 415
    // server. Stop all processing and tear everything down. If a socket                                               // 416
    // was attached, close it.                                                                                         // 417
                                                                                                                       // 418
    // Already destroyed.                                                                                              // 419
    if (! self.inQueue)                                                                                                // 420
      return;                                                                                                          // 421
                                                                                                                       // 422
    // Drop the merge box data immediately.                                                                            // 423
    self.inQueue = null;                                                                                               // 424
    self.collectionViews = {};                                                                                         // 425
                                                                                                                       // 426
    if (self.heartbeat) {                                                                                              // 427
      self.heartbeat.stop();                                                                                           // 428
      self.heartbeat = null;                                                                                           // 429
    }                                                                                                                  // 430
                                                                                                                       // 431
    if (self.socket) {                                                                                                 // 432
      self.socket.close();                                                                                             // 433
      self.socket._meteorSession = null;                                                                               // 434
    }                                                                                                                  // 435
                                                                                                                       // 436
    Package.facts && Package.facts.Facts.incrementServerFact(                                                          // 437
      "livedata", "sessions", -1);                                                                                     // 438
                                                                                                                       // 439
    Meteor.defer(function () {                                                                                         // 440
      // stop callbacks can yield, so we defer this on close.                                                          // 441
      // sub._isDeactivated() detects that we set inQueue to null and                                                  // 442
      // treats it as semi-deactivated (it will ignore incoming callbacks, etc).                                       // 443
      self._deactivateAllSubscriptions();                                                                              // 444
                                                                                                                       // 445
      // Defer calling the close callbacks, so that the caller closing                                                 // 446
      // the session isn't waiting for all the callbacks to complete.                                                  // 447
      _.each(self._closeCallbacks, function (callback) {                                                               // 448
        callback();                                                                                                    // 449
      });                                                                                                              // 450
    });                                                                                                                // 451
                                                                                                                       // 452
    // Unregister the session.                                                                                         // 453
    self.server._removeSession(self);                                                                                  // 454
  },                                                                                                                   // 455
                                                                                                                       // 456
  // Send a message (doing nothing if no socket is connected right now.)                                               // 457
  // It should be a JSON object (it will be stringified.)                                                              // 458
  send: function (msg) {                                                                                               // 459
    var self = this;                                                                                                   // 460
    if (self.socket) {                                                                                                 // 461
      if (Meteor._printSentDDP)                                                                                        // 462
        Meteor._debug("Sent DDP", stringifyDDP(msg));                                                                  // 463
      self.socket.send(stringifyDDP(msg));                                                                             // 464
    }                                                                                                                  // 465
  },                                                                                                                   // 466
                                                                                                                       // 467
  // Send a connection error.                                                                                          // 468
  sendError: function (reason, offendingMessage) {                                                                     // 469
    var self = this;                                                                                                   // 470
    var msg = {msg: 'error', reason: reason};                                                                          // 471
    if (offendingMessage)                                                                                              // 472
      msg.offendingMessage = offendingMessage;                                                                         // 473
    self.send(msg);                                                                                                    // 474
  },                                                                                                                   // 475
                                                                                                                       // 476
  // Process 'msg' as an incoming message. (But as a guard against                                                     // 477
  // race conditions during reconnection, ignore the message if                                                        // 478
  // 'socket' is not the currently connected socket.)                                                                  // 479
  //                                                                                                                   // 480
  // We run the messages from the client one at a time, in the order                                                   // 481
  // given by the client. The message handler is passed an idempotent                                                  // 482
  // function 'unblock' which it may call to allow other messages to                                                   // 483
  // begin running in parallel in another fiber (for example, a method                                                 // 484
  // that wants to yield.) Otherwise, it is automatically unblocked                                                    // 485
  // when it returns.                                                                                                  // 486
  //                                                                                                                   // 487
  // Actually, we don't have to 'totally order' the messages in this                                                   // 488
  // way, but it's the easiest thing that's correct. (unsub needs to                                                   // 489
  // be ordered against sub, methods need to be ordered against each                                                   // 490
  // other.)                                                                                                           // 491
  processMessage: function (msg_in) {                                                                                  // 492
    var self = this;                                                                                                   // 493
    if (!self.inQueue) // we have been destroyed.                                                                      // 494
      return;                                                                                                          // 495
                                                                                                                       // 496
    // Respond to ping and pong messages immediately without queuing.                                                  // 497
    // If the negotiated DDP version is "pre1" which didn't support                                                    // 498
    // pings, preserve the "pre1" behavior of responding with a "bad                                                   // 499
    // request" for the unknown messages.                                                                              // 500
    //                                                                                                                 // 501
    // Fibers are needed because heartbeat uses Meteor.setTimeout, which                                               // 502
    // needs a Fiber. We could actually use regular setTimeout and avoid                                               // 503
    // these new fibers, but it is easier to just make everything use                                                  // 504
    // Meteor.setTimeout and not think too hard.                                                                       // 505
    if (self.version !== 'pre1' && msg_in.msg === 'ping') {                                                            // 506
      if (self._respondToPings)                                                                                        // 507
        self.send({msg: "pong", id: msg_in.id});                                                                       // 508
      if (self.heartbeat)                                                                                              // 509
        Fiber(function () {                                                                                            // 510
          self.heartbeat.pingReceived();                                                                               // 511
        }).run();                                                                                                      // 512
      return;                                                                                                          // 513
    }                                                                                                                  // 514
    if (self.version !== 'pre1' && msg_in.msg === 'pong') {                                                            // 515
      if (self.heartbeat)                                                                                              // 516
        Fiber(function () {                                                                                            // 517
          self.heartbeat.pongReceived();                                                                               // 518
        }).run();                                                                                                      // 519
      return;                                                                                                          // 520
    }                                                                                                                  // 521
                                                                                                                       // 522
    self.inQueue.push(msg_in);                                                                                         // 523
    if (self.workerRunning)                                                                                            // 524
      return;                                                                                                          // 525
    self.workerRunning = true;                                                                                         // 526
                                                                                                                       // 527
    var processNext = function () {                                                                                    // 528
      var msg = self.inQueue && self.inQueue.shift();                                                                  // 529
      if (!msg) {                                                                                                      // 530
        self.workerRunning = false;                                                                                    // 531
        return;                                                                                                        // 532
      }                                                                                                                // 533
                                                                                                                       // 534
      Fiber(function () {                                                                                              // 535
        var blocked = true;                                                                                            // 536
                                                                                                                       // 537
        var unblock = function () {                                                                                    // 538
          if (!blocked)                                                                                                // 539
            return; // idempotent                                                                                      // 540
          blocked = false;                                                                                             // 541
          processNext();                                                                                               // 542
        };                                                                                                             // 543
                                                                                                                       // 544
        if (_.has(self.protocol_handlers, msg.msg))                                                                    // 545
          self.protocol_handlers[msg.msg].call(self, msg, unblock);                                                    // 546
        else                                                                                                           // 547
          self.sendError('Bad request', msg);                                                                          // 548
        unblock(); // in case the handler didn't already do it                                                         // 549
      }).run();                                                                                                        // 550
    };                                                                                                                 // 551
                                                                                                                       // 552
    processNext();                                                                                                     // 553
  },                                                                                                                   // 554
                                                                                                                       // 555
  protocol_handlers: {                                                                                                 // 556
    sub: function (msg) {                                                                                              // 557
      var self = this;                                                                                                 // 558
                                                                                                                       // 559
      // reject malformed messages                                                                                     // 560
      if (typeof (msg.id) !== "string" ||                                                                              // 561
          typeof (msg.name) !== "string" ||                                                                            // 562
          (('params' in msg) && !(msg.params instanceof Array))) {                                                     // 563
        self.sendError("Malformed subscription", msg);                                                                 // 564
        return;                                                                                                        // 565
      }                                                                                                                // 566
                                                                                                                       // 567
      if (!self.server.publish_handlers[msg.name]) {                                                                   // 568
        self.send({                                                                                                    // 569
          msg: 'nosub', id: msg.id,                                                                                    // 570
          error: new Meteor.Error(404, "Subscription not found")});                                                    // 571
        return;                                                                                                        // 572
      }                                                                                                                // 573
                                                                                                                       // 574
      if (_.has(self._namedSubs, msg.id))                                                                              // 575
        // subs are idempotent, or rather, they are ignored if a sub                                                   // 576
        // with that id already exists. this is important during                                                       // 577
        // reconnect.                                                                                                  // 578
        return;                                                                                                        // 579
                                                                                                                       // 580
      var handler = self.server.publish_handlers[msg.name];                                                            // 581
      self._startSubscription(handler, msg.id, msg.params, msg.name);                                                  // 582
                                                                                                                       // 583
    },                                                                                                                 // 584
                                                                                                                       // 585
    unsub: function (msg) {                                                                                            // 586
      var self = this;                                                                                                 // 587
                                                                                                                       // 588
      self._stopSubscription(msg.id);                                                                                  // 589
    },                                                                                                                 // 590
                                                                                                                       // 591
    method: function (msg, unblock) {                                                                                  // 592
      var self = this;                                                                                                 // 593
                                                                                                                       // 594
      // reject malformed messages                                                                                     // 595
      // For now, we silently ignore unknown attributes,                                                               // 596
      // for forwards compatibility.                                                                                   // 597
      if (typeof (msg.id) !== "string" ||                                                                              // 598
          typeof (msg.method) !== "string" ||                                                                          // 599
          (('params' in msg) && !(msg.params instanceof Array)) ||                                                     // 600
          (('randomSeed' in msg) && (typeof msg.randomSeed !== "string"))) {                                           // 601
        self.sendError("Malformed method invocation", msg);                                                            // 602
        return;                                                                                                        // 603
      }                                                                                                                // 604
                                                                                                                       // 605
      var randomSeed = msg.randomSeed || null;                                                                         // 606
                                                                                                                       // 607
      // set up to mark the method as satisfied once all observers                                                     // 608
      // (and subscriptions) have reacted to any writes that were                                                      // 609
      // done.                                                                                                         // 610
      var fence = new DDPServer._WriteFence;                                                                           // 611
      fence.onAllCommitted(function () {                                                                               // 612
        // Retire the fence so that future writes are allowed.                                                         // 613
        // This means that callbacks like timers are free to use                                                       // 614
        // the fence, and if they fire before it's armed (for                                                          // 615
        // example, because the method waits for them) their                                                           // 616
        // writes will be included in the fence.                                                                       // 617
        fence.retire();                                                                                                // 618
        self.send({                                                                                                    // 619
          msg: 'updated', methods: [msg.id]});                                                                         // 620
      });                                                                                                              // 621
                                                                                                                       // 622
      // find the handler                                                                                              // 623
      var handler = self.server.method_handlers[msg.method];                                                           // 624
      if (!handler) {                                                                                                  // 625
        self.send({                                                                                                    // 626
          msg: 'result', id: msg.id,                                                                                   // 627
          error: new Meteor.Error(404, "Method not found")});                                                          // 628
        fence.arm();                                                                                                   // 629
        return;                                                                                                        // 630
      }                                                                                                                // 631
                                                                                                                       // 632
      var setUserId = function(userId) {                                                                               // 633
        self._setUserId(userId);                                                                                       // 634
      };                                                                                                               // 635
                                                                                                                       // 636
      var invocation = new MethodInvocation({                                                                          // 637
        isSimulation: false,                                                                                           // 638
        userId: self.userId,                                                                                           // 639
        setUserId: setUserId,                                                                                          // 640
        unblock: unblock,                                                                                              // 641
        connection: self.connectionHandle,                                                                             // 642
        randomSeed: randomSeed                                                                                         // 643
      });                                                                                                              // 644
      try {                                                                                                            // 645
        var result = DDPServer._CurrentWriteFence.withValue(fence, function () {                                       // 646
          return DDP._CurrentInvocation.withValue(invocation, function () {                                            // 647
            return maybeAuditArgumentChecks(                                                                           // 648
              handler, invocation, msg.params, "call to '" + msg.method + "'");                                        // 649
          });                                                                                                          // 650
        });                                                                                                            // 651
      } catch (e) {                                                                                                    // 652
        var exception = e;                                                                                             // 653
      }                                                                                                                // 654
                                                                                                                       // 655
      fence.arm(); // we're done adding writes to the fence                                                            // 656
      unblock(); // unblock, if the method hasn't done it already                                                      // 657
                                                                                                                       // 658
      exception = wrapInternalException(                                                                               // 659
        exception, "while invoking method '" + msg.method + "'");                                                      // 660
                                                                                                                       // 661
      // send response and add to cache                                                                                // 662
      var payload =                                                                                                    // 663
        exception ? {error: exception} : (result !== undefined ?                                                       // 664
                                          {result: result} : {});                                                      // 665
      self.send(_.extend({msg: 'result', id: msg.id}, payload));                                                       // 666
    }                                                                                                                  // 667
  },                                                                                                                   // 668
                                                                                                                       // 669
  _eachSub: function (f) {                                                                                             // 670
    var self = this;                                                                                                   // 671
    _.each(self._namedSubs, f);                                                                                        // 672
    _.each(self._universalSubs, f);                                                                                    // 673
  },                                                                                                                   // 674
                                                                                                                       // 675
  _diffCollectionViews: function (beforeCVs) {                                                                         // 676
    var self = this;                                                                                                   // 677
    LocalCollection._diffObjects(beforeCVs, self.collectionViews, {                                                    // 678
      both: function (collectionName, leftValue, rightValue) {                                                         // 679
        rightValue.diff(leftValue);                                                                                    // 680
      },                                                                                                               // 681
      rightOnly: function (collectionName, rightValue) {                                                               // 682
        _.each(rightValue.documents, function (docView, id) {                                                          // 683
          self.sendAdded(collectionName, id, docView.getFields());                                                     // 684
        });                                                                                                            // 685
      },                                                                                                               // 686
      leftOnly: function (collectionName, leftValue) {                                                                 // 687
        _.each(leftValue.documents, function (doc, id) {                                                               // 688
          self.sendRemoved(collectionName, id);                                                                        // 689
        });                                                                                                            // 690
      }                                                                                                                // 691
    });                                                                                                                // 692
  },                                                                                                                   // 693
                                                                                                                       // 694
  // Sets the current user id in all appropriate contexts and reruns                                                   // 695
  // all subscriptions                                                                                                 // 696
  _setUserId: function(userId) {                                                                                       // 697
    var self = this;                                                                                                   // 698
                                                                                                                       // 699
    if (userId !== null && typeof userId !== "string")                                                                 // 700
      throw new Error("setUserId must be called on string or null, not " +                                             // 701
                      typeof userId);                                                                                  // 702
                                                                                                                       // 703
    // Prevent newly-created universal subscriptions from being added to our                                           // 704
    // session; they will be found below when we call startUniversalSubs.                                              // 705
    //                                                                                                                 // 706
    // (We don't have to worry about named subscriptions, because we only add                                          // 707
    // them when we process a 'sub' message. We are currently processing a                                             // 708
    // 'method' message, and the method did not unblock, because it is illegal                                         // 709
    // to call setUserId after unblock. Thus we cannot be concurrently adding a                                        // 710
    // new named subscription.)                                                                                        // 711
    self._dontStartNewUniversalSubs = true;                                                                            // 712
                                                                                                                       // 713
    // Prevent current subs from updating our collectionViews and call their                                           // 714
    // stop callbacks. This may yield.                                                                                 // 715
    self._eachSub(function (sub) {                                                                                     // 716
      sub._deactivate();                                                                                               // 717
    });                                                                                                                // 718
                                                                                                                       // 719
    // All subs should now be deactivated. Stop sending messages to the client,                                        // 720
    // save the state of the published collections, reset to an empty view, and                                        // 721
    // update the userId.                                                                                              // 722
    self._isSending = false;                                                                                           // 723
    var beforeCVs = self.collectionViews;                                                                              // 724
    self.collectionViews = {};                                                                                         // 725
    self.userId = userId;                                                                                              // 726
                                                                                                                       // 727
    // Save the old named subs, and reset to having no subscriptions.                                                  // 728
    var oldNamedSubs = self._namedSubs;                                                                                // 729
    self._namedSubs = {};                                                                                              // 730
    self._universalSubs = [];                                                                                          // 731
                                                                                                                       // 732
    _.each(oldNamedSubs, function (sub, subscriptionId) {                                                              // 733
      self._namedSubs[subscriptionId] = sub._recreate();                                                               // 734
      // nb: if the handler throws or calls this.error(), it will in fact                                              // 735
      // immediately send its 'nosub'. This is OK, though.                                                             // 736
      self._namedSubs[subscriptionId]._runHandler();                                                                   // 737
    });                                                                                                                // 738
                                                                                                                       // 739
    // Allow newly-created universal subs to be started on our connection in                                           // 740
    // parallel with the ones we're spinning up here, and spin up universal                                            // 741
    // subs.                                                                                                           // 742
    self._dontStartNewUniversalSubs = false;                                                                           // 743
    self.startUniversalSubs();                                                                                         // 744
                                                                                                                       // 745
    // Start sending messages again, beginning with the diff from the previous                                         // 746
    // state of the world to the current state. No yields are allowed during                                           // 747
    // this diff, so that other changes cannot interleave.                                                             // 748
    Meteor._noYieldsAllowed(function () {                                                                              // 749
      self._isSending = true;                                                                                          // 750
      self._diffCollectionViews(beforeCVs);                                                                            // 751
      if (!_.isEmpty(self._pendingReady)) {                                                                            // 752
        self.sendReady(self._pendingReady);                                                                            // 753
        self._pendingReady = [];                                                                                       // 754
      }                                                                                                                // 755
    });                                                                                                                // 756
  },                                                                                                                   // 757
                                                                                                                       // 758
  _startSubscription: function (handler, subId, params, name) {                                                        // 759
    var self = this;                                                                                                   // 760
                                                                                                                       // 761
    var sub = new Subscription(                                                                                        // 762
      self, handler, subId, params, name);                                                                             // 763
    if (subId)                                                                                                         // 764
      self._namedSubs[subId] = sub;                                                                                    // 765
    else                                                                                                               // 766
      self._universalSubs.push(sub);                                                                                   // 767
                                                                                                                       // 768
    sub._runHandler();                                                                                                 // 769
  },                                                                                                                   // 770
                                                                                                                       // 771
  // tear down specified subscription                                                                                  // 772
  _stopSubscription: function (subId, error) {                                                                         // 773
    var self = this;                                                                                                   // 774
                                                                                                                       // 775
    var subName = null;                                                                                                // 776
                                                                                                                       // 777
    if (subId && self._namedSubs[subId]) {                                                                             // 778
      subName = self._namedSubs[subId]._name;                                                                          // 779
      self._namedSubs[subId]._removeAllDocuments();                                                                    // 780
      self._namedSubs[subId]._deactivate();                                                                            // 781
      delete self._namedSubs[subId];                                                                                   // 782
    }                                                                                                                  // 783
                                                                                                                       // 784
    var response = {msg: 'nosub', id: subId};                                                                          // 785
                                                                                                                       // 786
    if (error) {                                                                                                       // 787
      response.error = wrapInternalException(                                                                          // 788
        error,                                                                                                         // 789
        subName ? ("from sub " + subName + " id " + subId)                                                             // 790
          : ("from sub id " + subId));                                                                                 // 791
    }                                                                                                                  // 792
                                                                                                                       // 793
    self.send(response);                                                                                               // 794
  },                                                                                                                   // 795
                                                                                                                       // 796
  // tear down all subscriptions. Note that this does NOT send removed or nosub                                        // 797
  // messages, since we assume the client is gone.                                                                     // 798
  _deactivateAllSubscriptions: function () {                                                                           // 799
    var self = this;                                                                                                   // 800
                                                                                                                       // 801
    _.each(self._namedSubs, function (sub, id) {                                                                       // 802
      sub._deactivate();                                                                                               // 803
    });                                                                                                                // 804
    self._namedSubs = {};                                                                                              // 805
                                                                                                                       // 806
    _.each(self._universalSubs, function (sub) {                                                                       // 807
      sub._deactivate();                                                                                               // 808
    });                                                                                                                // 809
    self._universalSubs = [];                                                                                          // 810
  },                                                                                                                   // 811
                                                                                                                       // 812
  // Determine the remote client's IP address, based on the                                                            // 813
  // HTTP_FORWARDED_COUNT environment variable representing how many                                                   // 814
  // proxies the server is behind.                                                                                     // 815
  _clientAddress: function () {                                                                                        // 816
    var self = this;                                                                                                   // 817
                                                                                                                       // 818
    // For the reported client address for a connection to be correct,                                                 // 819
    // the developer must set the HTTP_FORWARDED_COUNT environment                                                     // 820
    // variable to an integer representing the number of hops they                                                     // 821
    // expect in the `x-forwarded-for` header. E.g., set to "1" if the                                                 // 822
    // server is behind one proxy.                                                                                     // 823
    //                                                                                                                 // 824
    // This could be computed once at startup instead of every time.                                                   // 825
    var httpForwardedCount = parseInt(process.env['HTTP_FORWARDED_COUNT']) || 0;                                       // 826
                                                                                                                       // 827
    if (httpForwardedCount === 0)                                                                                      // 828
      return self.socket.remoteAddress;                                                                                // 829
                                                                                                                       // 830
    var forwardedFor = self.socket.headers["x-forwarded-for"];                                                         // 831
    if (! _.isString(forwardedFor))                                                                                    // 832
      return null;                                                                                                     // 833
    forwardedFor = forwardedFor.trim().split(/\s*,\s*/);                                                               // 834
                                                                                                                       // 835
    // Typically the first value in the `x-forwarded-for` header is                                                    // 836
    // the original IP address of the client connecting to the first                                                   // 837
    // proxy.  However, the end user can easily spoof the header, in                                                   // 838
    // which case the first value(s) will be the fake IP address from                                                  // 839
    // the user pretending to be a proxy reporting the original IP                                                     // 840
    // address value.  By counting HTTP_FORWARDED_COUNT back from the                                                  // 841
    // end of the list, we ensure that we get the IP address being                                                     // 842
    // reported by *our* first proxy.                                                                                  // 843
                                                                                                                       // 844
    if (httpForwardedCount < 0 || httpForwardedCount > forwardedFor.length)                                            // 845
      return null;                                                                                                     // 846
                                                                                                                       // 847
    return forwardedFor[forwardedFor.length - httpForwardedCount];                                                     // 848
  }                                                                                                                    // 849
});                                                                                                                    // 850
                                                                                                                       // 851
/******************************************************************************/                                       // 852
/* Subscription                                                               */                                       // 853
/******************************************************************************/                                       // 854
                                                                                                                       // 855
// ctor for a sub handle: the input to each publish function                                                           // 856
                                                                                                                       // 857
// Instance name is this because it's usually referred to as this inside a                                             // 858
// publish                                                                                                             // 859
/**                                                                                                                    // 860
 * @summary The server's side of a subscription                                                                        // 861
 * @class Subscription                                                                                                 // 862
 * @instanceName this                                                                                                  // 863
 */                                                                                                                    // 864
var Subscription = function (                                                                                          // 865
    session, handler, subscriptionId, params, name) {                                                                  // 866
  var self = this;                                                                                                     // 867
  self._session = session; // type is Session                                                                          // 868
                                                                                                                       // 869
  /**                                                                                                                  // 870
   * @summary Access inside the publish function. The incoming [connection](#meteor_onconnection) for this subscription.
   * @locus Server                                                                                                     // 872
   * @name  connection                                                                                                 // 873
   * @memberOf Subscription                                                                                            // 874
   * @instance                                                                                                         // 875
   */                                                                                                                  // 876
  self.connection = session.connectionHandle; // public API object                                                     // 877
                                                                                                                       // 878
  self._handler = handler;                                                                                             // 879
                                                                                                                       // 880
  // my subscription ID (generated by client, undefined for universal subs).                                           // 881
  self._subscriptionId = subscriptionId;                                                                               // 882
  // undefined for universal subs                                                                                      // 883
  self._name = name;                                                                                                   // 884
                                                                                                                       // 885
  self._params = params || [];                                                                                         // 886
                                                                                                                       // 887
  // Only named subscriptions have IDs, but we need some sort of string                                                // 888
  // internally to keep track of all subscriptions inside                                                              // 889
  // SessionDocumentViews. We use this subscriptionHandle for that.                                                    // 890
  if (self._subscriptionId) {                                                                                          // 891
    self._subscriptionHandle = 'N' + self._subscriptionId;                                                             // 892
  } else {                                                                                                             // 893
    self._subscriptionHandle = 'U' + Random.id();                                                                      // 894
  }                                                                                                                    // 895
                                                                                                                       // 896
  // has _deactivate been called?                                                                                      // 897
  self._deactivated = false;                                                                                           // 898
                                                                                                                       // 899
  // stop callbacks to g/c this sub.  called w/ zero arguments.                                                        // 900
  self._stopCallbacks = [];                                                                                            // 901
                                                                                                                       // 902
  // the set of (collection, documentid) that this subscription has                                                    // 903
  // an opinion about                                                                                                  // 904
  self._documents = {};                                                                                                // 905
                                                                                                                       // 906
  // remember if we are ready.                                                                                         // 907
  self._ready = false;                                                                                                 // 908
                                                                                                                       // 909
  // Part of the public API: the user of this sub.                                                                     // 910
                                                                                                                       // 911
  /**                                                                                                                  // 912
   * @summary Access inside the publish function. The id of the logged-in user, or `null` if no user is logged in.     // 913
   * @locus Server                                                                                                     // 914
   * @memberOf Subscription                                                                                            // 915
   * @name  userId                                                                                                     // 916
   * @instance                                                                                                         // 917
   */                                                                                                                  // 918
  self.userId = session.userId;                                                                                        // 919
                                                                                                                       // 920
  // For now, the id filter is going to default to                                                                     // 921
  // the to/from DDP methods on LocalCollection, to                                                                    // 922
  // specifically deal with mongo/minimongo ObjectIds.                                                                 // 923
                                                                                                                       // 924
  // Later, you will be able to make this be "raw"                                                                     // 925
  // if you want to publish a collection that you know                                                                 // 926
  // just has strings for keys and no funny business, to                                                               // 927
  // a ddp consumer that isn't minimongo                                                                               // 928
                                                                                                                       // 929
  self._idFilter = {                                                                                                   // 930
    idStringify: LocalCollection._idStringify,                                                                         // 931
    idParse: LocalCollection._idParse                                                                                  // 932
  };                                                                                                                   // 933
                                                                                                                       // 934
  Package.facts && Package.facts.Facts.incrementServerFact(                                                            // 935
    "livedata", "subscriptions", 1);                                                                                   // 936
};                                                                                                                     // 937
                                                                                                                       // 938
_.extend(Subscription.prototype, {                                                                                     // 939
  _runHandler: function () {                                                                                           // 940
    // XXX should we unblock() here? Either before running the publish                                                 // 941
    // function, or before running _publishCursor.                                                                     // 942
    //                                                                                                                 // 943
    // Right now, each publish function blocks all future publishes and                                                // 944
    // methods waiting on data from Mongo (or whatever else the function                                               // 945
    // blocks on). This probably slows page load in common cases.                                                      // 946
                                                                                                                       // 947
    var self = this;                                                                                                   // 948
    try {                                                                                                              // 949
      var res = maybeAuditArgumentChecks(                                                                              // 950
        self._handler, self, EJSON.clone(self._params),                                                                // 951
        // It's OK that this would look weird for universal subscriptions,                                             // 952
        // because they have no arguments so there can never be an                                                     // 953
        // audit-argument-checks failure.                                                                              // 954
        "publisher '" + self._name + "'");                                                                             // 955
    } catch (e) {                                                                                                      // 956
      self.error(e);                                                                                                   // 957
      return;                                                                                                          // 958
    }                                                                                                                  // 959
                                                                                                                       // 960
    // Did the handler call this.error or this.stop?                                                                   // 961
    if (self._isDeactivated())                                                                                         // 962
      return;                                                                                                          // 963
                                                                                                                       // 964
    // SPECIAL CASE: Instead of writing their own callbacks that invoke                                                // 965
    // this.added/changed/ready/etc, the user can just return a collection                                             // 966
    // cursor or array of cursors from the publish function; we call their                                             // 967
    // _publishCursor method which starts observing the cursor and publishes the                                       // 968
    // results. Note that _publishCursor does NOT call ready().                                                        // 969
    //                                                                                                                 // 970
    // XXX This uses an undocumented interface which only the Mongo cursor                                             // 971
    // interface publishes. Should we make this interface public and encourage                                         // 972
    // users to implement it themselves? Arguably, it's unnecessary; users can                                         // 973
    // already write their own functions like                                                                          // 974
    //   var publishMyReactiveThingy = function (name, handler) {                                                      // 975
    //     Meteor.publish(name, function () {                                                                          // 976
    //       var reactiveThingy = handler();                                                                           // 977
    //       reactiveThingy.publishMe();                                                                               // 978
    //     });                                                                                                         // 979
    //   };                                                                                                            // 980
    var isCursor = function (c) {                                                                                      // 981
      return c && c._publishCursor;                                                                                    // 982
    };                                                                                                                 // 983
    if (isCursor(res)) {                                                                                               // 984
      try {                                                                                                            // 985
        res._publishCursor(self);                                                                                      // 986
      } catch (e) {                                                                                                    // 987
        self.error(e);                                                                                                 // 988
        return;                                                                                                        // 989
      }                                                                                                                // 990
      // _publishCursor only returns after the initial added callbacks have run.                                       // 991
      // mark subscription as ready.                                                                                   // 992
      self.ready();                                                                                                    // 993
    } else if (_.isArray(res)) {                                                                                       // 994
      // check all the elements are cursors                                                                            // 995
      if (! _.all(res, isCursor)) {                                                                                    // 996
        self.error(new Error("Publish function returned an array of non-Cursors"));                                    // 997
        return;                                                                                                        // 998
      }                                                                                                                // 999
      // find duplicate collection names                                                                               // 1000
      // XXX we should support overlapping cursors, but that would require the                                         // 1001
      // merge box to allow overlap within a subscription                                                              // 1002
      var collectionNames = {};                                                                                        // 1003
      for (var i = 0; i < res.length; ++i) {                                                                           // 1004
        var collectionName = res[i]._getCollectionName();                                                              // 1005
        if (_.has(collectionNames, collectionName)) {                                                                  // 1006
          self.error(new Error(                                                                                        // 1007
            "Publish function returned multiple cursors for collection " +                                             // 1008
              collectionName));                                                                                        // 1009
          return;                                                                                                      // 1010
        }                                                                                                              // 1011
        collectionNames[collectionName] = true;                                                                        // 1012
      };                                                                                                               // 1013
                                                                                                                       // 1014
      try {                                                                                                            // 1015
        _.each(res, function (cur) {                                                                                   // 1016
          cur._publishCursor(self);                                                                                    // 1017
        });                                                                                                            // 1018
      } catch (e) {                                                                                                    // 1019
        self.error(e);                                                                                                 // 1020
        return;                                                                                                        // 1021
      }                                                                                                                // 1022
      self.ready();                                                                                                    // 1023
    } else if (res) {                                                                                                  // 1024
      // truthy values other than cursors or arrays are probably a                                                     // 1025
      // user mistake (possible returning a Mongo document via, say,                                                   // 1026
      // `coll.findOne()`).                                                                                            // 1027
      self.error(new Error("Publish function can only return a Cursor or "                                             // 1028
                           + "an array of Cursors"));                                                                  // 1029
    }                                                                                                                  // 1030
  },                                                                                                                   // 1031
                                                                                                                       // 1032
  // This calls all stop callbacks and prevents the handler from updating any                                          // 1033
  // SessionCollectionViews further. It's used when the user unsubscribes or                                           // 1034
  // disconnects, as well as during setUserId re-runs. It does *NOT* send                                              // 1035
  // removed messages for the published objects; if that is necessary, call                                            // 1036
  // _removeAllDocuments first.                                                                                        // 1037
  _deactivate: function() {                                                                                            // 1038
    var self = this;                                                                                                   // 1039
    if (self._deactivated)                                                                                             // 1040
      return;                                                                                                          // 1041
    self._deactivated = true;                                                                                          // 1042
    self._callStopCallbacks();                                                                                         // 1043
    Package.facts && Package.facts.Facts.incrementServerFact(                                                          // 1044
      "livedata", "subscriptions", -1);                                                                                // 1045
  },                                                                                                                   // 1046
                                                                                                                       // 1047
  _callStopCallbacks: function () {                                                                                    // 1048
    var self = this;                                                                                                   // 1049
    // tell listeners, so they can clean up                                                                            // 1050
    var callbacks = self._stopCallbacks;                                                                               // 1051
    self._stopCallbacks = [];                                                                                          // 1052
    _.each(callbacks, function (callback) {                                                                            // 1053
      callback();                                                                                                      // 1054
    });                                                                                                                // 1055
  },                                                                                                                   // 1056
                                                                                                                       // 1057
  // Send remove messages for every document.                                                                          // 1058
  _removeAllDocuments: function () {                                                                                   // 1059
    var self = this;                                                                                                   // 1060
    Meteor._noYieldsAllowed(function () {                                                                              // 1061
      _.each(self._documents, function(collectionDocs, collectionName) {                                               // 1062
        // Iterate over _.keys instead of the dictionary itself, since we'll be                                        // 1063
        // mutating it.                                                                                                // 1064
        _.each(_.keys(collectionDocs), function (strId) {                                                              // 1065
          self.removed(collectionName, self._idFilter.idParse(strId));                                                 // 1066
        });                                                                                                            // 1067
      });                                                                                                              // 1068
    });                                                                                                                // 1069
  },                                                                                                                   // 1070
                                                                                                                       // 1071
  // Returns a new Subscription for the same session with the same                                                     // 1072
  // initial creation parameters. This isn't a clone: it doesn't have                                                  // 1073
  // the same _documents cache, stopped state or callbacks; may have a                                                 // 1074
  // different _subscriptionHandle, and gets its userId from the                                                       // 1075
  // session, not from this object.                                                                                    // 1076
  _recreate: function () {                                                                                             // 1077
    var self = this;                                                                                                   // 1078
    return new Subscription(                                                                                           // 1079
      self._session, self._handler, self._subscriptionId, self._params,                                                // 1080
      self._name);                                                                                                     // 1081
  },                                                                                                                   // 1082
                                                                                                                       // 1083
  /**                                                                                                                  // 1084
   * @summary Call inside the publish function.  Stops this client's subscription, triggering a call on the client to the `onStop` callback passed to [`Meteor.subscribe`](#meteor_subscribe), if any. If `error` is not a [`Meteor.Error`](#meteor_error), it will be [sanitized](#meteor_error).
   * @locus Server                                                                                                     // 1086
   * @param {Error} error The error to pass to the client.                                                             // 1087
   * @instance                                                                                                         // 1088
   * @memberOf Subscription                                                                                            // 1089
   */                                                                                                                  // 1090
  error: function (error) {                                                                                            // 1091
    var self = this;                                                                                                   // 1092
    if (self._isDeactivated())                                                                                         // 1093
      return;                                                                                                          // 1094
    self._session._stopSubscription(self._subscriptionId, error);                                                      // 1095
  },                                                                                                                   // 1096
                                                                                                                       // 1097
  // Note that while our DDP client will notice that you've called stop() on the                                       // 1098
  // server (and clean up its _subscriptions table) we don't actually provide a                                        // 1099
  // mechanism for an app to notice this (the subscribe onError callback only                                          // 1100
  // triggers if there is an error).                                                                                   // 1101
                                                                                                                       // 1102
  /**                                                                                                                  // 1103
   * @summary Call inside the publish function.  Stops this client's subscription and invokes the client's `onStop` callback with no error.
   * @locus Server                                                                                                     // 1105
   * @instance                                                                                                         // 1106
   * @memberOf Subscription                                                                                            // 1107
   */                                                                                                                  // 1108
  stop: function () {                                                                                                  // 1109
    var self = this;                                                                                                   // 1110
    if (self._isDeactivated())                                                                                         // 1111
      return;                                                                                                          // 1112
    self._session._stopSubscription(self._subscriptionId);                                                             // 1113
  },                                                                                                                   // 1114
                                                                                                                       // 1115
  /**                                                                                                                  // 1116
   * @summary Call inside the publish function.  Registers a callback function to run when the subscription is stopped.
   * @locus Server                                                                                                     // 1118
   * @memberOf Subscription                                                                                            // 1119
   * @instance                                                                                                         // 1120
   * @param {Function} func The callback function                                                                      // 1121
   */                                                                                                                  // 1122
  onStop: function (callback) {                                                                                        // 1123
    var self = this;                                                                                                   // 1124
    if (self._isDeactivated())                                                                                         // 1125
      callback();                                                                                                      // 1126
    else                                                                                                               // 1127
      self._stopCallbacks.push(callback);                                                                              // 1128
  },                                                                                                                   // 1129
                                                                                                                       // 1130
  // This returns true if the sub has been deactivated, *OR* if the session was                                        // 1131
  // destroyed but the deferred call to _deactivateAllSubscriptions hasn't                                             // 1132
  // happened yet.                                                                                                     // 1133
  _isDeactivated: function () {                                                                                        // 1134
    var self = this;                                                                                                   // 1135
    return self._deactivated || self._session.inQueue === null;                                                        // 1136
  },                                                                                                                   // 1137
                                                                                                                       // 1138
  /**                                                                                                                  // 1139
   * @summary Call inside the publish function.  Informs the subscriber that a document has been added to the record set.
   * @locus Server                                                                                                     // 1141
   * @memberOf Subscription                                                                                            // 1142
   * @instance                                                                                                         // 1143
   * @param {String} collection The name of the collection that contains the new document.                             // 1144
   * @param {String} id The new document's ID.                                                                         // 1145
   * @param {Object} fields The fields in the new document.  If `_id` is present it is ignored.                        // 1146
   */                                                                                                                  // 1147
  added: function (collectionName, id, fields) {                                                                       // 1148
    var self = this;                                                                                                   // 1149
    if (self._isDeactivated())                                                                                         // 1150
      return;                                                                                                          // 1151
    id = self._idFilter.idStringify(id);                                                                               // 1152
    Meteor._ensure(self._documents, collectionName)[id] = true;                                                        // 1153
    self._session.added(self._subscriptionHandle, collectionName, id, fields);                                         // 1154
  },                                                                                                                   // 1155
                                                                                                                       // 1156
  /**                                                                                                                  // 1157
   * @summary Call inside the publish function.  Informs the subscriber that a document in the record set has been modified.
   * @locus Server                                                                                                     // 1159
   * @memberOf Subscription                                                                                            // 1160
   * @instance                                                                                                         // 1161
   * @param {String} collection The name of the collection that contains the changed document.                         // 1162
   * @param {String} id The changed document's ID.                                                                     // 1163
   * @param {Object} fields The fields in the document that have changed, together with their new values.  If a field is not present in `fields` it was left unchanged; if it is present in `fields` and has a value of `undefined` it was removed from the document.  If `_id` is present it is ignored.
   */                                                                                                                  // 1165
  changed: function (collectionName, id, fields) {                                                                     // 1166
    var self = this;                                                                                                   // 1167
    if (self._isDeactivated())                                                                                         // 1168
      return;                                                                                                          // 1169
    id = self._idFilter.idStringify(id);                                                                               // 1170
    self._session.changed(self._subscriptionHandle, collectionName, id, fields);                                       // 1171
  },                                                                                                                   // 1172
                                                                                                                       // 1173
  /**                                                                                                                  // 1174
   * @summary Call inside the publish function.  Informs the subscriber that a document has been removed from the record set.
   * @locus Server                                                                                                     // 1176
   * @memberOf Subscription                                                                                            // 1177
   * @instance                                                                                                         // 1178
   * @param {String} collection The name of the collection that the document has been removed from.                    // 1179
   * @param {String} id The ID of the document that has been removed.                                                  // 1180
   */                                                                                                                  // 1181
  removed: function (collectionName, id) {                                                                             // 1182
    var self = this;                                                                                                   // 1183
    if (self._isDeactivated())                                                                                         // 1184
      return;                                                                                                          // 1185
    id = self._idFilter.idStringify(id);                                                                               // 1186
    // We don't bother to delete sets of things in a collection if the                                                 // 1187
    // collection is empty.  It could break _removeAllDocuments.                                                       // 1188
    delete self._documents[collectionName][id];                                                                        // 1189
    self._session.removed(self._subscriptionHandle, collectionName, id);                                               // 1190
  },                                                                                                                   // 1191
                                                                                                                       // 1192
  /**                                                                                                                  // 1193
   * @summary Call inside the publish function.  Informs the subscriber that an initial, complete snapshot of the record set has been sent.  This will trigger a call on the client to the `onReady` callback passed to  [`Meteor.subscribe`](#meteor_subscribe), if any.
   * @locus Server                                                                                                     // 1195
   * @memberOf Subscription                                                                                            // 1196
   * @instance                                                                                                         // 1197
   */                                                                                                                  // 1198
  ready: function () {                                                                                                 // 1199
    var self = this;                                                                                                   // 1200
    if (self._isDeactivated())                                                                                         // 1201
      return;                                                                                                          // 1202
    if (!self._subscriptionId)                                                                                         // 1203
      return;  // unnecessary but ignored for universal sub                                                            // 1204
    if (!self._ready) {                                                                                                // 1205
      self._session.sendReady([self._subscriptionId]);                                                                 // 1206
      self._ready = true;                                                                                              // 1207
    }                                                                                                                  // 1208
  }                                                                                                                    // 1209
});                                                                                                                    // 1210
                                                                                                                       // 1211
/******************************************************************************/                                       // 1212
/* Server                                                                     */                                       // 1213
/******************************************************************************/                                       // 1214
                                                                                                                       // 1215
Server = function (options) {                                                                                          // 1216
  var self = this;                                                                                                     // 1217
                                                                                                                       // 1218
  // The default heartbeat interval is 30 seconds on the server and 35                                                 // 1219
  // seconds on the client.  Since the client doesn't need to send a                                                   // 1220
  // ping as long as it is receiving pings, this means that pings                                                      // 1221
  // normally go from the server to the client.                                                                        // 1222
  //                                                                                                                   // 1223
  // Note: Troposphere depends on the ability to mutate                                                                // 1224
  // Meteor.server.options.heartbeatTimeout! This is a hack, but it's life.                                            // 1225
  self.options = _.defaults(options || {}, {                                                                           // 1226
    heartbeatInterval: 30000,                                                                                          // 1227
    heartbeatTimeout: 15000,                                                                                           // 1228
    // For testing, allow responding to pings to be disabled.                                                          // 1229
    respondToPings: true                                                                                               // 1230
  });                                                                                                                  // 1231
                                                                                                                       // 1232
  // Map of callbacks to call when a new connection comes in to the                                                    // 1233
  // server and completes DDP version negotiation. Use an object instead                                               // 1234
  // of an array so we can safely remove one from the list while                                                       // 1235
  // iterating over it.                                                                                                // 1236
  self.onConnectionHook = new Hook({                                                                                   // 1237
    debugPrintExceptions: "onConnection callback"                                                                      // 1238
  });                                                                                                                  // 1239
                                                                                                                       // 1240
  self.publish_handlers = {};                                                                                          // 1241
  self.universal_publish_handlers = [];                                                                                // 1242
                                                                                                                       // 1243
  self.method_handlers = {};                                                                                           // 1244
                                                                                                                       // 1245
  self.sessions = {}; // map from id to session                                                                        // 1246
                                                                                                                       // 1247
  self.stream_server = new StreamServer;                                                                               // 1248
                                                                                                                       // 1249
  self.stream_server.register(function (socket) {                                                                      // 1250
    // socket implements the SockJSConnection interface                                                                // 1251
    socket._meteorSession = null;                                                                                      // 1252
                                                                                                                       // 1253
    var sendError = function (reason, offendingMessage) {                                                              // 1254
      var msg = {msg: 'error', reason: reason};                                                                        // 1255
      if (offendingMessage)                                                                                            // 1256
        msg.offendingMessage = offendingMessage;                                                                       // 1257
      socket.send(stringifyDDP(msg));                                                                                  // 1258
    };                                                                                                                 // 1259
                                                                                                                       // 1260
    socket.on('data', function (raw_msg) {                                                                             // 1261
      if (Meteor._printReceivedDDP) {                                                                                  // 1262
        Meteor._debug("Received DDP", raw_msg);                                                                        // 1263
      }                                                                                                                // 1264
      try {                                                                                                            // 1265
        try {                                                                                                          // 1266
          var msg = parseDDP(raw_msg);                                                                                 // 1267
        } catch (err) {                                                                                                // 1268
          sendError('Parse error');                                                                                    // 1269
          return;                                                                                                      // 1270
        }                                                                                                              // 1271
        if (msg === null || !msg.msg) {                                                                                // 1272
          sendError('Bad request', msg);                                                                               // 1273
          return;                                                                                                      // 1274
        }                                                                                                              // 1275
                                                                                                                       // 1276
        if (msg.msg === 'connect') {                                                                                   // 1277
          if (socket._meteorSession) {                                                                                 // 1278
            sendError("Already connected", msg);                                                                       // 1279
            return;                                                                                                    // 1280
          }                                                                                                            // 1281
          Fiber(function () {                                                                                          // 1282
            self._handleConnect(socket, msg);                                                                          // 1283
          }).run();                                                                                                    // 1284
          return;                                                                                                      // 1285
        }                                                                                                              // 1286
                                                                                                                       // 1287
        if (!socket._meteorSession) {                                                                                  // 1288
          sendError('Must connect first', msg);                                                                        // 1289
          return;                                                                                                      // 1290
        }                                                                                                              // 1291
        socket._meteorSession.processMessage(msg);                                                                     // 1292
      } catch (e) {                                                                                                    // 1293
        // XXX print stack nicely                                                                                      // 1294
        Meteor._debug("Internal exception while processing message", msg,                                              // 1295
                      e.message, e.stack);                                                                             // 1296
      }                                                                                                                // 1297
    });                                                                                                                // 1298
                                                                                                                       // 1299
    socket.on('close', function () {                                                                                   // 1300
      if (socket._meteorSession) {                                                                                     // 1301
        Fiber(function () {                                                                                            // 1302
          socket._meteorSession.close();                                                                               // 1303
        }).run();                                                                                                      // 1304
      }                                                                                                                // 1305
    });                                                                                                                // 1306
  });                                                                                                                  // 1307
};                                                                                                                     // 1308
                                                                                                                       // 1309
_.extend(Server.prototype, {                                                                                           // 1310
                                                                                                                       // 1311
  /**                                                                                                                  // 1312
   * @summary Register a callback to be called when a new DDP connection is made to the server.                        // 1313
   * @locus Server                                                                                                     // 1314
   * @param {function} callback The function to call when a new DDP connection is established.                         // 1315
   * @memberOf Meteor                                                                                                  // 1316
   */                                                                                                                  // 1317
  onConnection: function (fn) {                                                                                        // 1318
    var self = this;                                                                                                   // 1319
    return self.onConnectionHook.register(fn);                                                                         // 1320
  },                                                                                                                   // 1321
                                                                                                                       // 1322
  _handleConnect: function (socket, msg) {                                                                             // 1323
    var self = this;                                                                                                   // 1324
                                                                                                                       // 1325
    // The connect message must specify a version and an array of supported                                            // 1326
    // versions, and it must claim to support what it is proposing.                                                    // 1327
    if (!(typeof (msg.version) === 'string' &&                                                                         // 1328
          _.isArray(msg.support) &&                                                                                    // 1329
          _.all(msg.support, _.isString) &&                                                                            // 1330
          _.contains(msg.support, msg.version))) {                                                                     // 1331
      socket.send(stringifyDDP({msg: 'failed',                                                                         // 1332
                                version: SUPPORTED_DDP_VERSIONS[0]}));                                                 // 1333
      socket.close();                                                                                                  // 1334
      return;                                                                                                          // 1335
    }                                                                                                                  // 1336
                                                                                                                       // 1337
    // In the future, handle session resumption: something like:                                                       // 1338
    //  socket._meteorSession = self.sessions[msg.session]                                                             // 1339
    var version = calculateVersion(msg.support, SUPPORTED_DDP_VERSIONS);                                               // 1340
                                                                                                                       // 1341
    if (msg.version !== version) {                                                                                     // 1342
      // The best version to use (according to the client's stated preferences)                                        // 1343
      // is not the one the client is trying to use. Inform them about the best                                        // 1344
      // version to use.                                                                                               // 1345
      socket.send(stringifyDDP({msg: 'failed', version: version}));                                                    // 1346
      socket.close();                                                                                                  // 1347
      return;                                                                                                          // 1348
    }                                                                                                                  // 1349
                                                                                                                       // 1350
    // Yay, version matches! Create a new session.                                                                     // 1351
    // Note: Troposphere depends on the ability to mutate                                                              // 1352
    // Meteor.server.options.heartbeatTimeout! This is a hack, but it's life.                                          // 1353
    socket._meteorSession = new Session(self, version, socket, self.options);                                          // 1354
    self.sessions[socket._meteorSession.id] = socket._meteorSession;                                                   // 1355
    self.onConnectionHook.each(function (callback) {                                                                   // 1356
      if (socket._meteorSession)                                                                                       // 1357
        callback(socket._meteorSession.connectionHandle);                                                              // 1358
      return true;                                                                                                     // 1359
    });                                                                                                                // 1360
  },                                                                                                                   // 1361
  /**                                                                                                                  // 1362
   * Register a publish handler function.                                                                              // 1363
   *                                                                                                                   // 1364
   * @param name {String} identifier for query                                                                         // 1365
   * @param handler {Function} publish handler                                                                         // 1366
   * @param options {Object}                                                                                           // 1367
   *                                                                                                                   // 1368
   * Server will call handler function on each new subscription,                                                       // 1369
   * either when receiving DDP sub message for a named subscription, or on                                             // 1370
   * DDP connect for a universal subscription.                                                                         // 1371
   *                                                                                                                   // 1372
   * If name is null, this will be a subscription that is                                                              // 1373
   * automatically established and permanently on for all connected                                                    // 1374
   * client, instead of a subscription that can be turned on and off                                                   // 1375
   * with subscribe().                                                                                                 // 1376
   *                                                                                                                   // 1377
   * options to contain:                                                                                               // 1378
   *  - (mostly internal) is_auto: true if generated automatically                                                     // 1379
   *    from an autopublish hook. this is for cosmetic purposes only                                                   // 1380
   *    (it lets us determine whether to print a warning suggesting                                                    // 1381
   *    that you turn off autopublish.)                                                                                // 1382
   */                                                                                                                  // 1383
                                                                                                                       // 1384
  /**                                                                                                                  // 1385
   * @summary Publish a record set.                                                                                    // 1386
   * @memberOf Meteor                                                                                                  // 1387
   * @locus Server                                                                                                     // 1388
   * @param {String} name Name of the record set.  If `null`, the set has no name, and the record set is automatically sent to all connected clients.
   * @param {Function} func Function called on the server each time a client subscribes.  Inside the function, `this` is the publish handler object, described below.  If the client passed arguments to `subscribe`, the function is called with the same arguments.
   */                                                                                                                  // 1391
  publish: function (name, handler, options) {                                                                         // 1392
    var self = this;                                                                                                   // 1393
                                                                                                                       // 1394
    options = options || {};                                                                                           // 1395
                                                                                                                       // 1396
    if (name && name in self.publish_handlers) {                                                                       // 1397
      Meteor._debug("Ignoring duplicate publish named '" + name + "'");                                                // 1398
      return;                                                                                                          // 1399
    }                                                                                                                  // 1400
                                                                                                                       // 1401
    if (Package.autopublish && !options.is_auto) {                                                                     // 1402
      // They have autopublish on, yet they're trying to manually                                                      // 1403
      // picking stuff to publish. They probably should turn off                                                       // 1404
      // autopublish. (This check isn't perfect -- if you create a                                                     // 1405
      // publish before you turn on autopublish, it won't catch                                                        // 1406
      // it. But this will definitely handle the simple case where                                                     // 1407
      // you've added the autopublish package to your app, and are                                                     // 1408
      // calling publish from your app code.)                                                                          // 1409
      if (!self.warned_about_autopublish) {                                                                            // 1410
        self.warned_about_autopublish = true;                                                                          // 1411
        Meteor._debug(                                                                                                 // 1412
"** You've set up some data subscriptions with Meteor.publish(), but\n" +                                              // 1413
"** you still have autopublish turned on. Because autopublish is still\n" +                                            // 1414
"** on, your Meteor.publish() calls won't have much effect. All data\n" +                                              // 1415
"** will still be sent to all clients.\n" +                                                                            // 1416
"**\n" +                                                                                                               // 1417
"** Turn off autopublish by removing the autopublish package:\n" +                                                     // 1418
"**\n" +                                                                                                               // 1419
"**   $ meteor remove autopublish\n" +                                                                                 // 1420
"**\n" +                                                                                                               // 1421
"** .. and make sure you have Meteor.publish() and Meteor.subscribe() calls\n" +                                       // 1422
"** for each collection that you want clients to see.\n");                                                             // 1423
      }                                                                                                                // 1424
    }                                                                                                                  // 1425
                                                                                                                       // 1426
    if (name)                                                                                                          // 1427
      self.publish_handlers[name] = handler;                                                                           // 1428
    else {                                                                                                             // 1429
      self.universal_publish_handlers.push(handler);                                                                   // 1430
      // Spin up the new publisher on any existing session too. Run each                                               // 1431
      // session's subscription in a new Fiber, so that there's no change for                                          // 1432
      // self.sessions to change while we're running this loop.                                                        // 1433
      _.each(self.sessions, function (session) {                                                                       // 1434
        if (!session._dontStartNewUniversalSubs) {                                                                     // 1435
          Fiber(function() {                                                                                           // 1436
            session._startSubscription(handler);                                                                       // 1437
          }).run();                                                                                                    // 1438
        }                                                                                                              // 1439
      });                                                                                                              // 1440
    }                                                                                                                  // 1441
  },                                                                                                                   // 1442
                                                                                                                       // 1443
  _removeSession: function (session) {                                                                                 // 1444
    var self = this;                                                                                                   // 1445
    if (self.sessions[session.id]) {                                                                                   // 1446
      delete self.sessions[session.id];                                                                                // 1447
    }                                                                                                                  // 1448
  },                                                                                                                   // 1449
                                                                                                                       // 1450
  /**                                                                                                                  // 1451
   * @summary Defines functions that can be invoked over the network by clients.                                       // 1452
   * @locus Anywhere                                                                                                   // 1453
   * @param {Object} methods Dictionary whose keys are method names and values are functions.                          // 1454
   * @memberOf Meteor                                                                                                  // 1455
   */                                                                                                                  // 1456
  methods: function (methods) {                                                                                        // 1457
    var self = this;                                                                                                   // 1458
    _.each(methods, function (func, name) {                                                                            // 1459
      if (self.method_handlers[name])                                                                                  // 1460
        throw new Error("A method named '" + name + "' is already defined");                                           // 1461
      self.method_handlers[name] = func;                                                                               // 1462
    });                                                                                                                // 1463
  },                                                                                                                   // 1464
                                                                                                                       // 1465
  call: function (name /*, arguments */) {                                                                             // 1466
    // if it's a function, the last argument is the result callback,                                                   // 1467
    // not a parameter to the remote method.                                                                           // 1468
    var args = Array.prototype.slice.call(arguments, 1);                                                               // 1469
    if (args.length && typeof args[args.length - 1] === "function")                                                    // 1470
      var callback = args.pop();                                                                                       // 1471
    return this.apply(name, args, callback);                                                                           // 1472
  },                                                                                                                   // 1473
                                                                                                                       // 1474
  // @param options {Optional Object}                                                                                  // 1475
  // @param callback {Optional Function}                                                                               // 1476
  apply: function (name, args, options, callback) {                                                                    // 1477
    var self = this;                                                                                                   // 1478
                                                                                                                       // 1479
    // We were passed 3 arguments. They may be either (name, args, options)                                            // 1480
    // or (name, args, callback)                                                                                       // 1481
    if (!callback && typeof options === 'function') {                                                                  // 1482
      callback = options;                                                                                              // 1483
      options = {};                                                                                                    // 1484
    }                                                                                                                  // 1485
    options = options || {};                                                                                           // 1486
                                                                                                                       // 1487
    if (callback)                                                                                                      // 1488
      // It's not really necessary to do this, since we immediately                                                    // 1489
      // run the callback in this fiber before returning, but we do it                                                 // 1490
      // anyway for regularity.                                                                                        // 1491
      // XXX improve error message (and how we report it)                                                              // 1492
      callback = Meteor.bindEnvironment(                                                                               // 1493
        callback,                                                                                                      // 1494
        "delivering result of invoking '" + name + "'"                                                                 // 1495
      );                                                                                                               // 1496
                                                                                                                       // 1497
    // Run the handler                                                                                                 // 1498
    var handler = self.method_handlers[name];                                                                          // 1499
    var exception;                                                                                                     // 1500
    if (!handler) {                                                                                                    // 1501
      exception = new Meteor.Error(404, "Method not found");                                                           // 1502
    } else {                                                                                                           // 1503
      // If this is a method call from within another method, get the                                                  // 1504
      // user state from the outer method, otherwise don't allow                                                       // 1505
      // setUserId to be called                                                                                        // 1506
      var userId = null;                                                                                               // 1507
      var setUserId = function() {                                                                                     // 1508
        throw new Error("Can't call setUserId on a server initiated method call");                                     // 1509
      };                                                                                                               // 1510
      var connection = null;                                                                                           // 1511
      var currentInvocation = DDP._CurrentInvocation.get();                                                            // 1512
      if (currentInvocation) {                                                                                         // 1513
        userId = currentInvocation.userId;                                                                             // 1514
        setUserId = function(userId) {                                                                                 // 1515
          currentInvocation.setUserId(userId);                                                                         // 1516
        };                                                                                                             // 1517
        connection = currentInvocation.connection;                                                                     // 1518
      }                                                                                                                // 1519
                                                                                                                       // 1520
      var invocation = new MethodInvocation({                                                                          // 1521
        isSimulation: false,                                                                                           // 1522
        userId: userId,                                                                                                // 1523
        setUserId: setUserId,                                                                                          // 1524
        connection: connection,                                                                                        // 1525
        randomSeed: makeRpcSeed(currentInvocation, name)                                                               // 1526
      });                                                                                                              // 1527
      try {                                                                                                            // 1528
        var result = DDP._CurrentInvocation.withValue(invocation, function () {                                        // 1529
          return maybeAuditArgumentChecks(                                                                             // 1530
            handler, invocation, EJSON.clone(args), "internal call to '" +                                             // 1531
              name + "'");                                                                                             // 1532
        });                                                                                                            // 1533
        result = EJSON.clone(result);                                                                                  // 1534
      } catch (e) {                                                                                                    // 1535
        exception = e;                                                                                                 // 1536
      }                                                                                                                // 1537
    }                                                                                                                  // 1538
                                                                                                                       // 1539
    // Return the result in whichever way the caller asked for it. Note that we                                        // 1540
    // do NOT block on the write fence in an analogous way to how the client                                           // 1541
    // blocks on the relevant data being visible, so you are NOT guaranteed that                                       // 1542
    // cursor observe callbacks have fired when your callback is invoked. (We                                          // 1543
    // can change this if there's a real use case.)                                                                    // 1544
    if (callback) {                                                                                                    // 1545
      callback(exception, result);                                                                                     // 1546
      return undefined;                                                                                                // 1547
    }                                                                                                                  // 1548
    if (exception)                                                                                                     // 1549
      throw exception;                                                                                                 // 1550
    return result;                                                                                                     // 1551
  },                                                                                                                   // 1552
                                                                                                                       // 1553
  _urlForSession: function (sessionId) {                                                                               // 1554
    var self = this;                                                                                                   // 1555
    var session = self.sessions[sessionId];                                                                            // 1556
    if (session)                                                                                                       // 1557
      return session._socketUrl;                                                                                       // 1558
    else                                                                                                               // 1559
      return null;                                                                                                     // 1560
  }                                                                                                                    // 1561
});                                                                                                                    // 1562
                                                                                                                       // 1563
var calculateVersion = function (clientSupportedVersions,                                                              // 1564
                                 serverSupportedVersions) {                                                            // 1565
  var correctVersion = _.find(clientSupportedVersions, function (version) {                                            // 1566
    return _.contains(serverSupportedVersions, version);                                                               // 1567
  });                                                                                                                  // 1568
  if (!correctVersion) {                                                                                               // 1569
    correctVersion = serverSupportedVersions[0];                                                                       // 1570
  }                                                                                                                    // 1571
  return correctVersion;                                                                                               // 1572
};                                                                                                                     // 1573
                                                                                                                       // 1574
LivedataTest.calculateVersion = calculateVersion;                                                                      // 1575
                                                                                                                       // 1576
                                                                                                                       // 1577
// "blind" exceptions other than those that were deliberately thrown to signal                                         // 1578
// errors to the client                                                                                                // 1579
var wrapInternalException = function (exception, context) {                                                            // 1580
  if (!exception || exception instanceof Meteor.Error)                                                                 // 1581
    return exception;                                                                                                  // 1582
                                                                                                                       // 1583
  // tests can set the 'expected' flag on an exception so it won't go to the                                           // 1584
  // server log                                                                                                        // 1585
  if (!exception.expected) {                                                                                           // 1586
    Meteor._debug("Exception " + context, exception.stack);                                                            // 1587
    if (exception.sanitizedError) {                                                                                    // 1588
      Meteor._debug("Sanitized and reported to the client as:", exception.sanitizedError.message);                     // 1589
      Meteor._debug();                                                                                                 // 1590
    }                                                                                                                  // 1591
  }                                                                                                                    // 1592
                                                                                                                       // 1593
  // Did the error contain more details that could have been useful if caught in                                       // 1594
  // server code (or if thrown from non-client-originated code), but also                                              // 1595
  // provided a "sanitized" version with more context than 500 Internal server                                         // 1596
  // error? Use that.                                                                                                  // 1597
  if (exception.sanitizedError) {                                                                                      // 1598
    if (exception.sanitizedError instanceof Meteor.Error)                                                              // 1599
      return exception.sanitizedError;                                                                                 // 1600
    Meteor._debug("Exception " + context + " provides a sanitizedError that " +                                        // 1601
                  "is not a Meteor.Error; ignoring");                                                                  // 1602
  }                                                                                                                    // 1603
                                                                                                                       // 1604
  return new Meteor.Error(500, "Internal server error");                                                               // 1605
};                                                                                                                     // 1606
                                                                                                                       // 1607
                                                                                                                       // 1608
// Audit argument checks, if the audit-argument-checks package exists (it is a                                         // 1609
// weak dependency of this package).                                                                                   // 1610
var maybeAuditArgumentChecks = function (f, context, args, description) {                                              // 1611
  args = args || [];                                                                                                   // 1612
  if (Package['audit-argument-checks']) {                                                                              // 1613
    return Match._failIfArgumentsAreNotAllChecked(                                                                     // 1614
      f, context, args, description);                                                                                  // 1615
  }                                                                                                                    // 1616
  return f.apply(context, args);                                                                                       // 1617
};                                                                                                                     // 1618
                                                                                                                       // 1619
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/writefence.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var path = Npm.require('path');                                                                                        // 1
var Future = Npm.require(path.join('fibers', 'future'));                                                               // 2
                                                                                                                       // 3
// A write fence collects a group of writes, and provides a callback                                                   // 4
// when all of the writes are fully committed and propagated (all                                                      // 5
// observers have been notified of the write and acknowledged it.)                                                     // 6
//                                                                                                                     // 7
DDPServer._WriteFence = function () {                                                                                  // 8
  var self = this;                                                                                                     // 9
                                                                                                                       // 10
  self.armed = false;                                                                                                  // 11
  self.fired = false;                                                                                                  // 12
  self.retired = false;                                                                                                // 13
  self.outstanding_writes = 0;                                                                                         // 14
  self.completion_callbacks = [];                                                                                      // 15
};                                                                                                                     // 16
                                                                                                                       // 17
// The current write fence. When there is a current write fence, code                                                  // 18
// that writes to databases should register their writes with it using                                                 // 19
// beginWrite().                                                                                                       // 20
//                                                                                                                     // 21
DDPServer._CurrentWriteFence = new Meteor.EnvironmentVariable;                                                         // 22
                                                                                                                       // 23
_.extend(DDPServer._WriteFence.prototype, {                                                                            // 24
  // Start tracking a write, and return an object to represent it. The                                                 // 25
  // object has a single method, committed(). This method should be                                                    // 26
  // called when the write is fully committed and propagated. You can                                                  // 27
  // continue to add writes to the WriteFence up until it is triggered                                                 // 28
  // (calls its callbacks because all writes have committed.)                                                          // 29
  beginWrite: function () {                                                                                            // 30
    var self = this;                                                                                                   // 31
                                                                                                                       // 32
    if (self.retired)                                                                                                  // 33
      return { committed: function () {} };                                                                            // 34
                                                                                                                       // 35
    if (self.fired)                                                                                                    // 36
      throw new Error("fence has already activated -- too late to add writes");                                        // 37
                                                                                                                       // 38
    self.outstanding_writes++;                                                                                         // 39
    var committed = false;                                                                                             // 40
    return {                                                                                                           // 41
      committed: function () {                                                                                         // 42
        if (committed)                                                                                                 // 43
          throw new Error("committed called twice on the same write");                                                 // 44
        committed = true;                                                                                              // 45
        self.outstanding_writes--;                                                                                     // 46
        self._maybeFire();                                                                                             // 47
      }                                                                                                                // 48
    };                                                                                                                 // 49
  },                                                                                                                   // 50
                                                                                                                       // 51
  // Arm the fence. Once the fence is armed, and there are no more                                                     // 52
  // uncommitted writes, it will activate.                                                                             // 53
  arm: function () {                                                                                                   // 54
    var self = this;                                                                                                   // 55
    if (self === DDPServer._CurrentWriteFence.get())                                                                   // 56
      throw Error("Can't arm the current fence");                                                                      // 57
    self.armed = true;                                                                                                 // 58
    self._maybeFire();                                                                                                 // 59
  },                                                                                                                   // 60
                                                                                                                       // 61
  // Register a function to be called when the fence fires.                                                            // 62
  onAllCommitted: function (func) {                                                                                    // 63
    var self = this;                                                                                                   // 64
    if (self.fired)                                                                                                    // 65
      throw new Error("fence has already activated -- too late to " +                                                  // 66
                      "add a callback");                                                                               // 67
    self.completion_callbacks.push(func);                                                                              // 68
  },                                                                                                                   // 69
                                                                                                                       // 70
  // Convenience function. Arms the fence, then blocks until it fires.                                                 // 71
  armAndWait: function () {                                                                                            // 72
    var self = this;                                                                                                   // 73
    var future = new Future;                                                                                           // 74
    self.onAllCommitted(function () {                                                                                  // 75
      future['return']();                                                                                              // 76
    });                                                                                                                // 77
    self.arm();                                                                                                        // 78
    future.wait();                                                                                                     // 79
  },                                                                                                                   // 80
                                                                                                                       // 81
  _maybeFire: function () {                                                                                            // 82
    var self = this;                                                                                                   // 83
    if (self.fired)                                                                                                    // 84
      throw new Error("write fence already activated?");                                                               // 85
    if (self.armed && !self.outstanding_writes) {                                                                      // 86
      self.fired = true;                                                                                               // 87
      _.each(self.completion_callbacks, function (f) {f(self);});                                                      // 88
      self.completion_callbacks = [];                                                                                  // 89
    }                                                                                                                  // 90
  },                                                                                                                   // 91
                                                                                                                       // 92
  // Deactivate this fence so that adding more writes has no effect.                                                   // 93
  // The fence must have already fired.                                                                                // 94
  retire: function () {                                                                                                // 95
    var self = this;                                                                                                   // 96
    if (! self.fired)                                                                                                  // 97
      throw new Error("Can't retire a fence that hasn't fired.");                                                      // 98
    self.retired = true;                                                                                               // 99
  }                                                                                                                    // 100
});                                                                                                                    // 101
                                                                                                                       // 102
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/crossbar.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// A "crossbar" is a class that provides structured notification registration.                                         // 1
// See _match for the definition of how a notification matches a trigger.                                              // 2
// All notifications and triggers must have a string key named 'collection'.                                           // 3
                                                                                                                       // 4
DDPServer._Crossbar = function (options) {                                                                             // 5
  var self = this;                                                                                                     // 6
  options = options || {};                                                                                             // 7
                                                                                                                       // 8
  self.nextId = 1;                                                                                                     // 9
  // map from collection name (string) -> listener id -> object. each object has                                       // 10
  // keys 'trigger', 'callback'.                                                                                       // 11
  self.listenersByCollection = {};                                                                                     // 12
  self.factPackage = options.factPackage || "livedata";                                                                // 13
  self.factName = options.factName || null;                                                                            // 14
};                                                                                                                     // 15
                                                                                                                       // 16
_.extend(DDPServer._Crossbar.prototype, {                                                                              // 17
  // Listen for notification that match 'trigger'. A notification                                                      // 18
  // matches if it has the key-value pairs in trigger as a                                                             // 19
  // subset. When a notification matches, call 'callback', passing                                                     // 20
  // the actual notification.                                                                                          // 21
  //                                                                                                                   // 22
  // Returns a listen handle, which is an object with a method                                                         // 23
  // stop(). Call stop() to stop listening.                                                                            // 24
  //                                                                                                                   // 25
  // XXX It should be legal to call fire() from inside a listen()                                                      // 26
  // callback?                                                                                                         // 27
  listen: function (trigger, callback) {                                                                               // 28
    var self = this;                                                                                                   // 29
    var id = self.nextId++;                                                                                            // 30
                                                                                                                       // 31
    if (typeof(trigger.collection) !== 'string') {                                                                     // 32
      throw Error("Trigger lacks collection!");                                                                        // 33
    }                                                                                                                  // 34
                                                                                                                       // 35
    var collection = trigger.collection;  // save in case trigger is mutated                                           // 36
    var record = {trigger: EJSON.clone(trigger), callback: callback};                                                  // 37
    if (! _.has(self.listenersByCollection, collection)) {                                                             // 38
      self.listenersByCollection[collection] = {};                                                                     // 39
    }                                                                                                                  // 40
    self.listenersByCollection[collection][id] = record;                                                               // 41
                                                                                                                       // 42
    if (self.factName && Package.facts) {                                                                              // 43
      Package.facts.Facts.incrementServerFact(                                                                         // 44
        self.factPackage, self.factName, 1);                                                                           // 45
    }                                                                                                                  // 46
                                                                                                                       // 47
    return {                                                                                                           // 48
      stop: function () {                                                                                              // 49
        if (self.factName && Package.facts) {                                                                          // 50
          Package.facts.Facts.incrementServerFact(                                                                     // 51
            self.factPackage, self.factName, -1);                                                                      // 52
        }                                                                                                              // 53
        delete self.listenersByCollection[collection][id];                                                             // 54
        if (_.isEmpty(self.listenersByCollection[collection])) {                                                       // 55
          delete self.listenersByCollection[collection];                                                               // 56
        }                                                                                                              // 57
      }                                                                                                                // 58
    };                                                                                                                 // 59
  },                                                                                                                   // 60
                                                                                                                       // 61
  // Fire the provided 'notification' (an object whose attribute                                                       // 62
  // values are all JSON-compatibile) -- inform all matching listeners                                                 // 63
  // (registered with listen()).                                                                                       // 64
  //                                                                                                                   // 65
  // If fire() is called inside a write fence, then each of the                                                        // 66
  // listener callbacks will be called inside the write fence as well.                                                 // 67
  //                                                                                                                   // 68
  // The listeners may be invoked in parallel, rather than serially.                                                   // 69
  fire: function (notification) {                                                                                      // 70
    var self = this;                                                                                                   // 71
                                                                                                                       // 72
    if (typeof(notification.collection) !== 'string') {                                                                // 73
      throw Error("Notification lacks collection!");                                                                   // 74
    }                                                                                                                  // 75
                                                                                                                       // 76
    if (! _.has(self.listenersByCollection, notification.collection))                                                  // 77
      return;                                                                                                          // 78
                                                                                                                       // 79
    var listenersForCollection =                                                                                       // 80
          self.listenersByCollection[notification.collection];                                                         // 81
    var callbackIds = [];                                                                                              // 82
    _.each(listenersForCollection, function (l, id) {                                                                  // 83
      if (self._matches(notification, l.trigger)) {                                                                    // 84
        callbackIds.push(id);                                                                                          // 85
      }                                                                                                                // 86
    });                                                                                                                // 87
                                                                                                                       // 88
    // Listener callbacks can yield, so we need to first find all the ones that                                        // 89
    // match in a single iteration over self.listenersByCollection (which can't                                        // 90
    // be mutated during this iteration), and then invoke the matching                                                 // 91
    // callbacks, checking before each call to ensure they haven't stopped.                                            // 92
    // Note that we don't have to check that                                                                           // 93
    // self.listenersByCollection[notification.collection] still ===                                                   // 94
    // listenersForCollection, because the only way that stops being true is if                                        // 95
    // listenersForCollection first gets reduced down to the empty object (and                                         // 96
    // then never gets increased again).                                                                               // 97
    _.each(callbackIds, function (id) {                                                                                // 98
      if (_.has(listenersForCollection, id)) {                                                                         // 99
        listenersForCollection[id].callback(notification);                                                             // 100
      }                                                                                                                // 101
    });                                                                                                                // 102
  },                                                                                                                   // 103
                                                                                                                       // 104
  // A notification matches a trigger if all keys that exist in both are equal.                                        // 105
  //                                                                                                                   // 106
  // Examples:                                                                                                         // 107
  //  N:{collection: "C"} matches T:{collection: "C"}                                                                  // 108
  //    (a non-targeted write to a collection matches a                                                                // 109
  //     non-targeted query)                                                                                           // 110
  //  N:{collection: "C", id: "X"} matches T:{collection: "C"}                                                         // 111
  //    (a targeted write to a collection matches a non-targeted query)                                                // 112
  //  N:{collection: "C"} matches T:{collection: "C", id: "X"}                                                         // 113
  //    (a non-targeted write to a collection matches a                                                                // 114
  //     targeted query)                                                                                               // 115
  //  N:{collection: "C", id: "X"} matches T:{collection: "C", id: "X"}                                                // 116
  //    (a targeted write to a collection matches a targeted query targeted                                            // 117
  //     at the same document)                                                                                         // 118
  //  N:{collection: "C", id: "X"} does not match T:{collection: "C", id: "Y"}                                         // 119
  //    (a targeted write to a collection does not match a targeted query                                              // 120
  //     targeted at a different document)                                                                             // 121
  _matches: function (notification, trigger) {                                                                         // 122
    // Most notifications that use the crossbar have a string `collection` and                                         // 123
    // maybe an `id` that is a string or ObjectID. We're already dividing up                                           // 124
    // triggers by collection, but let's fast-track "nope, different ID" (and                                          // 125
    // avoid the overly generic EJSON.equals). This makes a noticeable                                                 // 126
    // performance difference; see https://github.com/meteor/meteor/pull/3697                                          // 127
    if (typeof(notification.id) === 'string' &&                                                                        // 128
        typeof(trigger.id) === 'string' &&                                                                             // 129
        notification.id !== trigger.id) {                                                                              // 130
      return false;                                                                                                    // 131
    }                                                                                                                  // 132
    if (notification.id instanceof LocalCollection._ObjectID &&                                                        // 133
        trigger.id instanceof LocalCollection._ObjectID &&                                                             // 134
        ! notification.id.equals(trigger.id)) {                                                                        // 135
      return false;                                                                                                    // 136
    }                                                                                                                  // 137
                                                                                                                       // 138
    return _.all(trigger, function (triggerValue, key) {                                                               // 139
      return !_.has(notification, key) ||                                                                              // 140
        EJSON.equals(triggerValue, notification[key]);                                                                 // 141
    });                                                                                                                // 142
  }                                                                                                                    // 143
});                                                                                                                    // 144
                                                                                                                       // 145
// The "invalidation crossbar" is a specific instance used by the DDP server to                                        // 146
// implement write fence notifications. Listener callbacks on this crossbar                                            // 147
// should call beginWrite on the current write fence before they return, if they                                       // 148
// want to delay the write fence from firing (ie, the DDP method-data-updated                                          // 149
// message from being sent).                                                                                           // 150
DDPServer._InvalidationCrossbar = new DDPServer._Crossbar({                                                            // 151
  factName: "invalidation-crossbar-listeners"                                                                          // 152
});                                                                                                                    // 153
                                                                                                                       // 154
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/livedata_common.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// All the supported versions (for both the client and server)                                                         // 1
// These must be in order of preference; most favored-first                                                            // 2
SUPPORTED_DDP_VERSIONS = [ '1', 'pre2', 'pre1' ];                                                                      // 3
                                                                                                                       // 4
LivedataTest.SUPPORTED_DDP_VERSIONS = SUPPORTED_DDP_VERSIONS;                                                          // 5
                                                                                                                       // 6
// Instance name is this because it is usually referred to as this inside a                                            // 7
// method definition                                                                                                   // 8
/**                                                                                                                    // 9
 * @summary The state for a single invocation of a method, referenced by this                                          // 10
 * inside a method definition.                                                                                         // 11
 * @param {Object} options                                                                                             // 12
 * @instanceName this                                                                                                  // 13
 */                                                                                                                    // 14
MethodInvocation = function (options) {                                                                                // 15
  var self = this;                                                                                                     // 16
                                                                                                                       // 17
  // true if we're running not the actual method, but a stub (that is,                                                 // 18
  // if we're on a client (which may be a browser, or in the future a                                                  // 19
  // server connecting to another server) and presently running a                                                      // 20
  // simulation of a server-side method for latency compensation                                                       // 21
  // purposes). not currently true except in a client such as a browser,                                               // 22
  // since there's usually no point in running stubs unless you have a                                                 // 23
  // zero-latency connection to the user.                                                                              // 24
                                                                                                                       // 25
  /**                                                                                                                  // 26
   * @summary Access inside a method invocation.  Boolean value, true if this invocation is a stub.                    // 27
   * @locus Anywhere                                                                                                   // 28
   * @name  isSimulation                                                                                               // 29
   * @memberOf MethodInvocation                                                                                        // 30
   * @instance                                                                                                         // 31
   * @type {Boolean}                                                                                                   // 32
   */                                                                                                                  // 33
  this.isSimulation = options.isSimulation;                                                                            // 34
                                                                                                                       // 35
  // call this function to allow other method invocations (from the                                                    // 36
  // same client) to continue running without waiting for this one to                                                  // 37
  // complete.                                                                                                         // 38
  this._unblock = options.unblock || function () {};                                                                   // 39
  this._calledUnblock = false;                                                                                         // 40
                                                                                                                       // 41
  // current user id                                                                                                   // 42
                                                                                                                       // 43
  /**                                                                                                                  // 44
   * @summary The id of the user that made this method call, or `null` if no user was logged in.                       // 45
   * @locus Anywhere                                                                                                   // 46
   * @name  userId                                                                                                     // 47
   * @memberOf MethodInvocation                                                                                        // 48
   * @instance                                                                                                         // 49
   */                                                                                                                  // 50
  this.userId = options.userId;                                                                                        // 51
                                                                                                                       // 52
  // sets current user id in all appropriate server contexts and                                                       // 53
  // reruns subscriptions                                                                                              // 54
  this._setUserId = options.setUserId || function () {};                                                               // 55
                                                                                                                       // 56
  // On the server, the connection this method call came in on.                                                        // 57
                                                                                                                       // 58
  /**                                                                                                                  // 59
   * @summary Access inside a method invocation. The [connection](#meteor_onconnection) that this method was received on. `null` if the method is not associated with a connection, eg. a server initiated method call.
   * @locus Server                                                                                                     // 61
   * @name  connection                                                                                                 // 62
   * @memberOf MethodInvocation                                                                                        // 63
   * @instance                                                                                                         // 64
   */                                                                                                                  // 65
  this.connection = options.connection;                                                                                // 66
                                                                                                                       // 67
  // The seed for randomStream value generation                                                                        // 68
  this.randomSeed = options.randomSeed;                                                                                // 69
                                                                                                                       // 70
  // This is set by RandomStream.get; and holds the random stream state                                                // 71
  this.randomStream = null;                                                                                            // 72
};                                                                                                                     // 73
                                                                                                                       // 74
_.extend(MethodInvocation.prototype, {                                                                                 // 75
  /**                                                                                                                  // 76
   * @summary Call inside a method invocation.  Allow subsequent method from this client to begin running in a new fiber.
   * @locus Server                                                                                                     // 78
   * @memberOf MethodInvocation                                                                                        // 79
   * @instance                                                                                                         // 80
   */                                                                                                                  // 81
  unblock: function () {                                                                                               // 82
    var self = this;                                                                                                   // 83
    self._calledUnblock = true;                                                                                        // 84
    self._unblock();                                                                                                   // 85
  },                                                                                                                   // 86
                                                                                                                       // 87
  /**                                                                                                                  // 88
   * @summary Set the logged in user.                                                                                  // 89
   * @locus Server                                                                                                     // 90
   * @memberOf MethodInvocation                                                                                        // 91
   * @instance                                                                                                         // 92
   * @param {String | null} userId The value that should be returned by `userId` on this connection.                   // 93
   */                                                                                                                  // 94
  setUserId: function(userId) {                                                                                        // 95
    var self = this;                                                                                                   // 96
    if (self._calledUnblock)                                                                                           // 97
      throw new Error("Can't call setUserId in a method after calling unblock");                                       // 98
    self.userId = userId;                                                                                              // 99
    self._setUserId(userId);                                                                                           // 100
  }                                                                                                                    // 101
});                                                                                                                    // 102
                                                                                                                       // 103
parseDDP = function (stringMessage) {                                                                                  // 104
  try {                                                                                                                // 105
    var msg = JSON.parse(stringMessage);                                                                               // 106
  } catch (e) {                                                                                                        // 107
    Meteor._debug("Discarding message with invalid JSON", stringMessage);                                              // 108
    return null;                                                                                                       // 109
  }                                                                                                                    // 110
  // DDP messages must be objects.                                                                                     // 111
  if (msg === null || typeof msg !== 'object') {                                                                       // 112
    Meteor._debug("Discarding non-object DDP message", stringMessage);                                                 // 113
    return null;                                                                                                       // 114
  }                                                                                                                    // 115
                                                                                                                       // 116
  // massage msg to get it into "abstract ddp" rather than "wire ddp" format.                                          // 117
                                                                                                                       // 118
  // switch between "cleared" rep of unsetting fields and "undefined"                                                  // 119
  // rep of same                                                                                                       // 120
  if (_.has(msg, 'cleared')) {                                                                                         // 121
    if (!_.has(msg, 'fields'))                                                                                         // 122
      msg.fields = {};                                                                                                 // 123
    _.each(msg.cleared, function (clearKey) {                                                                          // 124
      msg.fields[clearKey] = undefined;                                                                                // 125
    });                                                                                                                // 126
    delete msg.cleared;                                                                                                // 127
  }                                                                                                                    // 128
                                                                                                                       // 129
  _.each(['fields', 'params', 'result'], function (field) {                                                            // 130
    if (_.has(msg, field))                                                                                             // 131
      msg[field] = EJSON._adjustTypesFromJSONValue(msg[field]);                                                        // 132
  });                                                                                                                  // 133
                                                                                                                       // 134
  return msg;                                                                                                          // 135
};                                                                                                                     // 136
                                                                                                                       // 137
stringifyDDP = function (msg) {                                                                                        // 138
  var copy = EJSON.clone(msg);                                                                                         // 139
  // swizzle 'changed' messages from 'fields undefined' rep to 'fields                                                 // 140
  // and cleared' rep                                                                                                  // 141
  if (_.has(msg, 'fields')) {                                                                                          // 142
    var cleared = [];                                                                                                  // 143
    _.each(msg.fields, function (value, key) {                                                                         // 144
      if (value === undefined) {                                                                                       // 145
        cleared.push(key);                                                                                             // 146
        delete copy.fields[key];                                                                                       // 147
      }                                                                                                                // 148
    });                                                                                                                // 149
    if (!_.isEmpty(cleared))                                                                                           // 150
      copy.cleared = cleared;                                                                                          // 151
    if (_.isEmpty(copy.fields))                                                                                        // 152
      delete copy.fields;                                                                                              // 153
  }                                                                                                                    // 154
  // adjust types to basic                                                                                             // 155
  _.each(['fields', 'params', 'result'], function (field) {                                                            // 156
    if (_.has(copy, field))                                                                                            // 157
      copy[field] = EJSON._adjustTypesToJSONValue(copy[field]);                                                        // 158
  });                                                                                                                  // 159
  if (msg.id && typeof msg.id !== 'string') {                                                                          // 160
    throw new Error("Message id is not a string");                                                                     // 161
  }                                                                                                                    // 162
  return JSON.stringify(copy);                                                                                         // 163
};                                                                                                                     // 164
                                                                                                                       // 165
// This is private but it's used in a few places. accounts-base uses                                                   // 166
// it to get the current user. accounts-password uses it to stash SRP                                                  // 167
// state in the DDP session. Meteor.setTimeout and friends clear                                                       // 168
// it. We can probably find a better way to factor this.                                                               // 169
DDP._CurrentInvocation = new Meteor.EnvironmentVariable;                                                               // 170
                                                                                                                       // 171
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/random_stream.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// RandomStream allows for generation of pseudo-random values, from a seed.                                            // 1
//                                                                                                                     // 2
// We use this for consistent 'random' numbers across the client and server.                                           // 3
// We want to generate probably-unique IDs on the client, and we ideally want                                          // 4
// the server to generate the same IDs when it executes the method.                                                    // 5
//                                                                                                                     // 6
// For generated values to be the same, we must seed ourselves the same way,                                           // 7
// and we must keep track of the current state of our pseudo-random generators.                                        // 8
// We call this state the scope. By default, we use the current DDP method                                             // 9
// invocation as our scope.  DDP now allows the client to specify a randomSeed.                                        // 10
// If a randomSeed is provided it will be used to seed our random sequences.                                           // 11
// In this way, client and server method calls will generate the same values.                                          // 12
//                                                                                                                     // 13
// We expose multiple named streams; each stream is independent                                                        // 14
// and is seeded differently (but predictably from the name).                                                          // 15
// By using multiple streams, we support reordering of requests,                                                       // 16
// as long as they occur on different streams.                                                                         // 17
//                                                                                                                     // 18
// @param options {Optional Object}                                                                                    // 19
//   seed: Array or value - Seed value(s) for the generator.                                                           // 20
//                          If an array, will be used as-is                                                            // 21
//                          If a value, will be converted to a single-value array                                      // 22
//                          If omitted, a random array will be used as the seed.                                       // 23
RandomStream = function (options) {                                                                                    // 24
  var self = this;                                                                                                     // 25
                                                                                                                       // 26
  this.seed = [].concat(options.seed || randomToken());                                                                // 27
                                                                                                                       // 28
  this.sequences = {};                                                                                                 // 29
};                                                                                                                     // 30
                                                                                                                       // 31
// Returns a random string of sufficient length for a random seed.                                                     // 32
// This is a placeholder function; a similar function is planned                                                       // 33
// for Random itself; when that is added we should remove this function,                                               // 34
// and call Random's randomToken instead.                                                                              // 35
function randomToken() {                                                                                               // 36
  return Random.hexString(20);                                                                                         // 37
};                                                                                                                     // 38
                                                                                                                       // 39
// Returns the random stream with the specified name, in the specified scope.                                          // 40
// If scope is null (or otherwise falsey) then we will use Random, which will                                          // 41
// give us as random numbers as possible, but won't produce the same                                                   // 42
// values across client and server.                                                                                    // 43
// However, scope will normally be the current DDP method invocation, so                                               // 44
// we'll use the stream with the specified name, and we should get consistent                                          // 45
// values on the client and server sides of a method call.                                                             // 46
RandomStream.get = function (scope, name) {                                                                            // 47
  if (!name) {                                                                                                         // 48
    name = "default";                                                                                                  // 49
  }                                                                                                                    // 50
  if (!scope) {                                                                                                        // 51
    // There was no scope passed in;                                                                                   // 52
    // the sequence won't actually be reproducible.                                                                    // 53
    return Random;                                                                                                     // 54
  }                                                                                                                    // 55
  var randomStream = scope.randomStream;                                                                               // 56
  if (!randomStream) {                                                                                                 // 57
    scope.randomStream = randomStream = new RandomStream({                                                             // 58
      seed: scope.randomSeed                                                                                           // 59
    });                                                                                                                // 60
  }                                                                                                                    // 61
  return randomStream._sequence(name);                                                                                 // 62
};                                                                                                                     // 63
                                                                                                                       // 64
// Returns the named sequence of pseudo-random values.                                                                 // 65
// The scope will be DDP._CurrentInvocation.get(), so the stream will produce                                          // 66
// consistent values for method calls on the client and server.                                                        // 67
DDP.randomStream = function (name) {                                                                                   // 68
  var scope = DDP._CurrentInvocation.get();                                                                            // 69
  return RandomStream.get(scope, name);                                                                                // 70
};                                                                                                                     // 71
                                                                                                                       // 72
// Creates a randomSeed for passing to a method call.                                                                  // 73
// Note that we take enclosing as an argument,                                                                         // 74
// though we expect it to be DDP._CurrentInvocation.get()                                                              // 75
// However, we often evaluate makeRpcSeed lazily, and thus the relevant                                                // 76
// invocation may not be the one currently in scope.                                                                   // 77
// If enclosing is null, we'll use Random and values won't be repeatable.                                              // 78
makeRpcSeed = function (enclosing, methodName) {                                                                       // 79
  var stream = RandomStream.get(enclosing, '/rpc/' + methodName);                                                      // 80
  return stream.hexString(20);                                                                                         // 81
};                                                                                                                     // 82
                                                                                                                       // 83
_.extend(RandomStream.prototype, {                                                                                     // 84
  // Get a random sequence with the specified name, creating it if does not exist.                                     // 85
  // New sequences are seeded with the seed concatenated with the name.                                                // 86
  // By passing a seed into Random.create, we use the Alea generator.                                                  // 87
  _sequence: function (name) {                                                                                         // 88
    var self = this;                                                                                                   // 89
                                                                                                                       // 90
    var sequence = self.sequences[name] || null;                                                                       // 91
    if (sequence === null) {                                                                                           // 92
      var sequenceSeed = self.seed.concat(name);                                                                       // 93
      for (var i = 0; i < sequenceSeed.length; i++) {                                                                  // 94
        if (_.isFunction(sequenceSeed[i])) {                                                                           // 95
          sequenceSeed[i] = sequenceSeed[i]();                                                                         // 96
        }                                                                                                              // 97
      }                                                                                                                // 98
      self.sequences[name] = sequence = Random.createWithSeeds.apply(null, sequenceSeed);                              // 99
    }                                                                                                                  // 100
    return sequence;                                                                                                   // 101
  }                                                                                                                    // 102
});                                                                                                                    // 103
                                                                                                                       // 104
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/livedata_connection.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 1
  var path = Npm.require('path');                                                                                      // 2
  var Fiber = Npm.require('fibers');                                                                                   // 3
  var Future = Npm.require(path.join('fibers', 'future'));                                                             // 4
}                                                                                                                      // 5
                                                                                                                       // 6
// @param url {String|Object} URL to Meteor app,                                                                       // 7
//   or an object as a test hook (see code)                                                                            // 8
// Options:                                                                                                            // 9
//   reloadWithOutstanding: is it OK to reload if there are outstanding methods?                                       // 10
//   headers: extra headers to send on the websockets connection, for                                                  // 11
//     server-to-server DDP only                                                                                       // 12
//   _sockjsOptions: Specifies options to pass through to the sockjs client                                            // 13
//   onDDPNegotiationVersionFailure: callback when version negotiation fails.                                          // 14
//                                                                                                                     // 15
// XXX There should be a way to destroy a DDP connection, causing all                                                  // 16
// outstanding method calls to fail.                                                                                   // 17
//                                                                                                                     // 18
// XXX Our current way of handling failure and reconnection is great                                                   // 19
// for an app (where we want to tolerate being disconnected as an                                                      // 20
// expect state, and keep trying forever to reconnect) but cumbersome                                                  // 21
// for something like a command line tool that wants to make a                                                         // 22
// connection, call a method, and print an error if connection                                                         // 23
// fails. We should have better usability in the latter case (while                                                    // 24
// still transparently reconnecting if it's just a transient failure                                                   // 25
// or the server migrating us).                                                                                        // 26
var Connection = function (url, options) {                                                                             // 27
  var self = this;                                                                                                     // 28
  options = _.extend({                                                                                                 // 29
    onConnected: function () {},                                                                                       // 30
    onDDPVersionNegotiationFailure: function (description) {                                                           // 31
      Meteor._debug(description);                                                                                      // 32
    },                                                                                                                 // 33
    heartbeatInterval: 35000,                                                                                          // 34
    heartbeatTimeout: 15000,                                                                                           // 35
    // These options are only for testing.                                                                             // 36
    reloadWithOutstanding: false,                                                                                      // 37
    supportedDDPVersions: SUPPORTED_DDP_VERSIONS,                                                                      // 38
    retry: true,                                                                                                       // 39
    respondToPings: true                                                                                               // 40
  }, options);                                                                                                         // 41
                                                                                                                       // 42
  // If set, called when we reconnect, queuing method calls _before_ the                                               // 43
  // existing outstanding ones. This is the only data member that is part of the                                       // 44
  // public API!                                                                                                       // 45
  self.onReconnect = null;                                                                                             // 46
                                                                                                                       // 47
  // as a test hook, allow passing a stream instead of a url.                                                          // 48
  if (typeof url === "object") {                                                                                       // 49
    self._stream = url;                                                                                                // 50
  } else {                                                                                                             // 51
    self._stream = new LivedataTest.ClientStream(url, {                                                                // 52
      retry: options.retry,                                                                                            // 53
      headers: options.headers,                                                                                        // 54
      _sockjsOptions: options._sockjsOptions,                                                                          // 55
      // Used to keep some tests quiet, or for other cases in which                                                    // 56
      // the right thing to do with connection errors is to silently                                                   // 57
      // fail (e.g. sending package usage stats). At some point we                                                     // 58
      // should have a real API for handling client-stream-level                                                       // 59
      // errors.                                                                                                       // 60
      _dontPrintErrors: options._dontPrintErrors,                                                                      // 61
      connectTimeoutMs: options.connectTimeoutMs                                                                       // 62
    });                                                                                                                // 63
  }                                                                                                                    // 64
                                                                                                                       // 65
  self._lastSessionId = null;                                                                                          // 66
  self._versionSuggestion = null;  // The last proposed DDP version.                                                   // 67
  self._version = null;   // The DDP version agreed on by client and server.                                           // 68
  self._stores = {}; // name -> object with methods                                                                    // 69
  self._methodHandlers = {}; // name -> func                                                                           // 70
  self._nextMethodId = 1;                                                                                              // 71
  self._supportedDDPVersions = options.supportedDDPVersions;                                                           // 72
                                                                                                                       // 73
  self._heartbeatInterval = options.heartbeatInterval;                                                                 // 74
  self._heartbeatTimeout = options.heartbeatTimeout;                                                                   // 75
                                                                                                                       // 76
  // Tracks methods which the user has tried to call but which have not yet                                            // 77
  // called their user callback (ie, they are waiting on their result or for all                                       // 78
  // of their writes to be written to the local cache). Map from method ID to                                          // 79
  // MethodInvoker object.                                                                                             // 80
  self._methodInvokers = {};                                                                                           // 81
                                                                                                                       // 82
  // Tracks methods which the user has called but whose result messages have not                                       // 83
  // arrived yet.                                                                                                      // 84
  //                                                                                                                   // 85
  // _outstandingMethodBlocks is an array of blocks of methods. Each block                                             // 86
  // represents a set of methods that can run at the same time. The first block                                        // 87
  // represents the methods which are currently in flight; subsequent blocks                                           // 88
  // must wait for previous blocks to be fully finished before they can be sent                                        // 89
  // to the server.                                                                                                    // 90
  //                                                                                                                   // 91
  // Each block is an object with the following fields:                                                                // 92
  // - methods: a list of MethodInvoker objects                                                                        // 93
  // - wait: a boolean; if true, this block had a single method invoked with                                           // 94
  //         the "wait" option                                                                                         // 95
  //                                                                                                                   // 96
  // There will never be adjacent blocks with wait=false, because the only thing                                       // 97
  // that makes methods need to be serialized is a wait method.                                                        // 98
  //                                                                                                                   // 99
  // Methods are removed from the first block when their "result" is                                                   // 100
  // received. The entire first block is only removed when all of the in-flight                                        // 101
  // methods have received their results (so the "methods" list is empty) *AND*                                        // 102
  // all of the data written by those methods are visible in the local cache. So                                       // 103
  // it is possible for the first block's methods list to be empty, if we are                                          // 104
  // still waiting for some objects to quiesce.                                                                        // 105
  //                                                                                                                   // 106
  // Example:                                                                                                          // 107
  //  _outstandingMethodBlocks = [                                                                                     // 108
  //    {wait: false, methods: []},                                                                                    // 109
  //    {wait: true, methods: [<MethodInvoker for 'login'>]},                                                          // 110
  //    {wait: false, methods: [<MethodInvoker for 'foo'>,                                                             // 111
  //                            <MethodInvoker for 'bar'>]}]                                                           // 112
  // This means that there were some methods which were sent to the server and                                         // 113
  // which have returned their results, but some of the data written by                                                // 114
  // the methods may not be visible in the local cache. Once all that data is                                          // 115
  // visible, we will send a 'login' method. Once the login method has returned                                        // 116
  // and all the data is visible (including re-running subs if userId changes),                                        // 117
  // we will send the 'foo' and 'bar' methods in parallel.                                                             // 118
  self._outstandingMethodBlocks = [];                                                                                  // 119
                                                                                                                       // 120
  // method ID -> array of objects with keys 'collection' and 'id', listing                                            // 121
  // documents written by a given method's stub. keys are associated with                                              // 122
  // methods whose stub wrote at least one document, and whose data-done message                                       // 123
  // has not yet been received.                                                                                        // 124
  self._documentsWrittenByStub = {};                                                                                   // 125
  // collection -> IdMap of "server document" object. A "server document" has:                                         // 126
  // - "document": the version of the document according the                                                           // 127
  //   server (ie, the snapshot before a stub wrote it, amended by any changes                                         // 128
  //   received from the server)                                                                                       // 129
  //   It is undefined if we think the document does not exist                                                         // 130
  // - "writtenByStubs": a set of method IDs whose stubs wrote to the document                                         // 131
  //   whose "data done" messages have not yet been processed                                                          // 132
  self._serverDocuments = {};                                                                                          // 133
                                                                                                                       // 134
  // Array of callbacks to be called after the next update of the local                                                // 135
  // cache. Used for:                                                                                                  // 136
  //  - Calling methodInvoker.dataVisible and sub ready callbacks after                                                // 137
  //    the relevant data is flushed.                                                                                  // 138
  //  - Invoking the callbacks of "half-finished" methods after reconnect                                              // 139
  //    quiescence. Specifically, methods whose result was received over the old                                       // 140
  //    connection (so we don't re-send it) but whose data had not been made                                           // 141
  //    visible.                                                                                                       // 142
  self._afterUpdateCallbacks = [];                                                                                     // 143
                                                                                                                       // 144
  // In two contexts, we buffer all incoming data messages and then process them                                       // 145
  // all at once in a single update:                                                                                   // 146
  //   - During reconnect, we buffer all data messages until all subs that had                                         // 147
  //     been ready before reconnect are ready again, and all methods that are                                         // 148
  //     active have returned their "data done message"; then                                                          // 149
  //   - During the execution of a "wait" method, we buffer all data messages                                          // 150
  //     until the wait method gets its "data done" message. (If the wait method                                       // 151
  //     occurs during reconnect, it doesn't get any special handling.)                                                // 152
  // all data messages are processed in one update.                                                                    // 153
  //                                                                                                                   // 154
  // The following fields are used for this "quiescence" process.                                                      // 155
                                                                                                                       // 156
  // This buffers the messages that aren't being processed yet.                                                        // 157
  self._messagesBufferedUntilQuiescence = [];                                                                          // 158
  // Map from method ID -> true. Methods are removed from this when their                                              // 159
  // "data done" message is received, and we will not quiesce until it is                                              // 160
  // empty.                                                                                                            // 161
  self._methodsBlockingQuiescence = {};                                                                                // 162
  // map from sub ID -> true for subs that were ready (ie, called the sub                                              // 163
  // ready callback) before reconnect but haven't become ready again yet                                               // 164
  self._subsBeingRevived = {}; // map from sub._id -> true                                                             // 165
  // if true, the next data update should reset all stores. (set during                                                // 166
  // reconnect.)                                                                                                       // 167
  self._resetStores = false;                                                                                           // 168
                                                                                                                       // 169
  // name -> array of updates for (yet to be created) collections                                                      // 170
  self._updatesForUnknownStores = {};                                                                                  // 171
  // if we're blocking a migration, the retry func                                                                     // 172
  self._retryMigrate = null;                                                                                           // 173
                                                                                                                       // 174
  // metadata for subscriptions.  Map from sub ID to object with keys:                                                 // 175
  //   - id                                                                                                            // 176
  //   - name                                                                                                          // 177
  //   - params                                                                                                        // 178
  //   - inactive (if true, will be cleaned up if not reused in re-run)                                                // 179
  //   - ready (has the 'ready' message been received?)                                                                // 180
  //   - readyCallback (an optional callback to call when ready)                                                       // 181
  //   - errorCallback (an optional callback to call if the sub terminates with                                        // 182
  //                    an error, XXX COMPAT WITH 1.0.3.1)                                                             // 183
  //   - stopCallback (an optional callback to call when the sub terminates                                            // 184
  //     for any reason, with an error argument if an error triggered the stop)                                        // 185
  self._subscriptions = {};                                                                                            // 186
                                                                                                                       // 187
  // Reactive userId.                                                                                                  // 188
  self._userId = null;                                                                                                 // 189
  self._userIdDeps = new Tracker.Dependency;                                                                           // 190
                                                                                                                       // 191
  // Block auto-reload while we're waiting for method responses.                                                       // 192
  if (Meteor.isClient && Package.reload && !options.reloadWithOutstanding) {                                           // 193
    Package.reload.Reload._onMigrate(function (retry) {                                                                // 194
      if (!self._readyToMigrate()) {                                                                                   // 195
        if (self._retryMigrate)                                                                                        // 196
          throw new Error("Two migrations in progress?");                                                              // 197
        self._retryMigrate = retry;                                                                                    // 198
        return false;                                                                                                  // 199
      } else {                                                                                                         // 200
        return [true];                                                                                                 // 201
      }                                                                                                                // 202
    });                                                                                                                // 203
  }                                                                                                                    // 204
                                                                                                                       // 205
  var onMessage = function (raw_msg) {                                                                                 // 206
    try {                                                                                                              // 207
      var msg = parseDDP(raw_msg);                                                                                     // 208
    } catch (e) {                                                                                                      // 209
      Meteor._debug("Exception while parsing DDP", e);                                                                 // 210
      return;                                                                                                          // 211
    }                                                                                                                  // 212
                                                                                                                       // 213
    if (msg === null || !msg.msg) {                                                                                    // 214
      // XXX COMPAT WITH 0.6.6. ignore the old welcome message for back                                                // 215
      // compat.  Remove this 'if' once the server stops sending welcome                                               // 216
      // messages (stream_server.js).                                                                                  // 217
      if (! (msg && msg.server_id))                                                                                    // 218
        Meteor._debug("discarding invalid livedata message", msg);                                                     // 219
      return;                                                                                                          // 220
    }                                                                                                                  // 221
                                                                                                                       // 222
    if (msg.msg === 'connected') {                                                                                     // 223
      self._version = self._versionSuggestion;                                                                         // 224
      self._livedata_connected(msg);                                                                                   // 225
      options.onConnected();                                                                                           // 226
    }                                                                                                                  // 227
    else if (msg.msg == 'failed') {                                                                                    // 228
      if (_.contains(self._supportedDDPVersions, msg.version)) {                                                       // 229
        self._versionSuggestion = msg.version;                                                                         // 230
        self._stream.reconnect({_force: true});                                                                        // 231
      } else {                                                                                                         // 232
        var description =                                                                                              // 233
              "DDP version negotiation failed; server requested version " + msg.version;                               // 234
        self._stream.disconnect({_permanent: true, _error: description});                                              // 235
        options.onDDPVersionNegotiationFailure(description);                                                           // 236
      }                                                                                                                // 237
    }                                                                                                                  // 238
    else if (msg.msg === 'ping') {                                                                                     // 239
      if (options.respondToPings)                                                                                      // 240
        self._send({msg: "pong", id: msg.id});                                                                         // 241
      if (self._heartbeat)                                                                                             // 242
        self._heartbeat.pingReceived();                                                                                // 243
    }                                                                                                                  // 244
    else if (msg.msg === 'pong') {                                                                                     // 245
      if (self._heartbeat) {                                                                                           // 246
        self._heartbeat.pongReceived();                                                                                // 247
      }                                                                                                                // 248
    }                                                                                                                  // 249
    else if (_.include(['added', 'changed', 'removed', 'ready', 'updated'], msg.msg))                                  // 250
      self._livedata_data(msg);                                                                                        // 251
    else if (msg.msg === 'nosub')                                                                                      // 252
      self._livedata_nosub(msg);                                                                                       // 253
    else if (msg.msg === 'result')                                                                                     // 254
      self._livedata_result(msg);                                                                                      // 255
    else if (msg.msg === 'error')                                                                                      // 256
      self._livedata_error(msg);                                                                                       // 257
    else                                                                                                               // 258
      Meteor._debug("discarding unknown livedata message type", msg);                                                  // 259
  };                                                                                                                   // 260
                                                                                                                       // 261
  var onReset = function () {                                                                                          // 262
    // Send a connect message at the beginning of the stream.                                                          // 263
    // NOTE: reset is called even on the first connection, so this is                                                  // 264
    // the only place we send this message.                                                                            // 265
    var msg = {msg: 'connect'};                                                                                        // 266
    if (self._lastSessionId)                                                                                           // 267
      msg.session = self._lastSessionId;                                                                               // 268
    msg.version = self._versionSuggestion || self._supportedDDPVersions[0];                                            // 269
    self._versionSuggestion = msg.version;                                                                             // 270
    msg.support = self._supportedDDPVersions;                                                                          // 271
    self._send(msg);                                                                                                   // 272
                                                                                                                       // 273
    // Now, to minimize setup latency, go ahead and blast out all of                                                   // 274
    // our pending methods ands subscriptions before we've even taken                                                  // 275
    // the necessary RTT to know if we successfully reconnected. (1)                                                   // 276
    // They're supposed to be idempotent; (2) even if we did                                                           // 277
    // reconnect, we're not sure what messages might have gotten lost                                                  // 278
    // (in either direction) since we were disconnected (TCP being                                                     // 279
    // sloppy about that.)                                                                                             // 280
                                                                                                                       // 281
    // If the current block of methods all got their results (but didn't all get                                       // 282
    // their data visible), discard the empty block now.                                                               // 283
    if (! _.isEmpty(self._outstandingMethodBlocks) &&                                                                  // 284
        _.isEmpty(self._outstandingMethodBlocks[0].methods)) {                                                         // 285
      self._outstandingMethodBlocks.shift();                                                                           // 286
    }                                                                                                                  // 287
                                                                                                                       // 288
    // Mark all messages as unsent, they have not yet been sent on this                                                // 289
    // connection.                                                                                                     // 290
    _.each(self._methodInvokers, function (m) {                                                                        // 291
      m.sentMessage = false;                                                                                           // 292
    });                                                                                                                // 293
                                                                                                                       // 294
    // If an `onReconnect` handler is set, call it first. Go through                                                   // 295
    // some hoops to ensure that methods that are called from within                                                   // 296
    // `onReconnect` get executed _before_ ones that were originally                                                   // 297
    // outstanding (since `onReconnect` is used to re-establish auth                                                   // 298
    // certificates)                                                                                                   // 299
    if (self.onReconnect)                                                                                              // 300
      self._callOnReconnectAndSendAppropriateOutstandingMethods();                                                     // 301
    else                                                                                                               // 302
      self._sendOutstandingMethods();                                                                                  // 303
                                                                                                                       // 304
    // add new subscriptions at the end. this way they take effect after                                               // 305
    // the handlers and we don't see flicker.                                                                          // 306
    _.each(self._subscriptions, function (sub, id) {                                                                   // 307
      self._send({                                                                                                     // 308
        msg: 'sub',                                                                                                    // 309
        id: id,                                                                                                        // 310
        name: sub.name,                                                                                                // 311
        params: sub.params                                                                                             // 312
      });                                                                                                              // 313
    });                                                                                                                // 314
  };                                                                                                                   // 315
                                                                                                                       // 316
  var onDisconnect = function () {                                                                                     // 317
    if (self._heartbeat) {                                                                                             // 318
      self._heartbeat.stop();                                                                                          // 319
      self._heartbeat = null;                                                                                          // 320
    }                                                                                                                  // 321
  };                                                                                                                   // 322
                                                                                                                       // 323
  if (Meteor.isServer) {                                                                                               // 324
    self._stream.on('message', Meteor.bindEnvironment(onMessage, Meteor._debug));                                      // 325
    self._stream.on('reset', Meteor.bindEnvironment(onReset, Meteor._debug));                                          // 326
    self._stream.on('disconnect', Meteor.bindEnvironment(onDisconnect, Meteor._debug));                                // 327
  } else {                                                                                                             // 328
    self._stream.on('message', onMessage);                                                                             // 329
    self._stream.on('reset', onReset);                                                                                 // 330
    self._stream.on('disconnect', onDisconnect);                                                                       // 331
  }                                                                                                                    // 332
};                                                                                                                     // 333
                                                                                                                       // 334
// A MethodInvoker manages sending a method to the server and calling the user's                                       // 335
// callbacks. On construction, it registers itself in the connection's                                                 // 336
// _methodInvokers map; it removes itself once the method is fully finished and                                        // 337
// the callback is invoked. This occurs when it has both received a result,                                            // 338
// and the data written by it is fully visible.                                                                        // 339
var MethodInvoker = function (options) {                                                                               // 340
  var self = this;                                                                                                     // 341
                                                                                                                       // 342
  // Public (within this file) fields.                                                                                 // 343
  self.methodId = options.methodId;                                                                                    // 344
  self.sentMessage = false;                                                                                            // 345
                                                                                                                       // 346
  self._callback = options.callback;                                                                                   // 347
  self._connection = options.connection;                                                                               // 348
  self._message = options.message;                                                                                     // 349
  self._onResultReceived = options.onResultReceived || function () {};                                                 // 350
  self._wait = options.wait;                                                                                           // 351
  self._methodResult = null;                                                                                           // 352
  self._dataVisible = false;                                                                                           // 353
                                                                                                                       // 354
  // Register with the connection.                                                                                     // 355
  self._connection._methodInvokers[self.methodId] = self;                                                              // 356
};                                                                                                                     // 357
_.extend(MethodInvoker.prototype, {                                                                                    // 358
  // Sends the method message to the server. May be called additional times if                                         // 359
  // we lose the connection and reconnect before receiving a result.                                                   // 360
  sendMessage: function () {                                                                                           // 361
    var self = this;                                                                                                   // 362
    // This function is called before sending a method (including resending on                                         // 363
    // reconnect). We should only (re)send methods where we don't already have a                                       // 364
    // result!                                                                                                         // 365
    if (self.gotResult())                                                                                              // 366
      throw new Error("sendingMethod is called on method with result");                                                // 367
                                                                                                                       // 368
    // If we're re-sending it, it doesn't matter if data was written the first                                         // 369
    // time.                                                                                                           // 370
    self._dataVisible = false;                                                                                         // 371
                                                                                                                       // 372
    self.sentMessage = true;                                                                                           // 373
                                                                                                                       // 374
    // If this is a wait method, make all data messages be buffered until it is                                        // 375
    // done.                                                                                                           // 376
    if (self._wait)                                                                                                    // 377
      self._connection._methodsBlockingQuiescence[self.methodId] = true;                                               // 378
                                                                                                                       // 379
    // Actually send the message.                                                                                      // 380
    self._connection._send(self._message);                                                                             // 381
  },                                                                                                                   // 382
  // Invoke the callback, if we have both a result and know that all data has                                          // 383
  // been written to the local cache.                                                                                  // 384
  _maybeInvokeCallback: function () {                                                                                  // 385
    var self = this;                                                                                                   // 386
    if (self._methodResult && self._dataVisible) {                                                                     // 387
      // Call the callback. (This won't throw: the callback was wrapped with                                           // 388
      // bindEnvironment.)                                                                                             // 389
      self._callback(self._methodResult[0], self._methodResult[1]);                                                    // 390
                                                                                                                       // 391
      // Forget about this method.                                                                                     // 392
      delete self._connection._methodInvokers[self.methodId];                                                          // 393
                                                                                                                       // 394
      // Let the connection know that this method is finished, so it can try to                                        // 395
      // move on to the next block of methods.                                                                         // 396
      self._connection._outstandingMethodFinished();                                                                   // 397
    }                                                                                                                  // 398
  },                                                                                                                   // 399
  // Call with the result of the method from the server. Only may be called                                            // 400
  // once; once it is called, you should not call sendMessage again.                                                   // 401
  // If the user provided an onResultReceived callback, call it immediately.                                           // 402
  // Then invoke the main callback if data is also visible.                                                            // 403
  receiveResult: function (err, result) {                                                                              // 404
    var self = this;                                                                                                   // 405
    if (self.gotResult())                                                                                              // 406
      throw new Error("Methods should only receive results once");                                                     // 407
    self._methodResult = [err, result];                                                                                // 408
    self._onResultReceived(err, result);                                                                               // 409
    self._maybeInvokeCallback();                                                                                       // 410
  },                                                                                                                   // 411
  // Call this when all data written by the method is visible. This means that                                         // 412
  // the method has returns its "data is done" message *AND* all server                                                // 413
  // documents that are buffered at that time have been written to the local                                           // 414
  // cache. Invokes the main callback if the result has been received.                                                 // 415
  dataVisible: function () {                                                                                           // 416
    var self = this;                                                                                                   // 417
    self._dataVisible = true;                                                                                          // 418
    self._maybeInvokeCallback();                                                                                       // 419
  },                                                                                                                   // 420
  // True if receiveResult has been called.                                                                            // 421
  gotResult: function () {                                                                                             // 422
    var self = this;                                                                                                   // 423
    return !!self._methodResult;                                                                                       // 424
  }                                                                                                                    // 425
});                                                                                                                    // 426
                                                                                                                       // 427
_.extend(Connection.prototype, {                                                                                       // 428
  // 'name' is the name of the data on the wire that should go in the                                                  // 429
  // store. 'wrappedStore' should be an object with methods beginUpdate, update,                                       // 430
  // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.                                       // 431
  registerStore: function (name, wrappedStore) {                                                                       // 432
    var self = this;                                                                                                   // 433
                                                                                                                       // 434
    if (name in self._stores)                                                                                          // 435
      return false;                                                                                                    // 436
                                                                                                                       // 437
    // Wrap the input object in an object which makes any store method not                                             // 438
    // implemented by 'store' into a no-op.                                                                            // 439
    var store = {};                                                                                                    // 440
    _.each(['update', 'beginUpdate', 'endUpdate', 'saveOriginals',                                                     // 441
            'retrieveOriginals'], function (method) {                                                                  // 442
              store[method] = function () {                                                                            // 443
                return (wrappedStore[method]                                                                           // 444
                        ? wrappedStore[method].apply(wrappedStore, arguments)                                          // 445
                        : undefined);                                                                                  // 446
              };                                                                                                       // 447
            });                                                                                                        // 448
                                                                                                                       // 449
    self._stores[name] = store;                                                                                        // 450
                                                                                                                       // 451
    var queued = self._updatesForUnknownStores[name];                                                                  // 452
    if (queued) {                                                                                                      // 453
      store.beginUpdate(queued.length, false);                                                                         // 454
      _.each(queued, function (msg) {                                                                                  // 455
        store.update(msg);                                                                                             // 456
      });                                                                                                              // 457
      store.endUpdate();                                                                                               // 458
      delete self._updatesForUnknownStores[name];                                                                      // 459
    }                                                                                                                  // 460
                                                                                                                       // 461
    return true;                                                                                                       // 462
  },                                                                                                                   // 463
                                                                                                                       // 464
  /**                                                                                                                  // 465
   * @memberOf Meteor                                                                                                  // 466
   * @summary Subscribe to a record set.  Returns a handle that provides                                               // 467
   * `stop()` and `ready()` methods.                                                                                   // 468
   * @locus Client                                                                                                     // 469
   * @param {String} name Name of the subscription.  Matches the name of the                                           // 470
   * server's `publish()` call.                                                                                        // 471
   * @param {Any} [arg1,arg2...] Optional arguments passed to publisher                                                // 472
   * function on server.                                                                                               // 473
   * @param {Function|Object} [callbacks] Optional. May include `onStop`                                               // 474
   * and `onReady` callbacks. If there is an error, it is passed as an                                                 // 475
   * argument to `onStop`. If a function is passed instead of an object, it                                            // 476
   * is interpreted as an `onReady` callback.                                                                          // 477
   */                                                                                                                  // 478
  subscribe: function (name /* .. [arguments] .. (callback|callbacks) */) {                                            // 479
    var self = this;                                                                                                   // 480
                                                                                                                       // 481
    var params = Array.prototype.slice.call(arguments, 1);                                                             // 482
    var callbacks = {};                                                                                                // 483
    if (params.length) {                                                                                               // 484
      var lastParam = params[params.length - 1];                                                                       // 485
      if (_.isFunction(lastParam)) {                                                                                   // 486
        callbacks.onReady = params.pop();                                                                              // 487
      } else if (lastParam &&                                                                                          // 488
        // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use                                               // 489
        // onStop with an error callback instead.                                                                      // 490
        _.any([lastParam.onReady, lastParam.onError, lastParam.onStop],                                                // 491
          _.isFunction)) {                                                                                             // 492
        callbacks = params.pop();                                                                                      // 493
      }                                                                                                                // 494
    }                                                                                                                  // 495
                                                                                                                       // 496
    // Is there an existing sub with the same name and param, run in an                                                // 497
    // invalidated Computation? This will happen if we are rerunning an                                                // 498
    // existing computation.                                                                                           // 499
    //                                                                                                                 // 500
    // For example, consider a rerun of:                                                                               // 501
    //                                                                                                                 // 502
    //     Tracker.autorun(function () {                                                                               // 503
    //       Meteor.subscribe("foo", Session.get("foo"));                                                              // 504
    //       Meteor.subscribe("bar", Session.get("bar"));                                                              // 505
    //     });                                                                                                         // 506
    //                                                                                                                 // 507
    // If "foo" has changed but "bar" has not, we will match the "bar"                                                 // 508
    // subcribe to an existing inactive subscription in order to not                                                   // 509
    // unsub and resub the subscription unnecessarily.                                                                 // 510
    //                                                                                                                 // 511
    // We only look for one such sub; if there are N apparently-identical subs                                         // 512
    // being invalidated, we will require N matching subscribe calls to keep                                           // 513
    // them all active.                                                                                                // 514
    var existing = _.find(self._subscriptions, function (sub) {                                                        // 515
      return sub.inactive && sub.name === name &&                                                                      // 516
        EJSON.equals(sub.params, params);                                                                              // 517
    });                                                                                                                // 518
                                                                                                                       // 519
    var id;                                                                                                            // 520
    if (existing) {                                                                                                    // 521
      id = existing.id;                                                                                                // 522
      existing.inactive = false; // reactivate                                                                         // 523
                                                                                                                       // 524
      if (callbacks.onReady) {                                                                                         // 525
        // If the sub is not already ready, replace any ready callback with the                                        // 526
        // one provided now. (It's not really clear what users would expect for                                        // 527
        // an onReady callback inside an autorun; the semantics we provide is                                          // 528
        // that at the time the sub first becomes ready, we call the last                                              // 529
        // onReady callback provided, if any.)                                                                         // 530
        if (!existing.ready)                                                                                           // 531
          existing.readyCallback = callbacks.onReady;                                                                  // 532
      }                                                                                                                // 533
                                                                                                                       // 534
      // XXX COMPAT WITH 1.0.3.1 we used to have onError but now we call                                               // 535
      // onStop with an optional error argument                                                                        // 536
      if (callbacks.onError) {                                                                                         // 537
        // Replace existing callback if any, so that errors aren't                                                     // 538
        // double-reported.                                                                                            // 539
        existing.errorCallback = callbacks.onError;                                                                    // 540
      }                                                                                                                // 541
                                                                                                                       // 542
      if (callbacks.onStop) {                                                                                          // 543
        existing.stopCallback = callbacks.onStop;                                                                      // 544
      }                                                                                                                // 545
    } else {                                                                                                           // 546
      // New sub! Generate an id, save it locally, and send message.                                                   // 547
      id = Random.id();                                                                                                // 548
      self._subscriptions[id] = {                                                                                      // 549
        id: id,                                                                                                        // 550
        name: name,                                                                                                    // 551
        params: EJSON.clone(params),                                                                                   // 552
        inactive: false,                                                                                               // 553
        ready: false,                                                                                                  // 554
        readyDeps: new Tracker.Dependency,                                                                             // 555
        readyCallback: callbacks.onReady,                                                                              // 556
        // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                      // 557
        errorCallback: callbacks.onError,                                                                              // 558
        stopCallback: callbacks.onStop,                                                                                // 559
        connection: self,                                                                                              // 560
        remove: function() {                                                                                           // 561
          delete this.connection._subscriptions[this.id];                                                              // 562
          this.ready && this.readyDeps.changed();                                                                      // 563
        },                                                                                                             // 564
        stop: function() {                                                                                             // 565
          this.connection._send({msg: 'unsub', id: id});                                                               // 566
          this.remove();                                                                                               // 567
                                                                                                                       // 568
          if (callbacks.onStop) {                                                                                      // 569
            callbacks.onStop();                                                                                        // 570
          }                                                                                                            // 571
        }                                                                                                              // 572
      };                                                                                                               // 573
      self._send({msg: 'sub', id: id, name: name, params: params});                                                    // 574
    }                                                                                                                  // 575
                                                                                                                       // 576
    // return a handle to the application.                                                                             // 577
    var handle = {                                                                                                     // 578
      stop: function () {                                                                                              // 579
        if (!_.has(self._subscriptions, id))                                                                           // 580
          return;                                                                                                      // 581
                                                                                                                       // 582
        self._subscriptions[id].stop();                                                                                // 583
      },                                                                                                               // 584
      ready: function () {                                                                                             // 585
        // return false if we've unsubscribed.                                                                         // 586
        if (!_.has(self._subscriptions, id))                                                                           // 587
          return false;                                                                                                // 588
        var record = self._subscriptions[id];                                                                          // 589
        record.readyDeps.depend();                                                                                     // 590
        return record.ready;                                                                                           // 591
      },                                                                                                               // 592
      subscriptionId: id                                                                                               // 593
    };                                                                                                                 // 594
                                                                                                                       // 595
    if (Tracker.active) {                                                                                              // 596
      // We're in a reactive computation, so we'd like to unsubscribe when the                                         // 597
      // computation is invalidated... but not if the rerun just re-subscribes                                         // 598
      // to the same subscription!  When a rerun happens, we use onInvalidate                                          // 599
      // as a change to mark the subscription "inactive" so that it can                                                // 600
      // be reused from the rerun.  If it isn't reused, it's killed from                                               // 601
      // an afterFlush.                                                                                                // 602
      Tracker.onInvalidate(function (c) {                                                                              // 603
        if (_.has(self._subscriptions, id))                                                                            // 604
          self._subscriptions[id].inactive = true;                                                                     // 605
                                                                                                                       // 606
        Tracker.afterFlush(function () {                                                                               // 607
          if (_.has(self._subscriptions, id) &&                                                                        // 608
              self._subscriptions[id].inactive)                                                                        // 609
            handle.stop();                                                                                             // 610
        });                                                                                                            // 611
      });                                                                                                              // 612
    }                                                                                                                  // 613
                                                                                                                       // 614
    return handle;                                                                                                     // 615
  },                                                                                                                   // 616
                                                                                                                       // 617
  // options:                                                                                                          // 618
  // - onLateError {Function(error)} called if an error was received after the ready event.                            // 619
  //     (errors received before ready cause an error to be thrown)                                                    // 620
  _subscribeAndWait: function (name, args, options) {                                                                  // 621
    var self = this;                                                                                                   // 622
    var f = new Future();                                                                                              // 623
    var ready = false;                                                                                                 // 624
    var handle;                                                                                                        // 625
    args = args || [];                                                                                                 // 626
    args.push({                                                                                                        // 627
      onReady: function () {                                                                                           // 628
        ready = true;                                                                                                  // 629
        f['return']();                                                                                                 // 630
      },                                                                                                               // 631
      onError: function (e) {                                                                                          // 632
        if (!ready)                                                                                                    // 633
          f['throw'](e);                                                                                               // 634
        else                                                                                                           // 635
          options && options.onLateError && options.onLateError(e);                                                    // 636
      }                                                                                                                // 637
    });                                                                                                                // 638
                                                                                                                       // 639
    handle = self.subscribe.apply(self, [name].concat(args));                                                          // 640
    f.wait();                                                                                                          // 641
    return handle;                                                                                                     // 642
  },                                                                                                                   // 643
                                                                                                                       // 644
  methods: function (methods) {                                                                                        // 645
    var self = this;                                                                                                   // 646
    _.each(methods, function (func, name) {                                                                            // 647
      if (self._methodHandlers[name])                                                                                  // 648
        throw new Error("A method named '" + name + "' is already defined");                                           // 649
      self._methodHandlers[name] = func;                                                                               // 650
    });                                                                                                                // 651
  },                                                                                                                   // 652
                                                                                                                       // 653
  /**                                                                                                                  // 654
   * @memberOf Meteor                                                                                                  // 655
   * @summary Invokes a method passing any number of arguments.                                                        // 656
   * @locus Anywhere                                                                                                   // 657
   * @param {String} name Name of method to invoke                                                                     // 658
   * @param {EJSONable} [arg1,arg2...] Optional method arguments                                                       // 659
   * @param {Function} [asyncCallback] Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
   */                                                                                                                  // 661
  call: function (name /* .. [arguments] .. callback */) {                                                             // 662
    // if it's a function, the last argument is the result callback,                                                   // 663
    // not a parameter to the remote method.                                                                           // 664
    var args = Array.prototype.slice.call(arguments, 1);                                                               // 665
    if (args.length && typeof args[args.length - 1] === "function")                                                    // 666
      var callback = args.pop();                                                                                       // 667
    return this.apply(name, args, callback);                                                                           // 668
  },                                                                                                                   // 669
                                                                                                                       // 670
  // @param options {Optional Object}                                                                                  // 671
  //   wait: Boolean - Should we wait to call this until all current methods                                           // 672
  //                   are fully finished, and block subsequent method calls                                           // 673
  //                   until this method is fully finished?                                                            // 674
  //                   (does not affect methods called from within this method)                                        // 675
  //   onResultReceived: Function - a callback to call as soon as the method                                           // 676
  //                                result is received. the data written by                                            // 677
  //                                the method may not yet be in the cache!                                            // 678
  //   returnStubValue: Boolean - If true then in cases where we would have                                            // 679
  //                              otherwise discarded the stub's return value                                          // 680
  //                              and returned undefined, instead we go ahead                                          // 681
  //                              and return it.  Specifically, this is any                                            // 682
  //                              time other than when (a) we are already                                              // 683
  //                              inside a stub or (b) we are in Node and no                                           // 684
  //                              callback was provided.  Currently we require                                         // 685
  //                              this flag to be explicitly passed to reduce                                          // 686
  //                              the likelihood that stub return values will                                          // 687
  //                              be confused with server return values; we                                            // 688
  //                              may improve this in future.                                                          // 689
  // @param callback {Optional Function}                                                                               // 690
                                                                                                                       // 691
  /**                                                                                                                  // 692
   * @memberOf Meteor                                                                                                  // 693
   * @summary Invoke a method passing an array of arguments.                                                           // 694
   * @locus Anywhere                                                                                                   // 695
   * @param {String} name Name of method to invoke                                                                     // 696
   * @param {EJSONable[]} args Method arguments                                                                        // 697
   * @param {Object} [options]                                                                                         // 698
   * @param {Boolean} options.wait (Client only) If true, don't send this method until all previous method calls have completed, and don't send any subsequent method calls until this one is completed.
   * @param {Function} options.onResultReceived (Client only) This callback is invoked with the error or result of the method (just like `asyncCallback`) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
   * @param {Function} [asyncCallback] Optional callback; same semantics as in [`Meteor.call`](#meteor_call).          // 701
   */                                                                                                                  // 702
  apply: function (name, args, options, callback) {                                                                    // 703
    var self = this;                                                                                                   // 704
                                                                                                                       // 705
    // We were passed 3 arguments. They may be either (name, args, options)                                            // 706
    // or (name, args, callback)                                                                                       // 707
    if (!callback && typeof options === 'function') {                                                                  // 708
      callback = options;                                                                                              // 709
      options = {};                                                                                                    // 710
    }                                                                                                                  // 711
    options = options || {};                                                                                           // 712
                                                                                                                       // 713
    if (callback) {                                                                                                    // 714
      // XXX would it be better form to do the binding in stream.on,                                                   // 715
      // or caller, instead of here?                                                                                   // 716
      // XXX improve error message (and how we report it)                                                              // 717
      callback = Meteor.bindEnvironment(                                                                               // 718
        callback,                                                                                                      // 719
        "delivering result of invoking '" + name + "'"                                                                 // 720
      );                                                                                                               // 721
    }                                                                                                                  // 722
                                                                                                                       // 723
    // Keep our args safe from mutation (eg if we don't send the message for a                                         // 724
    // while because of a wait method).                                                                                // 725
    args = EJSON.clone(args);                                                                                          // 726
                                                                                                                       // 727
    // Lazily allocate method ID once we know that it'll be needed.                                                    // 728
    var methodId = (function () {                                                                                      // 729
      var id;                                                                                                          // 730
      return function () {                                                                                             // 731
        if (id === undefined)                                                                                          // 732
          id = '' + (self._nextMethodId++);                                                                            // 733
        return id;                                                                                                     // 734
      };                                                                                                               // 735
    })();                                                                                                              // 736
                                                                                                                       // 737
    var enclosing = DDP._CurrentInvocation.get();                                                                      // 738
    var alreadyInSimulation = enclosing && enclosing.isSimulation;                                                     // 739
                                                                                                                       // 740
    // Lazily generate a randomSeed, only if it is requested by the stub.                                              // 741
    // The random streams only have utility if they're used on both the client                                         // 742
    // and the server; if the client doesn't generate any 'random' values                                              // 743
    // then we don't expect the server to generate any either.                                                         // 744
    // Less commonly, the server may perform different actions from the client,                                        // 745
    // and may in fact generate values where the client did not, but we don't                                          // 746
    // have any client-side values to match, so even here we may as well just                                          // 747
    // use a random seed on the server.  In that case, we don't pass the                                               // 748
    // randomSeed to save bandwidth, and we don't even generate it to save a                                           // 749
    // bit of CPU and to avoid consuming entropy.                                                                      // 750
    var randomSeed = null;                                                                                             // 751
    var randomSeedGenerator = function () {                                                                            // 752
      if (randomSeed === null) {                                                                                       // 753
        randomSeed = makeRpcSeed(enclosing, name);                                                                     // 754
      }                                                                                                                // 755
      return randomSeed;                                                                                               // 756
    };                                                                                                                 // 757
                                                                                                                       // 758
    // Run the stub, if we have one. The stub is supposed to make some                                                 // 759
    // temporary writes to the database to give the user a smooth experience                                           // 760
    // until the actual result of executing the method comes back from the                                             // 761
    // server (whereupon the temporary writes to the database will be reversed                                         // 762
    // during the beginUpdate/endUpdate process.)                                                                      // 763
    //                                                                                                                 // 764
    // Normally, we ignore the return value of the stub (even if it is an                                              // 765
    // exception), in favor of the real return value from the server. The                                              // 766
    // exception is if the *caller* is a stub. In that case, we're not going                                           // 767
    // to do a RPC, so we use the return value of the stub as our return                                               // 768
    // value.                                                                                                          // 769
                                                                                                                       // 770
    var stub = self._methodHandlers[name];                                                                             // 771
    if (stub) {                                                                                                        // 772
      var setUserId = function(userId) {                                                                               // 773
        self.setUserId(userId);                                                                                        // 774
      };                                                                                                               // 775
                                                                                                                       // 776
      var invocation = new MethodInvocation({                                                                          // 777
        isSimulation: true,                                                                                            // 778
        userId: self.userId(),                                                                                         // 779
        setUserId: setUserId,                                                                                          // 780
        randomSeed: function () { return randomSeedGenerator(); }                                                      // 781
      });                                                                                                              // 782
                                                                                                                       // 783
      if (!alreadyInSimulation)                                                                                        // 784
        self._saveOriginals();                                                                                         // 785
                                                                                                                       // 786
      try {                                                                                                            // 787
        // Note that unlike in the corresponding server code, we never audit                                           // 788
        // that stubs check() their arguments.                                                                         // 789
        var stubReturnValue = DDP._CurrentInvocation.withValue(invocation, function () {                               // 790
          if (Meteor.isServer) {                                                                                       // 791
            // Because saveOriginals and retrieveOriginals aren't reentrant,                                           // 792
            // don't allow stubs to yield.                                                                             // 793
            return Meteor._noYieldsAllowed(function () {                                                               // 794
              // re-clone, so that the stub can't affect our caller's values                                           // 795
              return stub.apply(invocation, EJSON.clone(args));                                                        // 796
            });                                                                                                        // 797
          } else {                                                                                                     // 798
            return stub.apply(invocation, EJSON.clone(args));                                                          // 799
          }                                                                                                            // 800
        });                                                                                                            // 801
      }                                                                                                                // 802
      catch (e) {                                                                                                      // 803
        var exception = e;                                                                                             // 804
      }                                                                                                                // 805
                                                                                                                       // 806
      if (!alreadyInSimulation)                                                                                        // 807
        self._retrieveAndStoreOriginals(methodId());                                                                   // 808
    }                                                                                                                  // 809
                                                                                                                       // 810
    // If we're in a simulation, stop and return the result we have,                                                   // 811
    // rather than going on to do an RPC. If there was no stub,                                                        // 812
    // we'll end up returning undefined.                                                                               // 813
    if (alreadyInSimulation) {                                                                                         // 814
      if (callback) {                                                                                                  // 815
        callback(exception, stubReturnValue);                                                                          // 816
        return undefined;                                                                                              // 817
      }                                                                                                                // 818
      if (exception)                                                                                                   // 819
        throw exception;                                                                                               // 820
      return stubReturnValue;                                                                                          // 821
    }                                                                                                                  // 822
                                                                                                                       // 823
    // If an exception occurred in a stub, and we're ignoring it                                                       // 824
    // because we're doing an RPC and want to use what the server                                                      // 825
    // returns instead, log it so the developer knows.                                                                 // 826
    //                                                                                                                 // 827
    // Tests can set the 'expected' flag on an exception so it won't                                                   // 828
    // go to log.                                                                                                      // 829
    if (exception && !exception.expected) {                                                                            // 830
      Meteor._debug("Exception while simulating the effect of invoking '" +                                            // 831
                    name + "'", exception, exception.stack);                                                           // 832
    }                                                                                                                  // 833
                                                                                                                       // 834
                                                                                                                       // 835
    // At this point we're definitely doing an RPC, and we're going to                                                 // 836
    // return the value of the RPC to the caller.                                                                      // 837
                                                                                                                       // 838
    // If the caller didn't give a callback, decide what to do.                                                        // 839
    if (!callback) {                                                                                                   // 840
      if (Meteor.isClient) {                                                                                           // 841
        // On the client, we don't have fibers, so we can't block. The                                                 // 842
        // only thing we can do is to return undefined and discard the                                                 // 843
        // result of the RPC. If an error occurred then print the error                                                // 844
        // to the console.                                                                                             // 845
        callback = function (err) {                                                                                    // 846
          err && Meteor._debug("Error invoking Method '" + name + "':",                                                // 847
                               err.message);                                                                           // 848
        };                                                                                                             // 849
      } else {                                                                                                         // 850
        // On the server, make the function synchronous. Throw on                                                      // 851
        // errors, return on success.                                                                                  // 852
        var future = new Future;                                                                                       // 853
        callback = future.resolver();                                                                                  // 854
      }                                                                                                                // 855
    }                                                                                                                  // 856
    // Send the RPC. Note that on the client, it is important that the                                                 // 857
    // stub have finished before we send the RPC, so that we know we have                                              // 858
    // a complete list of which local documents the stub wrote.                                                        // 859
    var message = {                                                                                                    // 860
      msg: 'method',                                                                                                   // 861
      method: name,                                                                                                    // 862
      params: args,                                                                                                    // 863
      id: methodId()                                                                                                   // 864
    };                                                                                                                 // 865
                                                                                                                       // 866
    // Send the randomSeed only if we used it                                                                          // 867
    if (randomSeed !== null) {                                                                                         // 868
      message.randomSeed = randomSeed;                                                                                 // 869
    }                                                                                                                  // 870
                                                                                                                       // 871
    var methodInvoker = new MethodInvoker({                                                                            // 872
      methodId: methodId(),                                                                                            // 873
      callback: callback,                                                                                              // 874
      connection: self,                                                                                                // 875
      onResultReceived: options.onResultReceived,                                                                      // 876
      wait: !!options.wait,                                                                                            // 877
      message: message                                                                                                 // 878
    });                                                                                                                // 879
                                                                                                                       // 880
    if (options.wait) {                                                                                                // 881
      // It's a wait method! Wait methods go in their own block.                                                       // 882
      self._outstandingMethodBlocks.push(                                                                              // 883
        {wait: true, methods: [methodInvoker]});                                                                       // 884
    } else {                                                                                                           // 885
      // Not a wait method. Start a new block if the previous block was a wait                                         // 886
      // block, and add it to the last block of methods.                                                               // 887
      if (_.isEmpty(self._outstandingMethodBlocks) ||                                                                  // 888
          _.last(self._outstandingMethodBlocks).wait)                                                                  // 889
        self._outstandingMethodBlocks.push({wait: false, methods: []});                                                // 890
      _.last(self._outstandingMethodBlocks).methods.push(methodInvoker);                                               // 891
    }                                                                                                                  // 892
                                                                                                                       // 893
    // If we added it to the first block, send it out now.                                                             // 894
    if (self._outstandingMethodBlocks.length === 1)                                                                    // 895
      methodInvoker.sendMessage();                                                                                     // 896
                                                                                                                       // 897
    // If we're using the default callback on the server,                                                              // 898
    // block waiting for the result.                                                                                   // 899
    if (future) {                                                                                                      // 900
      return future.wait();                                                                                            // 901
    }                                                                                                                  // 902
    return options.returnStubValue ? stubReturnValue : undefined;                                                      // 903
  },                                                                                                                   // 904
                                                                                                                       // 905
  // Before calling a method stub, prepare all stores to track changes and allow                                       // 906
  // _retrieveAndStoreOriginals to get the original versions of changed                                                // 907
  // documents.                                                                                                        // 908
  _saveOriginals: function () {                                                                                        // 909
    var self = this;                                                                                                   // 910
    _.each(self._stores, function (s) {                                                                                // 911
      s.saveOriginals();                                                                                               // 912
    });                                                                                                                // 913
  },                                                                                                                   // 914
  // Retrieves the original versions of all documents modified by the stub for                                         // 915
  // method 'methodId' from all stores and saves them to _serverDocuments (keyed                                       // 916
  // by document) and _documentsWrittenByStub (keyed by method ID).                                                    // 917
  _retrieveAndStoreOriginals: function (methodId) {                                                                    // 918
    var self = this;                                                                                                   // 919
    if (self._documentsWrittenByStub[methodId])                                                                        // 920
      throw new Error("Duplicate methodId in _retrieveAndStoreOriginals");                                             // 921
                                                                                                                       // 922
    var docsWritten = [];                                                                                              // 923
    _.each(self._stores, function (s, collection) {                                                                    // 924
      var originals = s.retrieveOriginals();                                                                           // 925
      // not all stores define retrieveOriginals                                                                       // 926
      if (!originals)                                                                                                  // 927
        return;                                                                                                        // 928
      originals.forEach(function (doc, id) {                                                                           // 929
        docsWritten.push({collection: collection, id: id});                                                            // 930
        if (!_.has(self._serverDocuments, collection))                                                                 // 931
          self._serverDocuments[collection] = new LocalCollection._IdMap;                                              // 932
        var serverDoc = self._serverDocuments[collection].setDefault(id, {});                                          // 933
        if (serverDoc.writtenByStubs) {                                                                                // 934
          // We're not the first stub to write this doc. Just add our method ID                                        // 935
          // to the record.                                                                                            // 936
          serverDoc.writtenByStubs[methodId] = true;                                                                   // 937
        } else {                                                                                                       // 938
          // First stub! Save the original value and our method ID.                                                    // 939
          serverDoc.document = doc;                                                                                    // 940
          serverDoc.flushCallbacks = [];                                                                               // 941
          serverDoc.writtenByStubs = {};                                                                               // 942
          serverDoc.writtenByStubs[methodId] = true;                                                                   // 943
        }                                                                                                              // 944
      });                                                                                                              // 945
    });                                                                                                                // 946
    if (!_.isEmpty(docsWritten)) {                                                                                     // 947
      self._documentsWrittenByStub[methodId] = docsWritten;                                                            // 948
    }                                                                                                                  // 949
  },                                                                                                                   // 950
                                                                                                                       // 951
  // This is very much a private function we use to make the tests                                                     // 952
  // take up fewer server resources after they complete.                                                               // 953
  _unsubscribeAll: function () {                                                                                       // 954
    var self = this;                                                                                                   // 955
    _.each(_.clone(self._subscriptions), function (sub, id) {                                                          // 956
      // Avoid killing the autoupdate subscription so that developers                                                  // 957
      // still get hot code pushes when writing tests.                                                                 // 958
      //                                                                                                               // 959
      // XXX it's a hack to encode knowledge about autoupdate here,                                                    // 960
      // but it doesn't seem worth it yet to have a special API for                                                    // 961
      // subscriptions to preserve after unit tests.                                                                   // 962
      if (sub.name !== 'meteor_autoupdate_clientVersions') {                                                           // 963
        self._subscriptions[id].stop();                                                                                // 964
      }                                                                                                                // 965
    });                                                                                                                // 966
  },                                                                                                                   // 967
                                                                                                                       // 968
  // Sends the DDP stringification of the given message object                                                         // 969
  _send: function (obj) {                                                                                              // 970
    var self = this;                                                                                                   // 971
    self._stream.send(stringifyDDP(obj));                                                                              // 972
  },                                                                                                                   // 973
                                                                                                                       // 974
  // We detected via DDP-level heartbeats that we've lost the                                                          // 975
  // connection.  Unlike `disconnect` or `close`, a lost connection                                                    // 976
  // will be automatically retried.                                                                                    // 977
  _lostConnection: function (error) {                                                                                  // 978
    var self = this;                                                                                                   // 979
    self._stream._lostConnection(error);                                                                               // 980
  },                                                                                                                   // 981
                                                                                                                       // 982
  /**                                                                                                                  // 983
   * @summary Get the current connection status. A reactive data source.                                               // 984
   * @locus Client                                                                                                     // 985
   * @memberOf Meteor                                                                                                  // 986
   */                                                                                                                  // 987
  status: function (/*passthrough args*/) {                                                                            // 988
    var self = this;                                                                                                   // 989
    return self._stream.status.apply(self._stream, arguments);                                                         // 990
  },                                                                                                                   // 991
                                                                                                                       // 992
  /**                                                                                                                  // 993
   * @summary Force an immediate reconnection attempt if the client is not connected to the server.                    // 994
                                                                                                                       // 995
  This method does nothing if the client is already connected.                                                         // 996
   * @locus Client                                                                                                     // 997
   * @memberOf Meteor                                                                                                  // 998
   */                                                                                                                  // 999
  reconnect: function (/*passthrough args*/) {                                                                         // 1000
    var self = this;                                                                                                   // 1001
    return self._stream.reconnect.apply(self._stream, arguments);                                                      // 1002
  },                                                                                                                   // 1003
                                                                                                                       // 1004
  /**                                                                                                                  // 1005
   * @summary Disconnect the client from the server.                                                                   // 1006
   * @locus Client                                                                                                     // 1007
   * @memberOf Meteor                                                                                                  // 1008
   */                                                                                                                  // 1009
  disconnect: function (/*passthrough args*/) {                                                                        // 1010
    var self = this;                                                                                                   // 1011
    return self._stream.disconnect.apply(self._stream, arguments);                                                     // 1012
  },                                                                                                                   // 1013
                                                                                                                       // 1014
  close: function () {                                                                                                 // 1015
    var self = this;                                                                                                   // 1016
    return self._stream.disconnect({_permanent: true});                                                                // 1017
  },                                                                                                                   // 1018
                                                                                                                       // 1019
  ///                                                                                                                  // 1020
  /// Reactive user system                                                                                             // 1021
  ///                                                                                                                  // 1022
  userId: function () {                                                                                                // 1023
    var self = this;                                                                                                   // 1024
    if (self._userIdDeps)                                                                                              // 1025
      self._userIdDeps.depend();                                                                                       // 1026
    return self._userId;                                                                                               // 1027
  },                                                                                                                   // 1028
                                                                                                                       // 1029
  setUserId: function (userId) {                                                                                       // 1030
    var self = this;                                                                                                   // 1031
    // Avoid invalidating dependents if setUserId is called with current value.                                        // 1032
    if (self._userId === userId)                                                                                       // 1033
      return;                                                                                                          // 1034
    self._userId = userId;                                                                                             // 1035
    if (self._userIdDeps)                                                                                              // 1036
      self._userIdDeps.changed();                                                                                      // 1037
  },                                                                                                                   // 1038
                                                                                                                       // 1039
  // Returns true if we are in a state after reconnect of waiting for subs to be                                       // 1040
  // revived or early methods to finish their data, or we are waiting for a                                            // 1041
  // "wait" method to finish.                                                                                          // 1042
  _waitingForQuiescence: function () {                                                                                 // 1043
    var self = this;                                                                                                   // 1044
    return (! _.isEmpty(self._subsBeingRevived) ||                                                                     // 1045
            ! _.isEmpty(self._methodsBlockingQuiescence));                                                             // 1046
  },                                                                                                                   // 1047
                                                                                                                       // 1048
  // Returns true if any method whose message has been sent to the server has                                          // 1049
  // not yet invoked its user callback.                                                                                // 1050
  _anyMethodsAreOutstanding: function () {                                                                             // 1051
    var self = this;                                                                                                   // 1052
    return _.any(_.pluck(self._methodInvokers, 'sentMessage'));                                                        // 1053
  },                                                                                                                   // 1054
                                                                                                                       // 1055
  _livedata_connected: function (msg) {                                                                                // 1056
    var self = this;                                                                                                   // 1057
                                                                                                                       // 1058
    if (self._version !== 'pre1' && self._heartbeatInterval !== 0) {                                                   // 1059
      self._heartbeat = new Heartbeat({                                                                                // 1060
        heartbeatInterval: self._heartbeatInterval,                                                                    // 1061
        heartbeatTimeout: self._heartbeatTimeout,                                                                      // 1062
        onTimeout: function () {                                                                                       // 1063
          self._lostConnection(                                                                                        // 1064
            new DDP.ConnectionError("DDP heartbeat timed out"));                                                       // 1065
        },                                                                                                             // 1066
        sendPing: function () {                                                                                        // 1067
          self._send({msg: 'ping'});                                                                                   // 1068
        }                                                                                                              // 1069
      });                                                                                                              // 1070
      self._heartbeat.start();                                                                                         // 1071
    }                                                                                                                  // 1072
                                                                                                                       // 1073
    // If this is a reconnect, we'll have to reset all stores.                                                         // 1074
    if (self._lastSessionId)                                                                                           // 1075
      self._resetStores = true;                                                                                        // 1076
                                                                                                                       // 1077
    if (typeof (msg.session) === "string") {                                                                           // 1078
      var reconnectedToPreviousSession = (self._lastSessionId === msg.session);                                        // 1079
      self._lastSessionId = msg.session;                                                                               // 1080
    }                                                                                                                  // 1081
                                                                                                                       // 1082
    if (reconnectedToPreviousSession) {                                                                                // 1083
      // Successful reconnection -- pick up where we left off.  Note that right                                        // 1084
      // now, this never happens: the server never connects us to a previous                                           // 1085
      // session, because DDP doesn't provide enough data for the server to know                                       // 1086
      // what messages the client has processed. We need to improve DDP to make                                        // 1087
      // this possible, at which point we'll probably need more code here.                                             // 1088
      return;                                                                                                          // 1089
    }                                                                                                                  // 1090
                                                                                                                       // 1091
    // Server doesn't have our data any more. Re-sync a new session.                                                   // 1092
                                                                                                                       // 1093
    // Forget about messages we were buffering for unknown collections. They'll                                        // 1094
    // be resent if still relevant.                                                                                    // 1095
    self._updatesForUnknownStores = {};                                                                                // 1096
                                                                                                                       // 1097
    if (self._resetStores) {                                                                                           // 1098
      // Forget about the effects of stubs. We'll be resetting all collections                                         // 1099
      // anyway.                                                                                                       // 1100
      self._documentsWrittenByStub = {};                                                                               // 1101
      self._serverDocuments = {};                                                                                      // 1102
    }                                                                                                                  // 1103
                                                                                                                       // 1104
    // Clear _afterUpdateCallbacks.                                                                                    // 1105
    self._afterUpdateCallbacks = [];                                                                                   // 1106
                                                                                                                       // 1107
    // Mark all named subscriptions which are ready (ie, we already called the                                         // 1108
    // ready callback) as needing to be revived.                                                                       // 1109
    // XXX We should also block reconnect quiescence until unnamed subscriptions                                       // 1110
    //     (eg, autopublish) are done re-publishing to avoid flicker!                                                  // 1111
    self._subsBeingRevived = {};                                                                                       // 1112
    _.each(self._subscriptions, function (sub, id) {                                                                   // 1113
      if (sub.ready)                                                                                                   // 1114
        self._subsBeingRevived[id] = true;                                                                             // 1115
    });                                                                                                                // 1116
                                                                                                                       // 1117
    // Arrange for "half-finished" methods to have their callbacks run, and                                            // 1118
    // track methods that were sent on this connection so that we don't                                                // 1119
    // quiesce until they are all done.                                                                                // 1120
    //                                                                                                                 // 1121
    // Start by clearing _methodsBlockingQuiescence: methods sent before                                               // 1122
    // reconnect don't matter, and any "wait" methods sent on the new connection                                       // 1123
    // that we drop here will be restored by the loop below.                                                           // 1124
    self._methodsBlockingQuiescence = {};                                                                              // 1125
    if (self._resetStores) {                                                                                           // 1126
      _.each(self._methodInvokers, function (invoker) {                                                                // 1127
        if (invoker.gotResult()) {                                                                                     // 1128
          // This method already got its result, but it didn't call its callback                                       // 1129
          // because its data didn't become visible. We did not resend the                                             // 1130
          // method RPC. We'll call its callback when we get a full quiesce,                                           // 1131
          // since that's as close as we'll get to "data must be visible".                                             // 1132
          self._afterUpdateCallbacks.push(_.bind(invoker.dataVisible, invoker));                                       // 1133
        } else if (invoker.sentMessage) {                                                                              // 1134
          // This method has been sent on this connection (maybe as a resend                                           // 1135
          // from the last connection, maybe from onReconnect, maybe just very                                         // 1136
          // quickly before processing the connected message).                                                         // 1137
          //                                                                                                           // 1138
          // We don't need to do anything special to ensure its callbacks get                                          // 1139
          // called, but we'll count it as a method which is preventing                                                // 1140
          // reconnect quiescence. (eg, it might be a login method that was run                                        // 1141
          // from onReconnect, and we don't want to see flicker by seeing a                                            // 1142
          // logged-out state.)                                                                                        // 1143
          self._methodsBlockingQuiescence[invoker.methodId] = true;                                                    // 1144
        }                                                                                                              // 1145
      });                                                                                                              // 1146
    }                                                                                                                  // 1147
                                                                                                                       // 1148
    self._messagesBufferedUntilQuiescence = [];                                                                        // 1149
                                                                                                                       // 1150
    // If we're not waiting on any methods or subs, we can reset the stores and                                        // 1151
    // call the callbacks immediately.                                                                                 // 1152
    if (!self._waitingForQuiescence()) {                                                                               // 1153
      if (self._resetStores) {                                                                                         // 1154
        _.each(self._stores, function (s) {                                                                            // 1155
          s.beginUpdate(0, true);                                                                                      // 1156
          s.endUpdate();                                                                                               // 1157
        });                                                                                                            // 1158
        self._resetStores = false;                                                                                     // 1159
      }                                                                                                                // 1160
      self._runAfterUpdateCallbacks();                                                                                 // 1161
    }                                                                                                                  // 1162
  },                                                                                                                   // 1163
                                                                                                                       // 1164
                                                                                                                       // 1165
  _processOneDataMessage: function (msg, updates) {                                                                    // 1166
    var self = this;                                                                                                   // 1167
    // Using underscore here so as not to need to capitalize.                                                          // 1168
    self['_process_' + msg.msg](msg, updates);                                                                         // 1169
  },                                                                                                                   // 1170
                                                                                                                       // 1171
                                                                                                                       // 1172
  _livedata_data: function (msg) {                                                                                     // 1173
    var self = this;                                                                                                   // 1174
                                                                                                                       // 1175
    // collection name -> array of messages                                                                            // 1176
    var updates = {};                                                                                                  // 1177
                                                                                                                       // 1178
    if (self._waitingForQuiescence()) {                                                                                // 1179
      self._messagesBufferedUntilQuiescence.push(msg);                                                                 // 1180
                                                                                                                       // 1181
      if (msg.msg === "nosub")                                                                                         // 1182
        delete self._subsBeingRevived[msg.id];                                                                         // 1183
                                                                                                                       // 1184
      _.each(msg.subs || [], function (subId) {                                                                        // 1185
        delete self._subsBeingRevived[subId];                                                                          // 1186
      });                                                                                                              // 1187
      _.each(msg.methods || [], function (methodId) {                                                                  // 1188
        delete self._methodsBlockingQuiescence[methodId];                                                              // 1189
      });                                                                                                              // 1190
                                                                                                                       // 1191
      if (self._waitingForQuiescence())                                                                                // 1192
        return;                                                                                                        // 1193
                                                                                                                       // 1194
      // No methods or subs are blocking quiescence!                                                                   // 1195
      // We'll now process and all of our buffered messages, reset all stores,                                         // 1196
      // and apply them all at once.                                                                                   // 1197
      _.each(self._messagesBufferedUntilQuiescence, function (bufferedMsg) {                                           // 1198
        self._processOneDataMessage(bufferedMsg, updates);                                                             // 1199
      });                                                                                                              // 1200
      self._messagesBufferedUntilQuiescence = [];                                                                      // 1201
    } else {                                                                                                           // 1202
      self._processOneDataMessage(msg, updates);                                                                       // 1203
    }                                                                                                                  // 1204
                                                                                                                       // 1205
    if (self._resetStores || !_.isEmpty(updates)) {                                                                    // 1206
      // Begin a transactional update of each store.                                                                   // 1207
      _.each(self._stores, function (s, storeName) {                                                                   // 1208
        s.beginUpdate(_.has(updates, storeName) ? updates[storeName].length : 0,                                       // 1209
                      self._resetStores);                                                                              // 1210
      });                                                                                                              // 1211
      self._resetStores = false;                                                                                       // 1212
                                                                                                                       // 1213
      _.each(updates, function (updateMessages, storeName) {                                                           // 1214
        var store = self._stores[storeName];                                                                           // 1215
        if (store) {                                                                                                   // 1216
          _.each(updateMessages, function (updateMessage) {                                                            // 1217
            store.update(updateMessage);                                                                               // 1218
          });                                                                                                          // 1219
        } else {                                                                                                       // 1220
          // Nobody's listening for this data. Queue it up until                                                       // 1221
          // someone wants it.                                                                                         // 1222
          // XXX memory use will grow without bound if you forget to                                                   // 1223
          // create a collection or just don't care about it... going                                                  // 1224
          // to have to do something about that.                                                                       // 1225
          if (!_.has(self._updatesForUnknownStores, storeName))                                                        // 1226
            self._updatesForUnknownStores[storeName] = [];                                                             // 1227
          Array.prototype.push.apply(self._updatesForUnknownStores[storeName],                                         // 1228
                                     updateMessages);                                                                  // 1229
        }                                                                                                              // 1230
      });                                                                                                              // 1231
                                                                                                                       // 1232
      // End update transaction.                                                                                       // 1233
      _.each(self._stores, function (s) { s.endUpdate(); });                                                           // 1234
    }                                                                                                                  // 1235
                                                                                                                       // 1236
    self._runAfterUpdateCallbacks();                                                                                   // 1237
  },                                                                                                                   // 1238
                                                                                                                       // 1239
  // Call any callbacks deferred with _runWhenAllServerDocsAreFlushed whose                                            // 1240
  // relevant docs have been flushed, as well as dataVisible callbacks at                                              // 1241
  // reconnect-quiescence time.                                                                                        // 1242
  _runAfterUpdateCallbacks: function () {                                                                              // 1243
    var self = this;                                                                                                   // 1244
    var callbacks = self._afterUpdateCallbacks;                                                                        // 1245
    self._afterUpdateCallbacks = [];                                                                                   // 1246
    _.each(callbacks, function (c) {                                                                                   // 1247
      c();                                                                                                             // 1248
    });                                                                                                                // 1249
  },                                                                                                                   // 1250
                                                                                                                       // 1251
  _pushUpdate: function (updates, collection, msg) {                                                                   // 1252
    var self = this;                                                                                                   // 1253
    if (!_.has(updates, collection)) {                                                                                 // 1254
      updates[collection] = [];                                                                                        // 1255
    }                                                                                                                  // 1256
    updates[collection].push(msg);                                                                                     // 1257
  },                                                                                                                   // 1258
                                                                                                                       // 1259
  _getServerDoc: function (collection, id) {                                                                           // 1260
    var self = this;                                                                                                   // 1261
    if (!_.has(self._serverDocuments, collection))                                                                     // 1262
      return null;                                                                                                     // 1263
    var serverDocsForCollection = self._serverDocuments[collection];                                                   // 1264
    return serverDocsForCollection.get(id) || null;                                                                    // 1265
  },                                                                                                                   // 1266
                                                                                                                       // 1267
  _process_added: function (msg, updates) {                                                                            // 1268
    var self = this;                                                                                                   // 1269
    var id = LocalCollection._idParse(msg.id);                                                                         // 1270
    var serverDoc = self._getServerDoc(msg.collection, id);                                                            // 1271
    if (serverDoc) {                                                                                                   // 1272
      // Some outstanding stub wrote here.                                                                             // 1273
      if (serverDoc.document !== undefined)                                                                            // 1274
        throw new Error("Server sent add for existing id: " + msg.id);                                                 // 1275
      serverDoc.document = msg.fields || {};                                                                           // 1276
      serverDoc.document._id = id;                                                                                     // 1277
    } else {                                                                                                           // 1278
      self._pushUpdate(updates, msg.collection, msg);                                                                  // 1279
    }                                                                                                                  // 1280
  },                                                                                                                   // 1281
                                                                                                                       // 1282
  _process_changed: function (msg, updates) {                                                                          // 1283
    var self = this;                                                                                                   // 1284
    var serverDoc = self._getServerDoc(                                                                                // 1285
      msg.collection, LocalCollection._idParse(msg.id));                                                               // 1286
    if (serverDoc) {                                                                                                   // 1287
      if (serverDoc.document === undefined)                                                                            // 1288
        throw new Error("Server sent changed for nonexisting id: " + msg.id);                                          // 1289
      LocalCollection._applyChanges(serverDoc.document, msg.fields);                                                   // 1290
    } else {                                                                                                           // 1291
      self._pushUpdate(updates, msg.collection, msg);                                                                  // 1292
    }                                                                                                                  // 1293
  },                                                                                                                   // 1294
                                                                                                                       // 1295
  _process_removed: function (msg, updates) {                                                                          // 1296
    var self = this;                                                                                                   // 1297
    var serverDoc = self._getServerDoc(                                                                                // 1298
      msg.collection, LocalCollection._idParse(msg.id));                                                               // 1299
    if (serverDoc) {                                                                                                   // 1300
      // Some outstanding stub wrote here.                                                                             // 1301
      if (serverDoc.document === undefined)                                                                            // 1302
        throw new Error("Server sent removed for nonexisting id:" + msg.id);                                           // 1303
      serverDoc.document = undefined;                                                                                  // 1304
    } else {                                                                                                           // 1305
      self._pushUpdate(updates, msg.collection, {                                                                      // 1306
        msg: 'removed',                                                                                                // 1307
        collection: msg.collection,                                                                                    // 1308
        id: msg.id                                                                                                     // 1309
      });                                                                                                              // 1310
    }                                                                                                                  // 1311
  },                                                                                                                   // 1312
                                                                                                                       // 1313
  _process_updated: function (msg, updates) {                                                                          // 1314
    var self = this;                                                                                                   // 1315
    // Process "method done" messages.                                                                                 // 1316
    _.each(msg.methods, function (methodId) {                                                                          // 1317
      _.each(self._documentsWrittenByStub[methodId], function (written) {                                              // 1318
        var serverDoc = self._getServerDoc(written.collection, written.id);                                            // 1319
        if (!serverDoc)                                                                                                // 1320
          throw new Error("Lost serverDoc for " + JSON.stringify(written));                                            // 1321
        if (!serverDoc.writtenByStubs[methodId])                                                                       // 1322
          throw new Error("Doc " + JSON.stringify(written) +                                                           // 1323
                          " not written by  method " + methodId);                                                      // 1324
        delete serverDoc.writtenByStubs[methodId];                                                                     // 1325
        if (_.isEmpty(serverDoc.writtenByStubs)) {                                                                     // 1326
          // All methods whose stubs wrote this method have completed! We can                                          // 1327
          // now copy the saved document to the database (reverting the stub's                                         // 1328
          // change if the server did not write to this object, or applying the                                        // 1329
          // server's writes if it did).                                                                               // 1330
                                                                                                                       // 1331
          // This is a fake ddp 'replace' message.  It's just for talking                                              // 1332
          // between livedata connections and minimongo.  (We have to stringify                                        // 1333
          // the ID because it's supposed to look like a wire message.)                                                // 1334
          self._pushUpdate(updates, written.collection, {                                                              // 1335
            msg: 'replace',                                                                                            // 1336
            id: LocalCollection._idStringify(written.id),                                                              // 1337
            replace: serverDoc.document                                                                                // 1338
          });                                                                                                          // 1339
          // Call all flush callbacks.                                                                                 // 1340
          _.each(serverDoc.flushCallbacks, function (c) {                                                              // 1341
            c();                                                                                                       // 1342
          });                                                                                                          // 1343
                                                                                                                       // 1344
          // Delete this completed serverDocument. Don't bother to GC empty                                            // 1345
          // IdMaps inside self._serverDocuments, since there probably aren't                                          // 1346
          // many collections and they'll be written repeatedly.                                                       // 1347
          self._serverDocuments[written.collection].remove(written.id);                                                // 1348
        }                                                                                                              // 1349
      });                                                                                                              // 1350
      delete self._documentsWrittenByStub[methodId];                                                                   // 1351
                                                                                                                       // 1352
      // We want to call the data-written callback, but we can't do so until all                                       // 1353
      // currently buffered messages are flushed.                                                                      // 1354
      var callbackInvoker = self._methodInvokers[methodId];                                                            // 1355
      if (!callbackInvoker)                                                                                            // 1356
        throw new Error("No callback invoker for method " + methodId);                                                 // 1357
      self._runWhenAllServerDocsAreFlushed(                                                                            // 1358
        _.bind(callbackInvoker.dataVisible, callbackInvoker));                                                         // 1359
    });                                                                                                                // 1360
  },                                                                                                                   // 1361
                                                                                                                       // 1362
  _process_ready: function (msg, updates) {                                                                            // 1363
    var self = this;                                                                                                   // 1364
    // Process "sub ready" messages. "sub ready" messages don't take effect                                            // 1365
    // until all current server documents have been flushed to the local                                               // 1366
    // database. We can use a write fence to implement this.                                                           // 1367
    _.each(msg.subs, function (subId) {                                                                                // 1368
      self._runWhenAllServerDocsAreFlushed(function () {                                                               // 1369
        var subRecord = self._subscriptions[subId];                                                                    // 1370
        // Did we already unsubscribe?                                                                                 // 1371
        if (!subRecord)                                                                                                // 1372
          return;                                                                                                      // 1373
        // Did we already receive a ready message? (Oops!)                                                             // 1374
        if (subRecord.ready)                                                                                           // 1375
          return;                                                                                                      // 1376
        subRecord.readyCallback && subRecord.readyCallback();                                                          // 1377
        subRecord.ready = true;                                                                                        // 1378
        subRecord.readyDeps.changed();                                                                                 // 1379
      });                                                                                                              // 1380
    });                                                                                                                // 1381
  },                                                                                                                   // 1382
                                                                                                                       // 1383
  // Ensures that "f" will be called after all documents currently in                                                  // 1384
  // _serverDocuments have been written to the local cache. f will not be called                                       // 1385
  // if the connection is lost before then!                                                                            // 1386
  _runWhenAllServerDocsAreFlushed: function (f) {                                                                      // 1387
    var self = this;                                                                                                   // 1388
    var runFAfterUpdates = function () {                                                                               // 1389
      self._afterUpdateCallbacks.push(f);                                                                              // 1390
    };                                                                                                                 // 1391
    var unflushedServerDocCount = 0;                                                                                   // 1392
    var onServerDocFlush = function () {                                                                               // 1393
      --unflushedServerDocCount;                                                                                       // 1394
      if (unflushedServerDocCount === 0) {                                                                             // 1395
        // This was the last doc to flush! Arrange to run f after the updates                                          // 1396
        // have been applied.                                                                                          // 1397
        runFAfterUpdates();                                                                                            // 1398
      }                                                                                                                // 1399
    };                                                                                                                 // 1400
    _.each(self._serverDocuments, function (collectionDocs) {                                                          // 1401
      collectionDocs.forEach(function (serverDoc) {                                                                    // 1402
        var writtenByStubForAMethodWithSentMessage = _.any(                                                            // 1403
          serverDoc.writtenByStubs, function (dummy, methodId) {                                                       // 1404
            var invoker = self._methodInvokers[methodId];                                                              // 1405
            return invoker && invoker.sentMessage;                                                                     // 1406
          });                                                                                                          // 1407
        if (writtenByStubForAMethodWithSentMessage) {                                                                  // 1408
          ++unflushedServerDocCount;                                                                                   // 1409
          serverDoc.flushCallbacks.push(onServerDocFlush);                                                             // 1410
        }                                                                                                              // 1411
      });                                                                                                              // 1412
    });                                                                                                                // 1413
    if (unflushedServerDocCount === 0) {                                                                               // 1414
      // There aren't any buffered docs --- we can call f as soon as the current                                       // 1415
      // round of updates is applied!                                                                                  // 1416
      runFAfterUpdates();                                                                                              // 1417
    }                                                                                                                  // 1418
  },                                                                                                                   // 1419
                                                                                                                       // 1420
  _livedata_nosub: function (msg) {                                                                                    // 1421
    var self = this;                                                                                                   // 1422
                                                                                                                       // 1423
    // First pass it through _livedata_data, which only uses it to help get                                            // 1424
    // towards quiescence.                                                                                             // 1425
    self._livedata_data(msg);                                                                                          // 1426
                                                                                                                       // 1427
    // Do the rest of our processing immediately, with no                                                              // 1428
    // buffering-until-quiescence.                                                                                     // 1429
                                                                                                                       // 1430
    // we weren't subbed anyway, or we initiated the unsub.                                                            // 1431
    if (!_.has(self._subscriptions, msg.id))                                                                           // 1432
      return;                                                                                                          // 1433
                                                                                                                       // 1434
    // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                          // 1435
    var errorCallback = self._subscriptions[msg.id].errorCallback;                                                     // 1436
    var stopCallback = self._subscriptions[msg.id].stopCallback;                                                       // 1437
                                                                                                                       // 1438
    self._subscriptions[msg.id].remove();                                                                              // 1439
                                                                                                                       // 1440
    var meteorErrorFromMsg = function (msgArg) {                                                                       // 1441
      return msgArg && msgArg.error && new Meteor.Error(                                                               // 1442
        msgArg.error.error, msgArg.error.reason, msgArg.error.details);                                                // 1443
    }                                                                                                                  // 1444
                                                                                                                       // 1445
    // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                          // 1446
    if (errorCallback && msg.error) {                                                                                  // 1447
      errorCallback(meteorErrorFromMsg(msg));                                                                          // 1448
    }                                                                                                                  // 1449
                                                                                                                       // 1450
    if (stopCallback) {                                                                                                // 1451
      stopCallback(meteorErrorFromMsg(msg));                                                                           // 1452
    }                                                                                                                  // 1453
  },                                                                                                                   // 1454
                                                                                                                       // 1455
  _process_nosub: function () {                                                                                        // 1456
    // This is called as part of the "buffer until quiescence" process, but                                            // 1457
    // nosub's effect is always immediate. It only goes in the buffer at all                                           // 1458
    // because it's possible for a nosub to be the thing that triggers                                                 // 1459
    // quiescence, if we were waiting for a sub to be revived and it dies                                              // 1460
    // instead.                                                                                                        // 1461
  },                                                                                                                   // 1462
                                                                                                                       // 1463
  _livedata_result: function (msg) {                                                                                   // 1464
    // id, result or error. error has error (code), reason, details                                                    // 1465
                                                                                                                       // 1466
    var self = this;                                                                                                   // 1467
                                                                                                                       // 1468
    // find the outstanding request                                                                                    // 1469
    // should be O(1) in nearly all realistic use cases                                                                // 1470
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                                    // 1471
      Meteor._debug("Received method result but no methods outstanding");                                              // 1472
      return;                                                                                                          // 1473
    }                                                                                                                  // 1474
    var currentMethodBlock = self._outstandingMethodBlocks[0].methods;                                                 // 1475
    var m;                                                                                                             // 1476
    for (var i = 0; i < currentMethodBlock.length; i++) {                                                              // 1477
      m = currentMethodBlock[i];                                                                                       // 1478
      if (m.methodId === msg.id)                                                                                       // 1479
        break;                                                                                                         // 1480
    }                                                                                                                  // 1481
                                                                                                                       // 1482
    if (!m) {                                                                                                          // 1483
      Meteor._debug("Can't match method response to original method call", msg);                                       // 1484
      return;                                                                                                          // 1485
    }                                                                                                                  // 1486
                                                                                                                       // 1487
    // Remove from current method block. This may leave the block empty, but we                                        // 1488
    // don't move on to the next block until the callback has been delivered, in                                       // 1489
    // _outstandingMethodFinished.                                                                                     // 1490
    currentMethodBlock.splice(i, 1);                                                                                   // 1491
                                                                                                                       // 1492
    if (_.has(msg, 'error')) {                                                                                         // 1493
      m.receiveResult(new Meteor.Error(                                                                                // 1494
        msg.error.error, msg.error.reason,                                                                             // 1495
        msg.error.details));                                                                                           // 1496
    } else {                                                                                                           // 1497
      // msg.result may be undefined if the method didn't return a                                                     // 1498
      // value                                                                                                         // 1499
      m.receiveResult(undefined, msg.result);                                                                          // 1500
    }                                                                                                                  // 1501
  },                                                                                                                   // 1502
                                                                                                                       // 1503
  // Called by MethodInvoker after a method's callback is invoked.  If this was                                        // 1504
  // the last outstanding method in the current block, runs the next block. If                                         // 1505
  // there are no more methods, consider accepting a hot code push.                                                    // 1506
  _outstandingMethodFinished: function () {                                                                            // 1507
    var self = this;                                                                                                   // 1508
    if (self._anyMethodsAreOutstanding())                                                                              // 1509
      return;                                                                                                          // 1510
                                                                                                                       // 1511
    // No methods are outstanding. This should mean that the first block of                                            // 1512
    // methods is empty. (Or it might not exist, if this was a method that                                             // 1513
    // half-finished before disconnect/reconnect.)                                                                     // 1514
    if (! _.isEmpty(self._outstandingMethodBlocks)) {                                                                  // 1515
      var firstBlock = self._outstandingMethodBlocks.shift();                                                          // 1516
      if (! _.isEmpty(firstBlock.methods))                                                                             // 1517
        throw new Error("No methods outstanding but nonempty block: " +                                                // 1518
                        JSON.stringify(firstBlock));                                                                   // 1519
                                                                                                                       // 1520
      // Send the outstanding methods now in the first block.                                                          // 1521
      if (!_.isEmpty(self._outstandingMethodBlocks))                                                                   // 1522
        self._sendOutstandingMethods();                                                                                // 1523
    }                                                                                                                  // 1524
                                                                                                                       // 1525
    // Maybe accept a hot code push.                                                                                   // 1526
    self._maybeMigrate();                                                                                              // 1527
  },                                                                                                                   // 1528
                                                                                                                       // 1529
  // Sends messages for all the methods in the first block in                                                          // 1530
  // _outstandingMethodBlocks.                                                                                         // 1531
  _sendOutstandingMethods: function() {                                                                                // 1532
    var self = this;                                                                                                   // 1533
    if (_.isEmpty(self._outstandingMethodBlocks))                                                                      // 1534
      return;                                                                                                          // 1535
    _.each(self._outstandingMethodBlocks[0].methods, function (m) {                                                    // 1536
      m.sendMessage();                                                                                                 // 1537
    });                                                                                                                // 1538
  },                                                                                                                   // 1539
                                                                                                                       // 1540
  _livedata_error: function (msg) {                                                                                    // 1541
    Meteor._debug("Received error from server: ", msg.reason);                                                         // 1542
    if (msg.offendingMessage)                                                                                          // 1543
      Meteor._debug("For: ", msg.offendingMessage);                                                                    // 1544
  },                                                                                                                   // 1545
                                                                                                                       // 1546
  _callOnReconnectAndSendAppropriateOutstandingMethods: function() {                                                   // 1547
    var self = this;                                                                                                   // 1548
    var oldOutstandingMethodBlocks = self._outstandingMethodBlocks;                                                    // 1549
    self._outstandingMethodBlocks = [];                                                                                // 1550
                                                                                                                       // 1551
    self.onReconnect();                                                                                                // 1552
                                                                                                                       // 1553
    if (_.isEmpty(oldOutstandingMethodBlocks))                                                                         // 1554
      return;                                                                                                          // 1555
                                                                                                                       // 1556
    // We have at least one block worth of old outstanding methods to try                                              // 1557
    // again. First: did onReconnect actually send anything? If not, we just                                           // 1558
    // restore all outstanding methods and run the first block.                                                        // 1559
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                                    // 1560
      self._outstandingMethodBlocks = oldOutstandingMethodBlocks;                                                      // 1561
      self._sendOutstandingMethods();                                                                                  // 1562
      return;                                                                                                          // 1563
    }                                                                                                                  // 1564
                                                                                                                       // 1565
    // OK, there are blocks on both sides. Special case: merge the last block of                                       // 1566
    // the reconnect methods with the first block of the original methods, if                                          // 1567
    // neither of them are "wait" blocks.                                                                              // 1568
    if (!_.last(self._outstandingMethodBlocks).wait &&                                                                 // 1569
        !oldOutstandingMethodBlocks[0].wait) {                                                                         // 1570
      _.each(oldOutstandingMethodBlocks[0].methods, function (m) {                                                     // 1571
        _.last(self._outstandingMethodBlocks).methods.push(m);                                                         // 1572
                                                                                                                       // 1573
        // If this "last block" is also the first block, send the message.                                             // 1574
        if (self._outstandingMethodBlocks.length === 1)                                                                // 1575
          m.sendMessage();                                                                                             // 1576
      });                                                                                                              // 1577
                                                                                                                       // 1578
      oldOutstandingMethodBlocks.shift();                                                                              // 1579
    }                                                                                                                  // 1580
                                                                                                                       // 1581
    // Now add the rest of the original blocks on.                                                                     // 1582
    _.each(oldOutstandingMethodBlocks, function (block) {                                                              // 1583
      self._outstandingMethodBlocks.push(block);                                                                       // 1584
    });                                                                                                                // 1585
  },                                                                                                                   // 1586
                                                                                                                       // 1587
  // We can accept a hot code push if there are no methods in flight.                                                  // 1588
  _readyToMigrate: function() {                                                                                        // 1589
    var self = this;                                                                                                   // 1590
    return _.isEmpty(self._methodInvokers);                                                                            // 1591
  },                                                                                                                   // 1592
                                                                                                                       // 1593
  // If we were blocking a migration, see if it's now possible to continue.                                            // 1594
  // Call whenever the set of outstanding/blocked methods shrinks.                                                     // 1595
  _maybeMigrate: function () {                                                                                         // 1596
    var self = this;                                                                                                   // 1597
    if (self._retryMigrate && self._readyToMigrate()) {                                                                // 1598
      self._retryMigrate();                                                                                            // 1599
      self._retryMigrate = null;                                                                                       // 1600
    }                                                                                                                  // 1601
  }                                                                                                                    // 1602
});                                                                                                                    // 1603
                                                                                                                       // 1604
LivedataTest.Connection = Connection;                                                                                  // 1605
                                                                                                                       // 1606
// @param url {String} URL to Meteor app,                                                                              // 1607
//     e.g.:                                                                                                           // 1608
//     "subdomain.meteor.com",                                                                                         // 1609
//     "http://subdomain.meteor.com",                                                                                  // 1610
//     "/",                                                                                                            // 1611
//     "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                                  // 1612
                                                                                                                       // 1613
/**                                                                                                                    // 1614
 * @summary Connect to the server of a different Meteor application to subscribe to its document sets and invoke its remote methods.
 * @locus Anywhere                                                                                                     // 1616
 * @param {String} url The URL of another Meteor application.                                                          // 1617
 */                                                                                                                    // 1618
DDP.connect = function (url, options) {                                                                                // 1619
  var ret = new Connection(url, options);                                                                              // 1620
  allConnections.push(ret); // hack. see below.                                                                        // 1621
  return ret;                                                                                                          // 1622
};                                                                                                                     // 1623
                                                                                                                       // 1624
// Hack for `spiderable` package: a way to see if the page is done                                                     // 1625
// loading all the data it needs.                                                                                      // 1626
//                                                                                                                     // 1627
allConnections = [];                                                                                                   // 1628
DDP._allSubscriptionsReady = function () {                                                                             // 1629
  return _.all(allConnections, function (conn) {                                                                       // 1630
    return _.all(conn._subscriptions, function (sub) {                                                                 // 1631
      return sub.ready;                                                                                                // 1632
    });                                                                                                                // 1633
  });                                                                                                                  // 1634
};                                                                                                                     // 1635
                                                                                                                       // 1636
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp/server_convenience.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Only create a server if we are in an environment with a HTTP server                                                 // 1
// (as opposed to, eg, a command-line tool).                                                                           // 2
//                                                                                                                     // 3
// Note: this whole conditional is a total hack to get around the fact that this                                       // 4
// package logically should be split into a ddp-client and ddp-server package;                                         // 5
// see https://github.com/meteor/meteor/issues/3452                                                                    // 6
//                                                                                                                     // 7
// Until we do that, this conditional (and the weak dependency on webapp that                                          // 8
// should really be a strong dependency of the ddp-server package) allows you to                                       // 9
// build projects which use `ddp` in Node without wanting to run a DDP server                                          // 10
// (ie, allows you to act as if you were using the nonexistent `ddp-client`                                            // 11
// server package).                                                                                                    // 12
if (Package.webapp) {                                                                                                  // 13
  if (process.env.DDP_DEFAULT_CONNECTION_URL) {                                                                        // 14
    __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL =                                                             // 15
      process.env.DDP_DEFAULT_CONNECTION_URL;                                                                          // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  Meteor.server = new Server;                                                                                          // 19
                                                                                                                       // 20
  Meteor.refresh = function (notification) {                                                                           // 21
    DDPServer._InvalidationCrossbar.fire(notification);                                                                // 22
  };                                                                                                                   // 23
                                                                                                                       // 24
  // Proxy the public methods of Meteor.server so they can                                                             // 25
  // be called directly on Meteor.                                                                                     // 26
  _.each(['publish', 'methods', 'call', 'apply', 'onConnection'],                                                      // 27
         function (name) {                                                                                             // 28
           Meteor[name] = _.bind(Meteor.server[name], Meteor.server);                                                  // 29
         });                                                                                                           // 30
} else {                                                                                                               // 31
  // No server? Make these empty/no-ops.                                                                               // 32
  Meteor.server = null;                                                                                                // 33
  Meteor.refresh = function (notification) {                                                                           // 34
  };                                                                                                                   // 35
                                                                                                                       // 36
  // Make these empty/no-ops too, so that non-webapp apps can still                                                    // 37
  // depend on/use packages that use those functions.                                                                  // 38
  _.each(['publish', 'methods', 'onConnection'],                                                                       // 39
      function (name) {                                                                                                // 40
        Meteor[name] = function () { };                                                                                // 41
      });                                                                                                              // 42
}                                                                                                                      // 43
                                                                                                                       // 44
// Meteor.server used to be called Meteor.default_server. Provide                                                      // 45
// backcompat as a courtesy even though it was never documented.                                                       // 46
// XXX COMPAT WITH 0.6.4                                                                                               // 47
Meteor.default_server = Meteor.server;                                                                                 // 48
                                                                                                                       // 49
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ddp = {
  DDP: DDP,
  DDPServer: DDPServer,
  LivedataTest: LivedataTest
};

})();

//# sourceMappingURL=ddp.js.map
