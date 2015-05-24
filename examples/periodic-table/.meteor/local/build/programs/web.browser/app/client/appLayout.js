(function(){Session.set("resize", null);
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


//==================================================================================================
// FAMO.US

Transform = null;

FView.ready(function() {
  Transform = famous.core.Transform;

  // Famono: load famo.us shims and CSS
  famous.polyfills;
  famous.core.famous; // CSS
});

//==================================================================================================

Template.appLayout.rendered = function(){
  Template.appLayout.layout();
}

Template.appLayout.helpers({
  items: function(){
    return Elements.find();
  },
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
Template.appLayout.delayedLayout = function(timeout){
  Meteor.setTimeout(function(){
    Template.appLayout.layout();
  }, timeout);
}



Template.item.rendered = function() {
  var fview = FView.from(this);
  var Transform = famous.core.Transform; // see shortcut help below

  // "Fly in" animation (see examples/animations for more)
  fview.modifier.setTransform(
    Transform.translate(-500,-500)
  );
  fview.modifier.setTransform(
    Transform.translate(0,0),
    { duration : 1000, curve: 'easeOut' }
  );
}

//==================================================================================================




parseStyle = function(json){
  var result = "";
  $.each(json, function(i, val){
    result = result + i + ":" + val + " ";
  });
  return result;
}

})();
