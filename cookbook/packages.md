## PACKAGES

**Q:  How do I install packages without Atmosphere?**  

Simple!  Just add a smart.json file in the root of your project, and add the package in as a smart.json using the syntax described in the following code sample.  
https://atmosphere.meteor.com/wtf/package  
````json
{
  "meteor": {
    "branch": "master"
  },
  "packages": {
    "audio-click": {
      "git": "https://github.com/awatson1978/audio-click.git"
    },
    "fonts-barcode": {
      "git": "https://github.com/awatson1978/fonts-barcode.git"
    },
    "hipaa-audit-log": {
      "git": "https://github.com/awatson1978/hipaa-audit-log.git"
    },
    "reactive-overlays": {
      "git": "https://github.com/awatson1978/reactive-overlays.git"
    },
    "accounts-famous-dead-people": {
      "git": "https://github.com/awatson1978/accounts-famous-dead-people.git"
    },
    "device-detection": {},
    "cordova-phonegap": {},
    "keybindings": {}
  }
}
````


**Q:  How do I create a package for distribution?**  
So, there isn't an official documented API for creating packages, as far as I'm aware.  The best we can do is sort of document all of the api calls we've seen in the wild.  The following example illustrates all the different syntax we've seen in creating packages.


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

Once all that is done, you should have a Foo object which you can now use in your application, like so:

````js
 // and now use the function like so:
 Foo.function();  
````


