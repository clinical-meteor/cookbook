// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

var fs = require('fs');

module.exports = function(npmPrefix){
  var configOption = "";

  console.log("Launching pioneer...");

  // pioneer tests go in a /features directory
  // or, at least, pioneer looks for a /features directory when it starts up

  if(fs.exists('/features')){
    var pioneerCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/pioneer/bin/pioneer';
    console.log("pioneerCommand", pioneerCommand);


    if(process.env.PIONEER_CONFIG_PATH){
      configOption = "--configPath=" + process.env.PIONEER_CONFIG_PATH;
    }else if(process.env.FRAMEWORK_CONFIG_PATH){
      configOption = "--configPath=" + process.env.FRAMEWORK_CONFIG_PATH;
    }

    var pioneerExitCode = 0;

    var pioneer = childProcess.spawn(pioneerCommand, ['--preventReload=true', configOption]);
    pioneer.stdout.on('data', function(data){
      console.log(data.toString().trim());
    });
    pioneer.stderr.on('data', function(data) {
      console.error(data.toString());
    });
    pioneer.on('error', function(error){
      console.error('[StarryNight] ERROR spawning pioneer.');
      throw error;
    });
    pioneer.on('close', function(pioneerExitCode){
      if(pioneerExitCode === 0){
        console.log('Finished!  Pioneer ran all the tests!');
          process.exit(pioneerExitCode);
      }
      if(pioneerExitCode !== 0){
        console.log('Pioneer exited with a code of ' + pioneerExitCode);
        process.exit(pioneerExitCode);
      }
    });
  }else{
    /*console.log('No /features directory.  Try running "starrynight scaffold pioneer"');*/
    console.log('No /features directory.  Need to add tests for framework."');
  }


}
