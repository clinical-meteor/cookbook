Session.setDefault("userId", null);

Meteor.subscribe("allUsers", Session.get('userId'));
