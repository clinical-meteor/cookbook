## Aggregation  

#### Server Aggregation

http://stackoverflow.com/questions/18520567/average-aggregation-queries-in-meteor

http://stackoverflow.com/questions/15833488/is-it-possible-to-package-a-real-mongodb-library-for-use-on-the-server-side

#### Client Aggregation (Minimongo)  
https://github.com/utunga/pocketmeteor/tree/master/packages/mongowrapper  


#### Server Aggregation  
Andrew Mao's solution.  
http://stackoverflow.com/questions/18520567/average-aggregation-queries-in-meteor

````js
Meteor.publish("someAggregation", function (args) {
    var sub = this;
    // This works for Meteor 0.6.5
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    // Your arguments to Mongo's aggregation. Make these however you want.
    var pipeline = [
        { $match: doSomethingWith(args) },
        { $group: {
            _id: whatWeAreGroupingWith(args),
            count: { $sum: 1 }
        }}
    ];

    db.collection("server_collection_name").aggregate(        
        pipeline,
        // Need to wrap the callback so it gets called in a Fiber.
        Meteor.bindEnvironment(
            function(err, result) {
                // Add each of the results to the subscription.
                _.each(result, function(e) {
                    // Generate a random disposable id for aggregated documents
                    sub.added("client_collection_name", Random.id(), {
                        key: e._id.somethingOfInterest,                        
                        count: e.count
                    });
                });
                sub.ready();
            },
            function(error) {
                Meteor._debug( "Error doing aggregation: " + error);
            }
        )
    );
});
````


````js
------------
CLIENT
------------
 
Calories = new Meteor.Collection("calories")
 
Deps.autorun( ->
  try
    Meteor.subscribe('count_by_day', Meteor.user().services.facebook.email)
  catch err
    console.error 'subscribe calories'
)
 
Template.calories.totals = ->
  return Calories.find()
 
 
------------
SERVER
------------
 
require = Npm.require
path = require('path')
MongoDB = require('mongodb')
Future = require(path.join('fibers', 'future'))
 
Calendar = new Meteor.Collection("calendar")
 
Meteor.startup ->
  Calendar.aggregate = (pipeline) ->
    self = this
 
    future = new Future
    self.find()._mongo.db.createCollection(self._name, (err, collection) ->
      if err
        future.throw(err)
        return
 
      collection.aggregate(pipeline, (err, result) ->
        if err
          future.throw(err)
          return
 
        future.ret([true, result])
      )
    )
    
    result = future.wait()
    if !result[0]
      throw result[1]
 
    return result[1]
 
agg_cals = (email) ->
  project = 
    $project:
      email: 1
      ymd: 1
 
  match = 
    $match:
      "email": email
 
  group = 
    $group: 
      _id: "$ymd"
      numberOf:
        "$sum": 1
 
  data = Calendar.aggregate([project, match, group])
  console.log(data)
  return data
 
Meteor.publish('count_by_day', (email) ->
  self = this
  initializing = true
 
  handle = Calendar.find({email: email}).observeChanges(
    added: (id) ->
      if !initializing
        self.changed("calories", email, agg_cals(email))
    changed: (id) ->
      self.changed("calories", email, agg_cals(email))
  )
 
  initializing = false
  self.added("calories", email, agg_cals(email))
  self.ready()
 
  self.onStop( ->
    handle.stop()
  )
)
````

