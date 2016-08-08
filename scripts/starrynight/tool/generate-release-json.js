// so we can read files from the filesystem
var filesystem = require('fs');


module.exports = function(){
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
