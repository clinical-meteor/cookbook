
Router.route('/', {
  template: "mainPage",
  name: "mainPage",
  onAfterAction: function(){
    Template.appLayout.delayedLayout(100);
  }
});


Template.mainPage.rendered = function(){
  Template.appLayout.delayedLayout(100);
};


Template.mainPage.events({
  'click #foalRegistration':function(){
    Router.go('/grid/foos');
  }
});

Template.mainPage.helpers({

});
