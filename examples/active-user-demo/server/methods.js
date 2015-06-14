Meteor.methods({
  testMethod:function(){
     return "abc";
  },
  testMethodWithInput:function(value){
     return value * 2;
  },
  addUser: function(userOptions){
    console.log("Adding User", userOptions);

    var userId = Accounts.createUser(userOptions);
    console.log("userId", userId);

    Accounts.sendEnrollmentEmail(userId);
    return userId;
  },
  updateEmail: function(options){
    return Meteor.users.update({_id: options.userId}, {$set: {
      'emails.0.address': options.email
    }});
  }
});
