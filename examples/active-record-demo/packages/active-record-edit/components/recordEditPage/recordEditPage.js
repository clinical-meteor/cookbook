Router.route("/edit/foo/:fooId", {
  name: "editFooRoute",
  template: "recordEditPage",
  data: function () {
    return Foo.findOne(this.params.fooId);
  },
  onAfterAction: function () {
    Template.appLayout.layout();
  }
});


//-------------------------------------------------------------

Template.recordEditPage.helpers({
  getRecordId: function () {
    if (this._id) {
      return this._id;
    }
  }
});

Template.recordEditPage.rendered = function () {
  Template.appLayout.layout();
};



Template.recordEditPage.events({
  "click .indexButton": function (event, template) {
    Router.go('/list/foos');
  },
  /*'click #previewFooButton':function(){
    Router.go('/foo/' + this._id);
  },*/
  'click #editFooButton': function () {
    console.log('editing user...');

    var self = this;
    // TODO:  add validation functions

    var customerObject = {
      title: $('input[name="title"]').val(),
      description: $('input[name="description"]').val(),
      url: $('input[name="url"]').val()
    };

    customerObject._id = this._id;

    Foo.update({
      _id: this._id
    }, {
      $set: customerObject
    }, function (error, success) {
      if (success) {
        Router.go('/foo/' + self._id);
      }
      if (error) {
        console.log("[click #editFooButton] error: ", error);
      }
    });

    /*var self = this;
    customerObject._id = this._id;
    Meteor.call('updateFoo', customerObject, function(error, customer){
      console.log('error: ' + error);
      if(customer){
        console.log('customer: ' + customer);
        Router.go('/customer/' + self._id);
      }
    });*/

  },
  'click #deleteUserButton': function () {
    Foo.remove(Session.get('selected_user'));
  },
  'click #cancelDeleteButton': function () {
    Router.go('/customers');
  }
});
