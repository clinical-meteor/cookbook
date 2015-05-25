
Router.map(function(){
  this.route('userPreviewPage', {
    path: '/user/:id',
    template: 'userPreviewPage',
    data: function () {
      return Users.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.userPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.userPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/users');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/users');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/users');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/users');
  },
  "click .userId": function(){
    Router.go('/upsert/user/' + this._id);
  }
});
