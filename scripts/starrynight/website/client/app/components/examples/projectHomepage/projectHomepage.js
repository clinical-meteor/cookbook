

Router.route("/examples/project-homepage", {
  name:"projectHomepage",
  template:"projectHomepage",
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.projectHomepage.helpers({

});

Template.projectHomepage.events({

});
