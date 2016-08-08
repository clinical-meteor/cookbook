Router.route("/examples", {
  name:"examples",
  template:"examples",
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'exampleMenu': {to: 'exampleMenu'}
  }
});

Template.examples.helpers({
  rendered: function(){

  }
});

Template.examples.events({
  "click #elementId": function(event, template){

  }
});
