


------------------------------------------------------------------
## Application Recipies

### HIPAA Compliant Application
- meteor add accounts-ui
- meteor add force-ssl
- mrt add hippa-audit-log




------------------------------------------------------------------
## Device Detection

**Installation**  
````
mrt add device-detection
````

**Controller Syntax**  
````js
Meteor.Device.isTV();
Meteor.Device.isTablet();
Meteor.Device.isPhone();
Meteor.Device.isDesktop();
Meteor.Device.isBot();
````

**Model Syntax**
````
{{#if isTV}}TV{{/if}}
{{#if isTablet}}Tablet{{/if}}
{{#if isPhone}}Phone{{/if}}
{{#if isDesktop}}Desktop{{/if}}
{{#if isBot}}Bot{{/if}}
````
