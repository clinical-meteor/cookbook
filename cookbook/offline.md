Offline Meteor Apps
============================================


For some review on this topic, start by reading the [Latest on Cordova/PhoneGap](https://groups.google.com/forum/#!searchin/meteor-talk/morten$20meteor$20architecture$20build/meteor-talk/sZLCHH1Hd3I/wyTf21_smzkJ).

----------------------------------
####  Mobile Overview

- Offline Access  
  - [Meteor.status()](http://docs.meteor.com/#meteor_status)  
  - Appcache - Caches Application Static Code  
  - GroundDB - Caches Application Data
- Responsive Design  
  - Bootstrap-3  
  - LESS  
  - Media Style Sheets  
- Device Detection (pick one)  
  - mrt add browser-detection  
  - mrt add bowser  
  - mrt add device-detection  
  - mrt add platform.js  
- Multitouch  
  - mrt add hammer  
- Hardware Layer  
  - Cordova/Phonegap  
    - Riovine Mobile Container  
    - Meteor Architecture Build Pipeline  
  - Cordova Plugins  
    - [Maps](https://github.com/wf9a5m75/phonegap-googlemaps-plugin)    
  - Push Notifications  
    - Alerts  
- Native Response - 60fps  
  - mrt add famono  
  - mrt add famo-components  
  - Scrolling  
  - Page Transitions  
    - Global Subscriptions  
    - Surface Templates  
    - Session Variables   

----------------------------------
####  Meteor.status()

The first thing to do when taking your Meteor app offline is to create some visual indication of whether the local client app is connected to the server or not.  There are lots of ways to do this, but the simplest way is to probably do something like this:

````js
UI.body.getOnlineStatus = function(){
  return Meteor.status().status;
};
UI.body.getOnlineColor = function(){
  if(Meteor.status().status === "connected"){
    return "green";
  }else{
    return "orange";
  }
};
````

````html
  <div id="onlineStatus" class="{{getOnlineColor}}">
    {{getOnlineStatus}}
  </div>
````

````less
.green{
  color: green;
}
.orange{
  color: orange;
}
````
----------------------------------
####  Enable Appcache  

One of the easier steps is adding the appcache.  Appcache will allow your application content to load even when there is no internet access.  You won't be able to get any data from your mongo servers, but the static content and assets will be available offline.

````sh
meteor add appcache
````

----------------------------------
####  Enable GroundDB

Next, we want to get some of our dynamic data to be stored offline.  
````sh
meteor add raix:grounddb
````


````js

//Lists = new Meteor.Collection("lists");
//Todos = new Meteor.Collection("todos")

Lists = new GroundDB("lists");
Todos = new GroundDB("todos");
````

----------------------------------
####  Responsive Design  



