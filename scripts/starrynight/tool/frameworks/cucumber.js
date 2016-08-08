// child_process lets us exec and spawn external commands
var childProcess = require('child_process');

var fs = require('fs');

module.exports = function (npmPrefix) {
  var configOption = '';

  console.log('Launching cucumber...');

  // cucumber tests go in a /features directory
  // or, at least, cucumber looks for a /features directory when it starts up

  if (fs.exists('/features')) {
    var cucumberCommand = npmPrefix +
      '/lib/node_modules/starrynight/node_modules/cucumber/bin/cucumber';
    console.log('cucumberCommand', cucumberCommand);

    if (process.env.PIONEER_CONFIG_PATH) {
      configOption = '--configPath=' + process.env.PIONEER_CONFIG_PATH;
    } else if (process.env.FRAMEWORK_CONFIG_PATH) {
      configOption = '--configPath=' + process.env.FRAMEWORK_CONFIG_PATH;
    }

    var cucumberExitCode = 0;

    var cucumber = childProcess.spawn(cucumberCommand, ['--preventReload=true', configOption]);
    cucumber.stdout.on('data', function (data) {
      console.log(data.toString()
        .trim());
    });
    cucumber.stderr.on('data', function (data) {
      console.error(data.toString());
    });
    cucumber.on('error', function (error) {
      console.error('[StarryNight] ERROR spawning cucumber.');
      throw error;
    });
    cucumber.on('close', function (cucumberExitCode) {
      if (cucumberExitCode === 0) {
        console.log('Finished!  Cucumber ran all the tests!');
        process.exit(cucumberExitCode);
      }
      if (cucumberExitCode !== 0) {
        console.log('Cucumber exited with a code of ' + cucumberExitCode);
        process.exit(cucumberExitCode);
      }
    });
  } else {
    /*console.log('No /features directory.  Try running "starrynight scaffold cucumber"');*/
    console.log('No /features directory.  Need to add tests for framework."');
  }

}
