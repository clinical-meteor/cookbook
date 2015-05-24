Session.setDefault("plantId", null);

Meteor.subscribe("plant", Session.get('plantId'));
Meteor.subscribe("allPlants");
