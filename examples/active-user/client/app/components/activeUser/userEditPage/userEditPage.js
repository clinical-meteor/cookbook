

Router.route("/edit/user/:userId", {
  name:"editRecordRoute",
  template:"userEditPage",
  data: function(){
    return Meteor.users.findOne(this.params.userId)
  },
  onAfterAction: function(){
    Template.appLayout.layout();
  }
});


//-------------------------------------------------------------

Template.userEditPage.helpers({
  getRecordId: function() {
    if(this._id) {
      return this._id;
    }
  }
});

Template.userEditPage.rendered = function(){
  Template.appLayout.layout();
};



Template.userEditPage.events({
  "click .indexButton": function(event, template){
    Router.go('/list/users');
  },
  /*'click #previewRecordButton':function(){
    Router.go('/user/' + this._id);
  },*/
  'click #editRecordButton': function() {
    console.log('editing user...');

      var self = this;
      // TODO:  add validation functions

      var customerObject = {
        title: $('#userTitleInput').val(),
        description: $('#userDescriptionInput').val(),
        url: $('#userUrlInput').val()
      };

      customerObject._id = this._id;

      Meteor.users.update({_id: this._id}, {$set: customerObject }, function(error, success){
          if(success){
            Router.go('/user/' + self._id)
          }
          if(error){
            console.log("[click #editRecordButton] error: ", error);
          }
      });

      /*var self = this;
      customerObject._id = this._id;
      Meteor.call('updateRecord', customerObject, function(error, customer){
        console.log('error: ' + error);
        if(customer){
          console.log('customer: ' + customer);
          Router.go('/customer/' + self._id);
        }
      });*/

  },
  'click #deleteUserButton': function() {
    Meteor.users.remove(Session.get('selected_user'));
  },
  'click #cancelDeleteButton': function() {
    Router.go('/customers');
  }
});
