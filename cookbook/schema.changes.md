Schema Changes
====================================

It's often necessary to run maintenance scripts on your database.  Fields get renamed; data structures get changed; features that you used to support get removed; services get migrated.  The list of reasons why you might want to change your schema is pretty limitless.  So, the 'why' is pretty self explanatory.  

The 'how' is a little more unfamiliar.  For those people accustomed to SQL functions, the following database scripts will look strange.  But notice how they're all in javascript, and how they're using the same API as we use throughout Meteor, on both the server and client.  We have a consistent API through our database, server, and client.  Once you learn the syntax, you'll never want to go back to SQL.


#### Add Record Version Field To All Records in a Collection
````js
db.posts.find().forEach(function(doc){
    db.posts.update({_id: doc._id}, {$set:{'version':'v1.0'}}, false, true);
});
````


#### Remove Array From Records In A Collection
````js
db.posts.find().forEach(function(doc){
    if(doc.arrayOfObjects){
        // the false, true at the end refers to $upsert, and $multi, respectively   
        db.accounts.update({_id: doc._id}, {$unset: {'arrayOfObjects': "" }}, false, true);
    }
});
````

#### Rename Collection
````js
db.originalName.renameCollection("newName );
````

#### Find Field Containing Specific String
With the power of regex comes great responsibility....
````js
db.posts.find({'text': /.*foo.*|.*bar.*/i})
````

#### Create New Field From Old Field
````js
db.posts.find().forEach(function(doc){
    if(doc.oldField){
        db.posts.update({_id: doc._id}, {$set:{'newField':doc.oldField}}, false, true);
    }
});
````

#### Pull Objects Out of an Array and Place in a New Field
````js
db.posts.find().forEach(function(doc){
    if(doc.commenters){
        var firstCommenter = db.users.findOne({'_id': doc.commenters[0]._id });
        db.clients.update({_id: doc._id}, {$set:{'firstPost': firstCommenter }}, false, true);
        
        var firstCommenter = db.users.findOne({'_id': doc.commenters[doc.commenters.length - 1]._id });
        db.clients.update({_id: doc._id}, {$set:{'lastPost': object._id }}, false, true);
    }
});
````


#### Blob Record From One Collection Into Another Collection (ie. Remove Join & Flatten Schema)
````js
db.posts.find().forEach(function(doc){
    if(doc.commentsBlobId){
        var commentsBlob = db.comments.findOne({'_id': commentsBlobId });
        db.posts.update({_id: doc._id}, {$set:{'comments': commentsBlob }}, false, true);
    }
});
````


#### make sure field exists
````js
db.posts.find().forEach(function(doc){
    if(!doc.foo){
        db.posts.update({_id: doc._id}, {$set:{'foo':''}}, false, true);
    }
});
````


#### make sure field has specific value
````js
db.posts.find().forEach(function(doc){
    if(!doc.foo){
        db.posts.update({_id: doc._id}, {$set:{'foo':'bar'}}, false, true);
    }
});
````

#### remove record if specific field is specific value
````js
db.posts.find().forEach(function(doc){
    if(doc.foo === 'bar'){
        db.posts.remove({_id: doc._id});
    }
});
````

#### change specific value of field to new value
````js
db.posts.find().forEach(function(doc){
    if(doc.foo === 'bar'){
        db.posts.update({_id: doc._id}, {$set:{'foo':'squee'}}, false, true);
    }
});
`````

#### unset specific field to null
````js
db.posts.find().forEach(function(doc){
    if(doc.oldfield){
        // the false, true at the end refers to $upsert, and $multi, respectively
        db.accounts.update({_id: doc._id}, {$unset: {'oldfield': "" }}, false, true);
    }
});
````

#### convert ObjectId to string
````js
db.posts.find().forEach(function(doc){
     db.accounts.update({_id: doc._id}, {$set: {'_id': doc._id.str }}, false, true);
});
````

#### convert field values from numbers to strings
````js
var newvalue = "";
db.posts.find().forEach(function(doc){
     if(doc.foo){
         newvalue = '"' + doc.foo + '"';
         db.accounts.update({_id: doc._id}, {$set: {'doc.foo': newvalue}});
     }
});
````

#### convert field values from strings to numbers
````js
var newvalue = null;
db.posts.find().forEach(function(doc){
     if(doc.foo){
         newvalue = '"' + doc.foo + '"';
         db.accounts.update({_id: doc._id}, {$set: {'doc.foo': newvalue}});
     }
});
````

#### create a timestamp from an ObjectID in the _id field
````js
db.posts.find().forEach(function(doc){
    if(doc._id){
        db.posts.update({_id: doc._id}, {$set:{ timestamp: new Date(parseInt(doc._id.str.slice(0,8), 16) *1000) }}, false, true);
    }
});
````

#### create an ObjectID from a Date object
````js
var timestamp = Math.floor(new Date(1974, 6, 25).getTime() / 1000);
var hex       = ('00000000' + timestamp.toString(16)).substr(-8); // zero padding
var objectId  = new ObjectId(hex + new ObjectId().str.substring(8));
````

#### find all the records that have items in a particular array  
what we're doing here is referencing the array index using dot notation  
````js
db.posts.find({"tags.0": {$exists: true }})
````


