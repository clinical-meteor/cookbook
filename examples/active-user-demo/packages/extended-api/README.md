clinical:session-extended-api
====================
Package that extends the Session API, with toggle(), clear(), and setAll() methods.


## Installation

First, install the session-extended-api package from the command line, like so:

````js
meteor add clinical:session-extended-api
````

## API

The Session object will support the following API with this package installed:  

````js
Session.set()
Session.setDefault()
Session.setAll()
Session.get()
Session.equals()
Session.toggle()
Session.clear()
````


## Testing  

View the TinyTests results by doing the following:  
````js
cd myapp/packages/session-extended-api
meteor test-packages
````


## Examples  


**Session.toggle(key)**
Toggle a variable true/false in the session.

````js
//example
Session.setDefault("widgetIsOpen", false);

Template.myTemplate.events({
  'click #displayWidgetButton':function(){
    Session.toggle("widgetIsOpen");
  }
});
````

**Session.clear(key)**
Toggle a variable true/false in the session.

````js
//example
Session.setDefault("selectedPurchaseItemId", Meteor.user().profile.selectedItemId);

Template.myTemplate.events({
  'click #emptyShoppingCart':function(){
    Session.clear("selectedPurchaseItemId");
  }
});
````


## Licensing

MIT License.  Use as you will.
