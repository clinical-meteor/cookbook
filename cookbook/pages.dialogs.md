## Modal Dialogs  
----------------------

Setting up modal dialogs in Meteor is super easy, and there's no need to use an external library like jQuery.  


First, set up your templates and document object model....  
````html
<template name="homePage">
  {{> dialogTemplate}}
  <div id="openDialogButton" class="btn btn-default">Open</div>
</template>

<template name="dialogTemplate">
  {{#if isVisible}}
    <div id="dialogMask" class="overlay-mask"></div>
    <div id="dialogPanel">
      <div class="panel panel-default">
        <div class="panel-heading">
          New Record
        </div>
        <div class="padded">
          <p>Lorem ipsum, dolar set imet...</p>
          <div id="dialogCloseButton" class="btn btn-default">Close</div>
        </div>
      </div>
    </div>
  {{/if}}
</template>
````

Then add your controllers to toggle the modal dialog on/off.  
````js
Session.set('show_dialog', false);
Template.dialogTemplate.isVisible = function(){
    if(Session.get('show_dialog')){
        return true;
    }else{
        return false;
    }
};
Template.dialogTemplate.events({
  'click #dialogCloseButton':function(){
    Session.set('show_dialog', false);
  }
});

Template.homePage.events({
  'click #openDialogButton':function(){
    Session.set('show_dialog', true);
  }
});
````


And just add an overlay mask to make the background transparent....  
````css
.overlay-mask{
  position: fixed !important;
  top: 0px !important;
  background-color: #000;
  opacity: .8;
  filter: alpha(opacity=80);
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 10000;

  cursor: pointer;
}
````

As easy as that!  


### Advanced Options

````js
Template.createDialog.error = function () {
  return Session.get("createError");
};
````
