## clinical:hipaa  

HIPAA Compliance for Meteor Apps.  Meta package containing audit log, user accounts, and ssl security.


==================================
#### Installation  

``meteor add clinical:hipaa``


==================================
#### Packages

This is a meta package, and includes the following sub-packages:  

[accounts-base](https://atmospherejs.com/meteor/accounts-base)  
[accounts-password](https://atmospherejs.com/meteor/accounts-password)  
[clinical:hipaa-audit-log](http://github.com/awatson1978/clinical-hipaa-audit-log)  
[force-ssl](https://atmospherejs.com/meteor/force-ssl)  

We're currently in the process of adding at-rest disk encryption for secure PHI at rest.


==================================
#### Policy Index

* [Introduction](policyTemplates/introduction.md)
* [HIPAA Inheritance for PaaS Customers](policyTemplates/hipaa_inheritance_for_paas_customers.md)
* [HIPAA Inheritance for Platform Add-on Customers](policyTemplates/hipaa_inheritance_for_platform_addon_customers.md)
* [Policy Management Policy](policyTemplates/policy_management_policy.md)
* [Risk Management Policy](policyTemplates/risk_management_policy.md)
* [Roles Policy](policyTemplates/roles_policy.md)
* [Data Management Policy](policyTemplates/data_management_policy.md)
* [System Access Policy](policyTemplates/systems_access_policy.md)
* [Auditing Policy](policyTemplates/auditing_policy.md)
* [Configuration Management Policy](policyTemplates/configuration_management_policy.md)
* [Facility Access Policy](policyTemplates/facility_access_policy.md)
* [Incident Response Policy](policyTemplates/incident_response_policy.md)
* [Breach Policy](policyTemplates/breach_policy.md)
* [Disaster Recover Policy](policyTemplates/disaster_recovery_policy.md)
* [Disposable Media Policy](policyTemplates/disposable_media_policy.md)
* [IDS Policy](policyTemplates/ids_policy.md)
* [Vulnerability Scanning Policy](policyTemplates/vulnerability_scanning_policy.md)
* [Data Integrity Policy](policyTemplates/data_integrity_policy.md)
* [Data Retention Policy](policyTemplates/data_retention_policy.md)
* [Employees Policy](policyTemplates/employees_policy.md)
* [Approved Tools Policy](policyTemplates/approved_tools_policy.md)
* [3rd Party Policy](policyTemplates/policyTemplates/3rd_party_policy.md)
* [Key Definitions](policyTemplates/key_definitions.md)
* [Catalyze HIPAA Business Associate Agreement (“BAA”)](policyTemplates/catalyze_hipaa_business_associate_agreement.md)
* [HIPAA Mappings to Catalyze Controls](policyTemplates/hipaa_mapping_to_catalyze_controls.md)


==================================
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



==================================
#### Licensing  
