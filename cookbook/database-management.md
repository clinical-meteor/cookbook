## Database Management  

===========================================
#### Analyzing An Inherited Database  

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


===========================================
#### Connect To A Database on *.meteor.com?**  

Try the ``--url`` flag!  It's quite simple actually.  The only tricky thing is that there's only a 60 second window to authenticate, and then the username/password randomly resets.  So be sure to have robomongo open and ready to configure a new connection when you run the command.  

````sh
# get the MONGO_URL string for your app  
meteor mongo --url $METEOR_APP_URL
````

===========================================
#### Download a Database from *.meteor.com?**  

Same thing as before, but you have to copy the info into the mongodump command.  You have to run the following commands rediculously fast, and it requires hand/eye coordination.  Be warned!  This is a rediculously hacky!  But fun!  Think of it as a video game!  :D

````sh
# get the MONGO_URL string for your app  
meteor mongo --url $METEOR_APP_URL

# then quickly copy all the info into the following command
mongodump -u username -p password --port 27017 --db meteor_app_url_com --host production-db-b1.meteor.io
````

===========================================
####  Export Data from local Meteor development instance?  

````sh
mongodump --db meteor
````

===========================================
#### Restore Data from a Dumpfile

````sh
# make sure your app is running
meteor

# then import your data
mongorestore --port 3002 --db meteor /path/to/dump
````


===========================================
#### Import a JSON File into Meteor

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

===========================================
#### Compact a Mongo Database on an Ubuntu Box

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

===========================================
#### Rotate Log Files on an Ubuntu Box

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
===========================================
#### Reset a Replica Set  
Delete the local database files.  Just exit the Mongo shell, navigate to the dbpath, and delete the local files.   


===========================================
#### Mongo Admin Interfaces

For internal development use, you may get some mileage out of Genghis, even though it's written in Ruby:  
http://genghisapp.com/   

You can also use the mongo command to connect to a remote instance on the meteor.com domain.
````
meteor mongo --url YOURSITE.meteor.com
````

But for scalable production use, get yourself to MongoHQ.    
http://www.mongohq.com/  

Also, the Mongo Monitoring Service, from 10Gen, the makers of Mongo:  
https://mms.10gen.com/user/login


===========================================
#### Import Data into a Mongo Database  

````js
// download mongodb from 10gen, and start a stand-alone instance
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

===========================================
#### Meteor Local Mongo Log Files 

They're not easily accessible.  If you run the 'meteor bundle' command, you can generate a tar.gz file, and then run your app manually.  Doing that, you should be able to access the mongo logs... probably in the .meteor/db directory.  

If you really need to access mongodb log files, set up a regular mongodb instance, and then connect Meteor to an external mongo instance, by setting the MONGO_URL environment variable:  
````
MONGO_URL='mongodb://user:password@host:port/databasename'
````

Once that's done, you should be able to access logs in the usual places...  
````
/var/log/mongodb/server1.log
````

Also, people have been mentioning the following MONGO_URL parameters as being useful...   
````js
?autoReconnect=true
?replicaSet=meteor
````

