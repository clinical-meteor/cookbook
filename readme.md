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
https://github.com/meteor/meteor/issues/867

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
Template.foo.created

  // subtemplates will render
  Template.subtemplate.created  // need to confirm

  // subtemplates will render
  Template.subtemplate.rendered  // need to confirm

  // and subtemplates fields will populate
  Template.subtemplate.subtemplate_custom_field  // need to confirm

// templates will finalize
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






------------------------------------------------------------------
### Unit Testing

**Tiny Tests**  
http://stackoverflow.com/questions/10760601/how-do-you-run-the-meteor-tests  

**Mocha-Web**  
https://atmosphere.meteor.com/package/mocha-web  

**RDT With Selenium, Mocha, Jasmine, and Istanbul**  
https://github.com/xolvio/meteor-rtd-example-project
http://blog.xolv.io/2013/04/unit-testing-with-meteor.html

**Laika**  
http://arunoda.github.io/laika/




------------------------------------------------------------------
### Accounts

**Q: Is there any documentation on the User Profile?**  

````
user.username  
user.emails[] {address, verified}  
user.profile.name  
````

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.


**Q:  services.facebook.picture doesn't return an image. How do I display a facebook image?**  

All you need is the facebook ID and a URL.  Try something like the following:  

````
Template.userCardTemplate.user_image = function () {
    try{
        if(Meteor.user().services.facebook){
            // this is the line of interest
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
http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor  





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





------------------------------------------------------------------
### Refactoring

**Q:  How do I choose what way to run a function?**  

1. Include {{foo}} in the "bar" template and then set up Template.bar.foo {...}.
2. Include {{foo}} in the "bar" template and set up Template.bar.helpers including "foo" {...}.
3. Include a Meteor.method of "foo" {...} on the client.

I always use # 1 by default.  When I find myself repeating a chunk of code repeatedly, I refactor and extract the duplicate code into a helper function, as per #2.  I only use #3 in the rare cases when I need the server to trigger something on the client (ie.  almost never; it's usually the other way around; methods on the server, not client).   $0.02


