

Router.route("/examples/unit-tests", {
  name:"unitTestsExample",
  template:"unitTestsExample",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.unitTestsExample.helpers({

});

Template.unitTestsExample.events({

});
