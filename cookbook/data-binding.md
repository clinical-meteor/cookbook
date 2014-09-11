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

Wait.  Really?  You might be thinking "that's not how I'm accustomed to doing data bindings.  Where are the data-* attributes?".  Well, the good news is that Meteor's client-side minimongo data store handles most all of the data synchronization for you, and exposes a data context along with your Blaze templates.  And that effectively eliminates the need to have data-* attributes.  The only thing you need to do is expose some hooks between the datastore and the template using a spacebars syntax, which is similar to PHP, moustache, and handlebars.  

-------------
#### Two-Way Data Binding  

After you get through that, you can get creative with dynamically generated data-bindings like this:
````html
<template name='helloWorld'>
  <input id="{{getDynamicId}}" class="radioButton button" value="{{ foo }}"></input>
</template>
````

And some cleverness like so:
````js
var dynamicId = "fooInput";
Template.helloWorld.getDynamicId = function(){
  return dynamicId;
}
Template.helloWorld.events({
  'keyup radioButton':function(){    
    // for basic 2-way data-binding
    Posts.update(postId,{$set: {foo: $(this._id).val()} });  

    // for more clever things like many-to-one mappings, multi-way databindings, etc.
    Posts.update(postId,{$set: {foo: $('#' + dynamicId).val() }});
  }
});
```

Or get really clever with reactive Session variables.  
````js
Session.setDefault('dynamic_id', "fooInput");
Template.helloWorld.getDynamicId = function(){
  return Session.get('dynamic_id');
}
Template.helloWorld.events({
  'keyup button':function(){    
    // for contextually reactive 2-way data-binding
    Posts.update(postId,{$set: {foo: $('#' + Session.get('dynamic_id')).val() }});
  }
});
```

**warning**  
Relying on Session variables reactivity can get out of control quickly.  Contextually reactive multi-way databinding can be super powerful, but be sure to have a test applet where you can study and confirm the behavior of the queries and templates you're trying to render.  This kind of approach can become combinatorially complex very quickly.

#### Data-* Compatibility

Okay, so maybe you have some backward compatibility issues or are migrating an application from Angular or Knockout to Meteor, and have a who bunch of data-* syntax that you have to deal with.  How to make Meteor play nicely with them?  Well, remember that you can place spacebar brackets pretty much anywhere in your HTML and CSS selectors can query by attribute type and there is the ``getAttribute`` method.  Your HTML will be a bit more cluttered than it needs to be, and your CSS selectors won't be as fast and can get overloaded; but you can make it work.

````html
<template name='helloWorld'>
  {{#with currentPost}}
    <input id="fooInput" data-value="{{ foo }}"></input>
  {{/with}}
</template>
````

````js
// then set up the databinding
Template.helloWorld.events({
  'keyup #fooInput':function(){
    Posts.update(postId,{$set: {foo: $("#fooInput").getAttribute('data-value')} })
  }
});
````

#### Data-Toggle 

A common issue that people run across is getting Bootstrap data-toggles to work.  The best way to handle data-toggles is to manually wire them up yourself.  Start by giving a unique ID to the relevant elements in your UI controls.

````html
<template name='dropDownWidget'>
  <button id="openDropDown" class="btn btn-info"></button>
  <ul id="dropDownMenu" class="list-group">
    <li class="list-group-item">Item 1</li>
    <li class="list-group-item">Item 2</li>
  </ul>
</template>
````

Then wire up a jQuery selector to toggle classes on the appropriate elements. 
````js
// then set up the databinding
Template.dropDownWidget.events({
  'click #openDropDown':function(){
    // the jQuery toggle() function adds and removes the 'open' class
    $('#dropDownMenu').toggle('open');
  }
});
````


