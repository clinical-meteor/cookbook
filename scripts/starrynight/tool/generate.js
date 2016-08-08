

// so we can read files from the filesystem
var filesystem = require('fs');

// fs-extra lets us recursively copy directories and do advance file management
var fs = require("fs-extra");

// find our files
const find = require('find');

// nodeJs logging capability
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'starrynight'});
log.level('warn');


// TODO:  detect that this is running in the app root
// ie. next to a .meteor directory
module.exports = function generateContinuousIntegration (npmPrefix, options, arguments) {

  if (options && options.travis) {
    generateTravisConfig(npmPrefix, options, arguments);
  };

  if (options && options.circle) {
    generateCircleConfig(npmPrefix, options, arguments);
  };

  if (options && options.linters) {
    generateLinterFiles(npmPrefix, options, arguments);
  };

  if (options && options.release) {
    generateReleaseJson(npmPrefix, options, arguments);
  };

  if (options && options.autoconfig) {
    generateAutoconfig(npmPrefix, options, arguments);
  };

  if (options && options.nightwatch) {
    generateAutoconfig(npmPrefix, options, arguments);
  };

  if (options && options.env) {
    generateEnvironmentVars(npmPrefix, options, arguments);
  };

  if (options && options.kadira) {
    generateKadiraConfig(npmPrefix, options, arguments);
  };

  if (options && options.analytics) {
    generateAnalyticsConfig(npmPrefix, options, arguments);
  };

  if (options && options.default) {
    generateTravisConfig(npmPrefix, options, arguments);
    generateAutoconfig(npmPrefix, options, arguments);
    generateLinterFiles(npmPrefix, options, arguments);
    generateIgnoreFiles(npmPrefix, options, arguments);
  };

  if (options && options.devops) {
    generateEnvironmentVars(npmPrefix, options, arguments);
    generateKadiraConfig(npmPrefix, options, arguments);
    generateAnalyticsConfig(npmPrefix, options, arguments);
  };

};




generateTravisConfig = function(npmPrefix, options, arguments){
  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/continuous-integration/.travis.yml', './.travis.yml', function (error) {
    if (error){
      console.error(error);
    }
    console.log('.travis.yml added to project.')
  });
};

generateCircleConfig = function(npmPrefix, options, arguments){
  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/continuous-integration/.circle.yml', './.travis.yml', function (error) {
    if (error){
      console.error(error);
    }
    console.log('.travis.yml added to project.')
  });
};
generateLinterFiles = function(npmPrefix, options, arguments){
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

generateReleaseJson = function(npmPrefix, options, arguments){
  filesystem.readFile('.meteor/versions', {encoding: 'utf-8'}, function(error, data){
    if(data){
      //console.log(data.toString());

      // data string gets generated as a long blob; need to split it at line breaks into an array
      var packagesArray = data.toString().split(/\n/);
      var packageName = "";
      var packageVersion = "";
      var firstPackage = true;

      var fileText = "";
      fileText += "{\n";
      fileText += '  "track":"foo:METEOR",\n';
      fileText += '  "version":"1.2.3",\n';
      fileText += '  "recommended": false,\n';
      fileText += '  "tool": "foo:meteor-tool@1.2.3",\n';
      fileText += '  "description": "Foo Meteor for You!",\n';
      fileText += '  "packages": {\n';

      packagesArray.forEach(function(packageDef){
        // find the package name and version
        packageName = packageDef.substr(0, packageDef.indexOf('@'));
        packageVersion = packageDef.substr(packageDef.indexOf('@') + 1, packageDef.length);
        // don't add empty package names
        if(packageName.length > 0){
          // if there's a comma one the last package entry, it will be invalid json
          // so we set firstPackage true before starting our loop
          // and set it false after we process the first package
          // the double negative then appends the comma and new line break
          // at the beginning of each row, ensuring we get valid json
          // tl;dr - it works this way
          if(!firstPackage){
            fileText += ',\n'
          }

          // write each name in release.json format
          fileText += '    "' + packageName + '":"' + packageVersion + '"';
        }
        firstPackage = false;
      });

      fileText += "\n  }\n";
      fileText += "}";
      console.log(fileText);

    }
    if(error){
      console.error(error);
    }
  });
}

generateAutoconfig = function(npmPrefix, options, arguments){
  // use current directory if --root isn't specified
  if (!options.root) {
    options.root = '.';
  }

  if (options) {
    if (options.trace) { log.level(options.trace); }

    // Read Our Config File Template
    fs.readJson(
      npmPrefix + '/lib/node_modules/starrynight/configs/nightwatch/autoconfig.json',
      function updateNightWatchJson (err, autoConfigObject) {
        if (err) { log.error(err); }
        if (options.mnml || options.minimal) {
          log.info('------------------------------------------');
          log.info('Removing "custom path"  elements     .... ');

          delete autoConfigObject.custom_commands_path;
          delete autoConfigObject.custom_assertions_path;

          fs.writeJson(
            '.meteor/nightwatch.json',
            autoConfigObject,
            {spaces: 2},
            function writing (error, result) {
              if (error) { log.error(error); }
              log.info('Writing .meteor/nightwatch.json');
              log.debug('writeJson result was : ' + result);
            }
          );

        } else {
          log.info('------------------------------------------');
          log.info('Searching files for .test directories.... ');

          // Search The Filesystem
          // looking for .tests directories in the filesystem
          // which don't get picked up by the meteor bundler
          find.eachdir('.tests', options.root, function (testDir) {

            log.debug('testDir', testDir);

            // Update Our New Config Object
            autoConfigObject.custom_commands_path.push(testDir);
            // Test For Subdirecotries
            find.eachdir('actions', testDir, function (actionsDir) {
              // Update Our New Config Object
              autoConfigObject.custom_commands_path.push(actionsDir);
            });

          }).end( function () {
            log.debug('autoConfigObject', autoConfigObject);

            // Write Our New Config File
            fs.writeJson(
              '.meteor/nightwatch.json',
              autoConfigObject,
              {spaces: 2},
              function writing (error, result) {
                if (error) { log.error(error); }
                log.info('Writing .meteor/nightwatch.json');
                log.debug('writeJson result was : ' + result);
              }
            );
          });
        }

        console.log('.meteor/nightwatch.json added to project.');
      }
    );
  }
};


generateIgnoreFiles = function(npmPrefix, options, arguments){
  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/ignores/.gitignore', './.gitignore', function (error) {
    if (error){
      console.error(error);
    }
    console.log('.gitignore added to project.')
  });
};

generateEnvironmentVars = function(npmPrefix, options, arguments){

};

generateKadiraConfig = function(npmPrefix, options, arguments){

};

generateAnalyticsConfig = function(npmPrefix, options, arguments){

}
