// syncrhonous version; only works for checking javascript objects on client
exports.command = function(userId, expectedValue) {
  var client = this;
  this
    .execute(function(data){
      return Meteor.users.findOne({_id: data});
    }, [userId], function(response){
      if (response && response.value && response.value.error) {
          throw 'Meteor apply (call) returned an error: ' + response.value.error;
      } else if (typeof callback === 'function') {
          callback(null, response.value.result)
      }    
    })
    return this;
};
