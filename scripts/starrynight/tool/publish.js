
// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

module.exports = function(npmPrefix, arguments, options){

  var mbrCommand = npmPrefix + '/lib/node_modules/starrynight/node_modules/mrtbulkrelease/mrtbulkrelease.js';

  if(options && options.all){
    // starrynight publish --all
    console.log('Publishing packages in bulk with mbr tool...');
    console.log('See https://www.npmjs.com/package/mrtbulkrelease for more details...');

    childProcess.exec(mbrCommand + " -r", function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      console.log(err);
    });
  }else if(options && options.release){
  // starrynight publish --release foo:mypackage
    console.log('Publishing package with mbr tool...');
    console.log('See https://www.npmjs.com/package/mrtbulkrelease for more details...');

    childProcess.exec(mbrCommand + " -rn " + options.one, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      console.log(err);
    });
  }else if(options && options.bulk){
  // starrynight publish --bulk foo bar foo
    console.log('Publishing with mbr tool...');
    console.log('See https://www.npmjs.com/package/mrtbulkrelease for more details...');

    childProcess.exec(mbrCommand, arguments.splice(3, arguments.length), function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      console.log(err);
    });
  }else{
    // starrynight release foo bar green
    process.env.DEBUG && console.log("arguments", arguments.splice(3, arguments.length));
    console.log("Publishing with default meteor tool...");
    console.log('See http://docs.meteor.com/#/full/meteorpublish for more details...');

    childProcess.exec('meteor publish ', arguments.splice(3, arguments.length), function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      console.log(err);
    });
  }
}
