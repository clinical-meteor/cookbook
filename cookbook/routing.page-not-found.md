## Page Not Found  
Super simple.  This example assumes ``bootstrap-3`` and ``less``, and the most complex thing about it is the styling.

````html
<template name="notFoundPage">
  <div id="notFoundPage" class="page">
    <div class="container">
      <div class="row">
        <div class="centered col col-md-3"></div>
        <div class="centered col col-md-6">
          <div id="notFoundErrorMessage">
            <img id="notFoundImage" class="fullwidth" src="/img/notFoundError.png">
            <h2 class="notFoundError">404 Page Not Found</h2><br/>
            <h5 class="notFoundErrorInstructions">check you spelled the URL correctly, <br>or click to go back to the homepage</h5>
          </div>
        </div>
        <div class="centered col col-md-3"></div>
      </div>
    </div>
  </div>
</template>
````

Just be sure to add your template to the 'notFoundTemplate' in your global layout.  
````js
// app.router.js
Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFoundPage'
});

// client/static/notFoundPage.js
Template.notFoundPage.events({
  'click #notFoundErrorMessage':function(){
    Router.go('/');
  }
})
````
