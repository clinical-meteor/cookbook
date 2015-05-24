Meteor.publish("plant", function(recordId){
  if(recordId){
    return Plants.findOne({_id:recordId});
  }else{
    return Plants.find();
  }
});

Meteor.publish("allPlants", function(recordId){
  return Plants.find();    
});
