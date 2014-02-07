## Window Resizing

I've found that the following pattern is the best way to handle orientationchange events, resize events, and so forth, and can be a great way to kick off screen-size specific controls.  And I wind up adding it to nearly every project.  So, if you're looking for some mobile functionality to bake into Meteor, detecting resize events would be a great start for a Mobile API.   
````js
Session.set("resize", null); 
Meteor.startup(function () {
    $(window).resize(function(evt) {
                  Session.set("resize", new Date());
    });
});
Template.homePage.resized = function(){
  var width = $(window).width();
  var height = $(window).height();
  
            doSomethingCool(width, height);
 
  return Session.get('resize');
}; 
````js

````html
<template name="homePage">
  <div class="panel">
    random content... 
  <div> 
  <div class="hidden">{{ resize }}</div>
</template>
````


#### create a window of a specific size  
````js
var w=window.open('','', 'width=100,height=100');
w.resizeTo(500,500);
````

#### prevent window resize
````js
var size = [window.width,window.height];  //public variable
$(window).resize(function(){
    window.resizeTo(size[0],size[1]);
});
````

#### define Chrome App window bounds
http://developer.chrome.com/apps/first_app.html

````js
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});
````
