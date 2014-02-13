## Antipatterns  

#### Mixing _id Types

Here's two examples of an antipattern that can burn you badly.  Mixing _id types.  In the following examples, we tried to have records in our collection that had both String and ObjectId as their _id types.   It was a recipe for many problems down the road.  Moral of the story:  pick an _id type and stick with it.  

````js
this.route('userProfileRoute', {
  path: '/user/:id',
  template: 'userProfilePage',
  before: function(){
    checkUserSignedIn(this);
  },
  waitOn: function(){
    Meteor.subscribe('settings');
    return Meteor.subscribe('usersDirectory');
  },
  data: function () {
    // ANTIPATTERN
    // this is hacky code to detect if we're using Strings or ObjectIds
    if(this.params.id.length < 18 ){
      return Meteor.users.findOne({_id: this.params.id});
    }else{
      return Meteor.users.findOne({_id: new Meteor.Collection.ObjectID(this.params.id)});
    }
  },
  after: function() {
    setPageTitle("User");
  }
});
````

We used the following in our Handlebar helpers to check if an object was a string or ObjectId.  Worked great... until it didn't.  
````js
// ANTIPATTERN
   if(this._id._str){
      return this._id._str;
    }else{
      return this._id;
    }
````
