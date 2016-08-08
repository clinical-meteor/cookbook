

Router.route("/examples/everything-app", {
  name:"everythingApp",
  template:"everythingApp",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.everythingApp.helpers({

});

Template.everythingApp.events({

});
