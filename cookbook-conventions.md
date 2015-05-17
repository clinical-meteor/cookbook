## Cookbook Conventions

They say the best way to win an argument is to avoid it.  Preferred language, best editor, testing framework choice...  so many opportunities for people to argue for their favorite technology.  So, before diving into the Cookbook, lets go over some of the conventions.  

====================================  
#### 1.  Pure Javascript instead of CoffeeScript
At the end of the day, the Cookbook is striving to build pure Javascript applications.  We understand the reasons why some people want to use CoffeeScript.  CoffeeScript does a lot of heavy lifting, standardizing things, can be cleaner to read.  But JavaScript is more performant; more precise; and is the language that the underlying interpreter is built in.  So, the Cookbook and it's examples and utilities are all written in Javascript.  


====================================  
#### 2.  Atom instead of Webstorm  
Atom is written in Chrome/Javascript, and is therefore isomorphic to the rest of the framework.   The result being that I can hack on Atom, whereas my Java isn't good enough to hack on Webstorm.  That's enough to make Atom the clear choice for my needs.  


====================================  
#### 3.  Component/Microservice Architecture instead of MVC 

The terms Model, View, and Controller are used so much that they've become meaningless.  Or, rather, everybody has a different interpretation.  The Cookbook holds the stance that modern browsers have a CSS subsystems which renders to the ViewPort, and an HTML subsystem which creates a Document Object Model, and that HTML/CSS/JS are the natural Model/View/Controller paradigm.  But it also recognizes that the CSS and HTML subsystems are implemented in JS, and everything can eventually be reduced to Javascript (which is more performant).  So, the Cookbook is leaning towards Component architectures, which are somewhat agnostic/neutral to the whole MVC argument, and are focused on the pure-Javascript approach.
 
====================================  
#### 4.  Starrynight instead of Velocity  
The Cookbook uses the StarryNight utility instead of Velocity for testing.  There are lots of reasons for this decision, but it basically boils down to the need to have something we can rely on and can contribute changes to when we need things changed.  The Velocity project was way to instable for our needs, and people running it actively worked to exclude any changes or contributions that we tried to submit.  
