## Development Tools

You're going to need to set up a development environment if you want to program in Meteor.  There's a growing ecosystem of tools to use, so the focus in this document is on tools that are known to work together well.   

===============================================================
## Integrated Development Environments

Well, you're going to need to select an Integrated Development Environment (IDE), configure it so it works with Meteor, and set up debugging and profiling utilities.  See below.  

[Atom](http://www.atom.io) - The javascript IDE that fully leverages Meteor's isomorphic javascript framework.  Recommended.
[WebStorm](http://www.jetbrains.com/webstorm/) - The most full featured IDE currently available for Meteor.    
[Sublime](http://www.sublimetext.com/) -For something more light-weight and quick, try Sublime.   
[Nitrous.io](https://www.nitrous.io/) - The best and only Cloud Development tool worth worrying about.  
  
**Q:  My editor keeps crashing!  Help!**  
Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````

  

**Q:  Any recommendations on pair-programming?**  

[Screenhero](http://screenhero.com/download.html?src=btn)      
[MadEye](http://madeye.io/get-started)  
[Google Hangouts](http://www.google.com/+/learnmore/hangouts/)  





  
#### Database Tools
[MacOSX Mongo Preference Page](http://blog.mongodb.org/post/28925264384/macosx-preferences-pane-for-mongodb)  
[Robomongo](http://robomongo.org/) - A sweet, sweet database management tool.  Highly recommended.   
[MongoHub](http://mongohub.todayclose.com/) - Another Mongo GUI, similar to RoboMongo.
[Mongo3](http://mongo3.com/) - It's in Ruby, but it will let you visualize replication sets.   

[Mongo Monitoring Service](https://mms.mongodb.com/setup)  
[JSON Generator](http://www.json-generator.com/)  
  

#### REST Clients  
[Dev HTTP Client](https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm)      
[REST Client](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/)      
  


#### Debuggers  
[Firefox - Firebug](https://getfirebug.com/)    
[Firebug (Firefox)](https://getfirebug.com/)   
[Node-Inspector](https://github.com/node-inspector/node-inspector)    
  

#### Mobile Device Simulators  
[Chrome - Window Resizer](https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh)    


#### Code Analysis  

[Meteor JSHint](https://github.com/raix/Meteor-jshintrc)  

````sh
npm install jshint -g
jshint .
````
