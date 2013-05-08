unofficial-meteor-faq-extended
==============================


Additional sections to add to the unofficial-meteor-faq


------------------------------------------------------------------
### Meteor Logo

The CloudBees NodeJS logo:  
https://d3ko533tu1ozfq.cloudfront.net/clickstart/nodejs.png

------------------------------------------------------------------
### Terminology


------------------------------------------------------------------
## DEVELOPMENT ENVIRONMENT

Q:  What are best practices for setting up my development environment?

There's no plan for Cloud9 to support Meteor later than 0.6.0, due to the NPM packaging system.
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13c49334f501e4b3

That means WebSphere.


Q:  My editor keeps crashing!  Help!
A:  Add the .meteor directory to your ignore list.  

````
.meteor
````


------------------------------------------------------------------
## Installation

###Mac OSX
Q:  Is there a Homebrew installer for Mac OSX?    
https://gist.github.com/4317935

### Windows  
http://win.meteor.com/

Q:  When will Windows version become a first class citizen?  
https://trello.com/card/official-windows-support/508721606e02bb9d570016ae/11  
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d9453041fae6aa  

### Rasberry Pi  
http://www.badgersblog.co.uk/2012/12/nodejs-raspberry-pi-tutorial-1.html  
https://groups.google.com/forum/#!msg/meteor-talk/CcXzU14EHH8/3wvB-d1RfaAJ  

------------------------------------------------------------------
### Uninstalling Meteor

````
sudo rm /usr/local/bin/meteor
rm -rf ~/.meteor
````




------------------------------------------------------------------
## UNSORTED, UNEDITED

Q:  Is jQuery a core package?  
A:  Sortof.  It's a dependency of Spark, and is included in pretty much all core applications.  


Q:  move back to clean-css instead of uglify?


DDP Acryonym
- Distributed Data Protocol
- Dynamic Data ...

CSS Transitions
Check out LiveJS as a possible solution:
https://github.com/q42/livejs



## Templates
**Supported**
- jade
- blade

**Unsupported**
- dust 

------------------------------------------------------------------
### Collections
 
save()
- https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13beeebb2d9a9622

count()
````
MyCollection.find(selector, options).fetch().length()
````
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d7b8e6aa025958  

------------------------------------------------------------------
### User Model

user.username
user.emails[] {address, verified}
user.profile.name

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.

------------------------------------------------------------------
### File Uploads

https://gist.github.com/dariocravero/3922137

http://collectionfs.meteor.com/

------------------------------------------------------------------
### Unit Testing
- BrowserStack (official)
- jenkins 
- jasmine
- phantomjs
- mocha -


------------------------------------------------------------------
### How to make 3rd-party-librar.js work with Meteor?

What's probably going on is that a) the Timeline object itself is being destroyed when the reactive templates get re-rendered; and b) if it does manage to render anything, the reactive simply write over the rendering.  

Given my testing with other libraries, I'm almost certain TimelineJS will need to go into a #constant region.  Here is some pseudo code that may help:

````js
Template.templateWithConstantRegion.rendered = function(){
    self.node = self.find("#timelineObject");
    if (! self.handle) {
        self.handle = Meteor.autorun(function(){
            Timeline();            
        });
    };
};
````

You'll also want to check for var comments in your library, like so:
````
var createStoryJS = function ()
````

### Meteor.Device


### Meteor.settings

- 

------------------------------------------------------------------
### Running Devel Branch of Meteor
git checkout devel

Q: Preserving templates across pages?
A: Appcache

------------------------------------------------------------------
### Adding 'somelibrary.js' as a smartpackage?

This is a rephrasing of 'how to build a smartpackage'.  



------------------------------------------------------------------
### Content Delivery Networks (CDN)
https://trello.com/card/speed-up-improve-app-loading/508721606e02bb9d570016ae/47


------------------------------------------------------------------
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

https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d528e41f3739e6

- First and foremost, make sure to use an IDE that supports refactoring javascript.  I recommend using WebStorm.  Think more organically, and try to grow your application, rather than engineer it.  Discover the correct syntax through refactoring, rather than assume a 'best practices' approach or try to force Meteor to work like an object-oriented framework.  Meteor is a different breed of framework, and simply works differently than object-oriented LAMP stacks.  If you're not familiar with refactoring... perhaps it's time to get into the practice?  

- Be aggressive about offloading object structure into less files, when possible.  Contrary to the statements above, @import is supported in Meteor. Use media classes, mixins, variables, and class hierarchies in less, when possible.  You can implement some semblence of namespaces and dependency loading with .less.  And the more functionality that is offloaded into CSS, that's less functionality that you have to manage in Javascript (sorry for the pun).  Offloading object structure into less files eliminated my namespacing and load-order difficulties by 40% or so.

-  Create a packages directory in the root directory, and refactor code out of your application into reusable modular packages.  Packages support some semblance of dependency tracking through the api.use() command.  You can create some semblance of javascript namespacing and dependency loading using packages.  This took care of another 40% of the problems with load ordering.

- Rethink your usage of objects, inheritance, and namespaces.  Javascript is a functional language, at its core.  In my experience, one gets way more milage out of creating Monads, rather than Classes.  Creating class hierarchies is a good way to get frustrated with Meteor.   Most of what you're trying to do with class inheritance, to create various types of widgets, can be done with a monad decorator pattern.  Generally speaking, the fewer objects you create on the heap, the happier you'll be.  

- Rethink what you know about MVC patterns, and what you have to do to implement them.   Generically speaking, HTML is for the (Document Object) Model, CSS is for the View, and Javascript is for the Controllers.  Meteor is already taking care of most of the plumbing and wiring.  Don't reimplement what already exists with Backbone, Angular, Ember, Knockout, or any of the other MVC frameworks.  All that functionality is already baked into Meteor.  Learn to use the existing feature set.

- Embrace the global scope through the use of Session.get() and Session.set(), complex_session_variable_names, and camelCaseSyntax.  Once you get accustomed to doing things like Session.set('current_page', '#profilePage') and Session.get('is_sidebar_visible') in the global scope, the entire framework becomes *sooo* much simpler to use. 

- Also, if you get into the habit of creating complex function names like toggleSessionObjects(objectId), rather than abbreviated names like tog(o), you can safely and comfortably use the global namespace for javascript functions without worrying about name collisions.  That really helps in reducing problems with load ordering.

- And finally, I recommend not using the filesystem as a namespace for Classes, as you may be accustomed to in object-oriented frameworks.  Use the filesystem as a namespace for Workflow components instead...  pages, modaldialogs, importers, reports, etc.  I find that the workflow components namespace generally gets replicated three times... in the lib, stylesheets, and templates directories, respectively, and reflecting the MVC components.  When refactoring out a package, grab the appropriate file from each of the directories (ie. profile.html, profile.css, profile.js, for example), and put them into a single directory under the packages directory.  





------------------------------------------------------------------
## PRODUCTION ENVIRONMENT

Q:  Help!  Something broke in production!
- Did you check it with --debug?  There is a minification library that will parse your CSS and Javascript.  Check that it hasn't mangled your application by running your app with --debug.

Q:  How can I run Meteor behind a reverse proxy?  
A:  Monitor the activity of this thread:  
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13de0148a37cf58a  

### CloudBees ClickStart  
https://github.com/CloudBees-community/meteor-clickstart  

### Modulus.io  
http://blog.modulus.io/demeteorizer  
https://github.com/onmodulus/demeteorizer  

### Environment Variables

PORT
MONGO_URL
ROOT_URL
METEOR_SETTINGS



------------------------------------------------------------------
## Url Generation

````js
//http://mydomain.com
Meteor.absoluteUrl.defaultOptions.rootUrl = "http://mydomain.com"

//http://mydomain.com/foo
Meteor.absoluteUrl("/foo", {});

````

------------------------------------------------------------------
## PACKAGES


Q:  How do I create a package for distribution?


Q:  Is there package documentation?

Not yet.  But here's the gist of it:  
https://gist.github.com/awatson1978/4645762


------------------------------------------------------------------
## DATABASES

Q:  Does Meteor support SQL?

Also, thank you for sticking with the find() syntax on the client side.  And kudos for the Meteor.Table() syntax, rather than kludging things into Collections. I know that some people feel much more comfortable with SQL databases, and there's a lot of interest in having Meteor support SQL, so this is definitely a milestone.  

That being said, there are those of us who have very specific application requirements that require document oriented databases, and Meteor is one of the few funded frameworks around that provides a native Mongo framework.  There are many frameworks out there built around SQL and relational database frameworks.  Far fewer frameworks built around document oriented databases like Mongo.  So...  would hate to see one of the few frameworks natively designed to use Mongo get derailed and watered down by having to maintain backwards compatibility with legacy databases.  

Be that as it may, relational databases *do* do analytics and statistics better, so...  what the hell.  Yay SQL support?  

In the meantime, instead of spending resources building out an alternative to the client side find() command, could we (as a community, perhaps?) focus on promoting SQL to Mongo translation documentation and making it readily available and accessible to new devs and maybe in the official documentation?  Here are the best resources I've found:  

http://www.querymongo.com/
http://docs.mongodb.org/manual/reference/sql-comparison/
http://rickosborne.org/download/SQL-to-MongoDB.pdf

That may help the client side find() syntax be less of a limitation, and less onerous to new Meteor users accustomed to SQL.  At the same time, the SQL support provides Meteor with a nice pathway for statistics/analytics, while not borking the harmony of having the same query syntax on both server/client. 

Q:  Does Meteor support graph databases (Titan, Neo4J, etc)?

Q:  When will see support for SQL, Postgress, CouchDB, Redis, etc?
              

### Database Modeling
Whatever caused you to realize you can create an array of user ids as a field on the Feeds collection.... go with that.  That's the right approach.  What you were doing (even if you weren't entirely aware at the time), is you were starting to consolidate tables, and convert your table schema into a document schema.  And that's going to be the bulk of the learning curve.  Data relationships still exist.  They're simply encoded within document schemas, rather than table schemas.  And table schemas, or collection schemas as the case may be, are reserved for optimizing server/client response times.  Which means optimizing for query lookups.  
 
As far as the RSS Feed Reader, you could actually design it with just Feeds and Users collections, if you were willing to do network lookups of the feeds when you read them.  If you want to store the feeds locally, then adding Posts is necessary.  A billion Posts, a million Users, a million Feeds.  Three collections is all you really need.  

Generally speaking, you should be able to consolidate UserPosts into either the Posts or Users collection, or both.  The caveat being if you want to do many-to-many relationships.  If everybody can view a post, and everybody needs the ability to mark a post as a favorite or not, and a single post needs to keep track of a million favorites/likes, then an extra UserPosts type table might be necessary.  And you'd probably want to rename it to something along the lines of Likes or Favorites.  But if only a single person owns a post (ala email) and needs to mark it as favorite, consolidation is sufficient with Posts, Users, and Feeds.  If you're going for the generic multi-user approach where everybody can mark favorite, go with Posts, Users, Feeds, and Favorites.

### SQL Connectivity

REST Connectivity
http://stackoverflow.com/questions/10452431/how-do-you-make-a-rest-api-and-upload-files-in-meteor/13871399#13871399  
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/   
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13db6cfab8680f42  


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

skip/limit on the server
.slice() on the client. 


------------------------------------------------------------------
### Accounts

Facebook Icons
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d2c92723e3a31d  

Customized Accounts UI  
http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor  

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

------------------------------------------------------------------
### MVC Structures - Angular, Ember, Knockout, etc.


https://groups.google.com/forum/#!topic/meteor-talk/-JqCEBxi0_g


------------------------------------------------------------------
### Conditional Template Publishing

client/.admin

Server Side Rendering - Roadmap
https://trello.com/card/page-model-server-side-rendering-rest-endpoints/508721606e02bb9d570016ae/7




------------------------------------------------------------------
### MongoDB Administration

http://genghisapp.com/  
meteor mongo --url YOURSITE.meteor.com

http://www.mongohq.com/  

Importing a JSON datafile into a Meteor's Server-Side Mongo Collection  
https://gist.github.com/awatson1978/4625736


------------------------------------------------------------------
### Load Order
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d51078cfbdb349  

/client/lib/deepest/folder/libraryA.js  
/client/lib/deeper/libraryB.js  
/client/lib/libraryC.js  
/client/lib/main.js  
Meteor.startup();  


------------------------------------------------------------------
### Load Testing 

Using PhantomJS:  
https://gist.github.com/awatson1978/5139909

Load Testing on AWS:
https://groups.google.com/forum/?fromgroups=#!searchin/meteor-talk/load$20test/meteor-talk/BJXA1FRuTzU/M2e9pCH4es0J


------------------------------------------------------------------
### Server Side Sessions

http://stackoverflow.com/questions/15397609/meteor-session-replacement  


------------------------------------------------------------------
## Logging

Terminal Output Color
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13dcd5cbd7c03544


------------------------------------------------------------------
## Application Recipies

### HIPAA Compliant Application
- meteor add accounts-ui
- meteor add force-ssl
- mrt add hippa-audit-log

### Multi-Page Application
- mrt add router


------------------------------------------------------------------
## Resizing


