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
  if(options.debug){
    console.log("tinytest-ci::options", options);
  }

  multiFrameworkExitCode = 0;

  var workingDir = process.env.WORKING_DIR || process.env.PACKAGE_DIR || './';
  var tinyTestArgs = ['test-packages', '--once', '--driver-package', 'test-in-console', '-p', 3300];

  console.log("Detecting release version...");
  if (typeof process.env.METEOR_RELEASE !== 'undefined' && process.env.METEOR_RELEASE !== '') {
      tinyTestArgs.push('--release');
      tinyTestArgs.push(process.env.METEOR_RELEASE);
  }

  console.log("Spawning Meteor instance on port 3300 for Package Verification testing using TinyTest...");
  var meteor = spawn((process.env.TEST_COMMAND || 'meteor'), tinyTestArgs, {cwd: workingDir});
  meteor.stdout.pipe(process.stdout);
  meteor.stderr.pipe(process.stderr);

  meteor.stdout.on('data', function startTesting(data) {
    var data = data.toString();
    if(options.trace){
      console.log("[meteor:3300]", data);

    }
    if(data.match(/3300|test-in-console listening/)) {
      if(options.debug){
        console.log('Detected test-in-console data stream...');
      }
      //meteor.stdout.removeListener('data', startTesting);

      // Magic Sauce:  We're Going to Overload Our Options
      options.tinytests = true;
      runNightwatch(npmPrefix, options, 3300, false);
    }
  });
  meteor.on('exit', function (code) {
    console.log('Package Verification Testing exited with code ' + code);
    //process.exit(code);
  });





}
