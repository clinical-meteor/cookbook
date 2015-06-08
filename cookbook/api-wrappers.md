# Integration of 3rd Party APIs  

Conceptually, it's really not all that hard to integrate 3rd party REST APIs.  However, there are a few steps to it, and you'll find that it may help to create a sandbox environment for the API before integrating it into your application.

## Preparation
### Create Sandbox Environment
You will need a simple environment for the following development process. If you try writing an API wrapper inside of another application, there's a good chance it's going to get confused with all the other features you're trying to implement. So, do yourself a favor and set up a new project to implement the API wrapper. 

```sh
meteor create foo-api-wrapper
```

## Write an API Wrapper
In order to work with REST APIs within Meteor, you will want to create an API wrapper. The API wrapper mirrors the structure of the API, while giving you JavaScript methods to access each endpoint.

## Create A Package For Your API Wrapper
You'll want to start creating a smart package for use with Atmosphere and Meteorite.  To get an overview of the package creation process, check out the following links for documentation.

* [Meteor - Writing Packages](http://docs.meteor.com/#/full/writingpackages)
* [Atmosphere - Publish Packages](https://atmosphere.meteor.com/wtf/package)
* [Meteor Cookbook - Createing a package for distribution](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages.md#creating-a-package-for-distribution) 

### File structure
The files of your package will probably look something like this:
```sh
foo-api-wrapper/smart.json
foo-api-wrapper/package.js
foo-api-wrapper/readme.md
foo-api-wrapper/foo.api.wrapper.js
```

Initially, the files can be kept in the `packages` sub-directory of your sandbox project. This will make it so that Meteor can detect your package, enabling you to install the package via `meteor add username:package-name`.

### package.js
The file `package.js` defines the overall package purpose and structure, including what functionality the package provides. In particular, you'll want to make sure that you have an api.export() call within `package.js`, like so:

```js
Package.describe({
  summary: "Meteor package that impliments the Foo API."
});

Package.on_use(function (api) {
    api.export('Foo');
    api.add_files('foo.api.wrapper.js', ["client","server"]);
});

```

##Create the API Wrapper Object
After creating your `package.js`, just add a file to your package to implement the API by creating a Prediction object, which should look something like this:

```js
Foo = {
  identify: function(input){
    return Http.get('http://foo.net/api/identify/' + input);    
  },
  record_action_on_item: function(firstInput, secondInput){
    return Http.put('http://foo.net/api/record_action_on_item/' + firstInput + '&' + secondInput);    
  }
}
```

Using the [Meteor HTTP](http://docs.meteor.com/#/full/http) object is a good way to call your REST API. Meteor HTTP supports the following methods:

* `[HTTP.call()](http://docs.meteor.com/#/full/http_call)`
* `[HTTP.get()](http://docs.meteor.com/#http_get)`
* `[HTTP.post()](http://docs.meteor.com/#/full/http_post)`
* `[HTTP.put()](http://docs.meteor.com/#/full/http_put)`
* `[HTTP.del()](http://docs.meteor.com/#/full/http_del)`
* 

### API Packet Streams
If the API is chatty and verbose, you may receive multiple packets; in which case you'll need to reassemble them.  This is a big hassle.  If you think the API is returning multiple packets, you're probably going to want to use the ['request' npm module](https://github.com/mikeal/request) on the server.  

```js
Npm.require('request')
```  

## Useful HTTP/REST Tools  
Some useful tools as you implement the API....

* [Dev HTTP Client](https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm)  
* [REST Client](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/)  

## Include the API Package in your Application  
At this point, you're still building your package, so you probably haven't published to atmosphere yet.  Manually add your package to your application by editing your smart.json file, like so:  
```js
  "meteor": {
    "branch": "master"
  },
  "packages": {
    "api-wrapper": {
      "git": "https://github.com/myaccount/foo-api-wrapper.git"
    }
  }
}
```
## Create the API Wrapper Object
Between the api.export(), the HTTP methods, and that custom object, you should then be able to do the following in Meteor applications:

```
Foo.identify('John');
Foo.record_action_on_item('view', "HackerNews');
```

Obviously you'll want to adjust function names, arguments, urls, and the like, to create the proper syntax for the API.  

## Publish to Atmosphere  
After all that is done, you'll want to post to Atmosphere for the community to use, so people can simply add your wrapper like so:

```
meteor add username:foo-api-wrapper
```
