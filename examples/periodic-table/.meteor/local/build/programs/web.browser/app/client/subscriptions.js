(function(){Session.setDefault("ElementsId", null);

Meteor.subscribe("Elements", Session.get('ElementsId'));

})();
