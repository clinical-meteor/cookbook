 



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



