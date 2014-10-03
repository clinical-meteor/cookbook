## Mobile Apps

The holy grail of web-apps is a single code base across different platforms.  In theory, this will drastically reduced maintenance costs and consistency of user experience across devices.  In practice, we're not quite there yet, but getting close.  But to create such an application, there are a lot of steps that one has to go through.

#### Design Checklist

- Do you need centralized hotcode pushes to all devices?  
- Do you need to connect to device hardware?  
- Are you targeting a specific platform?  
- Will this app be inhouse or public?  
- Will this app be in an appstore?  
- Do you want to run it on the desktop as an app?  
- Do you need native quality UI widgets and scrolling?
- Which screen sizes do you want this app to run on?  


#### Page Layout on Different Devices - CSS

First of all, if your application is going to run on different devices, it's going to need to render each 'view' differently, based on the device size.  You can deal with this in two ways:  with javascript rules, or CSS media styles.  

````css
//----------------------------------------------------

// landscape orientation
@media only screen and (min-width: 768px) {

}

// portrait orientation
@media only screen and (max-width: 768px) {
  #homePage{
    //...
  }
}
@media only screen and (max-width: 480px) {
}

````

You'll need to figure out if you want to break the styles at 768px (portrait mode) or at 1024 pixels (landscape).  That's assuming your target mobile device is the iPad, which uses a 3:4 ratio.  Otherwise, you'll need to work out the aspect ratios of the devices you do want to target, and figure out the threshold levels from there.  


#### Fixed Sized Windows

If you're going to be designing layouts with fixed size screens for different mobile devices, you may want to mirror that design when running your app on a desktop.  The following method fixes the size of the window OUTSIDE of PhoneGap, giving a fixed-sized window on the desktop.  Sometimes it's easiest to manage user's expectations and UI design by limiting options!  

````js
// create a window of a specific size
var w=window.open('','', 'width=100,height=100');
w.resizeTo(500,500);
 
// prevent window resize
var size = [window.width,window.height];  //public variable
$(window).resize(function(){
    window.resizeTo(size[0],size[1]);
});
````

#### 60fps Native Repsonse Widgets

If you want 60fps native response in your widgets, animations, and page transitions, you're going to need to override the CSS rendering subsystem with a library like Famo.us (or Google Polymer).  

````sh
mrt add famono
mrt add famono-components
````

#### Famo.us Style Page Transitions

You'll then need to use Famo.us to do things like render page transitions, which should look something like this:  

````html
{{#RenderController}}
  {{> yield}}
{{/RenderController}}

<template name="rc_surface1">
  {{#Surface class="red-bg" origin="[0,0]" size="[75,150]"}}
    <div class="full">#1</div>
  {{/Surface}}
</template>
````

````js
Template.views_RenderController.helpers({
  'showTemplate': function() {
    return Template[this.name];
  }
});
Session.setDefault('currentTemplate', 'rc_surface1');
Template.views_RenderController.currentTemplate = function() {
  return Session.get('currentTemplate');
}
Template.rc_buttons.events({
  'click button': function(event, tpl) {
    Session.set('currentTemplate', this.valueOf());
  }
});
````

#### IronRouter + Famo.us - URL Parsing and Triggering Template Rendering

The next big issue in designing mobile apps is figuring out how to support the URL social contract and maintain fluid page-transitions.  Doing one or the other is easy.  Doing both URLs **and** page-transitions is difficult. You'll need to move away from subscribing to collections within the router function, because it will take too long for the data to be fetched.  Instead, do your data subscriptions in the root of your application, and use IronRouter to trigger Session variables that will trigger Famo.us to do page transitions.  

````js
// vanilla IronRouter pattern

Router.map(function() {
  this.route('postRoute', {
    path: '/posts/:id',
    template: 'postPage',
    onBeforeAction: function() {
      Session.set('selected_post', this.params.id);
    },
    waitOn: function() {
      Meteor.subscribe('posts', this.params.id);
    },
    data: function() {
      return Campaigns.findOne({ _id: this.params.id });
    }
  });
});

// IronRouter + Famo.us

Router.map(function(){
  this.route('postRoute', {
    path: '/posts/:id',
    onBeforeAction: function() {
      Session.set('selected_post', this.params.id);
      Session.set(‘currentTemplate’, ‘postPage’);
    }
  });
});
````

#### Offline Caching  
To get all of this to work, you'll probably need offline support, which means caching application data and user data.

````sh
sudo mrt add appcache
sudo mrt add grounddb
````

#### Disable Scroll-Bounce

````js
// prevent scrolling on the whole page
// this is not meteorish; TODO: translate to meteor-centric code
document.ontouchmove = function(e) {e.preventDefault()};

// prevent scrolling on specific elements
// this is not meteorish; TODO: translate to meteor-centric code
scrollableDiv.ontouchmove = function(e) {e.stopPropagation()};
````



#### Multitouch & Gestures

[FastClick](https://github.com/ftlabs/fastclick)  



#### PhoneGap Configuration with X-Code

As you get ready to deploy your PhoneGap application, you'll probably want to tweak the X-Code configuration settings a bit.  Usually this involves tweaking the architecture, and disabling UIWebViewBounce.

````sh
# terminal commands in osx to build a phonegap app
cd phonegap-master/
cd lib/ios/bin/
./create ~/Documents/Cordova/TodosApp com.pentasyllabic.TodosAdd TodosApp
````

Once set up, configure your X-Code project.  
````sh
architecture ``armv7 armv7s``  
````

And edit the project Cordova/TodosApp/config.xm file.  
````html
<preference name="UIWebViewBounce" value="false" />
````


#### Stand-Alone Blaze  

Once you have your application all built, you'll need to bundle it into a PhoneGap wrapper.  We used to have to use iFrames to do this, but now that Stand-Alone Blaze has been released, we have a new option for creating Mobile Apps.  
http://meteor.github.io/blaze/

If you only want to bundle front-end client files, use the Meteor Export Packages script.  
https://github.com/alexhancock/meteor-export-packages

Early examples of pipelines for extracting front end files and including them in PhoneGap.  We'll be updating this more. 
https://github.com/meteor/standalone-blaze-generator  
https://github.com/merunga/cordova-meteor-mashup  




#### Meteor Cordova Architecture Pipeline  

Okay, now it's time to finally bust out the [Meteor Cordova Phonegap Integration](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration) documentation.  

````sh
meteor list-platforms
meteor add-platform ios
meteor list-platforms
meteor run ios
````



#### Project Configuration for iFrame Method
Alternatively, if you're willing to manage cross-site security and want hot-code updates for your mobile apps, you'll want to use the iFrames approach.  This requires editing the CDVViewController.m file, and tell PhoneGap to access an external website to get it's www directory.  

````Obj-C
    // CordovaLib.xcodeproj > Classes > Cleaver > CDVViewController.m  
    //self.wwwFolderName = @"www";
    self.wwwFolderName = @"http://todos.meteor.com";
    self.startPage = delegate.startPage;
    if (self.startPage == nil) {
        self.startPage = @"index.html";
    }
````
