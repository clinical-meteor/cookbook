## Namespacing
**Q:  How do I do namespacing in Meteor?**  

There are four general approaches to creating namespaces in Meteor apps... the file system, package dependencies, CSS class namespacing, and naming conventions.  


**File System**  
The most important  is to simply use the filesystem as a namespace.  Feel free to use multi dotted names, or camelCase names, and go to town in creating ad-hoc namespaces.
````sh
/client/templates/page.home.html
/client/templates/page.profile.html
/client/templates/page.graph.html
/client/templates/page.error.pagenotfound.html
/client/templates/page.error.unknownbrowser.html
/client/templates/sidebar.inspection.html
/client/templates/sidebar.navigation.html
````


**NPM Package Namespacing (Controller)**  
And the most recent option for namespacing is with Npm packages:
````js
// package.js  
Package.describe({
  summary: "This is a sample package that doesn't actually do anything."
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
Npm.depends({sample_package: "0.2.6", bar: '1.2.3'});

Package.on_use(function (api) {
  var path = Npm.require('path');

  // sample_package.js  
  Foo = Npm.require('sample_package');  

  // export the object
  api.export('Foo');
});
````
Specifically, the ``Npm.depends()``, ``Npm.require()``, and ``Npm.export()`` commands define all the syntax you need to create a Javascript namespace.




**LESS Class Namespacing (View)**  
The second approach to namespacing is to use LESS to create class structures like so:  
````less
@import "../mixins.less";

#homePage{
  background-color: white;
  header{
    background-color: gray;
  }
  .panel{
    .panel-heading{
      background-color: lightblue;
    }
  }
  footer{
    background-color: gray;
  }
}
````
Specifically, the ``@import 'filename.less'`` gives you the necessary syntax to create CSS/LESS based namespaces. 

**HTML Template Naming Conventions**  

````html
<template name="pageGraph">
<template name="pageProfile">
<template name="pageHome">
<template name="pageErrorNotFound">
<template name="pageErrorUnknownBrowser">
<template name="sidebarInspection">
<template name="sidebarNavigation">
````
