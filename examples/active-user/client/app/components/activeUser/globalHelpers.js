Template.registerHelper("getRecordSearchFilter", function(argument){
  return Session.get("userSearchFilter");
});
