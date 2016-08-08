// fs-extra lets us recursively copy directories and do advance file management
var fs = require( 'fs-extra' );

// child_process lets us exec and spawn external commands
var childProcess = require( 'child_process' );

// so we can find the NODE_PATH
var path = require( 'path' );

// find-files allows us to -rename
var finder = require( 'find-files' );

// replace allows us to refactor contents of file
var replace = require( 'replace' );

module.exports = function ( options ) {
  if ( options.package && options.from ) {

    // our '--from' path needs to NOT have a trailing slash /
    if (options.from.charAt(options.from.length - 1) === '/') {
      options.from = options.from.substr(0, options.from.length - 1);
    }

    // Figure out Package Directory Name
    var newPackageDir = options.package.split( ':' )[ 1 ];
    var componentDir = path.basename( options.from );

    if ( options.debug ) {
      console.log( 'newPackageDir: ', newPackageDir );
      console.log( 'componentDir:  ', componentDir );
    }

    // Move to the Correct Directory
    childProcess.exec( 'cd packages', function ( err, stdout, stderr ) {

      // And Create Our New Package
      childProcess.exec( 'meteor create --package ' + options.package, function ( err, stdout, stderr ) {
        if ( options.debug ) {
          if ( stdout ) {
            console.log( stdout );
          }
          if ( err ) {
            console.log( err );
          }
        }

        // Check That the Package Was Created Correctly
        if ( stdout.toString()
          .indexOf( ': created in' ) > -1 ) {
          console.log( 'Package created!' );

          // Create our new Package.js File
          var packageJsContents = '';
          packageJsContents += "Package.describe({\n  name:'" + options.package + "',\n  version: '0.0.1',\n  summary: '',\n  git: '',\n  documentation: 'README.md',\n});\n\n";

          // Copy Our Component Into the New Package
          fs.copy( options.from, 'packages/' + newPackageDir + '/components/' + path.basename( options.from ), function ( error ) {
            if ( error ) {
              return console.error( error );
            }
            console.log( 'Component files copied into package.' );

            // Look for Files with the Same Name as the Component Name
            finder( componentDir, {
              root: options.from,
              ignoreDirs: [ '.meteor', '.git', '.temp' ]
            }, function ( results ) {
              if ( options.debug ) {
                console.log( 'results', results );
              }


              var newFiles = '';
              newFiles =  "  api.use('meteor-platform');\n  api.use('iron:router');\n  api.use('less');\n\n";

              results.forEach( function ( result ) {
                if ( options.trace ) {
                  console.log('result', result);
                  //console.log( 'result.filepath: ' + path.basename( result.filepath ).split( '.' )[ 0 ] + '/' + path.basename( result.filepath ));
                }

                // Build A New Set of File Includes (not including .test dirs)
                if (result.filepath.indexOf('.tests') === -1){
                  newFiles += "  api.addFiles('components/" + path.basename( result.filepath ).split( '.' )[ 0 ] + '/' + path.basename( result.filepath ) + "', ['client']);\n";
                }
              } );
              newFiles += "\n  api.export('" + componentDir + "');\n";

              // Search for the Default File Includes
              // var searchTerm = "api.addFiles\\('" + newPackageDir + ".js'\\);";
              // if ( options.trace ) {
              //   console.log( 'searchTerm: ' + searchTerm );
              // }
              //
              // var searchPath = './packages/' + newPackageDir;
              // if ( options.trace ) {
              //   console.log( 'searchPath: ' + searchPath );
              // }
              //
              // // Replace the Default File Includes With Our New Terms
              // replace( {
              //   regex: searchTerm,
              //   replacement: newFiles,
              //   paths: [ searchPath ],
              //   excludes: [ '.meteor', '.git' ],
              //   recursive: true
              // } );
              // console.log( 'Replaced some text...' );

              packageJsContents += "Package.onUse( function ( api ) {\n  api.versionsFrom('1.1.0.2');\n" + newFiles + "});\n\n";
              packageJsContents += "Package.onTest( function ( api ) {\n  api.use('tinytest');\n  api.use('" + options.package + "');\n  api.addFiles('" + newPackageDir + "-tests.js');\n});";

              fs.writeFile( 'packages/' + newPackageDir + '/package.js', packageJsContents,
                function ( error, result ) {
                  if ( error ) {
                    console.error( error );
                  };
                } );

            } );
          } );

          if ( options.trace ) {
            console.log( packageJsContents );
          }



          // Remove The Default Package Javascript File
          fs.remove( 'packages/' + newPackageDir + '/' + newPackageDir + '.js', function (
            err, result ) {
            if ( err ) return console.error( err );
            console.log( 'Removed default .js file.' );
          } );
        }
      }, function ( error, result ) {
        if ( error ) console.log( error );
      } );

    } );

  } else {
    console.log( 'Please use the following syntax: ' );
    console.log( 'starrynight create --package namespace:mypackage --from /path/to/component' );
    console.log( '' );
  }
};
