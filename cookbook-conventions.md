## Cookbook Conventions

They say the best way to win an argument is to avoid it.  Preferred language, best editor, testing framework choice...  so many opportunities for people to argue for their favorite technology.  So, before diving into the Cookbook, lets go over some conventions that are used.  These conventions are how I choose to write this cookbook.  If you disagree with any of them, please write your own Cookbook.  

====================================  
#### 1.  Pure Javascript instead of CoffeeScript
At the end of the day, the Cookbook is striving to build pure Javascript applications.  We understand the reasons why some people want to use CoffeeScript.  CoffeeScript does a lot of heavy lifting, standardizing things, can be cleaner to read.  But JavaScript is more performant; more precise; and is the language that the underlying interpreter is built in.  So, the Cookbook and it's examples and utilities are all written in Javascript.  


====================================  
#### 2.  Atom instead of Webstorm  
Atom is written in Chrome/Javascript, and is therefore isomorphic to the rest of the framework.   The result being that I can hack on Atom, whereas my Java isn't good enough to hack on Webstorm.  That's enough to make Atom the clear choice for my needs.  


====================================  
#### 3.  Component/Microservice Architecture instead of MVC 

The terms Model, View, and Controller are used in so many different ways that the terms have become meaningless.  Every MVC library that we've run across (Backbone, Blaze, Ember, Angular, Famo.us, React, WebComponents, Semantic) are each reinventing the wheel, trying to get around the MVC model that the client-side HTML and CSS subsystems impose, and repurposing the terms Model, View, and Controller.  Suffice it to say that, after thinking on this issue for a year or two, the Cookbook is leaning towards an MVC-agnostic approach by using a component/microservice architecture (a mash-up of WebComponents, React, Blaze Components, and Famo.us).  If there's one rule about MVC, it's don't use MVC.  
 
 
====================================  
#### 4.  Starrynight instead of Velocity  
The Cookbook uses the StarryNight utility instead of Velocity for testing.  There are lots of reasons for this decision, but it basically boils down to the need to have something we can rely on and can contribute changes to when we need things changed.  The Velocity project was way to instable for our needs, and people running it actively worked to exclude any changes or contributions that we tried to submit.  
