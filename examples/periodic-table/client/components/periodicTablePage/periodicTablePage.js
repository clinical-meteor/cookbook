Session.setDefault('elementSearchFilter', "");


Template.periodicTablePage.rendered = function(){
  Template.appLayout.delayedLayout(10);
}

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


function flipSurface(event, fview) {
  fview.parent.view.flip({ curve : 'easeOutBounce', duration : 500});
}
Template.flipper_front.famousEvents({ 'click': flipSurface });
Template.flipper_back.famousEvents({ 'click': flipSurface });
