## Reserved Keywords  


Be careful about using the following reserved keywords.  Meteor integrates a number of packages and libraries which extend the Javascript reserved keyword list.  Between Mongo and the Spark templates, people have reported having problems when using the following keywords in their applications.  

````
name
length
assets
template
match
stats
````

And some relevant links for people who would like to know more:

Template.foo.name  
https://github.com/meteor/meteor/issues/703  

collection.insert({ owner: Meteor.userId(), length:3 });  
https://github.com/meteor/meteor/issues/594#issuecomment-15441895  
