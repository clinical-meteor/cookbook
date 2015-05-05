============================================
#### Command Line Errors  

**run: You're not in a Meteor project directory.**  
Try creating a ``.meteor/packages`` file.  Sometimes it gets corrupted.  Most of my apps have the following as a base.
````
standard-app-packages
iron-router
less
````

**Throw "There was a problem checking out " + self.checkoutType + ": " + (self.co**  
Your ``.meteorite`` installation may be corrupted.  Delete and reinstall meteorite.  

````sh
sudo rm -rf ~/.meteorite
sudo npm install -g meteorite
````
============================================
## Console Errors  


**Exception in queued task: MongoError: invalid query**  
You have a bad Mongo query.  Add the following snippet to your application, which will create a log of all the queries.  The query before the error is what you need to fix.  

````js
Meteor.startup(function () {
    var wrappedFind = Meteor.Collection.prototype.find;

    console.log('[startup] wrapping Collection.find')
    
    Meteor.Collection.prototype.find = function () {
      console.log(this._name + '.find', JSON.stringify(arguments))
      return wrappedFind.apply(this, arguments);
    }
})
````


**Uncaught ReferenceError: Templates is not defined**  
Check that you haven't mispelled the word ``Template`` as ``Templates``.  It's a common typo.  Also check that your templates are references with a right arrow ``>``, like so:

````js
//correct
{{> customTemplate }}

//incorrect
{{ customTemplate }}
````

Also, make sure that if you're defining templates in a package, that you specify ``['client']``, and don't specify the server with ``['client', 'server']`` or by omitting the location.  The proper syntax should be: 

````js
  api.use([
    'templating',
    'iron:router',
    'grove:less'
  ], ['client']);
````


**ReferenceError: ServiceConfiguration is not defined**     

The first step to resolving 'is not defined' errors is to check to see if there's a core package available.  Be aware that sometimes you'll need to change naming schemas.  In this example, there's a core package in snake-case that gets converted to camelCase in the error message.
````sh
# first we want to get a list of all the available packages
cat ~/.meteor/packages

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

**TypeError: Object #<Object> has no method 'find''**  

Check if one of your collections is using a reserved keyword defined by the Meteor API.  In particular, you can't create a collection called Assets since 0.6.5.

````js
// the following errors out; remove it
Assets = new Meteor.Collection('assets');
````

**Error: A method named '/users/insert' is already defined**   

You've defined a collection twice; in this particular example, the Users collection.  

````js
// check your code the following and remove it
Users = new Meteor.Collection('users');
````

**"Uncaught TypeError: Converting circular structure to JSON"**  
Check if you're trying to save into Session an object with circular references, such as a Collection.

**"Unexpected mongo exit code 100. Restarting."**  
Mongo was killed without cleaning itself up. Try removing .meteor/local/db/mongod.lock. If that fails do an meteor reset.  

**EACCES, permission denied**  
Permissions problem!  Try using ``sudo``, but the recommended fix is to reinstall Meteor and Meteorite.  

============================================
#### Modulus Errors  

**Error: a route URL prefix must begin with a slash**  
Gotta set the ``ROOT_URL`` to ``http://sub.domain.com``.  Be sure to include the http:// prefix.


**Error: Cannot find module 'fibers'**  
Sometimes I see this error when I try to push an app while another version is already running.  Try stopping the app from the Modulus admin panel, then deploying.  Also, versions matter.  Using ``sudo demeteorizer -n 0.10.0`` seems to be a safe bet.
https://github.com/onmodulus/demeteorizer/issues/14  

