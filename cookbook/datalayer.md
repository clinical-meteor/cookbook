------------------------------------------------------------------
## DATABASES

**Q: Does Meteor support SQL?**  
Not officially.  

**Q: When will Meteor support SQL?**  
The position of the Meteor Cookbook is that it's a mistake for Meteor to natively support SQL.  So, hopefully not any time soon.  However, Meteor Cookbook is an unofficial resource, and MDG is going for widest possible appeal, so that means including SQL support.  If/when they do add SQL support, it's going to be a major big-ticket item that's going to likely take months to implement.  

In the meantime, there are some community packages for SQL support, which seems to be MDG's preferred solution for SQL support.  
https://github.com/numtel/meteor-mysql
https://atmospherejs.com/?q=sql

**Q: Why is that?  Why doesn't Meteor support SQL, the most common database on the internet?**  
The problem with introducing other databases, such as SQL, are the database management layers between the database and serving up the javascript objects ready to be used. Other than trivial single-table database examples, supporting SQL will require an ORM to map tables together during JOINS and to produce the necessary javascript objects for the templates. Which sort of completely defeats the purpose of using Mongo in the first place. Nobody on the core Dev team wants those headaches of supporting an SQL/ORM layer, and it breaks the philosophy of javascript-everywhere.  But don't take my word for it. Here are some nice articles on ORMs and the perception that they are the 'Vietnam War' of computer science. Meteor is specifically architected to avoid ORM headaches.

http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html  
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx  
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html

**Q: Well, how am I suppose to use the data in my SQL database then?**  
Through REST interfaces and/or exposing the SQL database as a JSON stream.  We put the ORM __outside__ of Meteor.  So, the trick is to move your data from your SQL database into Meteor's Mongo database, and have Mongo act as an object store or caching layer.

http://stackoverflow.com/questions/10452431/how-do-you-make-a-rest-api-and-upload-files-in-meteor/13871399#13871399    
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/   
https://groups.google.com/forum/#!searchin/meteor-talk/Re$3A$20Using$20meteor$20as$20JSON$20sink/meteor-talk/M7h-GbKNS88/9v1WxlwtL2kJ  

Populating the underlying Mongo collections via REST calls is pretty straight forward, and uses Meteor to it's fullest potential.  Using REST to insert and update documents into Mongo collections will cause your Meteor app to reactively update to underlying inserts and changes into the database.  

http://docs.mongodb.org/ecosystem/tools/http-interfaces/  
http://stackoverflow.com/questions/7386740/does-mongodb-has-a-native-rest-interface  
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/  

The reactive templates use a number of features that have to be addressed before alternate databases can be supported, the most important being native javascript objects in the data model.  Essentially, Mongo isn't just a 'document oriented database', it's also an object-oriented database, able to persistently store arbitrarily large javascript objects.  The reactive templates are wired up so as to use those javascript objects as-is, without any translation or modification.  This makes Meteor easy to program, very fast, very robust, and a data model to die for.

**Q: Okay, you got a plan.  How do I get started with translating SQL syntax into Mongo syntax?**  
Start with the following links.  They'll get you up to speed quickly.

http://www.querymongo.com/  
http://docs.mongodb.org/manual/reference/sql-comparison/   
http://rickosborne.org/download/SQL-to-MongoDB.pdf  

**Q:  Does Meteor support graph databases (Titan, Neo4J, etc)?**  
Not officially.  It's basically the same issue as supporting SQL databases.  There would need to be some type of ORM mapping layer, which would totally gum up the works.

**Q:  When will see support for SQL, Postgress, CouchDB, Redis, etc?**  
Of the different databases mentioned, ask which ones require an ORM mapping layer, and which ones can support native JSON objects.  Redis was the second official database to be supported.  CouchDB and PostgreSQL are probably next on the list.  CouchDB is very similar to Mongo, but is not widely used.  Postgres has the same general problems of needing an ORM that other flavors of SQL have to deal with; but does have a native JSON storage mode.  So that may help migrations.   And, as mentioned above, not only does it introduce an extra layer of ORM, it introduces an entire extra language to support... SQL.  One of the entire philosophical goals behind Meteor is to have a single language across client, server, and database and writing isomorphic APIs.  Mongo's interface is written in Javascript.  Which streamlines and simplifies development.  SQL is it's own language (Structured Query Language) and steps away from the concept of isomorphic APIs and single-language frameworks.  So that needs to be worked through.


**Q:  How do I create a JOIN in Meteor?**  
Timeout.  You're still thinking in terms of normalizing data, not repeating yourself, and creating a collection for each data table.  This is a bad data model for NoSQL based applications.  Take a timeout and do some more research and reading before moving forward with your application.

**Q:  Seriously.  How do I do a JOIN in Meteor?**  

Each collection cursor has a half dozen or so query functions... ``find()``, ``findOne()``, ``insert()``, ``update()``, ``upsert()``, ``remove()``.   They're going to happen whenever you query more than one collection within a function.  So, in the following ``getComments`` function, we join the Posts and Comments collection.  The function blocks for ~20ms to ~50ms on the Posts lookup, then blocks again for another ~20ms to ~50ms for the Comments lookup.  We also wind up writing the ``posts`` variable on the memeory heap.  This will get cleaned up by the garbage collector.  But in high volume usage, this will cause a performance bottleneck similar to a memory leak, and will eventually blow up.  This type of join doesn't scale well.

````js
Template.singlePost.helpers({
  getComments: function(){
    var posts = Posts.findOne({_id: Session.get('selectedPost'});
    return Comments.find({_id: {$in: posts.comments }});
  }
});
````
**Q:  So, what do you suggest?  Putting all those comments into the Posts object? **   
Yup.  That's exactly what you should do.  Think in terms of query patterns and what kind of object you want to receive.  Store the object as you want to receive it.  Already mapped and assembled.  

**Q:  But isn't that going to require updating points of data all over the place? **   
Yup.  A great solution is to use the [collection-hooks](https://atmospherejs.com/matb33/collection-hooks) package, and to implement an AuthoritativeCollection pattern using the ``after.insert``, ``after.update``, and ``after.remove`` hooks.  

**Q:  How do I create a reactive JOIN in Meteor?**  
You're just aren't paying attention, are you?  Ah well.  Good luck with that.   
https://atmospherejs.com/reywood/publish-composite

**Q: I have a pre-existing SQL database, and simply must have an ORM**  
Well, you might want to check out Sails or Ember.  Sails is a very promising framework that has an ORM and is database agnostic.  And Ember is a mature framework at this point.  

http://sailsjs.org  
http://emberjs.com/

**Q: Why are you so anti-SQL?**  

Imagine that you're working in a hospital.  Imagine that patient Jane Doe is brought into the emergency room who's been in a car wreck.  And that they have no ID on them, and somebody is shouting at you that "THEYRE IN THE SYSTEM.  BUT WE CANT FIND THEIR RECORDS.  WE HAVE TO GET TO THE OR.  WHATS THEIR BLOOD TYPE???".  And you have approximately 5 to 10 minutes to write an ad-hoc query to find their medical records adn blood type.  You don't know this yet, but Jane Doe recently got married and the reason nobdoy can find her records is because her name has been changed.  Or her medical insurance has expired.  Or a dozen other reasons.  Regardless, you have 5 to 10 minutes to write an ad-hoc database query while people are shouting at you.  In SQL.  

No thank you.  I've had that experience.  And it's why I quit doing healthcare IT support for Oracle/SQL based systems, such as Cerner, Merge, Amicas, OsiriX, and the like.  And it's why I develop in Meteor nowdays.  

