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
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var compilePath, Url;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:url/lib/compiler.js                                                                        //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*                                                                                                          // 1
Based on https://github.com/pillarjs/path-to-regexp                                                         // 2
                                                                                                            // 3
The MIT License (MIT)                                                                                       // 4
                                                                                                            // 5
Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)                                                     // 6
                                                                                                            // 7
Permission is hereby granted, free of charge, to any person obtaining a copy                                // 8
of this software and associated documentation files (the "Software"), to deal                               // 9
in the Software without restriction, including without limitation the rights                                // 10
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                                   // 11
copies of the Software, and to permit persons to whom the Software is                                       // 12
furnished to do so, subject to the following conditions:                                                    // 13
                                                                                                            // 14
The above copyright notice and this permission notice shall be included in                                  // 15
all copies or substantial portions of the Software.                                                         // 16
                                                                                                            // 17
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR                                  // 18
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,                                    // 19
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE                                 // 20
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                                      // 21
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,                               // 22
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN                                   // 23
THE SOFTWARE.                                                                                               // 24
*/                                                                                                          // 25
                                                                                                            // 26
var typeOf = function (o) { return Object.prototype.toString.call(o); };                                    // 27
                                                                                                            // 28
/**                                                                                                         // 29
 * The main path matching regexp utility.                                                                   // 30
 *                                                                                                          // 31
 * @type {RegExp}                                                                                           // 32
 */                                                                                                         // 33
var PATH_REGEXP = new RegExp([                                                                              // 34
  // Match already escaped characters that would otherwise incorrectly appear                               // 35
  // in future matches. This allows the user to escape special characters that                              // 36
  // shouldn't be transformed.                                                                              // 37
  '(\\\\.)',                                                                                                // 38
  // Match Express-style parameters and un-named parameters with a prefix                                   // 39
  // and optional suffixes. Matches appear as:                                                              // 40
  //                                                                                                        // 41
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]                                                // 42
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]                                  // 43
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',                     // 44
  // Match regexp special characters that should always be escaped.                                         // 45
  '([.+*?=^!:${}()[\\]|\\/])'                                                                               // 46
].join('|'), 'g');                                                                                          // 47
                                                                                                            // 48
/**                                                                                                         // 49
 * Escape the capturing group by escaping special characters and meaning.                                   // 50
 *                                                                                                          // 51
 * @param  {String} group                                                                                   // 52
 * @return {String}                                                                                         // 53
 */                                                                                                         // 54
function escapeGroup (group) {                                                                              // 55
  return group.replace(/([=!:$\/()])/g, '\\$1');                                                            // 56
}                                                                                                           // 57
                                                                                                            // 58
/**                                                                                                         // 59
 * Attach the keys as a property of the regexp.                                                             // 60
 *                                                                                                          // 61
 * @param  {RegExp} re                                                                                      // 62
 * @param  {Array}  keys                                                                                    // 63
 * @return {RegExp}                                                                                         // 64
 */                                                                                                         // 65
var attachKeys = function (re, keys) {                                                                      // 66
  re.keys = keys;                                                                                           // 67
                                                                                                            // 68
  return re;                                                                                                // 69
};                                                                                                          // 70
                                                                                                            // 71
/**                                                                                                         // 72
 * Normalize the given path string, returning a regular expression.                                         // 73
 *                                                                                                          // 74
 * An empty array should be passed in, which will contain the placeholder key                               // 75
 * names. For example `/user/:id` will then contain `["id"]`.                                               // 76
 *                                                                                                          // 77
 * @param  {(String|RegExp|Array)} path                                                                     // 78
 * @param  {Array}                 keys                                                                     // 79
 * @param  {Object}                options                                                                  // 80
 * @return {RegExp}                                                                                         // 81
 */                                                                                                         // 82
function pathtoRegexp (path, keys, options) {                                                               // 83
  if (keys && typeOf(keys) !== '[object Array]') {                                                          // 84
    options = keys;                                                                                         // 85
    keys = null;                                                                                            // 86
  }                                                                                                         // 87
                                                                                                            // 88
  keys = keys || [];                                                                                        // 89
  options = options || {};                                                                                  // 90
                                                                                                            // 91
  var strict = options.strict;                                                                              // 92
  var end = options.end !== false;                                                                          // 93
  var flags = options.sensitive ? '' : 'i';                                                                 // 94
  var index = 0;                                                                                            // 95
                                                                                                            // 96
  if (path instanceof RegExp) {                                                                             // 97
    // Match all capturing groups of a regexp.                                                              // 98
    var groups = path.source.match(/\((?!\?)/g) || [];                                                      // 99
                                                                                                            // 100
    // Map all the matches to their numeric keys and push into the keys.                                    // 101
    keys.push.apply(keys, groups.map(function (match, index) {                                              // 102
      return {                                                                                              // 103
        name:      index,                                                                                   // 104
        delimiter: null,                                                                                    // 105
        optional:  false,                                                                                   // 106
        repeat:    false                                                                                    // 107
      };                                                                                                    // 108
    }));                                                                                                    // 109
                                                                                                            // 110
    // Return the source back to the user.                                                                  // 111
    return attachKeys(path, keys);                                                                          // 112
  }                                                                                                         // 113
                                                                                                            // 114
  if (typeOf(path) === '[object Array]') {                                                                  // 115
    // Map array parts into regexps and return their source. We also pass                                   // 116
    // the same keys and options instance into every generation to get                                      // 117
    // consistent matching groups before we join the sources together.                                      // 118
    path = path.map(function (value) {                                                                      // 119
      return pathtoRegexp(value, keys, options).source;                                                     // 120
    });                                                                                                     // 121
                                                                                                            // 122
    // Generate a new regexp instance by joining all the parts together.                                    // 123
    return attachKeys(new RegExp('(?:' + path.join('|') + ')', flags), keys);                               // 124
  }                                                                                                         // 125
                                                                                                            // 126
  // Alter the path string into a usable regexp.                                                            // 127
  path = path.replace(PATH_REGEXP, function (match, escaped, prefix, key, capture, group, suffix, escape) { // 128
    // Avoiding re-escaping escaped characters.                                                             // 129
    if (escaped) {                                                                                          // 130
      return escaped;                                                                                       // 131
    }                                                                                                       // 132
                                                                                                            // 133
    // Escape regexp special characters.                                                                    // 134
    if (escape) {                                                                                           // 135
      return '\\' + escape;                                                                                 // 136
    }                                                                                                       // 137
                                                                                                            // 138
    var repeat   = suffix === '+' || suffix === '*';                                                        // 139
    var optional = suffix === '?' || suffix === '*';                                                        // 140
                                                                                                            // 141
    keys.push({                                                                                             // 142
      name:      key || index++,                                                                            // 143
      delimiter: prefix || '/',                                                                             // 144
      optional:  optional,                                                                                  // 145
      repeat:    repeat                                                                                     // 146
    });                                                                                                     // 147
                                                                                                            // 148
    // Escape the prefix character.                                                                         // 149
    prefix = prefix ? '\\' + prefix : '';                                                                   // 150
                                                                                                            // 151
    // Match using the custom capturing group, or fallback to capturing                                     // 152
    // everything up to the next slash (or next period if the param was                                     // 153
    // prefixed with a period).                                                                             // 154
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');                            // 155
                                                                                                            // 156
    // Allow parameters to be repeated more than once.                                                      // 157
    if (repeat) {                                                                                           // 158
      capture = capture + '(?:' + prefix + capture + ')*';                                                  // 159
    }                                                                                                       // 160
                                                                                                            // 161
    // Allow a parameter to be optional.                                                                    // 162
    if (optional) {                                                                                         // 163
      return '(?:' + prefix + '(' + capture + '))?';                                                        // 164
    }                                                                                                       // 165
                                                                                                            // 166
    // Basic parameter support.                                                                             // 167
    return prefix + '(' + capture + ')';                                                                    // 168
  });                                                                                                       // 169
                                                                                                            // 170
  // Check whether the path ends in a slash as it alters some match behaviour.                              // 171
  var endsWithSlash = path[path.length - 1] === '/';                                                        // 172
                                                                                                            // 173
  // In non-strict mode we allow an optional trailing slash in the match. If                                // 174
  // the path to match already ended with a slash, we need to remove it for                                 // 175
  // consistency. The slash is only valid at the very end of a path match, not                              // 176
  // anywhere in the middle. This is important for non-ending mode, otherwise                               // 177
  // "/test/" will match "/test//route".                                                                    // 178
  if (!strict) {                                                                                            // 179
    path = (endsWithSlash ? path.slice(0, -2) : path) + '(?:\\/(?=$))?';                                    // 180
  }                                                                                                         // 181
                                                                                                            // 182
  // In non-ending mode, we need prompt the capturing groups to match as much                               // 183
  // as possible by using a positive lookahead for the end or next path segment.                            // 184
  if (!end) {                                                                                               // 185
    path += strict && endsWithSlash ? '' : '(?=\\/|$)';                                                     // 186
  }                                                                                                         // 187
                                                                                                            // 188
  return attachKeys(new RegExp('^' + path + (end ? '$' : ''), flags), keys);                                // 189
};                                                                                                          // 190
                                                                                                            // 191
compilePath = pathtoRegexp;                                                                                 // 192
                                                                                                            // 193
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:url/lib/url.js                                                                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*****************************************************************************/                             // 1
/* Imports */                                                                                               // 2
/*****************************************************************************/                             // 3
var warn = Iron.utils.warn;                                                                                 // 4
                                                                                                            // 5
/*****************************************************************************/                             // 6
/* Url */                                                                                                   // 7
/*****************************************************************************/                             // 8
function safeDecodeURIComponent (val) {                                                                     // 9
  try {                                                                                                     // 10
    return decodeURIComponent(val).replace(/\+/g, ' ');                                                     // 11
  } catch (e) {                                                                                             // 12
    if (e.constructor == URIError) {                                                                        // 13
      warn("Tried to decode an invalid URI component: " + JSON.stringify(val) + " " + e.stack);             // 14
    }                                                                                                       // 15
                                                                                                            // 16
    return undefined;                                                                                       // 17
  }                                                                                                         // 18
}                                                                                                           // 19
                                                                                                            // 20
function safeDecodeURI (val) {                                                                              // 21
  try {                                                                                                     // 22
    return decodeURI(val).replace(/\+/g, ' ');                                                              // 23
  } catch (e) {                                                                                             // 24
    if (e.constructor == URIError) {                                                                        // 25
      warn("Tried to decode an invalid URI: " + JSON.stringify(val) + " " + e.stack);                       // 26
    }                                                                                                       // 27
                                                                                                            // 28
    return undefined;                                                                                       // 29
  }                                                                                                         // 30
}                                                                                                           // 31
                                                                                                            // 32
/**                                                                                                         // 33
 * Url utilities and the ability to compile a url into a regular expression.                                // 34
 */                                                                                                         // 35
Url = function (url, options) {                                                                             // 36
  options = options || {};                                                                                  // 37
  this.options = options;                                                                                   // 38
  this.keys = [];                                                                                           // 39
  this.regexp = compilePath(url, this.keys, options);                                                       // 40
  this._originalPath = url;                                                                                 // 41
  _.extend(this, Url.parse(url));                                                                           // 42
};                                                                                                          // 43
                                                                                                            // 44
/**                                                                                                         // 45
 * Given a relative or absolute path return                                                                 // 46
 * a relative path with a leading forward slash and                                                         // 47
 * no search string or hash fragment                                                                        // 48
 *                                                                                                          // 49
 * @param {String} path                                                                                     // 50
 * @return {String}                                                                                         // 51
 */                                                                                                         // 52
Url.normalize = function (url) {                                                                            // 53
  if (url instanceof RegExp)                                                                                // 54
    return url;                                                                                             // 55
  else if (typeof url !== 'string')                                                                         // 56
    return '/';                                                                                             // 57
                                                                                                            // 58
  var parts = Url.parse(url);                                                                               // 59
  var pathname = parts.pathname;                                                                            // 60
                                                                                                            // 61
  if (pathname.charAt(0) !== '/')                                                                           // 62
    pathname = '/' + pathname;                                                                              // 63
                                                                                                            // 64
  if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === '/') {                                // 65
    pathname = pathname.slice(0, pathname.length - 1);                                                      // 66
  }                                                                                                         // 67
                                                                                                            // 68
  return pathname;                                                                                          // 69
};                                                                                                          // 70
                                                                                                            // 71
/**                                                                                                         // 72
 * Returns true if both a and b are of the same origin.                                                     // 73
 */                                                                                                         // 74
Url.isSameOrigin = function (a, b) {                                                                        // 75
  var aParts = Url.parse(a);                                                                                // 76
  var bParts = Url.parse(b);                                                                                // 77
  var result = aParts.origin === bParts.origin;                                                             // 78
  return result;                                                                                            // 79
};                                                                                                          // 80
                                                                                                            // 81
/**                                                                                                         // 82
 * Given a query string return an object of key value pairs.                                                // 83
 *                                                                                                          // 84
 * "?p1=value1&p2=value2 => {p1: value1, p2: value2}                                                        // 85
 */                                                                                                         // 86
Url.fromQueryString = function (query) {                                                                    // 87
  if (!query)                                                                                               // 88
    return {};                                                                                              // 89
                                                                                                            // 90
  if (typeof query !== 'string')                                                                            // 91
    throw new Error("expected string");                                                                     // 92
                                                                                                            // 93
  // get rid of the leading question mark                                                                   // 94
  if (query.charAt(0) === '?')                                                                              // 95
    query = query.slice(1);                                                                                 // 96
                                                                                                            // 97
  var keyValuePairs = query.split('&');                                                                     // 98
  var result = {};                                                                                          // 99
  var parts;                                                                                                // 100
                                                                                                            // 101
  _.each(keyValuePairs, function (pair) {                                                                   // 102
    var parts = pair.split('=');                                                                            // 103
    var key = parts[0];                                                                                     // 104
    var value = safeDecodeURIComponent(parts[1]);                                                           // 105
                                                                                                            // 106
    if (key.slice(-2) === '[]') {                                                                           // 107
      key = key.slice(0, -2);                                                                               // 108
      result[key] = result[key] || [];                                                                      // 109
      result[key].push(value);                                                                              // 110
    } else {                                                                                                // 111
      result[key] = value;                                                                                  // 112
    }                                                                                                       // 113
  });                                                                                                       // 114
                                                                                                            // 115
  return result;                                                                                            // 116
};                                                                                                          // 117
                                                                                                            // 118
/**                                                                                                         // 119
 * Given a query object return a query string.                                                              // 120
 */                                                                                                         // 121
Url.toQueryString = function (queryObject) {                                                                // 122
  var result = [];                                                                                          // 123
                                                                                                            // 124
  if (typeof queryObject === 'string') {                                                                    // 125
    if (queryObject.charAt(0) !== '?')                                                                      // 126
      return '?' + queryObject;                                                                             // 127
    else                                                                                                    // 128
      return queryObject;                                                                                   // 129
  }                                                                                                         // 130
                                                                                                            // 131
  _.each(queryObject, function (value, key) {                                                               // 132
    if (_.isArray(value)) {                                                                                 // 133
      _.each(value, function(valuePart) {                                                                   // 134
        result.push(encodeURIComponent(key + '[]') + '=' + encodeURIComponent(valuePart));                  // 135
      });                                                                                                   // 136
    } else {                                                                                                // 137
      result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));                               // 138
    }                                                                                                       // 139
  });                                                                                                       // 140
                                                                                                            // 141
  // no sense in adding a pointless question mark                                                           // 142
  if (result.length > 0)                                                                                    // 143
    return '?' + result.join('&');                                                                          // 144
  else                                                                                                      // 145
    return '';                                                                                              // 146
};                                                                                                          // 147
                                                                                                            // 148
/**                                                                                                         // 149
 * Given a string url return an object with all of the url parts.                                           // 150
 */                                                                                                         // 151
Url.parse = function (url) {                                                                                // 152
  if (typeof url !== 'string')                                                                              // 153
    return {};                                                                                              // 154
                                                                                                            // 155
  //http://tools.ietf.org/html/rfc3986#page-50                                                              // 156
  //http://www.rfc-editor.org/errata_search.php?rfc=3986                                                    // 157
  var re = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;                                 // 158
                                                                                                            // 159
  var match = url.match(re);                                                                                // 160
                                                                                                            // 161
  var protocol = match[1] ? match[1].toLowerCase() : undefined;                                             // 162
  var hostWithSlashes = match[3];                                                                           // 163
  var slashes = !!hostWithSlashes;                                                                          // 164
  var hostWithAuth= match[4] ? match[4].toLowerCase() : undefined;                                          // 165
  var hostWithAuthParts = hostWithAuth ? hostWithAuth.split('@') : [];                                      // 166
                                                                                                            // 167
  var host, auth;                                                                                           // 168
                                                                                                            // 169
  if (hostWithAuthParts.length == 2) {                                                                      // 170
    auth = hostWithAuthParts[0];                                                                            // 171
    host = hostWithAuthParts[1];                                                                            // 172
  } else if (hostWithAuthParts.length == 1) {                                                               // 173
    host = hostWithAuthParts[0];                                                                            // 174
    auth = undefined;                                                                                       // 175
  } else {                                                                                                  // 176
    host = undefined;                                                                                       // 177
    auth = undefined;                                                                                       // 178
  }                                                                                                         // 179
                                                                                                            // 180
  var hostWithPortParts = (host && host.split(':')) || [];                                                  // 181
  var hostname = hostWithPortParts[0];                                                                      // 182
  var port = hostWithPortParts[1];                                                                          // 183
  var origin = (protocol && host) ? protocol + '//' + host : undefined;                                     // 184
  var pathname = match[5];                                                                                  // 185
  var hash = match[8];                                                                                      // 186
  var originalUrl = url;                                                                                    // 187
                                                                                                            // 188
  var search = match[6];                                                                                    // 189
                                                                                                            // 190
  var query;                                                                                                // 191
  var indexOfSearch = (hash && hash.indexOf('?')) || -1;                                                    // 192
                                                                                                            // 193
  // if we found a search string in the hash and there is no explicit search                                // 194
  // string                                                                                                 // 195
  if (~indexOfSearch && !search) {                                                                          // 196
    search = hash.slice(indexOfSearch);                                                                     // 197
    hash = hash.substr(0, indexOfSearch);                                                                   // 198
    // get rid of the ? character                                                                           // 199
    query = search.slice(1);                                                                                // 200
  } else {                                                                                                  // 201
    query = match[7];                                                                                       // 202
  }                                                                                                         // 203
                                                                                                            // 204
  var path = pathname + (search || '');                                                                     // 205
  var queryObject = Url.fromQueryString(query);                                                             // 206
                                                                                                            // 207
  var rootUrl = [                                                                                           // 208
    protocol || '',                                                                                         // 209
    slashes ? '//' : '',                                                                                    // 210
    hostWithAuth || ''                                                                                      // 211
  ].join('');                                                                                               // 212
                                                                                                            // 213
  var href = [                                                                                              // 214
    protocol || '',                                                                                         // 215
    slashes ? '//' : '',                                                                                    // 216
    hostWithAuth || '',                                                                                     // 217
    pathname || '',                                                                                         // 218
    search || '',                                                                                           // 219
    hash || ''                                                                                              // 220
  ].join('');                                                                                               // 221
                                                                                                            // 222
  return {                                                                                                  // 223
    rootUrl: rootUrl || '',                                                                                 // 224
    originalUrl: url || '',                                                                                 // 225
    href: href || '',                                                                                       // 226
    protocol: protocol || '',                                                                               // 227
    auth: auth || '',                                                                                       // 228
    host: host || '',                                                                                       // 229
    hostname: hostname || '',                                                                               // 230
    port: port || '',                                                                                       // 231
    origin: origin || '',                                                                                   // 232
    path: path || '',                                                                                       // 233
    pathname: pathname || '',                                                                               // 234
    search: search || '',                                                                                   // 235
    query: query || '',                                                                                     // 236
    queryObject: queryObject || '',                                                                         // 237
    hash: hash || '',                                                                                       // 238
    slashes: slashes                                                                                        // 239
  };                                                                                                        // 240
};                                                                                                          // 241
                                                                                                            // 242
/**                                                                                                         // 243
 * Returns true if the path matches and false otherwise.                                                    // 244
 */                                                                                                         // 245
Url.prototype.test = function (path) {                                                                      // 246
  return this.regexp.test(Url.normalize(path));                                                             // 247
};                                                                                                          // 248
                                                                                                            // 249
/**                                                                                                         // 250
 * Returns the result of calling exec on the compiled path with                                             // 251
 * the given path.                                                                                          // 252
 */                                                                                                         // 253
Url.prototype.exec = function (path) {                                                                      // 254
  return this.regexp.exec(Url.normalize(path));                                                             // 255
};                                                                                                          // 256
                                                                                                            // 257
/**                                                                                                         // 258
 * Returns an array of parameters given a path. The array may have named                                    // 259
 * properties in addition to indexed values.                                                                // 260
 */                                                                                                         // 261
Url.prototype.params = function (path) {                                                                    // 262
  if (!path)                                                                                                // 263
    return [];                                                                                              // 264
                                                                                                            // 265
  var params = [];                                                                                          // 266
  var m = this.exec(path);                                                                                  // 267
  var queryString;                                                                                          // 268
  var keys = this.keys;                                                                                     // 269
  var key;                                                                                                  // 270
  var value;                                                                                                // 271
                                                                                                            // 272
  if (!m)                                                                                                   // 273
    throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"');          // 274
                                                                                                            // 275
  for (var i = 1, len = m.length; i < len; ++i) {                                                           // 276
    key = keys[i - 1];                                                                                      // 277
    value = typeof m[i] == 'string' ? safeDecodeURIComponent(m[i]) : m[i];                                  // 278
    if (key) {                                                                                              // 279
      params[key.name] = params[key.name] !== undefined ?                                                   // 280
        params[key.name] : value;                                                                           // 281
    } else                                                                                                  // 282
      params.push(value);                                                                                   // 283
  }                                                                                                         // 284
                                                                                                            // 285
  path = safeDecodeURI(path);                                                                               // 286
                                                                                                            // 287
  if (typeof path !== 'undefined') {                                                                        // 288
    queryString = path.split('?')[1];                                                                       // 289
    if (queryString)                                                                                        // 290
      queryString = queryString.split('#')[0];                                                              // 291
                                                                                                            // 292
    params.hash = path.split('#')[1] || null;                                                               // 293
    params.query = Url.fromQueryString(queryString);                                                        // 294
  }                                                                                                         // 295
                                                                                                            // 296
  return params;                                                                                            // 297
};                                                                                                          // 298
                                                                                                            // 299
Url.prototype.resolve = function (params, options) {                                                        // 300
  var value;                                                                                                // 301
  var isValueDefined;                                                                                       // 302
  var result;                                                                                               // 303
  var wildCardCount = 0;                                                                                    // 304
  var path = this._originalPath;                                                                            // 305
  var hash;                                                                                                 // 306
  var query;                                                                                                // 307
  var missingParams = [];                                                                                   // 308
  var originalParams = params;                                                                              // 309
                                                                                                            // 310
  options = options || {};                                                                                  // 311
  params = params || [];                                                                                    // 312
  query = options.query;                                                                                    // 313
  hash = options.hash && options.hash.toString();                                                           // 314
                                                                                                            // 315
  if (path instanceof RegExp) {                                                                             // 316
    throw new Error('Cannot currently resolve a regular expression path');                                  // 317
  } else {                                                                                                  // 318
    path = path                                                                                             // 319
      .replace(                                                                                             // 320
        /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                             // 321
        function (match, slash, format, key, capture, optional, offset) {                                   // 322
          slash = slash || '';                                                                              // 323
          value = params[key];                                                                              // 324
          isValueDefined = typeof value !== 'undefined';                                                    // 325
                                                                                                            // 326
          if (optional && !isValueDefined) {                                                                // 327
            value = '';                                                                                     // 328
          } else if (!isValueDefined) {                                                                     // 329
            missingParams.push(key);                                                                        // 330
            return;                                                                                         // 331
          }                                                                                                 // 332
                                                                                                            // 333
          value = _.isFunction(value) ? value.call(params) : value;                                         // 334
          var escapedValue = _.map(String(value).split('/'), function (segment) {                           // 335
            return encodeURIComponent(segment);                                                             // 336
          }).join('/');                                                                                     // 337
          return slash + escapedValue                                                                       // 338
        }                                                                                                   // 339
      )                                                                                                     // 340
      .replace(                                                                                             // 341
        /\*/g,                                                                                              // 342
        function (match) {                                                                                  // 343
          if (typeof params[wildCardCount] === 'undefined') {                                               // 344
            throw new Error(                                                                                // 345
              'You are trying to access a wild card parameter at index ' +                                  // 346
              wildCardCount +                                                                               // 347
              ' but the value of params at that index is undefined');                                       // 348
          }                                                                                                 // 349
                                                                                                            // 350
          var paramValue = String(params[wildCardCount++]);                                                 // 351
          return _.map(paramValue.split('/'), function (segment) {                                          // 352
            return encodeURIComponent(segment);                                                             // 353
          }).join('/');                                                                                     // 354
        }                                                                                                   // 355
      );                                                                                                    // 356
                                                                                                            // 357
    query = Url.toQueryString(query);                                                                       // 358
                                                                                                            // 359
    path = path + query;                                                                                    // 360
                                                                                                            // 361
    if (hash) {                                                                                             // 362
      hash = encodeURI(hash.replace('#', ''));                                                              // 363
      path = path + '#' + hash;                                                                             // 364
    }                                                                                                       // 365
  }                                                                                                         // 366
                                                                                                            // 367
  // Because of optional possibly empty segments we normalize path here                                     // 368
  path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                                  // 369
  path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                          // 370
                                                                                                            // 371
  if (missingParams.length == 0)                                                                            // 372
    return path;                                                                                            // 373
  else if (options.throwOnMissingParams === true)                                                           // 374
    throw new Error("Missing required parameters on path " + JSON.stringify(this._originalPath) + ". The missing params are: " + JSON.stringify(missingParams) + ". The params object passed in was: " + JSON.stringify(originalParams) + ".");
  else                                                                                                      // 376
    return null;                                                                                            // 377
};                                                                                                          // 378
                                                                                                            // 379
/*****************************************************************************/                             // 380
/* Namespacing */                                                                                           // 381
/*****************************************************************************/                             // 382
Iron.Url = Url;                                                                                             // 383
                                                                                                            // 384
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:url'] = {};

})();
