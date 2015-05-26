/*
var sessionBar = false;
var glassOpacity = 0;
var fooVal = false;

//var expect = require('chai').expect;

module.exports = {
  "Check Session" : function (client) {
    client
      .url("http://localhost:3000/list/foos")
      .resizeWindow(1024, 768)
      .checkSession('glassOpacity', .95, 5000, function(result){
        if(result){
          client.assert.equal(result.value, .95);
        }
      })

      client.end();
  }
};*/
