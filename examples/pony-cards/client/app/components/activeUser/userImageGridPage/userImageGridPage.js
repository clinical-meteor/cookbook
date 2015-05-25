Router.route("/grid/users", {
  template: "userImageGridPage",
  name: "userImageGridPage"
});
Router.route('/tiles', {
  layoutTemplate: '',
  template: "userImageGridPage",
  name: "tilesRoute"
});


Template.userImageGridPage.rendered = function(){
  Template.appLayout.delayedLayout(10);
}

Template.userImageGridPage.helpers({
  lists: function() {
    return Meteor.users.find({
      username: {
        $regex: Session.get('userSearchFilter'),
        $options: 'i'
    }});
  }
});

Template.userImageGridPage.events({
  'keyup #userSearchInput': function() {
    Session.set('userSearchFilter', $('#userSearchInput').val());
  },
  "click .userImage": function(event, template){
    Router.go('/upsert/user/' + this._id);
  },
  "click .addUserIcon": function(event, template){
    Router.go('/insert/user');
  },
  "click .addNewUser": function(event, template){
    Router.go('/insert/user');
  }
});
