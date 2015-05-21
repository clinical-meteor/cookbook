exports.command = function(methodName, arguments, timeout, callback) {

    var self = this;
    if (!timeout) {
        timeout = 5000;
    }
    this
        .timeoutsAsyncScript(timeout)
        .executeAsync(function (meteorMethodNameAndArguments, meteorCallback) {
            var meteorMethodName = meteorMethodNameAndArguments[0];
            var meteorArguments = meteorMethodNameAndArguments[1];
            Meteor.apply(meteorMethodName, meteorArguments, function (meteorError, meteorResult) {
                var response = (meteorError ? { error: meteorError } : { result: meteorResult });
                meteorCallback(response);
            });
        }, [[methodName, arguments]], function (response) { // you need to pass an ARRAY of ONE argument, must be a bug
            if (response.value.error) {
                throw 'Meteor apply (call) returned an error: ' + response.value.error;
            } else if (typeof callback === 'function') {
                callback.call(self);
            }
        });

    return this;
};
