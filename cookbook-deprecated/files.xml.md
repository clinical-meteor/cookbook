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

