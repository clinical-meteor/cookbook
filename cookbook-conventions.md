## Cookbook Conventions

They say the best way to win an argument is to avoid it.  Editor choice, testing framework choice, language choice...  so many opportunities for people to argue for their favorite technology.  Before you dive into the rest of the Cookbook, lets be clear of a few conventions so we can avoid arguments.

====================================  
#### 1.  Javascript instead of CoffeeScript  
CoffeeScript does a lot of heavy lifting, but JavaScript is more precise.  

====================================  
#### 2.  Atom instead of Webstorm  
Atom is written in Chrome/Javascript, and is therefore isomorphic to the rest of the framework.  The result being that I can hack on Atom, whereas my Java isn't good enough to hack on Webstorm.  That's enough to make Atom the clear choice.  


====================================  
#### 3.  Component/Microservice Architecture

The terms Model, View, and Controller are used so much that they've become meaningless.  Or, rather, everybody has a different interpretation.  The Cookbook holds the stance that modern browsers have a CSS subsystems which renders to the ViewPort, and an HTML subsystem which creates a Document Object Model, and that HTML/CSS/JS are the natural Model/View/Controller paradigm.  But it also recognizes that the CSS and HTML subsystems are implemented in JS, and everything can eventually be reduced to Javascript (which is more performant).  So, the Cookbook is leaning towards Component architectures, which are somewhat agnostic/neutral to the whole MVC argument, and are focused on the pure-Javascript approach.

 
====================================  
#### 4.  Starrynight instead of Velocity  
The Cookbook uses the StarryNight utility instead of Velocity for testing.  

