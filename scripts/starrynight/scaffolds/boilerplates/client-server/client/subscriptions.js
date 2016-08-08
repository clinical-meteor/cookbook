Session.setDefault("recordId", null);

Meteor.subscribe("records", Session.get('recordId'));
Meteor.subscribe("allRecords");
