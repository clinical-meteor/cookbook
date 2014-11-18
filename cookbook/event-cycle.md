 
### The Event Cycle

Once people get their files loaded correctly, they'll then need to step into the Event Cycle, and start triggering events.  Unlike sequential imperative style programming, this style of programming involves an Application Event Loop that gets run.  Just think of it as the engine of your application.  The motor that's constantly turning and making your application run and your templates reactive.  Other people like to think of the event cycle as a bicycle chain, or a jet engine.  Whichever model you use, think of it as something that cycles over-and-over very fast.  And unlike simple shells script or imperative object-oriented program in C# or Java, our Meteor application is going to continuously run over-and-over-and-over again.

So, what does the Event Cycle look like?  The following is an imperfect representation, but should get you started with conceptualizing what's going on:   

````js
// A: meteor will startup
Meteor.startup();  

  // B: a page will load
  document.onload

    // C: templates be created
    Template.foo.created

      // D: and then rendered
      Template.foo.rendered

        // E: and filled in with data 
        Template.foo.my_custom_helper

    // C:  templates will finalize
    // we could also call this F, if we were doing things sequentially or imperatively
    // but we call it C to represent the functional scope we're in
    Template.foo.destroyed

  // B:  and, eventually, the document will unload
  // we could also call this G, if we were doing things sequentially or imperatively
  // but we call it B to represent the functional scope we're in
  document.onunload
  
// there is no matching Meteor.shutdown()
````

Basically, what happens is that the application will step through sequences A { B { C { D { E until the page templates are all rendered with data.  Once the application is running, the bulk of what Meteor does is refreshing D and E.  So, a typical application run might look like this:

````
A { B { C { D { E | E | E | E } D { E | E | E } D | D | D { E | E | E | E | E } B
````
See how ``A`` only gets run once?  And how the app spends a lot of time rendering ``E`` over and over?  And how it the majority of the time it never goes back to the B or C scope?  That's a normal pattern of how Blaze works to update page components while a person is clicking around on a user interface.  The application is in the template scope, and is happy to stay there.  (To use an automobile metaphore, it's in 5th gear, humming along on the highway.)

But what happens if you navigate to a new page, or press 'refresh'?  Templates will close out, and the event cycle will move out of the Template scope, and move into the Meteor or document scope.  

````
A { B { C { D { E | E | E } C } B { C { D { E | E | E } B
````

See how it move into the outer scopes ``B`` and ``C``?  This is similar to shifting down to 2nd or 3rd gear to make a turn in a car, and then accellerating back to 5th gear.  

What's happening here is that a Meteor application has four or five 'layers' or 'scopes' that it needs to create to get the reactive rendering templates working.  And each scope has instructions to create it's children scopes.  So, as a person navigates through their application, they'll be building up and tearing down templates, navigating pages, and the like, and people will be going up and down these scopes.  
 
### Event Cycle with Iron Router

When you add Iron Router, it will add event hooks to the event cycle, and change the rendering cycle to look like the following:  

````js
// A: meteor will startup
Meteor.startup();  

  // B: a page will load
  document.onload
   
   // C:  route rendering begins
   Router.onBeforeAction()

      // D: templates be created
      Template.foo.created
  
        // E: and then rendered
        Template.foo.rendered
  
          // F: and filled in with data 
          Template.foo.my_custom_helper

            // G: route rendering finished
            Router.onAfterAction()
  
      // D:  templates will finalize
      Template.foo.destroyed

  // B:  and, eventually, the document will unload
  document.onunload
  
// there is no matching Meteor.shutdown()
````


### Event Hooks  

You can extend the event-cycle even further with the excellent event-hooks and collection-hooks packages, which will extend the number of event hooks you have available to you.  It's much easier to build applications using hooks, rather than wiring things up to Template.foo.rendered callbacks.  Two highly recommended packages:  

Event Hooks  
https://atmosphere.meteor.com/package/event-hooks  

Collection Hooks  
https://atmosphere.meteor.com/package/collection-hooks    


