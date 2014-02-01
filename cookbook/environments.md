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

**Q:  How do I specify application parameters based on environment?**    
``METEOR_SETTINGS`` environment variable can accept JSON objects.

````js
{"public":{"ga":{"account":"UA-XXXXXXX-1"}}}
````

These settings can then be accessed from ``Meteor.settings``.  

````js
Meteor.settings.public.ga.account
````
