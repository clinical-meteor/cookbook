Session.setDefault('recordSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('recordsListPage', {
    path: '/list/records/',
    template: 'recordsListPage',
    data: function(){
      return Records.find();
    }
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.recordsListPage.events({
  /*'click .addRecordItem':function(){
    Router.go('/insert/record');
  },*/
  'click .addRecordIcon':function(){
    Router.go('/insert/record');
  },
  'click .recordItem':function(){
    Router.go('/view/record/' + this._id);
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #recordSearchInput': function() {
    Session.set('recordSearchFilter', $('#recordSearchInput').val());
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.recordsListPage.rendered = function(){
  console.log("trying to update layout...");

  Template.appLayout.delayedLayout(20);
};


Template.recordsListPage.helpers({
  hasNoContent: function(){
    if(Records.find().count() === 0){
      return true;
    }else{
      return false;
    }
  },
  recordsList: function() {
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(20);

    return Records.find({
      title: {
        $regex: Session.get('recordSearchFilter'),
        $options: 'i'
    }});
  }
});
