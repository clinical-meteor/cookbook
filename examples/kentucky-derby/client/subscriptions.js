Session.setDefault("fooId", false);

Meteor.subscribe("foo", Session.get('fooId'));
