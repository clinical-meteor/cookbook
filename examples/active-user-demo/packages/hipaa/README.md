## clinical:hipaa  

HIPAA Compliance for Meteor Apps.  Meta package containing audit log, user accounts, and ssl security.



==================================
#### Table of Contents  

- Installation  
- Packages  
- HIPAA Compliance Self-Assessment Checklist
- Hosting Providers Willing to Sign Business Associate Agreements (BAA)  
- HIPAA Compliant Scale Out Using Meteor
- Policies and Procedures
- Roles API  
- Crypto API  
- Hipaa API  
- HipaaPolicies API


==================================
#### Installation  

``meteor add clinical:hipaa``

================================================
####  HIPAA Compliance Questionaire

https://catalyze.io/hipaa-self-assessment-checklist


==================================
#### Packages

This is a meta package, and includes the following sub-packages:  

[accounts-base](https://atmospherejs.com/meteor/accounts-base)  
[accounts-password](https://atmospherejs.com/meteor/accounts-password)  
[alanning:roles](https://atmospherejs.com/alanning/roles)  
[clinical:hipaa-audit-log](http://github.com/awatson1978/clinical-hipaa-audit-log)  
[clinical:hipaa-policies](http://github.com/awatson1978/clinical-hipaa-policies)  
[clinical:hipaa-routes](http://github.com/awatson1978/clinical-hipaa-routes)  
[force-ssl](https://atmospherejs.com/meteor/force-ssl)  
[jparker:crypto-aes](https://atmospherejs.com/jparker/crypto-aes)  


================================================
####  HIPAA Compliance Self-Assessment Checklist

https://catalyze.io/hipaa-self-assessment-checklist


================================================
####  Hosting Providers Willing to Sign Business Associate Agreements (BAA)  

[Modulus.io](http://modulus.io/)  
[Catalyze.io](http://catalyze.io)  

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


==================================
#### Roles API  

The Roles API has two primary method:
````js
Roles.addUsersToRoles(userId, rolesArray, group)
Roles.userIsInRole(userId, rolesArray, group)
````

You can see their use in the following code example:
````js
if(Meteor.isServer){
  var userId = Accounts.createUser({
    email: user.email,
    password: "apple1",
    profile: { name: user.name }
  });
  Roles.addUsersToRoles(userId, ['admin', 'manage-users', 'view-secrets']);

  Meteor.publish('secrets', function (group) {
    if (Roles.userIsInRole(this.userId, ['view-secrets','admin'], group)) {
      return Meteor.secrets.find({group: group});
    } else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
  });
}
````

There is also an ``isInRole`` convenience helper for client side.
````html
<template name="header">
  <header>
    {{#if isInRole 'admin'}}
      {{> admin_nav}}  
    {{/if}}
  </header>
</template>
````


==================================
#### Crypto API  

There's technically nothing in HIPAA that specifically says that an organization has to encrypt their data at rest; but many people prefer to do so.  Of those who do, there's also differing opinions on whether the default encryption is sufficient that comes with the operating system or database.  For those who are particularly paranoid, and don't trust the operating system or database, the ``clinical:hipaa`` package comes with an AES encryption algorithm, so you can do in-app encryption and ensure that your data-at-rest is secure.

````js
encrypted = CryptoJS.AES.encrypt("Message", "Passphrase");
console.log(encrypted.toString());
// 53616c7465645f5fe5b50dc580ac44b9be85d240abc5ff8b66ca327950f4ade5

decrypted = CryptoJS.AES.decrypt(encrypted, "Passphrase");
console.log(decrypted.toString(CryptoJS.enc.Utf8));
// Message
````

================================================
####  Hosting Providers Willing to Sign Business Associate Agreements (BAA)  

[Modulus.io](http://modulus.io/)  
[Catalyze.io](http://catalyze.io)  

================================================
####  HIPAA Compliant Scale Out Using Meteor

Phase 1 - Development (1 server)  
``meteor add clinical:hipaa``  

Phase 2 - Platform as a Service (2 to 10 servers)  
  [modulus.io - Node/Meteor App Hosting on AWS](https://modulus.io/)
  [compose.io - Mongo Hosting on AWS](http://www.mongohq.com/)  


Phase 3 - Infrastructure as a Service (11+ servers)  
  [Amazon Web Services](http://aws.amazon.com/)  
  [Deploying a Meteor App on Elastic Beanstalk](https://groups.google.com/forum/#!topic/meteor-talk/VxMQzpVFpME)  

Phase 4 - Federal HIPAA
  [Amazon Web Services - HIPAA/Federal Tier](http://aws.amazon.com/compliance/)  
  [Amazon Web Services - HIPAA Whitepaper](https://aws.amazon.com/about-aws/whats-new/2009/04/06/whitepaper-hipaa/)

==================================
#### Licensing  

All code is MIT.  Use as you will.  Disrupt the system.  It needs all the help it can get.

Policy and Procedures and Creative Commons.  
