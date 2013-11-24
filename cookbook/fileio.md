## File Input/Output
For when you need to read and parse a file on the server disk drive.  Useful for persistent data-drops and initialization files.  Be careful, as this solution doens't scale horizontally.  So be sure that you're using a shared-nothing architecture.  

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



## Parsing XML  
But maybe your data isn't in JSON format, and you can't simply call ``JSON.parse(data)``.  Maybe you have an XML file that you need to parse.  You'll need to do something like the following...     

````js
function parseIcd10File() {
    $('#xmlData').html('');
    $.ajax({
        type:"get",
        url:'/datafile/ICD10_Disease_Sample.xml',
        dataType:"xml",
        complete:function (data) {

            //$('#xmlData').append("<b>icd10 codes</b><br>");
            function findTerm(arg) {
                $(this).children('term').each(function () {
                    var title = $(this).find('title').first().text();
                    var code = $(this).find('code').first().text();
                    $('#xmlData').append(arg + " " + title + " " + code + "<br>");
                    findTerm.call(this, arg + "-");
                });
            }
            $(data.responseXML).find('mainTerm').each(function () {
                var title = $(this).find('title').first().text();
                var code = $(this).find('code').first().text();
                var seeAlso = $(this).find('seeAlso').first().text();
                $('#xmlData').append("<b>" + title + "</b> " + code + "<br>");
                findTerm.call(this, "-");
            });
        }
    });
    if (Icd10.find().count() === 0) {
        $.ajax({
            type:"get",
            url:'/datafile/ICD10_Disease_Sample.xml',
            dataType:"xml",
            complete:function (data) {
                function updateTerm(level, path, objectId, termCode) {
                    var updatePath = path;
                    if (termCode) {
                        updatePath = updatePath + "." + termCode;
                    }
                    var id = Icd10.update(objectId, {$set:{ updatePath:{
                        level:level,
                        title:$(this).find('title').first().text(),
                        code:$(this).find('code').first().text()
                    }}});
                    $(this).children('term').each(function () {
                        var code = $(this).find('code').first().text();
                        updateTerm.call(this, level + 1, path + '.children', id, code);
                    });
                }
                $(data.responseXML).find('mainTerm').each(function () {
                    var id = Icd10.insert({
                        title:$(this).find('title').first().text(),
                        code:$(this).find('code').first().text(),
                        seeAlso:$(this).find('seeAlso').first().text()
                    });
                    $(this).children('term').each(function () {
                        //var code =  $(this).find('code').first().text();
                        updateTerm.call(this, 1, 'term', id, '');
                    });
                });
            }
        });
    }
}````

