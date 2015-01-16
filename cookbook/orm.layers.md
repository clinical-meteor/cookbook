#### Object Relational Mapping Layers

See the following thread on writing an ORM layer for your SQL database to expose JSON objects which can be stored in MongoDB and used by Meteor.  The trick is basically to write your ORM layer upstream of Meteor, rather than try to integrate it directly into core Meteor.

[Reactive PostgreSQL to MongoDB transformation](https://groups.google.com/forum/#!topic/meteor-talk/_eemT_X1nbk)  

Disclaimer:  Having been an Oracle/SQL admin for 15+ years, and having been having been burned countless times by ORMs, I'm rather against the idea of SQL support in Meteor and think it's generally a Very Bad Idea.  I'm 99% sure I won't be using it in applications I create from scratch.  

However, as many people have pointed, SQL is important for legacy support and backwards compatibility.  

And since it's still on the roadmap, I hope that MDG takes a close look at the [persistencejs](https://github.com/coresmart/persistencejs) and [squel.js](http://hiddentao.github.io/squel/) libraries.  Persistence and Squel both provide isomorphic APIs, and Persistence acts close to what might be considered a mini-sql analog of mini-mongo.  If we could fork those projects, and bring them into Meteor like Handlebars was forked and turned into Spacebars.... well, SQL integration might not be a complete disaster.  

Both persistence and Squel rely on Npm and Bower for their server/client installations respectively.  So, either somebody would need to create custom packages for them; or the issues surrounding wrapper libraries, npm/bower integration, etc need to be resolved.  

But once that's done, Squel could expose the SQL via Javascript, much like Mongo uses Javascript for it's shell.  Thus following Principle 1:  Pure Javascript.  Likewise, Persistence can not only create virtual collections on the client using sqlite or WebSQL, but it can work on the server acting as an ORM to external databases.  So, it could provide an isomorphic ORM on both server and client that's not too different than Mongo/minimongo.  Moreover, persistence.sync.js is JSON aware, which is pretty awesome, meaning it won't need to be completely rewritten to plug into DDP.  

But even if that was a best-case scenario, and it integrated seamlessly with the Meteor infrastructure...  it would still be akin to integrating OAuth or Selenium/PhantomJS or other big-ticket infrastructure items.  Meaning it's probably a 6 month process of integration, testing, documentation, etc.  It might get *started* in Q1 2015.  But finished?  My bet would be on Q3 or Q4 before all the dust really settles.

As much as I'm anti-SQL, I'm pro-Meteor and want to see it succeed.  If people are committed to SQL support, I'd say that Squel.js and Persistence.js are maybe the least-bad libraries out there right now, and most Meteor-centric. 
