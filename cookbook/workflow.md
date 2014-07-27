## Tabbed Workflow  

**Q:  How do I crate a wizard dialog?**  
This recipe assumes that your Model is an .html file, your View is a .css or .less file, and your Controller is a .js file.

#### Object Model  
Start by creating three templates objects in your Object Model...

````html
<template name="samplePage">
  <div id="samplePage" class="page">
    <ul class="nav nav-tabs">
      <li id="firstPanelTab" class="{{firstPanelActive}}"><a href="#firstPanel" data-toggle="tab">First</a></li>
      <li id="secondPanelTab" class="{{secondPanelActive}}"><a href="#secondPanel" data-toggle="tab">Second</a></li>
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
Template.firstPanel.firstPanelActive = function(){
  if(Session.get('selectedPanel') === 1){
    return "active panel-tab";
  }else{
    return "panel-tab";
  }
}
Template.secondPanel.secondPanelActive= function(){
  if(Session.get('selectedPanel') === 2){
    return "active panel-tab";
  }else{
    return "panel-tab";
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
