// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// request allows us to query external websites
var request = require( "request" );

// for _.extend()ing the process.env object
var _ = require( "underscore" );

// so we can read files from the filesystem
var fs = require( "fs-extra" );

// we're going to want to install the chromedriver
//var selenium = require('selenium-standalone');

module.exports = function ( npmPrefix, options, port, autoclose, callback ) {
  if ( options.debug ) {
    console.log( "options", options );
  }

  var nightwatchExitCode = 0;

  if ( !port ) {
    port = 3000;
  }
  if ( !autoclose ) {
    autoclose = true;
  }

  request( "http://localhost:" + port, function ( error, httpResponse ) {
    if ( httpResponse ) {
      console.log( "Detected a meteor instance on port " + port );

      console.log( "Launching nightwatch bridge..." );

      // we need to launch slightly different commands based on the environment we're in
      // specifically, whether we're running locally or on a continuous integration server
      var configFileLocation;
      var nightwatchCommand;

      // set the default nightwatch executable to our starrynight installation
      nightwatchCommand = npmPrefix +
        "/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch";

      // we"d like to use the .meteor/nightwatch.json file if possible
      fs.readJson( ".meteor/nightwatch.json", function ( err, autoConfigObject ) {
        if ( err ) {
          console.log( "[error] .meteor/nightwatch.json not available" );
          console.log( "[error] Try running 'starrynight generate --autoconfig'" );

          configFileLocation = npmPrefix +
            "/lib/node_modules/starrynight/configs/nightwatch/config.json";
        } else {
          console.log( "Found .meteor/nightwatch.json" );
          configFileLocation = ".meteor/nightwatch.json";

          // now that we know our preferred config file
          // lets look for over-rides config files
          if ( process.env.TRAVIS ) {
            nightwatchCommand = npmPrefix + "/lib/node_modules/starrynight/node_modules/nightwatch/bin/nightwatch";
            //configFileLocation = npmPrefix + "/lib/node_modules/starrynight/configs/nightwatch/travis.json";
          } else if ( process.env.NIGHTWATCH_CONFIG_PATH ) {
            configFileLocation = process.env.NIGHTWATCH_CONFIG_PATH;
          } else if ( process.env.FRAMEWORK_CONFIG_PATH ) {
            configFileLocation = process.env.FRAMEWORK_CONFIG_PATH;
          }

          if ( options.debug ) {
            console.log( "configFileLocation", configFileLocation );
          }


          var nightwatchArguments = [];

          if ( options && options.tags ) {
            nightwatchArguments.push( "--tag" );
            nightwatchArguments.push( options.tags );
          }
          if ( options && options.skiptags ) {
            nightwatchArguments.push( "--skiptags" );
            nightwatchArguments.push( options.skiptags );
          }

          if ( options && options.tinytests ) {
            nightwatchArguments.push( "--tag" );
            nightwatchArguments.push( "tinytests" );
          } else {
            nightwatchArguments.push( "--skiptags" );
            nightwatchArguments.push( "tinytests" );
          }

          if ( options && options.test ) {
            nightwatchArguments.push( "--test" );
            nightwatchArguments.push( options.test );
          }
          if ( options && options.verbose ) {
            nightwatchArguments.push( "--verbose" );
            nightwatchArguments.push( options.verbose );
          }
          if ( options && options.group ) {
            nightwatchArguments.push( "--group" );
            nightwatchArguments.push( options.group );
          }
          if ( options && options.filter ) {
            nightwatchArguments.push( "--filter" );
            nightwatchArguments.push( options.filter );
          }
          if ( options && options.env ) {
            nightwatchArguments.push( "--env" );
            nightwatchArguments.push( options.env );
          }
          if ( options && options.testcase ) {
            nightwatchArguments.push( "--testcase" );
            nightwatchArguments.push( options.testcase );
          }
          if ( options && options.config ) {
            nightwatchArguments.push( "-c" );
            nightwatchArguments.push( options.config );
          } else {
            nightwatchArguments.push( "-c" );
            nightwatchArguments.push( configFileLocation );
          }

          var nightwatchEnv = _.extend( process.env, {
            npm_config_prefix: npmPrefix
          } );


          if ( options.debug ) {
            console.log( "npmPrefix:           ", npmPrefix );
            console.log( "nightwatchCommand:   ", nightwatchCommand );
            console.log( "configFileLocation:  ", configFileLocation );
            console.log( "nightwatchArguments: ", nightwatchArguments );
          }


          var nightwatch = childProcess.spawn( nightwatchCommand, nightwatchArguments, {
            env: nightwatchEnv
          } );
          nightwatch.stdout.on( "data", function ( data ) {
            console.log( data.toString().trim() );

            // without this, travis CI won"t report that there are failed tests
            if ( data.toString().indexOf( "✖" ) > -1 ) {
              nightwatchExitCode = 1;
            }
          } );
          nightwatch.stderr.on( "data", function ( data ) {
            console.error( data.toString() );
          } );
          nightwatch.on( "error", function ( error ) {
            console.error(
              "[StarryNight] ERROR spawning nightwatch. nightwatchCommand was",
              nightwatchCommand );
            console.log( "error", error );
            throw error;
          } );
          nightwatch.on( "close", function ( nightwatchExitCode ) {
            if ( nightwatchExitCode === 0 ) {
              console.log( "Finished!  Nightwatch ran all the tests!" );
              if ( autoclose ) {
                process.exit( nightwatchExitCode );
              }
            }
            if ( nightwatchExitCode !== 0 ) {
              console.log( "Nightwatch exited with a code of " + nightwatchExitCode );
              if ( autoclose ) {
                process.exit( nightwatchExitCode );
              }
            }
          } );

        }
      } );
    }
    if ( error ) {
      console.log( "No app is running on http://localhost:" + port +
        ".  Try launching an app with 'meteor run." );
      console.error( error );
      nightwatchExitCode = 2;
      //TODO: exit with error that will halt travis
      process.exit( 1 );
    }
  } );


};
