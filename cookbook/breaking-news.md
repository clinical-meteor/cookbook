 
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



**Community Brekaing News - 0.6.5**  

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
