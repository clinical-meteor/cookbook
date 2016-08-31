## Auditing Collection Queries  

Add the following snippet to your code, and all of your queries will be logged to the server console in realtime.  

````js
Meteor.startup(		
  function () {		
    var wrappedFind = Meteor.Collection.prototype.find;		
	
    // console.log('[startup] wrapping Collection.find')		
   		
    Meteor.Collection.prototype.find = function () {		
      // console.log(this._name + '.find', JSON.stringify(arguments))		
      return wrappedFind.apply(this, arguments);		
    }		
  },		
	
  function () {		
    var wrappedUpdate = Meteor.Collection.prototype.update;		
	
    // console.log('[startup] wrapping Collection.find')		
   		
    Meteor.Collection.prototype.update = function () {		
      console.log(this._name + '.update', JSON.stringify(arguments))		
      return wrappedUpdate.apply(this, arguments);		
    }		
  }		
);		
````
