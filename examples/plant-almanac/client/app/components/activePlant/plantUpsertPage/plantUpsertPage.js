Session.setDefault('plantReadOnly', true);


Router.map(function(){
  this.route('newPlantRoute', {
    path: '/insert/plant',
    template: 'plantUpsertPage',
    onAfterAction: function(){
      Session.set('plantReadOnly', false);
    }
  });

});
Router.route('/upsert/plant/:id', {
  name: 'upsertPlantRoute',
  template: 'plantUpsertPage',
  data: function(){
    return Plants.findOne(this.params.id);
  },
  onAfterAction: function(){
    Session.set('plantReadOnly', false);
  }
});
Router.route('/view/plant/:id', {
  name: 'viewPlantRoute',
  template: 'plantUpsertPage',
  data: function(){
    return Plants.findOne(this.params.id);
  },
  onAfterAction: function(){
    Session.set('plantReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.plantUpsertPage.rendered = function(){
  Template.appLayout.layout();
};


Template.plantUpsertPage.helpers({
  isNewPlant: function(){
    if(this._id){
      return false;
    }else{
      return true;
    }
  },
  getLockIcon: function(){
    if(Session.get('plantReadOnly')){
      return "fa-lock";
    }else{
      return "fa-unlock";
    }
  },
  isReadOnly: function(){
    if(Session.get('plantReadOnly')){
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

Template.plantUpsertPage.events({
  'click #removePlantButton': function(){
    Plants.remove(this._id, function(error, result){
      if(result){
        Router.go('/list/plants');
      }
    });
  },
  "click #savePlantButton": function(){
    Template.plantUpsertPage.savePlant(this);
    Session.set('plantReadOnly', true);
  },
  "click .barcode": function(){
    // TODO:  refactor to Session.toggle('plantReadOnly')
    if(Session.equals('plantReadOnly', true)){
      Session.set('plantReadOnly', false);
    }else{
      Session.set('plantReadOnly', true);
      console.log('Locking the record...');
      Template.plantUpsertPage.savePlant(this);
    }
  },
  "click #lockPlantButton": function(){
    console.log("click #lockPlantButton");

    if(Session.equals('plantReadOnly', true)){
      Session.set('plantReadOnly', false);
    }else{
      Session.set('plantReadOnly', true);
    }
  },
  "click #plantListButton": function(event, template){
    Router.go('/list/plants');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/plants');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/plants');
  },
  'click #previewPlantButton':function(){
    Router.go('/customer/' + this._id);
  },
  'click #upsertPlantButton': function() {
    console.log('creating new Plants...');
    Template.plantUpsertPage.savePlant(this);
  }
});


Template.plantUpsertPage.savePlant = function(record){
  // TODO:  add validation functions

  var customerObject = {
    commonName: $('#plantTitleInput').val(),
    description: $('#plantDescriptionInput').val(),
    imageUrl: $('#plantImageUrlInput').val(),
    url: $('#plantUrlInput').val()
  };

  console.log("customerObject",customerObject);


  if(record._id){
    Plants.update({_id: record._id}, {$set: customerObject }, function(error, result){
      if(error) console.log(error);
      Router.go('/view/plant/' + record._id);
    });
  }else{
    Plants.insert(customerObject, function(error, result){
      if(error) console.log(error);
      Router.go('/view/plant/' + result);
    });
  }
}
