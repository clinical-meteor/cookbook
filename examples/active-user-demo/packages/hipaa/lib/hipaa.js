Hipaa = {
  configure: function(options){
    if(Meteor.isClient){
      if(options.company){
        Session.set("companyName", options.company);
      }
    }
  }
}
