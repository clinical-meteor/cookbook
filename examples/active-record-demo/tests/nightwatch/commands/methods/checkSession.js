exports.command = function(sessionName, expectedValue, timeout, callback) {

    var self = this;
    if (!timeout) {
        timeout = 5000;
    }

    var glassOpacity = false;

    this
      .timeoutsAsyncScript(timeout)
        .executeAsync(function (data, callback) {
            return Session.get('glassOpacity');
        }, [''], function (response) { // you need to pass an ARRAY of ONE argument, must be a bug
            if (response.value.error) {
                throw 'Meteor apply (call) returned an error: ' + response.value.error;
            } else if (typeof callback === 'function') {
              callback.call(self);
            }
        })

    //this.assert.equal(glassOpacity, .95);

    return this;
};
