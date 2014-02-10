## Console Logging

If you're from a DevOps, Operations, or SysAdmin background, this is probably one of the first sections of the Meteor Cookbook that you looked into.  If you're from any other background, you may be surprised to find just how many tools are available for logging.  Many people consider log files to be one of the most important part of a running application, and I've seen few successful applications put into production that didn't have some type of logging available.  

As far as Meteor goes, there are many, many options available.  Particularly if you dive into the [Npm repositories](https://npmjs.org/search?q=logging).  But one of the aims of the Meteor Cookbook is to use pure Meteor, when possible, and to advocate the using of the native tools.  Before looking to add extra packages and tools, lets start trying to learn the tools we already have.  

### Client Side Logging Tools

If you haven't explored the console API, be prepared for a treat.  There's actually all sorts of things that you can do with the built in Console API that's native to every Chrome and Safari installation.  So much so, in fact, that you may find yourself not needing Winston or other logging frameworks.  

The first thing you'll want to do is install client side logging and developer tools.  Chrome and Safari both ship with them, but Firefox requires the Firebug extension.  

**Firebug Extension**      
https://addons.mozilla.org/en-US/firefox/addon/firebug/  

Then, you'll want to check out the Console API documentation.  The following two documents are invaluable resources for learning console logging.  

**Chrome Developer Tools**      
https://developers.google.com/chrome-developer-tools/docs/console  

**Firebug (Client)**    
http://getfirebug.com/logging  

### Server Side Logging Tools  

**Chrome DevTools Extension (Server)**  
https://github.com/gandev-de/meteor-server-console  

**Pipe Server Log to File**    
A quick reminder that Node apps expose two outputs, std_out and std_err, and that you can pipe those outputs to logfiles at runtime.  
````sh
meteor > my_app_log.log 2> my_app_err.log
````

### Application Patterns  

Here's a breakdown of how I go about doing my console logging;
````js
Template.landingPage.postsList = function(){
  // using a try/catch block to log an error if the database flaps
  try{
    return Posts.find();
  }catch(error){
    //color code the error (red)
    console.error(error);
  }
}
Template.landingPage.getId = function(){
  // using a group block to illustrate function scoping
  console.group('coolFunction');
  
  // inspect an object
  console.log(JSON.stringify(this._id);

  // close the function scope
  console.groupEnd();
  return this._id;
}
Template.landingPage.events({
  'click .selectItemButton':function(){
    // color code the user interaction (blue)
    console.count('click .selectItemButton');
  }
});
````

**WebStorm LiveTemplate**      
A useful code snippet for managing database flapping.  This is something of a stop-gap measure, and there are many people who will recommenda against using try/catch blocks.  So, be careful about it's use.  The ``$SELECT$`` and ``$END$`` tags are WebStorm specific.  
````js
try{
  $SELECT$
}catch(error){
  console.log(error);
}
$END$
````
