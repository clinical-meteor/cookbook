# Opinionated Musings About Meteor  


### Inline Javascript in Spacebars...  
Is a bad move in the long run.  It sacrifices long-term code organization and clarity of MVC responsibilities for short-term convenience of getting functionality to work within a file.  It basically recreates the bad parts of PHP.  And it promotes the building of the display (ie. the View) through the modificatoin of HTML, rather than treating HTML as a set-theory description of the document object model DOM (ie. the Model).  

Building out the display (i.e. the View) should be done by toggling the diplay or visibility of objects in the DOM with CSS, rather than adding/removing DOM elements with Javascript.  There's much less flicker and redraw with that method, and less DOM parsing, because the DOM isn't being modified.  Furthermore, it leverages the GPU, because CSS is optimized to use the GPU for many functions.  



#### Example 1 - Inline Javascript in Spacebars
The following example mixes HTML and Javascript.  It's convenient when trying to think through what's going to get displayed.  But most IDEs don't support color coding in this way, it mixes domain specific languages, a .html file is no longer just HTML (it's no also partially javascript), and it confuses the responsibility of the template that generates the document object model (DOM), with the controller logic.  Furthermore, it adds and removes the ``errorMessageText`` element to the DOM, which can cause flicker and other side affects in the GPU pipeline.

````html
<template name="fooPage">
  <div id="fooPage" class="page">
    <div id="helloWorldText">Hello World</div>
    {{#if Meteor.user().profile.role == "Admin" ? true : Meteor.user().profile.errorPreference }}
      <div id="errorMessageText" class="alert alert-danger">Error!</div>
    {{/if}}
  <div>
</template>
````

#### Example 2 - Spacebars Helpers
The following is much better syntax in the long run, with regards to managing MVC responsibilities.  It still adds/removes elements to the DOM, however.  
````html
<template name="fooPage">
  <div id="fooPage" class="page">
    <div id="helloWorldText">Hello World</div>
    {{#if showError}}
      <div id="errorMessageText" class="alert alert-danger">Error!</div>
    {{/if}}
  <div>
</template>
````

````js
Template.fooPage.showError = function(){
  return Meteor.user().profile.role == "Admin" ? true : Meteor.user().profile.errorPreference;
}
````
#### Example 3 - Performant Spacebars Helper  
We can improve the helper above, by not adding and removing elements to the DOM.  Rather, we add a class to an element to the DOM.  The following example doesn't try to adjust the display of the page by adjusting the HTML.  Rather, it uses the HTML as an object model.  It defines the hierarchical objects that are involved in the page, regardless of how they're displayed.  
````html
<template name="fooPage">
  <div id="fooPage" class="page">
    <div id="helloWorldText">Hello World</div>
    <div id="errorMessageText" class="alert alert-danger {{showError}}">Error!</div>
  <div>
</template>
````

In this pattern, we use our spacebars helper (i.e. Controller) to parse some business logic, and return how the objects on the DOM should be rendered.    
````js
Template.fooPage.showError = function(){
  if(Meteor.user().profile.role == "Admin" ? true : Meteor.user().profile.errorPreference)){
    return 'visible';
  }else{
    return 'hidden';
  }
}
````

And we define how our objects are going to be displayed (i.e. the View) in the CSS, where it can later be optimized by the GPU.   
````css
#fooPage{
  .hidden{
    visibility: hidden;
  }
  .visible{
    visibility: visible;
  }
}
````
This becomes even more important as we adjust our Views based on mobile device or browser, and start incorporating media queries, screen orientation, and other features.  With the following CSS, we can specify any number of ways that the error message might be displayed (based on screen size, device, etc), and we simply use the javascript controller to toggle which view we want.  

````css

// landscape orientation
@media only screen and (min-width: 768px) {
  #errorMessageText{
    .hidden{
      visibility: hidden;
    }
    .visible{
      visibility: visible;
    }
  }
}

// portrait orientation & mobile phones
@media only screen and (max-width: 768px) {
  #errorMessageText{
    .hidden{
      visibility: hidden;
    }
    .visible{
      visibility: hidden;
    }
  }
}
````



