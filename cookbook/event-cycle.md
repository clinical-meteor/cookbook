 
### The Event Cycle

Once people get their files loaded correctly, they'll then need to step into the Event Cycle, and start triggering events.  Unlike sequential imperative style programming, this style of programming involves an Application Event Loop that gets run.  Just think of it as the engine of your application.  The motor that's constantly turning and making your application run and your templates reactive.  But, unlike a simmple shells script or an imperative object-oriented program in C# or Java, our Meteor application is going to have parts of it that run over-and-over-and-over again, as part of our Event Cycle.

Different parts of your application will exist in different parts of the Event Cycle.  So, what does the Event Cycle look like?  Well, that's a difficult question.  The following is an imperfect representation, but it should get you started.   

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
        Template.foo.my_custom_field

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

But, if you navigate to a new page with the router, or press 'refresh', you'll close out templates, and it will look something like this:

````
A { B { C { D { E | E | E } C } B { C { D { E | E | E } B
````

Make sense?  What's happening here is that a Meteor application has four or five 'layers' or 'scopes' that it needs to create to get the reactive rendering templates working.  And each scope has instructions to create it's children scopes.  So, as a person navigates through their application, they'll be building up and tearing down templates, navigating pages, and the like, and people will be going up and down these scopes.  

If you're familiar with the OSI 7 Layer Model, it might help to think of the Event Cycle and templating engine in terms of going up and down a network protocol stack.  But, in this case, we're structuring the application UI around a 5 layer rendering stack.  
http://en.wikipedia.org/wiki/OSI_model  
http://www.soumyabrata.com/blog-images/osi-reference-model.png  

Also, be on the lookout for what I refer to the 'bubble templating'.  I don't know how exactly to explain this, but the closest thing I can think of is a bubble sort.  The reactive templates work on a similar bubbling principle.  It's a side affect of the javascript's functional programming paradigm, and works similar to how anonymous functions don't have an intrinsic ordering.  The result is that refreshes and new data just bubble up to the templates.  

The end result is that it works really well (I have *no* complaints about it, and never plan on going back, if I can help it), particularly when the templates are tied into Session variables.  But it's a very different approach than C, C#, ObjectiveC and Java.  Very different.  So don't worry about MVC in the traditional sense.  You won't be spending the weeks of drudgery doing plumbing and wiring like you're accustomed to.  And everything sitting in the global context... hasn't been an issue for me so far.  
