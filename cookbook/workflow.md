Tabbed Workflow  
=========================================

So, you want to create some tabbed workflow within a particular page.  If you're familiar with Angular, Knockout, or Bootstrap, you may be tempted to use ``data-*`` attributes to toggle your panes, and are likely to wind up with code like the following.

### The Bootstrap/Angular/Knockout Method
````html
<template name="samplePage">
  <div id="samplePage" class="page">
    <ul class="nav nav-tabs">
      <li><a href="#firstPanel" role="tab" data-toggle="tab">First</a></li>
      <li><a href="#secondPanel" role="tab" data-toggle="tab">Second</a></li>
    </ul>
    
    <div id="firstPanel" class="tab-pane">
      {{> firstPanel }}
    </div>
    <div id="secondPanel" class="tab-pane">
      {{> secondPanel }}
    </div>
  </div>
</template>
````

**The Disadvantage**  
Data-toggle attributes aren't supported in all browsers, and tend to breakdown on mobile devices and when running automated tests.  So, if you're trying to get test coveragge for your applications, and have Selenium/Nightwatch walk through your application, this approach probably won't work.  

### The Meteor Spacebars Method

So, to get tabs working in automated test environments, we need to be a little less clever with automated data bindings, and be a bit more explicit with wiring up our inputs and how the helper methods adjust our document object model.  

#### Object Model  
Start by creating your tabs and panes in your Object Model...

````html
<template name="samplePage">
  <div id="samplePage" class="page">
    <ul class="nav nav-tabs">
      <li id="firstPanelTab"><a href="#firstPanel">First</a></li>
      <li id="secondPanelTab"><a href="#secondPanel">Second</a></li>
    </ul>
    
    <div id="firstPanel" class="{{firstPanelVisibility}}">
      {{> firstPanel }}
    </div>
    <div id="secondPanel" class="{{secondPanelVisibility}}">
      {{> secondPanel }}
    </div>
  </div>
</template>
````


#### Controllers  
Then add your template functions to your Controller file:

````js
// this variable controls which tab is displayed and associated application state
Session.setDefault('selectedPanel', 1);

Template.samplePage.firstPanelVisibility = function(){
  if(Session.get('selectedPanel') === 1){
    return "visible";
  }else{
    return "hidden";
  }
}
Template.samplePage.secondPanelVisibility = function(){
  if(Session.get('selectedPanel') === 2){
    return "visible";
  }else{
    return "hidden";
  }
}
Template.samplePage.thirdPanelVisibility = function(){
  if(Session.get('selectedPanel') === 3){
    return "visible";
  }else{
    return "hidden";
  }
}
Template.samplePage.firstPanelActive = function(){
  if(Session.get('selectedPanel') === 1){
    return "active panel-tab";
  }else{
    return "panel-tab";
  }
}
Template.samplePage.secondPanelActive= function(){
  if(Session.get('selectedPanel') === 2){
    return "active panel-tab";
  }else{
    return "panel-tab";
  }
}
Template.samplePage.thirdPanelActive = function(){
  if(Session.get('selectedPanel') === 3){
    return "active panel-tab";
  }else{
    return "panel-tab";
  }
}

````

#### View   
Create classes in your View.

````css
.show {
  display: block !important;
  visibility: visible !important;
}
.hidden {
  display: none !important;
  visibility: hidden !important;
}
````


####  Active Tab
For added effect, you can extend this pattern by injecting classes to indicate the active 
````html
<li id="firstPanelTab" class="{{firstPanelActive}}"><a href="#firstPanel">First</a></li>
<li id="secondPanelTab" class="{{secondPanelActive}}"><a href="#secondPanel">Second</a></li>
````

````js
Template.firstPanel.firstPanelActive = function(){
  if(Session.get('selectedPanel') === 1){
    return "active";
  }else{
    return "";
  }
}
Template.secondPanel.secondPanelActive= function(){
  if(Session.get('selectedPanel') === 2){
    return "active";
  }else{
    return "";
  }
}
````
