 
 
------------------------------------------------------------------
## Development Environment

**Q:  What are best practices for setting up my development environment?**  
Well, you're going to need to select an Integrated Development Environment (IDE), configure it so it works with Meteor, and set up debugging and profiling utilities.  See below.  

**Q:  Which editor should I use with Meteor?**  
Well, you're going to need to chose an IDE and editor to work with, the most popular of which seems to be Webstorm, since it's got the best refactoring tools.  
http://www.jetbrains.com/webstorm/  

Some people are also reporting success with Coda.  
http://panic.com/coda/

**Q:  Any recommendations on Chrome or Firefox Extensions?**  

Window Resizer (Chrome)  
https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh  

Firebug (Firefox)  
https://getfirebug.com/  

**Q:  Any recommendations on pair-programming?**  
Screenhero  
http://screenhero.com/download.html?src=btn  

MadEye  
http://madeye.io/get-started  

Nitrous.io  
https://www.nitrous.io/  

Run the following command in the Nitrous.io (web) command line to create a Meteor project.  
````
parts install meteor
````



**Q:  My editor keeps crashing!  Help!**  
Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````

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
