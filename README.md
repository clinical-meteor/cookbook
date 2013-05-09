Hi.  Welcome to yet another unofficial Meteor FAQ and Tutorial, culled from about 6 months of emails and discussions from the [meteor] google group, and compiled the following FAQ and tutorial.  It's aimed at the user who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  

------------------------------------------------------------------
## Meteor Logo

Currently, there is no Meteor logo, but Cloudbees has been using a modified Nodejs logo, which works very nicely too:

The CloudBees NodeJS logo:  
https://d3ko533tu1ozfq.cloudfront.net/clickstart/nodejs.png

 
## Terminology

** Acroynms **  

DDP - Distributed Data Protocol  

**ORM - Object Relation Mapper**    
Something that the Meteor community doesn't like, related to SQL databases.  Most SQL table structures are designed with a Don't Repeat Yourself (DRY) principle, and create tables that isolate data so it's only entered into the database a single time.  This process is called normalization, and results in data tables that don't represent the data objects that are typically used in the application itself.  Thus, a layer is added above the database, which translates the normalized data into usable data objects for the application.  This mapping layer is the cause of countless problems, and is something Meteor has been architected without. 
http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html  
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx  
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html  

**REST - Representation State Transfer**  
When people talk about REST interfaces, they're talking about GET, POST, PUT, and DELETE commands that web browsers use to request data from a server.  
https://en.wikipedia.org/wiki/Representational_state_transfer

**Reserved Keywords**

Template.foo.name  
https://github.com/meteor/meteor/issues/703  

collection.insert({ owner: Meteor.userId(), length:3 });  
https://github.com/meteor/meteor/issues/594#issuecomment-15441895  



## Installation & Uninstallation

**Q:  Is there a Homebrew installer for Mac OSX?**  
Unofficially, yes.  It can be found here:  
https://gist.github.com/4317935

````
brew install https://gist.github.com/raw/4317935/05084353d3cd50acad7e88e01c3f6463b42c0ed3/meteor.rb
````

**Q:  Is there an MSI installer for Windows?**  
Unofficially, yes, but it's support has been discontinued for the time being.  It can be found here:  
http://win.meteor.com/

**Q:  When will Windows version become a first class citizen?**  
Not in the immediate future, as it's slated to be included after the 1.0 release.  In the meantime, it's recommended to use a virtual machine for development.  You can read the roadmap and relevant disscussions here:
https://trello.com/card/official-windows-support/508721606e02bb9d570016ae/11  
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d9453041fae6aa  

**Q:  Can Meteor run on Rasberry Pi?**  
Daaah... maybe?  People seem to be working on it, but not much success yet.
http://www.badgersblog.co.uk/2012/12/nodejs-raspberry-pi-tutorial-1.html  
https://groups.google.com/forum/#!msg/meteor-talk/CcXzU14EHH8/3wvB-d1RfaAJ  


**Q:  How do I install and use a development branch of Meteor?**  
There are two ways, depending if you're using meteor, or meteorite.  If using meteor:

````
cd
mkdir meteor.branchname
cd meteor.branchname
git clone https://github.com/username/meteor.git
cd <path to meteor project>
~/meteor.branchname/meteor/meteor
```` 
 
And, if you're using mrt:
````
{
  "meteor": {
    "meteor.branch": "branchname",
    "git": "https://github.com/username/meteor.git"
  }
}
````
**Q:  How do I uninstall Meteor?**  
No need to run scripts.  Just delete directories like so:  
````js
// the older location, pre 0.6.0
sudo rm /usr/local/bin/meteor

// the newer location, post 0.6.0
sudo rm -rf ~/.meteor
````



## Development Environment

**Q:  What are best practices for setting up my development environment?**  
Well, you're going to need to select an Integrated Development Environment (IDE), configure it so it works with Meteor, and set up debugging and profiling utilities.  See below.  

**Q:  Which editor should I use with Meteor?**  
Well, you're going to need to chose an IDE and editor to work with, the most popular of which seems to be Webstorm, since it's got the best refactoring tools.  
http://www.jetbrains.com/webstorm/  

As of Meteor 0.6.0, and it's new packaging system, Cloud9 support has become questionable.  Avoid it.  
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13c49334f501e4b3

Some people are also reporting success with Coda.  
http://panic.com/coda/


**Q:  My editor keeps crashing!  Help!**  
Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````

**Q:  Help!  I'm behind a proxy!  How can I install/run Meteor behind a reverse proxy?**  
This is a networking issue related to your operating system and local network topology, something that the Meteor Development Group doesn't really have any control over.  Some people have had success updating their bash environment variables, and running the installer with curl, like so:
````js
// make sure your shell knows about your proxy
export http_proxy=http://your.proxy.server:port/

// install meteor manually
curl https://install.meteor.com | sh
````

Also, watch follow this issue:  
https://github.com/meteor/meteor/pull/920



## Model, View, Controllers

**Q:  Can I add Ember into my Meteor Application?**  
Sure you could add Ember in, but dear lord, why?  Ember and Meteor are essentially the same. Saying "I want to use Ember in Meteor" is like saying, "I want to drive a Mazda in my Porche".  

**Q:  What about Angular.js?  Wouldn't Angular and Meteor work great together?**  
Ah...  so you want to drive a Ford in your Porche, instead.  Mmhmmm.  See the question above about Ember.  Angular.js is redundant.  Don't overcomplicate things with Ember.js, Angular.js, Knockout.js, or any of the other MVC frameworks.  When needed, Meteor will use Backbone.js for it's MVC.  

**Q:  How do I add MVC to my application?**  
The MVC pattern in Meteor is dead simple.  The Model is coded up in HTML, the Controller is coded in Javascript, and the View is coded up in CSS.  It's that simple.  Let's repeat that.  This time in bold:

**Model is HTML, View is CSS, and Controller is Javascript**  

Model      - HTML       - What It Is Displayed  
View       - CSS        - How It Is Displayed  
Controller - Javascript - When It Is Displayed  


## Routing

**Q: How do I generate URL paths? **  

````js
//http://mydomain.com
Meteor.absoluteUrl.defaultOptions.rootUrl = "http://mydomain.com"

//http://mydomain.com/foo
Meteor.absoluteUrl("/foo", {});
````




## Controller Libraries

**Q:  Is jQuery a core package?**  
Sortof.  It's a dependency of Spark, and is included in pretty much all core applications.  Assume it's a core package.

**Q:  I'm looking in myapp/.meteor/packages, and I don't see jQuery listed.  Why does my app act like it's loading jQuery?**  
Because it's a dependency of Spark.  It's a hidden dependency.  The myapp/.meteor/packages is not a definitive list of dependencies.  Just the most immediate dependencies.

**Q: How do I get 3rd-party-library.js work with Meteor?**  

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

### Load Ordering & Dependencies

Something that really trips people up a lot with Meteor is load ordering and dependencies, particularly if they're accustomed to sequential or imperative style programming (i.e. coming from object-oriented languages and frameworks). Roughly speaking, this is the best I can figure of the load ordering:

````js
// the bundling process output is such that libraries in the deepest directories will be loaded first  
/client/lib/deepest/folder/library.js  
/client/lib/deeper/library.js  
/client/lib/library.js  

// and libraries in the root directory will be loaded last
/client/library.js  

// meteor then bundles and deploys

// meteor will then startup
Meteor.startup();  

// a page will load
document.onload

// templates will render
Template.foo.rendered

// and fields will populate
Template.foo.my_custom_field

// and, eventually, the document will unload
document.onunload
````

Here are some tips and suggestions on managing load ordering and dependencies:

- First and foremost, make sure to use an IDE that supports refactoring javascript, such as WebStorm.  Think more organically, and try to grow your application, rather than engineer it.  Discover the correct syntax through refactoring, rather than assume a 'best practices' approach or try to force Meteor to work like an object-oriented framework.  Meteor is a different breed of framework, and simply works differently than object-oriented LAMP stacks.  There's this whole concept of scoping, and you'll find yourself constantly moving things around to fit into different scopes.  That moving of things around makes refactoring tools invaluable.  

- Be aggressive about offloading object structure into .less files, when possible.  The LESS precompiled supports @import statements, and can be used to create dependencies between files.  More importantly, CSS can be used to create class inheritance structures.  If you're inclined to use class inheritance, try doing it with CSS instead of Javascript.   And the more functionality that is offloaded into CSS, that's less functionality that you have to manage in Javascript (sorry for the pun). 

- Create a packages directory in the root directory, and refactor code out of your application into reusable modular packages.  Packages support some semblance of dependency tracking through the api.use() command.  You can create some semblance of javascript namespacing and dependency loading using packages.  This took care of another 40% of the problems with load ordering.

- Rethink your usage of objects, inheritance, and namespaces.  Javascript is a functional language, at its core.  In my experience, one gets way more milage out of creating Monads, rather than Classes.  Creating class hierarchies is a good way to get frustrated with Meteor.   Most of what you're trying to do with class inheritance, to create various types of widgets, can be done with a monad decorator pattern.  Generally speaking, the fewer objects you create on the heap, the happier you'll be.  

- Rethink what you know about MVC patterns, and what you have to do to implement them.   Generically speaking, HTML is for the (Document Object) Model, CSS is for the View, and Javascript is for the Controllers.  Meteor is already taking care of most of the plumbing and wiring.  Don't reimplement what already exists with Backbone, Angular, Ember, Knockout, or any of the other MVC frameworks.  All that functionality is already baked into Meteor.  Learn to use the existing feature set.

- Embrace the global scope through the use of Session.get() and Session.set(), complex_session_variable_names, and camelCaseSyntax.  Once you get accustomed to doing things like Session.set('current_page', '#profilePage') and Session.get('is_sidebar_visible') in the global scope, the entire framework becomes *sooo* much simpler to use. 

- Also, if you get into the habit of creating complex function names like toggleSessionObjects(objectId), rather than abbreviated names like tog(o), you can safely and comfortably use the global namespace for javascript functions without worrying about name collisions.  That really helps in reducing problems with load ordering.

- And finally, I recommend not using the filesystem as a namespace for Classes, as you may be accustomed to in object-oriented frameworks.  Use the filesystem as a namespace for Workflow components instead...  pages, modaldialogs, importers, reports, etc.  I find that the workflow components namespace generally gets replicated three times... in the lib, stylesheets, and templates directories, respectively, and reflecting the MVC components.  When refactoring out a package, grab the appropriate file from each of the directories (ie. profile.html, profile.css, profile.js, for example), and put them into a single directory under the packages directory.  


## Templates
**Q:  I want to use Jade/Blade/Dust as my templating engine.  Are they supported?**  
Why would you want to do this?  The Spark templates have had a lot of work put into them, and can basically do everything that Jade, Blade, and Dust can do, but better.  That being said, if you're hell-bent on replacing the default templating engine, a few people have reporting some success getting jade and blade working, and there are packages in Atmosphere, but nobody seems to have gotten dust working yet.  Of the three, Jade seems to have the best documentation and integration so far.  

Blade  
https://github.com/bminer/meteor-blade  

Jade  
https://github.com/SimonDegraeve/meteor-jade-handlebars  




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



### CSS Transitions  
Check out LiveJS as a possible solution:  
https://github.com/q42/livejs








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
## DATABASES

**Q: Does Meteor support SQL?**  
No.  

**Q: When will Meteor support SQL?**  
Hopefully not any time soon, even though it's on the roadmap.  It's a mistake for Meteor to natively support SQL.

**Q: Why is that?  Why doesn't Meteor support SQL, the most common database on the internet?**  
The problem with introducing other databases, such as SQL and such, are the database management layers between the database and serving up the javascript objects ready to be used. Other than trivial single-table database examples, supporting SQL will require an ORM to map tables together during JOINS and to produce the necessary javascript objects for the templates. Which sort of completely defeats the purpose of using Mongo in the first place. Nobody on the core Dev team wants those headaches of supporting an SQL/ORM layer, and it breaks the philosophy of javascript-everywhere.  But don't take my word for it. Here are some nice articles on ORMs and the perception that they are the 'Vietnam War' of computer science. Meteor is specifically architected to avoid ORM headaches.

http://www.codinghorror.com/blog/2006/06/object-relational-mapping-is-the-vietnam-of-computer-science.html  
http://blogs.tedneward.com/PermaLink,guid,33e0e84c-1a82-4362-bb15-eb18a1a1d91f.aspx  
http://nedbatchelder.com/blog/200606/the_vietnam_of_computer_science.html

**Q: Well, how am I suppose to use the data in my SQL database then?**  
Through REST interfaces.  We put the ORM __outside__ of Meteor, as part of the interface.  So, the trick is to move your data from your SQL database into Meteor's Mongo database, and have Mongo act as an object store.

http://stackoverflow.com/questions/10452431/how-do-you-make-a-rest-api-and-upload-files-in-meteor/13871399#13871399  
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/   
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13db6cfab8680f42  

Populating the underlying Mongo collections via REST calls is pretty straight forward, and uses Meteor to it's fullest potential.  Between different projects, I've verified using REST to insert and update documents into Mongo collections, and then Meteor to reactively update to underlying inserts and changes into the database.  Dror is right that the publication hooks are important to take care of.  Not difficult for simple new documents inserted into collections; but requires a bit more finess when updating fields of existing documents.

http://docs.mongodb.org/ecosystem/tools/http-interfaces/
http://stackoverflow.com/questions/7386740/does-mongodb-has-a-native-rest-interface
http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

The reactive templates use a number of features that have to be addressed before alternate databases can be supported, the most important being native javascript objects in the data model.  Essentially, Mongo isn't just a 'document oriented database', it's also an object-oriented database, able to persistently store arbitrarily large javascript objects.  The reactive templates are wired up so as to use those javascript objects as-is, without any translation or modification.  This makes Meteor easy to program, very fast, very robust, and a data model to die for.

**Q: Okay, you got a plan.  How do I get started with translating SQL syntax into Mongo syntax?**  
Start with the following links.  They'll get you up to speed quickly.

http://www.querymongo.com/  
http://docs.mongodb.org/manual/reference/sql-comparison/   
http://rickosborne.org/download/SQL-to-MongoDB.pdf  

**Q:  Does Meteor support graph databases (Titan, Neo4J, etc)?**  
Nope.  It's basically the same issue as supporting SQL databases.  There would need to be some type of ORM mapping layer, which would totally gum up the works.

**Q:  When will see support for SQL, Postgress, CouchDB, Redis, etc?**  
Of the different databases you mention, CouchDB would probably be the easiest to add full native support for; followed by Redis (which I'm looking forward to seeing support for).  Postgres has the same general problems of needing an ORM that other flavors of SQL have to deal with.  And, as mentioned above, not only does it introduce an extra layer of ORM, it introduces an entire extra language to support... SQL.  One of the entire philosophical goals behind Meteor is to have a single language across client, server, and database.  Mongo's interface is written in Javascript.  Which streamlines and simplifies development.  SQL not so much. 


**Q:  Are there any recommended admin interfaces for MongoDB?**  
For internal development use, you may get some milage out of Genghis, even though it's written in Ruby:  
http://genghisapp.com/   

You can also use the mongo command to connect to a remote instance on the meteor.com domain.
````
meteor mongo --url YOURSITE.meteor.com
````

But for scalable production use, get yourself to MongoHQ.    
http://www.mongohq.com/  

Also, the Mongo Monitoring Service, from 10Gen, the makers of Mongo:  
https://mms.10gen.com/user/login


**Q: How do you import data into the Mongo database?**  

````js
// download mongodb from 10gen, and start a stand-along instance
mongod

// import the json data into a staging database
// jsonArray is a useful command, particularly if you're migrating from SQL
mongoimport -d staging -c assets < data.json --jsonArray
 
// navigate to your application
cd myappdir
 
// run meteor and initiate it's database
meteor
 
// connect to the meteor mongodb
meteor mongo --port 3002
 
// copy collections from staging database into meteor database
db.copyDatabase('staging', 'meteor', 'localhost');
 
// shut down the staging database
Ctrl-C
````

**Q:  How should I go about designing my collections?**  
Well, instead of telling you what you ought to do; how about I tell you how I go about designing *my* collection schemas.  I've been working with Mongo for a couple years now, and document oriented database for maybe 8 years now.  There are few rules I use nowdays when designing data storage collections:

1.  Don't do data modeling in the database.  
2.  Design collections in terms of commonly used queries.   Collections should reflect the types of queries the application is going to perform.
3.  If its not worth storing a billion records, odds are that it doesn't actually need to be a collection.  
4.  Collections with just 2 or 3 fields, or only a few dozen records are suspicious in the Mongo world.
5.  Collection schemas should be designed for optimizing server/client communications.

**Q:  How do I create a JOIN in Meteor?**  
Timeout.  You're still thinking in terms of normalizing data, not repeating yourself, and creating a collection for each data table.  This is bad juju magic, and will cause bad application design.  Take a timeout and do some more research and reading before moving forward with your application.




              

### Database Modeling
Whatever caused you to realize you can create an array of user ids as a field on the Feeds collection.... go with that.  That's the right approach.  What you were doing (even if you weren't entirely aware at the time), is you were starting to consolidate tables, and convert your table schema into a document schema.  And that's going to be the bulk of the learning curve.  Data relationships still exist.  They're simply encoded within document schemas, rather than table schemas.  And table schemas, or collection schemas as the case may be, are reserved for optimizing server/client response times.  Which means optimizing for query lookups.  
 
As far as the RSS Feed Reader, you could actually design it with just Feeds and Users collections, if you were willing to do network lookups of the feeds when you read them.  If you want to store the feeds locally, then adding Posts is necessary.  A billion Posts, a million Users, a million Feeds.  Three collections is all you really need.  

Generally speaking, you should be able to consolidate UserPosts into either the Posts or Users collection, or both.  The caveat being if you want to do many-to-many relationships.  If everybody can view a post, and everybody needs the ability to mark a post as a favorite or not, and a single post needs to keep track of a million favorites/likes, then an extra UserPosts type table might be necessary.  And you'd probably want to rename it to something along the lines of Likes or Favorites.  But if only a single person owns a post (ala email) and needs to mark it as favorite, consolidation is sufficient with Posts, Users, and Feeds.  If you're going for the generic multi-user approach where everybody can mark favorite, go with Posts, Users, Feeds, and Favorites.













## Collections
  
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
### Pagination
The pattern seems to be to use $limit on the server, and $slice on the client.  

https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13df0f84a324826d  
https://trello.com/card/pattern-for-easy-pagination/508721606e02bb9d570016ae/67  

skip/limit on the server
.slice() on the client. 


------------------------------------------------------------------
### Accounts

**Q: Is there any documentation on the User Profile?**  

````
user.username  
user.emails[] {address, verified}  
user.profile.name  
````

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.

**Q:  How do I detect if another user is logged in?**  
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13b63c5203f1d930  

Facebook Icons
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d2c92723e3a31d  

````
Basic Info > App Domains:  might-river-5358.herokuapp.com
Website with Facebook Login > Site URL:  http://might-river-5358.herokuapp.com
````

Customized Accounts UI  
http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor  






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
### Load Testing 

Using PhantomJS:  
https://gist.github.com/awatson1978/5139909

Load Testing on AWS:
https://groups.google.com/forum/?fromgroups=#!searchin/meteor-talk/load$20test/meteor-talk/BJXA1FRuTzU/M2e9pCH4es0J


------------------------------------------------------------------
### Server 

**Q: How do I generate filepaths on the server? **  

````
__meteor_bootstrap__.bundle.root  

process.mainModule.filename  
````


**Server Side Sessions**  
http://stackoverflow.com/questions/15397609/meteor-session-replacement  

**Server Side Rendering - Roadmap**  
https://trello.com/card/page-model-server-side-rendering-rest-endpoints/508721606e02bb9d570016ae/7

**Terminal Output Color**
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13dcd5cbd7c03544



------------------------------------------------------------------
## PRODUCTION ENVIRONMENT

**Q:  Help!  Something broke in production!**  
- Did you check it with --debug?  There is a minification library that will parse your CSS and Javascript.  Check that it hasn't mangled your application by running your app with --debug.

**Q:  How do I deploy to Heroku?**  
Sadly, just don't.  Prior to 0.6.0, lots of people were using the Oortcloud Heroku Buildpack with much success.  As of 0.6.0, it seems to have broken, however.  And it's a moot point, because Heroku doesn't support Sticky Sessions, and won't scale up or support fail-over configurations.  Instead, use Meteor.com, CloudBees, or Modulus.io.
https://github.com/oortcloud/heroku-buildpack-meteorite

**Q:  Are there any cloud hosting providers that provide unit testing?**  
CloudBees provides a Meteor clickstart, software-as-a-service, unit testing, and continuous integration.  It's a bit klunky, but if you're worried about continuous integration, it's the one to choose:  
https://github.com/CloudBees-community/meteor-clickstart  

### Modulus.io  
http://blog.modulus.io/demeteorizer  
https://github.com/onmodulus/demeteorizer  

````
sudo npm install -g demeteorizer
sudo cd ~/path/myapp
sudo demeteorizer -n 0.8.15
sudo cd .demeteorized
sudo rm -rf ./server/node_modules/
sudo nano package.json
>    "sockjs": "0.3.4",
>    "websocket": "1.0.7",
>    "mongodb": "1.2.13",
>    "mailcomposer": "0.1.15"
sudo modulus login
sudo modulus deploy
````

### Environment Variables

PORT  
MONGO_URL  
ROOT_URL  
METEOR_SETTINGS  



------------------------------------------------------------------
### Meteor.settings

````
Meteor.settings.privateKey == "MY_KEY"  
Meteor.settings.public.publicKey == "MY_PUBLIC_KEY"   
Meteor.settings.public.anotherPublicKey == "MORE_KEY"  
````


------------------------------------------------------------------
### Content Delivery Networks (CDN)
https://trello.com/card/speed-up-improve-app-loading/508721606e02bb9d570016ae/47





------------------------------------------------------------------
### Refactoring

**Q:  How do I choose what way to run a function?**  

1. Include {{foo}} in the "bar" template and then set up Template.bar.foo {...}.
2. Include {{foo}} in the "bar" template and set up Template.bar.helpers including "foo" {...}.
3. Include a Meteor.method of "foo" {...} on the client.

I always use # 1 by default.  When I find myself repeating a chunk of code repeatedly, I refactor and extract the duplicate code into a helper function, as per #2.  I only use #3 in the rare cases when I need the server to trigger something on the client (ie.  almost never; it's usually the other way around; methods on the server, not client).   $0.02


------------------------------------------------------------------
### Structuring Apps


Dependencies:  look into the packages.  If you haven't run across Meteorite and Atmosphere and the mrt command utility, do some research on those terms.  In the /usr/loca/meteor/packages directory, you'll find all the source code for the packages themselves, and take a gander at the package.js files.  Those, in conjunction with the 'meteor add package-name' syntax is how Meteor handles much of the dependency type stuff.  Of course, the dependency management requires that a package is built in the first place.  





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


------------------------------------------------------------------
### Dyno Worker Processes

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
## PACKAGES


**Q:  How do I create a package for distribution?**  
Unofficially, this seems to to be all the available options currently in use in the package creation process:  

````
Package.describe({
  // define a message to describe the package
  summary: "This is a sample package that doesn't actually do anything.",
  
  // for internal dependency packages, set the internal flag true
  internal: false  
});
 
Npm.depends({sample_package: "0.2.6", bar: '1.2.3'});
 
Package.register_extension(
    "otf", function (bundle, source_path, serve_path, where) {
        bundle.add_resource({
            type: "static",
            path: '/fonts/' + serve_path.split('/').pop(),
            source_file: source_path,
            where: where
        });
    }
);
Package.on_use(function (api) {
  
  var path = Npm.require('path');
  api.add_files(path.join('audio', 'click1.wav'), 'client');
    
  // define dependencies using api.use
  api.use('package_name', 'directory/to/install/into');
 
  // add files to specific locations using api.add_files
  api.add_files('library_name.js', 'directory/to/install/into');
 
  // example: add multiple files to a location using an array
  api.add_files(['first_library.js', 'second_library.js'], 'client');
 
  // example: add file to multiple locations using an array
  api.add_files('other_library_name.js', ['client', 'server']);
});
 
Package.on_test(function (api) {
 
  // define dependencies using api.use
  api.use('package_name');
 
  // add files to specific locations using api.add_files
  api.add_files('library_name.js', 'directory/to/install/into');
});
````


### Packages We Love


### Payments
https://atmosphere.meteor.com/package/stripe
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13cfcabb30e80135


### Date/Time
https://github.com/possibilities/meteor-moment

### Routing


------------------------------------------------------------------
## Application Recipies

### HIPAA Compliant Application
- meteor add accounts-ui
- meteor add force-ssl
- mrt add hippa-audit-log

### Multi-Page Application
- mrt add router
