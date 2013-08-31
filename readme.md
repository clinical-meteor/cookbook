Hi.  Welcome to my Meteor Cookbook, FAQ, and Tutorial, culled from about 9 months of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas. 

**Updates 08/31/2013**  
The Cookbook is growing!  It was actually getting so cumbersome to edit, that I split it into a dozen files.  So, we now have an index!  Also, for the few people who asked, links from private gmail account have been removed to improve readability.


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



**Community News - 0.6.5**  

With the recent release of version 0.6.5, lots of applications and packages broke broke.  Here's a quick rundown on getting apps back up and running again.

````js
// try running the following
sudo mrt add standard-app-packages

// if that doesn't work, use a text editor and update the packages file
cd myapp
sudo nano .meteor/packages
> standard-app-packages
````

Also, packages that rely on the 'templating' package will need the following added to their ``package.js`` file.
````js
api.use('standard-app-packages');
````

