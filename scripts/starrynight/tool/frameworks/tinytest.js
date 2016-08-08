// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(){
  childProcess.exec("meteor test-packages --driver-package test-in-console", function(err, stdout, stderr) {
    console.log(stdout);
  });
}
