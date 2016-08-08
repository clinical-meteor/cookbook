

Router.route("/examples/testing-quickstart", {
  name:"testingQuickstart",
  template:"testingQuickstart",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.testingQuickstart.helpers({

});

Template.testingQuickstart.events({

});
