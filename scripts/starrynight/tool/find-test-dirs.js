// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// replace allows us to refactor contents of file
var replace = require('replace');

// find our files
var find = require('find');


//module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function(options, caseInsensitive){

  // use current directory if --root isn't specified
  if(!options.root){
    options.root = ".";
  }
  console.log("------------------------------------------");
  console.log("Searching files for .test directories.... ");

  if(options.debug){
    console.log("options.from", options.from);
    console.log("options.to", options.to);
    console.log("options.root", options.root);
  }

  if(options){

    find.eachdir('.tests', options.root, function(dir){
      console.log(dir);
    }).end(function(){
      console.log("-fin-");
    });

  }
}
