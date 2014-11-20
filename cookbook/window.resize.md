## Window Resizing

#### resize a bunch of elements at the same time
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
````


````html
<template name="homePage">
  <div class="panel">
    random content... 
  <div> 
  <div class="hidden">{{ resize }}</div>
</template>
````


#### create a window of a specific size  
Not meteor specific, but useful for opening a window to a specific size.  Particularly if you're trying to simulate a specific hardware device or orientation.  
````js
var w=window.open('','', 'width=1024,height=768');
w.resizeTo(500,500);
````

#### prevent window resize
In case you want to prevent users from resizing your application, you can try this.
````js
var size = [window.width,window.height];  //public variable
$(window).resize(function(){
    window.resizeTo(size[0],size[1]);
});
````

#### define Chrome App window bounds
And you can avoid programmatic hacks by using a Chrome App, and defining the size of your apps explicitly.  
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
