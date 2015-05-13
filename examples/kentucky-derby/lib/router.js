
//--------------------------------------------------------------
// Global Configuration

Router.configure({
  layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'}
  }
});


Router.route('/', {
  template: "mainPage",
  name: "mainPage",
  onAfterAction: function(){
    Template.appLayout.layout();
  }
});


Router.onAfterAction = function(){
  Template.appLayout.delayedLayout(50);
}
