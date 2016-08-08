

Router.route("/examples/rest-api", {
  name:"restApi",
  template:"restApi",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.restApi.helpers({

});

Template.restApi.events({

});
