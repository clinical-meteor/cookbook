



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



