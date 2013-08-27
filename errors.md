------------------------------------------------------------------
## Exceptions and Errors

**Q:  Uncaught ReferenceError: Templates is not defined**  
Check that you haven't mispelled the word ``Template`` as ``Templates``.  It's a common typo.  Also check that your templates are references with a right arrow ``>``, like so:

````js
//correct
{{> customTemplate }}

//incorrect
{{ customTemplate }}
````

**Q: ReferenceError: Oauth is not defined**     

````js
// fixed by adding the following line of code (before the offending code)
Npm.require('oauth');

// error refers to this line of code
Oauth.registerService('stripe', 2, null, function(query) {
````


**Q:  Error: Cannot find module 'oauth'**  
Check that you ran ``meteor add oauth`` and not ``mrt add oauth``.  

````js
// smart.json
{
  "packages": { }
}

//.meteor/packages
oauth
````


**Q:   TypeError: Object #<Object> has no method 'methods'**  

````js
// this was missing in a package.js file
api.use('`standard-app-packages');

// so this caused errors within the package itself
Meteor.methods({
  // stuff....
})

````

**Q:   TypeError: Object # has no method 'require'**  


The following shamelessly ganked from @oortcloud's excellent unofficial FAQ.
https://github.com/oortcloud/unofficial-meteor-faq

**Q:   "Uncaught SyntaxError: Unexpected token Y"**  
Client-side error caused by the server crashing and sending a message starting with "Your app is crashing. Here's the latest log."  

**Q:   "TypeError: Object # has no method '_defineMutationMethods'"**  
Server-side error. Most likely, you forgot to place "new" before a constructor call in the client. Read more.  

**Q:   "Uncaught TypeError: Converting circular structure to JSON"**  
Check if you're trying to save into Session an object with circular references, such as a Collection. Read more.  

**Q:   "Unexpected mongo exit code 100. Restarting."**  
Mongo was killed without cleaning itself up. Try removing .meteor/local/db/mongod.lock. If that fails do an meteor reset.  



***MODULUS***  


**Error: a route URL prefix must begin with a slash**  
Gotta set the ``ROOT_URL`` to ``http://sub.domain.com``.  Be sure to include the http:// prefix.
