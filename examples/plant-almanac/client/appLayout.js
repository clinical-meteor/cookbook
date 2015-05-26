Session.set("resize", null);
Session.setDefault('appHeight', $(window).height());
Session.setDefault('appWidth', $(window).width());

Meteor.startup(function () {
  window.addEventListener('resize', function(){
    Session.set("resize", new Date());
    Session.set("appHeight", $(window).height());
    Session.set("appWidth", $(window).width());
  });
});




Session.setDefault('transparencyDivHeight', 100);
Session.setDefault('transparencyDivLeft', 0);


Meteor.startup(function(){
  Template.appLayout.layout();
});


//==================================================================================================

Template.appLayout.onRendered(function(){
  Template.appLayout.layout();
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
  Session.set('transparencyDivHeight', $('#innerPanel').height() + 80);
  console.log('appWidth', Session.get('appWidth'));
  if(Session.get('appWidth') > 768){
    Session.set('transparencyDivLeft', (Session.get('appWidth') - 768) * 0.5);
  }else{
    Session.set('transparencyDivLeft', 0);
  }
}



Template.appLayout.events({
  "click #homePageBadge": function(){
     Router.go("/");
  },
  "click #listBadge": function(){
     Router.go("/list/plants");
  },
  "click #tableBadge": function(){
     Router.go("/table/plants");
  },
  "click #backLeafBadge": function(event, template){
     Router.go("/grid/plants");
  }
});


//==================================================================================================




parseStyle = function(json){
  var result = "";
  $.each(json, function(i, val){
    result = result + i + ":" + val + " ";
  });
  return result;
}
