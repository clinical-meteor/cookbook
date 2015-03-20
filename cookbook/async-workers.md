Basic Async Recipes
======================================

https://gist.github.com/possibilities/3443021


Async Worker Scripts
======================================


Excellent writeup by Kuba Wyrobek on StackOverflow   
http://stackoverflow.com/questions/24743402/how-to-get-an-async-data-in-a-function-with-meteor

============================================
#### Client Side

````js
if (Meteor.isClient) {
  Template.herokuDashboard.helpers({
      appInfo: function() {
          return Session.get("herokuDashboard_appInfo");
      }
  });
  Template.herokuDashboard.created = function(){
      Meteor.call('getData', function (error, result) {
          Session.set("herokuDashboard_appInfo",result);
      } );
  }
}
````



============================================
#### Server Side

````js
if (Meteor.isServer) {
  var asyncFunc = function(callback){
      setTimeout(function(){
          // callback(error, result);
          // success :
          callback(null,"result");
          // failure:
          // callback(new Error("error"));
      },2000)
  }
  var syncFunc = Meteor._wrapAsync(asyncFunc);
  Meteor.methods({
      'getData': function(){
          var result;
          try{
               result = syncFunc();
          }catch(e){
              console.log("getData method returned error : " + e);
          }finally{
              return result;
          }

      }
  });
}
````
