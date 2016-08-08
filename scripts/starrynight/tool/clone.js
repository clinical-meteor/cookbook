
// node-parse-url breaks up a url into component parts for us
var urlParser = require('node-parse-url');

// github-download allows us to clone repos into our application
var githubDownload = require('github-download');

// so we can find the NODE_PATH
var path = require('path');

module.exports = function(url){
  if(url){
    console.log("Cloning repository...");

    var parsedUrl = urlParser(url);
    console.log('parsedUrl', parsedUrl);
    console.log('parsedUrl.path', parsedUrl.path);
    console.log('user', parsedUrl.path.match(/\/(.*)\//).pop());
    console.log('repo', parsedUrl.path.substring(parsedUrl.path.lastIndexOf("/") + 1));


    githubDownload(secondArgument, thirdArgument)
      .on('dir', function(dir) {
        console.log(dir)
      })
      .on('file', function(file) {
        console.log(file)
      })
      .on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded
        console.log(zipUrl)
      })
      .on('error', function(err) {
        console.error(err)
      })
      .on('end', function() {
        childProcess.execFile('tree', function(err, stdout, sderr) {
          console.log(stdout)
        })
      });

  }else{
    console.log("Please specify a url.");
  }
}
