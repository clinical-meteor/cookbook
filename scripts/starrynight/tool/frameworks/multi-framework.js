// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

var spawn = require('child_process').spawn;

// request allows us to query external websites
var request = require('request');

// for _.extend()ing the process.env object
var _ = require('underscore');

// import our nightwatch framework
var runNightwatch = require('./nightwatch.js');


module.exports = function(npmPrefix, options, callback){
  console.log("multiFramework::options", options);


  multiFrameworkExitCode = 0;

  var workingDir = process.env.WORKING_DIR || process.env.PACKAGE_DIR || './';
  var tinyTestArgs = ['test-packages', '--once', '--driver-package', 'test-in-console', '-p', 3300];

  console.log("Detecting release version...");
  if (typeof process.env.METEOR_RELEASE !== 'undefined' &&
      process.env.METEOR_RELEASE !== '') {
      tinyTestArgs.push('--release');
      tinyTestArgs.push(process.env.METEOR_RELEASE);
  }

  console.log("Spawning Meteor instance on port 3300 for Package Verification testing using TinyTest...");
  var meteor = spawn((process.env.TEST_COMMAND || 'meteor'), tinyTestArgs, {cwd: workingDir});
  meteor.stdout.pipe(process.stdout);
  meteor.stderr.pipe(process.stderr);

  meteor.on('close', function (code) {
    console.log('Package Verification Testing exited with code ' + code);

    // if we get anything other than a success, mark our overall exit code falsy
    if(code != 0){
      multiFrameworkExitCode = code;
    }

    //================================================================================================
    var validationTestinArgs = ['run', '-p', 3000];

    console.log("Spawning new Meteor instance on port 3000 for Client Validation testing...");
    var validationTestingInstance = spawn((process.env.TEST_COMMAND || 'meteor'), validationTestinArgs, {cwd: workingDir});
    validationTestingInstance.stdout.pipe(process.stdout);
    validationTestingInstance.stderr.pipe(process.stderr);

    validationTestingInstance.on('close', function (code) {
      console.log('Client Validation Testing exited with code ' + code);

      // if we get anything other than a success, mark our overall exit code falsy
      if(code != 0){
        multiFrameworkExitCode = code;
      }

      process.exit(multiFrameworkExitCode);
    });
    validationTestingInstance.stdout.on('data', function startTesting(data) {
      var data = data.toString();
      //if(data.match(/3000|test-in-console listening/)) {
        //console.log('starting testing...');
        //meteor.stdout.removeListener('data', startTesting);

        runNightwatch(npmPrefix, options, 3000, false);
      //}
    });

    //process.exit(multiFrameworkExitCode);
  });


  meteor.stdout.on('data', function startTesting(data) {
    var data = data.toString();
    if(data.match(/3300|test-in-console listening/)) {
      //console.log('starting testing...');
      //meteor.stdout.removeListener('data', startTesting);

      // Magic Sauce:  We're Going to Overload Our Options
      options.tinytests = true;
      runNightwatch(npmPrefix, options, 3300, false);
    }
  });





}
