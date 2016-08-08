// child_process lets us exec and spawn external commands
var childProcess = require( 'child_process' );

// fs-extra lets us recursively copy directories and do advance file management
var fs = require( 'fs-extra' );

// npm install apm
// npm install -g eslint
// npm install -g eslint-plugin-react
// apm install linter
// apm install linter-eslint

module.exports = function () {
  console.log( 'Extract atom-mac.zip file...' );

  fs.createReadStream( process.cwd() + '/atom-mac.zip' )
    .pipe( unzip.Extract( {
      path: '.'
    } ), function () {
      console.log( 'Atom unzipped.' );
      childProcess.exec( 'cp Atom.app/ /Applications/', function ( err, stdout, stderr ) {
        console.log( 'Atom copied to the Applications folder...' );

        childProcess.exec(
          'ln -s /Applications/Atom.app/Contents/MacOS/Atom /usr/local/bin/atom',
          function ( err, stdout, stderr ) {
            console.log( stdout );
          } );

        childProcess.exec( 'open -a Atom', function ( err, stdout, stderr ) {
          console.log( stdout );
        } );
      } );
    } );

  //https://atom.io/docs/v0.80.0/customizing-atom
  //https://atom.io/docs/v0.189.0/getting-started-atom-basics
};
