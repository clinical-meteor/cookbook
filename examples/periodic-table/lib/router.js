
//--------------------------------------------------------------
// Global Configuration

Router.configure({
  //layoutTemplate: 'appLayout',
  yieldTemplates: {
    'navbarHeader': {to: 'header'},
    'navbarFooter': {to: 'footer'}
  }
});


Router.route('/', {
  template: "periodicTablePage",
  name: "periodicTablePage"
});

Router.route('/info', {
  template: "infoPage",
  name: "infoPage"
});


Router.route('/demo', {
  template: "transformsGrid",
  name: "demoRoutes",
  waitOn: function () {
    return Meteor.subscribe('Elements');
  }
});

Router.onBeforeAction(function(){
  $('div#famousScene .famous-dom-renderer').remove();
  this.next();
});
