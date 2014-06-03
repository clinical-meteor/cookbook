## Environment Detection

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

**Q:  How do I configure my app differently for each environment?**   
Todo:  convert to javascript
````coffee
environment = process.env.METEOR_ENV or "development"

settings =
  development:
    public:
      package:
        name: "jquery-datatables"
        description: "Sort, page, and filter millions of records. Reactively."
        owner: "LumaPictures"
        repo: "meteor-jquery-datatables"
    private: {}

  staging:
    public: {}
    private: {}

  production:
    public: {}
    private: {}

unless process.env.METEOR_SETTINGS
  console.log "No METEOR_SETTINGS passed in, using locally defined settings."
  if environment is "production"
    Meteor.settings = settings.production
  else if environment is "staging"
    Meteor.settings = settings.staging
  else
    Meteor.settings = settings.development

  # Push a subset of settings to the client.
  __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public  if Meteor.settings and Meteor.settings.public
  console.log "Using [ #{ environment } ] Meteor.settings"
````
