
// need to look in the following file
// more /Applications/Firefox.app/Contents/Resources/application.ini
// Version=35.0

var locateFirefox = require('locate-firefox');
// Use a callback

module.exports = function(options){
  locateFirefox(function(location) {
    console.log("Locating FireFox...");
    console.log(location);
  });

  // Use the returned Promise
  /*locateFirefox.then(function(l) {
    console.log(l);
  });*/
}
