 



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




