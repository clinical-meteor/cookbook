// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(){
  console.log("NOTICE:  This is very experimental integration of the meteor-e2e package!  ");
  console.log("NOTICE:  See the following repo for more details about setting it up:");
  console.log("NOTICE:  https://github.com/awatson1978/e2e");

  childProcess.exec("selenium", function(err, stdout, stderr) {
    console.log(stdout);

    childProcess.exec('SOURCE_TESTS_DIR="tests/meteor-e2e" meteor-e2e --local --browsers=firefox', function(err, stdout, stderr) {
      console.log(stdout);
    });

  });
}
