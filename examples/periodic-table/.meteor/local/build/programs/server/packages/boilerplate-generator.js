(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var SpacebarsCompiler = Package['spacebars-compiler'].SpacebarsCompiler;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;

/* Package-scope variables */
var Boilerplate;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/boilerplate-generator/boilerplate-generator.js                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var fs = Npm.require('fs');                                                      // 1
var path = Npm.require('path');                                                  // 2
                                                                                 // 3
// Copied from webapp_server                                                     // 4
var readUtf8FileSync = function (filename) {                                     // 5
  return Meteor.wrapAsync(fs.readFile)(filename, 'utf8');                        // 6
};                                                                               // 7
                                                                                 // 8
Boilerplate = function (arch, manifest, options) {                               // 9
  var self = this;                                                               // 10
  options = options || {};                                                       // 11
  self.template = _getTemplate(arch);                                            // 12
  self.baseData = null;                                                          // 13
  self.func = null;                                                              // 14
                                                                                 // 15
  self._generateBoilerplateFromManifestAndSource(                                // 16
    manifest,                                                                    // 17
    self.template,                                                               // 18
    options                                                                      // 19
  );                                                                             // 20
};                                                                               // 21
                                                                                 // 22
// The 'extraData' argument can be used to extend 'self.baseData'. Its           // 23
// purpose is to allow you to specify data that you might not know at            // 24
// the time that you construct the Boilerplate object. (e.g. it is used          // 25
// by 'webapp' to specify data that is only known at request-time).              // 26
Boilerplate.prototype.toHTML = function (extraData) {                            // 27
  var self = this;                                                               // 28
                                                                                 // 29
  if (! self.baseData || ! self.func)                                            // 30
    throw new Error('Boilerplate did not instantiate correctly.');               // 31
                                                                                 // 32
  return  "<!DOCTYPE html>\n" +                                                  // 33
    Blaze.toHTML(Blaze.With(_.extend(self.baseData, extraData),                  // 34
                            self.func));                                         // 35
};                                                                               // 36
                                                                                 // 37
// XXX Exported to allow client-side only changes to rebuild the boilerplate     // 38
// without requiring a full server restart.                                      // 39
// Produces an HTML string with given manifest and boilerplateSource.            // 40
// Optionally takes urlMapper in case urls from manifest need to be prefixed     // 41
// or rewritten.                                                                 // 42
// Optionally takes pathMapper for resolving relative file system paths.         // 43
// Optionally allows to override fields of the data context.                     // 44
Boilerplate.prototype._generateBoilerplateFromManifestAndSource =                // 45
  function (manifest, boilerplateSource, options) {                              // 46
    var self = this;                                                             // 47
    // map to the identity by default                                            // 48
    var urlMapper = options.urlMapper || _.identity;                             // 49
    var pathMapper = options.pathMapper || _.identity;                           // 50
                                                                                 // 51
    var boilerplateBaseData = {                                                  // 52
      css: [],                                                                   // 53
      js: [],                                                                    // 54
      head: '',                                                                  // 55
      body: '',                                                                  // 56
      meteorManifest: JSON.stringify(manifest)                                   // 57
    };                                                                           // 58
                                                                                 // 59
    // allow the caller to extend the default base data                          // 60
    _.extend(boilerplateBaseData, options.baseDataExtension);                    // 61
                                                                                 // 62
    _.each(manifest, function (item) {                                           // 63
      var urlPath = urlMapper(item.url);                                         // 64
      var itemObj = { url: urlPath };                                            // 65
                                                                                 // 66
      if (options.inline) {                                                      // 67
        itemObj.scriptContent = readUtf8FileSync(                                // 68
          pathMapper(item.path));                                                // 69
        itemObj.inline = true;                                                   // 70
      }                                                                          // 71
                                                                                 // 72
      if (item.type === 'css' && item.where === 'client') {                      // 73
        boilerplateBaseData.css.push(itemObj);                                   // 74
      }                                                                          // 75
      if (item.type === 'js' && item.where === 'client') {                       // 76
        boilerplateBaseData.js.push(itemObj);                                    // 77
      }                                                                          // 78
      if (item.type === 'head') {                                                // 79
        boilerplateBaseData.head =                                               // 80
          readUtf8FileSync(pathMapper(item.path));                               // 81
      }                                                                          // 82
      if (item.type === 'body') {                                                // 83
        boilerplateBaseData.body =                                               // 84
          readUtf8FileSync(pathMapper(item.path));                               // 85
      }                                                                          // 86
    });                                                                          // 87
    var boilerplateRenderCode = SpacebarsCompiler.compile(                       // 88
      boilerplateSource, { isBody: true });                                      // 89
                                                                                 // 90
    // Note that we are actually depending on eval's local environment capture   // 91
    // so that UI and HTML are visible to the eval'd code.                       // 92
    // XXX the template we are evaluating relies on the fact that UI is globally // 93
      // available.                                                              // 94
    global.UI = UI;                                                              // 95
    self.func = eval(boilerplateRenderCode);                                     // 96
    self.baseData = boilerplateBaseData;                                         // 97
};                                                                               // 98
                                                                                 // 99
var _getTemplate = _.memoize(function (arch) {                                   // 100
  var filename = 'boilerplate_' + arch + '.html';                                // 101
  return Assets.getText(filename);                                               // 102
});                                                                              // 103
                                                                                 // 104
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['boilerplate-generator'] = {
  Boilerplate: Boilerplate
};

})();

//# sourceMappingURL=boilerplate-generator.js.map
