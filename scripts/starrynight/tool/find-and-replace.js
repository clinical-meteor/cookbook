// replace allows us to refactor contents of file
var replace = require('replace');

// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs');

module.exports = function(options){
  if(!options.root){
    options.root = ".";
  }

  if(options){

    // both of our input parameters should be defined
    if(options.from && options.to){

        var pathArray = [];

        // lets check which directories exists
        // and build up an array of paths to use in find-and-replace
        // this async callback chain may look scary, but it's really not
        fs.lstat(options.root + "/client", function(err, stats){
          if(stats){
            pathArray.push(options.root + "/client");
          }
          fs.lstat(options.root + "/server", function(err, stats){
            if(stats){
              pathArray.push(options.root + "/server");
            }
            fs.lstat(options.root + "/lib", function(err, stats){
              if(stats){
                pathArray.push(options.root + "/lib");
              }
              fs.lstat(options.root + "/public", function(err, stats){
                if(stats){
                  pathArray.push(options.root + "/public");
                }
                fs.lstat(options.root + "/private", function(err, stats){
                  if(stats){
                    pathArray.push(options.root + "/private");
                  }
                  fs.lstat(options.root + "/tests", function(err, stats){
                    if(stats){
                      pathArray.push(options.root + "/tests");
                    }

                    // all done with our async chaining!
                    // lets take a look at what we managed to build up
                    if(options.debug){
                      console.log("pathArray", pathArray);
                    }

                    // and then lets open up a bunch of files and replace text!
                    replace({
                      regex: options.from,
                      replacement: options.to,
                      paths: pathArray,
                      excludes: [".meteor", ".git", ".meteor/*", ".git/*"],
                      recursive: true
                    });

                    console.log('Done refactoring!');

                  });
                });
              });
            });
          });
        });
    }
  }
}
