Router.route("/grid/foos", {
  template: "recordImageGridPage",
  name: "recordImageGridPage"
});


Template.recordImageGridPage.rendered = function(){
  Template.appLayout.delayedLayout(10);
}

Template.recordImageGridPage.helpers({
  lists: function() {
    return Foo.find({
      title: {
        $regex: Session.get('fooSearchFilter'),
        $options: 'i'
    }});
  }
});

Template.recordImageGridPage.events({
  'keyup #recordSearchInput': function() {
    Session.set('fooSearchFilter', $('#recordSearchInput').val());
  },
  "click .recordImage": function(event, template){
    Router.go('/upsert/foo/' + this._id);
  },
  "click .addNewRecord": function(event, template){
    Router.go('/insert/foo');
  }
});
