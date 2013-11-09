 
**Notes on Development Environments**    
https://github.com/awatson1978/meteor-cookbook/blob/master/environments-development.md

**Notes on Production Environments**  
https://github.com/awatson1978/meteor-cookbook/blob/master/environments-production.md

**Cloud Development**    
https://www.nitrous.io/  

Quick deploy a meteor application on Nitrous.io using the following command... 
````js
parts install meteor
````

**Q:  How do I detect the environment?**  
````js
//------------------------------------------------------------------------------------------------------
// server/server.js
// Generically, detecting the server hosting environment on a Meteor.js application stack is as follows.
// Note that process.env can only run on the server side, since it requires node.js
 
if (Meteor.is_server) {
    Meteor.startup(function () {
        // detect environment by getting the root url of the application
        console.log(JSON.stringify(process.env.ROOT_URL));
 
        // or by getting the port
        console.log(JSON.stringify(process.env.PORT));
 
        // alternatively, we can inspect the entire process environment
        console.log(JSON.stringify(process.env));
    });
}
 
 
//------------------------------------------------------------------------------------------------------
// server/server.js
// If we want the client to know what environment the server is operating in, we need to define a method
 
Meteor.methods({
  getEnvironment: function(){
    if(process.env.ROOT_URL == "http://localhost:3000"){
        return "development";
    }else{
        return "staging";
    }
  }
 });    
 
//------------------------------------------------------------------------------------------------------
// client/main.js
// Which allows us to do the following to get the environemnt
 
Meteor.call("getEnvironment", function (result) {
      console.log("Your application is running in the " + result + "environment.");
 });
 ````
