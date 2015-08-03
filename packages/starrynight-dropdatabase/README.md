## starrynight:helpers

Helper functions for StarryNight.  


======================================
#### Installation  

````
meteor add starrynight:helpers
````


===================================
#### Meteor Methods API  

````
dropCollection(databaseName)
dropCollections
dropDatabase
````

===================================
#### Example  

````
Template.foo.events({
  'click #clearAllDatabaseButton': function(){
    Meteor.call('dropDatabase');
  },
  'click #clearFooDatabaseButton': function(){
    Meteor.call('dropCollection', 'foo');
  }
});
````

===================================
#### Validation Example

````  
module.exports = {
  before: function ( client ){
    client
      .url('http://localhost:3000')
      .meteorCall('dropDatabase')
      .pause(1000);
  },
  "Example Walkthrough": function ( client ) {
    client
      .resizeWindow(1600, 1200)
      // do validation testing
      .end();
  },
````

===================================
#### Licensing

MIT.  Use as you will.
