
var sessionBar = false;
var glassOpacity = 0;
var fooVal = false;

//var expect = require('chai').expect;

module.exports = {
  "Execute Return" : function (client) {

    var sessionBar = false;
    client
      .url("http://localhost:3000/list/foos")
      .execute(function(data){
        return Session.get('glassOpacity');
      }, [''], function(result){
        client.assert.equal(result.value, .95);
      });

      client.end();
  },
  "Execute Async" : function (client) {
    client
      .url("http://localhost:3000/list/foos")
      .executeAsync(function(data, callback){
        setTimeout(function(){
          callback(Session.get('glassOpacity'));
        }, 500);
      }, [''], function(result){
        client.assert.equal(result.value, .95);
      })

      client.end();
  }
};
