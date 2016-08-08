// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// request allows us to query external websites
var request = require( "request" );

// for _.extend()ing the process.env object
var _ = require( "underscore" );


var runEndToEnd = require( "./frameworks/end-to-end.js" );
var runTinyTests = require( "./frameworks/tinytest.js" );
var runNightwatch = require( "./frameworks/nightwatch.js" );

var runSpaceJam = require( "./frameworks/spacejam.js" );
var runPioneer = require( "./frameworks/pioneer.js" );
var runJasmine = require( "./frameworks/jasmine.js" );
var runCucumber = require( "./frameworks/cucumber.js" );
var runMocha = require( "./frameworks/mocha.js" );

var runEsLinter = require( "./frameworks/lint.js" );

var runTinyTestsInServerConsole = require( "./frameworks/tinytest-on-server-console.js" );
var runMultiFramework = require( "./frameworks/multi-framework.js" );


module.exports = function ( npmPrefix, testType, options ) {
  switch ( testType ) {

    //------------------------------------------------------------------------------------------
  case "end-to-end":
    console.log( "Running end-to-end tests (experimental)..." );
    runEndToEnd();
    break;

    //------------------------------------------------------------------------------------------
  case "nightwatch":
    console.log( "Launching StarryNight.  Analyzing meteor environment..." );
    runNightwatch( npmPrefix, options );
    break;

    //------------------------------------------------------------------------------------------
  case "jasmine":
    console.log( "Launching Jasmine.  Analyzing meteor environment..." );
    runJasmine( npmPrefix );
    break;

    //------------------------------------------------------------------------------------------
  case "spacejam":
    console.log( "Launching SpaceJam.  Analyzing meteor environment..." );
    runSpaceJam();
    break;

    //------------------------------------------------------------------------------------------
  case "mocha":
    console.log( "Launching Mocha.  Analyzing meteor environment..." );
    runMocha( npmPrefix );
    break;

    //------------------------------------------------------------------------------------------
  case "pioneer":
    console.log( "Launching Pioneer.  Analyzing meteor environment..." );
    runPioneer( npmPrefix );
    break;

    //------------------------------------------------------------------------------------------
  case "tinytest":
    console.log( "Running tiny tests on packages.  Check http://localhost:3000" );
    runTinyTests();
    break;

    //------------------------------------------------------------------------------------------
  case "tinytest-ci":
    console.log( "Running tiny tests on packages.  Check http://localhost:3000" );
    runTinyTestsInServerConsole( npmPrefix );
    break;

    //------------------------------------------------------------------------------------------
  case "multi":
    console.log( "Running all non-experimental test frameworks..." );
    runMultiFramework( npmPrefix, options );
    break;

    //==============================================================================================
  case "eslint":
    runEsLinter( options );
    break;


    //------------------------------------------------------------------------------------------
  default:
    console.log( "Didn't recognize that framework.  Please select:" );
    console.log( "> nightwatch" );
    console.log( "> tinytest-ci" );
    break;
  }
};
