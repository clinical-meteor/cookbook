## Nightwatch Unit Testing Functions for Meteor

#### Unit Testing Client-Side Javascript from the Client  
Meteor has a fairly extensive API, and places various objects on the global scope of the browser's Javascript environment, such as ``Session``, ``Template``, ``Collection``, and of course ``Meteor``.  Here is how to test methods on such objects using Nightwatch and the Selenium ``.execute()`` API.  

````js
exports.command = function(sessionVarName, expectedValue) {
  var client = this;
  this
    .execute(function(data){
      return Session.get(data);
    }, [sessionVarName], function(result){
      client.assert.ok(result.value);
      if(expectedValue){
        client.assert.equal(result.value, expectedValue);
      }
    })
    return this;
};
````


#### Unit Testing Server-Side Meteor-Methods from the Client  
Meteor provides remote procedure calls (RPC)  using the ``Meteor.methods()`` and ``Meteor.call`` API.  This doesn't let us test _all_ the code on the server; but it does allow us to test anything that's within the ``Meteor.method({})`` scope.  

````js
//
exports.command = function(methodName, arguments, callback) {

    var self = this;
    this
      .timeoutsAsyncScript(5000)
      .executeAsync(function (meteorMethodNameAndArguments, meteorCallback) {
          var meteorMethodName = meteorMethodNameAndArguments[0];
          var meteorArguments = meteorMethodNameAndArguments[1];
          Meteor.call(meteorMethodName, meteorArguments, function (meteorError, meteorResult) {
              var response = (meteorError ? { error: meteorError } : { result: meteorResult });
              meteorCallback(response);
          });
      }, [[methodName, arguments]], function (response) { // you need to pass an ARRAY of ONE argument, must be a bug          
          if (response && response.value && response.value.error) {
              throw 'Meteor apply (call) returned an error: ' + response.value.error;
          } else if (typeof callback === 'function') {
              callback(null, response.value.result)
          }
      });

    return this;
};
````

#### Example Meteor App  
So, lets see how this works in practice.  A simple HelloWorld app written with Meteor might look like the following:

````js
if(Meteor.isClient()){
  Session.setDefault("loggedInUser", "Jane Doe")
}
if(Meteor.isServer()){
  Meteor.methods({
    testMethod:function(){
       return "abc";
    },
    testMethodWithInput:function(value){
       return value * 2;
    }
  });
}
````

And the Nightwatch unit-test walkthrough of the above code would like the following:  

````js
module.exports = {
  "Check Client Session" : function (client) {

    var sessionBar = false;
    client
      .url("http://localhost:3000/list/users")
      .checkSession("loggedInUser", "Jane Doe")
      .end();
  },
  "Check Server Methods" : function (client) {

    var sessionBar = false;
    client
      .url("http://localhost:3000/list/users")
      .meteorCall("testMethod", false, function(error, result){
        client.assert.equal(result, "abc");
      })
      .meteorCall("testMethodWithInput", 3, function(error, result){
        client.assert.equal(result, 6);
      })
      .end();
  }
};
````

