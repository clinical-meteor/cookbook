Session.setDefault("companyName", "ACME, Inc.");


Template.registerHelper("companyName", function(argument){
  return Session.get("companyName");
});
