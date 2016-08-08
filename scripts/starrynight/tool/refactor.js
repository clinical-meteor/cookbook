// replace allows us to refactor contents of file
var replace = require('replace');

module.exports = function(secondArgument, thirdArgument, fourthArgument){
  if(!fourthArgument){
    fourthArgument = ".";
  }

  replace({
    regex: secondArgument,
    replacement: thirdArgument,
    paths: ['.'],
    excludes: [".meteor", ".git"],
    recursive: true
  });

  console.log('Done refactoring!');

}
