## Environment Detection

#### Environment Variables
To date, the following variables have been seen in the wild:  

PORT  
MONGO_URL  
ROOT_URL  
OPLOG_URL  
MONGO_OPLOG_URL
METEOR_SETTINGS  
METEOR_ENV
NODE_ENV  
NODE_OPTIONS  
DISABLE_WEBSOCKETS  
MAIL_URL  
DDP_DEFAULT_CONNECTION_URL  
HTTP_PROXY  
HTTPS_PROXY  
METEOR_SETTINGS 


#### Specifying application parameters based on setting files.  
The ``METEOR_SETTINGS`` environment variable can accept JSON objects, and will expose that object in ``Meteor.settings`` object.  First, add a ``settings.json`` to your app root with some configuration info.

````json
{"public":{"ga":{"account":"UA-XXXXXXX-1"}}}
````

Then you'll need to launch your application using your settings file.  
````sh
# run your app in local development mode with a settings file
sudo mrt --settings settings.json

# or bundle and prepare it as if you're running in production
# and specify a settings file
sudo meteor bundle output.tar.gz
tar -xzvf output.tar.gz
cd output
npm install fibers@1.0.1
MONGO_URL=mongodb://127.0.0.1:27017 PORT=3000 METEOR_SETTINGS=settings.json node main.js
````


These settings can then be accessed from ``Meteor.settings`` and used in your app.

````js
Meteor.startup(function(){
  console.log('Google Analytics Account', Meteor.settings.public.ga.account);
});

````



#### Environment Detection on the Server

Environment variables are also available to the server via the ``process.env`` object.  
````js
//------------------------------------------------------------------------------------------------------
// server/server.js
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
````

#### Environment Detection on the Client  
 
To detect the environment on the server, we have to create a helper method on the server, as the server will determine which environment it is in, and then call the helper method from the client.  Basically, we just relay the environment info from the server to the client.  

````js
//------------------------------------------------------------------------------------------------------
// server/server.js
// we set up a getEnvironment method

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
// and then call it from the client
 
Meteor.call("getEnvironment", function (result) {
  console.log("Your application is running in the " + result + "environment.");
});
````

#### Configuring an App Based on Different Environemnts
For more complex applications, you'll want to create larger ``settings.json`` objects with multiple configuration objects for each environment, pass it into your application at startup, detect the environment, and then set up your application.  

````js
var environment, settings;

environment = process.env.METEOR_ENV || "development";

settings = {
  development: {
    public: {
      package: {
        name: "jquery-datatables",
        description: "Sort, page, and filter millions of records. Reactively.",
        owner: "LumaPictures",
        repo: "meteor-jquery-datatables"
      }
    },
    private: {}
  },
  staging: {
    public: {},
    private: {}
  },
  production: {
    public: {},
    private: {}
  }
};

if (!process.env.METEOR_SETTINGS) {
  console.log("No METEOR_SETTINGS passed in, using locally defined settings.");
  if (environment === "production") {
    Meteor.settings = settings.production;
  } else if (environment === "staging") {
    Meteor.settings = settings.staging;
  } else {
    Meteor.settings = settings.development;
  }
  console.log("Using [ " + environment + " ] Meteor.settings");
}

````
