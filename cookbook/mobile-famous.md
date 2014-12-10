
=============================================
## Famo.us (Advanced)


=============================================
#### 60fps Native Repsonse Widgets

If you want 60fps native response in your widgets, animations, and page transitions, you're going to need to override the CSS rendering subsystem with a library like Famo.us (or Google Polymer).  

````sh
mrt add famono
mrt add famono-components
````

[Meteor-Cordova-Famous - The Chill Way To Build Apps](https://www.discovermeteor.com/blog/meteor-cordova-famous-the-chill-way-to-build-apps/)  

=============================================
#### Famo.us Style Page Transitions

You'll then need to use Famo.us to do things like render page transitions, which should look something like this:  

````html
{{#RenderController}}
  {{> yield}}
{{/RenderController}}

<template name="rc_surface1">
  {{#Surface class="red-bg" origin="[0,0]" size="[75,150]"}}
    <div class="full">#1</div>
  {{/Surface}}
</template>
````

````js
Template.views_RenderController.helpers({
  'showTemplate': function() {
    return Template[this.name];
  }
});
Session.setDefault('currentTemplate', 'rc_surface1');
Template.views_RenderController.currentTemplate = function() {
  return Session.get('currentTemplate');
}
Template.rc_buttons.events({
  'click button': function(event, tpl) {
    Session.set('currentTemplate', this.valueOf());
  }
});
````

=============================================
#### IronRouter + Famo.us - URL Parsing and Triggering Template Rendering

The next big issue in designing mobile apps is figuring out how to support the URL social contract and maintain fluid page-transitions.  Doing one or the other is easy.  Doing both URLs **and** page-transitions is difficult. You'll need to move away from subscribing to collections within the router function, because it will take too long for the data to be fetched.  Instead, do your data subscriptions in the root of your application, and use IronRouter to trigger Session variables that will trigger Famo.us to do page transitions.  

````js
// vanilla IronRouter pattern

Router.map(function() {
  this.route('postRoute', {
    path: '/posts/:id',
    template: 'postPage',
    onBeforeAction: function() {
      Session.set('selected_post', this.params.id);
    },
    waitOn: function() {
      Meteor.subscribe('posts', this.params.id);
    },
    data: function() {
      return Campaigns.findOne({ _id: this.params.id });
    }
  });
});

// IronRouter + Famo.us

Router.map(function(){
  this.route('postRoute', {
    path: '/posts/:id',
    onBeforeAction: function() {
      Session.set('selected_post', this.params.id);
      Session.set(‘currentTemplate’, ‘postPage’);
    }
  });
});
````

