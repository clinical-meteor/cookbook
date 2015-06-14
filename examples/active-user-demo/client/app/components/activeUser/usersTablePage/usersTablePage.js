Session.setDefault('userSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('usersTablePage', {
    path: '/table/users',
    template: 'usersTablePage'
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.usersTablePage.events({
  'click .starA': function(event, template){
    event.stopPropagation();
    Meteor.users.update({_id: this._id}, {$set: {stars: 1}});
  },
  'click .starB': function(event, template){
    event.stopPropagation();
    Meteor.users.update({_id: this._id}, {$set: {stars: 2}});
  },
  'click .starC': function(event, template){
    event.stopPropagation();
    Meteor.users.update({_id: this._id}, {$set: {stars: 3}});
  },
  'click .starD': function(event, template){
    event.stopPropagation();
    Meteor.users.update({_id: this._id}, {$set: {stars: 4}});
  },
  'click .starE': function(event, template){
    event.stopPropagation();
    Meteor.users.update({_id: this._id}, {$set: {stars: 5}});
  },
  'click .checkbox': function(event, template){
    event.stopPropagation();
    if(this.checked){
      Meteor.users.update({_id: this._id}, {$set: {checked: false}});
    }else{
      Meteor.users.update({_id: this._id}, {$set: {checked: true}});
    }
  },
  'click .flag': function(event, template){
    event.stopPropagation();
    if(this.flagged){
      Meteor.users.update({_id: this._id}, {$set: {flagged: false}});
    }else{
      Meteor.users.update({_id: this._id}, {$set: {flagged: true}});
    }
  },
  'click .addRecordIcon': function(){
    Router.go('/insert/user');
  },
  'click .delete': function(){
    Meteor.users.remove(this._id);
  },
  'click tr': function(){
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

Template.usersTablePage.helpers({
  isGrayedOut: function(){
    if(this.checked){
      return "gray";
    }else{
      return "";
    }
  },
  starA: function(){
    if(this.stars >= 1){
      return "fa-star";
    }else{
      return "fa-star-o"
    }
  },
  starB: function(){
    if(this.stars >= 2){
      return "fa-star";
    }else{
      return "fa-star-o"
    }
  },
  starC: function(){
    if(this.stars >= 3){
      return "fa-star";
    }else{
      return "fa-star-o"
    }
  },
  starD: function(){
    if(this.stars >= 4){
      return "fa-star";
    }else{
      return "fa-star-o"
    }
  },
  starE: function(){
    if(this.stars == 5){
      return "fa-star";
    }else{
      return "fa-star-o"
    }
  },
  checkedIcon: function(){
    if(this.checked){
      return "fa-check";
    }else{
      return "fa-square-o";
    }
  },
  flaggedIcon: function(){
    if(this.flagged){
      return "fa-flag";
    }else{
      return "fa-flag-o";
    }
  },
  usersList: function() {
    // this triggers a refresh of data elsewhere in the table
    // step C:  receive some data and set our reactive data variable with a new value
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(100);

    // this is a performant local (client-side) search on the data
    // current in our CustomerAccounts cursor, and will reactively
    // update the table
    return Meteor.users.find({
      'profile.fullName': {
        $regex: Session.get('userSearchFilter'),
        $options: 'i'
    }});
  }
});


Template.usersTablePage.rendered = function(){
  Template.appLayout.layout();

  // step A:  initialize the table sorting functionality
  $(this.find('#usersTable')).tablesorter();

  // the Tracker API watches Collection and Session objects
  // so what we're doing here is registering a Tracker to watch the
  // Session.get('receivedData') variable.  When it changes, everything
  // in the autorun() clause will get rerun

  // step B:  register a tracker to add the tablesorting functionality back
  // after we update data
  Tracker.autorun(function() {

    // step D: register that the recevedData variable has been changed
    // and rerun the Tracker clause
    // step E: actually log the new value in receivedData
    console.log(Session.get('receivedData'))
    setTimeout(function() {
      // step F:  update the tablesorting library 200ms after receiving data
      // and Blaze has had a change to rerender the table
      $("#usersTable").trigger("update");
    }, 200);
  });

};
