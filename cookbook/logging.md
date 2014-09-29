## Logging

If you're from a DevOps, Operations, or SysAdmin background, this is probably one of the first sections of the Meteor Cookbook that you looked into.  If you're from any other background, you may be surprised to find just how many tools are available for logging.  Many people consider log files to be one of the most important part of a running application, and I've seen few successful applications put into production that didn't have some type of logging available.  

As far as Meteor goes, there are many, many options available.  Particularly if you dive into the [Npm repositories](https://npmjs.org/search?q=logging).  But one of the aims of the Meteor Cookbook is to use pure Meteor, when possible, and to advocate the using of the native tools.  Before looking to add extra packages and tools, lets start trying to learn the tools we already have.  

============================================================
#### Server Side Logging Tools  
The first step to logging is simply to run Meteor from the shell, and you'll get the server logs in the command console.

````
sudo meteor
````
The next step is to pipe the contents of ``std_out`` and ``std_err`` to a logfile, like so:

````sh
meteor > my_app_log.log 2> my_app_err.log
````

If you've gotten to the point where you're running things in production, or want your application running continuously, you can set up your logs by running [Ubuntu's upstart command](http://upstart.ubuntu.com/) or [OSX System Starter](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man8/SystemStarter.8.html).  An Ubuntu upstart script which generates log files from a Meteor app in production looks like this:  

````sh
## /etc/init/helloworld.conf
description "hello world"
author      "awatson1978"

# Automatically Run on Startup
start on started mountall
stop on shutdown

# Automatically Respawn:
respawn
respawn limit 99 5

script
    export HOME="/root"
    export MONGO_URL='mongodb://helloworld.mongohq.com:27017/meteor'
    export ROOT_URL='http://helloworld.meteor.com'
    export PORT='80'

    exec /usr/local/bin/node /var/www/helloworld/main.js >> /var/log/helloworld.log 2>&1
end script
````

============================================================
#### Client Side Logging Tools

Once you have your server side logging in place, it's time to hop over to the client side.  If you haven't explored the console API, be prepared for a treat.  There's actually all sorts of things that you can do with the built in Console API that's native to every Chrome and Safari installation.  So much so, in fact, that you may find yourself not needing Winston or other logging frameworks.  

The first thing you'll want to do is install client side logging and developer tools.  Chrome and Safari both ship with them, but Firefox requires the Firebug extension.  

&nbsp;&nbsp;&nbsp;&nbsp;**Firebug Extension**      
&nbsp;&nbsp;&nbsp;&nbsp;https://addons.mozilla.org/en-US/firefox/addon/firebug/  

Then, you'll want to check out the Console API documentation.  The following two documents are invaluable resources for learning console logging.  

&nbsp;&nbsp;&nbsp;&nbsp;**Chrome Developer Tools**      
&nbsp;&nbsp;&nbsp;&nbsp;https://developers.google.com/chrome-developer-tools/docs/console  

&nbsp;&nbsp;&nbsp;&nbsp;**Firebug (Client)**    
&nbsp;&nbsp;&nbsp;&nbsp;http://getfirebug.com/logging  


### Advanced Server Logging Tools

So, once you have both your server-side logging running, and your client side development tools, you can start looking at Meteor specific extensions like the Meteor Chrome DevTools Extension.  This lets you actually observe server logging in the client!  Because the database is everywhere.  As is logging.

**Chrome DevTools Extension (Server)**  
https://github.com/gandev-de/meteor-server-console  


![image](https://raw.github.com/gandev-de/meteor-server-console/screenshots/package-scope-functionality.png "Meteor Server Console")  


============================================================
#### Application Patterns  

Once those pieces are in place, you're totally ready to start logging events in your application.  In practice, there are a half-dozen commands that are particularly useful.  Here are three quick examples illustrating very common logging patterns in Meteor.  

````js
// EXAMPLE 1:  Logging an error if the data is not available
Template.landingPage.postsList = function(){
  try{
    return Posts.find();
  }catch(error){
    //color code the error (red)
    console.error(error);
  }
}

// EXAMPLE 2: Inspecting objects in a Handlebar template helper
Template.landingPage.getId = function(){
  // using a group block to illustrate function scoping
  console.group('coolFunction');
  
  // inspect the current data object that landingPage is using
  console.log(this);

  // inspect a specific field of the locally scoped data object
  console.log(JSON.stringify(this._id);

  // close the function scope
  console.groupEnd();
  return this._id;
}

// EXAMPLE 3:  Logging events and user interactions  
Template.landingPage.events({
  'click .selectItemButton':function(){
    // color code and count the user interaction (blue)
    console.count('click .selectItemButton');
  }
});

// EXAMPLE 4:  Adding log levels
// the best pattern I've found for setting debug and trace levels so far
// this approach keeps file locations and line numbers correct in stack traces

var DEBUG = false;
var TRACE = false;
Template.landingPage.events({
  'click .selectItemButton':function(){
    TRACE && console.count('click .selectItemButton');
    
    Meteor.call('niftyAction', function(errorMessage, result){
        if(errorMessage){
            DEBUG && console.error(errorMessage);    
        }
    });
  }
});

````

============================================================
#### Disable Logging in Production

When in production, you probably won't want logging to continue running, so try overriding the console functions.  
````js
if (!DEBUG_MODE_ON) {
    console = console || {};
    console.log = function(){};
    
    console.log = function(){};
    console.error = function(){};
    console.count = function(){};
    console.info = function(){};
}
````


============================================================
#### Winston  
Lastly, if you need something more powerful than the default logging options, you might want to look at a tool like Winston.  Go to [Atmosphere](https://atmosphere.meteor.com), and simply search for ``Winston`` to find the latest packages available.  Be warned, however - [Winston](https://github.com/flatiron/winston) is a sophisticated product, and while it exposes a lot of functionality, it will also add a layer of complexity to your application.  
