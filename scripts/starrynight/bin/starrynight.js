#! /usr/bin/env node


var DEBUG = false;

if ( process.env.DEBUG ) {
  DEBUG = true;
}


//==================================================================================================
// REQUIRED IMPORTS


// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// github-download allows us to clone repos into our application
var githubDownload = require( "github-download" );

// minimist lets us cleanly parse our cli arguments into an object
var minimist = require( "minimist" );
//var arguments = require("minimist")(process.argv.slice(2));

// fs-extra lets us recursively copy directories and do advance file management
var fs = require( "fs-extra" );

// file-exists allows us to make sure config files exist
var fileExists = require( "file-exists" );

// http allows us to detect if instances of meteor are running in expected locations
var http = require( "http" );

// request allows us to query external websites
var request = require( "request" );

// replace allows us to refactor contents of file
var replace = require( "replace" );

// so we can find the NODE_PATH
var path = require( "path" );

// fibers and futures allow us to make remote async calls
var Fiber = require( "fibers" );
var Future = require( "fibers/future" );

// so we can get the npm install prefix
var npm = require( "npm" );

// for _.extend()ing the process.env object
var _ = require( "underscore" );

// so we can read files from the filesystem
var filesystem = require( "fs" );

// cheerio provides DOM/jQuery utilities to lets us parse html
var cheerio = require( "cheerio" );

// unzip lets us uncompress files
var unzip = require( "unzip" );

// prompt lets us accept input from the keyboard
// https://www.npmjs.com/package/prompt
var prompt = require( "prompt" );


// for accessing meteor collections
// https://github.com/oortcloud/node-ddp-client
// https://www.npmjs.com/package/ddp
var ddp = require( "ddp" );


//==================================================================================================
// FILE LINKING

var help = require( "../tool/help.js" );
var auditPermissions = require( "../tool/audit-permissions.js" );
var clone = require( "../tool/clone.js" );
var displayEnv = require( "../tool/display-env.js" );
var extractClasses = require( "../tool/extract-classes.js" );
var extractIds = require( "../tool/extract-ids.js" );
var extractTestsFor = require( "../tool/extract-tests-for.js" );
var findAndReplace = require( "../tool/find-and-replace.js" );
var generateTravis = require( "../tool/generate-travis.js" );
var generateCI = require( "../tool/generate-ci.js" );
var pattern = require( "../tool/pattern.js" );
var refactor = require( "../tool/refactor.js" );
var rename = require( "../tool/rename.js" );
var sample = require( "../tool/sample.js" );
var scaffold = require( "../tool/scaffold.js" );
var generateReleaseJson = require( "../tool/generate-release-json.js" );
var extractTools = require( "../tool/extract-tools.js" );
var downloadTools = require( "../tool/download-tools.js" );

var createPackage = require( "../tool/create.js" );
var publishPackage = require( "../tool/publish.js" );

var generateGitRepoList = require("../tool/generate-git-repo-list.js");

// deprecated APIs
var runFramework = require( "../tool/run-framework.js" );
var runTests = require( "../tool/run-tests.js" );

var locateFireFox = require( "../tool/locate-firefox.js" );

var findTestDirs = require( "../tool/find-test-dirs.js" );

var generateAutoConfig = require( "../tool/generate-autoconfig.js" );

var compactFiles = require( "../tool/compact.js" );

var generateLinters = require( "../tool/generate-linters.js" );

var generateFiles = require( "../tool/generate.js" );

var fetchPackages = require("../tool/fetch.js");

//==================================================================================================
// DEBUGGING

if ( process.env.DEBUG ) {
  console.dir( process.argv );
  console.log( "arg0: ", process.argv[ 0 ] );
  console.log( "arg1: ", process.argv[ 1 ] );
  console.log( "arg2: ", process.argv[ 2 ] );
  console.log( "arg3: ", process.argv[ 3 ] );

  console.log( "STARRYNIGHT_FRAMEWORK:         " + process.env.STARRYNIGHT_FRAMEWORK );
  console.log( "STARRYNIGHT_FRAMEWORK_CONFIG:  " + process.env.STARRYNIGHT_FRAMEWORK_CONFIG );
}



//**************************************************************************************************
// VARIABLES

var isReadyToRun = true;


//**************************************************************************************************
// PROCESSING COMMAND LINE ARGUMENTS

// most of StarySky uses a two argument syntax
var firstArgument = ( process.argv[ 2 ] || "" );
var secondArgument = ( process.argv[ 3 ] || "" );
var thirdArgument = ( process.argv[ 4 ] || "" );
var fourthArgument = ( process.argv[ 5 ] || "" );
var fifthArgument = ( process.argv[ 5 ] || "" );

// otherwise we'll want to pass in all of the arguments
var options = minimist( process.argv );

DEBUG && console.log( options );

if ( options.help ) {
  help();
  process.exit( 0 );
}


npm.load( function ( error, npm ) {
  if ( error ) {
    throw error;
  }
  var npmPrefix = npm.config.get( "prefix" );

  DEBUG && console.log( "npm prefix is", npmPrefix );

  // Check to see if the use has supplied a filter.
  switch ( firstArgument ) {

    //==============================================================================================
  case "":
    console.log( "" );
    console.log( "Welcome to the StarryNight." );
    console.log( "Use --help for more info." );
    break;


    //==============================================================================================
  case "scaffold":
    scaffold( npmPrefix, process.argv, options );
    break;


    //==============================================================================================
  case "sample":
    console.log( "StarryNight is initializing some default tests in your app..." );
    sample( npmPrefix, secondArgument, thirdArgument );
    break;


    //==============================================================================================
    // -initialize is simply an alias for -sample

  case "initialize":
    console.log( "StarryNight is initializing some default tests in your app..." );
    sample( npmPrefix, secondArgument, thirdArgument );
    break;


    //==============================================================================================
  case "run-tests":
    checkIfInAppRoot();
    runTests( npmPrefix, secondArgument, options );
    break;


    //==============================================================================================
  case "survey":
    runTests( npmPrefix, secondArgument );
    break;


    //==============================================================================================
  case "run-framework":
    checkIfInAppRoot();
    runFramework( npmPrefix, secondArgument, options );
    break;


    //==============================================================================================
    /*case "nightwatch":
      runTests(npmPrefix, secondArgument);
    break;*/


    //==============================================================================================
  case "create":
    // starrynight create --package foo:mypackage --from /path/to/component
    createPackage( options );
    break;

    //==============================================================================================
    // starrynight publish --bulk
  case "publish":
    publishPackage( npmPrefix, process.argv, options );
    break;

    //==============================================================================================
    // starrynight clone http://www.github.com/myaccount/myrepo
    // TODO: starrynight clone --url starrynight clone http://www.github.com/myaccount/myrepo

  case "clone":
    clone( secondArgument );
    auditPermissions();
    break;


    //==============================================================================================
    // -pattern is similar to -clone, but assumes that the target url implements a  boilerplate
    // it then goes into the boilerplate, and copies files into appropriate locations
    // and avoids copying over package and repo specific files
    // in other words, it's a 'smart clone'

  case "pattern":
    checkIfInAppRoot();
    pattern( options );
    break;


    //==============================================================================================
  case "rename":
    // rename --from <originalTerm> --to <newTerm> -root <directoryRoot>
    auditPermissions();
    rename( options );
    break;


    //==============================================================================================
  case "find-and-replace":
    // find-and-replace --from <originalTerm> --to <newTerm> -root <directoryRoot>

    checkIfInAppRoot();
    auditPermissions();
    findAndReplace( options );
    break;


    //==============================================================================================
  case "refactor":
    // starrynight -refactor foo bar app/components
    // starrynight -refactor originalTerm newTerm directoryRoot
    // starrynight -refactor secondArgument thirdArgument fourthArgument

    checkIfInAppRoot();
    auditPermissions();
    findAndReplace( options );
    auditPermissions();
    rename( options );
    /*refactor(secondArgument, thirdArgument, fourthArgument);*/
    break;


    //==============================================================================================
  case "audit-permissions":
    checkIfInAppRoot();
    auditPermissions();
    break;


    /*//============================================================================================
    case "help":
      help();
    break;*/


    //==============================================================================================
  case "display-env":
    displayEnv(options);
    break;


    //==============================================================================================
  case "download-tools":
    downloadTools();
    break;


    //==============================================================================================
  case "extract-tools":
    extractTools();
    break;


    //==============================================================================================
  case "extract-ids":
    checkIfInAppRoot();
    extractIds( secondArgument );
    break;


    //==============================================================================================
  case "extract-classes":
    checkIfInAppRoot();
    extractClasses( secondArgument );
    break;


    //==============================================================================================
  case "extract-tests-for":
    extractTestsFor( secondArgument );
    break;




    //==============================================================================================
  case "locate-firefox":
    locateFireFox();
    break;

    //==============================================================================================
  case "find-test-dirs":
    findTestDirs( options );
    break;

    //==============================================================================================
  case "generate-release-json":
    generateReleaseJson( npmPrefix, options );
    break;

    //==============================================================================================
  case "generate-autoconfig":
    checkIfInAppRoot();
    generateAutoConfig( npmPrefix, options );
    break;

    //==============================================================================================
  case "autoconfig":
    checkIfInAppRoot();
    generateAutoConfig( npmPrefix, options );
    break;

    //==============================================================================================
  case "generate-linters":
    checkIfInAppRoot();
    generateLinters( npmPrefix, options );
    break;

    //==============================================================================================
  case "generate-ci":
    //auditPermissions();
    generateCI( npmPrefix, process.argv, options );
    break;

    //==============================================================================================
  case "generate-travis":
    //auditPermissions();
    generateTravis( npmPrefix );
    break;


    //==============================================================================================
  case "generate":
    generateFiles( npmPrefix, options, process.argv );
    break;


    //==============================================================================================
  case "compact":
    compactFiles( options );
    break;

    //==============================================================================================
  case "generate-repolist":
    generateGitRepoList( options );
    break;

    //==============================================================================================
  case "fetch":
    fetchPackages( npmPrefix, options );
    break;

  //==============================================================================================
  case "version":
    console.log("We should figure out how to access the package.json file...");
    break;


    //==============================================================================================
    // If we can't figure out what the command-line argument was, then something is incorrect. Exit.
  default:
    console.log( "Didn't understand that command.  Use --help for information." );

    // Exit out of the process (as a failure).
    process.exit( 1 );
    break;

  }
} );



//**************************************************************************************************
// HELPER FUNCTIONS

checkIfInAppRoot = function () {
  console.log( "This command should be run in the root of an application." );
};
