
Router.map(function(){
  this.route('plantExportPage', {
    path: '/export/plants',
    template: 'plantExportPage',
    data: function () {
      return Plants.find();
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.plantExportPage.rendered = function(){
  Template.appLayout.layout();
};


Template.plantExportPage.helpers({
  getPlantJson: function(){
    var jsonData = "";
    Plants.find().fetch().forEach(function(plant){
      jsonData += JSON.stringify(plant, null, 2);
    });
    //return jsonData.stringify();
    return jsonData;
  }
});


Template.plantExportPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/plants');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/plants');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/plants');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/plants');
  },
  "click .recordId": function(){
    Router.go('/upsert/plant/' + this._id);
  }
});
