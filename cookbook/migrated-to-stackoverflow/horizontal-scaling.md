Horizontal Scaling
=========================================

[Oplog Observe Driver](https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver)  
[Meteor.js and MongoDB Replica Set for Oplog Tailing](http://www.manuel-schoebel.com/blog/meteorjs-and-mongodb-replica-set-for-oplog-tailing)  
[Meteor #10: Set up Oplog Tialing on Ubuntu](http://journal.gentlenode.com/meteor-10-set-up-oplog-tailing-on-ubuntu/)  
[Let's Scale Meteor - Using MongoDB Oplog](https://meteorhacks.com/lets-scale-meteor.html)  
[Tutorial: Scaling Meteor with MongoDB oplog tailing](http://blog.mongolab.com/2014/07/tutorial-scaling-meteor-with-mongodb-oplog-tailing/)  


=========================================
#### Connecting to an External Database with MONGO_URL

But if you're looking to do it yourself, you'll need to separate out your application layer from your database layer, and that means specifying the MONGO_URL.  Which means running your app through the bundle command, uncompressing it, setting environment variables, and then launching the project as a node app.  Here's how...  

````sh
#make sure you're running the node v0.10.21 or later
sudo npm cache clean -f
sudo npm install -g n
sudo n 0.10.21

# bundle the app
cd utility-collection-explorer
sudo mrt bundle collectionExplorer.tar.gz

# move the bundle to where it's going to be deployed; then unzip
mv collectionExplorer.tar.gz ..
cd ..
mv collectionExplorer deployParentDirectory
cd deployParentDirectort
gunzip collectionExplorer.tar.gz
tar -xvf collectionExplorer.tar.gz

# make sure fibers is installed, as per the README
rm -r programs/server/node_modules/fibers/
npm install fibers@1.0.1
export MONGO_URL='mongodb://192.168.0.38:27017/webusers'
export PORT='3000'
export ROOT_URL='http://thinaire.net'

# run the site
node main.js
````

===============================
#### Replica Set Configuration

Then go into the mongo shell and initiate the replica set, like so:

````
mongo

> rs.initiate()
PRIMARY> rs.add("mongo-a")
PRIMARY> rs.add("mongo-b")
PRIMARY> rs.add("mongo-c")
PRIMARY> rs.setReadPref('secondaryPreferred')
````


=========================================
#### Configuring a Replica Set to Use Oplogging

````sh
mongo

PRIMARY> use admin
PRIMARY> db.addUser({user:"oplogger",pwd:"YOUR_PASSWORD",roles:[],otherDBRoles:{local:["read"]}});
PRIMARY> show users
````


=========================================
#### Oplog Upstart Script

````sh
start on started mountall
stop on shutdown

respawn
respawn limit 99 5

script
    # our example assumes you're using a replica set and/or oplog integreation
    export MONGO_URL='mongodb://mongo-a:27017,mongo-b:27017,mongo-c:27017/meteor'

    # here we configure our OPLOG URL
    export MONGO_OPLOG_URL='mongodb://oplogger:YOUR_PASSWORD@mongo-a:27017,mongo-b:27017,mongo-c:27017/local?authSource=admin'

    # root_url and port are the other two important environment variables to set
    export ROOT_URL='http://myapp.mydomain.com'
    export PORT='80'

    exec /usr/local/bin/node /var/www/production/main.js >> /var/log/node.log 2>&1
end script
````


===============================
#### Sharding   

[Oplog Tailing on Sharded Mongo](https://groups.google.com/forum/#!topic/meteor-core/G_Hgca1xi_8)  
