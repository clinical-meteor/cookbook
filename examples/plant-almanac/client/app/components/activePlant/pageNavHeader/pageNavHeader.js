

Template.pageNavHeader.helpers({
  rendered: function(){

  }
});

Template.pageNavHeader.events({
  "click .listButton": function(event, template){
    Router.go('/list/plants');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/plants');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/plants');
  }
});
