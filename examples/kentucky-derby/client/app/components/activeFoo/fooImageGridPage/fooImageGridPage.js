Router.route("/grid/foos", {
  template: "fooImageGridPage",
  name: "fooImageGridPage"
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
  "click .addFooIcon": function(event, template){
    Router.go('/insert/foo');
  },
  "click .addNewFoo": function(event, template){
    Router.go('/insert/foo');
  }
});
