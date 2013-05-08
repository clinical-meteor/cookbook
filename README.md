------------------------------------------------------------------
## Meteor Logo

The CloudBees NodeJS logo:  
https://d3ko533tu1ozfq.cloudfront.net/clickstart/nodejs.png

------------------------------------------------------------------
## Terminology

DDP Acryonym
- Distributed Data Protocol
- Dynamic Data ...



------------------------------------------------------------------
## Development Environment

**Q:  What are best practices for setting up my development environment?**

There's no plan for Cloud9 to support Meteor later than 0.6.0, due to the NPM packaging system.
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13c49334f501e4b3

That means WebSphere.


**Q:  My editor keeps crashing!  Help!  **
A:  Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````

**Q:  Help!  I'm behind a proxy!  How can I install/run Meteor behind a reverse proxy?**  
A:  Generically speaking, you're going to need to update your environment variables in bash, like so:
````
// make sure your shell knows about your proxy
export http_proxy=http://your.proxy.server:port/

// install meteor manually
curl https://install.meteor.com | sh
````

Also, watch follow this issue:
https://github.com/meteor/meteor/pull/920


------------------------------------------------------------------
## Installation

### Mac OSX
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
  
insert()  
````
Todos.insert({
        text: text,
        gannt.dependency: dependency,
        gannt.parent: parent,
        list_id: Session.get('list_id'),
        done: false,
        timestamp: (new Date()).getTime(),
        tags: tag ? [tag] : []
      });
````

save()  
- https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13beeebb2d9a9622  

count()  
````
MyCollection.find(selector, options).fetch().length()
````
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d7b8e6aa025958  

searching()  
````
Meteor.publish('images', function (asset_title_search) {
    return Images.find({'title':{ $regex: asset_title_search, $options: 'i' }},{limit: 200});
});
````

https://github.com/lbdremy/solr-node-client


------------------------------------------------------------------
### User Profile

user.username
user.emails[] {address, verified}
user.profile.name

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.

Q:  How do I detect if another user is logged in?  
A:  https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13b63c5203f1d930  

------------------------------------------------------------------
### File Uploads

https://gist.github.com/dariocravero/3922137

http://collectionfs.meteor.com/

------------------------------------------------------------------
### Unit Testing
- BrowserStack (official)
- tiny-test (unofficially official)
- jenkins 
- jasmine
- phantomjs
- mocha 
- cucumberjs

http://blog.xolv.io/2013/04/unit-testing-with-meteor.html


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


------------------------------------------------------------------
### Meteor.settings

Meteor.settings.privateKey == "MY_KEY" 
Meteor.settings.public.publicKey == "MY_PUBLIC_KEY" 
Meteor.settings.public.anotherPublicKey == "MORE_KEY"

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
## Url and Path Generation

Meteor Methods  

````js
//http://mydomain.com
Meteor.absoluteUrl.defaultOptions.rootUrl = "http://mydomain.com"

//http://mydomain.com/foo
Meteor.absoluteUrl("/foo", {});

````

Node/Javascript Methods  
````
__meteor_bootstrap__.bundle.root  

process.mainModule.filename  
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


Populating the underlying Mongo collections via REST calls is pretty straight forward, and uses Meteor to it's fullest potential.  Between different projects, I've verified using REST to insert and update documents into Mongo collections, and then Meteor to reactively update to underlying inserts and changes into the database.  Dror is right that the publication hooks are important to take care of.  Not difficult for simple new documents inserted into collections; but requires a bit more finess when updating fields of existing documents.

http://docs.mongodb.org/ecosystem/tools/http-interfaces/
http://stackoverflow.com/questions/7386740/does-mongodb-has-a-native-rest-interface
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

The reactive templates use a number of features that have to be addressed before alternate databases can be supported, the most important being native javascript objects in the data model.  Essentially, Mongo isn't just a 'document oriented database', it's also an object-oriented database, able to persistently store arbitrarily large javascript objects.  The reactive templates are wired up so as to use those javascript objects as-is, without any translation or modification.  This makes Meteor easy to program, very fast, very robust, and a data model to die for.

The problem with introducing other databases, such as SQL and such, are the database management layers between the database and serving up the javascript objects ready to be used.  Other than trivial single-table database examples, supporting SQL will require an ORM to map tables together during JOINS and to produce the necessary javascript objects for the templates.  Which sort of completely defeats the purpose of using Mongo in the first place.  Nobody on the core Dev team wants those headaches of supporting an SQL/ORM layer, and it breaks the philosophy of javascript-everywhere.  

But don't take my word for it.  Here are some nice articles on ORMs and the perception that they are the 'Vietnam War' of computer science.  Meteor is specifically architected to avoid ORM headaches.

http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html

Of the different databases you mention, CouchDB would probably be the easiest to add full native support for; followed by Redis (which I'm looking forward to seeing support for).  Postgres has the same general problems of needing an ORM that other flavors of SQL have to deal with.  And, as mentioned above, not only does it introduce an extra layer of ORM, it introduces an entire extra language to support... SQL.  One of the entire philosophical goals behind Meteor is to have a single language across client, server, and database.  Mongo's interface is written in Javascript.  Which streamlines and simplifies development.  SQL not so much. 

Don't get me wrong.  I totally understand that real-world business use-cases often require backwards compatibility of legacy systems.  But that can be achieved with database-to-database communications, ala REST transactions, rather than adding an ORM layer to Meteor and moving away from the javascript-everywhere paradigm.  

Bottom line... all of my SQL interoperability plans right now are via direct SQL to Mongo interfaces via REST protocols.  I've had success with SQL to Mongo via HL7 interfaces, as well.    

### Schemas

So, taking a quick look at what you've posted, and having built out similar multi-user feed functionality in one of my own apps, I'd hazard to suggest that you're using too many collections, and still thinking in terms of normalizing data, not repeating yourself, and creating a collection for each data table.
Obviously, I don't know the application you're trying to build, but from what you've posted, I'd suggest taking a close, critical look at your UserFeeds collection and whether its necessary.  The reactivity of the mongo cursors is only going to work for the first Find(), so your pluck/fetch syntax is going to break the reactivity, which is why it only works on refresh.  

UserPosts is obviously the type of data table that could have a billion records, so it should definitely be converted into a collection.  Same too with Feeds; one could imagine a million or a billion feeds in an application.  But why UserFeeds?  Isn't a UserFeed a type of Feed?  If so, simply add a field to each record in the Fields collection to specify whether its a UserFeed or a NonUserFeed.  Alternatively, the UserFeed data may be a prime candidate for simply putting into the Meteor.Users collection, under the profile fields.

I've been working with Mongo for a couple years now, and document oriented database for maybe 8 years now.  There are few rules I use nowdays when designing data storage collections:

1.  Don't do data modeling in the database.  
2.  Design collections in terms of commonly used queries.   Collections should reflect the types of queries the application is going to perform.
3.  If its not worth storing a billion records, odds are that it doesn't actually need to be a collection.  

Are you explicitly creating an application to draw and graph network meshes of user relationships?  If not, your UserFeeds collection is probably over complicating the data storage modal.  It breaks rule number 2 above.  Unless you're specifically trying to map and graph many-to-many relationships, or implement some type of three-table tagging pattern, the UserFeeds table with just it's two fields is suspicious in the Mongo world.  

Anyhow, just my $0.02.

------------------------------------------------------------------
### Reserved Keywords

Template.foo.name
https://github.com/meteor/meteor/issues/703

collection.insert({ owner: Meteor.userId(), length:3 }); 
https://github.com/meteor/meteor/issues/594#issuecomment-15441895


------------------------------------------------------------------
### Pagination
The pattern seems to be to use $limit on the server, and $slice on the client.  

https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13df0f84a324826d  
https://trello.com/card/pattern-for-easy-pagination/508721606e02bb9d570016ae/67  

skip/limit on the server
.slice() on the client. 


------------------------------------------------------------------
### Accounts

Facebook Icons
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d2c92723e3a31d  

````
Basic Info > App Domains:  might-river-5358.herokuapp.com
Website with Facebook Login > Site URL:  http://might-river-5358.herokuapp.com
````

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

/client/lib/deepest/folder/library.js  
/client/lib/deeper/library.js  
/client/lib/library.js  
/client/library.js  
Meteor.startup();  
Template.foo.rendered
Template.foo.my_custom_field



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
### Resizing



------------------------------------------------------------------
### Template Controllers

How do I choose what way to run a function?  

1. Include {{foo}} in the "bar" template and then set up Template.bar.foo {...}.
2. Include {{foo}} in the "bar" template and set up Template.bar.helpers including "foo" {...}.
3. Include a Meteor.method of "foo" {...} on the client.

I always use # 1 by default.  When I find myself repeating a chunk of code repeatedly, I refactor and extract the duplicate code into a helper function, as per #2.  I only use #3 in the rare cases when I need the server to trigger something on the client (ie.  almost never; it's usually the other way around; methods on the server, not client).   $0.02


------------------------------------------------------------------
### Structuring Apps


Dependencies:  look into the packages.  If you haven't run across Meteorite and Atmosphere and the mrt command utility, do some research on those terms.  In the /usr/loca/meteor/packages directory, you'll find all the source code for the packages themselves, and take a gander at the package.js files.  Those, in conjunction with the 'meteor add package-name' syntax is how Meteor handles much of the dependency type stuff.  Of course, the dependency management requires that a package is built in the first place.  

Backbone.js:  Mostly redundant.  All of the MVC functionality is pretty much already there in the framework. To be perfectly blunt, Model is coded up in HTML, Controller is coded in Javascript, and View is coded up in CSS.  It's that simple.  If it helps, you may want to go into the /client directory, and create the following directory structure:

````
/client
/client/model/
/client/view/
/cleint/controllers/
````

It will work exactly the same as if you were to do the following structure: 

````
/client
/client/templates/
/client/stylesheets/
/cleint/libraries/
````

Or, more simply:

````
/client
/client/html/
/client/css/
/cleint/js/
````

Grab yourself the jQuery library with a 'meteor add jquery', and between jQuery and Meteor, you should have analogous helper functions to most all of what Backbone.js provides.  You're not going down a darkpath by mixing Meteor and MVC.  You're just... applying a redundant framework to what's already there.  Meteor is a communication platform.  But it also provides much of the MVC you're looking for.  

All I can say is this....  Meteor's Reactive framework is crazy amazing from the future, and I dare say that it's not going to behave quite like any other framework you've ever used.  Ditch some of the old worrying about MV* structure, and just go by the mantra that "Model is HTML, View is CSS, and Controller is Javascript".  When in doubt, refer back to that.  

Also, be on the lookout for what I refer to the 'bubble templating'.  I don't know how exactly to explain this, but the closest thing I can think of is a bubble sort.  The reactive templates work on a similar bubbling principle.  It's a side affect of the javascript's functional programming paradigm, and works similar to how anonymous functions don't have an intrinsic ordering.  The result is that refreshes and new data just bubble up to the templates.  

The end result is that it works really well (I have *no* complaints about it, and never plan on going back, if I can help it), particularly when the templates are tied into Session variables.  But it's a very different approach than C, C#, ObjectiveC and Java.  Very different.  So don't worry about MVC in the traditional sense.  You won't be spending the weeks of drudgery doing plumbing and wiring like you're accustomed to.  And everything sitting in the global context... hasn't been an issue for me so far.  

As far as dependencies and namespaces go....  this may sound weird, but as far as the dependencies go, my best recommendation would be to make sure you're using an IDE that supports refactoring (ie. invest in a copy of WebStorm).  What you're going to find is that you're going to find some functionality that gets reused between projects, and you'll want to carry that functionality between projects, which will require refactoring bits and pieces of code out into packages, and then defining dependencies in the package.js files.  

As for namespacing, just use the filesystem as a namespace.  Feel free to use multi dotted names like so:

````
/client/templates/page.home.html
/client/templates/page.profile.html
/client/templates/page.graph.html
/client/templates/page.error.pagenotfound.html
/client/templates/page.error.unknownbrowser.html
/client/templates/sidebar.inspection.html
/client/templates/sidebar.navigation.html
````

And go to town with creating namespaces.

Also, while talking about dependencies and 'how to use meteor', I'll mention this...  the Reactive Templates are really awesome, but as I mentioned... they bubble.  Sometimes that bubbling is fast, sometimes it's slow.  Moreover, it will break many 3rd party libraries.  

Countless discussions have already occurred with people trying to add Isotope.js, List.js, and similar libraries, which implement various 3rd party functionality.  Time and time again, people try to introduce an external library like Isotope.js or List.js, because it's class oriented and has a two important areas of functionality that they're interested in...  the first is for list management functionalities... sorting, searching, filtering, and the like.  The second being for a specific user interface.  A grid layout.  A swipe function.  Pagination.  etc.  

Meteor and mongo will take care of the first portion...  the sorting, searching, filtering.  And it will do it at it's own speed.  Usually blazingly fast, sometimes slowly, as things bubble through the templates.  However, you might still want to implement a bit of swipe functionality, or a grid layout and such.  Now, you may be accustomed to using javascript to implement those features.  The bubbling templates will break that approach, and cause things to get re-rendered.  You'll get flickering.  Instead, those features like grids and movement of elements want to be moved into CSS, where their state will persist through re-renders without flickering.  More importantly, all the hardware accelerated goodness is in the CSS, so if you want to offload processing from the core, and move it onto the GPU, you're going to need to use CSS.  That's important for mobile platforms, of course.  And it's the only way you'll get good animations is with the CSS, not through Javascript.

To bring things round back to dependencies, be sure to run 'meteor add less'.  If you haven't used a CSS precompiler, get ready to have a birthday present!  In particular, Meteor now supports the less @import command.  So, for any code that needs hardware acceleration, move it into your CSS, and use the @import command to manage dependencies.  In fact, you may want to set up some namespacing for syntax that gets reused, like so:

````
\client\stylesheets\syntax.custom.less
\client\stylesheets\syntax.fonts.less
\client\stylesheets\syntax.themes.less
\client\stylesheets\syntax.base.less
````

I found that I spend far, far more time working about establishing the correct syntax of LESS/CSS classes, than ever worrying about MVC structure nowdays.  By doing so, you can create code like the following:

````
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

Anyhow, HTML is model, CSS is view, and Javascript is the Controller.  ;-)
