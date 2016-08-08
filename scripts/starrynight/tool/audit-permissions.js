// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(){
  console.log("Fixing permissions in .meteor directory.");
  childProcess.exec("chmod -R 755 .meteor", function(err, stdout, stderr) {
    console.log(stdout);
  });
  childProcess.exec("chmod -R 755 .", function(err, stdout, stderr) {
    console.log(stdout);
  });
}
