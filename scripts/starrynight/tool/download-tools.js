// request allows us to query external websites
var request = require('request');

// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');



module.exports = function(){
  console.log( "Downloading atom.io for Mac.  This may take awhile..." );

  request({url: "https://github.com/atom/atom/releases/download/v0.194.0/atom-mac.zip", encoding: null}, function(err, resp, body) {
    if(err) throw err;
    fs.writeFile(process.cwd() + "/atom-mac.zip", body, function(err) {
      console.log("Zip file written!");

      console.log("Installing atom.io for mac...");
    });
  });

  //https://atom.io/docs/v0.80.0/customizing-atom
  //https://atom.io/docs/v0.189.0/getting-started-atom-basics
}
