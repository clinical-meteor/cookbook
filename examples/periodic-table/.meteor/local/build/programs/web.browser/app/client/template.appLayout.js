(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.Raw('<div id="backgroundImage"></div>');
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("appLayout");
Template["appLayout"] = new Template("Template.appLayout", (function() {
  var view = this;
  return Spacebars.include(view.lookupTemplate("yield"));
}));

})();
