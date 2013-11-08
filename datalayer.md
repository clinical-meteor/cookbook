------------------------------------------------------------------
## DATABASES

**Q: Does Meteor support SQL?**  
No.  

**Q: When will Meteor support SQL?**  
Hopefully not any time soon, even though it's on the roadmap.  It's a mistake for Meteor to natively support SQL.

**Q: Why is that?  Why doesn't Meteor support SQL, the most common database on the internet?**  
The problem with introducing other databases, such as SQL and such, are the database management layers between the database and serving up the javascript objects ready to be used. Other than trivial single-table database examples, supporting SQL will require an ORM to map tables together during JOINS and to produce the necessary javascript objects for the templates. Which sort of completely defeats the purpose of using Mongo in the first place. Nobody on the core Dev team wants those headaches of supporting an SQL/ORM layer, and it breaks the philosophy of javascript-everywhere.  But don't take my word for it. Here are some nice articles on ORMs and the perception that they are the 'Vietnam War' of computer science. Meteor is specifically architected to avoid ORM headaches.

http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html  
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx  
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html

**Q: Well, how am I suppose to use the data in my SQL database then?**  
Through REST interfaces.  We put the ORM __outside__ of Meteor, as part of the interface.  So, the trick is to move your data from your SQL database into Meteor's Mongo database, and have Mongo act as an object store.

http://stackoverflow.com/questions/10452431/how-do-you-make-a-rest-api-and-upload-files-in-meteor/13871399#13871399  
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/   
https://groups.google.com/forum/#!searchin/meteor-talk/Re$3A$20Using$20meteor$20as$20JSON$20sink/meteor-talk/M7h-GbKNS88/9v1WxlwtL2kJ  

Populating the underlying Mongo collections via REST calls is pretty straight forward, and uses Meteor to it's fullest potential.  Between different projects, I've verified using REST to insert and update documents into Mongo collections, and then Meteor to reactively update to underlying inserts and changes into the database.  Dror is right that the publication hooks are important to take care of.  Not difficult for simple new documents inserted into collections; but requires a bit more finess when updating fields of existing documents.

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
Nope.  It's basically the same issue as supporting SQL databases.  There would need to be some type of ORM mapping layer, which would totally gum up the works.

**Q:  When will see support for SQL, Postgress, CouchDB, Redis, etc?**  
Of the different databases you mention, CouchDB would probably be the easiest to add full native support for; followed by Redis (which I'm looking forward to seeing support for).  Postgres has the same general problems of needing an ORM that other flavors of SQL have to deal with.  And, as mentioned above, not only does it introduce an extra layer of ORM, it introduces an entire extra language to support... SQL.  One of the entire philosophical goals behind Meteor is to have a single language across client, server, and database.  Mongo's interface is written in Javascript.  Which streamlines and simplifies development.  SQL not so much. 


**Q:  Are there any recommended admin interfaces for MongoDB?**  
For internal development use, you may get some milage out of Genghis, even though it's written in Ruby:  
http://genghisapp.com/   

You can also use the mongo command to connect to a remote instance on the meteor.com domain.
````
meteor mongo --url YOURSITE.meteor.com
````

But for scalable production use, get yourself to MongoHQ.    
http://www.mongohq.com/  

Also, the Mongo Monitoring Service, from 10Gen, the makers of Mongo:  
https://mms.10gen.com/user/login


**Q: How do you import data into the Mongo database?**  

````js
// download mongodb from 10gen, and start a stand-along instance
mongod

// import the json data into a staging database
// jsonArray is a useful command, particularly if you're migrating from SQL
mongoimport -d staging -c assets < data.json --jsonArray
 
// navigate to your application
cd myappdir
 
// run meteor and initiate it's database
meteor
 
// connect to the meteor mongodb
meteor mongo --port 3002
 
// copy collections from staging database into meteor database
db.copyDatabase('staging', 'meteor', 'localhost');
 
// shut down the staging database
Ctrl-C
````

**Q: Where does a Meteor app store its mongodb log files?**  
They're not easily accessible.  If you run the 'meteor bundle' command, you can generate a tar.gz file, and then run your app manually.  Doing that, you should be able to access the mongo logs... probably in the .meteor/db directory.  

If you really need to access mongodb log files, set up a regular mongodb instance, and then connect Meteor to an external mongo instance, by setting the MONGO_URL environment variable:  
````
MONGO_URL='mongodb://user:password@host:port/databasename'
````

Once that's done, you should be able to access logs in the usual places...  
````
/var/log/mongodb/server1.log
````

**Q:  How should I go about designing my collections?**  
Well, instead of telling you what you ought to do; how about I tell you how I go about designing *my* collection schemas.  I've been working with Mongo for a couple years now, and document oriented database for maybe 8 years now.  There are few rules I use nowdays when designing data storage collections:

1.  Don't do data modeling in the database.  
2.  Do a careful analysis of the most commonly used queries in your application instead.   
3.  Collection schemas should be designed for optimizing server/client communications.  
4.  Therefore, collections should reflect the types of queries the application is going to perform.  
5.  If its not worth storing a billion records, odds are that it doesn't actually need to be a collection.   
6.  Collections with just 2 or 3 fields, or only a few dozen records are suspicious in the Mongo world.  
7.  If a table is so small it can be converted into an enum, do so.    
8.  Consolidate and merge tables.  
9.  Think in terms of document schemas, rather than table schemas.  
10.  Table schemas should be about performance.  
11.  Document schemas are where you want to do your data modeling.  

**Q:  How do I create a JOIN in Meteor?**  
Timeout.  You're still thinking in terms of normalizing data, not repeating yourself, and creating a collection for each data table.  This is bad juju magic, and will cause bad application design.  Take a timeout and do some more research and reading before moving forward with your application.

**Q: I have a pre-existing SQL database, and simply must have an ORM**  
Well, you might want to check out Sails.js.  It looks like a very promising framework that has an ORM and is database agnostic.
http://sailsjs.org/#!

