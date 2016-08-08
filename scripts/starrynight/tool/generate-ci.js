
// fs-extra lets us recursively copy directories and do advance file management
var fs = require("fs-extra");

var fileNameLookUp = {
    "travis" : { "src" : "/.travis.yml", "dst" : "./.travis.yml"},
  "circleci" : { "src" :  "/circle.yml", "dst" :  "./circle.yml"},
};

var scaffoldPath = "/lib/node_modules/starrynight/scaffolds/continuous-integration";

// TODO:  detect that this is running in the app root
// ie. next to a .meteor directory
module.exports = function generateContinuousIntegration (npmPrefix, arguments, options) {

  if (options && options.provider && options.provider in fileNameLookUp) {
//    console.log("Source : " + npmPrefix + scaffoldPath + fileNameLookUp[ options.provider ].src +
//                 "\n Dest : " + fileNameLookUp[ options.provider ].dst);
    fs.copy(
      npmPrefix + scaffoldPath + fileNameLookUp[ options.provider ].src,
      fileNameLookUp[ options.provider ].dst,
      function (error) {
        if (error){
          return console.error(error);
        }
        console.log("'" + fileNameLookUp[ options.provider ].dst + "' added to project.");
      }
    );
  } else {
    var err = new Error();
    err.name = "InputError";
    err.message = "Unkown provider : " + options.provider;
    throw(err);
  }
};
