Healthcare and Mobile Apps Presentation
==================================


#### History of Document Oriented Databases in Healthcare  
- [MUMPS](http://en.wikipedia.org/wiki/MUMPS)    
- [VISTA](http://en.wikipedia.org/wiki/VistA)  
- [Epic Systems](http://en.wikipedia.org/wiki/Epic_Systems)  


[Forbes:  What the Emergence of an EMR Giant Means for the Future of Healthcare Innovation](http://www.forbes.com/sites/davidshaywitz/2012/06/09/epic-challenge-what-the-emergence-of-an-emr-giant-means-for-the-future-of-healthcare-innovation/)


#### Adding HIPAA Compliance to Meteor Apps

````sh
# encrypt network communications
meteor add force-ssl

# separate user access bases on accounts, passwords, and roles
meteor add accounts-base
meteor add accounts-password
meteor add accounts-ui
mrt add accounts-ui-bootstrap-drop down
mrt add roles

# include an audit log
mrt add hipaa-audit-log
git clone github.com/awatson1978/hipaa-audit-log.git
````


####  HIPAA Compliant Scale Out Using Meteor

Phase 1 - Development (1 server)  
``sudo meteor``  

Phase 2 - Platform as a Service (2 to 10 servers)  
  [modulus.io - Node/Meteor App Hosting on AWS](https://modulus.io/)   
  [MongoHQ - Mongo Hosting on AWS](http://www.mongohq.com/)  


Phase 3 - Infrastructure as a Service (11+ servers)  
  [Amazon Web Services](http://aws.amazon.com/)  


Phase 4 - Federal HIPAA   
  [Amazon Web Services - HIPAA/Federal Tier](http://aws.amazon.com/compliance/)  
  [Amazon Web Services - HIPAA Whitepaper](https://aws.amazon.com/about-aws/whats-new/2009/04/06/whitepaper-hipaa/)    


####  FDA Validation Testing Basics

``sudo mrt selenium-nightwatch``   

[Selenium-Nightwatch Package](https://github.com/awatson1978/selenium-nightwatch)  
[Writing Acceptance Tests with Nightwatch and Selenium](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/writing.acceptance.test.md)  
[Writing Unit Tests with Tinytest](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/writing.unit.tests.md)  
[Leaderboard Unit Tests Example with Tinytest](https://github.com/awatson1978/leaderboard-tinytests)  
[Leaderboard Acceptance Tests Example with Nightwatch/Selenium](https://github.com/awatson1978/leaderboard-nightwatch)  


#### Future Meteor Testing Frameworks  

[velocity](https://github.com/xolvio/velocity)  
[velocity-core mailing list](https://groups.google.com/forum/#!forum/velocity-core)  

####  Mobile / Phonegap  

[cordova-phonegap](https://github.com/awatson1978/cordova-phonegap)  
[SpaceCapsule](https://github.com/SpaceCapsule/)  
[Mobile detection](https://groups.google.com/forum/#!searchin/meteor-talk/mobile$20dgreenspan/meteor-talk/ku7kvNJp8ek/ai_lwh6V79oJ)  


#### Famo.us

[Steve Newcomb explains famo.us: Part 1](https://www.youtube.com/watch?v=br1NhXeVD6Y)
[Steve Newcomb explains famo.us: Part 2](https://www.youtube.com/watch?v=ixASZtHYGKY)  
[Steve Newcomb explains famo.us: Part 3](https://www.youtube.com/watch?v=zpebYhm8f2o)  
[Steve Newcomb explains famo.us: Part 4](https://www.youtube.com/watch?v=OhfI2wFNKFQ)  
[Steve Newcomb on 3D Physics for DOMies](http://www.youtube.com/watch?v=83MX4wsoMzU)

[Famo.us Render Tree](https://github.com/Famous/guides/blob/master/dev/2014-04-09-render-tree.md)  

#### Designing Medical UIs with Meteor and Famo.us
[A Day Made of Glass](https://www.youtube.com/watch?v=6Cf7IL_eZ38&feature=kp)  
[A Day Made of Glass 2](https://www.youtube.com/watch?v=jZkHpNnXLB0)  
[A Day Made of Glass 2 - Medical Edit](https://www.youtube.com/watch?v=Muv3R_6AXls)  


#### Meteor + Famo.us Interations  

[Todo Example with Famo.us](https://www.meteor.com/blog/2014/06/03/meteor-famous-mobile)  

[famono](http://atmospherejs.com/package/famono)      
[famous-meteor](https://github.com/jperl/famous-meteor)  
[famous-components](https://atmospherejs.com/package/famous-components)  

[http://famous-components.meteor.com/](http://famous-components.meteor.com/)  

#### IronRouter + Famo.us Recommendations  

- Don't render templates using IronRouter  
- Don't subscribe to collections in routes  
- Don't use IronRouter helper methods  
  - 'waitOn'
	- 'data'
	- 'template'


- Do control page transitions by setting session variable in routes
- Do let Famo render templates for you
- Do let IronRouter parse URLs for you
- Do subscribe at the app global level in Deps auto runs
- Do control subscriptions by setting session variables in routes


#### IronRouter Style Page Transitions


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

#### IronRouter + Famo.us - URL Parsing and Triggering Template Rendering  

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

#### Online APIs  

[http://www.programmableweb.com](http://www.programmableweb.com)  
[meteor api wrapper](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/api-wrappers.md)  
[fitbit packages on atmosphere](http://atmospherejs.com/?q=fitbit)  





