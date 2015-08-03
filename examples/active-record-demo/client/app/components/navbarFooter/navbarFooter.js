Template.navbarFooter.events({
  "click #homeBtn": function (event, template) {
    Router.go('/');
  },
  "click #listBtn": function (event, template) {
    Router.go('/list/foos');
  },
  "click #imageGridBtn": function (event, template) {
    Router.go('/grid/foos');
  },
  "click #tableBtn": function (event, template) {
    Router.go('/table/foos');
  },
  "click #newBtn": function (event, template) {
    Router.go('/new/foo');
  },
  "click #initializeBtn": function (event, template) {
    console.log('initializing database');
  },
  "click #dropBtn": function (event, template) {
    console.log('dropping database');
    Meteor.call('dropDatabase');
  }
});

Template.navbarFooter.helpers({
  rendered: function () {

  }
});
