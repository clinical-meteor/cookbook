Session.setDefault('plantSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('plantsListPage', {
    path: '/list/plants/',
    template: 'plantsListPage',
    data: function(){
      return Plants.find();
    }
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.plantsListPage.events({
  /*'click .addPlantItem':function(){
    Router.go('/insert/plant');
  },*/
  'click .addPlantIcon':function(){
    Router.go('/insert/plant');
  },
  'click .plantItem':function(){
    Router.go('/view/plant/' + this._id);
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #plantSearchInput': function() {
    Session.set('plantSearchFilter', $('#plantSearchInput').val());
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.plantsListPage.rendered = function(){
  console.log("trying to update layout...");

  Template.appLayout.delayedLayout(20);
};


Template.plantsListPage.helpers({
  hasNoContent: function(){
    if(Plants.find().count() === 0){
      return true;
    }else{
      return false;
    }
  },
  plantsList: function() {
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(20);

    return Plants.find({
      commonName: {
        $regex: Session.get('plantSearchFilter'),
        $options: 'i'
    }});
  }
});
