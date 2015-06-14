
var sessionBar = false;
var glassOpacity = 0;
var fooVal = false;

//var expect = require('chai').expect;

module.exports = {
  "Check Session" : function (client) {

    var sessionBar = false;
    client
      .url("http://localhost:3000/list/users")
      .checkSession("glassOpacity", .95)
      .end();
  },
  "Check Methods" : function (client) {

    var sessionBar = false;
    client
      .url("http://localhost:3000/list/users")
      .meteorCall("testMethod", false, function(error, result){
        client.assert.equal(result, "abc");
      })
      .meteorCall("testMethodWithInput", 3, function(error, result){
        client.assert.equal(result, 6);
      })
      .end();
  }
};
