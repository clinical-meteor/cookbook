// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// github-download allows us to clone repos into our application
var githubDownload = require('github-download');

// so we can find the NODE_PATH
var path = require('path');


module.exports = function(options){
  console.log("Cloning repository pattern into directories...");

  if(options.url){
      if(options.url){

        //TODO:  check if we're in the root of an application?  That might be a good thing to do.

        // download the repository to a temp directory
        githubDownload(options.url, './.temp')
          .on('dir', function(dir) {
            console.log(dir)
          })
          .on('file', function(file) {
            console.log(file)
          })
          .on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded
            console.log(zipUrl)
          })
          .on('error', function(err) {
            console.error(err)
          })
          .on('end', function() {
            childProcess.execFile('tree', function(err, stdout, sderr) {
              process.env.DEBUG && console.log(stdout)
            });

            // copy the components directory from our temp dir to the app dir
            // this assumes the standard server-client boilerplate
            fs.copy('./.temp/components', './client/app/components', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Components copied from repository into app!')

              // temp directory created; lets move components into their final place
              fs.copy('./.temp/tests/nightwatch/commands/components', './tests/nightwatch/commands/components', function (error) {
                if (error){
                  return console.error(error)
                }
                console.log('Component acceptance tests copied from repository into app!')

                //clean things up by removing our temp directory
                fs.remove('./.temp', function (err) {
                  if (err) return console.error(err)

                  console.log('success!')
                });
              });
            });
          });
      }else{
        console.log('-pattern needs a github URl to clone from that implements the server-client boilerplate pattern.');
      }
  }
}
