Horizontal Scaling
=========================================

[Oblog Observe Driver](https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver)  
[Meteor.js and MongoDB Replica Set for Oplog Tailing](http://www.manuel-schoebel.com/blog/meteorjs-and-mongodb-replica-set-for-oplog-tailing)  
[Meteor #10: Set up Oplog Tialing on Ubuntu](http://journal.gentlenode.com/meteor-10-set-up-oplog-tailing-on-ubuntu/)  
[Let's Scale Meteor - Using MongoDB Oplog](https://meteorhacks.com/lets-scale-meteor.html)  
[Tutorial: Scaling Meteor with MongoDB oplog tailing](http://blog.mongolab.com/2014/07/tutorial-scaling-meteor-with-mongodb-oplog-tailing/)  


=========================================
#### Configuring a Replica Set to Use Oplogging

````sh
mongo

PRIMARY> use admin
PRIMARY> db.addUser({user:'oplogger',pwd:'YOUR_PASSWORD',roles:[],otherDBRoles:{local:["read"]}})
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
    export MONGO_URL='mongodb://mongo-a:27017,mongo-b:27017,mongo-c:27017/?replicaSet=meteor'

    # here we configure our OPLOG URL
    export MONGO_OPLOG_URL='mongodb://oplogger:YOUR_PASSWORD@mongo-a:27017,mongo-b:27017,mongo-c:27017/local?authSource=admin'

    # root_url and port are the other two important environment variables to set
    export ROOT_URL='http://myapp.mydomain.com'
    export PORT='80'

    exec /usr/local/bin/node /var/www/production/main.js >> /var/log/node.log 2>&1
end script
````

=========================================
#### Reading From a Secondary  


````sh
start on started mountall
stop on shutdown

respawn
respawn limit 99 5

script
    # our example assumes you're using a replica set and/or oplog integreation
    export MONGO_URL='mongodb://mongo-a:27017,mongo-b:27017,mongo-c:27017/?replicaSet=meteor&readPreference=secondaryPreferred'

    # here we configure our OPLOG URL
    export MONGO_OPLOG_URL='mongodb://oplogger:YOUR_PASSWORD@mongo-a:27017,mongo-b:27017,mongo-c:27017/local?authSource=admin'

    # root_url and port are the other two important environment variables to set
    export ROOT_URL='http://myapp.mydomain.com'
    export PORT='80'

    exec /usr/local/bin/node /var/www/production/main.js >> /var/log/node.log 2>&1
end script
````

