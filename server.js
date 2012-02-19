var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , xml2js = require('xml2js')
  , parser = new xml2js.Parser()
  , fs = require('fs')

// creating the server ( localhost:8000 )
app.listen(8000);

// on server started we can load our client.html page
function handler ( req, res ) {
  fs.readFile( __dirname + '/client.html' ,
  function ( err, data ) {
    if ( err ) {
      console.log( err );
      res.writeHead(500);
      return res.end( 'Error loading client.html' );
    }
    res.writeHead( 200 );
    res.end( data );
  });
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on( 'connection', function ( socket ) {
  // watching the xml file 
  fs.watchFile( 'example.xml', function ( curr, prev ) {
    // on file change we can read the new xml
    fs.readFile( 'example.xml', function ( err, data ) {
      if ( err ) throw err;
      // parsing the new xml data an converting them into json file
      parser.parseString( data ); 
    });
  });
  // when the parser end the parsing we are ready to send the new datas on the frontend
  parser.addListener('end', function( result ) {
    socket.volatile.emit( 'notification' , result );
  });
});

