// so we can read files from the filesystem
var filesystem = require('fs');

// child_process lets us exec and spawn external commands
var childProcess = require( 'child_process' );

// so we can find the NODE_PATH
var path = require( 'path' );

module.exports = function (options) {
  //console.log("Scanning the .meteor/versions file for packages...");
  console.log("Scanning the .meteor/packages file for packages...");

  filesystem.readFile('.meteor/packages', {
    encoding: 'utf-8'
  }, function (error, data) {
    if (data) {
      //console.log(data.toString());

      // data string gets generated as a long blob; need to split it at line breaks into an array
      var packagesArray = data.toString().split(/\n/);
      var fileText = "";

      packagesArray.forEach(function (packageDefinition) {
        // don't use comments, newlines, or emptylines
        if ((packageDefinition.charAt(0) !== "#") &&
            (packageDefinition.charAt(0) !== "\n") &&
            (packageDefinition.charAt(0) !== " ")) {

          // only parse published packages from non-mdg namespaces
          if (packageDefinition.indexOf(":") > -1) {
            //console.log('packageDefinition', packageDefinition);

            childProcess.exec( 'meteor show ' + packageDefinition + " --ejson", function ( err, stdout, stderr ) {
              if ( options.debug ) {
                if ( stdout ) {
                  console.log( stdout );
                }
                if ( err ) {
                  console.log( err );
                }
              }
              if (options.debug) {
                console.log(stdout);
              } else {
                // lets parse the ejson file we should be receiving
                var packageObject = JSON.parse(stdout);

                // there will be some empty
                if (packageObject.versions) {
                  // no empty strings, please
                  if (packageObject.versions[packageObject.versions.length -1].git !== "") {

                    if (options.clinical) {
                      if (packageObject.versions[packageObject.versions.length -1].git.indexOf("clinical-meteor") > -1) {
                        console.log(packageObject.versions[packageObject.versions.length -1].git);
                      }
                    } else {
                      console.log(packageObject.versions[packageObject.versions.length -1].git);
                    }
                  }
                } else {
                  // no empty strings, please
                  if (packageObject.git !== "") {
                    console.log(packageObject.git);
                  }
                }
              }

            });










          }
        }
      });

    }
    if (error) {
      console.error(error);
    }
  });

};
