Session.setDefault('resize', null);

Meteor.startup(function(){
  $(window).resize(function(evt) {
    Session.set('resize', new Date());
  });
});


Template.registerHelper('resize', function(){
  return Session.get('resize');
});
