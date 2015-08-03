Session.setDefault('recordReadOnly', true);


Router.map(function(){
  this.route('newFooRoute', {
    path: '/insert/foo',
    template: 'recordUpsertPage',
    onAfterAction: function(){
      Session.set('recordReadOnly', false);
    }
  });

});
Router.route('/upsert/foo/:id', {
  name: 'upsertFooRoute',
  template: 'recordUpsertPage',
  data: function(){
    return Foo.findOne(this.params.id);
  },
  onAfterAction: function(){
    Session.set('recordReadOnly', false);
  }
});
Router.route('/view/foo/:id', {
  name: 'viewFooRoute',
  template: 'recordUpsertPage',
  data: function(){
    return Foo.findOne(this.params.id);
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
  isNewFoo: function(){
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
    Foo.remove(this._id, function(error, result){
      if(result){
        Router.go('/list/foos');
      }
    });
  },
  "click #saveRecordButton": function(){
    Template.recordUpsertPage.saveFoo(this);
    Session.set('recordReadOnly', true);
  },
  "click .barcode": function(){
    // TODO:  refactor to Session.toggle('recordReadOnly')
    if(Session.equals('recordReadOnly', true)){
      Session.set('recordReadOnly', false);
    }else{
      Session.set('recordReadOnly', true);
      console.log('Locking the record...');
      Template.recordUpsertPage.saveFoo(this);
    }
  },
  "click #lockFooButton": function(){
    console.log("click #lockFooButton");

    if(Session.equals('recordReadOnly', true)){
      Session.set('recordReadOnly', false);
    }else{
      Session.set('recordReadOnly', true);
    }
  },
  "click #fooListButton": function(event, template){
    Router.go('/list/foos');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/foos');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/foos');
  },
  'click #previewFooButton':function(){
    Router.go('/customer/' + this._id);
  },
  'click #upsertFooButton': function() {
    console.log('creating new foo...');
    Template.recordUpsertPage.saveFoo(this);
  }
});


Template.recordUpsertPage.saveFoo = function(record){
  // TODO:  add validation functions

  var customerObject = {
    title: $('input[name="title"]').val(),
    description: $('input[name="description"]').val(),
    imageUrl: $('input[name="imageUrl"]').val(),
    url: $('input[name="url"]').val()
  };

  console.log("customerObject",customerObject);


  if(record._id){
    Foo.update({_id: record._id}, {$set: customerObject }, function(error, result){
      if(error) console.log(error);
      Router.go('/view/foo/' + record._id);
    });
  }else{
    Foo.insert(customerObject, function(error, result){
      if(error) console.log(error);
      Router.go('/view/foo/' + result);
    });
  }
}
