##Meteor Cookbook  

Hi.  Welcome to the Meteor Cookbook; a FAQ and tutorial culled and currated from over 18 months of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.

## Breaking News  

A lot of people have reported problems with the auto-update feature in Meteor 0.9.  If you have an application in production that you'd like to prevent from auto-updating, there's reports that the following environment variable will ensure that your app doesn't start into the auto-update script.

````js
export METEOR_TEST_UPDATE_MANIFEST="offline"
````
Otherwise, just be sure **not** to press ``ctrl-C`` when your app starts up.  The new package manager can run a different version of Meteor in different git branches in a project repository.  So if you just let it do it's thing, you should be good to go.  The initial problems have mostly been worked out.    

#### Upgrading Apps and 0.9.x

I've found the easiest way to upgrade apps is to create a new project from scratch, and copy all the files from the old directory to the new one, and then readd the necessary packages.

````sh
mv myapp myapp-0.8.3
cd ..
meteor update
meteor create myapp
meteor update
cd ..
cp -R myapp-0.8.3/* myapp
meteor add iron:router
meteor add mrt:bootstrap-3
meteor add etc:etc
````

Alternatively, you can try removing your existing packages, upgrading, and then adding the new ones.  With this method, there can be smart.json, smart.lock, .meteor/release, and other files that can sometimes get out-of-sync, and still reference the old packaging system.  That's why it's maybe better to start a new project clean and copy files over manually.

````sh
cd myapp
mrt remove iron-router
mrt remove bootstrap-3
mrt remove nifty-widget
mrt remove etc-etc
meteor update
meteor add iron:router
meteor add mrt:bootstrap-3
meteor search widget
meteor add nifty:widget
meteor add etc:etc
````
  
#### Upgrading Packages 0.9.x

If you need to upgrade your packages to 0.9.x, start by reading the hackpad:  
[Add Meteor 0.9 support for your Existing Packages](https://hackpad.com/Add-Meteor-0.9-support-for-your-Existing-Packages-P0R7y1PiXlu)  

````sh
meteor create --package mypackage
cd mypackage
# do stuff
meteor publish --create
meteor publish
````


## Index  

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
  - [Atom Editor](https://github.com/awatson1978/meteor-api-for-atom-editor)  
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
    - [Event Cycle](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/event-cycle.md) 
    - [Namespacing](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/namespacing.md) 
    - [Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages.md)  
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
    - [Filters](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/ddp.filters.md)  
    - Observers
  - [Schema Migrations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/schema.changes.md)     
  - [Data Validation](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/validation.md)  
  - [Database Management](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/database-management.md)
  - [Replica Sets](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/replica-sets.md)  
  - [Horizontal Scaling](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/horizontal-scaling.md)  
  - [Integrating 3rd Party Databases](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/orm.layers.md)  
- [Routing](https://github.com/EventedMind/iron-router)
  - [Single Page Design](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.single.md)
  - [Multi-Page Design](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.multi.md)
  - [Multi-Page with Routing](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/pages.multi.router.md)  
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
  - [Two-Way Data Binding](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/data-binding.md)  
  - [Proxies](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/proxies.md)  
  - [Email](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/email.md)  
  - [File IO](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/fileio.md)  
  - [Video IO](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/video.md)  
  - [Keybindings](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/keybinding.md)  
  - [Mutlitouch](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/multitouch.md)  
  - [Peer to Peer](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/peer-to-peer.md)   
  - [Image Assets](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/image-assets.md)  
  - [Animations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/animations.md)  
  - [Mobile Apps](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/mobile.md)  
  - [Async Workers](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/async-workers.md)  
  - [Offline](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/offline.md)  
  - [File Uploads](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/file-uploads.md)  
  - [Healthcare Apps]
  - [Web Components and Card UI](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/card-ui.md)  
  - Parsing File Types
    - [XML](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/files.xml.md)   
    - [CSV](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/files.csv.md)  
- [Breaking Changes](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/breaking-news.md)  
- [Recommended Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages-we-love.md)  




##Applet Demos
Links to live versions of the examples associated with this cookbook.  

[Dropzone UI](https://github.com/awatson1978/dropzone-ui)  
[Offline Todos](http://offline-todos.meteor.com)  
[Stripe Payments - Per Service ](https://github.com/awatson1978/payment-per-service)  
[Stripe Payments - Subscriptions ](https://github.com/awatson1978/payment-subscription)  
[Stripe Payments - Crowdsourcing Workflow](https://github.com/awatson1978/payment-crowdsourcing)  
[Geolocated Parties](https://github.com/awatson1978/leaflet-parties)  
[Leaderboard Nightwatch](https://github.com/awatson1978/leaderboard-nightwatch)  
[Run Command Line Program From UI](https://github.com/awatson1978/exec-command-line-from-ui/tree/master)  
[Clinical Support Forum](http://clinical-support-forum.meteor.com/)  
[Clinical UI Crud List](http://clinical-ui-crud-list.meteor.com/)  
[Clinical UI Crud Table](http://clinical-ui-crud-table.meteor.com/)  
[Clinical UI Forms](http://clinical-ui-forms.meteor.com/)  
[Clinical UI Boilerplate](http://clinical-ui-boilerplate.meteor.com/)  
[Realtime Analytics Pipeline](http://realtime-analytics-pipeline.meteor.com/)  
[Leaderboard Frameable](http://leaderboard-frameable.meteor.com)  
[Leaderboard Testrunner](http://leaderboard-testrunner.meteor.com)  
[Minimongo Table](https://minimongo-table.meteor.com)  
[Drag and Drop](http://drag-and-drop.meteor.com/)  
[Green Eggs and Spam](https://green-eggs-and-spam.meteor.com)  
[Workflow Routing](http://workflow-routing.meteor.com/)  
[Panel Layout](http://panel-layout.meteor.com/)  
[Panel Layout Testrunner](http://panel-layout-testrunner.meteor.com/)  
[REST API](http://rest-api.meteor.com/)  
[REST API Testrunner](http://rest-api-testrunner.meteor.com/)    
[GroupThink](http://groupthink.meteor.com/)  
[Fonts & Calligraph](http://fonts.meteor.com/)    
[Dictionary](http://dictionary.meteor.com/)  
[Collabtionary](http://collabtionary.meteor.com/)  
[Hubble - CRUD & Datasets](http://hubble.meteor.com/)  
[Mobile Devices - iOS in Particular](https://github.com/awatson1978/cordova-phonegap)  


####Meteor Architecture  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  
