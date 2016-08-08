Router.route("/grid/records", {
  template: "recordImageGridPage",
  name: "recordImageGridPage"
});


Template.recordImageGridPage.rendered = function(){
  Template.appLayout.delayedLayout(10);
}

Template.recordImageGridPage.helpers({
  lists: function() {
    return Records.find({
      title: {
        $regex: Session.get('recordSearchFilter'),
        $options: 'i'
    }});
  }
});

Template.recordImageGridPage.events({
  'keyup #recordSearchInput': function() {
    Session.set('recordSearchFilter', $('#recordSearchInput').val());
  },
  "click .recordImage": function(event, template){
    Router.go('/upsert/record/' + this._id);
  },
  "click .addRecordIcon": function(event, template){
    Router.go('/insert/record');
  },
  "click .addNewRecord": function(event, template){
    Router.go('/insert/record');
  }
});
