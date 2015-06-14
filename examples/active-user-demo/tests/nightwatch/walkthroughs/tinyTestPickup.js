
var sessionBar = false;
var glassOpacity = 0;
var fooVal = false;

//var expect = require('chai').expect;

module.exports = {
  /*"Execute Return" : function (client) {

    var sessionBar = false;
    client
      .url("http://localhost:3000/list/users")
      .execute(function(data){
        return TEST_STATUS;
      }, [''], function(result){
        client.assert.equal(result.value.DONE, true);
        client.assert.equal(result.value.FAILURES, 0);
      });

      client.end();
  },*/
  "Test Getting Logs" : function (client) {

    client
      .url("http://localhost:3000/list/users")
      .pause(500)
      .reviewMainPanel()
      .getLogTypes()
      /*.getLog('browser', function(logEntriesArray) {
        logEntriesArray.forEach(function(log) {
          console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
        })
      })*/
      .end();
  }
};
