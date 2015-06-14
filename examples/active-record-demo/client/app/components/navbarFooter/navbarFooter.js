


Template.navbarFooter.events({
  "click #listBtn": function(event, template){
    Router.go('/list/foos');
  },
  "click #imageGridBtn": function(event, template){
    Router.go('/grid/foos');
  },
  "click #tableBtn": function(event, template){
    Router.go('/table/foos');
  },
  "click #newBtn": function(event, template){
    Router.go('/new/foo');
  }
});


Template.navbarFooter.helpers({
  rendered: function(){

  }
});
