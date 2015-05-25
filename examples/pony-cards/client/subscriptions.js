Session.setDefault("fooId", null);

Meteor.subscribe("foo", Session.get('fooId'));
Meteor.subscribe("allFoos");
