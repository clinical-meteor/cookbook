## Integration of 3rd Party APIs  

Conceptually, it's really not all that hard to integrate 3rd party REST APIs.  However, there are a few steps to it, and you'll find that it may help to create a sandbox environment for the API before integrating it into your application.

#### Create Sandbox Environment  
This really can't be stressed enough.  If you try writing an API wrapper inside of another application, there's a good chance it's going to get confused with all the other features you're trying to implement.  When writing an API wrapper, the goal is to create a wrapper object which implements the API function locally within Meteor.  Implementing all the nifty application functionality comes later.  So, do yourself a favor... set up a new project to implement the API wrapper.  

````sh
meteor create api-sandbox
````

Second, you'll want to start creating a smart package for use with Atmosphere and Meteorite.
https://atmosphere.meteor.com/wtf/package

The documentation for creating smart packages is somewhat spotty, so check out the following page from the Meteor Cookbook.
https://github.com/awatson1978/meteor-cookbook/blob/master/packages.md

In particular, you'll want to make sure that you have an api.export() call, like so:
api.export('PredictionIO');

After that, just add a file to your package to implement the API by creating a Prediction object, which should look something like this:

PredictionIO = {
  identify: function(input){
    return Http.get('http://prediction.io/api/identity/' + input);    
  },
  record_action_on_item: function(firstInput, secondInput){
    return Http.put('http://prediction.io/api/record_action_on_item/' + firstInput + '&' + secondInput);    
  }
}

Meteor supports Http.get(), Http.post(), Http.put(), etc.
http://docs.meteor.com/#http_get

Between the api.export(), the Http methods, and that custom object, you should then be able to do the following in Meteor applications:

    PredictionIO.identify('John');
    PredictionIO.record_action_on_item('view', "HackerNews');

Obviously you'll want to adjust function names, arguments, urls, and the like, to create the proper syntax for the API.  But that should be about it!  :)

After all that is done, you'll want to post to Atmosphere for the community to use:
https://gist.github.com/awatson1978/7293949

Anyhow, do please keep me posted.  I'd be interested in giving this a spin once you have it all packaged up!  Now I'm going to be pondering what projects I'm working on that might need some machine prediction...  :)
