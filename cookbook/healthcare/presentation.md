Healthcare and Mobile Apps Presentation
==================================


#### History of Document Oriented Databases in Healthcare  
- [MUMPS](http://en.wikipedia.org/wiki/MUMPS)    
- [VISTA](http://en.wikipedia.org/wiki/VistA)  
- [Epic Systems](http://en.wikipedia.org/wiki/Epic_Systems)  


[Forbes:  What the Emergence of an EMR Giant Means for the Future of Healthcare Innovation](http://www.forbes.com/sites/davidshaywitz/2012/06/09/epic-challenge-what-the-emergence-of-an-emr-giant-means-for-the-future-of-healthcare-innovation/)


#### Adding HIPAA Compliance to Meteor Apps

````sh
# encrypt network communications
meteor add force-ssl

# separate user access bases on accounts, passwords, and roles
meteor add accounts-base
meteor add accounts-password
meteor add accounts-ui
mrt add accounts-ui-bootstrap-drop down
mrt add roles

# include an audit log
mrt add hippa-audit-log
git clone github.com/awatson1978/hippa-audit-log.git
````


####  HIPAA Compliant Scale Out Using Meteor

Phase 1 - Development (1 server)  
````sh 
sudo meteor 
````  

Phase 2 - Platform as a Service (2 to 10 servers)  
  [modulus.io - Node/Meteor App Hosting on AWS](https://modulus.io/)   
  [MongoHQ - Mongo Hosting on AWS](http://www.mongohq.com/)  


Phase 3 - Infrastructure as a Service (11+ servers)  
  [Amazon Web Services](http://aws.amazon.com/)  


Phase 4 - Federal HIPAA   
  [Amazon Web Services - HIPAA/Federal Tier](http://aws.amazon.com/compliance/)  
  [Amazon Web Services - HIPAA Whitepaper](https://aws.amazon.com/about-aws/whats-new/2009/04/06/whitepaper-hipaa/)    



