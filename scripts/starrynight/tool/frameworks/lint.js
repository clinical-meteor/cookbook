// child_process lets us exec and spawn external commands
var childProcess = require("child_process");

module.exports = function (options) {
  if (options && options.path){
    childProcess.exec("eslint " + options.path, function (err, stdout, stderr) {
      console.log(stdout);
    });
  }
};
