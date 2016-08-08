

Template.pageNavHeader.helpers({
  rendered: function(){

  }
});

Template.pageNavHeader.events({
  "click .listButton": function(event, template){
    Router.go('/list/records');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/records');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/records');
  }
});
