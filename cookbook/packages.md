##Packages


The packaging system has been updated in 0.9!  Please check out the following link for the latest news on the packaging system.

[Unipackage Hackpad](https://meteor.hackpad.com/Unipackage-tvas8pXYMOW)  

================================================
#### Adding and Managing Packages

````sh
# figure out what packages are currently installed
meteor list

# search by namespace
meteor search nifty

# search by package name or keyword
meteor search widget

# add package
meteor add nifty:widget

# confirm that it's installed
meteor list

# if it has a * next to and needs upgrading
meteor update nifty:widget

# when you no longer want the package
meteor remove nifty:widget

`````

================================================
#### Creating a Package for Distribution  

So, there isn't an official documented API for creating packages, as far as I'm aware.  The best we can do is sort of document all of the api calls we've seen in the wild.  The following example illustrates all the different syntax we've seen in creating packages.


````js
// package.js  
// should go into the /meteor-project/packages/sample_package directory  

Package.describe({
  // define a message to describe the package
  summary: "This is a sample package that doesn't actually do anything.",

  // update this value before you run 'meteor publish'
  version: "1.2.1",

  // if this value isn't set, meteor will default to the directory name
  name: "samplePackage",
  
  // and add this value if you want people to access your code from Atmosphere
  git: "http://github.com/myaccount/nifty-widget"
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
Npm.depends({
  sample_package: "0.2.6", 
  bar: '1.2.3'
});

Package.onUse(function (api) {
  
  var path = Npm.require('path');
  
  // expose an object from an Npm package by first referencing it
  Foo = Npm.require('sample_package');  
  
  // and then exporting it
  api.export('Foo');
  
  // add_files has been deprecated in favor of addFiles
  api.addFiles(path.join('audio', 'click1.wav'), 'client');
    
  // define dependencies using api.use
  api.use('package_name', 'directory/to/install/into');
 
  // add files to specific locations using api.addFiles
  api.addFiles('library_name.js', 'directory/to/install/into');
 
  // example: add multiple files to a location using an array
  api.addFiles(['first_library.js', 'second_library.js'], 'client');
 
  // example: add file to multiple locations using an array
  api.addFiles('other_library_name.js', ['client', 'server']);
});
 
Package.onTest(function (api) {
 
  // define dependencies using api.use
  api.use('package_name');
 
  // add files to specific locations using api.add_files
  api.addFiles('library_name.js', 'directory/to/install/into');
});
````

Once all that is done, you should have a Foo object which you can now use in your application, like so:

````js
 // and now use the function like so:
 Foo.niftyFunction();  
````


================================================
#### Installing Packages without Atmosphere  

**Deprecated - Pre 0.9.x**  

Adding a custom packages to your application is simple.  Just add a smart.json file in the root of your project, and add the package in as a smart.json using the syntax described in the following code sample.  
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
