(function(){
Template.__checkName("infoPage");
Template["infoPage"] = new Template("Template.infoPage", (function() {
  var view = this;
  return HTML.Raw('<div id="infoPage" class="page">\n\n    <h1>Periodic Table Demo</h1>\n    <h4>Meteor Version of the Famo Periodic Table Demo</h4>\n\n    <h2>What this about?</h2>\n    <hr>\n    <p>\n      Famo.us caused quite a splash a few years ago with their Periodic Table demo.  The original demo is such an old version of Famo that it\'s difficult for people to even run, and none of the APIs are the same as what eventually got implemented.  So, this is an attempt to create a new version of the Periodic Table, which everybody loved, and to add to it the realtime database goodness that Meteor can provide.\n    </p>\n\n\n    <h2>Installation &amp; Launching</h2>\n    <hr>\n    <div class="code">\n      <code>\n        $ git clone https://github.com/awatson1978/meteor-cookbook/\n        $ cd examples/periodic-table\n        $ meteor\n      </code>\n    </div>\n\n\n    <h2>License</h2>\n    <hr>\n    <p>\n      MIT.  Use as you will.\n    </p>\n\n  </div>');
}));

})();
