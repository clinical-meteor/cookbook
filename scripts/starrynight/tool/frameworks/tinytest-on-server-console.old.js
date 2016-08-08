// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

var spawn = require('child_process').spawn;

module.exports = function(npmPrefix, callback){
  /*childProcess.exec("meteor test-packages --driver-package test-in-console", function(err, stdout, stderr) {
    console.log(stdout);
  });*/

  var tinyTestExitCode = 0;

  var workingDir = process.env.WORKING_DIR || process.env.PACKAGE_DIR || './';
  var args = ['test-packages', '--once', '--driver-package', 'test-in-console', '-p', 10015];


  if (typeof process.env.METEOR_RELEASE !== 'undefined' &&
      process.env.METEOR_RELEASE !== '') {
      args.push('--release');
      args.push(process.env.METEOR_RELEASE);
  }


  if (typeof process.env.PACKAGES === 'undefined') {
    //args.push('./');
  }
  else if (process.env.PACKAGES !== '') {
    args = args.concat(process.env.PACKAGES.split(';'));
  }

  var meteor = spawn((process.env.TEST_COMMAND || 'meteor'), args, {cwd: workingDir});
  meteor.stdout.pipe(process.stdout);
  meteor.stderr.pipe(process.stderr);
  meteor.on('close', function (code) {
    console.log('meteor exited with code ' + code);
    //process.exit(code);
    tinyTestExitCode = 4;
  });

  meteor.stdout.on('data', function startTesting(data) {
    var data = data.toString();
    if(data.match(/10015|test-in-console listening/)) {
      //console.log('starting testing...');
      meteor.stdout.removeListener('data', startTesting);
      runTestSuite();
    }
  });

  function runTestSuite() {
    //console.log("Running test suite.  Spawning PhantomJS...");

    process.env.URL = "http://localhost:10015/"



    var phantomjs = spawn(npmPrefix + '/lib/node_modules/starrynight/node_modules/phantomjs/bin/phantomjs', [npmPrefix + '/lib/node_modules/starrynight/configs/tinytest/phantom_runner.js']);
    //phantomjs.stdout.pipe(process.stdout);
    //phantomjs.stderr.pipe(process.stderr);

    phantomjs.stdout.on('data', function(data){
      var data = data.toString().trim();
      if(!data.match(/##_meteor_magic##state/)) {
        console.log(data);
      }
    });
    phantomjs.on('error', function(error){
      console.error('[StarryNight] ERROR spawning phantomjs.');
      //throw error;
      tinyTestExitCode = 3;
    });
    phantomjs.on('close', function(code) {
      //console.log("Closing meteor...");
      meteor.kill('SIGQUIT');
      //console.log("Exiting phantomjs with code " + code);
      process.exit(code);
    });
  }

  /*if(tinyTestExitCode > 0){
    return callback( new Error('TinyTest didt run and complete all its tasks'), nightwatchExitCode);
  }else{
    return callback( null, 0);
  }*/


}
