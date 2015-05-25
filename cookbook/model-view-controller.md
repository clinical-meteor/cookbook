 



## Model, View, Controllers

The First Rule of MVC:  **Be wary of anybody who tries to re-invent the MVC pattern.** 

The MVC pattern that's used on the web is governed by both standards bodies (IEEE, WC3, etc) and the community involvement of a billion people on this planet.  Over 20 years, MVC has evolved on the web into entire domain languages, which everybody collectively knows as HTML, CSS, and Javascript.  

Any open-source project that has 1,000 or 10,000 stars on GitHub is peanuts compared to 20 years of Netscape and Internet Explorer, and their billion+ downloads.  So, be wary of Backbone, Ember, Angular, Knockout, Famo.us, and any other MVC, MVVM, MVP, or other pattern you run across.  They're re-inventing wheels.  

That's not to say you shouldn't use those libraries.  Just be wary of of the terms Model View Controller, and use with a grain of salt (or a saltshaker, really).  There's no consensus on what these terms mean, with developers of competing libraries using the term 'View' and 'Controller' to mean whatever they conceive it to mean.   In fact, Blaze.View works as something of a ModelController as far as the Browser is concerned with rendering Views to the ViewPort.  (Which just goes to show how convoluted this all is.)  Meteor strives to be an isomorphic technology stack, meaning that the same APIs are run on server, client, database, and elsewhere.  But MVC models are one area where things are *not* isomorphic (yet).  

===============================================
####Different MVC Paradigms In the Wild  

To provide some specific examples, lets take a look at how Blaze, SemanticUI and the Chrome browser each interpret the term 'View' slightly differently.

- **Blaze** - Interprets a View as a Javascript object which manipulates a chunk of HTML.
- **Semantic-UI** - View is a specific set of CSS applied to a specific chunk of HTML.  
- **Browser** - Responsible for applying CSS to HTML, and rendering a View to the Viewport, according to CSS Media rules.

See the problem?  There's no consistency.  The terms Model, View, and Controller are **NOT** isomorphic and standard across libraries.  They mean different things in different contexts.  And that's the essential thing to understand when applying MVC structure to your app.  

To explain a little more what's going on with these different approaches, it's important to realize that the original MVC pattern was developed on desktops and workstations and had no server/client component to them.  They implemented classes with various names like 'ListView' or 'TableView' and were responsible for rendering streams of BMP images to the ViewPort.  Later, when web browsers came along, a 'WebView' or 'UIWebView' was introduced, which was also responsible for rendering a stream of BMP images to the ViewPort, but which also had a Javascript interpreter and could parse code that was delivered from a website.  And in an attempt to replicate the naming conventions of earlier programmers, people started using 'View' to describe code that was being generated on the server and ran within the UIWebView. 

So, Chrome and Firefox and other web browsers, they have their internal sense of what a UIWebView, which involves applying CSS to some HTML and rendering a stream of BMP images to the ViewPort.  Semantic-UI takes a similar approach, but sort of precompiles that CSS/HTML code and makes it available from the server.  Whereas Blaze (and Ember, and Angular, and any number of other modern 'MVC' framework) are trying to replicate client-side MVC on the server, and are using View to refer to what might be better understood as Components.

===============================================
#### Default MVC Patterns  

Many people have asked 'How do I add MVC to my Meteor app?' over the past two years.  The answer is that it's already there, baked into the core of the framework.  The first thing that happens when you run ``meteor create helloWorld`` is that Meteor will create a new directory with three files.  What are those files?  They're your basic browser-level Model-View-Controller.

````sh
/helloWorld.html   # the Document Object Model
/helloWorld.css    # CSS is applied to DOM and rendered to a View which is displayed in the Viewport
/helloWorld.js     # Javascript is an event driven language for Controlling events and actions.
````

===============================================
#### Translating Model View Controller  

The MVC pattern in Meteor is dead simple.  The Model is coded up in HTML, the Controller is coded in Javascript, and the View is coded up in CSS.  It's that simple.  

````js
Model          HTML         What Is Displayed       
View           CSS          How It Is Displayed        
Controller     Javascript   When It Is Displayed        
````

If you stick with this convention, your IDEs like WebStorm will automatically color-code your file types for you, and provide out-of-the-box color-coded syntax highlighting for your Models, Views, and Controllers.  

===============================================
#### Color Coding MVC  

Color-coding is a powerful way to organize and understand your code.  Run ``meteor add less`` at the command line to include the LESS precompiler.  Then use ``.less`` files instead of ``.css`` files.  Presto.  If you're using WebStorm, your Model files should now be colored Green, your View files colored Blue, and your Controller files colored Red.

If you're using Atom, you can try searching for and installing ``filetype-color``, or running ``apm add filetype-color`` at the command prompt.  Also, adding ``minimap`` can give you a nice overview of your file.  Here are some screenshots of what Atom looks like with filetype-color and minimap added, enabling robust color coding of the Meteor API and our Model/View/Controller files.

![ColorCoding](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/ColorCoding.jpg)  




