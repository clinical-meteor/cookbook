(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Blaze, UI, Handlebars;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ui = {
  Blaze: Blaze,
  UI: UI,
  Handlebars: Handlebars
};

})();

//# sourceMappingURL=ui.js.map
