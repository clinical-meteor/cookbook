Hi.  Welcome to my Meteor Cookbook, FAQ, and Tutorial, culled from about 6 months of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  

------------------------------------------------------------------
## Meteor Licensing and Branding

**Q:  Is there a Meteor logo?**  
Currently, there is no Meteor logo, but Cloudbees has been using a modified Nodejs logo, which works very nicely too:  
https://d3ko533tu1ozfq.cloudfront.net/clickstart/nodejs.png

**Q:  I heard Meteor is licensed under the GPL.  Will it be available under the MIT license?**  
Meteor is now available under the MIT license.  They switched licenses around version 0.4.0.

## Terminology

**Acroynms**  

**DDP - Distributed Data Protocol**  
This is simply the protocol that enables the Meteor.publish() and Meteor.subscribe() methods.  It does all the heavy lifting of data communications between the server and client.  
http://meteor.com/blog/2012/03/21/introducing-ddp  


**ORM - Object Relation Mapper**    
Something that the Meteor community doesn't like, related to SQL databases.  Most SQL table structures are designed with a Don't Repeat Yourself (DRY) principle, and create tables that isolate data so it's only entered into the database a single time.  This process is called normalization, and results in data tables that don't represent the data objects that are typically used in the application itself.  Thus, a layer is added above the database, which translates the normalized data into usable data objects for the application.  This mapping layer is the cause of countless problems, and is something Meteor has been architected without. 
http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html  
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx  
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html  

**REST - Representation State Transfer**  
When people talk about REST interfaces, they're talking about GET, POST, PUT, and DELETE commands that web browsers use to request data from a server.  
https://en.wikipedia.org/wiki/Representational_state_transfer

**Reserved Keywords**  
Be careful about the reserved keywords 'length' and 'name'.  They're used by the Spark templates and Mongo, respectively, and can cause unexpected problems in your application.  

Template.foo.name  
https://github.com/meteor/meteor/issues/703  

collection.insert({ owner: Meteor.userId(), length:3 });  
https://github.com/meteor/meteor/issues/594#issuecomment-15441895  






