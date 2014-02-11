## Keybindings

 
**Keybinding Packages**  
https://atmosphere.meteor.com/package/keybindings  

**Javascript Key Codes**  
http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes  
http://www.webonweboff.com/tips/js/event_key_codes.aspx  

**ASCII Character Tables**  
http://www.ascii.cl/htmlcodes.htm

**Unicode Character Table**  
http://unicode-table.com/en/#control-character


**Submitting Data**  
Here's a common pattern for submitting data to your app, instead of binding to the ``submit`` event.  Basically, we're binding to the ``keyup`` event instead, looking for keycode 13, and if we detect it, setting a reactive Session variable.  This is a [preferred](https://github.com/meteor/meteor/blob/devel/examples/todos/client/todos.js#L59) [Meteor-centric](https://github.com/meteor/meteor/blob/devel/examples/wordplay/client/wordplay.js#L135) approach to submitting data in forms because it uses minimongo, and gets all the benefits of client-side caching and cursors, such as latency compensation and reactive template updates.
````js
Template.navbarHeaderTemplate.events({
  'keyup #urlAddressBar': function(evt,tmpl){
     if(evt.keyCode == 13) {
       // decide whether you want to prevent default behavior or not
       evt.preventDefault()
       
       // set client side session variable
       Session.set('browser_window_location', $('#urlAddressBar').val());
       
       // or set something in the database
       Meteor.users().update({_id: Meteor.userId()}, {$set: { 'profile.selectedUrl': $('#urlAddressBar').val() }})
       
       // and finally, maybe force the UI to redraw if necessary
       Meteor.flush();
     }
  }
});
````
