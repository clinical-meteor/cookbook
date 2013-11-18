 


### Client Side Logging Tools  
If you haven't explored the console API, be prepared for a treat.  There's actually all sorts of things that you can do with console.log commands.  So much so, in fact, that you may find yourself not needing Winston or other logging frameworks.  

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
