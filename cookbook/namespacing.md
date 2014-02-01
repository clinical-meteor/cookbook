## Namespacing
**Q:  How do I do namespacing in Meteor?**  

As for namespacing, there are three approaches to namespacing that I've seen in use.  

**File System**  
The first is to simply use the filesystem as a namespace.  Feel free to use multi dotted names, and go to town.
````sh
/client/templates/page.home.html
/client/templates/page.profile.html
/client/templates/page.graph.html
/client/templates/page.error.pagenotfound.html
/client/templates/page.error.unknownbrowser.html
/client/templates/sidebar.inspection.html
/client/templates/sidebar.navigation.html
````

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
