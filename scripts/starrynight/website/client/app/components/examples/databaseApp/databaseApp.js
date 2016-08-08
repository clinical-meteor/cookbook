

Router.route("/examples/database-app", {
  name:"databaseApp",
  template:"databaseApp",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.databaseApp.helpers({

});

Template.databaseApp.events({

});
