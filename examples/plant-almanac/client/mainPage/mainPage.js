
Template.mainPage.rendered = function(){
    Template.appLayout.layout();
}

Template.mainPage.events({
  "click #getTheDataButton": function(){
      Router.go('/export/plants');
  },
  "click #downloadJsonButton": function(){
    alert(EJSON.parse(Plants.find().fetch()).toString());
  }
});

Template.mainPage.helpers({

});
