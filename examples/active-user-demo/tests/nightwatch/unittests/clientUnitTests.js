
module.exports = {
  'unittests/clientUnitTests.js' : function (client, done) {
    client.assert.ok('TEST');

    setTimeout(function() {
      done();
    }, 500);
  }
};
