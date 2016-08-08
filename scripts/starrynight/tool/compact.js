// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// find our files
var find = require('find');

// for compacting the .git repo
var git = require('git-wrapper2');

//module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function(options){

  // use current directory if --root isn't specified
  if(!options.root){
    options.root = ".";
  }

  if(options.scan){
    // $git gc
    // $git count-objects -v
  }



  console.log("------------------------------------------");
  console.log("Searching files for .test directories.... ");


  if(options){

    find.eachdir('.meteor', options.root, function(meteorDir){
      //console.log(dir);

      find.eachdir('local', meteorDir, function(localDir){
        console.log(localDir);

        // the --database flag will be a bit more forceful in deleting database files
        if(options.database || options.all){
          fs.remove(localDir, function (err) {
            if (err) return console.error(err)
            console.log('[deleted] ' + localDir)
          });
        }else{
          find.eachdir('build', localDir, function(buildDir){
            console.log(buildDir);

            // the --scan flag will prevent things from getting deleted automatically
            if(!options.scan){
              fs.remove(buildDir, function (err) {
                if (err) return console.error(err)
                console.log('[deleted] ' + buildDir)
              });
            }

          }).end(function(){
            //console.log("-fin-");
          });
        }

      }).end(function(){
        //console.log("-fin-");
      });

    }).end(function(){
      //console.log("-fin-");
    });


    if(options.screenshots || options.all){
      find.eachdir('screenshots', options.root, function(screenshotsDir){
        console.log(screenshotsDir);

          // the --scan flag will prevent things from getting deleted automatically
          if(!options.scan){
            fs.remove(screenshotsDir, function (err) {
              if (err){return console.error(err)};
              console.log('[deleted] ' + screenshotsDir);

              fs.ensureDir(screenshotsDir, function (err) {
                if(err){console.log(err)};
                console.log('[created] ' + screenshotsDir);
              })
            });
          }

      }).end(function(){
        //console.log("-fin-");
      });
    }

    if(options.reclaim){
      console.log("See the following urls for more details:");
      console.log("https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery");
      console.log("http://stevelorek.com/how-to-shrink-a-git-repository.html");
      console.log("http://naleid.com/blog/2012/01/17/finding-and-purging-big-files-from-git-history");
      console.log("");


      // https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery
      // http://stevelorek.com/how-to-shrink-a-git-repository.html
      // http://naleid.com/blog/2012/01/17/finding-and-purging-big-files-from-git-history

      git.exec('reflog', [[{expire: "now", all: true}, "expire"]], function(error, result){
        git.exec('gc', [[{prune: "now", aggressive: true}]], function(error, result){
          console.log("Garbage collection completed.");
        });
      });
    }
  }
}
