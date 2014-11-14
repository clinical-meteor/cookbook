Data Validation  
==============================




------------------------------ 
#### Match API  

````sh
meteor add check
````

````sh
meteor add audit-argument-checks
````



------------------------------ 
#### Enforcing a Schema   

Collection2  
https://atmosphere.meteor.com/package/collection2

Simple Schema  
https://atmosphere.meteor.com/package/simple-schema  

Reactive Schema  
https://atmosphere.meteor.com/package/reactive-schema


------------------------------ 
#### Forms Validation  

Mesosphere  
https://atmosphere.meteor.com/package/Mesosphere


------------------------------ 
#### Basic Example  

````html
 <div class="form-group {{fooValidationColor}}">
   <label id="fooLabel" for="fooInput" class="control-label">{{fooValidationText}}</label>
   <input id="fooInput" type="text" class="form-control" placeholder="..." value="{{foo}}">
 </div>
````

````js
Session.setDefault('fooValidation', undefined);

Template.samplePage.events({
  'keyup #fooInput':function(){
    if($('#fooInput').val() === ""){
      Session.set('fooValidation', null);
    }else{
      // we check if there is another post with the same title
      if(Posts.find({title: $('#fooInput').val()}).count() > 0){
        Session.set('fooValidation', true);
      }else{
        Session.set('fooValidation', false);
      }      
    }
  }
});


Template.samplePage.helpers({
  fooValidationText:function(){
    if(Session.get('fooValidation')){
      return "That value is already taken.";
    }else{
      return "Enter Foo Value";
    }
  },
  fooValidationColor:function(){
    if(Session.get('fooValidation') === true){
      return "has-error";
    }else if(Session.get('fooValidation') === false){
      return "has-success";
    }else{
      return "";
    }
  }
});

````
