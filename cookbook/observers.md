Observers  
===============================


If the Node event loop acts like a bicycle chain, the server-side collection observer is like a derailleur.  It's a gearing mechanism that is going to sit on the data collection as the data comes in.  It can be very performant, as all race bicycles have derailleurs.  But it's also a source for breaking the whole system.  It's a high speed reactive function, which can blow up on you.  Be warned.

````js
Meteor.startup(function(){
  console.log('starting worker....');

  var dataCursor = Posts.find({viewsCount: {$exists: true}},{limit:20});

  var handle = dataCursor.observeChanges({
    added: function (id, record) {
      if(record.viewsCount > 10){
         // run some statistics
         calculateStatistics();
         
         // or update a value
         Posts.update({_id: id}, {$set:{
           popular: true
         }});
         
      }
    },
    removed: function () {
      console.log("Lost one.");
    }
  });
});
````

Note the limit of 20 is the size of the derailleur....  how many teeth it has; or, more specifically, how many items are in the cursor as it's walking over the collection.  Be careful about using the 'var' keyword in this kind of function.  Write as few objects to memory as possibly, and focus on object reuse inside the ``added`` method.  When the opslog is turned on, and this thing is going full speed, it's a prime candidate for exposing nasty memory leaks if it's writing down objects onto the memory heap faster than the Node garbage collector is able to clean things up.


The above solution won't scale horizontally well, because each Meteor instance will be trying to update the same record.  So, some sort of environment detection is necessary for this to scale horizontally.  
