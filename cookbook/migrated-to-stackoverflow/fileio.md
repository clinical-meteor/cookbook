## File Input/Output

[File Uploads](https://meteor.hackpad.com/Meteor-Cookbook-Filepicker.io-Uploads-and-Image-Conversion-hIpSwJQV3HJ)

For when you need to read and parse a file on the server disk drive.  Useful for persistent data-drops and initialization files.  Be careful, as this solution doens't scale horizontally.  So be sure that you're using a shared-nothing architecture.  

````js
// Asynchronous Method.
Meteor.startup(function () {
    console.log('starting up');
 
    var fs = Npm.require('fs');
    fs.readFile('file.json', 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
 
        data = JSON.parse(data);
        console.log(data);
    });
});
 
 
// Synchronous Method.
Meteor.startup(function () {
    var fs = Npm.require('fs');
    var data = fs.readFileSync('public/datafile/flare.json', 'utf8');
 
    if (Icd10.find().count() === 0) {
        Icd10.insert({
            date:  new Date(),
            data:  JSON.parse(data)
        });
    }
});
````

## BindEnvironment Example  

Sometimes you need to run some expensive functions while reading from Disk or Network.  If you find yourself running into IO problems, and suspect you're having fibers or sync/async problems, try using Meteor.bindEnvironment.  
````js
Meteor.methods({
  convertFileToRecord: function(postId) {
    if(postId) {
      expensiveObject.ioIntensiveFunction(null, Meteor.bindEnvironment(function(result) {
        Posts.update({_id: postId}, {$set: {text: result}});
        console.log(result);
        return result;
      }, function(err) {
        console.error(err.message);
        return err.message;
      }));
    }else{
      return 'no postId';
    }
  }
});
````


