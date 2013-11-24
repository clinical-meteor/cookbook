A pattern for creating persistent site configuration.  

### Client

````js
// client/app.subscriptions.js
Session.setDefault('settingsLoaded', false);
Meteor.subscribe('settings', function(){
  Session.set('settingsLoaded',true);
  Session.set('systemConfigs', Settings.find().fetch()[0]);
});

// client/controllers/app.navbars.js
Template.navbarHeader.navbarTitle = function(){
  if(Session.get('settingsLoaded')){
    return Session.get('systemConfigs').name;
  }else{
    return 'Site not ready...';
  }
};
````

````html

<template name="navbarHeader">
  <nav id="navbarHeader" class="navbar navbar-default" role="navigation">
    <ul class="inline-group">
      <li>{{navbarTitle}}</a>
    </ul>
  </nav>
</template>
````


### Isomorphic

````js
// data.js or model.js file

Settings =    new Meteor.Collection("settings");

Settings.allow({
  insert: function(){
    return true;
  },
  update: function () {
    return true;
  },
  remove: function(){
    return true;
  }
});
````


### Server 

````js
// server/initialize.settings.js

Meteor.startup(function () {
  if (Settings.find().count() === 0) {
    console.info('no settings in database!  creating a configuration file.');

    var configurationId = null;

    // crate our administrator
    configurationId = Settings.insert({
      keyword: 'sysadmin',
      name: 'MySite',
      tagline: 'Witty tagline for site...',
      installed: false,
      live: false,
      maintenance: false
    });
    console.info('Configuration file created: ' + configurationId);
  }
});

// Publish site settings
Meteor.publish("settings", function () {
  try{
    return Settings.find({keyword: 'sysadmin'}, {fields: {
      'name': true,
      'logo': true,
      'tagline': true,
      'installed': true,
      'live': true,
      'maintenance': true
    }});
  }catch(error){
    console.log(error);
  }
});
````

