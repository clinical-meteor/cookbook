

Router.route("/examples/multi-page-app", {
  name:"multiPageApp",
  template:"multiPageApp",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.multiPageApp.helpers({

});

Template.multiPageApp.events({

});
