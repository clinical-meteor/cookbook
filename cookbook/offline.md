Offline Meteor Apps
============================================


For some review on this topic, start by reading the [Latest on Cordova/PhoneGap](https://groups.google.com/forum/#!searchin/meteor-talk/morten$20meteor$20architecture$20build/meteor-talk/sZLCHH1Hd3I/wyTf21_smzkJ).

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
  }else if(Meteor.status().status === "waiting"){
    return "orange";
  }else{
    return "red";
  }
};
````

````html
  <div id="onlineStatus" class="alert {{getOnlineColor}}">
    {{getOnlineStatus}}
  </div>
````

````css
.green{
  color: green;
}
.red{
  color: red;
}
.orange{
  color: darkorange;
}
````

----------------------------------
####  Overview

- Offline Access  
  - Appcache - Caches Application Static Code  
  - GroundDB - Caches Application Data
  - [Meteor.status()](http://docs.meteor.com/#meteor_status)  
- Device Detection (pick one)  
  - mrt add browser-detection  
  - mrt add bowser  
  - mrt add device-detection  
  - mrt add platform.js  
- Hardware Layer  
  - Cordova/Phonegap  
    - Riovine Mobile Container  
    - Meteor Architecture Build Pipeline  
  - Cordova Plugins  
    - [Maps](https://github.com/wf9a5m75/phonegap-googlemaps-plugin)    
  - Push Notifications  
    - Alerts  
- Responsive Design  
  - Bootstrap-3  
  - LESS  
  - Media Style Sheets  
- Native Response - 60fps  
  - mrt add famono  
  - mrt add famo-components  
  - Scrolling  
  - Page Transitions  
    - Global Subscriptions  
    - Surface Templates  
    - Session Variables   
- Multitouch  
  - mrt add hammer  
