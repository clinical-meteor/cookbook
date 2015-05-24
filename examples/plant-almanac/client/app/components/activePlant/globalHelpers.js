Template.registerHelper("getPlantSearchFilter", function(argument){
  return Session.get("plantSearchFilter");
});

Template.appLayout.layout = function(){
    Session.set('transparencyDivHeight', $('#innerPanel').height() + 40);
    if(Session.get('appWidth') > 768){
      Session.set('transparencyDivLeft', (Session.get('appWidth') - 768) * 0.5);
    }else{
      Session.set('transparencyDivLeft', 0);
    }
}
Template.appLayout.delayedLayout = function(timeout){
  Meteor.setTimeout(function(){
    Template.appLayout.layout();
  }, timeout);
}
