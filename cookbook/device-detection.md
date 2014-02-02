##Device Detection  
**Q:  How do I detect the mobile device?**  

AgentString detection is a fairly standard approach, but has the problems of browser spoofing.  I've had fairly good success with mystor's device-detection package from Atmosphere.  

Detecting touch-event support seems like it's a better approach, but remember that there are touch-screen desktop and wall monitors, ala Perceptive Pixel and the first generation versions of Microsoft Surface.  (We've all seen those huge multitouch monitors on news channels.)  So, that's where touch support falls apart. You can't assume that supporting multitouch means they're using a tablet or phone.  They could be sitting at a multitouch wall. And, increasingly, we'll be seeing multitouch interfaces making their way into kitchens, homes, bus-stops, cars, etc..  So the only thing that touch support tells you is that you need to render with UI designed for touch interfaces... meaning big buttons UI elements.  That, in turn, means assigning CSS classes. 

Responsive design and properly structured @media queries are generally the best way for detecting screen size and resolution, in my experience. That's where Bootstrap comes in.  But it should be remembered that there ways of spoofing/changing screensizes as well. 

That being said, I'm a really big fan of @media queries, and find that they absolutely *don't* break down for richer app. They hold up very well, especially if you're using LESS or SCSS.  Some people have heard me going on about HTML/CSS/JS as an MVC paradigm interpretation (or maybe an MPC paradigm?  ie. Model, Presentation, Controller).  And @media queries are a big part of that. The following works quite well for displaying mobile versions of a Meteor apps on mobile devices.  

````css
// default desktop view
#signInPage{
     border: 1px solid gray;
}
// landscape orientation view for tablets
@media only screen and (min-width: 768px) {
  #signInPage{
     padding: 20px;
  }
}
// portrait orientation view for tablets
@media only screen and (max-width: 768px) {
  #signInPage{
     padding: 0px;
       border: 0px;
  }
}
// phone view
@media only screen and (max-width: 480px) {
  #signInPage{
                   .footer{
                       display: none;
    }
  }
}
````

All of my apps running on mobile devices have used a version of the above, and it works quite well.  And it's a very clean interface for adding printable versions of the website, audio versions, ultra-high resolution versions,  etc. Any time you want to take your site and present it on a different media interface (i.e. a different Presentation/View), the @media statements are your go-to code format.  All sorts of magic can be done with @media statements and LESS.

Also, just as an FYI, CSS3 currently supports the following media_types:

````
media_type: all | aural | braille | handheld | print |
  projection | screen | tty | tv | embossed
media_feature: width | min-width | max-width
  | height | min-height | max-height
  | device-width | min-device-width | max-device-width
  | device-height | min-device-height | max-device-height
  | aspect-ratio | min-aspect-ratio | max-aspect-ratio
  | device-aspect-ratio | min-device-aspect-ratio | max-device-aspect-ratio
  | color | min-color | max-color
  | color-index | min-color-index | max-color-index
  | monochrome | min-monochrome | max-monochrome
  | resolution | min-resolution | max-resolution
  | scan | grid
````

And the CSS4 specs include a 'pointer' type, for touchscreens, kinects, wii, styluses, touchpads, mice, etc.  So, for future browsers to be CSS4 compliant, they'll need to expose hardware input information via CSS (which is in keeping with traditional ideas about what MVC is, ala Xerox Parc, etc).  

The other approach to detecting screen size is to do it in Javascript with a $(window).width() and $(window).height() detection.  (Basically doing it in the Controller, rather than the View). That's much more liable to introduce performance issues if done incorrectly.  I've found that the following pattern is the best way to handle orientationchange events, resize events, and so forth, and can be a great way to kick off screen-size specific controls.  And I wind up adding it to nearly every project.  So, if you're looking for some mobile functionality to bake into Meteor, detecting resize events would be a great start for a Mobile API.   
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

Of course, the best way to detect mobile is for the hardware to notify you directly.  Cordova PhoneGap exposes a 'deviceready' event, that you can add an event listener to.  So, the cordova-phonegap package does the following:

````js
     document.addEventListener('deviceready', function(){
          Session.set('deviceready', true);
     }, false);
````

That's the sure-fire, bullet-proof method of knowing that you're on a mobile device.  So, exposing a deviceready event might be something else to look at if you all are considering a Mobile API or Device API of some sort.

Now then, Morten, Alan, and I have been discussing Chrome Apps as a target compilation point for mobile apps.  And Google recently announced that they're bringing Chrome Apps to Cordova (thanks Alan, for that heads up!).  So, if you're looking for some really interesting possibilities, check out these links:
 
[Run Chrome Apps on Mobile Using Apache Cordova/Phonegap](http://blog.chromium.org/2014/01/run-chrome-apps-on-mobile-using-apache.html)  
[Google Brings Chrome Apps to Google Play and Apple App Stores](http://thenextweb.com/google/2014/01/28/google-brings-chrome-apps-android-ios-lets-developers-submit-google-play-apples-app-store/#!uauSm)  
[Chrome Apps on Mobile Toolchain](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/README.md)  
[What Are Chrome Apps?](http://developer.chrome.com/apps/about_apps.html)   
[Create Your First Chrome App](http://developer.chrome.com/apps/first_app.html)  


The next thing I've been planning to experiment with, by way of Meteor and mobile, is taking the /bundle/programs/client directory, after running the bundler, and adding a manifest.json, background.js, and window.html file.  In theory, that directory is an ideal compilation point for hooking the Meteor toolchain to the Chrome App/Cordova toolchain.  If that works, it might be worth modifying the Meteor bundler, and adding options for compiling mobile specific versions of Meteor apps.  I dare say that there are lots of folks who would love the following options:

````sh
mrt bundle -mobile output.tar.gz
mrt bundle -ios output.tar.gz
mrt bundle -android output.tar.gz
mrt bundle -all output.tar.gz
````

Or something like that.  Anyhow.  $0.02 of thoughts.  
Abigail
