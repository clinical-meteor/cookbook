// fs-extra lets us recursively copy directories and do advance file management
const fs = require('fs-extra');

// so we can read files from the filesystem
// var filesystem = require('fs');     // unused ??

// replace allows us to refactor contents of file
// var replace = require('replace');   // unused ??

// find our files
const find = require('find');

// nodeJs logging capability
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'starrynight'});
log.level('warn');


// module.exports = function(secondArgument, thirdArgument, fourthArgument){
module.exports = function generateNightWatchConfig (npmPrefix, options) {
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

        //log.info('Updated .meteor/nightwatch.json.');
        console.log('Updated .meteor/nightwatch.json.');
      }
    );
  }
};
