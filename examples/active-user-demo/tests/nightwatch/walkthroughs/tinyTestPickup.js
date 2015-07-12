
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

      client.endd();
  },*/
  tags: ['users', 'tinytests'],
  "Test Getting Logs" : function (client) {

    client
      .url("http://localhost:3300")
      .verify.elementPresent('body')
      .getLogTypes()
      .getLog('browser', function(logEntriesArray) {
        logEntriesArray.forEach(function(log) {
          if(log.level == "INFO"){
            console.log(log.message);
          }
        })
      })
      .end();
  }
};
