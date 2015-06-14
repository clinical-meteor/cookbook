Router.route("/grid/foos", {
  template: "fooImageGridPage",
  name: "fooImageGridPage",
  onAfterAction: function(){
    Template.appLayout.delayedLayout(10);
  }
});


Template.fooImageGridPage.rendered = function(){
  Template.appLayout.delayedLayout(10);
}

Template.fooImageGridPage.helpers({
  lists: function() {
    return Foo.find({
      title: {
        $regex: Session.get('fooSearchFilter'),
        $options: 'i'
    }});
  }
});

Template.fooImageGridPage.events({
  'keyup #fooSearchInput': function() {
    Session.set('fooSearchFilter', $('#fooSearchInput').val());
  },
  "click .fooImage": function(event, template){
    Router.go('/upsert/foo/' + this._id);
  },
  "click .addUserIcon": function(event, template){
    Router.go('/insert/foo');
  },
  "click .addNewFoo": function(event, template){
    Router.go('/insert/foo');
  }
});
