
Router.map(function(){
  this.route('plantPreviewPage', {
    path: '/plant/:id',
    template: 'plantPreviewPage',
    data: function () {
      return Plants.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.plantPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.plantPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/plants');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/plants');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/plants');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/plants');
  },
  "click .recordId": function(){
    Router.go('/upsert/plant/' + this._id);
  }
});
