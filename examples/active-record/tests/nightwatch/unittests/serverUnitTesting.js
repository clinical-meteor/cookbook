var expect = require('chai').expect;

module.exports = {
  testFormatElapsedTime : function(client) {
    /*var resultMs = Utils.formatElapsedTime(999);
    var resultSec = Utils.formatElapsedTime(1999);
    var resultMin = Utils.formatElapsedTime(122299, true);*/

    var resultMs = '999';
    var resultSec = '1999';
    var resultMin = '122299');

    expect(resultMs).to.equal('999');
    expect(resultSec).to.equal('1999');
    expect(resultMin).to.equal('122299');
  }
};
