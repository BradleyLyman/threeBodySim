var
  express = require( 'express' ),
  path    = require('path'),

  app     = express(),
  port    = process.argv[2] || 8080;

app.use( '/', function( req, res, next ) {
  console.log( 'request on: ' + req.url );
  next( null, req, res );
});

app.use( '/', express.static( path.join( __dirname, 'bower_components/foundation' ) ) );

app.use( '/js', express.static( path.join( __dirname, 'js' ) ) );

app.get( '/', function( req, res ) {
  res.sendFile( path.join( __dirname, 'threeBodySim.html' ) );
});

app.listen( port, function() {
  console.log( 'listening on port ' + port );
});
