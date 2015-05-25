(function(){Session.setDefault('elementSearchFilter', "");



Template.periodicTablePage.helpers({
  lists: function() {
    return Elements.find({
      name: {
        $regex: Session.get('elementSearchFilter'),
        $options: 'i'
    }});
  }
});

Template.periodicTablePage.events({
  'keyup #elementSearchInput': function() {
    Session.set('elementSearchFilter', $('#elementSearchInput').val());
  },
  "click .elementImage": function(event, template){
    Router.go('/upsert/element/' + this._id);
  }
});

})();
