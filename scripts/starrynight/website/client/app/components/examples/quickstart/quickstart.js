

Router.route("/examples/quickstart", {
  name:"quickstart",
  template:"quickstart",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.quickstart.helpers({

});

Template.quickstart.events({

});
