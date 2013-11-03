Hi.  Welcome to my Meteor Cookbook, FAQ, and Tutorial, culled from about 9 months of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.

**Updates 08/31/2013**  
The Cookbook is growing!  It was getting so cumbersome to edit that I split it into a dozen files.  Now have an index!  Also, for those who asked, links from private gmail accounts have been removed to improve readability.


**Index**  

[General Advice](https://github.com/awatson1978/meteor-cookbook/blob/master/general-advice.md)  
[Terminology](https://github.com/awatson1978/meteor-cookbook/blob/master/terminology.md)  
[Installation](https://github.com/awatson1978/meteor-cookbook/blob/master/installation.md)  
[Environments](https://github.com/awatson1978/meteor-cookbook/blob/master/environments.md)  
[Test Driven Development](https://github.com/awatson1978/meteor-cookbook/blob/master/test-driven-development.md)  
[Application Structure](https://github.com/awatson1978/meteor-cookbook/blob/master/appstructure.md) 
[Data Layer](https://github.com/awatson1978/meteor-cookbook/blob/master/datalayer.md)  
[User Accounts](https://github.com/awatson1978/meteor-cookbook/blob/master/accounts.md)  
[Packages](https://github.com/awatson1978/meteor-cookbook/blob/master/packages.md)  
[Errors](https://github.com/awatson1978/meteor-cookbook/blob/master/errors.md)  
[Recipes](https://github.com/awatson1978/meteor-cookbook/blob/master/recipes.md)  
[Breaking Changes](https://github.com/awatson1978/meteor-cookbook/blob/master/breaking-news.md)  
[WebStorm IDE](https://github.com/awatson1978/meteor-cookbook/blob/master/webstorm.md)

**External Resources**  
[Async & Futures](https://gist.github.com/possibilities/3443021)



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

