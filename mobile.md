## Mobile

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
