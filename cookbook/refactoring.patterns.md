Refactoring Patterns   
============================


#### Template Helpers

Begin with a number of helper functions...
````js
Template.promptModal.getPromptTitle = function(){
  return Session.get('promptTitle');
};
Template.promptModal.getPromptMessage = function(){
  return Session.get('promptMessage');
};
Template.promptModal.rendered = function(){
  $("#promptModal").modal({                    
    "backdrop"  : "static",
    "keyboard"  : true,
    "show"      : false                     
  });
};

````

And when you get a whole bunch of them, refactor, organize, and consolidate into the following syntax:  
````js
Template.promptModal.events({
  getPromptTitle = function(){
    return Session.get('promptTitle');
  },
  getPromptMessage = function(){
    return Session.get('promptMessage');
  },
  rendered: function(){
    $("#promptModal").modal({                    
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : false                     
    });
  }
});
````







