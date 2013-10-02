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

**External Resources**  
[Async & Futures](https://gist.github.com/possibilities/3443021)

**Community News - 0.6.5**  

With the recent release of version 0.6.5, many applications and packages broke and people are seeing errors all over the place.  Here's a quick rundown on getting apps back up and running again.


````js
//------------------------------------------------------
// application-wide updates using the command line

// try running the following
sudo mrt add standard-app-packages

// if that doesn't work, use a text editor and update the packages file
cd myapp
sudo nano .meteor/packages
> standard-app-packages

//------------------------------------------------------
// debugging errors; updating packages

//TypeError: Object # has no method 'methods'  
//This is caused by a call to ``Meteor.methods()`` in a package.  Add the following added to the ``package.js`` file to fix it.
api.use('standard-app-packages');

//TypeError: Cannot call method 'find' of undefined  
//Same type of error, except to ``Meteor.users.find()``.
api.use('accounts-base');

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

