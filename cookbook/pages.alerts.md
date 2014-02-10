## Alerts and Errors  

Alerts and errors really are nearly the simplest of all Meteor component patterns.  They're so simple, in fact, that they barely register as a pattern in of themselves.  Instead of adding FlashAlert modules or patterns, all you really need to do is style a Handlebar template appropriate, add a helper, and wire it up to a reactive Session variable.

### Object Model:  Define Alert Object
Start by adding some elements to your document object model.  In this case, we want to create a div element for our alert, that's wired up to two Handlebar helpers.  

````html
<template name="postsPage">
  <div id="postsPage" class="page">
    <div id="postsPageAlert" class="{{alertColor}}">{{alertMessage}}</div>
    <div class="postsList">
      <!-- other code you can ignore in this example -->
    </div>
    <div id="triggerAlertButton" class="btn btn-default">
  </div>
</template>
````

### Controller:  Define Template Helpers  
Then we want to wire up some controllers that will populate the object model with data.  We do so with two reactive session variables, and two handlebar helpers.

````js
Session.setDefault('alertLevel', false);
Session.setDefault('alertMessage', "");

Template.postsPage.alertColor = function(){
 if(Session.get('alertColor) == "Success"){
  return "alert alert-success";
 }else if(Session.get('alertColor) == "Info"){
  return "alert alert-info";
 }else if(Session.get('alertColor) == "Warning"){
  return "alert alert-warning";
 }else if(Session.get('alertColor) == "Danger"){
  return "alert alert-danger";
 }else{
  return "alert alert-hidden"
 }
}

Template.postsPage.alertMessage = function(){
  return Session.get('alertMessage');
}
````


### Views: Define DOM Visibilty
Then we want to go back to our CSS, and define two views of the postsPage element.  In the first View, we display all of the contents in our object model.  In the second view, only some of the contents of our object model are displayed.  

````css
#postsPage{
  .alert{
    display: block;
  }
  .alert-hidden{
    display: none;
  }
}
````

### Controllers:  Triggering the Alert
Lastly, we go back to our controllers, and we define an event controller, which will trigger our alert when clicked.  

````js
Template.postsPage.events({
  'click #triggerAlertButton':function(){
    Session.set('alertLevel', 'Success');
    Session.set('alertMessage', 'You successfully read this important alert message.');
  }
});
````
