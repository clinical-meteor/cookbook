HIPAA Compliance
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
  [compose.io - Mongo Hosting on AWS](http://www.mongohq.com/)  


Phase 3 - Infrastructure as a Service (11+ servers)  
  [Amazon Web Services](http://aws.amazon.com/)  
  [Deploying a Meteor App on Elastic Beanstalk](https://groups.google.com/forum/#!topic/meteor-talk/VxMQzpVFpME)  
  
Phase 4 - Federal HIPAA   
  [Amazon Web Services - HIPAA/Federal Tier](http://aws.amazon.com/compliance/)  
  [Amazon Web Services - HIPAA Whitepaper](https://aws.amazon.com/about-aws/whats-new/2009/04/06/whitepaper-hipaa/)    

================================================
####  Is Meteor HIPAA Compliant?

The thing to remember about HIPAA is that it was enacted in 1996.   Windows95 was only a year old, and the previous decade had seen an explosion in the personal computer market, with DOS, MacOS, and various hobby operating systems like Commodore64 and Atari.  The thing to remember is that HIPAA was enacted as a response to DOS and single-user operating systems.  The essence of HIPAA is simply "don't use DOS, MacOS, Commodore64 or similar single-person operating systems to build an electronic medical record or health device".  That's all it's really saying.  

HIPAA doesn't require NASA or military grade cryptography.  It doesn't require hardened datacenters to prevent hackers.  All it's basically asking is for developers not to build on single-user operating systems.  Simple enough.  Nowdays, with Windows Vista (which was based on WindowsNT), MacOSX (based on FreeBSD and NextStep), Linux, and other operating systems... well, they all come by default as multi-user operating system.  It's hard not to buy a laptop or home computer that isn't HIPAA compliant.

Except for in one area:  mobile devices.  A phone with no concept of users isn't HIPAA compliant.  Don't try to build a retro EMR on the old RAZR flip-top hardware, or that antique Mac Classic sitting in your attic.  That's verboten. 

But what about Android and iOS?  Ah.  They're in a gray zone, progressively getting closer to being whitelisted as acceptable.  Particularly if your phone requires long PIN numbers to unlock.   Or, better yet, use a webapp, and have a complete user accounts system.  Which is exactly what you're trying to do with Meteor and Cordova.

Long story short... you're in pretty much exactly the spot you want to be in.  The four things that a HIPAA compliant app needs, are:

- uniquely assigned user accounts for each individual user
- user passwords to separate access between users
- a hipaa audit log to track who has access what data
- SSL certificates for secure data transfer

And, as you can imagine, those packages all exist in the Meteor ecosystem.  For my apps, I use the following combination of packages:

accounts-base
accounts-password
accounts-ui
alanning:roles
clinical:hipaa-audit-log
force-ssl

As to the question about keeping the data encrypted on the cordova client.  I can't speak too much for Android devices, as I primarily develop on iOS.  For iOS devices, you're in good luck.  Each application is run in it's own cryptographically signed and secure sandbox.  That's why you have to do all that certificate request/generation/import business to get the app to compile on your device.  And if you have SSL certificates enabled, it should be a totally secure pipeline between client and server.  

The only question after that is implementing user accounts and passwords.  Maybe user roles if you want to get fancy.

Once you get big, and have thousands or tens of thousands of users, there does become an issue of risk mitigation with regard to data leaks.  Usually those occur through inside disgruntled employees, bureaucratic carelessness, and sometimes crackers interested in blackmail and extortion rackets.  It's in those instances that a hardened datacenter might be of interest.  But even a run-of-the-mill datacenter will usually suffice.  The security protections that Modulus, Heroku, Rackspace, Amazon, Joyent, etc are putting in place far exceed the security protections that individual or small-teams can put into place.

If your investors/employers/clients are particularly skittish and nervous, there are people at Amazon who will be happy to take their money, and provide a 'HIPAA Tier'.  Basically, in return for 5 to 6 figure annual costs (or more), they'll be willing to share the risk profile of running an EHR app with a datacenter client.

Right now the biggest HIPAA question with regard to running Meteor healthcare apps in Cordova webapps boils down to the question of whether 4 digit PINs are HIPAA compliant.  But that's a question that's bigger than Meteor/Mongo/Minimongo.  Keep an eye on Apple HealthKit, and whether anybody ever raises a suit about somebody accessing somebody else's data because the 4 digit OS PIN wasn't strong enough.  

