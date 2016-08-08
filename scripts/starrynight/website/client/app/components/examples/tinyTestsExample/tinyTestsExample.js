

Router.route("/examples/tinytests", {
  name:"tinyTestsExample",
  template:"tinyTestsExample",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.tinyTestsExample.helpers({

});

Template.tinyTestsExample.events({

});
