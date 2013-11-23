## Single Page Example

##### File structure 
````sh
/client
/client/views/page.home.css
/client/models/page.home.html
/client/controllers/page.home.js
/packages
/public/images
/server
````
 
##### The Document Object Model    
````html
<!-- /client/models/page.home.html -->
<template name="homePage">
  <div id="homePage" class="page">
    <h2>{{ getTitle }}<h2>
    <p class="tagline">{{ getText }}<p>
    <!-- insert code here-->
  </div>
</template>
````
But wait! you might be saying.  There's so much redundancy!  We've repeated the term 'page' in both template names, div containers, and filenames!  That sort of duplication confuses things.  Well, maybe it does, and maybe it doesn't.  There is, indeed a bit of redundancy going on.  However, I suggest this approach because it will eventually lead to code-completion functionality in IDEs and refactoring tools.  


##### The View    
````scss
// client/views/page.home.css
// the page class allows us to modify all the pages at the same time
.page{
  margin-top: 50px;
  margin-bottom: 50px;
}
// while the page id allows us to scope CSS styles to specific pages using namespacing
// note: the following example uses the LESS package and precompiler  
#homePage{
  h2{
    color: blue;
  }
  .tagline{
   color: gray;
  }
}
````

The controller is fairly straight forward.  
##### The Controller   
````js
// client/views/page.home.js 
Template.homePage.getText = function(){
 return "Hello World";
}
Template.homePage.getText = function(){
 return "lorem ipsum, dolar sit amet...";
}
````

## Multi Page Example

So, now that we've seen the pattern for a single-page, lets look at the multi-page example.
##### File structure 
````sh
/client
/client/views/app.layout.css
/client/views/page.home.css
/client/views/page.about.css
/client/models/page.home.html
/client/models/page.about.html
/client/controllers/page.home.js
/client/controllers/page.about.js
/packages
/public/images
/server
````

See how the binomial nomenclature helps us organize our stylesheets in the views folder?  How it organizes DOM templates in the models folder?  And our libraries in our Controllers folder?  When we start adding headers, footers, blocks, sidebars, dialogs, and other UI components, this binomial nomenclature will keep everything nice and tidy.  

 
##### The Document Object Model   
````html
<!-- /client/models/page.home.html -->
<template name="homePage">
  <div id="homePage" class="{{pageVisibility}} page">
    <h2>{{ getTitle }}<h2>
    <p class="tagline">{{ getText }}<p>
    <!-- insert home page content here-->
  </div>
</template>

<!-- /client/models/page.about.html -->
<template name="aboutPage">
  <div id="aboutPage" class="{{pageVisibility}} page">
    <h2>{{ getTitle }}<h2>
    <p class="tagline">{{ getText }}<p>
    <!-- insert about page content here-->
  </div>
</template>
````

Now, we have nicely defined IDs for each page objects in our application.  This is going to be useful on a bunch of levels when we get to the views and page transitions, because we can now attach styling and animation rules directly to our page object.    

As for the ``{{pageVisibiilty}}`` handlebars, we're going to do some cleverness in a bit that allows us to navigate pages, enable page transitions, and the like by adding ``.visible`` and ``.hidden`` classes.  

##### The View  
````scss
// client/views/app.layout.css
// here, we've moved the .tagline to the global scope
.page{
  margin-top: 50px;
  margin-bottom: 50px;
}
.tagline{
  color: gray;
}
.visible{
  visibiilty: visible;
}
.hidden{
  visibility: hidden;
}

// and we finally get to use LESS nested objects to create namespacing hierarchy
// client/views/page.home.css
#homePage{
  h2{
    color: blue;
  }
}

// client/views/page.about.css
#aboutPage{
  h2{
    color: red;
  }
}
````

The less compiler will take the above code, and compile it to ``#homePage h2`` and ``#aboutPage h2`` rules, which is fairly straight forward.  But that object nesting is super useful when creating more complex views; primarily because you can mimic your DOM structure.  


##### The Controller   
````js
// client/views/page.home.js 
Template.homePage.getText = function(){
 return "Hello World";
}
Template.homePage.pageVisibility = function(){
  if(Session.get('active_page', 'home')){
    return 'visible';
  }else{
    return 'hidden';
  }
}
````

So far, the controllers for a multipage app are fairly straightforward.  But now we're going to start doing something interesting.  

````js
// client/views/page.about.js 
Template.aboutPage.getText = function(){
 return "About This Site";
}
Template.aboutPage.pageVisibility = function(){
  if(Session.get('active_page', 'about')){
    return 'visible';
  }else{
    return 'hidden';
  }
}
````

See how we're adding classes to the pages based on Session state?  This is going to give very nice functionality down the line, as we toggled UI elements on and off in the page.  Specifically, we have a Controller that's adding different View classes to our Object Model, based on a Session state.

But how do we change the session state?
````js
// first, we define a default state
// client/views/app.navbars.js 
Session.setDefault('active_page', 'home');

// then we need to add some event triggers
// client/views/app.navbars.js 
Template.navbarHeader.events({
  'click #homePageButton': function(){
    Session.set('active_page', 'home');
  },
  'click #aboutPageButton': function(){
    Session.set('active_page', 'about');
  }
});
````

Nifty!  Now, all we need to do is go back to our template, and add some buttons.

##### Back to the DOM   
````html
<!-- /client/models/page.home.html -->
<template name="navbarHeader">
  <nav>
    <ul class="inline-group">
      <li><div id="homePageButton" class="btn btn-info">Home</div></li>
      <li><div id="aboutPageButton" class="btn btn-info">About</div></li>
    </ul>
  </nav>
</template>
````


