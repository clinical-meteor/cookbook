

Template.pageNavHeader.helpers({
  rendered: function(){

  }
});

Template.pageNavHeader.events({
  "click .listButton": function(event, template){
    Router.go('/list/users');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/users');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/users');
  }
});
