exports.command = function(methodName, arguments, callback) {

    var self = this;
    this
      .timeoutsAsyncScript(5000)
      .executeAsync(function (meteorMethodNameAndArguments, meteorCallback) {
          var meteorMethodName = meteorMethodNameAndArguments[0];
          var meteorArguments = meteorMethodNameAndArguments[1];
          Meteor.call(meteorMethodName, meteorArguments, function (meteorError, meteorResult) {
              var response = (meteorError ? { error: meteorError } : { result: meteorResult });
              meteorCallback(response);
          });
      }, [[methodName, arguments]], function (response) { // you need to pass an ARRAY of ONE argument, must be a bug          
          if (response && response.value && response.value.error) {
              throw 'Meteor apply (call) returned an error: ' + response.value.error;
          } else if (typeof callback === 'function') {
              callback(null, response.value.result)
          }
      });

    return this;
};
