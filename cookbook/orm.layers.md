#### Object Relational Mapping Layers

See the following thread on writing an ORM layer for your SQL database to expose JSON objects which MongoDB/Meteor can consume.  
[Reactive PostgreSQL to MongoDB transformation](https://groups.google.com/forum/#!topic/meteor-talk/_eemT_X1nbk)  

The trick is to A) write your ORM layer upstream of Meteor, rather than try to integrate it directly into core Meteor.


