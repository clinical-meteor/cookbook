// so we can read files from the filesystem
var filesystem = require('fs');

// child_process lets us exec and spawn external commands
var childProcess = require( 'child_process' );

// so we can find the NODE_PATH
var path = require( 'path' );

module.exports = function (npmPrefix, options) {
  //console.log("Scanning the .meteor/versions file for packages...");

  filesystem.readFile('git-packages.json', {encoding: 'utf-8'}, function(error, data){
    if (data) {
      console.log("Found git-packages.json");
      console.log("Fetching packages...");
      childProcess.exec( npmPrefix + '/lib/node_modules/starrynight/node_modules/mgp/run.js');
    }
    if (error) {

        filesystem.readFile('.meteor/repos', {
          encoding: 'utf-8'
        }, function (error, data) {
          if (data) {
            console.log("Found .meteor/repos");
            console.log("Please consider migrating to git-packages.json");
            console.log("Fetching packages...");

            // data string gets generated as a long blob; need to split it at line breaks into an array
            var repositoryArray = data.toString().split(/\n/);
            var fileText = "";

            repositoryArray.forEach(function (repositoryString) {
              // don't use comments, newlines, or emptylines
              if ((repositoryString.charAt(0) !== "\n") &&
                  (repositoryString.charAt(0) !== " ")) {

                // only parse published packages from non-mdg namespaces
                if (repositoryString.indexOf(":") > -1) {
                  console.log(repositoryString);

                  childProcess.exec( 'cd packages && git clone ' + repositoryString, function ( err, stdout, stderr ) {

                  });
                }
              }
            });

          }
          if (error) {
            console.log("No git-packages.json file found.");
          }
        });
    }
  });



};
