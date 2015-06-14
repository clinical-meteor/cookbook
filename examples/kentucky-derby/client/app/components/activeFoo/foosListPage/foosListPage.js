Session.setDefault('fooSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('foosListPage', {
    path: '/list/foos/',
    template: 'foosListPage',
    data: function(){
      return Foo.find();
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.foosListPage.events({
  /*'click .addFooItem':function(){
    Router.go('/insert/foo');
  },*/
  'click .addUserIcon':function(){
    Router.go('/insert/foo');
  },
  'click .fooItem':function(){
    Router.go('/view/foo/' + this._id);
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #fooSearchInput': function() {
    Session.set('fooSearchFilter', $('#fooSearchInput').val());
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.foosListPage.rendered = function(){
  console.log("trying to update layout...");

  Template.appLayout.delayedLayout(20);
};


Template.foosListPage.helpers({
  hasNoContent: function(){
    if(Foo.find().count() === 0){
      return true;
    }else{
      return false;
    }
  },
  foosList: function() {
    // this triggers a refresh of data elsewhere in the table
    // step C:  receive some data and set our reactive data variable with a new value
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(20);


    // this is a performant local (client-side) search on the data
    // current in our CustomerAccounts cursor, and will reactively
    // update the table

    return Foo.find({
      title: {
        $regex: Session.get('fooSearchFilter'),
        $options: 'i'
    }});
  }
});
