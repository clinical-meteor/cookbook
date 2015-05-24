(function(){Meteor.publish("Elements", function(elementsId){
  if(elementsId){
    return Elements.findOne({_id:elementsId});
  }else{
    return Elements.find();    
  }
});

})();
