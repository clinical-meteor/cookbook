(function(){
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
  template: "singleTileDemo",
  name: "singleTileDemo"
});

})();
