

Router.route("/examples/mobile-app", {
  name:"mobileApp",
  template:"mobileApp",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.mobileApp.helpers({

});

Template.mobileApp.events({

});
