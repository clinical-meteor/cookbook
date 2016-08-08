
Router.map(function(){
  this.route('recordPreviewPage', {
    path: '/record/:id',
    template: 'recordPreviewPage',
    data: function () {
      return Records.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.recordPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.recordPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/records');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/records');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/records');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/records');
  },
  "click .recordId": function(){
    Router.go('/upsert/record/' + this._id);
  }
});
