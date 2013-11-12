Hi.  Welcome to the Meteor Cookbook; a FAQ and tutorial culled and currated from over 9 months of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.


**Index**  

- [General Advice](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/general-advice.md)  
- [Language References](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/terminology.md)
  - [Terminology](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/terminology.md)  
  - [Syntax](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/syntax.md)  
  - [Grammar](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/grammar.md)  
- [Installation](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/installation.md)  
  - [Quickstart](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/quickstart.md)  
  - [Integrated Development Environment](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/webstorm.md)
  - [Test Driven Development](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/test-driven-development.md)  
- Site Mechanics
    - [File Structure](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/filestructure.md) 
    - [Event Cycle](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/event-cycle.md) 
    - [Namespacing](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/namespacing.md) 
    - [App Structure](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/appstructure.md) 
      - Models
      - Views
      - Controllers
- Open Systems Interconnection Model
  - Application Layer
    - Routing
    - Workflow
      - Pages
      - Modal Dialogs
      - Errors & Alerts
  - Presentation Layer
    - [Templates](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/templates.md)  
    - Responsive Design
    - [Animations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/animations.md)  
    - Page Transitions
    - Fonts
  - [Data Layer](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/datalayer.md)
    - [Collections](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/collections.md)
      - [User Accounts](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/accounts.md)  
      - Images (GridFS)
      - Geolocation
      - Analytics
    - Document Schemas
    - Data Validation
    - [Data Transformations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/data-transformations.md)
    - [Database Management](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/database-management.md)
  - Transport Layer
    - Data Distribution Protocol
    - Clustering
  - Network Layer
    - [Environments](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/environments.md)  
      - [Development](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/environments-development.md)  
      - [Production](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/environments-production.md)  
    - Peer to Peer
    - Mesh Networking
  - Data-Link Layer
    - WebKit Browsers
      - [File IO](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/fileio.md)  
      - Network IO
      - Haptics IO
    - Mobile Devices
      - Accelerometer
      - Camera
  - Physical Layer
    - Keybindings
    - Mouse Controls
    - Mutlitouch
    - Sign Language
- [Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/packages.md)  
- [Errors](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/errors.md)  
- [Recipes](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/recipes.md)  
  - Blog
  - Forum
  - Mobile Apps
  - Landing Page
  - Image Archive
  - Content Management System
  - Microblogging Framework
  - Workqueues
  - Geolocation  
  - Resource Scheduling  
  - Data Analytics  
- [Breaking Changes](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/breaking-news.md)  

**In Progress**  
[Async & Futures](https://gist.github.com/possibilities/3443021)  
[Database Migrations](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/database-migrations.md)  




**Community Breaking News - 0.6.6**  

As of 0.6.6, Package.register_extention() is now deprecated and breaks applications.  Please remove any such calls from your packages.

````js
// Depreciated as of Meteor 0.6.6  
// Package.register_extension(
//     "otf", function (bundle, source_path, serve_path, where) {
//         bundle.add_resource({
//             type: "static",
//             path: '/fonts/' + serve_path.split('/').pop(),
//             source_file: source_path,
//             where: where
//         });
//     }
// );
````



**Sample Applets**  
New section.  Probably going to eventually wind up in the recipes.md page.  

Fonts & Calligraphy  
http://fonts.meteor.com/  

Data Sets  
http://hubble.meteor.com/  

Acceptance Testing  
http://safety-harness.meteor.com/  

Creating Forms  
http://forms-kitchen-sink.meteor.com/  

Understanding The Rendering Event Loop  
http://reactive-rendering-tests.meteor.com/  

Dictionary  
http://dictionary.meteor.com/

Mobile Devices - iOS in Particular  
https://github.com/awatson1978/cordova-phonegap  

**Useful Modules/Recipes**  

Reactive Overlays  
https://github.com/awatson1978/reactive-overlays  

------------------------
### Support
Found this package to be useful?  Consider tipping the package maintainer for their time!  

[![Support via Gittip](https://raw.github.com/gittip/www.gittip.com/master/www/assets/gittip.png)](https://www.gittip.com/awatson1978/)  

