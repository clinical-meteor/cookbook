Meteor.publish("foo", function(userId){
  if(userId){
    return Foo.findOne({_id:userId});
  }else{
    return Foo.find();
  }
});
Meteor.publish("allFoos", function(userId){
  return Foo.find();
});
