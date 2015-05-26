Session.setDefault("fooId", null);

Meteor.subscribe("foo", Session.get('fooId'));
