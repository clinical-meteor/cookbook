// fs-extra lets us recursively copy directories and do advance file management
var fs = require('fs-extra');


module.exports = function(npmPrefix, secondArgument, thirdArgument){
  switch (secondArgument) {
    case "all":
      // we're going to copy over all of the contents in the sample-tests directory
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests', './tests', function (error) {
        if (error){
          return console.error(error)
        }
        console.log('Tests copied over!')
      });
      break;
    case "end-to-end":
      fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/meteor-e2e', './tests/meteor-e2e', function (error) {
        if (error){
          console.log('Is meteor-e2e installed?');
          return console.error(error)
        }
        console.log('Tests copied over!')
      });
      break;
    case "acceptance":
      switch (thirdArgument) {
        case "project-homepage":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch-project-homepage', './tests/nightwatch', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('ProjectHomepage tests copied over!')
            });
          break;
        case "itunes":
            fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch-itunes', './tests/nightwatch', function (error) {
              if (error){
                return console.error(error)
              }
              console.log('iTunes tests copied over!')
            });
          break;
        default:
          fs.copy(npmPrefix + '/lib/node_modules/starrynight/scaffolds/sample-tests/nightwatch', './tests/nightwatch', function (error) {
            if (error){
              return console.error(error);
            }
            console.log('Basic testing framework copied over!')
          });
          break;
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
