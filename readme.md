Hi.  Welcome to my Meteor Cookbook, FAQ, and Tutorial, culled from about 6 months of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  

------------------------------------------------------------------
## Meteor Licensing and Branding

**Q:  Is there a Meteor logo?**  
Currently, there is no Meteor logo, but Cloudbees has been using a modified Nodejs logo, which works very nicely too:  
https://d3ko533tu1ozfq.cloudfront.net/clickstart/nodejs.png

**Q:  I heard Meteor is licensed under the GPL.  Will it be available under the MIT license?**  
Meteor is now available under the MIT license.  They switched licenses around version 0.4.0.

 
## Terminology

**Acroynms**  

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

**Reserved Keywords**  
Be careful about the reserved keywords 'length' and 'name'.  They're used by the Spark templates and Mongo, respectively, and can cause unexpected problems in your application.  

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
Unofficially, yes. The last released version is 0.6.4.1. It can be found here:  
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

**Q:  Any recommendations on pair-programming?**  
Screenhero  
http://screenhero.com/download.html?src=btn  

MadEye  
http://madeye.io/get-started  

**Q:  My editor keeps crashing!  Help!**  
Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````

**Q:  How do I debug node.js itself?**  
````
npm install -g node-inspector

export NODE_OPTIONS='--debug'
sudo mrt run
sudo node-inspector &

http://0.0.0.0:8080/debug?port=5858
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


**Q: How do I generate URL paths?**    

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

````html
<temlate name="templateWithConstantRegion">
  <div>
  {{#constant}}
  <div id="timelineObject"></div>
  {{/contant}}
  </div>
</template>
````

````js
Template.templateWithConstantRegion.rendered = function(){
    self.node = self.find("#timelineObject");
    if (! self.handle) {
        self.handle = Deps.autorun(function(){
            Timeline();            
        });
    };
};

Template.templateWithConstantRegion.destroyed = function () {
  this.handle && this.handle.stop();
};
````

You'll also want to check for var comments in your library, like so:
````js
// bad
var createStoryJS = function (){ ... }

// good
createStoryJS = function (){ ... }
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


## Templates
**Q:  I want to use Jade/Blade/Dust as my templating engine.  Are they supported?**  
Why would you want to do this?  The Spark templates have had a lot of work put into them, and can basically do everything that Jade, Blade, and Dust can do, but better.  That being said, if you're hell-bent on replacing the default templating engine, a few people have reporting some success getting jade and blade working, and there are packages in Atmosphere, but nobody seems to have gotten dust working yet.  Of the three, Jade seems to have the best documentation and integration so far.  But seriously... ask yourself why you would ever actually want to do this.  Don't you have better things to do with your time?

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

**Q: Where does a Meteor app store its mongodb log files?**  
They're not easily accessible.  If you run the 'meteor bundle' command, you can generate a tar.gz file, and then run your app manually.  Doing that, you should be able to access the mongo logs... probably in the .meteor/db directory.  

If you really need to access mongodb log files, set up a regular mongodb instance, and then connect Meteor to an external mongo instance, by setting the MONGO_URL environment variable:  
````
MONGO_URL='mongodb://user:password@host:port/databasename'
````

Once that's done, you should be able to access logs in the usual places...  
````
/var/log/mongodb/server1.log
````

**Q:  How should I go about designing my collections?**  
Well, instead of telling you what you ought to do; how about I tell you how I go about designing *my* collection schemas.  I've been working with Mongo for a couple years now, and document oriented database for maybe 8 years now.  There are few rules I use nowdays when designing data storage collections:

1.  Don't do data modeling in the database.  
2.  Do a careful analysis of the most commonly used queries in your application instead.   
3.  Collection schemas should be designed for optimizing server/client communications.  
4.  Therefore, collections should reflect the types of queries the application is going to perform.  
5.  If its not worth storing a billion records, odds are that it doesn't actually need to be a collection.   
6.  Collections with just 2 or 3 fields, or only a few dozen records are suspicious in the Mongo world.  
7.  If a table is so small it can be converted into an enum, do so.    
8.  Consolidate and merge tables.  
9.  Think in terms of document schemas, rather than table schemas.  
10.  Table schemas should be about performance.  
11.  Document schemas are where you want to do your data modeling.  


**Q:  How do I create a JOIN in Meteor?**  
Timeout.  You're still thinking in terms of normalizing data, not repeating yourself, and creating a collection for each data table.  This is bad juju magic, and will cause bad application design.  Take a timeout and do some more research and reading before moving forward with your application.






## Collections
  
**Q:  How do I insert an { array | date | boolean | session } into a document record?**  
This example should mostly cover it:

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

**Q: Why isn't there a MyCollection.save() function?**  
See this converation:  
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

http://stackoverflow.com/questions/14167394/ideal-way-of-doing-infinite-scroll-and-real-time-updates-in-meteor  



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

**Q:  services.facebook.picture doesn't return an image. How do I display a facebook image?**  
Facebook Icons  
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13d2c92723e3a31d  

````
Template.userCardTemplate.user_image = function () {
    try{
        if(Meteor.user().services.facebook){
            return "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=large";
        }else if(Meteor.user().profile){
            return $.trim(Meteor.user().profile.avatar);
        }else{
            return "/images/placeholder-240x240.gif";
        }
    }
    catch(err){
        console.log(err);
    }
};
````

**Q:  How do I get Facebook OAuth to work?  There's something wrong with the URLs.**  
Facebook is inconsistent.  Check the 'http://' at the beginning of your URLs.  The Site URL wants an 'http://', but the App Domains does not.  

````
Basic Info > App Domains:  might-river-5358.herokuapp.com  
Website with Facebook Login > Site URL:  http://might-river-5358.herokuapp.com  
````

**Q:  How do I customize the Accounts UI login page?**  
See this link:  http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor  






**Q:  There are weird blue artifacts when using touch monitors.  How do I get rid of them?**  
The tap events don't handle :hover pseudoclasses very well.  Trying sprinkling your application with the following CSS class:

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

**Q: How do I generate filepaths on the server?**    

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

**Q:  How do I specify an external database using MONGO_URL?**  
Okay, so you're starting to talk about separating your application layer from your database layer, and getting things ready for scale-out.  If you're looking for something quick and simple, try Modulus.io:  
http://blog.modulus.io/demeteorizer  
https://github.com/onmodulus/demeteorizer  

````
sudo npm install -g demeteorizer
sudo cd ~/path/myapp

sudo demeteorizer -n 0.8.11
sudo cd .demeteorized
sudo modulus login
sudo modulus deploy
````

**Q:  What environment variables are supported?**  
So far, the following variables have been seen in the wild:  

PORT  
MONGO_URL  
ROOT_URL  
METEOR_SETTINGS  
NODE_OPTIONS


------------------------------------------------------------------
**Q:  Is there any documentation on the Meteor.settings?**    
So far, the following setting parameters have been seen in the wild:  

````
Meteor.settings.privateKey == "MY_KEY"  
Meteor.settings.public.publicKey == "MY_PUBLIC_KEY"   
Meteor.settings.public.anotherPublicKey == "MORE_KEY"  
````


**Q:  What's the best practice for using content distribution networks (CDN)?**  
Currently, there's not anything specific, other than putting static content on your CDN, and creating links to it from your app.  You may want to run the meteor bundle command, and take a peek in the resulting tar.gz file.
````
meteor bundle
````

Also, follow the feature card on the Meteor roadmap:  
https://trello.com/card/speed-up-improve-app-loading/508721606e02bb9d570016ae/47





------------------------------------------------------------------
### Refactoring

**Q:  How do I choose what way to run a function?**  

1. Include {{foo}} in the "bar" template and then set up Template.bar.foo {...}.
2. Include {{foo}} in the "bar" template and set up Template.bar.helpers including "foo" {...}.
3. Include a Meteor.method of "foo" {...} on the client.

I always use # 1 by default.  When I find myself repeating a chunk of code repeatedly, I refactor and extract the duplicate code into a helper function, as per #2.  I only use #3 in the rare cases when I need the server to trigger something on the client (ie.  almost never; it's usually the other way around; methods on the server, not client).   $0.02



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
Unofficially, this seems to to be all the available options currently in use in the package creation process.  

````js
 // sample_package.js  
 foo = Npm.require('sample_package');  
 
 // and now use the function like so:
 foo.function();  
````


````js
// package.js  
// should go into the /meteor-project/packages/sample_package directory  

Package.describe({
  // define a message to describe the package
  summary: "This is a sample package that doesn't actually do anything.",
  
  // for internal dependency packages, set the internal flag true
  internal: false  
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
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


### Packages We Love And Should be Included Meteor Core


**Payments - Stripe**  
https://atmosphere.meteor.com/package/stripe
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13cfcabb30e80135

**Date/Time - Moment**  
https://github.com/possibilities/meteor-moment

**REST Interface - Meteor-CollectionApi**  
https://github.com/crazytoad/meteor-collectionapi

**Clustering - Meteor-Cluster**    
https://github.com/arunoda/meteor-cluster

**Router**    
https://atmosphere.meteor.com/package/router  
Generally speaking, Router works better than mini-pages.  Mini-pages supports nifty reactive session variables as routing before functions, which sounds great in theory; but in practice leads to all sorts of unexpected behaviors.  Router behaves much more consistently and as you expect a router should behave.

**Device Detection**  
https://atmosphere.meteor.com/package/device-detection  

**Mocha-Web**  
https://atmosphere.meteor.com/package/mocha-web  
Best package around for quick-and-easy unit testing.  (Doesn't support acceptance testing though.)  



------------------------------------------------------------------
## Application Recipies

### HIPAA Compliant Application
- meteor add accounts-ui
- meteor add force-ssl
- mrt add hippa-audit-log


------------------------------------------------------------------
## Exceptions and Errors

**Q:  Uncaught ReferenceError: Templates is not defined**  
Check that you haven't mispelled the word ``Template`` as ``Templates``.  It's a common typo.  Also check that your templates are references with a right arrow ``>``, like so:

````js
//correct
{{> customTemplate }}

//incorrect
{{ customTemplate }}
````


