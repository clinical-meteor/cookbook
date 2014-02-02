## Two-Way Data Binding

Start by setting up your document collections, publications, and subscriptions.  
````js
Posts = new Meteor.Collection('posts');
if(Meteor.isServer){
  Meteor.publish('posts', function() {
    return Posts.find();
  });
}
if(Meteor.isClient){
  Meteor.subscribe('posts');
}

````

Once that's done, add an input element to your Object Model.
````html
<template name='helloWorld'>
  {{#with currentPost}}
    <input id="fooInput" value="{{ foo }}"></input>
    <div>Value:  {{foo}}</div>
  {{/with}}
</template>
````

Then set up your Controller.
````js
// this simply retrieves a document from the collection
// you can also use #each loops
Template.helloWorld.currentPost = function(){
    return Posts.getOne(postId);
};

// then set up the databinding
Template.helloWorld.events({
  'keyup #fooInput':function(){
    Posts.update(postId,{$set: {foo: $('#fooInput').val()} }
  }
});
```
And that's it!  You're done!  

-------------


After you get through that, you can get creative with dynamically generated data-bindings like this:
````html
<template name='helloWorld'>
  <input id="{{getDynamicId}}" class="radioButton button" value="{{ foo }}"></input>
</template>
````

And some cleverness like so:
````js
var dynamicId = "#fooInput";
Template.helloWorld.getDynamicId = function(){
  return dynamicId;
}
Template.helloWorld.events({
  'keyup radioButton':function(){    
    // for basic 2-way data-binding
    Posts.update(postId,{$set: {foo: $(this._id).val()} });  

    // for more clever things like many-to-one mappings, multi-way databindings, etc.
    Posts.update(postId,{$set: {foo: $(dynamicId).val() }});
  }
});
```

Or get really clever with reactive Session variables.  
````js
Session.setDefault('dynamic_id', "#fooInput");
Template.helloWorld.getDynamicId = function(){
  return Session.get('dynamic_id');
}
Template.helloWorld.events({
  'keyup button':function(){    
    // for contextually reactive 2-way data-binding
    Posts.update(postId,{$set: {foo: $(Session.get('dynamic_id')).val() }});
  }
});
```

**warning**  
Relying on Session variables reactivity can get out of control quickly.  Contextually reactive multi-way databinding can be super powerful, but be sure to have a test applet where you can study and confirm the behavior of the queries and templates you're trying to render.  This kind of approach can become combinatorially complex very quickly.

--------------------------------------

In theory, if you really want an Angular or Knockout style data-* syntax, you could maybe create a helper function using an attribute selector, like so:
````

$("input[data-value]").val();
````
