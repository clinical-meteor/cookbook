## Namespacing

There are four general approaches to creating namespaces in Meteor apps... the file system, package dependencies, CSS class namespacing, and naming conventions.  

============================================
#### File System  
The most important is to simply use the filesystem as a namespace.  Feel free to organize files in folders however makes sense for your app, and use multi dotted names, or camelCase names, and go to town in creating ad-hoc namespaces.  Meteor's bundler and minifier will combine all your files, and users and clients will never need to know how your internal files are organized.  Feel free to rename files and directories as often as it makes sense to keep things organized.
````sh
/client/templates/page.home.html
/client/templates/page.profile.html
/client/templates/page.graph.html
/client/templates/page.error.pagenotfound.html
/client/templates/page.error.unknownbrowser.html
/client/templates/sidebar.inspection.html
/client/templates/sidebar.navigation.html
````

============================================
#### NPM Package Namespacing  
However, if you need to expose a namespace, or import a namespace, you'll probably need to use Javascript objects and the Npm namespacing system.  There are two steps in this process. The first is to expose a namespace via a Package. That is done with a ``package.js`` description file, which looks like this:

````js
// package.js  
Package.describe({
  summary: "This is a sample package that exposes the Foo namespace."
});

// If you're bundling an NPM package, be sure to reference the package as a dependency
Npm.depends({sample_package: "0.2.6", bar: '1.2.3'});

Package.on_use(function (api) {
  // we set a package global variable with some value
  // in this case a JSON object
  Foo = {label: "foo object", value: "foo"};

  // alternatively, we can reference an Npm package  
  Foo = Npm.require('sample_package');  

  // and we then export the Foo variable
  api.export('Foo');
});
````
In particular, if you're trying to access Npm namespaces, the ``Npm.depends()``, ``Npm.require()``, and ``Npm.export()`` commands define all the syntax you need.


============================================
#### LESS Class Namespacing  
The third most common approach to namespacing is to use LESS to create CSS class hierarchies and namespaces.  In the following example, the ``@import`` syntax defines a namespace hierarchy between LESS files; and the nested CSS classes define a hierarchical namespace in a tree format.  
````css
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


============================================
#### HTML Template Naming Conventions  
Lastly, you can create namespaces by simply creating and using naming convetions throughout your application. For instance, you might create a template naming convetion, using camelCase, which matches with the id of the first <div> in each template.
````html
<template name="pageGraph">
<template name="pageProfile">
<template name="pageHome">
<template name="pageErrorNotFound">
<template name="pageErrorUnknownBrowser">
<template name="sidebarInspection">
<template name="sidebarNavigation">
````
