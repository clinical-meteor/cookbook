Refactoring MVC to Components  
=================================================

As mentioned elsewhere, for performance reasons, there's a general trend when building webapps to start with markup languages and to move towards pure javascript as the app becomes more mature.  If you find yourself struggling with styling and animations, and find yourself researching components/microservice based architectures (such as React, Famo.us, and the like), you may be ready to begin refactoring your MVC based app towards a component based app.

Below is a pattern that I use to prep apps to be rewritten using components.  In essence, what's described below is a stepping stone towards componentization, which continues to use the existing HTML and CSS subsystems.  The first step is to identify each component, and move it into it's own directory, and make sure the HTML/CSS/JS pattern is completed.

````sh
fooComponent/fooComponent.html
fooComponent/fooComponent.js
fooComponent/fooComponent.less
````

Once we've moved relevant files into a directory, start by identifying the boundary of each template/component.  We do that by creating a div inside the template with an id that is the same as the name of the component.  When compiled to DOM, this inner div will become ``firstNode`` or ``childNode[0]``.

````html
<template name="fooComponent">
  <div id="fooComponent">
      <!-- stuff -->
  </div>
</template>
````

Our template JS object now has the same name as a DOM element in our HTML, as well as a directory and three files in our filesystem.

````js
Router.route('/foo', {
  template: 'fooComponent'
});

Template.fooComponent.helpers({ ... });
Template.fooComponent.events({ ... });

Template.fooComponent.onRendered(function(){ ... });
Template.fooComponent.onCreated(function(){ ... });
Template.fooComponent.onDestroyed(function(){ ... });
````

And we scope our styling to just the component in question, avoiding global namespace collisions, and making our styling consistent and reliable (and ready for mobile layouts, if necessary).  
````less
#fooComponent{
  // add custom component classes here

  // desktop specific layout for this component
  @media only screen and (min-width: 960px) { }

  // landscape orientation for this component
  @media only screen and (min-width: 768px) { }

  // portrait orientation for this component
  @media only screen and (min-width: 480px) { }
}
````

With this pattern in place, ``fooComponent`` is ready to be converted into a Blaze Component, Web Component, React View, or Famo.us View.  Typically, next steps will involve converting CSS into JSS; HTML into JSX, or otherwise translating HTML and CSS into pure javascript.  


