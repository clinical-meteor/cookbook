
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
  name: "mainPage"
});


Router.onAfterAction = function(){
  Template.appLayout.delayedLayout(50);
}
