
Router.map(function(){
  this.route('recordPreviewPage', {
    path: '/foo/:id',
    template: 'recordPreviewPage',
    data: function () {
      return Foo.findOne({_id: this.params.id});
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
    Router.go('/list/foos');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/foos');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/foos');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/foos');
  },
  "click .recordId": function(){
    Router.go('/upsert/foo/' + this._id);
  }
});
