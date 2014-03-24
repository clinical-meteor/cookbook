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


#### Fourth Example - Client - With jsFiddle  

http://jsfiddle.net/hybrid13i/JXrwM/

````js
$(document).ready(function(){
    $('button').click(function(){
        var data = $('#txt').val();
        if(data == '')
            return;
        
        JSONToCSVConvertor(data, "Vehicle Report", true);
    });
});

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
````

#### Fifth Example  

http://jsfiddle.net/sturtevant/vUnF9/

#### Server  

````js
res.header("Content-Disposition", "attachment;filename="+name+".csv"); 
res.type("text/csv");
res.send(200, csvString);
````

  
