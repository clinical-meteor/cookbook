

Router.route("/edit/plant/:plantId", {
  name:"editPlantRoute",
  template:"plantEditPage",
  data: function(){
    return Plants.findOne(this.params.plantId)
  },
  onAfterAction: function(){
    Template.appLayout.layout();
  }
});


//-------------------------------------------------------------

Template.plantEditPage.helpers({
  getRecordId: function() {
    if(this._id) {
      return this._id;
    }
  }
});

Template.plantEditPage.rendered = function(){
  Template.appLayout.layout();
};



Template.plantEditPage.events({
  "click .indexButton": function(event, template){
    Router.go('/list/plants');
  },
  /*'click #previewPlantButton':function(){
    Router.go('/plant/' + this._id);
  },*/
  'click #editPlantButton': function() {
    console.log('editing user...');

      var self = this;
      // TODO:  add validation functions

      var customerObject = {
        commonName: $('#plantTitleInput').val(),
        description: $('#plantDescriptionInput').val(),
        url: $('#plantUrlInput').val()
      };

      customerObject._id = this._id;

      Plants.update({_id: this._id}, {$set: customerObject }, function(error, success){
          if(success){
            Router.go('/plant/' + self._id)
          }
          if(error){
            console.log("[click #editPlantButton] error: ", error);
          }
      });

      /*var self = this;
      customerObject._id = this._id;
      Meteor.call('updatePlant', customerObject, function(error, customer){
        console.log('error: ' + error);
        if(customer){
          console.log('customer: ' + customer);
          Router.go('/customer/' + self._id);
        }
      });*/

  },
  'click #deleteUserButton': function() {
    Plants.remove(Session.get('selected_user'));
  },
  'click #cancelDeleteButton': function() {
    Router.go('/customers');
  }
});
