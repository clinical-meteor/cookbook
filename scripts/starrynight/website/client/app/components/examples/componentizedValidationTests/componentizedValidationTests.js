

Router.route("/examples/componentized-validation-tests", {
  name:"componentizedValidationTests",
  template:"componentizedValidationTests",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.componentizedValidationTests.helpers({

});

Template.componentizedValidationTests.events({

});
