Router.route("/grid/plants", {
  template: "plantImageGridPage",
  name: "plantImageGridPage",
  onAfterAction: function(){
    Template.appLayout.layout();
  }
});


Template.plantImageGridPage.rendered = function(){
  Template.appLayout.delayedLayout(10);
}

Template.plantImageGridPage.helpers({
  lists: function() {
    return Plants.find({
      commonName: {
        $regex: Session.get('plantSearchFilter'),
        $options: 'i'
    }});
  }
});

Template.plantImageGridPage.events({
  'keyup #plantSearchInput': function() {
    Session.set('plantSearchFilter', $('#plantSearchInput').val());
  },
  "click .plantImage": function(event, template){
    Router.go('/upsert/plant/' + this._id);
  },
  "click .addPlantIcon": function(event, template){
    Router.go('/insert/plant');
  },
  "click .addNewPlant": function(event, template){
    Router.go('/insert/plant');
  }
});
