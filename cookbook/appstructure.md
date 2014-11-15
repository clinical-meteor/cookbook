 



## Model, View, Controllers

The First Rule of MVC:  **Be wary of anybody who tries to re-invent the MVC pattern.** 

The MVC pattern that's used on the web is governed by both standards bodies (IEEE, WC3, etc) and the community involvement of a billion people on this planet.  Over 20 years, MVC has evolved on the web into entire domain languages, which everybody collectively knows as HTML, CSS, and Javascript.  Any open-source project that has 1,000 or 10,000 stars on GitHub is peanuts compared to 20 years of Netscape and Internet Explorer, and their billion+ downloads.  So, be wary of Backbone, Ember, Angular, Knockout, Isotope, Famo.us, and any other MVC, MVVM, MVP, or other pattern you run across.  They're re-inventing wheels. 

**Q:  How do I add MVC to my application?**  
It's already there, baked into the core of the framework.  The first thing that happens when you run ``meteor create helloWorld`` is that Meteor will create a new directory with three files.  What are those files?  They're your basic Model-View-Controller.

````sh
/helloWorld.css
/helloWorld.html
/helloWorld.js
````

The MVC pattern in Meteor is dead simple.  The Model is coded up in HTML, the Controller is coded in Javascript, and the View is coded up in CSS.  It's that simple.  

````js
Model          HTML         What It Is Displayed  
View           CSS          How It Is Displayed  
Controller     Javascript   When It Is Displayed  
````

If you stick with this convention, your IDE's like WebStorm will automatically color-code your file types for you, and provide out-of-the-box color-coded syntax highlighting for your Models, Views, and Controllers.  

**Q:  How do I color code MVC in my IDE?**  
Run ``meteor add less`` at the command line to include the LESS precompiler.  Then use ``.less`` files instead of ``.css`` files.  Presto.  If you're using WebStorm, your Model files should now be colored Green, your View files colored Blue, and your Controller files colored Red.

If you're using Atom, you can try searching for and installing ``filetype-color``, or running ``apm add filetype-color`` at the command prompt.


**Q:  Can I add Ember into my Meteor Application?**  
Sure you could add Ember in, but dear lord, why?  Ember and Meteor are essentially the same. Saying "I want to use Ember in Meteor" is like saying, "I want to drive a Mazda in my Porche".  

**Q:  What about Angular.js?  Wouldn't Angular and Meteor work great together?**  
Ah...  so you want to drive a Ford in your Porche, instead.  Mmhmmm.  See the question above about Ember.  Angular.js is redundant.  Don't overcomplicate things with Ember.js, Angular.js, Knockout.js, or any of the other MVC frameworks.  When needed, Meteor will use Backbone.js for it's MVC.  






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



