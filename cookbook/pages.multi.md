## MultiPage Example

So, now that we've seen the pattern for a single-page, lets look at the multi-page example.

##### File structure  
There's a few different approaches to organizes files in a multi-page application.  

````sh

// when we run `meteor create`, three files are made (MVC)
/helloWorld.css
/helloWorld.html
/helloWorld.js


// we usually then put those files into a client directory
/client/helloWorld.css
/client/helloWorld.html
/client/helloWorld.js

// adding a second page is as simple as replicating those files
/client/homePage.less
/client/homePage.html
/client/homePage.js

// and to organize things, people often create a directory
// to keep the MVC of each component together
/client/homePage/homePage.less
/client/homePage/homePage.html
/client/homePage/homePage.js
/client/aboutPage/aboutPage.less
/client/aboutPage/aboutPage.html
/client/aboutPage/aboutPage.js

// sometimes, however, people will organize by file extension
// which naturally leads to stylesheet, template, and library directories

/client/stylesheets/homePage.less
/client/stylesheets/aboutPage.less
/client/templates/homePage.html
/client/templates/aboutPage.html
/client/libraries/homePage.js
/client/libraries/aboutPage.js

// this sturcture is sometimes given a MVC naming convention
// and you'll see naming structures like this
/client/view/homePage.less
/client/view/aboutPage.less
/client/model/homePage.html
/client/model/aboutPage.html
/client/controller/homePage.js
/client/controller/aboutPage.js
````
The important thing to keep in mind when building your application is that there's no one *correct* way to organize your files.  Use whatever organization helps you be productive.  It's very common for an app to go back and forth between these different organization approaches as it grows or shrinks (ie. as packages are extracted from an app).  
 
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
````less
// client/views/app.layout.less
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
// client/views/page.home.less
#homePage{
  h2{
    color: blue;
  }
}

// client/views/page.about.less
#aboutPage{
  h2{
    color: red;
  }
}
````

The less compiler will take the above code, and compile it to ``#homePage h2`` and ``#aboutPage h2`` rules, which is fairly straight forward.  But that object nesting is super useful when creating more complex views; primarily because you can mimic your DOM structure.  




So far, the controllers for a multipage app are fairly straightforward.  But now we're going to start doing something interesting.  

````js
// client/views/page.about.js 
Template.aboutPage.helpers({
  getText: function(){
    return "About This Site";
  },
  pageVisibility: function(){
    if(Session.get('active_page', 'about')){
      return 'visible';
    }else{
      return 'hidden';
    }
  }
});
````

##### Canvas Controller (Suitable for Video Games & Apps)
````js
// client/views/page.home.js 
Template.homePage.helpers({
  getText: function(){
    return "Hello World";
  },
  pageVisibility: function(){
    if(Session.get('active_page', 'home')){
      return 'visible';
    }else{
      return 'hidden';
    }
  }
});
````

So far, the controllers for a multipage app are fairly straightforward.  But now we're going to start doing something interesting.  

````js
// client/views/page.about.js 
Template.aboutPage.helpers({
  getText: function(){
    return "About This Site";
  },
  pageVisibility: function(){
    if(Session.get('active_page', 'about')){
      return 'visible';
    }else{
      return 'hidden';
    }
  }
});
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
````html
<!-- /client/models/app.navbars.html -->
<template name="navbarHeader">
  <nav>
    <ul class="inline-group">
      <li><div id="homePageButton" class="btn btn-info">Home</div></li>
      <li><div id="aboutPageButton" class="btn btn-info">About</div></li>
    </ul>
  </nav>
</template>
````


##### Web App Controller   

Alternatively, we could set the session variable by using a URL route.  
````js
Router.route('/home', function(){
  Session.set('active_page', 'home')
});
Router.route('/about', function(){
  Session.set('active_page', 'home')
});
````

##### Web Page Controller   

Or we could use a template, and let the router manage page state.  
````js
Router.route('/home', function(){
  this.render('homePage');
});
Router.route('/about', function(){
  this.render('aboutPage');
});
````
