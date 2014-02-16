## Drop Down Menu  

#### Object Model

````html
<template name="dropDownWidget">
  <div id="dropDownWidgetName" class="pop-dialog {{dropDownWidgetVisible}}">

  </div>
</template>
````


#### Controllers  
````js
Template.dropDownWidgetName.dropDownWidgetVisible = function(){
  return "visible";
};
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


