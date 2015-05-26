Session.setDefault('userSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('usersListPage', {
    path: '/list/users/',
    template: 'usersListPage',
    data: function(){
      return Meteor.users.find();
    }
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.usersListPage.events({
  /*'click .addRecordItem':function(){
    Router.go('/insert/user');
  },*/
  'click .addRecordIcon':function(){
    Router.go('/insert/user');
  },
  'click .userItem':function(){
    Router.go('/view/user/' + this._id);
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #userSearchInput': function() {
    Session.set('userSearchFilter', $('#userSearchInput').val());
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.usersListPage.rendered = function(){
  console.log("trying to update layout...");

  Template.appLayout.delayedLayout(20);
};


Template.usersListPage.helpers({
  hasNoContent: function(){
    if(Meteor.users.find().count() === 0){
      return true;
    }else{
      return false;
    }
  },
  usersList: function() {
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(20);

    return Meteor.users.find({
      'profile.name': {
        $regex: Session.get('userSearchFilter'),
        $options: 'i'
    }});
  }
});
