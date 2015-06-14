Meteor.publish("allUsers", function(userId){
  if(userId){
    return Meteor.users.findOne({_id:userId});
  }else{
    return Meteor.users.find();
  }
});
