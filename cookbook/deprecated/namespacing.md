## Namespacing

There are a half-dozen approaches to creating namespaces in Meteor apps... the file system, package dependencies, CSS class namespacing, JavaScript objects.   We're going to present a structured methodology that uses all of them together, and walks you through through the design cycle and leads to optimized code.  It's easiest to just show you how it works.


============================================
#### HTML Template Naming Conventions  

The first step involves breaking up wireframes or screenshots into their respective components (or templates), and assigning names.  The simple act of assigning a template or div a name begins the process of defining a namespace.  Make a list of all the names from your wireframes, and then convert them to templates.

````html
<template name="blankPage"></template>
<template name="homePage"></template>
<template name="sidebar"></template>
````

============================================
#### File System  
Feel free to organize files in folders however makes sense for your app, and use multi dotted names, or camelCase names, and go to town in creating ad-hoc namespaces.  Meteor's bundler and minifier will combine all your files, and users and clients will never need to know how your internal files are organized.  Feel free to rename files and directories as often as it makes sense to keep things organized.

````bash
/client/main.html
/client/components/sidebar.html
/client/components/pages/blank.html
/client/components/pages/home.html
/client/components/pages/home.patient.html
/client/components/pages/home.physician.html
````

However, we would like to point out one particularly effective method that can keep members with widely differing levels of experience successfully working together.  It requires a small bit of repetition, in that we make a folder for each component, and we put a single .html, .js, and .css file in the folder with the same name.

````sh
/client/components/homePage/homePage.html
/client/components/homePage/homePage.js
/client/components/homePage/homePage.css
````
At first glance, this may seem redundant and repetitive; but in reality, we will be using the namespace to tie different technologies together and simplify things by not letting them get out of control.  


============================================
#### Using Namespacing to Coordinate HTML, JS, and CSS Files

The pattern continues by  using LESS to layer on CSS class names onto our wireframe namespaces.  Assume you have a homepage that looks like the following:

````html
<template name="homePage">
  <div id="homePage">
    <header></header>
    <div class="panel">
      <div class="panel-heading">Home</div>
      <p>{{getContent}}</p>
    </div>
    <footer></footer>
  </div>
</template>
````

We're going to create a JavaScript object called Template.homePage, with helpers and an event map.

````js
Template.homePage.events({
  'click button': function (){
    console.log(new Date());
  }
});
Template.homePage.helpers({
  getContent: function (){
    return HomePage.content.generateLispum();
  }
});
````

Since HTML is generally synonymous with XHTML, and XHTML validates to XML, most modern web browsers can parse HTML using XPath selectors.  This is particularly true for Meteor, which basically enforces the use of well-formed HTML.  All that is to say that by using well-structured XHTML, we've created a document namespace, and can use jQuery to parse it using XPath selector.  (We'll be using this technique a lot.)

````js
$('#homePage .panel .panel-header').text()
````

We also want to incorporate our styling into our namespacing, and we do so by using a preprocessor that supports nested classes.  The nested classes allow us to write our styles in the same manner as our HTML.  This is especially important because it prevent styles from leaking outside their component.  It also keeps the styling structurally the same as the HTML and in close proximity to our component, and not off in a bootstrap library who-knows-where in the app.

````less
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


===========================================
#### JavaScript Dotted Notation 



````js
HomePage = {
  content: {
    generateLispum: function (){
      return "lorem ipsum dollar set et...";
    }
  }
}
````

============================================
#### NPM Package Namespacing  
However, if you need to expose a namespace, or import a namespace, you'll probably need to use Javascript objects and the Npm namespacing system.  There are two steps in this process. The first is to expose a namespace via a Package. That is done with a ``package.js`` description file, which looks like this:

````js
// package.js  
Package.describe({
  name: "foo:homepage",
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
