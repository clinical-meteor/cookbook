// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

// fs-extra lets us recursively copy directories and do advance file management
var fs = require( "fs-extra" );

// npm install apm
// apm install linter
// apm install linter-eslint

module.exports = function () {
  console.log( "Installing eslint..." );

  var lintProcess = childProcess.spawn( "npm", [ "install", "-g", "eslint" ] );
  var lintReactProcess = childProcess.spawn( "npm", [ "install", "-g", "eslint-plugin-react" ] );
};
