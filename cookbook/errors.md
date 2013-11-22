------------------------------------------------------------------
## Command Line Errors

**run: You're not in a Meteor project directory.**  
Try creating a ``.meteor/packages`` file.  Sometimes it gets corrupted.  Most of my apps have the following as a base.
````
standard-app-packages
iron-router
less
````

------------------------------------------------------------------
## Console Errors

**Uncaught ReferenceError: Templates is not defined**  
Check that you haven't mispelled the word ``Template`` as ``Templates``.  It's a common typo.  Also check that your templates are references with a right arrow ``>``, like so:

````js
//correct
{{> customTemplate }}

//incorrect
{{ customTemplate }}
````


**ReferenceError: ServiceConfiguration is not defined**     

The first step to resolving 'is not defined' errors is to check to see if there's a core package available.  Be aware that sometimes you'll need to change naming schemas.  In this example, there's a core package in snake-case that gets converted to camelCase in the error message.
````sh
# first we want to get a list of all the available packages
ls ~/.meteor/packages

# then lets add the relevant package to our application
# note the use of meteor, and not mrt
meteor add service-configuration
````


**ReferenceError: Oauth is not defined**     
If there's not a core package available, the next step is to start trying to add Atmosphere or NPM packages.  Atmosphere packages are pretty self-explanitory.  But Npm packages are a bit trickier.  Here's the pattern.  
````js
// fixed by adding the following line of code (before the offending code)
Npm.require('oauth');

// error refers to this line of code
Oauth.registerService('stripe', 2, null, function(query) {
````



**Error: Cannot find module 'oauth'**  
Check that you ran ``meteor add oauth`` and not ``mrt add oauth``.  

````js
// smart.json
{
  "packages": { }
}

//.meteor/packages
oauth
````


**TypeError: Object #<Object> has no method 'methods'**  

````js
// this was missing in a package.js file
api.use('`standard-app-packages');

// so this caused errors within the package itself
Meteor.methods({
  // stuff....
})

````

**TypeError: Object # has no method 'require'**  


The following shamelessly ganked from @oortcloud's excellent unofficial FAQ.
https://github.com/oortcloud/unofficial-meteor-faq

**"Uncaught SyntaxError: Unexpected token Y"**  
Client-side error caused by the server crashing and sending a message starting with "Your app is crashing. Here's the latest log."  

**"TypeError: Object # has no method '_defineMutationMethods'"**  
Server-side error. Most likely, you forgot to place "new" before a constructor call in the client. Read more.  

**"Uncaught TypeError: Converting circular structure to JSON"**  
Check if you're trying to save into Session an object with circular references, such as a Collection. Read more.  

**"Unexpected mongo exit code 100. Restarting."**  
Mongo was killed without cleaning itself up. Try removing .meteor/local/db/mongod.lock. If that fails do an meteor reset.  

**EACCES, permission denied**  
Permissions problem!  Try using ``sudo``, but the recommended fix is to reinstall Meteor and Meteorite.  


------------------------------------------------------------------
## Modulus Errors

**Error: a route URL prefix must begin with a slash**  
Gotta set the ``ROOT_URL`` to ``http://sub.domain.com``.  Be sure to include the http:// prefix.


**Error: Cannot find module 'fibers'**  
Sometimes I see this error when I try to push an app while another version is already running.  Try stopping the app from the Modulus admin panel, then deploying.  Also, versions matter.  Using ``sudo demeteorizer -n 0.10.0`` seems to be a safe bet.
https://github.com/onmodulus/demeteorizer/issues/14  



