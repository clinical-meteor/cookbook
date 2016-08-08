Session.setDefault('recordReadOnly', true);


Router.map(function(){
  this.route('newRecordRoute', {
    path: '/insert/record',
    template: 'recordUpsertPage',
    onAfterAction: function(){
      Session.set('recordReadOnly', false);
    }
  });

});
Router.route('/upsert/record/:id', {
  name: 'upsertRecordRoute',
  template: 'recordUpsertPage',
  data: function(){
    return Records.findOne(this.params.id);
  },
  onAfterAction: function(){
    Session.set('recordReadOnly', false);
  }
});
Router.route('/view/record/:id', {
  name: 'viewRecordRoute',
  template: 'recordUpsertPage',
  data: function(){
    return Records.findOne(this.params.id);
  },
  onAfterAction: function(){
    Session.set('recordReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.recordUpsertPage.rendered = function(){
  Template.appLayout.layout();
};


Template.recordUpsertPage.helpers({
  isNewRecord: function(){
    if(this._id){
      return false;
    }else{
      return true;
    }
  },
  getLockIcon: function(){
    if(Session.get('recordReadOnly')){
      return "fa-lock";
    }else{
      return "fa-unlock";
    }
  },
  isReadOnly: function(){
    if(Session.get('recordReadOnly')){
      return "readonly";
    }
  },
  getRecordId: function() {
    if(this._id) {
      return this._id;
    }else{
      return "---";
    }
  }
});

Template.recordUpsertPage.events({
  'click #removeRecordButton': function(){
    Records.remove(this._id, function(error, result){
      if(result){
        Router.go('/list/records');
      }
    });
  },
  "click #saveRecordButton": function(){
    Template.recordUpsertPage.saveRecord(this);
    Session.set('recordReadOnly', true);
  },
  "click .barcode": function(){
    // TODO:  refactor to Session.toggle('recordReadOnly')
    if(Session.equals('recordReadOnly', true)){
      Session.set('recordReadOnly', false);
    }else{
      Session.set('recordReadOnly', true);
      console.log('Locking the record...');
      Template.recordUpsertPage.saveRecord(this);
    }
  },
  "click #lockRecordButton": function(){
    console.log("click #lockRecordButton");

    if(Session.equals('recordReadOnly', true)){
      Session.set('recordReadOnly', false);
    }else{
      Session.set('recordReadOnly', true);
    }
  },
  "click #recordListButton": function(event, template){
    Router.go('/list/records');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/records');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/records');
  },
  'click #previewRecordButton':function(){
    Router.go('/customer/' + this._id);
  },
  'click #upsertRecordButton': function() {
    console.log('creating new Records...');
    Template.recordUpsertPage.saveRecord(this);
  }
});


Template.recordUpsertPage.saveRecord = function(record){
  // TODO:  add validation functions

  var customerObject = {
    title: $('#recordTitleInput').val(),
    description: $('#recordDescriptionInput').val(),
    imageUrl: $('#recordImageUrlInput').val(),
    url: $('#recordUrlInput').val()
  };

  console.log("customerObject",customerObject);


  if(record._id){
    Records.update({_id: record._id}, {$set: customerObject }, function(error, result){
      if(error) console.log(error);
      Router.go('/view/record/' + record._id);
    });
  }else{
    Records.insert(customerObject, function(error, result){
      if(error) console.log(error);
      Router.go('/view/record/' + result);
    });
  }
}
