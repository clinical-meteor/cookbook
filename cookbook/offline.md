Offline Apps
============================================

Taking an app offline involves using the browser's cache to store application assets, enabling localstorage so we can ground our minimongo collection, and adding some UI elements so that people know when they're online or not.  

For a full demo, check out the following links.  
[Offline Todos Demo](http://offline-todos.meteor.com/#/lists/9H6FFW5qAnoP68c8K)  
[Offline Todos Source Code](https://github.com/awatson1978/offline-todos)  

============================================
####  Meteor.status()

The first thing to do when taking your Meteor app offline is to create some visual indication of whether the local client app is connected to the server or not.  There are lots of ways to do this, but the simplest way is to probably do something like this:

````js
Template.registerHelper('getOnlineStatus', function(){
  return Meteor.status().status;
});

Template.registerHelper('getOnlineColor', function(){
  if(Meteor.status().status === "connected"){
    return "green";
  }else{
    return "orange";
  }
});

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


============================================
####  Enable Appcache  

One of the easier steps is adding the appcache.  Appcache will allow your application content to load even when there is no internet access.  You won't be able to get any data from your mongo servers, but the static content and assets will be available offline.

````sh
meteor add appcache
````

============================================
####  Enable GroundDB

Finally, we want to get some of our dynamic data to be stored offline.  
````sh
meteor add ground:db
````

````js

//Lists = new Meteor.Collection("lists");
//Todos = new Meteor.Collection("todos")

Lists = new GroundDB("lists");
Todos = new GroundDB("todos");
````

============================================
####  Things to Be Careful Of  

- The appcache will cause some confusion in your development workflow, because it hides Meteor's auto-updating features.  When you turn off the server component of your app, the client portion in your browser will continue working.  This is a good thing!  But, you don't get the immediate feedback that your app has been turned off, or that there have been updates.   
- Try using Chrome's Incognito Mode when developing your app, because it *doesn't* use appcache.  
- GroundDB doesn't work particularly well with IronRouter.  

============================================
####  Further Appcache Research   
http://www.html5rocks.com/en/tutorials/indexeddb/todo/  
http://grinninggecko.com/2011/04/22/increasing-chromes-offline-application-cache-storage-limit/  
http://www.html5rocks.com/en/tutorials/offline/quota-research/  
https://developers.google.com/chrome/apps/docs/developers_guide?csw=1#installing  
https://developers.google.com/chrome/apps/docs/developers_guide?csw=1#manifest



