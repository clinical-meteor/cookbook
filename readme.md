##Meteor Cookbook  

Hi.  Welcome to the Meteor Cookbook; a FAQ and tutorial culled and curated from over 2 years of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.  

========================================
#### Build A Weblog!
With version 1.0 of Meteor having been released, the Meteor Cookbook is getting a rewrite to bring all of it's examples and recipes up to 1.0 status.  The default application that all the examples build towards is creating a weblog; which can then be used as the basis of self-publishing, online journals & diaries, bulletin board systems, chat rooms, advocacy platforms, electronic medical records, personal health & fitness records, quantified-self applications, or any other application that might need a weblog.  

![Weblog](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Weblog%20Wireframes.jpg)  


========================================
#### Clinical Meteor Track  

Meteor Cookbook is the official documentation of the Clinical Meteor Track project...  a version of Meteor designed for biomedical, clinical, and healthcare applications.  Check out the project page to learn more, and be aware that these two projects are being run in parallel.  

http://clinical.meteor.com/

========================================
#### Index  

- [Cookbook Conventions](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook-conventions.md)  
- [General Advice](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/general-advice.md)  
- Meteor Style Guide
  - [Terminology](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/terminology.md)  
  - [Syntax](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/syntax.md)  
  - [Punctuation](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/punctuation.md)  
  - [Reserved Keywords](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/reserved.keywords.md)  
- [Installation](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/installation.md)  
  - [Quickstart](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/quickstart.md)  
  - [Development Tools](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/development-tools.md)  
  - [Atom Editor](https://github.com/awatson1978/meteor-api)  
  - [Webstorm IDE](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/webstorm.md)
  - [Test Driven Development](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/test-driven-development.md)  
    - [The Refactoring Process](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/refactoring.process.md)   
    - [Refactoring Patterns](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/refactoring.patterns.md)  
    - [Refactoring With Test Driven Development](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/refactoring.process.tdd.md)   
    - [Writing Acceptance Tests (with Nightwatch)](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/writing.acceptance.test.md)  
    - [Writing Unit Tests (with Tinytest)](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/writing.unit.tests.md)  
    - [Writing Unit Tests (with Jasmine Unit and Velocity)](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/writing.unit.tests.with.jasmine.md)  
- Site Mechanics
    - [File Structure](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/filestructure.md)
    - [Dependencies](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/dependencies.md)  
    - [App Structure](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/appstructure.md) 
      - [Non Standard Architectures](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/non-standard-architectures.md)     
      - [Mobile Apps](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/mobile.md)  
      - [Offline](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/offline.md)  
    - [Event Cycle](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/event-cycle.md) 
    - [Namespacing](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/namespacing.md) 
    - [Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages.md)  
      - [Upgrading Legacy Apps to Isopackage System](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/upgrading-to-0.9.x.md)  
      - [Clinical Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/packages-we-love.md)  
    - [Site Configuration](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/configuration.md)  
    - [Console Logging](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/logging.md)  
    - [Debugging](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/debugging.md)  
    - [Performance Tuning](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/performance-tunning.md)  
- [Environments](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/environments.md)  
  - [Hosting Providers](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/hosting-providers.md) 
  - [Deploying to Production](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/deploying.to.production.md)
  - [Running in Production](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/environments-production.md)  
  - [Environment Detection](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/environment-detection.md)  
  - [Scaling Quickstart](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/scaling.md)  
- [Data Layer](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/datalayer.md)  
  - [Schema Design](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/schema-design.md)  
  - [Collections](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/collections.md)  
    - [User Accounts](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/accounts.md)  
    - [Multi User Publications](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/ddp.multiuser.publications.md)    
    - [Aggregation](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/aggregation.md)  
    - [Filters & Searching](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/ddp.filters.md)  
    - [Observers](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/observers.md)  
  - [Schema Migrations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/schema.changes.md)     
  - [Data Validation](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/validation.md)  
  - [Database Management](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/database-management.md)
  - [Replica Sets](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/replica-sets.md)  
  - [Horizontal Scaling](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/horizontal-scaling.md)  
  - [Integrating 3rd Party Databases](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/orm.layers.md)  
- [Routing](https://github.com/EventedMind/iron-router)
  - [Single Page Design](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.single.md)
  - [Multi-Page Design](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.multi.md)
  - [Page Not Found](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/routing.page-not-found.md)  
- Meteor UI Components
  - [Alerts & Errors](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.alerts.md)  
  - [Accordion](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/accordion.md)   
  - [Modal Dialogs](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.dialogs.md)
  - [Tabbed Workflow](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/workflow.md)
  - [Tagging](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/tagging.md)
  - [Window Resize](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/window.resize.md)
  - [Theming](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/theming.md)  
- Application Programming Interfaces
  - [Integration of 3rd party APIs](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/api-wrappers.md)
  - [Exposing a REST API](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/rest.md)
- Data Driven Documents (D3)  
- [Error Referece](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/errors.md)  
- [Recipes](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/recipes.md)  
  - [Offline Apps](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/offline.md)    
  - [Two-Way Data Binding](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/data-binding.md)  
  - [Proxies](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/proxies.md)  
  - [Email](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/email.md)  
  - [File IO](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/fileio.md)  
  - [Video IO](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/video.md)  
  - [Keybindings](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/keybinding.md)  
  - [Mutlitouch](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/multitouch.md)  
  - [Image Assets](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/image-assets.md)  
  - [Animations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/animations.md)  
  - [Async Workers](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/async-workers.md)  
  - [File Uploads](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/file-uploads.md)  
  - [Web Components and Card UI](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/card-ui.md)  
  - Parsing File Types
    - [XML](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/files.xml.md)   
    - [CSV](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/files.csv.md)  
- [Breaking Changes](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/breaking-news.md)  
- [Recommended Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages-we-love.md)  




##Applet Demos
Links to live versions of the examples associated with this cookbook.  


| Live Demo     | Source Available?|  Documented     | Meteor Version  |
| ------------- |:----------------:| ----------------|---------------:|
| [Offline Todos](http://offline-todos.meteor.com) | [offline-todos](https://github.com/awatson1978/offline-todos) | yes | 1.0 |
| [Dropzone UI](https://github.com/awatson1978/dropzone-ui) | [dropzone-ui](https://github.com/awatson1978/dropzone-ui) | yes |  0.9.1 | 
| [Stripe Payments - Per Service ](http://payment-per-service.meteor.com/)  | [payment-per-service](https://github.com/awatson1978/payment-per-service) | basic | <0.9 |
| [Stripe Payments - Subscriptions ](https://github.com/awatson1978/payment-subscription) | --- |  --- |  <1.0 |
| [Stripe Payments - Crowdsourcing Workflow](https://github.com/awatson1978/payment-crowdsourcing) | --- |  --- | <1.0 |
| [Geolocated Parties](https://github.com/awatson1978/leaflet-parties)   | --- | --- | <1.0 |
| [Run Command Line Program From UI](https://github.com/awatson1978/exec-command-line-from-ui/tree/master) | --- |  --- | <1.0 |
| [Clinical Support Forum](http://clinical-support-forum.meteor.com/)      | --- |  --- |<1.0 |
| [Clinical UI Crud List](http://clinical-ui-crud-list.meteor.com/)    | --- | --- | <1.0 |
| [Clinical UI Crud Table](http://clinical-ui-crud-table.meteor.com/)      | --- |  --- |<1.0 |
| [Clinical UI Forms](http://clinical-ui-forms.meteor.com/)     | --- | --- | <1.0 |
| [Clinical UI Boilerplate](http://clinical-ui-boilerplate.meteor.com/)      | --- |  --- |<1.0 |
| [Realtime Analytics Pipeline](http://realtime-analytics-pipeline.meteor.com/)      | --- | --- | <1.0 |
| [Minimongo Table](https://minimongo-table.meteor.com)      | --- | --- | <1.0 |
| [Drag and Drop](http://drag-and-drop.meteor.com/)        | --- | --- | <1.0 |
| [Green Eggs and Spam](https://green-eggs-and-spam.meteor.com)        | --- | --- | <1.0 |
| [Workflow Routing](http://workflow-routing.meteor.com/)      | --- |  --- |<1.0 |
| [Panel Layout](http://panel-layout.meteor.com/)         | --- | --- | <1.0 |
| [Panel Layout Testrunner](http://panel-layout-testrunner.meteor.com/)     | --- | --- | <1.0 |
| [REST API](http://rest-api.meteor.com/)               | --- | --- | <1.0 |
| [GroupThink](http://groupthink.meteor.com/)             | --- |--- |  <1.0 |
| [Fonts & Calligraph](http://fonts.meteor.com/)   | --- |  --- |<1.0 |
| [Dictionary](http://dictionary.meteor.com/)             | --- |  --- |<1.0 |
| [Collabtionary](http://collabtionary.meteor.com/)       | ---      |  --- | <1.0 |
| [Hubble - CRUD & Datasets](http://hubble.meteor.com/)   | ---      |  --- |<1.0 |

####Meteor Architecture  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  
