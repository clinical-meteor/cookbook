// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// find-files allows us to -rename
var finder = require('find-files');

// replace allows us to refactor contents of file
var replace = require('replace');


//module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function(options, caseInsensitive){
  if(!options.root){
    options.root = ".";
  }
  console.log("------------------------------------------");
  console.log("Searching files.... ");

  if(options.debug){
    console.log("options.from", options.from);
    console.log("options.to", options.to);
    console.log("options.root", options.root);
  }

  if(options){
    if(options.from && options.to){
        finder(options.from, {root: options.root, ignoreDirs: [".meteor", ".git", ".temp"]}, function(results){
          //console.log('results', results);\

          console.log("");
          console.log("------------------------------------------");
          console.log("Renamed files...");
          console.log("");

          results.forEach(function(result){
            // console.log('result.filepath', result.filepath);

            // if it's case insensitive, we're going to run the rename twice
            // the first time we'll do lowercase; later we'll do uppercase
            if(caseInsensitive){
              options.from = options.from.toLowerCase();
              options.to = options.to.toLowerCase();
            }

            // many component directories will have subfiles with the same name
            // we need to run the replace twice - to replace the directory name
            // and then to replace the file name.

            var newresult = result.filepath.replace(options.from, options.to);
            var finalPath = newresult.replace(options.from, options.to);

            if(options.debug){
              console.log("newresult", newresult);
              console.log("finalPath", finalPath);
            }

            fs.move(result.filepath, finalPath, function(error, result){
              console.log('error', error);
            });

            console.log(finalPath);

            //======================================================================================

            /*if(caseInsensitive){
              options.from = options.from.toProperCase();
              options.to = options.to.toProperCase();

              var newUpperResult = result.filepath.replace(options.from, options.to);
              var finalUpperPath = newresult.replace(options.from, options.to);

              if(options.debug){
                console.log("newresult", newUpperResult);
                console.log("finalPath", finalUpperPath);
              }

              fs.move(result.filepath, finalUpperPath, function(error, result){
                console.log('error', error);
              });
            }*/

          });
        });

        console.log('Done renaming files!');
    }
  }
}


String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s){ return s.toUpperCase(); });
};
