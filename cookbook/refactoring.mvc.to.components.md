Refactoring MVC to Components  
=================================================



````html
<template name="fooComponent">
  <section id="fooComponent">
      <!-- stuff -->
  </section>
</template>
````

````js
Router.route('/foo', {
  template: 'fooComponent'
});

Template.fooComponent.helpers({ ... });
Template.fooComponent.events({ ... });

Template.name.onRendered(function(){ ... });
Template.name.onCreated(function(){ ... });
Template.name.onDestroyed(function(){ ... });
````

````less

.fooComponent{
  // add custom component classes here

  // desktop specific layout for this component
  @media only screen and (min-width: 960px) { }

  // landscape orientation for this component
  @media only screen and (min-width: 768px) { }

  // portrait orientation for this component
  @media only screen and (min-width: 480px) { }
}
````

