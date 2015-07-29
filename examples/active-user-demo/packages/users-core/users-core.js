// Write your package code here!
Template.registerHelper('getRecordSearchFilter', function (argument){
  return Session.get('userSearchFilter');
});
