 

#### Console Logging  
If you haven't explored the console API, be prepared for a treat.  There's actually all sorts of things that you can do with console.log commands.  So much so, in fact, that you may find yourself not needing Winston or other logging frameworks.  

**Chrome Developer Tools - Console Logging**    
https://developers.google.com/chrome-developer-tools/docs/console  

**Firebug - Console Logging**    
http://getfirebug.com/logging  


**Pipe Server Log to File**    
A quick reminder that Node apps expose two outputs, std_out and std_err, and that you can pipe those outputs to logfiles at runtime.  
````sh
meteor > my_app_log.log 2> my_app_err.log
````
