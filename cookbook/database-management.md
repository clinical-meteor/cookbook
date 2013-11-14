**Q:  Help! I've inherited a Mongo database!  How do I analyze the Collections in it?**  

There's two great utilities you should check out.  First is variety.js, which will give you a great high-level overview.  Start with this one.  
https://github.com/variety/variety
````js
mongo test --eval "var collection = 'users'" variety.js
````

The second is schema.js, which will let you dig into the collections for more detail on the individual fields.  
http://skratchdot.com/projects/mongodb-schema/

````js
sudo mongo --shell schema.js 
````


**Q:  How do I download the live database from *.meteor.com?**  
Ask, and ye shall receive.  Check out this package...  
https://github.com/AlexeyMK/meteor-download  

**Q:  How do I import a JSON file into Meteor?**   

````js
// This gist is meant to help you load a json datafile into a Meteor application.  More specifically, it's useful to migrate or bootstrap a Mongo datacollection.
// The easiest way to do this task is to open up three command shell windows.  
// As a few of the commands will take over the command shell and direct their output to stdout.  


// first, export your data to a file
// data.json

// run mongod so we can create a staging database
// note that this is a separate instance from the meteor mongo and minimongo instances
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

//------------------------------------------------------------
// if your datafiles are a collection of json and bson objects 
// from a mongodump command, use the following

// run mongod so we can create a staging database
// note that this is a separate instance from the meteor mongo and minimongo instances
mongod

// import the test database from a mongodump
// http://docs.mongodb.org/v2.2/reference/mongorestore/
mongorestore --db test dump/test/

// navigate to your application
cd myappdir
 
// run meteor and initiate it's database
meteor
 
// connect to the meteor mongodb
meteor mongo --port 3002
 
// copy collections from staging database into meteor database
db.copyDatabase('test', 'meteor', 'localhost');
````
