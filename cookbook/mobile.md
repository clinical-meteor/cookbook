## Mobile Apps

The holy grail of web-apps is a single code base across different platforms.  In theory, this will drastically reduced maintenance costs and consistency of user experience across devices.  In practice, we're not quite there yet, but getting close.  But to create such an application, there are a lot of steps that one has to go through.

=============================================
#### Design Checklist

- Are you targeting a specific platform?  
- Do you need to connect to device hardware?  
- Do you want to run it on the desktop as an app?  
- Will this app be in an appstore?  
- Will this app be inhouse or public?  
- Which screen sizes do you want this app to run on?  
- Do you need native quality UI widgets and scrolling?
- Do you need centralized hotcode pushes to all devices?  


=============================================
#### Page Layout on Different Devices - CSS

First of all, if your application is going to run on different devices, it's going to need to render to different ViewPorts, based on the device size.  You can deal with this in two ways:  with javascript rules, or CSS media styles.  If you've been using a MVC or MVVM library, such as Angular or Ember (or Blaze, for that matter) and have only been targeting a single device or hardware platform, you may need to rethink your MVC model as different hardware ViewPorts are introduced to your application.

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


=============================================
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


#### Offline Caching  
To get all of this to work, you'll probably need offline support, which means caching application data and user data.

````sh
meteor add appcache
meteor add grounddb
````

For more information, see the [Offline Apps](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/offline.md) section of the Cookbook.

#### Disable Scroll-Bounce

On desktop apps, you may want to disable scroll-bounce, to give your app a more native feel.  You can do this with javascript, by disabling how the browser controls the DOM:   

````js
// prevent scrolling on the whole page
// this is not meteorish; TODO: translate to meteor-centric code
document.ontouchmove = function(e) {e.preventDefault()};

// prevent scrolling on specific elements
// this is not meteorish; TODO: translate to meteor-centric code
scrollableDiv.ontouchmove = function(e) {e.stopPropagation()};
````

Alternatively, you can use css, and the ``overflow`` and ``scrolling`` styles.  

````less
#appBody {
  overflow: hidden;
}

#contentContainer {
  .content-scrollable {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
````

The object model needed for the above to work looks something like this:  
````html
<div id="appBody">
  <div id="contentContainer">
    <div class="content-scrollable">
      <!-- content -->
    </div>
  </div>
</div>
````

=============================================
#### Multitouch & Gestures

Mobile devices generally don't have keyboards, so you'll need to add some haptic controllers to your application.  The two popular packages that people seem to be using is [FastClick](https://github.com/ftlabs/fastclick) and [Hammer](https://atmospherejs.com/hammer/hammer).  Installation is easy.

````sh
meteor add fastclick
meteor add hammer:hammer
````

FastClick requires nearly no configuration, while Hammer requires a bit of work to wire up.  The cononical example from the Todos app looks like this:

````js
Template.appBody.rendered = function() {
  if (Meteor.isCordova) {
    // set up a swipe left / right handler
    this.hammer = new Hammer(this.find('#appBody'));
    this.hammer.on('swipeleft swiperight', function(event) {
      if (event.gesture.direction === 'right') {
        Session.set(MENU_KEY, true);
      } else if (event.gesture.direction === 'left') {
        Session.set(MENU_KEY, false);
      }
    });
  }
};
````

=============================================
#### Create your Icons and Splash Screen Assets  

Before you compile your app and run it on your device, you'll need create some icons and splash screens, and add a ``mobile-config.js`` file to your app.

````js
App.icons({
  // iOS
  'iphone': 'resources/icons/icon-60x60.png',
  'iphone_2x': 'resources/icons/icon-60x60@2x.png',
  'ipad': 'resources/icons/icon-72x72.png',
  'ipad_2x': 'resources/icons/icon-72x72@2x.png',

  // Android
  'android_ldpi': 'resources/icons/icon-36x36.png',
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.launchScreens({
  // iOS
  'iphone': 'resources/splash/splash-320x480.png',
  'iphone_2x': 'resources/splash/splash-320x480@2x.png',
  'iphone5': 'resources/splash/splash-320x568@2x.png',
  'ipad_portrait': 'resources/splash/splash-768x1024.png',
  'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.png',
  'ipad_landscape': 'resources/splash/splash-1024x768.png',
  'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.png',

  // Android
  'android_ldpi_portrait': 'resources/splash/splash-200x320.png',
  'android_ldpi_landscape': 'resources/splash/splash-320x200.png',
  'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
  'android_mdpi_landscape': 'resources/splash/splash-480x320.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/splash-1280x720.png'
});
````




=============================================
#### Meteor Cordova Architecture Pipeline  

Okay, now it's time to finally bust out the [Meteor Cordova Phonegap Integration](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration) documentation.  

Since that documentation was written, XCode and Yosemite have been released, which has caused some hiccups in installation.  Here are the steps we had to go through to get Meteor compiled to an iOS device.

1.  Upgrade to Yosemite.
2.  Delete XCode (drag from Applications folder to Trashcan)
3.  Install XCode 6.1 from app store.  
4.  Agree to various terms and conditions.

````sh
# 5.  clone and rebuild the ios-sim locally
#     (this step will not be needed in future releases)
git clone https://github.com/phonegap/ios-sim.git
cd ios-sim
rake build

# 6.  make sure we can update the .meteor/packages locations
#     (this step will not be needed in future releases)
sudo chmod -R 777 ~/.meteor/packages

# 7.  copy the new build into Meteor locations
#     (this step will not be needed in future releases)
for i in `find ~/.meteor/packages/meteor-tool/ -name ios-sim -type f`; do
  cp -R ./build/Release/ios-sim "$i"
done

# 8.  install the ios platform to your app
cd myapp
meteor list-platforms
meteor add-platform ios
meteor list-platforms

# 9.  make sure there are correct permissions on the application (important!)
sudo chmod -R 777 .meteor/local/

# 10.  run app
meteor run ios
````

XCode should launch during the process.  Select your simulator and press the 'Play' button.  


