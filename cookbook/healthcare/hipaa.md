HIPAA
=====================


================================================
#### Adding HIPAA Compliance to Meteor Apps

````sh
# encrypt network communications
meteor add force-ssl

# separate user access bases on accounts, passwords, and roles
meteor add accounts-base
meteor add accounts-password
meteor add accounts-ui
meteor add alanning:roles

# include an audit log
meteor add clinical:hipaa-audit-log
````

================================================
####  HIPAA Compliant Scale Out Using Meteor

Phase 1 - Development (1 server)  
``sudo meteor``  

Phase 2 - Platform as a Service (2 to 10 servers)  
  [modulus.io - Node/Meteor App Hosting on AWS](https://modulus.io/)   
  [MongoHQ - Mongo Hosting on AWS](http://www.mongohq.com/)  


Phase 3 - Infrastructure as a Service (11+ servers)  
  [Amazon Web Services](http://aws.amazon.com/)  
  [Deploying a Meteor App on Elastic Beanstalk](https://groups.google.com/forum/#!topic/meteor-talk/VxMQzpVFpME)  
  
Phase 4 - Federal HIPAA   
  [Amazon Web Services - HIPAA/Federal Tier](http://aws.amazon.com/compliance/)  
  [Amazon Web Services - HIPAA Whitepaper](https://aws.amazon.com/about-aws/whats-new/2009/04/06/whitepaper-hipaa/)    
