

Router.route("/edit/record/:recordId", {
  name:"editRecordRoute",
  template:"recordEditPage",
  data: function(){
    return Records.findOne(this.params.recordId)
  },
  onAfterAction: function(){
    Template.appLayout.layout();
  }
});


//-------------------------------------------------------------

Template.recordEditPage.helpers({
  getRecordId: function() {
    if(this._id) {
      return this._id;
    }
  }
});

Template.recordEditPage.rendered = function(){
  Template.appLayout.layout();
};



Template.recordEditPage.events({
  "click .indexButton": function(event, template){
    Router.go('/list/records');
  },
  /*'click #previewRecordButton':function(){
    Router.go('/record/' + this._id);
  },*/
  'click #editRecordButton': function() {
    console.log('editing user...');

      var self = this;
      // TODO:  add validation functions

      var customerObject = {
        title: $('#recordTitleInput').val(),
        description: $('#recordDescriptionInput').val(),
        url: $('#recordUrlInput').val()
      };

      customerObject._id = this._id;

      Records.update({_id: this._id}, {$set: customerObject }, function(error, success){
          if(success){
            Router.go('/record/' + self._id)
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
    Records.remove(Session.get('selected_user'));
  },
  'click #cancelDeleteButton': function() {
    Router.go('/customers');
  }
});
