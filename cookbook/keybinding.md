 
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
Here's a common pattern for submitting data to your app, instead of binding to the ``submit`` event.  Basically, we're binding to the ``keyup`` event instead, looking for keycode 13, and if we detect it, setting a reactive Session variable.  This is a preferred Meteor-centric approach to submitting data in forms.  
````js
Template.navbarHeaderTemplate.events({
  'keyup #urlAddressBar': function(evt,tmpl){
    try{
      if(evt.keyCode == 13) {
        Session.set('browser_window_location', $('#urlAddressBar').val());
        Meteor.flush();
      }
    }catch(err){
      console.error(err);
    }
  }
});
````
