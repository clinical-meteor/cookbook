// so we can read files from the filesystem
var filesystem = require( 'fs' );

// cheerio provides DOM/jQuery utilities to lets us parse html
var cheerio = require( 'cheerio' );


module.exports = function ( secondArgument ) {
  //console.log( "Extracting ids from " + secondArgument);
  filesystem.readFile( secondArgument, {
    encoding: 'utf-8'
  }, function ( error, data ) {
    if ( data ) {
      //console.log(data.toString());
      $ = cheerio.load( data.toString() );
      var ids = new Array();
      $( '[id]' )
        .each( function () { //Get elements that have an id=
          ids.push( $( this )
            .attr( 'id' ) ); //add id to array
        } );

      var fileText = '';
      fileText += 'exports.command = function () {\n';
      fileText += '  this';
      ids.forEach( function ( id ) {
        fileText += '\n    .verify.elementPresent("#' + id + '")';
      } );
      fileText += ';';
      fileText += '  return this;\n';
      fileText += '};';

      console.log( fileText );
    }
    if ( error ) {
      console.error( error );
    }
  } );
};
