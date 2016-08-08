// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(npmPrefix){
  var testCommand = "mocha";

  var mochaExitCode = 0;

  var mochaCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/mocha/bin/mocha';


  var mocha = childProcess.spawn(mochaCommand);

  mocha.stdout.on('data', function(data){
    console.log(data.toString().trim());
  });
  mocha.stderr.on('data', function(data) {
    console.error(data.toString());
  });
  mocha.on('error', function(error){
    console.error('[StarryNight] ERROR spawning mocha.');
    throw error;
  });
  mocha.on('close', function(mochaExitCode){
    if(mochaExitCode === 0){
      console.log('Finished!  Mocha ran all the tests!');
        process.exit(mochaExitCode);
    }
    if(mochaExitCode !== 0){
      console.log('Mocha exited with a code of ' + mochaExitCode);
      process.exit(mochaExitCode);
    }
  });
};
