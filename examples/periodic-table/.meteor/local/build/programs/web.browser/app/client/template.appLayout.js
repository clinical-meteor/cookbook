(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.Raw('<div id="backgroundImage"></div>');
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("item");
Template["item"] = new Template("Template.item", (function() {
  var view = this;
  return HTML.Raw("<li>\n    Foo?\n  </li>");
}));

})();
