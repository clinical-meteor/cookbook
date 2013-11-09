
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
