## Development Tools
**Q:  What are best practices for setting up my development environment?**  
Well, you're going to need to select an Integrated Development Environment (IDE), configure it so it works with Meteor, and set up debugging and profiling utilities.  See below.  

[WebStorm](http://www.jetbrains.com/webstorm/) - The most full featured IDE currently available for Meteor.    
[Sublime](http://www.sublimetext.com/) -For something more light-weight and quick, try Sublime.   
[Nitrous.io](https://www.nitrous.io/) - The best and only Cloud Development tool worth worrying about.  
  
**Q:  My editor keeps crashing!  Help!**  
Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````

**Q:  Any recommendations on Browser Debugging?**  

[Chrome - Window Resizer](https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh)    
[Firefox - Firebug](https://getfirebug.com/)    
  

**Q:  Any recommendations on pair-programming?**  

[Screenhero](http://screenhero.com/download.html?src=btn)      
[MadEye](http://madeye.io/get-started)  




**Q:  How do I debug node.js itself?**  
````
npm install -g node-inspector

export NODE_OPTIONS='--debug'
sudo mrt run
sudo node-inspector &

http://0.0.0.0:8080/debug?port=5858
````


**Q:  Help!  I'm behind a proxy!  How can I install/run Meteor behind a reverse proxy?**  
This is a networking issue related to your operating system and local network topology, something that the Meteor Development Group doesn't really have any control over.  Some people have had success updating their bash environment variables, and running the installer with curl, like so:
````js
// make sure your shell knows about your proxy
export http_proxy=http://your.proxy.server:port/

// install meteor manually
curl https://install.meteor.com | sh
````

Also, watch follow this issue:  
https://github.com/meteor/meteor/pull/920



#### Mobile Device Simulators  
[Window Resizer (Chrome)](https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh)    
  
#### Database Tools
[MacOSX Mongo Preference Page](http://blog.mongodb.org/post/28925264384/macosx-preferences-pane-for-mongodb)  
[Robo Mongo](http://robomongo.org/) - A sweet, sweet database management tool.  Highly recommended.   
[MongoHub](http://mongohub.todayclose.com/) - Another Mongo GUI, similar to RoboMongo.
[Mongo3](http://mongo3.com/) - It's in Ruby, but it will let you visualize replication sets.   


  

#### REST Clients  
[Dev HTTP Client](https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm)      
[REST Client](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/)      
  


#### Debuggers  
[Firebug (Firefox)](https://getfirebug.com/)   
[Node-Inspector](https://github.com/node-inspector/node-inspector)    
  
http://howtonode.org/debugging-with-node-inspector  
````
npm install -g node-inspector

export NODE_OPTIONS='--debug'
sudo mrt run
sudo node-inspector &

http://0.0.0.0:8080/debug?port=5858
````

#### Code Analysis  

[Meteor JSHint](https://github.com/raix/Meteor-jshintrc)  

````sh
npm install jshint -g
jshint .
````
