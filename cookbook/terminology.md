## Terminology


**ACID - Atomicity, Consistency, Isolation, Durability**  
Generally speaking, when Meteor folks talk about ACID, they're talking about the fact that Mongo doesn't support traditional database transactions; they're not talking about the Acid2 browser compatibility tests.

**DDP - Distributed Data Protocol**  
This is simply the protocol that enables the Meteor.publish() and Meteor.subscribe() methods.  It does all the heavy lifting of data communications between the server and client.  
http://meteor.com/blog/2012/03/21/introducing-ddp  

**DDS - Data Distribution Service**  
A data distribution protocol that has nothing to do with Meteor.  It just happens to be named very similarly to DDP.  
http://en.wikipedia.org/wiki/Data_distribution_service  

**MDG - Meteor Development Group**  
Nickname for the wonderful folks who brought us Meteor.

**ORM - Object Relation Mapper**    
Something that the Meteor community doesn't like, related to SQL databases.  Most SQL table structures are designed with a Don't Repeat Yourself (DRY) principle, and create tables that isolate data so it's only entered into the database a single time.  This process is called normalization, and results in data tables that don't represent the data objects that are typically used in the application itself.  Thus, a layer is added above the database, which translates the normalized data into usable data objects for the application.  This mapping layer is the cause of countless problems, and is something Meteor has been architected without. 
http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html  
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx  
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html  

**REST - Representation State Transfer**  
When people talk about REST interfaces, they're talking about GET, POST, PUT, and DELETE commands that web browsers use to request data from a server.  
https://en.wikipedia.org/wiki/Representational_state_transfer  
http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm  





