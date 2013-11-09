**Q:  How do I import a JSON file into Meteor?**   

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

