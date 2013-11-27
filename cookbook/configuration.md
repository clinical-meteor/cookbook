## Site Configuration  
A pattern for creating persistent site configuration.  

### /client

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


### /
This is isomorphic code that needs to be run in the app root, outside of the /client or /server directories.  
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


### /server 

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
      maintenance: false,
      bootCount: 0
    });
    console.info('Configuration file created: ' + configurationId);
  }
});

// server/publications.js
Meteor.publish("settings", function () {
  try{
    return Settings.find({keyword: 'sysadmin'}, {fields: {
      'name': true,
      'logo': true,
      'tagline': true,
      'installed': true,
      'live': true,
      'maintenance': true,
      'bootCount': true
    }});
  }catch(error){
    console.log(error);
  }
});
````

## Detecting if It's the First Time A Site Has Run

````js
// server/startup.js
Meteor.startup(function () {
  configurationSettings = Settings.find().fetch()[0];
  newBootCount = configurationSettings.bootCount + 1;
  Settings.update(configurationSettings._id, {$set: { bootCount: newBootCount }});

  if(configurationSettings.live){
    console.log('Success!  You're running a live site!');
  }else{
    console.log('Success!  You're running the site for the first time!  It's not live yet, however.');
    console.log('Please go to admin panel, and configure the site.');
  }
});
Meteor.methods({
  setSiteLive: function(){
    configurationSettings = Settings.find().fetch()[0];
    Settings.update(configurationSettings._id, {$set: { live: true }});
  }
});

````
