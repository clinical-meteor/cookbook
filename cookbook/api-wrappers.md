## Integration of 3rd Party APIs  

Conceptually, it's really not all that hard to integrate 3rd party REST APIs.  However, there are a few steps to it, and you'll find that it may help to create a sandbox environment for the API before integrating it into your application.


#### Create Sandbox Environment  
This really can't be stressed enough.  If you try writing an API wrapper inside of another application, there's a good chance it's going to get confused with all the other features you're trying to implement.  When writing an API wrapper, the goal is to create a wrapper object which implements the API function locally within Meteor.  Implementing all the nifty application functionality comes later.  So, do yourself a favor... set up a new project to implement the API wrapper.  

````sh
meteor create foo-api-sandbox
````

#### Create A Package For Your API Wrapper
Second, you'll want to start creating a smart package for use with Atmosphere and Meteorite.  The documentation for creating smart packages is somewhat spotty, so check out the following links for documentation.

https://atmosphere.meteor.com/wtf/package  
https://github.com/awatson1978/meteor-cookbook/blob/master/packages.md  

The files of your package will probably look something like this.
````sh
packages/foo-api-wrapper/smart.json
packages/foo-api-wrapper/package.js
packages/foo-api-wrapper/readme.md
packages/foo-api-wrapper/foo.api.wrapper.js
````

In particular, you'll want to make sure that you have an api.export() call, like so:

````js
Package.describe({
  summary: "Meteorite package that impliments the Foo API."
});

Package.on_use(function (api) {
    api.export('Foo');
    api.add_files('foo.api.wrapper.js', ["client","server"]);
});

````

#### Create the API Wrapper Object
After that, just add a file to your package to implement the API by creating a Prediction object, which should look something like this:

````js
Foo = {
  identify: function(input){
    return Http.get('http://foo.net/api/identify/' + input);    
  },
  record_action_on_item: function(firstInput, secondInput){
    return Http.put('http://foo.net/api/record_action_on_item/' + firstInput + '&' + secondInput);    
  }
}
````

Meteor supports Http.get(), Http.post(), Http.put(), etc, so that's undoubtably the best way to call your REST API.
http://docs.meteor.com/#http_get

If the API is chatty and verbose, you may receive multiple packets; in which case you'll need to reassemble them.  This is a big hassle.  If you think the API is returning multiple packets, you're probably going to want to use the 'request' npm module on the server.  You'll want to use a ``Npm.require('request')``.  
https://github.com/mikeal/request



#### Useful Tools  
Some useful tools as you implement the API....

Dev HTTP Client  
https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm

REST Client  
https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/


#### Include the API Package in your Application  
At this point, you're still building your package, so you probably haven't published to atmosphere yet.  Manually add your package to your application by editing your smart.json file, like so:  
````js
  "meteor": {
    "branch": "master"
  },
  "packages": {
    "api-wrapper": {
      "git": "https://github.com/myaccount/foo-api-wrapper.git"
    }
  }
}
````


#### Create the API Wrapper Object
Between the api.export(), the Http methods, and that custom object, you should then be able to do the following in Meteor applications:

    Foo.identify('John');
    Foo.record_action_on_item('view', "HackerNews');

Obviously you'll want to adjust function names, arguments, urls, and the like, to create the proper syntax for the API.  

#### Publish to Atmosphere  
After all that is done, you'll want to post to Atmosphere for the community to use, so people can simply run Add your ``mrt add foo-api-wrapper``.
https://gist.github.com/awatson1978/7293949



