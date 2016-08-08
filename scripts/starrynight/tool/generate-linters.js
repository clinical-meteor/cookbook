// fs-extra lets us recursively copy directories and do advance file management
var fs = require("fs-extra");


// TODO:  detect that this is running in the app root
// ie. next to a .meteor directory
module.exports = function (npmPrefix, options) {
  if (options.lintType === "react") {
    fs.copy(npmPrefix + "/lib/node_modules/starrynight/scaffolds/linters/react.eslintrc",
      ".eslintrc",
      function (error, result) {
        if (error) {
          return console.error(error);
        }
        console.log(".eslintrc added to project.");
      });

  } else {
    fs.copy(npmPrefix + "/lib/node_modules/starrynight/scaffolds/linters/.eslintrc",
      ".eslintrc",
      function (error, result) {
        if (error) {
          return console.error(error);
        }
        console.log(".eslintrc added to project.");
      });
  }

  fs.copy(npmPrefix + "/lib/node_modules/starrynight/scaffolds/linters/.jsbeautifyrc",
    ".jsbeautifyrc",
    function (error, result) {
      if (error) {
        return console.error(error);
      }
      console.log(".jsbeautify added to project.");
    });
};
