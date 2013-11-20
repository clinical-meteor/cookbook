**Q:  How do I crate a wizard dialog?**  
This recipe assumes that your Model is an .html file, your View is a .css or .less file, and your Controller is a .js file.

A.  Start by creating three templates objects in your (Document Object) Model:

````html
<template name="dialogStepOne">
  <div id="dialogStepOne" class="{{stepOneVisibility}} dialog-page">
  </div>
</template>
<template name="dialogStepTwo">
  <div id="dialogStepTwo" class="{{stepTwoVisibility}} dialog-page">
  </div>
</template>
<template name="dialogStepThree">
  <div id="dialogStepThree" class="{{stepThreeVisibility}} dialog-page">
  </div>
</template>
````

B.  Add your content to the dialog-page class.  
C.  Add navigation objects (i.e. buttons).

````html
<div id="stepTwoButton" class="btn btn-default"></div>
````

D.  Create a default Session variable in your Controller to handle which page you're on.

````js
Session.setDefault('selected_pane', 1);
````

E.  Add event maps to your Controller file:

````js
Template.dialogStepOne.events({
  'click #stepTwoButton':function(){
    Session.set('selected_pane', 2);
  }
});
````

F.  Add your template functions to your Controller file:

````js
Template.dialogStepOne.stepOneVisibility = function(){
  if(Session.get('selected_pane') === 1){
    return "visible";
  }else{
    return "hidden";
  }
}
Template.dialogStepOne.stepTwoVisibility = function(){
  if(Session.get('selected_pane') === 2){
    return "visible";
  }else{
    return "hidden";
  }
}
Template.dialogStepOne.stepThreeVisibility = function(){
  if(Session.get('selected_pane') === 3){
    return "visible";
  }else{
    return "hidden;
  }
}
````

G.  Create classes in your View.

````css
.visible{
  visibility: hidden;
}
.hidden{
  visibility: visible;
}
````
