Session.set("resize", null);
Session.setDefault('appHeight', $(window).height());
Session.setDefault('appWidth', $(window).width());
Session.setDefault("glassOpacity", .95);

FOO = "squee";
Session.set("foo", "squee");

Meteor.startup(function () {
  window.addEventListener('resize', function(){
    Session.set("resize", new Date());
    Session.set("appHeight", $(window).height());
    Session.set("appWidth", $(window).width());
  });
});




Session.setDefault('transparencyDivHeight', 100);
Session.setDefault('transparencyDivLeft', 0);




//==================================================================================================

Template.appLayout.onRendered(function(){
  Template.appLayout.delayedLayout(100);
  Template.appLayout.delayedLayout(1000);
});


Template.appLayout.helpers({
  resized: function () {
    Template.appLayout.layout();
  },
  getStyle: function () {
    return parseStyle({
      "left": Session.get('transparencyDivLeft') + "px;",
      "height": Session.get('transparencyDivHeight') + "px;"
    });
  }
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

//==================================================================================================

Template.registerHelper("getOpacity", function(){
  return "opacity: " + Session.get("glassOpacity") + ";";
});


//==================================================================================================




parseStyle = function(json){
  var result = "";
  $.each(json, function(i, val){
    result = result + i + ":" + val + " ";
  });
  return result;
}
