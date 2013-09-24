## Terminology

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


## Reserved Keywords  

Be careful about the reserved keywords 'length' and 'name'.  They're used by the Spark templates and Mongo, respectively, and can cause unexpected problems in your application.  

Template.foo.name  
https://github.com/meteor/meteor/issues/703  

collection.insert({ owner: Meteor.userId(), length:3 });  
https://github.com/meteor/meteor/issues/594#issuecomment-15441895  



## Syntax  
(add description of .less syntax)  



I found that I spend far, far more time working about establishing the correct syntax of LESS/CSS classes, than ever worrying about MVC structure nowdays.  By doing so, you can create code like the following:

````html
<template name="userItemTemplate">
    <li class="rounded-corners user-card without-padding">
        <img class="card-image with gray-border" src="{{ userImage }}" />
        <div class="card-data">
            <div class="card-northwest gray card-meta-data without-padding barcode">*{{ _id }}*</div>
            <div class="card-northwest-secondary user-email bold">{{ userName }}</div>
            <ul class="card-southeast pictograph-buttons">
                <li class="{{isActiveCollaborator}} largish transfer-icon pictograph">o</li>
                <li class="{{isCollaborator}} largish collaborator-icon pictograph">a</li>
                <li class="{{isCarewatched}} largish carewatch-icon pictograph">j</li>
            </ul>
        </div>
    </li>
</template>
````

And once you get to larger applications, that kind of syntax will be not just invaluable, it will be essential, to managing application complexity.  Note how the classes are bordering on being pseudo-english sentences.  If you can structure your css/less classes in that manner, you'll be able to offload commonly used functionality to hardware accelerated code, manage it with dependencies and includes/imports, and keep your application syntax super easy to read and maintain.   



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



## Meteor Style Guide    
https://github.com/meteor/meteor/wiki/Meteor-Style-Guide  
