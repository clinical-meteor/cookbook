 



## Model, View, Controllers

**Q:  How do I add MVC to my application?**  
It's already there, baked into the core of the framework.  The MVC pattern in Meteor is dead simple.  The Model is coded up in HTML, the Controller is coded in Javascript, and the View is coded up in CSS.  It's that simple.  

Model      - HTML       - What It Is Displayed  
View       - CSS        - How It Is Displayed  
Controller - Javascript - When It Is Displayed  

If you stick with this convention, your IDE's like WebStorm will automatically color-code your file types for you, and provide out-of-the-box color-coded syntax highlighting for your Models, Views, and Controllers

**Q:  How do I color code MVC in my IDE?**  
Run ``meteor add less`` at the command line to include the LESS precompiler.  Then use ``.less`` files instead of ``.css`` files.  Presto.  If you're using WebStorm, your Model files should now be colored Green, your View files colored Blue, and your Controller files colored Red.


**Q:  Can I add Ember into my Meteor Application?**  
Sure you could add Ember in, but dear lord, why?  Ember and Meteor are essentially the same. Saying "I want to use Ember in Meteor" is like saying, "I want to drive a Mazda in my Porche".  

**Q:  What about Angular.js?  Wouldn't Angular and Meteor work great together?**  
Ah...  so you want to drive a Ford in your Porche, instead.  Mmhmmm.  See the question above about Ember.  Angular.js is redundant.  Don't overcomplicate things with Ember.js, Angular.js, Knockout.js, or any of the other MVC frameworks.  When needed, Meteor will use Backbone.js for it's MVC.  








## Controller Libraries

**Q:  Is jQuery a core package?**  
Sortof.  It's a dependency of Spark, and is included in pretty much all core applications.  Assume it's a core package.

**Q:  I'm looking in myapp/.meteor/packages, and I don't see jQuery listed.  Why does my app act like it's loading jQuery?**  
Because it's a dependency of Spark.  It's a hidden dependency.  The myapp/.meteor/packages is not a definitive list of dependencies.  Just the most immediate dependencies.

**Q:  How do I add dependencies?**  
If you haven't run across Meteorite and Atmosphere and the mrt command utility, do some research on those terms.  In the /usr/loca/meteor/packages directory, you'll find all the source code for the packages themselves, and take a gander at the package.js files.  Those, in conjunction with the 'meteor add package-name' syntax is how Meteor handles much of the dependency type stuff.  Of course, the dependency management requires that a package is built in the first place.  
http://atmosphere.meteor.com  

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


4.  You'll also want to check for var comments in your library.  Unlike most other Javascript frameworks, Meteor uses the 'var' keyword in a very specific way to restrict the scope of a variable to a single file.  So, many libraries will use the 'var' keyword to simply define a variable to the global scope; but Meteor will interpret the 'var' to mean a variable specific to the local file.  This causes problems sometimes.

    ````js
    // variable restricted to local file
    var foo = 42;

    // variable shared between files
    foo = 42;

    // bad; function restricted to local scope
    // source of lots of frustration and broken applications
    var createStoryJS = function (){ ... }

    // less bad; not explicitely restricted because of the 'var' keyword
    // but still restricted to local scope because of synxtax
    // still breaks many things
    function createStoryJS(){ ... }

    // good; function can be shared between files
    createStoryJS = function (){ ... }
    ````

Note:  I'm being judgemental here, and saying certain approaches are 'good' and 'bad', which implies certain ways of coding things.  If you're used to using ``private`` and ``public`` keywords, you'll note that the ``var`` keyword acts like ``private``, and can be useful for encapsulation and preventing internal variables from being shared with outside scopes.  That's a good thing.   Proper encapsulation and scoping should be encouraged.  But for people debugging applications and trying to integrate 3rd party libraries, the default usage of the ``var`` keyword breaks a lot of things, and the bottom line is that they generally need to bring some of the private variables into a more global context.


### Dependency Load Ordering

Something that really trips people up a lot with Meteor is load ordering and dependencies, particularly if they're accustomed to sequential or imperative style programming (i.e. coming from object-oriented languages and frameworks).  When it comes to the ordering and sequence of events, there are two phases.  First, there's the bundling of resource.  During bundling, as Meteor prepares your application for deployment, it gathers up all your resources and files, and puts them into a bundle according to rules on how **it** thinks things should be ordered.  So, the first step to getting load ordering right, is to learn to adjust your file directories and naming schemas to fit with the Meteor bundler.  

The simple rule of thumb is that the bundler includes files in the deepest directories first (see following example).  You'll note that this bundling order has specifically influenced our previous discussion on 'where should we put files?' 

````js
// the bundling process output is such that libraries in the deepest directories will be loaded first    
/client/lib/deepest/folder/library.js  
/client/lib/deeper/library.js  
/client/lib/library.js  

// and libraries in the root directory will be loaded last
/client/library.js  

// meteor then bundles and deploys
````



### Document Model Templates
**Q:  I want to use Jade/Blade/Dust as my templating engine.  Are they supported?**  
Why would you want to do this?  The Spark templates have had a lot of work put into them, and can basically do everything that Jade, Blade, and Dust can do, but better.  That being said, if you're hell-bent on replacing the default templating engine, a few people have reporting some success getting jade and blade working, and there are packages in Atmosphere, but nobody seems to have gotten dust working yet.  Of the three, Jade seems to have the best documentation and integration so far.  But seriously... ask yourself why you would ever actually want to do this.  Don't you have better things to do with your time?

Blade  
https://github.com/bminer/meteor-blade  

Jade  
https://github.com/SimonDegraeve/meteor-jade-handlebars  


### View Theming

**Q:  How do I add themes to my application?**  
Theming in Meteor is beautiful, because we have CSS precompilers at our disposal.  Start off with an html template: 

````html
<template name="foo">
  <div class="{{current_theme_name}}">
    <span class="t1">hello</span>
  </div>
</template>
````

And add a template function to update on a dynamic Session variable.
````
Template.foo.current_theme_name = function(){
  if(Session.get('current_theme_name') == 'black'){
    return "theme1";
  }else{
    return "theme2";
  }
}
````

Then add some LESS magic, using nested CSS classes and a custom namespacing:
````
theme1 {
  t1 {background-color: black}
}
theme2 {
  t1 {background-color: red}
}
````


And wrap it all up with some controls to toggle the dynamic session variable.
````
Template.bar.events({
  'click .button-black: function(){
    Session.set('current_theme_name', 'black');
  },
  'click .button-red: function(){
    Session.set('current_theme_name', 'red');
  }
})
````



### View Animations

Check out the following videos on Famo.us and CSS animations and overrides.  
  https://www.youtube.com/watch?v=br1NhXeVD6Y  
  https://www.youtube.com/watch?v=ixASZtHYGKY  
  https://www.youtube.com/watch?v=zpebYhm8f2o  
  https://www.youtube.com/watch?v=OhfI2wFNKFQ  


------------------------------------------------------------------
### Namespacing

As far as dependencies and namespaces go....  my best recommendation would be to make sure you're using an IDE that supports refactoring (ie. invest in a copy of WebStorm).  What you're going to find is that you're going to find some functionality that gets reused between projects, and you'll want to carry that functionality between projects, which will require refactoring bits and pieces of code out into packages, and then defining dependencies in the package.js files.  

As for namespacing, there are three approaches to namespacing that I've seen in use.  

**File System**  
The first is to simply use the filesystem as a namespace.  Feel free to use multi dotted names, and go to town.
````sh
/client/templates/page.home.html
/client/templates/page.profile.html
/client/templates/page.graph.html
/client/templates/page.error.pagenotfound.html
/client/templates/page.error.unknownbrowser.html
/client/templates/sidebar.inspection.html
/client/templates/sidebar.navigation.html
````

**LESS Class Namespacing (View)**  
The second approach to namespacing is to use LESS to create class structures like so:  
````less
@import "../mixins.less";

#homePage{
  background-color: white;
  header{
    background-color: gray;
  }
  .panel{
    .panel-heading{
      background-color: lightblue;
    }
  }
  footer{
    background-color: gray;
  }
}
````
Specifically, the ``@import 'filename.less'`` gives you the necessary syntax to create CSS/LESS based namespaces. 

**NPM Package Namespacing (Controller)**  
And the most recent option for namespacing is with Npm packages:
````js
// package.js  
Package.describe({
  summary: "This is a sample package that doesn't actually do anything."
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
Npm.depends({sample_package: "0.2.6", bar: '1.2.3'});

Package.on_use(function (api) {
  var path = Npm.require('path');

  // sample_package.js  
  Foo = Npm.require('sample_package');  

  // export the object
  api.export('Foo');
});
````
Specifically, the ``Npm.depends()``, ``Npm.require()``, and ``Npm.export()`` commands define all the syntax you need to create a Javascript namespace.

------------------------------------------------------------------
### Miscellaneous Notes

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



