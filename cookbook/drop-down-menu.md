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


