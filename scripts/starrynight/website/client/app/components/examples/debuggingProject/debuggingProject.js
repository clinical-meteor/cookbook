

Router.route("/examples/debugging-a-project", {
  name:"debuggingProject",
  template:"debuggingProject",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.debuggingProject.helpers({
  rendered: function(){

  }
});

Template.debuggingProject.events({
  "click #elementId": function(event, template){

  }
});
