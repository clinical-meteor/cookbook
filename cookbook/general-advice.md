## General Advice

Here are some general tips and advice on writing Meteor applications.

#### More Growing, Less Engineering
- Think more organically, and try to grow your application, rather than engineer it.  Discover the correct syntax through refactoring, rather than assume a 'best practices' approach or try to force Meteor to work like an object-oriented framework.  Meteor is a different breed of framework, and simply works differently than object-oriented LAMP stacks.  There's a bunch of concepts around functional programming and scoping that you're going to need to get accustomed to, and you'll find yourself constantly moving code around to fit into different scopes.  That moving of things around makes refactoring tools invaluable.  

    ````
    Use tools that support refactoring, such as WebStorm or Sublime3
    Alt-D is a super useful refactoring shortcut in Sublime and Atom for renaming things.  
    ```` 

#### Use Your CSS Preprocessor  
-  Meteor supports a number of CSS preprocessors, including LESS and SASS.  If you've never used a preprocessor before, be ready for a delightful surprise.  They're the bomb.  Be enthusiastic and generous in offloading anything you can into your CSS.  There's a lot of CSS that is GPU accelerated, which will make your entire project perform better.  Be aware that LESS can be used to create class inheritance structures.  And the @media statements are a key ingredient in creating mobile-ready sites.  And the more functionality that is offloaded into CSS, that's less functionality that you have to manage in Javascript.  Which will make your app run faster.

    ``meteor add less``.  


#### Reconcile Your MVC With Isomorphic Javascript 
- Keep an open mind to what you know about MVC patterns, and what you have to do to implement them.  Meteor is an isomorphic framework, meaning it uses Javascript on both the server and the client.  This is great!  But it turns out that, over the years, server-side developers and client-side developers have developed different interpretations of what MVC means.  Client side and business-level MVC patterns generally include styling and CSS in their understanding of a View, whereas server side MVC patterns generally don't.  So, those different understandings of what MVC is, they have to be reconciled.  Also, don't reimplement what already exists with Backbone, Angular, Ember, Knockout, or any of the other MVC frameworks.  All that functionality is already baked into Meteor.  Learn to use the existing feature set.
 
#### Application Global Scope  
- Meteor introduces an application global scope.  Embrace it through the use of Session.get() and Session.set(), complex_session_variable_names, and camelCaseSyntax.  Once you get accustomed to doing things like ``Session.set('current_page', '#profilePage')`` and ``Session.get('is_sidebar_visible')`` in the global scope, the entire framework becomes *sooo* much simpler to use.  Session keeps all of your variables in a reactive dictionary; so think of it as an API to a settings store.  Also, be aware that while Session variables, and variables declared without the ``var`` keyword are global to the application, they're not global throughout the entire Javascript machine.  They are a happy medium, where your variables are scoped correctly, and can be shared between files, but aren't truly global and will cause name collisions down the road.  

    ````js
    // a valid variable assignment that can be shared accross files
    foo = true; 
    
    // reactive session variables that can also be shared across files
    Session.set('is_sidebar_visible', true)

    // entropy rich function name that is unlikely to cause a name collission
    toggleSessionObjects(objectId);
    ````

#### Less Objects, More Functions 
- Rethink your usage of objects and inheritance.  Javascript is a functional language, at its core.  And, if you recall your functional programming, you'll remember that Monads are the functional equivalent to Classes.  Creating class hierarchies is a good way to get frustrated with Meteor.  You may be tempted to use Coffeescript because it supports Classes.  Just be aware that most of what you're trying to do with class inheritance, to create various types of widgets, can be done with a monad decorator pattern.  Generally speaking, the fewer objects you create on the heap, the less memory leaks you'll have; and the fewer class abstractions you have, the less speghetti code you'll have.  Less memory leaks and less speghetti code makes for happy developers.  So, for you own sake, go easy on classes and creating objects.  Instead, read up on monads, method chains, decorator patterns, and computation chains.  

    ````js
    // 1.  template helpers with reactive data contexts behave like monads
    Template.samplePage.getTitle = function(){
    
      // 3.  and contents of your function will run as monad-like computational side-effects
      setCanvasHeight();
      setCanvasWidth();
      drawCanvasObjects();
      
      // 2.  just connect the return value to a reactive session variable
      return Session.get('currentPageTitle');
    }
    ````

#### Use the Filesystem for Workflow Components  
- Don't use the filesystem as a namespace for Classes, as you may be accustomed to in object-oriented frameworks.  Use the filesystem as a namespace for Workflow components instead...  pages, modals, dialogs, importers, reports, etc.  I find that the workflow components namespace generally gets replicated three times... in the lib, stylesheets, and templates directories, respectively, and reflecting the MVC components.  When refactoring out a package, grab the appropriate file from each of the directories (ie. profile.html, profile.css, profile.js, for example), and put them into a single directory under the packages directory.  

#### Modularize Your Code  
- Create a ``/packages`` directory in the root directory, and refactor code out of your application into reusable modular packages.  If you're not familiar with maintaining larger, modularized applications, the general feel of it will be that of moving code between files, and moving files between directories.  You can use packages to create javascript namespaces and dependencies.

#### Everything is a List    
- At their core, computers only understand strings of 1s and 0s, which get turned into text strings.  And those text strings are parsed up into lists.  Add in the fact that Node.js is based on Javascript, which is based on ActionScript, which is based on Schema, which is based on Lisp, which is short for "List Processor"; and one will realize that the V8, the Node Virtual Machine, is basically an engine for parsing lists of strings.  Dig deep enough, and it all gets back to lists.  Objects are just lists of properties.  Arrays are lists of primatives.  Images are lists of pixels.  If you keep in mind 'everything is a list', you won't be 100% absolutely correct, but you'll be using a good heuristic and putting yourself in the right mindset to get a lot of good use out of Meteor.  

    ![image](http://imgs.xkcd.com/comics/lisp.jpg "Test")  

