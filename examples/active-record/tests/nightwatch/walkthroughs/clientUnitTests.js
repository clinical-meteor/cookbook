/*
module.exports = {
  'walkthroughs/clientUnitTests.js' : function (client, done) {

    var sessionValue = false;
    client
      .execute(function(data, callback){
        return Session.get('glassOpacity');
      }, [''], function(result){
        //alert(result);
        console.log("result", result);

        client.verify.ok(result);
        client.verify.equal(result, .95);
      })

      client.end();

  }
};*/
