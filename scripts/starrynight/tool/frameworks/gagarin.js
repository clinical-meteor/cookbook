// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );
var chromedriver = require( "chromedriver" );
var _ = require( "underscore" );
var fs = require( "fs-extra" );
var path = require( "path" );

module.exports = function(npmPrefix, options){
  var testCommand = "gagarin";

  var gagarinExitCode = 0;

  var gagarinCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/gagarin/bin/gagarin';


  var gagarinArguments = [];

  if ( options && options.port ) {
    gagarinArguments.push( "--port" );
    gagarinArguments.push( options.port );
  }
  if ( options && options.webdriver ) {
    gagarinArguments.push( "--webdriver" );
    gagarinArguments.push( options.webdriver );
  }
  if ( options && options.verbose ) {
    gagarinArguments.push( "--verbose" );
  }
  if ( options && options.path ) {
    if (options.debug) {
      console.log('process.env.pwd + options.path', process.env.PWD + options.path);
    }
    gagarinArguments.push( path.join( process.env.PWD, options.path ) );
  }

  if (options && options.runfrom) {
    console.log('options.runfrom', options.runfrom);
    console.log('process.env.PWD', process.env.PWD);
    console.log('process.env.cwd', process.env.cwd);
  }

  var gagarinEnv = _.extend( process.env, {
    npm_config_prefix: npmPrefix
  });

  if ( options.debug ) {
    console.log( "gagarinEnv:          ", gagarinEnv );
    console.log( "gagarinCommand:      ", gagarinCommand );
    console.log( "gagarinArguments:    ", gagarinArguments );
  }

  chromedriver.start();
  var gagarin = childProcess.spawn( gagarinCommand, gagarinArguments, {
    env: gagarinEnv,
    cwd: options.runfrom
  });


  gagarin.stdout.on('data', function(data){
    console.log(data.toString().trim());
  });
  gagarin.stderr.on('data', function(data) {
    console.error(data.toString());
  });
  gagarin.on('error', function(error){
    console.error('[StarryNight] ERROR spawning gagarin.');
    chromedriver.stop();
    throw error;
  });
  gagarin.on('close', function(gagarinExitCode){
    if(gagarinExitCode === 0){
      console.log('Finished!  Gagarin ran all the tests!');
        chromedriver.stop();
        process.exit(gagarinExitCode);
    }
    if(gagarinExitCode !== 0){
      console.log('Gagarin exited with a code of ' + gagarinExitCode);
      chromedriver.stop();
      process.exit(gagarinExitCode);
    }
  });

}
