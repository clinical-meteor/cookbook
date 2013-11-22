  
  
  
  
  
Well, it's easy enough to replace.  Although it begs the question...  "what's controlling the state?'  Here's an example that returns edit state based on whether the current date is an even number.

````js
Session.setDefault('edit_mode', false);
Template.collectibleCollections.helpers({
    showEdit: function(){
        editMode = false;
        function parseTemplateState(){
            var today = new Date();
            if(today.getDay() % 2 == 0){
              editMode = true;
            }else{
              editMode = false;
            }
            return editMode;
        }
        parseTemplateState();
    }
});
````

And cleaned up a bit:

````js
Session.setDefault('edit_mode', false);
Template.collectibleCollections.helpers({
    showEdit: function(){
        function parseTemplateState(){
            var today = new Date();
            if(today.getDay() % 2 == 0){
              return true;
            }else{
              return false;
            }
        }
        parseTemplateState();
    }
});
````

And cleaned up even more:

````js
Session.setDefault('edit_mode', false);
Template.collectibleCollections.helpers({
    showEdit: function(){
        var today = new Date();
        if(today.getDay() % 2 == 0){
          return true;
        }else{
          return false;
        }
    }
});
````

They all work just fine.  But if you're not passing in data through a reactive Session variable, you're going to need to either create an object or add some logic to manage the state.    
