// so we can read files from the filesystem
var filesystem = require('fs');

// cheerio provides DOM/jQuery utilities to lets us parse html
var cheerio = require('cheerio');


module.exports = function(secondArgument){
  console.log( "Extracting ids from " + secondArgument);
  filesystem.readFile(secondArgument, {encoding: 'utf-8'}, function(error, data){
    if(data){
      //console.log(data.toString());
      $ = cheerio.load(data.toString())
      var ids = new Array();
      $('[class]').each(function() { //Get elements that have an id=
        ids.push($(this).attr("class")); //add id to array
      });
      console.log(ids);
    }
    if(error){
      console.error(error);
    }
  });
}
