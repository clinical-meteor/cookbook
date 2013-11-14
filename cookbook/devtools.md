

 
 
------------------------------------------------------------------
## Development Tools


#### Integrated Development Environments  
**WebStorm**   
The most full featured IDE currently available for Meteor.  
http://www.jetbrains.com/webstorm/  

**Sublime**  
For something more light-weight and quick, try Sublime.   
http://www.sublimetext.com/

#### Cloud Development  
**Nitrous.io**    
The best and only Cloud Development tool worth worrying about.  
https://www.nitrous.io/  

#### Debuggers  
Firebug (Firefox)  
https://getfirebug.com/  

#### Mobile Device Simulators  
Window Resizer (Chrome)  
https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh  

#### Database Tools
**Robo Mongo**    
A sweet, sweet database management tool for when you start separating your application and database layers.  
http://robomongo.org/  

**Mongo3**  
It's in Ruby, but it will let you visualize replication sets.  
http://mongo3.com/


#### Pair Programming  
**Screenhero**    
http://screenhero.com/download.html?src=btn  

**MadEye**  
http://madeye.io/get-started  


Run the following command in the Nitrous.io (web) command line to create a Meteor project.  
````
parts install meteor
````

#### REST Clients  
Dev HTTP Client  
https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm

REST Client  
https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/



#### Server Debugging
**Node-Inspector**  
https://github.com/node-inspector/node-inspector  
http://howtonode.org/debugging-with-node-inspector  
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
