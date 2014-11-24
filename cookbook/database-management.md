## Database Management  

**Q:  Help! I've inherited a Mongo database!  How do I analyze the Collections in it?**  

There's two great utilities you should check out.  First is variety.js, which will give you a great high-level overview.  Start with this one.  
https://github.com/variety/variety
````js
mongo test --eval "var collection = 'users'" variety.js
````

The second is schema.js, which will let you dig into the collections for more detail on the individual fields.  
http://skratchdot.com/projects/mongodb-schema/

````js
mongo --shell schema.js 
````


**Q:  How do I download the live database from *.meteor.com?**  
Ask, and ye shall receive.  Check out this package...  
https://github.com/AlexeyMK/meteor-download  

**Q:  How do I export the data from my Meteor development instance?**  

````sh
mongodump --db meteor
````

**Q:  How do I restore the data from a dump?**  

````sh
# make sure your app is running
meteor

# then import your data
mongorestore --port 3002 --db meteor /path/to/dump
````



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

mongorestore --port 3002 --db test dump/test/
````

**Q:  How can I compact a Mongo database?**  

Some research on the Mongo preallocation...  
http://stackoverflow.com/questions/2966687/reducing-mongodb-database-file-size  
http://stackoverflow.com/questions/9473850/mongo-prealloc-files-taking-up-room   

````js
// compact the database from within the Mongo shell
db.runCommand( { compact : 'mycollectionname' } )

// repair the database from the command line
mongod --config /usr/local/etc/mongod.conf --repair --repairpath /Volumes/X/mongo_repair --nojournal

// or dump and re-import from the command line
mongodump -d databasename
echo 'db.dropDatabase()' | mongo databasename
mongorestore dump/databasename
````

**Q:  How do I rotate log files?**  

Some links...  
http://stackoverflow.com/questions/5004626/mongodb-log-file-growth  
http://docs.mongodb.org/manual/tutorial/rotate-log-files/  

Log files can be viewed with the following command...
````js
ls /var/log/mongodb/
````

But to set up log-file rotation, you'll need to do the following...  
````js
// put the following in the /etc/logrotate.d/mongod file
/var/log/mongo/*.log {
    daily
    rotate 30
    compress
    dateext
    missingok
    notifempty
    sharedscripts
    copytruncate
    postrotate
        /bin/kill -SIGUSR1 `cat /var/lib/mongo/mongod.lock 2> /dev/null` 2> /dev/null || true
    endscript
}

// to manually initiate a log file rotation, run from the Mongo shell
use admin
db.runCommand( { logRotate : 1 } )
````

**Q:  Ooops!  I messed up my replication set!  How do I reset it?**  
Delete the local database files.  Just exit the Mongo shell, navigate to the dbpath, and delete the local files.   

