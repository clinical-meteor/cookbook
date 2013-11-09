## Mobile


#### Page Layout on Different Devices

The holy grail of web-apps is a single code base across different platforms.  So, part of that goal is to create a single page that can be displayed differently on different screen sizes.  That's where CSS media styles come into play.  The biggest issue you'll need to deal with is figuring out if you want to break the styles at 768px (portrait mode) or at 1024 pixels (landscape).  That's assuming your target mobile device is the iPad, which uses a 3:4 ratio.  Otherwise, you'll need to work out the aspect ratios of the devices you do want to target, and figure out the threshold levels from there.  

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

#### X-Code Configuration

The latest X-Code configuration settings for a PhoneGap application

````sh
# terminal commands in osx
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

#### Project Configuration for iFrame Method

You'll need to the edit the CDVViewController.m file, and tell PhoneGap to access an external website to get it's www directory.  CordovaLib.xcodeproj > Classes > Cleaver > CDVViewController.m  
````Obj-C
    //self.wwwFolderName = @"www";
    self.wwwFolderName = @"http://todos.meteor.com";
    self.startPage = delegate.startPage;
    if (self.startPage == nil) {
        self.startPage = @"index.html";
    }
````
#### Fixed Sized Windows

There are a couple ways to handle fixed-sized windows.  The following method fixes the size of the window OUTSIDE of PhoneGap, giving a fixed-sized window on the desktop.  Sometimes it's easiest to manage user's expectations and UI design by limiting options!  
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

#### Offline 


#### Local Storage


#### Scrolling


#### Multitouch & Gestures


#### Scroll Bouncing
