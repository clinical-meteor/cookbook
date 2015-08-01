// Write your package code here!
Session.setDefault("colorA", "");
Session.setDefault("colorB", "");
Session.setDefault("colorC", "");
Session.setDefault("colorD", "");
Session.setDefault("colorE", "");


Template.registerHelper("colorA", function (argument) {
  return "color: " + Session.get('colorA') + ";";
});
Template.registerHelper("colorB", function (argument) {
  return "color: " + Session.get('colorB') + ";";
});
Template.registerHelper("colorC", function (argument) {
  return "color: " + Session.get('colorC') + ";";
});
Template.registerHelper("colorD", function (argument) {
  return "color: " + Session.get('colorD') + ";";
});
Template.registerHelper("colorE", function (argument) {
  return "color: " + Session.get('colorE') + ";";
});


Template.registerHelper("backgroundA", function (argument) {
  return "background-color: " + Session.get('colorA') + ";";
});
Template.registerHelper("backgroundB", function (argument) {
  return "background-color: " + Session.get('colorB') + ";";
});
Template.registerHelper("backgroundC", function (argument) {
  return "background-color: " + Session.get('colorC') + ";";
});
Template.registerHelper("backgroundD", function (argument) {
  return "background-color: " + Session.get('colorD') + ";";
});
Template.registerHelper("backgroundE", function (argument) {
  return "background-color: " + Session.get('colorE') + ";";
});
