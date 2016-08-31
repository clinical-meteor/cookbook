Upgrading Apps and 0.9.x
======================================

I've found the easiest way to upgrade apps is to create a new project from scratch, and copy all the files from the old directory to the new one, and then readd the necessary packages.

````sh
mv myapp myapp-0.8.3
cd ..
meteor update
meteor create myapp
meteor update
cd ..
cp -R myapp-0.8.3/* myapp
meteor add iron:router
meteor add mrt:bootstrap-3
meteor add etc:etc
````

Alternatively, you can try removing your existing packages, upgrading, and then adding the new ones.  With this method, there can be smart.json, smart.lock, .meteor/release, and other files that can sometimes get out-of-sync, and still reference the old packaging system.  That's why it's maybe better to start a new project clean and copy files over manually.

````sh
cd myapp
mrt remove iron-router
mrt remove bootstrap-3
mrt remove nifty-widget
mrt remove etc-etc
meteor update
meteor add iron:router
meteor add mrt:bootstrap-3
meteor search widget
meteor add nifty:widget
meteor add etc:etc
````
  
------------------------------------------  
#### Upgrading Packages 0.9.x

If you need to upgrade your packages to 0.9.x, start by reading the hackpad:  
[Add Meteor 0.9 support for your Existing Packages](https://hackpad.com/Add-Meteor-0.9-support-for-your-Existing-Packages-P0R7y1PiXlu)  

````sh
meteor create --package mypackage
cd mypackage
# do stuff
meteor publish --create
meteor publish
````
