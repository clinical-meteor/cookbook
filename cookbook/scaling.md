Scaling Quickstart with Platform as a Service
=========================================

Some background reading:

[Oblog Observe Driver](https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver)  
[Meteor.js and MongoDB Replica Set for Oplog Tailing](http://www.manuel-schoebel.com/blog/meteorjs-and-mongodb-replica-set-for-oplog-tailing)  
[Meteor #10: Set up Oplog Tialing on Ubuntu](http://journal.gentlenode.com/meteor-10-set-up-oplog-tailing-on-ubuntu/)  
[Let's Scale Meteor - Using MongoDB Oplog](https://meteorhacks.com/lets-scale-meteor.html)  
[Tutorial: Scaling Meteor with MongoDB oplog tailing](http://blog.mongolab.com/2014/07/tutorial-scaling-meteor-with-mongodb-oplog-tailing/)  


=========================================
#### Create Your Application  

Start by creating your application and running it.  

````sh
meteor create helloworld
cd helloworld
meteor
````


=========================================
#### Scaling the Application Layer (PaaS)

The first step in scaling your application is to separate the application layer from the database layer.  To do this, you need horizontal scaling, which is something that companies like Amazon, Modulus, and Heroku provide.  If you're looking for something quick and simple, try [Modulus.io](http://modulus.io):  

````
sudo npm install -g modulus

modulus login
modulus deploy
````

Once you get your application running on Modulus, simply deploy extra 2 or more server instances, and you'll have basic horizontal scaling at the application layer.

=========================================
#### Scaling the Databaes Layer (PaaS)

When your database grows to the point that you've outgrown the default Mongo instance provided by Modulus, you'll want to think about migrating your data to something that's sharded.  In that case, you'll want to point your MONGO_URL towards something Compose.io (formerly known as MongoHQ) or a similar service.

[app.compose.io (formerly MongoHQ)](https://www.compose.io/)

The same process applies here.  You'll simply want to deploy a second shard.  Deploying shards is a fairly involved process, as each one involves three servers.  And since most apps don't have terrabytes of data when they're starting out, it's difficult to test this.  So it's convenient to simply use a service that guarantees a scale-out path. 



