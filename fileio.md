## File Input/Output

````js
// Asynchronous Method.
Meteor.startup(function () {
    console.log('starting up');
 
    var fs = __meteor_bootstrap__.require('fs');
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
    var fs = __meteor_bootstrap__.require('fs');
    var data = fs.readFileSync('public/datafile/flare.json', 'utf8');
 
    if (Icd10.find().count() === 0) {
        Icd10.insert({
            date:  new Date(),
            data:  JSON.parse(data)
        });
    }
});
````
