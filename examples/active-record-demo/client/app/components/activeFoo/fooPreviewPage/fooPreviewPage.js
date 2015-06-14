
Router.map(function(){
  this.route('fooPreviewPage', {
    path: '/foo/:id',
    template: 'fooPreviewPage',
    data: function () {
      return Foo.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.fooPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.fooPreviewPage.events({
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
