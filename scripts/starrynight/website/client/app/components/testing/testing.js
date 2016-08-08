Router.route("/testing", {
  name:"testing",
  template:"testing",
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'},
    'testingSidebar': {to: 'sidebar'}
  }
});

Template.testing.helpers({
  rendered: function(){

  }
});

Template.testing.events({
  "click #elementId": function(event, template){

  }
});
