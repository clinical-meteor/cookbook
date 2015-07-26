
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
  name: "mainRoute"
});
Router.route('/home', {
  template: "mainPage",
  name: "homeRoute"
});




Router.onAfterAction = function(){
  Template.appLayout.delayedLayout(50);
}
