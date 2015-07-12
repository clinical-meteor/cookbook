## clinical:hipaa  

HIPAA Compliance for Meteor Apps.  Meta package containing audit log, user accounts, and ssl security.

#### Installation  

``meteor add clinical:hipaa``

#### Packages

This is a meta package, and includes the following sub-packages:  

````bash
# for private PHI
[accounts-base](https://atmospherejs.com/meteor/accounts-base)
[accounts-password](https://atmospherejs.com/meteor/accounts-password)  

# for auditing PHI access
clinical:hipaa-audit-log  

# for secure transmission of PHI
[force-ssl](https://atmospherejs.com/meteor/force-ssl)
````

We're currently in the process of adding at-rest disk encryption for secure PHI at rest.

#### API

````html
{{> thirdPartyPolicy}}
{{> approvedToolsPolicy}}
{{> auditingPolicy}}
{{> breachPolicy}}
{{> configurationManagementPolicy}}
{{> dataIntegrityPolicy}}
{{> dataManagementPolicy}}
{{> dataRetentionPolicy}}
{{> disasterRecoveryPolicy}}
{{> disposableMediaPolicy}}
{{> employeesPolicy}}
{{> facilityAccessPolicy}}
{{> hipaaBusinessAssociateAgreement}}
{{> hipaaInheritanceForPaasCustomers}}
{{> hipaaInheritanceForPlatformAddOnCustomers}}
{{> hipaaMappingToCatalyzeControls}}
{{> idsPolicy}}
{{> incidentResponsePolicy}}
{{> keyDefinitions}}
{{> policyManagementPolicy}}
{{> riskManagementPolicy}}
{{> rolesPolicy}}
{{> systemAccessPolicy}}
{{> vulnerabilityScanningPolicy}}
````

Of course, any of these templates can be included in a route using Iron Router or Flux Router.  
