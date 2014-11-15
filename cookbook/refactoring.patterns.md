Refactoring Patterns   
============================


#### Combining Template Helpers
The following refactoring pattern is particularly important for people with pre 0.8 Meteor apps.  Since Blaze, we've no longer been allowed to attach helper functions directly on the template object.  Instead, we have a ``helpers()`` method which accepts a JSON object which we decorate with methods.  So, to upgrade from <0.8 to Meteor 1.0, we need to refactor our helper functions into a JSON object.  Here's how:
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
And we now avoid having to write ``Template.promptModal`` over and over and over again. 

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
Template.registerHelper('getUserName', function(){
  return Meteor.user().profile.name;
});
````
And now we save ourselves the retyping of ``Template.fooTemplate.helpers({getUserName = function(){`` over and over again.  Plus, if we update the function, and add new features, such as validation logic (or whatever), all of our templates will get that update.  This is a big win, and the kind of refactorings you eventually want to be on the lookout for.  



#### Convert Helper Functions Into an Isomorphically Shared Object  

Syntax matters when refactoring code, and if you want to isomorphically share helper functions between server and client, you'll need to begin by refactoring your function declarations into anonymous function expressions.
````js
// function declaration, scoped to the local file  
// client/main.js
function getRandomNumber(){
  return Math.random();
}

// anonymous function expression, can be shared between files on the client side
// client/main.js
getRandomNumber = function(){
  return Math.random();
}
````

Once your helper functions are converted to anonymous function expressions, it becomes easy to add them to an helper object.  It's mostly a question of punctuation, and converting some equal signs into colons, and putting the functions into a JSON object.  After that, simply instantiate a new instance of the object, and call it's method.

````js
// can be refactored and shared between files on the client side
// shared/helpers.js
LipsumGenerator = {
  getRandomNumber: function(){
    return Math.random();
  }
}

// client/main.js
lipsumGenerator = new LipsumGenerator();
lipsumGenerator.getRandomString();
````




