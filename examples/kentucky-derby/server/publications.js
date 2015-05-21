Meteor.publish("foo", function(recordId){
  if(recordId){
    return Foo.findOne({_id:recordId});
  }else{
    return Foo.find();    
  }
});
