

Router.route("/edit/user/:userId", {
  name:"editUserRoute",
  template:"userEditPage",
  data: function(){
    return Users.findOne(this.params.userId)
  },
  onAfterAction: function(){
    Template.appLayout.layout();
  }
});


//-------------------------------------------------------------

Template.userEditPage.helpers({
  getUserId: function() {
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
  /*'click #previewUserButton':function(){
    Router.go('/user/' + this._id);
  },*/
  'click #editUserButton': function() {
    console.log('editing user...');

      var self = this;
      // TODO:  add validation functions

      var customerObject = {
        title: $('#userTitleInput').val(),
        description: $('#userDescriptionInput').val(),
        url: $('#userUrlInput').val()
      };

      customerObject._id = this._id;

      Users.update({_id: this._id}, {$set: customerObject }, function(error, success){
          if(success){
            Router.go('/user/' + self._id)
          }
          if(error){
            console.log("[click #editUserButton] error: ", error);
          }
      });

      /*var self = this;
      customerObject._id = this._id;
      Meteor.call('updateUser', customerObject, function(error, customer){
        console.log('error: ' + error);
        if(customer){
          console.log('customer: ' + customer);
          Router.go('/customer/' + self._id);
        }
      });*/

  },
  'click #deleteUserButton': function() {
    Users.remove(Session.get('selected_user'));
  },
  'click #cancelDeleteButton': function() {
    Router.go('/customers');
  }
});
