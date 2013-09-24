 

------------------------------------------------------------------
## PACKAGES


**Q:  How do I create a package for distribution?**  
Unofficially, this seems to to be all the available options currently in use in the package creation process.  

````js
 // and now use the function like so:
 Foo.function();  
````


````js
// package.js  
// should go into the /meteor-project/packages/sample_package directory  

Package.describe({
  // define a message to describe the package
  summary: "This is a sample package that doesn't actually do anything.",
  
  // for internal dependency packages, set the internal flag true
  internal: false  
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
Npm.depends({sample_package: "0.2.6", bar: '1.2.3'});
 
Package.register_extension(
    "otf", function (bundle, source_path, serve_path, where) {
        bundle.add_resource({
            type: "static",
            path: '/fonts/' + serve_path.split('/').pop(),
            source_file: source_path,
            where: where
        });
    }
);
Package.on_use(function (api) {
  
  var path = Npm.require('path');
  
  // sample_package.js  
  Foo = Npm.require('sample_package');  
  
  // export the object
  api.export('Foo');
  
  api.add_files(path.join('audio', 'click1.wav'), 'client');
    
  // define dependencies using api.use
  api.use('package_name', 'directory/to/install/into');
 
  // add files to specific locations using api.add_files
  api.add_files('library_name.js', 'directory/to/install/into');
 
  // example: add multiple files to a location using an array
  api.add_files(['first_library.js', 'second_library.js'], 'client');
 
  // example: add file to multiple locations using an array
  api.add_files('other_library_name.js', ['client', 'server']);
});
 
Package.on_test(function (api) {
 
  // define dependencies using api.use
  api.use('package_name');
 
  // add files to specific locations using api.add_files
  api.add_files('library_name.js', 'directory/to/install/into');
});
````


### Packages We Love And Should be Included Meteor Core


**Payments - Stripe**  
https://atmosphere.meteor.com/package/stripe
https://mail.google.com/mail/u/0/#search/%5Bmeteor%5D/13cfcabb30e80135

**Date/Time - Moment**  
https://github.com/possibilities/meteor-moment

**REST Interface - Meteor-CollectionApi**  
https://github.com/crazytoad/meteor-collectionapi

**Clustering - Meteor-Cluster**    
https://github.com/arunoda/meteor-cluster

**Iron Router**    
https://github.com/EventedMind/meteor-iron-router

**Device Detection**  
https://atmosphere.meteor.com/package/device-detection  

**Browser Detection**  
https://atmosphere.meteor.com/package/browser-detection  

**Mocha-Web**  
https://atmosphere.meteor.com/package/mocha-web   

**Event Hooks**  
https://atmosphere.meteor.com/package/event-hooks  

**Collection2**  
https://atmosphere.meteor.com/package/collection2  

**cron**  
https://atmosphere.meteor.com/package/cron  

**Mesosphere**  
https://atmosphere.meteor.com/package/Mesosphere  

**Login Page**  
https://atmosphere.meteor.com/package/accounts-entry   

**LeapJS**  
https://github.com/kevohagan/meteor-leapmotion  
http://js.leapmotion.com/examples  
