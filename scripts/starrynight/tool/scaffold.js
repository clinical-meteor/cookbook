// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');

// child_process lets us exec and spawn external commands
var childProcess = require( "child_process" );

var npmPrefix = process.env.NPM_PREFIX;

module.exports = function(npmPrefix, arguments, options){

  if(options){

    //========================================================================
    // APP BOILERPLATES

    if(options.boilerplate){
      console.log("Adding a boilerplate to your project...");

        switch (options.boilerplate) {
          case "project-homepage":

            if(options.framework === undefined){
              childProcess.spawn('meteor', ['add', 'less', 'awatson1978:fonts-helveticas'], {cwd: './'}, function(error, result){
                if(error){
                  console.log("[StarryNight] Error adding meteor packages. ", error);
                }
                console.log('Packages installed.')
              });
            }
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/project-homepage', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied into place.')
            });
          break;
          //--------------------------------------------------------------------------------------------------------
          case "mobile-app":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/mobile-app', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied over!')
            });
            break;
          //--------------------------------------------------------------------------------------------------------
          case "rest-api":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/rest-api', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied over!')
            });
            break;
          //--------------------------------------------------------------------------------------------------------
          case "itunes":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/rest-api', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied over!')
            });
            break;
          //--------------------------------------------------------------------------------------------------------
          case "iron-router":

            childProcess.spawn('meteor', ['add', 'iron:router'], {cwd: './'}, function(error, result){
              if(error){
                console.log("[StarryNight] Error adding meteor packages. ", error);
              }
              console.log('iron:router installed.')
            });
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/iron-router', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied over!')
            });
            break;
          //--------------------------------------------------------------------------------------------------------
          case "client-server":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/client-server', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied over!')
            });
            break;
          //--------------------------------------------------------------------------------------------------------
          case "active-record":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/boilerplates/active-record', './', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('Scaffold copied over!')
            });
            break;          //--------------------------------------------------------------------------------------------------------
          default:
            console.log('No scaffold template specified.:')
            console.log('> project-homepage');
            console.log('> client-server');
            console.log('> rest-api');
            //console.log('> mobile-app');
            break;
          break;
        }
    }


    //========================================================================
    // TEST FRAMEWORKS

    if(options.framework){
      switch (options.framework) {
        case "all":
          // we're going to copy over all of the contents in the sample-tests directory
          fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests', './tests', function (error) {
            if (error){ return console.error(error) }
            console.log('All sample tests for all test frameworks copied over!')
          });
          break;
        case "end-to-end":
          fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/meteor-e2e', './tests/meteor-e2e', function (error) {
            if (error){
              console.log('Is meteor-e2e installed?');
              return console.error(error)
            }
            console.log('e2e mocha tests copied over!')
          });
          break;
        case "tinytest-ci":
          fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch-tinytests', './tests/nightwatch', function (error) {
            if (error){
              console.log('Error installing tinyTestPickup.js');
              return console.error(error)
            }
            console.log('tinyTestPickup.js installed successfully.');
          });
          break;
        case "nightwatch-minimal":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch-minimal', './tests/nightwatch', function (error) {
              if (error){ return console.error(error) }
              /*
                  Here lies one of the ugliest hacks I have been forced to make.
                  Why in HELL would fs.copy rename every .gitnore to .npmignore??
              */
              fs.rename('./tests/nightwatch/gitignore_example', './tests/nightwatch/.gitignore', function (error) {
                if (error){ return console.error(error) }
                console.log('Renamed gitignore_example to .gitignore!')
              });
              console.log('A minimal Nightwatch validation testing framework scaffolded into project!')
            });
          break;
        case "nightwatch":
          console.log("Starting scaffolding of nightwatch tests...");
            if(options.boilerplate){
            switch (options.boilerplate) {
              case "project-homepage":
                  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch-project-homepage', './tests/nightwatch', function (error) {
                    if (error){ return console.error(error) }
                    console.log('Nightwatch validation tests for ProjectHomepage copied over!')
                  });
                break;
              case "itunes":
                  fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch-itunes', './tests/nightwatch', function (error) {
                    if (error){ return console.error(error) }
                    console.log('Nightwatch validation tests for iTunes Connect copied over!')
                  });
                break;
              default:
                fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch', './tests/nightwatch', function (error) {
                  if (error){ return console.error(error) }
                  console.log('Basic Nightwatch validation testing framework scaffolded into project!')
                });
                break;
            }
          }else{
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch', './tests/nightwatch', function (error) {
              if (error){ return console.error(error) }
              console.log('Basic Nightwatch validation testing framework scaffolded into project!')
            });
          }
        break;

        default:
          // we're going to copy over all of the contents in the sample-tests directory
          console.log('No sample tests specified to copy over.  Please specify:')
          console.log('> all');
          console.log('> end-to-end');
          console.log('> acceptance');
          console.log('> acceptance project-homepage');
        break;
      }
    }

    //========================================================================
    // 3RD PARTY SERVICE CONFIGURATION FILES

    if(options.service){
      switch (options.service) {
        case "travis":
          fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/continuous-integration/.travis.yml', './.travis.yml', function (error) {
            if (error){
              return console.error(error)
            }
            console.log('.travis.yml added to project.')
          });
          break;
        default:
          // we're going to copy over all of the contents in the sample-tests directory
          console.log('No sample tests specified to copy over.  Please specify:')
          console.log('> all');
          console.log('> end-to-end');
          console.log('> acceptance');
          console.log('> acceptance project-homepage');
        break;
      }
    }


  }
}
