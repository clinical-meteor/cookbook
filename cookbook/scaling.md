Scaling Quickstart with Platform as a Service (PaaS)
=========================================

[Oblog Observe Driver](https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver)  
[Meteor.js and MongoDB Replica Set for Oplog Tailing](http://www.manuel-schoebel.com/blog/meteorjs-and-mongodb-replica-set-for-oplog-tailing)  
[Meteor #10: Set up Oplog Tialing on Ubuntu](http://journal.gentlenode.com/meteor-10-set-up-oplog-tailing-on-ubuntu/)  
[Let's Scale Meteor - Using MongoDB Oplog](https://meteorhacks.com/lets-scale-meteor.html)  
[Tutorial: Scaling Meteor with MongoDB oplog tailing](http://blog.mongolab.com/2014/07/tutorial-scaling-meteor-with-mongodb-oplog-tailing/)  


=========================================
#### Scaling the Application Layer (PaaS)

Okay, so you're starting to talk about separating your application layer from your database layer, and getting things ready for scale-out.  If you're looking for something quick and simple, try Modulus.io:  
http://blog.modulus.io/demeteorizer  
https://github.com/onmodulus/demeteorizer  

````
sudo npm install -g demeteorizer
sudo cd ~/path/myapp

sudo demeteorizer 
sudo modulus login
sudo modulus deploy
````

=========================================
#### Scaling the Databaes Layer (PaaS)


[app.compose.io](https://www.compose.io/)


