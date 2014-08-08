Theming  
=================


Theming in Meteor is beautiful, because we have CSS precompilers at our disposal.  Start off with an html template: 

````html
<template name="foo">
  <div class="{{current_theme_name}}">
    <span class="t1">hello</span>
  </div>
</template>
````

And add a template function to update on a dynamic Session variable.
````
Template.foo.current_theme_name = function(){
  if(Session.get('current_theme_name') == 'black'){
    return "theme1";
  }else{
    return "theme2";
  }
}
````

Then add some LESS magic, using nested CSS classes and a custom namespacing:
````
theme1 {
  t1 {background-color: black}
}
theme2 {
  t1 {background-color: red}
}
````


And wrap it all up with some controls to toggle the dynamic session variable.
````
Template.bar.events({
  'click .button-black: function(){
    Session.set('current_theme_name', 'black');
  },
  'click .button-red: function(){
    Session.set('current_theme_name', 'red');
  }
})
````
