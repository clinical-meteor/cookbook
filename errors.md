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

````
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



**Q:   TypeError: Object # has no method 'require'**  
