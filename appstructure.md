 



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

Installing a 3rd party library doesn't have to be hard.  If you're having problems, it's probably because the reactive templates are overwriting the objects you created.  There are a few ways to deal with this:

1.  Move your code out of reactive templates.  Autorun() is a good event hook for creating objects in.
````js
    Meteor.autorun(function(){  
        // the timeline object is outside the scope of any reactive templates
        timeline = new Timeline();            
    });
````


2.  check to see if your object already exists
````js
    Template.templateWithConstantRegion.rendered = function(){
      // we simply add feature detection to see if the object already exists 
      self.node = self.find("#timelineObject");
      if (! self.handle) {
        // don't get worked up about this Deps.autorun()
        // it's an option addition to this pattern
        self.handle = Deps.autorun(function(){
            Timeline();            
        });
      };
    };

    // don't forget to complete the pattern by tearing down the object properly
    Template.templateWithConstantRegion.destroyed = function () {
      this.handle && this.handle.stop();
    };
````

3.  use a ``#constant`` region or a ``Template.frontPage.preserve()`` callback
````html
    <temlate name="templateWithConstantRegion">
      <div>
        {{#constant}}
          <div id="timelineObject"></div>
        {{/contant}}
      </div>
    </template>
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



###Where should I put my files?  
(Grabbed from Oortcloud's FAQ)  
https://github.com/oortcloud/unofficial-meteor-faq/blob/master/README.md  

The example apps in meteor are very simple, and don’t provide much insight. Here’s my current thinking on the best way to do it: (any suggestions/improvements are very welcome!)

```bash
lib/                       # <- any common code for client/server.
lib/environment.js         # <- general configuration
lib/methods.js             # <- Meteor.method definitions
lib/external               # <- common code from someone else
## Note that js files in lib folders are loaded before other js files.

collections/               # <- definitions of collections and methods on them (could be models/)

client/lib                 # <- client specific libraries (also loaded first)
client/lib/environment.js  # <- configuration of any client side packages
client/lib/helpers         # <- any helpers (handlebars or otherwise) that are used often in view files

client/application.js      # <- subscriptions, basic Meteor.startup code.
client/index.html          # <- toplevel html
client/index.js            # <- and its JS
client/views/<page>.html   # <- the templates specific to a single page
client/views/<page>.js     # <- and the JS to hook it up
client/views/<type>/       # <- if you find you have a lot of views of the same object type
client/stylesheets/        # <- css / styl / less files

server/publications.js     # <- Meteor.publish definitions
server/lib/environment.js  # <- configuration of server side packages

public/                    # <- static files, such as images, that are served directly.

tests/                     # <- unit test files (won't be loaded on client or server)
```

For larger applications, discrete functionality can be broken up into sub-directories which are themselves organized using the same pattern. The idea here is that eventually module of functionality could be factored out into a separate smart package, and ideally, shared around.

```bash
feature-foo/               # <- all functionality related to feature 'foo'
feature-foo/lib/           # <- common code
feature-foo/models/        # <- model definitions
feature-foo/client/        # <- files only sent to the client
feature-foo/server/        # <- files only available on the server
```



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



