unofficial-meteor-faq-extended
==============================


Additional sections to add to the unofficial-meteor-faq



------------------------------------------------------------------
## UNSORTED, UNEDITED

Q:  Is jQuery a core package?  
A:  Sortof.  It's a dependency of Spark, and is included in pretty much all core applications.  

### Collections
 
save()
- https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13beeebb2d9a9622

Q:  move back to clean-css instead of uglify?


DDP Acryonym
- Distributed Data Protocol
- Dynamic Data ...

CSS Transitions
Check out LiveJS as a possible solution:
https://github.com/q42/livejs


Unit Testing
- BrowserStack (official)
- jenkins 
- jasmine
- phantomjs

Templates
- jade
- blade

# User Model

user.username
user.emails[] {address, verified}
user.profile.name

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.

# File Uploads

https://gist.github.com/dariocravero/3922137

http://collectionfs.meteor.com/

### How to make 3rd-party-librar.js work with Meteor?

### Meteor.Device


### Meteor.settings

- 

### Running Devel Branch of Meteor
git checkout devel

Q: Preserving templates across pages?
A: Appcache

### Installing on X, Y, Z

Homebrew Meteor Installation  
https://gist.github.com/4317935

http://win.meteor.com/

### Adding 'somelibrary.js' as a smartpackage?

This is a rephrasing of 'how to build a smartpackage'.  

### Content Delivery Networks (CDN)
https://trello.com/card/speed-up-improve-app-loading/508721606e02bb9d570016ae/47


### Click/Touch Artifacts

````
.unselectable{
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
````

------------------------------------------------------------------
## Dyno Worker Processes

On the server side:
````js
function runSync(func) {
    var fiber = Fiber.current;
    var result, error;

    var args = Array.prototype.slice.call(arguments, 1);

    func.apply(undefined, [cb].concat(args));
    Fiber.yield();
    if (error) throw new Meteor.Error(500, error.code, error.toString());
    return result;

    function cb(err, res) {
        error = err;
        result = res;
        fiber.run();
    }
}
runSync(myFunction, arg1, arg2);

function myFunction(cb, arg1, arg2) {
    // do my async thing and then call cb(err, result);
}

````

And on the client side:
````
Meteor.call('myFunction', arg1, arg2, function(error, result) {
  this.unblock();
});

````

------------------------------------------------------------------
## Packages We Love


### Payments
https://atmosphere.meteor.com/package/stripe
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13cfcabb30e80135


### Date/Time
https://github.com/possibilities/meteor-moment

### Routing


------------------------------------------------------------------
## LOAD ORDERING


- First and foremost, make sure to use an IDE that supports refactoring javascript.  I recommend using WebStorm.  Think more organically, and try to grow your application, rather than engineer it.  Discover the correct syntax through refactoring, rather than assume a 'best practices' approach or try to force Meteor to work like an object-oriented framework.  Meteor is a different breed of framework, and simply works differently than object-oriented LAMP stacks.  If you're not familiar with refactoring... perhaps it's time to get into the practice?  

- Be aggressive about offloading object structure into less files, when possible.  Contrary to the statements above, @import is supported in Meteor. Use media classes, mixins, variables, and class hierarchies in less, when possible.  You can implement some semblence of namespaces and dependency loading with .less.  And the more functionality that is offloaded into CSS, that's less functionality that you have to manage in Javascript (sorry for the pun).  Offloading object structure into less files eliminated my namespacing and load-order difficulties by 40% or so.

-  Create a packages directory in the root directory, and refactor code out of your application into reusable modular packages.  Packages support some semblance of dependency tracking through the api.use() command.  You can create some semblance of javascript namespacing and dependency loading using packages.  This took care of another 40% of the problems with load ordering.

- Rethink your usage of objects, inheritance, and namespaces.  Javascript is a functional language, at its core.  In my experience, one gets way more milage out of creating Monads, rather than Classes.  Creating class hierarchies is a good way to get frustrated with Meteor.   Most of what you're trying to do with class inheritance, to create various types of widgets, can be done with a monad decorator pattern.  Generally speaking, the fewer objects you create on the heap, the happier you'll be.  

- Rethink what you know about MVC patterns, and what you have to do to implement them.   Generically speaking, HTML is for the (Document Object) Model, CSS is for the View, and Javascript is for the Controllers.  Meteor is already taking care of most of the plumbing and wiring.  Don't reimplement what already exists with Backbone, Angular, Ember, Knockout, or any of the other MVC frameworks.  All that functionality is already baked into Meteor.  Learn to use the existing feature set.

- Embrace the global scope through the use of Session.get() and Session.set(), complex_session_variable_names, and camelCaseSyntax.  Once you get accustomed to doing things like Session.set('current_page', '#profilePage') and Session.get('is_sidebar_visible') in the global scope, the entire framework becomes *sooo* much simpler to use. 

- Also, if you get into the habit of creating complex function names like toggleSessionObjects(objectId), rather than abbreviated names like tog(o), you can safely and comfortably use the global namespace for javascript functions without worrying about name collisions.  That really helps in reducing problems with load ordering.

- And finally, I recommend not using the filesystem as a namespace for Classes, as you may be accustomed to in object-oriented frameworks.  Use the filesystem as a namespace for Workflow components instead...  pages, modaldialogs, importers, reports, etc.  I find that the workflow components namespace generally gets replicated three times... in the lib, stylesheets, and templates directories, respectively, and reflecting the MVC components.  When refactoring out a package, grab the appropriate file from each of the directories (ie. profile.html, profile.css, profile.js, for example), and put them into a single directory under the packages directory.  



------------------------------------------------------------------
## DEVELOPMENT ENVIRONMENT

Q:  What are best practices for setting up my development environment?



------------------------------------------------------------------
## PACKAGES


Q:  How do I create a package for distribution?


Q:  Is there package documentation?


------------------------------------------------------------------
## DATABASES

Q:  Does Meteor support SQL?

Q:  Does Meteor support graph databases (Titan, Neo4J, etc)?

Q:  When will see support for SQL, Postgress, CouchDB, Redis, etc?
              

------------------------------------------------------------------
### Reserved Keywords

Template.foo.name
https://github.com/meteor/meteor/issues/703

collection.insert({ owner: Meteor.userId(), length:3 }); 
https://github.com/meteor/meteor/issues/594#issuecomment-15441895

------------------------------------------------------------------
### Pagination
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13df0f84a324826d
https://trello.com/card/pattern-for-easy-pagination/508721606e02bb9d570016ae/67

------------------------------------------------------------------
### Accounts - Facebook

https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d2c92723e3a31d

------------------------------------------------------------------
### Theming

````html
<template name="foo">
  <div class="{{current_theme_name}}">
    <span class="t1">hello</span>
  </div>
</template>
````

````
theme1 {
  t1 {background-color: black}
}
theme2 {
  t1 {background-color: red}
}
````

````
Template.foo.current_theme_name = function(){
  if(Session.get(current_theme_name){
    return "theme1";
  }else{
    return "theme2";
  }
}
````
