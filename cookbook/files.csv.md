## CSV  

#### First Example - Client
Original description found here:  
http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side  
````js
var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < infoArray.length ? dataString+ "\n" : dataString;

}); 


var encodedUri = encodeURI(csvContent);
window.open(encodedUri);


var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");

link.click(); // This will download the data file named "my_data.csv".
````

#### Second Example - Client  
Original description found here:  
http://stackoverflow.com/questions/4639372/export-to-csv-in-jquery  

````js
$("table.myclass").toCSV();

jQuery.fn.toCSV = function() {
  var data = $(this).first(); //Only one table
  var csvData = [];
  var tmpArr = [];
  var tmpStr = '';
  data.find("tr").each(function() {
      if($(this).find("th").length) {
          $(this).find("th").each(function() {
            tmpStr = $(this).text().replace(/"/g, '""');
            tmpArr.push('"' + tmpStr + '"');
          });
          csvData.push(tmpArr);
      } else {
          tmpArr = [];
             $(this).find("td").each(function() {
                  if($(this).text().match(/^-{0,1}\d*\.{0,1}\d+$/)) {
                      tmpArr.push(parseFloat($(this).text()));
                  } else {
                      tmpStr = $(this).text().replace(/"/g, '""');
                      tmpArr.push('"' + tmpStr + '"');
                  }
             });
          csvData.push(tmpArr.join(','));
      }
  });
  var output = csvData.join('\n');
  var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(output);
  window.open(uri);
}
````

#### Third Example - Client  
Original description found here:  
http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction 
````js
var A = [['n','sqrt(n)']];

for(var j=1; j<10; ++j){ 
    A.push([j, Math.sqrt(j)]);
}

var csvRows = [];

for(var i=0, l=A.length; i<l; ++i){
    csvRows.push(A[i].join(','));
}

var csvString = csvRows.join("%0A");
var a         = document.createElement('a');
a.href        = 'data:attachment/csv,' + csvString;
a.target      = '_blank';
a.download    = 'myFile.csv';

document.body.appendChild(a);
a.click();
````

#### Server  

````js
res.header("Content-Disposition", "attachment;filename="+name+".csv"); 
res.type("text/csv");
res.send(200, csvString);
````

  
