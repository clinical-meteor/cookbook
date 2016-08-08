

Router.route("/examples/refactor-a-package", {
  name:"packageRefactor",
  template:"packageRefactor",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.packageRefactor.helpers({

});

Template.packageRefactor.events({

});
