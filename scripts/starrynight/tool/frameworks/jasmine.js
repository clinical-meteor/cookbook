// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

var fs = require('fs');

module.exports = function(npmPrefix){
  var configOption = "";


  if(fs.exists('/spec/support/jasmine.json')){
    var jasmineCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/jasmine/bin/jasmine.js';


    if(process.env.JASMINE_CONFIG_PATH){
      configOption = "JASMINE_CONFIG_PATH=" + process.env.JASMINE_CONFIG_PATH;
    }else if(process.env.FRAMEWORK_CONFIG_PATH){
      configOption = "JASMINE_CONFIG_PATH=" + process.env.FRAMEWORK_CONFIG_PATH;
    }

    console.log("configOption", configOption);


    var jasmineExitCode = 0;

    var jasmine = childProcess.spawn(jasmineCommand, [configOption]);
    jasmine.stdout.on('data', function(data){
      console.log(data.toString().trim());

      // without this, travis CI won't report that there are failed tests
      if(data.toString().indexOf("FAILED") > -1){
        jasmineExitCode = 1;
      }
    });
    jasmine.stderr.on('data', function(data) {
      console.error(data.toString());
    });
    jasmine.on('error', function(error){
      console.error('[StarryNight] ERROR spawning jasmine.');
      throw error;
    });
    jasmine.on('close', function(jasmineExitCode){
      if(jasmineExitCode === 0){
        console.log('Finished!  Jasmine ran all the tests!');
          process.exit(jasmineExitCode);
      }
      if(jasmineExitCode !== 0){
        console.log('Jasmine exited with a code of ' + jasmineExitCode);
        process.exit(jasmineExitCode);
      }
    });
  }else{
    console.log("Can't find spec/support/jasmine.json");

  }

}
