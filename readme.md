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
    - [Model View Controller](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/model-view-controller.md) 
    - [Event Cycle](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/event-cycle.md) 
    - [Namespacing](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/namespacing.md) 
    - [Site Configuration](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/configuration.md)  
    - [Console Logging](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/logging.md)  
    - [Debugging](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/debugging.md)  
    - [Performance Tuning](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/performance-tunning.md)  
    - [Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages.md)  
      - [Upgrading Legacy Apps to Isopackage System](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/upgrading-to-0.9.x.md)  
      - [Clinical Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/packages-we-love.md)  
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
- [ActiveRecord]  
  - [Basic Pattern]
  - [Upsert Pattern]
  - [DoublePage Pattern]  
  - [SinglePage Pattern]  
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
  - [Non Standard Architectures](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/non-standard-architectures.md)     
  - [Mobile Apps](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/mobile.md)  
  - Parsing File Types
    - [XML](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/files.xml.md)   
    - [CSV](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/files.csv.md)  
- [Breaking Changes](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/breaking-news.md)  
- [Recommended Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages-we-love.md)  




##Applet Demos
Links to live versions of the examples associated with this cookbook.  


| Live Demo     | Source Available?|  Documented     | Interface   | Meteor Version  |
| ------------- |:----------------:| ----------------|----------------| ---------------:|
| [REST API](http://rest-api.meteor.com/)  | [rest-api](https://github.com/awatson1978/rest-api) | --- | bootstrap3 | 0.7.1.2 |
| [Workflow Routing](http://workflow-routing.meteor.com/)  | [workflow-routing](https://github.com/awatson1978/workflow-routing) |  --- | bootstrap3 | 0.8.0 |
| [Minimongo Table](https://minimongo-table.meteor.com)  | [minimongo-table](https://github.com/awatson1978/minimongo-table) | --- | bootstrap3 | 0.8.0.1 |
| [Offline Todos](http://offline-todos.meteor.com) | [offline-todos](https://github.com/awatson1978/offline-todos) | yes | bootstrap3 | 1.0 |
| [Dropzone UI](https://github.com/awatson1978/dropzone-ui) | [dropzone-ui](https://github.com/awatson1978/dropzone-ui) | yes | bootstrap3 |  0.9.1 | 
| [Stripe Payments - Per Service ](http://payment-per-service.meteor.com/)  | [payment-per-service](https://github.com/awatson1978/payment-per-service) | basic | bootstrap3 | 0.6.5 |
| [Stripe Payments - Subscriptions ](https://github.com/awatson1978/payment-subscription) | [payment-subscription](https://github.com/awatson1978/payment-subscription) |  --- | bootstrap3 |  0.6.5 |
| [Stripe Payments - Crowdsourcing Workflow](https://github.com/awatson1978/payment-crowdsourcing) | [payment-crowdsourcing](https://github.com/awatson1978/payment-crowdsourcing) |  --- | bootstrap3 | 0.6.5 |
| [Geolocated Parties](https://github.com/awatson1978/leaflet-parties)   | [leaflet-parties](https://github.com/awatson1978/leaflet-parties) | --- | bootstrap3 | 0.7.0.1 |
| [Run Command Line Program From UI](https://github.com/awatson1978/exec-command-line-from-ui/tree/master) | [exec-commaind-line-from-ui](https://github.com/awatson1978/exec-command-line-from-ui) |  --- | bootstrap3 | 0.8.1.3 |
| [Clinical Support Forum](http://clinical-support-forum.meteor.com/) | [clinical-support-forum](https://github.com/awatson1978/clinical-support-forum) | --- | bootstrap3 | 0.8.0 |
| [ActiveRecord Table](http://clinical-ui-crud-table.meteor.com/)      | [clinical-ui-crud-table](https://github.com/awatson1978/clinical-ui-crud-table) |  --- | bootstrap3 | 0.8.2 |
| [ActiveRecord List](http://clinical-ui-crud-table.meteor.com/)      | [clinical-ui-crud-list](https://github.com/awatson1978/clinical-ui-crud-list) |  --- | bootstrap3 | 0.8.0.1 |
| [ActiveRecord Forms](http://clinical-ui-forms.meteor.com/)     | [clinical-ui-forms](https://github.com/awatson1978/clinical-ui-forms) | --- | bootstrap3 | 0.6.5 |
| [Clinical UI Boilerplate](http://clinical-ui-boilerplate.meteor.com/)      | [panel-layout](https://github.com/awatson1978/panel-layout) |  --- | bootstrap3 | 0.8.0.1 |
| [Realtime Analytics Pipeline](http://realtime-analytics-pipeline.meteor.com/)      | [rest-analytics-pipeline](https://github.com/awatson1978/rest-analytics-pipeline) | --- | bootstrap3 | 0.9.1 |
| [Drag and Drop](http://drag-and-drop.meteor.com/)        | [drag-and-drop](https://github.com/awatson1978/drag-and-drop) | --- | bootstrap3 | 0.8.0 |
| [Green Eggs and Spam](https://green-eggs-and-spam.meteor.com)        | [green-eggs-and-spam](https://github.com/awatson1978/green-eggs-and-spam) | --- | bootstrap3 | 0.8.0 |
| [Fonts & Calligraph](http://fonts.meteor.com/)   | [fonts-site](https://github.com/awatson1978/fonts-site) |  no | bootstrap3 |0.6.5.1 |
| [Dictionary](http://dictionary.meteor.com/)             | [dictionary](https://github.com/awatson1978/dictionary) |  --- | bootstrap3 | 0.6.5 |
| [Collabtionary](http://collabtionary.meteor.com/)       | [collabtionary](https://github.com/awatson1978/collabtionary)      |  --- | bootstrap3 | 0.6.5 |
| [Hubble - CRUD & Datasets](http://hubble.meteor.com/)   | [hubble](https://github.com/awatson1978/hubble)      |  yes | bootstrap3 | 0.6.5 |

####Meteor Architecture  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  
