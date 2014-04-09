## Drop Down Menu  

#### Object Model

````html
<template name="dropDownWidget">
  <div id="dropDownWidgetName" class="{{dropDownWidgetVisible}}">

  </div>
</template>
````



#### Controllers  
````js
Session.setDefault('isDropDownMenuVisible', false);

Template.dropDownWidgetName.dropDownWidgetVisible = function(){
  return "visible";
};
Template.dropDownWidgetName.events({
  'click #accountSettingsMenu':function(){
    if(Session.get('isDropDownMenuVisible')){
      Session.set('isDropDownMenuVisible', false);
    }else{
      Session.set('isDropDownMenuVisible', true);
    }
  }
});
````


#### Views  

````css
#dropDownWidgetName{
  .visible{
    display: block;
  }
  .hidden{
    display: none;
  }
}
````

````css
#dropDownWidgetName{
  .visible{
    display: block;
  }
  .hidden{
    display: none;
  }
}

// landscape orientation
@media only screen and (min-width: 768px) {
  #dropDownWidgetName{


  }
}

// portrait orientation
@media only screen and (max-width: 768px) {
  #dropDownWidgetName{


  }
}
@media only screen and (max-width: 480px) {
  #dropDownWidgetName{


  }
}
````


