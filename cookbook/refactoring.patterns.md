Refactoring Patterns   
============================


#### Combining Template Helpers
Begin with a number of helper functions...
````js
// before refactoring
Template.promptModal.getPromptTitle = function(){
  return Session.get('promptTitle');
};
Template.promptModal.getPromptMessage = function(){
  return Session.get('promptMessage');
};
Template.promptModal.getUserName = function(){
  return Meteor.user().profile.name;
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
// after refactoring
Template.promptModal.helpers({
  getPromptTitle = function(){
    return Session.get('promptTitle');
  },
  getPromptMessage = function(){
    return Session.get('promptMessage');
  },
  getUserName = function(){
    return Meteor.user().profile.name;
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
And we now avoid having to write ``Template.promptModal`` over and over and over again.  It's a minor refactoring, but it keeps things tidy.

#### Extracting and Registering a Template Helper

Now lets say we find a helper that we're using in different templates...
````js
// before refactoring
Template.promptModal.helpers({
  getUserName = function(){
    return Meteor.user().profile.name;
  },
  // more helpers
});
Template.confirmModal.helpers({
  getUserName = function(){
    return Meteor.user().profile.name;
  },
  // more helpers
});
````

We can extract that function, and share it across **all** our templates, by doing the following:  
````js
// after refactoring
UI.registerHelper('getUserName', function(){
  return Meteor.user().profile.name;
});
````
And now we save ourselves the retyping of ``Template.fooTemplate.helpers({getUserName = function(){`` over and over again.  Plus, if we update the function, and add new features, such as validation logic (or whatever), all of our templates will get that update.  This is a big win, and the kind of refactorings you eventually want to be on the lookout for.  







