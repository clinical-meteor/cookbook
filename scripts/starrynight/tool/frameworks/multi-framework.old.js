// child_process lets us exec and spawn external commands
var childProcess = require("child_process");

var spawn = require('child_process').spawn;

// request allows us to query external websites
var request = require('request');

// for _.extend()ing the process.env object
var _ = require('underscore');

// import our nightwatch framework
var runNightwatch = require('./nightwatch.js');


module.exports = function (npmPrefix, options, callback) {

  multiFrameworkExitCode = 0;

  var workingDir = process.env.WORKING_DIR || process.env.PACKAGE_DIR || './';
  var tinyTestArgs = ['test-packages', '--once', '--driver-package', 'test-in-console', '-p',
    3000];


  if (typeof process.env.METEOR_RELEASE !== 'undefined' &&
    process.env.METEOR_RELEASE !== '') {
    tinyTestArgs.push('--release');
    tinyTestArgs.push(process.env.METEOR_RELEASE);
  }


  /*if (typeof process.env.PACKAGES === 'undefined') {
    //tinyTestArgs.push('./');
  }
  else if (process.env.PACKAGES !== '') {
    tinyTestArgs = tinyTestArgs.concat(process.env.PACKAGES.split(';'));
  }*/

  var meteor = spawn((process.env.TEST_COMMAND || 'meteor'), tinyTestArgs, {
    cwd: workingDir
  });
  meteor.stdout.pipe(process.stdout);
  meteor.stderr.pipe(process.stderr);
  meteor.on('close', function (code) {
    console.log('meteor exited with code ' + code);
    process.exit(code);
  });

  meteor.stdout.on('data', function startTesting(data) {
    var data = data.toString();
    if (data.match(/10015|test-in-console listening/)) {
      //console.log('starting testing...');
      meteor.stdout.removeListener('data', startTesting);
      //runTestSuite();

      // Magic Sauce:  We're Going to Overload Our Options
      options.tinytests = true;
      runNightwatch(npmPrefix, options);
    }
  });

  /*function runTestSuite() {

    process.env.URL = "http://localhost:10015/"


    var phantomjs = spawn(npmPrefix + '/lib/node_modules/starrynight/node_modules/phantomjs/bin/phantomjs', [npmPrefix + '/lib/node_modules/starrynight/configs/tinytest/phantom_runner.js']);

    phantomjs.stdout.on('data', function startTesting(data){
      var data = data.toString().trim();

      console.log(data);
      if(data.match(/##_meteor_magic##state/)) {
        process.exit(multiFrameworkExitCode);
      }
    });
    phantomjs.on('error', function(error){
      console.error('[StarryNight] ERROR spawning phantomjs.');
      throw error;
    });
    phantomjs.on('close', function(code) {
      console.log("Closing meteor...");
      meteor.kill('SIGQUIT');
      console.log("Exiting phantomjs with code " + code);
      process.exit(code);
    });
  }*/

  //================================================================================================


  var nightwatchExitCode = 0;

  var nightwatchArgs = ['-p', 3000];
  if (typeof process.env.METEOR_RELEASE !== 'undefined' &&
    process.env.METEOR_RELEASE !== '') {
    nightwatchArgs.push('--release');
    nightwatchArgs.push(process.env.METEOR_RELEASE);
  }

  var meteor = spawn((process.env.TEST_COMMAND || 'meteor'), nightwatchArgs, {
    cwd: workingDir
  });
  meteor.stdout.pipe(process.stdout);
  meteor.stderr.pipe(process.stderr);

  meteor.stdout.on('data', function startTesting(data) {
    var data = data.toString();
    console.log('starting testing...');
    meteor.stdout.removeListener('data', startTesting);

    request("http://localhost:3000", function (error, httpResponse) {
      if (httpResponse) {
        console.log("Detected a meteor instance...");

        console.log("Launching nightwatch bridge...");

        // we need to launch slightly different commands based on the environment we're in
        // specifically, whether we're running locally or on a continuous integration server
        var configFileLocation;
        var nightwatchCommand;


        // set the default nightwatch executable to our starrynight installation
        nightwatchCommand = npmPrefix +
          '/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch';

        //console.log("[framekworks/nightwatch]nightwatchCommand: " + nightwatchCommand);


        // Travis has a very customizezd setup, and so lets update the location of the executable
        // as well as the location of the config file
        // if we're not on travis or a continuous-integration provider
        // lets see if we have a nightwatch specific config file specified
        // otherwise lets look to see if the user specified something with the -config flag
        // if none of our custom locations have a specific config info to use,
        // lets use the default config that's shipped with starrynight

        if (process.env.TRAVIS) {
          nightwatchCommand = npmPrefix +
            '/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch';
          configFileLocation = npmPrefix +
            '/lib/node_modules/starrynight/configs/nightwatch/travis.json';
        } else if (process.env.NIGHTWATCH_CONFIG_PATH) {
          configFileLocation = process.env.NIGHTWATCH_CONFIG_PATH;
        } else if (process.env.FRAMEWORK_CONFIG_PATH) {
          configFileLocation = process.env.FRAMEWORK_CONFIG_PATH;
        } else {
          configFileLocation = npmPrefix +
            '/lib/node_modules/starrynight/configs/nightwatch/config.json';
        }

        var nightwatchEnv = _.extend(process.env, {
          npm_config_prefix: npmPrefix
        });

        var nightwatch = childProcess.spawn(nightwatchCommand, ['-c', configFileLocation], {
          env: nightwatchEnv
        });
        nightwatch.stdout.on('data', function (data) {
          console.log(data.toString().trim());

          // without this, travis CI won't report that there are failed tests
          if (data.toString().indexOf("✖") > -1) {
            nightwatchExitCode = 1;
          }
        });
        nightwatch.stderr.on('data', function (data) {
          console.error(data.toString());
        });
        nightwatch.on('error', function (error) {
          console.error(
            '[StarryNight] ERROR spawning nightwatch. nightwatchCommand was',
            nightwatchCommand);
          throw error;
        });
        nightwatch.on('close', function (nightwatchExitCode) {
          if (nightwatchExitCode === 0) {
            console.log('Finished!  Nightwatch ran all the tests!');
            console.log("");

            //process.exit(nightwatchExitCode);
          }
          if (nightwatchExitCode !== 0) {
            console.log('Nightwatch exited with a code of ' + nightwatchExitCode);
            //process.exit(nightwatchExitCode);
          }
        });

      }
      if (error) {
        console.log(
          "No app is running on http://localhost:10015.  Try launching an app with 'meteor run'."
        );
        console.error(error);
        nightwatchExitCode = 2;
        //TODO: exit with error that will halt travis
        process.exit(1);
      }
    });
  });
  meteor.on('close', function (code) {
    console.log('meteor exited with code ' + code);
    process.exit(code);
  });



}
