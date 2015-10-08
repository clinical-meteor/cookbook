##Packages


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

For a long time, the package.js API was undocumented, and the following was an attempt to fill in the missing pieces of the documentation.  MDG has recently published an [official API for the package.js file](http://docs.meteor.com/#/full/packagejs), however, making the following documentation unnecessary.  It's being left in the cookbook for the time being, because it's been in here for ages.  But this section is liable to be removed at some point in the future.

````js
// package.js  
// should go into the /meteor-project/packages/sample_package directory  

Package.describe({
  // if this value isn't set, meteor will default to the directory name
  name: "sillySample:exampleFoo",
  
  // define a message to describe the package
  summary: "This is a sample package that doesn't actually do anything.",

  // update this value before you run 'meteor publish'
  version: "1.2.1",

  // and add this value if you want people to access your code from Atmosphere
  git: "http://github.com/myaccount/nifty-widget.git"
  
  // what to display in atmosphere
  documentation: 'README.md'
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
Npm.depends({
  sample_package: "0.2.6", 
  bar: '1.2.3'
});

Package.onUse(function (api) {

  api.versionsFrom('1.2.2');
  api.use('meteor-platform@1.2.2');
  api.use('less');
  
  // expose an object from an Npm package by first referencing it
  Foo = Npm.require('fooLibrary');  
  
  // add files to specific locations using api.addFiles
  api.addFiles('lib/myComponent.js', ['client', 'server']);
  api.addFiles('client/subscription.js', 'client');
  api.addFiles('server/publication.js', 'server');

  // example: add multiple files to a location using an array
  api.addFiles([
    'widget/myComponent.js', 
    'widget/myComponent.html', 
    'widget/myComponent.less'
  ], 'client');
 
  // and then exporting it
  api.export('Foo');
});
 
Package.onTest(function (api) {
  // define dependencies using api.use
  api.use('meteor-platform@1.2.2');
  api.use('sillySample:exampleFoo');

  // define testing framework packages
  api.use('clinical:verification');
 
  // add files to specific locations using api.add_files
  api.addFiles('tests/other_library_name.js');
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

================================================
#### Bulk Package Deployments

When you break your entire app apart into packages; it's necessary to start considering tools such as ``mrtbulkrelease``.  

https://www.npmjs.com/package/mrtbulkrelease


================================================
#### Private Packages

If you have packages you want to keep private from Atmosphere, you may want to use ``mgp``.
https://github.com/DispatchMe/mgp


================================================
#### Creating Configurable Packages  

Nemo64 gets a gold-star for figuring out a really fantastic pattern for letting you configure which parts of a package you want installed via a .json configuration file.  Disect the meteor-bootstrap package for the pattern. 

https://github.com/Nemo64/meteor-bootstrap/
