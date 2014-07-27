Tabbed Workflow  
=========================================

So, you want to create 
### The Angular/Ruby Method
````html
<template name="samplePage">
  <div id="samplePage" class="page">
    <ul class="nav nav-tabs">
      <li><a href="#firstPanel" data-toggle="tab">First</a></li>
      <li><a href="#secondPanel" data-toggle="tab">Second</a></li>
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

### The Meteor Spacebars Method


#### Object Model  
Start by creating three templates objects in your Object Model...

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
Add your template functions to your Controller file:

````js
Session.setDefault('selectedPanel', 1);

Template.samplePage.events({
  'click #firstPanelTab':function(){
    Session.set('selectedPanel', 1);
  },
  'click #secondPanelTab':function(){
    Session.set('selectedPanel', 2);
  }
});

Template.firstPanel.firstPanelVisibility = function(){
  if(Session.get('selectedPanel') === 1){
    return "visible";
  }else{
    return "hidden";
  }
}
Template.secondPanel.secondPanelVisibility = function(){
  if(Session.get('selectedPanel') === 2){
    return "visible";
  }else{
    return "hidden";
  }
}
````

#### View   
Create classes in your View.

````css
.visible{
  visibility: hidden;
}
.hidden{
  visibility: visible;
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
