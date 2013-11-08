## Meteor Style Guide    
The Meteor style guide is very useful and informative.  You should really read it.  It will help you write better applications.  
https://github.com/meteor/meteor/wiki/Meteor-Style-Guide  


## Terminology

**DDP - Distributed Data Protocol**  
This is simply the protocol that enables the Meteor.publish() and Meteor.subscribe() methods.  It does all the heavy lifting of data communications between the server and client.  
http://meteor.com/blog/2012/03/21/introducing-ddp  

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


## Reserved Keywords  

Be careful about the reserved keywords 'length' and 'name'.  They're used by the Spark templates and Mongo, respectively, and can cause unexpected problems in your application.  

Template.foo.name  
https://github.com/meteor/meteor/issues/703  

collection.insert({ owner: Meteor.userId(), length:3 });  
https://github.com/meteor/meteor/issues/594#issuecomment-15441895  




## Grammar  

**Semicolons**  
Obviously, everybody has their own opinions about grammar, and the Javascript specification (ECMA5 whatever) says that semicolons are option.  Fair enough.  But here's a reason to use semicolons:  eventmaps.

````js
// eventmap will fail
Template.topicsPage.events({
    'click .button':function(){
        console.count('initialize-rooms')   // note the missing semicolon
    }
})

// eventmap will run correctly
Template.topicsPage.events({
    'click .button':function(){
        console.count('initialize-rooms');
    }
})

````

**Variable and Function Names** 
Speaking of global contexts, when you bring variables into the global scope, err on the side of verbose names.  A rule-of-thumb I use is any varible in the local scope should be at least 6 characters long.  

````js
// bad!  creates unreadable code 
var f = 0;

// still too short 
var foo = 0;

// much better!
fooCount = 0;

// ideal
currentFooIndex = 0;
````

The reason behind wanting to use long variable names has to do with the entropic information density of longer strings, which leads to less name collissions.  This is particularly useful when refactoring.  Sometimes you'll want to do a global Find And Replace on just 'foo' eleemnts, or just 'count' elements, or just 'current' elements, etc.  Having long names will help in refactoring, and prevent name collissions.  Short, concise names are prone to causing name collisions.  Also this rule-of-thumb about name lengths applies to function names too.



