**Q:  What environment variables are supported?**  
So far, the following variables have been seen in the wild:  

PORT  
MONGO_URL  
ROOT_URL  
OPLOG_URL  
MONGO_OPLOG_URL
METEOR_SETTINGS  
NODE_OPTIONS  
NODE_ENV  
DISABLE_WEBSOCKETS  
MAIL_URL  
DDP_DEFAULT_CONNECTION_URL  
HTTP_PROXY  
HTTPS_PROXY  
METEOR_SETTINGS 

**How do I specify application parameters based on environment?**    
``METEOR_SETTINGS`` environment variable can accept JSON objects.

````js
{"public":{"ga":{"account":"UA-XXXXXXX-1"}}}
````

These settings can then be accessed from ``Meteor.settings``.  

````js
Meteor.settings.public.ga.account
````
**Cloud Development**    
https://www.nitrous.io/  

Quick deploy a meteor application on Nitrous.io using the following command... 
````js
parts install meteor
````

**What's the best PaaS provider for Meteor apps?**    
Modulus.io has bypassed Heroku as our favorite PaaS provider.  Check them out!  

http://blog.modulus.io/deploying-meteor-apps-on-modulus  
http://blog.modulus.io/demeteorizer  
https://github.com/onmodulus/demeteorizer  


