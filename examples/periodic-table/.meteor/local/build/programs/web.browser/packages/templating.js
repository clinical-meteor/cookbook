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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Template;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/templating/templating.js                                                                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
// Packages and apps add templates on to this object.                                                           // 2
                                                                                                                // 3
/**                                                                                                             // 4
 * @summary The class for defining templates                                                                    // 5
 * @class                                                                                                       // 6
 * @instanceName Template.myTemplate                                                                            // 7
 */                                                                                                             // 8
Template = Blaze.Template;                                                                                      // 9
                                                                                                                // 10
var RESERVED_TEMPLATE_NAMES = "__proto__ name".split(" ");                                                      // 11
                                                                                                                // 12
// Check for duplicate template names and illegal names that won't work.                                        // 13
Template.__checkName = function (name) {                                                                        // 14
  // Some names can't be used for Templates. These include:                                                     // 15
  //  - Properties Blaze sets on the Template object.                                                           // 16
  //  - Properties that some browsers don't let the code to set.                                                // 17
  //    These are specified in RESERVED_TEMPLATE_NAMES.                                                         // 18
  if (name in Template || _.contains(RESERVED_TEMPLATE_NAMES, name)) {                                          // 19
    if ((Template[name] instanceof Template) && name !== "body")                                                // 20
      throw new Error("There are multiple templates named '" + name + "'. Each template needs a unique name."); // 21
    throw new Error("This template name is reserved: " + name);                                                 // 22
  }                                                                                                             // 23
};                                                                                                              // 24
                                                                                                                // 25
// XXX COMPAT WITH 0.8.3                                                                                        // 26
Template.__define__ = function (name, renderFunc) {                                                             // 27
  Template.__checkName(name);                                                                                   // 28
  Template[name] = new Template("Template." + name, renderFunc);                                                // 29
  // Exempt packages built pre-0.9.0 from warnings about using old                                              // 30
  // helper syntax, because we can.  It's not very useful to get a                                              // 31
  // warning about someone else's code (like a package on Atmosphere),                                          // 32
  // and this should at least put a bit of a dent in number of warnings                                         // 33
  // that come from packages that haven't been updated lately.                                                  // 34
  Template[name]._NOWARN_OLDSTYLE_HELPERS = true;                                                               // 35
};                                                                                                              // 36
                                                                                                                // 37
// Define a template `Template.body` that renders its                                                           // 38
// `contentRenderFuncs`.  `<body>` tags (of which there may be                                                  // 39
// multiple) will have their contents added to it.                                                              // 40
                                                                                                                // 41
/**                                                                                                             // 42
 * @summary The [template object](#templates_api) representing your `<body>`                                    // 43
 * tag.                                                                                                         // 44
 * @locus Client                                                                                                // 45
 */                                                                                                             // 46
Template.body = new Template('body', function () {                                                              // 47
  var view = this;                                                                                              // 48
  return _.map(Template.body.contentRenderFuncs, function (func) {                                              // 49
    return func.apply(view);                                                                                    // 50
  });                                                                                                           // 51
});                                                                                                             // 52
Template.body.contentRenderFuncs = []; // array of Blaze.Views                                                  // 53
Template.body.view = null;                                                                                      // 54
                                                                                                                // 55
Template.body.addContent = function (renderFunc) {                                                              // 56
  Template.body.contentRenderFuncs.push(renderFunc);                                                            // 57
};                                                                                                              // 58
                                                                                                                // 59
// This function does not use `this` and so it may be called                                                    // 60
// as `Meteor.startup(Template.body.renderIntoDocument)`.                                                       // 61
Template.body.renderToDocument = function () {                                                                  // 62
  // Only do it once.                                                                                           // 63
  if (Template.body.view)                                                                                       // 64
    return;                                                                                                     // 65
                                                                                                                // 66
  var view = Blaze.render(Template.body, document.body);                                                        // 67
  Template.body.view = view;                                                                                    // 68
};                                                                                                              // 69
                                                                                                                // 70
// XXX COMPAT WITH 0.9.0                                                                                        // 71
UI.body = Template.body;                                                                                        // 72
                                                                                                                // 73
// XXX COMPAT WITH 0.9.0                                                                                        // 74
// (<body> tags in packages built with 0.9.0)                                                                   // 75
Template.__body__ = Template.body;                                                                              // 76
Template.__body__.__contentParts = Template.body.contentViews;                                                  // 77
Template.__body__.__instantiate = Template.body.renderToDocument;                                               // 78
                                                                                                                // 79
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.templating = {
  Template: Template
};

})();
